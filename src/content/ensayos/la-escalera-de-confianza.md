---
title: "La escalera de confianza: por qué el 99% de los developers no usa orquestación"
description: "El 84% de developers usa herramientas de IA. Solo el 29% confía en lo que producen. Y apenas el 1% ha llegado al nivel donde los agentes trabajan en paralelo mientras tú revisas el resultado. Eso no es un problema tecnológico."
fecha: 2026-06-14
tags: ["ia", "agentes", "adopcion", "orquestación", "cultura"]
autor: "Alejandro de la Fuente"
---

El 84% de developers usa herramientas de IA. Solo el 29% confía en lo que producen.

Ese dato no es reciente ni marginal: viene del Developer Survey de Stack Overflow de 2025, con casi 50.000 respuestas. Y en 2026 la tendencia continúa: la adopción sube, la confianza baja. Un 46% activamente desconfía del output de los agentes que dicen usar.

¿Por qué? No es que los modelos sean malos. No es que las herramientas fallen. Es que la confianza no se construye instalando una extensión — se gana peldaño a peldaño, y la mayoría de developers nunca ha tenido un mapa del recorrido.

---

## La escalera

Scott Breitenother, CEO de Kilo Code, propuso este modelo mental tras analizar **25 billones de tokens** procesados por más de 1,5 millones de developers en su plataforma desde mayo de 2025. No es teoría: es el patrón que emerge de ver cómo la gente real adopta (y abandona) herramientas de IA en producción.

Hay cuatro peldaños, y la distancia entre ellos no es tecnológica.

### Peldaño 1 — Autocomplete

El agente te sugiere mientras escribes. Tú tabulas o ignoras. No has delegado nada; solo has aceptado o rechazado una propuesta concreta.

El ciclo de feedback es inmediato: sugerencia buena → tabulas → confías un poco más. Sugerencia mala → ignoras → no pierdes nada. Es el gateway de entrada al ecosistema, el punto donde casi todos empiezan.

Donde se rompe: latencia mayor de 200ms. Un autocomplete que llega tarde es peor que no tenerlo porque interrumpe el flujo mental sin aportarte nada.

### Peldaño 2 — Chat

Le preguntas al agente. Das contexto. Recibes una respuesta acotada que puedes copiar, adaptar o descartar. Todavía no has delegado ejecución — solo has pedido consejo.

Aquí empieza el problema de contexto. Si el agente no sabe de qué habla (no conoce tu codebase, tu stack, tus convenciones), la respuesta es genérica. Genérico no genera confianza. Cuando los modelos responden con el código incorrecto del primero al tercero de los ejemplos en Stack Overflow en lugar de con lo que realmente necesitas, la confianza cae.

Donde se rompe: el agente hace sugerencias que no aplican porque no tiene contexto suficiente. El developer concluye que la herramienta "no sirve para esto" cuando el problema es que la herramienta no sabe dónde está.

### Peldaño 3 — Single agent

Le delegas una tarea completa. El agente la ejecuta. Tú revisas el resultado antes de aceptarlo.

Esta es la auto-escuela con doble freno: el agente conduce, tú tienes el control. El ciclo de feedback es más largo (la tarea puede llevar minutos), pero el contrato es claro: el agente hace el trabajo, tú apruebas o corriges antes de que llegue a producción.

Aquí la confianza empieza a ser acumulativa. Si el agente completa cinco tareas seguidas sin que tengas que corregirlo, la sexta la miras con menos atención. Si en la tercera toca un fichero que no debía, vuelves al nivel anterior y necesitas tiempo para recuperar esa confianza.

Donde se rompe: el agente pide aprobación cada 30 segundos, o tarda tanto que resulta más rápido hacerlo manualmente, o comete un error en un path inesperado. Cualquiera de estos rompe el contrato implícito de "tú haces el trabajo, yo solo reviso".

### Peldaño 4 — Orquestación

Defines la visión. Dos, tres, cuatro agentes trabajan en paralelo. Tú revisas el resultado final.

El AI tiene el volante. No estás mirando cada línea — estás evaluando si el resultado está bien. No eres un revisor de código; eres un director técnico que juzga la obra completa.

Según los datos de Kilo Code, aproximadamente el **1% de los developers** está aquí. No el 1% que no sabe usar la herramienta — el 1% de los que ya usan IA todos los días.

---

## Por qué la confianza es el cuello de botella

La escalera no es de habilidad. Es de confianza. Y la confianza en sistemas agénticos tiene una propiedad asimétrica: **se gana lentamente y se pierde de golpe**.

Tres o cuatro victorias consecutivas del agente suben un poco la confianza. Un error en producción la destruye completamente. No importa cuánto hubiera hecho bien antes — la pérdida se siente desproporcionada.

