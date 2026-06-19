---
title: "Del BLUEPRINT.md al PR mergeado: trazabilidad completa en desarrollo agentico"
description: "El enfoque prompt-and-pray de los asistentes de código actuales pierde el hilo entre lo que pediste, lo que se implementó y lo que se verificó. El patrón lossless blueprint de Orquestador-AnyStack demuestra que la trazabilidad completa es posible."
fecha: 2026-06-19
tags: ["agentes", "arquitectura", "trazabilidad", "blueprint", "verificación", "claude-code"]
autor: "Alejandro de la Fuente"
---

Hay una diferencia fundamental entre "el agente dijo que funciona" y "tengo evidencia verificable de que funciona". La primera es la experiencia típica con asistentes de código. La segunda es ingeniería de software.

El problema no es que los agentes mientan. Es que el ciclo actual de desarrollo con IA rompe la trazabilidad en tres puntos críticos:

1. **De requisito a implementación**: el prompt original se diluye tras varias iteraciones de "arréglame esto" y "añade aquello"
2. **De implementación a verificación**: el agente escribe tests que pasan, pero ¿cubren lo que pediste originalmente?
3. **De verificación a despliegue**: no hay un contrato explícito que conecte "lo verificado" con "lo mergeado"

[Orquestador-AnyStack](https://github.com/slopezrap/Orquestador-AnyStack-Public) propone una solución a los tres con un concepto que llaman **lossless blueprint**. Vamos a despiezarlo.

---

## El problema: prompt-and-pray

Imagina esta secuencia típica con cualquier asistente de código actual:

```text
Tú: "Crea un sistema de login con JWT, roles admin/user,
     verificación de email y rate limiting"

Agente: [escribe 15 archivos] "Listo, he creado el sistema de login.
       Aquí tienes los endpoints, middleware, modelo de usuario
       y migraciones."

Tú: "Vale, pero faltan los tests de integración"

Agente: [escribe tests] "Añadidos. Todos pasan."

Tú: "Y el rate limiting que pedí al principio?"

Agente: "Cierto, lo olvidé. Lo añado ahora."
       [reescribe parte del middleware]
```

Para la tercera iteración, **nadie recuerda exactamente qué pediste en el prompt original**. Ni tú, porque has ido parcheando sobre la marcha. Ni el agente, porque su contexto se compactó después de la primera respuesta. Y desde luego no hay un artefacto que conecte el requisito #4 del prompt original ("rate limiting") con el archivo `middleware/rate_limiter.py` y con los tests que lo verifican.

Esto no es un problema de modelo. Es un problema de **ausencia de contrato**.

---

## La solución: blueprint como fuente de verdad inmutable

El patrón blueprint-first invierte el flujo: en lugar de empezar con prompts conversacionales, empiezas con **un solo documento estructurado** que describe el proyecto completo:

```yaml
# Dentro de inputs/BLUEPRINT.md
kind: logic.application
id: UC-001
name: Autenticación de usuario
description: >
  El sistema debe autenticar usuarios mediante JWT con refresh tokens.
  Los roles disponibles son admin y user. El endpoint de login acepta
  email + password, valida contra bcrypt, y devuelve access_token
  (15 min) + refresh_token (7 días). El rate limiting debe aplicarse
  por IP con ventana de 5 minutos y máximo 10 intentos fallidos...
```

Este bloque YAML dentro del Markdown es la **fuente de verdad**. No es un comentario. No es una nota al margen. Es un contrato que:
- El compilador extrae y convierte en JSON estructurado
- Se propaga a cada task pack para que los agentes sepan exactamente qué implementar
- Se preserva con referencias bidireccionales para que puedas trazar cualquier línea de código hasta el requisito original

Y lo crucial: **el blueprint no se edita durante la ejecución**. Si el alcance cambia, editas el blueprint, recompilas y rebootstrapas. Pero nunca editas el blueprint "sobre la marcha" mientras una slice está activa.

---

## Cómo funciona la trazabilidad en la práctica

El compilador de Orquestador-AnyStack no solo extrae los bloques YAML. También genera un conjunto de artefactos de trazabilidad:

```
orchestrator-state/compiled/
├── BLUEPRINT.snapshot.md       ← copia exacta del blueprint original
├── blueprint-sections.json     ← secciones detectadas con posición
├── blueprint-blocks.json       ← bloques YAML con metadatos
├── blueprint-lossless.json     ← referencias bidireccionales
└── blueprint-manifest.json     ← integridad y checksums
```

Cuando el bootstrap genera un task pack para la tarea `SLICE-F1-001`, incluye:

```json
{
  "id": "SLICE-F1-001",
  "title": "API de autenticación",
  "source_sections": ["logic.application", "logic.permission", "auxiliary.data"],
  "blueprint_lossless_refs": {
    "UC-001": {
      "section": "logic.application",
      "block_id": "UC-001",
      "snapshot_line": 142,
      "resolved_specs": { ... }
    }
  }
}
```

El agente que ejecuta esa slice recibe en su `SubagentStart`:
- El `TASK_ID`
- Las `source_sections` del blueprint que aplican
- Las `blueprint_lossless_refs` que apuntan exactamente a qué partes del blueprint original debe implementar

Si el agente "olvida" el rate limiting, las referencias están ahí. Si el tester necesita saber qué verificar, las `resolved_specs` están en el task pack. Si un auditor quiere saber por qué existe `rate_limiter.py`, puede seguir la cadena:

```text
rate_limiter.py → task pack SLICE-F1-001
  → blueprint_lossless_refs.UC-001
  → blueprint-sections.logic.application
  → BLUEPRINT.snapshot.md línea 142
```

---

## Verificación con contrato

La trazabilidad no termina en la implementación. Cada task pack incluye un campo `verification_surface` que determina **cómo** se verifica esa slice:

| verification_surface | Qué implica |
|---|---|
| `ui` | Browser MCP real (Chrome DevTools, etc.) con screenshots |
| `mobile` | Dart/Flutter MCP con reproducción |
| `backend` | Tests de API/DB/worker con datos reales o proporcionados |
| `core` | Tests unitarios + verificación de contratos |

Y cada tarea tiene `journey_refs` que conectan con journeys de usuario definidos en el blueprint. Pero —detalle importante— `journey_refs` **no implica UI**. Si una tarea es de backend, la verificación es de backend aunque el journey sea de usuario.

El verificador (`slice-verifier`) emite evidencia real: logs de tests, capturas de browser, respuestas de API. Y solo cuando toda la evidencia está recogida, el trailer incluye:

```yaml
CLAUDE_TRAILER:
  AGENT: slice-verifier
  TASK_ID: SLICE-F1-001
  OUTCOME: all_evidence_collected
  NEXT_STATUS: verified_pending_close
  EVIDENCE: orchestrator-state/tasks/evidence/SLICE-F1-001/
```

Esa carpeta de evidencia es inmutable. No es "el agente dijo que pasó". Son archivos.

---

## El cierre: de verificado a mergeado con contrato

La última milla de la trazabilidad es el cierre. En Orquestador-AnyStack, `closer` es el único rol que puede marcar `done`. Y no puede hacerlo a la ligera. Su trailer debe incluir **13 campos obligatorios**:

```yaml
CLAUDE_TRAILER:
  AGENT: closer
  REPORT_READY: yes
  BASELINE_SYNC_READY: yes
  GIT_READY: yes
  PUSH_READY: yes
  GIT_WORKFLOW_READY: yes
  RUNTIME_CLEANED: yes
  WORKTREES_CLEANED: yes
  PR_READY: yes
  MERGED: yes
  CANONICAL_MAIN_SYNCED: yes
  NEXT_STATUS: done
```

Cada campo es un gate. Si la PR no está mergeada, `closer` no puede cerrar. Si los worktrees no se han limpiado, no puede cerrar. Si el runtime de Docker sigue corriendo, no puede cerrar.

Esto cierra el círculo de trazabilidad:

```text
BLUEPRINT.md → compiled input → registry → DAG → task pack
  → implementación → handoff → evidencia → verificación
  → PR mergeada → limpieza → done
```

En cualquier punto del ciclo, puedes responder a "¿por qué existe este archivo?" y "¿quién verificó que funciona?" sin depender de la memoria del chat.

---

## ¿Merece la pena la ceremonia?

La objeción obvia: "Esto es mucha ceremonia para un proyecto pequeño". Y es cierto. Si tu proyecto son 3 endpoints y un frontend sencillo, un blueprint de 1.500 líneas con bloques YAML estructurados es excesivo.

Pero la pregunta relevante es otra: **¿a qué escala tu proyecto actual rompe el enfoque prompt-and-pray?**

Mi experiencia es que el punto de ruptura llega antes de lo que crees. En cuanto tienes:
- 5+ tareas con dependencias entre sí
- Verificaciones que no son solo tests unitarios
- Varias personas (o agentes) trabajando en paralelo
- Necesidad de saber qué se implementó, quién lo verificó y por qué

...la trazabilidad deja de ser ceremonia y se convierte en requisito.

---

## Lo que esto significa para el futuro del desarrollo con IA

El patrón lossless blueprint apunta a una dirección clara: **el desarrollo agentico profesional necesita contratos, no conversaciones**.

Los asistentes de código actuales son excelentes para tareas aisladas —"refactoriza esta función", "añade tests para este módulo"— porque el contexto es local. Pero cuando escalas a proyectos completos, el contexto se diluye.

La solución no es un modelo más grande con una ventana de contexto más grande. Es un **sistema de contratos** que preserve la trazabilidad independientemente de lo que el modelo recuerde o deje de recordar.

Orquestador-AnyStack no es la única forma de implementar esto. Pero es la demostración más completa que he visto de cómo hacerlo con las herramientas que existen hoy: Claude Code, subagentes, hooks y un compilador de YAML a DAG.

El patrón es lo que importa. La herramienta cambiará.
