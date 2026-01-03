---
sidebar_position: 3
---

# Módulo 2: TypeScript Esencial para Agentes

Este módulo te enseñará TypeScript desde la perspectiva de un desarrollador de agentes de IA. No cubriremos todo TypeScript, sino lo que necesitas para construir agentes robustos y mantenibles.

**⏱️ Duración estimada:** 2 horas

## 🎯 Requisitos Previos

- **Módulo 1 completado**: Entiendes qué es un agente y cómo funciona la API de Claude
- **JavaScript ES6+**: Arrow functions, destructuring, async/await, modules
- **Node.js 20+**: Instalado y funcionando

### Lo que NO necesitas

- Experiencia previa con TypeScript
- Conocimiento de frameworks (React, Angular, etc.)
- Configuración avanzada de tsconfig

## 📖 Contenido

### 1. ¿Por Qué TypeScript para Agentes?

En el módulo anterior viste que los LLMs devuelven texto. Pero en un agente real, ese texto contiene:
- Decisiones de qué herramienta usar
- Parámetros para ejecutar funciones
- Datos estructurados (JSON)

**El problema con JavaScript puro:**

```javascript
// ❌ JavaScript: No sabes qué viene en response
const response = await anthropic.messages.create({...});
const decision = JSON.parse(response.content[0].text);

// ¿decision.tool existe? ¿Es string? ¿Tiene parámetros válidos?
await executeToolSync(decision.tool, decision.params);
// 💥 Runtime error: Cannot read property 'params' of undefined
```

**La solución con TypeScript:**

```typescript
// ✅ TypeScript: Defines exactamente qué esperas
interface ToolDecision {
  tool: 'search' | 'calculate' | 'write_file';
  params: Record<string, unknown>;
  reasoning: string;
}

const decision = parseToolDecision(response); // Retorna ToolDecision o error
await executeTool(decision.tool, decision.params);
// ✅ El compilador garantiza que decision tiene la forma correcta
```

### 2. Tipos Básicos para Agentes

#### Tipos primitivos y uniones

```typescript
// Tipos básicos que usarás constantemente
type ModelName = 'claude-sonnet-4-20250514' | 'claude-3-opus-20240229' | 'claude-3-haiku-20240307';
type Role = 'user' | 'assistant';
type ToolResult = 'success' | 'error' | 'pending';

// Union types para estados del agente
type AgentState =
  | { status: 'idle' }
  | { status: 'thinking'; currentStep: number }
  | { status: 'executing'; tool: string }
  | { status: 'complete'; result: string }
  | { status: 'error'; message: string };
```

#### Interfaces para mensajes

```typescript
// Estructura de mensajes de Claude
interface Message {
  role: Role;
  content: string | ContentBlock[];
}

interface ContentBlock {
  type: 'text' | 'tool_use' | 'tool_result';
  text?: string;
  id?: string;
  name?: string;
  input?: Record<string, unknown>;
}

// Historial tipado
type ConversationHistory = Message[];
```

#### Generics para herramientas

```typescript
// Herramienta genérica que puedes especializar
interface Tool<TInput, TOutput> {
  name: string;
  description: string;
  inputSchema: object;
  execute: (input: TInput) => Promise<TOutput>;
}

// Especialización para herramienta de búsqueda
interface SearchInput {
  query: string;
  maxResults?: number;
}

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

const searchTool: Tool<SearchInput, SearchResult[]> = {
  name: 'web_search',
  description: 'Busca información en la web',
  inputSchema: {
    type: 'object',
    properties: {
      query: { type: 'string' },
      maxResults: { type: 'number' }
    },
    required: ['query']
  },
  execute: async (input) => {
    // input está tipado como SearchInput
    // retorno debe ser SearchResult[]
    return [{ title: 'Resultado', url: 'https://...', snippet: '...' }];
  }
};
```

### 3. Zod: Validación en Runtime

TypeScript solo valida en tiempo de compilación. Pero los datos del LLM llegan en runtime. Necesitas **validación en runtime**.

#### ¿Por qué Zod?

