---
sidebar_position: 3
---

# Estrategias de Testing

Guía completa para testear sistemas basados en IA de forma efectiva y confiable. Desde unit tests de herramientas individuales hasta testing de seguridad y evaluación de calidad.

## 🧪 Unit Testing

El unit testing en sistemas de IA requiere estrategias específicas para manejar el no-determinismo de LLMs y la complejidad de las herramientas.

### Mocking de LLM Responses

**El problema fundamental**: Los LLMs producen resultados no-deterministas. La solución es mockear las respuestas para tests predecibles.

```typescript
// Interfaz base para el LLM
interface LLMClient {
  generate(prompt: string): Promise<string>;
  chat(messages: Message[]): Promise<ChatResponse>;
}

// Mock LLM para testing
class MockLLMClient implements LLMClient {
  private responses: Map<string, string> = new Map();
  private callHistory: string[] = [];

  // Registrar respuestas predefinidas
  setResponse(promptPattern: string, response: string): void {
    this.responses.set(promptPattern, response);
  }

  async generate(prompt: string): Promise<string> {
    this.callHistory.push(prompt);

    // Buscar respuesta por patrón
    for (const [pattern, response] of this.responses) {
      if (prompt.includes(pattern)) {
        return response;
      }
    }

    throw new Error(`No mock response for prompt: ${prompt.substring(0, 50)}...`);
  }

  async chat(messages: Message[]): Promise<ChatResponse> {
    const lastMessage = messages[messages.length - 1].content;
    const response = await this.generate(lastMessage);
    return { content: response, toolCalls: [] };
  }

  // Verificar que se llamó con cierto prompt
  assertCalledWith(pattern: string): void {
    const found = this.callHistory.some(call => call.includes(pattern));
    if (!found) {
      throw new Error(`Expected call with pattern "${pattern}" not found`);
    }
  }

  getCallCount(): number {
    return this.callHistory.length;
  }

  reset(): void {
    this.callHistory = [];
  }
}
```

**Ejemplo de uso en tests:**

```typescript
import { describe, it, expect, beforeEach } from 'vitest';

describe('SummarizerAgent', () => {
  let mockLLM: MockLLMClient;
  let agent: SummarizerAgent;

  beforeEach(() => {
    mockLLM = new MockLLMClient();
    agent = new SummarizerAgent(mockLLM);
  });

  it('should summarize text using LLM', async () => {
    // Arrange: configurar respuesta mockeada
    mockLLM.setResponse(
      'Summarize the following',
      'This is a summary of the provided text.'
    );

    // Act
    const result = await agent.summarize('Long text here...');

    // Assert
    expect(result).toBe('This is a summary of the provided text.');
    mockLLM.assertCalledWith('Summarize the following');
  });

  it('should handle empty input gracefully', async () => {
    mockLLM.setResponse('Summarize', 'No content to summarize.');

    const result = await agent.summarize('');

    expect(result).toBe('No content to summarize.');
  });
});
```

**Cuándo usar:**
- ✅ Tests de lógica de negocio que usa LLM
- ✅ Tests de manejo de errores
- ✅ Tests de flujo de conversación
- ✅ CI/CD pipelines (rápido y determinístico)

**Tradeoffs:**
- **Pros**: Rápido, determinístico, sin costo de API
- **Cons**: No captura variaciones reales del LLM

---

### Testing de Tools Individuales

**Las herramientas son la parte más testeable de un sistema de IA.** Tienen inputs/outputs definidos y comportamiento determinístico.

```typescript
// Definición de Tool
interface Tool {
  name: string;
  description: string;
  parameters: JSONSchema;
  execute: (params: any) => Promise<ToolResult>;
}

interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
}

// Tool de ejemplo: búsqueda en base de datos
class DatabaseSearchTool implements Tool {
  name = 'database_search';
  description = 'Search records in the database';
  parameters = {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Search query' },
      limit: { type: 'number', default: 10 }
    },
    required: ['query']
  };

  constructor(private db: Database) {}

  async execute(params: { query: string; limit?: number }): Promise<ToolResult> {
    try {
      const results = await this.db.search(params.query, params.limit ?? 10);
      return { success: true, data: results };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
```

**Tests para la Tool:**

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('DatabaseSearchTool', () => {
  let mockDb: Database;
  let tool: DatabaseSearchTool;

  beforeEach(() => {
    // Mock de la base de datos
    mockDb = {
      search: vi.fn()
    } as unknown as Database;
    tool = new DatabaseSearchTool(mockDb);
  });

  describe('execute', () => {
    it('should return search results on success', async () => {
      const mockResults = [
        { id: 1, name: 'Result 1' },
        { id: 2, name: 'Result 2' }
      ];
      vi.mocked(mockDb.search).mockResolvedValue(mockResults);

      const result = await tool.execute({ query: 'test query' });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResults);
      expect(mockDb.search).toHaveBeenCalledWith('test query', 10);
    });

    it('should use custom limit when provided', async () => {
      vi.mocked(mockDb.search).mockResolvedValue([]);

      await tool.execute({ query: 'test', limit: 5 });

      expect(mockDb.search).toHaveBeenCalledWith('test', 5);
    });

    it('should handle database errors gracefully', async () => {
      vi.mocked(mockDb.search).mockRejectedValue(new Error('Connection failed'));

      const result = await tool.execute({ query: 'test' });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Connection failed');
    });

    it('should handle empty results', async () => {
      vi.mocked(mockDb.search).mockResolvedValue([]);

      const result = await tool.execute({ query: 'nonexistent' });

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });
  });

  describe('schema validation', () => {
    it('should have correct parameter schema', () => {
      expect(tool.parameters.required).toContain('query');
      expect(tool.parameters.properties.query.type).toBe('string');
      expect(tool.parameters.properties.limit.type).toBe('number');
    });
  });
});
```

**Cuándo usar:**
- ✅ Cada tool debe tener unit tests completos
- ✅ Testing de edge cases y errores
- ✅ Validación de schemas de parámetros

---

### Mock de Tool Responses para Testing de Agentes

**Cuando testes el agente, mockea las tools para aislar la lógica del agente.**

```typescript
// Factory para crear mocks de tools
class ToolMockFactory {
  static createMock(name: string, responses: Map<string, ToolResult>): Tool {
    return {
      name,
      description: `Mock ${name}`,
      parameters: {},
      execute: async (params: any): Promise<ToolResult> => {
        const key = JSON.stringify(params);
        const response = responses.get(key);

        if (response) {
          return response;
        }

        // Default response
        return { success: true, data: `Mock response for ${name}` };
      }
    };
  }

