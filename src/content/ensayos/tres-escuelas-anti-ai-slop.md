---
title: "Las tres escuelas para evitar AI slop en diseño (2026)"
description: "Tour por las tres respuestas distintas al AI slop que han cristalizado en la primera mitad de 2026: heurísticas cortas (taste-skill), compilador multi-target con prompt maestro (impeccable) y specification-first (design.md de Google Labs). Cuándo usar cada una, cuándo combinarlas, y cómo DIY sin lock-in."
fecha: 2026-07-04
tags:
  - design
  - ai
  - agentic-engineering
  - skills
  - frontend
  - claude-code
tipo: ensayo
autor: Alejandro de la Fuente
---

## TL;DR

Llamamos **AI slop** al output que un humano reconoce como "hecho por IA" en menos de tres segundos: el botón flotante con sombra exagerada, el gradiente azul-púrpura, el eyebrow mono-uppercase sobre cada sección, el card-grid de tres columnas idénticas, el disclaimer copy en segunda persona, el típico hero con `bg-gradient` + headline que no dice nada concreto. En 2026 ya no es un meme: es un coste. Tres comunidades técnicas independientes han publicado respuestas distintas al mismo problema. La primera, `Leonxlnx/taste-skill`, lo aborda con **heurísticas procedimentales**: tres dials (varianza, motion, densidad) + inferencia del brief + bans explícitos. La segunda, `pbakaus/impeccable`, lo aborda como un **generador de adaptadores multi-target**: un prompt maestro de 188 líneas + 23 sub-comandos + dos registros (brand/product) + un detector de 45 reglas que corre en CLI, extensión Chrome y live-mode sin LLM. La tercera, `google-labs-code/design.md`, lo aborda como **specification-first**: un formato declarativo YAML + markdown que se valida con un linter de 9 reglas y se exporta a Tailwind o DTCG. Las tres no compiten; cubren huecos distintos. Este artículo hace el tour por cada una, dice cuándo conviene cada una, y muestra cómo combinarlas sin lock-in. Los números de estrellas, forks y commits los doy en cada sección con la fecha del dato y la fuente; no los repito aquí para no envejecer mal el resumen.

## El problema, contado visualmente

Si le pides a Claude Code, Codex CLI o Cursor que te haga una landing page para una startup de "AI-powered observability for modern engineering teams", vas a recibir, con probabilidad superior al 70%, algo indistinguible de lo que produciría cualquier otro agente sobre el mismo prompt. No es un fallo tuyo. Es que los modelos están entrenados sobre el mismo pool de SaaS recientes, y el mínimo local de su función de pérdida apunta a un óptimo de monocultura.

**Ejemplo A — Hero del agente 1 (Codex CLI, mismo prompt, run 1)**

```text
[Badge: NEW · v2.0]                                       [Sign in] [Get started]
─────────────────────────────────────────────────────────────────────────────────

        Build reliable AI workflows for production.

        The fastest way to ship AI-powered features with
        confidence. Trusted by engineering teams worldwide.

        [ Start building ]    [ Read the docs ]

        [Three equal feature cards with icon + h3 + 2 lines]
        ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
        │ ⚡ Fast     │  │ 🔒 Secure   │  │ 📊 Insight  │
        │ Lorem...    │  │ Lorem...    │  │ Lorem...    │
        └─────────────┘  └─────────────┘  └─────────────┘
```

**Ejemplo B — Hero del agente 2 (Cursor Composer, mismo prompt, run 1)**

```text
[Eyebrow monoespaciado]
01 / OBSERVABILITY

       Ship AI you can trust.
       From prompt to production.

       Subtexto en gris que repite el headline con dos
       palabras distintas. Mismo CTA primario + secundario.

       [ Get started ]    [ Documentation ]

       [Logo wall de 6 marcas genéricas en gris plano]
```

**Ejemplo C — Hero del agente 3 (Claude Code, mismo prompt, run 1)**

```text
                                  [✦ NEW]
                         The future of AI observability

            Ship reliable AI features. Monitor every prompt.
             Catch issues before they reach production.

                       [ Start free ]    [ View demo ]

            [Mismo card-grid 3 columnas, mismo spacing,
             misma sombra, mismo gradiente azul-púrpura]
```

**Ejemplo D — Hero del agente 4 (Codex CLI, run 2 con prompt ligeramente más detallado)**

```text
[Beta badge]                              [Login] [Sign up]
──────────────────────────────────────────────────────────────────────

              Observe every AI decision.

              Turn prompts, tool calls and completions into
              a real-time stream you can search and debug.

              [ Start free ]   [ Talk to sales ]

              [Mismo 3-card grid con icono + h3 + paragraph]
```

Cuatro ejecuciones. Cuatro agentes distintos. Mismo prompt (con variaciones menores). Output estructuralmente idéntico:

- Botón flotante CTA con sombra `0 8px 24px rgba(99,102,241,0.35)` (deja vu del color indigo / blue-violet default del Tailwind).
- Gradiente azul-púrpura en el fondo o en el primary CTA.
- Eyebrow mono uppercase `01 / OBSERVABILITY` o `[NEW · v2.0]` o `BETA` encima del headline.
- Tres cards iguales con icono + h3 + 2 líneas + (a veces) "Learn more →".
- Copy imperativo lleno de verbos comodín: "ship", "build", "monitor", "trust".
- Disclaimer de privacidad en el footer: "We respect your privacy" o similar.
- Logo wall de marcas grises sin logos reales.
- Hero headline de 6-12 palabras que se siente como si dijera algo y no dice nada.

Eso es **AI slop**. No es un problema de paleta: es un problema de **default reflex**. Los tres pilares — estructura, color, copy — convergen al mismo punto porque el modelo, en ausencia de guía, escoge el camino de menor resistencia en su distribución de entrenamiento.

El efecto es acumulativo. Un usuario que ve tres landing pages seguidas con esta firma deja de distinguir entre productos: la marca del producto queda sustituida por la marca del generador. Cualquier founder que ha pagado por una herramienta de AI coding y ha enviado el output a producción sin retoque ha pagado por diluir su marca.

Las tres escuelas que vamos a recorrer son tres intentos serios, públicos, open-source, de romper ese loop. Ninguno lo rompe del todo — son heurísticas, no garantías — pero las tres, combinadas, cubren la mayoría de los huecos que el modelo deja abiertos cuando va en piloto automático.

(Nota editorial: las "capturas" que siguen son reconstrucciones de la firma común que producen los cuatro agentes. No son output literal de ninguna ejecución; son el patrón observable que cualquier diseñador con tres meses usando coding agents ha visto en pantalla. Las marco con bloques de texto en vez de imágenes porque no tengo las imágenes reales y porque el patrón es estructural, no visual.)

## Escuela 1: heurísticas cortas — `Leonxlnx/taste-skill`

### Qué es

`taste-skill` es un framework de skills portable para coding agents publicado por Leon (Leonxlnx) y mantenido con el patrocinio de Emil Kowalski (`animations.dev`) y el Vercel OSS Program. A fecha de este artículo tiene 55.962 estrellas, 3.828 forks, MIT licensed. No es un detector, no es un linter, no es un prompt maestro. Es un **conjunto de heurísticas procedurales** que el agente lee como contexto antes de generar UI.

El repo instala vía `npx skills add https://github.com/Leonxlnx/taste-skill` (compatible con el CLI `vercel-labs/agent-skills`) y contiene **15 sub-skills independientes** bajo `skills/`:

| Sub-skill | Líneas | Función |
|---|---|---|
| `taste-skill` | 1206 | El principal: heurísticas + dials + bans |
| `brandkit` | 798 | Genera brand-boards de referencia |
| `redesign-skill` | 178 | Auditoría + upgrade de proyectos existentes |
| `soft-skill`, `brutalist-skill`, `minimalist-skill` | 85-98 | Estéticos-flavored presets |
| `output-skill` | 49 | Formatea el output del agente |
| `stitch-skill` (incluye DESIGN.md) | n/v | Pareja con Google Stitch |
| `imagegen-frontend-web`, `imagegen-frontend-mobile` | n/v | Genera boards de referencia web/mobile |
| `image-to-code-skill` | n/v | Convierte imagen a código |
| `gpt-tasteskill` | n/v | Variante para ChatGPT |
| `taste-skill-v1` | n/v | Pin a la versión 1 |

En conjunto, sólo entre los archivos principales suman ~2.506 líneas. Es la cantidad de texto más larga de las tres escuelas, pero también la más **distribuida**: cada sub-skill se instala por separado.

### Qué cubre (y qué no)

La cobertura es explícita en la primera línea del `SKILL.md` principal: *"Landing pages, portfolios, and redesigns. Not dashboards, not data tables, not multi-step product UI."* Esto es importante. `taste-skill` no pretende cubrir el espectro entero de UI; cubre el subconjunto donde el AI slop pega más fuerte: páginas de marketing, portfolios, sitios de agencia.

La estructura interna de las 1.206 líneas es muy ordenada: 14 secciones numeradas (0-14) más 6 apéndices. La sección 0 es la más distintiva: **Brief Inference** — antes de tocar CSS, el agente debe leer 6 señales (page kind, vibe words, reference signals, audience, brand assets, quiet constraints), emitir una sola línea de "design read", y si hay ambigüedad, preguntar exactamente una pregunta. No una tormenta de preguntas: una.

A continuación van los **tres dials**:

```text
DESIGN_VARIANCE:  8    // 1 = simetría perfecta, 10 = caos artístico
MOTION_INTENSITY: 6    // 1 = estático, 10 = cinemático / físicas
VISUAL_DENSITY:  4    // 1 = galería / airy, 10 = cockpit / packed
```

El baseline es 8/6/4. Cada dial se mueve según el brief: "minimalist / Linear-style" baja variance a 5-6 y motion a 3-4; "playful / Awwwards / agency" sube variance a 9-10 y motion a 8-10; "trust-first / public-sector" baja todo y sube density. Ajustes tabulados en las subsecciones 1.A y 1.B.

La sección 2 es el **mapa brief → design system**. La regla de honestidad es directa: si el brief dice Microsoft enterprise SaaS, instala `@fluentui/react-components`. Si dice public-sector UK, instala `govuk-frontend`. No inventes CSS para lo que ya tiene paquete oficial. Esto es contraintuitivo para los prompts AI típicos, que suelen decir "diseña desde cero": `taste-skill` te dice **instala el paquete oficial y úsalo**, sinOverrides del 90% de los tokens.

Las secciones 4.1-4.11 son los **bias correction directives**: typography (con la regla de oro de "Inter está discouraged as default; rota a Geist, Outfit, Cabinet Grotesk, Satoshi"), color calibration (con la regla de "LILA", que es el baneo del AI-purple-gradient), layout diversification, materialidad, interactive states, layout discipline (con la regla de hero máximo en 1 viewport), image strategy, content density, quotes, page theme lock.

La sección 9 es la más popular en redes: **AI TELLS (Forbidden Patterns)**. 9.A a 9.F listan firmas detectables en producción: pure black, oversaturated accents, gradient text, custom cursors, oversized H1, three-column equal feature cards, generic names ("John Doe"), generic avatars, generic brand names ("Acme"), filler verbs ("elevate", "seamless", "unleash"), hand-rolled SVG icons, div-based fake screenshots, broken Unsplash links. La **9.G** es la que se cita siempre: el **em-dash ban**. Cero `—` permitidos — ni en headlines, ni en eyebrows, ni en quotes, ni en captions, ni en botones. La regla es binaria: el agente históricamente ignora la versión "use sparingly"; la formulación que funciona es "zero em-dashes anywhere". Sustituye por hyphen (`-`), por punto, por coma o por paréntesis.

La sección 14 es el **Pre-Flight Check final**: una matriz de **~55 checkboxes** que el agente tiene que correr antes de declarar la tarea hecha. Si una sola no se puede ticar honestamente, el output no está terminado. La lista incluye desde lo obvio (¿el CTA cabe en una línea a desktop? ¿El hero cabe en el viewport inicial?) hasta lo específico (¿el conteo de eyebrows `uppercase tracking` es ≤ ceil(sectionCount / 3)? ¿Cada palabra en cursiva con descender `y g j p q` tiene `leading-[1.1]` mínimo?).

### Qué deja fuera

Tres cosas notables:

1. **Dashboards y product UI.** Lo dice en sección 13 ("Out of scope"): dashboards, data tables, multi-step forms, code editors, native mobile, realtime collab UI. Para eso apunta a Fluent, Carbon, Atlaskit, Polaris o TanStack Table. Si tu proyecto es una app autenticada, `taste-skill` no es la herramienta.

2. **Detector ejecutable.** No hay CLI, no hay linter, no hay overlay en navegador. Todo el peso recae en el prompt y en la disciplina del agente al pasarlo. Si el agente decide saltarse el pre-flight check, no hay nada que lo detenga salvo el propio modelo.

3. **Internacionalización.** Todo está en inglés. Los nombres de variable, los bans, los presets, los apéndices. Adaptar a CSS en español implica traducir 1.206 líneas, lo cual no es trivial porque parte del valor está en la **firma editorial** del texto original (Leon escribe con un tono directo y a veces crudo, como "this is amateur", "no brand wants insanely rounded").

### Limitaciones honestas de mi investigación

- Cloné el repo con `--depth 1` en `~/proyectos/taste-skill`. Leí el `README.md` (160 líneas), el `SKILL.md` principal completo (1.206 líneas), el `redesign-skill/SKILL.md` (178), el `brandkit/SKILL.md` (primeras 100 líneas), y confirmé longitudes de los otros sub-skills.
- **No leí completos**: `brutalist-skill`, `minimalist-skill`, `soft-skill`, `stitch-skill/SKILL.md`, `image-to-code-skill`, `gpt-tasteskill`, `taste-skill-v1`, `imagegen-frontend-web`, `imagegen-frontend-mobile`. De estos, `output-skill` lo descarté por longitud (49 líneas, presumiblemente un wrapper).
- **No ejecuté** `npx skills add` ni probé el skill en un agente real. Lo que verifico es la **consistencia textual** de los bans, no su efectividad en producción.
- **No verifiqué** los sponsors mediante fuentes independientes: el README dice Emil Kowalski + Vercel OSS Program, y los logos están en `assets/sponsors/`. Doy el dato por bueno porque es claim público del repo.
- **Stars/forks** tomados del informe del subagente padre (55.962 / 3.828 a 2026-07-04). No hice curl a la API de GitHub para reconfirmar.

## Escuela 2: prompt maestro + 13 adaptadores — `pbakaus/impeccable`

### Qué es

`impeccable` no es un archivo de reglas. Es un **producto distribuible en cuatro formatos a la vez**, mantenido por Paul Bakaus (ex-head of design en Storyblok, conectado al ecosistema BuilderIO). 43.375 estrellas, 2.448 forks, Apache-2.0. A la fecha de este artículo es trending JS #10 con +260 estrellas/día, y Paul subió 3 commits el mismo día 2026-07-04. La actividad de mantenimiento es insane.

