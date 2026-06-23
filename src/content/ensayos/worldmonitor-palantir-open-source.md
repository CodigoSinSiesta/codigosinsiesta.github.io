---
title: "WorldMonitor: el Palantir open source que no sabías que existía"
description: "57K estrellas en GitHub, 500+ fuentes de noticias, mapas 3D, IA local con Ollama, 24 idiomas y una app de escritorio. WorldMonitor es el dashboard de inteligencia global más ambicioso del open source y merece un vistazo."
fecha: 2026-06-20
tags: ["herramientas", "dashboard", "osint", "open-source", "ia", "monitorización"]
autor: "Alejandro de la Fuente"
---

Hay proyectos open source que explican su valor en la primera frase del README. WorldMonitor lo hace: _"Real-time global intelligence dashboard — AI-powered news aggregation, geopolitical monitoring, and infrastructure tracking in a unified situational awareness interface."_

Traducción: un Palantir, pero open source, con 57.000 estrellas en GitHub, app de escritorio nativa y una ejecución técnica que roza lo obsesivo.

No es un juguete. No es un "clon de X con IA". Es un sistema de inteligencia global que agrega 500+ fuentes de noticias curadas, las sintetiza con IA, las despliega sobre mapas 3D con 56 tipos de capas, y lo empaqueta todo en una sola codebase que genera seis variantes distintas del producto.

Y puedes ejecutarlo localmente, sin API keys, usando Ollama.

---

## Qué hace realmente

El dashboard se organiza en paneles. Cada panel es una ventana al mundo en tiempo real:

- **Mapa dual**: un globo 3D (globe.gl) y un mapa plano WebGL (deck.gl) con 56 capas — desde actividad militar hasta rutas marítimas, pasando por ciberataques, clima severo, tráfico aéreo y sanciones económicas.
- **Feed de noticias**: 500+ fuentes RSS curadas en 15 categorías, sintetizadas por IA en briefs. No es un agregador de titulares: es un pipeline que extrae entidades, geolocaliza eventos y los correlaciona entre fuentes.
- **Country Instability Index (CII v8)**: un scoring de estrés para 31 países Tier-1, calculado en servidor con datos de 35 fuentes agrupadas. No es un número mágico: el código del algoritmo está en el repo.
- **Radar financiero**: 29 bolsas, commodities, crypto, y un composite de 7 señales de mercado. Con sparklines, heatmaps y correlación cruzada.
- **Correlación cross-stream**: convergencia de señales militares, económicas, de desastre y de escalada. Si tres fuentes independientes reportan actividad inusual en el Estrecho de Ormuz, el dashboard lo cruza y lo eleva.
- **6 variantes desde una sola codebase**: `worldmonitor.app` (completa), `tech.worldmonitor.app` (tecnología), `finance.worldmonitor.app` (mercados), `commodity.worldmonitor.app` (materias primas), `happy.worldmonitor.app` (solo noticias positivas), `energy.worldmonitor.app` (seguridad energética, chokepoints, disrupciones).

Y todo esto corre en el navegador. La app de escritorio —Tauri 2, nativa para macOS, Windows y Linux— es la misma SPA empaquetada con un sidecar Node.js para operaciones que necesitan sistema de archivos.

---

## La arquitectura: 155 componentes, 80+ endpoints, protobufs

Una cosa es tener ambición. Otra es ejecutarla con disciplina. WorldMonitor hace ambas.

La codebase tiene ~25 millones de bytes de TypeScript/JavaScript, organizados en capas con una dirección de dependencia estricta:

```text
types → config → services → components → app → App.ts
```