  static createFailingTool(name: string, errorMessage: string): Tool {
    return {
      name,
      description: `Failing mock ${name}`,
      parameters: {},
      execute: async (): Promise<ToolResult> => {
        return { success: false, error: errorMessage };
      }
    };
  }
}

// Uso en tests
describe('ToolUseAgent', () => {
  it('should handle tool execution in agent flow', async () => {
    const mockLLM = new MockLLMClient();
    const mockSearchTool = ToolMockFactory.createMock('search', new Map([
      [JSON.stringify({ query: 'weather' }), {
        success: true,
        data: { temp: 22, condition: 'sunny' }
      }]
    ]));

    // Mock LLM para que elija usar la tool
    mockLLM.setResponse('weather', JSON.stringify({
      toolCall: { name: 'search', params: { query: 'weather' } }
    }));

    const agent = new ToolUseAgent(mockLLM, [mockSearchTool]);
    const result = await agent.execute('What is the weather?');

    expect(result).toContain('sunny');
  });

  it('should handle tool failures gracefully', async () => {
    const mockLLM = new MockLLMClient();
    const failingTool = ToolMockFactory.createFailingTool(
      'api_call',
      'Service unavailable'
    );

    mockLLM.setResponse('call api', JSON.stringify({
      toolCall: { name: 'api_call', params: {} }
    }));
    mockLLM.setResponse('error', 'I apologize, the service is currently unavailable.');

    const agent = new ToolUseAgent(mockLLM, [failingTool]);
    const result = await agent.execute('Please call the API');

    expect(result).toContain('unavailable');
  });
});
```

---

### Validación de Prompts

**Los prompts son código crítico que debe testearse rigurosamente.**

```typescript
// Sistema de templates de prompts
class PromptTemplate {
  constructor(
    private template: string,
    private requiredVariables: string[]
  ) {}

  render(variables: Record<string, string>): string {
    // Validar que todas las variables requeridas estén presentes
    for (const required of this.requiredVariables) {
      if (!(required in variables)) {
        throw new Error(`Missing required variable: ${required}`);
      }
    }

    // Reemplazar variables
    let result = this.template;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
    }

    // Verificar que no quedaron variables sin reemplazar
    const unreplaced = result.match(/\{\{\w+\}\}/g);
    if (unreplaced) {
      throw new Error(`Unreplaced variables: ${unreplaced.join(', ')}`);
    }

    return result;
  }

  validate(): ValidationResult {
    const issues: string[] = [];

    // Verificar que el template tiene las variables declaradas
    for (const variable of this.requiredVariables) {
      if (!this.template.includes(`{{${variable}}}`)) {
        issues.push(`Required variable {{${variable}}} not found in template`);
      }
    }

    // Verificar longitud razonable
    if (this.template.length > 10000) {
      issues.push('Template exceeds recommended length');
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }
}

