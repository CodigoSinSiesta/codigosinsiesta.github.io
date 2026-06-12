---
title: "Los 10 niveles de complejidad de los agentes IA: una taxonomía evolutiva"
description: "Los 10 niveles de complejidad de los agentes IA: una taxonomía evolutiva El término \"agente IA\" cubre demasiado. Cubre un chatbot con una tool de búsqueda y cubre un sistema que lleva 16 días ejecutan"
fecha: 2026-05-09
tags: ["ia", "agentes", "orquestación", "patrones", "arquitectura", "multi-agente"]
autor: "Alejandro de la Fuente"
---

# Los 10 niveles de complejidad de los agentes IA: una taxonomía evolutiva

El término "agente IA" cubre demasiado. Cubre un chatbot con una tool de búsqueda y cubre un sistema que lleva 16 días ejecutando en producción sin supervisión humana continua. Llamarlos igual es como llamar "vehículo" a una bicicleta y a un Airbus A380.

La industria necesita un vocabulario de complejidad. Este artículo propone uno.


Diez niveles, ordenados de menor a mayor complejidad. Cada nivel **resuelve el límite del anterior** — no son patrones intercambiables, son una escalera donde cada peldaño existe porque el anterior tenía un techo claro. La recomendación es simple: empieza donde estás. No saltes niveles.

---

## La escalera

```
Nivel 10 ── Puppeteer / RL Orchestration      ← frontier
Nivel  9 ── Missions (composición de patrones) ← producción avanzada
Nivel  8 ── Swarm / Mesh                       ← sin coordinador central
Nivel  7 ── Hierarchical + Broadcast           ← coordinación a escala
Nivel  6 ── Creator-Verifier                   ← validación adversarial
Nivel  5 ── Orchestrator-Workers               ← delegación dinámica
Nivel  4 ── Routing                            ← clasificar → especialista correcto
Nivel  3 ── Pipeline / Prompt Chaining         ← secuencia fija de etapas
Nivel  2 ── Reflexion                          ← aprender de intentos fallidos
Nivel  1 ── ReAct loop                         ← el agente piensa antes de actuar
```

---

## Nivel 1 — ReAct loop

**En una frase**: el agente verbaliza su razonamiento y lo entrelaza con sus acciones.

Yao et al. (2022) formalizaron lo que parece obvio en retrospectiva: un agente que solo actúa es ciego, y un agente que solo razona sin ejecutar nunca actualiza su plan con información real del entorno. ReAct fusiona los dos en un loop atómico:

```
Thought → Action → Observation → Thought → ...
```

El razonamiento es legible. Cuando el agente falla, puedes leer exactamente dónde se torció. Eso solo — la interpretabilidad del loop — ya justifica empezar aquí.

**Cuándo subir al nivel 2**: cuando el agente falla frecuentemente en el primer intento de tareas iterables y no tiene forma de aprender de ese fallo.

---

## Nivel 2 — Reflexion

**En una frase**: el agente genera una autocrítica verbal después de cada intento y la inyecta en el siguiente.

ReAct mejora dentro de un intento. Reflexion añade mejora *entre* intentos. Tres componentes: Actor (ejecuta con ReAct), Evaluador (valora el resultado), Reflector (genera la crítica: "fallé porque X, la próxima vez haré Y"). La crítica se almacena en memoria episódica y alimenta el contexto del siguiente intento.

Sin fine-tuning. Sin modificar el modelo. El "aprendizaje" es textual — de ahí el nombre del paper original: "verbal reinforcement learning".

Resultado: 91% pass@1 en HumanEval, superando GPT-4 (80%) con el mismo modelo base.

**Límite**: la memoria episódica vive en el context window. Si los intentos son largos o numerosos, el contexto se satura. Aquí empieza a necesitarse estado externo.

**Cuándo subir**: cuando el flujo de trabajo tiene múltiples pasos especializados que siempre se ejecutan en el mismo orden.

---

## Nivel 3 — Pipeline / Prompt Chaining

**En una frase**: varios agentes especializados en secuencia fija, cada uno procesa el output del anterior.

El primer patrón realmente multi-agente. La topología es estática — se define en diseño time, no cambia con el contenido del input. Agente A procesa el input, pasa el resultado al Agente B, que lo pasa al C.

