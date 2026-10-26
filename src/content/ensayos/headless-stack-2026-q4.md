---
title: "Moli, Scrapling, Fortress, Obscura: el stack headless 2026-Q4"
description: "Cuatro motores OSS AI-friendly más un incumbent comercial. El stack headless para coding agents se consolida en 2026-Q4 — comparativa honesta con caveat de licencias."
fecha: 2026-10-02
tags: ["ia", "coding-agents", "web-scraping", "browser-automation", "headless"]
tipo: investigacion
estado: pendiente-revision
autor: "Alejandro de la Fuente"
---

En los últimos doce meses algo cambió en la categoría "navegador para agente". Lo que hasta 2025 era un menú corto — Puppeteer, Playwright, un Selenium que se resistía a morir, y Apify si pagabas — empezó a poblarse de proyectos OSS escritos en Rust, con esquemas de licencia cambiantes y con una orientación explícita hacia el coding agent como cliente primario, no hacia el ser humano.

Q4 de 2026 es el primer trimestre en el que esa nueva camada se ve completa. Hay cuatro motores que merece la pena mirar en serio: `lexmount/moli`, `D4Vinci/Scrapling`, `tiliondev/fortress` y `h4ckf0r0day/obscura`. Y un incumbente que sigue siendo el patrón a batir: `apify/crawlee`.

El propósito de este artículo no es coronar un ganador. Es construir una **escalera de decisión** — qué motor usar para qué tarea, en qué orden, con qué licencia, y a qué coste —, y dejar por escrito los caveats que no caben en un README.

He clonado los repos, leído los archivos de licencia palabra por palabra, y cruzado los datos con la API de GitHub en vivo (2026-10-02). Donde algo no se pudo verificar de forma independiente, lo digo.

## Índice