```typescript
// El LLM devuelve JSON como string
const llmOutput = '{"tool": "search", "query": "typescript tutorial"}';

// JSON.parse no valida estructura
const parsed = JSON.parse(llmOutput); // tipo: any 😱

// Con Zod, defines esquema + validas + obtienes tipos
import { z } from 'zod';

const ToolCallSchema = z.object({
  tool: z.enum(['search', 'calculate', 'write_file']),
  query: z.string().min(1),
  options: z.object({
    maxResults: z.number().optional().default(10)
  }).optional()
});

// Infiere el tipo TypeScript del esquema
type ToolCall = z.infer<typeof ToolCallSchema>;

// Valida en runtime Y obtiene tipo correcto
const result = ToolCallSchema.safeParse(parsed);
if (result.success) {
  // result.data es tipo ToolCall ✅
  console.log(result.data.tool); // autocompletado funciona
} else {
  // result.error tiene detalles del fallo
  console.error('LLM devolvió formato inválido:', result.error.issues);
}
```

#### Esquemas comunes para agentes

```typescript
import { z } from 'zod';

// Esquema para respuesta del LLM con tool calls
const LLMResponseSchema = z.object({
  thinking: z.string().describe('Razonamiento del agente'),
  action: z.discriminatedUnion('type', [
    z.object({
      type: z.literal('tool_call'),
      tool: z.string(),
      parameters: z.record(z.unknown())
    }),
    z.object({
      type: z.literal('final_answer'),
      answer: z.string()
    }),
    z.object({
      type: z.literal('ask_user'),
      question: z.string()
    })
  ])
});

// Esquema para configuración del agente
const AgentConfigSchema = z.object({
  model: z.enum(['claude-sonnet-4-20250514', 'claude-3-haiku-20240307']).default('claude-sonnet-4-20250514'),
  maxIterations: z.number().min(1).max(50).default(10),
  temperature: z.number().min(0).max(1).default(0.1),
  tools: z.array(z.string()).min(1),
  systemPrompt: z.string().optional()
});

type AgentConfig = z.infer<typeof AgentConfigSchema>;
```

#### Transformaciones con Zod

```typescript
// Zod puede transformar datos mientras valida
const DateStringSchema = z.string().transform((str) => new Date(str));

const APIResponseSchema = z.object({
  data: z.array(z.object({
    id: z.string(),
    created_at: DateStringSchema, // String → Date automáticamente
    content: z.string().transform((s) => s.trim())
  })),
  pagination: z.object({
    total: z.number(),
    page: z.number()
  })
});
```

### 4. Tipos para la API de Claude

El SDK de Anthropic ya viene con tipos, pero necesitas entender cómo usarlos:

```typescript
import Anthropic from '@anthropic-ai/sdk';
import type {
  MessageCreateParams,
  Message,
  ContentBlock,
  ToolUseBlock,
  TextBlock
} from '@anthropic-ai/sdk/resources/messages';

// Configuración tipada para crear mensajes
const params: MessageCreateParams = {
  model: 'claude-sonnet-4-20250514',
  max_tokens: 1024,
  messages: [
    { role: 'user', content: 'Hola' }
  ],
  tools: [
    {
      name: 'get_weather',
      description: 'Obtiene el clima de una ciudad',
      input_schema: {
        type: 'object' as const,
        properties: {
          city: { type: 'string', description: 'Nombre de la ciudad' }
        },
        required: ['city']
      }
    }
  ]
};

// Procesar respuesta con tipos
async function processResponse(response: Message): Promise<void> {
  for (const block of response.content) {
    if (block.type === 'text') {
      // TypeScript sabe que block es TextBlock
      console.log('Texto:', block.text);
    } else if (block.type === 'tool_use') {
      // TypeScript sabe que block es ToolUseBlock
      console.log('Herramienta:', block.name);
      console.log('Input:', block.input);
    }
  }
}
```

#### Type guards para bloques de contenido

```typescript
// Type guards personalizados
function isToolUseBlock(block: ContentBlock): block is ToolUseBlock {
  return block.type === 'tool_use';
}

function isTextBlock(block: ContentBlock): block is TextBlock {
  return block.type === 'text';
}

// Uso limpio
const toolBlocks = response.content.filter(isToolUseBlock);
const textBlocks = response.content.filter(isTextBlock);
```

