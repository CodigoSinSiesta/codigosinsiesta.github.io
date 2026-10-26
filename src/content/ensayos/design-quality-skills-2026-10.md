---
title: "Design quality como nueva categoría de skills: hallmark, impeccable, Vercel y Google convergen"
description: "Cuatro vendors con voz propia ya bifurcan la skill oficial frontend-design de Anthropic. ¿Instalar la base o una de las bifurcaciones? Comparativa técnica con decisión ladder."
fecha: 2026-10-02
tags:
  - ia
  - coding-agents
  - skills
  - design
  - frontend
tipo: investigacion
estado: pendiente-revision
autor: "Alejandro de la Fuente"
---

Hay un patrón que se repite en todo producto de IA generativa con suficiente exposición: la skill base que el proveedor publica se queda pequeña. El modelo de partida sirve para enseñar la idea, pero enseguida aparecen vendors —y autores con audiencia— que la bifurcan, la endurecen y la convierten en algo distinto. Estamos viendo exactamente eso con las **design quality skills**: la categoría entera no existía en febrero de 2025, y a octubre de 2026 ya hay cuatro familias competiendo, cada una con su propia voz estética y su propia postura sobre cómo se le mete disciplina a un agente.

Lo que cuenta este artículo no es qué librería CSS queda mejor en un proyecto. Es la decisión más básica: **¿qué skill de diseño le doy a mi coding agent, y por qué?** La elección no es trivial porque las cuatro opciones cambian lo que el agente es capaz de hacer, cómo lo hace, y a qué precio de lock-in te expones.

Datos primarios verificados el 2 de octubre de 2026 desde el repo clonado de `pbakaus/impeccable` y desde la API pública de GitHub. Cuando una métrica no se pudo comprobar, queda marcada como "no verificado".

## Índice

1. Por qué importa: skill oficial como base, vendors como bifurcación
2. La skill oficial: `frontend-design` de Anthropic, qué cubre y qué no
3. Las cuatro bifurcaciones activas
   - hallmark (Together AI) — anti-AI-slop con 57 slop-gates
   - impeccable (pbakaus) — design language con 61 reglas deterministas
   - vercel-labs/skills — el canal de distribución abierto
   - addyosmani/agent-skills (Google) — production-grade, ciclo completo
4. Comparativa técnica: deterministic rules, LLM critique, hooks, browser, vendor lock-in
5. El caso Impeccable en profundidad
   - 24 commands en 6 categorías
   - 61 Analyzer en un workspace Rust de 15 crates
   - 16 providers soportados, incluido Hermes
   - Hook system post-edit en cinco vendors
   - Browser extension sin LLM
   - Los cuatro modos de diseño: Persuade, Operate, Read, Experience
6. Decisión ladder para tu proyecto
7. Riesgos: lock-in, bus-factor, hook side-effects, madurez del engine binario
8. Cuándo NO usar ninguna de estas skills
9. Lo que cambia en tu workflow mañana

---

## 1. Por qué importa: skill oficial como base, vendors como bifurcación

Cuando Anthropic publicó `frontend-design` en su repositorio público `anthropics/skills` (septiembre de 2025), hizo dos cosas a la vez: normalizó un vocabulario para hablar de "diseño deliberado" con un agente, y dejó sobre la mesa un espacio enorme para que terceros lo especializaran. La skill de Anthropic es un **documento Markdown de 9,4 KB** con una tesis: "actúa como el lead de un estudio de diseño conocido por dar a cada cliente una identidad visual que no se confunde con la de nadie más". Esa es la base.

Pero la base no se queda sola. En menos de un año han aparecido:

- **pbakaus/impeccable** (noviembre 2025): un fork espiritual que añade un binario compilado, 24 comandos, 61 reglas deterministas, hook system y browser extension. Hoy, 74.203 estrellas y 4.471 forks. Licencia Apache-2.0. Push de hoy.
- **Nutlope/hallmark** (abril 2026): "una design skill para Claude Code, Cursor y Codex que rehúsa parecer generada por IA". 21 temas, 57 slop-gates, hecho por Together AI. 29.426 estrellas.
- **addyosmani/agent-skills** (febrero 2026): 25 skills de ingeniería production-grade que cubren todo el ciclo de desarrollo, con la design quality como una más. Mantenido por Addy Osmani (Google Chrome). 100.485 estrellas.
- **vercel-labs/skills** (enero 2026): un CLI abierto (`npx skills add`) que es el **canal de distribución** para que estas skills lleguen a 75+ coding agents. 32.985 estrellas.

Y la skill original de Anthropic sigue siendo la **base común** que todas citan. El propio README de Impeccable es inequívoco: *"Anthropic's frontend-design was the first widely-used design skill for Claude. Impeccable started from there."*

El fenómeno no es nuevo. Es el ciclo clásico de un estándar abierto: alguien publica un protocolo, otros lo adoptan, después lo extienden, después compiten. Aquí el "estándar" no es HTTP sino una postura estética traducida a instrucciones en lenguaje natural. Y la pregunta del lector de Código Sin Siesta no es "cuál es la mejor", sino: **¿cuál encaja con el tipo de producto que estoy construyendo, y qué me cuesta elegir la que no es?**

## 2. La skill oficial: `frontend-design` de Anthropic

Conviene entender la base antes de mirar las bifurcaciones, porque las cuatro citan la misma raíz y la extienden en direcciones distintas.

### Qué es y dónde vive

`frontend-design` vive en `github.com/anthropics/skills/tree/main/skills/frontend-design`. El repo completo de skills de Anthropic tiene 179.398 estrellas y 21.213 forks a fecha de hoy, y un push de 2026-09-29. No es un proyecto decorativo: es el repositorio canónico de "Agent Skills" del vendor del modelo.

### Qué cubre

El `SKILL.md` (9.390 bytes) se estructura alrededor de cinco ideas técnicas concretas:

