---
title: "Turso: la base de datos que tus agentes de código deberían usar"
description: "20K estrellas, SQLite-compatible, escrita en Rust, con MCP server nativo. Turso resuelve el problema más ignorado de los agentes de código: dónde guardar estado de forma fiable, portable y consultable por el propio agente."
fecha: 2026-06-20
tags: ["herramientas", "agentes", "mcp", "base-de-datos", "rust", "arquitectura"]
autor: "Alejandro de la Fuente"
---

Cada agente de código tiene un problema de estado. Lo notes o no.

Cuando le pides a un agente que "recuerde los tests que fallaron la semana pasada", o "dame todos los usuarios que creé en este proyecto", o "¿qué esquema tiene la tabla de permisos?", el agente hace una de tres cosas:

1. **Lo guarda en el chat** — y lo pierde cuando el contexto se compacta.
2. **Lo guarda en un archivo JSON** — y reza para que no se corrompa con escrituras concurrentes.
3. **No lo guarda** — y tú repites la misma pregunta tres sesiones después.

Ninguna de las tres es aceptable para un agente que pretendes usar en serio. Y sin embargo, es el estado del arte en 2026.

[Turso](https://github.com/tursodatabase/turso) propone una cuarta opción: **una base de datos SQL in-process, compatible con SQLite, con un servidor MCP nativo**. El agente no escribe archivos. Le habla a la base de datos como si fuera una herramienta más.

---

## Qué es Turso

Turso es un rewrite de SQLite en Rust. No es un fork — es una reimplementación desde cero, con el mismo formato de archivo, el mismo dialecto SQL y la misma API en C. Pero con cosas que SQLite no tiene: I/O asíncrono con `io_uring`, MVCC para escritura concurrente (`BEGIN CONCURRENT`), vectores, FTS con Tantivy, CDC (change data capture), y bindings para 7 lenguajes.

¿Por qué reescribir SQLite en Rust? La respuesta corta: porque SQLite es la base de datos más desplegada del planeta, pero su modelo de concurrencia —un solo escritor, múltiples lectores— limita lo que puedes hacer con agentes que escriben en paralelo. Turso añade MVCC sin sacrificar compatibilidad.

Pero lo que me interesa aquí no es el motor de base de datos. Es el **servidor MCP**.

---

## El MCP server: tu base de datos como herramienta del agente

Turso incluye un servidor [Model Context Protocol](https://modelcontextprotocol.io/) en su CLI. Lo ejecutas así:

```bash
tursodb mi-base.db --mcp
```

Y tu agente —Claude Code, Claude Desktop, Cursor, cualquier cliente MCP— gana 9 herramientas nuevas:

| Herramienta | Qué hace |
|---|---|
| `open_database` | Abre una base de datos nueva |
| `current_database` | Describe la base de datos actual |
| `list_tables` | Lista todas las tablas |
| `describe_table` | Describe la estructura de una tabla |
| `execute_query` | Ejecuta SELECTs de solo lectura |
| `insert_data` | Inserta datos |
| `update_data` | Actualiza datos |
| `delete_data` | Borra datos |
| `schema_change` | Modifica el esquema (CREATE/ALTER/DROP TABLE) |

Esto significa que tu agente puede, sin salir de su flujo normal:

```text
Tú: "Guarda en la base de datos todos los tests que han fallado hoy,
     con el nombre del archivo, el error y la fecha"

Agente: [llama a insert_data 12 veces]
        "He guardado 12 fallos en la tabla test_failures.
         ¿Quieres que los agrupe por tipo de error?"

Tú: "Sí, y dime cuál es el error más frecuente"

Agente: [llama a execute_query con GROUP BY]
        "El error más frecuente es 'timeout' con 5 ocurrencias,
         seguido de 'assertion error' con 4."
```

No es magia. Es una base de datos con una interfaz que el agente entiende.

---

## Configuración en 30 segundos

Añadir Turso como MCP server en Claude Code es un comando:

```bash
claude mcp add mi-proyecto -- tursodb ./data/app.db --mcp
```

En Claude Desktop, añades esto a tu configuración:

```json
{
  "mcpServers": {
    "turso": {
      "command": "/path/to/tursodb",
      "args": ["./data/app.db", "--mcp"]
    }
  }
}
```

Y en Cursor, lo añades desde la UI de extensiones MCP.

El punto importante: **no necesitas un servidor aparte**. Turso es in-process. El binario `tursodb` es la base de datos y el servidor MCP a la vez. No hay Redis. No hay PostgreSQL. No hay Docker. Un binario de Rust que pesa unos pocos megas.

---

## Por qué esto importa para agentes de código

Los agentes de código necesitan tres cosas de su almacenamiento:

1. **Persistencia fiable**: los datos sobreviven a reinicios, compactaciones de contexto y cambios de sesión. SQLite (y Turso) usan un solo archivo. Haces backup copiando un archivo. No necesitas un clúster.

2. **Consultable por el agente**: el agente no puede hacer `grep` sobre un JSON de 50 MB cada vez que necesita un dato. Con SQL, haces `SELECT * FROM test_failures WHERE date > '2026-06-01'` y obtienes exactamente lo que necesitas.

3. **Escribible sin corrupción**: si dos slices de tu orquestador intentan escribir a la vez, necesitas que la base de datos lo maneje. Turso añade `BEGIN CONCURRENT` con MVCC para exactamente este caso.

El patrón es claro: **una base de datos SQL por proyecto, expuesta como herramienta MCP, usada por el agente como memoria estructurada**.

No es un reemplazo del chat. Es un complemento. El chat es para el contexto inmediato. La base de datos es para lo que necesitas recordar entre sesiones, entre slices, entre semanas.

---

## Lo que NO es Turso (y por qué no pasa nada)

Turso **no es** una alternativa a PostgreSQL o MySQL para tu backend de producción. Es una base de datos in-process, como SQLite. Si necesitas réplicas, sharding, o cientos de conexiones concurrentes, necesitas otra cosa.

Turso **no es** una base de datos vectorial especializada. Tiene soporte para vectores (exact search) y planea añadir índices vectoriales (approximate search), pero si tu caso de uso es RAG con millones de embeddings, necesitas Pinecone, Qdrant o Milvus.

Turso **está en beta**. El propio README lo advierte: "This software is in BETA. It may still contain bugs and unexpected behavior." Para una demo de agente, va sobrado. Para datos de misión crítica, haz backups.

---

## El ecosistema: no es solo la DB

Turso no es solo el motor. Es un ecosistema:

- **Bindings para 7 lenguajes**: Python (`pyturso`), JavaScript (`@tursodatabase/database`), Java (JDBC), Go, .NET, Rust, y WebAssembly. Si tu agente está en Python pero tu app está en TypeScript, ambos pueden leer la misma base de datos.
- **Turso Cloud**: el mismo equipo ofrece una versión cloud con replicación, branching y sync. No es open source, pero el formato de archivo es compatible.
- **Extensions**: crypto, regexp, CSV, fuzzy search, direcciones IP, percentiles. Todo lo que esperas de SQLite, pero en Rust.
- **Deterministic Simulation Testing**: el equipo usa Antithesis para probar concurrencia. No es un proyecto de fin de semana.

20.000 estrellas en GitHub, 1.000 forks, commits diarios, releases frecuentes. MIT license. No es un proyecto que vaya a desaparecer.

---

## El ángulo para Código Sin Siesta

Cada vez que evalúo una herramienta para desarrollo agentico, me hago la misma pregunta: **¿resuelve un problema real de workflow o solo añade complejidad?**

Turso con MCP resuelve un problema real: **dónde guardan estado los agentes**. No es un "framework de agentes". No es un "orquestador". Es una base de datos. Pero es exactamente la pieza que falta en la mayoría de los setups de coding agents que veo.

El patrón que propongo:

```text
Agente de código → MCP → Turso (SQL in-process)
                         ↓
                    Archivo .db en el repo
                    (se versiona o se ignora según el caso)
```

Para un agente local que está iterando sobre un proyecto, tener una base de datos SQL a la que pueda consultar con lenguaje natural —"¿qué tests fallaron ayer?"— cambia la experiencia de "asistente que olvida" a "compañero que recuerda".

Y lo mejor: no necesitas configurar nada. Un binario, un flag `--mcp`, y tu agente ya sabe hablar SQL.
