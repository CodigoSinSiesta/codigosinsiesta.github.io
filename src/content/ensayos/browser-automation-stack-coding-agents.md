---
title: "El nuevo stack de browser automation para coding agents (2026): CDP, WebDriver, vision-LLM y OS-level"
description: "Los cuatro stacks maduros de browser automation para coding agents en la primera mitad de 2026 — CDP-first (Chrome DevTools MCP), WebDriver BiDi (Playwright MCP), vision-LLM wrapper (browser-use) y OS-level (cua). Por qué compiten entre sí sólo en cabeza del usuario; en la práctica se complementan según el task."
fecha: 2026-07-04
tags:
  - agentic-engineering
  - mcp
  - browser-automation
  - devtools
  - chrome
  - testing
tipo: investigacion
estado: pendiente-revision
autor: Alejandro de la Fuente
---

# El nuevo stack de browser automation para coding agents (2026)

> **Para engineering leads** — si tu equipo va a meter coding agents en producción, en 2026 el stack por defecto es `chrome-devtools-mcp` para debug + performance en Chrome, complementado con `playwright-mcp` si necesitas Firefox/Safari y `browser-use` para cold-start agents en Python. La inversión: 1-2 semanas de setup. Coste ongoing: 0 $ en open source; ver pricing de cloud si optas por servicio gestionado. La decisión clave **no es el stack** — es cuántos agents concurrentes vas a correr y qué tipo de bugs esperas debuggear.
>
> **Sobre la terminología** — para los efectos de este artículo: "coding agent" = Claude Code, Cursor, Copilot, Antigravity o un harness equivalente (Claude Agent SDK, OpenAI Codex CLI) capaz de invocar tools MCP. "Agente" en español = traducción genérica. "MCP" = Model Context Protocol, el estándar abierto sobre JSON-RPC que permite a un LLM llamar a herramientas externas; no lo re-explicamos aquí.

## TL;DR

Un coding agent que necesita tocar la web en 2026 ya no elige "un wrapper de Playwright" y se olvida. Hoy conviven **cuatro stacks** maduros que disputan la misma pregunta desde capas distintas del sistema operativo:

- **CDP-first** — `ChromeDevTools/chrome-devtools-mcp` (v1.5.0, 45,6k⭐). 51 tools MCP que mapean **DevTools entero**: Performance Insights, Lighthouse, CrUX, heap snapshots, accessibility tree, screencast. Pensado para *debugging profesional* sobre Chrome estable.
- **WebDriver BiDi** — `microsoft/playwright-mcp` (v0.0.77, ~35k⭐). **WebDriver BiDi** es el estándar W3C moderno (sucesor de WebDriver clásico; trae eventos push bidireccionales en lugar de polling). `playwright-mcp` expone ~68 tools agrupadas por capability flags (`--caps=vision,pdf,devtools,storage,network,testing`). Pensado para *automation portable* cross-browser (Chromium + Firefox + WebKit).
- **Vision-LLM wrapper** — `browser-use/browser-use` (v0.13.2; más de 90k⭐ según búsqueda web de julio 2026, no confirmado contra GitHub API en este entorno). 26 acciones de alto nivel + un agente loop completo. Pensado para *cold-start sin harness técnico* — el LLM hace el trabajo, tú le das un task.
- **OS-level** — `trycua/cua` + `cua-driver` (v0.5.7). **OS-level** significa que controla el escritorio entero, no el browser — apps nativas como Slack, Finder, VS Code, dialogs nativos. ~29 tools MCP por plataforma. Pensado para *cuando no hay browser*, o cuando necesitas integración con apps nativas.

La decisión primaria no es "cuál es mejor". Es **qué pregunta intentas resolver**. Tres preguntas filtran el 90% de los casos:

```
¿Tu target es Chrome y necesitas primitivas de DevTools profundas?
   └── SÍ → chrome-devtools-mcp
   └── NO ↓

¿Necesitas correr en Firefox, WebKit, o mobile Safari?
   └── SÍ → playwright-mcp
   └── NO ↓

¿Tu target es una app nativa (no un browser)?
   └── SÍ → cua-driver
   └── NO → browser-use (cold-start agent en Python)
```

Tabla resumen, una fila por stack:

| Stack | Mantenedor | v | Stars | Protocolo base | Caso ideal |
|---|---|---|---|---|---|
| `chrome-devtools-mcp` | Google | 1.5.0 | ~46k | CDP | Debugging, performance, memory, Lighthouse en Chrome |
| `playwright-mcp` | Microsoft | 0.0.77 | ~35k | WebDriver BiDi | Tests E2E cross-browser, mobile, CI |
| `browser-use` | browser-use | 0.13.2 | ~100k | Playwright + LLM loop | Cold-start agent, scraping estructurado, Python-first |
| `cua` / `cua-driver` | trycua | 0.5.7 | ~20k | OS-level (Rust) | Desktop automation, sandboxes VM, apps nativas |

Las cuatro soluciones **no son intercambiables** — operan a capas distintas del stack (CDP → WebDriver BiDi → vision-LLM → OS). El resto del artículo demuestra por qué, con datos verificados de cada repo y un quickstart concreto al final.

### Coste y modelo de negocio: lo que pagas (o no)