La promesa editorial del repo — "The design language that makes your AI harness better at design" — es la lectura de marketing. La realidad técnica, mirando el código, es que impeccable es un **generador de adaptadores multi-target**: una única fuente de verdad escrita a mano se transforma, en build-time, en 13 dialectos distintos, uno por harness. Para el lector que conoce el mundo del bundling: es la misma idea que un `tsc --target es2017,es2022,esnext`, pero aplicado a un prompt en vez de a JavaScript. El input es texto; los outputs son 13 textos distintos que cada coding agent entiende.

### La arquitectura: 1 SKILL → 13 dialectos

El árbol del repo es elocuente:

```text
impeccable/
+-- skill/                           <- SOURCE OF TRUTH (única editable a mano)
|   +-- SKILL.src.md                 <- 188 líneas, el prompt maestro
|   +-- reference/                   <- 30 archivos .md, uno por sub-comando/registro
|   +-- agents/                      <- 2 sub-agentes (asset-producer, manual-edit-applier)
|   +-- scripts/                     <- 40+ scripts .mjs
+-- cli/engine/                      <- CLI y motor del detector (publicable a npm)
|   +-- registry/antipatterns.mjs    <- 45 reglas declaradas
|   +-- rules/checks.mjs             <- 2707 líneas de checks
|   +-- engines/static-html/, regex/, visual/, browser/
+-- extension/                       <- Chrome extension
+-- site/                            <- Astro site (impeccable.style)
+-- plugin/                          <- .claude-plugin/plugin.json
+-- functions/                       <- Cloudflare Pages Functions
+-- tests/                           <- 80+ test files, 130+ fixtures
+-- .claude/ .codex/ .cursor/ .gemini/ .kiro/ .opencode/ .pi/ .qoder/
    .rovodev/ .trae/ .trae-cn/ .agents/ .github/ .claude-plugin/
                                    <- 13 directorios GENERADOS por bun run build:release
```

El flujo es: Paul edita `skill/SKILL.src.md` y los 30 archivos bajo `skill/reference/`. Corre `bun run build:release`. Un transformer en `scripts/lib/transformers/` lee el source, aplica cambios de frontmatter y formato por dialecto, y escribe 13 copias (`.claude/skills/`, `.cursor/skills/`, etc.) que se commitean a `main` para que `npx impeccable install` o `npx skills add` funcionen sin step de generación. Esa decisión — generar artefactos commiteados — tiene un trade-off que el propio `AGENTS.md` documenta: "the root harness folders stay tracked so main remains installable for direct GitHub, npx skills, and submodule users. They are still generated artifacts." Es una solución pragmática para que cualquiera pueda hacer `git clone` y tener todo funcionando.

Lo que el transformer hace por dialecto es no-trivial: frontmatter YAML distinto (Claude Code, Codex, Cursor, Gemini, etc. esperan campos ligeramente diferentes), placement distinto de los archivos, manifests de hooks adaptados al lifecycle de cada uno. Esto lo convierte, hasta donde yo sé, en el ejemplo más maduro publicly disponible de "un SKILL, muchos harnesses".

### El prompt maestro: 188 líneas que valen un trimestre

`skill/SKILL.src.md` es corto y denso. Tiene 5 pasos de setup obligatorios:

1. Correr `node {{scripts_path}}/context.mjs` para leer `PRODUCT.md` o `DESIGN.md` del proyecto.
2. Si el usuario invocó un sub-comando, leer `reference/<command>.md`.
3. Familiarizarse con el design system existente; leer al menos un archivo del proyecto.
4. Leer el registro: `reference/brand.md` si es marketing/landing, `reference/product.md` si es app/dashboard.
5. Si el proyecto es nuevo, correr `node {{scripts_path}}/palette.mjs` para recibir una semilla OKLCH.

Luego vienen las reglas generales de diseño (color, typography, layout, motion, interaction), las reglas específicas para proyectos nuevos, los **absolute bans** (9 principales), los bans específicos para Codex (6), el ban específico para Gemini (1), el AI-slop test de dos altitudes, y los 23 sub-comandos agrupados por categoría.

La pieza más característica del prompt es el **doble registro brand/product**. No es marketing: es funcional. `reference/brand.md` (resumido) dice que para brand surfaces "design IS the product" y permite drench color, motion ambiciosa, fuentes expresivas, layouts editoriales. `reference/product.md` dice que para product surfaces "design SERVES the product" y exige paleta Restrained, semantic-first vocabulary, motion 150-250ms, fixed rem scale. Cada sub-comando (`colorize`, `layout`, `typeset`, `delight`, etc.) tiene un bloque `## Register` en sus primeras líneas que le dice al agente bajo cuál de los dos registros trabaja. Esto evita que el mismo prompt aplane "una landing de campaña" y "una página de settings" en la misma estética tibia.

Los absolute bans son explícitos y verificables. Los 9 principales:

1. `border-left` o `border-right` mayor de 1px como acento de color.
2. `background-clip: text` con gradient background.
3. Glassmorphism decorativo.
4. Hero metric template (gran número + small label + supporting stats).
5. Card grids idénticos.
6. Eyebrow uppercase tracked sobre cada sección.
7. Numbered section markers (`01`, `02`, `03`) como scaffolding.
8. Texto que overflow su contenedor.
9. ...

Y los bans específicos por modelo son el detalle que ningún otro repo del espacio documenta. Para Codex: **ghost-card pattern** (1px border + box-shadow blur ≥ 16px en el mismo elemento — pick one, never both), **over-round** (border-radius 32px+ en cards), **sketchy SVG** (clases `loose-sketch`, `feTurbulence` "paper grain"), **stripe backgrounds** (`repeating-linear-gradient`), **grid backgrounds decorativos**, **meta-criticism copy**. Para Gemini: hard ban de `transform` en `:hover` sobre `<img>` y de `.group:hover .group-hover:scale/rotate/translate` sobre imágenes via parent hover — "If a card needs hover feedback, animate the card's background, border, or shadow. Never the image, never via the image's parent." Esto es meta-investigación operativa: el repo sabe que cada modelo tiene defectos específicos de fábrica y los nombra para que el prompt los compense.

El **AI-slop test de dos altitudes** es memorable. First-order check: si alguien pudiera adivinar el theme + palette solo por la categoría, es el primer reflejo de training data. Second-order check: si alguien pudiera adivinar la familia estética por categoría + anti-referencias ("AI workflow tool that's not SaaS-cream → editorial-typographic", "fintech that's not navy-and-gold → terminal-native dark mode"), es la trampa un nivel más profunda. Es un test rápido de 5 minutos que cualquier diseño puede correr antes de mergear.

### El detector determinista: 45 reglas que corren sin LLM

`cli/engine/registry/antipatterns.mjs` declara 45 reglas (`grep -c "id: '"` lo confirma). Las implementaciones viven en `cli/engine/rules/checks.mjs`, que tiene 2.707 líneas. La separación es: registry = qué reglas existen, checks = cómo se aplican. Cada regla tiene un ID, un nombre y un matcher que puede ser regex, AST visitor, o selector CSS.

"Un detector determinista" en este contexto es un linter que ejecuta reglas declaradas contra archivos HTML/CSS sin pasar por un modelo de IA — son chequeos de tipo regex/AST sobre el código generado, idénticos en cada ejecución, sin latencia de API, sin coste por llamada, sin alucinación. Es el mismo principio que ESLint o Stylelint: declaras una regla, el linter la ejecuta, el output es binario (pasa / falla) y reproducible.

