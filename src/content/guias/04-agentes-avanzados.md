---
title: "Módulo 4: Agentes Avanzados con Claude"
ruta: "agentes-ia"
orden: 5
duracion: "3 horas"
---
Este módulo te llevará al siguiente nivel construyendo agentes más sofisticados. Aprenderás técnicas avanzadas de prompt engineering, manejo de context windows, streaming de respuestas, y patrones robustos de recuperación de errores.

**⏱️ Duración estimada:** 3 horas

## 🎯 Requisitos Previos

- **Módulo 3 completado**: Dominas tool calling, patrón ReAct, y state management
- **Proyecto del Módulo 3 funcionando**: Tu agente de tareas ejecuta correctamente
- **Entiendes el ciclo de agente**: Sabes cómo fluyen los mensajes entre tu código y Claude

### Lo que NO necesitas

- Conocimiento de RAG (Retrieval Augmented Generation)
- Experiencia con bases de datos vectoriales
- Frameworks de orquestación (LangChain, LlamaIndex)

## 📖 Contenido

### 1. Prompt Engineering Avanzado para Agentes

En los módulos anteriores usamos prompts básicos. Ahora aprenderás técnicas que hacen a los agentes más confiables y predecibles.

#### System Prompts Estructurados

```typescript
// ❌ Prompt básico (poco confiable)
const basicPrompt = `Eres un asistente útil que ayuda con tareas.`;

// ✅ Prompt estructurado (predecible)
const structuredPrompt = `# Rol
Eres un agente investigador especializado en síntesis de información técnica.

# Capacidades
- Puedes buscar información usando la herramienta 'search'
- Puedes guardar notas usando la herramienta 'save_note'
- Puedes leer archivos usando la herramienta 'read_file'

# Limitaciones
- NO puedes acceder a internet directamente (solo via herramientas)
- NO inventes información que no hayas obtenido de las herramientas
- NO ejecutes código o comandos del sistema

# Comportamiento
1. Antes de responder, SIEMPRE usa las herramientas para verificar información
2. Si no encuentras datos suficientes, indícalo claramente
3. Cita las fuentes de donde obtuviste la información

# Formato de Salida
Responde SIEMPRE en español con el siguiente formato:
- Resumen: 1-2 oraciones
- Hallazgos: Lista de puntos clave
- Fuentes: Referencias utilizadas
- Confianza: Alta/Media/Baja con justificación`;
```

#### Técnica: Few-Shot Prompting

```typescript
const fewShotPrompt = `# Tarea
Clasifica la intención del usuario y decide qué herramienta usar.

# Ejemplos

Usuario: "Busca información sobre TypeScript"
Análisis: El usuario quiere información general sobre un tema técnico.
Herramienta: search
Parámetros: { "query": "TypeScript programming language overview" }

Usuario: "Guarda esto para después: React usa virtual DOM"
Análisis: El usuario quiere persistir una nota.
Herramienta: save_note
Parámetros: { "content": "React usa virtual DOM", "tags": ["react", "frontend"] }

Usuario: "¿Qué dice el archivo config.json?"
Análisis: El usuario quiere ver el contenido de un archivo específico.
Herramienta: read_file
Parámetros: { "path": "config.json" }

# Tu turno
Analiza el siguiente mensaje y decide la acción.`;
```

#### Técnica: Chain of Thought (CoT) Forzado

```typescript
const cotPrompt = `# Instrucciones
ANTES de ejecutar cualquier acción, debes escribir tu razonamiento.

Formato OBLIGATORIO:

<thinking>
1. ¿Qué está pidiendo el usuario exactamente?
2. ¿Qué información necesito para responder?
3. ¿Qué herramientas me ayudarían?
4. ¿Cuál es el orden óptimo de operaciones?
</thinking>

<action>
{
  "tool": "nombre_herramienta",
  "input": { ... }
}
</action>

IMPORTANTE: Nunca omitas la sección <thinking>. Si lo haces, tu respuesta será inválida.`;
```

#### Tabla de Técnicas de Prompting

| Técnica | Cuándo Usar | Beneficio |
|---------|-------------|-----------|
| **System Prompt Estructurado** | Siempre | Define comportamiento base consistente |
| **Few-Shot** | Tareas de clasificación o formato específico | El modelo aprende del ejemplo |
| **Chain of Thought** | Decisiones complejas o multi-paso | Razonamiento visible y auditable |
| **Constrained Output** | Necesitas formato exacto (JSON) | Parsing confiable |
| **Negative Examples** | Prevenir errores comunes | "NO hagas X" reduce errores |

### 2. Context Windows: Manejando la Memoria del LLM

El **context window** es la cantidad máxima de texto (tokens) que el modelo puede procesar en una sola llamada. Claude tiene un context window grande, pero no infinito.

#### Entendiendo Tokens

```typescript
// Regla práctica: ~4 caracteres = 1 token (en inglés)
// En español puede variar: ~3-5 caracteres por token

// Ejemplo de estimación
function estimateTokens(text: string): number {
  // Estimación conservadora para español
  return Math.ceil(text.length / 3.5);
}

// Límites de Claude (aproximados)
const MODEL_LIMITS = {
  'claude-sonnet-4-20250514': 200_000,  // ~150k palabras
  'claude-3-haiku-20240307': 200_000,
  'claude-3-opus-20240229': 200_000
};
```

#### Estrategias de Manejo de Contexto

