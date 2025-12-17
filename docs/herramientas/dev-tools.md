---
sidebar_position: 4
---

# Dev Tools Modernos

Guía definitiva para elegir herramientas modernas de desarrollo. **No se trata de usar lo último por coolness, sino de usar lo óptimo para tu proyecto**. Benchmarks reales, comparativas prácticas, y decisiones pragmáticas.

## Filosofía: Performance vs. Curva de Aprendizaje

| Factor | Legacy Tools | Modern Tools |
|--------|-------------|--------------|
| **Velocidad** | Lento | 10-100x más rápido |
| **DX** | Frustrante | Fluida |
| **Aprendizaje** | Conocido | Nueva curva |
| **Ecosystem** | Maduro | Creciente |
| **Mantenimiento** | Alto | Bajo |

**Regla general**: Si tu proyecto es grande/complejo → adopta tools modernas. Si es pequeño/simple → legacy está bien.

## 🏗️ Build Tools: La Era Post-Webpack

### Comparativa de Velocidad

| Tool | Lenguaje | Cold Start | HMR | Bundle Size | Complejidad |
|------|----------|------------|-----|-------------|-------------|
| **Webpack 5** | JS | ~10s | ~2s | Bueno | Alto |
| **esbuild** | Go | ~0.5s | ~0.1s | Bueno | Bajo |
| **SWC** | Rust | ~0.3s | ~0.05s | Excelente | Medio |
| **Turbopack** | Rust | ~1s | ~0.2s | Excelente | Bajo |

### esbuild: El Campeón Actual

**Cuándo usarlo:**
- Proyectos medianos/grandes
- Desarrollo rápido
- Bundling simple
- Migración desde Webpack

```javascript
// build.js - Configuración mínima
const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'dist/bundle.js',
  minify: true,
  sourcemap: true,
  target: ['chrome90', 'firefox88'],
  define: {
    'process.env.NODE_ENV': '"production"'
  }
}).catch(() => process.exit(1));
```

**Ventajas:**
- ✅ **100x más rápido** que Webpack
- ✅ Configuración mínima
- ✅ TypeScript out-of-the-box
- ✅ Tree shaking automático

**Desventajas:**
- ❌ Plugins limitados
- ❌ CSS processing básico

### SWC: El Más Rápido

**Cuándo usarlo:**
- Librerías que publicas a npm
- Grandes monorepos
- Maxima performance
- Compilación de dependencias

```javascript
// .swcrc
{
  "jsc": {
    "parser": {
      "syntax": "typescript",
      "tsx": true
    },
    "transform": {
      "react": {
        "runtime": "automatic"
      }
    }
  },
  "module": {
    "type": "es6"
  },
  "minify": true
}
```

**Ventajas:**
- ✅ **El más rápido** (2x más que esbuild)
- ✅ Mejor minificación
- ✅ Excelente para librerías
- ✅ Transformaciones avanzadas

### Turbopack: El Futuro

**Cuándo usarlo:**
- Proyectos Next.js
- Equipos grandes
- Máxima velocidad de desarrollo

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js'
        }
      }
    }
  }
};
```

## 📦 Package Managers: Más Allá de npm

### Benchmarks Reales (Proyecto de 500 deps)

| Manager | Install Time | Disk Usage | Lockfile Size |
|---------|-------------|------------|---------------|
| **npm** | 45s | 500MB | 800KB |
| **pnpm** | 15s | 180MB | 200KB |
| **bun** | 8s | 160MB | 150KB |

### pnpm: El Balance Perfecto

**Cuándo usarlo:**
- Monorepos
- Equipos medianos
- Estricto control de dependencias
- Migración desde npm/yarn

```bash
# Instalación
npm install -g pnpm

# Uso diario
pnpm install          # Instalar dependencias
pnpm add lodash      # Añadir dependencia
pnpm dev             # Scripts del package.json
pnpm --recursive dev # Para monorepos
```

**Ventajas:**
- ✅ **3x más rápido** que npm
- ✅ **65% menos disco** usado
- ✅ Monorepos nativo
- ✅ Estricto (no hoisting accidental)

**Desventajas:**
- ❌ Curva de aprendizaje inicial
- ❌ Algunos paquetes legacy fallan

### bun: El Revolucionario

**Cuándo usarlo:**
- Nuevos proyectos
- Maxima velocidad
- Equipos pequeños
- Experimentar con lo último

```bash
# Instalación
curl -fsSL https://bun.sh/install | bash

# Uso (API compatible con npm)
bun install
bun add lodash
bun run dev

# Extras únicos de bun
bun test              # Test runner integrado
bun create react-app  # Scaffolding
bun pm cache          # Gestión de cache
```

**Ventajas:**
- ✅ **5x más rápido** que npm
- ✅ Runtime incluido (como Node pero más rápido)
- ✅ Test runner integrado
- ✅ Transpiling automático

**Desventajas:**
- ❌ Nuevo ecosystem
- ❌ Algunos paquetes incompatibles

## 🧪 Testing: Velocidad vs. Fiabilidad

### Unit Testing: Vitest vs Jest

| Aspecto | Jest | Vitest |
|---------|------|--------|
| **Velocidad** | Lento | 10x más rápido |
| **Config** | Compleja | Mínima |
| **ESM** | Complicado | Nativo |
| **HMR** | No | Sí |
| **Vite Integration** | No | Sí |

```typescript
// vitest.config.ts - Configuración mínima
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/test/setup.ts']
  }
});