1. **Anclar el diseño en la materia del sujeto.** Si el brief no identifica producto ni audiencia, el agente tiene que identificarlos antes de diseñar. La estética nace del sector, del material y del vocabulario del cliente, no de un catálogo de templates.
2. **Principios de diseño deliberados.** Tipografía con una o dos familias claramente distintas, longitud de línea bajo 80 caracteres, jerarquía por peso y tamaño más que por decoración. Y un aviso explícito: *evitar los acentos tipográficos típicos de páginas generadas* (palabra sola en cursiva, ALL CAPS, eyebrows decorativos).
3. **Estructura visual como información.** Los outlines, borders, numeraciones y divisores deben codificar información real sobre el contenido, no decorar. Si pones "01 / 02 / 03", asegúrate de que el contenido es una secuencia.
4. **Movimiento escaso y orquestado.** Una sola secuencia coreografiada de entrada —un page-load, un reveal— funciona mejor que fade-and-slide en cada sección. El movimiento se asocia a acciones del usuario, no se programa por defecto.
5. **Proceso en dos pasadas: planificar, revisar contra el brief, construir, criticarse.** El agente tiene que producir un plan compacto de tokens (color, tipo, layout, principios), revisarlo contra el brief antes de escribir una línea de CSS, y luego criticarse mientras construye.

La lista de **"tells"** que la skill oficial detecta en diseños IA es el catálogo al que el resto de vendors va a responder. Literalmente:

> 1. Fondo crema cálido (cerca de `#F4F1EA`) con serif de alto contraste y acento terracotta (cerca de `#D97757`).
> 2. Fondo casi negro con un acento verde ácido o bermellón.
> 3. Layout broadsheet con reglas hairline, border-radius cero, columnas densas.
> 4. El kit SaaS: cards idénticas, un border-radius para todo, sombra suave gris (`rgba(0,0,0,.1)`) debajo de cada una, lavados de gradiente como decoración.
> 5. Chrome de plantilla: eyebrow ALL CAPS tracked-out sobre cada heading, strings meta con puntos medios ("A · B · C"), labels tipo "WORD — fragment" con em dash espaciado, near-black tintado (`#0B0B0B`, `#111`) en lugar de negro, cara monoespaciada para micro-data, "→" pegado al texto de botones y links.

### Qué no cubre

Lo que la skill oficial **no hace** es, técnicamente, lo que abre la puerta a los vendors:

- **No tiene reglas deterministas.** Todo el filtrado de "tells" lo hace el LLM leyendo la skill. No hay una capa de regex o AST que diga "este CSS contiene tres border-radius idénticos en un children de un card". El trabajo de detección depende de la capacidad del modelo de seguir la instrucción.
- **No tiene hook system.** No se ejecuta automáticamente tras cada edit. Es un documento que el agente lee cuando se le pide.
- **No tiene comandos discretos.** Es una sola skill que dice "sé el lead de un estudio". No tiene `/impeccable audit`, ni `/hallmark study`. Es un cambio de rol, no un catálogo de verbos.
- **No se distribuye como paquete.** No hay `npx skills add anthropics/frontend-design`. Se copia el `SKILL.md` al directorio de skills del agente (`~/.claude/skills/`, `.cursor/skills/`, etc.) o se enlaza manualmente.
- **No tiene browser extension.** La detección de "tells" la hace el modelo contra el código, no contra la página renderizada.

Esa combinación — sin reglas, sin hooks, sin comandos, sin extensión — define el **piso común**. Todo lo que viene después añade al menos una de esas cuatro dimensiones.

## 3. Las cuatro bifurcaciones activas

### 3.1. hallmark (Together AI) — anti-AI-slop con 57 slop-gates

**Repo:** `github.com/Nutlope/hallmark` — 29.426★, 1.514 forks, MIT, push 2026-08-06. Creado en abril de 2026 (5 meses de vida).

**Tesis:** "Cada LLM fue entrenado con los mismos defaults. Hallmark los rehúsa." El README es directo: dos páginas hechas con Hallmark para dos briefs distintos parecen sitios distintos, no variantes de color del mismo template.

**Qué lo diferencia técnicamente:**

- **4 verbos.** `(default)`, `hallmark audit`, `hallmark redesign`, `hallmark study`. El cuarto — `study <screenshot | URL>` — es interesante: extrae la "DNA" de un diseño que admiras (macroestructura, type-pairing, color anchor) y rehúsa clones pixel-perfect o templates de pago. Opcionalmente emite un `design.md` portable para handoff a otras herramientas.
- **21 temas.** Hum, Cobalt, Carnival, Lumen, Garden, Riso, modern-minimal, atmospheric, etc. Cuando un brief no encaja en ningún tema del catálogo, Hallmark pasa a modo **Custom** y diseña desde cero — con los mismos 57 slop-gates pero sin template debajo.
- **57 slop-gates + pre-emit self-critique.** El agente corre los gates antes de entregar. No son regex: son una checklist que el LLM ejecuta contra su propia salida, y si algo huele a default, lo rehúsa.
- **Modo de uso:** Claude Code, Cursor y Codex. No tiene el alcance de providers de Impeccable.

**Qué aprenderé si leo esto:** cómo se construye una skill que **rehúsa entregar** cuando detecta que la salida se parece demasiado al corpus de entrenamiento. Es la postura más agresiva del cuarteto: "no produzco a menos que la producción sea deliberadamente distinta".

**Limitaciones honestas:** la métrica "57 slop-gates" no está desglosada en el README público. El repo es de menor tamaño (`size: 90.423 KB` vs 379.873 KB de Impeccable) y el push no se ha movido desde agosto de 2026. Es un proyecto que se enfoca en su tesis en vez de escalar, lo cual es una decisión editorial legítima pero un riesgo de mantenimiento.

### 3.2. impeccable (pbakaus) — design language con 61 reglas deterministas

**Repo:** `github.com/pbakaus/impeccable` — 74.203★, 4.471 forks, Apache-2.0, push 2026-10-02 (hoy). Creado el 16 de noviembre de 2025 (~11 meses en producción).

**Tesis:** "El diseño para coding agents. 1 skill, 24 comandos, iteración visual en vivo, y 61 reglas de detector deterministas para diseño frontend generado por IA."

