---
title: "El stack de scraping para agentes de IA: Firecrawl vs Crawl4AI vs MarkItDown"
description: "Comparativa exhaustiva de las tres herramientas líderes para convertir la web y documentos en texto limpio que los LLMs puedan consumir. Velocidad, calidad, precio y casos de uso reales."
fecha: 2026-06-21
tags:
  - scraping
  - agentes
  - llm
  - herramientas
tipo: investigacion
estado: pendiente-revision
autor: Alejandro de la Fuente
---

# El stack de scraping para agentes de IA: Firecrawl vs Crawl4AI vs MarkItDown

Si estás construyendo agentes de IA, RAG pipelines o flujos de extracción de datos, hay una verdad incómoda: el problema no es el modelo, es el input. Los LLMs necesitan texto limpio, estructurado y en el formato correcto. Y la web, ese océano caótico de JavaScript, iframes y CAPTCHAs, es cualquier cosa menos limpia.

En 2026, tres herramientas dominan el ecosistema de "web a markdown": **Firecrawl** (136K ⭐), **Crawl4AI** (69K ⭐) y **MarkItDown** de Microsoft (157K ⭐). Cada una ataca el problema desde un ángulo distinto. Este artículo es una comparativa quirúrgica basada en exploración real de código, documentación y —donde ha sido posible— pruebas de ejecución.

---

## El problema: la web no está lista para tu LLM

Antes de entrar en herramientas, entiende el _pipeline_ que necesitas resolver:

1. **Fetch**: obtener el HTML de una URL (a veces con JavaScript, cookies, rate limits).
2. **Parse**: extraer el contenido relevante, ignorando navegación, anuncios, popups.
3. **Convert**: transformar HTML a Markdown limpio (con tablas, listas, enlaces, citas).
4. **Structure**: opcionalmente extraer datos en JSON estructurado vía LLM o CSS selectors.
5. **Deliver**: servir ese output a tu agente, RAG pipeline o base de datos.

Cada herramienta resuelve partes distintas de este pipeline. Vamos a diseccionarlas.

---

## Firecrawl: la API gestionada que lo hace todo