```typescript
interface ContextManager {
  messages: Message[];
  maxTokens: number;
  reservedTokens: number;  // Para system prompt + respuesta
}

class SmartContextManager implements ContextManager {
  messages: Message[] = [];
  maxTokens: number;
  reservedTokens: number;

  constructor(maxTokens = 100_000, reservedTokens = 10_000) {
    this.maxTokens = maxTokens;
    this.reservedTokens = reservedTokens;
  }

  private estimateTokens(content: string): number {
    return Math.ceil(content.length / 3.5);
  }

  private getTotalTokens(): number {
    return this.messages.reduce(
      (sum, msg) => sum + this.estimateTokens(
        typeof msg.content === 'string'
          ? msg.content
          : JSON.stringify(msg.content)
      ),
      0
    );
  }

  addMessage(message: Message): void {
    this.messages.push(message);
    this.pruneIfNeeded();
  }

  private pruneIfNeeded(): void {
    const availableTokens = this.maxTokens - this.reservedTokens;

    while (this.getTotalTokens() > availableTokens && this.messages.length > 2) {
      // Estrategia: Mantener primer mensaje (contexto) y últimos mensajes
      // Eliminar mensajes del medio
      const midpoint = Math.floor(this.messages.length / 2);
      this.messages.splice(midpoint, 1);
    }
  }

  // Estrategia avanzada: Resumir mensajes antiguos
  async summarizeOldMessages(client: Anthropic): Promise<void> {
    if (this.messages.length < 10) return;

    const oldMessages = this.messages.slice(0, -5);
    const recentMessages = this.messages.slice(-5);

    // Pedir resumen al modelo
    const summaryResponse = await client.messages.create({
      model: 'claude-3-haiku-20240307',  // Modelo rápido para resúmenes
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: `Resume esta conversación en máximo 200 palabras, manteniendo información clave:

${oldMessages.map(m => `${m.role}: ${m.content}`).join('\n')}`
        }
      ]
    });

    const summary = summaryResponse.content[0];
    if (summary.type === 'text') {
      // Reemplazar mensajes antiguos con resumen
      this.messages = [
        {
          role: 'user',
          content: `[Resumen de conversación anterior: ${summary.text}]`
        },
        ...recentMessages
      ];
    }
  }
}
```

#### Contexto por Ventana Deslizante

```
┌─────────────────────────────────────────────────────────────────┐
│                    CONTEXT WINDOW (200K tokens)                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐                                           │
│  │  System Prompt   │  ← Siempre presente (~2K tokens)          │
│  │  (Fijo)          │                                           │
│  └──────────────────┘                                           │
│                                                                  │
│  ┌──────────────────┐                                           │
│  │  Resumen de      │  ← Mensajes antiguos resumidos (~5K)      │
│  │  Conversación    │                                           │
│  └──────────────────┘                                           │
│                                                                  │
│  ┌──────────────────┐                                           │
│  │  Mensajes        │                                           │
│  │  Recientes       │  ← Últimos N mensajes completos           │
│  │  (Ventana)       │    (~50K tokens)                          │
│  │                  │                                           │
│  └──────────────────┘                                           │
│                                                                  │
│  ┌──────────────────┐                                           │
│  │  Reservado       │  ← Espacio para respuesta (~4K tokens)    │
│  │  (Respuesta)     │                                           │
│  └──────────────────┘                                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3. Streaming: Respuestas en Tiempo Real

El streaming permite mostrar la respuesta del modelo mientras se genera, mejorando la experiencia del usuario.

#### Streaming Básico

```typescript


async function streamResponse(userMessage: string): Promise<void> {
  const client = new Anthropic();

  console.log('🤖 Agente: ');

  // Usar stream en lugar de create
  const stream = client.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [{ role: 'user', content: userMessage }]
  });

  // Procesar eventos del stream
  for await (const event of stream) {
    if (event.type === 'content_block_delta') {
      if (event.delta.type === 'text_delta') {
        process.stdout.write(event.delta.text);
      }
    }
  }

  console.log('\n');

  // Obtener mensaje final completo
  const finalMessage = await stream.finalMessage();
  console.log('📊 Tokens usados:', finalMessage.usage);
}
```

#### Streaming con Tool Use

```typescript
interface StreamState {
  currentToolUse: {
    id: string;
    name: string;
    inputJson: string;
  } | null;
  textBuffer: string;
}

