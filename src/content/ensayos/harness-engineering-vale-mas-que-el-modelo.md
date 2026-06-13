---
title: "El harness vale más que el modelo: lo que dos papers de 2026 demuestran"
description: "El harness vale más que el modelo: lo que dos papers de 2026 demuestran Mismo modelo. Mismo benchmark. 6× de diferencia en rendimiento. Esa es la cifra que abre este artículo y que lo justifica. Stanf"
fecha: 2026-05-09
tags: ["ia", "agentes", "harness", "investigacion", "arquitectura"]
autor: "Alejandro de la Fuente"
---

# El harness vale más que el modelo: lo que dos papers de 2026 demuestran

Mismo modelo. Mismo benchmark. **6× de diferencia en rendimiento.**

Esa es la cifra que abre este artículo y que lo justifica. Stanford la documentó en TerminalBench. LangChain la reprodujo en su coding agent, pasando del puesto 30+ al 5 sin cambiar el LLM. La pregunta es obvia: si el modelo es el mismo, ¿de dónde viene la diferencia?

De lo que envuelve al modelo. De su harness.


Dos papers de marzo de 2026 — uno de Tsinghua, otro de Stanford — lo demuestran con experimentos controlados por primera vez. Lo que antes era intuición de equipo ahora tiene ablación, métricas y reproducibilidad. Este artículo desempaqueta qué encontraron y qué implica para quien diseña sistemas con agentes hoy.

---

## Qué es el harness

LangChain lo define en una ecuación: **Agent = Model + Harness**.

Si no eres el modelo, eres el harness. Es todo lo que no son pesos del modelo: los prompts, las tools, la lógica de orquestación, la gestión de memoria, los mecanismos de verificación, las políticas de safety. Es la diferencia entre una CPU sin sistema operativo y una máquina que hace trabajo útil.

La metáfora más honesta: el LLM en crudo es un caballo desbocado. Potente, pero sin dirección. El harness — contexto, tools, memoria, validación — es el arnés que lo convierte en trabajo productivo. Cuatro piezas que toda arquitectura de agente tiene que resolver, explícita o implícitamente.

Anthropic ha identificado cinco patrones canónicos en los que se combinan estas piezas: prompt chaining, routing, parallelización, orchestrator-workers, evaluator-optimizer. Todo agente en producción es una combinación de varios. Las decisiones sobre cuál usar, cuándo y cómo son exactamente las que generan ese gap de 6×.

---

## El problema previo: sin representación explícita no hay ciencia

Antes de 2026, el harness se construía de forma caótica. Dos sistemas que "diferían en una decisión arquitectónica" en realidad diferían simultáneamente en prompts, tools, gates de verificación y semántica de estado. Sin una forma de separar variables no había ablación posible, y sin ablación no hay ciencia — solo intuición de equipo que no se transfiere.

Anthropic documentó dos modos de fallo que se repetían en todos los sistemas sin harness explícito:

- **One-Shotting**: el agente intenta resolver todo de una vez y agota el contexto antes de terminar.
- **Premature Completion**: una sesión posterior ve progreso parcial y declara victoria sin terminar el trabajo real.

La solución que fue emergiendo en la industria — arquitectura GAN de tres agentes (Planner → Generator → Evaluator) — funcionaba, pero a un coste 20× mayor y sin ser portable ni ablarable. OpenAI lo usó para producir 1 millón de líneas de código con 1.500 PRs, cero escritas a mano. El veredicto del campo fue claro: *productivo pero ad hoc*. Hacía falta hacer el harness explícito y ejecutable.

---

## Paper 1 — NLAH (Tsinghua): la representación que permite ciencia

### Una arquitectura en tres capas

Natural-Language Agent Harnesses (Pan et al., Tsinghua, marzo 2026) propone separar la lógica del agente en tres capas con responsabilidades distintas:

| Capa | Tipo | Qué contiene |
|---|---|---|
| **NLAH** | Intercambiable por tarea | Contracts, Roles, Stages, taxonomía de fallos |
| **Runtime Charter** | Universal y fijo | Cómo se vinculan contratos, cómo persiste el estado, cómo se gestionan agentes hijo |
| **Backend** | Infraestructura | Terminal tools, interfaz multi-agente, primitivas de spawn y wait |

