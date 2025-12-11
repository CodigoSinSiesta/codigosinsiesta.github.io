# Resumen Completo: CodigoSinSiesta/ai-presentation

## 1. Tipo de Proyecto

**ai-presentation** es una **presentación web interactiva construida con tecnologías modernas** que explora el tema de **"Vibe Coding vs Software Engineering"**.

### Descripción Oficial
> Interactive presentation on 'Vibe Coding vs Software Engineering' - A 21-slide exploration of the 4R Framework for responsible AI-assisted development, covering security, code quality, testing, and resilience patterns.

### Propósito Principal
Es una presentación educativa y participativa que:
- Explora la paradoja entre el desarrollo "casual" (Vibe Coding) y la ingeniería de software rigurosa
- Presenta el **Framework 4R** para desarrollo responsable asistido por IA
- Cubre aspectos críticos: seguridad, calidad de código, testing y patrones de resiliencia
- Incluye un taller práctico (Workshop) y mecanismo de feedback del público
- Está diseñada para ser presentada por múltiples presentadores (e.g., TellMeAlex, Jose David)

---

## 2. Estructura de Directorios

```
ai-presentation/
├── .github/
│   └── workflows/
│       └── deploy.yml              # Pipeline CI/CD para deploy automático
├── src/
│   ├── components/
│   │   ├── Navigation.svelte        # Componente de navegación entre slides
│   │   ├── slides/                  # Componentes de slides individuales (28 slides)
│   │   │   ├── Slide01Hero.astro
│   │   │   ├── Slide02Paradox.svelte
│   │   │   ├── Slide03Metrics.svelte
│   │   │   ├── Slide04Churn.svelte
│   │   │   ├── Slide05BestPractices.svelte
│   │   │   ├── Slide05Context.svelte
│   │   │   ├── Slide05Security.astro
│   │   │   ├── Slide06Agents.svelte
│   │   │   ├── Slide06METR.svelte
│   │   │   ├── Slide06PromptFormula.svelte
│   │   │   ├── Slide07Framework.astro
│   │   │   ├── Slide07MCPs.svelte
│   │   │   ├── Slide08Risk.svelte
│   │   │   ├── Slide08Workshop.svelte
│   │   │   ├── Slide09Readability.astro
│   │   │   ├── Slide10Reliability.svelte
│   │   │   ├── Slide11Feedback.svelte
│   │   │   ├── Slide11Resilience.astro
│   │   │   ├── Slide12Limits.svelte
│   │   │   ├── Slide13StackPRs.astro
│   │   │   ├── Slide14Hooks.svelte
│   │   │   ├── Slide15B.svelte
│   │   │   ├── Slide15Guardrails.astro
│   │   │   ├── Slide16Reviewers.svelte
│   │   │   ├── Slide17B.svelte
│   │   │   ├── Slide17Cases.svelte
│   │   │   ├── Slide18B.astro
│   │   │   └── Slide18Closing.astro
│   │   └── ui/                     # Componentes UI reutilizables
│   │       ├── Button.astro
│   │       └── Card.astro
│   ├── layouts/
│   │   └── PresentationLayout.astro # Layout principal para la presentación
│   ├── styles/                      # Estilos CSS
│   ├── utils/
│   │   └── animations.ts            # Utilidades de animación (GSAP)
│   └── env.d.ts                     # Tipos TypeScript
├── .gitignore                       # Archivos ignorados por Git
├── astro.config.mjs                 # Configuración de Astro
├── tailwind.config.mjs              # Configuración de Tailwind CSS
├── tsconfig.json                    # Configuración de TypeScript
├── postcss.config.mjs               # Configuración de PostCSS
├── package.json                     # Dependencias y scripts
├── pnpm-lock.yaml                   # Lock file de pnpm
└── dist/                            # Build output (generado)
```

---

## 3. Archivos de Configuración

### 3.1 package.json - Dependencias Principales

```json
{
  "name": "ai-presentation",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "@astrojs/svelte": "^7.2.2",      // Integración Svelte para Astro
    "@astrojs/tailwind": "^6.0.2",    // Integración Tailwind para Astro
    "astro": "^4.16.18",              // Framework web moderno
    "gsap": "^3.13.0",                // Animaciones avanzadas
    "lucide-svelte": "^0.555.0",      // Iconografía SVG
    "svelte": "^5.45.5",              // Framework UI reactivo
    "swiper": "^12.0.3",              // Slider/carousel de slides
    "tailwindcss": "^4.1.17"          // CSS utility framework
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.4",       // Type checking
    "@tailwindcss/postcss": "^4.1.17",
    "postcss": "^8.5.6",
    "typescript": "^5.7.2"
  }
}
```

