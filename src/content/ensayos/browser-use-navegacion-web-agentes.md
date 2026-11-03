---
title: "Browser-use: cuando tu agente necesita navegar la web como un humano"
description: "Browser-use es una biblioteca Python open source que convierte a cualquier LLM en un agente capaz de controlar un navegador real: hacer clics, rellenar formularios, extraer datos estructurados y completar tareas web complejas de principio a fin. Con más de 100K estrellas en GitHub, soporte para 15+ modelos de lenguaje y una arquitectura que combina Chromium via CDP con un bucle ReAct aumentado con visión, browser-use representa el estado del arte en agentes de navegación web."
fecha: 2026-06-21
tags: ['agentes','web','computer-use','python']
tipo: investigacion
estado: pendiente-revision
autor: "Alejandro de la Fuente"
---

# Browser-use: cuando tu agente necesita navegar la web como un humano

Hay una categoría de tareas que todo agente de IA debería poder hacer pero casi ninguno hace bien: abrir un navegador, buscar información, rellenar un formulario, comparar precios entre tres sitios, extraer datos de una tabla y devolverlos estructurados.

Los LLMs pueden razonar sobre texto. Pueden generar código. Pero no pueden hacer clic en un botón. No pueden escribir en un campo de texto de una web real, con JavaScript, popups de cookies, infinite scroll, captchas y redirecciones. Para eso necesitan un cuerpo. Y ese cuerpo, en el caso de la web, es un navegador.

**Browser-use** es una biblioteca Python open source (MIT, ETH Zurich) que resuelve exactamente esto. Proporciona a cualquier LLM — OpenAI, Anthropic, Google, modelos locales via Ollama, o su propio modelo optimizado `ChatBrowserUse` — un navegador Chromium completo que el modelo controla paso a paso mediante un bucle de razonamiento y acción. El resultado: un agente que ve la pantalla, decide qué hacer, ejecuta acciones reales (click, type, scroll, navigate, extract) y repite hasta completar la tarea.

Este artículo explora qué es, cómo funciona por dentro, cómo empezar con código real, qué lo diferencia de alternativas como Computer Use de Anthropic o CUA de OpenAI, y dónde están sus límites.

---

## El problema: la web no es una API

La mayoría de herramientas de "browser automation" que conocemos — Selenium, Playwright, Puppeteer — resuelven el problema del control del navegador. Te dan una API para decir "ve a esta URL", "haz clic en este selector CSS" o "escribe este texto". Son deterministas y rápidas.

El problema es que requieren que tú, el programador, sepas exactamente qué selectores usar, qué flujo seguir, qué esperar. Escribes un script para cada sitio web. Si el sitio cambia su DOM, tu script se rompe. No hay inteligencia: solo ejecución ciega.

Los LLMs invierten esta ecuación: pueden entender una página web mirándola, razonar sobre qué acción tomar a continuación, y adaptarse a cambios en la interfaz. Son robustos donde los scripts tradicionales son frágiles. Pero necesitan un puente entre su razonamiento y el navegador real.

Ese puente es browser-use.

---

## Qué es browser-use

Browser-use es una biblioteca que implementa el patrón **ReAct** (Reasoning + Acting) sobre un navegador Chromium controlado mediante el protocolo **CDP** (Chrome DevTools Protocol). Su arquitectura es:

```
Task → Agent (LLM) → Browser Session (CDP) → Web Page
  ↑                                              |
  └────────── Observation (DOM + screenshot) ────┘
```

Cada paso del bucle:

1. **Observación**: el agente captura el estado actual del navegador — DOM simplificado como árbol de accesibilidad, screenshot de la página, elementos clickables con índices numéricos.
2. **Razonamiento**: el LLM recibe esa observación junto con el historial de acciones previas y decide qué hacer. Puede razonar con visión (viendo el screenshot) o solo con el DOM textual.
3. **Acción**: el agente ejecuta una o varias acciones — navegar a una URL, hacer clic en un elemento, escribir texto, hacer scroll, extraer datos, descargar un PDF, esperar.
4. **Evaluación**: el LLM evalúa si la acción anterior tuvo éxito y si se acerca al objetivo. Si falla, reintenta con otra estrategia.

El proyecto nació en ETH Zurich y ha acumulado más de 100.000 estrellas en GitHub. Su versión actual (0.13.x) incluye un núcleo reescrito en Rust para la parte de mayor rendimiento y un "beta agent" con una arquitectura renovada inspirada en coding agents. Soporta más de 15 proveedores de LLM, extracción de datos estructurados con Pydantic, herramientas personalizadas, integración MCP, perfiles de navegador reales con cookies y autenticación, y despliegue en producción mediante sandboxes en la nube.