async function streamWithTools(
  client: Anthropic,
  messages: Message[],
  tools: Anthropic.Tool[]
): Promise<Anthropic.Message> {
  const state: StreamState = {
    currentToolUse: null,
    textBuffer: ''
  };

  const stream = client.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    tools,
    messages
  });

  for await (const event of stream) {
    switch (event.type) {
      case 'content_block_start':
        if (event.content_block.type === 'tool_use') {
          state.currentToolUse = {
            id: event.content_block.id,
            name: event.content_block.name,
            inputJson: ''
          };
          console.log(`\n🔧 Iniciando herramienta: ${event.content_block.name}`);
        }
        break;

      case 'content_block_delta':
        if (event.delta.type === 'text_delta') {
          process.stdout.write(event.delta.text);
          state.textBuffer += event.delta.text;
        } else if (event.delta.type === 'input_json_delta' && state.currentToolUse) {
          state.currentToolUse.inputJson += event.delta.partial_json;
        }
        break;

      case 'content_block_stop':
        if (state.currentToolUse) {
          console.log(`\n   Input: ${state.currentToolUse.inputJson}`);
          state.currentToolUse = null;
        }
        break;

      case 'message_stop':
        console.log('\n--- Mensaje completado ---');
        break;
    }
  }

  return stream.finalMessage();
}
```

#### Patrón: Streaming con Timeout

```typescript
async function streamWithTimeout(
  client: Anthropic,
  params: Anthropic.MessageCreateParams,
  timeoutMs: number = 30000
): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const stream = client.messages.stream(params, {
      signal: controller.signal
    });

    let result = '';

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        result += event.delta.text;
      }
    }

    return result;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new Error(`Stream timeout after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
```

### 4. Error Recovery: Agentes Resilientes

Los agentes en producción deben manejar errores gracefully. Aprenderás patrones para hacer tus agentes más robustos.

> 💡 **Tip**: Estos patrones de resiliencia son parte del pilar **Resilience** del [4R Framework](/docs/proyectos/ai-presentation/4r-framework). Aplica estos principios para asegurar que tus agentes sean robustos bajo presión.

#### Tipos de Errores en Agentes

```typescript
// Errores de API (rate limits, timeouts)
class APIError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly retryable: boolean,
    public readonly retryAfter?: number
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Errores de parsing (LLM devolvió formato inválido)
class ParseError extends Error {
  constructor(
    message: string,
    public readonly rawOutput: string,
    public readonly attemptedFormat: string
  ) {
    super(message);
    this.name = 'ParseError';
  }
}

// Errores de herramienta (la tool falló)
class ToolError extends Error {
  constructor(
    message: string,
    public readonly toolName: string,
    public readonly input: unknown,
    public readonly recoverable: boolean
  ) {
    super(message);
    this.name = 'ToolError';
  }
}

// Errores de lógica del agente
class AgentLogicError extends Error {
  constructor(
    message: string,
    public readonly iteration: number,
    public readonly state: unknown
  ) {
    super(message);
    this.name = 'AgentLogicError';
  }
}
```

#### Patrón: Retry con Backoff Exponencial

```typescript
interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  retryableErrors: string[];
}

async function withRetry<T>(
  operation: () => Promise<T>,
  config: RetryConfig = {
    maxRetries: 3,
    baseDelayMs: 1000,
    maxDelayMs: 30000,
    retryableErrors: ['rate_limit_error', 'overloaded_error', 'timeout']
  }
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      // Verificar si es retryable
      const isRetryable = config.retryableErrors.some(
        errType => lastError?.message.includes(errType)
      );

      if (!isRetryable || attempt === config.maxRetries) {
        throw lastError;
      }

      // Calcular delay con exponential backoff + jitter
      const exponentialDelay = config.baseDelayMs * Math.pow(2, attempt);
      const jitter = Math.random() * 1000;
      const delay = Math.min(exponentialDelay + jitter, config.maxDelayMs);

      console.log(`⚠️ Retry ${attempt + 1}/${config.maxRetries} en ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

// Uso
const response = await withRetry(() =>
  client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [{ role: 'user', content: 'Hola' }]
  })
);
```

#### Patrón: Self-Correction (Auto-corrección)

```typescript
interface CorrectionContext {
  originalPrompt: string;
  failedOutput: string;
  error: string;
  attempts: number;
}

async function selfCorrectingCall(
  client: Anthropic,
  prompt: string,
  validateFn: (output: string) => { valid: boolean; error?: string },
  maxAttempts: number = 3
): Promise<string> {
  const context: CorrectionContext = {
    originalPrompt: prompt,
    failedOutput: '',
    error: '',
    attempts: 0
  };

  while (context.attempts < maxAttempts) {
    context.attempts++;

    // Construir mensaje con contexto de corrección si hay intentos previos
    const messages: Anthropic.MessageParam[] = context.failedOutput
      ? [
          { role: 'user', content: prompt },
          { role: 'assistant', content: context.failedOutput },
          {
            role: 'user',
            content: `Tu respuesta anterior tuvo un error: ${context.error}

Por favor, corrige tu respuesta manteniendo la misma intención pero arreglando el problema.`
          }
        ]
      : [{ role: 'user', content: prompt }];

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages
    });

    const text = response.content.find(b => b.type === 'text');
    if (!text || text.type !== 'text') {
      context.error = 'No text response';
      continue;
    }

    const validation = validateFn(text.text);

    if (validation.valid) {
      console.log(`✅ Respuesta válida en intento ${context.attempts}`);
      return text.text;
    }

    context.failedOutput = text.text;
    context.error = validation.error || 'Validation failed';
    console.log(`⚠️ Intento ${context.attempts} inválido: ${context.error}`);
  }

  throw new Error(`No se pudo obtener respuesta válida después de ${maxAttempts} intentos`);
}

// Ejemplo de uso con validación JSON
const result = await selfCorrectingCall(
  client,
  'Genera un JSON con campos: name (string), age (number)',
  (output) => {
    try {
      const parsed = JSON.parse(output);
      if (typeof parsed.name !== 'string') {
        return { valid: false, error: 'name debe ser string' };
      }
      if (typeof parsed.age !== 'number') {
        return { valid: false, error: 'age debe ser number' };
      }
      return { valid: true };
    } catch {
      return { valid: false, error: 'No es JSON válido' };
    }
  }
);
```

#### Patrón: Circuit Breaker

```typescript
enum CircuitState {
  CLOSED,    // Normal operation
  OPEN,      // Failing, reject requests
  HALF_OPEN  // Testing if service recovered
}

