# Código Sin Siesta — codigosinsiesta.com

Web principal de **Código Sin Siesta**: el dojo. Rutas de aprendizaje, ensayos y talleres para developers que construyen con IA sin perder el techo de calidad.

🌐 **Sitio en vivo:** [https://codigosinsiesta.com](https://codigosinsiesta.com)

## Stack

- [Astro 5](https://astro.build) — sitio estático, content collections
- [Svelte 5](https://svelte.dev) — islas interactivas (header, terminal, progreso)
- [`@codigosinsiesta/theme`](https://github.com/CodigoSinSiesta/theme) — sistema de diseño V4 "dark blueprint" (tokens, layout, componentes)
- pnpm 11 + Node 24

## Estructura

```
src/
├── content/
│   ├── ensayos/        # el zine — posts markdown (antiguo blog)
│   └── guias/          # módulos de las rutas de aprendizaje
├── data/
│   ├── site.ts         # nav, footer, constantes
│   ├── rutas.ts        # definición de rutas del dojo
│   └── talleres.ts     # catálogo de talleres
├── layouts/Base.astro  # head + SiteHeader/SiteFooter del theme
├── components/         # islas Svelte (TerminalHero, Progreso*)
└── pages/              # /, /rutas, /ensayos, /talleres, 404, rss
```

## Desarrollo

```bash
pnpm install
pnpm dev       # http://localhost:4321
pnpm build     # genera ./dist
pnpm preview
```

## Deploy

Push a `main` → GitHub Actions construye con pnpm y publica en GitHub Pages (`.github/workflows/deploy.yml`). Los PRs validan el build con `test-deploy.yml`.

El dominio `codigosinsiesta.com` se sirve vía GitHub Pages con dominio custom (fichero `public/CNAME` + DNS apuntando a Pages).

## Contenido

- **Ensayos**: markdown en `src/content/ensayos/` con frontmatter `title, description, fecha, tags, autor`.
- **Guías de ruta**: markdown en `src/content/guias/` con `title, ruta, orden, duracion`.
- **Rutas y talleres**: datos en `src/data/`.

El contenido del antiguo sitio Docusaurus (blog y docs) vive en la historia git anterior a la migración.