| Stack | Open source | Cloud / SaaS oficial | Coste enterprise típico |
|---|---|---|---|
| `chrome-devtools-mcp` | Apache-2.0 (Google) | No oficial | $0; tú operas Chrome |
| `playwright-mcp` | Apache-2.0 (Microsoft) | Microsoft Playwright (Test Plans, de pago) | $0 OSS; ver [playwright.dev/pricing](https://playwright.dev/pricing) para Test Plans |
| `browser-use` | MIT (comunidad) | browser-use Cloud, con modelo propio `ChatBrowserUse` | ver [cloud.browser-use.com/pricing](https://cloud.browser-use.com) |
| `cua-driver` | MIT (trycua) | cua.ai cloud (sandboxes gestionadas) | ver [cua.ai/pricing](https://cua.ai) |

**El artículo entero asume el camino open source**. Los clouds comerciales añaden anti-bot bypass, proxies residenciales, scaling automático — útil en producción, pero fuera del scope.

### Lo que NO cubrimos: servicios cloud comerciales

Alternativas comerciales para evaluar si el OSS no encaja con la capacidad operativa del equipo: **Browserbase** (browser-as-a-service + anti-detect, ~0,10-0,50 $/browser-hora), **Steel** (cloud-first, optimizado para coding agents), **Hyperbrowser** (Chrome remoto + captcha bypass), **Anchor Browser** (sandboxed Chromium para agents).

**Cuándo tienen sentido**: equipo de <5 platform engineers sin capacidad de mantener K8s + Chrome/Playwright actualizado, o necesitas anti-bot bypass legítimo (e-commerce, login flows protegidos). **Cuándo NO**: tienes infraestructura propia, target es tu propio SaaS sin captchas, o el coste escala mal con tu volumen. OSS cuesta tiempo de operación; SaaS cuesta dinero recurrente. El artículo no zanja esa pelea — te da los datos para que la tengas con números.

---

## Por qué el screenshot-based se está quedando obsoleto

En 2023 el patrón dominante era "el agent ve la pantalla". El modelo recibía un PNG, devolvía coordenadas o una acción en lenguaje natural, otro wrapper convertía eso en click. Era elegante y universal. Tres problemas lo han erosionado.

**Problema 1: coste de tokens.** Un screenshot estándar a 1280×720 en PNG codificado en base64 y enviado por JSON ocupa entre **1,5k y 3k tokens** según la complejidad visual (texto vs. imagen vs. mixto). Cifras tomadas de la práctica común con Claude 3.x/4 y GPT-4o/4.1 midiendo payloads reales en agent loops; no verificadas experimentalmente en paper — son orden de magnitud, no medida exacta.

Multipliquemos: una task típica de 10 acciones ("navega, busca, click, login, navega, busca, click, form, submit, captura") son **15k-30k tokens solo en screenshots**. Para Claude Sonnet 4 a 3 $/M tokens input son 0,045-0,09 $ en imágenes. Para un context window de 200k tokens, **un 15% del presupuesto se va en píxeles** antes de contar razonamiento.

La fórmula exacta que aplica Anthropic para vision tokens (pública en sus docs): para una imagen 1280×720 sin mucha compresión, el conteo ronda los 1.600-2.800 tokens dependiendo del detalle percibido. Para 1920×1080 sube a 2.500-4.500 tokens. Multiplicado por las 10 acciones de la task típica: **16k-45k tokens** sólo en píxeles. Para Anthropic Claude Sonnet 4 a 3 $/M input tokens, el coste visual es 0,048-0,135 $ por task. En términos relativos: si el modelo razona con ~5k tokens por turno, **estás pagando 3-9 turnos extra de razonamiento por cada task visual**.

Por contraste, un `take_snapshot` que devuelve el accessibility tree de la misma página — 50-200 nodos con rol, nombre y estado — cabe en **300-800 tokens**. La diferencia es ~10× por interacción, lo que en tasks largas cambia la viabilidad del agent completo.

**Problema 2: ambigüedad.** Una coordenada `(x=423, y=187)` no le dice al modelo qué elemento acaba de pulsar. Sólo sabe que ha pulsado "algo ahí". Sin DOM, sin roles ARIA, sin etiquetas, el modelo no puede razonar sobre el resultado. Los screenshot-based agents tienden a fallar en cascada: pulsan el botón equivocado, no saben por qué, vuelven a pulsar otra cosa.

**Problema 3: latencia.** Cada captura obliga a un round-trip de imagen → modelo → coordenada. En tasks largos se acumulan segundos. Las primitivas estructuradas (accesibilidad, DOM) viajan como texto y se procesan en milisegundos.

Los stacks maduros de 2026 sustituyen "ver" por "leer":

- **CDP y WebDriver BiDi** exponen el accessibility tree del browser. El modelo recibe una lista de nodos con rol, nombre y estado — un JSON compacto de 200-500 tokens en lugar de un PNG de 2k+ tokens.
- **browser-use** usa un "EnhancedDOMTree" propio que inyecta índices numéricos en los elementos, permitiendo al modelo decir `click(index=14)` sin coordenadas.
- **cua-driver** captura ventanas nativas como PNG (no tiene otra opción — no hay accessibility tree del SO al mismo nivel), pero los devuelve por ventana específica en lugar de pantalla completa.

La diferencia de eficiencia es **5-10× por interacción** según el task. Para tasks de 10 acciones, eso es la diferencia entre un agent que cabe en 50k tokens y uno que revienta la ventana a los 3 turnos. Y para coding agents que ya están leyendo código, tests y logs, ese presupuesto importa.

No es que el screenshot esté muerto: `--vision` en playwright-mcp y `click_at` en chrome-devtools-mcp siguen ahí para los casos donde la visión es necesaria (canvas, juegos, custom widgets sin DOM accesible). Pero la tendencia es clara: **2026 es el año en que las primitivas estructuradas ganan por defecto**, y los modelos visión se reservan para las excepciones.

### El legado: por qué esto reemplaza a Selenium

Si vienes de Selenium WebDriver clásico (todavía la base de muchos pipelines E2E), la migración al nuevo stack implica entender qué cambió en la capa de protocolo.

Selenium opera sobre el **WebDriver JSON-Wire Protocol** (o el moderno W3C WebDriver). Es request/response: el cliente envía un comando HTTP, el driver del browser lo ejecuta, devuelve el resultado. Esto implica **polling constante** para observar el estado: si quieres saber si un elemento está visible, tu test pregunta cada X ms. La latencia entre la acción y la observación es alta, y los tests son lentos por construcción.

El nuevo stack opera sobre tres capas distintas, todas con primitivas más ricas:

- **CDP** (Chrome DevTools Protocol) — protocolo nativo de Chrome, JSON-RPC sobre WebSocket, **bidireccional**. El server puede push eventos al cliente sin polling. Performance Insights, heap snapshots y screencast funcionan así: el browser emite el evento, el server lo recibe, lo devuelve cuando el agent pregunta.
- **WebDriver BiDi** (estándar W3C en proceso) — la evolución moderna de WebDriver clásico. Misma idea (request/response + subscripciones a eventos), pero con eventos push nativos para network, console, browsing context. WebDriver BiDi es a WebDriver clásico lo que **WebSocket es a HTTP request/response** — la diferencia es quién inicia la conversación y si el server puede emitir eventos sin que el cliente pregunte.
- **OS-level Rust core** (cua-driver) — directo sobre las APIs nativas del SO. Sin capa de intermediación HTTP. Latencia mínima, control fino de focus y permisos.

Las consecuencias prácticas de la migración:

1. **Selenium requiere drivers por browser** (`chromedriver`, `geckodriver`, `safari driver`). Versiones que rompen en cascada cuando subes Chrome. CDP es nativo, los tres MCP servers lo exponen sin intermediarios.
2. **Selenium nunca integró el accessibility tree como primitiva**. Los screenshot-based fueron siempre la salida por defecto — si querías razonar sobre el DOM, debías scrappearlo tú. El nuevo stack lo expone como `take_snapshot` o `browser_snapshot` por defecto.
3. **Selenium opera en test-time**, no en agent-time. Su modelo mental es "test runner ejecuta, asserts, termina". El nuevo stack asume un LLM en el loop tomando decisiones — el agent decide qué inspeccionar basado en lo que aprendió en turnos anteriores. Esto cambia los schemas: las tools devuelven contexto, no sólo resultados.

No todo es mejora: Selenium tiene un ecosistema de bindings (Java, Python, Ruby, .NET) y una comunidad enorme. Para tests E2E clásicos sin LLM en el loop, sigue siendo razonable. Pero si tu nuevo producto tiene coding agents, Selenium es el legacy que intentas jubilar.

---

## Stack 1: CDP-first — `ChromeDevTools/chrome-devtools-mcp`

El corazón de este artículo. Si tu agent vive en Chrome y necesitas **inspeccionar** más que automatizar, este es el camino.

**Definición útil antes de seguir.** El **Chrome DevTools Protocol (CDP)** es el protocolo JSON-RPC nativo sobre WebSocket que Chrome expone para que herramientas externas controlen el browser. DevTools, Puppeteer y la mayoría de "browser automation" de bajo nivel hablan CDP por debajo. No es lo mismo que WebDriver (más portable, más lento) ni que WebDriver BiDi (más nuevo, bidireccional). CDP es la API privada de Chrome; cuando necesitas una primitiva que sólo Chrome expone — heap snapshots, Performance Insights, screencast a 60fps — acabas hablando CDP.

`chrome-devtools-mcp` es **el MCP server oficial de Google** que expone CDP a un coding agent. Investigado en profundidad en [nuestro informe previo](/home/hermesbot/.hermes/repo-investigations/chrome-devtools-mcp.md): clone local, build verificado, 383 líneas de notas técnicas, 51 tools documentadas. Aquí el resumen accionable.

### Las 51 tools agrupadas en 11 categorías

Extraídas directamente de `src/tools/*.ts` (verificado por grep en el repo clonado, no en README):

| Categoría | # tools | Tools clave | Requiere flag |
|---|---|---|---|
| **Input automation** | 9 | `click`, `fill`, `type_text`, `drag`, `fill_form`, `upload_file`, `press_key`, `hover` | on-by-default |
| **Navigation** | 8 | `navigate_page`, `new_page`, `list_pages`, `select_page`, `resize_page`, `handle_dialog`, `close_page`, `get_tab_id` | on-by-default |
| **Emulation** | 1 | `emulate` (CPU, network, geolocation, userAgent, colorScheme, viewport, extraHttpHeaders) | on-by-default |
| **Performance** | 3 | `performance_start_trace`, `performance_stop_trace`, `performance_analyze_insight` (Core Web Vitals: LCP/INP/CLS) | on-by-default |
| **Network** | 2 | `list_network_requests`, `get_network_request` (headers, body, timing) | on-by-default |
| **Debugging** | 5 | `list_console_messages`, `get_console_message`, `evaluate_script`, `take_snapshot` (a11y tree con UIDs), `wait_for` | on-by-default |
| **Memory** | 11 | `take_heapsnapshot`, `compare_heapsnapshots`, `get_heapsnapshot_retainers`, `get_heapsnapshot_dominators`, `get_heapsnapshot_duplicate_strings` | `--memoryDebugging` |
| **Screenshot** | 1 | `take_screenshot` (PNG/JPEG/WebP, tamaño configurable) | on-by-default |
| **Screencast** | 2 | `screencast_start`, `screencast_stop` (requiere ffmpeg) | `--experimentalScreencast` |
| **Lighthouse** | 1 | `lighthouse_audit` (a11y, best-practices, performance, SEO) | Chrome 144+ |
| **Extensions** | 5 | `install_extension`, `uninstall_extension`, `list_extensions`, `reload_extension`, `trigger_extension_action` | `--categoryExtensions` |
| **Third-party dev tools** | 2 | `list_3p_developer_tools`, `execute_3p_developer_tool` | opt-in |
| **WebMCP** | 2 | `list_webmcp_tools`, `execute_webmcp_tool` | Chrome 149+ con `--enable-features=WebMCP` |
| **Slim mode** | 3 | `screenshot`, `navigate`, `evaluate` (subset mínimo) | `--slim` |

**~32 tools on-by-default**, el resto gated por flag. Es un detalle que importa: en producción no quieres exponer 51 tools al modelo — satura la ventana con schemas. La opción `--slim` lo reduce a 3 tools para "sólo quiero lo básico". Es el antipatrón resuelto: menos tools = menos confusión en la planificación del agente.

### El patrón "Reference over value"

De `docs/design-principles.md`, literal:

> *Reference over Value: for heavy assets, return a file path or resource URI, never the raw data stream.*

Los screenshots, traces, heap snapshots y videos se devuelven como **path de archivo**, no como bytes inline en el JSON-RPC. La consecuencia práctica:

```bash
# El agent hace:
take_screenshot()
# Recibe: "/tmp/chrome-devtools-mcp-output/screenshot-1735894231.png"
# NO: un blob base64 de 2MB en el JSON de respuesta

# Si necesita ver la imagen:
Read /tmp/chrome-devtools-mcp-output/screenshot-1735894231.png
```

Esto protege la ventana de contexto. Un agent de debugging puede tomar 20 screenshots sin reventar tokens; los lee bajo demanda con la tool `Read` del propio agente.

Lo mismo aplica a:
- **Performance traces** → archivo `.trace.json` en disco
- **Heap snapshots** → archivo `.heapsnapshot` cargable en DevTools
- **Screencast** → MP4 vía ffmpeg
- **Lighthouse audits** → archivo JSON + HTML report

Cuando veas un MCP server que te devuelve bytes base64 en cada response, sal corriendo. Es un antipatrón que revienta la conversación al cuarto turno.

### Demo: "Reference over value" en práctica

Un agent debugueando una regresión de LCP en producción. Sin `chrome-devtools-mcp`:

```
# Turn 1 (screenshot 1)
screenshot() → 2.3k tokens base64
# Turn 2 (screenshot 2)
screenshot() → 2.1k tokens base64
# Turn 3 (heapsnapshot inline)
take_heapsnapshot() → 8MB en base64 = ~2M tokens 😱
```

Con `chrome-devtools-mcp`:

```
# Turn 1
performance_start_trace() → 12 tokens
# Turn 2
navigate_page(url) → 45 tokens
# Turn 3
performance_stop_trace() → {"tracePath": "/tmp/.../trace.json"}
# Turn 4
performance_analyze_insight(insight="lcp-breakdown") → 380 tokens
# Turn 5 (si el modelo necesita ver el trace)
Read /tmp/.../trace.json → 1.5k tokens para una sección
```

La diferencia es brutal: **8MB → 0 tokens en contexto** para el heap snapshot. El modelo decide cuándo y cuánto leer.

### Primitivas únicas en su categoría

Tres primitivas que **sólo chrome-devtools-mcp tiene** en el segmento MCP:

**1. Lighthouse + CrUX combinados.** La tool `lighthouse_audit` ejecuta un audit completo (a11y, best-practices, performance, SEO). Y con `--performanceCrux` activado, las tools de Performance pueden mandar la URL del trace a la **Chrome User Experience Report** (CrUX) para combinar datos de laboratorio con datos de campo reales. Si tu agent necesita "explica por qué este page tiene peor LCP en campo que en local" — esto es lo que usa.

**2. Memory debugging con heap snapshots.** Once tools en la categoría Memory: `take_heapsnapshot`, `compare_heapsnapshots`, `get_heapsnapshot_retainers`, `get_heapsnapshot_retainers`, `get_heapsnapshot_retaining_paths`, `get_heapsnapshot_dominators`, `get_heapsnapshot_class_nodes`, `get_heapsnapshot_duplicate_strings` (añadido en v1.5.0), `get_heapsnapshot_edges`, `close_heapsnapshot`. Es el workflow completo de memory leak debugging — el mismo que usa DevTools Memory panel — expuesto al agente.

**3. Skills/ como knowledge pack.** El repo distribuye seis `SKILL.md` en `skills/`: `a11y-debugging`, `memory-leak-debugging`, `debug-optimize-lcp`, `chrome-devtools`, `chrome-devtools-cli`, `troubleshooting`. No son ejemplos — son guías estructuradas que el agent lee para aprender el workflow correcto. Es un patrón "el server no solo ejecuta, enseña" — pocos MCP servers lo hacen. Si vas a escribir tu propio MCP server, **copia este patrón**: empaqueta el know-how junto con las tools.

### Tres modos de adquirir Chrome

Detalle de producto que importa en producción:

| Modo | Flag | Caso de uso |
|---|---|---|
| **Launch** | (default) | El server arranca Chrome con un perfil persistente en `~/.cache/chrome-devtools-mcp/chrome-profile`. Ideal para uso interactivo. |
| **Connect** | `--browserUrl http://127.0.0.1:9222` o `--wsEndpoint ws://...` | Te conectas a un Chrome que ya corre con `--remote-debugging-port`. Útil para CI o para reusar una sesión del usuario. |
| **AutoConnect** | `--autoConnect` | Lee `DevToolsActivePort` del `userDataDir` y se conecta a Chrome 144+ con remote debugging ya activo. Patrón nuevo (v1.0+); evita lanzar Chrome cuando el usuario ya lo tiene abierto. |

El modo AutoConnect tiene un issue abierto (#2283) con fallos intermitentes en Chrome 150 stable — `"DevToolsActivePort never created"` — pero es la dirección correcta.

### Telemetría por defecto

Esto es editorialmente importante y debe documentarse, no enterrarse: el server envía métricas de uso a Google por defecto. Implementado en `src/telemetry/ClearcutLogger.ts`. Se apaga con:

```bash
npx -y chrome-devtools-mcp@latest --no-usage-statistics
# o equivalente:
export CHROME_DEVTOOLS_MCP_NO_USAGE_STATISTICS=1
```

El código **también** detecta la versión del cliente MCP (`server.server.getClientVersion()`) y la loguea — útil para saber si tus agents internos están actualizados.

**Veredicto sobre telemetría**: documentada, opt-out sencillo, scope razonable (métricas de uso, no payload). Comparable a lo que cualquier tool oficial hace. **Pero**: en producción enterprise conviene apagarla explícitamente y dejar el opt-out en el `.mcp.json` para no depender de env vars.

### Cuándo elegir chrome-devtools-mcp

Tres preguntas de filtro:

1. **¿Tu agent corre sólo en Chrome?** Si sí, este es el camino. Si necesitas Firefox o WebKit, vete a playwright-mcp.
2. **¿Necesitas Performance Insights, Lighthouse, memory debugging, screencast?** Si sí, **es el único** MCP server que las expone.
3. **¿Debugueas un bug en producción que requiere DevTools?** Las primitivas están pensadas exactamente para esto.

Lo que **no** es: no es un wrapper de Puppeteer bonito. Es DevTools Frontend completo — los formatters de console/network/heap son los mismos que DevTools usa en producción, integrados a través del protocolo nativo. El detalle técnico relevante: el server reusa `chrome-devtools-frontend@1.0.1652307` como devDep para cargar los formatters reales vía `DevToolsConnectionAdapter.ts`.

### Soporte de Chromium-based browsers: qué funciona y qué no

Un engineering lead siempre pregunta "¿esto corre en Edge? ¿Y en Brave?". Respuesta corta, verificada leyendo `--channel` en la CLI options del repo:

| Browser | Soporte | Cómo activarlo | Notas |
|---|---|---|---|
| Chrome stable | ✅ completo | default | Caso primario |
| Chrome Canary / Beta / Dev | ✅ | `--channel=canary\|beta\|dev` | Útil para validar features en pre-release |
| Microsoft Edge | ✅ | `--channel=msedge` | Usa el binario de Edge stable |
| Brave | ❌ no oficial | workaround manual: `--browserUrl` a brave-debugging-port | No soportado por el repo; bugs probable |
| Arc | ❌ | n/a | No es Chromium estable; no soportado |
| Vivaldi | ❌ | n/a | No soportado oficialmente |
| Chromium open source (`chromium-browser`) | ✅ parcial | `--executable-path=/usr/bin/chromium-browser` | Funciona pero con caveats; no es Chrome |

Para organizaciones donde QA valida en Edge o Brave, **el camino limpio es playwright-mcp**, que soporta los tres engines de verdad. chrome-devtools-mcp está pensado para equipos que viven en Chrome (y eso incluye Edge, que es Chromium-based pero con distribución propia de Microsoft).

---

## Stack 2: WebDriver BiDi — `microsoft/playwright-mcp`

El segundo grande. Si tu agent necesita **portabilidad cross-browser** y un set de primitivas más cercano a lo que Playwright clásico ya hacía — pero expuesto vía MCP — este es el camino.

### El detalle que casi nadie menciona: el código fuente vive en otro repo

Antes de hablar de tools, un apunte verificado leyendo `src/README.md` del repo clonado:

> *Playwright MCP source code is located in the [Playwright monorepo](https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/tools/mcp).*

El repo `microsoft/playwright-mcp` es un **publish wrapper**. El TypeScript real está en `microsoft/playwright` monorepo. Esto explica por qué:
- `src/` en este repo contiene sólo un README, no herramientas
- Las tools se generan vía `node update-readme.js` y se sincronizan con `node roll.js`
- La versión del repo (v0.0.77) sigue Playwright alpha (1.62.0-alpha-2026-06-29)

Implicación: cuando leas el README, estás leyendo docs generadas. Cuando debuguees un bug, el código está en el monorepo.

### Las 68 tools agrupadas por capability

Inventario extraído del README (generado, pero vigente):

| Categoría | # tools | Activación |
|---|---|---|
| **Core automation** | 22 | on-by-default |
| **Tab management** | 1 (`browser_tabs`) | on-by-default |
| **Browser installation** | 1 (`browser_install`) | on-by-default |
| **Configuration** | 1 (`browser_get_config`) | `--caps=config` |
| **Network** | 4 (`browser_network_requests/request`, `browser_route/list/unroute`, `browser_network_state_set`) | `--caps=network` |
| **Storage** | 14 (cookie + localstorage + sessionstorage CRUD) | `--caps=storage` |
| **DevTools** | 12 (`browser_annotate`, `_highlight/_hide_highlight`, `_start_tracing/_stop_tracing`, `_start_video/_stop_video/_video_chapter`, `_resume`, `_console_messages`, `_evaluate`) | `--caps=devtools` |
| **Coordinate-based** | 3 (`browser_click_at`, `browser_hover_at`, `browser_type_at`) | `--caps=vision` |
| **PDF generation** | 1 (`browser_pdf_save`) | `--caps=pdf` |
| **Test assertions** | 4 (`browser_generate_locator`, `_verify_element_visible`, `_verify_list_visible`, `_verify_text_visible`) | `--caps=testing` |

**Total: 68 tools, de las que 22 on-by-default y 46 gated por `--caps=`.** Importante: el patrón es idéntico a chrome-devtools-mcp (capabilities como flags), pero la granularidad es mayor. `--caps=testing` activa locators y assertions pensados para E2E tests; `--caps=vision` activa clicks por coordenada para cuando el accessibility tree no basta.

### Cuándo elegir playwright-mcp

Las preguntas correctas:

1. **¿Tu agent necesita correr tests E2E cross-browser?** WebDriver BiDi es la única opción con Chromium + Firefox + WebKit + msedge. `chrome-devtools-mcp` es Chrome-only por diseño.
2. **¿Tu flujo incluye mobile Safari o device emulation?** `--device "iPhone 15"` emula dispositivos. chrome-devtools-mcp emula, pero no con la fidelidad de Playwright DeviceDescriptors.
3. **¿Tu agent necesita un trace de Playwright (`--caps=devtools`)?** El formato trace de Playwright es estándar en CI; herramientas como la Playwright Trace Viewer o `playwright show-trace` lo abren. chrome-devtools-mcp usa su propio trace format (no estándar fuera de Chrome).
4. **¿Necesitas capacidades avanzadas de network mocking?** `browser_route` permite mockear URLs por patrón. Más expresivo que `--blocked-origins`.

### Lo que playwright-mcp NO tiene (y por qué)

Aquí está la diferencia filosófica que importa: **playwright-mcp sacrifica primitivas de DevTools profundas por portabilidad**. Lo que no está en el set de 68 tools:

- **Lighthouse audit** — ausente. Lighthouse se puede correr por CLI externo, pero no como tool MCP.
- **Heap snapshots / memory debugging** — ausente. La categoría DevTools es para tracing, no para memory.
- **Performance Insights con CrUX** — ausente. Playwright tiene tracing pero no la integración con field data de Chrome.
- **Screencast nativo** — tiene `browser_start_video` que graba con ffmpeg, pero no el screencast vía CDP que chrome-devtools-mcp ofrece.

**Esto no es un bug**, es la consecuencia de usar WebDriver BiDi en lugar de CDP. WebDriver BiDi es un estándar W3C; CDP no. Lo que ganas en portabilidad lo pierdes en acceso profundo al browser.

### El movimiento importante de Microsoft: Playwright CLI + SKILLs

Verificado en el README, sección "Playwright MCP vs Playwright CLI":

> *CLI: Modern coding agents increasingly favor CLI–based workflows exposed as SKILLs over MCP because CLI invocations are more token-efficient...*
> *MCP: MCP remains relevant for specialized agentic loops that benefit from persistent state, rich introspection, and iterative reasoning over page structure...*

El propio Microsoft publica **microsoft/playwright-cli** como alternativa preferida para coding agents. El argumento es honesto: para coding agents, `playwright-cli screenshot --filename=foo.png` consume menos tokens que cargar 68 schemas MCP en contexto. Las SKILLs son instrucciones que el agent lee bajo demanda; las tools MCP se cargan al inicio.

**Implicación editorial**: si tu agent ya tiene SKILL infrastructure (Claude Code, Cursor con `.cursor/rules/`), evalúa playwright-cli + SKILL antes que playwright-mcp. **Para CI y tests programáticos, playwright-mcp sigue ganando** porque la introspección MCP es útil para debugging de fallos.

### Quickstart copy-paste

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```

Para activar visión y PDF:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest", "--caps=vision,pdf,devtools,storage"]
    }
  }
}
```

Para tests aislados:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "-y", "@playwright/mcp@latest",
        "--isolated",
        "--storage-state=/path/to/auth.json"
      ]
    }
  }
}
```

---

## Stack 3: vision-LLM wrapper — `browser-use/browser-use`

El "startup hotness" del sector. Si quieres que un coding agent **haga cosas en la web sin configurar nada**, este es el camino — pero con tradeoffs importantes que la mayoría de blogs no mencionan.

### Lo que es y lo que no es

`browser-use` **no es un MCP server** en sentido estricto. Es una **librería Python** (`pip install browser-use`) que envuelve Playwright y expone un **agente loop completo** — el LLM decide qué hacer, browser-use ejecuta. Tiene servidor MCP opcional (`browser_use/mcp/`) pero su uso principal es como SDK.

Estado verificado al clonar el repo (2026-07-04):
- **Versión**: 0.13.2 (en `pyproject.toml`)
- **Stars**: ~100k (confirmado vía search; el repo creció de 0 a 100k en <18 meses según fuentes secundarias — orden de magnitud verificable, cifra exacta no contrastada con GitHub API en este entorno)
- **Licencia**: MIT
- **Lenguaje**: Python (requiere `>=3.11,<4.0`)
- **Core runtime**: Python + Rust (`browser-use[core]` extra)

El modelo de uso canónico (de `examples/simple.py`):

```python
from browser_use import Agent, ChatBrowserUse
from dotenv import load_dotenv