Esta separación da al campo algo que nunca había tenido: **experimentos controlados**. Intercambias el NLAH manteniendo el Charter fijo y estás testeando el diseño del harness. Fijas el NLAH y cambias el Charter y estás testeando la política del runtime. Ablación limpia por primera vez.

### Los dos mecanismos que lo hacen funcionar

El paper descansa sobre dos primitivas:

**Execution Contracts** — function signatures para agentes: `required_outputs`, `budgets`, `permissions`, `completion_conditions`, `output_paths`. Convierten completions difusas ("haz esto") en llamadas acotadas con criterios de éxito verificables.

**File-Backed State** — la memoria del agente es un fichero con una dirección en disco. Sobrevive a truncación del context window, a reinicios y a delegación entre agentes. No depende de que nadie recuerde nada.

### El hallazgo que cambia el cálculo

Los investigadores migraron un sistema existente (OS-Symphony, harness expresado en código) a representación NLAH — mismo algoritmo, mismo modelo, distinta forma de expresarlo:

| Métrica | OS-Symphony | NLAH | Cambio |
|---|---|---|---|
| Accuracy | 30.4% | **47.2%** | +55% |
| Tiempo de runtime | 361 min | **141 min** | −61% |
| Llamadas al LLM | 1.200 | **34** | −97% |

**+16.8 puntos de accuracy solo cambiando la representación.** Sin tocar la lógica. Sin cambiar el modelo. Solo cambiar cómo se escribe el harness.

### La ablation surprise

El hallazgo más contraintuitivo del paper viene de los experimentos de ablación con GPT-5.4 al máximo razonamiento en SWE-Bench Verified.

Con 6 módulos activos: ~75% de tareas resueltas, 16.3M tokens, 642 llamadas, 32 minutos.  
Con solo LLM + tools básicas: ~75% de tareas resueltas, 1.2M tokens, 51 llamadas, 7 minutos.

Mismo resultado. **14× el cómputo.**

El módulo a módulo revela el patrón:
- Verificadores automáticos: −8.4 puntos ❌
- Búsqueda multi-candidato: −5.6 puntos ❌
- Self-evolution (retry con criterio de aceptación): **+4.8 puntos** ✅

> **Disciplined narrowing beats expensive broadening every time.**

La intuición de añadir más verificaciones y más candidatos es natural para un ingeniero. El paper dice que es cara y contraproducente. El único módulo que consistentemente añade valor es el que estrecha el loop del propio agente con un criterio de aceptación explícito.

---

## Paper 2 — Meta-Harness (Stanford): el harness es optimizable

### Lo que DSPy no puede hacer

Omar Khattab (también autor de DSPy) publicó Meta-Harness en Stanford en el mismo mes. La distinción es importante: DSPy tunea prompts dentro de un pipeline fijo. Meta-Harness **reescribe el pipeline entero** — estructura, retrieval, memoria, topología. No ajusta parámetros, cambia la arquitectura.

### El loop de optimización automática

Un **Agentic Proposer** (Claude Opus) lee traces de ejecuciones fallidas, diagnostica qué rompió y escribe un harness nuevo completo. Un **Evaluator** lo testea contra el benchmark. Los traces y scores se acumulan en un filesystem creciente. Se repite.

La escala: 10M tokens por iteración de optimización, 400× más señal de feedback que cualquier método anterior. Y hay un detalle crítico que el paper documenta: **resumir los traces destruye la diagnosticabilidad**. Eliminar traces baja el rendimiento del 50% al 34.6%. Sustituirlos por resúmenes: 34.9%. La señal vive en los detalles en bruto, no en las abstracciones sobre ellos.

### Los resultados que reordenan el leaderboard

| Modelo | Sistema | Tipo | Score en TerminalBench |
|---|---|---|---|
| Opus 4.6 | Meta-Harness | Auto-optimizado | **76.4%** |
| **Haiku 4.5** | **Meta-Harness** | **Auto-optimizado** | **37.6% — puesto #1*** |
| Haiku 4.5 | Goose | Hand-engineered | 35.5% |

