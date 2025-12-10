# Instrucciones para Claude Code - Código Sin Siesta Website

## Descripción del Proyecto

Sitio web oficial de Código Sin Siesta construido con Docusaurus 3. Incluye documentación técnica, blog, y recursos sobre proyectos de la organización.

## Stack Tecnológico

- **Framework**: Docusaurus 3.9.2
- **Package Manager**: pnpm 10
- **Node**: v20
- **Lenguaje**: JavaScript (opcionalmente TypeScript)
- **Deployment**: GitHub Pages con GitHub Actions

## Configuración Crítica

### GitHub Pages Organizacional
- **URL**: `https://codigosinsiesta.github.io`
- **baseUrl**: `/` (NO `/proyecto/` - esto es una página de organización)
- **trailingSlash**: `false` (crítico para SEO en GitHub Pages)
- **i18n**: Español (`es`) como idioma por defecto

### Estructura del Proyecto

```
.
├── .github/workflows/     # Workflows de CI/CD
│   ├── deploy.yml        # Deployment automático en push a main
│   └── test-deploy.yml   # Testing en PRs
├── blog/                 # Posts del blog
│   ├── authors.yml       # Configuración de autores
│   └── [posts]/          # Directorio de posts
├── docs/                 # Documentación
│   └── intro.md          # Página de inicio de docs
├── src/
│   ├── components/       # Componentes React personalizados
│   ├── css/             # Estilos globales
│   └── pages/           # Páginas personalizadas (index.js, etc.)
├── static/              # Archivos estáticos (imágenes, .nojekyll, etc.)
├── docusaurus.config.js # Configuración principal
├── sidebars.js          # Configuración de navegación lateral
├── package.json
└── pnpm-lock.yaml       # Lockfile de dependencias
```

## Comandos Importantes

```bash
# Desarrollo local
pnpm start                # Servidor de desarrollo en http://localhost:3000

# Build para producción
pnpm run build            # Genera build en ./build

# Testing local del build
pnpm run serve            # Sirve el build localmente

# Limpiar cache
pnpm run clear            # Limpia cache de Docusaurus
```

## Workflow de Desarrollo

### 1. Cambios en Contenido

Para editar contenido (docs, blog, páginas):

1. Editar archivos correspondientes en `docs/`, `blog/`, o `src/pages/`
2. Probar localmente con `pnpm start`
3. Commit y push a main
4. GitHub Actions desplegará automáticamente

### 2. Configuración

Cambios en `docusaurus.config.js`:

**NO MODIFICAR ESTOS VALORES SIN CONSULTAR:**
- `url`: `'https://codigosinsiesta.github.io'`
- `baseUrl`: `'/'`
- `trailingSlash`: `false`
- `organizationName`: `'codigosinsiesta'`
- `projectName`: `'codigosinsiesta.github.io'`

Estos valores son críticos para el deployment en GitHub Pages.

### 3. Nuevos Posts de Blog

```bash
# Crear nuevo post
touch blog/YYYY-MM-DD-titulo.md

# O usar directorio para incluir imágenes
mkdir blog/YYYY-MM-DD-titulo
touch blog/YYYY-MM-DD-titulo/index.md
```

Estructura de frontmatter:
```markdown
---
slug: url-del-post
title: Título del Post
authors: [codigosinsiesta]
tags: [tag1, tag2]
---

Resumen del post...

<!-- truncate -->

Contenido completo...
```

### 4. Nueva Documentación

1. Crear archivo `.md` en `docs/`
2. Actualizar `sidebars.js` si es necesario
3. Usar frontmatter para configurar:
   ```markdown
   ---
   sidebar_position: 1
   ---
   ```

## GitHub Actions

### Workflows

1. **deploy.yml**: Deploy automático en push a `main`
   - Instala dependencias con pnpm
   - Ejecuta build
   - Despliega a GitHub Pages

2. **test-deploy.yml**: Testing en Pull Requests
   - Valida que el build funcione
   - No despliega, solo testea

### Verificar Status

```bash
# Ver últimos workflows
gh run list --repo CodigoSinSiesta/codigosinsiesta.github.io

# Ver logs de un workflow específico
gh run view [RUN_ID] --log
```

## Solución de Problemas

### Build falla en GitHub Actions

1. Verificar que `pnpm-lock.yaml` esté committeado
2. Verificar que no haya errores de sintaxis en archivos `.md`
3. Ver logs: `gh run view --log`

### Cambios no se reflejan en el sitio

1. Verificar que el workflow se ejecutó exitosamente
2. GitHub Pages puede tomar 2-3 minutos en actualizar
3. Limpiar cache del navegador

### Links rotos

- Usar rutas relativas: `/docs/intro` (NO `./intro`)
- Verificar que `onBrokenLinks: 'throw'` esté en `docusaurus.config.js`

## Convivencia con Otros Proyectos

El sitio principal (`/`) convive con project pages como:
- `/ai-presentation/` - Presentación interactiva de IA

Cada proyecto tiene su propio repositorio y deployment independiente.

## Recursos

- [Documentación Docusaurus](https://docusaurus.io/docs)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Repositorio](https://github.com/CodigoSinSiesta/codigosinsiesta.github.io)
- [Sitio en vivo](https://codigosinsiesta.github.io)

## Notas Importantes

1. **NO usar npm/yarn**: Este proyecto usa pnpm exclusivamente
2. **Archivo .nojekyll**: No eliminar `static/.nojekyll` - previene procesamiento Jekyll
3. **Idioma**: El sitio está en español. Mantener consistencia en contenido nuevo
4. **Autores**: Añadir nuevos autores en `blog/authors.yml` antes de usarlos en posts
