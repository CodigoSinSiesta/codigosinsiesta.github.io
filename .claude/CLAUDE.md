# Instrucciones para Claude Code - Web de Código Sin Siesta

## Descripción

Web principal de Código Sin Siesta (codigosinsiesta.com): rutas de aprendizaje ("el dojo"), ensayos ("el zine") y talleres. Sustituye al antiguo sitio Docusaurus (en historia git anterior a jun-2026).

## Stack

- **Framework**: Astro 5 (estático) + Svelte 5 (islas)
- **Diseño**: `@codigosinsiesta/theme` (github:CodigoSinSiesta/theme) — tokens dark blueprint, SiteHeader/SiteFooter, TerminalWindow. Cumplir `BRAND.md` del theme.
- **Package manager**: pnpm 11 (`packageManager` en package.json). NO bun/npm/yarn.
- **Node**: 24 (nvm)
- **Deploy**: GitHub Pages vía Actions (`deploy.yml` en push a main, `test-deploy.yml` en PRs). Artefacto: `dist/`.

## Configuración crítica

- `astro.config.mjs` → `site: 'https://codigosinsiesta.com'` (dominio custom de Pages).
- `public/CNAME` controla el dominio custom — no tocar sin coordinar DNS.
- Página de organización: baseUrl `/`. Los decks/presentaciones son project pages hermanas (`/harness-engineering-presentation/`, etc.) — enlazar con rutas absolutas relativas al dominio.

## Contenido

- **Ensayos**: `src/content/ensayos/*.md` — frontmatter `title, description, fecha (YYYY-MM-DD), tags[], autor`.
- **Guías**: `src/content/guias/*.md` — frontmatter `title, ruta (slug), orden (number), duracion`.
- **Rutas/talleres/nav**: `src/data/{rutas,talleres,site}.ts`.
- Voz de marca: español-leading, tuteo, frases cortas, claims con evidencia. Ver BRAND.md del theme.

## Comandos

```bash
pnpm install
pnpm dev        # localhost:4321
pnpm build      # genera dist/
pnpm preview
```

## Notas

- El progreso de rutas se guarda en localStorage (`csi-progreso:<ruta>`), sin backend.
- `scripts/migrate-blog.mjs` fue la migración one-shot desde Docusaurus; no se ejecuta en CI.
- `taller-ia-agentes-mcp/` es código del taller fundacional, no forma parte del build.
