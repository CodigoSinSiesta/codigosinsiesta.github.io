---
title: "Por qué tu coding agent pierde el hilo a los 30 minutos (y cómo planning-with-files lo arregla)"
description: "Context rot no es magia negra: es la ventana de contexto haciendo lo que hace. Este artículo usa OthmanAdi/planning-with-files v3.4.0 como excusa para diseccionar el patrón 'disco como RAM extendida', conectarlo con los 6 principios de context engineering que publicó Manus en julio de 2025, y separar cuándo funciona de cuándo es overhead disfrazado de disciplina."
fecha: 2026-07-06
tags: ["agentes", "context-engineering", "skills", "arquitectura", "investigacion"]
autor: "Alejandro de la Fuente"
---

# Por qué tu coding agent pierde el hilo a los 30 minutos (y cómo planning-with-files lo arregla)

Tu coding agent lleva veintipocos minutos con una tarea. Ha tocado diez archivos, ha leido quinientos errores y ya ha reintentado el mismo fix tres veces sin que te dieras cuenta. Le pides que escriba el test que cubre el nuevo módulo y, en vez de eso, vuelve a renombrar una función que ya renombraste hace quince minutos.

Esto no es un bug del modelo. Es exactamente para lo que está diseñado. Y arreglarlo con una ventana de contexto de 1M tokens es la receta equivocada.

Hay una respuesta mejor y ya existe en producción: el patrón que el equipo de Manus documentó en julio de 2025[^manus] y que `OthmanAdi/planning-with-files` v3.4.0 implementa con rigor casi industrial. Este artículo lo desempaqueta: de dónde viene, qué hace realmente, cuándo funciona, cuándo es disciplina de boquilla, y cómo probarlo en quince minutos antes de comprometerte.


## 1. El síntoma: cuando el agente empieza a "olvidar" cosas que nunca olvidó

El fenómeno tiene nombre y ya está en la documentación oficial de Anthropic: **context rot**.[^rot-torres] En términos prácticos, significa que la calidad de las respuestas decae a medida que la conversación crece, aunque tengas margen de tokens de sobra. La causa no es misteriosa: el attention del modelo compite con cada token que entra y los que están al principio pierden peso.

Cuatro patrones aparecen una y otra vez cuando esto pasa en coding agents:

- **Lost in the middle.** El agente deja de citar código que leyó hace veinte turnos. No porque no esté en el contexto, sino porque ya no pesa igual que lo más reciente.[^liu]
- **Attention dilution.** Cada token nuevo compite con los anteriores; los del principio de la conversación pierden peso aunque sigan técnicamente "en contexto".
- **Error rediscovery.** El modelo repite un fix que ya probó y falló. El historial está ahí, pero enterrado bajo más historial.
- **Plan drift.** Empezó con un objetivo claro. Tras 50 tool calls, está resolviendo otra cosa. La meta original se diluyó.

Teresa Torres lo documentó con su propio caso en Replit[^rot-torres] en febrero de 2026, pero lo cuenta cualquiera que haya usado Claude Code, Codex o Cursor más de media hora seguida: llega un punto donde `git diff` muestra que el agente está deshaciendo cambios que él mismo hizo.

La reacción instintiva es pedir una ventana más grande. Anthropic ya subió Claude Sonnet a 1M tokens en tier 4, y GPT-5.2 soporta 400K. La métrica de capacidad está ahí; el problema no se va con más capacidad.

La razón está en el paper que el equipo de Manus publicó cuando Meta aún no los había adquirido. Tiene seis principios. Dos de ellos son los que importan para esto.


## 2. La raíz teórica: dos principios de Manus que ya conocías sin saberlo

El 18 de julio de 2025, el equipo de Manus publicó "Context Engineering for AI Agents: Lessons from Building Manus"[^manus]. Es el paper de context engineering con más influencia práctica del año pasado. No es académico al uso: explica los seis principios que aplicaban en producción procesando millones de tareas de usuario reales.

