---
sidebar_position: 2
---

# Setup del Entorno

Guía completa para preparar tu entorno de desarrollo para construir agentes de IA y MCP Servers con TypeScript. Esta configuración te permitirá trabajar con Claude, DeepSeek y herramientas modernas de desarrollo.

## Flujo de Setup (5 minutos)

```
1. Instalar dependencias del sistema (Node.js, pnpm)
       ↓
2. Crear estructura de proyecto
       ↓
3. Configurar TypeScript
       ↓
4. Instalar librerías
       ↓
5. Configurar variables de entorno
       ↓
6. Verificar que todo funciona ✓
```

**Total estimado:** 5-10 minutos (dependiendo de tu conexión)

## Requisitos del Sistema

Antes de comenzar, asegúrate de tener instalado:

### Node.js 20+
```bash
# Verificar versión instalada
node --version  # Debe ser 20.x o superior

# Si no lo tienes, instala con nvm (recomendado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
nvm alias default 20
```

### Package Manager
Usaremos `pnpm` por su velocidad y eficiencia:
```bash
# Instalar pnpm
npm install -g pnpm

# Verificar instalación
pnpm --version  # Debe ser 8.x o superior
```

### Git
```bash
# Verificar instalación
git --version  # Debe ser 2.30+ recomendado

# Si no está instalado (macOS con Homebrew)
brew install git
```

## Estructura del Proyecto

Crea la estructura base para tus experimentos con agentes:

```bash
# Crear directorio del proyecto
mkdir taller-ia-agentes
cd taller-ia-agentes

# Inicializar proyecto
pnpm init

# Crear estructura de directorios
mkdir -p src/{agents,mcp-servers,tools,types}
mkdir -p tests
mkdir -p examples
```

Tu estructura final debería verse así:
```
taller-ia-agentes/
├── src/
│   ├── agents/           # Lógica de agentes
│   ├── mcp-servers/      # Implementaciones MCP
│   ├── tools/           # Herramientas personalizadas
│   └── types/           # Definiciones TypeScript
├── tests/               # Tests unitarios e integración
├── examples/            # Ejemplos ejecutables
├── package.json
└── tsconfig.json
```

## Configuración de TypeScript

TypeScript con configuración estricta para calidad de código:

```json:tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

## Dependencias Principales

Instala las librerías necesarias:

```bash
# Dependencias principales
pnpm add @anthropic-ai/sdk @ai-sdk/deepseek zod dotenv

# Dependencias de desarrollo
pnpm add -D typescript @types/node tsx vitest @vitest/ui

# Para MCP Servers
pnpm add @modelcontextprotocol/sdk fast-mcp

# Utilidades adicionales
pnpm add winston chalk ora
```

### Explicación de dependencias:
- **@anthropic-ai/sdk**: Cliente oficial para Claude API
- **@ai-sdk/deepseek**: SDK para DeepSeek (alternativa económica)
- **zod**: Validación de esquemas TypeScript-first
- **dotenv**: Manejo seguro de variables de entorno
- **fast-mcp**: Framework rápido para MCP Servers
- **@modelcontextprotocol/sdk**: SDK oficial de Anthropic para MCP

## Variables de Entorno (.env)

Crea un archivo `.env` en la raíz del proyecto:

```bash:.env
# API Keys - NUNCA commits estos valores
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Configuración de modelos
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
DEEPSEEK_MODEL=deepseek-chat

# Configuración de logging
LOG_LEVEL=info
LOG_FILE=logs/agent.log

# Configuración de MCP (opcional)
MCP_SERVER_PORT=3001
MCP_TRANSPORT=stdio
```

> **ADVERTENCIA**: Nunca commits el archivo `.env`. Añádelo a `.gitignore`:
> ```bash
> echo ".env" >> .gitignore
> ```

## API Keys

### Anthropic Claude
1. Ve a [Anthropic Console](https://console.anthropic.com/)
2. Crea una cuenta y genera una API key
3. Copia la key al `.env` como `ANTHROPIC_API_KEY`

### DeepSeek
1. Ve a [DeepSeek Platform](https://platform.deepseek.com/)
2. Regístrate y obtén tu API key
3. Copia la key al `.env` como `DEEPSEEK_API_KEY`

> **NOTA**: DeepSeek es más económico que Claude para desarrollo, pero Claude tiene mejor rendimiento para agentes complejos.

## Scripts en package.json

Añade estos scripts para facilitar el desarrollo:

```json:package.json
{
  "scripts": {
    "build": "tsc",
    "dev": "tsx watch src/index.ts",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "clean": "rm -rf dist logs",
    "lint": "tsc --noEmit",
    "mcp:start": "tsx src/mcp-servers/index.ts"
  }
}
```

## Verificación del Setup

### Checklist de Verificación

Ejecuta cada paso y marca como completado:

- [ ] **Node.js 20+** instalado: `node --version`
- [ ] **pnpm** instalado: `pnpm --version`
- [ ] **Directorio del proyecto** creado
- [ ] **package.json** inicializado
- [ ] **tsconfig.json** configurado
- [ ] **Dependencias** instaladas: `pnpm install`
- [ ] **Variables de entorno** en `.env`
- [ ] **TypeScript compila**: `pnpm run build`
- [ ] **Tests corren**: `pnpm run test:run`
- [ ] **API keys funcionan**: Script test-setup.ts

### Comandos de Verificación

Ejecuta estos en orden:

```bash
# 1. Verificar instalación de dependencias
pnpm install

