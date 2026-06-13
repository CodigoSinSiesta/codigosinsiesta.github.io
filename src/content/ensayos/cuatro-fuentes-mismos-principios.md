---
title: "Cuatro fuentes independientes, los mismos cuatro principios"
description: "Cuatro fuentes independientes, los mismos cuatro principios Cuando cuatro grupos que no se coordinan entre sí llegan a las mismas conclusiones, algo es verdad. Anthropic. OpenAI. Factory. La academia"
fecha: 2026-05-09
tags: ["ia", "agentes", "harness", "orquestación", "arquitectura", "investigacion"]
autor: "Alejandro de la Fuente"
---

# Cuatro fuentes independientes, los mismos cuatro principios

Cuando cuatro grupos que no se coordinan entre sí llegan a las mismas conclusiones, algo es verdad.

Anthropic. OpenAI. Factory. La academia (Tsinghua y Stanford). Cuatro equipos con enfoques distintos, incentivos distintos y metodologías distintas, trabajando en paralelo durante 2025 y principios de 2026. Ninguno citando a los otros en tiempo real. Y sin embargo, al final del periodo, los cuatro habían convergido en el mismo conjunto de principios sobre cómo deben funcionar los sistemas de agentes.


Eso no es tendencia. Es física del problema.

Este artículo documenta las cuatro fuentes, los cuatro principios en los que convergieron y qué implica cada convergencia para quien diseña sistemas con agentes hoy.

---

## Las cuatro fuentes

| Fuente | Quién | Cuándo | Qué aportaron |
|---|---|---|---|
| **Anthropic** | Prithvi Rajasekaran | Marzo 2026 | Generator-Evaluator-Planner + Sprint Contracts |
| **OpenAI / Lopopolo** | Ryan Lopopolo | Abril 2026 | Repo como prompt persistente + persona-based reviewer agents |
| **Factory** | Luke Alvoeiro | Mayo 2026 | Missions: 16 días, serial+, Validation Contracts, Droid Whispering |
| **Academia** | Tsinghua + Stanford | Marzo 2026 | NLAH (+16.8 pts), Meta-Harness (6× varianza explicada por harness) |

Cuatro voces. Cuatro contribuciones distintas. Un conjunto de principios compartidos.

---

## Principio 1 — El harness importa más que el modelo

Esta es la convergencia más disruptiva porque contradice el instinto colectivo de la industria: cuando un sistema falla o rinde poco, la primera pregunta es "¿qué modelo usamos?" Cuatro fuentes independientes responden: probablemente no es el modelo.

**Tsinghua (NLAH)**: migrar un sistema existente a representación NLAH sin cambiar ni el modelo ni la lógica produjo +16.8 puntos de accuracy. El factor fue la representación del harness.

**Stanford (Meta-Harness)**: la varianza del harness explica 6× más diferencia de rendimiento que la varianza del modelo. Un harness auto-optimizado llevó a Haiku 4.5 al puesto #1 de TerminalBench, por encima de sistemas construidos a mano con Opus. Haiku batiendo a Opus no con mejor modelo — con mejor harness.

**Lopopolo (OpenAI)**: "el código es gratis". El trabajo del ingeniero se desplaza a estructurar el repo, los tests, los lints y los reviewer agents. El valor que un engineer aporta hoy está en la calidad del harness, no en el código que el agente puede generar por sí solo.

**Factory Missions**: la arquitectura que hace posible una misión de 16 días continuos no es un modelo más inteligente — es Orchestrator-Workers-Validators con handoffs estructurados y Validation Contracts. La misma arquitectura con un modelo peor o mejor produce resultados escalados por la arquitectura, no al revés.

**La implicación práctica**: si tu sistema rinde mal, antes de cambiar el modelo examina el harness. Si el harness no tiene separación de contextos, estado externalizado y verificación adversarial, probablemente sea el bottleneck.

---

## Principio 2 — Generación y verificación deben estar separadas

Esta es la convergencia más fácil de entender y la más difícil de implementar porque contradice la optimización local obvia: ¿por qué usar dos agentes cuando uno puede hacer las dos cosas?

Porque el agente que implementó tiene confirmation bias. Quiere que funcione. Lee lo que espera leer.

Las cuatro fuentes llegaron a la misma arquitectura desde ángulos distintos:

**Anthropic**: Generator (implementa) ≠ Evaluator (verifica). Sprint Contracts definen el criterio de éxito antes de que empiece la implementación, para que el Evaluator tenga una referencia independiente.

**Factory**: Worker (implementa) ≠ Validator (verifica). La condición explícita: el Validator nunca ha visto el código que va a verificar. Dos tipos de validadores — Scrutiny (code review automatizado) y User Testing (QA funcional end-to-end).

**Lopopolo (OpenAI)**: persona-based reviewer agents. Cada rol del equipo de ingeniería tiene su propio agente revisor con un contexto independiente. El agente "senior engineer" revisa diferente al agente "security specialist". Sin apego al código del implementador.

**Academia**: el patrón adversarial validado empíricamente en 70 proyectos open source. La separación de contextos entre generación y evaluación es estadísticamente significativa en todos los benchmarks.

**La implicación práctica**: el evaluador no puede ser el implementador. No es una preferencia de arquitectura — es la única forma de evitar el self-evaluation trap. Si tu sistema no tiene esta separación, no tiene QA real, tiene QA que confirma decisiones.

---

## Principio 3 — La lógica vive en prompts, no en state machines

Este es el principio con las implicaciones más estratégicas a largo plazo.

La pregunta es simple: ¿dónde codificas el comportamiento de tu sistema? En código (state machines, grafos de flujo, condiciones hardcodeadas) o en texto (prompts, skills, contratos en lenguaje natural).