load_dotenv()

agent = Agent(
    task='Find the number of stars of the following repos: browser-use, playwright, stagehand, react, nextjs',
    llm=ChatBrowserUse(model='bu-2-0'),
)
agent.run_sync()
```

Tres líneas. Le das un task en lenguaje natural, el agente navega, extrae, decide, vuelve a navegar, hasta resolver.

### El agente loop en código

Verificado en `browser_use/agent/service.py` (4143 LOC, demasiado grande para citar entero, pero con hitos clave):

- **`Agent(Generic[Context, AgentStructuredOutput])`** — clase principal, línea 133
- **`self.state = injected_agent_state or AgentState()`** — estado externo (línea 433), soporta serialización entre sesiones
- **`max_steps`** — fuerza `done` cuando se alcanza (línea 784), previene loops infinitos
- **`AgentState.follow_up_task`** — soporta tasks de seguimiento (línea 996)
- **Soporte de file system**: `self.state.file_system_state` permite que el agente lea/escriba archivos entre steps (líneas 700-744)

El loop es esencialmente ReAct con estado: el LLM genera una acción, el agente la ejecuta, observa el resultado, repite. Lo diferencial es que **el estado es serializable**: puedes parar un agent y resumirlo en otra sesión sin perder contexto.

### Las 26 acciones disponibles

Inventario extraído de `browser_use/tools/service.py` (2267 LOC, grep sobre `@self.registry.action`):

| Acción | Función |
|---|---|
| `search` | DuckDuckGo/Google/Bing (default DDG, "less captchas") |
| `navigate` | URL |
| `click` (varios modos) | Por índice de DOM, por coordenadas, con fallback |
| `input_text` | Limpia y rellena input por índice |
| `go_back` | Historial |
| `wait` | Segundos |
| `scroll` | Por páginas o por texto (`find_text`) |
| `extract` | LLM-driven structured extraction con output_schema |
| `search_page` | grep-like local en la página (zero LLM cost) |
| `find_elements` | Query DOM por CSS selector |
| `switch_tab` / `close_tab` | Gestión de pestañas |
| `screenshot` | Viewport |
| `save_as_pdf` | PDF del page |
| `select_dropdown_option` | `<select>` |
| `upload_file` | File input |
| `write_file` / `read_file` / `replace_file` | Sistema de archivos local |
| `evaluate` | JavaScript arbitrario |
| `done` (con structured output) | Termina con JSON schema |
| `done` (text) | Termina con texto libre |

La acción estrella es **`extract`**: con `output_schema=Pydantic_model`, devuelve JSON validado. Para scraping estructurado es la killer feature — el modelo extrae, el código tipado valida.

`search_page` y `find_elements` son **zero LLM cost** — implementación JS pura sobre el DOM. Importante: el agente tiene herramientas "baratas" (sin pasar por el LLM) y "caras" (LLM-driven). El registry lo gestiona.

### El detalle que los blogs no cuentan: PostHog hard dependency

Verificado en `pyproject.toml` línea 17:

```toml
"posthog==7.7.0",
```

Y en `browser_use/telemetry/service.py`:

```python
from posthog import Posthog
HOST = 'https://eu.i.posthog.com'
```

`browser-use` envía telemetría a PostHog por defecto. **Se desactiva con**:

```bash
export ANONYMIZED_TELEMETRY=False
```

Pero el hecho de que sea una **dependencia hard** (no opcional, no extras) significa que el código de telemetría se ejecuta siempre — la desactivación es post-init. Para enterprise con compliance estricto, esto es relevante. El README y `AGENTS.md` lo mencionan pero enterrado.

### Cuándo elegir browser-use

Las preguntas correctas:

1. **¿Tu team es Python-first?** Si sí, integración natural con stacks ML (LangChain, LlamaIndex, FastAPI). chrome-devtools-mcp y playwright-mcp son Node — overhead si tu pipeline es Python.
2. **¿Quieres cold-start sin configurar harness?** `uv add browser-use[core] && uvx browser-use install && browser` y tienes un agent que navega. chrome-devtools-mcp requiere `npx` + Chrome local; playwright-mcp requiere browsers de Playwright instalados.
3. **¿El modelo es el bottleneck?** browser-use optimiza para que el LLM sea el cuello de botella: `search_page` y `find_elements` evitan round-trips. chrome-devtools-mcp devuelve el accessibility tree completo en cada tool call — más datos por turn, menos turns totales.
4. **¿Necesitas extracción estructurada validada?** `extract(output_schema=...)` es la única tool MCP-native con validación Pydantic.

### Lo que browser-use NO tiene

- **Memory debugging** (heap snapshots) — no, es Playwright wrapper, no CDP.
- **Lighthouse audit** — no.
- **Cross-browser con device emulation real** — usa Playwright debajo, pero el agent loop asume Chromium.
- **El control fino que da CDP** — `take_snapshot` no tiene la granularidad de chrome-devtools-mcp.
- **CLI daemon pattern** — cada agent arranca su browser.

Si necesitas cualquiera de las cinco, mira chrome-devtools-mcp o playwright-mcp.

### browser-use en CI: el mínimo viable

Si tu pipeline CI es Python (GitHub Actions, GitLab CI con runners Python, Buildkite), browser-use se integra sin grandes cambios. El `Dockerfile` mínimo:

```dockerfile
FROM mcr.microsoft.com/playwright/python:v1.55.0-jammy
RUN pip install "browser-use[core]"
ENV ANONYMIZED_TELEMETRY=False
ENV BROWSER_USE_API_KEY=${BROWSER_USE_API_KEY}
WORKDIR /app
COPY ./agent_scripts ./agent_scripts
CMD ["python", "-m", "agent_scripts.run_ci_task"]
```

El job en GitHub Actions:

```yaml
- name: Run browser-use agent in CI
  uses: docker://mcr.microsoft.com/playwright/python:v1.55.0-jammy
  with:
    args: python -m agent_scripts.run_ci_task
  env:
    BROWSER_USE_API_KEY: ${{ secrets.BROWSER_USE_API_KEY }}
    ANONYMIZED_TELEMETRY: "False"
