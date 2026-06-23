---
title: "Orquestación DAG con Claude Code: el patrón blueprint-first"
description: "Ejecutar tareas de desarrollo con IA no es lanzar prompts sueltos. Es diseñar un DAG explícito, con state machine, locks y verificaciones reales. Orquestador-AnyStack demuestra cómo hacerlo con Claude Code."
fecha: 2026-06-19
tags: ["agentes", "arquitectura", "orquestación", "claude-code", "dag", "herramientas"]
autor: "Alejandro de la Fuente"
---

Ejecutar una tarea con un asistente de código es fácil. Ejecutar **veinte tareas interdependientes, con paralelismo, sin corromper estado, con verificación real y trazabilidad completa** es otro juego.

Ese es el problema que resuelve [Orquestador-AnyStack](https://github.com/slopezrap/Orquestador-AnyStack-Public), un proyecto que acaba de aparecer en GitHub y que merece atención no por sus estrellas —tiene una— sino por la arquitectura que propone.

No es una herramienta de negocio. Es un **contrato reusable**: una plantilla de runtime que cualquier aplicación fullstack puede adoptar para orquestar su desarrollo con Claude Code como motor. Y lo hace con un nivel de rigor que la mayoría de los "agentes autónomos" simplemente no tienen.

---

## El problema: del prompt único al DAG de producción

La experiencia típica con coding agents es lineal:

```text
Tú → prompt → agente escribe código → tú revisas → siguiente prompt
```

Esto funciona para tareas aisladas. Pero un proyecto real tiene dependencias: no puedes implementar la API sin antes tener el modelo de datos. No puedes hacer la pantalla de login sin tener el sistema de autenticación. Y no puedes verificar la integración hasta que backend y frontend estén listos.

En un equipo humano esto se resuelve con un tablón de tareas y un jefe de proyecto. En un equipo de agentes, necesitas lo mismo pero **ejecutable por máquina**.

Orquestador-AnyStack propone un flujo que empieza donde otros terminan:

```text
inputs/BLUEPRINT.md           ← entrada humana (un solo archivo)
  → compilador                ← extrae bloques YAML, genera JSON estructurado
  → bootstrap                 ← crea registry, DAG, task-packs
  → /next-wave                ← calcula el subconjunto no conflictivo de tareas listas
  → /next-slice <TASK_ID>     ← ejecuta planner → developer → tester → verify-slice
  → /closer <TASK_ID>         ← cierra con PR mergeada y limpieza
```

El operador escribe **un solo archivo Markdown** describiendo el proyecto completo —stack, arquitectura, lógica de negocio, datos, permisos, riesgos, verificaciones— en bloques YAML estructurados. A partir de ahí, todo es automático.

---

## La máquina de estados: el chat no decide, los trailers sí

Este es el detalle más importante del diseño y lo que lo separa de cualquier "agente que escribe código".

En Orquestador-AnyStack, el ciclo de vida de cada tarea está gobernado por una **máquina de estados explícita** con 11 estados y 26 transiciones legales:

```text
todo → ready → claimed → in_progress → validator_tester_pending
  → ready_for_close → verified_pending_close → done
```

Cada transición solo puede ejecutarla un rol específico:

| Rol | Transiciones permitidas |
|---|---|
| `developer` | `→ validator_tester_pending` |
| `tester` | `→ ready_for_close` o `→ needs_debug` |
| `slice-verifier` | `→ verified_pending_close` o `→ needs_debug` |
| `closer` | `→ done` (único rol que puede cerrar) |

Y aquí está la clave: **el chat con Claude Code no decide el estado**. Los subagentes emiten un bloque `CLAUDE_TRAILER` al terminar, y un hook `SubagentStop` lo valida contra el state machine y el contrato de roles antes de mutar el registry. Si un `tester` intenta marcar `done`, el hook lo rechaza. Si un `planner` intenta mutar el estado, el hook lo ignora —porque `planner` es un rol informativo, no mutador.

Es un diseño que recuerda a los sistemas de control de vuelo: **nadie tiene autoridad total, cada componente solo puede hacer transiciones legales, y todas las mutaciones quedan registradas**.

---

## Paralelismo real con locks POSIX

El DAG no es solo decorativo. El comando `/next-wave` calcula un subconjunto de tareas listas que no comparten `write_set` ni `conflict_groups`:

```text
┌─────────────────────────────────────────────────┐
│ /next-wave                                       │
│                                                  │
│ TASK_ID    │ Título           │ Conflict groups  │
│ SLICE-F0   │ Fundación        │ —                │
│ SLICE-F1   │ API de salud     │ api/             │
│ SLICE-F2   │ Panel de admin   │ admin/           │
│                                                  │
│ ↑ Las 3 pueden ejecutarse en paralelo            │
│   porque no comparten write_set ni conflict_group │
└─────────────────────────────────────────────────┘
```

Las tareas que comparten `write_set` se serializan automáticamente. Y al reclamar una tarea (`claim_task`), el sistema rechequea bajo **lock POSIX** (`fcntl.flock`) que los conflictos activos sigan resueltos.

No es un mutex en memoria de un proceso Python. Es un lock a nivel de sistema de archivos que funciona aunque tengas tres terminales abiertos con Claude Code ejecutando slices en paralelo.

---

## Modelos asignados por rol

Cada agente tiene un modelo asignado explícitamente según su responsabilidad:

```text
fable[1m]  → developer       (implementación, alto volumen de código)
opus[1m]   → main-orchestrator (coordinación central)
opus       → planner, architect, validator, debugger, verifier
sonnet     → tester, deployer, closer, researcher
```

No se usa `model: inherit`. La asignación es estática y se verifica con un checker automático (`check-claude-adapter.sh`). Si alguien cambia un agente a `sonnet` cuando debería ser `opus`, el checker lo detecta antes de ejecutar.

Es un detalle que habla de experiencia real operando esto: **en producción no quieres sorpresas de modelo**.

---

## Lo que esto significa para el desarrollo agentico

Orquestador-AnyStack no es para todos. Si tu proyecto son tres archivos y un prompt, no lo necesitas. Pero si estás construyendo una aplicación fullstack con 15+ tareas interdependientes, verificación real, despliegue dockerizado y cierre por PR, el enfoque "prompt único" se rompe.

Este proyecto demuestra varios principios que antes solo veíamos en paper:

1. **Blueprint como fuente de verdad única.** Un solo archivo Markdown estructurado describe todo el proyecto. El compilador extrae la semántica, pero preserva la prosa humana para trazabilidad.
2. **State machine como autoridad de lifecycle.** El chat no decide estados. Los trailers validados contra una máquina de estados sí.
3. **Paralelismo controlado por conflicto.** No ejecutas "todas las tareas listas" —solo las que no comparten archivos.
4. **Verificación real, no "parece que funciona".** Cada slice tiene `verification_surface` que determina si se necesita browser MCP, tests de backend, o ambos.
5. **Cierre con contrato.** Una tarea no está "hecha" hasta que `closer` emite un trailer con PR mergeada, main sincronizado, runtime limpiado y worktrees eliminadas.

El autor claramente ha iterado esto en privado durante meses antes de publicarlo. La documentación es excepcional —317 líneas de CHEATSHEET, 15 agentes con prompts detallados, 31 skills documentadas— y el código es sorprendentemente minimalista: una sola dependencia (PyYAML) y 11.800 líneas de Python.

---

## El riesgo: dependencia de Claude Code

La parte más frágil del diseño es su acoplamiento con Claude Code. Si Anthropic cambia la API de subagentes, hooks o el protocolo `CLAUDE_TRAILER`, el runtime se rompe. No hay capa de abstracción entre el orquestador y Claude Code; los hooks se cablean directamente en `.claude/settings.json`.

Dicho esto, en 2026 Claude Code es la plataforma más madura para subagentes con memoria de proyecto, y este orquestador exprime cada característica disponible: `SubagentStart`, `SubagentStop`, `PreToolUse`, `PostToolUse`, `PreCompact`, `Stop`, `ConfigChange` y memoria YAML estructurada. Si vas a acoplarte a algo, que sea a la plataforma que mejor soporta el caso de uso.

---

## Para qué sirve y para qué no

**Sí lo uses si:**
- Tu proyecto tiene 10+ tareas con dependencias entre sí
- Necesitas trazabilidad completa desde requisito hasta PR mergeada
- Ejecutas slices en paralelo y quieres evitar corrupción de estado
- Quieres verificaciones reales (tests, browser, integración), no "el agente dijo que funciona"

**No lo uses si:**
- Tu proyecto cabe en 2-3 prompts
- No necesitas paralelismo
- Ya tienes un CI/CD que cubre verificaciones y despliegue
- No usas Claude Code como motor principal

---

El proyecto está en sus primeras horas públicas —un commit, una estrella— pero la arquitectura es de las más sólidas que he visto en el espacio de orquestación agentica. Si el autor añade una licencia open source, merece ser estudiado por cualquiera que esté diseñando sistemas con múltiples agentes de código.

No es un producto. Es un patrón. Y los buenos patrones duran más que las herramientas.
