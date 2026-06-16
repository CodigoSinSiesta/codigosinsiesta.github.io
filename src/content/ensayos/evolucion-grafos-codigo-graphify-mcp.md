---
title: "De Graphify a codebase-memory-mcp: la evolución de los grafos de código para agentes"
description: "En 18 meses hemos pasado de generar grafos de código como artefactos JSON estáticos a motores MCP nativos que los agentes consultan en tiempo real. Esta es la historia de tres herramientas —Graphify, GitNexus y codebase-memory-mcp— y del patrón que revelan sobre hacia dónde va la ingeniería agentic."
fecha: 2026-06-17
tags: ["herramientas", "agentes", "mcp", "arquitectura", "grafos", "evolucion"]
autor: "Alejandro de la Fuente"
---

Hay un patrón silencioso en las herramientas para agentes de código que merece ser contado. En menos de dos años hemos pasado de generar grafos de código como artefactos JSON estáticos —bonitos de mirar, incómodos de consultar— a motores de grafos que viven dentro del agente como un órgano más, respondiendo consultas estructurales en milisegundos a través de MCP.

No es una mejora incremental. Es un salto de paradigma. Y entenderlo ayuda a ver hacia dónde va todo esto.

---

## Fase 1: El grafo como artefacto

Hace un año y medio, la idea de generar un grafo de conocimiento de tu codebase era casi exótica. **Graphify** —una herramienta Python que uso a diario— representó ese primer paso: analizas un repositorio, extrae nodos (archivos, funciones, clases) y aristas (imports, llamadas), aplica clustering de Leiden/Louvain para detectar comunidades, y genera tres artefactos:

```
graphify-out/
├── graph.json          ← el grafo completo
├── GRAPH_REPORT.md     ← informe legible
└── graph.html          ← visualización interactiva
```

Es brillante en su simplicidad. Commiteas `graphify-out/` al repo y cualquiera que lo clone tiene un mapa del proyecto. El `graph.html` te deja explorar las comunidades visualmente. Incluso puedes lanzar `graphify query "¿cómo se conecta el módulo de auth con el de pagos?"` y hace un BFS sobre el grafo.

Pero aquí está la fricción: el grafo es una **foto fija**. Si modificas el código, tienes que regenerarlo. Si quieres hacer una consulta compleja —"dame todas las funciones con más de 5 callers y que además estén en un módulo con baja cohesión"— no hay un lenguaje de consulta; tienes que escribirPython contra el JSON. Y si tu agente quiere usar el grafo, o le pasas el JSON entero al contexto (explosión de tokens) o escribes un tool custom que lo consulte.

El grafo existía, pero no estaba *vivo*.

---

## Fase 2: El grafo como servicio MCP

**GitNexus** (agosto 2025) marcó el primer salto. En lugar de generar un artefacto, corre como un **servidor MCP**: el agente le habla directamente, y GitNexus responde con resultados estructurados. No hay JSON que cargar en contexto, no hay que regenerar manualmente.

Técnicamente, GitNexus es TypeScript, usa tree-sitter para parsear, y almacena el grafo en LadybugDB. Expone 16 herramientas MCP: `query`, `context`, `impact`, `detect_changes`, `cypher`, y grupos multi-repo con `group_sync` para emparejar contratos entre servicios.

Pero el verdadero avance no es técnico: es de **flujo de trabajo**. Con Graphify, el grafo es un deliverable que produces conscientemente. Con GitNexus, el grafo es un servicio siempre disponible. Le dices a tu agente "¿qué impacto tiene cambiar esta función?" y él consulta el grafo sin que tú tengas que acordarte de regenerarlo.

GitNexus también trajo dos ideas nuevas:

- **Web UI pública** (gitnexus.vercel.app): sueltas una URL de GitHub, ves el grafo en 3D en el navegador, y chateas con un Graph RAG Agent. Perfecto para explorar un repo desconocido en 30 segundos sin clonar nada.
- **Code Wiki automática**: generas documentación desde el grafo de conocimiento. La arquitectura se documenta sola.

Con 42.000 estrellas en GitHub, GitNexus validó que el mercado quería esto. Pero tiene un asterisco: su licencia es PolyForm Noncommercial. Puedes usarlo para aprender y experimentar, pero no en contexto comercial sin licencia de pago.

---

## Fase 3: El grafo como binario nativo

**Codebase-memory-mcp** (febrero 2026) representa el tercer salto, y el más ambicioso desde el punto de vista de la ingeniería. Es un solo binario de 254 MB escrito en **C puro**. Cero dependencias. Cero APIs externas. Descargas, ejecutas, y tu agente tiene un motor de grafos funcionando en local.

La velocidad es absurda: indexa el kernel de Linux (28 millones de líneas, 75.000 archivos) en 3 minutos. Django en 6 segundos. Las consultas Cypher responden en menos de 1 milisegundo.