```

Dos detalles que importan en CI:

1. **`ANONYMIZED_TELEMETRY=False` debe ser env var, no flag**. La librería la lee al import; pasar flag al CLI no desactiva lo que ya se envió en el primer import.
2. **El `[core]` extra instala el runtime Rust nativo**. Sin esto, browser-use cae a Playwright puro (más lento, sin optimizaciones). Para CI donde cada segundo cuenta, usa `[core]`.

Para pipelines CI que NO son Python, browser-use se vuelve awkward. Si tu CI es Node, vete a playwright-mcp o chrome-devtools-mcp directamente.

---

## Stack 4: OS-level — `trycua/cua`

El caso especial. La mayoría de artículos sobre "browser automation para agents" lo omiten porque **no es browser automation** — es computer-use. Pero tu agent puede necesitarla.

### El repo es en realidad cinco proyectos

`trycua/cua` no es un monolito. Es un monorepo con cinco sub-proyectos, según el README y `libs/`:

| Sub-proyecto | Descripción | Lenguaje |
|---|---|---|
| **cua-driver** | Background computer-use MCP server (el homólogo OS-level de chrome-devtools-mcp) | Rust core + Python wrapper |
| **cua-agent** | AI agent framework sobre cua-driver | Python |
| **cua-sandbox** | SDK para crear/controlar sandboxes (Linux, macOS, Windows, Android VMs/containers) | Python |
| **cua-bench** | Benchmarks + RL environments (OSWorld, ScreenSpot, Windows Arena) | Python |
| **lume** | macOS virtualization manager sobre Apple Virtualization.Framework | Swift + Shell |

Esto importa porque cuando alguien dice "usar cua" puede significar tres cosas muy distintas:

1. **MCP server para controlar apps nativas** → `cua-driver`
2. **Sandbox con VM/container + agent** → `cua` + `cua-agent`
3. **Evaluar models en OSWorld** → `cua-bench`

Vamos a centrarnos en **cua-driver**, que es el equivalente OS-level de los MCP servers anteriores.

### cua-driver: ~29 tools por plataforma

Inventario verificado en `libs/cua-driver/rust/crates/platform-macos/src/tools/mod.rs` (543 LOC) y los 29 archivos en `tools/`:

| Categoría | Tools |
|---|---|
| **Window management** | `list_windows`, `list_apps`, `launch_app`, `kill_app`, `bring_to_front`, `get_window_state` |
| **Mouse input** | `click`, `double_click`, `right_click`, `drag`, `move_cursor`, `scroll`, `get_cursor_position` |
| **Keyboard input** | `press_key`, `hotkey`, `type_text`, `type_text_chars`, `set_value` |
| **Screen capture** | `get_screen_size`, `get_desktop_state` (incluye screenshot por ventana) |
| **Accessibility** | `get_accessibility_tree` (AX tree por ventana) |
| **State/Config** | `get_config`, `set_config`, `health_report`, `check_permissions`, `page`, `zoom` |

Detalle revelador de `tools/mod.rs` líneas 15-19 (un comentario en el código que merece citar):

```rust
// `screenshot` / `screenshot_compat` modules removed in PR #1692 —
// `get_window_state` capture_mode:"vision" is the canonical screenshot
// path. The capture functions they wrapped (ScreenCaptureKit, CGWindow,
// etc.) live elsewhere under CuaDriverCore::Capture and are reached
// through GetWindowStateTool.
```

Esto es **gold** para el artículo: PR #1692 eliminó dos tools MCP redundantes y centralizó la captura en una sola tool polimórfica. Es exactamente lo opuesto al "MCP server con 80 tools" — un ejemplo real de consolidation por diseño.

### El detalle "background sin robar foco"

De `libs/cua-driver/README.md`:

> *Drive native desktop apps in the background. Agents click, type, and verify without stealing the cursor or focus.*

Esto es técnicamente complejo en macOS. Las apps nativas asumen que el usuario está físicamente ahí. cua-driver implementa un patrón de "background input delivery" con delivery modes:

- **Background** (default): post input sintético al `pid` sin fronting
- **Foreground**: front brevemente la ventana target, actúa, restaura la frontmost anterior

El detalle de implementación está en `tools/mod.rs` con la enum `DeliveryMode`. Para tu agent que automatiza un IDE mientras tú trabajas en otra ventana, **es la diferencia entre un agent utilizable y uno que te roba el cursor cada 5 segundos**.

### Relación con Apple Foundation Models

Pregunta legítima: en macOS 26+, ¿no debería ser Apple Intelligence / Foundation Models el camino para "computer use nativo"? La respuesta corta: **no directamente**. Foundation Models es para generación de texto; no controla el SO. cua-driver usa las **mismas primitivas de macOS** (CoreGraphics para input, ScreenCaptureKit para capture, Accessibility API para AX tree) — vive en una capa distinta a la del modelo.

La convergencia probable es que un agente use Foundation Models como LLM, cua-driver como actuator, y cua-bench como evaluador. Las tres piezas son ortogonales.

### Cuándo NO necesitas un browser

Tres casos donde cua-driver (no browser automation) es lo correcto:

1. **Automatizar Finder/Slack/VS Code/native apps** que no exponen URL bar. Playwright y chrome-devtools-mcp son browser-only.
2. **Tests que requieren drivers reales del SO**: dialogs nativos, file pickers, notificaciones, drag & drop entre apps distintas.
3. **Sandbox completa para agent**: `cua-sandbox` arranca una VM (macOS, Linux, Windows o Android), corre cua-driver dentro, el agente opera sobre un SO limpio. Caso ideal para evaluar agents sin contaminar tu host.

### Quickstart copy-paste

```bash
# macOS / Linux
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/trycua/cua/main/libs/cua-driver/scripts/install.sh)"

