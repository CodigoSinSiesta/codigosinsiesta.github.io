---
title: "Seis meses construyendo en público: inventario honesto de lo que hemos hecho"
description: "Seis meses construyendo en público: inventario honesto de lo que hemos hecho Llevamos sin escribir en el blog desde febrero. No es que no hayamos producido nada — al contrario. Hemos estado con la cab"
fecha: 2026-05-09
tags: ["ia", "agentes", "harness", "orquestación", "graphify", "spec-driven-development"]
autor: "Alejandro de la Fuente"
---

# Seis meses construyendo en público: inventario honesto de lo que hemos hecho

Llevamos sin escribir en el blog desde febrero. No es que no hayamos producido nada — al contrario. Hemos estado con la cabeza metida en presentaciones, talleres y herramientas mientras el blog esperaba.

Toca hacer inventario. No para celebrarlo, sino para que sepas qué existe, qué aprendimos haciéndolo, y qué viene ahora.


## Lo que hemos publicado

### Presentaciones interactivas

Todo lo que listamos abajo son **presentaciones web** — no slides de PowerPoint. Cada una es un repo independiente con Astro 5 + Svelte 5, navegación por teclado, animaciones GSAP y notas de ponente completas. Puedes abrirlas en el móvil.

**[Vibe Coding vs Software Engineering](https://codigosinsiesta.github.io/ai-presentation/)** *(diciembre 2025)*
El punto de partida: 21 slides sobre por qué el 85% de los equipos usa IA pero solo el 32% confía en la calidad que produce. Introduce el **Framework 4R** (Risk, Readability, Reliability, Resilience) como respuesta. Con Jose David.

**[Coding Agents](https://codigosinsiesta.github.io/coding-agents-presentation/)** *(diciembre 2025)*
11 slides sobre agentes como compañeros de programación: qué son de verdad, cómo evitar alucinaciones y cómo gestionar el contexto cuando el agente lleva horas de sesión.

**[MCP Servers](https://codigosinsiesta.github.io/mcp-servers-presentation/)** *(enero 2026)*
Model Context Protocol en 10 slides: primitivas, diferencia entre FastMCP y SDK, casos de uso reales y cuándo un MCP server merece la pena frente a una tool directa.

**[Spec-Driven Development](https://codigosinsiesta.github.io/spec-driven-development-presentation/)** *(febrero 2026)*
9 slides sobre escribir specs antes del código. No es TDD ni BDD — es el puente entre los dos. Incluye una matriz comparativa de las 5 herramientas del ecosistema SDD con nuestra recomendación por defecto.

**[Subagentes y Skills](https://codigosinsiesta.github.io/subagents-skills-presentation/)** *(febrero 2026)*
16 slides sobre cómo dividir un agente monolítico en agentes especializados. Qué son las skills, cómo se componen con subagentes y los errores más comunes al orquestar sistemas multi-agente.

**[Harness Engineering](https://codigosinsiesta.github.io/harness-engineering-presentation/)** *(abril 2026)*
16 slides sobre por qué el **harness ahora pesa más que el modelo**. Mismo modelo, mismo benchmark, 6× de diferencia en rendimiento. ¿De dónde viene esa diferencia? De lo que rodea al LLM, no del LLM en sí. Basado en dos papers de 2026 (NLAH de Tsinghua y Meta-Harness de Stanford).

**[Patrones de Orquestación](https://codigosinsiesta.github.io/orquestacion-patrones-presentation/)** *(mayo 2026)*
El más reciente: 22 slides en 3 módulos independientes. Una taxonomía evolutiva de 10 niveles de complejidad, 6 dolores reales con el patrón que los resuelve, y la convergencia de 4 fuentes independientes (Anthropic, OpenAI, Factory, academia) en los mismos principios de arquitectura.

### Talleres hands-on

**[Taller: IA, Agentes y MCP](https://github.com/CodigoSinSiesta/taller-ia-agentes-mcp)** *(enero 2026)*
90 minutos donde los asistentes construyen 2 agentes y 2 MCP servers en TypeScript. Sin teoría — código desde el minuto 1.

**[Taller: LLM Wiki](https://github.com/CodigoSinSiesta/taller-llm-wiki)** *(febrero 2026)*
Montar un wiki personal mantenido por Claude Code. Frontmatter, Dataview, obsidian-git y el ciclo completo de captura → clasificación → recuperación. Basado en el workflow que usamos internamente.

**[Taller: Graphify](https://github.com/CodigoSinSiesta/taller-graphify)** *(abril 2026)*
El más técnico de los tres: indexar un repositorio o un corpus heterogéneo con Graphify, leer el grafo resultante e integrarlo como skill en tu agente. Incluye un cuadrante de decisión honesto — cuándo Graphify compensa y cuándo no.

### Infraestructura

**[@codigosinsiesta/theme](https://github.com/CodigoSinSiesta/theme)** *(abril 2026)*
Un sistema de diseño compartido que ahora alimenta todos los decks: CSS tokens, preset de Tailwind, componentes Svelte (Hero, TOC, Terminal, Resources…). Lo que antes era copiar-pegar entre repos es ahora un `npm install`.

---

## Lo que aprendimos haciéndolo

### El sistema de diseño fue la mejor inversión

Empezamos copiando el mismo boilerplate entre presentaciones. Cuando llevábamos 4 decks, cualquier cambio visual había que aplicarlo en 4 sitios. El tema compartido lo resolvió en una tarde. Si haces contenido técnico en serie, **la coherencia visual no es estética — es velocidad de producción**.

### Graphify sobre wikis curados no compensa

Lo documentamos en el taller y lo decimos aquí también: probamos Graphify sobre este mismo wiki y el resultado fue decepcionante. Para un corpus curado con MOCs manuales y wikilinks bien mantenidos, el coste en tokens de extracción semántica (~$0.50 por re-pase) no justifica el ahorro en contexto. El grafo no aporta nada que `rg` + un MOC bien escrito no haga gratis.

El sweet spot de Graphify es otro: corpus heterogéneo y volátil donde el material mezcla código, documentos y papers que ninguna herramienta AST puede indexar sola.

### SDD como prerequisito para trabajar con agentes en equipo

En solitario puedes salirte con la tuya sin specs. Con dos personas y un agente en el loop, sin specs escritas el agente y los humanos trabajan con modelos mentales distintos del mismo requisito. Las specs no son burocracia — son el contrato que hace que el agente ejecute lo que tú tienes en la cabeza, no lo que él infiere.

---

## Lo que viene

Volvemos al blog. Los temas de las presentaciones son demasiado densos para quedarse solo en slides — merecen artículos donde haya espacio para el matiz. En las próximas semanas: un artículo sobre el gap del 6× en harness engineering, y una serie sobre los patrones de orquestación con el detalle que no cabe en 22 slides.

---

## Por dónde empezar según tu perfil

Si acabas de llegar a Código Sin Siesta y no sabes por dónde entrar:

| Perfil | Empieza aquí |
|---|---|
| Desarrollador usando IA por primera vez | [Vibe Coding vs Software Engineering](https://codigosinsiesta.github.io/ai-presentation/) |
| Dev construyendo su primer agente | [Coding Agents](https://codigosinsiesta.github.io/coding-agents-presentation/) |
| Dev queriendo conectar herramientas externas | [MCP Servers](https://codigosinsiesta.github.io/mcp-servers-presentation/) |
| Tech lead con equipo usando IA | [Spec-Driven Development](https://codigosinsiesta.github.io/spec-driven-development-presentation/) |
| Arquitecto diseñando sistemas multi-agente | [Subagentes y Skills](https://codigosinsiesta.github.io/subagents-skills-presentation/) + [Patrones de Orquestación](https://codigosinsiesta.github.io/orquestacion-patrones-presentation/) + [Harness Engineering](https://codigosinsiesta.github.io/harness-engineering-presentation/) |

Todo el código está en [github.com/CodigoSinSiesta](https://github.com/CodigoSinSiesta). Licencia MIT.
