---
title: "CC Switch: aislando entornos de desarrollo con IA sin volverte loco"
description: "Gestionar proveedores, skills, MCPs y prompts para siete herramientas de coding con IA es un caos. CC Switch centraliza todo en una app de escritorio y te permite cambiar de entorno con un clic. Aquí te cuento cómo usarlo para aislar trabajo de cliente, side project y laboratorio."
fecha: 2026-06-16
tags: ["herramientas", "agentes", "productividad", "arquitectura", "entornos", "mcp"]
autor: "Alejandro de la Fuente"
---

El problema no es tener varias herramientas de coding con IA. El problema es que cada una guarda su configuración en un sitio distinto, con formatos distintos, y sincronizarlas entre entornos —cliente, side project, laboratorio— es una pesadilla manual.

Un día trabajas para el cliente enterprise con su proveedor corporativo, sus MCP servers aprobados y sus skills controladas. Al día siguiente te pones con tu proyecto open source, donde usas otro proveedor, otras skills y ninguna restricción. Y el fin de semana trasteas con el último modelo en tu laboratorio personal.

Si editas configs a mano cada vez, acabas con archivos huérfanos, tokens duplicados y la sensación de que tu entorno de desarrollo es un castillo de naipes.

**CC Switch** es una app de escritorio —gratuita, open source— que centraliza la configuración de Claude Code, Claude Desktop, Codex, Gemini CLI, OpenCode, OpenClaw y Hermes Agent. Y lo mejor: te permite cambiar de entorno con un clic.

No es un agente. No es un CLI. Es una capa de gestión que resuelve el problema más aburrido —y más ignorado— del desarrollo con IA: **la configuración**.

---

## El problema real: entornos mezclados

Imagina este escenario realista:

- **Trabajo (cliente enterprise):** usas Claude Code con el proveedor corporativo de tu empresa, tres MCP servers internos, y un conjunto de skills validadas por el equipo de seguridad.
- **Side project open source:** usas Codex con OpenAI directo, MCP servers públicos, y skills experimentales que no pasarían una auditoría.
- **Laboratorio personal:** pruebas OpenCode con DeepSeek, montas tus propios MCP servers, y escribes skills que todavía no sabes si funcionan.

Sin una herramienta de gestión, cada cambio de entorno implica:

1. Editar `~/.claude/settings.json` o `mcp.json` a mano.
2. Tocar `~/.codex/config.toml`.
3. Modificar variables de entorno (o peor, un `.env` compartido).
4. Rezar para no haber mezclado tokens de cliente con los de tu side project.
5. Repetir cuando vuelvas al entorno anterior.

El resultado: fricción, errores, y la tentación de usar el mismo proveedor para todo —lo cual es justo lo que **no** quieres hacer.

---

## Qué hace CC Switch exactamente

CC Switch es una app Tauri 2 (Rust en el backend, React en el frontend) que centraliza siete cosas:

| Funcionalidad | Qué gestiona |
|---|---|
| **Providers** | 50+ presets de proveedores (Anthropic, OpenAI, DeepSeek, AWS Bedrock, relays comunitarios...). Un clic para cambiar. |
| **MCP servers** | Panel unificado para gestionar servidores MCP con sync bidireccional entre Claude, Codex, Gemini, OpenCode y Hermes. |
| **Skills** | Instalación one-click desde GitHub o ZIP, gestión de repos custom, symlinks. |
| **Prompts** | Editor Markdown con cross-app sync para `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`. |
| **Proxy local** | Hot-switching, auto-failover, circuit breaker y health monitoring de proveedores. |
| **Uso y costes** | Dashboard con tracking de requests, tokens, coste por modelo y tendencias. |
| **Sesiones** | Historial de conversaciones navegable y recuperable. |

La killer feature no es ninguna de estas por separado. Es que **puedes cambiar de entorno de desarrollo completo con un clic** desde la bandeja del sistema.

---

## Receta: tres entornos aislados con CC Switch

Vamos a lo práctico. Así es como monto tres entornos distintos con CC Switch:

### Entorno 1: Cliente Enterprise

```yaml
Herramienta:     Claude Code
Proveedor:       Provider corporativo (AWS Bedrock)
Modelo:          Claude Sonnet 4
MCP servers:     Solo los aprobados (Jira interno, GitLab corp, DB read-only)
Skills:          Mínimas, validadas por seguridad
Restricciones:   Sin modelos externos, sin relays comunitarios
Proxy:           Routing a través del gateway corporativo
```

Este entorno lo configuro una vez en CC Switch y lo activo cuando empiezo la jornada laboral. El agente solo ve lo que debe ver. Si alguien de compliance pregunta qué herramientas uso, tengo la configuración documentada y aislada.