Esto crea un ciclo que puede ser virtuoso o vicioso:

**Ciclo virtuoso**: das contexto → el agente produce algo bueno → confías más → das más permisos → el agente produce algo mejor → confías más.

**Ciclo vicioso**: das poco contexto → el agente produce algo genérico → desconfías → le das menos contexto la próxima vez → produce algo peor → desconfías más.

La mayoría de teams que "han probado IA y no funciona" están en el ciclo vicioso desde el primer día. No porque la herramienta sea mala, sino porque empezaron sin contexto suficiente, recibieron resultados mediocres y nunca rompieron el ciclo.

---

## Tres sitios concretos donde se rompe la adopción

Con 25 billones de tokens de datos reales, Kilo Code identifica tres puntos donde la confianza colapsa con más frecuencia:

### 1. Falta de contexto

El agente no sabe de qué habla. No conoce la arquitectura, las convenciones del equipo, las decisiones previas. Produce código correcto sintácticamente pero incorrecto para tu sistema. El developer interpreta esto como "la IA no entiende nuestro proyecto" cuando la solución real es darle el mapa antes de pedirle que navegue.

### 2. Modelo equivocado para la tarea

Usar el modelo más potente para todo parece la estrategia segura. No lo es. Opus 4.6 para arquitectura tiene sentido. Opus 4.6 para renombrar una variable es lento, caro y produce la misma salida que un modelo diez veces más barato. La lentitud destruye el ciclo de feedback. Y cuando el ciclo de feedback se rompe, la confianza cae.

La mezcla deliberada (modelo potente para decisiones de alto nivel, modelo rápido y barato para tareas mecánicas) es más productiva y más cómoda que la estrategia de "siempre el mejor".

### 3. Herramientas con sharp edges

Un bug conocido que aparece cada dos días. Una integración que falla con ciertos ficheros. Un agente que pide confirmación para acciones que deberían ser automáticas. Cada fricción tiene un coste de confianza que se acumula.

La velocidad de iteración del proveedor importa tanto como la calidad del modelo. Una herramienta que resuelve el bug de esta semana el lunes que viene genera confianza. Una herramienta que tiene el mismo bug desde hace tres meses, aunque sea mejor en benchmarks, no.

---

## El cambio que nadie te avisa que va a pasar

Cuando un developer llega al peldaño 4, pasa algo inesperado en cómo usa su tiempo.

En los niveles anteriores, la distribución de esfuerzo es aproximadamente 80% escribir código y 20% pensar. El agente ayuda a escribir más rápido, pero la naturaleza del trabajo no cambia.

En orquestación, eso se invierte: **80% pensar, 20% código**. No porque escribas menos código — produces más código que nunca. Sino porque el trabajo que no puede delegar al agente es exactamente el trabajo de criterio: decidir qué construir, cómo descomponerlo, cuándo el resultado está bien, cuándo hay que rechazarlo.

El agente cubre los detalles de API, el boilerplate, la implementación mecánica. El developer cubre las decisiones que requieren contexto, gusto y responsabilidad.

Este cambio requiere un músculo diferente. Developers que llevan años en modo "escribo código" necesitan tiempo para adaptarse a modo "dirijo agentes". El warm-up es real. No es un fracaso — es el aprendizaje de una disciplina diferente.

---

## Qué significa esto para un equipo

El dato del 1% no implica que el 99% restante está haciendo algo mal. Implica que la escalera es larga y que nadie sube varios peldaños de golpe.

**No onboardes directamente al peldaño 4.** Un developer que nunca ha hecho la travesía completa no tiene la confianza acumulada para trabajar con orquestación de forma efectiva. El atajo, los intentos fallidos de delegación, los errores que sí los marcaron y los que no — todo eso es parte del aprendizaje. Sin esa historia personal, el peldaño 4 se convierte en fuente de frustración, no de productividad.

**Mide la confianza como métrica de producto.** Tasa de aceptación de autocompletes. Porcentaje de respuestas de chat que se convierten en código real. Porcentaje de agent runs que se llevan a término sin abortar. Estas métricas dicen más sobre si tu equipo está subiendo la escalera que cualquier survey de satisfacción.

**El bottleneck cuando llegas a orquestación ya no es el código.** Es quién puede pensar bien con agentes: descomponer problemas, escribir specs accionables, evaluar resultados con criterio técnico. Eso es escaso, y no se resuelve con más licencias de herramientas.

---

El 84% de adopción con 29% de confianza no es una paradoja. Es la descripción exacta de una tecnología que la mayoría de la industria todavía usa en los peldaños bajos de la escalera. Los que han llegado al peldaño 4 no tienen acceso a modelos mejores ni a herramientas secretas. Tienen la travesía hecha.

La escalera no es corta. Pero es la misma para todos.