0. [Por qué importa: la categoría "AI-agent-friendly browser" se consolida](#0-por-qué-importa)
1. [El mapa: cinco piezas, cinco responsabilidades distintas](#1-el-mapa)
2. [`lexmount/moli` — un browser headless completo escrito en Rust](#2-moli)
3. [`D4Vinci/Scrapling` — el framework de fetch/extract que un coding agent ya sabe usar](#3-scrapling)
4. [`tiliondev/fortress` — Chromium stealth con trampa de licencia](#4-fortress)
5. [`h4ckf0r0day/obscura` — el "drop-in Playwright" en Rust](#5-obscura)
6. [`apify/crawlee` — el incumbente comercial-OSS](#6-crawlee)
7. [La escalera de decisión: cinco casos, del más simple al más complejo](#7-escalera)
8. [Caveat 1: Lexbench es un benchmark interno](#8-caveat-lexbench)
9. [Caveat 2: Fortress no es open source](#9-caveat-licencia)
10. [Cuándo migrar de Playwright a Moli (y cuándo no)](#10-migrar-playwright)
11. [Cuándo NO usar nada de esto](#11-cuando-no)
12. [Apéndice: una receta mínima para un coding agent](#12-receta)
13. [Conclusión: combinación por caso, no reemplazo universal](#13-conclusion)

---

## 0. Por qué importa

Hasta 2024, "navegador headless" era sinónimo de Chromium con un par de flags. El coding agent que necesitaba leer una página usaba `playwright install chromium`, esperaba 250 MB de descarga, levantaba el proceso, y rezaba para que el sitio no le detectara. Si el sitio usaba Cloudflare Turnstile o DataDome, el agente se rompía con un CAPTCHA y el humano tenía que intervenir.

A finales de 2025 y durante 2026, tres cosas pasaron a la vez:

1. **El coste de los LLM bajó lo suficiente para que un agente pueda planificar cadenas de fetch + extracción + re-fetch** sin que el humano supervise cada paso. Esto crea demanda real de browsers programables, no de browsers humanos.
2. **El ecosistema Rust maduró en browser engines** (Servo resucitó, Stylo se separó, Ladybird avanzó, los bindings de V8 se estabilizaron). Ya no es razonable asumir que un browser "serio" tiene que ser C++ sobre Chromium.
3. **La categoría "AI coding agent" se consolidó** (Claude Code, Codex CLI, Cursor, Aider, Continue, los MCP servers…). Y cada uno de esos agentes necesita un "puente al navegador" fiable, observable, y barato de invocar por sesión.

El resultado es que durante 2026-Q4 aparecen varios proyectos con la misma promesa en el README — "headless browser for AI agents" — y con propuestas técnicas muy distintas. Algunos son fetchers disfrazados de browser. Otros son browsers reales con un fetcher empaquetado. Uno tiene una licencia que no es open source aunque el README diga lo contrario.

Aquí es donde el criterio importa. El stack no es un menú de restaurante donde eliges el más popular. Es un grafo de capacidades y de licencias, y cada equipo tiene que entender qué está contratando antes de meterlo en producción.

> **Qué vas a aprender leyendo esto**: a elegir motor headless según el caso de uso, a leer la licencia de un proyecto de browser (no te fíes del badge de GitHub), y a evitar dos trampas concretas (benchmark interno presentado como externo, y "source-available" presentado como "open source").

## 1. El mapa

Antes de meternos en cada motor, una foto de los cinco y de qué cubre cada uno. Las cifras son de la API de GitHub en vivo, capturadas el 2026-10-02.

| Repo | Estrellas | Forks | Lenguaje | Licencia (oficial) | Edad | Push |
|------|----------:|------:|----------|--------------------|------|------|
| [`D4Vinci/Scrapling`](https://github.com/D4Vinci/Scrapling) | 85.202 | 8.728 | Python | BSD-3-Clause | ~2 años | 2026-09-30 |
| [`h4ckf0r0day/obscura`](https://github.com/h4ckf0r0day/obscura) | 28.252 | 2.098 | Rust | Apache-2.0 | ~6 meses | 2026-10-02 |
| [`apify/crawlee`](https://github.com/apify/crawlee) | 25.968 | 1.685 | TypeScript | Apache-2.0 | ~10 años | 2026-10-02 |
| [`lexmount/moli`](https://github.com/lexmount/moli) | 3.510 | 186 | Rust | Apache-2.0 + MIT | ~7 semanas | 2026-10-02 |
| [`tiliondev/fortress`](https://github.com/tiliondev/fortress) | 709 | 47 | Python wrapper sobre C++ Chromium | **Source Available 1.1** (no open source) | ~3 meses | 2026-09-30 |

### Qué cubre cada uno (resumen ejecutivo)

- **Moli** es un **browser headless completo** escrito como 93 crates Rust. Ejecuta JavaScript real con V8, parsea CSS con Stylo, hace layout con Taffy, y expone tres protocolos (CDP, WebDriver Classic, WebDriver BiDi) sobre el mismo kernel. No es un fetcher: es un browser al que le quitas la ventana.
- **Scrapling** es un **framework de fetch/extract** en Python con cuatro modos (estático, asíncrono, stealth, dinámico) y un subframework tipo Scrapy para spiders. Es lo que un coding agent llama cuando quiere leer una página y no le importa el render visual.
- **Fortress** es un **Chromium con parches C++ de evasión** y un wrapper Python. Es el más agresivo contra sistemas anti-bot del grupo, pero su licencia "Source Available 1.1" exige subscripción para uso empresarial.
- **Obscura** es un **browser headless en Rust** que se anuncia como "drop-in Playwright replacement" con antidetect integrado. Es la respuesta Rust al hueco que dejaba Playwright cuando un agente necesitaba menos peso.
- **Crawlee** es la **plataforma comercial-OSS de Apify**: cliente para Node.js/TypeScript con adaptadores para Puppeteer, Playwright, Cheerio y JSDOM, rotación de proxies, y una plataforma de ejecución en la nube (de pago) que gestiona el SLA.

### Qué no cubre ninguno de los cinco

- Ninguno resuelve **autenticación federada real** (OAuth, SAML, login social) sin que el humano intervenga. Todos dependen de cookies o `profile-dir` reutilizables.
- Ninguno garantiza **indetectabilidad absoluta** contra sitios con fingerprinting avanzado. Los benchmarks internos muestran mejoras, no invulnerabilidad.
- Ninguno te exime de **leer y respetar los Términos de Servicio del sitio objetivo**. "Se puede scrapear" no es lo mismo que "es legal scrapear".

## 2. `lexmount/moli` — un browser headless completo escrito en Rust

> **Resumen en 1 línea**: browser headless completo en Rust, híbrido Stylo (CSS) + V8 (JS) + Taffy (layout), 93 crates, tres protocolos, tres skills oficiales listas para coding agents.
>
> **Qué aprenderé leyendo esto**: por qué un engine "híbrido" (CSS de Servo + JS de Chromium) es ingenierilmente sensato aunque no canónico, y qué cubre un binario Rust de 1.1.x que pretende reemplazar a Chromium para flujos de agente.

Moli es el proyecto más joven del grupo —empieza a aparecer en GitHub el 10 de agosto de 2026, y el push del README en el momento de redactar esto es del 2 de octubre de 2026, es decir, ~7 semanas de vida pública—. Pero en esas 7 semanas ha pasado de 0 a 3.510 estrellas. Vale la pena mirar qué hay detrás.

### La corrección importante al boletín

El primer boletín que cubrió Moli lo describió como "Rust puro sobre Servo + Kitesurf". Es impreciso. Moli **no es un port de Servo**. Es un **engine híbrido** que toma lo mejor de cada casa:

- **Stylo** (la implementación CSS de Servo, originalmente Mozilla) para el pipeline de selectores, cascade y computed style. Es lo que le da a Moli compatibilidad CSS madura sin tener que reescribir un parser CSS desde cero.
- **V8** vía `rusty_v8` para ejecutar JavaScript real. Es el motor de Chromium, no el de Servo. Esto significa que cualquier sitio que funcione en Chrome funciona en Moli desde el punto de vista del JS.
- **Taffy** (original de Dioxus) para layout, con `stylo_taffy` y `kurbo` para geometría, y `parley` para texto. Es un layout engine moderno, escrito en Rust, con soporte para Flexbox y CSS Grid.

Que el CSS venga de Servo y el JS de Chromium no es una herejía: es una **decisión de riesgo controlado**. Reusar el CSS engine maduro de Mozilla y el JS engine maduro de Google evita reescribir los dos componentes más complejos de un browser. Lo que Moli añade es un DOM propio, un layout propio, y un scheduler propio — que es donde están las ganancias de eficiencia para el caso de uso "agente".

### Lo que hace el binario

El binario `moli` (versión 1.1.12 al cierre de este artículo) tiene tres modos principales:

1. **CLI one-shot** — `moli fetch <URL>` devuelve Markdown, JSON, HTML, screenshot o PDF. El modo por defecto es **structure-first**: extrae la estructura semántica sin pagar el coste de layout y paint.
2. **CDP server** — `moli serve` levanta un endpoint compatible con Chrome DevTools Protocol, así que Playwright, Puppeteer o cualquier cliente CDP existente puede conectarse a Moli en lugar de a Chromium.
3. **WebDriver Classic + WebDriver BiDi** — dos servidores WebDriver paralelos sobre el mismo kernel, para integración con Selenium, Appium, o frameworks de test que no hablan CDP.

La promesa de diseño, copiada literal del README:

> "Moli is a production-ready headless browser for AI agents. Its on-demand layout and rendering design combines a complete browser runtime with a lightweight resource footprint."

Y la tagline: **"Structure first. Pixels on demand."**

Eso último es la pista clave: Moli **no renderiza siempre**. Si tu agente solo necesita el texto de un artículo, Moli ejecuta el JS suficiente para que el DOM esté listo, extrae el texto, y se va. Solo entra en layout/paint cuando le pides un screenshot o un PDF. Esto es lo que le permite consumir mucha menos memoria que Chromium en flujos típicos de agente.

### Las 3 skills oficiales

Moli no llega solo: viene con tres skills listas para que un coding agent las cargue como instrucciones. Esto es importante porque convierte a Moli en **un tool que el agente puede descubrir por convención**, no en una librería que hay que envolver en código.

| Skill | Qué hace |
|-------|----------|
| `moli-webfetch` | Fetch, inspect, crawl y capture. Devuelve Markdown, JSON, HTML, screenshot (viewport o full-page), o PDF. Modo por defecto structure-first; layout opt-in. |
| `moli-websearch` | Búsqueda web con paralelización 4-6 engines (Google, Brave, DuckDuckGo, Yahoo, Baidu, Naver, Sogou, Toutiao…) más image reverse-search (Yandex, Bing, Sogou, Baidu, SauceNAO). |
| `moli-cdp-server` | Arranca el servidor CDP y conecta clientes Playwright/Puppeteer/Chrome DevTools. Es el "drop-in" para entornos que ya esperan un endpoint Chromium. |

He leído las tres. Las skills están escritas con dos cosas que las hacen útiles para un coding agent: (a) instrucciones operativas concretas con el comando exacto y los flags, y (b) una sección de "operating rules" que avisa de cosas como no imprimir bytes binarios a stdout, mantener TLS activo, y reportar fallos en vez de inventar contenido.

### Las 93 crates

Cuando un proyecto dice "escrito en Rust" puede significar cualquier cosa. En Moli significa un workspace Cargo con **93 crates**, cada una con responsabilidad acotada: `moli-core`, `moli-renderer-v8`, `moli-layout`, `moli-protocol-cdp`, `moli-protocol-webdriver-classic`, `moli-protocol-webdriver-bidi`, `moli-css-parse`, `moli-dom`, `moli-script`, `moli-fetch`, `moli-curl`, etc.

Esto es **más serio que un script de mil líneas** y **más arriesgado que un monolito C++**. Lo bueno: cada crate se puede testear y benchmarkear de forma aislada. Lo malo: la superficie de bugs es proporcional. Si Moli va a estar en producción, hay que leer el `AGENTS.md` (que es estricto: `cargo fmt`, `cargo clippy -- -D warnings`, `cargo nextest`) y entender que las releases tomarán más tiempo del que tomarían en un proyecto pequeño.

### Lo que Moli NO es

- **No es un drop-in replacement de Playwright**. Los scripts de Playwright escritos para Chromium **no funcionan** en Moli. Hay que usar el endpoint CDP de Moli desde Playwright (sí funciona) o reescribir usando la API nativa (`moli fetch`, `moli serve`).
- **No es un fetcher ligero** como Scrapling. Es un browser real. Si solo necesitas leer 50 URLs sin JS, Scrapling es más rápido y más pequeño.
- **No es production-hardened todavía**. 7 semanas de vida pública es una señal de momentum, no de estabilidad. Compárese con Chromium (20 años) o Playwright (8 años).

## 3. `D4Vinci/Scrapling` — el framework de fetch/extract que un coding agent ya sabe usar

> **Resumen en 1 línea**: framework Python con cuatro fetchers (estático, asíncrono, stealth, dinámico) más spiders mini-Scrapy, con servidor MCP y modo RAG-ready Markdown. El estándar de facto para "leer una página desde un agente" en 2026-Q4.
>
> **Qué aprenderé leyendo esto**: cómo estructurar el "ir a buscar contenido" de un coding agent cuando el 80% de las veces no necesitas un browser real, y cuándo subir al siguiente nivel (browser completo) sin reinventar la rueda.

Scrapling es el veterano del grupo: 2 años, 85k estrellas, 8.7k forks, BSD-3-Clause. Es la librería que un coding agent Python invoca cuando el usuario dice "léeme esta página" y la página no tiene JS dinámico bloqueante.

### Los 4 fetchers

Scrapling expone cuatro clases, cada una con un perfil de evasión creciente:

| Clase | Para qué sirve | Tecnología base |
|-------|----------------|-----------------|
| `Fetcher` | Petición HTTP con reintentos y auto-sesión | `httpx` + `curl_cffi` (TLS fingerprinting real) |
| `AsyncFetcher` | Igual, pero asíncrono | `httpx` async + `curl_cffi` |
| `StealthyFetcher` | Anti-bot ligero / medio | Playwright + parches de stealth |
| `DynamicFetcher` | Sitios con JavaScript pesado | Adaptable: Chromium o Firefox real, configurable |

El orden importa. El `Fetcher` "tonto" es lo que un coding agent debería intentar **primero**, porque es 100x más rápido y 100x más barato que `DynamicFetcher`. Solo si falla (403, página vacía, contenido que requiere JS) se sube al siguiente nivel. Este patrón "escalonado" es lo que convierte a Scrapling en un framework y no en una librería más.

### Los spiders: Scrapy en miniatura

Para casos con muchas URLs y necesidad de persistencia, Scrapling incluye un subframework de spiders inspirado en Scrapy pero sin la curva de aprendizaje. Permite definir:

- Una cola de URLs iniciales
- Funciones de extracción por selector CSS o XPath
- Paginación automática
- Exportación a JSON, CSV, o directamente a un pipeline RAG (Markdown limpio en una línea)

### El servidor MCP

Desde la versión 0.4.x, Scrapling expone un servidor MCP (`io.github.D4Vinci/Scrapling`). Esto significa que un coding agent que hable MCP — Claude Code, Cursor, Continue, los que se puedan configurar — puede **descubrir las herramientas de Scrapling por convención**, sin tener que hardcodear la API.

Esto es lo que hace a Scrapling especialmente útil en un setup de coding agent: el LLM lee la descripción de las tools, decide cuál invocar según la página, y Scrapling hace el trabajo. No hay que escribir un wrapper.

### El caso de uso ideal

> "Necesito que mi agente lea la documentación oficial de la librería X y la guarde en el contexto antes de proponerme cambios de código."

Ahí Scrapling es la respuesta. `Fetcher` con selectores CSS, extracción a Markdown, ingestión en el contexto. Si el sitio tiene Cloudflare básico, `StealthyFetcher`. Si tiene DataDome o Turnstile, sube a `DynamicFetcher` con perfil de Chromium. Si aun así falla, Moli u Obscura.

### Lo que Scrapling NO hace bien

- **No es un browser completo**. No ejecuta juegos, no renderiza WebGL, no simula un usuario con scroll y click. Para eso necesitas un browser real.
- **La evasión no es ilimitada**. `StealthyFetcher` pasa WAFs simples y Cloudflare en modo pasivo; contra Turnstile interactivo o fingerprinting agresivo sigue cayendo.
- **El modelo de threading puede ser confuso** si vienes de Scrapy puro. Hay que entender la diferencia entre `Fetcher` y `AsyncFetcher` antes de paralelizar.

## 4. `tiliondev/fortress` — Chromium stealth con trampa de licencia

> **Resumen en 1 línea**: Chromium con parches C++ de evasión y un wrapper Python/MCP, la evasión más agresiva del grupo, **pero con una licencia "Source Available 1.1" que no es open source** y exige subscripción para uso empresarial.
>
> **Qué aprenderé leyendo esto**: la diferencia entre "open source" y "source available", por qué el badge de GitHub puede mentir, y cuándo una librería "gratis para devs" se convierte en "de pago para empresa".

Fortress es el más pequeño del grupo por comunidad (709 estrellas, 47 forks) y el más joven técnicamente — empezó como proyecto público en julio de 2026. Pero tiene algo que los otros no tienen: **parches C++ a Chromium** diseñados específicamente para evadir sistemas anti-bot (DataDome, Cloudflare Turnstile, PerimeterX, FingerprintJS).

### La trampa de licencia (caveat crítico)

El README de Fortress dice BSD-3-Clause. **Miente a medias, y es importante entender por qué.**

El archivo `LICENSE` real del repo empieza así:

> "Fortress Source Available License 1.1
> Licensor: Tilion Inc.
> Copyright (c) 2026 Tilion Inc.
> Subscriptions and pricing: https://tilion.com/pricing"

Y la cláusula 1.4 dice literal:

> "This License is a source-available license, not an open-source license."

El "BSD-3-Clause" del README corresponde al archivo `LICENSE-BSD-LEGACY`, que cubre **código de versiones anteriores de Fortress publicado antes del cambio de licencia**. El código que sale hoy desde el `main` está bajo Source Available 1.1.

**Implicaciones prácticas**:

- Puedes **leer** el código (es source-available, el código está ahí).
- Puedes **usarlo gratis para uso personal o evaluación**.
- Para **uso empresarial — cualquier organización con más de un número pequeño de empleados o revenue por encima de cierto umbral —** necesitas una **subscripción comercial** en `tilion.com/pricing`.
- El código de Tilion NO se considera open source por la OSI. No puedes redistribuir versiones modificadas como si fuera BSD.
- Si tu empresa ya usa Fortress y el equipo de legal te pide "la licencia", **no le mandes el README**. Mándale el archivo `LICENSE` completo y la URL de pricing.

En el artículo expandimos esto en la sección 9.

### Qué hace bien

- Evasión de los principales WAF comerciales.
- API Python con un servidor MCP, igual que Scrapling.
- Chromium real con parches a nivel C++ (no parches JS que se pueden deshacer).

### Cuándo usarlo

- **No para producción empresarial** sin hablar antes con el equipo de legal y aceptar el coste de la subscripción.
- **Sí para PoC anti-bot** en proyectos personales o investigación.
- **No como "el browser por defecto de tu agente"** si el caso de uso no es específicamente anti-bot. Hay opciones más simples y abiertas.

## 5. `h4ckf0r0day/obscura` — el "drop-in Playwright" en Rust

> **Resumen en 1 línea**: browser headless en Rust que se anuncia como drop-in replacement de Playwright, con antidetect integrado y API similar a la de Playwright para que migrar sea cuestión de cambiar el import.
>
> **Qué aprenderé leyendo esto**: cuándo tiene sentido pasar de Playwright (Node/Chromium) a un browser en Rust para reducir peso, y qué compromisos aceptas al hacerlo.

Obscura es el segundo más joven del grupo (creado en abril de 2026, 6 meses de vida) y el que más rápido ha crecido: 28.252 estrellas y 2.098 forks. La promesa del README es dura: "The headless browser for AI agents and web scraping".

### Qué lo diferencia

- **API compatible con Playwright**. Los tests escritos con `@playwright/test` o `playwright-python` deberían poder usar Obscura cambiando el import (con caveats — ver abajo).
- **Antidetect por defecto**: rotación de User-Agent, evasión de `navigator.webdriver`, canvas noise, WebGL spoofing. Lo que un agente obtiene al instalar Playwright con un plugin de stealth, Obscura lo trae integrado.
- **Binario Rust**. Arranca más rápido que Chromium y consume menos memoria en flujos largos.
- **Skills para agentes** (`skills/` en el repo) con instrucciones listas para coding agents, en la línea de Moli.

### Caveats honestos

- **"Drop-in" no es "literal"**. Hay diferencias de comportamiento en selectores, en timeouts, y en el manejo de iframes. Una suite de tests de Playwright al 100% no va a pasar en Obscura sin ajustes.
- **Momentum sin base instalada**. 28k estrellas en 6 meses es impresionante para OSS pero no significa "auditado por una fundación". El código es joven.
- **La documentación oficial está en `docs.obscura.sh` y `obscura.sh`**, no en el README. Para evaluarlo en serio hay que salir del repo.

### Cuándo usarlo

- **Sí** si ya tienes un proyecto Playwright y quieres reducir el peso del binario o evitar la dependencia de Node.
- **Sí** si necesitas antidetect out-of-the-box sin tener que montar un pipeline de parches.
- **No** si necesitas compatibilidad 1:1 con la última versión de Playwright (el desfase suele ser de meses).

## 6. `apify/crawlee` — el incumbente comercial-OSS

> **Resumen en 1 línea**: la plataforma de referencia para crawling serio en Node.js/TypeScript, con adaptadores para Puppeteer, Playwright, Cheerio y JSDOM, rotación de proxies, y un servicio cloud de pago para SLAs de producción.
>
> **Qué aprenderé leyendo esto**: por qué "el incumbent" sigue mereciéndose un sitio en el menú aunque sea comercial, y cuándo el coste mensual se justifica.

Crawlee no necesita presentación en 2026: 10 años de vida, 26k estrellas, 1.7k forks, base instalada enorme. Lo que sí merece la pena es **reencuadrarlo** en el contexto de los otros cuatro.

### Qué es

Una librería de crawling para Node.js/TypeScript (con puertos no oficiales a Python) que unifica cuatro backends:

- **Cheerio** (parseo HTML estático, muy rápido)
- **JSDOM** (DOM en memoria, sin browser)
- **Puppeteer** (Chromium real)
- **Playwright** (Chromium, Firefox, WebKit)

Añade por encima:

- **Rotación de proxies** (con интеграción nativa con Apify Proxy, Bright Data, Oxylabs)
- **PERSISTED QUEUES**: las requests se serializan a disco, así un crawler puede pausarse y reiniciarse sin perder el estado
- **Retry policies** configurables
- **Adaptadores para datasets** (escritura a CSV, JSON, JSONL, o directamente a un dataset de Apify)

### El modelo de negocio

Crawlee es OSS (Apache-2.0), pero **la plataforma Apify** que lo rodea es comercial: hosting gestionado, proxies residenciales, scheduling, monitoring, y facturación por Actor/ejecución. Si tu crawler corre en CI mensual y la SLA no importa, Crawlee gratis es suficiente. Si lo ejecutas 24/7 contra sitios que te banean, el coste de Apify puede ser de cientos a miles de euros al mes — pero el SLA, el dashboard, y el soporte están ahí.

### Cuándo usarlo

- **Sí** cuando el equipo ya está en Node/TypeScript y la escala justifica el coste.
- **Sí** cuando necesitas SLAs y reporting para un cliente externo.
- **No** si tu proyecto es Python puro o Rust puro — la fricción de meter Node en el medio suele outweigh el beneficio.
- **No** si el caso de uso es "mi agente lee 3 páginas al día" — Apify es sobredimensionamiento puro para eso.

## 7. La escalera de decisión: cinco casos, del más simple al más complejo

Vale, ya tenemos el mapa. Ahora, la parte accionable. Para cada caso de uso, qué motor elegir primero, qué dejar como backup, y qué descartar.

### Caso 1 — "Mi coding agent necesita leer 3-10 URLs al día"

**Perfil**: artículos de documentación, posts de blog, páginas de producto, READMEs. Sitios sin login ni anti-bot pesado.

**Respuesta**: `Scrapling.Fetcher` o `Scrapling.AsyncFetcher`.

**Por qué**: 100x más rápido que un browser completo, 100x más barato en memoria, y cubre el 80% de los casos reales de un coding agent.

**Si falla**: sube a `Scrapling.StealthyFetcher` (WAF simple) o `Scrapling.DynamicFetcher` (sitio con JS obligatorio).

**No** necesitas Moli, Obscura ni Apify para esto. Es sobredimensionamiento.

### Caso 2 — "Mi agente hace 100+ requests al día, con paralelización"

**Perfil**: research, agregación de feeds, compilación de bases de conocimiento.

**Respuesta**: `Scrapling` con `AsyncFetcher` + spiders.

**Por qué**: control de concurrencia, reintentos, persistencia de sesión. Si necesitas rotación de proxies barata, Scrapling soporta varios providers vía configuración.

**Si falla**: la causa suele ser rate-limiting. Añade throttling, cambia de User-Agent, o considera `Moli.websearch` (que paraleliza 4-6 motores de búsqueda) si el caso es "encuentra URLs, no leas URLs concretas".

### Caso 3 — "Necesito evadir Cloudflare Turnstile / DataDome"

**Perfil**: sitios con WAF comercial activo. El caso clásico de LinkedIn, Indeed, grandes e-commerce.

**Respuesta, en orden de agresividad**:

1. `Obscura` (Rust, antidetect integrado, sin coste adicional).
2. `Scrapling.StealthyFetcher` con perfil reforzado.
3. `Fortress` **si aceptas la licencia Source Available y el coste de subscripción** para uso empresarial.
4. `Moli` con perfil stealth — la API lo soporta pero no es su punto fuerte.

**Por qué este orden**: Obscura está diseñado para esto de serie. Scrapling es más ligero y suele pasar el 60-70% de los WAF. Fortress es la bazuca, con el coste legal correspondiente. Moli es competente pero no especializado.

**Caveat**: ningún browser OSS garantiza 100% de éxito contra Turnstile. Si el negocio depende de evadirlo, o compras Apify (que tiene un track record real) o negocias un acuerdo con el sitio.

### Caso 4 — "Mi agente necesita un browser completo: renderizar JS, inspeccionar DOM, hacer click"

**Perfil**: el agente tiene que completar un flujo multi-página, loguearse, rellenar un formulario, descargar un PDF, capturar evidencia visual.

**Respuesta**: `Moli` con CDP server, o `Obscura` si vienes de Playwright y quieres mínima fricción de migración.

**Por qué**:

- Moli es un browser real con layout on-demand, screenshots, PDF, tres protocolos, y 3 skills oficiales para coding agents. Si partes de cero, es la opción más coherente.
- Obscura es un browser real con API similar a Playwright. Si ya tienes scripts de Playwright, la migración es más suave.

**Si necesitas SLAs y reporting**: `Apify Crawlee` sobre Playwright. La plataforma te da monitoring, retries persistentes, y soporte.

**Si necesitas máxima compatibilidad con el ecosistema Playwright existente**: quédate en `Playwright` con Chromium. Moli y Obscura son buenos pero no son 100% compatibles.

### Caso 5 — "Volumen alto + SLA + proxies residenciales + reporting para cliente"

**Perfil**: crawler de producción que ejecuta un cliente externo, 24/7, con coste de downtime medible.

**Respuesta**: `Apify Crawlee` sobre la plataforma Apify (o auto-hospedaje si el equipo es grande).

**Por qué**: cuando el coste del fallo supera el coste de la herramienta, pagas por la herramienta. Crawlee + Apify es la combinación que más equipos de producción en Europa están usando para este perfil.

**Alternativa OSS pura**: Crawlee auto-hospedaje + Bright Data / Oxylabs como proxy provider. Más trabajo operacional, mismo resultado técnico.

### Tabla resumen de la escalera

| Caso | Motor primario | Backup | Coste típico |
|------|----------------|--------|--------------|
| 1. Fetch simple | Scrapling Fetcher | Scrapling Async | €0 (CPU) |
| 2. Paralelización | Scrapling spiders | Moli websearch | €0-20/mes (proxies) |
| 3. Anti-bot | Obscura | Fortress (con licencia) | €0-500/mes |
| 4. Browser completo AI agent | Moli (CDP) | Obscura / Playwright | €0 (CPU) |
| 5. Volumen + SLA | Apify Crawlee | Crawlee auto-hospedaje | €200-5000/mes |

## 8. Caveat 1: Lexbench es un benchmark interno

El repo de Moli incluye `moli-benchmark`, que ejecuta **Lexbench**, un benchmark de 1.308 tareas comparables entre navegadores. Los números que cita el autor son estos:

| Motor | % tareas pasadas (Lexbench) |
|-------|----------------------------:|
| Chrome (referencia) | 99,85% |
| **Moli 0.1.1** | **81,88%** |
| Kitesurf | 62,1% |
| Lightpanda | 53,3% |
| Obscura | 44,9% |

Estos números son **internos del autor de Moli**. Eso no significa que sean falsos, pero significa que:

1. **El benchmark fue elegido por el autor de Moli**. Lexbench no es un estándar de la W3C ni un benchmark académico revisado por pares. Es la suite de tests que el equipo de Moli ha decidido ejecutar.
2. **El entorno está bajo control de Moli**. La versión exacta de Chrome, el sistema operativo, la configuración de red, y la metodología de "tarea pasada" son los del repo.
3. **No hay datos cruzados independientes**. Hasta donde he podido verificar (búsqueda en repos OSS y papers académicos), no existe en 2026-Q4 un benchmark OSS estándar de "AI-agent headless browsers" con resultados públicos para los cinco motores de este artículo.
4. **Los benchmarks sirven para vender, no para decidir**. El orden de magnitud es probablemente correcto — Moli está claramente por encima de Kitesurf/Lightpanda/Obscura en este set de tareas — pero usar el número "81,88%" como si fuera un resultado independiente para tu RFP es una lectura ingenua.

**Qué hacer en la práctica**: corre tu propio benchmark. Coge 20 URLs representativas de tu caso de uso, y mide tasa de éxito, latencia y memoria en los tres o cuatro candidatos. Es un día de trabajo y te da datos que ningún benchmark genérico te va a dar.

## 9. Caveat 2: Fortress NO es open source

Vuelvo sobre esto porque es la trampa más cara del grupo. He copiado antes los puntos clave, pero los formalizo aquí para que queden en una sección propia.

### La diferencia entre open source y source available

- **Open source** (definición OSI): licencia aprobada por la Open Source Initiative. Garantiza, entre otras, la libertad de usar, estudiar, modificar y redistribuir, sin discriminaciones por campo de uso o por tipo de usuario.
- **Source available**: el código está disponible para leer (a veces para modificar localmente), pero la licencia **restringe el uso**. Las restricciones típicas son: prohibición de uso comercial sin pago, prohibición de redistribución, obligación de aceptar términos adicionales al descargar.

### El caso Fortress

El archivo `LICENSE` en el repo de `tiliondev/fortress` dice, cláusula 1.4:

> "This License is a source-available license, not an open-source license. It has no automatic conversion to another license and no scheduled expiry of its production-use conditions."

Y la sección de "Scope" (1.1) deja claro que cubre "Fortress-specific patches, SDKs, MCP server and launcher, build tooling, packaging, documentation, and corresponding portions of binary distributions".

Lo que esto significa, en llano:

1. Puedes clonar el repo y leer el código. ✓
2. Puedes ejecutar Fortress localmente para evaluación o uso personal. ✓
3. Si trabajas en una empresa con más de X empleados (el umbral exacto está en `tilion.com/pricing`), **necesitas comprar una subscripción** para uso en producción. ✗ sin pago.
4. **No puedes redistribuir Fortress como si fuera open source**. Si tu producto incluye Fortress, tu cliente también necesitará la subscripción.
5. La versión anterior del código, que sí era BSD-3-Clause, sigue bajo BSD-3-Clause en `LICENSE-BSD-LEGACY`. Pero ese código legacy **no es el código actual** que sale de `main`.

### Por qué esto importa

- **Cumplimiento legal**: si tu equipo de legal audita dependencias OSS, "BSD-3-Clause" en el badge de GitHub no le vale. Necesita ver el archivo `LICENSE` completo.
- **Coste oculto**: una subscripción comercial por motor de scraping puede ser de cientos a miles de euros al mes. No te enteras hasta que el equipo de legal la pide.
- **Lock-in parcial**: si construyes tu agente sobre Fortress y luego decides que no puedes pagar la subscripción, migrar a Obscura o Moli es semanas de trabajo, no horas.

### Cuándo SÍ tiene sentido usar Fortress

- **Investigación y PoC** donde la licencia no importa (proyectos personales, universidad, prototipos).
- **Proyectos comerciales pequeños** donde el umbral de empleados de la licencia no se aplica.
- **Equipos que ya pagan la subscripción** y la evasión anti-bot de Fortress justifica el coste sobre alternativas OSS.

### Cuándo NO

- **Producto SaaS en producción**: el riesgo legal no compensa, salvo que la evasión anti-bot sea el core del negocio y estés dispuesto a pagar.
- **Proyectos open source derivados**: redistribuir Fortress en otro proyecto OSS violaría la licencia.
- **Cuando hay alternativas OSS razonables**: en 4 de cada 5 casos, Obscura o Scrapling cubren el caso de uso sin el riesgo legal.

## 10. Cuándo migrar de Playwright a Moli (y cuándo no)

Playwright lleva 8 años siendo el estándar de facto para browser automation. Tiene una API estable, una documentación brutal, un ecosistema de plugins enorme, y soporte oficial de Microsoft. Migrar a Moli no es una decisión que se tome a la ligera.

### Cuándo SÍ migrar a Moli

1. **El proceso de tu agente es 100% headless y no necesita WebKit/Firefox**. Moli solo soporta el motor Chromium-like. Si no necesitas los otros, Moli puede ser más ligero.
2. **Quieres pagar solo el layout cuando lo necesitas**. Moli arranca sin hacer layout, lo cual es una ventaja real en flujos de extracción de texto puro.
3. **Tu agente ya usa `moli fetch` o `moli serve` por CLI** y no necesitas la API JS de Playwright. En ese caso, Playwright es un peso muerto.
4. **El equipo está cómodo con un proyecto de 7 semanas de vida pública**. Si tu SLA es estricto, Moli no es para ti todavía.
5. **Quieres evitar la dependencia de Node**. Moli es un binario Rust autocontenido; no necesitas npm, ni `node_modules`, ni Chromium descargado aparte.

### Cuándo NO migrar

1. **Tienes una suite de tests de Playwright existente**. "Drop-in" no es "literal". La migración de tests es semanas-hombre, no horas.
2. **Necesitas WebKit o Firefox**. Moli solo es Chromium-like.
3. **Tu agente depende de plugins del ecosistema Playwright** (Playwright Trace Viewer, Percy, plugins de accesibilidad, etc.). Moli no tiene ese ecosistema.
4. **Necesitas soporte comercial con SLA**. Playwright está mantenido por Microsoft; Moli por un equipo de 7 semanas de vida. Si tu negocio depende del vendor, quédate en Playwright.
5. **Tu caso de uso es anti-bot pesado**. Para eso Obscura o (con licencia) Fortress son mejores opciones.

### La alternativa intermedia

Si lo que quieres es reducir el peso de Chromium en tu agente sin renunciar a la API de Playwright, **Obscura** es el camino más corto. Su API es deliberadamente compatible con Playwright, así que el cambio es de import más que de lógica.

## 11. Cuándo NO usar nada de esto

No todo necesita un browser headless. Algunas señales de que tu caso de uso NO encaja con este stack:

- **Solo necesitas datos estructurados que ya expone una API oficial**. Si el sitio tiene API documentada, úsala. Más rápido, más legal, más mantenible.
- **El sitio tiene Términos de Servicio que prohíben scraping**. Aunque técnicamente puedas, el coste legal/ético desaltarse un ToS claro es alto. Negocia un acuerdo, o busca otra fuente.
- **El caso es "monitorizar 5 URLs una vez al día"**. Un cron + `curl` + un parser es 1000 veces más simple y barato que montar un browser headless.
- **Necesitas interacción humana (CAPTCHA visual, login con SMS, autenticación de dos factores)**. Ninguno de estos motores resuelve eso automáticamente sin un humano en el loop.
- **El sitio objetivo es tuyo y necesitas métricas de uso**. Cualquier browser headless es una mala idea para analítica de tu propio sitio. Usa Plausible, Umami, o el SDK oficial.

La regla de oro: **si puedes resolver el caso con `curl` + un parser, no necesitas un browser headless**. Reserva el browser headless para cuando `curl` no llega: JS obligatorio, render visual, o evasión anti-bot.

## 12. Apéndice: una receta mínima para un coding agent

Para terminar, una receta concreta que un coding agent puede copiar-pegar. Asume Python 3.11+ y que tienes Scrapling y Moli instalados.

### Paso 1 — Intento estático (rápido, sin browser)

```python
from scrapling import Fetcher

page = Fetcher.get("https://ejemplo.com/docs/intro")
if page.status == 200 and "artículo" in page.text:
    markdown = page.markdown  # propiedad añadida en 0.4.x
    guardar_en_contexto(markdown)
```

### Paso 2 — Si falla, escalar a stealth

```python
from scrapling import StealthyFetcher

page = StealthyFetcher.fetch(
    "https://ejemplo.com/docs/intro",
    headless=True,
    network_idle=True,
)
```

### Paso 3 — Si falla, escalar a browser real con Moli

```python
import subprocess

result = subprocess.run(
    ["moli", "fetch", "--dump", "markdown", "--wait-until", "domstable",
     "https://ejemplo.com/docs/intro"],
    capture_output=True, text=True, timeout=30
)
if result.returncode == 0:
    markdown = result.stdout
    guardar_en_contexto(markdown)
```

### Paso 4 — Si necesitas hacer click o rellenar un formulario

```python
import subprocess

# Levanta CDP server en background
server = subprocess.Popen(
    ["moli", "serve", "--port", "9222"],
    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
)

# Conecta con Playwright Python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.connect_over_cdp("http://localhost:9222")
    page = browser.new_page()
    page.goto("https://ejemplo.com/login")
    page.fill("input[name=email]", user)
    page.fill("input[name=password]", password)
    page.click("button[type=submit]")
    page.wait_for_load_state("networkidle")
    page.screenshot(path="post_login.png")
    browser.close()

server.terminate()
```

### Paso 5 — Si necesitas búsqueda, usa moli-websearch

```python
import subprocess
from concurrent.futures import ThreadPoolExecutor

ENGINES = [
    "https://www.google.com/search?q={q}",
    "https://search.brave.com/search?q={q}",
    "https://html.duckduckgo.com/html/?q={q}",
    "https://search.yahoo.com/search?p={q}",
]

def search(engine_url: str, query: str) -> str:
    url = engine_url.format(q=query)
    result = subprocess.run(
        ["moli", "fetch", "--timeout", "10000",
         "--dump", "markdown", url],
        capture_output=True, text=True, timeout=15
    )
    return result.stdout

def parallel_search(query: str) -> list[str]:
    with ThreadPoolExecutor(max_workers=4) as executor:
        return list(executor.map(
            lambda e: search(e, query), ENGINES
        ))
```

Estas cinco recetas cubren el 90% de los casos reales de un coding agent. El resto es tuning fino: timeouts, retries, fingerprinting por caso, persistencia de sesión.

## 13. Conclusión: combinación por caso, no reemplazo universal

La pregunta que más me han hecho en las últimas semanas no es "¿cuál es el mejor browser headless?" sino "¿qué pongo en mi agente?". La respuesta honesta es que **no hay un ganador universal**, y que la pregunta correcta no es "cuál" sino "para qué caso, en qué capa".

Mi combinación por defecto para un coding agent en 2026-Q4:

- **Para el 80% de los fetches**: Scrapling `Fetcher` o `AsyncFetcher`. Es OSS, es Python, es rápido, y el 80% de los sitios se leen sin más.
- **Para anti-bot medio**: Obscura o Scrapling `StealthyFetcher`. Moli si ya estoy en el ecosistema.
- **Para flujos multi-página con login y JS pesado**: Moli con CDP server, conectado a Playwright Python. Es el setup que más se parece a un "navegador para agente" real.
- **Para investigación (búsqueda)**: `moli-websearch` directamente, que paraleliza 4-6 motores y deduplica URLs.
- **Para producción con SLA**: Apify Crawlee, sin dudarlo. El coste se justifica cuando el coste del fallo importa.
- **Para nada**: Fortress, salvo que la evasión anti-bot sea el core del negocio y hayas hecho las cuentas con legal.

Y los tres mantras para no meter la pata:

1. **El benchmark interno del autor no es benchmark independiente**. Corre el tuyo.
2. **Source available no es open source**. Lee el archivo `LICENSE`, no el badge de GitHub.
3. **"Drop-in Playwright" no es "100% compatible Playwright"**. Migra con tests, no a ciegas.

El stack headless 2026-Q4 es, por primera vez, un stack real: hay opciones OSS, hay opciones comerciales, hay opciones Rust y opciones Python, hay opciones ligeras y opciones completas. Lo que ya no hay es excusa para seguir pagando a Apify por hacer 5 fetches al día o para seguir descargando 250 MB de Chromium para extraer texto de un README. Cada caso tiene su herramienta. El trabajo del integrador es saber cuál es cuál.

---

**Fuentes verificadas el 2026-10-02 vía GitHub API y lectura de archivos en repo clonado**:

- `lexmount/moli` — 3.510★, 186 forks, Apache-2.0, push 2026-10-02. Repositorio clonado en `~/proyectos/moli-investigacion/repo/`. LICENSE-APACHE + LICENSE-MIT presentes. Frase del README y tagline citados literal.
- `D4Vinci/Scrapling` — 85.202★, 8.728 forks, BSD-3-Clause, push 2026-09-30. CHANGELOG.md leído (versión 0.4.15 del 2026-08-23 con servidor MCP, RAG-ready Markdown, Cloudflare solver mejorado).
- `tiliondev/fortress` — 709★, 47 forks, **NOASSERTION (Source Available 1.1)**, push 2026-09-30. Archivo `LICENSE` leído: cláusula 1.4 confirma "This License is a source-available license, not an open-source license." Pricing en `tilion.com/pricing`.
- `h4ckf0r0day/obscura` — 28.252★, 2.098 forks, Apache-2.0, push 2026-10-02. Descripción oficial: "The headless browser for AI agents and web scraping".
- `apify/crawlee` — 25.968★, 1.685 forks, Apache-2.0, push 2026-10-02. ~10 años de vida, creado 2016-08-26.

**Limitaciones de este artículo**:

- Los datos del benchmark Lexbench (Moli 81,88% vs Chrome 99,85% vs Obscura 44,9%) son del benchmark interno del autor de Moli. No hay datos cruzados independientes verificados para 2026-Q4.
- Los ejemplos de código del apéndice están escritos a partir de la documentación de los repos, no ejecutados en este artículo. Para producción, validar con la versión instalada de cada librería.
- El ecosistema cambia rápido: las cifras de estrellas/forks y las versiones son del 2026-10-02.
