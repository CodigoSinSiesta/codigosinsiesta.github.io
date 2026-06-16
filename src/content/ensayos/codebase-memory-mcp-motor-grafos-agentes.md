---
title: "Codebase-memory-mcp: el motor de grafos de código que jubila el grep en tu agente"
description: "Los agentes de código fallan porque no entienden la estructura real del proyecto — se pierden haciendo grep, abriendo archivos y adivinando. Un binario de 254 MB escrito en C puro indexa cualquier codebase en segundos, construye un grafo de conocimiento y deja a tu agente consultar la arquitectura real en milisegundos. Adiós al grep a ciegas."
fecha: 2026-06-17
tags: ["herramientas", "agentes", "mcp", "arquitectura", "grafos", "productividad"]
autor: "Alejandro de la Fuente"
---

Pídele a tu agente de código que encuentre "dónde se procesa el pago" en un codebase de 200.000 líneas. Lo vas a ver lanzar cinco `grep`, abrir doce archivos, leer imports, seguir call chains una a una, y gastar 400.000 tokens de contexto. Y aun así, se va a dejar una rama entera de la lógica sin mirar.

El problema no es el modelo. El problema es que el agente está ciego.

Explora el código como explorarías un bosque de noche con una linterna de bolsillo: ves lo que iluminas en ese momento, pero no tienes ni idea de dónde está el resto de los árboles, los caminos que los conectan, ni si hay un lago a 50 metros a tu izquierda.

**Codebase-memory-mcp** cambia la linterna por un mapa topográfico. Indexa tu codebase entero en un grafo de conocimiento —clases, funciones, call chains, HTTP routes, imports— y expone 14 herramientas MCP para que tu agente consulte la arquitectura real en milisegundos. Un solo binario de 254 MB. Cero dependencias. Cero APIs externas. Y corre en local.

---

## El problema real: grpear un bosque

Cuando trabajas con un agente de código en un proyecto nuevo, el ritual es siempre el mismo:

```bash
grep -r "processPayment" src/          # 47 resultados
grep -r "PaymentProcessor" src/        # 12 resultados
read src/payments/processor.ts         # 230 líneas, 7 imports
read src/payments/gateway.ts           # 180 líneas, 4 imports
grep -r "StripeClient" src/            # 3 resultados
read src/integrations/stripe.ts        # otras 200 líneas
```

Y así, vuelta tras vuelta, el agente va reconstruyendo la arquitectura del proyecto a base de abrir archivos y seguir pistas. Cada `read` son tokens de contexto. Cada `grep` es ruido. Y cada decisión que toma está basada en una visión parcial del código.

En un experimento documentado por el equipo de DeusData, cinco consultas estructurales consumieron **412.000 tokens** usando exploración archivo por archivo. Las mismas cinco consultas contra el grafo de conocimiento de codebase-memory-mcp: **3.400 tokens**. Una reducción del **99,2%**.

Esto no es solo eficiencia: es la diferencia entre que el agente entienda tu proyecto o improvise sobre lo que ve.

---

## ¿Qué hace realmente?