**Por qué importa técnicamente:** Impeccable no es solo una skill Markdown. Es un **workspace de Rust de 15 crates** que compila un binario autónomo. El binario hace la detección pesada (regex sobre CSS, JS y HTML) sin llamar al LLM. El LLM solo se invoca para el paso de "critique", que es genuinamente cualitativo.

Resumen 1-2 líneas: si hallmark rehúsa los defaults con un catálogo de temas y el LLM como juez, Impeccable **automatiza la detección de los tells de IA con código compilado**, instala hooks post-edit en cinco vendors, y se distribuye a 16 coding agents. Es la apuesta más ingenieril del cuarteto.

(Detalle completo en la sección 5.)

### 3.3. vercel-labs/skills — el canal de distribución

**Repo:** `github.com/vercel-labs/skills` — 32.985★, 2.807 forks, MIT, push 2026-10-02. Creado el 14 de enero de 2026.

**Tesis:** "El CLI abierto del ecosistema de skills. Soporta OpenCode, Claude Code, Codex, Cursor, y 75 más."

**Qué lo cambia:** `vercel-labs/skills` no es una design quality skill. Es el **transporte**. Con un solo comando instalas skills desde GitHub, GitLab, Azure DevOps o un path local:

```bash
npx skills add vercel-labs/agent-skills
npx skills add addyosmani/agent-skills --list
npx skills add https://github.com/owner/repo/tree/main/skills/foo
npx skills use vercel-labs/agent-skills@web-design-guidelines | claude
```

`skills use` resuelve la fuente igual que `skills add`, escribe los archivos de la skill en un directorio temporal, y si pasas `--agent` arranca el agente elegido con el prompt generado. Es la pieza que **desacopla el formato de la skill del vendor del agente**.

**Por qué importa para este artículo:** porque convierte las design quality skills en un **mercado abierto**. Cualquiera puede publicar una skill en GitHub y `npx skills add` la lleva a 75+ coding agents. La consecuencia es que la pregunta "qué skill de diseño uso" se ha desplazado de "qué agente uso" a "qué **repositorio** confío". Verá usted la consecuencia en la decisión ladder.

### 3.4. addyosmani/agent-skills (Google) — production-grade, ciclo completo

**Repo:** `github.com/addyosmani/agent-skills` — 100.485★, 10.557 forks, MIT, push 2026-10-02. Creado el 15 de febrero de 2026.

**Tesis:** "Skills de ingeniería production-grade para coding agents de IA. Codifican los workflows, las quality gates y las prácticas que un senior engineer usa para construir software."

**Lo que lo diferencia:** no es una skill de diseño aislada, es **una familia de 25 skills que cubren todo el ciclo de desarrollo**:

```
DEFINE   →   PLAN   →   BUILD   →   VERIFY   →   REVIEW   →   SHIP
  /spec      /plan     /build      /test        /review      /ship
```

9 slash commands que activan skills automáticamente según contexto. Las relevantes para este artículo:

- `frontend-ui-engineering` — se activa cuando construyes UI.
- `web-design-guidelines` — guidelines concretas de diseño web.
- `code-review-and-quality` — revisión de cinco ejes antes de merge.
- `webperf` — auditoría de performance web (medir antes de optimizar).

**Qué lo hace distinto del cuarteto:**

- **Mantenido por Addy Osmani** (Engineering Lead en Google Chrome, autor de *Learning JavaScript Design Patterns*). La asociación con Google Chrome le da visibilidad y autoridad que ni hallmark ni impeccable tienen.
- **Cubre todo el ciclo**, no solo el momento de "pintar la página". El diseño es una pieza entre SPEC, PLAN, BUILD, TEST, REVIEW, SHIP.
- **Se distribuye por el CLI de Vercel:** `npx skills add addyosmani/agent-skills` y `npx skills add addyosmani/agent-skills --list`. Esa es la integración que la propia README recomienda: *"Fastest path — any agent, one command. The open skills CLI installs into 70+ agents"*.