### 5. Manejo de Errores Tipado

Los agentes fallan. Mucho. Necesitas errores que puedas manejar programáticamente.

#### Clases de error personalizadas

```typescript
// Errores base del agente
class AgentError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly recoverable: boolean = false
  ) {
    super(message);
    this.name = 'AgentError';
  }
}

// Errores específicos
class ToolExecutionError extends AgentError {
  constructor(
    public readonly toolName: string,
    public readonly originalError: Error
  ) {
    super(
      `Tool "${toolName}" failed: ${originalError.message}`,
      'TOOL_EXECUTION_FAILED',
      true // Puede reintentar
    );
    this.name = 'ToolExecutionError';
  }
}

class LLMParseError extends AgentError {
  constructor(
    public readonly rawOutput: string,
    public readonly zodError: z.ZodError
  ) {
    super(
      `Failed to parse LLM output: ${zodError.message}`,
      'LLM_PARSE_FAILED',
      true
    );
    this.name = 'LLMParseError';
  }
}

class MaxIterationsError extends AgentError {
  constructor(public readonly iterations: number) {
    super(
      `Agent exceeded max iterations (${iterations})`,
      'MAX_ITERATIONS_EXCEEDED',
      false // No recuperable
    );
    this.name = 'MaxIterationsError';
  }
}
```

#### Resultado tipado (Either pattern)

```typescript
// Patrón Result para evitar try/catch en cadena
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// Función helper para crear results
function ok<T>(data: T): Result<T, never> {
  return { success: true, data };
}

function err<E>(error: E): Result<never, E> {
  return { success: false, error };
}

// Uso en herramientas
async function executeTool(
  name: string,
  params: unknown
): Promise<Result<unknown, ToolExecutionError>> {
  try {
    const result = await tools[name].execute(params);
    return ok(result);
  } catch (e) {
    return err(new ToolExecutionError(name, e as Error));
  }
}

// Manejo limpio
const result = await executeTool('search', { query: 'typescript' });
if (result.success) {
  console.log('Resultado:', result.data);
} else {
  console.error('Error:', result.error.toolName, result.error.message);
  // Decidir si reintentar basado en result.error.recoverable
}
```

### 6. Configuración de TypeScript para Agentes

#### tsconfig.json recomendado

```json
{
  "compilerOptions": {
    // Esencial para Node.js moderno
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",

    // Máxima seguridad de tipos
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,

    // Mejor experiencia de desarrollo
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,

    // Output
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### Flags críticos explicados

| Flag | Por qué es importante para agentes |
|------|-----------------------------------|
| `strict: true` | Atrapa nulls/undefined antes de runtime |
| `noUncheckedIndexedAccess` | Previene `obj[key]` sin verificar undefined |
| `noImplicitReturns` | Garantiza que todas las ramas retornan valor |
| `moduleResolution: NodeNext` | Soporte correcto de ES modules en Node |

## 🛠️ Proyecto Práctico: Typed Tool Function

Vamos a crear una herramienta tipada completa que el agente pueda usar. Este proyecto aplica todo lo aprendido.

### Paso 1: Configurar proyecto

```bash
# Crear proyecto
mkdir agente-typescript && cd agente-typescript

# Inicializar
npm init -y
npm pkg set type=module

# Instalar dependencias
npm install @anthropic-ai/sdk zod
npm install -D typescript @types/node tsx

# Crear tsconfig
npx tsc --init
```

### Paso 2: Configurar TypeScript

Reemplaza el contenido de `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

### Paso 3: Crear tipos base

Crea `src/types.ts`:

```typescript
import { z } from 'zod';

// Esquema de herramienta calculadora
export const CalculatorInputSchema = z.object({
  operation: z.enum(['add', 'subtract', 'multiply', 'divide']),
  a: z.number(),
  b: z.number()
});

export type CalculatorInput = z.infer<typeof CalculatorInputSchema>;

export interface CalculatorOutput {
  result: number;
  expression: string;
}

// Esquema de respuesta del LLM
export const AgentResponseSchema = z.object({
  thinking: z.string(),
  action: z.discriminatedUnion('type', [
    z.object({
      type: z.literal('use_tool'),
      tool: z.literal('calculator'),
      input: CalculatorInputSchema
    }),
    z.object({
      type: z.literal('respond'),
      message: z.string()
    })
  ])
});

export type AgentResponse = z.infer<typeof AgentResponseSchema>;

// Resultado tipado
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };
```