**Características principales:**
- **astro** como framework web moderno (genera HTML estático con islas de interactividad)
- **svelte** para componentes interactivos ligeros
- **tailwindcss** para estilos utility-based
- **gsap** para animaciones profesionales
- **swiper** para navegación entre slides

### 3.2 astro.config.mjs

```javascript
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

export default defineConfig({
  site: 'https://codigosinsiesta.github.io',
  base: '/ai-presentation',
  integrations: [svelte()],
  server: {
    port: 4321,
  },
});
```

**Configuración:**
- Sitio alojado en GitHub Pages bajo la URL base `/ai-presentation`
- Integración de Svelte habilitada
- Puerto de desarrollo: 4321

### 3.3 tailwind.config.mjs

```javascript
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Space Grotesk', 'sans-serif'],      // Títulos
        'subheader': ['Bricolage Grotesque', 'sans-serif'],
        'body': ['IBM Plex Sans', 'sans-serif'],        // Cuerpo de texto
        'mono': ['JetBrains Mono', 'monospace'],        // Código
      },
    },
  },
  plugins: [],
};
```

**Tipografía personalizada:**
- Fuentes elegidas específicamente para una presentación profesional
- Soporte para código monoespaciado

### 3.4 tsconfig.json

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "astro",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "moduleResolution": "bundler"
  }
}
```

### 3.5 .gitignore

```
# dependencies
node_modules/
package-lock.json

# build output
dist/
build/

# development
.env
.env.local
.env.*.local
.DS_Store

# IDE
.vscode/
.idea/
*.swp
*.swo

# Astro
.astro/

# Temp
*.log
.cache/
```

---

## 4. Contenido Principal del Proyecto

### 4.1 Estructura de Slides (28 slides)

| Slide | Nombre | Tipo | Propósito |
|-------|--------|------|----------|
| 1 | `Slide01Hero.astro` | Portada | Presentación inicial con logo, título y presentadores |
| 2 | `Slide02Paradox.svelte` | Contenido | Introduce la paradoja: Vibe Coding vs Software Engineering |
| 3 | `Slide03Metrics.svelte` | Contenido | Métricas y datos relevantes |
| 4 | `Slide04Churn.svelte` | Contenido | Análisis de rotación/churn |
| 5 | `Slide05BestPractices.svelte` | Contenido | Mejores prácticas generales |
| 5b | `Slide05Context.svelte` | Contenido | Contexto y background |
| 5c | `Slide05Security.astro` | Contenido | Seguridad en desarrollo con IA |
| 6a | `Slide06PromptFormula.svelte` | Contenido | Fórmula para prompts efectivos |
| 6b | `Slide06Agents.svelte` | Contenido | Agentes de IA |
| 6c | `Slide06METR.svelte` | Contenido | Métrica METR (¿?) |
| 7 | `Slide07Framework.astro` | Contenido | Framework 4R - Marco conceptual |
| 7b | `Slide07MCPs.svelte` | Contenido | Model Context Protocol (MCP) |
| 8a | `Slide08Risk.svelte` | Contenido | Análisis de riesgos |
| 8b | `Slide08Workshop.svelte` | Contenido | Información del taller práctico |
| 9 | `Slide09Readability.astro` | Contenido | Legibilidad del código |
| 10 | `Slide10Reliability.svelte` | Contenido | Confiabilidad |
| 11a | `Slide11Resilience.astro` | Contenido | Resiliencia |
| 11b | `Slide11Feedback.svelte` | Interactivo | Formulario de feedback del público |
| 12 | `Slide12Limits.svelte` | Contenido | Límites y consideraciones |
| 13 | `Slide13StackPRs.astro` | Contenido | Stack de PRs/Cambios |
| 14 | `Slide14Hooks.svelte` | Contenido | Hooks y componentes |
| 15a | `Slide15B.svelte` | Contenido | Contenido secundario B |
| 15b | `Slide15Guardrails.astro` | Contenido | Guardrails (límites de seguridad) |
| 16 | `Slide16Reviewers.svelte` | Contenido | Reviewers y revisión de código |
| 17a | `Slide17B.svelte` | Contenido | Contenido adicional |
| 17b | `Slide17Cases.svelte` | Contenido | Casos de estudio |
| 18a | `Slide18B.astro` | Contenido | Contenido final B |
| 18b | `Slide18Closing.astro` | Cierre | Slide de cierre y conclusiones |

### 4.2 Componentes Principales

#### Navigation.svelte (7.6 KB)
- Componente interactivo para navegar entre slides
- Permite avanzar/retroceder entre diapositivas
- Cargado con `client:load` para interactividad inmediata

#### Componentes UI Reutilizables
- **Button.astro**: Componente de botón estándar
- **Card.astro**: Contenedor de contenido tipo tarjeta

#### PresentationLayout.astro
- Layout base para toda la presentación
- Define estructura HTML principal
- Integra CSS global y estilos de Tailwind

### 4.3 Carpetas Funcionales

| Carpeta | Contenido | Propósito |
|---------|-----------|----------|
| `components/` | Componentes Astro y Svelte | Bloques UI reutilizables |
| `layouts/` | Template de presentación | Estructura base de páginas |
| `styles/` | Archivos CSS | Estilos personalizados |
| `utils/` | `animations.ts` | Funciones de animación GSAP |
| `pages/` | `index.astro` | Punto de entrada (única página) |

---

## 5. Tecnologías Utilizadas

### Stack Tecnológico

```
┌─────────────────────────────────────────────────────────┐
│                    Stack Tecnológico                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  FRAMEWORK PRINCIPAL:                                   │
│  └─ Astro 4.16.18 - Framework web estático moderno     │
│     (SSG con islas de interactividad)                  │
│                                                          │
│  COMPONENTES UI:                                        │
│  ├─ Svelte 5.45.5 - Framework reactivo ligero         │
│  ├─ Astro Components (.astro) - Componentes nativos   │
│  └─ Lucide-Svelte 0.555.0 - Iconografía SVG          │
│                                                          │
│  ESTILOS:                                               │
│  ├─ Tailwind CSS 4.1.17 - Utility CSS                 │
│  ├─ PostCSS 8.5.6 - Transformación CSS                │
│  └─ Fuentes personalizadas (Space Grotesk, etc.)     │
│                                                          │
│  ANIMACIONES:                                           │
│  ├─ GSAP 3.13.0 - Librería de animaciones pro        │
│  └─ Swiper 12.0.3 - Carousel/slider de slides        │
│                                                          │
│  DESARROLLO:                                            │
│  ├─ TypeScript 5.7.2 - Lenguaje con tipos            │
│  ├─ pnpm 9+ - Gestor de paquetes eficiente           │
│  └─ Node.js 20+ - Runtime JavaScript                 │
│                                                          │
│  DEPLOYMENT:                                            │
│  └─ GitHub Pages - Hosting estático gratuito          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Integración de Herramientas