**Repositorio:** [mendableai/firecrawl](https://github.com/mendableai/firecrawl)  
**Licencia:** AGPL-3.0 (core), MIT (SDKs)  
**Lenguaje:** TypeScript  
**Modelo:** SaaS (freemium) + self-hosted opcional

Firecrawl se define como _"la API para buscar, scrapear e interactuar con la web a escala"_. Es un producto, no solo una librería. Su propuesta de valor es que tú llamas a una API y recibes Markdown limpio. Punto.

### Lo que ofrece

Firecrawl tiene **seis endpoints principales**:

| Endpoint | Función | Coste (créditos) |
|----------|--------|-------------------|
| `/scrape` | Convierte una URL a Markdown, HTML, screenshot o JSON | 1 crédito/página |
| `/crawl` | Scrapea un sitio web entero recursivamente | 1 crédito/página |
| `/search` | Busca en la web y devuelve resultados con contenido completo | 2 créditos/10 resultados |
| `/map` | Descubre todas las URLs de un sitio | ~1 crédito |
| `/batch` | Scrapea miles de URLs asíncronamente | 1 crédito/página |
| `/agent` | Agente autónomo: describle lo que necesitas y él busca, navega y extrae | 5 gratis/día + dinámico |

### Planes de precio (junio 2026)

Firecrawl ofrece un **tier gratuito generoso** con 1.000 créditos/mes sin tarjeta. A partir de ahí:

- **Hobby** (14 €/mes): 5.000 créditos, 5 requests concurrentes
- **Standard** (72 €/mes): 100.000 créditos, 50 requests concurrentes
- **Growth** (290 €/mes): 500.000 créditos, 150 requests concurrentes
- **Scale** (522 €/mes): 1.000.000 créditos
- **Enterprise**: personalizado

Cada crédito equivale aproximadamente a una página scrapeada. La transparencia es total.

### Cómo se usa

```python
from firecrawl import Firecrawl

app = Firecrawl(api_key="fc-YOUR_API_KEY")

# Scrape simple: una URL → Markdown limpio
doc = app.scrape("https://firecrawl.dev", formats=["markdown"])
print(doc.markdown)

# Crawl de sitio completo: scrapea hasta 50 páginas
docs = app.crawl("https://docs.firecrawl.dev", limit=50)
for doc in docs.data:
    print(doc.metadata.source_url, doc.markdown[:100])

# Agente autónomo: describe y él busca
result = app.agent(prompt="Find the founders of Stripe")
print(result.data)

# Búsqueda web
results = app.search("best web scraping tools 2026", limit=10)
```

También ofrece SDKs para **Node.js, Java, Elixir, Rust** y **Go** (community), CLI oficial, integración MCP y skills para agentes (Claude Code, Antigravity, OpenCode).

### Puntos fuertes

- **Confiabilidad industrial**: cubre el 96% del web, incluyendo páginas con JavaScript pesado. P95 de latencia de 3.4 segundos.
- **Cero configuración**: rotación de proxies, rate limiting, CAPTCHAs, todo gestionado.
- **Markdown de alta calidad**: optimizado para reducir consumo de tokens.
- **Self-hosted posible**: Docker Compose con soporte para Kubernetes y Helm. Sin embargo, la versión self-hosted **no incluye Fire-engine** (el sistema de proxies rotativos y anti-detección), por lo que sitios con protecciones fuertes requerirán configuración manual de proxies.

### Puntos débiles

- **Es SaaS-first**: la mejor experiencia es con API key de pago. El tier gratuito es limitado (1.000 páginas/mes).
- **Self-hosted limitado**: sin Fire-engine, los proxies son responsabilidad tuya.
- **Dependencia externa**: si el servicio cae, tu pipeline cae (a menos que self-hostees).

---

## Crawl4AI: el caballo de batalla open source

**Repositorio:** [unclecode/crawl4ai](https://github.com/unclecode/crawl4ai)  
**Licencia:** Apache-2.0  
**Lenguaje:** Python  
**Modelo:** open source (self-hosted), Cloud API en beta cerrada

Crawl4AI nació de la frustración. Su creador, UncleCode, necesitaba web a Markdown en 2023, probó opciones "open source" que pedían registro y API key, y en días construyó lo que hoy es el crawler open source más popular de GitHub. Su filosofía: **"sin llaves, sin cuentas, sin limitaciones"**.

### Lo que ofrece

Crawl4AI es una **librería Python asíncrona** construida sobre Playwright. No es un SaaS —tú ejecutas el navegador, tú gestionas los recursos. Ofrece:

- **Extracción a Markdown**: con estrategias configurables (`DefaultMarkdownGenerator`, filtros BM25, pruning).
- **Extracción estructurada**: vía CSS/XPath (`JsonCssExtractionStrategy`) o LLM (`LLMExtractionStrategy` con cualquier proveedor vía Litellm).
- **Crawling profundo**: BFS, DFS, Best-First con recuperación de crashes (`resume_state`).
- **Control total del navegador**: perfiles persistentes, cookies, user-agents personalizados, proxies, stealth mode, modo undetected.
- **Renderizado dinámico**: JavaScript, scroll infinito, Shadow DOM flattening.
- **Screenshots, PDFs, extracción de tablas, media (imágenes, audio, video)**.
- **Docker API server**: con dashboard de monitoreo, browser pooling (3-tier: permanent/hot/cold), playground web, integración MCP, WebSocket streaming.
- **CLI**: `crwl https://ejemplo.com` para uso rápido.

### Cómo se usa

```python
import asyncio
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig, CacheMode

async def main():
    browser_config = BrowserConfig(headless=True, verbose=True)
    run_config = CrawlerRunConfig(cache_mode=CacheMode.ENABLED)

    async with AsyncWebCrawler(config=browser_config) as crawler:
        result = await crawler.arun(
            url="https://example.com",
            config=run_config
        )
        # Markdown limpio
        print(result.markdown)
        # Markdown "fit" (filtrado, más compacto)
        print(result.markdown.fit_markdown)
        # HTML original
        print(result.html)
        # Links extraídos
        print(result.links)

asyncio.run(main())
```

Extracción estructurada con LLM:

```python
from crawl4ai import LLMExtractionStrategy, LLMConfig
from pydantic import BaseModel, Field

class Product(BaseModel):
    name: str = Field(description="Nombre del producto")
    price: str = Field(description="Precio")

strategy = LLMExtractionStrategy(
    llm_config=LLMConfig(provider="openai/gpt-4o-mini", api_token="..."),
    schema=Product.schema(),
    instruction="Extrae todos los productos y sus precios"
)

run_config = CrawlerRunConfig(extraction_strategy=strategy)
result = await crawler.arun(url="https://tienda-ejemplo.com", config=run_config)
print(result.extracted_content)  # JSON estructurado
```

### Puntos fuertes

- **100% open source, Apache 2.0**: sin restricciones, sin API keys, sin limitaciones artificiales.
- **Control total**: cada aspecto del navegador es configurable. Puedes usar proxies rotativos, perfiles persistentes, JavaScript arbitrario.
- **Rendimiento**: async browser pool con caching, prefetch mode (5-10x más rápido para descubrimiento de URLs).
- **Docker server con dashboard**: monitoreo en tiempo real, browser pooling, playground interactivo.
- **Comunidad activa**: 69K estrellas, releases frecuentes (v0.9.0 en 2026), security hardening continuo.
- **Cloud API en camino**: beta cerrada, promete ser "drásticamente más barato" que alternativas.

### Puntos débiles

- **Requiere infraestructura**: necesitas ejecutar navegadores (Playwright/Chromium), gestionar memoria, proxies. El coste real es ~50-300$/mes en cómputo + proxies para volumen medio.
- **Curva de aprendizaje**: la flexibilidad tiene precio. Configurar `BrowserConfig` + `CrawlerRunConfig` + estrategias de extracción lleva tiempo.
- **Sin proxies gestionados**: a diferencia de Firecrawl, tú eres responsable de evitar rate limits y bloqueos.
- **Documentación en evolución**: aunque extensa, está en proceso de reestructuración.

---

## MarkItDown: el conversor universal de Microsoft

**Repositorio:** [microsoft/markitdown](https://github.com/microsoft/markitdown)  
**Licencia:** MIT  
**Lenguaje:** Python  
**Modelo:** librería open source

MarkItDown ocupa un nicho distinto: no es un web scraper. Es un **conversor de documentos a Markdown**. PDFs, PowerPoints, Excels, Word, EPUBs, imágenes (con OCR vía LLM), audio (transcripción), HTML, CSV, JSON, XML, ZIPs, URLs de YouTube… casi cualquier formato que te imagines, MarkItDown lo convierte a Markdown limpio.

Es el complemento perfecto para Firecrawl o Crawl4AI: ellos te dan el contenido de la web; MarkItDown procesa los archivos que tu agente encuentra por el camino.

### Lo que ofrece

MarkItDown soporta **más de 15 formatos de entrada**:

| Formato | Método |
|---------|--------|
| PDF | Extracción de texto + OCR opcional con LLM |
| Word (.docx) | Conversión estructural (headings, tablas, listas) |
| PowerPoint (.pptx) | Extrae slides y notas como Markdown |
| Excel (.xlsx, .xls) | Convierte hojas de cálculo a tablas Markdown |
| Imágenes | EXIF metadata + descripción vía LLM Vision |
| Audio (.wav, .mp3) | EXIF + transcripción de voz |
| HTML | Conversión a Markdown |
| EPUB | Extracción estructurada |
| ZIP | Itera sobre contenidos recursivamente |
| YouTube | Transcripción de vídeos |
| CSV, JSON, XML | Texto y tablas |
| Outlook (.msg) | Correos electrónicos |

Además, soporta **plugins** de terceros (busca `#markitdown-plugin` en GitHub) e integración con **Azure Document Intelligence** y **Azure Content Understanding** para extracción de más calidad.

### Cómo se usa

```python
from markitdown import MarkItDown

md = MarkItDown()

# Convertir un PDF
result = md.convert("informe.pdf")
print(result.text_content)

# Convertir con descripción de imágenes vía LLM
from openai import OpenAI

md = MarkItDown(
    llm_client=OpenAI(),
    llm_model="gpt-4o",
)
result = md.convert("documento_con_imagenes.pdf")
print(result.text_content)
```

Desde línea de comandos:

```bash
# Convertir un archivo
markitdown documento.pdf > output.md

# Con OCR vía plugin
pip install markitdown-ocr
markitdown --use-plugins escaneado.pdf
```

### Puntos fuertes

- **Cobertura de formatos inigualable**: de un PDF escaneado a un vídeo de YouTube, todo a Markdown.
- **Plugins**: ecosistema extensible para formatos adicionales.
- **OCR vía LLM Vision**: extrae texto de imágenes dentro de documentos.
- **MIT license**: uso sin restricciones.
- **Microsoft-backed**: 157K estrellas, mantenimiento activo por el equipo de AutoGen.

### Puntos débiles

- **No es un web scraper**: no navega la web, no ejecuta JavaScript, no maneja proxies.
- **Dependencias opcionales**: para formatos específicos necesitas instalar extras (`[pdf]`, `[pptx]`, `[all]`, etc.).
- **Limitaciones de OCR offline**: sin LLM, las imágenes dentro de PDFs no se procesan (solo metadata).

---

## Tabla comparativa

| Dimensión | Firecrawl | Crawl4AI | MarkItDown |
|-----------|-----------|----------|------------|
| **Tipo** | SaaS + self-hosted | Librería open source + Docker | Librería open source |
| **Licencia** | AGPL-3.0 / MIT SDKs | Apache 2.0 | MIT |
| **Lenguaje** | TypeScript | Python | Python |
| **Web scraping** | ✅ API gestionada | ✅ Browser automation total | ❌ (no es scraper) |
| **JavaScript rendering** | ✅ (gestionado) | ✅ (Playwright) | ❌ |
| **Markdown output** | ✅ Alta calidad | ✅ Configurable (raw, fit, BM25) | ✅ (desde documentos) |
| **JSON estructurado** | ✅ (vía LLM o schema) | ✅ (CSS/XPath o LLM) | ❌ |
| **Proxies gestionados** | ✅ | ❌ (manual) | N/A |
| **Anti-bot / CAPTCHA** | ✅ (Fire-engine) | ⚠️ (stealth mode, manual) | N/A |
| **Documentos (PDF, DOCX…)** | ✅ (PDFs web) | ❌ (solo web) | ✅ Todos los formatos |
| **Imagen/Audio → texto** | ❌ | ❌ | ✅ (LLM Vision + transcripción) |
| **Precio** | Desde 0 € (1K páginas/mes) | Gratis (+ cómputo/proxies) | Gratis |
| **Velocidad** | P95 3.4s (gestionado) | Depende de infraestructura | Instantáneo (local) |
| **Curva aprendizaje** | Baja (API REST) | Media-alta (configuración) | Muy baja |
| **Self-hosted** | ✅ (Docker, K8s, Helm) | ✅ (pip + Docker API) | ✅ (pip install) |
| **MCP / Agent skills** | ✅ Nativo | ✅ Docker API + MCP | ❌ |
| **Comunidad** | 136K ⭐ | 69K ⭐ | 157K ⭐ |
| **Uso ideal** | Producción, escalado, agentes | Control total, presupuesto ajustado, R&D | Documentos, archivos, complemento |

---

## Recomendaciones por caso de uso

### "Soy un desarrollador indie construyendo un agente"

**Usa Firecrawl.** El tier gratuito (1.000 páginas/mes) es más que suficiente para prototipar. La API es trivial, el Markdown es excelente y no pierdes tiempo configurando navegadores. Si tu agente necesita scrapear documentos (PDFs de informes, por ejemplo), añade MarkItDown como complemento.

```python
# Stack mínimo para un agente indie
from firecrawl import Firecrawl
from markitdown import MarkItDown

fc = Firecrawl(api_key="fc-...")
md = MarkItDown()

# Web → Markdown
web_content = fc.scrape("https://ejemplo.com", formats=["markdown"])

# PDF → Markdown
pdf_content = md.convert("informe_financiero.pdf")
```

### "Estoy en una empresa con restricciones de datos"

**Usa Crawl4AI self-hosted.** Los datos nunca salen de tu infraestructura. El Docker server es robusto (v0.9 trajo hardening de seguridad), el browser pooling es eficiente, y tienes control total sobre proxies y autenticación. El coste real es ~100-300 €/mes en servidores + proxies. MarkItDown para los documentos internos.

### "Necesito procesar cientos de miles de páginas al mes"

**Firecrawl plan Standard o Growth.** A 72 €/mes por 100.000 páginas, el coste por página es de 0.0007 € — ridículo comparado con el tiempo de ingeniería que invertirías en mantener una infraestructura propia de ese calibre. La gestión de proxies, rate limits y anti-bot detection está incluida.

### "Hago research y necesito extraer datos de papers, PDFs y webs académicas"

**Crawl4AI + MarkItDown.** Crawl4AI para las webs académicas (muchas con poco JavaScript pero estructuras complejas de referencias). MarkItDown para los PDFs de papers (ArXiv, etc.). La flexibilidad de Crawl4AI para extraer tablas y citas con estrategias personalizadas es imbatible.

### "Solo necesito convertir documentos a Markdown para mi RAG pipeline"

**MarkItDown, sin dudarlo.** Es su razón de ser. Instalación en segundos, API mínima, cobertura de formatos bestial. Si además necesitas scrapear la web ocasionalmente, añade `httpx` + `beautifulsoup4` para páginas simples o Firecrawl para las complejas.

---

## El stack ideal en 2026

Si tuviera que recomendar un stack completo para un agente de IA ambicioso, sería este:

```
Firecrawl (web scraping) + MarkItDown (documentos) + Crawl4AI (casos edge y self-hosted)
```

**¿Cuándo usar cada uno?**

1. **Firecrawl** es tu primera opción para cualquier cosa que venga de la web. Si la URL está detrás de Cloudflare, tiene JavaScript pesado o necesitas crawl recursivo, Firecrawl lo resuelve en una llamada.

2. **MarkItDown** es tu segunda herramienta. Todo archivo que llegue a tu agente (un PDF adjunto, un Excel de datos, un PowerPoint de un cliente) pasa por MarkItDown antes de llegar al LLM.

3. **Crawl4AI** es tu plan B y tu laboratorio. Cuando necesitas control absoluto (extracción con JavaScript custom, scroll infinito, autenticación compleja) o cuando los datos no pueden salir de tu VPC. También es ideal si estás experimentando con estrategias de extracción que no caben en el modelo "one-shot" de una API.

---

## Conclusión

En 2026, el problema de "web a Markdown" está esencialmente resuelto. La cuestión ya no es _si puedes_ scrapear la web para tus agentes, sino _qué aproximación encaja mejor_ con tu contexto:

- **Firecrawl** es la navaja suiza SaaS: calidad industrial, zero-ops, pricing predecible. Ideal para equipos que quieren construir producto, no infraestructura de scraping.

- **Crawl4AI** es el motor que te montas tú: open source radical, control total, gratuito. Ideal para quienes necesitan soberanía de datos o tienen restricciones de presupuesto pero no de talento.

- **MarkItDown** es el pegamento universal: convierte cualquier archivo en texto que tu LLM entiende. Complementa a cualquiera de los dos anteriores y resuelve el problema de "mis datos no están en la web".

La web ya no es una barrera para los agentes de IA. Con estas tres herramientas, tu agente puede leer —y entender— prácticamente cualquier contenido digital.

---

*¿Tienes experiencia con alguna de estas herramientas en producción? ¿Usas otro stack que no he mencionado? [Abre un issue en el repo del blog](https://github.com/codigosinsiesta/codigosinsiesta.github.io) y lo discutimos.*