class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failures: number = 0;
  private lastFailure: number = 0;
  private successesInHalfOpen: number = 0;

  constructor(
    private readonly failureThreshold: number = 5,
    private readonly recoveryTimeout: number = 30000,
    private readonly successThreshold: number = 2
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() - this.lastFailure > this.recoveryTimeout) {
        this.state = CircuitState.HALF_OPEN;
        this.successesInHalfOpen = 0;
        console.log('🔄 Circuit breaker: HALF_OPEN (probando recuperación)');
      } else {
        throw new Error('Circuit breaker is OPEN - request rejected');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    if (this.state === CircuitState.HALF_OPEN) {
      this.successesInHalfOpen++;
      if (this.successesInHalfOpen >= this.successThreshold) {
        this.state = CircuitState.CLOSED;
        this.failures = 0;
        console.log('✅ Circuit breaker: CLOSED (servicio recuperado)');
      }
    } else {
      this.failures = 0;
    }
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailure = Date.now();

    if (this.state === CircuitState.HALF_OPEN) {
      this.state = CircuitState.OPEN;
      console.log('❌ Circuit breaker: OPEN (fallo en recuperación)');
    } else if (this.failures >= this.failureThreshold) {
      this.state = CircuitState.OPEN;
      console.log('❌ Circuit breaker: OPEN (umbral de fallos alcanzado)');
    }
  }

  getState(): CircuitState {
    return this.state;
  }
}

// Uso
const breaker = new CircuitBreaker(3, 10000);

async function callWithBreaker(client: Anthropic, message: string) {
  return breaker.execute(() =>
    client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: message }]
    })
  );
}
```

### 5. Memoria Persistente: Más Allá de la Conversación

Los agentes avanzados necesitan recordar información entre sesiones.

#### Estructura de Memoria

```typescript


// Esquema para items de memoria
const MemoryItemSchema = z.object({
  id: z.string(),
  type: z.enum(['fact', 'preference', 'task', 'conversation_summary']),
  content: z.string(),
  metadata: z.object({
    source: z.string(),
    confidence: z.number().min(0).max(1),
    timestamp: z.date(),
    expiresAt: z.date().optional()
  }),
  embedding: z.array(z.number()).optional()  // Para búsqueda semántica
});

type MemoryItem = z.infer<typeof MemoryItemSchema>;

// Interfaz de almacenamiento
interface MemoryStore {
  save(item: MemoryItem): Promise<void>;
  search(query: string, limit?: number): Promise<MemoryItem[]>;
  getByType(type: MemoryItem['type']): Promise<MemoryItem[]>;
  delete(id: string): Promise<void>;
  clear(): Promise<void>;
}
```

#### Implementación con Sistema de Archivos

```typescript




class FileMemoryStore implements MemoryStore {
  private memoryPath: string;
  private items: Map<string, MemoryItem> = new Map();

  constructor(basePath: string = './agent_memory') {
    this.memoryPath = path.join(basePath, 'memory.json');
  }

  async initialize(): Promise<void> {
    const dir = path.dirname(this.memoryPath);
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }

    try {
      const data = await readFile(this.memoryPath, 'utf-8');
      const parsed = JSON.parse(data);
      for (const item of parsed) {
        item.metadata.timestamp = new Date(item.metadata.timestamp);
        if (item.metadata.expiresAt) {
          item.metadata.expiresAt = new Date(item.metadata.expiresAt);
        }
        this.items.set(item.id, item);
      }
    } catch {
      // Archivo no existe, empezar vacío
    }
  }

  private async persist(): Promise<void> {
    const data = JSON.stringify(Array.from(this.items.values()), null, 2);
    await writeFile(this.memoryPath, data, 'utf-8');
  }

  async save(item: MemoryItem): Promise<void> {
    this.items.set(item.id, item);
    await this.persist();
  }

  async search(query: string, limit = 10): Promise<MemoryItem[]> {
    const queryLower = query.toLowerCase();
    const results: Array<{ item: MemoryItem; score: number }> = [];

    for (const item of this.items.values()) {
      // Búsqueda simple por coincidencia de texto
      const contentLower = item.content.toLowerCase();
      if (contentLower.includes(queryLower)) {
        const score = queryLower.split(' ').filter(
          word => contentLower.includes(word)
        ).length;
        results.push({ item, score });
      }
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(r => r.item);
  }

  async getByType(type: MemoryItem['type']): Promise<MemoryItem[]> {
    return Array.from(this.items.values())
      .filter(item => item.type === type);
  }

  async delete(id: string): Promise<void> {
    this.items.delete(id);
    await this.persist();
  }

  async clear(): Promise<void> {
    this.items.clear();
    await this.persist();
  }
}
```

#### Agente con Memoria Integrada

```typescript
class MemoryAwareAgent {
  private client: Anthropic;
  private memory: FileMemoryStore;
  private tools: Tool[];

  constructor(tools: Tool[]) {
    this.client = new Anthropic();
    this.memory = new FileMemoryStore();
    this.tools = tools;
  }

  async initialize(): Promise<void> {
    await this.memory.initialize();
  }