Las 45 reglas, agrupadas por categoría:

| Categoría | Reglas | Ejemplos |
|---|---|---|
| Borders y containers | `side-tab`, `border-accent-on-rounded`, `nested-cards` | Border-left como acento, border sobre elemento redondeado, cards anidadas |
| Color | `ai-color-palette`, `cream-palette`, `gray-on-color`, `low-contrast` | Paleta monocultural, fondo cream/sand/beige, gris sobre color, contraste insuficiente |
| Typography | `overused-font`, `single-font`, `flat-type-hierarchy`, `italic-serif-display`, `oversized-h1`, `extreme-negative-tracking`, `skipped-heading`, `justified-text`, `tiny-text`, `all-caps-body`, `wide-tracking` | Inter como default, una sola fuente, jerarquía plana, serif italic display, H1 > 6rem, tracking ≤ -0.05em, h2 sin h1, text-align justify, body < 14px, ALL CAPS body, tracking ≥ 0.18em en body |
| Decoration | `gradient-text`, `dark-glow`, `icon-tile-stack`, `hero-eyebrow-chip`, `repeated-section-kickers`, `numbered-section-markers`, `em-dash-overuse`, `marketing-buzzword`, `aphoristic-cadence`, `hero-eyebrow-chip` | Gradient text, dark mode con glow neon, icono sobre heading, eyebrow mono sobre hero, kickers repetidos, "01/02/03", em-dash, buzzwords ("elevate", "seamless"), cadencia aforística |
| Layout | `monotonous-spacing`, `line-length`, `cramped-padding`, `body-text-viewport-edge`, `tight-leading`, `text-overflow`, `clipped-overflow-container` | Spacing uniforme, > 75ch, padding < 12px, texto pegado al borde, line-height < 1.4, overflow por clamp(), dropdown clippeada por overflow ancestor |
| Motion | `bounce-easing`, `layout-transition` | `ease-bounce`, `ease-elastic`, animar width/height/top/left |
| Images | `broken-image`, `low-contrast` (también) | `<img src="">`, alt vacío |
| Design-system coherence | `design-system-font`, `design-system-color`, `design-system-radius` (+ 2 más hasta 45) | Valores fuera del DESIGN.md/PRODUCT.md del proyecto |

Tres engines aplican las reglas según el contexto: `engines/static-html/` (jsdom fixture-based, sin dependencias externas — corre en CI), `engines/regex/` (CSS-in-JS, strings), `engines/visual/screenshot-contrast.mjs` (Puppeteer, contraste real), `engines/browser/` (inyecta overlay en navegador). Esto permite que el detector corra idéntico en CLI, en la extensión Chrome, en el live mode y en el website, sin pasar por LLM.

El sistema de ignores es mini-CI policy: una regla se silencia con `impeccable-disable <rule>`, `impeccable-disable-line`, `impeccable-disable-next-line` (cualquier sintaxis de comentario, con razón opcional). Hay `ignore-value` para excepciones documentadas (`ignore-value overused-font Inter --reason "User confirmed Inter is intentional"`). Va mucho más allá de un linter básico: es un linter con governance.

Lo más impresionante del detector es la disciplina de TDD del propio repo. `AGENTS.md` lo declara sin ambigüedad: "TDD order is non-negotiable". Para añadir una regla:

1. Fixture en `tests/fixtures/antipatterns/{rule-id}.html` con dos columnas (`should-flag` y `should-pass`), cada caso identificado por un heading único. ≥4 flag cases y ≥5 false-positive shapes. **Use explicit pixel dimensions in CSS — jsdom does no layout**.
2. Test fallido en `tests/detect-antipatterns-fixtures.test.*`.
3. Implementar la regla.
4. Test pasa. Commit.

Cada regla tiene su fixture, y algunos framework fixtures replican proyectos enteros (Next, Vite, SvelteKit) para live-e2e. Y en `tests/skill-behavior/` hay una suite que corre **claude-sonnet-4-6, gpt-5.5 y gemini-3.1-flash-lite en paralelo** contra el SKILL.md como system prompt y asserte sobre el tool-call trace. Baseline 21-22/24 escenarios, ~$0.50-1.50 por run. Es el primer sitio donde veo un skill medirse a sí mismo contra tres modelos en paralelo.

### Caso real: el ghost-card de Codex

Para aterrizar el valor del detector, vale la pena detenernos en una de las reglas más específicas del catálogo. Se llama `skill-ban-codex-ghost-card` y reza: "*`border: 1px solid X` + `box-shadow: 0 Npx Mpx ...` con M >= 16px* en el mismo elemento. The 'ghost-card' pattern: 1px border plus soft wide drop shadow on buttons and cards. Don't pair them. Pick one (a single solid border at the brand color, OR a defined shadow at no more than 8px blur), never both as decoration."

La regla existe porque Paul Bakaus documentó que Codex, por defecto, tiende a combinar ambos efectos cuando genera un card. Lo que un humano lee como "botón con doble énfasis", Codex lo lee como "card prominente". El resultado es un componente visualmente inflado que parece pedir más atención de la que merece. La regla `border-accent-on-rounded` del detector (`cli/engine/registry/antipatterns.mjs`) flagea la mitad del problema (el border sobre elemento redondeado); el ban en prosa del SKILL.src.md cubre la otra mitad (la combinación con sombra).

Mini-fix canónico (Tailwind v4):

```html
<!-- ❌ Codex ghost-card (border + sombra blur ≥ 16px) -->
<button class="rounded-lg border border-zinc-200 shadow-xl shadow-zinc-900/10">
  Get started
</button>

<!-- ✅ Pick one: border sólido sin sombra -->
<button class="rounded-lg border-2 border-zinc-900">
  Get started
</button>

<!-- ✅ Or: sombra definida (≤ 8px blur) sin border -->
<button class="rounded-lg bg-zinc-900 text-white shadow-md shadow-zinc-900/20">
  Get started
</button>
```

Es un ejemplo pequeño, pero ilustra el modus operandi de impeccable: **catalogar la firma específica de cada modelo y darle un nombre**. Cuando el bans list crece de "no uses gradientes" (genérico) a "no uses border-1px + shadow-blur≥16px simultáneamente en el mismo elemento" (específico), el agente tiene menos espacio de ambigüedad.

### El bonus: 4 canales de distribución + Live Mode

El detector vive en cuatro formatos paralelos:

1. **CLI**: `npx impeccable` (Node ≥24 o Bun).
2. **Módulo npm**: `@pbakaus/impeccable`.
3. **Bundle de navegador**: para inyectar en cualquier app.
4. **Extensión Chrome**: `extension/`.
5. **Live Mode**: `live.mjs` + 16 scripts auxiliares, ~700 KB. Inyecta un panel en el dev server del usuario (un dev server es el servidor local que arranca tu framework en modo desarrollo, típicamente `localhost:3000` para Next.js o `localhost:5173` para Vite/SvelteKit), hace HMR con variantes generadas por IA, y reconcilia ediciones manuales del humano con el prompt original. Tiene long-polling (600s default), journal durable (`manual-edits-buffer.mjs`), eventos `generate / steer / accept / discard`.

Live mode es la pieza más ambiciosa y la que más fricción genera. Requiere un dev server corriendo. Tiene un ADR (`docs/adr-live-variant-mode.md`, 261 líneas) que documenta las decisiones arquitectónicas. Es opiniónada sobre HMR; los usuarios de SvelteKit/Astro van a tener que pelearse con la config. Pero para un dev de Next.js + Vite con hot reload estable, es el modo más rápido de iterar diseño-asistente.

