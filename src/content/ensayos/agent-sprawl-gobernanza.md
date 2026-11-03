---
title: "Agent sprawl: el problema de gobernanza que nadie ve venir"
description: "El 96% de las empresas ya ejecuta agentes de IA. Solo el 12% tiene una plataforma centralizada para gestionarlos. Y apenas el 18% sabe qué agentes están corriendo ahora mismo dentro de su organización."
fecha: 2026-06-13
tags: ["ia", "agentes", "enterprise", "gobernanza", "seguridad", "arquitectura"]
autor: "Alejandro de la Fuente"
---

El 96% de las empresas ya ejecuta agentes de IA. Solo el 12% tiene una plataforma centralizada para gestionarlos.

Esos números son de abril de 2026, del informe global de OutSystems sobre el estado del desarrollo con IA, con casi 1.900 directores de tecnología encuestados. El 94% reconoce que el agent sprawl está aumentando la complejidad, la deuda técnica y el riesgo de seguridad de su organización. Y apenas el 18% mantiene un inventario completo de los agentes que ya están corriendo dentro de sus sistemas.

El problema no es tecnológico. Es de gobernanza. Y llega exactamente cuando nadie lo está mirando.

---

## Qué es el agent sprawl y por qué es inevitable

Agent sprawl es lo que ocurre cuando cada developer usa el coding tool que prefiere para cada tarea, sin coordinación central: Claude Code para escribir código, Codex para revisar, Cursor para refactorizar, Gemini CLI para Python. Ninguna herramienta está mal elegida individualmente. El problema es el conjunto.

Desde la perspectiva de la empresa, eso se traduce en cinco pérdidas simultáneas:

- **Procurement fragmentado** — múltiples contratos, múltiples consolas de billing, múltiples ciclos de renovación.
- **Coste invisible** — no hay forma de saber quién gasta cuánto en qué modelo. El gasto de IA se convierte en top-10 cost driver antes de que finanzas lo tenga en el radar.
- **Visibilidad cero** — sin datos sobre qué herramientas funcionan para qué equipos, no hay forma de identificar qué vale la pena escalar.
- **Compliance sin garantías** — no puedes asegurar que ciertos datasets confidenciales no se están usando para entrenar modelos externos, ni que las interacciones cumplen los requisitos del cliente o del regulador.
- **MCP sin seguridad** — los tokens de acceso de los MCP servers viven en variables de entorno locales, en plain text, sin rotación. Un CISO que lo sabe no puede dormir tranquilo.

IBM estima que a finales de 2026 la mayoría de grandes empresas habrá desplegado una plantilla digital de más de **1.600 agentes**. El 70% de los ejecutivos reconoce que su governance actual no está preparada para esa escala. Gartner predice que el 70% de las iniciativas de IA agéntica en enterprise fracasarán antes de 2029 — casi siempre por governance deficiente, no por fallos del modelo.

---

## El error que no hay que cometer

La respuesta instintiva es restrictiva: elegimos una herramienta, todo el mundo usa esa, problema resuelto.

Es el error equivocado.

Ankit Mathur, Director de Ingeniería en Databricks con más de 2.000 ingenieros bajo su paraguas, lo argumenta de forma directa: **es bueno que los devs usen distintos modelos para distintas tareas**. Opus 4.6 para decisiones de arquitectura. Sonnet o Codex para escribir código. Modelos más pequeños y baratos para refactors mecánicos. Esa especialización sube la productividad de forma real.

La diferencia entre herramientas ya no es del 10%. Un 10-15% de productividad adicional, en 2026, es el activo más valioso que puede tener un equipo de ingeniería. Forzar a todos a usar el mismo tool de forma uniforme es regresivo.

El problema nunca fue que la gente use herramientas distintas. El problema es que lo hace sin que la organización tenga visibilidad ni control.

---

## El patrón que funciona: el coding agent gateway

Lo que Databricks construyó internamente se llama Isaac. Lo que ahora ofrecen al mercado se llama Unity AI Gateway. La idea es la misma en los dos casos: un wrapper ligero entre los coding tools y los modelos que hace de punto central de control sin restringir qué herramientas pueden usar los developers.

El gateway hace cinco cosas:

1. **Routing centralizado** — todos los coding tools apuntan al gateway, que los dirige a los proveedores correspondientes (Anthropic, OpenAI, lo que sea). El developer sigue usando la herramienta que prefiere. Solo cambia a dónde apunta.

2. **Dashboards unificados** — requests, tokens, top users, herramientas más usadas, líneas de código generadas. Todo en una sola vista que finanzas puede leer.

3. **Cost controls por persona** — un límite mensual por developer (por ejemplo, 1.000€/mes) que aplica a cualquier coding tool, sin necesidad de gestionar billing por proveedor.

4. **Privacy y compliance en una sola política** — qué datos pueden salir, a qué modelos, bajo qué condiciones. Se define una vez, aplica a todo.

5. **MCP servers con governance** — catálogo central de MCP servers disponibles, tokens encriptados con rotación automática, sin plain text en variables de entorno locales.

Databricks expandió Unity AI Gateway en abril de 2026 para incluir ejecución on-behalf-of (el gateway actúa en nombre del usuario con sus permisos, no con los del sistema) y tracing completo con MLflow. Cada interacción tiene audit trail. Compliance deja de ser teatro.

---

## El segundo problema: cuánta autonomía dar a cada acción