*\*Un modelo más pequeño en el primer puesto, por encima de sistemas construidos a mano con modelos más grandes.*

### El hallazgo sobre transferibilidad

El dato más relevante para quien diseña productos: **un harness optimizado sobre un modelo se transfirió a otros 5 modelos y mejoró todos ellos**. Sin reoptimización.

Esto invierte la lógica habitual. El asset reutilizable no es el modelo — es el harness. Cambiar de proveedor o subir de versión deja de ser el evento disruptivo que era. Si el harness está bien diseñado, se beneficia automáticamente de cualquier mejora de modelo.

---

## Las tres eras

El campo ha pasado por tres momentos con límites bastante claros:

```
Harness Engineering (2026)
  └── Context Engineering (2024)
        └── Prompt Engineering (2022)
```

Cada era absorbe la anterior. El harness engineering incluye saber escribir buenos prompts y gestionar el contexto, pero añade orquestación, memoria, verificación y safety como problemas de primer orden que merecen diseño explícito.

### El oficio de sustracción

Hay una paradoja en cómo madura este campo: los sistemas mejoran quitando cosas, no añadiéndolas.

> *"Cada componente del harness codifica una asunción sobre lo que el modelo no puede hacer solo, y esas asunciones caducan."* — Anthropic

Tres casos documentados:
- Anthropic eliminó context resets cuando Claude dejó de necesitarlos.
- Manus reescribió su harness 5 veces en 6 meses.
- Vercel quitó el 80% de las tools de un agente → resultados mejores.

El espacio del harness no se encoge cuando los modelos mejoran. **Se mueve.** El trabajo maduro es tanto sustracción como adición, y saber cuándo quitar es más difícil que saber cuándo añadir.

---

## El arnés mínimo accionable

La parte que falta en la mayoría de charlas sobre este tema: ¿qué escribes el lunes?

Una estructura mínima de harness que cubre las bases:

```
proyecto/
├── AGENTS.md          ← quién eres, qué puedes hacer, cómo colaboras
├── CLAUDE.md          ← wrapper de proyecto con contexto específico
├── init.sh            ← setup del entorno que el agente puede ejecutar
├── featurelist.json   ← estado de tareas externalizado, fuera del context window
└── progress/
    ├── leader.md      ← el orchestrator escribe aquí su plan
    ├── implementer.md ← el worker escribe su handoff estructurado
    └── reviewer.md    ← el evaluador escribe sus findings
```

La separación de roles en ficheros físicos no es burocracia — es la implementación más simple de estado externalizado y separación de contextos que los papers identifican como los dos mecanismos que marcan la diferencia.

---

## Cinco conclusiones

**1. El paradigma ha cambiado.** La pregunta operativa ya no es *"¿qué modelo elijo?"* sino *"¿qué estructura quito?"*. Esto invierte el reflejo natural del ingeniero.

**2. El harness es el activo de primer nivel.** Si transfiere entre modelos, vale más que cualquier modelo individual. Invertir en harness rinde más que esperar al próximo modelo.

**3. La representación es una decisión arquitectónica.** El +16.8 puntos solo por cambiar de código a lenguaje natural estructurado es el dato más incómodo del paper. La elección entre código nativo, YAML, DSL o prose-as-code no es preferencia de equipo — es un parámetro de rendimiento.

**4. La verificación naive es una trampa cara.** Añadir verificadores y búsqueda multi-candidato empeora el rendimiento mientras dispara el coste. Solo añade valor estrechar el loop del agente con criterios de aceptación explícitos.

**5. La disciplina es de sustracción.** El harness no es un edificio que se construye — es una asunción que se mantiene viva podándola. Cada componente que ya no hace falta es deuda técnica que resta rendimiento.

---

## Recursos

- Presentación completa: [Harness Engineering — Código Sin Siesta](https://codigosinsiesta.github.io/harness-engineering-presentation/)
- Pan et al. — Natural-Language Agent Harnesses — Tsinghua, marzo 2026
- Khattab et al. — Meta-Harness — Stanford, marzo 2026
