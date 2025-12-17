---
sidebar_position: 3
---

# Agente de Tareas

Tutorial paso a paso para construir tu primer agente de IA funcional. Aprenderás los conceptos fundamentales de agentes, el patrón Tool Use, y crearás un agente que puede ejecutar tareas usando herramientas personalizadas.

## ¿Qué es un Agente de IA?

Un agente de IA es un sistema que puede:
- **Percibir** su entorno (leer datos, recibir inputs)
- **Razonar** sobre qué hacer (procesar información con un LLM)
- **Actuar** en el mundo (ejecutar herramientas, llamar APIs)
- **Aprender** de sus acciones (mejorar con feedback)

A diferencia de un chatbot que solo responde, un agente **toma decisiones y ejecuta acciones**.

### El Ciclo Básico de un Agente

```
Usuario → Prompt + Contexto → LLM → Decide usar herramienta → Ejecuta herramienta → Procesa resultado → Responde
```

Este ciclo se repite hasta completar la tarea. Es el patrón fundamental de todos los agentes modernos.

## Patrón Tool Use

El patrón Tool Use permite que el LLM "extienda sus capacidades" llamando a funciones externas. El flujo es:

1. **Definir herramientas**: Describe qué pueden hacer tus tools en JSON Schema
2. **Enviar al LLM**: Incluye las tool definitions en el prompt
3. **LLM decide**: El modelo elige qué tool usar y con qué parámetros
4. **Ejecutar**: Tu código ejecuta la tool con los parámetros del LLM
5. **Continuar**: Envía el resultado de vuelta al LLM para el siguiente paso

### Ejemplo Conceptual

```typescript
// 1. Definir una herramienta
const tools = [
  {
    name: "read_file",
    description: "Lee el contenido de un archivo",
    parameters: {
      type: "object",
      properties: {
        path: { type: "string", description: "Ruta del archivo" }
      },
      required: ["path"]
    }
  }
];

// 2. LLM decide usarla
// Respuesta del LLM: { "tool": "read_file", "parameters": { "path": "./tareas.txt" } }

// 3. Tu código ejecuta
const result = await readFile("./tareas.txt");

// 4. Envía resultado de vuelta al LLM
// Continúa el ciclo...
```

## Construcción Paso a Paso

Vamos a construir un agente que gestione tareas pendientes. El agente podrá:
- Leer tareas de un archivo
- Añadir nuevas tareas
- Marcar tareas como completadas
- Listar tareas pendientes

### Paso 1: Tipos y Interfaces

Primero definamos los tipos TypeScript:

```typescript:src/types/tasks.ts
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

export interface TaskManager {
  getTasks(): Promise<Task[]>;
  addTask(title: string, description?: string): Promise<Task>;
  completeTask(id: string): Promise<Task>;
  getPendingTasks(): Promise<Task[]>;
}

export interface ToolCall {
  id: string;
  tool: string;
  parameters: Record<string, any>;
}

export interface AgentResponse {
  message: string;
  toolCalls?: ToolCall[];
  final?: boolean;
}
```

### Paso 2: Implementar el Task Manager

Crea una clase que gestione las tareas (simulando una base de datos):

```typescript:src/tools/task-manager.ts
import { Task, TaskManager } from '../types/tasks';
import { writeFile, readFile } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

export class FileTaskManager implements TaskManager {
  private filePath: string;

  constructor(filePath: string = './tasks.json') {
    this.filePath = filePath;
  }

  private async loadTasks(): Promise<Task[]> {
    try {
      const data = await readFile(this.filePath, 'utf-8');
      const tasks = JSON.parse(data);
      // Convertir strings de fecha a objetos Date
      return tasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        completedAt: task.completedAt ? new Date(task.completedAt) : undefined
      }));
    } catch {
      return [];
    }
  }

  private async saveTasks(tasks: Task[]): Promise<void> {
    await writeFile(this.filePath, JSON.stringify(tasks, null, 2));
  }

  async getTasks(): Promise<Task[]> {
    return this.loadTasks();
  }

  async addTask(title: string, description?: string): Promise<Task> {
    const tasks = await this.loadTasks();
    const newTask: Task = {
      id: uuidv4(),
      title,
      description,
      completed: false,
      createdAt: new Date()
    };

    tasks.push(newTask);
    await this.saveTasks(tasks);
    return newTask;
  }

  async completeTask(id: string): Promise<Task> {
    const tasks = await this.loadTasks();
    const task = tasks.find(t => t.id === id);

    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }

    if (task.completed) {
      throw new Error(`Task ${id} is already completed`);
    }

    task.completed = true;
    task.completedAt = new Date();
    await this.saveTasks(tasks);
    return task;
  }

  async getPendingTasks(): Promise<Task[]> {
    const tasks = await this.loadTasks();
    return tasks.filter(task => !task.completed);
  }
}
```

### Paso 3: Definir las Tools

Ahora definamos las herramientas que el LLM puede usar:

```typescript:src/tools/definitions.ts
import { z } from 'zod';

// Esquemas de validación con Zod
export const AddTaskSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional()
});

export const CompleteTaskSchema = z.object({
  id: z.string().uuid()
});

export const ListTasksSchema = z.object({
  filter: z.enum(['all', 'pending', 'completed']).optional().default('all')
});

// Definiciones de tools para el LLM
export const taskTools = [
  {
    name: 'add_task',
    description: 'Añade una nueva tarea a la lista. Usa esto cuando el usuario quiera crear una tarea.',
    inputSchema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Título de la tarea (máximo 100 caracteres)'
        },
        description: {
          type: 'string',
          description: 'Descripción opcional de la tarea (máximo 500 caracteres)'
        }
      },
      required: ['title']
    }
  },
  {
    name: 'complete_task',
    description: 'Marca una tarea como completada. Necesitas el ID de la tarea.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'ID único de la tarea a completar'
        }
      },
      required: ['id']
    }
  },
  {
    name: 'list_tasks',
    description: 'Lista las tareas según el filtro especificado.',
    inputSchema: {
      type: 'object',
      properties: {
        filter: {
          type: 'string',
          enum: ['all', 'pending', 'completed'],
          description: 'Filtro para las tareas: all (todas), pending (pendientes), completed (completadas)',
          default: 'all'
        }
      }
    }
  }
];
```

### Paso 4: Crear el Agente Principal

Ahora el agente que coordina todo:

```typescript:src/agents/task-agent.ts
import { Anthropic } from '@anthropic-ai/sdk';
import { TaskManager } from '../types/tasks';
import { taskTools, AddTaskSchema, CompleteTaskSchema, ListTasksSchema } from '../tools/definitions';
import { FileTaskManager } from '../tools/task-manager';

export class TaskAgent {
  private client: Anthropic;
  private taskManager: TaskManager;

  constructor(apiKey: string, taskManager?: TaskManager) {
    this.client = new Anthropic({ apiKey });
    this.taskManager = taskManager || new FileTaskManager();
  }

  async execute(userMessage: string): Promise<string> {
    const messages = [
      {
        role: 'user' as const,
        content: userMessage
      }
    ];

    let response = await this.callLLM(messages);
    let iterations = 0;
    const maxIterations = 5; // Previene loops infinitos

    while (iterations < maxIterations) {
      // Si el LLM quiere usar tools
      if (response.toolCalls && response.toolCalls.length > 0) {
        const toolResults = await this.executeTools(response.toolCalls);

        // Añadir la respuesta del LLM y resultados de tools al contexto
        messages.push({
          role: 'assistant',
          content: response.message
        });

        // Añadir resultados de tools
        for (const result of toolResults) {
          messages.push({
            role: 'user',
            content: `Tool result for ${result.tool}: ${result.result}`
          });
        }

        // Continuar el ciclo
        response = await this.callLLM(messages);
        iterations++;
      } else {
        // Respuesta final
        return response.message;
      }
    }

    return 'Lo siento, el agente alcanzó el límite máximo de iteraciones. ¿Puedes reformular tu solicitud?';
  }

  private async callLLM(messages: any[]): Promise<any> {
    try {
      const response = await this.client.messages.create({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 1000,
        messages,
        tools: taskTools
      });

      const content = response.content[0];

      if (content.type === 'text') {
        return { message: content.text };
      } else if (content.type === 'tool_use') {
        return {
          message: content.text || '',
          toolCalls: [{
            id: content.id,
            tool: content.name,
            parameters: content.input
          }]
        };
      }
    } catch (error) {
      console.error('Error calling LLM:', error);
      return { message: 'Lo siento, hubo un error procesando tu solicitud.' };
    }
  }

  private async executeTools(toolCalls: any[]): Promise<any[]> {
    const results = [];

    for (const call of toolCalls) {
      try {
        let result;

        switch (call.tool) {
          case 'add_task':
            const addParams = AddTaskSchema.parse(call.parameters);
            result = await this.taskManager.addTask(addParams.title, addParams.description);
            break;

          case 'complete_task':
            const completeParams = CompleteTaskSchema.parse(call.parameters);
            result = await this.taskManager.completeTask(completeParams.id);
            break;

          case 'list_tasks':
            const listParams = ListTasksSchema.parse(call.parameters);
            switch (listParams.filter) {
              case 'pending':
                result = await this.taskManager.getPendingTasks();
                break;
              case 'completed':
                const allTasks = await this.taskManager.getTasks();
                result = allTasks.filter(t => t.completed);
                break;
              default:
                result = await this.taskManager.getTasks();
            }
            break;

          default:
            throw new Error(`Tool ${call.tool} not found`);
        }

        results.push({
          tool: call.tool,
          result: JSON.stringify(result, null, 2)
        });

      } catch (error) {
        results.push({
          tool: call.tool,
          result: `Error: ${error.message}`
        });
      }
    }

    return results;
  }
}
```

### Paso 5: Punto de Entrada

Crea un script para probar el agente:

```typescript:src/index.ts
import { config } from 'dotenv';
import { TaskAgent } from './agents/task-agent';

// Cargar variables de entorno
config();

async function main() {
  const agent = new TaskAgent(process.env.ANTHROPIC_API_KEY!);

  console.log('🤖 Task Agent iniciado. Escribe tus comandos:\n');

  // Ejemplos de uso
  const examples = [
    'Añade una tarea para "Comprar leche"',
    'Lista todas las tareas',
    'Añade una tarea para "Hacer ejercicio" con descripción "Ir al gimnasio 3 veces por semana"',
    'Lista las tareas pendientes',
    'Completa la tarea con ID xxx' // Reemplaza con ID real
  ];

  console.log('Ejemplos de comandos:');
  examples.forEach(example => console.log(`  • "${example}"`));
  console.log('\nEscribe "exit" para salir.\n');

  // Bucle interactivo
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const askQuestion = () => {
    rl.question('Tú: ', async (input: string) => {
      if (input.toLowerCase() === 'exit') {
        console.log('👋 ¡Hasta luego!');
        rl.close();
        return;
      }

      try {
        console.log('🤔 Pensando...');
        const response = await agent.execute(input);
        console.log(`🤖 ${response}\n`);
      } catch (error) {
        console.error('❌ Error:', error.message);
      }

      askQuestion();
    });
  };

  askQuestion();
}

main().catch(console.error);
```

## Manejo de Errores

El agente debe manejar errores gracefully:

```typescript:src/agents/error-handling.ts
export class AgentError extends Error {
  constructor(
    message: string,
    public code: string,
    public tool?: string
  ) {
    super(message);
    this.name = 'AgentError';
  }
}

export function handleToolError(toolName: string, error: any): string {
  if (error instanceof AgentError) {
    return `Error en ${toolName}: ${error.message}`;
  }

  if (error.code === 'VALIDATION_ERROR') {
    return `Parámetros inválidos para ${toolName}: ${error.message}`;
  }

  if (error.code === 'NOT_FOUND') {
    return `Recurso no encontrado en ${toolName}: ${error.message}`;
  }

  // Error genérico
  return `Error inesperado en ${toolName}: ${error.message}`;
}
```

## Testing del Agente

Crea tests para verificar que el agente funciona:

```typescript:src/__tests__/task-agent.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TaskAgent } from '../agents/task-agent';
import { TaskManager } from '../types/tasks';

// Mock del TaskManager
const mockTaskManager: TaskManager = {
  getTasks: vi.fn(),
  addTask: vi.fn(),
  completeTask: vi.fn(),
  getPendingTasks: vi.fn()
};

// Mock de Anthropic
vi.mock('@anthropic-ai/sdk', () => ({
  Anthropic: vi.fn().mockImplementation(() => ({
    messages: {
      create: vi.fn()
    }
  }))
}));

describe('TaskAgent', () => {
  let agent: TaskAgent;

  beforeEach(() => {
    agent = new TaskAgent('fake-key', mockTaskManager);
    vi.clearAllMocks();
  });

  it('should handle add task requests', async () => {
    mockTaskManager.addTask.mockResolvedValue({
      id: '123',
      title: 'Test task',
      completed: false,
      createdAt: new Date()
    });

    // Aquí irían las pruebas específicas
    expect(true).toBe(true); // Placeholder
  });

  it('should validate tool parameters', () => {
    // Pruebas de validación con Zod
    expect(true).toBe(true); // Placeholder
  });
});
```

## Ejecutando el Agente

Para probar tu agente:

```bash
# Compilar
pnpm run build

# Ejecutar
pnpm run dev

# En otra terminal, ejecutar tests
pnpm run test
```

### Ejemplo de Interacción

```
Tú: Añade una tarea para comprar leche
🤔 Pensando...
🤖 He añadido la tarea "comprar leche" con ID: abc-123-def

Tú: Lista todas las tareas
🤔 Pensando...
🤖 Aquí están todas tus tareas:
- comprar leche (ID: abc-123-def) - Pendiente

Tú: Completa la tarea abc-123-def
🤔 Pensando...
🤖 He marcado como completada la tarea "comprar leche"
```

## Conceptos Avanzados

Una vez que entiendes lo básico, puedes explorar:

- **Agentes con memoria**: Recordar conversaciones anteriores
- **Agentes multi-paso**: Planificar antes de ejecutar
- **Agentes paralelos**: Ejecutar múltiples tools simultáneamente
- **Agentes con estado**: Mantener contexto entre sesiones

## Troubleshooting

### El agente no responde
- Verifica tu API key de Anthropic
- Revisa los logs de errores
- Asegúrate de que las tools están bien definidas

### Error de validación
- Los parámetros no coinciden con el schema
- Usa Zod para validar inputs antes de enviar

### Loop infinito
- Implementa límite de iteraciones
- Añade timeout para cada tool call

## Próximos Pasos

Ahora que tienes un agente básico funcionando:

1. **Experimenta** modificando las tools
2. **Añade más funcionalidades** (borrar tareas, editar, etc.)
3. **Lee sobre el [Agente Investigador](./agente-investigador.md)** para patrones avanzados
4. **Explora los [Ejercicios](./ejercicios.md)** para practicar

¿Tu primer agente funciona? ¡Felicitaciones! Has dado el primer paso hacia sistemas de IA más sofisticados. 🚀