Es el patrón correcto para flujos ETL, procesamiento de documentos o CI/CD agéntico donde los pasos son siempre los mismos y en el mismo orden.

**Límite**: la topología es rígida. Si el flujo correcto depende del contenido del input, un pipeline fijo tomará siempre el mismo camino aunque no sea el adecuado.

**Cuándo subir**: cuando diferentes inputs necesitan diferentes rutas de procesamiento.

---

## Nivel 4 — Routing

**En una frase**: clasificar la intención del input y enviarlo al agente especializado correcto.

El insight detrás del Routing es empírico: un agente con más de 15 tools disponibles tiene menos del 80% de precisión en selección de tool. No porque el modelo sea malo — sino porque el espacio de decisión es demasiado grande. La solución es distribuir: múltiples agentes especializados con 3-5 tools cada uno, y un router que decide a cuál enviar.

Cuatro variantes según el trade-off velocidad/precisión:
- **Embedding similarity** — 50ms, sin llamada al LLM
- **LLM-based** — 1-2s, más preciso
- **Cascading** — el router barato primero, el caro solo si el primero no tiene suficiente confianza
- **Cost-aware** — decide según presupuesto disponible en el momento

**Límite**: el routing es estático. Una vez enviado el input al especialista, la ejecución es lineal. No hay coordinación dinámica entre agentes.

**Cuándo subir**: cuando necesitas que el resultado de un agente informe qué hacer a continuación, de forma dinámica.

---

## Nivel 5 — Orchestrator-Workers

**En una frase**: un orchestrator recibe la tarea, la descompone dinámicamente en subtareas y delega a workers sin estado.

Este es el patrón de producción más común. Domina el 70% de los deployments multi-agente reales. La diferencia clave con el Pipeline: la descomposición ocurre en runtime, no en diseño time. El orchestrator decide en función del input qué workers necesita y en qué orden.

Los workers son apátridas por diseño — no acumulan contexto entre tareas. Esto es lo que los hace composables y substituibles.

**Límite**: no hay verificación adversarial. El orchestrator coordina, pero nadie verifica que el resultado del worker sea correcto antes de darlo por bueno.

**Cuándo subir**: cuando los errores del agente que implementa son difíciles de detectar por el mismo agente que los cometió.

---

## Nivel 6 — Creator-Verifier / Generator-Evaluator

**En una frase**: el agente que implementa y el que verifica tienen contextos completamente separados. La verificación es adversarial por diseño.

Este es el salto más importante de la escalera. No porque sea técnicamente complejo, sino porque resuelve un problema cognitivo fundamental: **el agente que escribió el código tiene confirmation bias**. Quiere que funcione. Ve lo que espera ver. Un agente fresco, sin haber visto la implementación, encuentra los bugs con mucha más frecuencia.

Es el mismo principio por el que los humanos hacemos code review: el revisor no tiene apego al código.

Anthropic lo implementa como Planner-Generator-Evaluator. Factory lo implementa como Orchestrator-Worker-Validator, con la condición explícita de que el Validator nunca ha visto el código antes de verificarlo.

**Cuándo subir**: cuando las tareas son tan largas que un solo worker no puede mantener la atención y calidad durante toda la ejecución.

---

## Nivel 7 — Hierarchical + Broadcast

**En una frase**: un orchestrator maestro coordina sub-orchestrators especializados; el estado global se difunde a todos via broadcast.

Cuando la escala del problema supera lo que un orchestrator puede coordinar, la respuesta natural es añadir capas. El orchestrator maestro no ejecuta nada — coordina sub-orchestrators que a su vez coordinan workers.

El broadcast es el mecanismo que mantiene coherencia: cuando el estado global cambia (nuevo constraint, nueva información, replanificación), todos los agentes del sistema reciben la actualización. Sin broadcast, los agentes en diferentes ramas del árbol jerárquico toman decisiones inconsistentes.

**Límite**: el orchestrator maestro es un single point of failure. Si cae o se corrompe, todo el sistema se detiene.

**Cuándo subir**: cuando quieres eliminar ese single point of failure.

---

## Nivel 8 — Swarm / Mesh

**En una frase**: dos patrones sin coordinador central. Swarm: la topología emerge en runtime por reglas locales. Mesh: conexiones peer-to-peer fijas en diseño time.

