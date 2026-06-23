---
title: "¿Qué hace falta para orquestar agentes de código en producción?"
description: "Un state machine, locks que funcionen entre procesos, verificación con evidencia real y trazabilidad de extremo a extremo. Analizando Orquestador-AnyStack como lista de requisitos, no como herramienta."
fecha: 2026-06-19
tags: ["agentes", "arquitectura", "orquestación", "producción", "state-machine", "verificación"]
autor: "Alejandro de la Fuente"
---

En 2026 tenemos docenas de herramientas que prometen "agentes autónomos de código". Pero cuando intentas usarlas para algo más serio que un proyecto de fin de semana, descubres que todas fallan en los mismos sitios.

El problema no es que los agentes escriban mal código. Es que **nadie ha definido qué significa "orquestar agentes en producción"**. No hay un checklist. No hay un RFC. Cada equipo improvisa.

[Orquestador-AnyStack](https://github.com/slopezrap/Orquestador-AnyStack-Public) no es la respuesta definitiva, pero es el intento más sistemático que he visto de enumerar los requisitos reales. Así que vamos a usarlo como lista de verificación: ¿qué necesita un sistema de orquestación de agentes de código para funcionar en un entorno que no es un demo?

---

## Requisito 1: State machine explícita

El requisito más obvio y el más ignorado.

La mayoría de los "agentes autónomos" tratan el estado como un detalle de implementación: "el agente está trabajando", "el agente terminó". Como mucho añaden "el agente falló". Pero en un proyecto real necesitas distinguir entre:

```text
todo → ready (dependencias resueltas) → claimed (reservado por un worker)
  → in_progress → validator_tester_pending → ready_for_close
  → verified_pending_close → done
```

Y también necesitas `needs_debug` (el tester encontró fallos), `blocked` (dependencia externa no disponible), `superseded` (otra tarea lo cubrió) y `waived` (decisión humana de no hacerlo).

**Sin state machine explícita, el estado lo decide el último que habló con el agente.** Y cuando tienes 15 tareas en paralelo con 4 agentes cada una, el último que habló puede ser cualquiera.

Orquestador-AnyStack define 11 estados y 26 transiciones legales en un archivo YAML que es la autoridad única de lifecycle. Los hooks validan cada transición contra ese archivo. Si un `tester` intenta marcar `done`, el hook lo rechaza —solo `closer` puede cerrar. Si un `planner` intenta mutar el estado, el hook lo ignora —es un rol informativo.

Esto no es burocracia. Es **separación de responsabilidades a nivel de máquina de estados**.

---

## Requisito 2: Locks que funcionan entre procesos

Los sistemas de agentes suelen ejecutarse en un solo proceso, así que usan un mutex en memoria y ya está. Pero en producción necesitas ejecutar slices en paralelo —quizás en terminales distintos, quizás en worktrees de Git distintos, quizás en máquinas distintas.

Orquestador-AnyStack usa `fcntl.flock` (POSIX advisory locks) sobre archivos. ¿Por qué esto es importante?

- **Funciona entre procesos**: tres terminales corriendo `claude` pueden coordinarse sin un coordinador central
- **Funciona entre worktrees de Git**: cada slice corre en su propio checkout, pero los locks están en el filesystem compartido
- **No requiere un servicio externo**: no necesitas Redis, etcd o ZooKeeper para coordinar 3 workers en tu máquina local

El DAG define `write_set` y `conflict_groups` para cada tarea. `/next-wave` calcula qué tareas pueden ejecutarse en paralelo sin compartir archivos. Y `claim_task` rechequea bajo lock que los conflictos sigan resueltos antes de reservar una tarea.

```text
SLICE-F1 (api/) + SLICE-F2 (admin/) → OK, no comparten write_set
SLICE-F1 (api/) + SLICE-F3 (api/)    → serializado, comparten api/
```

---

## Requisito 3: Verificación con evidencia real

"El agente dijo que funciona" no es verificación. Pero sorprendentemente, muchos sistemas de agentes tratan la afirmación del agente como evidencia suficiente.

Orquestador-AnyStack distingue entre **tipos de verificación** según la superficie:

| verification_surface | Evidencia requerida |
|---|---|
| `ui` | Capturas de browser MCP real + logs de interacción |
| `backend` | Resultados de tests de API/DB con datos reales |
| `core` | Tests unitarios + verificación de contratos |
| `dependency` | Verificación de integración con servicio externo |

La evidencia se almacena en `orchestrator-state/tasks/evidence/<TASK_ID>/` y es inmutable. No es un resumen. No es "todo verde". Son archivos: logs de pytest, screenshots de browser, respuestas de API.

Y lo crucial: `journey_refs` (referencias a journeys de usuario) **no implican UI**. Si una tarea tiene `journey_refs: [J-001]` pero `verification_surface: backend`, la verificación es de backend. El sistema no te obliga a abrir un navegador para verificar una tarea de API solo porque el journey es de usuario.

---

## Requisito 4: Trazabilidad de extremo a extremo

Cuando encuentras un bug en producción seis meses después, necesitas responder:

- ¿Qué requisito cubría este código?
- ¿Quién lo implementó?
- ¿Quién lo verificó?
- ¿Qué evidencia hay de que pasó la verificación?
- ¿En qué PR se mergeó?

En un sistema prompt-and-pray, la respuesta a todas estas preguntas es "el chat, si es que no se ha compactado".

Orquestador-AnyStack mantiene la cadena completa:

```text
BLUEPRINT.md línea 142 (requisito UC-001: rate limiting)
  → compiled/blueprint-lossless.json
  → task-pack SLICE-F1-001 (source_sections + blueprint_lossless_refs)
  → handoff/SLICE-F1-001.md (qué hizo el developer)
  → evidence/SLICE-F1-001/ (resultados de tests del tester)
  → PR #42 (mergeado por closer con trailer de 13 campos)
```

Cada eslabón es un artefacto persistente en el sistema de archivos, no en la memoria del chat.

---

## Requisito 5: Gestión de alcance y follow-ups

En un proyecto real, descubres cosas durante la implementación. Un endpoint que no estaba en el blueprint. Un edge case que requiere una dependencia nueva. Un riesgo que se materializa.

El instinto es "lo arreglo ahora". Pero si cada agente modifica el alcance sobre la marcha, el blueprint deja de ser la fuente de verdad.

Orquestador-AnyStack tiene un **protocolo de follow-up** con reglas explícitas:

**Se arregla en la slice activa si:**
- Cabe en el `write_set` actual
- Toca pocos archivos
- No requiere nuevos IDs, dependencias externas, datos reales ausentes o decisión humana

**Se abre un follow-up si:**
- Requiere cambios en el blueprint (`out_of_scope`, `scope_expansion`)
- Necesita dependencia externa no prevista
- Falta datos reales (`missing_real_data`)
- Requiere decisión humana (`blocked_by_human_decision`)

Y los follow-ups `blocker`, `critical` o `high` en estado `proposed` **bloquean nuevas waves** hasta que se promocionan o se waivean. No puedes ignorar un problema crítico y seguir abriendo slices.

---

## Requisito 6: Cierre con contrato

"Done" no es una opinión. Es un estado que solo puede alcanzarse cuando se cumplen condiciones verificables.

En Orquestador-AnyStack, `closer` debe emitir un trailer con 13 campos:

```yaml
REPORT_READY: yes
BASELINE_SYNC_READY: yes
GIT_READY: yes
PUSH_READY: yes
GIT_WORKFLOW_READY: yes
RUNTIME_CLEANED: yes
DOCKER_RUNTIME_CLEANED: yes
RANCHER_RUNTIME_CLEANED: yes
DEV_PORTS_RELEASED: yes
WORKTREES_CLEANED: yes
PR_READY: yes
MERGED: yes
CANONICAL_MAIN_SYNCED: yes
```

Cada campo es un gate. No puedes marcar `done` si la PR no está mergeada. No puedes marcar `done` si el runtime de Docker sigue corriendo. No puedes marcar `done` si los worktrees no se han limpiado.

Esto parece excesivo hasta que has depurado un entorno donde tres slices cerraron "done" pero dejaron contenedores huérfanos, worktrees zombis y PRs sin mergear.

---

## Requisito 7: Aislamiento de entorno por slice

En desarrollo tradicional, cada rama tiene su propio entorno: `docker compose up` con un proyecto aislado. En desarrollo agentico, cada slice debería tener lo mismo.

Orquestador-AnyStack:
- Crea un worktree de Git por slice
- Asigna puertos únicos (`allocate_slice_ports.py`)
- Genera un `COMPOSE_PROJECT_NAME` por `TASK_ID`
- Aísla el runtime de Docker/Rancher por slice
- Limpia todo al cerrar (`cleanup-slice-runtime.sh`)

Esto evita el clásico "el puerto 3000 ya está en uso" cuando dos agentes intentan levantar el frontend simultáneamente.

---

## ¿Qué falta?

Orquestador-AnyStack cubre mucho, pero no todo. Ausencias notables:

- **Sin soporte multi-máquina**: los locks POSIX funcionan en una máquina, no en un clúster. Para equipos distribuidos necesitarías algo como Redis o etcd.
- **Sin reintentos automáticos**: si una slice falla por un error transitorio (red, timeout de API externa), no hay mecanismo de retry integrado.
- **Sin observabilidad**: no hay métricas, dashboards ni alertas. Solo logs en archivos.
- **Acoplado a Claude Code**: si Anthropic cambia la API de subagentes o hooks, el runtime se rompe.
- **Sin licencia**: el proyecto no tiene licencia declarada. Legalmente no se puede usar.

Pero como **lista de requisitos**, es el catálogo más completo que he visto de lo que un sistema de orquestación de agentes debería hacer. No importa si usas Claude Code, Codex, OpenCode o tu propio runtime. Los requisitos son los mismos.

---

## El checklist

Si estás diseñando o evaluando un sistema de orquestación de agentes de código, aquí tienes la lista de verificación extraída de este análisis:

- [ ] State machine explícita con transiciones legales por rol
- [ ] Locks que funcionan entre procesos (no en memoria)
- [ ] Verificación con evidencia real, no afirmaciones del agente
- [ ] Trazabilidad completa: requisito → implementación → verificación → PR
- [ ] Gestión de alcance con follow-ups y gates de bloqueo
- [ ] Cierre con contrato verificable (no "el agente dijo done")
- [ ] Aislamiento de entorno por slice (worktrees, puertos, Docker)
- [ ] Separación de roles mutadores e informativos
- [ ] Memoria estructurada fuera del contexto del chat
- [ ] Limpieza automática de recursos al cerrar

No necesitas implementar todo esto desde el día uno. Pero si tu sistema no cubre al menos los primeros cinco, no está listo para nada que se parezca a producción.

---

El panorama de herramientas de agentes en 2026 está lleno de demos impresionantes. Pero la diferencia entre una demo y un sistema de producción no está en lo que hace cuando funciona —está en lo que **no permite que pase** cuando algo falla.

Eso es lo que esta lista de requisitos intenta capturar.