  async run(userMessage: string): Promise<string> {
    // 1. Buscar contexto relevante en memoria
    const relevantMemories = await this.memory.search(userMessage, 5);

    // 2. Construir contexto con memorias
    const memoryContext = relevantMemories.length > 0
      ? `\n\n# Información Relevante de Memoria:
${relevantMemories.map(m => `- [${m.type}] ${m.content}`).join('\n')}`
      : '';

    // 3. Obtener preferencias del usuario
    const preferences = await this.memory.getByType('preference');
    const prefContext = preferences.length > 0
      ? `\n\n# Preferencias del Usuario:
${preferences.map(p => `- ${p.content}`).join('\n')}`
      : '';

    const systemPrompt = `Eres un agente investigador con memoria persistente.
${memoryContext}${prefContext}

Puedes usar las siguientes herramientas:
${this.tools.map(t => `- ${t.name}: ${t.description}`).join('\n')}

También puedes guardar información importante usando 'remember'.

Responde de forma útil y personalizada basándote en el contexto.`;

    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemPrompt,
      tools: this.getToolDefinitions(),
      messages: [{ role: 'user', content: userMessage }]
    });

    // 4. Procesar respuesta y posibles tool calls
    const result = await this.processResponse(response, userMessage);

    // 5. Extraer y guardar información importante
    await this.extractAndRemember(userMessage, result);

    return result;
  }

  private async extractAndRemember(userMessage: string, response: string): Promise<void> {
    // Detectar preferencias expresadas
    const preferencePatterns = [
      /prefiero\s+(.+)/i,
      /me gusta\s+(.+)/i,
      /siempre quiero\s+(.+)/i
    ];

    for (const pattern of preferencePatterns) {
      const match = userMessage.match(pattern);
      if (match) {
        await this.memory.save({
          id: `pref_${Date.now()}`,
          type: 'preference',
          content: match[1],
          metadata: {
            source: 'user_message',
            confidence: 0.9,
            timestamp: new Date()
          }
        });
      }
    }

    // Detectar hechos importantes mencionados
    if (userMessage.toLowerCase().includes('recuerda que')) {
      const factMatch = userMessage.match(/recuerda que\s+(.+)/i);
      if (factMatch) {
        await this.memory.save({
          id: `fact_${Date.now()}`,
          type: 'fact',
          content: factMatch[1],
          metadata: {
            source: 'user_explicit',
            confidence: 1.0,
            timestamp: new Date()
          }
        });
      }
    }
  }

  private getToolDefinitions(): Anthropic.Tool[] {
    const baseTools = this.tools.map(t => ({
      name: t.name,
      description: t.description,
      input_schema: t.inputSchema as Anthropic.Tool['input_schema']
    }));

    // Añadir herramienta de memoria
    baseTools.push({
      name: 'remember',
      description: 'Guarda información importante para recordar en el futuro',
      input_schema: {
        type: 'object',
        properties: {
          content: { type: 'string', description: 'Información a recordar' },
          type: {
            type: 'string',
            enum: ['fact', 'preference', 'task'],
            description: 'Tipo de información'
          }
        },
        required: ['content', 'type']
      }
    });

    return baseTools;
  }

  private async processResponse(
    response: Anthropic.Message,
    _originalMessage: string
  ): Promise<string> {
    // Implementación similar al Módulo 3
    const textBlock = response.content.find(b => b.type === 'text');
    return textBlock && textBlock.type === 'text' ? textBlock.text : '';
  }
}
```

## 🛠️ Proyecto Práctico: Agente Investigador con Memoria

Construiremos un agente que puede investigar temas, recordar información entre sesiones, y sintetizar hallazgos.

### Paso 1: Configurar proyecto

```bash
# Crear proyecto
mkdir agente-investigador && cd agente-investigador

# Inicializar
npm init -y
npm pkg set type=module

# Instalar dependencias
npm install @anthropic-ai/sdk zod
npm install -D typescript @types/node tsx

# Crear estructura
mkdir -p src/tools src/memory
```

### Paso 2: Crear tsconfig.json

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


export const MemoryItemSchema = z.object({
  id: z.string(),
  type: z.enum(['fact', 'source', 'summary', 'note']),
  content: z.string(),
  topic: z.string().optional(),
  metadata: z.object({
    timestamp: z.string().transform(s => new Date(s)),
    source: z.string(),
    confidence: z.number().min(0).max(1)
  })
});

export type MemoryItem = z.infer<typeof MemoryItemSchema>;

export interface Tool {
  name: string;
  description: string;
  inputSchema: object;
  execute: (input: unknown) => Promise<unknown>;
}

export interface ResearchResult {
  topic: string;
  findings: string[];
  sources: string[];
  summary: string;
}

export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };
```

### Paso 4: Crear sistema de memoria

Crea `src/memory/store.ts`:

