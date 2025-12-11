# Código Sin Siesta

Sitio web principal de la organización **Código Sin Siesta** - Documentación técnica, blog de desarrollo y recursos para la comunidad.

🌐 **Sitio en vivo:** [https://codigosinsiesta.github.io/](https://codigosinsiesta.github.io/)

## Tecnología

Este sitio está construido con [Docusaurus 3](https://docusaurus.io/), un generador de sitios estáticos moderno que ofrece:

- 🚀 Renderizado optimizado y carga rápida
- 📱 Diseño responsive y modo oscuro
- 🔍 Búsqueda integrada
- 📝 Soporte para MDX (Markdown + React)
- 🌐 Internacionalización (i18n)

## Desarrollo Local

### Requisitos Previos

- Node.js 20 o superior
- pnpm (recomendado) o npm/yarn

### Instalación

```bash
pnpm install
```

### Servidor de Desarrollo

```bash
pnpm start
```

Esto inicia un servidor local en `http://localhost:3000` con recarga automática.

### Build de Producción

```bash
pnpm build
```

Genera el contenido estático en el directorio `build/`.

### Previsualizar Build

```bash
pnpm serve
```

Sirve el contenido del directorio `build/` para previsualizar antes de desplegar.

## Deployment

El sitio se despliega automáticamente a GitHub Pages mediante GitHub Actions cuando se hace push a la rama `main`.

### Workflow de Deploy

El archivo `.github/workflows/deploy.yml` maneja el proceso de deployment:

1. Checkout del código
2. Configuración de pnpm y Node.js 20
3. Instalación de dependencias
4. Build del sitio
5. Deploy a GitHub Pages

## Estructura del Proyecto

```
codigosinsiesta.github.io/
├── blog/                   # Posts del blog
├── docs/                   # Documentación técnica
├── src/
│   ├── components/        # Componentes React personalizados
│   ├── css/              # Estilos globales
│   └── pages/            # Páginas estáticas
├── static/               # Archivos estáticos (imágenes, favicon, etc.)
├── docusaurus.config.js  # Configuración principal
└── sidebars.js          # Configuración de sidebars
```

## Contribuir

Para contribuir al sitio:

1. Crea una rama desde `main`
2. Realiza tus cambios
3. Crea un Pull Request
4. Espera la aprobación y merge

**Nota:** La rama `main` está protegida y requiere revisión de Pull Request.

## Enlaces

- [Organización GitHub](https://github.com/codigosinsiesta)
- [Proyecto AI Presentation](https://codigosinsiesta.github.io/ai-presentation/)
- [Documentación Docusaurus](https://docusaurus.io/)

## Licencia

Copyright © 2025 Código Sin Siesta. Built with Docusaurus.