Cuatro de los seis principios (KV-cache hit rate, mask-don't-remove, avoid tool thrash, error preservation) tienen más que ver con el prompt y la API del modelo. Pero dos apuntan exactamente a lo que estamos discutiendo aquí:

### 2.1. "Use the file system as context"

El propio Manus lo escribe tal cual:

> Modern frontier LLMs now offer context windows of 128K tokens or more. But in real-world agentic scenarios, that's often not enough, and sometimes even a liability. […] That's why we treat the file system as the ultimate context in Manus: unlimited in size, persistent by nature, and directly operable by the agent itself.

El insight que se pierde cuando alguien cita esta frase en un tweet es la siguiente: **el filesystem no es storage, es memoria externa estructurada.** El agente no "guarda un archivo"; mueve parte de su working memory fuera de la ventana de contexto, donde no compite por attention.

El truco está en una restricción que pocos respetan: lo que compressas tiene que ser reversible. Si vas a tirar un PDF, quédate con la URL. Si vas a resumir un error, quédate con el comando que lo reprodujo. Manus lo aprendió por las malas.

### 2.2. "Attention manipulation through todo recitation"

Una tarea típica de agente son ~50 tool calls. A esa escala, el modelo pierde el goal. La solución de Manus es prosaicamente mala y por eso funciona: mantener un `todo.md` que el agente actualiza paso a paso.

> Manus combats this by having agents create and continuously update a `todo.md` file throughout execution, effectively reciting objectives into the model's recent attention window. This lightweight technique keeps goals salient without architectural changes.

"Recitar objetivos". No es un mecanismo elegante; es un truco de mnemónica que sobrevive 50 tool calls porque el archivo está en el prefill antes de cada decisión importante. Cuando preguntabas hace un año "¿por qué Manus parece tan centrado?" la respuesta estaba en este `todo.md`.


## 3. La implementación de referencia: OthmanAdi/planning-with-files v3.4.0

Las ideas de Manus eran un artículo de blog. `OthmanAdi/planning-with-files`[^pwf] es la implementación que las baja a tierra. La repo es MIT, tiene 24.8K estrellas, 200+ tests pasando, 18 plataformas con hooks nativos y un ritmo de release que ya va por la v3.4.0 (publicada el 5 de julio de 2026).

El patrón se reduce a tres archivos en el directorio del proyecto:

| Archivo | Propósito | Cuándo se actualiza |
|---|---|---|
| `task_plan.md` | Fases, progreso, decisiones, errores | Después de cada fase |
| `findings.md` | Investigación y descubrimientos | Tras cualquier hallazgo nuevo |
| `progress.md` | Log de la sesión, errores, tests | En cada turno |

Nada nuevo bajo el sol — Manus hace lo mismo con `todo.md`. Lo que `planning-with-files` añade son cuatro mecanismos que lo hacen operable:

### 3.1. Hooks PreToolUse que re-leen el plan antes de cada tool call

La parte no obvia. El `SKILL.md` configura un hook que, **antes de cualquier `Write`/`Edit`/`Bash`**, vuelca los primeros 30 líneas de `task_plan.md` al contexto. Esto convierte el plan en una especie de "prefill obligatorio" cada vez que el agente va a tomar una decisión destructiva.

Es el equivalente exacto de "attention manipulation through recitation" de Manus, pero automatizado. El agente no tiene que acordarse de releer el plan; el harness lo hace por él.

### 3.2. La regla 2-Action

> "After every 2 view/browser/search operations, IMMEDIATELY save key findings to text files."

Información multimodal (screenshots, PDFs leídos, resultados de búsqueda) se evapora del contexto rápido. Forzar que cada dos operaciones algo aterrice en `findings.md` previene el caso clásico: "vi esto hace veinte minutos pero ya no me acuerdo del dato".

### 3.3. El 5-Question Reboot Test

Si puedes responder cinco preguntas, tu context management está sano:

| Pregunta | Fuente de respuesta |
|---|---|
| ¿Dónde estoy? | Fase actual en `task_plan.md` |
| ¿Adónde voy? | Fases restantes |
| ¿Cuál es el goal? | Sección Goal del plan |
| ¿Qué he aprendido? | `findings.md` |
| ¿Qué he hecho? | `progress.md` |

Esto no es disciplina de boquilla. Es una métrica de cobertura: si falla alguna, sabes exactamente qué archivo te falta leer.

### 3.4. El opt-out v3.4.0 que el propio autor introdujo

En la release del 5 de julio (issue #195, reportado por `@marcmuon`), OthmanAdi metió `PLANNING_DISABLED=1`. El motivo, literal: bots one-shot de CI review y read-only research agents que comparten `cwd` con un plan a medias estaban siendo secuestrados — el contexto se inyectaba en su sesión, su output acababa redirigido a `progress.md`, y hasta se les añadía una fase "completada" encima.

La lección más honesta del skill está en esta nota de release, no en sus features. El autor conoce el modo de fallo. Cuando una herramienta incluye un escape hatch explícito para "no me uses para esto", es la mejor publicidad y la mejor crítica al mismo tiempo.


## 4. La prueba: qué dice el benchmark real (y qué no dice)

`docs/evals.md` en el repo documenta el benchmark con Anthropic's skill-creator framework. Las cifras, en limpio:

| Configuración | Pass rate | Asserts pasados |
|---|---|---|
| Con la skill | **96.7%** | 29/30 |
| Sin la skill | 6.7% | 2/30 |
| **Delta** | **+90 pp** | +27 asserts |

Y en A/B blind con tres comparadores independientes, **3/3 wins** para la versión con skill.

A primera vista parece demoledor. Hay que leer los caveats:

- **Las tareas estaban bien elegidas para el skill.** Los 5 evals (todo-cli, research frameworks, debug FastAPI, Django migration, CI/CD plan) tienen 3-7 fases cada uno y >5 tool calls. El propio SKILL.md dice "skip for: simple questions, single-file edits, quick lookups". Es el match perfecto entre problema y herramienta.
- **El overhead no es trivial.** En sus propias mediciones: **+68% tokens y +17% tiempo** vs. ejecutar sin la skill. La diferencia es disciplina estructurada contra improvisación. La disciplina cuesta.
- **Es un "encoded preference".** Los autores lo reconocen: la skill no sube una capacidad general del modelo, codifica un workflow concreto. Si tu forma de organizar el trabajo difiere de las tres carpetas del skill, el delta desaparece.

Esto NO prueba que la skill sea mejor que un Read bien hecho a mano. Demuestra que **para tareas donde el patrón de 3-archivos encaja**, el agente sigue el workflow con una fiabilidad casi perfecta. Es una validación del workflow, no del agente.


## 5. Los modos de fallo: este patrón NO es bala de plata

Tres riesgos reales que el repo documenta o que un vistazo crítico detecta.

### 5.1. Prompt injection amplification (audit proactivo v2.21.0)

La propia documentación reporta que en marzo de 2026 una auditoría proactiva identificó un vector serio: el hook PreToolUse re-lee `task_plan.md` antes de cada tool call — mecanismo que hace a la skill efectiva — pero si `WebFetch`/`WebSearch` están en `allowed-tools`, contenido web no confiable puede llegar al archivo y re-injectarse al contexto en cada tool use subsiguiente.

`Hardened in v2.21.0`: los quitaron de `allowed-tools` y añadieron una sección explícita "Security Boundary" al SKILL.md. Pero la lección de fondo se queda: cualquier arquitectura donde el plan vive en disco y se reinyecta automáticamente tiene que asumir que ese archivo es **high-value target para prompt injection**. La regla "escribe contenido externo solo a `findings.md`, nunca a `task_plan.md`" no es opcional.

### 5.2. Coste de tokens para tareas pequeñas

Los +68% de su benchmark no son gratis. Para una tarea de 5 tool calls con output corto, ese overhead puede duplicar el coste total sin que cambies la calidad del resultado. Es la misma lógica de aplicar garbage collection a un array de 3 elementos: técnicamente correcta, prácticamente estúpida.

### 5.3. Confundir "hacer más" con "hacer mejor"

El riesgo humano, no técnico. El workflow de 3 archivos invita a planificar siete fases para una tarea que solo necesitaba tres. Si tu agente está creando más estructura de la que el problema requiere, estás pagando el coste de planificación sin capturar su beneficio.

El indicador más honesto que vi en la doc: cuando un agente con skill termina y `task_plan.md` tiene fases marcadas `complete` que añadieron complejidad sin reducir el tiempo total, el skill no estaba haciendo su trabajo.


## 6. La decisión: cuándo SÍ, cuándo NO

El checklist de un vistazo:

**ÚSALO cuando:**

- La tarea tiene 5+ tool calls reales por venir.
- Hay fases distinguibles que se completan en momentos distintos.
- El `/clear`, el crash o el cierre de sesión es probable (sesión larga, machine reiniciable, agente que se mata).
- Los errores reaparecen en iteraciones distintas.
- Múltiples agentes (humano + agente, o varios subagentes) van a tocar el mismo estado.

**NO LO USES para:**

- One-shot CI review bots o read-only research agents (el propio autor añade `PLANNING_DISABLED=1` por esto).
- Cambios dentro de un solo archivo que no requieren coordinación.
- Debugging trivial donde la siguiente acción es obvia.
- Cuando el coste de mantener los 3 archivos al día supera al beneficio de tenerlos.

**La decisión real, sin rodeos:** ¿la tarea tiene memoria distribuida o no? Si tu problema cabe holgadamente en la ventana de contexto y la próxima acción es obvia, este patrón te sobra. Si el agente va a perder de vista lo que hizo hace 30 minutos, te falta.


## 7. Lo que ya existía antes (y por qué no te lo conté al principio)

El patrón no es nuevo. Tres referencias que ya estaban ahí cuando `planning-with-files` apareció:

- **`obra/superpowers`** — implementa el mismo patrón desde la otra dirección: plan-as-tool, donde el plan se convierte en artefacto estructurado que se invoca. Más rígido, mejor para código formal; menos flexible que el `task_plan.md` libre.
- **LangChain OpenWiki** — automáticamente mantiene docs sobre tu codebase, no un plan sobre tu tarea. Complementa, no sustituye.
- **Mnemosyne y memorias estructuradas externas** — más pesadas, orientadas a largo plazo entre sesiones. Mejor si lo que quieres persistir son hechos, no trabajo-en-curso.

`planning-with-files` no inventó el patrón. Lo bajó a una skill instalable con un benchmark honesto y un opt-out explícito. Eso no es poco.


## 8. Quickstart: probarlo en 15 minutos sin comprometerte

Si llegaste hasta aquí y quieres verificar la teoría por ti mismo:

```bash
# 1. Instalar la skill en tu agente (Claude Code mostrado)
npx skills add OthmanAdi/planning-with-files

# 2. Lanzar una tarea multi-fase real
#    (sustituye esto por algo que tengas entre manos)
claude "migra el módulo src/payments/stripe.ts a TypeScript estricto
        y añade tests unitarios para los caminos críticos"

# 3. A los 10 minutos, matar la sesión a propósito:
#    Ctrl+C, o cerrar el terminal, o esperar a que el contexto llegue al 80%

# 4. Volver a invocar la misma skill en la misma sesión / proyecto
claude "retoma donde lo dejaste"

# 5. Comprobar:
#    - ¿Recuperó el plan de task_plan.md?
#    - ¿Sabía qué phases completó y cuáles le faltan?
#    - ¿Cuántos tokens de contexto le hizo releer el harness?
```

El paso 3 es el test definitivo. Si el agente retoma exactamente donde lo dejaste sin pedirte que repitas el contexto, el patrón ha justificado su instalación. Si tienes que reexplicarle la tarea, vuelve a la sección 6 y reconsidera si era candidato.


## 9. Conclusión: el patrón sobrevive más allá de su autor

Tres ideas para llevarte.

**El patrón es anterior a `planning-with-files` y le sobrevive.** La regla "disk is the ultimate context" es de Manus. La regla "recite objectives periodically" es de Manus. Lo que esta implementación añade es volumen: la bajó a un `SKILL.md` con 200+ tests, benchmarks públicos y un opt-out honesto. Si mañana OthmanAdi deja el proyecto, otra implementación cubrirá el mismo nicho — porque el problema (la ventana de contexto se degrada) no se va a ir.

**La industria está convergiendo, no innovando.** Lo que parecía pioneering cuando Manus lo publicó en julio de 2025 ya está siendo adoptado por otros: filesystem-as-memory, periodic recitation, error preservation. Anthropic lo trata en su documentación oficial como parte de la higiene mínima de un agent harness. Lo que sigue abierto es el siguiente paso: ¿estos patrones migran a un estándar formal (RFC, equivalente IETF para agent harnesses) o siguen siendo folklore que cada vendor implementa a su manera?

**Por qué importa para CSS.** Llevamos seis meses diciendo que el harness vale más que el modelo. Esto es la misma verdad a otra escala: cuando el harness gestiona bien la memoria, el modelo mediocre rinde como el bueno. La diferencia entre un coding agent que te abandona a los 30 minutos y otro que termina la tarea es, en gran parte, si alguien decidió poner el estado en disco en lugar de en context window.

Pruébalo. Si no funciona para tu flujo, al menos sabrás por qué Manus tenía razón.


## Referencias

[^manus]: Manus team, "Context Engineering for AI Agents: Lessons from Building Manus", 18 de julio de 2025. https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus

[^rot-torres]: Teresa Torres, "Context Rot: Why AI Gets Worse the Longer You Chat", Product Talk, 4 de febrero de 2026. https://www.producttalk.org/context-rot/

[^liu]: Liu et al., "Lost in the Middle: How Language Models Use Long Contexts", arXiv:2307.03172 (original); aplicado y refinado en literatura posterior sobre degradación de atención por longitud de contexto.

[^pwf]: OthmanAdi, "planning-with-files" v3.4.0, MIT, julio 2026. Repo: https://github.com/OthmanAdi/planning-with-files — `docs/evals.md` para los benchmarks citados; `SKILL.md` para el patrón operativo.

[^rot-anthropic]: Anthropic engineering, "Effective context engineering for AI agents", febrero 2026. Citado por Teresa Torres (2026) como reconocimiento oficial del fenómeno por parte del vendor del modelo; URL exacta no pública en el momento de escribir este artículo (mencionado en la conversación y en algunos extractos de su documentación para developers).
