---
title: "El patrón correcto para cada problema: 6 dolores reales y sus soluciones"
description: "El patrón correcto para cada problema: 6 dolores reales y sus soluciones El error más caro al diseñar sistemas con agentes no es usar el patrón equivocado. Es no saber que existe el correcto. La mayor"
fecha: 2026-05-09
tags: ["ia", "agentes", "orquestación", "patrones", "multi-agente", "arquitectura"]
autor: "Alejandro de la Fuente"
---

# El patrón correcto para cada problema: 6 dolores reales y sus soluciones

El error más caro al diseñar sistemas con agentes no es usar el patrón equivocado. Es no saber que existe el correcto.

La mayoría de los problemas que aparecen en producción con agentes IA no son bugs del modelo — son consecuencias predecibles de arquitecturas que no están diseñadas para el problema que tienen que resolver. Y lo predecible tiene solución conocida.


Este artículo no va de taxonomías. Va de síntomas. Empieza con el dolor que ya tienes — o el que tendrás en cuanto escales — y lleva directo al patrón que lo resuelve y por qué funciona.

---

## Problema 1 — El agente no detecta sus propios errores

**Síntoma**: el agente implementa algo, lo revisa, dice que está bien. No está bien. Los tests pasan. En producción falla.

**Por qué ocurre**: confirmation bias. El agente que escribió el código quiere que funcione. Lee lo que espera leer. Ve lo que espera ver. No es un fallo del modelo — es un fallo cognitivo estructural que también tienen los humanos, y por eso hacemos code review con personas distintas al autor.

**El patrón**: Creator-Verifier / Generator-Evaluator.

El agente que implementa y el que verifica tienen **contextos completamente separados**. El verificador nunca ha visto el código antes de revisarlo. Sin apego. Sin memoria de las decisiones que llevaron a esa implementación.

Anthropic lo formaliza como Planner-Generator-Evaluator. Factory lo implementa como la condición explícita de que el Validator nunca ha visto el código que va a verificar. El principio de diseño subyacente es el mismo: **la evaluación adversarial requiere separación de contextos**.

Una consecuencia práctica que Factory documentó en producción: la validación **nunca pasa al primer intento**. Siempre se generan follow-up features. Eso no es un bug del sistema — es evidencia de que el QA loop está funcionando. Un sistema que siempre pasa validación al primer intento no está validando nada real.

---

## Problema 2 — La calidad cae en tareas largas

**Síntoma**: el agente trabaja bien las primeras horas. Pasadas 3-4 horas (o al día siguiente), los resultados degradan. Pierde el hilo, repite trabajo, toma decisiones inconsistentes con decisiones anteriores.

**Por qué ocurre**: el context window se satura. La atención del modelo no es uniforme sobre todo el contexto — se degrada hacia los extremos. En tareas largas, el contexto acumula tanto ruido que el agente literalmente pierde de vista parte del trabajo previo.

**El patrón**: Context Isolation + Structured Handoffs.

Cada worker arranca con un contexto limpio. No hereda la conversación completa de los workers anteriores — hereda un documento estructurado con exactamente lo que necesita saber: qué se completó, qué quedó pendiente, qué problemas se encontraron, qué decisiones arquitectónicas se tomaron y por qué.

El estado del sistema no vive en el context window de ningún agente. Vive en disco, en ficheros estructurados que cualquier agente puede leer sin necesidad de haber estado presente cuando se escribieron.

Factory documentó la misión más larga del campo: **16 días continuos, 185 agent runs**. Sin degradación de calidad entre el día 1 y el día 16. El aislamiento de contextos es lo que lo hace posible — no un modelo más grande ni un context window más largo.

---

## Problema 3 — Los agentes en paralelo se pisan los cambios

**Síntoma**: lanzas varios agentes en paralelo para acelerar. Acaban pisándose los cambios, duplicando trabajo o tomando decisiones arquitectónicas inconsistentes entre sí. El overhead de merge acaba siendo mayor que el tiempo ahorrado.

**Por qué ocurre**: los agentes comparten estado — el codebase — sin coordinación. Dos agentes modificando los mismos ficheros simultáneamente es una race condition. La intuición de "más agentes en paralelo = más throughput" viene de paralelismo de CPU, donde las tareas son independientes. El software raramente tiene tareas verdaderamente independientes.

**El patrón**: ejecución serial con paralelismo interno solo en operaciones read-only.

La ejecución de features es secuencial: Feature 1 → Feature 2 → Feature 3. Dentro de cada worker, el paralelismo es válido donde no hay escritura compartida: buscar en el codebase, consultar documentación, investigar APIs. Dentro de la validación: revisar Feature A, Feature B y Feature C en paralelo está bien porque los validators solo leen.

El resultado parece más lento en el papel. En producción es más rápido porque la tasa de error es dramáticamente menor. En tareas de varios días, la corrección **se compone**: un error que no se comete el día 1 no se propaga al día 16. El coste de revertir trabajo mal hecho supera con creces el coste del throughput perdido.

---

## Problema 4 — Los tests no atrapan los bugs que importan