```typescript





export class MemoryStore {
  private items: Map<string, MemoryItem> = new Map();
  private filePath: string;

  constructor(basePath = './research_memory') {
    this.filePath = path.join(basePath, 'memory.json');
  }

  async load(): Promise<void> {
    const dir = path.dirname(this.filePath);
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }

    try {
      const data = await readFile(this.filePath, 'utf-8');
      const items = JSON.parse(data) as MemoryItem[];
      for (const item of items) {
        this.items.set(item.id, item);
      }
      console.log(`📚 Cargadas ${this.items.size} memorias`);
    } catch {
      console.log('📚 Iniciando con memoria vacía');
    }
  }

  async save(): Promise<void> {
    const data = JSON.stringify(Array.from(this.items.values()), null, 2);
    await writeFile(this.filePath, data, 'utf-8');
  }

  async add(item: Omit<MemoryItem, 'id'>): Promise<MemoryItem> {
    const fullItem: MemoryItem = {
      ...item,
      id: `mem_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
    };
    this.items.set(fullItem.id, fullItem);
    await this.save();
    return fullItem;
  }

  search(query: string, limit = 5): MemoryItem[] {
    const queryWords = query.toLowerCase().split(/\s+/);
    const scored: Array<{ item: MemoryItem; score: number }> = [];

    for (const item of this.items.values()) {
      const text = `${item.content} ${item.topic || ''}`.toLowerCase();
      const score = queryWords.filter(w => text.includes(w)).length;
      if (score > 0) {
        scored.push({ item, score });
      }
    }

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(s => s.item);
  }

  getByTopic(topic: string): MemoryItem[] {
    return Array.from(this.items.values())
      .filter(item => item.topic?.toLowerCase() === topic.toLowerCase());
  }

  getAll(): MemoryItem[] {
    return Array.from(this.items.values());
  }

  clear(): void {
    this.items.clear();
  }
}
```

### Paso 5: Crear herramientas de investigación

Crea `src/tools/research-tools.ts`:

```typescript




// Simulación de búsqueda (en producción usarías una API real)
const SearchInputSchema = z.object({
  query: z.string().min(1),
  maxResults: z.number().min(1).max(10).default(5)
});

export function createSearchTool(): Tool {
  return {
    name: 'search_web',
    description: 'Busca información en la web sobre un tema. Usa esto para encontrar datos actualizados.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Términos de búsqueda' },
        maxResults: { type: 'number', description: 'Máximo de resultados (1-10)' }
      },
      required: ['query']
    },
    execute: async (input: unknown): Promise<Result<object[]>> => {
      const parsed = SearchInputSchema.safeParse(input);
      if (!parsed.success) {
        return { success: false, error: new Error(parsed.error.message) };
      }

      // Simulación de resultados
      console.log(`   🔍 Buscando: "${parsed.data.query}"`);

      const mockResults = [
        {
          title: `Resultados sobre ${parsed.data.query}`,
          snippet: `Información relevante sobre ${parsed.data.query}. Este es un resultado simulado que en producción vendría de una API de búsqueda real.`,
          url: `https://example.com/search?q=${encodeURIComponent(parsed.data.query)}`
        },
        {
          title: `Guía completa de ${parsed.data.query}`,
          snippet: `Una guía detallada que cubre los aspectos principales de ${parsed.data.query}.`,
          url: `https://example.com/guide/${parsed.data.query.replace(/\s+/g, '-')}`
        }
      ];

      return { success: true, data: mockResults };
    }
  };
}

// Herramienta para guardar en memoria
const SaveNoteInputSchema = z.object({
  content: z.string().min(1),
  topic: z.string().optional(),
  type: z.enum(['fact', 'source', 'summary', 'note']).default('note')
});

export function createSaveNoteTool(memory: MemoryStore): Tool {
  return {
    name: 'save_note',
    description: 'Guarda una nota o hallazgo importante para referencia futura.',
    inputSchema: {
      type: 'object',
      properties: {
        content: { type: 'string', description: 'Contenido de la nota' },
        topic: { type: 'string', description: 'Tema relacionado' },
        type: {
          type: 'string',
          enum: ['fact', 'source', 'summary', 'note'],
          description: 'Tipo de nota'
        }
      },
      required: ['content']
    },
    execute: async (input: unknown): Promise<Result<object>> => {
      const parsed = SaveNoteInputSchema.safeParse(input);
      if (!parsed.success) {
        return { success: false, error: new Error(parsed.error.message) };
      }

      const item = await memory.add({
        type: parsed.data.type,
        content: parsed.data.content,
        topic: parsed.data.topic,
        metadata: {
          timestamp: new Date().toISOString(),
          source: 'agent',
          confidence: 0.9
        }
      });

      console.log(`   📝 Nota guardada: "${parsed.data.content.slice(0, 50)}..."`);

      return { success: true, data: { saved: true, id: item.id } };
    }
  };
}

// Herramienta para recuperar memoria
const RecallInputSchema = z.object({
  query: z.string().min(1),
  topic: z.string().optional()
});

export function createRecallTool(memory: MemoryStore): Tool {
  return {
    name: 'recall',
    description: 'Busca información guardada previamente en la memoria.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Qué buscar en la memoria' },
        topic: { type: 'string', description: 'Filtrar por tema específico' }
      },
      required: ['query']
    },
    execute: async (input: unknown): Promise<Result<object[]>> => {
      const parsed = RecallInputSchema.safeParse(input);
      if (!parsed.success) {
        return { success: false, error: new Error(parsed.error.message) };
      }

      let results = memory.search(parsed.data.query, 5);

      if (parsed.data.topic) {
        results = results.filter(r => r.topic === parsed.data.topic);
      }

      console.log(`   🧠 Encontradas ${results.length} memorias`);

      return {
        success: true,
        data: results.map(r => ({
          type: r.type,
          content: r.content,
          topic: r.topic,
          timestamp: r.metadata.timestamp
        }))
      };
    }
  };
}
```

### Paso 6: Crear el agente investigador

Crea `src/agent.ts`:

```typescript




interface Message {
  role: 'user' | 'assistant';
  content: string | Anthropic.ContentBlock[];
}