Codebase-memory-mcp es un **motor de indexación** que parsea tu código con tree-sitter (158 lenguajes vendidos dentro del binario), aplica resolución de tipos con un LSP híbrido implementado en C para 9 lenguajes (Python, TypeScript, Java, Go, Rust, C, C++, C#, PHP, Kotlin), y construye un grafo de conocimiento SQLite con nodos (clases, funciones, rutas HTTP, módulos) y aristas (CALLS, IMPORTS, HTTP_CALLS, DATA_FLOWS, INHERITS, y una docena más de tipos de relación).

La magia está en la velocidad:

| Operación | Tiempo |
|---|---|
| Indexar Django completo | **~6 segundos** |
| Indexar kernel Linux (28M LOC, 75K archivos) | **3 minutos** |
| Consulta Cypher | **<1 ms** |
| Trazado de call path (profundidad 5) | **<10 ms** |

El pipeline es RAM-first: comprime con LZ4, usa SQLite en memoria, y vuelca a disco al final. Después de indexar, la memoria se libera. No necesitas 64 GB de RAM para indexar el kernel de Linux.

---

## Catorce herramientas que tu agente entiende

El servidor MCP expone catorce herramientas. No voy a enumerarlas todas —bastan las que cambian el flujo de trabajo real:

**`search_graph`** — donde antes harías `grep`, tu agente hace una consulta BM25 + búsqueda vectorial con embeddings de Nomic embebidos en el binario. Buscas "procesar pago" y encuentra `handleStripeWebhook` aunque no comparta ni una palabra. Sin API keys, sin Ollama, sin Docker.

**`trace_path`** — "dame todos los callers de `processRefund` hasta profundidad 3". En lugar de seguir la cadena archivo por archivo, el agente recibe el grafo de llamadas resuelto en <10 ms, con clasificación de riesgo por hop distance.

**`get_architecture`** — vista de alto nivel con detección de módulos reales vía Leiden community detection. Tu agente ve los seams arquitectónicos reales, no la estructura de carpetas.

**`detect_changes`** — diff de git no commiteado → símbolos afectados → clasificación de riesgo (CRITICAL/HIGH/MEDIUM/LOW). El agente sabe el blast radius antes de tocar nada.

**`query_graph`** — Cypher sobre el grafo. Consultas como "encuéntrame todas las funciones con complejidad ciclomática > 15 que además tengan un linear scan dentro de un bucle" (es decir, O(n²) escondido).

**`search_code`** — grep aumentado con ranking estructural. Deduplica resultados por función contenedora, prioriza definiciones sobre tests, y te devuelve lo relevante en lugar de 200 líneas de ruido.

---

## Lo que lo diferencia de verdad

He probado GitNexus (42K ⭐, TypeScript, 10 meses de vida) y Graphify (Python, CLI). La comparativa da para otro artículo entero, pero la diferencia fundamental de codebase-memory-mcp está en tres decisiones de ingeniería:

**1. C puro, binario único, cero dependencias.** Descargas un archivo, lo ejecutas, y funciona. No necesitas Node, Python, Docker, ni compilar tree-sitter. Todo —incluyendo SQLite, los 158 parsers de tree-sitter, los embeddings de Nomic y el motor de regex— está compilado dentro.

**2. Hybrid LSP en C, no wrappers.** En lugar de lanzar servidores LSP externos (que requieren tener el toolchain de cada lenguaje instalado), implementa los algoritmos de resolución de tipos en C puro. Esto significa que puede resolver tipos de Java sin tener JDK, tipos de Rust sin tener rust-analyzer, y tipos de TypeScript sin tener tsserver. Es la pieza técnicamente más impresionante del proyecto.

**3. Team artifact sharing.** El grafo se comprime con zstd y se commitea como `.codebase-memory/graph.db.zst`. Tu compañero hace clone del repo, y en lugar de reindexar desde cero, importa el artifact y solo indexa el diff incremental. La primera vez que vi esto pensé en `graphify-out/` pero resuelto con un solo archivo comprimido y zero merge friction.

---

## Lo que no es

Codebase-memory-mcp no es una herramienta de búsqueda de código para humanos. Es un backend para agentes. No tiene un LLM integrado —y eso es una decisión deliberada—: el agente que ya estás usando es el traductor de lenguaje natural a consultas de grafo. Tú le dices "¿qué rompo si cambio esta función?" y él llama a `trace_path`.

Tampoco es una alternativa a GitNexus si lo que buscas es una Web UI interactiva para explorar grafos visualmente en el navegador (aunque tiene una UI 3D opcional en `localhost:9749`). Y no es Graphify: no genera un `graph.json` portable ni un informe en markdown.

Es, simplemente, la pieza que faltaba para que tu agente de código deje de comportarse como un becario en su primer día y empiece a entender el proyecto de verdad.

---

## Cómo probarlo

```bash
# Instalar (macOS / Linux)
curl -fsSL https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/install.sh | bash

# O descargar el binario directamente desde Releases
# https://github.com/DeusData/codebase-memory-mcp/releases

# Indexar tu proyecto
codebase-memory-mcp cli index_repository '{"repo_path":".","mode":"full"}'

# Tu agente ya lo ve. Dile:
# "Indexa este proyecto" o "¿Qué llama a processPayment?"
```

El `install` auto-detecta Claude Code, Codex, Gemini CLI, OpenCode, Aider, KiloCode y varios más, y configura los MCP entries, skills y hooks automáticamente.

Si tu agente falla porque no entiende el proyecto, dale un mapa. Un binario de 254 MB que convierte 400.000 tokens de grep a ciegas en 3.400 tokens de consultas estructurales. Y corre en local, sin depender de nadie.