**Síntoma**: los tests pasan. La suite está verde. Hay cobertura alta. Y aun así el sistema tiene bugs que importan. Los tests confirman que el código hace lo que el código hace, no que el código hace lo que debería hacer.

**Por qué ocurre**: los tests fueron escritos por el mismo agente que implementó. Ese agente codificó sus propias decisiones de diseño en los tests. Los tests confirman esas decisiones en lugar de verificar la intención original del requisito.

**El patrón**: Validation Contracts escritos antes del código.

El contrato define qué significa "done" **antes de que empiece la implementación**, de forma independiente a cómo se vaya a implementar. Para un proyecto complejo: cientos de assertions. Cada feature debe satisfacer al menos una. La suma de features debe cubrir todas las assertions.

```
Sin contrato:
  Implementación → Tests (shaped by implementation) → Tests pasan → Drift silencioso

Con contrato:
  Contrato → Implementación → Tests de contrato → Sin drift
```

Esto es Spec-Driven Development llevado al nivel de harness verificable automáticamente. El contrato es el artefacto que permite que el Validator tenga criterios objetivos de evaluación sin haber visto la implementación.

---

## Problema 5 — El sistema queda obsoleto con el próximo modelo

**Síntoma**: sale una nueva versión del modelo. Hay que revisar toda la lógica de orquestación porque está hardcodeada en state machines que asumen comportamientos específicos del modelo anterior. El sistema que funcionaba bien con GPT-4 se comporta diferente con GPT-5.

**Por qué ocurre**: la lógica de orquestación vive en código que codifica asunciones sobre las capacidades actuales del modelo. Cuando el modelo cambia, las asunciones quedan desactualizadas.

**El patrón**: lógica en prompts y skills, no en state machines.

La capa determinística del harness debe ser **delgada**: ejecutar validación, bloquear progreso cuando hay issues sin resolver, hacer bookkeeping de estado. Lo mínimo que no puede expresarse en texto.

La inteligencia del sistema vive en texto: cómo descomponer features, cómo manejar fallos, cómo ajustar la estrategia. Factory tiene ~700 líneas de texto que definen toda su estrategia de orquestación. Cuatro frases pueden cambiar la estrategia de ejecución radicalmente, sin tocar código.

Cuando sale un modelo mejor, ese texto se ejecuta mejor automáticamente. La arquitectura no compite con los modelos — los usa mejor según mejoran. El mismo sistema, más capaz, sin refactoring.

Este es el principio que Lopopolo formalizó en los 12-Factor Agents: "own your control flow" — pero exprésalo en texto versionado, no en grafos hardcodeados.

---

## Problema 6 — Supervisar agentes es a tiempo completo o inútil

**Síntoma**: o te quedas mirando la pantalla todo el tiempo para intervenir cuando algo va mal (HITL bloqueante), o delegas completamente y te enteras de los problemas cuando ya hay daño hecho (HOTL superficial). Los dos extremos son inviables.

**Por qué ocurre**: no hay diferenciación por riesgo. No todas las acciones de un agente tienen el mismo coste de error. Un agente que borra un fichero de configuración en producción necesita confirmación humana. Un agente que genera un borrador de texto no la necesita.

**El patrón**: Autonomy Spectrum + supervisión diferenciada por riesgo.

El gate bloquea lo irreversible: acciones destructivas, cambios en sistemas compartidos, decisiones con consecuencias que no se pueden deshacer. El monitoreo observa el resto sin interrumpir.

En la práctica: define explícitamente qué categorías de acciones requieren gate humano y cuáles no. Los agentes con este diseño pueden correr durante días enviando notificaciones de progreso sin bloquear, y detenerse específicamente cuando llegan a una acción que merece revisión.

Mission Control de Factory es la implementación más madura de esto: una vista asíncrona donde el humano actúa como project manager (revisa handoff summaries, aprueba replanificaciones en milestone boundaries) sin necesidad de estar presente en cada paso de implementación. No es supervisión en tiempo real — es supervisión en los momentos que importan.

---

## Los 6 principios que los unen

Detrás de los seis problemas hay seis principios de diseño. Son el patrón detrás del patrón:

1. **Separación de contextos** — el verificador no puede haber visto la implementación.
2. **Estado externalizado** — lo que el sistema sabe no puede vivir solo en un context window.
3. **Corrección serial** — un error que no ocurre en el día 1 no se propaga al día 16.
4. **Spec antes que código** — los tests escritos después confirman decisiones; los contratos escritos antes verifican intención.
5. **Lógica en texto, no en grafos** — el sistema se beneficia automáticamente de cada mejora de modelo.
6. **Supervisión por riesgo** — el gate bloquea lo irreversible; el monitoreo observa el resto.

Si diseñas un sistema multi-agente y puedes responder a cada uno de estos seis puntos con una decisión explícita, tienes una arquitectura. Si no puedes responderlos, tienes intuición — y la intuición escala mal.

---

## Recursos

- Presentación completa con diagramas: [Patrones de Orquestación — Código Sin Siesta](https://codigosinsiesta.github.io/orquestacion-patrones-presentation/)
- Factory Missions: Luke Alvoeiro, AI Engineer World's Fair 2026
- 12-Factor Agents: Dexter Horthy, HumanLayer