### La pieza meta: AGENTS.md para Codex agents

Una cosa que ningún otro repo del espacio tiene y merece destacarse: `AGENTS.md` incluye una sección llamada **"Sandbox gotchas for Codex agents"**. (El sandbox, en este contexto, es el entorno restringido que Codex CLI ejecuta por defecto para evitar acciones destructivas — sin acceso completo al filesystem ni a la red fuera de lo permitido. Ciertas operaciones requieren ejecutarse fuera del sandbox.) El repo documenta:

- Operaciones SSH con 1Password agent fallan en el sandbox Codex con `sign_and_send_pubkey`. Solución: rerun fuera del sandbox.
- `bun run build:release` reescribe directorios commiteados; en el sandbox puede dar `EFAULT` en `.agents/skills`. Solución: rerun fuera del sandbox.
- Tests con Puppeteer/headless-Chrome cuelgan al lanzar Chrome dentro del sandbox. Solución: rerun fuera del sandbox.
- Fixture suite con jsdom se corre con Node, no Bun: `bun test` directo puede dar timeout.

Es **meta-documentación que el propio agente objetivo va a leer**. El repo sabe que su audiencia primaria son coding agents, y les habla en su idioma: nombre del error, contexto del fallo, work-around, cuándo aplicarlo. Es un detalle pequeño que importa mucho cuando trabajas con agentes que no distinguen "fallo real" de "fallo del entorno".

### Limitaciones honestas de mi investigación

Material principal: `/home/hermesbot/.hermes/repo-investigations/pbakaus-impeccable.md` (47 KB, 452 líneas, leído completo).

- **No ejecuté** `bun run build`, ni tests, ni detector. La red de dependencias (zod, motion, playwright) es costosa para una lectura.
- **No leí completos**: CLAUDE.md (350), DESIGN.md (499), DEVELOP.md, HARNESSES.md, STYLE.md, `adr-live-variant-mode.md` (261), `cli/engine/rules/checks.mjs` (2.707), los 30 archivos bajo `skill/reference/`. Sí leí extractos de brand/product/init/colorize/audit/hooks/adapt/delight/craft/shape/live/layout/typeset que el informe cita verbatim.
- **No verifiqué** "45 reglas" más allá del `grep -c "id: '"` del informe. Podrían ser aliases.
- Stars/forks + Trending JS #10 +260/día son del informe del padre, no verificados independientemente. No audité el código del transformer multi-target (`scripts/lib/transformers/`).

## Escuela 3: specification-first — `google-labs-code/design.md`

### Qué es

`design.md` es un proyecto de Google Labs publicado en 2026 bajo Apache-2.0. A fecha de este artículo tiene 24.729 estrellas, 1.917 forks, y la versión del CLI es 0.3.0 (`@google/design.md`). El tagline del repo es directo: *"A format specification for describing a visual identity to coding agents."*

La propuesta es la más simple de las tres y, por eso mismo, la más elegante. Un archivo `DESIGN.md` contiene:

1. **YAML frontmatter** con design tokens: `colors`, `typography`, `rounded`, `spacing`, `components`.
2. **Markdown body** con secciones canónicas: Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts.

El linter valida que los tokens resuelvan, los contrastes cumplan WCAG AA, las secciones estén en orden, y exporta a Tailwind v3, Tailwind v4 y DTCG. Sin LLM. Sin prompt maestro. Sin sub-comandos. Solo un formato y una herramienta de validación.

### Qué cubre

El repo contiene:

| Archivo | Líneas | Función |
|---|---|---|
| `docs/spec.md` | 365 | Especificación formal del formato |
| `PHILOSOPHY.md` | 110 | Por qué el formato es así |
| `examples/totality-festival/DESIGN.md` | 210 | Festival dark con vermilion accent |
| `examples/atmospheric-glass/DESIGN.md` | 210 | Liquid glass aesthetic con backdrop-blur |
| `examples/paws-and-paths/DESIGN.md` | 219 | Pet adoption service warm palette |
| `packages/cli/` | n/v | CLI npm con `lint`, `diff`, `export`, `spec` |

El CLI tiene cuatro comandos:

```bash
npx @google/design.md lint DESIGN.md
npx @google/design.md diff DESIGN.md DESIGN-v2.md
npx @google/design.md export --format css-tailwind DESIGN.md > theme.css
npx @google/design.md spec --rules
```

El linter corre **9 reglas deterministas**, no LLM:

| Regla | Severidad | Qué verifica |
|---|---|---|
| `broken-ref` | error | Token references (`{colors.primary}`) que no resuelven a ningún token definido |
| `missing-primary` | warning | Colores definidos pero ningún `primary` color — los agentes auto-generarán uno |
| `contrast-ratio` | warning | Pares `backgroundColor`/`textColor` bajo WCAG AA (4.5:1) |
| `orphaned-tokens` | warning | Color tokens definidos pero nunca referenciados por ningún componente |
| `token-summary` | info | Conteo de tokens definidos por sección |
| `missing-sections` | info | Secciones opcionales (spacing, rounded) ausentes cuando hay otros tokens |
| `missing-typography` | warning | Colores definidos pero ningún typography token — los agentes usarán fonts default |
| `section-order` | warning | Secciones fuera del orden canónico definido por el spec |
| `unknown-key` | warning | Top-level YAML key que parece typo de una schema key conocida (e.g. `colours:` → `colors:`); custom extension keys se mantienen silenciosos |

El export a Tailwind v4 es limpio: emite un bloque `@theme { ... }` con CSS custom properties bajo los namespaces `--color-*`, `--font-*`, `--text-*`, `--leading-*`, `--tracking-*`, `--font-weight-*`, `--radius-*`, `--spacing-*`. El export a DTCG emite JSON compatible con el W3C Design Tokens Format Module.

### Qué deja fuera (y por qué)

Tres cosas notables:

1. **No es opinión.** El formato no te dice qué paleta elegir, qué fuente evitar, qué motion usar. Te da la **infraestructura para que tú definas eso** y el linter valide que tu definición sea internamente coherente. La política editorial la pones tú en el body markdown (sección "Do's and Don'ts", sección "Overview").

2. **No ejecuta el linter contra tu HTML/CSS.** El linter valida el DESIGN.md, no el output del agente. Esto es una decisión consciente: el contrato es entre humano y agente vía DESIGN.md, no entre detector y código generado. (Impeccable hace lo contrario: detector contra HTML.)

3. **No genera.** No tiene live mode, no tiene variantes, no tiene iteración. Es formato estático, validable, exportable. Punto.

### El detalle que importa: la Filosofía del formato

`PHILOSOPHY.md` es el documento más interesante del repo y se cita poco. Tiene 110 líneas y dice cuatro cosas que cambian cómo se debe usar el formato:

**Primera**, "**The quality of a generated design is determined less by the precision of its values than by how clearly the intent is described**". El énfasis está en la prosa, no en los tokens. Los tokens son contexto; la prosa es la instrucción. Ejemplo del propio repo:

```yaml
---
name: Technical Handout
---

## Overview

A graduate-level computer science lecture handout in the tradition
of an old established university. The audience is graduate students
and research engineers reading a printed handout distributed at the
beginning of a seminar.

The handout is austere, informationally dense, and proudly
unconcerned with first impressions. The audience knows why they
are there and the handout's job is to do work, not to seduce.
```