### Entorno 2: Side Project Open Source

```yaml
Herramienta:     Codex o OpenCode
Proveedor:       OpenAI directo o DeepSeek
Modelo:          GPT-5 o DeepSeek V3
MCP servers:     GitHub, Exa search, Jina Reader
Skills:          TDD, Ponytail, Simplify Code
Restricciones:   Ninguna. Velocidad > control.
Prompt global:   AGENTS.md del repo
```

Cambio a este entorno al terminar el trabajo. El agente tiene libertad total para experimentar. Si meto la pata con un MCP server mal configurado, no afecta al entorno de cliente.

### Entorno 3: Laboratorio Personal

```yaml
Herramienta:     La que toque probar (hoy OpenCode, mañana Hermes)
Proveedor:       El más barato o el más nuevo
Modelo:          El último que ha salido
MCP servers:     Los que estoy montando (probablemente rotos)
Skills:          Experimentales, en desarrollo
Restricciones:   Ninguna. Esto es un parque de atracciones.
```

Este es el entorno donde pruebas cosas sin miedo. Si rompes algo, no pasa nada. Cuando encuentras algo que funciona, lo promocionas al entorno de side project. Cuando está maduro, al de cliente.

---

## Cómo cambiar de entorno en 3 segundos

CC Switch vive en la bandeja del sistema. El flujo es:

1. Clic derecho en el icono de la bandeja.
2. Seleccionas el perfil de proveedor/entorno que quieres.
3. Para la mayoría de herramientas: reinicias la terminal.
4. A programar.

La excepción es **Claude Code**, que soporta hot-switching sin reiniciar. Para el resto (Codex, OpenCode, Gemini CLI, Hermes), necesitas reiniciar la sesión del CLI. No es ideal, pero es mucho mejor que editar archivos de configuración a mano.

---

## Lo que CC Switch no te cuenta

Toda herramienta tiene sus sombras. CC Switch no es una excepción:

**El modelo de negocio son los sponsors.** El README del repo tiene literalmente 24 patrocinadores —relays de API, plataformas de inferencia, gateways de pago— que financian el desarrollo. La app es gratis y open source, pero el incentivo económico está en que uses ciertos proveedores. Eso no la invalida, pero conviene saberlo.

**La comunidad es mayoritariamente china.** La documentación está en chino e inglés con distinto nivel de detalle. Los canales de soporte (issues, discusiones) tienen mucha actividad en chino. Si no lees chino, puede que algunas discusiones relevantes se te escapen.

**Es una dependencia externa más.** Si CC Switch desaparece mañana, tus configuraciones no desaparecen —están en los archivos nativos de cada herramienta—, pero pierdes la gestión unificada. La app sigue el principio de "intrusión mínima": incluso si la desinstalas, tus herramientas siguen funcionando.

---

## Alternativa DIY: perfiles de Hermes + dotfiles

Si prefieres no depender de una GUI externa, puedes conseguir un aislamiento similar con herramientas que ya tienes:

```bash
# Hermes Agent con perfiles
hermes profile create cliente-enterprise
hermes profile create side-project
hermes profile create laboratorio

# Cambiar de perfil
hermes --profile cliente-enterprise
```

Cada perfil de Hermes tiene su propio `config.yaml`, skills, MCP servers y sesiones. Es menos visual, pero más portable y auditable.

Para las herramientas que no tienen perfiles nativos, puedes usar bash aliases con variables de entorno o dotfiles condicionales:

```bash
alias codex-work='export CODEX_CONFIG_DIR=~/.config/codex-work && codex'
alias codex-oss='export CODEX_CONFIG_DIR=~/.config/codex-oss && codex'
```

No es tan cómodo como un clic en la bandeja del sistema, pero es 100% controlable, versionable con Git y no depende de un tercero.

---

## ¿Merece la pena?

CC Switch resuelve un problema real que casi nadie está resolviendo: **la gestión de entornos de desarrollo con IA como práctica de ingeniería, no como ocurrencia**.

Si trabajas con varios clientes, proyectos o herramientas, tener entornos aislados no es un lujo. Es una necesidad de arquitectura. CC Switch te da eso sin fricción.

Si solo usas una herramienta y un proveedor, probablemente no lo necesites. Pero si tu setup se parece al que describo arriba, merece la pena probarlo.

El aislamiento de entornos es una de esas prácticas que no parecen urgentes hasta que mezclas un token de producción con un experimento del fin de semana. Y entonces ya es tarde.

---

**Enlaces:**

- Repo: https://github.com/farion1231/cc-switch
- Web oficial: https://ccswitch.io
- Hermes Agent perfiles: https://hermes-agent.nousresearch.com/docs/user-guide/profiles