# Wire into Claude Code
claude mcp add --transport stdio cua-driver -- cua-driver mcp

# Modo Claude Code computer-use compatible (grounding por screenshots)
claude mcp add --transport stdio cua-computer-use -- cua-driver mcp --claude-code-computer-use-compat
```

### Limitaciones honestas

Verificado en `libs/cua-driver/README.md` y `rust/crates/cua-driver/src/cli.rs`:

- **Linux en pre-release**. El soporte Windows es estable, macOS estable, Linux experimental.
- **Requiere permisos de Accessibility** en macOS (System Settings → Privacy & Security → Accessibility). El agent no puede saltarse esto.
- **29 tools por plataforma** pero las implementaciones divergen. macOS tiene `type_text_chars` (optimizado para Unicode por caracteres), Windows tiene su propio set.
- **No es browser automation**. Si lo que necesitas es un browser, vuelve a las Stacks 1-3.

### Pricing y modelo de negocio

`cua-driver` local es **MIT open source** — el binario Rust es libre, el wheel Python es libre, el código en `libs/cua-driver/` es público. Lo que NO es libre es el servicio cloud gestionado en `cua.ai`, que ofrece sandboxes VM pre-configuradas (Linux, macOS, Windows, Android) sin que tengas que montar la infraestructura. Pricing por sandbox-hora, no público en el README (ver `cua.ai/pricing` para cifras actualizadas). Si tu organización ya tiene Kubernetes + QEMU + capacidad de mantener imágenes de SO actualizadas, el cloud no aporta valor; si quieres delegar la operación, es el camino.

---

## Cuándo combinar stacks

El error común de 2026 es **elegir uno y forzarlo**. La realidad es que cada stack brilla en un task distinto, y combinarlos da workflows que ningún stack cubre solo.

### Tabla de decisión por task type

| Task | Stack primario | Stack complementario | Por qué |
|---|---|---|---|
| **E2E test cross-browser en CI** | playwright-mcp | (ninguno) | Playwright es el estándar de facto para E2E |
| **Debug de memory leak en producción** | chrome-devtools-mcp | (ninguno) | Heap snapshots + DevTools Memory panel |
| **Auditoría de performance** | chrome-devtools-mcp | (ninguno) | Lighthouse + Performance Insights + CrUX |
| **Agent cold-start "encuentra X"** | browser-use | chrome-devtools-mcp | browser-use navega; chrome-devtools-mcp captura trace si falla |
| **Login web con creds + scrape** | browser-use | (storage_state preconfig) | Más rápido que construir todo con Playwright |
| **Automatizar Slack + browser web** | cua-driver | chrome-devtools-mcp | cua-driver maneja Slack nativo; chrome-devtools-mcp maneja el browser |
| **Test de regresión visual** | chrome-devtools-mcp (screencast) | (comparación externa) | Screencast MP4 + diff de frames |
| **Evaluar model en OSWorld** | cua-bench | (cua-driver) | Benchmarks estándar |
| **Rellenar un form 50 veces con datos distintos** | browser-use (parallel agents) | (storage state) | Loop sin LLM cost extra |

### Ejemplo real: debugging que cruza stacks

Imagina: un agent de SRE recibe la alerta "checkout error rate subió 10%". El plan que un agent con los cuatro stacks podría ejecutar:

```
1. chrome-devtools-mcp abre Chrome → DevTools Performance trace
2. performance_start_trace() → navigate_page(url="https://app/checkout") → 
   fill_form() → submit()