---

## Instalación y primeros pasos

La instalación es directa. Necesitas Python ≥ 3.11 y un entorno virtual:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install browser-use
```

El paquete base pesa menos de 1 MB. Las dependencias de cada proveedor LLM (openai, anthropic, google-genai, groq, ollama) vienen incluidas, así que no necesitas instalar nada adicional para usar el modelo que prefieras.

Para el modelo recomendado — `ChatBrowserUse`, el modelo propio de browser-use optimizado específicamente para tareas de navegación web — necesitas una API key gratuita de [cloud.browser-use.com](https://cloud.browser-use.com/new-api-key). La guardas en un `.env`:

```bash
# .env
BROWSER_USE_API_KEY=bu-...
```

Y el agente más simple posible:

```python
from browser_use import Agent, ChatBrowserUse
from dotenv import load_dotenv
import asyncio

load_dotenv()

async def main():
    llm = ChatBrowserUse()
    task = "Find the number of stars of the browser-use repo on GitHub"
    agent = Agent(task=task, llm=llm)
    await agent.run()

if __name__ == "__main__":
    asyncio.run(main())
```

Esto abre un navegador Chromium visible, navega a GitHub, busca el repositorio, lee el contador de estrellas y devuelve el resultado. Sin selectores. Sin lógica de scraping. El LLM "ve" la página y decide qué hacer.

También puedes usar cualquier otro proveedor:

```python
from browser_use import Agent, ChatOpenAI

agent = Agent(
    task="Busca en Google los 3 frameworks web más populares de Python en 2026",
    llm=ChatOpenAI(model="gpt-4.1-mini"),
)
await agent.run()
```

O Anthropic:

```python
from browser_use import Agent, ChatAnthropic

agent = Agent(
    task="Fill this form: https://httpbin.org/forms/post with test data",
    llm=ChatAnthropic(model="claude-sonnet-4-0", temperature=0.0),
)
await agent.run()
```

O Gemini de Google (con tier gratuito generoso):

```python
from browser_use import Agent, ChatGoogle

agent = Agent(
    task="Go to Hacker News and tell me the top 5 stories",
    llm=ChatGoogle(model="gemini-3-flash-preview"),
)
await agent.run()
```

---

## Extracción de datos estructurados: el caso práctico real

El escenario más común en el mundo real no es "haz clic aquí y allá" sino "entra en estas tres webs, busca este producto, extrae precios y características, y devuélvemelo en JSON".

Browser-use lo resuelve con `output_model_schema`, que toma un modelo Pydantic y garantiza que el agente devuelva los datos con esa estructura:

```python
from pydantic import BaseModel, Field
from browser_use import Agent, ChatBrowserUse, Browser

class ProductListing(BaseModel):
    title: str = Field(description="Product title")
    price: float = Field(description="Price as number")
    source: str = Field(description="Source website")
    url: str = Field(description="Full URL to listing")
    condition: str | None = Field(None, description="New, Used, Refurbished")

class PriceComparison(BaseModel):
    search_query: str
    listings: list[ProductListing]

async def compare_prices(item: str = "Used iPhone 12"):
    llm = ChatBrowserUse(model="bu-2-0")

    task = f"""
    Search for "{item}" on eBay, Amazon, and Swappa.
    For each site, extract 2-3 listings with title, price, source, URL, and condition.
    """

    agent = Agent(
        task=task,
        llm=llm,
        output_model_schema=PriceComparison,
    )

    result = await agent.run()

    if result and result.structured_output:
        comparison = result.structured_output
        for listing in comparison.listings:
            print(f"{listing.title} — ${listing.price} ({listing.source})")