Pero lo que realmente marca la diferencia generacional son tres decisiones técnicas:

**1. Hybrid LSP en C.** En lugar de lanzar servidores LSP externos (que requieren el toolchain de cada lenguaje), implementa algoritmos de resolución de tipos directamente en C. Resuelve tipos de Java sin JDK, de Rust sin rust-analyzer, de TypeScript sin tsserver. Esto significa que puedes indexar un proyecto polyglot en una máquina limpia.

**2. Embeddings embebidos.** Los embeddings de Nomic (40K tokens de código, 768 dimensiones) están compilados dentro del binario. Búsqueda semántica sin Ollama, sin API keys, sin Docker. Buscas "procesar pago" y encuentra `handleStripeWebhook` aunque no compartan vocabulario.

**3. Team artifact sharing.** El grafo SQLite se comprime con zstd y se commitea como `.codebase-memory/graph.db.zst`. Tu compañero importa el artifact y solo indexa el diff incremental. Es el espíritu de `graphify-out/` pero resuelto con un solo archivo comprimido y zero merge friction.

El README de codebase-memory-mcp lo dice explícitamente: *"The result is similar in spirit to graphify's graphify-out/ directory, but as a single compressed file with explicit two-tier export, integrity-checked import, and zero merge friction."* Ver esa línea fue un momentode reconocimiento: la evolución es real y los propios autores la ven.

---

## El patrón que emerge

Si miras las tres herramientas en secuencia, ves un patrón claro:

| | Graphify | GitNexus | codebase-memory-mcp |
|---|---|---|---|
| **Paradigma** | Artefacto estático | Servidor MCP | Binario nativo |
| **Interfaz** | CLI (graph.json) | MCP + Web UI | MCP + CLI |
| **Lenguaje** | Python | TypeScript | C puro |
| **Dependencias** | venv + tree-sitter | Node + npm | **Ninguna** (binario único) |
| **Consultas** | BFS/DFS sobre JSON | BM25 + Cypher | BM25 + Cypher + vectorial |
| **Vive en** | `graphify-out/` | `.gitnexus/` | `~/.cache/codebase-memory-mcp/` |
| **Actualización** | Manual (`graphify update`) | Re-index manual o auto-sync | Watcher + auto-sync |
| **Team sharing** | Carpeta commiteable | Índices locales (gitignored) | Archivo `.zst` commiteable |
| **Licencia** | — | PolyForm NC ❌ | MIT ✅ |

La flecha apunta en una dirección clara: **de la herramienta que produces artefactos a la herramienta que produce respuestas**. Del `graph.json` que miras tú al grafo que consulta tu agente.

No es que Graphify esté obsoleto —sigue siendo la opción más ligera si solo quieres un `graph.html` rápido sin montar un servidor—. Es que el problema ha cambiado. Antes el grafo era para que un humano entendiera la arquitectura. Ahora es para que un agente tome decisiones informadas en tiempo real.

---

## Lo siguiente

Hay dos vectores de evolución que me parecen inevitables:

**1. El grafo cross-repo.** Tanto GitNexus (con `group_sync`) como codebase-memory-mcp (con `CROSS_*` edges) ya permiten enlazar grafos de varios repositorios. Imagina tener un grafo unificado de tus 12 microservicios, con las rutas HTTP emparejadas automáticamente entre servicios. El agente podría responder "si cambio este endpoint del servicio A, ¿qué servicios se rompen?" consultando un solo grafo.

**2. Runtime traces + grafo estático.** Codebase-memory-mcp ya acepta ingesta de runtime traces (`ingest_traces`). Combinas el grafo estático (lo que el código *dice* que hace) con trazas de ejecución real (lo que el código *hace* de verdad) y tienes una herramienta de debugging que entiende tanto la arquitectura como el comportamiento.

---

## La lección

Cada salto en esta evolución reduce la distancia entre la pregunta y la respuesta. Con Graphify, generas el grafo, lo lees, y decides. Con GitNexus, le preguntas al grafo a través de MCP. Con codebase-memory-mcp, el grafo es tan barato de construir y consultar que se convierte en una capa transparente: tu agente lo usa sin que tengas que pedírselo.

El patrón no es exclusivo de los grafos de código. Lo estás viendo en search (de `grep` a `mgrep` a búsqueda vectorial MCP), en documentación (de `README.md` a `AGENTS.md` a `llms.txt`), y en contexto de agente (de system prompts manuales a skills dinámicas).

La dirección es siempre la misma: **de lo estático a lo vivo, de lo humano a lo agente, de lo que produces a lo que consumes.** Y en el caso de los grafos de código, el destino final es un motor que indexa, consulta y razona sobre la arquitectura de tu proyecto más rápido de lo que tú tardas en abrir el primer archivo.