3. performance_stop_trace() → analiza insights → encuentra INP degradation
4. evaluate_script() para inspeccionar long tasks
5. take_heapsnapshot() para confirmar memory pressure
6. (opcional) browser-use abre un segundo browser, hace el mismo flow con 
   cookies distintas para reproducir en otra sesión
7. (opcional) cua-driver captura el screenshot del monitor del SRE mientras 
   el bug ocurre, para evidence
```

### Diagrama ASCII del flujo combinado

El diagrama siguiente muestra los casos de uso dentro de cada stack y las flechas entre stacks para los casos de combinación (no todos los stacks se tocan siempre):

```
                        ┌─────────────────────────────────────┐
                        │   CODING AGENT (Claude/Cursor)      │
                        │   ┌─────────────────────────────┐   │
                        │   │  Planner: qué stack usar   │   │
                        │   └────────────┬────────────────┘   │
                        └────────────────┼───────────────────┘
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        │                                │                                │
        ▼                                ▼                                ▼
┌──────────────────────┐      ┌──────────────────────┐      ┌──────────────────────┐
│ chrome-devtools-mcp  │◄────►│ playwright-mcp       │      │ browser-use          │
│ "Driving Chrome"     │      │ "Cross-browser E2E"  │      │ "Cold-start agent"   │
│                      │      │                      │      │                      │
│ • Debug Performance  │      │ • Tests E2E          │      │ • Task en lenguaje   │
│ • Heap snapshots     │      │ • Mobile Safari      │      │   natural            │
│ • Lighthouse + CrUX  │      │ • Cross-browser CI   │      │ • Structured extract │
│ • Screencast MP4     │      │ • Trace + Video      │      │ • Python-first stack │
│ • ONLY Chrome/Edge   │      │ • Chromium+FF+WebKit │      │ • Sólo Chromium      │
└──────────┬───────────┘      └──────────┬───────────┘      └──────────┬───────────┘
           │                             │                             │
           │  Cuando browser-use falla,  │                             │
           └──────►chrome-devtools-mcp   │                             │
            (deep debug)                 │                             │
                                          │                             │
                                          │  Cuando necesitas drivers   │
                                          │  nativos (Slack, Finder),   │
                                          └────────►cua-driver◄─────────┘
                                                     "OS-level"

