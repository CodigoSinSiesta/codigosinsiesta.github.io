---
title: "El stack de infraestructura para coding agents en 2026: schema, routing, framework y economía de tokens"
description: "LangChain y OpenAI ya no bastan. En 2026, cualquier setup serio de coding agents necesita cuatro capas resolviendo problemas distintos: contratos de salida, traducción entre APIs, framework de aplicación y recorte del contexto. Repaso por las piezas OSS más veteranas y más recientes del momento."
fecha: 2026-08-12
tags: ["ia", "agentes", "infraestructura", "llm", "baml", "switchyard", "embabel", "rtk"]
tipo: ensayo
autor: "Alejandro de la Fuente"
---

Hace un año, montar un coding agent era cuestión de tres líneas: eliges modelo, eliges framework, eliges prompt. Hoy esa simplicidad se ha evaporado. En su lugar hay un ecosistema que se parece más al de una plataforma backend tradicional —con su capa de esquemas, su capa de traducción de protocolos, su capa de aplicación y su capa de costes— que al script minimalista que arrancó todo esto.

Este artículo es un mapa de las cuatro capas que necesitas si quieres que tu setup agent aguante producción más de un trimestre. No es un tutorial. Es la respuesta a una pregunta que llevo semanas haciéndome: **¿qué huecos quedaron entre LangChain y el LLM, y quién los está cubriendo?**

La respuesta corta: cuatro huecos, cuatro categorías de herramientas, todas ellas con tracción real en 2026.

## El problema que ya tienes y no ves

Si tu coding agent actual es "LangChain + OpenAI directo" o "Claude Code apuntando a Anthropic", tienes tres puntos ciegos que probablemente no has cuantificado:

1. **No controlas el contrato de salida.** Le pides al LLM que devuelva un JSON con campos concretos. Te devuelve algo parecido, con un campo que sobra, otro que falta, y el tipo mal en un porcentaje variable de los casos (medido en benchmarks de tool calling entre 5-15% según el modelo y la complejidad del schema). Le añades un retry. El retry cuesta tokens. Los tokens cuestan dinero. Nadie mira ese porcentaje hasta que se convierte en un caso de soporte.
2. **No controlas el modelo que responde.** Cuando Anthropic tiene outage, tu agente se para. Cuando OpenAI deprecia un modelo, refactorizas el código. Si quieres cambiar de proveedor porque bajó el precio, descubres que cada agente habla su propia API.
3. **No controlas el contexto que le llega al LLM.** Tu agente ejecuta `git status` y el output ocupa 400 tokens. Ejecuta `cargo test` y le llegan 4.000 líneas de output que el agente tiene que masticar. Cada interacción cuesta más de lo que debería.

Ninguno de los tres es un fallo del modelo. Son huecos del stack. Y en 2026 ya hay piezas OSS que los cubren, una por capa.

## Las cuatro capas

El stack mínimo de un coding agent serio en 2026 tiene esta forma:

```
[framework de aplicación]   ← Embabel / LangGraph / LangChain
        ↓
[capa de routing]            ← Switchyard / LiteLLM
        ↓
[capa de schema/contrato]    ← BAML / instructor / lm-format-enforcer
        ↓
[proveedor LLM]              ← Anthropic, OpenAI, vLLM, Ollama
        ↓
[capa de economía de tokens] ← rtk (recorta output de bash)
```

Las cuatro capas son ortogonales entre sí. Puedes empezar por una y añadir las demás cuando duela. Y la mayoría de setups que conozco hoy solo tienen la del framework — por eso fallan en producción.

---

## Capa 1 — Schema y contrato: BAML como DSL de agentes