### Paso 4: Crear la herramienta

Crea `src/tools/calculator.ts`:

```typescript
import type { CalculatorInput, CalculatorOutput, Result } from '../types.js';

export class CalculatorTool {
  readonly name = 'calculator';
  readonly description = 'Performs basic arithmetic operations';

  readonly inputSchema = {
    type: 'object' as const,
    properties: {
      operation: {
        type: 'string',
        enum: ['add', 'subtract', 'multiply', 'divide'],
        description: 'The arithmetic operation to perform'
      },
      a: { type: 'number', description: 'First operand' },
      b: { type: 'number', description: 'Second operand' }
    },
    required: ['operation', 'a', 'b']
  };

  execute(input: CalculatorInput): Result<CalculatorOutput> {
    const { operation, a, b } = input;

    let result: number;
    let operator: string;

    switch (operation) {
      case 'add':
        result = a + b;
        operator = '+';
        break;
      case 'subtract':
        result = a - b;
        operator = '-';
        break;
      case 'multiply':
        result = a * b;
        operator = '*';
        break;
      case 'divide':
        if (b === 0) {
          return {
            success: false,
            error: new Error('Division by zero is not allowed')
          };
        }
        result = a / b;
        operator = '/';
        break;
    }

    return {
      success: true,
      data: {
        result,
        expression: `${a} ${operator} ${b} = ${result}`
      }
    };
  }
}
```

### Paso 5: Crear el agente

Crea `src/agent.ts`:

```typescript
import Anthropic from '@anthropic-ai/sdk';
import { AgentResponseSchema, type AgentResponse, type Result } from './types.js';
import { CalculatorTool } from './tools/calculator.js';

export class TypedAgent {
  private client: Anthropic;
  private calculator: CalculatorTool;

  constructor() {
    this.client = new Anthropic();
    this.calculator = new CalculatorTool();
  }

  async run(userMessage: string): Promise<string> {
    console.log('🤖 Usuario:', userMessage);

    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: `Eres un agente que puede hacer cálculos matemáticos.

Cuando el usuario pida un cálculo, responde SOLO con JSON válido en este formato:
{
  "thinking": "tu razonamiento",
  "action": {
    "type": "use_tool",
    "tool": "calculator",
    "input": { "operation": "add|subtract|multiply|divide", "a": number, "b": number }
  }
}

O si no necesitas calcular:
{
  "thinking": "tu razonamiento",
  "action": { "type": "respond", "message": "tu respuesta" }
}

SOLO responde con JSON, sin texto adicional.`,
      messages: [{ role: 'user', content: userMessage }]
    });

    const textContent = response.content.find(b => b.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from LLM');
    }

    // Parsear y validar con Zod
    const parseResult = this.parseResponse(textContent.text);
    if (!parseResult.success) {
      console.error('❌ Error de parsing:', parseResult.error.message);
      return `Error: No pude entender la respuesta del modelo`;
    }

    const agentResponse = parseResult.data;
    console.log('💭 Pensando:', agentResponse.thinking);

    // Ejecutar acción
    if (agentResponse.action.type === 'use_tool') {
      console.log('🔧 Usando herramienta:', agentResponse.action.tool);

      const toolResult = this.calculator.execute(agentResponse.action.input);

      if (toolResult.success) {
        console.log('✅ Resultado:', toolResult.data.expression);
        return toolResult.data.expression;
      } else {
        console.error('❌ Error en herramienta:', toolResult.error.message);
        return `Error: ${toolResult.error.message}`;
      }
    } else {
      return agentResponse.action.message;
    }
  }

  private parseResponse(text: string): Result<AgentResponse> {
    try {
      const json = JSON.parse(text);
      const result = AgentResponseSchema.safeParse(json);

      if (result.success) {
        return { success: true, data: result.data };
      } else {
        return {
          success: false,
          error: new Error(result.error.issues.map(i => i.message).join(', '))
        };
      }
    } catch (e) {
      return {
        success: false,
        error: new Error(`Invalid JSON: ${(e as Error).message}`)
      };
    }
  }
}
```