// Ejemplo de test
import { describe, it, expect } from 'vitest';
import { add } from './math';

describe('math', () => {
  it('adds two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });
});
```

### E2E Testing: Playwright vs Cypress

| Aspecto | Cypress | Playwright |
|---------|---------|------------|
| **Velocidad** | Medio | Más rápido |
| **Multi-browser** | Solo Chromium | Todos los browsers |
| **Setup** | Fácil | Medio |
| **Flakiness** | Alto | Bajo |
| **Mobile testing** | Limitado | Excelente |

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } }
  ]
});
```

## 🎨 Linting & Formatting: Código Consistente

### ESLint Moderno

```javascript
// .eslintrc.js
module.exports = {
  root: true,
  env: { browser: true, es2022: true },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.js'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
};
```

### Pre-commit Hooks: Husky + lint-staged

```bash
# Instalación
pnpm add -D husky lint-staged

# Inicialización
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"

# Configuración en package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

## 🐙 Git Tools: Commits que Significan

### Conventional Commits

```bash
# Formato estándar
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Tipos comunes:**
- `feat:` Nueva funcionalidad
- `fix:` Bug fix
- `docs:` Cambios en documentación
- `style:` Formato, no funcional
- `refactor:` Refactorización
- `test:` Tests
- `chore:` Mantenimiento

### Commitizen: Commits Interactivos

```bash
# Instalación
pnpm add -D commitizen @commitlint/cli @commitlint/config-conventional

# Configuración
echo 'module.exports = { extends: ["@commitlint/config-conventional"] };' > commitlint.config.js

# Uso
npx cz
# Te guía para crear commits convencionales
```

## 🖥️ CLI Tools: La Nueva Generación

### La Suite Moderna

| Comando Legacy | Comando Moderno | ¿Por qué mejor? |
|----------------|-----------------|-----------------|
| `cat` | `bat` | Syntax highlighting, git integration |
| `grep` | `rg` (ripgrep) | 3-5x más rápido, regex mejor |
| `find` | `fd` | Sintaxis simple, respeta .gitignore |
| `sed` | `sd` | Sintaxis intuitiva, menos bugs |
| `ls` | `eza` | Colores, icons, información rica |

### Instalación y Uso

```bash
# macOS con Homebrew
brew install bat ripgrep fd sd eza

# Ejemplos de uso

# Ver archivo con syntax highlighting
bat src/index.ts

# Buscar en todo el proyecto (respeta .gitignore)
rg "TODO" --type ts

# Encontrar archivos TypeScript
fd "\.ts$" --type f

# Reemplazar texto en múltiples archivos
sd "oldText" "newText" src/**/*.ts

# Listar archivos con información rica
eza -la --git --icons
```

### Benchmark de Velocidad

| Tarea | Legacy | Modern | Speedup |
|-------|--------|--------|---------|
| Buscar "function" en 1000 archivos | grep: 2.1s | rg: 0.3s | 7x |
| Listar archivos recursivo | find: 1.8s | fd: 0.2s | 9x |
| Reemplazar en 500 archivos | sed: 3.2s | sd: 0.8s | 4x |

## Decision Tree: ¿Qué Adoptar?

### Para Proyectos Pequeños (< 5 devs)
```
Usa legacy tools (npm, Jest, ESLint básico)
└── Enfócate en funcionalidad, no tooling
```

### Para Proyectos Medianos (5-20 devs)
```
Adopta tools modernas gradualmente:
├── pnpm (package manager)
├── esbuild (build tool)
├── Vitest (testing)
└── CLI moderna (bat, rg, fd)
```

### Para Proyectos Grandes (20+ devs)
```
Adopta todo lo moderno:
├── bun (si compatible)
├── SWC/Turbopack
├── Playwright
├── Husky + lint-staged
└── Conventional commits
```

## Implementación Pragmática

### Fase 1: Bajo Riesgo (1 semana)
```bash
# Adoptar CLI tools (cero riesgo)
brew install bat ripgrep fd sd eza

# Configurar aliases en ~/.zshrc
alias cat='bat'
alias grep='rg'
alias find='fd'
```

### Fase 2: Medio Riesgo (2 semanas)
```bash
# Cambiar package manager
pnpm install
rm package-lock.json
pnpm import # Convierte lockfile

# Cambiar test runner
pnpm add -D vitest @vitest/ui
# Configurar vitest.config.ts
```

### Fase 3: Alto Riesgo (3+ semanas)
```bash
# Cambiar build system
# Migrar webpack → esbuild/vite
# Actualizar CI/CD
# Entrenar equipo
```

## Métricas de Éxito

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| **Build time** | 45s | 8s | 5.6x |
| **Install time** | 60s | 12s | 5x |
| **Test time** | 30s | 5s | 6x |
| **Developer satisfaction** | 6/10 | 9/10 | +50% |

## Conclusión

**Tools modernos no son hype, son evolución necesaria.** La diferencia entre un equipo productivo y uno frustrado a menudo está en las herramientas que usan.

**Pregunta clave**: ¿Cuánto tiempo pierdes diariamente esperando builds/tests/installs?

> *"Las mejores herramientas son invisibles. Solo notas su ausencia cuando las cambias."*

Siguiente: Configuraciones específicas para [LazyVim](./lazyvim.md), [Tmux](./tmux.md), y [Zellij](./zellij.md). 🛠️