[`BoundaryML/baml`](https://github.com/BoundaryML/baml) (8.927★, Apache-2.0, creado en 2023) es el veterano del grupo. Tres años sin venderse, sin pivotes, sin hype. Es un lenguaje de programación específicamente diseñado para que un LLM cometa menos errores al devolverte datos estructurados.

El ángulo es este: en lugar de pedirle al modelo "dame un JSON con estos campos", declaras una función en BAML con tipos como los de Rust. BAML genera automáticamente la gramática que constrains al modelo a emitir solo outputs válidos. Cuando el modelo invoca tu función, los argumentos llegan ya tipados, validados, listos para usar en Python, TypeScript, Go, Ruby, Java o C#.

```baml
// excerpt.baml
function ClassifySupportTicket(ticket: string) -> Category {
  category Category {
    area "billing" | "technical" | "account" | "other"
    urgency 1 | 2 | 3 | 4 | 5
    needs_human bool
  }

  client GPT4
  prompt #"
    Classify this support ticket:
    {{ ticket }}

    {{ ctx.output_format }}
  "#
}
```

Lo que el código de arriba declara: una función `ClassifySupportTicket` que toma texto, devuelve un objeto con tres campos (área, urgencia 1-5, y un booleano). El LLM nunca puede devolver `urgency: "alta"` o `urgency: 7` — la gramática generada por BAML lo bloquea a nivel de token. Tu código Python recibe un objeto tipado, no un `dict` que validar a mano.

**Por qué importa para tu setup.** El problema del JSON que casi encaja está resuelto por docenas de librerías — `instructor` en Python, `lm-format-enforcer`, `outlines`, `guidance`. BAML no es la única solución. Es la más veterana, la que más lenguajes de salida cubre, y la que integra un framework de tests y un DSL completo en vez de ser una librería de validación.

### Quick start aislado (solo BAML)

```bash
# Instalar
brew install baml

# En tu proyecto Python
pip install baml-py

# Inicializar y declarar una función
baml init
# Editar baml_src/main.baml con la función ClassifySupportTicket
baml generate
```

```python
from baml_client import b
result = b.ClassifySupportTicket(ticket="Llevo 3 días sin acceso")
print(result.urgency)  # -> 3
```

Si esto funciona, tienes la capa 1 funcionando en 10 minutos. Si no, el problema está en tu instalación de BAML, no en el resto del stack.

**Cuándo no lo necesitas.** Si solo tienes 2-3 funciones tipadas y la mayoría de las llamadas las haces con `gpt-4o-mini`, `instructor` en Python hace lo mismo con menos ceremonia. BAML brilla cuando tienes docenas de funciones y necesitas generar clientes a varios lenguajes.

---

## Capa 2 — Routing y traducción: Switchyard como proxy institucional

[`NVIDIA-NeMo/Switchyard`](https://github.com/NVIDIA-NeMo/Switchyard) (656★, Apache-2.0, **pre-alpha** — estado del proyecto más temprano que alpha; API y comportamiento pueden cambiar sin aviso) es el recién llegado.

El hueco que cubre: cuando lanzas Claude Code, Codex CLI o cualquier coding agent, ese agente habla una API concreta (Anthropic Messages, OpenAI Chat Completions, OpenAI Responses). Si quieres que el request termine siendo servido por un modelo OSS local — vLLM (motor de inferencia open source), NVIDIA NIM (microservicio de inferencia optimizado para GPUs NVIDIA), Ollama (runner local de modelos) — necesitas un proxy que traduzca entre formatos. Switchyard hace exactamente eso, con un plus: registra métricas Prometheus (estándar de facto para monitorizar servicios en producción) y soporta varios algoritmos de routing componibles.

```bash
# instalar
uv tool install --python 3.12 "nemo-switchyard[cli]"

# configurar OpenRouter (agregador que da una sola API para acceder a
# múltiples proveedores LLM: Anthropic, OpenAI, Google, etc.)
export OPENROUTER_API_KEY="sk-or-..."
switchyard launch claude --model switchyard

# lanzar Codex a través del mismo proxy
switchyard launch codex --model switchyard
```

El caso de uso real: tienes un equipo de desarrolladores. Una parte usa Claude Code, otra usa Codex CLI, otra usa OpenClaw (el espacio personal AI assistant). Cada uno configurado para hablar con su proveedor por defecto. Cuando un proveedor tiene un incidente, todos se paran. Cuando un proveedor sube precios, todos refactorizan.

Con Switchyard delante, todos apuntan al mismo endpoint (`http://localhost:4000`). Cambias un TOML y el 80% del tráfico va a Anthropic, el 20% a un modelo local. El día que Anthropic tiene outage, rotas a OpenRouter con un cambio de config. Cada agente sigue hablando su API nativa; Switchyard traduce.

**El caveat importante.** Switchyard está explícitamente marcado como **pre-alpha**. El README dice literalmente: "Experimental software. Not for production use". La API va a cambiar antes de 1.0.

**Comparación con la competencia.** [`BerriAI/litellm`](https://github.com/BerriAI/litellm) lleva dos años haciendo esto en Python, tiene más de 10.000 estrellas y una tracción muy superior a la de Switchyard a día de hoy (656★ es el 5-6% de LiteLLM). Lo que Switchyard aporta sobre LiteLLM: implementación en Rust (latencia más baja, menor overhead) y el respaldo institucional de NVIDIA. Compra Switchyard si la latencia de proxy o la supervivencia a largo plazo del vendor te importan más que la estabilidad inmediata. Para la mayoría de equipos Python hoy, LiteLLM es la opción más segura.

### Quick start aislado (solo Switchyard)

Necesitas tres cosas: la tool instalada, una clave de API válida, y un fichero `routes.toml`. La sintaxis real de Switchyard es más rica que LiteLLM; la documentación oficial está en `docs/getting_started.md` del repo.

```toml
# routes.toml — ejemplo mínimo con primaria Anthropic + fallback OpenRouter
# Cada bloque [model.<id>] define un target concreto al que Switchyard sabe hablar.

[model.claude-sonnet]
provider = "anthropic"
api_key = "${ANTHROPIC_API_KEY}"   # se lee de la variable de entorno

[model.openrouter-mix]
provider = "openai_compatible"
base_url = "https://openrouter.ai/api/v1"
api_key = "${OPENROUTER_API_KEY}"

[route.default]
# Passthrough: enruta todo al modelo "claude-sonnet".
# Cambia el target a "openrouter-mix" para hacer fallback.
type = "passthrough"
target = "claude-sonnet"

[route.fallback]
# Si "default" devuelve error, enruta a OpenRouter.
type = "passthrough"
target = "openrouter-mix"
```

```bash
# arrancar el proxy
export ANTHROPIC_API_KEY="sk-ant-..."
export OPENROUTER_API_KEY="sk-or-..."
switchyard-server --config routes.toml --host 127.0.0.1 --port 4000

# en otra terminal: verificar
curl http://localhost:4000/health
```

**Variables de entorno por coding agent.** Switchyard soporta los agentes más comunes pero cada uno necesita su variable apuntando al proxy:

| Coding agent | Variable de entorno | Notas |
|---|---|---|
| Claude Code | `ANTHROPIC_BASE_URL=http://localhost:4000` | Conserva `ANTHROPIC_API_KEY` o usa la del proxy |
| Codex CLI | `OPENAI_BASE_URL=http://localhost:4000/v1` | Más `OPENAI_API_KEY` apuntando a una clave dummy |
| OpenClaw | Sigue la convención OpenAI | `OPENAI_BASE_URL` |
| Gemini CLI | `GOOGLE_API_BASE` o `OPENAI_BASE_URL` según modo | Ver docs |

Si esto funciona y `curl http://localhost:4000/health` responde `200 OK`, tienes la capa 2 funcionando. Si no, el problema está en `routes.toml` o en las variables de entorno.

---

## Capa 3 — Framework de aplicación: Embabel como respuesta JVM

[`embabel/embabel-agent`](https://github.com/embabel/embabel-agent) (4.175★, Apache-2.0) es la pieza que más me ha hecho pensar este mes.

El dato relevante: Rod Johnson, autor de Spring, lidera el proyecto. Spring es el framework que sostiene la mayor parte del enterprise Java del planeta. Cuando un perfil así decide construir un framework de agentes para JVM, no es un random jugando a los wrappers de LangChain. El framework hereda los patrones de inyección de dependencias (el sistema te pasa los objetos que necesitas, no los buscas tú), AOP (puedes añadir comportamiento a métodos sin tocarlos) y transacciones de Spring. Eso le da una base sólida que otros frameworks de agentes no tienen.

El hueco que Embabel cubre es específico y real: **la mayoría de empresas grandes del mundo corren JVM**. Su código no está en Python. Su equipo no va a migrar a Python para usar LangChain. Y hasta ahora, las alternativas serias para ellos eran Semantic Kernel (de Microsoft, tira a .NET/C#) y Spring AI (de Pivotal/VMware, integración directa con Spring). Embabel es la apuesta más ambiciosa: un framework agent-native, no un wrapper de LLM sobre Spring.

> **Si tu equipo es 100% Python, sáltate esta sección.** Embabel no te concierne salvo que estéis evaluando mover carga a JVM. Para ti, LangChain, LangGraph o CrewAI son opciones equivalentes con menos fricción.

Lo que aporta técnicamente:

```kotlin
// El plan se formula dinámicamente, no lo escribes tú
@Agent
class TravelPlannerAgent {
    @Goal
    fun planTrip(request: TripRequest): TripPlan { /* ... */ }

    @Action
    fun searchFlights(origin: String, destination: String): List<Flight> { /* ... */ }

    @Action
    fun bookHotel(flight: Flight): Hotel { /* ... */ }
}
```

El framework usa GOAP (Goal Oriented Action Planning) por defecto. GOAP es un algoritmo clásico de planificación que viene de los juegos: tú declaras un estado actual, una meta, y un conjunto de acciones con precondiciones y efectos. El algoritmo busca la secuencia de acciones que lleva del estado actual a la meta. A diferencia de ReAct (donde el LLM decide paso a paso qué hacer y razona sobre cada observación) o plan-and-execute (donde un LLM genera un plan completo upfront), GOAP busca el plan dinámicamente usando un algoritmo determinista — el LLM solo se invoca para ejecutar las acciones que requieren comprensión, no para decidir el orden. Esto lo hace más robusto y barato cuando las acciones tienen efectos claros sobre el estado.

**Por qué importa para enterprise.** Tres cosas que el stack Python no te da gratis:

1. **Tipado fuerte.** Acciones, metas, condiciones y planes están todos tipados. Refactor seguro. Si cambias el dominio, el compilador te dice qué acciones quedan rotas.
2. **Integración nativa con Spring.** Inyección de dependencias, AOP, transacciones, persistencia. Todo lo que ya tienes en tu stack funciona.
3. **Modos de ejecución.** Focused (codriven), Closed (clasificación a un agente), Open (la plataforma busca el goal y construye el agente). Open mode es el más potente y el menos determinista; usa con cuidado.

**Cuándo no lo necesitas.** Si tu equipo es de tres personas en Python, Embabel no compite con LangChain ni tiene por qué. Embabel brilla cuando tienes 50 desarrolladores Java y necesitas que adopten agentes sin tirar el stack actual.

---

## Capa 4 — Economía de tokens: rtk como proxy de salida

[`rtk-ai/rtk`](https://github.com/rtk-ai/rtk) (75.861★, Apache-2.0) ha crecido de forma sostenida: de 72.400 a 75.800 estrellas en tres días a mediados de agosto de 2026.

El problema es simple y cuantificable. Cuando tu coding agent ejecuta `git status`, el output es razonable. Cuando ejecuta `cargo test` y hay 200 tests pasando, el output son 4.000 líneas de ruido. Cuando ejecuta `ls -la` en un repo grande, son 800 entradas. Cada una de esas líneas va al contexto del LLM. Cada token cuenta.

rtk se interpone entre el shell y el agente y filtra el output antes de que llegue al contexto:

```bash
# instalar
brew install rtk

# activar para Claude Code
rtk init -g
rtk init -g --codex
rtk init -g --gemini
rtk init --agent hermes       # ← funciona con Hermes
rtk init --agent cursor
```

A partir de ese momento, cuando el agente ejecuta `git status`, rtk reescribe el comando a `rtk git status` antes de pasarlo al shell. El output que vuelve al contexto es compacto:

| Comando sin rtk | Con rtk |
|---|---|
| `git status` | Stat por estado, agrupado |
| `ls -la` | Tree con contadores |
| `cat archivo_largo.py` | Solo signatures y estructura |
| `cargo test` (200 OK) | "200 passed" |
| `pytest` (mismos) | "12 passed" + traceback de los que fallan |

La métrica que cita el README de rtk: hasta un 90% de reducción del output de bash. Pero el propio repo aclara (en `docs/guide/resources/savings-explained.md`): **esa cifra mide reducción del output de bash, no reducción de la factura completa**. El output de bash es un input más; el sistema prompt, el historial y el output del modelo también cuentan. La reducción real de factura es menor. Aún así, en un setup donde cada sesión cuesta 2-5€ en tokens, recortar un 30-50% del input no es trivial.

**Por qué importa más de lo que parece.** Los modelos grandes de 2026 son buenos ignorando ruido. Pero "buenos ignorando ruido" no es "gratis ignorar ruido". El README de rtk afirma que recortar el ruido también sube la calidad de las respuestas, especialmente en sesiones largas. Es plausible — más señal por token dedicado a la ventana de contexto debería ayudar al modelo a enfocarse — pero es un claim de marketing, no un benchmark publicado. Tómalo como hipótesis a validar con tus propias métricas, no como hecho.

**Cuándo no lo necesitas.** Si ejecutas comandos de forma interactiva y no con un agente, rtk te estorba (el output recortado es menos legible para humanos). Si tu agente hace dos comandos por sesión, el ROI es marginal. Si tu agente hace 50+ comandos por sesión, rtk es la palanca con más retorno por hora invertida de toda la lista.

---

## Cómo se conectan las cuatro capas

Un setup mínimo que cubra las cuatro, end-to-end, en local:

```bash
# 1. Instalar rtk y activarlo para tu coding agent
brew install rtk
rtk init --agent claude

# 2. Arrancar Switchyard como proxy
uv tool install --python 3.12 "nemo-switchyard[cli]"
export OPENROUTER_API_KEY="..."
switchyard-server --config routes.toml --host 127.0.0.1 --port 4000

# 3. Apuntar Claude Code a Switchyard
export ANTHROPIC_BASE_URL=http://localhost:4000
claude

# 4. Declarar tus funciones con BAML
baml init
# editar baml_src/main.baml con tus funciones
baml generate

# 5. Importar desde Python
# from baml_client import b
# result = b.ClassifySupportTicket(ticket="...")
```

El flujo: Claude Code habla Anthropic Messages → Switchyard traduce a OpenAI Chat Completions → el modelo (vLLM, Ollama, OpenAI, Anthropic directo vía OpenRouter) responde → Switchyard traduce de vuelta → BAML valida la estructura final → rtk recortó el output de bash que llenó el contexto.

Cuatro capas independientes. Cada una se puede quitar o sustituir sin romper las demás.

## El grafo de infraestructura que se está formando

Si te paras a mirar el trending de GitHub en las últimas semanas, la categoría "infraestructura para coding agents" se ha consolidado con nombres reconocibles:

| Capa | Veteranos 2024 | Recién llegados 2026 |
|---|---|---|
| Schema/contrato | instructor, outlines, guidance | **BAML** (8.9k★) |
| Routing | LiteLLM, Portkey | **Switchyard** (NVIDIA oficial), codex-router |
| Framework | LangChain, LangGraph, CrewAI, AutoGen | **Embabel** (JVM), OpenClaw, Waku |
| Economía de tokens | (vacío) | **rtk** (75k★, 0→75k en meses) |

Lo que me llama la atención es la fila de abajo. **rtk ha popularizado una categoría que no existía**: el proxy de salida para reducir el coste por sesión del agente. Antes de rtk, la conversación sobre reducir tokens se centraba en prompts más cortos o modelos más baratos; nadie había puesto el foco en el output de bash. El éxito del repo demuestra que el hueco existía — y que la solución obvia en retrospectiva ("recortar el output antes de que llegue al contexto") resuelve un problema real.

Y la fila del framework: la JVM por fin tiene una respuesta seria, y OpenClaw/Waku entran como alternativas desktop-first al stack web (LangGraph Studio, AgentKit). El espacio se está diversificando.

## Cuándo NO necesitas este stack

Honestidad. La mayoría de proyectos personales y prototipos no necesitan nada de esto. Si tu agente hace 5-10 llamadas al LLM por sesión, con funciones simples, y no tienes usuarios reales pendientes del coste, te basta con:

- `instructor` (Python) en vez de BAML
- Nada en vez de Switchyard (apunta directo al proveedor)
- LangChain en vez de Embabel
- Nada en vez de rtk

**Caso concreto del lector probable:** equipo de 6-12 devs Python con mix OpenAI + Anthropic, sin presupuesto para JVM ni para Rust. Tu setup mínimo sensato hoy es:

- BAML o `instructor` para las 5-10 funciones críticas (las que afectan a datos de usuarios o que llaman APIs externas).
- LiteLLM como proxy (no Switchyard): más tracción, Python-native, API estable.
- LangChain o LangGraph como framework de aplicación (no Embabel: irrelevante en Python).
- rtk como capa de ahorro de tokens. Esta sí aplica a todo el mundo.

Eso te da el 80% del valor con piezas estables. Switchyard y Embabel son para cuando ya tienes lo anterior funcionando y el problema siguiente es otro: outage de proveedor (entonces evalúas Switchyard) o mover carga a JVM (entonces evalúas Embabel).

La señal de que necesitas el stack completo es una combinación de:

- **Volumen.** Más de 50 invocaciones LLM al día, o sesiones largas (multi-turn con historial).
- **Criticidad.** El output del agente afecta a usuarios reales (no solo a ti en un script).
- **Coste.** Estás viendo la factura subir y necesitas optimizarla sin cambiar de modelo.
- **Volatilidad.** Has tenido un outage de proveedor en los últimos 6 meses que te costó algo.

Si marcas dos o más de esas, el stack vale la pena. Si no, estás añadiendo complejidad por adelantado.

## Roadmap incremental

La mayoría de setups no necesitan las cuatro capas desde el día uno. La progresión natural que veo en equipos reales:

**Crawl (1-2 días):** Empieza con **rtk** solo. Instalación de 5 minutos, beneficio inmediato en sesiones largas. Si usas Claude Code, Codex, Cursor, Windsurf o Hermes, `rtk init` te lo activa.

**Walk (1 semana):** Añade **BAML** o `instructor` para tus 5-10 funciones más críticas. Las que invocan APIs externas, las que afectan a tu base de datos, las que tienen branches de error no triviales. Deja las funciones simples (resúmenes, clasificaciones binarias) con JSON prompting normal.

**Run (1-2 semanas):** Añade **Switchyard** o LiteLLM como proxy. Configura dos rutas: primaria (proveedor principal) y fallback (proveedor secundario o modelo local). Activa métricas Prometheus. Ahora tienes visibilidad de qué se gasta y dónde.

**Run+ (1 mes):** Migra el framework a **Embabel** (si JVM) o consolida en LangGraph (si Python). En este punto ya tienes cuatro capas y un sistema que aguanta producción.

## Modos de fallo y mitigaciones

**Fallo 1: BAML genera gramáticas que rechazan outputs válidos.**
Síntoma: tu agente falla más a menudo con BAML que sin él. Causa: la gramática generada es demasiado estricta para tu caso. Mitigación: usa `Field` para relajar constraints; empieza con solo `description` y ve añadiendo constraints de uno en uno.

**Fallo 2: Switchyard añade latencia perceptible.**
Síntoma: el agente tarda más en responder. Causa: dos saltos HTTP en vez de uno (agente → proxy → modelo). Mitigación: corre Switchyard en el mismo host, sin red. La latencia añadida debería ser <5ms. Si no, hay un bug.

**Fallo 3: Embabel en modo Open genera planes absurdos.**
Síntoma: el agente invoca acciones en un orden que no tiene sentido. Causa: el dominio tiene metas ambiguas o acciones con efectos secundarios no modelados. Mitigación: empieza en modo Focused o Closed, no Open. Open es para cuando ya conoces bien tu dominio.

**Fallo 4: rtk rompe comandos que tu agente ejecuta.**
Síntoma: el output filtrado pierde información que el agente necesita. Causa: rtk no conoce ese comando y lo pasa tal cual, o lo conoce pero filtra demasiado. Mitigación: usa `rtk read` o `rtk find` directamente cuando necesites el output completo; o añade un wrapper específico.

## Cierre

El ecosistema de coding agents en 2026 ya no es "framework + LLM". Es cuatro capas resolviendo problemas distintos, cada una con su propia historia y su propio vendor. BAML lleva tres años cubriendo el nicho de DSL para agentes. Switchyard lleva meses como el proxy institucional de NVIDIA (con todas las caveats de pre-alpha). Embabel lleva uno como la respuesta JVM al stack Python. rtk ha demostrado que la categoría "recorte del output de bash" tenía demanda real.

Si tu setup actual tiene solo la capa de framework, no estás tarde. Pero cada mes que pasa, los huecos que cubren las otras tres capas cuestan más dinero y más tiempo de depuración. La pregunta no es si adoptarlas. Es en qué orden.

Y si tu setup ya tiene las cuatro: probablemente no necesitas leer este artículo. Probablemente lo escribiste tú.

---

## Apéndice — Resumen de las cuatro piezas

| Pieza | Capa | ★ | Licencia | Madurez | Instalación |
|---|---|---|---|---|---|
| [BAML](https://github.com/BoundaryML/baml) | Schema/contrato | 8.927 | Apache-2.0 | Estable (3 años) | `brew install baml` |
| [Switchyard](https://github.com/NVIDIA-NeMo/Switchyard) | Routing | 656 | Apache-2.0 | Pre-alpha | `uv tool install "nemo-switchyard[cli]"` |
| [Embabel](https://github.com/embabel/embabel-agent) | Framework JVM | 4.175 | Apache-2.0 | Estable (1 año) | Maven Central: `com.embabel.agent:embabel-agent-api` |
| [rtk](https://github.com/rtk-ai/rtk) | Economía de tokens | 75.861 | Apache-2.0 | Estable | `brew install rtk` |

Estrellas verificadas vía GitHub REST API el 2026-08-12. Madurez cualitativa basada en el README de cada proyecto. "Maven Central" (en la fila de Embabel) es el repositorio de paquetes estándar de JVM, equivalente a PyPI para Python.