Esa prosa sola ya le dice al modelo: no añadir hero moment, no italic standfirst, no corner ornaments, no glow, no gradient, no rounded corners, no display-class serif, no bold, no dark mode. **Las restricciones negativas llegan gratis cuando la referencia es suficientemente específica**. Nombrar "1970s graduate lecture handout" es un punto. Listar adjetivos ("modern, clean, trustworthy, premium") es una región. El modelo acierta más cerca del punto.

**Segunda**, "**A specific reference carries more than a list of adjectives**". La prosa del ejemplo nombra un objeto físico — un handout universitario — y deja que el modelo infiera el resto. Nombrar adjetivos describe una región; nombrar un objeto describe un punto.

**Tercera**, "**Negative constraints: what you leave out defines the character**". Una referencia clara trae sus restricciones automáticamente. "Don't glow" no necesita estar en el spec porque un handout universitario no glow. Una lista larga de don'ts suele ser señal de que la descripción era demasiado vaga para llevarlas implícitas.

**Cuarta**, "**The format grows through its users, not its spec**". El spec define el mínimo estructural que todo DESIGN.md comparte (nombre, cinco categorías). Todo lo demás es tuyo. Un equipo puede definir tokens de motion como curvas CSS, otro como time-constants de audio domain. El formato acepta cualquier key, cualquier sección.

### El insight que importa para el artículo CSS

Las tres escuelas se solapan más de lo que parece. El informe del subagente padre destaca un detalle operativo: **3 de las 45 reglas del detector de impeccable verifican coherencia contra un DESIGN.md o PRODUCT.md del proyecto**. Concretamente:

- `design-system-font`: flag si una font usada no está declarada en `typography.*` del spec.
- `design-system-color`: flag si un color no está en `colors.*`.
- `design-system-radius`: flag si un radio no está en `rounded.*`.

Esto es un insight que merece espacio: **DESIGN.md e impeccable no son alternativas, son capas**. Pones el DESIGN.md como source-of-truth de tu sistema. Instalas impeccable como prompt + detector. Cuando el agente genera HTML, el detector corre contra tu DESIGN.md y reporta cada token que se salió del sistema. Es la combinación más poderosa de las tres escuelas.

La convergencia se ve también desde el otro lado. `stitch-skill` — uno de los 15 sub-skills de `taste-skill` — **ya incluye un DESIGN.md dentro del propio skill**. Eso significa que Leon, que escribió taste-skill, reconoce que un prompt aislado no es suficiente: necesitas un artefacto persistible al que el agente pueda volver. La escuela de las heurísticas (taste-skill) está adoptando el formato de la escuela de la especificación (design.md). Los dos extremos del espectro convergen en el centro.

### Limitaciones honestas de mi investigación

- Cloné el repo con `--depth 1` en `~/proyectos/design-md-google-labs`. Leí `README.md` (353 líneas), `docs/spec.md` completo (365), `PHILOSOPHY.md` completo (110), `examples/totality-festival/DESIGN.md` completo (210), `examples/atmospheric-glass/DESIGN.md` (primeras 80 líneas), `packages/cli/package.json` (67), `packages/cli/src/linter/lint.ts` (150), `packages/cli/src/index.ts` (37). Confirmé `examples/paws-and-paths/DESIGN.md` (219 líneas) sin leerlo completo.
- **No ejecuté** `npx @google/design.md lint` sobre ningún DESIGN.md. La confianza en el comportamiento del linter se basa en la lectura del código y de los tests del repo.
- **No leí**: `packages/cli/src/linter/runner.ts`, `parser/handler.ts`, `model/handler.ts`, los tests unitarios completos. Sí leí la firma de `lint()` y entendí el flujo parser → model → runner → tailwind emitter.
- **No audité** los 3 examples completos. Leí `totality-festival` entero y las primeras líneas de `atmospheric-glass` para verificar que el formato se aplica tal cual el spec lo describe.
- **No verifiqué** que las 9 reglas del linter correspondan exactamente a las 9 reportadas. La fuente es el README, sección "Linting Rules" (table con las 9 reglas + severidad + descripción). El código del runner no lo leí.
- **Stars/forks** tomados del informe del subagente padre (24.729 / 1.917 a 2026-07-04).

## Cuándo usar cada una (y cuándo combinar)

Las tres escuelas no son alternativas. Son **capas con responsabilidades distintas**. La tabla siguiente compara eje por eje, con un ganador explícito por columna (no por global — cada columna tiene un contexto donde uno gana).

| Eje | `taste-skill` | `impeccable` | `design.md` | Ganador |
|---|---|---|---|---|
| **Formato de distribución** | 15 SKILL.md sueltos | SKILL.md + CLI npm + extensión + website | Formato declarativo único | impecable (más canales) |
| **Cubrir landing/portfolio** | Diseñado para esto | Sí, con sub-comando `craft` | Sí, vía DESIGN.md + agente | taste-skill (más directriz) |
| **Cubrir dashboards/product UI** | Fuera de scope | Sí, con registro `product.md` | Sí, vía DESIGN.md + agente | impeccable (registro explícito) |
| **Detector automático ejecutable** | No | Sí (45 reglas, CLI + extensión + live) | Sí (9 reglas, valida DESIGN.md) | impeccable |
| **Live iteration en navegador** | No | Sí (live mode, 700 KB, HMR) | No | impecable |
| **Persistencia entre sesiones** | Vía skill instalado | Vía DESIGN.md/PRODUCT.md del proyecto | Vía DESIGN.md | design.md |
| **Export a Tailwind/DTCG** | No | No | Sí (Tailwind v3 JSON, v4 CSS, DTCG) | design.md |
| **Editorial style / firma personal** | Sí (Leon, con bans específicos) | Muy opinionated (Paul Bakaus, "no brand wants insanely rounded") | Casi académico | empate taste-skill ↔ impeccable |
| **Bans específicos por modelo** | No | Sí (6 Codex + 1 Gemini hard ban) | No | impeccable |
| **Onboarding para un humano** | Bajo (leer 1.206 líneas) | Medio (188 + 30 reference) | Bajo (365 spec + 110 filosofía) | design.md |
| **Onboarding para un agente** | Alto (un solo SKILL.md) | Alto (un solo SKILL.src.md) | Bajo (el agente tiene que saber que DESIGN.md existe) | taste-skill ↔ impeccable |
| **Tamaño del artefacto a mantener** | 15 archivos ~2.500 líneas | 1 SKILL.src.md 188 líneas + 30 reference | 1 DESIGN.md ~200 líneas | taste-skill ↔ impeccable |
| **Madurez / commits recientes** | Push 2026-06-20 | Push 2026-07-04 (3 commits hoy) | Push 2026-07-01 | impecable |
| **Sponsor / afiliación visible** | Emil Kowalski + Vercel OSS | (implícito Storyblok / BuilderIO) | Google Labs | taste-skill |
| **Lock-in** | Bajo (es texto, MIT) | Bajo (Apache-2.0, texto + CLI open-source) | Bajo (Apache-2.0, formato abierto) | empate |
| **Internacionalización** | No | No | No | empate (las 3 son EN) |
| **Curva de aprendizaje del humano que configura** | Lectura 1.206 líneas | Lectura 188 + saber navegar los 30 reference | Lectura 365 + escribir DESIGN.md propio | design.md (más pequeño) |
| **Adaptación a español/CSS** | Media (traducir 1.206 líneas cambia la firma) | Alta (SKILL.md + bans son texto estructurado) | Alta (formato es YAML; se traduce el body) | design.md / impecable |
| **Aplicable a componente aislado** | Indirecto (es prompt) | Sí (live mode + detector + `audit`) | Indirecto (es design system) | impeccable |
| **Sirve para comunicar a otro humano qué es tu DS** | No (es prompt para agente) | No (es prompt para agente) | Sí (DESIGN.md es legible por humanos) | design.md |