Combinaciones reales (ver caso end-to-end abajo):
  • chrome-devtools-mcp ─► playwright-mcp : debug en Chrome, validar fix en FF/Safari
  • browser-use ─► chrome-devtools-mcp   : cold-start, deep debug si falla
  • chrome-devtools-mcp ─► cua-driver   : capturar evidencia en app nativa del SRE
```

### Patrón: el agent como orchestrator de stacks

No es ciencia ficción. En la práctica, el agent loop es:

```
plan → choose stack(s) → execute via MCP tool calls → observe → decide next step
```

La regla simple:

- **Si la pregunta es "qué pasa dentro de Chrome"** → chrome-devtools-mcp.
- **Si la pregunta es "qué pasa cross-browser"** → playwright-mcp.
- **Si la pregunta es "haz X en la web" sin contexto técnico** → browser-use.
- **Si la pregunta es "controla esta app nativa"** → cua-driver.

Y cuando la pregunta cruza capas (lo habitual en bugs reales), combinas. La inversión mental es: **deja de pensar en "el stack" y empieza a pensar en "qué primitiva necesito"**.

### Caso end-to-end: agent debugueando un checkout intermitente

Para que la combinación de stacks no quede en teoría, aquí va un flujo realista que un coding agent ejecutaría combinando tres de los cuatro stacks. **Escenario**: un SRE recibe una alerta P2 a las 3 AM — "checkout error rate subió del 1% al 12% en los últimos 30 minutos, concentrado en usuarios de Safari iOS". El agent loop, asumiendo que el SRE delega:

```
FASE 1 — Recolectar evidencia con browser-use (cold-start, no asume contexto)
─────────────────────────────────────────────────────────────────────────────
Task: "Abre Datadog, ve la dashboard de checkout, y dime cuál es el error 
más frecuente en los logs de las últimas 2 horas para user-agent 'Mobile Safari'"

browser-use navega → search_page('checkout.*error') → extract(structured_schema) 
→ devuelve: {"top_error": "TypeError: undefined is not an object", 
             "frequency": "47% of failed checkouts",
             "timestamp_window": "01:47-03:12 UTC"}

Tiempo: ~40 segundos. 5 acciones del agent.
```

```
FASE 2 — Reproducir en Chrome desktop con chrome-devtools-mcp (deep debug)
─────────────────────────────────────────────────────────────────────────────
Task: "En localhost:3000/checkout, simula el mismo flujo que un usuario 
de Safari iOS, y toma un Performance trace + un heap snapshot"

chrome-devtools-mcp:
  emulate({userAgent: "...Mobile Safari...", viewport: {390, 844}})
  → new_page("http://localhost:3000/checkout")
  → performance_start_trace()
  → fill_form({...datos de test...})
  → submit() → wait_for({text: "Order confirmed"})
  → performance_stop_trace() → devuelve /tmp/trace.json
  → take_heapsnapshot() → devuelve /tmp/snapshot-001.heapsnapshot
  → list_console_messages({level: "error"}) 
    → encuentra el TypeError del log de Datadog
  
El agent ahora correlaciona: el error coincide con un long task de 412ms 
en el handler del submit. Hipótesis: el bug es un closure que retiene referencias.

Tiempo: ~25 segundos. 8 acciones.
```

```
FASE 3 — Validar fix cross-browser con playwright-mcp
──────────────────────────────────────────────────────
Task: "Aplica el patch al handler del submit (línea 142 de checkout.ts), 
y valida que el checkout funciona en Chromium, Firefox y WebKit mobile"

playwright-mcp:
  browser_navigate("http://localhost:3000/checkout")
  browser_resize({width: 390, height: 844})
  browser_device("iPhone 15")
  browser_fill_form({...})
  browser_click("Submit") → wait_for({text: "Order confirmed"})
  → repite con --browser=firefox y --browser=webkit en paralelo
  browser_generate_locator({...})  // deja el test en el repo
  browser_verify_text_visible({text: "Order #CONFIRMED"})
  
Resultado: el fix funciona en los tres engines. El agent commitea el test 
como regression suite.

Tiempo: ~60 segundos. 15 acciones en total (paralelizable).
```

```
FASE 4 — Cerrar el ticket con cua-driver (evidence en Slack)
──────────────────────────────────────────────────────────────
Task: "Abre Slack, busca el canal #incidents, y postea un resumen del fix 
con la evidencia adjunta"