# 2. Verificar compilación TypeScript
pnpm run build

# 3. Verificar versiones
node --version  # Debe ser v20.x.x
pnpm --version  # Debe ser 8.x.x
```

**Salida esperada:**
```
v20.11.0 (o superior)
8.15.0 (o superior)
```

```bash
# 4. Verificar variables de entorno
cat .env | grep API_KEY
```

**Salida esperada:**
```
ANTHROPIC_API_KEY=sk-ant-...
DEEPSEEK_API_KEY=sk-...
```

```bash
# 5. Ejecutar tests básicos
pnpm run test:run
```

**Salida esperada:**
```
✓ src/__tests__/... (n tests)
```

### Test básico de conectividad

Crea un archivo `src/test-setup.ts`:

```typescript:src/test-setup.ts
import { config } from 'dotenv';
import { Anthropic } from '@anthropic-ai/sdk';

// Cargar variables de entorno
config();

async function testSetup() {
  console.log('🧪 Verificando setup...\n');

  // Verificar API keys
  const hasClaude = !!process.env.ANTHROPIC_API_KEY;
  const hasDeepSeek = !!process.env.DEEPSEEK_API_KEY;

  console.log(`Claude API Key: ${hasClaude ? '✅' : '❌'}`);
  console.log(`DeepSeek API Key: ${hasDeepSeek ? '✅' : '❌'}\n`);

  // Test básico con Claude
  if (hasClaude) {
    try {
      const client = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY
      });

      const response = await client.messages.create({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 100,
        messages: [{ role: 'user', content: 'Say "Hello World" and nothing else.' }]
      });

      console.log('Claude test: ✅');
      console.log('Response:', response.content[0].type === 'text' ? response.content[0].text : 'N/A');
    } catch (error) {
      console.log('Claude test: ❌');
      console.error('Error:', error.message);
    }
  }

  console.log('\n🎉 Setup verification complete!');
}

// Ejecutar test
testSetup().catch(console.error);
```

Ejecuta el test:
```bash
tsx src/test-setup.ts
```

## Troubleshooting Común

### ❌ Error: "Cannot find module '@anthropic-ai/sdk'"

**Causa:** Dependencias no instaladas o versión incorrecta

```bash
# Solución 1: Reinstalar todo (nuclear)
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Solución 2: Actualizar solo la dependencia
pnpm add @anthropic-ai/sdk@latest

# Solución 3: Verificar que el módulo existe
ls node_modules/@anthropic-ai/sdk/package.json
```

### ❌ Error: "API key not found" o "401 Unauthorized"

**Causa:** Variables de entorno no cargadas o key inválida

```bash
# Verificación 1: .env existe
ls -la .env

# Verificación 2: .env tiene contenido válido
cat .env | grep API_KEY
# Debe mostrar: ANTHROPIC_API_KEY=sk-ant-...

# Verificación 3: .env está en .gitignore
cat .gitignore | grep "^\.env$"

# Verificación 4: Tu API key es válida
# Accede a https://console.anthropic.com/account/keys
# Verifica que la key no está revocada
```

> **⚠️ Nota:** Si copias el .env desde otro proyecto, asegúrate de que las keys están vigentes.

### ❌ Error: "TypeScript compilation failed"

**Causa:** Errores de tipo en tu código o configuración tsconfig.json

```bash
# Ver errores detallados
pnpm run lint

# Forzar recompilación limpia
rm -rf dist
pnpm run build

# Si aún falla, verificar tsconfig.json
cat tsconfig.json | grep -A 5 "strict"
```

**Errores comunes:**
- `Type 'X' is not assignable to type 'Y'` → Falta casting o tipo incorrecto
- `Cannot find name 'process'` → Falta `@types/node`
- `Module not found` → Archivo no existe o path incorrecto

### ❌ Error: "Node.js version too old"

**Causa:** Tienes Node.js < 20

```bash
# Verificar tu versión actual
node --version

# Si es menor a v20, actualizar
nvm install 20
nvm use 20
nvm alias default 20

# Verificar que cambió
node --version  # Debe ser v20.x.x
```

### ❌ Error: "pnpm: command not found"

**Causa:** pnpm no instalado o no en PATH

```bash
# Instalar globalmente
npm install -g pnpm

# Si aún no funciona, verificar PATH
which pnpm

# Si no aparece, reiniciar terminal
# Si sigue sin funcionar, usar npm en lugar de pnpm
npm install  # En lugar de pnpm install
```

### ❌ Error: ".env not found" en test-setup.ts

**Causa:** El script no encuentra el archivo .env

```bash
# Verificación 1: Estás en la carpeta correcta
pwd  # Debe terminar en /taller-ia-agentes

# Verificación 2: .env existe en la raíz
ls -la .env

# Verificación 3: Ejecutar desde la carpeta correcta
cd /ruta/a/taller-ia-agentes
tsx src/test-setup.ts
```

## Siguientes Pasos

Una vez completado el setup:

1. **Lee la guía del [Agente de Tareas](./agente-tareas.md)** para crear tu primer agente
2. **Revisa el [Agente Investigador](./agente-investigador.md)** para patrones avanzados
3. **Configura tu IDE** con extensiones de TypeScript y ESLint

¿Todo listo? ¡Vamos a construir agentes! 🤖