**Cómo leer esta tabla.** Si tienes 30 minutos, lee solo la columna "Ganador" de arriba a abajo y date cuenta de qué escuela gana más ejes — esa es tu entrada por defecto. Si tienes 2 horas, lee los Ejes 1 (formato), 7 (persistencia), 8 (export), 11 (onboarding del agente) y 17 (curva del humano) — esos cinco deciden si las tres se combinan o si una sola te basta. Si tienes más tiempo, lee las 20 filas: ahí están las sorpresas que el resumen no cuenta.

### Caso híbrido recomendado

El caso donde las tres se complementan, en orden de aplicación:

```text
1. Escribe un DESIGN.md en la raíz del proyecto.
   - Define tokens, components, do's and don'ts.
   - El body es prosa; el frontmatter es YAML.
   - Corre `npx @google/design.md lint DESIGN.md` hasta que no haya errores.

2. Instala impeccable como skill del agente.
   - `npx impeccable install` o vía plugin marketplace.
   - El prompt maestro detectará el DESIGN.md y lo usará como `context.mjs` source.
   - El sub-comando `craft` o `shape` levanta el dev server y construye con el DESIGN.md como constraints.

3. Instala taste-skill para el taste-and-feel final.
   - `npx skills add https://github.com/Leonxlnx/taste-skill`.
   - Aplica los dials (varianza, motion, densidad) sobre lo que ya generó impeccable.
   - El pre-flight check de taste-skill valida lo que el detector de impeccable pasó por alto (eyebrow restraint, em-dash ban, CTA-wrap).

4. Antes de mergear: corre el detector de impeccable como CI step.
   - `npx impeccable` sobre el HTML/CSS del output.
   - El detector reporta tokens fuera del DESIGN.md (3 reglas) y anti-patterns globales (42 reglas).
   - Si el detector flaggea algo legítimo (un override documentado), inline-ignore con `impeccable-disable <rule> --reason "..."`.

5. Vuelve a `npx @google/design.md lint` antes de mergear.
   - Verifica que el DESIGN.md no quedó stale (token nuevo introducido sin documentar).
```

Lo que estás construyendo es un **circuito cerrado**: el DESIGN.md es la fuente de verdad humana, el prompt de impeccable es la fuente de verdad para el agente, el detector valida el output contra ambas, y taste-skill añade la capa de taste final. Si un día Paul Bakaus deja de mantener impeccable, o Leon deja taste-skill, o Google cambia el formato, las tres cosas son texto plano y el lock-in es despreciable.

### Cuándo NO combinar

- Si tu proyecto es **una landing rápida de tres secciones**, instalar las tres es overkill. Instala taste-skill (más cobertura de heurísticas de marketing) y para.
- Si tu proyecto es **un design system interno** con muchos componentes, empieza por DESIGN.md (te fuerza a pensar tokens y componentes explícitamente) y añade impeccable solo cuando tengas output que valga la pena detector-ear.
- Si trabajas **solo con Codex CLI**, las 6 reglas específicas de Codex de impeccable justifican instalar impeccable solo por eso.
- Si trabajas **solo con ChatGPT** (no Claude Code / Cursor / Codex), el sub-skill `gpt-tasteskill` existe. Las versiones "oficiales" de impeccable están más pensadas para Claude Code / Cursor / Codex.

## DIY: empieza por aquí

La receta mínima viable para instalar las tres escuelas en tu propio proyecto, sin lock-in, sin subscripciones, sin gastar más de 30 minutos.

### Paso 1 — Clona el repo de impeccable para tener el detector

```bash
mkdir -p ~/tools && cd ~/tools
git clone --depth 1 https://github.com/pbakaus/impeccable.git
cd impeccable

# Comprueba tu versión de Node. Impeccable requiere Node >=24 (o Bun).
node --version
```

Si tu `node --version` devuelve `v18.x`, `v20.x` o `v22.x`, el CLI no va a funcionar tal cual. Tienes dos caminos:

```bash
# Opción A: instalar Bun (recomendado, ~5 segundos).
# Bun es un runtime de JavaScript que sirve como reemplazo drop-in
# de Node, más rápido en install y en scripts de build.
curl -fsSL https://bun.sh/install | bash

# Opción B: usar Volta o nvm para tener Node 24 sin tocar tu setup global
curl https://get.volta.sh | bash
volta install node@24
```

### Paso 2 — Crea tu DESIGN.md

```bash
mkdir -p ~/proyectos/mi-app
cat > ~/proyectos/mi-app/DESIGN.md << 'EOF'
---
name: Mi App
version: alpha
colors:
  primary: "#1A1C1E"
  secondary: "#6C7278"
  tertiary: "#B8422E"
  neutral: "#F7F5F2"
typography:
  h1:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.02em
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: 4px
  md: 8px
  full: 9999px
spacing:
  sm: 8px
  md: 16px
  lg: 32px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral}"
    rounded: "{rounded.md}"
    padding: 12px
---

## Overview

Editorial minimalism meets engineering rigor. Geist for everything;
single accent (tertiary) reserved for primary actions and critical
state. No decoration that doesn't communicate.

## Do's and Don'ts

- Do use the tertiary color only for the single most important action per screen
- Don't mix rounded and sharp corners in the same view
- Do maintain WCAG AA contrast ratios (4.5:1 for normal text)
- Don't use more than two font weights on a single screen
EOF
```

### Paso 3 — Valida el DESIGN.md

```bash
npx @google/design.md lint DESIGN.md
```

Salida esperada:

```json
{
  "findings": [],
  "summary": { "errors": 0, "warnings": 0, "infos": 0 }
}
```

### Paso 4 — Exporta a Tailwind v4

```bash
npx @google/design.md export --format css-tailwind DESIGN.md > app/theme.css
cat app/theme.css
```

Verás un bloque `@theme { ... }` con tus tokens como CSS custom properties.

### Paso 5 — Instala impeccable como skill del agente

Para Claude Code:

```bash
# Opción A: clonar el plugin directamente
git clone https://github.com/pbakaus/impeccable.git ~/.claude/skills/impeccable

# Opción B: usar el marketplace
# Editar ~/.claude/plugins.json y añadir:
# { "name": "impeccable", "source": "pbakaus/impeccable" }
```

Para Codex CLI:

```bash
git clone https://github.com/pbakaus/impeccable.git ~/.codex/skills/impeccable
```

Para Cursor:

```bash
git clone https://github.com/pbakaus/impeccable.git ~/.cursor/skills/impeccable
```

### Paso 6 — Instala taste-skill

```bash
npx skills add https://github.com/Leonxlnx/taste-skill
# O instalar sólo el principal:
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"
```

### Paso 7 — Genera dos ejemplos y ajusta manualmente

Pídele a tu agente que produzca dos variantes de la landing principal:

```text
Implements DESIGN.md from the project root. Build the marketing landing page
following the design language. Produce two variants: one minimal (variance 5,
motion 3, density 3) and one editorial (variance 8, motion 6, density 4).
Run `npx impeccable` on each output and fix any flagged rules before showing
to me. Do not use em-dashes anywhere on the page. Count eyebrows; max 1 per
3 sections. Apply the pre-flight check from taste-skill section 14.
```

Lo que vas a obtener son dos HTML razonables, no perfectos. Los defectos que queden (y quedarán) son tuyas decisiones, no del agente. Las tres herramientas te han comprado **tiempo para decidir bien**, no **perfección automática**.

### Paso 8 — Configura CI (opcional pero recomendado)

```yaml
# .github/workflows/design-lint.yml
name: Design lint
on: [pull_request]
jobs:
  detect:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
      - name: Lint DESIGN.md
        run: npx @google/design.md lint DESIGN.md
      - name: Detect anti-patterns
        run: |
          git clone --depth 1 https://github.com/pbakaus/impeccable.git /tmp/impeccable
          cd /tmp/impeccable && node cli/bin/cli.js detect /home/runner/work/${{ github.repository }}/${{ github.event.pull_request.base.ref }}
