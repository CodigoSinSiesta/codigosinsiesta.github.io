# Código Sin Siesta — codigosinsiesta.com

Web principal de **Código Sin Siesta**: el dojo. Rutas de aprendizaje, ensayos y talleres para developers que construyen con IA sin perder el techo de calidad.

🌐 **Sitio en vivo:** [https://codigosinsiesta.com](https://codigosinsiesta.com)

## Stack

- [Astro 5](https://astro.build) — sitio estático con Astro Content Layer (`astro:content`)
- [Svelte 5](https://svelte.dev) — islas interactivas (header, terminal, progreso, filtros)
- [Pagefind](https://pagefind.app/) — motor de búsqueda estático indexado post-build
- [`@codigosinsiesta/theme`](https://github.com/CodigoSinSiesta/theme) — sistema de diseño V4 "dark blueprint" (tokens, layout, componentes)
- pnpm 11 + Node 24

## Estructura del Proyecto

```text
src/
├── content.config.ts   # Definición y esquemas de Content Collections (Astro 5)
├── content/
│   ├── ensayos/        # El zine: artículos y reflexiones (Markdown)
│   └── guias/          # Módulos y guías de las rutas de aprendizaje
├── data/
│   ├── site.ts         # Navegación, footer, constantes globales
│   ├── rutas.ts        # Definición de rutas del dojo
│   └── talleres.ts     # Catálogo de talleres prácticos
├── components/         # Islas Svelte e interfaces interactivas
├── layouts/
│   └── Base.astro      # Layout base (Head, SEO, Header y Footer del theme)
├── lib/                # Funciones utilitarias (fechas, helpers)
├── styles/             # Estilos globales y capas CSS
└── pages/              # Enrutamiento del sitio
    ├── index.astro     # Portada del dojo
    ├── rutas/          # Índice y detalle de rutas de aprendizaje
    ├── ensayos/        # Índice del zine, detalle de posts y filtrado por tags
    ├── talleres.astro  # Directorio de talleres
    ├── rss.xml.js      # Feed RSS
    └── 404.astro       # Página de error 404
```

## Desarrollo

```bash
# Instalar dependencias
pnpm install

# Servidor local de desarrollo
pnpm dev

# Build de producción (Astro + indexación de búsqueda con Pagefind)
pnpm build

# Previsualizar el resultado de ./dist localmente
pnpm preview

# Migración de posts heredados de Docusaurus (utilidad)
pnpm migrate:blog
```

## CI/CD y Calidad

El repositorio cuenta con pipelines automatizados en `.github/workflows/`:

- **Deploy (`deploy.yml`)**: Al hacer push a `main`, construye con pnpm, indexa con Pagefind y publica en GitHub Pages (`codigosinsiesta.com`).
- **Test Deploy (`test-deploy.yml`)**: Verifica que el build y la indexación compilen correctamente en cada Pull Request.
- **Lighthouse CI (`lighthouse.yml`)**: Audita métricas de rendimiento, accesibilidad y SEO configuradas en `.lighthouserc.cjs`.
- **Seguridad**:
  - `codeql.yml`: Análisis estático de vulnerabilidades.
  - `trufflehog.yml`: Detección preventiva de secretos y credenciales.
- **Gobernanza de PRs**:
  - `semantic-pr.yml`: Validación de Conventional Commits en títulos de PRs.
  - `license-check.yml`: Verificación de licencias de dependencias.

## Gestión de Contenido

- **Ensayos**: Ficheros Markdown en `src/content/ensayos/` con esquema: `title`, `description`, `fecha`, `tags`, `autor`.
- **Guías de ruta**: Ficheros Markdown en `src/content/guias/` con esquema: `title`, `description`, `ruta`, `orden`, `duracion`.
- **Rutas y talleres**: Definiciones tipadas en TypeScript dentro de `src/data/`.

El contenido histórico del sitio original en Docusaurus se preserva en el historial git previo a la migración.