Las cuatro fuentes eligieron texto, por razones distintas:

**Factory Missions**: ~700 líneas de texto definen toda la estrategia de orquestación. Cuatro frases pueden cambiar radicalmente cómo el sistema maneja fallos o replanificaciones. Sin tocar código. Cuando salió una nueva versión del modelo base, el sistema se benefició automáticamente. La arquitectura no compite con los modelos — los usa mejor según mejoran.

**Lopopolo (OpenAI) / 12-Factor Agents**: Factor 8 — "own your control flow". No escondas el workflow en el framework. Pero sí exprésalo en prompts versionados, no en grafos hardcodeados. La distinción es importante: no delegar el control, sino expresarlo en un formato que mejora con el modelo.

**NLAH (Tsinghua)**: Execution Contracts son function signatures textuales para agentes. El harness es texto. La evidencia empírica: el mismo algoritmo expresado en lenguaje natural estructurado vs. en código produce +16.8 puntos de diferencia. La representación textual no es solo más legible — es más ejecutable por LLMs.

**Anthropic**: AGENTS.md, skills, Sprint Contracts — todo texto que el modelo lee, interpreta y ejecuta. La capa determinística del sistema es delgada; la inteligencia está en el texto.

**La implicación práctica**: las abstracciones que hardcodean el comportamiento quedan obsoletas cuando mejora el modelo. Los prompts que describen el comportamiento mejoran con el modelo. Esta no es una diferencia de filosofía — es una diferencia de vida útil del sistema.

Concretamente: si tu arquitectura de agentes requiere refactoring de código cada vez que cambias de modelo, tienes lógica en el lugar equivocado.

---

## Principio 4 — El estado es externo y estructurado

El context window de un agente tiene tres problemas fundamentales como almacén de estado: se satura, se reinicia y no es compartible entre agentes. Las cuatro fuentes llegaron a la misma solución desde ángulos distintos.

**Factory Missions**: Structured Handoffs. Cuando un worker termina, no pasa el resultado informalmente al siguiente — escribe un documento con cinco campos: qué se completó, qué quedó pendiente, comandos ejecutados y exit codes, issues descubiertos, ¿se siguieron los procedures? El siguiente worker lee ese documento. La misión no depende de que nadie recuerde nada.

**NLAH (Tsinghua)**: File-Backed State. El estado del agente es un fichero con una dirección en disco. `required_outputs`, `output_paths`, `completion_conditions` son referencias a ficheros, no estados en memoria. Sobrevive a truncación, reinicios y delegación entre agentes. La evidencia: −97% de llamadas al LLM en la migración de OS-Symphony a NLAH, en parte porque el agente ya no tiene que reconstruir contexto que podría haber leído directamente.

**Lopopolo (OpenAI)**: el repo como prompt persistente. El estado del sistema está en el código, los tests, los lints y los documentos del repo. No en la memoria de ningún agente. Cada agente que se conecta al repo encuentra el estado completo del sistema sin necesidad de que nadie se lo explique.

**12-Factor Agents (Horthy)**: Factor 12 — "stateless reducer". El agente es una función pura: recibe estado externo + input → produce output + nuevo estado externo. El agente no recuerda nada entre invocaciones. Todo lo que necesita saber está en el estado que recibe.

**La implicación práctica**: si el estado de tu sistema vive en el context window de un agente, ese estado desaparece cuando el agente se reinicia, se trunca o se delega. Para tareas cortas (minutos), esto puede no importar. Para tareas largas (horas o días), es una bomba de tiempo.

El estado externalizado no es overhead burocrático — es lo que hace posible la resiliencia, la delegación y la verificación adversarial. Sin él, los tres principios anteriores son mucho más difíciles de implementar.

---

## La matriz completa

|  | **Harness > Modelo** | **Separar Gen/Eval** | **Lógica en texto** | **Estado externo** |
|---|:---:|:---:|:---:|:---:|
| **Anthropic** | ✓ | ✓ | ✓ | ✓ |
| **OpenAI / Lopopolo** | ✓ | ✓ | ✓ | ✓ |
| **Factory** | ✓ | ✓ | ✓ | ✓ |
| **Academia** | ✓ | ✓ | ✓ | ✓ |

Cuatro equipos. Cuatro filosofías distintas. El mismo conjunto de principios.

---

## Qué significa la convergencia

La convergencia es evidencia de que estos principios no son preferencias de diseño — son restricciones del problema.

Los agentes basados en LLMs tienen un conjunto de limitaciones conocidas: el context window es finito, el modelo tiene confirmation bias, las asunciones sobre capacidades del modelo caducan. Cada uno de los cuatro principios es una respuesta directa a una de estas limitaciones:

- El estado externo responde a la finitud del context window.
- La separación de generación y evaluación responde al confirmation bias.
- La lógica en texto responde a la caducidad de las asunciones.
- El harness como activo principal responde a la variabilidad del rendimiento entre sistemas con el mismo modelo.

Cuatro grupos llegaron a los mismos principios no porque se copiaran entre sí, sino porque los cuatro se toparon con los mismos obstáculos. La convergencia no es tendencia — es la geometría del problema.

---

## Recursos

- Presentación completa con matriz de convergencias: [Patrones de Orquestación — Código Sin Siesta](https://codigosinsiesta.github.io/orquestacion-patrones-presentation/)
- NLAH: Pan et al., Tsinghua, marzo 2026
- Meta-Harness: Khattab et al., Stanford, marzo 2026
- Factory Missions: Luke Alvoeiro, AI Engineer World's Fair 2026
- 12-Factor Agents: Dexter Horthy, HumanLayer
- Harness Engineering: Ryan Lopopolo, OpenAI