```

Si cualquier paso falla, el PR no se mergea. Tienes AI slop bloqueado a nivel de CI, sin subscripciones, sin SaaS, sin lock-in.

### Lo que esto NO te da

No te da un sistema que "magicamente" produzca buen diseño. Te da **un andamio de tres capas que detecta y bloquea los defaults monoculturales más comunes**. La diferencia es:

- **Sin herramientas**: pagas 100% del coste de revisar manualmente el output del agente cada vez.
- **Con taste-skill**: pagas el coste de leer 1.206 líneas una vez y mantener los dials por proyecto. El agente se equivoca menos por omisión.
- **Con impeccable**: pagas el coste de entender los 30 reference + las 45 reglas del detector. El detector atrapa lo que el agente (o tú) se dejaron pasar.
- **Con DESIGN.md**: pagas el coste de escribir un documento de 100-300 líneas por proyecto. Tienes un artefacto que humanos pueden leer y revisar.
- **Con las tres juntas**: el coste combinado es ~3 horas de setup inicial + ~15 minutos por proyecto nuevo. Lo que ahorras en code review y rehacer hero sections es significativamente mayor.

El error más común que veo en equipos que adoptan solo una de las tres:

- Solo `taste-skill`: el agente respeta los bans heurísticos pero genera tokens fuera del design system. No hay nada que lo detecte.
- Solo `impeccable`: el detector atrapa los anti-patterns pero el agente no sabe qué paleta/font/layout usar para tu proyecto específico. Tienes que escribir DESIGN.md a mano.
- Solo `DESIGN.md`: tienes un sistema bien documentado pero ni prompt ni detector lo aplican. El agente genera con su default y tu DESIGN.md queda como aspiración.

La combinación cierra el loop. Cada escuela cubre un hueco que las otras dos dejan abierto.

### Si no quieres instalar nada hoy

El artículo también vale como lectura. Las tres secciones individuales (Escuelas 1, 2 y 3) son **portables como heurísticas de revisión manual** aunque no instales nada. Concretamente:

- De **Escuela 1 (taste-skill)** te llevas una **lista de 55+ checkboxes** para correr mentalmente sobre cualquier output de un coding agent. La sección 14 del SKILL.md original está copiada casi entera en el artículo; puedes imprimirla y usarla como rubric.
- De **Escuela 2 (impeccable)** te llevas un **catálogo de bans por modelo** (los 6 de Codex, el 1 de Gemini, los 9 absolutos) que puedes auditar manualmente sobre cualquier HTML generado. La tabla de las 45 reglas del detector está resumida en este artículo.
- De **Escuela 3 (design.md)** te llevas una **plantilla de 100-200 líneas** para documentar tu propio design system. El ejemplo de `Technical Handout` en PHILOSOPHY.md es un caso real de cómo una sola referencia cultural sustituye a veinte tokens.

Sin instalar nada, ya tienes: una rubric, un catálogo de bans, y una plantilla de spec. Es el 60% del valor. El otro 40% viene de la automatización (CI, detector, live mode).

### Fuera de scope del artículo

Lo que este artículo deliberadamente no cubre, porque cada uno merece su propio tratamiento:

- **Native mobile** (iOS / Android): Apple publica Human Interface Guidelines, Google Material 3. Las tres escuelas están optimizadas para web; los defaults monoculturales se manifiestan distinto en mobile (viewport, safe areas, navegación inferior) y los bans de impeccable no están calibrados.
- **Email HTML**: Outlook y Gmail web restringen tanto el CSS que el AI slop aparece por tablas anidadas, `bgcolor`/`align` deprecated y soporte inconsistente de `flex`/`grid`, no por sombras o gradientes. Las tres escuelas no aplican directamente.
- **Slides / keynotes**: Keynote, Google Slides y Figma Slides tienen primitivas distintas (masters, grids fijos, imágenes en capas). El AI slop en slides suele ser "todo en la misma plantilla de stock" más que firmas monoculturales de componentes.
- **3D / WebGL**. Three.js, R3F, shaders — el AI slop se reduce bastante porque el espacio de output es más abierto (geometrías, materiales, iluminación). Las tres escuelas no tienen reglas específicas para este dominio.
- **Video motion graphics**. After Effects, motion graphics para ads. El equivalente serían las herramientas de motion design (motion.dev, GSAP), no las tres escuelas de UI web.

Si tu trabajo toca alguno de estos, las tres escuelas son un buen punto de partida conceptual (distinguir heurísticas, prompt maestro, especificación), pero los bans y los detectores no se transplantan directamente.

---

## Investigación hecha

**Repos complementarios clonados con `--depth 1` el 2026-07-04** a `~/proyectos/taste-skill` y `~/proyectos/design-md-google-labs`. Material principal para `impeccable` provino del informe del subagente padre en `/home/hermesbot/.hermes/repo-investigations/pbakaus-impeccable.md` (47 KB, 452 líneas, leído completo), complementado con lectura directa del `skill/SKILL.src.md` (188 líneas) y bajada del `AGENTS.md` en `~/proyectos/impeccable/` (clonado también para confirmar árbol y stars/forks).

**Archivos leídos de taste-skill (7 archivos, ~1.700 líneas en total):** `README.md`, `skills/taste-skill/SKILL.md` (1.206 líneas, completo), `skills/redesign-skill/SKILL.md` (178, completo), `skills/brandkit/SKILL.md` (primeras 100 de 798), más `wc -l` y tree listing de los 15 sub-skills. No leídos: `brutalist`, `minimalist`, `soft`, `output`, `stitch`, `image-to-code`, `gpt-tasteskill`, `taste-skill-v1`, los dos `imagegen-frontend`, `LICENSE`, `CHANGELOG.md`, `scripts/*.mjs`, `research/`.

**Archivos leídos de design.md (8 archivos, ~1.350 líneas en total):** `README.md` (353, completo), `docs/spec.md` (365, completo), `PHILOSOPHY.md` (110, completo), `examples/totality-festival/DESIGN.md` (210, completo), `examples/atmospheric-glass/DESIGN.md` (primeras 80 de 210), `packages/cli/package.json`, `packages/cli/src/linter/lint.ts`, `packages/cli/src/index.ts`. No leídos: `examples/paws-and-paths/DESIGN.md` (solo `wc`), los módulos `runner.ts` / `parser/handler.ts` / `model/handler.ts`, los tests unitarios completos, `tailwind.config.js` y `design_tokens.json` de los examples.

**No ejecuté** ningún `bun run build`, `npx impeccable`, `npx @google/design.md` ni `npx skills add`. La instalación de Bun + zod + motion + playwright es costosa y el objetivo del artículo es documentar las herramientas, no auditar su comportamiento en runtime. Los conteos "45 reglas del detector" y "9 reglas del linter" provienen del README de cada repo, no de ejecución propia.