asyncio.run(compare_prices())
```

El agente navega autónomamente los tres sitios, extrae la información relevante y la devuelve tipada y validada. Sin escribir un solo selector. Sin parsear HTML. El LLM + Pydantic hacen de capa de extracción universal.

---

## Cómo funciona por dentro

El bucle principal del agente reside en `browser_use/agent/service.py` y sigue un patrón que ya es canónico en el ecosistema de agentes:

1. **Planificación** (opcional, `enable_planning=True`): antes de ejecutar, el agente descompone la tarea en pasos. Si se estanca (`planning_replan_on_stall=3`), vuelve a planificar.

2. **Paso del agente** (bucle principal):
   - **Page extraction**: el DOM de la página se convierte a markdown mediante `markdownify`, priorizando elementos interactivos. Para modelos con visión, se incluye un screenshot.
   - **Message manager**: gestiona el contexto del LLM, comprimiendo mensajes antiguos cuando el historial crece demasiado (`max_history_items`, `message_compaction`).
   - **LLM call**: el modelo recibe el system prompt (que incluye la lista de acciones disponibles), el estado de la página, el historial de acciones y la tarea. Devuelve una o varias acciones.
   - **Action execution**: las acciones se ejecutan secuencialmente contra el navegador via CDP. El agente soporta acciones múltiples por paso (`max_actions_per_step=5`): puedes rellenar cinco campos de un formulario en una sola llamada al LLM.
   - **Evaluation + Judge**: el LLM evalúa su propia acción anterior. Un "judge" opcional (`use_judge=True`) puede hacer una evaluación independiente con otra llamada al modelo.

3. **Detección de bucles** (`loop_detection_enabled=True`): si el agente repite las mismas acciones en una ventana de 20 pasos, se detecta el bucle y se fuerza un cambio de estrategia.

4. **Fallback**: si el LLM primario falla (rate limit, error 5xx), un `fallback_llm` toma el relevo automáticamente.

La novedad en la versión 0.13 es el **beta agent** (`from browser_use.beta import Agent`) que reescribe el núcleo en Rust y añade herramientas persistentes, bucles de recuperación inspirados en coding agents, y un espacio de acción más rico. Para la mayoría de casos, el agente clásico sigue siendo la opción recomendada.

---

## Comparativa con alternativas

Browser-use no es la única forma de darle un navegador a un agente. Las tres alternativas principales son:

### Computer Use de Anthropic

El **computer use tool** de Anthropic es una herramienta a nivel de API que permite a Claude controlar un ordenador: tomar screenshots, mover el ratón, hacer clic, escribir. Funciona mediante un bucle visión-acción: Claude recibe un screenshot, decide coordenadas (x,y) para el clic, y las devuelve a tu código para que las ejecutes en un entorno virtual (habitualmente un contenedor Docker con escritorio X11).

**Diferencias clave:**
- **Nivel de abstracción**: Anthropic te da screenshots y coordenadas de píxel. Tú tienes que montar el entorno de ejecución. Browser-use te da el navegador completo gestionado.
- **Propósito**: Computer Use es genérico — puede controlar cualquier aplicación de escritorio. Browser-use está especializado en web.
- **Visión**: Computer Use funciona exclusivamente con screenshots. Browser-use puede funcionar con DOM textual + screenshots opcionales, lo que reduce drásticamente el consumo de tokens y la latencia.
- **Extracción de datos**: Browser-use incluye extracción estructurada con Pydantic. Computer Use requiere que implementes tu propio parsing.
- **Robustez web**: browser-use maneja iframes, popups, infinite scroll, formularios complejos y descargas de archivos. Computer Use trata la web como píxeles.

**Cuándo usar cada uno**: Computer Use si necesitas controlar aplicaciones de escritorio más allá del navegador (Excel, un IDE, una herramienta interna). Browser-use si tu caso de uso es exclusivamente web.

### CUA (Computer-Using Agent) de OpenAI

CUA es el modelo que impulsa Operator, el agente de navegación web de OpenAI lanzado en enero de 2025. En marzo de 2025, OpenAI expuso CUA como herramienta dentro de su **Responses API**.

**Diferencias clave:**
- **Modelo propietario cerrado**: CUA es un modelo específico de OpenAI (basado en GPT-4o) optimizado para interacción con interfaces. No puedes usar Claude, Gemini o Llama. Browser-use te deja elegir entre 15+ modelos.
- **Cloud-hosted**: CUA ejecuta el navegador en servidores de OpenAI. Tú no gestionas la infraestructura. Browser-use te da control total: puedes ejecutarlo local, en tu propio servidor, o en la nube de browser-use.
- **Precio**: CUA factura por uso de API + computación del navegador. Browser-use open source es gratuito; solo pagas las llamadas al LLM que elijas.
- **Madurez**: CUA está en sus primeras versiones. Browser-use lleva más de un año de desarrollo abierto, con benchmarks públicos, comunidad activa y casos de uso en producción documentados.
- **Open source vs propietario**: Browser-use es MIT. Puedes leer el código, modificarlo, contribuir. CUA es una caja negra.

**Cuándo usar cada uno**: CUA si ya estás en el ecosistema OpenAI y quieres la opción más simple sin gestionar infraestructura. Browser-use si necesitas flexibilidad de modelos, control sobre el navegador, extracción estructurada avanzada, o no quieres depender de un solo proveedor.

### Playwright / Selenium + LLM propio

Una alternativa frecuente es montar tu propio bucle de agente usando Playwright o Selenium para el control del navegador y un LLM para la toma de decisiones.

**Diferencias clave:**
- **Tiempo de desarrollo**: Implementar un bucle ReAct con gestión de contexto, detección de bucles, extracción de DOM, compresión de mensajes y fallbacks te llevará semanas. Browser-use lo trae resuelto.
- **Rendimiento**: browser-use 0.13 tiene un núcleo en Rust que acelera el parsing del DOM y la comunicación CDP. Tu implementación ad-hoc en Python probablemente será más lenta.
- **Mantenimiento**: los sitios web cambian. Browser-use tiene una comunidad que reporta y corrige edge cases continuamente. Tu solución casera tendrás que mantenerla tú solo.
- **Flexibilidad**: tu solución te da control total sobre cada decisión de diseño. Browser-use te da una arquitectura probada pero con menos libertad en los detalles internos.

---

## Limitaciones

Browser-use es impresionante pero no es magia. Estas son sus limitaciones reales:

**Dependencia del LLM.** La calidad del agente es tan buena como el modelo que lo impulsa. Con modelos pequeños (Llama 3 8B, Gemma), la tasa de éxito baja drásticamente en tareas complejas. El equipo recomienda `ChatBrowserUse` (modelo optimizado) o modelos frontier (Claude Sonnet 4, GPT-5, Gemini 3 Pro) para obtener resultados fiables.

**Coste por tarea.** Cada paso del agente consume tokens. Una tarea compleja de 10-15 pasos con screenshots puede consumir entre 50K y 200K tokens. A precios de API actuales, eso son entre $0.15 y $2 por tarea. Para automatización a escala, el coste se acumula.

**Latencia.** Cada paso implica: capturar estado del navegador → llamar al LLM → ejecutar acciones. Con modelos rápidos (Gemini Flash, Groq) un paso puede tomar 2-3 segundos. Con modelos más lentos (Claude Opus), 8-12 segundos. Una tarea de 10 pasos son entre 20 segundos y 2 minutos.

**Fragilidad ante cambios extremos del DOM.** Aunque los LLMs son más robustos que los selectores CSS, un rediseño completo de un sitio web puede confundir al agente. La visión ayuda, pero no es infalible.

**Captchas y anti-bot.** Browser-use no incluye resolución de captchas en su versión open source. Para sitios con protección anti-bot (Cloudflare, DataDome), el equipo recomienda usar su cloud con proxies rotativos y navegadores stealth.

**No determinismo.** Dos ejecuciones de la misma tarea pueden tomar caminos diferentes y producir resultados ligeramente distintos. Para flujos críticos donde necesitas garantías, esto es un problema.

**Autenticación.** Aunque browser-use soporta perfiles de Chrome reales (con tus cookies y sesiones), la autenticación OAuth con 2FA sigue siendo un punto débil. El equipo recomienda usar `@sandbox` con sincronización de perfil para manejar auth en producción.

---

## Conclusión

Browser-use resuelve un problema real y lo resuelve bien: darle a un LLM la capacidad de interactuar con la web como lo haría un humano. No es un wrapper alrededor de Playwright con un prompt bonito. Es una arquitectura completa que gestiona el bucle de observación-razonamiento-acción, la extracción de datos estructurados, la gestión de contexto, los fallbacks y la detección de bucles.

El ecosistema de "computer use" está fragmentado en tres enfoques: Anthropic te da la herramienta de bajo nivel (screenshots + coordenadas), OpenAI te da el modelo cerrado llave en mano (CUA), y browser-use te da la biblioteca open source que funciona con cualquier modelo. Cada uno tiene su sitio, pero para quien construye agentes web en Python, browser-use es la opción más flexible, madura y productiva hoy.

La web no es una API. Pero con browser-use, tu agente puede fingir que sí lo es.

---

**Recursos:**
- [Repositorio en GitHub](https://github.com/browser-use/browser-use)
- [Documentación oficial](https://docs.browser-use.com)
- [Browser Use Cloud](https://cloud.browser-use.com)
- [Benchmarks abiertos](https://github.com/browser-use/benchmark)