export class ResearchAgent {
  private client: Anthropic;
  private memory: MemoryStore;
  private tools: Tool[];
  private messages: Message[] = [];
  private maxIterations = 10;

  constructor(tools: Tool[], memory: MemoryStore) {
    this.client = new Anthropic();
    this.tools = tools;
    this.memory = memory;
  }

  async research(topic: string): Promise<ResearchResult> {
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`🔬 Investigando: ${topic}`);
    console.log(`${'═'.repeat(60)}\n`);

    // Buscar contexto previo
    const priorKnowledge = this.memory.search(topic, 3);
    const priorContext = priorKnowledge.length > 0
      ? `\n\nConocimiento previo sobre este tema:\n${priorKnowledge.map(k => `- ${k.content}`).join('\n')}`
      : '';

    const systemPrompt = `Eres un agente investigador experto. Tu tarea es investigar temas de forma rigurosa.

# Tu proceso de investigación:
1. Usa 'recall' para verificar si ya tienes información relevante
2. Usa 'search_web' para buscar información actualizada
3. Usa 'save_note' para guardar hallazgos importantes
4. Sintetiza la información encontrada

# Reglas:
- Siempre verifica primero tu memoria antes de buscar
- Guarda los hallazgos importantes para futuras investigaciones
- Cita las fuentes cuando sea posible
- Sé objetivo y preciso
${priorContext}

Cuando termines tu investigación, responde con un resumen estructurado.`;

    this.messages = [{ role: 'user', content: `Investiga sobre: ${topic}` }];

    const findings: string[] = [];
    const sources: string[] = [];
    let finalSummary = '';
    let iterations = 0;

    while (iterations < this.maxIterations) {
      iterations++;
      console.log(`\n📍 Iteración ${iterations}`);

      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        system: systemPrompt,
        tools: this.getToolDefinitions(),
        messages: this.messages.map(m => ({
          role: m.role,
          content: m.content as string
        }))
      });

      // Respuesta final
      if (response.stop_reason === 'end_turn') {
        const textBlock = response.content.find(b => b.type === 'text');
        if (textBlock && textBlock.type === 'text') {
          finalSummary = textBlock.text;
          console.log('\n📋 Resumen final generado');
        }
        break;
      }

      // Tool use
      if (response.stop_reason === 'tool_use') {
        this.messages.push({ role: 'assistant', content: response.content });

        const toolResults: Anthropic.ToolResultBlockParam[] = [];

        for (const block of response.content) {
          if (block.type === 'tool_use') {
            console.log(`\n🔧 Ejecutando: ${block.name}`);

            const tool = this.tools.find(t => t.name === block.name);
            if (!tool) {
              toolResults.push({
                type: 'tool_result',
                tool_use_id: block.id,
                content: 'Error: Herramienta no encontrada',
                is_error: true
              });
              continue;
            }

            const result = await tool.execute(block.input) as { success: boolean; data?: unknown; error?: Error };

            if (result.success && result.data) {
              // Extraer findings si es una búsqueda
              if (block.name === 'search_web' && Array.isArray(result.data)) {
                for (const r of result.data as Array<{ title?: string; url?: string; snippet?: string }>) {
                  if (r.snippet) findings.push(r.snippet);
                  if (r.url) sources.push(r.url);
                }
              }

              toolResults.push({
                type: 'tool_result',
                tool_use_id: block.id,
                content: JSON.stringify(result.data)
              });
            } else {
              toolResults.push({
                type: 'tool_result',
                tool_use_id: block.id,
                content: `Error: ${result.error?.message || 'Unknown error'}`,
                is_error: true
              });
            }
          }
        }

        this.messages.push({
          role: 'user',
          content: toolResults as unknown as string
        });
      }
    }

    // Guardar resumen en memoria
    if (finalSummary) {
      await this.memory.add({
        type: 'summary',
        content: finalSummary.slice(0, 500),
        topic,
        metadata: {
          timestamp: new Date().toISOString(),
          source: 'research_agent',
          confidence: 0.85
        }
      });
    }

    return {
      topic,
      findings: [...new Set(findings)],
      sources: [...new Set(sources)],
      summary: finalSummary
    };
  }

  private getToolDefinitions(): Anthropic.Tool[] {
    return this.tools.map(t => ({
      name: t.name,
      description: t.description,
      input_schema: t.inputSchema as Anthropic.Tool['input_schema']
    }));
  }
}
```

### Paso 7: Crear punto de entrada

Crea `src/index.ts`:

```typescript




async function main() {
  // Inicializar memoria
  const memory = new MemoryStore();
  await memory.load();

  // Crear herramientas
  const tools = [
    createSearchTool(),
    createSaveNoteTool(memory),
    createRecallTool(memory)
  ];

  // Crear agente
  const agent = new ResearchAgent(tools, memory);

  console.log('═'.repeat(60));
  console.log('🔬 Agente Investigador con Memoria');
  console.log('═'.repeat(60));

  // Primera investigación
  const result1 = await agent.research('TypeScript para agentes de IA');

  console.log('\n📊 RESULTADO DE INVESTIGACIÓN');
  console.log('─'.repeat(40));
  console.log('Tema:', result1.topic);
  console.log('\nHallazgos:');
  result1.findings.forEach((f, i) => console.log(`${i + 1}. ${f}`));
  console.log('\nFuentes:');
  result1.sources.forEach(s => console.log(`- ${s}`));
  console.log('\nResumen:');
  console.log(result1.summary);

  // Segunda investigación (debería usar memoria)
  console.log('\n' + '═'.repeat(60));
  console.log('🔄 Segunda investigación (con memoria previa)');
  console.log('═'.repeat(60));

  const result2 = await agent.research('Mejores prácticas de TypeScript');

  console.log('\n📊 RESULTADO DE INVESTIGACIÓN');
  console.log('─'.repeat(40));
  console.log('Resumen:');
  console.log(result2.summary);

  // Mostrar memoria acumulada
  console.log('\n' + '═'.repeat(60));
  console.log('🧠 Memoria acumulada');
  console.log('═'.repeat(60));
  const allMemories = memory.getAll();
  allMemories.forEach(m => {
    console.log(`[${m.type}] ${m.content.slice(0, 80)}...`);
  });
}