- **@astrojs/svelte**: Permite usar componentes Svelte dentro de Astro
- **@astrojs/tailwind**: Integración automática de Tailwind con Astro
- **@astrojs/check**: Type checking en tiempo de build
- **TypeScript**: Para type safety en toda la codebase

---

## 6. Estado Actual del Repositorio

### 6.1 Último Commit

**SHA:** `cd3a9054dd553b439ce368a8d636ae235aa3ebbb`

**Mensaje:**
```
Fix incorrect URL: tellmeales.dev → tellmealex.dev

* Initial plan
* Fix URL from tellmeales.dev to tellmealex.dev
* Add package-lock.json to .gitignore

Co-authored-by: TellMeAlex <130550138+TellMeAlex@users.noreply.github.com>
Co-authored-by: copilot-swe-agent[bot] <198982749+Copilot@users.noreply.github.com>
```

**Fecha:** 11 de Diciembre de 2025, 12:16:50 UTC

**Autor:** Copilot (GitHub Copilot Coding Agent)

### 6.2 Ramas

| Rama | SHA | Protegida |
|------|-----|-----------|
| **main** | `cd3a9054dd553b439ce368a8d636ae235aa3ebbb` | Sí |
| **master** | `ce58a349d2f1cfa00214082fc65f1d8d6b6680d4` | No |

**Estado:** Rama principal protegida, rama legacy (master) sin cambios recientes.

### 6.3 Pull Requests

#### PR Abiertos
**Ninguno actualmente abierto**

#### PR Cerrados/Merged
1. **PR #2: "Fix incorrect URL: tellmeales.dev → tellmealex.dev"**
   - Estado: MERGED
   - Fecha: 11 Diciembre 2025, 12:16:51 UTC
   - Autor: Copilot (GitHub Copilot Coding Agent)
   - Cambios:
     - Corrigió URL en `Slide01Hero.astro`
     - Corrigió URL en `Slide11Feedback.svelte`
     - Agregó `package-lock.json` a `.gitignore`
   - Merge SHA: `cd3a9054dd553b439ce368a8d636ae235aa3ebbb`
   - Notas: La ejecución de Copilot fue bloqueada por el firewall en `telemetry.astro.build`, pero el PR se completó exitosamente.

### 6.4 Issues

**Estado actual:** Sin issues abiertos

**Registro de issues resueltos:**
- Issue #1 (resuelto): URL incorrecta en contacto (tellmeales.dev → tellmealex.dev)

### 6.5 Histórico de Commits Recientes

