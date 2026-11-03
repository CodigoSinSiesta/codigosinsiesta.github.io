---
title: "ThinkWatch Lite vs LiteLLM vs OpenRouter: tres caminos para correr múltiples coding agents"
description: "Cuando tienes Claude Code + Codex + Hermes + Aider + Cursor en la misma máquina, el .env de 200 líneas no escala. Tres gateways OSS/OSS-friendly más un SaaS — decisión ladder con énfasis en seguridad."
fecha: 2026-10-02
tags:
  - ia
  - coding-agents
  - gateway
  - multi-agent
  - seguridad
tipo: investigacion
estado: pendiente-revision
autor: "Alejandro de la Fuente"
---

> **Qué vas a leer aquí:** un mapa 2026-Q4 de gateways pensados para correr varios coding agents a la vez. Tres OSS reales (ThinkWatch Lite, LiteLLM, el agent toolkit de AWS) más un SaaS (OpenRouter) y una **escalera de decisión** según escala y requisitos de seguridad. No es un comparativa de benchmarks: es un mapa de qué cubre cada uno, qué NO cubre, y cuándo tiene sentido combinar varios. Incluye advertencias sobre el caso CSS (Código Sin Siesta) con Hermes Agent y un caveat legal sobre LiteLLM.

## Índice