main().catch(console.error);
```

### Paso 8: Ejecutar

```bash
# Configurar API key
export ANTHROPIC_API_KEY=tu_api_key

# Ejecutar
npx tsx src/index.ts
```

### Resultado esperado

```
════════════════════════════════════════════════════════════
🔬 Agente Investigador con Memoria
════════════════════════════════════════════════════════════
📚 Iniciando con memoria vacía

════════════════════════════════════════════════════════════
🔬 Investigando: TypeScript para agentes de IA
════════════════════════════════════════════════════════════

📍 Iteración 1

🔧 Ejecutando: recall
   🧠 Encontradas 0 memorias

📍 Iteración 2

🔧 Ejecutando: search_web
   🔍 Buscando: "TypeScript agentes IA desarrollo"

📍 Iteración 3

🔧 Ejecutando: save_note
   📝 Nota guardada: "TypeScript es esencial para agentes de IA..."

📋 Resumen final generado

📊 RESULTADO DE INVESTIGACIÓN
────────────────────────────────────────
Tema: TypeScript para agentes de IA

Hallazgos:
1. Información relevante sobre TypeScript agentes IA...
2. Una guía detallada que cubre los aspectos principales...

Fuentes:
- https://example.com/search?q=TypeScript%20agentes%20IA
- https://example.com/guide/TypeScript-agentes-IA

Resumen:
TypeScript es fundamental para el desarrollo de agentes de IA...

════════════════════════════════════════════════════════════
🔄 Segunda investigación (con memoria previa)
════════════════════════════════════════════════════════════

📍 Iteración 1

🔧 Ejecutando: recall
   🧠 Encontradas 1 memorias
...
```

## 🎯 Verificación de Aprendizaje

Antes de pasar al siguiente módulo, asegúrate de poder responder:

1. ¿Cuáles son las 3 técnicas principales de prompt engineering avanzado?
2. ¿Qué estrategias hay para manejar context windows grandes?
3. ¿Cuál es la diferencia entre streaming básico y streaming con tools?
4. ¿Qué es un Circuit Breaker y cuándo lo usarías?
5. ¿Cómo implementarías memoria persistente entre sesiones?

## 🚀 Reto Extra

Extiende el agente investigador para:

1. **Búsqueda real**: Integra una API de búsqueda real (SerpAPI, Brave Search, etc.)
2. **Embeddings**: Usa embeddings para búsqueda semántica en memoria
3. **Exportar investigaciones**: Genera un documento Markdown con los hallazgos
4. **Multi-agente**: Implementa un agente "crítico" que valide los hallazgos

## ⚠️ Errores Comunes

### Error: Context window exceeded

```
Error: prompt is too long: 250000 tokens > 200000 maximum
```
**Solución**: Implementa estrategias de pruning o resumen de contexto. Usa `estimateTokens()` para monitorear el uso.

### Error: Streaming timeout

```
Error: Stream timeout after 30000ms
```
**Solución**: Aumenta el timeout para respuestas largas, o implementa keepalive pings si el servidor lo soporta.

### Error: Tool use en streaming no capturado

```
El agente ejecuta herramientas pero no veo los resultados
```
**Solución**: En streaming con tools, debes acumular el `input_json_delta` y parsear cuando llegue `content_block_stop`.

### Error: Memoria no persiste

```
Las notas guardadas desaparecen al reiniciar
```
**Solución**: Verifica que `memory.save()` se llame después de cada modificación y que el directorio tenga permisos de escritura.

## 📚 Recursos Adicionales

### Documentación Oficial
- [Anthropic Prompt Engineering Guide](https://docs.anthropic.com/claude/docs/prompt-engineering)
- [Claude Streaming Documentation](https://docs.anthropic.com/claude/reference/streaming)
- [Building Reliable AI Agents](https://docs.anthropic.com/claude/docs/building-effective-agents)
- [Context Window Best Practices](https://docs.anthropic.com/claude/docs/long-context-prompting-tips)

### Contenido Relacionado en Código Sin Siesta
- 👉 **[Taller IA, Agentes y MCP](/docs/proyectos/taller-ia-agentes-mcp/intro)** — Ejercicios prácticos para consolidar estos conceptos
- 👉 **[4R Framework](/docs/proyectos/ai-presentation/4r-framework)** — Marco de calidad para agentes seguros y resilientes

---



---

**Anterior**: [Módulo 3: Conceptos Clave de IA Agents](./03-conceptos)

**Siguiente**: [Módulo 5: MCP Servers - Model Context Protocol](./05-mcp-servers)