```
1. cd3a905 (Dec 11, 2025) - Fix incorrect URL: tellmeales.dev → tellmealex.dev
   └─ Copilot + TellMeAlex

2. 0ffde97 (Dec 9, 2025) - fix: update TOKEN value to a valid token
   └─ TellMeAlex

3. 7192448 (Dec 9, 2025) - feat: Add new slides for MCPs, Workshop, and Feedback
   └─ TellMeAlex
   ├─ Slide07MCPs.svelte
   ├─ Slide08Workshop.svelte
   ├─ Slide11Feedback.svelte

4. 8de6637 (Dec 8, 2025) - fix: add functionality to 'Explorar la paradoja' button
   └─ TellMeAlex

5. 9f99364 (Dec 8, 2025) - feat: add Jose David to hero slide presenters
   └─ TellMeAlex
```

### 6.6 Estadísticas del Repositorio

| Métrica | Valor |
|---------|-------|
| Estrellas | 0 |
| Forks | 0 |
| Issues Abiertos | 0 |
| Pull Requests Abiertos | 0 |
| Tamaño | 174 KB |
| Creado | 5 de Diciembre de 2025 |
| Última actualización | 11 de Diciembre de 2025 |
| Estado | Activo/En desarrollo |
| Visibilidad | Público |

---

## 7. Workflows de GitHub

### 7.1 Deploy Workflow (`deploy.yml`)

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

env:
  BUILD_PATH: .

jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
      - Checkout
      - Setup pnpm 9
      - Setup Node 20
      - Install dependencies
      - Build with Astro (includes type checking)
      - Upload artifact to pages

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - Deploy to GitHub Pages
```

### 7.2 Características del Pipeline

**Triggers:**
- Automático: Push a rama `main`
- Manual: `workflow_dispatch` (permite ejecutar manualmente desde GitHub)

**Proceso:**
1. **Build Stage:**
   - Checkout del código
   - Instalación de dependencias con pnpm
   - Ejecución de `astro check` (type checking)
   - Build con `astro build` (genera carpeta `/dist`)
   - Upload del artifact

2. **Deploy Stage:**
   - Descarga el artifact
   - Deploya a GitHub Pages
   - Genera URL automáticamente

**Concurrencia:** Solo una ejecución por grupo, cancelando ejecuciones previas

**Permisos:** Acceso completo a Pages y capacidad de escribir ID tokens

---

## 8. Resumen Ejecutivo

### Descripción del Proyecto

**ai-presentation** es una presentación web interactiva de última generación que explora la tensión entre "Vibe Coding" (desarrollo casual con IA) y Software Engineering responsable. Está diseñada como una herramienta educativa que puede ser presentada live con interactividad del público.

### Características Clave

✅ **28 Slides organizadas temáticamente:**
- Diapositivas de bienvenida y cierre
- Contenido conceptual (paradoja, métricas, framework 4R)
- Temas técnicos (seguridad, calidad, testing, resiliencia)
- Elementos interactivos (taller, feedback)

✅ **Stack moderno y eficiente:**
- Astro para generación estática rápida
- Svelte para componentes interactivos ligeros
- GSAP para animaciones profesionales
- Tailwind CSS para estilos escalables

✅ **Deployment automatizado:**
- Pipeline CI/CD con GitHub Actions
- Deploy automático a GitHub Pages en cada push a `main`
- Versionado y control de cambios

✅ **Colaboración activa:**
- Múltiples autores/presentadores
- Uso de GitHub Copilot para automatización
- Pull requests bien documentados

### Estado del Proyecto

| Aspecto | Estado |
|--------|--------|
| Desarrollo | Activo |
| Build | Pasando ✅ |
| Deploy | Automático ✅ |
| Documentación | Código autodocumentado |
| Issues | Ninguno abierto |
| PRs | Ninguno abierto |
| Rama Principal | Protegida |

### URL de Acceso

**Presentación en vivo:** https://codigosinsiesta.github.io/ai-presentation/

### Próximos Pasos Sugeridos

1. Agregar más temas o refinar existentes
2. Implementar encuestas en vivo (potencial de feedback)
3. Agregar variables de entorno para configuración dinámica
4. Considerar agregar "speaker notes" o guía de presentación
5. Mejorar SEO y metadatos

---

## Conclusión

**ai-presentation** es un proyecto bien estructurado, moderno y productivo. Utiliza tecnologías contemporáneas de forma correcta, tiene un pipeline de deployment eficiente y está en desarrollo activo. Es una excelente demostración de cómo construir herramientas interactivas modernas con Astro, Svelte y otras tecnologías del ecosistema JavaScript/TypeScript.

El proyecto está completamente operativo y listo para presentaciones públicas.