### Paso 6: Crear punto de entrada

Crea `src/index.ts`:

```typescript
import { TypedAgent } from './agent.js';

async function main() {
  const agent = new TypedAgent();

  console.log('='.repeat(50));
  console.log('🚀 Agente TypeScript iniciado');
  console.log('='.repeat(50));

  // Test 1: Operación simple
  const result1 = await agent.run('¿Cuánto es 25 multiplicado por 4?');
  console.log('\n📊 Respuesta final:', result1);

  console.log('\n' + '-'.repeat(50) + '\n');

  // Test 2: División
  const result2 = await agent.run('Divide 100 entre 8');
  console.log('\n📊 Respuesta final:', result2);

  console.log('\n' + '-'.repeat(50) + '\n');

  // Test 3: Sin cálculo
  const result3 = await agent.run('¿Qué día es hoy?');
  console.log('\n📊 Respuesta final:', result3);
}

main().catch(console.error);
```

### Paso 7: Ejecutar

```bash
# Asegúrate de tener ANTHROPIC_API_KEY configurada
export ANTHROPIC_API_KEY=tu_api_key

# Ejecutar con tsx (sin compilar)
npx tsx src/index.ts

# O compilar y ejecutar
npx tsc
node dist/index.js
```

### Resultado esperado

```
==================================================
🚀 Agente TypeScript iniciado
==================================================
🤖 Usuario: ¿Cuánto es 25 multiplicado por 4?
💭 Pensando: El usuario quiere multiplicar 25 por 4...
🔧 Usando herramienta: calculator
✅ Resultado: 25 * 4 = 100

📊 Respuesta final: 25 * 4 = 100

--------------------------------------------------

🤖 Usuario: Divide 100 entre 8
💭 Pensando: Necesito dividir 100 entre 8...
🔧 Usando herramienta: calculator
✅ Resultado: 100 / 8 = 12.5

📊 Respuesta final: 100 / 8 = 12.5
```

## 🎯 Verificación de Aprendizaje

Antes de pasar al siguiente módulo, asegúrate de poder responder:

1. ¿Por qué TypeScript es esencial para agentes y no opcional?
2. ¿Cuál es la diferencia entre validación en compilación y runtime?
3. ¿Cómo usa Zod `z.infer` para generar tipos de TypeScript?
4. ¿Qué es un type guard y cuándo lo usarías?
5. ¿Por qué el patrón Result es mejor que try/catch para herramientas?

## 🚀 Reto Extra

Modifica el proyecto para:

1. Agregar una herramienta `converter` que convierta unidades (km a millas, celsius a fahrenheit)
2. Implementar un registro de errores que guarde los fallos de parsing en un archivo
3. Agregar tests unitarios para la validación de Zod

## ⚠️ Errores Comunes

### Error: Cannot find module

```
Error: Cannot find module './types.js'
```
**Solución**: En ES modules con TypeScript, siempre usa extensión `.js` en imports aunque el archivo sea `.ts`.

### Error: Type 'X' is not assignable to type 'Y'

```typescript
// El compilador te está protegiendo
const config = { model: 'claude-gpt-4' }; // ❌ No existe este modelo
```
**Solución**: Revisa los tipos permitidos. TypeScript te dice exactamente qué valores son válidos.

### Error: Property 'X' does not exist

```typescript
const result = await tool.execute(input);
console.log(result.dato); // ❌ 'dato' no existe en el tipo Result
```
**Solución**: Verifica primero `result.success` para que TypeScript sepa qué propiedades existen.

## 📚 Recursos Adicionales

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Zod Documentation](https://zod.dev/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Total TypeScript (tutoriales avanzados)](https://www.totaltypescript.com/)

---

**Anterior**: [Módulo 1: Fundamentos de IA para Desarrolladores](./01-fundamentos.md)

**Siguiente**: [Módulo 3: Conceptos Clave de IA Agents](./03-conceptos.md)