interface ValidationResult {
  valid: boolean;
  issues: string[];
}
```

**Tests de prompts:**

```typescript
describe('PromptTemplate', () => {
  describe('render', () => {
    it('should render template with all variables', () => {
      const template = new PromptTemplate(
        'Summarize this {{content}} in {{language}}',
        ['content', 'language']
      );

      const result = template.render({
        content: 'article about AI',
        language: 'Spanish'
      });

      expect(result).toBe('Summarize this article about AI in Spanish');
    });

    it('should throw error when required variable is missing', () => {
      const template = new PromptTemplate(
        'Hello {{name}}!',
        ['name']
      );

      expect(() => template.render({})).toThrow('Missing required variable: name');
    });

    it('should throw error for unreplaced variables', () => {
      const template = new PromptTemplate(
        'Hello {{name}} and {{friend}}!',
        ['name'] // 'friend' not declared as required
      );

      expect(() => template.render({ name: 'Alice' })).toThrow(
        'Unreplaced variables: {{friend}}'
      );
    });
  });

  describe('validate', () => {
    it('should validate template structure', () => {
      const template = new PromptTemplate(
        'Process {{input}} with {{method}}',
        ['input', 'method']
      );

      const result = template.validate();

      expect(result.valid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it('should detect missing variables in template', () => {
      const template = new PromptTemplate(
        'Process {{input}}', // Missing {{method}}
        ['input', 'method']
      );

      const result = template.validate();

      expect(result.valid).toBe(false);
      expect(result.issues).toContain(
        'Required variable {{method}} not found in template'
      );
    });
  });
});
```

---

### Testing de Parsing Logic

**El parsing de respuestas del LLM es crítico y propenso a errores.**

```typescript
// Parser robusto para respuestas del LLM
class LLMResponseParser {
  // Extraer JSON de respuesta que puede tener texto adicional
  extractJSON<T>(response: string): T | null {
    // Intentar parsear respuesta directa
    try {
      return JSON.parse(response);
    } catch {
      // Buscar JSON en bloques de código
      const codeBlockMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (codeBlockMatch) {
        try {
          return JSON.parse(codeBlockMatch[1].trim());
        } catch {
          // Continuar con otras estrategias
        }
      }

      // Buscar JSON inline (primer { hasta último })
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch {
          return null;
        }
      }

      return null;
    }
  }

  // Extraer lista de items
  extractList(response: string): string[] {
    const lines = response.split('\n');
    const items: string[] = [];

    for (const line of lines) {
      // Detectar bullet points: -, *, 1., etc.
      const match = line.match(/^[\s]*[-*•][\s]+(.+)$/) ||
                   line.match(/^[\s]*\d+\.[\s]+(.+)$/);
      if (match) {
        items.push(match[1].trim());
      }
    }

    return items;
  }

  // Extraer respuesta estructurada con secciones
  extractSections(response: string): Map<string, string> {
    const sections = new Map<string, string>();
    const sectionPattern = /##?\s*(.+?)\n([\s\S]*?)(?=##?\s|\z)/g;

    let match;
    while ((match = sectionPattern.exec(response)) !== null) {
      sections.set(match[1].trim(), match[2].trim());
    }

    return sections;
  }
}
```

**Tests exhaustivos de parsing:**

```typescript
describe('LLMResponseParser', () => {
  let parser: LLMResponseParser;

  beforeEach(() => {
    parser = new LLMResponseParser();
  });

  describe('extractJSON', () => {
    it('should parse direct JSON response', () => {
      const response = '{"action": "search", "query": "test"}';

      const result = parser.extractJSON<{ action: string; query: string }>(response);

      expect(result).toEqual({ action: 'search', query: 'test' });
    });

    it('should extract JSON from code block', () => {
      const response = `Here is the result:
\`\`\`json
{"status": "success", "data": [1, 2, 3]}
\`\`\`
Let me know if you need more info.`;

      const result = parser.extractJSON<{ status: string; data: number[] }>(response);

      expect(result).toEqual({ status: 'success', data: [1, 2, 3] });
    });

    it('should extract inline JSON surrounded by text', () => {
      const response = 'Based on analysis, the result is {"score": 0.85} which is good.';

      const result = parser.extractJSON<{ score: number }>(response);

      expect(result).toEqual({ score: 0.85 });
    });

    it('should return null for invalid JSON', () => {
      const response = 'This is just plain text without JSON.';

      const result = parser.extractJSON(response);

      expect(result).toBeNull();
    });

    it('should handle malformed JSON gracefully', () => {
      const response = '{"broken": json, missing quotes}';

      const result = parser.extractJSON(response);

      expect(result).toBeNull();
    });

    it('should handle nested JSON structures', () => {
      const response = `\`\`\`
{
  "user": {
    "name": "Alice",
    "settings": {"theme": "dark"}
  }
}
\`\`\``;

      const result = parser.extractJSON<any>(response);

      expect(result.user.name).toBe('Alice');
      expect(result.user.settings.theme).toBe('dark');
    });
  });

  describe('extractList', () => {
    it('should extract bullet list with dashes', () => {
      const response = `Here are the items:
- First item
- Second item
- Third item`;

      const result = parser.extractList(response);

      expect(result).toEqual(['First item', 'Second item', 'Third item']);
    });

    it('should extract numbered list', () => {
      const response = `Steps:
1. Do this
2. Then this
3. Finally this`;

      const result = parser.extractList(response);

      expect(result).toEqual(['Do this', 'Then this', 'Finally this']);
    });

    it('should handle mixed formats', () => {
      const response = `
- Item A
* Item B
• Item C
1. Item D`;

      const result = parser.extractList(response);

      expect(result).toHaveLength(4);
    });

    it('should return empty array for no list', () => {
      const response = 'Just a paragraph of text.';

      const result = parser.extractList(response);

      expect(result).toEqual([]);
    });
  });

  describe('extractSections', () => {
    it('should extract markdown sections', () => {
      const response = `## Summary
This is the summary.

## Details
These are the details.

## Conclusion
Final thoughts.`;

      const result = parser.extractSections(response);

      expect(result.get('Summary')).toBe('This is the summary.');
      expect(result.get('Details')).toBe('These are the details.');
      expect(result.get('Conclusion')).toBe('Final thoughts.');
    });
  });
});
```

---

### Snapshot Testing para Prompts

**Usa snapshot tests para detectar cambios no intencionales en prompts.**

```typescript
import { describe, it, expect } from 'vitest';

describe('Prompt Snapshots', () => {
  const promptBuilder = new PromptBuilder();

  it('should match snapshot for summarization prompt', () => {
    const prompt = promptBuilder.buildSummarizationPrompt({
      content: 'Sample content',
      maxLength: 100,
      language: 'en'
    });

    expect(prompt).toMatchSnapshot();
  });

  it('should match snapshot for tool selection prompt', () => {
    const tools = [
      { name: 'search', description: 'Search the web' },
      { name: 'calculate', description: 'Perform calculations' }
    ];

    const prompt = promptBuilder.buildToolSelectionPrompt(
      'Find the weather',
      tools
    );

    expect(prompt).toMatchSnapshot();
  });
});
```

**Cuándo usar:**
- ✅ Detectar cambios accidentales en prompts
- ✅ Revisar cambios de prompt en PRs
- ✅ Documentar estructura esperada de prompts

---

### Best Practices para Unit Testing de IA

| Práctica | Descripción |
|----------|-------------|
| **Aislar dependencias** | Mockear LLM, databases, APIs externas |
| **Tests determinísticos** | Nunca depender de respuestas reales del LLM en unit tests |
| **Cobertura de edge cases** | Empty inputs, errores de parsing, timeouts |
| **Validar schemas** | Verificar que tools tienen schemas correctos |
| **Snapshot prompts** | Detectar cambios accidentales en prompts |
| **Test error handling** | Verificar recuperación ante fallos |

**Estructura recomendada de tests:**

```
tests/
├── unit/
│   ├── tools/
│   │   ├── search-tool.test.ts
│   │   ├── calculator-tool.test.ts
│   │   └── database-tool.test.ts
│   ├── parsers/
│   │   ├── json-parser.test.ts
│   │   └── list-parser.test.ts
│   ├── prompts/
│   │   ├── templates.test.ts
│   │   └── snapshots/
│   └── agents/
│       ├── reactor-agent.test.ts
│       └── planning-agent.test.ts
├── integration/
│   └── ...
└── e2e/
    └── ...
```

---

## 🔗 Integration Testing

El integration testing en sistemas de IA valida que múltiples componentes trabajen correctamente juntos. A diferencia de unit tests, aquí probamos flujos completos con agentes reales (aunque con LLMs mockeados).

### Testing de Agentes Completos

**Un agente completo involucra LLM + tools + estado.** Los integration tests verifican que estos componentes interactúan correctamente.

```typescript
// Test harness para agentes completos
class AgentTestHarness<T extends Agent> {
  private agent: T;
  private mockLLM: MockLLMClient;
  private mockTools: Map<string, Tool>;
  private executionTrace: ExecutionEvent[] = [];

  constructor(agentFactory: (llm: LLMClient, tools: Tool[]) => T) {
    this.mockLLM = new MockLLMClient();
    this.mockTools = new Map();
    this.agent = agentFactory(this.mockLLM, Array.from(this.mockTools.values()));
  }

  // Registrar mock de tool con tracking
  registerTool(tool: Tool): void {
    const trackedTool: Tool = {
      ...tool,
      execute: async (params: any) => {
        this.executionTrace.push({
          type: 'tool_call',
          toolName: tool.name,
          params,
          timestamp: Date.now()
        });
        const result = await tool.execute(params);
        this.executionTrace.push({
          type: 'tool_result',
          toolName: tool.name,
          result,
          timestamp: Date.now()
        });
        return result;
      }
    };
    this.mockTools.set(tool.name, trackedTool);
  }

  // Configurar secuencia de respuestas del LLM
  setLLMResponses(responses: LLMResponse[]): void {
    let callIndex = 0;
    this.mockLLM.setResponseGenerator(() => {
      if (callIndex >= responses.length) {
        throw new Error('Unexpected LLM call - no more responses configured');
      }
      return responses[callIndex++];
    });
  }

  // Ejecutar y obtener trace completo
  async execute(input: string): Promise<AgentTestResult> {
    this.executionTrace = [];
    const startTime = Date.now();

    try {
      const result = await this.agent.execute(input);
      return {
        success: true,
        result,
        trace: this.executionTrace,
        duration: Date.now() - startTime,
        llmCallCount: this.mockLLM.getCallCount()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        trace: this.executionTrace,
        duration: Date.now() - startTime,
        llmCallCount: this.mockLLM.getCallCount()
      };
    }
  }

  // Verificaciones fluent
  assertToolWasCalled(toolName: string, times?: number): void {
    const calls = this.executionTrace.filter(
      e => e.type === 'tool_call' && e.toolName === toolName
    );
    if (times !== undefined && calls.length !== times) {
      throw new Error(`Expected ${toolName} to be called ${times} times, but was called ${calls.length} times`);
    }
    if (calls.length === 0) {
      throw new Error(`Expected ${toolName} to be called, but it was never called`);
    }
  }

  assertToolCallOrder(expectedOrder: string[]): void {
    const actualOrder = this.executionTrace
      .filter(e => e.type === 'tool_call')
      .map(e => e.toolName);

    const orderMatches = expectedOrder.every((tool, index) => actualOrder[index] === tool);
    if (!orderMatches) {
      throw new Error(`Expected tool order: ${expectedOrder.join(' -> ')}, but got: ${actualOrder.join(' -> ')}`);
    }
  }
}

interface ExecutionEvent {
  type: 'tool_call' | 'tool_result' | 'llm_call' | 'llm_response';
  toolName?: string;
  params?: any;
  result?: any;
  timestamp: number;
}

interface AgentTestResult {
  success: boolean;
  result?: any;
  error?: string;
  trace: ExecutionEvent[];
  duration: number;
  llmCallCount: number;
}
```

**Ejemplo de test de agente completo:**

```typescript
import { describe, it, expect, beforeEach } from 'vitest';

describe('ResearchAgent Integration', () => {
  let harness: AgentTestHarness<ResearchAgent>;

  beforeEach(() => {
    harness = new AgentTestHarness((llm, tools) => new ResearchAgent(llm, tools));

    // Registrar tools necesarias
    harness.registerTool(createSearchTool());
    harness.registerTool(createSummarizeTool());
    harness.registerTool(createCiteTool());
  });

  it('should complete full research workflow', async () => {
    // Configurar respuestas del LLM para el flujo completo
    harness.setLLMResponses([
      // 1. LLM decide buscar información
      {
        content: '',
        toolCalls: [{ name: 'search', params: { query: 'climate change effects' } }]
      },
      // 2. LLM decide resumir resultados
      {
        content: '',
        toolCalls: [{ name: 'summarize', params: { text: '...' } }]
      },
      // 3. LLM decide agregar citas
      {
        content: '',
        toolCalls: [{ name: 'cite', params: { sources: ['...'] } }]
      },
      // 4. LLM genera respuesta final
      {
        content: 'Based on my research, climate change has significant effects...',
        toolCalls: []
      }
    ]);

    const result = await harness.execute('Research climate change effects');

    expect(result.success).toBe(true);
    expect(result.result).toContain('climate change');
    harness.assertToolCallOrder(['search', 'summarize', 'cite']);
    expect(result.llmCallCount).toBe(4);
  });

  it('should handle search failures gracefully', async () => {
    // Registrar tool que falla
    harness.registerTool({
      name: 'search',
      description: 'Failing search',
      parameters: {},
      execute: async () => ({ success: false, error: 'Service unavailable' })
    });

    harness.setLLMResponses([
      { content: '', toolCalls: [{ name: 'search', params: { query: 'test' } }] },
      { content: 'I apologize, I was unable to search due to a service error.', toolCalls: [] }
    ]);

    const result = await harness.execute('Search for something');

    expect(result.success).toBe(true);
    expect(result.result).toContain('unable to search');
  });
});
```

---

### Multi-Agent Workflow Testing

**Los sistemas multi-agente requieren tests que verifiquen la coordinación entre agentes.**

```typescript
// Framework para testing de múltiples agentes
class MultiAgentTestFramework {
  private agents: Map<string, Agent> = new Map();
  private messageLog: AgentMessage[] = [];
  private mockLLMs: Map<string, MockLLMClient> = new Map();

  registerAgent(name: string, agentFactory: (llm: LLMClient) => Agent): void {
    const mockLLM = new MockLLMClient();
    this.mockLLMs.set(name, mockLLM);
    this.agents.set(name, agentFactory(mockLLM));
  }

  // Configurar comunicación entre agentes
  setupCommunication(from: string, to: string, messageHandler: MessageHandler): void {
    const fromAgent = this.agents.get(from);
    const toAgent = this.agents.get(to);

    if (fromAgent && toAgent) {
      fromAgent.onOutput((output) => {
        this.messageLog.push({
          from,
          to,
          content: output,
          timestamp: Date.now()
        });
        messageHandler(output, toAgent);
      });
    }
  }

  // Ejecutar workflow multi-agente
  async executeWorkflow(
    startAgent: string,
    input: string,
    maxIterations: number = 10
  ): Promise<MultiAgentResult> {
    const agent = this.agents.get(startAgent);
    if (!agent) {
      throw new Error(`Agent ${startAgent} not found`);
    }

    let iterations = 0;
    let currentOutput = await agent.execute(input);

    while (iterations < maxIterations) {
      const pendingMessages = this.messageLog.filter(m => !m.processed);
      if (pendingMessages.length === 0) break;

      for (const message of pendingMessages) {
        const targetAgent = this.agents.get(message.to);
        if (targetAgent) {
          currentOutput = await targetAgent.execute(message.content);
        }
        message.processed = true;
      }

      iterations++;
    }

    return {
      finalOutput: currentOutput,
      messageLog: this.messageLog,
      iterations,
      agentCalls: this.getAgentCallStats()
    };
  }

  private getAgentCallStats(): Map<string, number> {
    const stats = new Map<string, number>();
    for (const [name, llm] of this.mockLLMs) {
      stats.set(name, llm.getCallCount());
    }
    return stats;
  }

  // Verificaciones
  assertMessageSent(from: string, to: string): void {
    const found = this.messageLog.some(m => m.from === from && m.to === to);
    if (!found) {
      throw new Error(`Expected message from ${from} to ${to}, but none found`);
    }
  }

  assertAgentCalled(agentName: string, minTimes: number = 1): void {
    const llm = this.mockLLMs.get(agentName);
    if (!llm || llm.getCallCount() < minTimes) {
      throw new Error(`Expected ${agentName} to be called at least ${minTimes} times`);
    }
  }
}

interface AgentMessage {
  from: string;
  to: string;
  content: string;
  timestamp: number;
  processed?: boolean;
}

interface MultiAgentResult {
  finalOutput: any;
  messageLog: AgentMessage[];
  iterations: number;
  agentCalls: Map<string, number>;
}
```

**Test de workflow multi-agente:**

```typescript
describe('Multi-Agent Research System', () => {
  let framework: MultiAgentTestFramework;

  beforeEach(() => {
    framework = new MultiAgentTestFramework();

    // Registrar agentes especializados
    framework.registerAgent('coordinator', (llm) => new CoordinatorAgent(llm));
    framework.registerAgent('researcher', (llm) => new ResearcherAgent(llm));
    framework.registerAgent('writer', (llm) => new WriterAgent(llm));
    framework.registerAgent('reviewer', (llm) => new ReviewerAgent(llm));

    // Configurar flujo de comunicación
    framework.setupCommunication('coordinator', 'researcher', (output, agent) => {
      if (output.type === 'research_request') {
        agent.queueTask(output.task);
      }
    });

    framework.setupCommunication('researcher', 'writer', (output, agent) => {
      if (output.type === 'research_complete') {
        agent.queueTask({ type: 'write', data: output.data });
      }
    });

    framework.setupCommunication('writer', 'reviewer', (output, agent) => {
      if (output.type === 'draft_complete') {
        agent.queueTask({ type: 'review', draft: output.draft });
      }
    });
  });

  it('should coordinate research workflow across agents', async () => {
    // Configurar respuestas de cada agente
    const coordinatorLLM = framework.getLLM('coordinator');
    coordinatorLLM.setResponse('research', JSON.stringify({
      type: 'research_request',
      task: { topic: 'AI safety', depth: 'comprehensive' }
    }));

    const researcherLLM = framework.getLLM('researcher');
    researcherLLM.setResponse('AI safety', JSON.stringify({
      type: 'research_complete',
      data: { findings: ['finding1', 'finding2'], sources: ['source1'] }
    }));

    const writerLLM = framework.getLLM('writer');
    writerLLM.setResponse('write', JSON.stringify({
      type: 'draft_complete',
      draft: 'AI safety is crucial...'
    }));

    const reviewerLLM = framework.getLLM('reviewer');
    reviewerLLM.setResponse('review', JSON.stringify({
      type: 'review_complete',
      approved: true,
      feedback: 'Well written'
    }));

    const result = await framework.executeWorkflow('coordinator', 'Research AI safety');

    // Verificar flujo completo
    expect(result.iterations).toBeGreaterThan(0);
    framework.assertMessageSent('coordinator', 'researcher');
    framework.assertMessageSent('researcher', 'writer');
    framework.assertMessageSent('writer', 'reviewer');
    framework.assertAgentCalled('coordinator');
    framework.assertAgentCalled('researcher');
    framework.assertAgentCalled('writer');
    framework.assertAgentCalled('reviewer');
  });

  it('should handle agent failures without breaking workflow', async () => {
    const researcherLLM = framework.getLLM('researcher');
    researcherLLM.setResponseGenerator(() => {
      throw new Error('Researcher unavailable');
    });

    const coordinatorLLM = framework.getLLM('coordinator');
    coordinatorLLM.setResponse('research', JSON.stringify({
      type: 'research_request',
      task: { topic: 'test' }
    }));
    coordinatorLLM.setResponse('error', JSON.stringify({
      type: 'fallback',
      action: 'use_cached_data'
    }));

    // El workflow debe manejar el error gracefully
    const result = await framework.executeWorkflow('coordinator', 'Research test topic');

    expect(result.finalOutput).toBeDefined();
  });
});
```

---

### Testing de Agent Chains

**Las cadenas de agentes (Chain Pattern) requieren verificar que cada paso produce output válido para el siguiente.**

```typescript
// Test utilities para agent chains
class ChainTestUtils {
  // Verificar que output de un agente es válido input para el siguiente
  static validateChainTransition<TOutput, TInput>(
    outputSchema: Schema<TOutput>,
    inputSchema: Schema<TInput>,
    transformer?: (output: TOutput) => TInput
  ): ChainTransitionValidator<TOutput, TInput> {
    return {
      validate: (output: TOutput): ValidationResult => {
        // Validar output del agente anterior
        const outputValidation = outputSchema.safeParse(output);
        if (!outputValidation.success) {
          return {
            valid: false,
            error: `Invalid output: ${outputValidation.error.message}`
          };
        }

        // Transformar si es necesario
        const input = transformer ? transformer(output) : output as unknown as TInput;

        // Validar como input del siguiente agente
        const inputValidation = inputSchema.safeParse(input);
        if (!inputValidation.success) {
          return {
            valid: false,
            error: `Output not compatible with next agent: ${inputValidation.error.message}`
          };
        }

        return { valid: true };
      }
    };
  }

  // Ejecutar chain con validación en cada paso
  static async executeWithValidation(
    chain: Agent[],
    validators: ChainTransitionValidator<any, any>[],
    initialInput: any
  ): Promise<ChainExecutionResult> {
    const stepResults: StepResult[] = [];
    let currentInput = initialInput;

    for (let i = 0; i < chain.length; i++) {
      const agent = chain[i];
      const stepStart = Date.now();

      try {
        const output = await agent.execute(currentInput);

        // Validar transición al siguiente agente
        if (i < chain.length - 1 && validators[i]) {
          const validation = validators[i].validate(output);
          if (!validation.valid) {
            return {
              success: false,
              failedAtStep: i,
              error: validation.error,
              stepResults
            };
          }
        }

        stepResults.push({
          agentIndex: i,
          input: currentInput,
          output,
          duration: Date.now() - stepStart,
          success: true
        });

        currentInput = output;
      } catch (error) {
        stepResults.push({
          agentIndex: i,
          input: currentInput,
          error: error.message,
          duration: Date.now() - stepStart,
          success: false
        });

        return {
          success: false,
          failedAtStep: i,
          error: error.message,
          stepResults
        };
      }
    }

    return {
      success: true,
      finalOutput: currentInput,
      stepResults
    };
  }
}

interface ChainTransitionValidator<TOutput, TInput> {
  validate: (output: TOutput) => ValidationResult;
}

interface ChainExecutionResult {
  success: boolean;
  finalOutput?: any;
  failedAtStep?: number;
  error?: string;
  stepResults: StepResult[];
}

interface StepResult {
  agentIndex: number;
  input: any;
  output?: any;
  error?: string;
  duration: number;
  success: boolean;
}
```

**Tests de agent chains:**

```typescript
import { z } from 'zod';

describe('Code Review Chain', () => {
  // Schemas para validar transiciones
  const codeAnalysisSchema = z.object({
    code: z.string(),
    language: z.string(),
    issues: z.array(z.object({
      line: z.number(),
      severity: z.enum(['error', 'warning', 'info']),
      message: z.string()
    }))
  });

  const securityReportSchema = z.object({
    vulnerabilities: z.array(z.object({
      type: z.string(),
      severity: z.enum(['critical', 'high', 'medium', 'low']),
      location: z.string()
    })),
    score: z.number().min(0).max(100)
  });

  const finalReportSchema = z.object({
    summary: z.string(),
    codeQuality: z.number(),
    securityScore: z.number(),
    recommendations: z.array(z.string())
  });

  let chain: Agent[];
  let validators: ChainTransitionValidator<any, any>[];

  beforeEach(() => {
    chain = [
      createMockAgent('analyzer', codeAnalysisSchema),
      createMockAgent('security', securityReportSchema),
      createMockAgent('reporter', finalReportSchema)
    ];

    validators = [
      ChainTestUtils.validateChainTransition(
        codeAnalysisSchema,
        z.object({ code: z.string(), issues: z.array(z.any()) }),
        (output) => ({ code: output.code, issues: output.issues })
      ),
      ChainTestUtils.validateChainTransition(
        securityReportSchema,
        z.object({ vulnerabilities: z.array(z.any()), score: z.number() })
      )
    ];
  });

  it('should execute full chain with valid transitions', async () => {
    const result = await ChainTestUtils.executeWithValidation(
      chain,
      validators,
      { code: 'function test() { return 1; }', language: 'javascript' }
    );

    expect(result.success).toBe(true);
    expect(result.stepResults).toHaveLength(3);
    expect(result.finalOutput).toMatchObject({
      summary: expect.any(String),
      codeQuality: expect.any(Number),
      securityScore: expect.any(Number)
    });
  });

  it('should detect invalid transitions between agents', async () => {
    // Crear agente que produce output inválido
    chain[0] = createMockAgent('bad_analyzer', z.any(), {
      execute: async () => ({ invalid: 'output' }) // Missing required fields
    });

    const result = await ChainTestUtils.executeWithValidation(
      chain,
      validators,
      { code: 'test' }
    );

    expect(result.success).toBe(false);
    expect(result.failedAtStep).toBe(0);
    expect(result.error).toContain('not compatible');
  });

  it('should measure performance of each step', async () => {
    const result = await ChainTestUtils.executeWithValidation(
      chain,
      validators,
      { code: 'test code' }
    );

    // Verificar que cada paso tiene métricas
    for (const step of result.stepResults) {
      expect(step.duration).toBeGreaterThanOrEqual(0);
      expect(step.agentIndex).toBeDefined();
    }

    // Calcular duración total
    const totalDuration = result.stepResults.reduce((sum, s) => sum + s.duration, 0);
    expect(totalDuration).toBeGreaterThan(0);
  });
});
```

---

### Tool Chaining Validation

**Cuando tools se ejecutan en secuencia, es crucial validar que el output de una sea válido input para la siguiente.**

```typescript
// Sistema de validación de tool chains
class ToolChainValidator {
  private tools: Map<string, ToolDefinition> = new Map();

  registerTool(definition: ToolDefinition): void {
    this.tools.set(definition.name, definition);
  }

  // Validar que una secuencia de tools es compatible
  validateChain(toolNames: string[]): ChainValidationResult {
    const issues: string[] = [];

    for (let i = 0; i < toolNames.length - 1; i++) {
      const currentTool = this.tools.get(toolNames[i]);
      const nextTool = this.tools.get(toolNames[i + 1]);

      if (!currentTool) {
        issues.push(`Tool "${toolNames[i]}" not found`);
        continue;
      }

      if (!nextTool) {
        issues.push(`Tool "${toolNames[i + 1]}" not found`);
        continue;
      }

      // Verificar compatibilidad de schemas
      const compatibility = this.checkSchemaCompatibility(
        currentTool.outputSchema,
        nextTool.inputSchema
      );

      if (!compatibility.compatible) {
        issues.push(
          `Incompatible transition: ${currentTool.name} -> ${nextTool.name}: ${compatibility.reason}`
        );
      }
    }

    return {
      valid: issues.length === 0,
      issues,
      chain: toolNames.map(name => this.tools.get(name)!)
    };
  }

  // Ejecutar chain con validación en runtime
  async executeChain(
    toolNames: string[],
    initialInput: any
  ): Promise<ToolChainExecutionResult> {
    const validation = this.validateChain(toolNames);
    if (!validation.valid) {
      return {
        success: false,
        error: `Invalid chain: ${validation.issues.join(', ')}`,
        steps: []
      };
    }

    const steps: ToolExecutionStep[] = [];
    let currentInput = initialInput;

    for (const tool of validation.chain) {
      // Validar input
      const inputValidation = tool.inputSchema.safeParse(currentInput);
      if (!inputValidation.success) {
        return {
          success: false,
          error: `Invalid input for ${tool.name}: ${inputValidation.error.message}`,
          steps
        };
      }

      try {
        const result = await tool.execute(currentInput);

        // Validar output
        const outputValidation = tool.outputSchema.safeParse(result.data);
        if (!outputValidation.success) {
          return {
            success: false,
            error: `Invalid output from ${tool.name}: ${outputValidation.error.message}`,
            steps
          };
        }

        steps.push({
          toolName: tool.name,
          input: currentInput,
          output: result.data,
          success: result.success
        });

        currentInput = result.data;
      } catch (error) {
        steps.push({
          toolName: tool.name,
          input: currentInput,
          error: error.message,
          success: false
        });

        return {
          success: false,
          error: `Tool ${tool.name} failed: ${error.message}`,
          steps
        };
      }
    }

    return {
      success: true,
      finalOutput: currentInput,
      steps
    };
  }

  private checkSchemaCompatibility(
    outputSchema: Schema<any>,
    inputSchema: Schema<any>
  ): { compatible: boolean; reason?: string } {
    // Verificar que los campos requeridos del input están en el output
    const outputShape = this.getSchemaShape(outputSchema);
    const inputShape = this.getSchemaShape(inputSchema);

    for (const [key, type] of Object.entries(inputShape.required || {})) {
      if (!(key in outputShape.properties)) {
        return {
          compatible: false,
          reason: `Required field "${key}" missing in output`
        };
      }
    }

    return { compatible: true };
  }

  private getSchemaShape(schema: Schema<any>): any {
    // Extraer shape del schema (implementación depende del validador usado)
    return schema._def?.shape || {};
  }
}

interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Schema<any>;
  outputSchema: Schema<any>;
  execute: (input: any) => Promise<ToolResult>;
}

interface ToolChainExecutionResult {
  success: boolean;
  finalOutput?: any;
  error?: string;
  steps: ToolExecutionStep[];
}

interface ToolExecutionStep {
  toolName: string;
  input: any;
  output?: any;
  error?: string;
  success: boolean;
}
```

**Tests de tool chaining:**

```typescript
import { z } from 'zod';

describe('Tool Chain Validation', () => {
  let validator: ToolChainValidator;

  beforeEach(() => {
    validator = new ToolChainValidator();

    // Registrar tools con schemas definidos
    validator.registerTool({
      name: 'fetch_data',
      description: 'Fetch data from API',
      inputSchema: z.object({
        url: z.string().url(),
        headers: z.record(z.string()).optional()
      }),
      outputSchema: z.object({
        data: z.any(),
        status: z.number(),
        timestamp: z.string()
      }),
      execute: async (input) => ({
        success: true,
        data: { data: { items: [] }, status: 200, timestamp: new Date().toISOString() }
      })
    });

    validator.registerTool({
      name: 'transform_data',
      description: 'Transform fetched data',
      inputSchema: z.object({
        data: z.any(),
        status: z.number()
      }),
      outputSchema: z.object({
        transformed: z.array(z.any()),
        count: z.number()
      }),
      execute: async (input) => ({
        success: true,
        data: { transformed: [], count: 0 }
      })
    });

    validator.registerTool({
      name: 'save_results',
      description: 'Save results to database',
      inputSchema: z.object({
        transformed: z.array(z.any()),
        count: z.number()
      }),
      outputSchema: z.object({
        savedId: z.string(),
        success: z.boolean()
      }),
      execute: async (input) => ({
        success: true,
        data: { savedId: 'abc123', success: true }
      })
    });
  });

  describe('chain validation', () => {
    it('should validate compatible tool chain', () => {
      const result = validator.validateChain([
        'fetch_data',
        'transform_data',
        'save_results'
      ]);

      expect(result.valid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it('should detect incompatible tools in chain', () => {
      // save_results no es compatible directamente con fetch_data output
      const result = validator.validateChain([
        'fetch_data',
        'save_results' // Expects 'transformed' and 'count', but fetch_data outputs 'data' and 'status'
      ]);

      expect(result.valid).toBe(false);
      expect(result.issues.some(i => i.includes('Incompatible'))).toBe(true);
    });

    it('should detect missing tools', () => {
      const result = validator.validateChain([
        'fetch_data',
        'nonexistent_tool',
        'save_results'
      ]);

      expect(result.valid).toBe(false);
      expect(result.issues.some(i => i.includes('not found'))).toBe(true);
    });
  });

  describe('chain execution', () => {
    it('should execute valid chain end-to-end', async () => {
      const result = await validator.executeChain(
        ['fetch_data', 'transform_data', 'save_results'],
        { url: 'https://api.example.com/data' }
      );

      expect(result.success).toBe(true);
      expect(result.steps).toHaveLength(3);
      expect(result.finalOutput).toMatchObject({
        savedId: expect.any(String),
        success: true
      });
    });

    it('should fail on invalid initial input', async () => {
      const result = await validator.executeChain(
        ['fetch_data', 'transform_data'],
        { url: 'not-a-valid-url' } // Invalid URL format
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid input');
    });

    it('should capture partial results on mid-chain failure', async () => {
      // Override transform_data to fail
      validator.registerTool({
        name: 'transform_data',
        description: 'Failing transform',
        inputSchema: z.object({ data: z.any(), status: z.number() }),
        outputSchema: z.any(),
        execute: async () => { throw new Error('Transform failed'); }
      });

      const result = await validator.executeChain(
        ['fetch_data', 'transform_data', 'save_results'],
        { url: 'https://api.example.com/data' }
      );

      expect(result.success).toBe(false);
      expect(result.steps).toHaveLength(2);
      expect(result.steps[0].success).toBe(true); // fetch succeeded
      expect(result.steps[1].success).toBe(false); // transform failed
    });
  });
});
```

---

### Testing de Handoffs entre Agentes

**Cuando un agente delega trabajo a otro, el handoff debe ser explícito y testeable.**

```typescript
// Framework para testing de handoffs
class HandoffTestFramework {
  private handoffLog: HandoffEvent[] = [];

  // Wrapper que registra handoffs
  wrapAgentWithHandoffTracking<T extends Agent>(
    agent: T,
    agentName: string
  ): T & HandoffTracker {
    const wrapped = agent as T & HandoffTracker;

    const originalExecute = agent.execute.bind(agent);
    wrapped.execute = async (input: any) => {
      const handoffContext = this.extractHandoffContext(input);

      if (handoffContext) {
        this.handoffLog.push({
          from: handoffContext.fromAgent,
          to: agentName,
          data: handoffContext.data,
          timestamp: Date.now()
        });
      }

      const result = await originalExecute(input);

      // Detectar si el resultado incluye un handoff
      if (this.isHandoffResult(result)) {
        this.handoffLog.push({
          from: agentName,
          to: result.targetAgent,
          data: result.handoffData,
          timestamp: Date.now(),
          pending: true
        });
      }

      return result;
    };

    wrapped.getHandoffLog = () => [...this.handoffLog];
    return wrapped;
  }

  private extractHandoffContext(input: any): HandoffContext | null {
    if (input && typeof input === 'object' && '__handoff' in input) {
      return input.__handoff as HandoffContext;
    }
    return null;
  }

  private isHandoffResult(result: any): result is HandoffResult {
    return result && typeof result === 'object' && 'targetAgent' in result;
  }

  // Verificaciones
  assertHandoffOccurred(from: string, to: string): void {
    const found = this.handoffLog.some(h => h.from === from && h.to === to);
    if (!found) {
      throw new Error(`Expected handoff from ${from} to ${to}, but none found`);
    }
  }

  assertHandoffDataContains(from: string, to: string, expectedData: Partial<any>): void {
    const handoff = this.handoffLog.find(h => h.from === from && h.to === to);
    if (!handoff) {
      throw new Error(`Handoff from ${from} to ${to} not found`);
    }

    for (const [key, value] of Object.entries(expectedData)) {
      if (handoff.data[key] !== value) {
        throw new Error(
          `Expected handoff data.${key} to be ${value}, but got ${handoff.data[key]}`
        );
      }
    }
  }

  getHandoffChain(): string[] {
    const chain: string[] = [];
    for (const handoff of this.handoffLog) {
      if (chain.length === 0) {
        chain.push(handoff.from);
      }
      chain.push(handoff.to);
    }
    return chain;
  }

  reset(): void {
    this.handoffLog = [];
  }
}

interface HandoffEvent {
  from: string;
  to: string;
  data: any;
  timestamp: number;
  pending?: boolean;
}

interface HandoffContext {
  fromAgent: string;
  data: any;
}

interface HandoffResult {
  targetAgent: string;
  handoffData: any;
}

interface HandoffTracker {
  getHandoffLog: () => HandoffEvent[];
}
```

**Tests de handoffs:**

```typescript
describe('Agent Handoff Testing', () => {
  let framework: HandoffTestFramework;
  let triageAgent: Agent & HandoffTracker;
  let specialistAgent: Agent & HandoffTracker;
  let escalationAgent: Agent & HandoffTracker;

  beforeEach(() => {
    framework = new HandoffTestFramework();

    // Crear agentes con tracking de handoffs
    triageAgent = framework.wrapAgentWithHandoffTracking(
      createTriageAgent(),
      'triage'
    );

    specialistAgent = framework.wrapAgentWithHandoffTracking(
      createSpecialistAgent(),
      'specialist'
    );

    escalationAgent = framework.wrapAgentWithHandoffTracking(
      createEscalationAgent(),
      'escalation'
    );
  });

  afterEach(() => {
    framework.reset();
  });

  it('should correctly handoff from triage to specialist', async () => {
    // Configurar triage para que haga handoff
    const mockLLM = triageAgent.getLLM() as MockLLMClient;
    mockLLM.setResponse('technical', JSON.stringify({
      targetAgent: 'specialist',
      handoffData: {
        category: 'technical',
        priority: 'high',
        context: 'User has API issues'
      }
    }));

    await triageAgent.execute('I have a technical problem with the API');

    framework.assertHandoffOccurred('triage', 'specialist');
    framework.assertHandoffDataContains('triage', 'specialist', {
      category: 'technical',
      priority: 'high'
    });
  });

  it('should track full handoff chain', async () => {
    // Simular flujo: triage -> specialist -> escalation
    await simulateFullWorkflow(triageAgent, specialistAgent, escalationAgent);

    const chain = framework.getHandoffChain();
    expect(chain).toEqual(['triage', 'specialist', 'escalation']);
  });

  it('should preserve context through handoffs', async () => {
    const initialContext = {
      userId: 'user123',
      sessionId: 'session456',
      originalQuery: 'Help with billing'
    };

    // Ejecutar con contexto inicial
    await triageAgent.execute({
      query: 'Help with billing',
      __context: initialContext
    });

    // Verificar que el contexto se preservó en el handoff
    const handoffLog = triageAgent.getHandoffLog();
    const handoff = handoffLog.find(h => h.from === 'triage');

    expect(handoff?.data.__context?.userId).toBe('user123');
    expect(handoff?.data.__context?.sessionId).toBe('session456');
  });
});
```

---

### Best Practices para Integration Testing de IA

| Práctica | Descripción |
|----------|-------------|
| **Mockear LLMs, no tools** | Tools deben ejecutarse realmente para validar integraciones |
| **Tracing completo** | Registrar cada paso para debugging |
| **Validar transiciones** | Verificar que outputs son válidos inputs |
| **Test isolation** | Cada test debe poder ejecutarse independientemente |
| **Determinismo** | Usar seeds y mocks para resultados reproducibles |
| **Timeouts explícitos** | Configurar timeouts para evitar tests colgados |

**Estructura recomendada:**

```
tests/
├── unit/
│   └── ...
├── integration/
│   ├── agents/
│   │   ├── research-agent.integration.test.ts
│   │   └── code-review-agent.integration.test.ts
│   ├── multi-agent/
│   │   ├── research-workflow.test.ts
│   │   └── customer-support-workflow.test.ts
│   ├── chains/
│   │   ├── code-review-chain.test.ts
│   │   └── data-processing-chain.test.ts
│   └── tools/
│       ├── search-summarize-chain.test.ts
│       └── api-transform-save-chain.test.ts
└── e2e/
    └── ...
```

**Cuándo usar integration tests:**
- ✅ Validar flujos multi-step completos
- ✅ Verificar coordinación entre agentes
- ✅ Testear tool chains con datos reales
- ✅ Detectar problemas de compatibilidad

**Tradeoffs:**
- **Pros**: Detecta problemas de integración, valida flujos reales
- **Cons**: Más lentos que unit tests, más difíciles de debuggear

---

## 📊 Quality Evaluation

> **📝 Próximamente:** BLEU/ROUGE scores para texto, métricas custom de calidad, human evaluation workflows, y automated quality gates.

---

## 🔒 Security Testing

> **📝 Próximamente:** Prompt injection testing, output validation testing, tool execution safety, y adversarial input testing.

---

## ⚡ Performance Testing

> **📝 Próximamente:** Latency measurement, throughput testing, cost optimization, y scaling validation.

---

## 🎲 Determinismo vs No-determinismo

> **📝 Próximamente:** Strategies para consistent results, statistical testing approaches, confidence intervals, y A/B testing frameworks.

---

## Conclusión

**El testing de sistemas de IA requiere un cambio de mentalidad.** No podemos esperar determinismo perfecto del LLM, pero sí podemos:

- ✅ Aislar y testear componentes determinísticos (tools, parsers, prompts)
- ✅ Mockear el LLM para tests rápidos y reproducibles
- ✅ Usar snapshots para detectar regresiones en prompts
- ✅ Implementar tests de integración con LLMs reales en pipelines separados

**Principio clave**: Maximizar cobertura de unit tests determinísticos, minimizar dependencia de LLM en tests automatizados.

> *"En sistemas de IA, testear la lógica que rodea al LLM es tan importante como testear el comportamiento del LLM mismo."*

Próximo: [Patrones de Arquitectura](./patrones.md) - patrones probados para sistemas de IA robustos. 🧠