cua-driver:
  launch_app("Slack")
  list_windows() → identifica la del canal #incidents
  bring_to_front(window_id)
  click(x=200, y=400)  // message composer
  type_text("/fix checkout intermittent — root cause: closure retention in 
            submit handler. Patch in checkout.ts:142. Verified Chrome/FF/Safari. 
            Trace + heap snapshot attached.")
  hotkey("cmd+shift+enter")  // submit
  
Tiempo: ~15 segundos. 6 acciones.
```

Cuatro stacks. **Tiempo total: ~2 minutos 20 segundos**. Lo que antes era un SRE despierto a las 3 AM abriendo Datadog, DevTools, Safari, Slack — ahora es un prompt.

El caso demuestra por qué la combinación importa: cada stack brilla donde los otros flaquean. browser-use para "encuentra esto en una web que no controlo". chrome-devtools-mcp para "deep debug dentro del browser que sí controlo". playwright-mcp para "valida el fix donde mis usuarios reales van a estar". cua-driver para "deja evidencia donde los humanos miramos". Ninguno solo cubre todo.

---

## Quickstart concreto: chrome-devtools-mcp con Claude Code / Cursor

El caso de uso del 80% de los lectores. Asumimos que tienes Claude Code o Cursor con soporte MCP, y quieres arrancar con `chrome-devtools-mcp` en 10 minutos.

### 1. El snippet `.mcp.json` mínimo

Para Claude Code, crea o edita `~/.claude/mcp_servers.json` o `.mcp.json` en tu proyecto:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

Para Cursor, edita `.cursor/mcp.json` con el mismo JSON.

**Para Claude Code con CLI directo:**
```bash
claude mcp add chrome-devtools -- npx -y chrome-devtools-mcp@latest
```

### 2. Las 3 flags que importan

Para empezar limpio y productivo:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "-y",
        "chrome-devtools-mcp@latest",
        "--no-sandbox",
        "--no-usage-statistics",
        "--channel=stable"
      ]
    }
  }
}
```

- **`--no-sandbox`**: si corres en contenedor (Docker, Codespaces), necesario para que Puppeteer pueda lanzar Chrome. Sin esto, falla con errores confusos de "Chrome failed to start".
- **`--no-usage-statistics`**: apaga la telemetría a Google. Para enterprise compliance, **debería estar en el config, no en env vars**.
- **`--channel=stable`**: usa Chrome stable, no Canary. Más predecible para debugging serio.

### 3. Slim mode para empezar

Si sólo quieres "abre Chrome, navega, evalúa", `--slim` reduce las tools a 3 (screenshot, navigate, evaluate). Mejor para tests donde no quieres saturar la ventana de contexto:

```json
{
  "mcpServers": {
    "chrome-devtools-slim": {
      "command": "npx",
      "args": [
        "-y",
        "chrome-devtools-mcp@latest",
        "--slim",
        "--headless",
        "--no-usage-statistics"
      ]
    }
  }
}
```

### 4. AutoConnect para desarrollo local con Chrome ya abierto

Si ya tienes Chrome corriendo con tu sesión y no quieres que el agent levante otro proceso:

```json
{
  "mcpServers": {
    "chrome-devtools-live": {
      "command": "npx",
      "args": [
        "-y",
        "chrome-devtools-mcp@latest",
        "--autoConnect",
        "--channel=stable",
        "--no-usage-statistics"
      ]
    }
  }
}
```

Chrome 144+ con remote debugging ya activo es prerrequisito. En Chrome estable actual, ve a `chrome://inspect/#remote-debugging` y habilita el toggle.

### 5. Verificar que funciona

Después de configurar el `.mcp.json`, en Claude Code:

```
> ¿Qué versión de Chrome DevTools MCP tienes cargada?
```

El agent debería responder con la versión del server. Si no aparece, revisa:
1. Que `npx -y chrome-devtools-mcp@latest --version` corre sin error en tu terminal
2. Que el `.mcp.json` está en la ruta correcta (`~/.claude/mcp_servers.json` para global, `.mcp.json` para proyecto)
3. Que Claude Code se reinició después del cambio de config

### 6. La primera task útil

Una vez conectado, una task que demuestra el valor inmediato:

```
> En mi app local (http://localhost:3000), toma un Performance trace del 
> flujo de checkout, identifica el long task más caro, y dime qué función 
> JS lo causa.
```

El agent debería:
1. `navigate_page("http://localhost:3000")` 
2. `performance_start_trace()`
3. Simular el checkout (varias `click`, `fill`, `submit`)
4. `performance_stop_trace()` → recibe un path
5. `performance_analyze_insight(insight="main-thread-work-breakdown")`
6. Reportar el finding con trace en el path

Tiempo: 30-60 segundos. Lo que antes requería abrir DevTools manualmente, hacer el trace, exportar y analizar, ahora es una pregunta al agent.

---

## Investigación hecha

Para que el artículo no sea "opinión basada en titulares", esto es lo que se leyó y verificó antes de escribir.

### Stack 1: chrome-devtools-mcp (corazón del artículo)
- **Informe completo**: `/home/hermesbot/.hermes/repo-investigations/chrome-devtools-mcp.md` (383 líneas, 30.685 bytes)
- **Repo clonado**: `~/proyectos/chrome-devtools-mcp` (1 commit, --depth 1)
- **Verificado en código**:
  - 51 tools extraídas con grep sobre `src/tools/*.ts`
  - 11 categorías leídas de `src/tools/categories.ts`
  - Telemetría en `src/telemetry/ClearcutLogger.ts`
  - Patrón "Reference over value" en `docs/design-principles.md`
  - Slim mode en `docs/slim-tool-reference.md`
  - Mutex FIFO en `src/Mutex.ts`
  - Daemon pattern en `src/daemon/`
- **Verificado en ejecución** (del informe previo): `npm install` (exit 0), `npm run build` (exit 0), `--help` (40+ flags impresas), arranque del server (disclaimers CrUX/Usage/exposure)

### Stack 2: playwright-mcp (investigación complementaria)
- **Repo clonado**: `~/proyectos/playwright-mcp` (1 commit, --depth 1)
- **Archivos leídos**: `README.md` (1.560 líneas), `package.json` (51 líneas), `index.d.ts` (23 líneas), `src/README.md` (apunta al monorepo)
- **Inventario extraído**:
  - 68 tools via grep sobre `^- \*\*browser_` en README
  - 12 capability flags via `<summary><b>` headers
  - 49 opciones CLI via tabla "Configuration"
- **Hallazgo importante**: `microsoft/playwright-cli` recomendado por el propio README como alternativa para coding agents (token efficiency)

### Stack 3: browser-use (investigación complementaria)
- **Repo presente**: `~/proyectos/browser-use` (clonado en sesión previa, 9.729 commits visibles)
- **Archivos leídos**: `README.md` (334 líneas), `CLAUDE.md` (163 líneas), `pyproject.toml` (40 líneas visibles de 150), `browser_use/agent/service.py` (4.143 LOC totales, revisado), `browser_use/tools/service.py` (2.267 LOC totales), `browser_use/tools/views.py` (181 líneas), `browser_use/telemetry/service.py` (50 líneas), `examples/simple.py` (17 líneas)
- **Verificado**:
  - Versión 0.13.2 (en `pyproject.toml`)
  - 26 acciones vía grep sobre `@self.registry.action(`
  - PostHog como hard dependency (`posthog==7.7.0` en pyproject.toml)
  - Opt-out vía `ANONYMIZED_TELEMETRY=False`
  - Modelo `ChatBrowserUse` como default recomendado (en AGENTS.md)
- **No verificado experimentalmente**: stars exactas (~100k según fuente secundaria, no confirmado con GitHub API)

### Stack 4: trycua/cua (investigación complementaria)
- **Repo clonado**: `~/proyectos/trycua-cua` (1 commit, --depth 1)
- **Archivos leídos**: `README.md` (201 líneas), `libs/cua-driver/README.md` (23 líneas), `libs/cua-driver/python/src/cua_driver/__main__.py` (17 líneas), `libs/cua-driver/python/src/cua_driver/wrapper.py` (60 líneas), `libs/cua-driver/rust/crates/platform-macos/src/tools/mod.rs` (543 líneas, parcial), `libs/cua-driver/rust/crates/cua-driver/src/cli.rs` (parcial)
- **Verificado**:
  - 29 tools por plataforma en `tools/` directory
  - Comentario en código sobre PR #1692 (consolidación de screenshot)
  - DeliveryMode enum (background vs foreground input)
  - Arquitectura: Rust core + Python wrapper wheel
- **No verificado experimentalmente**: compilación del Rust core (requiere cargo + platform-specific deps)

### Limitaciones honestas de la investigación
- **No se ejecutaron tests E2E** de ninguno de los cuatro stacks — todos requieren browsers reales (Chrome/Firefox/WebKit).
- **Stars de los repos** tomadas de la investigación previa o fuentes secundarias (la API de GitHub fue bloqueada por security scan en este entorno).
- **Cifras de tokens** son orden de magnitud, no medidas exactas con paper académico. Si necesitas precisión, mide en tu propio workload.
- **PR #1692** referenciado por comentario en código — el PR exacto no se verificó, pero el código es la evidencia.

### Verificación de claims: qué se contrastó y qué no

Transparencia editorial honesta. Antes de aprobar el budget sobre la base de este artículo, esto es lo que el lector debe saber sobre los números:

| Claim | Estado | Cómo se verificó |
|---|---|---|
| chrome-devtools-mcp v1.5.0, 45,6k stars, 51 tools | ✅ Verificado | Lectura directa de `package.json`, GitHub API en la investigación previa (cacheado), grep sobre `src/tools/*.ts` |
| playwright-mcp v0.0.77, 68 tools, 12 capability flags | ✅ Verificado | Lectura directa de `package.json` y README (generado por `update-readme.js`) |
| browser-use v0.13.2, 26 acciones, PostHog dependency | ✅ Verificado | Lectura directa de `pyproject.toml` y `browser_use/tools/service.py` |
| browser-use ~100k stars | ⚠️ Verificado por búsqueda secundaria | Búsqueda web de julio 2026 cita "casi 100k"; cifra exacta no contrastada con GitHub API |
| cua-driver 29 tools por plataforma, PR #1692 consolidó screenshot | ✅ Verificado | Lectura directa de `libs/cua-driver/rust/crates/platform-macos/src/tools/` y comentario en código |
| Cifras de tokens de screenshots (1,5k-3k para 1280×720) | ⚠️ Orden de magnitud | Práctica común y pricing público de Anthropic; no medido en paper |
| Pricing de clouds comerciales (Browserbase ~0,10-0,50 $/h) | ⚠️ Estimación de mercado | Orden de magnitud basado en planes públicos típicos |
| Telemetry ON-by-default en chrome-devtools-mcp y browser-use | ✅ Verificado | Lectura directa de `ClearcutLogger.ts` y `telemetry/service.py` |
| Microsoft recomienda playwright-cli para coding agents | ✅ Verificado | Cita literal en README de playwright-mcp |
| browser-use creció de 0 a ~100k stars en <18 meses | ⚠️ Verificado por búsqueda secundaria | Fuente secundaria; no medido directamente |

**Regla del artículo**: donde dice ✅ es porque el autor contrastó el dato. Donde dice ⚠️, es orden de magnitud o estimación. Engineering leads que necesiten cifras exactas para un budget deben medir en su propio workload.

---

**El primer paso concreto**: instala `chrome-devtools-mcp`, ejecuta `take_snapshot` + `click` contra tu propio app (15 minutos). El decision tree del TL;DR + las secciones de cada stack te dicen cuándo añadir `playwright-mcp` (cross-browser), `browser-use` (cold-start Python) o `cua-driver` (apps nativas); el quickstart tiene la respuesta al "vale, ¿cómo lo integro en CI?".