La promesa es atractiva: sin coordinador central, sin single point of failure, máxima resiliencia. La realidad en ingeniería de software es más complicada.

**La trampa del Swarm en software**: los agentes comparten estado — el codebase. Cuando dos agentes modifican los mismos ficheros simultáneamente sin coordinación, los cambios se pisan. El Swarm solo funciona cuando las tareas son verdaderamente independientes y no comparten estado. En software, eso es raro.

El Mesh es más predecible — las conexiones están definidas — pero tiene el overhead de gestionar todas las comunicaciones peer-to-peer.

**Cuándo tiene sentido**: Swarm para tareas de análisis donde los agentes solo leen (nunca escriben) estado compartido. Mesh para pipelines donde los roles están muy bien definidos y no cambian.

**Cuándo subir**: cuando necesitas combinar varios de estos patrones en un workflow de larga duración.

---

## Nivel 9 — Missions

**En una frase**: composición deliberada de cuatro patrones (Delegación + Creator-Verifier + Broadcast + Negociación) en un workflow que corre durante días o semanas sin degradación.

Factory documentó la arquitectura de Missions en producción. Los números de la misión más larga registrada: **16 días continuos, 185 agent runs, 778M tokens, 89% de coverage de tests**. Eso no es posible con ninguno de los patrones anteriores por separado.

Lo que hace que las Missions escalen donde los sistemas simples se degradan son tres decisiones de diseño no obvias:

**1. Ejecución serial, no paralela.** La intuición dice "más agentes en paralelo = más velocidad". Factory lo probó y descubrió que los agentes en paralelo se pisan los cambios, duplican trabajo y toman decisiones arquitectónicas inconsistentes. La ejecución serial con paralelismo interno solo en operaciones read-only es más lenta en el papel y más rápida en producción porque no hay que deshacer trabajo.

**2. Handoffs estructurados.** Cuando un worker termina, no pasa el resultado al siguiente — escribe un documento estructurado con: qué se completó, qué quedó sin hacer, comandos ejecutados y sus exit codes, issues descubiertos. El sistema no depende de que nadie recuerde nada. La memoria es externa y estructurada.

**3. Validation Contracts escritos antes del código.** El contrato define qué significa "done" de forma independiente a la implementación. Los tests escritos después del código confirman las decisiones tomadas; el contrato escrito antes verifica la intención original. La diferencia es sustancial: la validación nunca pasa al primer intento, y eso no es un bug — es evidencia de que el QA loop está funcionando.

---

## Nivel 10 — Puppeteer / RL Orchestration

**En una frase**: un orchestrator entrenado con reinforcement learning aprende qué secuencia de delegaciones produce mejores resultados para cada tipo de tarea.

El frontier del campo a mayo de 2026. No hay método publicado para la decisión de cuándo parar el entrenamiento. Los requisitos para que tenga sentido son altos: necesitas suficientes ejecuciones históricas como para que el entrenamiento valga más que un harness bien diseñado a mano.

La diferencia con los niveles anteriores es cualitativa: en lugar de seguir una arquitectura fija (por sofisticada que sea), el orchestrator aprende la arquitectura óptima para cada clase de problema a partir de los datos de ejecuciones reales.

---

## Dónde está la industria

La mayoría de equipos trabajan entre el nivel 3 y el 5. Eso no es malo — el Orchestrator-Workers resuelve el 70% de los casos reales. El problema es cuando se intenta saltar al nivel 8 o 9 sin haber consolidado el 6.

El salto más difícil de la escalera no es el más alto — es el de 5 a 6. Pasar de "el agente hace el trabajo" a "hay un agente que verifica adversarialmente el trabajo de otro agente" requiere un cambio de mentalidad más que un cambio técnico. Requiere aceptar que el agente que implementa no puede ser el que verifica, por bueno que sea.

Una vez cruzado ese umbral, los niveles 7, 8 y 9 son variaciones del mismo principio: separación de contextos, estado externo, verificación adversarial a mayor escala.

---

## Recursos

- Presentación completa con diagramas: [Patrones de Orquestación — Código Sin Siesta](https://codigosinsiesta.github.io/orquestacion-patrones-presentation/)
- ReAct: Yao et al., ICLR 2023
- Reflexion: Shinn et al., NeurIPS 2023
- Factory Missions: Luke Alvoeiro, AI Engineer World's Fair 2026