- `types/` tiene cero imports internos. Es la base de todo.
- `config/` solo importa de `types/`. Define paneles, capas, variantes y símbolos de mercado.
- `services/` contiene 185 módulos de lógica de negocio: fetching, caching, parsing, scoring.
- `components/` son 155 componentes TypeScript (clases, no funciones — han optado por un estilo más cercano a Java/C# que al React hooks típico).
- `app/` orquesta componentes y servicios.

La API son 80+ Vercel Edge Functions autocontenidas (JavaScript plano, sin imports de `src/`), con handlers en `server/` que se empaquetan en el deploy usando un gateway factory. La comunicación está tipada con **protobufs** — sí, protobufs en un proyecto TypeScript de frontend. Usan `buf` para generar stubs de cliente y servidor, y los handlers de dominio (aviation, climate, energy, finance, maritime, military, cyber) se cablean contra esos contratos.

No es "un proyecto con TypeScript". Es un proyecto con TypeScript **y contratos formales**.

---

## IA local: Ollama, sin API keys

Uno de los detalles más interesantes es que puedes ejecutar todo el pipeline de IA localmente con Ollama. Sin OpenAI. Sin Anthropic. Sin API keys.

El proyecto incluye workers para ML (ONNX en el navegador), análisis y una base de datos vectorial en el frontend. Los briefs de noticias, la extracción de entidades y la correlación de señales pueden correr contra un modelo local.

Esto es importante por dos razones:

1. **Privacidad**: los datos no salen de tu máquina. Si estás haciendo OSINT en un contexto sensible, esto es crítico.
2. **Resiliencia**: el dashboard funciona sin conexión a servicios cloud de IA. Si mañana OpenAI cambia sus precios o sus términos, WorldMonitor sigue funcionando.

Y no es un afterthought. El soporte para Ollama está integrado en el pipeline de síntesis, no es un "chatbot en una esquina".

---

## Lo que dice de hacia dónde va el desarrollo de software

WorldMonitor es relevante para esta comunidad no por lo que hace —inteligencia global— sino por **cómo está construido**.

Primero: **disciplina arquitectónica sin hype**. No usa React Server Components, no usa Next.js, no usa IA para todo. Usa Vite + Preact porque es lo que necesita. Usa clases de TypeScript porque les funciona. Usa protobufs porque necesitan contratos. Cada decisión técnica está justificada por el problema, no por la tendencia.

Segundo: **variantes desde una sola codebase**. Seis productos distintos —world, tech, finance, commodity, happy, energy— compilados desde el mismo código. La configuración de variantes es un sistema de feature flags que selecciona paneles, capas y fuentes de datos. Esto es lo que los equipos enterprise intentan hacer con microfrontends y acaban con 14 repos y un orchestra de CI/CD. Aquí está resuelto con archivos de configuración y `VITE_VARIANT`.

Tercero: **la app de escritorio es un ciudadano de primera**. Tauri 2 empaqueta la misma SPA con un sidecar Node.js. No hay "versión móvil reducida" ni "experiencia desktop limitada". La misma codebase, el mismo feature set, distribuido como web y como binario nativo.

Cuarto: **57K estrellas en 5 meses**. El repo se creó en enero de 2026. En junio tiene 57.000 estrellas y 9.000 forks. El ritmo de commits es diario, con PRs que arreglan bugs de seguridad, mejoran rendimiento y añaden fuentes de datos. No es un proyecto que apareció y se estancó: es un proyecto que crece.

---

## Lo que no es

WorldMonitor no es para todos. Si tu interés es el desarrollo web tradicional —formularios, CRUDs, dashboards de negocio— este proyecto te parecerá excesivo. Pero si trabajas en:

- **OSINT** (inteligencia de fuentes abiertas)
- **Ciberseguridad** (monitorización de amenazas, superficie de ataque global)
- **Análisis geopolítico** (riesgo país, sanciones, conflictos)
- **Trading o finanzas** (señales de mercado, correlación de eventos)
- **Logística y supply chain** (rutas marítimas, disrupciones, chokepoints)

...entonces WorldMonitor es una herramienta que probablemente deberías conocer, aunque solo sea para estudiar su arquitectura.

---

## El ángulo para Código Sin Siesta

No voy a escribir una review de features. Eso lo hace cualquiera. Lo interesante aquí es lo que WorldMonitor demuestra sobre **cómo se construye software ambicioso en 2026**:

1. **TypeScript estricto con contratos formales** (protobufs) funciona en la práctica. No necesitas Rust o Go para tener type safety extremo a extremo.
2. **Una sola codebase, múltiples productos** no es un sueño — es un sistema de configuración bien diseñado.
3. **IA local con Ollama** es viable hoy para pipelines de síntesis y extracción. No es solo para chatbots.
4. **Tauri 2** está listo para aplicaciones de escritorio complejas. Si tu SPA funciona en el navegador, funciona como app nativa.
5. **El open source puede competir con Palantir**. No en ventas enterprise ni en contratos gubernamentales, pero sí en capacidad técnica y velocidad de iteración.

WorldMonitor no es el futuro. Es el presente, y está en GitHub con licencia AGPL v3.