**Limitación declarada por el propio repo (issue #361):** una instalación per-skill copia solo `skills/<name>/`, no los `references/` compartidos. La skill funciona, pero los paths a checklists compartidos quedan inaccesibles. Para evitarlo: instalación whole-repo, clonar el repositorio, o copiar el checklist que necesites a un `references/` local.

**Qué aprenderé si leo esto:** cómo se pasa de "una skill" a "un sistema de skills" que cubre el desarrollo entero. Si hallmark e impeccable son **skills de un solo punto** (diseño), agent-skills es una **plataforma de skills**.

---

## 4. Comparativa técnica

Las cuatro opciones se diferencian en cinco dimensiones técnicas. Esta tabla es la única fuente de verdad; el resto del artículo la referencia.

| Dimensión | frontend-design (Anthropic) | hallmark | impeccable | vercel-labs/skills | agent-skills (addyosmani) |
|---|---|---|---|---|---|
| **Año de aparición** | Sep 2025 | Abr 2026 | Nov 2025 | Ene 2026 | Feb 2026 |
| **Stars (verificado hoy)** | (en repo `anthropics/skills` 179.398) | 29.426 | 74.203 | 32.985 | 100.485 |
| **Licencia** | (no verificada en subcarpeta) | MIT | Apache-2.0 | MIT | MIT |
| **Reglas deterministas** | No (todo lo hace el LLM) | "57 slop-gates" — sin desglose público | **Sí, 61 Analyzer Rust** (`crates/detect/src/regex_matchers.rs`, 1.492 líneas) | No es una design skill | No es una design skill aislada |
| **LLM critique** | Sí, integrado en el prompt | Sí, con pre-emit self-critique | Sí, vía comando `critique` | No | Vía skill `code-review-and-quality` |
| **Comandos discretos** | 0 (es un cambio de rol) | 4 verbos | **24 comandos en 6 categorías** | 0 (es CLI de transporte) | 9 slash commands |
| **Hook system** | No | No verificado | **Sí, post-edit en 5 vendors** (Claude Code, Copilot, Codex, Cursor, Grok Build) | No | No (es invocación manual) |
| **Browser extension** | No | No | **Sí, Chrome Web Store** | No | No |
| **Providers soportados** | Manual (copia de `SKILL.md`) | 3 (Claude Code, Cursor, Codex) | **16** (incluido Hermes) | 75+ (es el canal) | 70+ (vía CLI de Vercel) |
| **Modo "estudio" de un diseño ajeno** | No | **Sí**, `hallmark study` | No (es interno al propio proyecto) | No | No |
| **Modo "viva" en navegador** | No | No | **Sí, `/impeccable live`** | No | No |
| **Modo "genera variantes"** | No | No | **Sí, `/impeccable generate`** | No | No |
| **Requiere Node en runtime** | No | No verificado | **No** (binario Rust) | Sí (es CLI npm) | Sí (vía CLI de Vercel) |
| **Distribución** | Manual | `npx skills add Nutlope/hallmark` (vía vercel-labs/skills) | `npx impeccable install` o plugin marketplace | `npx skills add <repo>` | `npx skills add addyosmani/agent-skills` |

Las celdas en negrita son las dimensiones donde Impeccable va por delante del cuarteto. La razón por la que tiene más estrellas que hallmark, el doble de la edad de agent-skills y empuja más que la propia skill de Anthropic es exactamente esa combinación: **reglas deterministas + comandos discretos + hooks + browser extension + 16 providers**.

### 4.1. Reglas deterministas: por qué importan más de lo que parecen

La diferencia entre "el LLM lee la skill y aplica criterio" y "61 regex corren en un binario y devuelven findings" no es trivial. Tres razones:

1. **Coste.** Las regex no cuestan tokens. Un detector determinista se ejecuta después de cada edit en el hook sin facturar al LLM. Si el agente escribe 200 archivos UI en una sesión, eso son 200 invocaciones de detector. Hacerlo con LLM sería prohibitivo.
2. **Velocidad.** El binario corre en milisegundos. La latencia de un round-trip al LLM es de segundos. En un hook post-edit, esa diferencia se nota.
3. **Determinismo.** Una regex siempre da el mismo resultado. Un LLM puede pasarse un "tell" por alto si el contexto lo distrae. Para auditoría, el determinismo importa.

Impeccable aprovecha esta propiedad para algo que ningún otro vendor hace: **publicar la lista de los 61 Analyzer en código abierto, dentro de `crates/detect/src/regex_matchers.rs`**. Cualquiera puede leer qué patrones detecta, modificarlos, o copiarlos. No son una promesa de marketing; son código compilable.

### 4.2. Hook system: la diferencia entre "te lo digo" y "te lo aplico"

Un hook post-edit es una función que el coding agent invoca automáticamente después de cada modificación de archivo. Si el hook devuelve un finding, el agente lo ve y reacciona. Impeccable lo instala en:

- **Claude Code** (`after edit + Stop`).
- **GitHub Copilot** (`after edit + Stop`).
- **Codex** (`after edit + Stop`).
- **Cursor** — **bloquea el write antes de que aterrice** (único vendor con esta política).
- **Grok Build** — `PostToolUse` cuyo stdout no llega al modelo; funciona como warming.

El matiz de Cursor es importante. En los demás vendors, el hook es **detect-and-warn**: el archivo ya se ha escrito, el detector corre, devuelve findings, el agente los ve. En Cursor, el hook **bloquea el write antes de que aterrice**: si el detector encuentra un "tell", el archivo no se modifica. Es la única implementación que cambia la semántica de "el agente edita un archivo" en lugar de observar la edición.

### 4.3. LLM critique: la otra mitad

Las reglas deterministas no reemplazan al LLM. Detectan patrones que se pueden expresar como regex (border-radius repetidos, fuentes overused, anidación de cards). Pero hay hallazgos que solo el LLM puede hacer: ¿es legible la jerarquía? ¿la resonancia emocional del hero encaja con la materia del producto? ¿el spacing es coherente con el resto del sistema?

Impeccable lo separa explícitamente. El binario hace la detección determinista. El comando `/impeccable critique` invoca al LLM para una review de UX design (jerarquía, claridad, resonancia emocional). El comando `/impeccable audit` corre el detector técnico (a11y, performance, responsive).

Esa separación es la misma que hallmark hace con su pre-emit self-critique, pero expuesta como comandos discretos que el desarrollador puede invocar cuando quiera. No es "el LLM decide si pasa el filtro"; es "el LLM hace la parte que solo el LLM puede hacer, y el detector hace la parte que el LLM no debería hacer".

---

## 5. El caso Impeccable en profundidad

Impeccable es el proyecto que justifica este artículo. No porque sea perfecto (ver sección 7), sino porque es **el caso donde cada decisión de arquitectura es legible y defendible**. Si entiendes Impeccable, entiendes el espacio.

### 5.1. 24 comandos en 6 categorías

El catálogo completo, verificado en `command-metadata.json` y en el README, agrupado por intención:

**Build (5) — crear desde cero:**

- `craft` — flujo completo shape-then-build con iteración visual.
- `init` — setup inicial. Pregunta al usuario los huecos en la "verdad duradera del producto" y la escribe en `PRODUCT.md`. Es la única pieza de información que sobrevive entre sesiones.
- `document` — genera `DESIGN.md` raíz a partir del código existente.
- `extract` — extrae componentes y tokens reutilizables al design system.
- `shape` — planifica UX/UI antes de escribir código.

**Evaluate (2) — revisar sin tocar:**

- `critique` — UX design review: jerarquía, claridad, resonancia emocional. Hecho con LLM.
- `audit` — chequeos técnicos: a11y, performance, responsive. Hecho con detector.

**Refine (7) — ajustar diseño existente:**

- `polish` — pasada final, alineación con design system, shipping readiness.
- `bolder` — amplifica diseños aburridos.
- `quieter` — apaga diseños demasiado fuertes.
- `distill` — reduce a la esencia.
- `harden` — error handling, i18n, overflow de texto, edge cases.
- `onboard` — first-run flows, empty states, activation paths.
- `shape` — (también en Refine) planifica antes de refinar.

**Enhance (5) — añadir dimensión:**

- `animate` — movimiento con propósito.
- `colorize` — introduce color estratégico.
- `typeset` — corrige fuentes, jerarquía, sizing.
- `layout` — corrige layout, spacing, ritmo visual.
- `delight` — añade momentos de alegría.
- `overdrive` — efectos técnicamente extraordinarios.

**Fix (3) — reparar lo concreto:**

- `clarify` — mejora copy oscuro.
- `adapt` — adapta a distintos dispositivos.
- `optimize` — mejoras de performance.

**Iterate (2) — trabajo en vivo:**

- `live` — modo de variante visual: itera sobre elementos en el navegador.
- `generate` — genera variantes de un elemento nombrado en el navegador, sin picking manual.

Lo que se aprende de la taxonomía: **no hay comandos para "investigar" o "explorar"**. Cada verbo presupone que ya sabes qué quieres hacer. Esto es deliberado: el `init` hace la parte de entender el producto, y después cada comando opera sobre un objeto concreto. Es la división de responsabilidades que hallmark no tiene (todo se hace con un solo verbo implícito más `audit`, `redesign`, `study`).

### 5.2. 61 Analyzer en un workspace Rust de 15 crates

Esto merece una sección propia porque es el detalle técnico que ningún otro vendor del espacio ha tocado.

El código vive en `crates/detect/src/regex_matchers.rs` (1.492 líneas). El tipo de cada detector es:

```rust
pub type Analyzer = fn(&str, &str) -> Vec<Finding>;
```

Es decir: **función pura que recibe (contenido, contexto) y devuelve una lista de findings**. El primer string es el texto a analizar, el segundo es metadata de contexto. La lista de detectores se monta en un array estático:

```rust
pub const REGEX_ANALYZERS: &[Analyzer] = &[
    /* ... 61 funciones compiladas como tabla ... */
];
```

Estos 61 detectores se agrupan en el README en dos categorías:

- **AI slop:** side-tab borders, purple-to-blue gradients, bounce easing, dark glows.
- **General design quality:** line length, cramped padding, small touch targets, skipped headings.

El workspace completo de Rust se compone de **15 crates**:

```
crates/
├── browser/      integración browser-bundle
├── bundle/       empaquetado de la skill
├── cli/          shim CLI
├── common/       tipos compartidos
├── comp/         motor de composición
├── comp-verbs/   verbos del compositor
├── context/      resolución de contexto (PRODUCT.md, DESIGN.md)
├── core/         tipos núcleo (Finding, Analyzer)
├── detect/       ← 61 regex matchers viven aquí
├── foundation/   primitivas (color, font, spacing)
├── hook/         ← hook system
├── html/         parser HTML
├── live/         live mode en navegador
├── skills/       manifest de skills
├── wasm/         binding WebAssembly
└── xtask/        tareas de build
```

Esa organización importa porque **separa el detector (regex determinista) del compositor (verbos de Impeccable), del hook (instalación por vendor), del live (iteración en navegador)**. Modificar la lista de tells no obliga a recompilar la integración con Cursor. Cambiar el formato de los findings no rompe el browser extension. Es una arquitectura que permite crecer.

El binario compilado se llama `impeccable` y se distribuye en `skill/scripts/bin/<os>-<arch>/`. El número de versión está pinneado en `ENGINE_VERSION` (actualmente `0.1.11`). El `npx impeccable install` es solo un shim: el código que hace el trabajo es el binario Rust. **No requiere Node** en runtime. La frase literal del README: *"The skill needs no runtime of its own. Every skill copy ships a small launcher that runs the Impeccable engine, a self-contained binary that either sits next to the launcher or is downloaded once on first run."*

### 5.3. 16 providers soportados, incluido Hermes

El instalador detecta qué coding agents tienes en tu máquina o en tu proyecto y genera los archivos de skill en los directorios correctos. La lista, verificada en `scripts/lib/transformers/`:

```
claude-code   gemini     grok      opencode  qoder    trae
codex         github     hermes    pi        rovodev  vibe
cursor        dsh        kiro
```

Son 16. **Hermes aparece como first-class provider** (no es un afterthought). El README tiene su propia sección de instalación para Hermes, e incluye una nota específica sobre trust:

> *"Hermes gates project-local skills behind a per-repo trust decision (they are procedure documents, so auto-loading them from any cloned repo is treated as a prompt-injection vector). After a project-scoped install, run `hermes skills trust` once from the project root."*

Eso es importante: Impeccable se integra con la postura de seguridad de Hermes (procedimiento, no código), y al hacerlo, **no instala el hook de diseño** porque Hermes no expone hook surface. Es la única excepción documentada: la skill funciona, pero la detección automática post-edit no.

### 5.4. Hook system en cinco vendors

El detalle ya se ha dado en la sección 4.2. Lo que conviene añadir aquí es **cómo se instala**. La frase clave del README:

> *"On Claude Code, Cursor, Codex, GitHub Copilot, and Grok Build, it also installs the provider-native hook manifest for the current project."*

El instalador (`npx impeccable install`) lee los directorios que detecta (`~/.claude`, `~/.codex`, `~/.grok`, `~/.hermes`, `~/.veto`, o `.cursor` local) y, para los cinco que soportan hook nativo, escribe el manifest correspondiente:

- `.claude/settings.json` con hook `PostToolUse`.
- `.cursor/hooks.json` con política de block-before-write.
- `.codex/hooks.json` (con el caveat de que Codex rastrea confianza por hook definition, así que updates pueden requerir reaprobación).
- `.github/hooks/...` para Copilot.
- `.grok/hooks/impeccable.json` (necesita `/hooks-trust` o `--trust`).

La instalación es no destructiva: el manifest se añade, los skills existentes no se tocan a menos que se pase `--force`. La actualización (`npx impeccable update`) hace lo mismo. **El modelo de update es deliberadamente compatible con un workflow de submodule**: la propia README incluye la receta para mantener Impeccable como `.impeccable` y enlazarlo a los providers con `npx impeccable link --source=.impeccable --providers=claude,cursor`.

### 5.5. Browser extension sin LLM

Impeccable publica una **browser extension** (Chrome Web Store listing en `extension/STORE_LISTING.md`). Lo que hace: aplicar las **61 reglas deterministas a la página renderizada en el navegador**, sin pasar por el LLM. Es un detector que se ejecuta mientras navegas.

El caso de uso es claro: abres un sitio que admiras, lanzas la extensión, y te dice en qué reglas de las 61 está fallando. Después puedes ejecutar `/impeccable study` (no, eso es hallmark) — perdón, no hay equivalente en Impeccable. El flujo correcto es: ves el sitio en el navegador, la extensión te lista los findings, después abres tu propio proyecto y corres `/impeccable audit` para ver en qué se parece.

La separación browser extension (lee) vs `audit` (escribe) es la misma lógica de hallmark con `study` y `audit`, pero expuesta como dos herramientas distintas en lugar de una sola skill.

### 5.6. Los cuatro modos de diseño: Persuade, Operate, Read, Experience

Este es un detalle que el README menciona pero la mayoría de análisis pasan por alto. Impeccable define **cuatro modos de diseño** en `skill/reference/`:

- **Persuade** — landing pages, marketing. *El diseño ES el producto.* Aquí gana la primera impresión, la dirección artística, la voz de marca.
- **Operate** — dashboards, editores. Gana la escaneabilidad, la consistencia, la predictibilidad. El usuario vuelve cada día; el diseño no debe sorprender.
- **Read** — docs, artículos. Gana la estructura para la comprensión. Tipografía, ritmo, line-length, jerarquía silenciosa.
- **Experience** — portfolios, galleries. *Let the artifact lead.* El trabajo es el contenido; el diseño debe desaparecer.

La decisión arquitectónica está en `skill/scripts/` (verificado en el `AGENTS.md` del repo como "visitor-mode-register"): cuando entras a una superficie, registras qué modo aplica. Los comandos que se invocan después (`polish`, `audit`, `critique`, `bolder`, `quieter`) **leen el modo registrado y ajustan los criterios**. `/impeccable bolder` en Persuade amplifica la dirección artística; en Operate, amplifica la legibilidad del dato; en Read, no tiene sentido invocarlo.

Es la diferencia entre "una skill de diseño" y "una skill que entiende que diseñar para un dashboard y diseñar para una landing no es lo mismo". Ningún otro vendor del espacio lo hace con este nivel de granularidad.

---

## 6. Decisión ladder para tu proyecto

Esto es lo que vas a hacer el lunes. Una decisión ladder, no una respuesta única.

### Paso 1 — ¿Necesitas una design quality skill?

Si tu proyecto es backend, infra, datos, ML, o scripting, **no**. Estas skills asumen que hay un agente generando CSS, JSX, o HTML. Si eso no pasa, la skill es ruido.

Si tu proyecto tiene UI generada por agente, **sí**. La pregunta pasa a ser cuál.

### Paso 2 — ¿Cuál es tu posture sobre el "AI slop"?

Aquí hay dos campos:

- **"Rechazo producir si parece AI"** → hallmark. Su tesis es la más agresiva. Asume que vas a iterar mucho con el LLM y que necesitas que cada entrega sea deliberadamente distinta. Tiene 21 temas y 57 slop-gates.
- **"Detecto los tells automáticamente y los corrijo"** → impeccable. Asume que vas a producir mucho y necesitas una capa de detección barata que no facture al LLM.

Si no sabes cuál posture te conviene, **impeccable tiene mejor relación señal/coste**: el detector corre siempre, el LLM critique solo cuando lo pides.

### Paso 3 — ¿Tu agente es único o son 75?

- **Un agente (Claude Code, Cursor, o Codex)** → impeccable o hallmark, según el paso 2.
- **Múltiples agentes, o quieres estandarizar a nivel de equipo** → instala por `vercel-labs/skills` con `npx skills add`. Te aseguras de que la misma skill llega igual a todos.
- **Tu proyecto cubre el ciclo entero (spec, build, test, review, ship) y diseño es una parte** → `addyosmani/agent-skills` con `frontend-ui-engineering` o `web-design-guidelines`. Diseñar es una pieza más, no la única.

### Paso 4 — ¿Cuánto te importa el "estudio" de diseños ajenos?

Si tu flujo incluye "abro un sitio que admiro, le saco la estructura, y la aplico a mi proyecto" → hallmark tiene `hallmark study` y es el único que lo expone como comando. Impeccable no tiene equivalente directo; lo más cercano es usar la browser extension para ver findings, pero el flujo "extrae DNA y rehúsa clones" no está formalizado.

### Paso 5 — ¿Cuánto te importa la integración con el editor?

- **Solo comando slash** → cualquier opción.
- **Hook post-edit que te avisa automáticamente** → impeccable.
- **Hook que bloquea el write si detecta un tell** → impeccable en Cursor (única implementación).
- **Browser extension para auditar sitios en vivo** → impecable.

### Paso 6 — ¿Tu proyecto es multi-repo o monolito?

Las cuatro opciones soportan instalación per-project, pero el costo de mantenimiento varía:

- **Monolito, un solo repo, un solo agente** → `npx impeccable install` y olvídate. Cero mantenimiento.
- **Monolito, varios agentes** → `vercel-labs/skills` como canal, y dentro, las skills que quieras. Una línea en el README de onboarding del equipo.
- **Multi-repo, N agentes** → considera Impeccable como submodule en un repo `.impeccable/` y `link` por provider. El README tiene la receta exacta. Te ahorras re-descargar 400 MB de binario por cada repo.

### Paso 7 — Decide, documenta, y revisa

Una vez elegida la skill, **documenta en el README del proyecto** qué skill está activa y por qué. La razón: si dentro de seis meses el proyecto cambia de equipo, el siguiente developer necesita saber por qué hay un `~/.impeccable/` en el repo y un hook en `.cursor/`. Sin documentación, va a borrar todo y perder el valor acumulado.

---

## 7. Riesgos: lo que ninguna de las cuatro dice en el primer párrafo

### 7.1. Lock-in por vendor

Impeccable genera archivos en **directorios que el vendor del agente controla**: `.claude/`, `.cursor/`, `.codex/`, `.gemini/`, `.hermes/`. Si Anthropic cambia el formato del manifest de skills, Impeccable se rompe. Si Cursor decide que `.cursor/skills/` ya no es la ruta canónica, lo mismo. El `AGENTS.md` del propio repo reconoce esto implícitamente al listar `Generated Provider Output Policy` como un capítulo entero: los directorios `.claude/`, `.agents/`, etc. son **artefactos generados** que se sincronizan con cada release.

Mitigación: tratar esos directorios como derivados, no como fuente. La fuente es `skill/`, `crates/`, `scripts/`. Los `.claude/` deberían estar en `.gitignore` o regenerarse en CI, pero la realidad es que el repo los trackea para que `npx skills` y los submodule users puedan instalar directamente. Es un trade-off declarado, no un bug.

### 7.2. Bus-factor de pbakaus

Pablo Bakaus es ex-Three.js, ex-Vercel, ex-Google. Es un autor con audiencia y con un historial de productos serios. Pero **Impeccable tiene un solo maintainer activo en el commit log visible**. Si pbakaus deja de empujar, el binario Rust sigue compilando (es código abierto, Apache-2.0), pero:

- La lista de tells se queda congelada en lo que el detector sabe hoy.
- Los hooks para nuevos vendors no se actualizan.
- La documentación de nuevos patterns se estanca.

Mitigación: el repo está bien organizado (15 crates, separación clara entre detector, compositor, hook, live). Un nuevo maintainer con conocimiento de Rust podría entrar. Pero "podría" no es "lo hará". El bus-factor es real, aunque la base técnica lo mitigue.

### 7.3. Hook side-effects

El hook post-edit corre **en cada modificación de archivo UI**. Eso significa:

- Si trabajas en un archivo CSS, el detector corre. Si hay findings, se reportan.
- Si estás en medio de un refactor grande, el hook te va a interrumpir con cada paso.
- Si el detector tiene falsos positivos (es regex, los hay), el flujo se vuelve ruidoso.

Impeccable no expone una forma declarativa de **silenciar el hook en un path o un commit concreto** desde el README. Sí hay `.impeccable/config.json` y `.impeccable/config.local.json` (este último gitignored), pero la granularidad del silencing no está documentada. Es deuda operacional.

### 7.4. Madurez del engine binario (v0.1.11)

El binario Rust está en `0.1.11`. Es un indicador de **pre-1.0**: la API no se considera estable, los breaking changes entre minors son posibles. La npm wrapper está en `4.1.0` (más madura), pero la npm wrapper **no es el código que hace el trabajo**; es un shim. El código de verdad es el binario.

Impeccable mitiga esto pinneando la versión del binario en `ENGINE_VERSION` (cada release del wrapper fija qué binario descarga), así que en un `package-lock.json` dado el binario es reproducible. Pero si en el futuro el binario pasa a 1.0 con un cambio de API, los skills generados para 0.1.11 pueden no funcionar.

### 7.5. Operational debt del propio repo

El `AGENTS.md` de Impeccable es honesto sobre sus gotchas:

- "GitHub SSH operations que dependen del 1Password SSH agent pueden fallar en el sandbox con `sign_and_send_pubkey`."
- "`bun run build:release` reescribe directorios committeados; en el sandbox, Bun puede dar `EFAULT` en `.agents/skills/`."
- "El oracle y el framework suite spawnean el binario muchas veces; correrlos con Node (`node --test tests/oracle.test.mjs`)."

Eso es **deuda operacional declarada**. No es oculta, pero es real. Si contribuyes al repo, lo sabes. Si solo lo consumes, te da igual.

### 7.6. Lo que no miden las estrellas

100k estrellas en `addyosmani/agent-skills` no significa 100k usuarios activos de `web-design-guidelines`. 74k estrellas en Impeccable no significa 74k proyectos con hooks post-edit instalados. Las estrellas miden hype, no adopción. Ningún vendor del cuarteto publica **DAU, MAU, ni número de instalaciones por provider**. Tendrás que medirlo en tu propio proyecto.

---

## 8. Cuándo NO usar ninguna de estas skills

Porque no todo lo resuelve una skill, y porque la mejor skill del mundo no compensa un brief mal escrito.

- **Si tu proyecto no tiene UI.** Ya cubierto arriba. Pero también: si tu proyecto tiene UI pero **la genera un humano, no un agente**, estas skills no aportan. Impeccable, hallmark y agent-skills asumen que el LLM está en el loop. Un CSS review humano sigue siendo un CSS review humano.
- **Si el brief del producto es vago.** Las cuatro skills asumen que sabes qué producto estás construyendo. Si el brief es "hazme una landing moderna para un SaaS B2B", hallmark va a entregar 21 variantes que ninguna encaja. La skill no es sustituto de un brief.
- **Si lo que necesitas es un sistema de diseño cerrado**, no un detector. Las cuatro son **detectores + guidelines + workflows**. Ninguna te da un Figma, un Storybook, ni un set de tokens pre-hechos para tu vertical. Para eso, mejor un design system vertical (Polaris, Carbon, Material).
- **Si tu agente no soporta skills.** El cuarteto asume que el coding agent entiende el formato de skills. Si trabajas con un agente que no las soporta (y en 2026 todavía hay algunos), el camino es pegar el `SKILL.md` en el system prompt manualmente. Funciona, pero pierdes los hooks y los comandos discretos.
- **Si tu modelo es muy pequeño.** Las skills de diseño asumen que el LLM tiene capacidad de mantener contexto sobre el brief, recordar criterios, y criticar su propia salida. Modelos < 7B parámetros van a pasarse los criterios por alto. No es un problema de la skill; es un problema del modelo.
- **Si lo que persigues es un benchmark.** Ninguna de las cuatro publica métricas reproducibles de "UI output quality". Si lo que necesitas es convencer a un stakeholder con datos, no hay datos públicos. La decisión se toma por inspección visual, no por tabla.

---

## 9. Lo que cambia en tu workflow mañana

Tres consecuencias prácticas de este análisis.

### 9.1. El "qué skill" se ha desplazado del agente al repositorio

Antes: "uso Claude Code, así que tengo las skills de Anthropic". Ahora: "uso 75+ agentes y decido qué skills les instalo desde un repositorio abierto con `npx skills add`". El desacoplo es real y vercel-labs/skills es el transporte. **Tu decisión ya no es "qué agente uso", sino "qué repositorio de skills confío"**. Esa es la pregunta que tu equipo tiene que responder.

### 9.2. El "AI slop" ya no es inevitable

En febrero de 2025, el AI slop era el coste de usar agentes para UI. En octubre de 2026, es opcional. Si tu agente tiene Impeccable instalado con el hook, los tells más burdos (Inter para todo, gradientes púrpura-a-azul, cards anidadas en cards) se detectan antes de que el código llegue a producción. Si tu agente tiene hallmark, la generación se rehúsa si el output no es deliberadamente distinto. **El slop se ha convertido en bug detectable, no en rasgo del medio**. Eso cambia la conversación con stakeholders: "no, esto no es lo que hace la IA; es lo que hace un agente sin skills".

### 9.3. La skill de diseño se ha convertido en un producto serio

Hace un año, una design skill era un Markdown. Hoy, Impeccable es un binario Rust de 15 crates, con 61 Analyzer compilados, hooks en cinco vendors, browser extension, y 16 providers. hallmark tiene 21 temas, 57 slop-gates, y un estudio de ADN. agent-skills tiene 25 skills cubriendo el ciclo entero. **El espacio ha madurado a velocidad de framework de frontend**, no de tutorial. Si todavía no tienes una design quality skill en tu stack, el coste de entrada ya no es la falta de opciones; es la decisión entre ellas.

---

## Anexo A — Métricas verificadas y no verificadas

Para el escéptico que quiera saber qué se ha comprobado y qué no.

**Verificado vía GitHub API el 2026-10-02:**

| Repo | Stars | Forks | Push | Licencia | Creado |
|---|---|---|---|---|---|
| `pbakaus/impeccable` | 74.203 | 4.471 | 2026-10-02 | Apache-2.0 | 2025-11-16 |
| `Nutlope/hallmark` | 29.426 | 1.514 | 2026-08-06 | MIT | 2026-04-27 |
| `addyosmani/agent-skills` | 100.485 | 10.557 | 2026-10-02 | MIT | 2026-02-15 |
| `vercel-labs/skills` | 32.985 | 2.807 | 2026-10-02 | MIT | 2026-01-14 |
| `anthropics/skills` | 179.398 | 21.213 | 2026-09-29 | no verificada en subcarpeta | 2025-09-22 |

**Verificado en el repo clonado de Impeccable:**

- Versión npm: `4.1.0` (`package.json`).
- Engine binary: `0.1.11` (`ENGINE_VERSION`).
- 24 comandos (en 6 categorías): listados en `command-metadata.json` y verificados en el README.
- 61 Analyzer: archivo `crates/detect/src/regex_matchers.rs` (1.492 líneas), tipo `pub type Analyzer = fn(&str, &str) -> Vec<Finding>`.
- 22 reference docs: listado en `skill/reference/` (verificado `ls`).
- 16 providers: `scripts/lib/transformers/`.
- 15 crates en el workspace: `crates/` (`ls`).
- 4 modos de diseño: `mode-persuade.md`, `mode-operate.md`, `mode-read.md` + `mode-experience.md` (este último en `skill/reference/`).
- Frase clave del README: *"Anthropic's frontend-design was the first widely-used design skill for Claude. Impeccable started from there."* — verbatim, líneas 9 del README.
- Frase adicional verbatim: *"Every model trained on the same SaaS templates. Skip the guidance and you get the same handful of tells on every project: Inter for everything, purple-to-blue gradients, cards nested in cards, gray text on colored backgrounds, the rounded-square icon tile above every heading."* — línea 11 del README.

**No verificado:**

- Métricas de uso real (DAU, MAU, instalaciones por provider) — ningún vendor las publica.
- Detalle de los "57 slop-gates" de hallmark — el README no los desglosa, el repo no expone su lista pública.
- Detalle de la "macroestructura" de hallmark en cada uno de los 21 temas — solo accesible vía uso de la skill o vía `site/_tests/`.
- Versión exacta y API del binario `impeccable` más allá del pin `0.1.11` — requeriría leer el `CHANGELOG.md` del binario o el `docs/ENGINE.md` al completo, no hecho en esta investigación.
- Si hallmark y agent-skills instalan hooks en algún vendor — el README de hallmark menciona Claude Code, Cursor y Codex, pero no detalla hook system; agent-skills no menciona hooks.
- Si la skill oficial `frontend-design` se ha actualizado desde septiembre de 2025 — el push del repo padre es 2026-09-29, pero no se ha verificado el changelog de la subcarpeta.

## Anexo B — Lecturas recomendadas

Si solo vas a leer dos cosas después de este artículo, lee estas:

1. **`pbakaus/impeccable` README**, especialmente la sección de anti-patterns y la lista de los 24 comandos. Es la mejor documentación de "qué hace un detector de AI slop en la práctica" que se ha publicado.
2. **`Nutlope/hallmark` README**, la sección de "Four verbs". Cuatro comandos, explicados con la tabla más clara del espacio.

Si quieres entender la postura estética de Anthropic, lee `anthropics/skills/tree/main/skills/frontend-design/SKILL.md` (9.4 KB, 5 minutos). Si quieres entender el ciclo completo, lee `addyosmani/agent-skills` README (la tabla de comandos vale por sí sola).

Y si quieres la **infraestructura** (el transporte que lo une), `vercel-labs/skills` README es la pieza. Sin ese CLI, las otras tres no llegan a tu agente.

---

*Datos primarios: 2 de octubre de 2026. Repo clonado de `pbakaus/impeccable` en `~/proyectos/impeccable-investigacion/`. Verificación cruzada con la API pública de GitHub. Limitaciones declaradas en el Anexo A.*