1. [El problema real: tu .env ya no escala](#1-el-problema-real-tu-env-ya-no-escala)
2. [Qué es un gateway para coding agents (y qué no es)](#2-qué-es-un-gateway-para-coding-agents-y-qué-no-es)
3. [El mapa 2026-Q4: cuatro caminos, no tres](#3-el-mapa-2026-q4-cuatro-caminos-no-tres)
4. [ThinkWatch Lite: el gateway local-first con protección activa](#4-thinkwatch-lite-el-gateway-local-first-con-protección-activa)
5. [LiteLLM: el servidor HTTP con 100+ modelos y 60k estrellas](#5-litellm-el-servidor-http-con-100-modelos-y-60k-estrellas)
6. [OpenRouter: el SaaS OpenAI-compatible sin infraestructura](#6-openrouter-el-saas-openai-compatible-sin-infraestructura)
7. [aws/agent-toolkit-for-aws: el gateway cloud-oficial de AWS](#7-awsagent-toolkit-for-aws-el-gateway-cloud-oficial-de-aws)
8. [La escalera de decisión: cinco casos según escala y seguridad](#8-la-escalera-de-decisión-cinco-casos-según-escala-y-seguridad)
9. [La capa de seguridad de ThinkWatch Lite: por qué no es "solo routing"](#9-la-capa-de-seguridad-de-thinkwatch-lite-por-qué-no-es-solo-routing)
10. [El caso CSS: ThinkWatch Lite y Hermes Agent](#10-el-caso-css-thinkwatch-lite-y-hermes-agent)
11. [Caveats y letra pequeña](#11-caveats-y-letra-pequeña)
12. [Recomendación: combinación por caso, no reemplazo universal](#12-recomendación-combinación-por-caso-no-reemplazo-universal)
13. [Alternativas que no cubrimos](#13-alternativas-que-no-cubrimos)
14. [Apéndice: tabla maestra y datos verificados](#14-apéndice-tabla-maestra-y-datos-verificados)

---

## 1. El problema real: tu .env ya no escala

Si trabajas con coding agents, probablemente ya tienes este escenario en la cabeza:

- Claude Code con su `ANTHROPIC_API_KEY`
- Codex con `OPENAI_API_KEY`
- Hermes Agent con su `~/.hermes/config.yaml` y otro provider
- Aider leyendo de `~/.aider.model.settings.yml`
- Cursor tirando de su propia cuenta
- Un script ocasional que llama a Gemini o a un modelo local en Ollama
- Algún experimento con Z.ai, DeepSeek, Grok o Qwen

Y de pronto tienes 200 líneas de variables de entorno, tres clientes que se pelean por el puerto 8080 cuando arrancas algo de Open WebUI, y ningún sitio donde ver cuánto has gastado este mes. El mes pasado yo migré entre tres proyectos, perdí media hora, y decidí que ya estaba bien.

**El problema no es "tener varios clientes".** Tener varios clientes es una decisión correcta. El problema es que **cada cliente gestiona su propia configuración de upstream de forma independiente**, y eso no escala:

- Cambiar de modelo en cinco sitios es cinco operaciones manuales.
- Si rotas una API key, tienes que rotarla en N clientes.
- Si un upstream empieza a devolver respuestas malas, no lo sabes hasta que el agente se queja (o no se queja).
- Si un relay (OpenRouter, Z.ai, proxies) ve un request con tu `OPENAI_API_KEY` en el header, ya lo vio.
- Si un tool call malicioso viene dentro de una respuesta (descarga-y-ejecuta, lee claves, instala startup), el cliente lo ejecuta sin que el usuario se entere hasta que es tarde.

**Lo que necesitas es un gateway.** Un software que se sienta entre tus clientes y los modelos upstream, haga de intermediario, y de paso te dé cosas que cada cliente por separado no puede: routing entre modelos, failover, conversión entre formatos (Anthropic ↔ OpenAI ↔ Gemini), tracing de cada request, cost tracking, y — si tienes la suerte de usar la opción correcta — protección activa contra lo que el upstream pueda colar en las respuestas.

Hay tres caminos OSS y un SaaS. Vamos a ver cada uno con calma, sin hype y con datos verificados.

## 2. Qué es un gateway para coding agents (y qué no es)

Definamos el término antes de empezar, porque hay productos que se llaman "gateway" y no lo son.

**Un gateway para coding agents es:**

- Un proceso (local o servidor HTTP) que recibe requests en formato X (típicamente OpenAI Chat Completions o Anthropic Messages) de uno o más coding clients.
- Las reenvía a un upstream (puede ser una API de modelo o un relay) transformando el formato si hace falta.
- Devuelve la respuesta al cliente, con posibles transformaciones a la inversa.
- Opcionalmente: registra cada request, calcula coste, enriquece con routing, failover, redaction, etc.

**Un gateway NO es:**

- Un IDE. Los coding clients (Claude Code, Cursor, Aider) son IDEs o clientes CLI. El gateway no compila tu código.
- Un agente. No toma decisiones. Solo enruta y, si tiene capa de seguridad, filtra.
- Un orquestador. No decide qué agente corre qué tarea. Eso es otro problema (LangGraph, Temporal, Inngest, etc.).
- Un proxy HTTP genérico. La diferencia es que entiende la semántica de los APIs de LLM (messages, tools, streaming, multimodal) y opera sobre ellos, no sobre bytes arbitrarios.

**Por qué importa ahora:** hasta 2024, la mayoría de la gente con un solo cliente no necesitaba un gateway. El cambio fue:

1. **Anthropic, OpenAI, Google y Bedrock tienen APIs distintos** (formato, parámetros, tokens contables). Si quieres usar tres modelos de tres vendors sin reescribir tu cliente, necesitas conversión.
2. **Coding agents proliferaron.** Claude Code, Codex, Cursor, Aider, Zed, opencode, Hermes, cada uno con su propia config. Mantener N archivos en sync es trabajo de mantenimiento, no de desarrollo.
3. **Relays comerciales crecieron.** OpenRouter, Z.ai, requesty.ai y similares prometen un endpoint para muchos modelos. Pero un relay ve todo tu tráfico en claro.
4. **Los tool calls empezaron a ser vectores de ataque.** Modelos con tool use ejecutan comandos en tu máquina. Si un upstream malicioso (o un prompt injection bien hecho) cuela un tool call peligroso, el cliente lo ejecuta. Necesitas un punto donde inspeccionar antes de ejecutar.

## 3. El mapa 2026-Q4: cuatro caminos, no tres

Aclaración inicial: el título del artículo dice "tres caminos" porque los tres son gateways comparables. Pero hay un cuarto que merece mención — el agent toolkit oficial de AWS — porque define el caso "todo en cloud, vendor oficial". Si tu organización ya está en AWS, es un dato relevante. Lo trato en su propia sección corta.

Tabla resumen (datos verificados el 2026-10-02 contra la API de GitHub):

| Repositorio | Estrellas | Forks | Licencia | Push | Forma de distribución |
|---|---:|---:|---|---|---|
| [ThinkWatchProject/ThinkWatch-Lite](https://github.com/ThinkWatchProject/ThinkWatch-Lite) | 465 | 6 | **MIT** | 2026-10-02 | App nativa (Tauri 2) para macOS / Windows / Linux + remote core opcional |
| [BerriAI/litellm](https://github.com/BerriAI/litellm) | 60.054 | 11.978 | **NOASSERTION** | 2026-10-02 | Servidor HTTP Python (con núcleo Rust y SDK Python) |
| [openrouter.ai](https://openrouter.ai) (SaaS, no OSS) | — | — | — | — | Servicio cloud, OpenAI-compatible |
| [aws/agent-toolkit-for-aws](https://github.com/aws/agent-toolkit-for-aws) | 2.785 | — | Apache-2.0 (verificar) | — | MCP servers + skills + plugins oficiales de AWS |

**Una observación antes de seguir.** Las cuatro soluciones tienen modelos de licenciamiento, distribución y nivel de madurez muy distintos:

- ThinkWatch Lite es el **recién llegado** (3 semanas, 465 estrellas, MIT, calver mensual), pero la arquitectura es seria.
- LiteLLM es el **estándar de facto** del lado servidor (60k estrellas, NOASSERTION, casi 3 años de desarrollo).
- OpenRouter es el **SaaS** que probablemente ya estés usando sin saberlo (muchos "modelos gratis" en otros productos son OpenRouter por debajo).
- AWS agent toolkit es el **vendor-oficial** para quien ya vive en la nube de Amazon.

Y aquí está la primera decisión interesante: **¿quieres software que correr tú, o software que ya corre para ti?** La respuesta depende mucho de cuántos usuarios van a usarlo, cuántos modelos necesitas, y qué nivel de control sobre los datos necesitas.

## 4. ThinkWatch Lite: el gateway local-first con protección activa

URL: <https://github.com/ThinkWatchProject/ThinkWatch-Lite>
Versión verificada: **2026.10.0** (cadencia mensual, calver)
Stack: Tauri 2 + React 19 + núcleo Rust
Licencia: **MIT** (verificado en `LICENSE`)
Edad del proyecto: creado 2026-09-12 (3 semanas a fecha de este artículo)
Estrellas/forks (API 2026-10-02): 465 / 6

> **TL;DR (qué aprenderé si leo esto):** ThinkWatch Lite es un gateway local que se sitúa entre tus coding clients (Claude Code, Codex, Hermes, Aider, etc.) y los APIs upstream. Su valor no es el routing — eso lo hace cualquiera. Su valor es la **capa de protección activa**: oculta tus API keys antes de que salgan de la máquina, corta tool calls peligrosos que un upstream malicioso haya podido colar, y rechaza prompt injections. Es el único de los tres que trata "el upstream puede ser hostil" como requisito de diseño, no como feature opcional.

### Lo que hace (verificado en el README y en el código del repo clonado)

**1. Conectividad una sola vez, switching libre después.** El gateway se conecta a tus 13 coding clients: Claude Code, Claude Desktop, Codex, opencode, Pi, oh-my-pi, Grok Build, Qwen Code, Hermes Agent, Zed, Aider, DeepSeek Harness. Cursor, Continue y Antigravity CLI vienen con instrucciones (no autoconfig). El cambio se previsualiza, se hace backup del archivo original, y siempre hay un restore.

**2. Multi-OS completo, no parcial:**

- macOS 12+ Apple silicon: `brew install --cask thinkwatchproject/tap/thinkwatch-lite` o DMG arm64.
- Windows 10 21H2+ x64 o ARM64: instalador `.exe`.
- Linux x86_64 o aarch64: `curl | sh` o AppImage.

**3. Remote core.** Esta es la pieza clave que mucha gente pasa por alto. El gateway puede correr en un **servidor Linux remoto**, y la app Tauri se conecta a él por un canal de control cifrado. Es decir: no es obligatorio que la "lógica del gateway" viva en tu laptop. Si quieres centralizar el gateway en un servidor de tu LAN y que las laptops solo ejecuten la UI, puedes. Es competitivo con LiteLLM para setups de equipo pequeño.

**4. Protección contra relays.** Esta es la capa de seguridad que diferencia a ThinkWatch Lite, y por la que le dedico una sección entera más adelante (sección 9). Por ahora: **outbound redaction** reemplaza API keys, claves privadas, JWTs, contraseñas de connection strings, números de identificación chinos y números de tarjeta por placeholders antes de que el request salga de tu máquina. **Tool-call inspection** corta tool calls peligrosos (descargar-y-ejecutar, enviar variables de entorno, leer claves privadas, instalar startup items). **Hidden characters + prompt injection refusal**. Y se activa por etapas: Observe (solo informa) → Enforce (corta), una protección cada vez.

**5. Upstream check-up.** Compara respuestas entre upstreams que sirven el mismo modelo. Si un upstream te devuelve respuestas con el modelo nombrado distinto, con input reportado muy distinto, o con prompt cache bajo, lo marca, con sample sizes.

**6. MCP servers, skills y hooks, escaneados.** Los MCP servers de los 13 clientes en una vista side-by-side, con servidores de terceros marcados. Y un escaneo de la configuración + skills + hooks + project instructions de cada cliente en busca de caracteres ocultos, prompt injection, comandos peligrosos y permisos demasiado amplios.

**7. Tracing + replay.** Cada request queda registrado: qué regla de routing aplicó, qué upstream intentó, qué conversión de formato se hizo, y cómo se calculó el coste. Una request ya completada puede re-ejecutarse contra otro upstream y comparar side by side. El historial completo es buscable, incluido el texto de los requests y answers.

**8. Routing + failover.** Reglas por modelo, tools, images, extended thinking, etc. Si un upstream falla antes de empezar la respuesta, el siguiente toma el relevo. Y una vez que empieza, la sesión se queda en ese upstream para mantener el prompt cache hit. Los requests auxiliares (generación de título) pueden ir a un modelo local.

**9. Conversión entre formatos.** Anthropic Messages ↔ OpenAI Chat Completions ↔ Gemini ↔ Amazon Bedrock ↔ ChatGPT ↔ Z.ai. Las API keys, cuentas de Bedrock, cuentas de ChatGPT, cuentas de Z.ai, OpenRouter y modelos locales se configuran en el mismo sitio.

**10. Costes como son.** Las cantidades estimadas están marcadas, y los requests sin precio se cuentan por separado en lugar de como 0. Esto importa cuando auditas el coste real del mes.

### Lo que NO hace (o lo que no se ha verificado)

- **No es un servidor HTTP multi-tenant.** No está pensado para que 30 developers de un equipo lo compartan en LAN. Para eso mira LiteLLM. ThinkWatch Lite es para **1 developer con varios clientes** (o un equipo pequeño si usas el remote core).
- **No tiene rate-limiting visible en el README.** Si lo usas con OpenRouter, OpenRouter te limita; ThinkWatch no añade una capa extra.
- **No anonimiza.** Si el relay upstream es malicioso, la outbound redaction te protege de la fuga de credenciales, pero no te hace anónimo. El IP, el user-agent, el prompt en sí, siguen yendo al upstream.
- **La app no está firmada por Apple ni Microsoft.** Lo dice el README explícitamente. El primer launch necesita un paso extra (click derecho → abrir, en macOS; SmartScreen → "more info" → "run anyway", en Windows). Documentado pero fricción real.
- **El núcleo es un repo separado** (`ThinkWatchProject/ThinkWatch-Core`, tag `v0.57.1`). Disciplina de release seria (tag pinned, no branch), pero dependencia externa al fin.
- **3 semanas de vida + 6 forks.** Las 465 estrellas son honestas — no hay campaña de marketing detrás — pero la comunidad es pequeña todavía.

### El detalle técnico que me hizo parar a leer

Mirando el código (repo clonado en `~/proyectos/thinkwatch-investigacion/repo/`), en `src-tauri/Cargo.toml`:

```toml
tw-api = { git = "https://github.com/ThinkWatchProject/ThinkWatch-Core.git", tag = "v0.57.1" }
```

El comentario que sigue (traduzco del chino original): *"El binario de `twcore` y la versión de protocolo compilada aquí tienen que venir del mismo tag de `core` — el script de empaquetado descarga el binario desde el tag al que `tw-api` está pineado."*

Es un detalle pequeño, pero es **release discipline real**: no compilan contra `main` y luego esperan que el binario casualmente coincida. Pinnean el tag. Si mañana suben un breaking change en `main`, esta versión sigue funcionando porque sabe exactamente qué binario descargar. Es el tipo de cosa que separa un proyecto "MVP" de un proyecto que va a vivir tres años.

Y la separación `twcore` (núcleo de gateway, Rust) vs la app Tauri (UI) es la decisión arquitectónica correcta para un proyecto de esta categoría. La app puede actualizarse con frecuencia sin tocar el protocolo, y el núcleo puede actualizarse con disciplina de tag sin romper clientes.

## 5. LiteLLM: el servidor HTTP con 100+ modelos y 60k estrellas

URL: <https://github.com/BerriAI/litellm>
Estrellas/forks (API 2026-10-02): 60.054 / 11.978
Licencia: **NOASSERTION** ← importante, ver sección 11
Push: 2026-10-02 (mantenimiento activo)
Creado: 2023-07-27 (casi 3 años)

> **TL;DR (qué aprenderé si leo esto):** LiteLLM es el estándar de facto cuando quieres un servidor HTTP que hable OpenAI-format y soporte 100+ modelos (Bedrock, Azure, OpenAI, Anthropic, VertexAI, vLLM, Nvidia NIM, etc.). Lo que ThinkWatch Lite hace a escala de laptop, LiteLLM lo hace a escala de equipo: multi-tenant, cost tracking server-side, guardrails, load balancing, logging. El trade-off es que tienes que correrlo tú (Python + Docker normalmente) y, muy importante, **su licencia es NOASSERTION** — antes de adoptarlo como dependencia verifica qué significa eso en tu contexto.

### Lo que hace (verificado en el repo y la descripción oficial)

**1. SDK y proxy unificados.** La idea fundacional: todos los vendors exponen APIs distintos. LiteLLM te da una capa que normaliza todo al formato OpenAI (o te deja usar el formato nativo). Tú escribes código contra `litellm.completion(model="gpt-4", messages=...)` o contra un endpoint OpenAI-compatible que LiteLLM sirve, y LiteLLM traduce a la API del vendor real.

**2. Cobertura exhaustiva.** La descripción del repo enumera: Bedrock, Azure, OpenAI, Anthropic, VertexAI, vLLM, Nvidia NIM. Y la realidad es aún más amplia: la lista de providers soportados en la documentación tiene 100+ entradas. Si hay un modelo de IA accesible por API, hay una probabilidad no trivial de que LiteLLM lo entienda.

**3. Núcleo Rust, SDK Python.** Esta es una decisión técnica interesante que muchos pasan por alto. El proxy HTTP pesado es Rust (por velocidad y concurrencia), pero el SDK que usas desde tu código es Python (donde vive el ecosistema de data science y ML). Trade-off: lo que es hot path es Rust, lo que es ergonomía de uso es Python.

**4. Server-side features para equipos:**

- **Cost tracking**: cada request calcula coste contra el pricing del modelo. Más preciso que un gateway local porque puede tener en cuenta tokens cacheados, batch discounts, etc.
- **Guardrails**: reglas pre y post que cortan o modifican requests. LiteLLM tiene su propio sistema (moderations, PII detection, regex sobre prompts) y se integra con NeMo Guardrails de NVIDIA.
- **Load balancing**: reparte entre múltiples deployments del mismo modelo (por ejemplo, 3 cuentas de OpenAI para multiplicar rate limits).
- **Logging**: cada request con su trace, su coste, y su metadata, normalmente a una base de datos.
- **Virtual keys**: das a cada developer una key "virtual" que LiteLLM traduce a la real, con presupuesto mensual y equipo asignados.

**5. Multi-tenant por diseño.** Esto es lo que lo hace la opción natural para empresas. Un servidor LiteLLM en la LAN puede servir a 50 developers, cada uno con su key virtual, su presupuesto, y sus límites. Piensa en "Auth0 para LLMs".

### Lo que NO hace

- **No es una app de escritorio.** No tiene UI bonita. El dashboard existe (`litellm --ui` o una imagen Docker con UI), pero no es el centro del producto. Si quieres una UI rica, LiteLLM no es para ti.
- **No tiene la capa de protección activa de ThinkWatch Lite.** Sí tiene guardrails, pero son reglas que tú configuras (regex, PII detection, etc.). No tiene un sistema de "este upstream me está colando un tool call peligroso, córtalo". La protección de LiteLLM es **policy-based**, no **content-based reactivo**.
- **No es un cliente.** LiteLLM no es tu Claude Code ni tu Codex. Es un servidor al que tus clientes se conectan (configurando `OPENAI_API_BASE` apuntando a LiteLLM).
- **No es plug-and-play.** Necesitas Python 3.10+, normalmente Docker, y configurar `config.yaml` con tus providers, virtual keys, y reglas. El primer setup te lleva una hora si ya sabes lo que haces, un día si no.

### El detalle técnico que me hizo parar a leer

`60.054` estrellas y `11.978` forks. Es una de las librerías de IA más starred de GitHub. Y la métrica que más me interesa no son las estrellas, sino el **push de hoy**: 2026-10-02, hace horas. Es un proyecto que sigue recibiendo commits diarios tres años después, lo cual es raro en el ecosistema de IA. La mayoría de proyectos de 2023 están en modo mantenimiento o abandonados. LiteLLM no.

La arquitectura núcleo-Rust + SDK-Python también es un buen augurio. Significa que el equipo entiende que el hot path (proxy HTTP con miles de requests concurrentes) necesita un lenguaje de sistemas, pero la API que la gente usa desde sus notebooks y scripts puede ser Python sin fricción.

## 6. OpenRouter: el SaaS OpenAI-compatible sin infraestructura

URL: <https://openrouter.ai>
Forma: **SaaS cerrado**, no OSS
Modelo de pricing: por token, con un fee sobre el precio del vendor

> **TL;DR (qué aprenderé si leo esto):** OpenRouter no es un proyecto que puedas clonar ni auditar. Es un servicio cloud que habla OpenAI-format, agrega muchos modelos (los de OpenAI, Anthropic, Google, Meta, Mistral, DeepSeek, Qwen, etc.) bajo un único endpoint y un único sistema de billing. Es la opción "no quiero montar nada" con la mejor cobertura del mercado. El trade-off — y es importante — es que **tus prompts van a un relay de terceros**, y que no tienes visibilidad sobre qué hacen con ellos.

### Lo que hace

**1. Un endpoint para muchos modelos.** Cambias de modelo cambiando un string en el header o el body. `"model": "anthropic/claude-sonnet-4"` o `"model": "openai/gpt-5"` o `"model": "meta-llama/llama-3.3-70b"`. El mismo código, distinto modelo. Sin reescribir nada.

**2. OpenAI-compatible.** Si ya tienes un cliente que habla OpenAI, solo cambias `base_url` y la API key. Eso es lo que hace que servicios como Cursor, Continue, o el propio Claude Code puedan usarlo sin parches especiales.

**3. Pricing transparente por modelo.** Cada modelo tiene su precio por millón de tokens (input y output) listado en el dashboard. Puedes ver el coste estimado antes de enviar el request, y el real después.

**4. Failover automático.** Si el modelo A en el provider X está caído, OpenRouter puede enrutar al mismo modelo en otro provider, o a un modelo equivalente. Para casos donde la disponibilidad importa más que la elección exacta de modelo, esto es útil.

**5. Features específicas para producción:**

- **Tool routing**: convierte tools entre formatos (lo que Anthropic llama tool use, lo que OpenAI llama function calling, lo que Gemini llama function declarations).
- **Streaming**: SSE estándar.
- **Structured output**: JSON mode y JSON schema en muchos modelos.
- **BYOK (Bring Your Own Key)**: si ya tienes una key de Anthropic, puedes dársela a OpenRouter y que te cobre solo el fee de relay (más barato que el modelo directo a veces).

### Lo que NO hace

- **No es software que corras tú.** No puedes auditar el código, no puedes hacer fork, no puedes meterlo en tu VPC. Si OpenRouter cae, tu agente cae.
- **No es gratis.** Aunque tiene modelos gratuitos y modelos baratos, la mayoría de los modelos útiles cuestan. Y el fee está sobre el precio del vendor.
- **No tienes garantía de privacidad de datos.** Depende de los términos de servicio y de la cadena de relays que OpenRouter usa por debajo. Para datos sensibles (PII, código propietario, secretos), necesitas leer la política a fondo.
- **No es un conmutador local.** No resuelve el problema "quiero ver cuánto he gastado este mes en cada modelo" del lado del cliente. Lo resuelve del lado de su dashboard, pero no tienes export programático sin su API.
- **No tiene la capa de protección activa de ThinkWatch Lite.** OpenRouter es un relay. Su protección es la que tenga el upstream final. Si Anthropic te manda una respuesta con un tool call raro, OpenRouter no lo va a inspeccionar — lo pasa.

### El detalle que importa

OpenRouter es el "no quiero pensar en esto" del mundo de los gateways. Y eso es legítimo: para experimentar, para prototypes, para el caso "quiero probar 10 modelos este finde y ver cuál me gusta", no hay nada más rápido. Pero para producción seria con datos sensibles o para setups donde la auditoría de qué prompt fue a qué modelo es un requisito legal, necesitas software que puedas correr tú.

Hay una pregunta abierta interesante: **¿es OpenRouter el competidor de LiteLLM o el competidor de Anthropic directo?** Yo creo que es más bien lo segundo. La gente que usa OpenRouter directamente con su coding agent probablemente está usando un solo modelo la mayoría del tiempo, y el valor de OpenRouter para ellos es la conveniencia del billing unificado y el failover, no la elección de modelos. La gente que quiere "elegir modelo por request" con lógica propia tiende a usar LiteLLM o un cliente que ya integre multi-modelo (como el propio ThinkWatch Lite).

## 7. aws/agent-toolkit-for-aws: el gateway cloud-oficial de AWS

URL: <https://github.com/aws/agent-toolkit-for-aws>
Estrellas (verificado el 2026-10-02): 2.785
Forma: MCP servers + skills + plugins oficiales de AWS para coding agents

> **TL;DR (qué aprenderé si leo esto):** AWS ha publicado un conjunto de herramientas oficiales (MCP servers, skills, plugins) que permiten a coding agents como Claude Code o Kiro operar contra servicios de AWS (Bedrock, S3, Lambda, etc.) de forma nativa. No es un gateway HTTP al estilo LiteLLM — es un **kit de adopción de AWS para coding agents**. Si tu organización ya está invertida en AWS, este es el camino de menor fricción. Si no, mira los otros.

### Lo que hace

**1. MCP servers oficiales.** Un Model Context Protocol server es un endpoint que un coding agent puede consultar para hacer operaciones con contexto (no HTTP crudo, sino con descripción semántica de qué hace cada operación). AWS ha publicado MCP servers para sus servicios principales: Bedrock AgentCore, S3, Lambda, ECS, CloudWatch, Cost Explorer, etc.

**2. Skills y plugins para coding agents.** El repo incluye skills pre-empaquetadas que coding agents como Claude Code pueden cargar. "Skill" aquí significa: "un conjunto de instrucciones + tools + ejemplos que un agente puede usar para resolver una categoría de tareas". Por ejemplo, una skill de "deploy a Lambda" le enseña al agente cómo construir, empaquetar y desplegar.

**3. Vendor-oficial.** Esto importa. Si tu organización tiene un acuerdo de soporte con AWS, usar herramientas oficiales te da un path de escalación claro. Las alternativas OSS (LiteLLM con Bedrock, o un cliente directo con boto3) funcionan, pero si AWS introduce un breaking change en un API, el path de soporte no es tan claro como con código que AWS mantiene ella misma.

### Lo que NO hace

- **No es un gateway LLM.** No normaliza 100 modelos. No te da OpenAI-format. Su propósito es distinto: que tus coding agents operen contra AWS con menos fricción.
- **No es para multi-cloud.** Está atado a AWS, por definición.
- **No es para el caso "tengo un solo dev con tres clientes locales".** Es para equipos que ya están operando infraestructura AWS desde sus coding agents.

### El matiz importante

En el clúster de "gateways para coding agents", AWS agent toolkit ocupa un lugar distinto. No es un competidor directo de ThinkWatch Lite o LiteLLM. Es más bien el **tercer polo**: gateway para SaaS (OpenRouter), gateway para self-hosted (LiteLLM), gateway para local-first (ThinkWatch Lite), y **kit oficial para cloud-oficial (AWS)**.

Si tu organización ya está en AWS, la decisión es más fácil de lo que parece. Si no, los otros tres son más relevantes.

## 8. La escalera de decisión: cinco casos según escala y seguridad

Aquí está la parte que justifica el título "tres caminos". Los tres primeros casos son los que un developer individual vive; los dos últimos son para equipos. **El caso 0 es el caso que mucha gente se salta y se monta un gateway que no necesita.**

### Caso 0 — "Tengo un cliente, un modelo, y cambio de opinión cada dos semanas"

**No necesitas un gateway.** El propio cliente puede. Claude Code permite cambiar el modelo en settings.json. Cursor permite elegir modelo por proyecto. Aider lee de `~/.aider.model.settings.yml`. Si no tienes un problema de "tengo cinco clientes que se pelean por la misma API key", estás en este caso. No te compliques.

Cuándo SÍ necesitas un gateway:

- Tienes 2+ coding clients.
- Quieres comparar el mismo modelo en dos upstreams para detectar alucinaciones o服务质量 degradado.
- Necesitas ver el coste total de tus llamadas, no el de cada cliente por separado.
- Tienes un relay (OpenRouter, Z.ai) y quieres **inspeccionar lo que pasa entre el cliente y el upstream** antes de que salga de tu máquina.
- Tienes prompts que podrían incluir secrets o datos sensibles, y quieres un sitio donde **redactar** antes de enviar.

### Caso 1 — "Una máquina, 3+ clientes, presupuesto ajustado, me preocupa la seguridad"

**ThinkWatch Lite.**

- MIT, gratis, 0 marginal cost.
- Local-first: la lógica de routing vive en tu laptop.
- 13 clientes autoconfigurables, incluyendo Hermes (importante para el caso CSS, sección 10).
- Capa de seguridad **activa** (outbound redaction, tool-call inspection) que ni LiteLLM ni OpenRouter te dan.
- Trade-off: solo tú lo usas. No está pensado para compartir en equipo (salvo que uses el remote core).
- Trade-off: 3 semanas de vida. Si te asusta la dependencia de un proyecto tan joven, mira la opción 2.

### Caso 2 — "Servidor HTTP compartido en LAN, multi-usuario, necesito 100+ modelos y virtual keys"

**LiteLLM.**

- Servidor HTTP con OpenAI-format, en Python + Docker.
- 100+ modelos soportados. Si existe, lo habla.
- Virtual keys por developer, con presupuesto y límites.
- Cost tracking del lado del servidor (más preciso que uno local porque tiene en cuenta caches, batch, etc.).
- Guardrails pre/post (PII, regex, NeMo).
- Trade-off: tienes que mantenerlo. Docker, monitoring, upgrades.
- **Caveat legal:** su licencia es **NOASSERTION**, lo cual requiere análisis antes de adopción (sección 11).

### Caso 3 — "SaaS, OpenAI-format, no quiero montar infra, solo quiero que funcione"

**OpenRouter.**

- Un endpoint, un billing, muchos modelos.
- Failover automático, tool routing, streaming.
- Trade-off: no puedes auditar el código. Tus prompts van a un relay.
- Trade-off: el fee sobre el precio del vendor.

### Caso 4 — "Cluster en cloud, vendor-oficial, ya estoy en AWS"

**aws/agent-toolkit-for-aws + Bedrock.**

- MCP servers oficiales para los servicios de AWS.
- Skills pre-empaquetadas para coding agents.
- Path de soporte claro con AWS.
- Trade-off: lock-in con AWS. Si mañana migras a GCP, toca reescribir.

### Una nota sobre combinar

**No son excluyentes.** He visto setups donde:

- Un developer usa ThinkWatch Lite local para su trabajo diario.
- Su equipo tiene un LiteLLM en la LAN para los proyectos compartidos.
- Para experimentos rápidos (probar un modelo nuevo, hacer un benchmark), usa OpenRouter directamente desde el cliente.
- Para operaciones de infraestructura, usa el AWS agent toolkit desde Claude Code.

Cada pieza hace lo que mejor sabe hacer, y los gateways no se pelean entre sí porque están en distintas capas (local vs servidor vs SaaS vs cloud vendor).

## 9. La capa de seguridad de ThinkWatch Lite: por qué no es "solo routing"

Esta sección existe porque es **el diferenciador real** de ThinkWatch Lite, y mucha gente que lee "gateway" se queda en la superficie de "ah, rutea entre modelos". Eso es lo que hacen todos. Lo que ThinkWatch Lite añade, y lo que el README explica con bastante claridad, es la **suposición de que el upstream puede ser hostil**.

### Outbound redaction (lo que sale)

El gateway se sienta entre tu cliente y el upstream. Cuando un cliente envía un request, el request pasa por el gateway antes de salir a internet. El gateway inspecciona el contenido y, si encuentra:

- API keys (de cualquier vendor — los patrones son bien conocidos)
- Claves privadas (PEM, OpenSSH, etc.)
- JWTs (formato `header.payload.signature` con base64url)
- Connection strings con contraseñas embebidas (Postgres `postgresql://user:pass@host`, Redis `redis://:pass@host`, MongoDB, etc.)
- Números de identificación chinos (formato 18 dígitos con checksum)
- Números de tarjeta de crédito (Luhn check)

los **reemplaza por placeholders** antes de enviar. El upstream recibe un request donde tu `sk-...` real se ha convertido en `[REDACTED:api_key]`. La respuesta del upstream, si por algún motivo incluye el placeholder expandido de vuelta (raro pero posible si el modelo "rellena" el placeholder), también se filtra.

Esto importa especialmente si usas un **relay** como OpenRouter, Z.ai, o un proxy corporativo. Sin redaction, el relay ve tus claves en cada request. Con redaction, no.

### Tool-call inspection (lo que vuelve)

Cuando el modelo responde, puede incluir tool calls: "ejecuta este comando", "lee este archivo", "haz fetch a esta URL". El gateway inspecciona cada tool call antes de pasárselo al cliente. Si el tool call es de una categoría peligrosa, lo **corta**:

- **download-and-execute**: el clásico "curl https://... | bash". Pensado para instalar malware.
- **env var exfiltration**: el modelo intenta enviar tus variables de entorno a un servidor externo. Patrón típico de prompt injection.
- **private key access**: el modelo intenta leer `~/.ssh/id_rsa`, `~/.aws/credentials`, etc.
- **startup persistence**: el modelo intenta instalar un LaunchAgent en macOS, una entrada de Run en Windows, un crontab en Linux, o un systemd unit.

Si el tool call es peligroso, el cliente recibe la respuesta del modelo **con el tool call eliminado**. La conversación sigue, pero el agente no puede ejecutar el comando. Esto es importante: no es que el gateway "rechace la respuesta" y tu agente se quede atascado. El gateway **edita la respuesta en tránsito** para que el comando peligroso no llegue a tu shell.

### Hidden characters y prompt injection refusal

Hay dos vectores adicionales que el gateway maneja:

- **Hidden characters**: caracteres Unicode invisibles (zero-width spaces, right-to-left overrides, etc.) que se usan a veces para esconder instrucciones a un LLM dentro de un archivo "inocente". El gateway los marca o los quita.
- **Prompt injection refusal**: instrucciones que aparecen dentro del contenido de un archivo (no del system prompt) intentando que el modelo haga algo distinto. El gateway puede detectar patrones comunes y, configurado en modo Enforce, cortar el tool call que las ejecuta.

### Modos Observe → Enforce, una protección cada vez

El gateway empieza en **Observe** para cada protección. En Observe, la protección **informa**: ves en el log "este request habría sido cortado porque contenía `sk-...` en tal campo". Y nada se corta. Esto te permite evaluar falsos positivos antes de activar el modo **Enforce**, donde la protección **corta** de verdad.

Se activan una a una, no todas a la vez. Es el patrón correcto: si activas todo en Enforce el primer día y algo se rompe, no sabes qué protección lo causó. Una por una, sabes exactamente qué hizo qué.

### El matiz honesto

ThinkWatch Lite **no te anonimiza**. Si el upstream es malicioso y ve tu prompt, lo ve. Lo que evita es la **fuga de credenciales y la ejecución de código malicioso**. Son dos cosas distintas.

Y no es perfecto. Los patrones de redaction son heurísticos. Un atacante que sepa que el gateway está ahí puede codificar la API key en base64 o en ROT13 (dependiendo de qué inspeccione el gateway). Es **defensa en profundidad**, no defensa absoluta. El modelo mental correcto es: "ThinkWatch Lite sube el coste de un upstream malicioso para hacerme daño, no me hace invulnerable."

## 10. El caso CSS: ThinkWatch Lite y Hermes Agent

Este apartado es específico para quien use Hermes Agent (la herramienta que está detrás de parte de Código Sin Siesta, incluido el agente que está escribiendo este artículo). Si no usas Hermes, sáltalo.

### El módulo `tw-adopt/src/hermes.rs`

El repositorio de ThinkWatch Lite tiene un crate Rust llamado `tw-adopt` (cuyo propósito es "adoptar" — es decir, reconfigurar — los coding clients para que apunten al gateway). Y dentro de ese crate, hay un archivo dedicado: `src-tauri/crates/tw-adopt/src/hermes.rs`. Es uno entre muchos (también hay `claude_code.rs`, `codex.rs`, `opencode.rs`, `pi.rs`, `qwen.rs`, `mcp.rs`, etc.), pero está ahí.

Mirando el código (comentarios en chino, traduzco los puntos clave):

> *El provider `custom` de Hermes apunta a un endpoint externo con un `base_url` propio. Si le pones `/v1` al final, Hermes envía Chat Completions. Si se lo quitas, Hermes envía Messages (formato Anthropic). Las dos formas funcionan.*

> *Solo hay dos protocolos disponibles. En `provider: custom`, `api_mode: codex_responses` solo se respeta si el endpoint es OpenAI, xAI o Meta. Si apunta al gateway, se descarta y vuelve a Chat Completions. Por eso: Claude va por Messages, el resto va por Chat Completions.*

> *Hermes puede tener varios profiles. El que se usa por defecto es el de `~/.hermes/config.yaml`. Los otros viven en `profiles/<nombre>/`. ThinkWatch Lite solo modifica el default. Si tienes otros profiles activos con `hermes profile use`, no se tocan, y el aviso lo deja claro.*

Es decir: **ThinkWatch Lite detecta que tienes Hermes, sabe dónde está su config, sabe qué profile es el activo, sabe qué formato usa cada modelo, y modifica el YAML para que apunte al gateway con la `base_url`, `api_key` (si la hay), y `api_mode` correctos.** El backup del archivo original se hace antes de tocar nada (es el patrón "restore always available" que tiene con los 13 clientes).

### Implicación para CSS

Si el flujo de trabajo de Código Sin Siesta incluye correr Hermes Agent contra múltiples modelos (Claude, GPT, modelos locales), ThinkWatch Lite ofrece:

- Un único punto donde cambiar el modelo activo sin tocar `~/.hermes/config.yaml` cada vez.
- Outbound redaction por defecto, por si en algún momento el flujo incluye pasar prompts a relays externos.
- Tracing de cada request: qué modelo se usó, qué upstream, qué coste, qué conversión de formato hubo.
- Tool-call inspection: si un upstream malicioso cuela un tool call peligroso en una respuesta a Hermes, el gateway lo corta antes de que Hermes lo ejecute.

Es un valor real. No es hype. Es una pieza concreta que un equipo pequeño puede montar en una tarde y que **reduce la superficie de ataque** sin obligar a un proyecto de tres meses de implementación.

## 11. Caveats y letra pequeña

### NOASSERTION de LiteLLM

La licencia declarada en el repo de LiteLLM es **NOASSERTION**. Esto, en la jerga de SPDX, significa que el repositorio **no tiene una licencia clara** según GitHub. No es GPL, no es MIT, no es Apache, no es "all rights reserved". Es un limbo que requiere análisis caso por caso.

¿Qué implica esto en la práctica?

- **No puedes asumir que puedes forkear y relicenciar.** Sin una licencia explícita que lo permita, el código tiene copyright por defecto y todos los derechos reservados.
- **No puedes asumir que puedes usarlo en producción sin leer el código.** Si tu organización tiene políticas de "solo software con licencia aprobada", NOASSERTION no pasa el filtro.
- **No es necesariamente un problema legal activo.** Muchas veces significa que el repo tiene un LICENSE file pero GitHub no lo detectó automáticamente (por formato inusual, multi-licensing, etc.). **Verifica el archivo `LICENSE` directamente en el repo antes de tomar decisiones.**

Mi recomendación: si tu organización tiene un proceso de aprobación de dependencias, abre un ticket con LiteLLM. Lee el LICENSE file. Si está ahí y dice algo, ajusta. Si no está, o dice algo que tu legal no aprueba, busca alternativa.

### ThinkWatch Lite: 3 semanas de vida

El proyecto se creó el 2026-09-12. Hoy es 2026-10-02. Tiene 20 días. **Es un cachorro.** 465 estrellas y 6 forks es honesto (no hay campaña de marketing detrás), pero también significa que la comunidad que lo valide aún no existe.

La release discipline (tag pinned, calver mensual) es buena señal. La arquitectura (Tauri 2 + Rust, separación core/UI) es buena señal. Pero nadie ha auditado el código de seguridad en producción. Si lo usas, hazlo con los ojos abiertos y con el plan de poder migrar a LiteLLM o a otra cosa si el proyecto muere.

### OpenRouter: privacidad por defecto

OpenRouter no es malicioso. Pero **un relay de terceros ve todos tus prompts en claro**. Si en algún momento Codex desde tu laptop le pide a OpenRouter que traduzca un fragmento de código que contiene un secreto de tu empresa, ese secreto ha salido de tu máquina. La outbound redaction de ThinkWatch Lite te protege de esto. OpenRouter no.

### La app no está firmada

El README de ThinkWatch Lite lo dice explícitamente: *"The app is not signed by Apple or Microsoft."* Esto significa que en macOS el primer launch requiere click-derecho → Abrir (saltarse Gatekeeper), y en Windows requiere "More info" → "Run anyway" (saltarse SmartScreen). Documentado pero fricción real, especialmente en equipos donde la política de seguridad bloquea binarios no firmados.

Si tu organización tiene esa política, ThinkWatch Lite no es viable hasta que firmen. Y firmar cuesta dinero (Apple Developer Program $99/año, certificado de firma de código EV para Windows varios cientos de dólares al año). No es un capricho, es un coste real.

### LiteLLM: instalación no trivial

LiteLLM es un servidor HTTP que típicamente se corre como Docker container o proceso Python dedicado. Tiene un `config.yaml` donde declaras providers, virtual keys, y reglas. **El primer setup toma tiempo**, especialmente si quieres usar Bedrock o VertexAI (credenciales, IAM, etc.). No es el camino de un domingo por la tarde.

## 12. Recomendación: combinación por caso, no reemplazo universal

Si me obligas a dar una recomendación única, digo: **ThinkWatch Lite como gateway local, OpenRouter como SaaS para experimentar, LiteLLM si necesitas multi-tenant server-side, AWS agent toolkit si vives en AWS.** Y ninguno reemplaza a los otros.

La decisión real es:

- **¿Cuántos developers van a usarlo?** Si eres tú solo, ThinkWatch Lite o nada. Si es un equipo, LiteLLM o AWS.
- **¿Cuántos modelos necesitas?** Si es 1-3, el cliente puede. Si es 10+, necesitas un gateway.
- **¿Necesitas ver el coste consolidado?** Si sí, gateway. El cliente individual no te da esa vista.
- **¿Te preocupa que un relay vea tus prompts?** Si sí, ThinkWatch Lite (con redaction) o LiteLLM (self-hosted). OpenRouter no.
- **¿Te preocupa que un upstream cuele tool calls peligrosos?** Si sí, ThinkWatch Lite. Es el único que lo trata como caso de diseño.
- **¿Ya vives en AWS?** El agent toolkit oficial te evita reescribir.

Y la regla de oro: **empieza sin gateway.** Si después de un mes estás cambiando de modelo en 5 sitios, copiando API keys en 3 sitios, y sin saber cuánto llevas gastado, entonces necesitas uno. Antes, es sobreingeniería.

## 13. Alternativas que no cubrimos

Este artículo se enfoca en **gateways pensados para coding agents específicamente**, o en gateways generales de LLM que se usan en ese contexto. Hay categorías adyacentes que no cubrimos en profundidad:

- **LangChain / LlamaIndex como "gateway"**: técnicamente pueden hacer routing entre modelos, pero su propósito es orchestration de chains/agents, no gateway. Si los usas como gateway, estás reimplementando lo que LiteLLM ya hace, peor.
- **Cloudflare AI Gateway**: SaaS de Cloudflare con caching, rate-limiting, logging. No incluye la capa de tool-call inspection ni outbound redaction de ThinkWatch Lite. Es más un "Cloudflare delante de tu API de LLM" que un gateway pensado para coding agents.
- **Portkey**: otro SaaS con observability y routing. Competidor directo de OpenRouter con más énfasis en analytics. No OSS.
- **requesty.ai, Z.ai, otros relays**: relays SaaS más pequeños. El mismo modelo que OpenRouter pero con menos cobertura.
- **Inngest / Temporal / LangGraph**: orchestration de agents. No son gateways. Si tienes agentes que se llaman entre sí, esto es lo que necesitas. Si tienes varios clientes que se conectan a APIs de LLM, esto NO es lo que necesitas.
- **Open WebUI + Ollama + LiteLLM**: combinación popular. Open WebUI da UI, Ollama da modelos locales, LiteLLM da gateway. Es un setup de "taller de IA" local, no un gateway para coding agents en sentido estricto.

Si tu caso de uso está en alguna de estas categorías, este artículo no es la guía que necesitas. Mira cada una por separado.

## 14. Apéndice: tabla maestra y datos verificados

### Tabla de gateways

| Gateway | Estrellas | Forks | Licencia | Forma | Multi-OS | Capa de seguridad | Multi-tenant | Costo |
|---|---:|---:|---|---|---|---|---|---|
| ThinkWatch Lite | 465 | 6 | **MIT** | App nativa Tauri 2 + remote core | macOS / Windows / Linux | **Sí (outbound redaction, tool-call inspection, prompt injection)** | No (1 dev) | Gratis |
| LiteLLM | 60.054 | 11.978 | **NOASSERTION** (verificar) | Servidor HTTP Python (core Rust) | Cualquiera con Docker | Guardrails (PII, regex) + NeMo | **Sí (virtual keys)** | Gratis (self-hosted) |
| OpenRouter | — | — | SaaS cerrado | Servicio cloud | N/A (SaaS) | No (pass-through) | Sí (API keys) | Pay-per-token |
| aws/agent-toolkit-for-aws | 2.785 | — | Apache-2.0 (verificar) | MCP servers + skills | N/A (cloud) | AWS IAM | Sí (AWS IAM) | Incluido en AWS |

### Datos primarios verificados

**ThinkWatch Lite** (verificado el 2026-10-02):

- Repo: <https://github.com/ThinkWatchProject/ThinkWatch-Lite>
- Versión actual: 2026.10.0
- Licencia: MIT (verificado en `LICENSE`)
- Stack: Tauri 2 + React 19 + Rust backend
- Tamaño del backend: 10.187 líneas Rust en 36 archivos top-level + 2 sub-crates (`tw-scan`, `tw-adopt`)
- Pinned dependency: `tw-api = { git = "...", tag = "v0.57.1" }` (verificado en `src-tauri/Cargo.toml`)
- 13 clientes soportados: Claude Code, Claude Desktop, Codex, opencode, Pi, oh-my-pi, Grok Build, Qwen Code, Hermes Agent, Zed, Aider, DeepSeek Harness
- Módulo CSS-específico: `src-tauri/crates/tw-adopt/src/hermes.rs` (verificado, lee y modifica `~/.hermes/config.yaml`)

**LiteLLM** (verificado el 2026-10-02 vía GitHub API):

- Repo: <https://github.com/BerriAI/litellm>
- Estrellas: 60.054
- Forks: 11.978
- Licencia declarada: **NOASSERTION** (caveat importante)
- Push: 2026-10-02 (commit reciente)
- Creado: 2023-07-27 (casi 3 años)
- Descripción: *"The fastest, litest AI Gateway. Rust core with Python SDK. Call 100+ LLM APIs in OpenAI (or native) format with cost tracking, guardrails, load balancing, and logging"*

**OpenRouter** (SaaS, no OSS):

- URL: <https://openrouter.ai>
- Forma: servicio cloud, no hay repo OSS
- OpenAI-compatible: sí
- Pricing: por token, con fee sobre el vendor
- Privacidad: a verificar en términos de servicio para cada caso de uso

**aws/agent-toolkit-for-aws** (verificado el 2026-10-02 vía GitHub search):

- Repo: <https://github.com/aws/agent-toolkit-for-aws>
- Estrellas: 2.785
- Descripción: *"Official, AWS-supported MCP servers, skills, and plugins to help AI agents build on AWS"*
- Forma: MCP servers oficiales + skills pre-empaquetadas para coding agents

### Glosario rápido

- **Calver**: esquema de versionado por fecha (YYYY.MM.PATCH). Usado por ThinkWatch Lite (2026.10.0) en lugar del clásico semver.
- **Gateway**: software que se sienta entre clientes y servicios upstream, transformando protocolos, enrutando, o añadiendo features (logging, seguridad).
- **MCP (Model Context Protocol)**: protocolo de Anthropic estandarizado para que coding agents descubran y usen "tools" externas. AWS ha publicado MCP servers oficiales.
- **OpenAI-format**: la API de OpenAI (chat completions con `messages: [{role, content}]`) se ha convertido en estándar de facto. La mayoría de gateways exponen un endpoint compatible.
- **Prompt injection**: técnica por la que un atacante (o un documento malicioso) mete instrucciones dentro del contenido que un LLM va a procesar, intentando que el modelo haga algo distinto de lo que el usuario quería.
- **Relay**: servicio SaaS que se sienta entre tu cliente y el modelo upstream, agregando providers, manejando billing, y añadiendo valor. OpenRouter es el ejemplo canónico.
- **Tool call**: instrucción estructurada que un modelo devuelve ("ejecuta este comando", "lee este archivo") para que el cliente la ejecute. Los tool calls son el vector de ataque moderno.
- **Upstream**: el servicio final al que un gateway envía requests. Puede ser OpenAI, Anthropic, un modelo local, o un relay como OpenRouter.
- **Virtual key**: en LiteLLM, una API key "sintética" que se traduce a la key real del vendor, con presupuesto y límites por developer.

### Para seguir leyendo

- Repo de ThinkWatch Lite: <https://github.com/ThinkWatchProject/ThinkWatch-Lite>
- Repo de LiteLLM: <https://github.com/BerriAI/litellm>
- Documentación de OpenRouter: <https://openrouter.ai/docs>
- AWS agent toolkit: <https://github.com/aws/agent-toolkit-for-aws>
- INVESTIGATION.md (datos primarios de este artículo): `~/proyectos/thinkwatch-investigacion/INVESTIGATION.md`

### Nota sobre honestidad

- **NOASSERTION de LiteLLM** no es un invento: está declarado en la API de GitHub. Pero la implicación legal real (¿puedo forkear? ¿puedo usar en producción?) requiere leer el LICENSE file del repo, que este artículo no ha auditado. Antes de adopción, hazlo tú.
- **El módulo `hermes.rs` de ThinkWatch Lite** está verificado en el repo clonado. El código de adopción funciona. Pero no he ejecutado el binario `twcore` con mi `~/.hermes/config.yaml` real para verificar end-to-end. Hazlo tú antes de depender de ello.
- **Las 465 estrellas de ThinkWatch Lite** son las que GitHub reporta hoy. Si lees esto dentro de un mes, la cifra habrá cambiado.
- **El pricing de OpenRouter** no está en este artículo porque cambia por modelo. Consulta su página antes de cualquier decisión de coste.

---

*Si encuentras un error de datos en este artículo, abre un issue en el repo de Código Sin Siesta. Si quieres que cubra un gateway que no está aquí, también.*