Resolver el sprawl con un gateway centralizado resuelve el problema de visibilidad y control a nivel organizativo. Pero hay un segundo problema que opera en el nivel de cada workflow individual: **¿cuánta autonomía le das al agente en cada paso?**

La respuesta intuitiva es binaria: o el agente decide solo, o pide permiso. Ninguna de las dos funciones bien en producción.

Un agente que pide aprobación para cada acción convierte la automatización en un formulario de pasos con extra. Destruye el valor de delegar. Un agente que nunca pide aprobación comete errores irreversibles antes de que alguien pueda interceptarlos.

La solución es un espectro, no un interruptor.

### Tres posiciones en el espectro

**Human-in-the-Loop (HITL)**: el agente para antes de ejecutar una acción de riesgo y espera aprobación explícita. No continúa sin ella.

```
Agente → acción de riesgo → PAUSA → apruebas/rechazas/corriges → continúa
```

Cuándo: acciones irreversibles, acceso a producción, datos sensibles, implicaciones financieras o legales. El coste es latencia y fricción — necesaria cuando el daño potencial lo justifica.

**Human-on-the-Loop (HOTL)**: el agente actúa de forma autónoma. Un humano monitorea los outputs y puede intervenir a posteriori si detecta algo incorrecto.

```
Agente → actúa → humano observa → interviene si hace falta
```

Cuándo: acciones de riesgo medio, reversibles, donde la velocidad importa más que la verificación previa. El coste es que el daño puede ocurrir antes de que alguien lo vea.

**Automatización completa**: el agente actúa, nadie monitorea activamente. Solo hay alertas para fallos críticos.

Cuándo: acciones de bajo riesgo, totalmente reversibles, con alta confianza histórica en el agente para esa tarea específica.

### El problema del workflow mixto

Un agente que hace búsquedas de información (bajo riesgo) y luego escribe en una base de datos de producción (alto riesgo) dentro del mismo workflow no puede tener un solo nivel de autonomía. Necesita niveles diferentes según la acción.

La decisión no es "HITL o no HITL" — es qué acciones dentro del workflow merecen cada nivel. Cuatro preguntas para decidirlo:

1. **¿Es irreversible?** → HITL obligatorio.
2. **¿Afecta a terceros o a datos sensibles?** → HITL o HOTL según regulación.
3. **¿Cuánto daño si el agente se equivoca?** → proporcional al nivel de supervisión.
4. **¿Qué confianza histórica tenemos en el agente para esta tarea específica?** → inversamente proporcional a la supervisión necesaria.

---

## Cómo implementar HITL en producción

El patrón técnico más extendido en 2026 es el **interrupt & approval gate**:

```
1. El agente llega a un nodo de acción sensible
2. Persiste su estado completo (checkpointing)
3. Emite una approval request (notificación — Slack, email, ticket, lo que sea)
4. Se suspende sin consumir recursos
5. Apruebas, rechazas o rediriges
6. El agente se reanuda exactamente desde donde paró
```

Una trampa común: si el nodo previo al checkpoint es no determinista (una búsqueda web, una consulta a una API externa), al reanudar puede ejecutarse de nuevo con resultados diferentes. La solución es persistir el resultado de ese nodo antes del checkpoint, no después.

AWS documenta cuatro variantes de este patrón: hook system (intercepta tool calls antes de ejecutarlas), remote tool interrupt (notificación asíncrona cuando el aprobador puede tardar horas), MCP elicitation (el servidor MCP solicita input adicional en tiempo real) y risk-tiered access (diferentes niveles de permiso según el riesgo de la operación). No son mutuamente excluyentes — en workflows complejos se usan varios a la vez.

---

## Los errores que sí ocurren

**Interrumpir en todo**: el agente se convierte en un chatbot que pregunta cada decisión. La productividad cae por debajo de hacerlo manualmente. Los developers dejan de usar el agente.

**No interrumpir en nada**: "governance theater". Los humanos están nominalmente en el loop pero sin contexto ni visibilidad para evaluar las acciones en tiempo real. Peor que no tenerlos porque da sensación de control sin la realidad.

**Sin audit trail**: si la regla de aprobación vive solo en código, no hay registro de qué acciones se aprobaron, quién las aprobó, cuánto tardaron o si hay patrones de fallos. Cuando el regulador pregunte, no hay respuesta.

---

## El reloj regulatorio

El EU AI Act pone una fecha concreta en el calendario: agosto de 2026 para supervisión humana demostrable en sistemas de IA de alto riesgo. Healthcare, crédito, empleo, infraestructura crítica — si tus agentes tocan alguno de estos dominios, HITL no es una opción de arquitectura. Es un requisito legal.

El NIST AI RMF y la mayoría de los marcos de compliance que están emergiendo en 2026 convergen en lo mismo: "human-AI teaming" como superficie de control clave. No es suficiente con que el modelo tenga buenas intenciones. El sistema tiene que demostrar que hay un humano que puede intervenir cuando importa.

---

El agent sprawl no es un problema de developers rebeldes que ignoran las políticas de la empresa. Es la consecuencia natural de una industria donde las herramientas mejoran cada semana y los equipos que no las usan pierden competitividad. No puedes pelearlo.

Lo que sí puedes hacer es poner visibilidad donde no la hay, control donde no lo hay, y autonomía calibrada donde antes solo había aprobación o automatización ciega. El gateway y el interrupt gate no son restricciones — son la infraestructura que hace sostenible escalar los agentes sin perder el control.

La pregunta no es si tu empresa va a tener 1.600 agentes. Es si sabrás qué están haciendo cuando los tenga.
