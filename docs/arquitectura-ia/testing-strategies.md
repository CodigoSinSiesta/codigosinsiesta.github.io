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

Evaluar la calidad de outputs de sistemas de IA es fundamentalmente diferente a testing tradicional. No hay una "respuesta correcta" única - hay un espectro de calidad que debe medirse con múltiples métricas.

### Métricas de Evaluación de Texto

**Las métricas automáticas proporcionan una línea base objetiva para comparar outputs.**

#### BLEU Score (Bilingual Evaluation Understudy)

**Mide la similitud entre texto generado y referencias humanas basándose en n-gramas.**

```typescript
// Implementación de BLEU score
class BLEUScorer {
  // Calcular precision de n-gramas
  private calculateNgramPrecision(
    candidate: string[],
    references: string[][],
    n: number
  ): number {
    const candidateNgrams = this.getNgrams(candidate, n);
    const referenceNgrams = references.flatMap(ref => this.getNgrams(ref, n));

    let matchCount = 0;
    const refNgramCounts = this.countNgrams(referenceNgrams);

    for (const ngram of candidateNgrams) {
      const ngramStr = ngram.join(' ');
      if (refNgramCounts.has(ngramStr) && refNgramCounts.get(ngramStr)! > 0) {
        matchCount++;
        refNgramCounts.set(ngramStr, refNgramCounts.get(ngramStr)! - 1);
      }
    }

    return candidateNgrams.length > 0
      ? matchCount / candidateNgrams.length
      : 0;
  }

  // Brevity penalty para penalizar outputs muy cortos
  private brevityPenalty(candidateLength: number, referenceLength: number): number {
    if (candidateLength >= referenceLength) {
      return 1;
    }
    return Math.exp(1 - referenceLength / candidateLength);
  }

  // Calcular BLEU score completo
  calculate(
    candidate: string,
    references: string[],
    maxN: number = 4
  ): BLEUResult {
    const candidateTokens = this.tokenize(candidate);
    const referenceTokens = references.map(ref => this.tokenize(ref));

    // Calcular precision para cada n
    const precisions: number[] = [];
    for (let n = 1; n <= maxN; n++) {
      precisions.push(
        this.calculateNgramPrecision(candidateTokens, referenceTokens, n)
      );
    }

    // Geometric mean de precisions
    const logSum = precisions.reduce((sum, p) => sum + Math.log(p || 1e-10), 0);
    const geometricMean = Math.exp(logSum / maxN);

    // Aplicar brevity penalty
    const avgRefLength = referenceTokens.reduce((sum, ref) => sum + ref.length, 0)
      / referenceTokens.length;
    const bp = this.brevityPenalty(candidateTokens.length, avgRefLength);

    const bleuScore = bp * geometricMean;

    return {
      score: bleuScore,
      precisions,
      brevityPenalty: bp,
      candidateLength: candidateTokens.length,
      referenceLength: avgRefLength
    };
  }

  private getNgrams(tokens: string[], n: number): string[][] {
    const ngrams: string[][] = [];
    for (let i = 0; i <= tokens.length - n; i++) {
      ngrams.push(tokens.slice(i, i + n));
    }
    return ngrams;
  }

  private countNgrams(ngrams: string[][]): Map<string, number> {
    const counts = new Map<string, number>();
    for (const ngram of ngrams) {
      const key = ngram.join(' ');
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    return counts;
  }

  private tokenize(text: string): string[] {
    return text.toLowerCase().split(/\s+/).filter(t => t.length > 0);
  }
}

interface BLEUResult {
  score: number;          // 0-1, higher is better
  precisions: number[];   // Per n-gram precision
  brevityPenalty: number;
  candidateLength: number;
  referenceLength: number;
}
```

**Cuándo usar BLEU:**
- ✅ Traducción automática
- ✅ Generación de resúmenes
- ✅ Comparación de modelos
- ✅ Regression testing de prompts

**Tradeoffs:**
- **Pros**: Rápido, reproducible, estándar de la industria
- **Cons**: No captura semántica, penaliza paráfrasis válidas

---

#### ROUGE Score (Recall-Oriented Understudy for Gisting Evaluation)

**Mide overlap entre texto generado y referencias, enfocado en recall.**

```typescript
class ROUGEScorer {
  // ROUGE-N: overlap de n-gramas
  calculateROUGEN(
    candidate: string,
    reference: string,
    n: number
  ): ROUGEScore {
    const candidateNgrams = this.getNgrams(this.tokenize(candidate), n);
    const referenceNgrams = this.getNgrams(this.tokenize(reference), n);

    const candidateSet = new Set(candidateNgrams.map(ng => ng.join(' ')));
    const referenceSet = new Set(referenceNgrams.map(ng => ng.join(' ')));

    // Calcular overlap
    let overlap = 0;
    for (const ngram of candidateSet) {
      if (referenceSet.has(ngram)) {
        overlap++;
      }
    }

    const precision = candidateSet.size > 0 ? overlap / candidateSet.size : 0;
    const recall = referenceSet.size > 0 ? overlap / referenceSet.size : 0;
    const f1 = precision + recall > 0
      ? (2 * precision * recall) / (precision + recall)
      : 0;

    return { precision, recall, f1 };
  }

  // ROUGE-L: Longest Common Subsequence
  calculateROUGEL(candidate: string, reference: string): ROUGEScore {
    const candidateTokens = this.tokenize(candidate);
    const referenceTokens = this.tokenize(reference);

    const lcsLength = this.longestCommonSubsequence(
      candidateTokens,
      referenceTokens
    );

    const precision = candidateTokens.length > 0
      ? lcsLength / candidateTokens.length
      : 0;
    const recall = referenceTokens.length > 0
      ? lcsLength / referenceTokens.length
      : 0;
    const f1 = precision + recall > 0
      ? (2 * precision * recall) / (precision + recall)
      : 0;

    return { precision, recall, f1 };
  }

  // ROUGE-S: Skip-bigram co-occurrence
  calculateROUGES(
    candidate: string,
    reference: string,
    skipDistance: number = 4
  ): ROUGEScore {
    const candidateSkipBigrams = this.getSkipBigrams(
      this.tokenize(candidate),
      skipDistance
    );
    const referenceSkipBigrams = this.getSkipBigrams(
      this.tokenize(reference),
      skipDistance
    );

    const candidateSet = new Set(candidateSkipBigrams.map(sb => sb.join(' ')));
    const referenceSet = new Set(referenceSkipBigrams.map(sb => sb.join(' ')));

    let overlap = 0;
    for (const skipBigram of candidateSet) {
      if (referenceSet.has(skipBigram)) {
        overlap++;
      }
    }

    const precision = candidateSet.size > 0 ? overlap / candidateSet.size : 0;
    const recall = referenceSet.size > 0 ? overlap / referenceSet.size : 0;
    const f1 = precision + recall > 0
      ? (2 * precision * recall) / (precision + recall)
      : 0;

    return { precision, recall, f1 };
  }

  // Calcular todas las métricas ROUGE
  calculateAll(candidate: string, reference: string): ROUGEResults {
    return {
      rouge1: this.calculateROUGEN(candidate, reference, 1),
      rouge2: this.calculateROUGEN(candidate, reference, 2),
      rougeL: this.calculateROUGEL(candidate, reference),
      rougeS: this.calculateROUGES(candidate, reference)
    };
  }

  private longestCommonSubsequence(a: string[], b: string[]): number {
    const dp: number[][] = Array(a.length + 1)
      .fill(null)
      .map(() => Array(b.length + 1).fill(0));

    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        if (a[i - 1] === b[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    return dp[a.length][b.length];
  }

  private getSkipBigrams(tokens: string[], maxSkip: number): string[][] {
    const skipBigrams: string[][] = [];
    for (let i = 0; i < tokens.length; i++) {
      for (let j = i + 1; j < Math.min(i + maxSkip + 2, tokens.length); j++) {
        skipBigrams.push([tokens[i], tokens[j]]);
      }
    }
    return skipBigrams;
  }

  private getNgrams(tokens: string[], n: number): string[][] {
    const ngrams: string[][] = [];
    for (let i = 0; i <= tokens.length - n; i++) {
      ngrams.push(tokens.slice(i, i + n));
    }
    return ngrams;
  }

  private tokenize(text: string): string[] {
    return text.toLowerCase().split(/\s+/).filter(t => t.length > 0);
  }
}

interface ROUGEScore {
  precision: number;
  recall: number;
  f1: number;
}

interface ROUGEResults {
  rouge1: ROUGEScore;
  rouge2: ROUGEScore;
  rougeL: ROUGEScore;
  rougeS: ROUGEScore;
}
```

**Tests de métricas ROUGE:**

```typescript
import { describe, it, expect, beforeEach } from 'vitest';

describe('ROUGEScorer', () => {
  let scorer: ROUGEScorer;

  beforeEach(() => {
    scorer = new ROUGEScorer();
  });

  describe('ROUGE-1', () => {
    it('should calculate perfect score for identical texts', () => {
      const text = 'The quick brown fox jumps over the lazy dog';
      const result = scorer.calculateROUGEN(text, text, 1);

      expect(result.precision).toBe(1);
      expect(result.recall).toBe(1);
      expect(result.f1).toBe(1);
    });

    it('should calculate partial overlap correctly', () => {
      const candidate = 'The quick brown fox';
      const reference = 'The slow brown dog';
      const result = scorer.calculateROUGEN(candidate, reference, 1);

      // 'the' and 'brown' overlap
      expect(result.recall).toBeCloseTo(0.5);
    });
  });

  describe('ROUGE-L', () => {
    it('should find longest common subsequence', () => {
      const candidate = 'The cat sat on the mat';
      const reference = 'The cat is on the mat';
      const result = scorer.calculateROUGEL(candidate, reference);

      // LCS: "the cat on the mat" (5 words)
      expect(result.f1).toBeGreaterThan(0.7);
    });
  });

  describe('calculateAll', () => {
    it('should return all ROUGE variants', () => {
      const candidate = 'AI systems require careful testing';
      const reference = 'AI systems need thorough testing';

      const results = scorer.calculateAll(candidate, reference);

      expect(results.rouge1).toBeDefined();
      expect(results.rouge2).toBeDefined();
      expect(results.rougeL).toBeDefined();
      expect(results.rougeS).toBeDefined();
    });
  });
});
```

---

### Métricas Customizadas de Calidad

**Las métricas estándar no siempre capturan lo que importa para tu caso específico.** Crear métricas custom permite evaluar aspectos únicos de tu aplicación.

```typescript
// Framework para métricas customizadas
interface QualityMetric<TInput, TOutput> {
  name: string;
  description: string;
  calculate: (input: TInput, output: TOutput) => MetricResult;
  threshold: number;
}

interface MetricResult {
  score: number;        // 0-1 normalized
  passed: boolean;
  details: string;
  metadata?: Record<string, any>;
}

// Evaluador de calidad multi-dimensional
class QualityEvaluator<TInput, TOutput> {
  private metrics: QualityMetric<TInput, TOutput>[] = [];

  registerMetric(metric: QualityMetric<TInput, TOutput>): void {
    this.metrics.push(metric);
  }

  async evaluate(input: TInput, output: TOutput): Promise<QualityReport> {
    const results: MetricEvaluation[] = [];

    for (const metric of this.metrics) {
      const result = metric.calculate(input, output);
      results.push({
        metricName: metric.name,
        description: metric.description,
        ...result,
        threshold: metric.threshold
      });
    }

    // Calcular score agregado
    const passedCount = results.filter(r => r.passed).length;
    const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;

    return {
      overallScore: avgScore,
      passed: passedCount === results.length,
      passRate: passedCount / results.length,
      metrics: results,
      timestamp: new Date().toISOString()
    };
  }
}

interface MetricEvaluation extends MetricResult {
  metricName: string;
  description: string;
  threshold: number;
}

interface QualityReport {
  overallScore: number;
  passed: boolean;
  passRate: number;
  metrics: MetricEvaluation[];
  timestamp: string;
}
```

**Métricas customizadas comunes:**

```typescript
// 1. Métrica de Relevancia Semántica (usando embeddings)
const semanticRelevanceMetric: QualityMetric<string, string> = {
  name: 'semantic_relevance',
  description: 'Measures semantic similarity between input and output',
  threshold: 0.7,
  calculate: (input, output) => {
    // En producción, usar embeddings reales
    const inputEmbedding = getEmbedding(input);
    const outputEmbedding = getEmbedding(output);
    const similarity = cosineSimilarity(inputEmbedding, outputEmbedding);

    return {
      score: similarity,
      passed: similarity >= 0.7,
      details: `Semantic similarity: ${(similarity * 100).toFixed(1)}%`,
      metadata: { inputLength: input.length, outputLength: output.length }
    };
  }
};

// 2. Métrica de Completitud
const completenessMetric: QualityMetric<TaskRequest, TaskResponse> = {
  name: 'completeness',
  description: 'Checks if all required elements are present in output',
  threshold: 1.0,
  calculate: (input, output) => {
    const requiredElements = input.requiredOutputElements || [];
    const presentElements = requiredElements.filter(elem =>
      output.content.toLowerCase().includes(elem.toLowerCase())
    );

    const score = requiredElements.length > 0
      ? presentElements.length / requiredElements.length
      : 1;

    const missingElements = requiredElements.filter(elem =>
      !output.content.toLowerCase().includes(elem.toLowerCase())
    );

    return {
      score,
      passed: score === 1,
      details: missingElements.length > 0
        ? `Missing elements: ${missingElements.join(', ')}`
        : 'All required elements present',
      metadata: {
        required: requiredElements.length,
        present: presentElements.length
      }
    };
  }
};

// 3. Métrica de Concisión
const concisenessMetric: QualityMetric<string, string> = {
  name: 'conciseness',
  description: 'Penalizes unnecessarily verbose outputs',
  threshold: 0.6,
  calculate: (input, output) => {
    const inputWords = input.split(/\s+/).length;
    const outputWords = output.split(/\s+/).length;

    // Ratio ideal: output no debería ser más de 3x el input para resúmenes
    const ratio = outputWords / inputWords;

    let score: number;
    if (ratio <= 1) {
      score = 1; // Más corto o igual es ideal
    } else if (ratio <= 2) {
      score = 1 - (ratio - 1) * 0.3; // Penalización leve
    } else if (ratio <= 3) {
      score = 0.7 - (ratio - 2) * 0.3; // Penalización moderada
    } else {
      score = Math.max(0, 0.4 - (ratio - 3) * 0.1); // Penalización fuerte
    }

    return {
      score,
      passed: score >= 0.6,
      details: `Output/input ratio: ${ratio.toFixed(2)}x`,
      metadata: { inputWords, outputWords, ratio }
    };
  }
};

// 4. Métrica de Factualidad (requiere fuente de verdad)
const factualityMetric: QualityMetric<FactCheckRequest, string> = {
  name: 'factuality',
  description: 'Verifies claims against known facts',
  threshold: 0.9,
  calculate: (input, output) => {
    const claims = extractClaims(output);
    const knownFacts = input.groundTruth;

    let verifiedCount = 0;
    const issues: string[] = [];

    for (const claim of claims) {
      const verified = knownFacts.some(fact =>
        verifyClaim(claim, fact)
      );

      if (verified) {
        verifiedCount++;
      } else {
        issues.push(`Unverified: "${claim}"`);
      }
    }

    const score = claims.length > 0 ? verifiedCount / claims.length : 1;

    return {
      score,
      passed: score >= 0.9,
      details: issues.length > 0
        ? issues.join('; ')
        : 'All claims verified',
      metadata: {
        totalClaims: claims.length,
        verifiedClaims: verifiedCount
      }
    };
  }
};

// 5. Métrica de Seguridad de Output
const outputSafetyMetric: QualityMetric<any, string> = {
  name: 'output_safety',
  description: 'Checks for harmful or inappropriate content',
  threshold: 1.0,
  calculate: (_, output) => {
    const safetyIssues: string[] = [];

    // Verificar contenido potencialmente peligroso
    const dangerousPatterns = [
      { pattern: /\b(password|secret|api[_-]?key)\s*[:=]\s*\S+/i, issue: 'Potential credential leak' },
      { pattern: /<script\b[^>]*>/i, issue: 'Script injection detected' },
      { pattern: /\b(rm\s+-rf|drop\s+table|delete\s+from)\b/i, issue: 'Dangerous command detected' }
    ];

    for (const { pattern, issue } of dangerousPatterns) {
      if (pattern.test(output)) {
        safetyIssues.push(issue);
      }
    }

    const score = safetyIssues.length === 0 ? 1 : 0;

    return {
      score,
      passed: score === 1,
      details: safetyIssues.length > 0
        ? `Safety issues: ${safetyIssues.join(', ')}`
        : 'No safety issues detected',
      metadata: { issueCount: safetyIssues.length }
    };
  }
};
```

**Uso del evaluador de calidad:**

```typescript
describe('Quality Evaluation', () => {
  let evaluator: QualityEvaluator<string, string>;

  beforeEach(() => {
    evaluator = new QualityEvaluator();
    evaluator.registerMetric(semanticRelevanceMetric);
    evaluator.registerMetric(concisenessMetric);
    evaluator.registerMetric(outputSafetyMetric);
  });

  it('should evaluate summary quality', async () => {
    const input = 'Long article about climate change and its effects...';
    const output = 'Climate change causes rising temperatures and sea levels.';

    const report = await evaluator.evaluate(input, output);

    expect(report.passed).toBe(true);
    expect(report.overallScore).toBeGreaterThan(0.7);
    expect(report.metrics).toHaveLength(3);
  });

  it('should fail on unsafe output', async () => {
    const input = 'Generate a database query';
    const output = 'Here is the query: DROP TABLE users; --';

    const report = await evaluator.evaluate(input, output);

    const safetyMetric = report.metrics.find(m => m.metricName === 'output_safety');
    expect(safetyMetric?.passed).toBe(false);
    expect(report.passed).toBe(false);
  });
});
```

---

### Human Evaluation Workflows

**Las métricas automáticas son útiles pero no reemplazan el juicio humano.** Un workflow de evaluación humana estructurado es esencial para medir calidad real.

```typescript
// Sistema de evaluación humana
interface HumanEvaluationTask {
  id: string;
  input: string;
  output: string;
  context?: Record<string, any>;
  criteria: EvaluationCriterion[];
  assignedTo?: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: Date;
}

interface EvaluationCriterion {
  name: string;
  description: string;
  scale: 'binary' | 'likert5' | 'likert7' | 'numeric';
  weight: number;
}

interface HumanEvaluation {
  taskId: string;
  evaluatorId: string;
  ratings: CriterionRating[];
  comments: string;
  timeSpentMs: number;
  completedAt: Date;
}

interface CriterionRating {
  criterionName: string;
  score: number;
  confidence: number; // 0-1: qué tan seguro está el evaluador
}

class HumanEvaluationManager {
  private tasks: Map<string, HumanEvaluationTask> = new Map();
  private evaluations: HumanEvaluation[] = [];

  // Crear batch de tareas de evaluación
  createEvaluationBatch(
    samples: Array<{ input: string; output: string }>,
    criteria: EvaluationCriterion[]
  ): string[] {
    const taskIds: string[] = [];

    for (const sample of samples) {
      const taskId = generateId();
      this.tasks.set(taskId, {
        id: taskId,
        input: sample.input,
        output: sample.output,
        criteria,
        status: 'pending',
        createdAt: new Date()
      });
      taskIds.push(taskId);
    }

    return taskIds;
  }

  // Asignar tareas a evaluadores (para inter-rater reliability)
  assignWithOverlap(
    taskIds: string[],
    evaluatorIds: string[],
    overlapPercentage: number = 0.2
  ): AssignmentPlan {
    const assignments: Map<string, string[]> = new Map();
    const overlapCount = Math.ceil(taskIds.length * overlapPercentage);

    // Tareas que todos evaluarán (para medir agreement)
    const overlapTasks = taskIds.slice(0, overlapCount);

    // Tareas distribuidas uniformemente
    const uniqueTasks = taskIds.slice(overlapCount);
    const tasksPerEvaluator = Math.ceil(uniqueTasks.length / evaluatorIds.length);

    for (const evaluatorId of evaluatorIds) {
      assignments.set(evaluatorId, [...overlapTasks]);
    }

    for (let i = 0; i < uniqueTasks.length; i++) {
      const evaluatorIndex = i % evaluatorIds.length;
      const evaluatorId = evaluatorIds[evaluatorIndex];
      assignments.get(evaluatorId)!.push(uniqueTasks[i]);
    }

    // Marcar tareas asignadas
    for (const [evaluatorId, tasks] of assignments) {
      for (const taskId of tasks) {
        const task = this.tasks.get(taskId);
        if (task) {
          task.assignedTo = evaluatorId;
        }
      }
    }

    return {
      assignments,
      overlapTasks,
      totalTasks: taskIds.length,
      evaluatorsCount: evaluatorIds.length
    };
  }

  // Registrar evaluación
  submitEvaluation(evaluation: HumanEvaluation): void {
    this.evaluations.push(evaluation);

    const task = this.tasks.get(evaluation.taskId);
    if (task) {
      task.status = 'completed';
    }
  }

  // Calcular Inter-Rater Reliability (Cohen's Kappa para 2 evaluadores)
  calculateInterRaterReliability(criterion: string): IRRResult {
    // Encontrar tareas evaluadas por múltiples evaluadores
    const taskEvaluations = new Map<string, HumanEvaluation[]>();

    for (const evaluation of this.evaluations) {
      const existing = taskEvaluations.get(evaluation.taskId) || [];
      existing.push(evaluation);
      taskEvaluations.set(evaluation.taskId, existing);
    }

    // Filtrar solo tareas con múltiples evaluaciones
    const overlappingTasks = Array.from(taskEvaluations.entries())
      .filter(([_, evals]) => evals.length >= 2);

    if (overlappingTasks.length === 0) {
      return { kappa: null, agreement: null, sampleSize: 0 };
    }

    // Calcular agreement observado
    let agreementCount = 0;
    const ratings: Array<[number, number]> = [];

    for (const [_, evals] of overlappingTasks) {
      const rating1 = evals[0].ratings.find(r => r.criterionName === criterion)?.score;
      const rating2 = evals[1].ratings.find(r => r.criterionName === criterion)?.score;

      if (rating1 !== undefined && rating2 !== undefined) {
        ratings.push([rating1, rating2]);
        if (rating1 === rating2) {
          agreementCount++;
        }
      }
    }

    const observedAgreement = agreementCount / ratings.length;

    // Calcular agreement esperado por azar
    const allRatings = ratings.flat();
    const ratingCounts = new Map<number, number>();
    for (const rating of allRatings) {
      ratingCounts.set(rating, (ratingCounts.get(rating) || 0) + 1);
    }

    let expectedAgreement = 0;
    for (const count of ratingCounts.values()) {
      const proportion = count / allRatings.length;
      expectedAgreement += proportion * proportion;
    }

    // Cohen's Kappa
    const kappa = (observedAgreement - expectedAgreement) / (1 - expectedAgreement);

    return {
      kappa,
      agreement: observedAgreement,
      sampleSize: ratings.length,
      interpretation: this.interpretKappa(kappa)
    };
  }

  private interpretKappa(kappa: number): string {
    if (kappa < 0) return 'Poor (less than chance)';
    if (kappa < 0.20) return 'Slight';
    if (kappa < 0.40) return 'Fair';
    if (kappa < 0.60) return 'Moderate';
    if (kappa < 0.80) return 'Substantial';
    return 'Almost Perfect';
  }

  // Generar reporte agregado
  generateReport(): HumanEvaluationReport {
    const completedTasks = Array.from(this.tasks.values())
      .filter(t => t.status === 'completed');

    // Agregar scores por criterio
    const criteriaScores = new Map<string, number[]>();

    for (const evaluation of this.evaluations) {
      for (const rating of evaluation.ratings) {
        const existing = criteriaScores.get(rating.criterionName) || [];
        existing.push(rating.score);
        criteriaScores.set(rating.criterionName, existing);
      }
    }

    const aggregatedScores: CriterionAggregate[] = [];
    for (const [criterion, scores] of criteriaScores) {
      const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
      const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;

      aggregatedScores.push({
        criterion,
        mean,
        std: Math.sqrt(variance),
        min: Math.min(...scores),
        max: Math.max(...scores),
        count: scores.length
      });
    }

    return {
      totalTasks: this.tasks.size,
      completedTasks: completedTasks.length,
      totalEvaluations: this.evaluations.length,
      criteriaScores: aggregatedScores,
      avgTimePerTask: this.evaluations.reduce((sum, e) => sum + e.timeSpentMs, 0)
        / this.evaluations.length
    };
  }
}

interface AssignmentPlan {
  assignments: Map<string, string[]>;
  overlapTasks: string[];
  totalTasks: number;
  evaluatorsCount: number;
}

interface IRRResult {
  kappa: number | null;
  agreement: number | null;
  sampleSize: number;
  interpretation?: string;
}

interface CriterionAggregate {
  criterion: string;
  mean: number;
  std: number;
  min: number;
  max: number;
  count: number;
}

interface HumanEvaluationReport {
  totalTasks: number;
  completedTasks: number;
  totalEvaluations: number;
  criteriaScores: CriterionAggregate[];
  avgTimePerTask: number;
}
```

**Criterios de evaluación estándar:**

```typescript
// Criterios predefinidos para evaluación de LLMs
const standardCriteria: EvaluationCriterion[] = [
  {
    name: 'relevance',
    description: '¿La respuesta aborda directamente la pregunta/solicitud?',
    scale: 'likert5',
    weight: 1.0
  },
  {
    name: 'accuracy',
    description: '¿La información proporcionada es factualmente correcta?',
    scale: 'likert5',
    weight: 1.0
  },
  {
    name: 'completeness',
    description: '¿La respuesta cubre todos los aspectos importantes?',
    scale: 'likert5',
    weight: 0.8
  },
  {
    name: 'clarity',
    description: '¿La respuesta es clara y fácil de entender?',
    scale: 'likert5',
    weight: 0.7
  },
  {
    name: 'helpfulness',
    description: '¿La respuesta sería útil para el usuario promedio?',
    scale: 'likert5',
    weight: 0.9
  },
  {
    name: 'harmlessness',
    description: '¿La respuesta es segura y apropiada?',
    scale: 'binary',
    weight: 2.0  // Peso alto porque es crítico
  }
];
```

---

### Automated Quality Gates

**Los quality gates automáticos previenen que outputs de baja calidad lleguen a producción.**

```typescript
// Sistema de quality gates para pipelines de IA
interface QualityGate {
  name: string;
  description: string;
  check: (output: any) => Promise<GateResult>;
  severity: 'blocker' | 'critical' | 'warning';
}

interface GateResult {
  passed: boolean;
  message: string;
  details?: Record<string, any>;
}

class QualityGateRunner {
  private gates: QualityGate[] = [];

  registerGate(gate: QualityGate): void {
    this.gates.push(gate);
  }

  async runAll(output: any): Promise<QualityGateReport> {
    const results: GateEvaluation[] = [];

    for (const gate of this.gates) {
      const startTime = Date.now();
      try {
        const result = await gate.check(output);
        results.push({
          gateName: gate.name,
          severity: gate.severity,
          ...result,
          duration: Date.now() - startTime
        });
      } catch (error) {
        results.push({
          gateName: gate.name,
          severity: gate.severity,
          passed: false,
          message: `Gate error: ${error.message}`,
          duration: Date.now() - startTime
        });
      }
    }

    const blockers = results.filter(r => !r.passed && r.severity === 'blocker');
    const criticals = results.filter(r => !r.passed && r.severity === 'critical');
    const warnings = results.filter(r => !r.passed && r.severity === 'warning');

    return {
      passed: blockers.length === 0 && criticals.length === 0,
      results,
      summary: {
        total: results.length,
        passed: results.filter(r => r.passed).length,
        blockers: blockers.length,
        criticals: criticals.length,
        warnings: warnings.length
      }
    };
  }
}

interface GateEvaluation extends GateResult {
  gateName: string;
  severity: 'blocker' | 'critical' | 'warning';
  duration: number;
}

interface QualityGateReport {
  passed: boolean;
  results: GateEvaluation[];
  summary: {
    total: number;
    passed: number;
    blockers: number;
    criticals: number;
    warnings: number;
  };
}

// Gates predefinidos
const qualityGates: QualityGate[] = [
  {
    name: 'minimum_length',
    description: 'Output must have minimum content',
    severity: 'blocker',
    check: async (output: string) => ({
      passed: output.length >= 10,
      message: output.length >= 10
        ? 'Length check passed'
        : `Output too short: ${output.length} chars (min: 10)`,
      details: { length: output.length }
    })
  },
  {
    name: 'no_empty_response',
    description: 'Output cannot be empty or just whitespace',
    severity: 'blocker',
    check: async (output: string) => ({
      passed: output.trim().length > 0,
      message: output.trim().length > 0
        ? 'Non-empty check passed'
        : 'Output is empty or whitespace only'
    })
  },
  {
    name: 'no_error_markers',
    description: 'Output should not contain error indicators',
    severity: 'critical',
    check: async (output: string) => {
      const errorPatterns = [
        /\berror\b.*\boccurred\b/i,
        /\bunable to\b.*\bcomplete\b/i,
        /\bfailed to\b/i,
        /\bI cannot\b/i,
        /\bI don't have\b.*\baccess\b/i
      ];

      const matchedPatterns = errorPatterns.filter(p => p.test(output));

      return {
        passed: matchedPatterns.length === 0,
        message: matchedPatterns.length === 0
          ? 'No error markers found'
          : `Found ${matchedPatterns.length} error patterns`,
        details: { matchedPatterns: matchedPatterns.map(p => p.source) }
      };
    }
  },
  {
    name: 'json_validity',
    description: 'If output should be JSON, it must be valid',
    severity: 'blocker',
    check: async (output: string) => {
      // Solo verificar si parece JSON
      if (!output.trim().startsWith('{') && !output.trim().startsWith('[')) {
        return { passed: true, message: 'Not JSON, skipping validation' };
      }

      try {
        JSON.parse(output);
        return { passed: true, message: 'Valid JSON' };
      } catch (error) {
        return {
          passed: false,
          message: `Invalid JSON: ${error.message}`,
          details: { parseError: error.message }
        };
      }
    }
  },
  {
    name: 'confidence_threshold',
    description: 'Model confidence must meet threshold',
    severity: 'warning',
    check: async (output: { content: string; confidence?: number }) => {
      const confidence = output.confidence ?? 1;
      return {
        passed: confidence >= 0.7,
        message: confidence >= 0.7
          ? `Confidence OK: ${(confidence * 100).toFixed(1)}%`
          : `Low confidence: ${(confidence * 100).toFixed(1)}% (threshold: 70%)`,
        details: { confidence }
      };
    }
  },
  {
    name: 'response_time',
    description: 'Response must be generated within time limit',
    severity: 'warning',
    check: async (output: { content: string; generationTimeMs?: number }) => {
      const timeMs = output.generationTimeMs ?? 0;
      const limitMs = 5000;
      return {
        passed: timeMs <= limitMs,
        message: timeMs <= limitMs
          ? `Response time OK: ${timeMs}ms`
          : `Slow response: ${timeMs}ms (limit: ${limitMs}ms)`,
        details: { timeMs, limitMs }
      };
    }
  }
];
```

**Integración con CI/CD:**

```typescript
// Runner de quality gates para CI/CD
async function runQualityGatesInCI(
  outputs: any[],
  gates: QualityGate[]
): Promise<CIResult> {
  const runner = new QualityGateRunner();
  gates.forEach(gate => runner.registerGate(gate));

  const reports: QualityGateReport[] = [];

  for (const output of outputs) {
    const report = await runner.runAll(output);
    reports.push(report);
  }

  const allPassed = reports.every(r => r.passed);
  const totalBlockers = reports.reduce((sum, r) => sum + r.summary.blockers, 0);
  const totalCriticals = reports.reduce((sum, r) => sum + r.summary.criticals, 0);

  // Formatear output para CI
  if (!allPassed) {
    console.error('❌ Quality Gates Failed!');
    console.error(`   Blockers: ${totalBlockers}`);
    console.error(`   Criticals: ${totalCriticals}`);

    for (let i = 0; i < reports.length; i++) {
      if (!reports[i].passed) {
        console.error(`\nSample ${i + 1}:`);
        for (const result of reports[i].results) {
          if (!result.passed) {
            console.error(`   [${result.severity}] ${result.gateName}: ${result.message}`);
          }
        }
      }
    }
  } else {
    console.log('✅ All Quality Gates Passed!');
  }

  return {
    success: allPassed,
    exitCode: allPassed ? 0 : 1,
    reports
  };
}

interface CIResult {
  success: boolean;
  exitCode: number;
  reports: QualityGateReport[];
}
```

**Cuándo usar quality gates:**
- ✅ Validación pre-producción de outputs
- ✅ CI/CD pipelines para cambios de prompts
- ✅ Monitoreo de calidad en producción
- ✅ A/B testing de diferentes modelos/prompts

**Tradeoffs:**
- **Pros**: Previene problemas antes de que lleguen a usuarios
- **Cons**: Puede rechazar outputs aceptables (falsos positivos)

---

## 🔒 Security Testing

> **📝 Próximamente:** Prompt injection testing, output validation testing, tool execution safety, y adversarial input testing.

---

## ⚡ Performance Testing

> **📝 Próximamente:** Latency measurement, throughput testing, cost optimization, y scaling validation.

---

## 🎲 Determinismo vs No-determinismo

El no-determinismo es inherente a los LLMs: la misma entrada puede producir diferentes salidas. Esto requiere estrategias de testing fundamentalmente diferentes a las del software tradicional.

### Entendiendo el No-determinismo en LLMs

**¿Por qué los LLMs son no-determinísticos?**

```typescript
// Factores que contribuyen al no-determinismo
interface NonDeterminismFactors {
  // 1. Temperature: controla aleatoriedad en sampling
  temperature: number; // 0 = más determinístico, 1+ = más aleatorio

  // 2. Top-p (nucleus sampling): probabilidad acumulada
  topP: number; // 0.1 = más determinístico, 1.0 = considera todos los tokens

  // 3. Top-k: limita tokens candidatos
  topK: number; // 1 = más determinístico, infinito = considera todos

  // 4. Random seed: si el modelo lo soporta
  seed?: number; // Mismo seed = misma salida (cuando está disponible)

  // 5. Batch processing: orden puede afectar resultados
  batchSize: number;
}

// Configuración para máximo determinismo
const deterministicConfig: NonDeterminismFactors = {
  temperature: 0,
  topP: 1,
  topK: 1,
  seed: 42,
  batchSize: 1
};

// Configuración para creatividad
const creativeConfig: NonDeterminismFactors = {
  temperature: 0.8,
  topP: 0.95,
  topK: 50,
  batchSize: 1
};
```

**Implicaciones para testing:**

```typescript
// Problema: el mismo test puede pasar o fallar aleatoriamente
describe('Non-deterministic LLM behavior', () => {
  it('FLAKY: might pass or fail randomly', async () => {
    const response = await llm.generate('Write a haiku about testing');

    // Esta aserción puede fallar porque el output varía
    expect(response).toContain('code');  // ❌ Flaky test
  });

  it('BETTER: test properties instead of exact values', async () => {
    const response = await llm.generate('Write a haiku about testing');

    // Verificar propiedades estructurales
    const lines = response.split('\n').filter(l => l.trim());
    expect(lines.length).toBe(3);  // ✅ Haiku tiene 3 líneas
  });
});
```

---

### Estrategias para Resultados Consistentes

#### 1. Fijar Parámetros de Generación

**Usar temperature=0 y seeds fijos cuando sea posible.**

```typescript
class DeterministicLLMClient {
  private baseClient: LLMClient;
  private defaultConfig: GenerationConfig;

  constructor(baseClient: LLMClient) {
    this.baseClient = baseClient;
    this.defaultConfig = {
      temperature: 0,
      topP: 1,
      topK: 1,
      maxTokens: 1000
    };
  }

  async generate(prompt: string, config?: Partial<GenerationConfig>): Promise<string> {
    const finalConfig = { ...this.defaultConfig, ...config };

    // Agregar seed si el proveedor lo soporta
    if (this.supportsSeeding()) {
      finalConfig.seed = this.generateDeterministicSeed(prompt);
    }

    return this.baseClient.generate(prompt, finalConfig);
  }

  private generateDeterministicSeed(prompt: string): number {
    // Generar seed basado en hash del prompt para reproducibilidad
    let hash = 0;
    for (let i = 0; i < prompt.length; i++) {
      const char = prompt.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convertir a 32-bit integer
    }
    return Math.abs(hash);
  }

  private supportsSeeding(): boolean {
    // Verificar si el modelo soporta seeding
    return ['anthropic', 'openai-gpt4'].includes(this.baseClient.provider);
  }
}
```

#### 2. Caching de Respuestas

**Cachear respuestas para garantizar consistencia en tests repetidos.**

```typescript
class CachedLLMClient {
  private client: LLMClient;
  private cache: Map<string, CachedResponse> = new Map();
  private cacheFile: string;

  constructor(client: LLMClient, cacheFile: string = '.llm-cache.json') {
    this.client = client;
    this.cacheFile = cacheFile;
    this.loadCache();
  }

  async generate(prompt: string, options?: GenerationOptions): Promise<string> {
    const cacheKey = this.createCacheKey(prompt, options);

    // Verificar cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (!this.isExpired(cached)) {
        return cached.response;
      }
    }

    // Generar nueva respuesta
    const response = await this.client.generate(prompt, options);

    // Guardar en cache
    this.cache.set(cacheKey, {
      response,
      timestamp: Date.now(),
      prompt,
      options
    });
    this.saveCache();

    return response;
  }

  private createCacheKey(prompt: string, options?: GenerationOptions): string {
    const normalized = {
      prompt: prompt.trim().toLowerCase(),
      options: options || {}
    };
    return Buffer.from(JSON.stringify(normalized)).toString('base64');
  }

  private isExpired(cached: CachedResponse, maxAgeMs: number = 86400000): boolean {
    return Date.now() - cached.timestamp > maxAgeMs;
  }

  private loadCache(): void {
    try {
      const data = fs.readFileSync(this.cacheFile, 'utf-8');
      const parsed = JSON.parse(data);
      this.cache = new Map(Object.entries(parsed));
    } catch {
      this.cache = new Map();
    }
  }

  private saveCache(): void {
    const data = Object.fromEntries(this.cache);
    fs.writeFileSync(this.cacheFile, JSON.stringify(data, null, 2));
  }

  // Para tests: forzar uso de cache
  setCacheOnly(enabled: boolean): void {
    if (enabled) {
      this.client.generate = async () => {
        throw new Error('Cache-only mode: no live LLM calls allowed');
      };
    }
  }
}

interface CachedResponse {
  response: string;
  timestamp: number;
  prompt: string;
  options?: GenerationOptions;
}
```

#### 3. Golden Sets y Regression Testing

**Mantener un conjunto de respuestas "golden" para detectar regresiones.**

```typescript
interface GoldenTestCase {
  id: string;
  prompt: string;
  expectedOutput: string;
  acceptableVariations?: string[];
  validationRules: ValidationRule[];
}

interface ValidationRule {
  type: 'contains' | 'regex' | 'semantic_similarity' | 'structure';
  value: any;
  threshold?: number;
}

class GoldenSetManager {
  private goldenSets: Map<string, GoldenTestCase[]> = new Map();

  loadGoldenSet(name: string, path: string): void {
    const data = JSON.parse(fs.readFileSync(path, 'utf-8'));
    this.goldenSets.set(name, data.testCases);
  }

  async runGoldenTests(
    setName: string,
    llmClient: LLMClient
  ): Promise<GoldenTestReport> {
    const testCases = this.goldenSets.get(setName);
    if (!testCases) {
      throw new Error(`Golden set "${setName}" not found`);
    }

    const results: GoldenTestResult[] = [];

    for (const testCase of testCases) {
      const actualOutput = await llmClient.generate(testCase.prompt);
      const validationResult = this.validateOutput(testCase, actualOutput);

      results.push({
        testCaseId: testCase.id,
        prompt: testCase.prompt,
        expectedOutput: testCase.expectedOutput,
        actualOutput,
        passed: validationResult.passed,
        validationDetails: validationResult.details
      });
    }

    return {
      setName,
      totalTests: testCases.length,
      passed: results.filter(r => r.passed).length,
      failed: results.filter(r => !r.passed).length,
      results,
      timestamp: new Date().toISOString()
    };
  }

  private validateOutput(
    testCase: GoldenTestCase,
    actualOutput: string
  ): { passed: boolean; details: string[] } {
    const details: string[] = [];
    let allPassed = true;

    for (const rule of testCase.validationRules) {
      const result = this.applyRule(rule, actualOutput, testCase.expectedOutput);
      details.push(`${rule.type}: ${result.message}`);
      if (!result.passed) {
        allPassed = false;
      }
    }

    return { passed: allPassed, details };
  }

  private applyRule(
    rule: ValidationRule,
    actual: string,
    expected: string
  ): { passed: boolean; message: string } {
    switch (rule.type) {
      case 'contains':
        const contains = actual.toLowerCase().includes(rule.value.toLowerCase());
        return {
          passed: contains,
          message: contains
            ? `Contains "${rule.value}"`
            : `Missing "${rule.value}"`
        };

      case 'regex':
        const regex = new RegExp(rule.value);
        const matches = regex.test(actual);
        return {
          passed: matches,
          message: matches
            ? `Matches pattern ${rule.value}`
            : `Does not match pattern ${rule.value}`
        };

      case 'semantic_similarity':
        const similarity = this.calculateSimilarity(actual, expected);
        const threshold = rule.threshold || 0.8;
        return {
          passed: similarity >= threshold,
          message: `Similarity: ${(similarity * 100).toFixed(1)}% (threshold: ${threshold * 100}%)`
        };

      case 'structure':
        const structureValid = this.validateStructure(actual, rule.value);
        return {
          passed: structureValid,
          message: structureValid
            ? 'Structure valid'
            : 'Structure mismatch'
        };

      default:
        return { passed: false, message: `Unknown rule type: ${rule.type}` };
    }
  }

  private calculateSimilarity(a: string, b: string): number {
    // Implementación simplificada - en producción usar embeddings
    const wordsA = new Set(a.toLowerCase().split(/\s+/));
    const wordsB = new Set(b.toLowerCase().split(/\s+/));
    const intersection = new Set([...wordsA].filter(x => wordsB.has(x)));
    const union = new Set([...wordsA, ...wordsB]);
    return intersection.size / union.size; // Jaccard similarity
  }

  private validateStructure(output: string, expectedStructure: any): boolean {
    // Validar estructura JSON, número de secciones, etc.
    try {
      if (expectedStructure.type === 'json') {
        JSON.parse(output);
        return true;
      }
      if (expectedStructure.type === 'sections') {
        const sections = output.split(/^##\s/m).length - 1;
        return sections >= expectedStructure.minSections;
      }
      return true;
    } catch {
      return false;
    }
  }

  // Actualizar golden set con nuevas respuestas aprobadas
  updateGoldenSet(
    setName: string,
    testCaseId: string,
    newExpectedOutput: string
  ): void {
    const testCases = this.goldenSets.get(setName);
    if (!testCases) return;

    const testCase = testCases.find(tc => tc.id === testCaseId);
    if (testCase) {
      testCase.expectedOutput = newExpectedOutput;
    }
  }
}

interface GoldenTestResult {
  testCaseId: string;
  prompt: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  validationDetails: string[];
}

interface GoldenTestReport {
  setName: string;
  totalTests: number;
  passed: number;
  failed: number;
  results: GoldenTestResult[];
  timestamp: string;
}
```

---

### Statistical Testing Approaches

**Cuando el determinismo perfecto no es posible, usar métodos estadísticos para validar comportamiento.**

#### Múltiples Ejecuciones con Análisis Estadístico

```typescript
class StatisticalTestRunner {
  private llmClient: LLMClient;
  private defaultSampleSize: number = 30;

  constructor(llmClient: LLMClient) {
    this.llmClient = llmClient;
  }

  // Ejecutar múltiples veces y analizar distribución
  async runStatisticalTest(
    prompt: string,
    evaluator: (output: string) => number, // Función que puntúa el output 0-1
    options: StatisticalTestOptions = {}
  ): Promise<StatisticalTestResult> {
    const sampleSize = options.sampleSize || this.defaultSampleSize;
    const scores: number[] = [];
    const outputs: string[] = [];

    for (let i = 0; i < sampleSize; i++) {
      const output = await this.llmClient.generate(prompt, {
        temperature: options.temperature || 0.7
      });
      outputs.push(output);
      scores.push(evaluator(output));
    }

    // Calcular estadísticas
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;
    const std = Math.sqrt(variance);

    // Calcular intervalo de confianza
    const confidenceLevel = options.confidenceLevel || 0.95;
    const zScore = this.getZScore(confidenceLevel);
    const marginOfError = zScore * (std / Math.sqrt(sampleSize));

    const confidenceInterval: [number, number] = [
      mean - marginOfError,
      mean + marginOfError
    ];

    // Test de hipótesis: ¿el score medio es >= threshold?
    const threshold = options.threshold || 0.7;
    const tStatistic = (mean - threshold) / (std / Math.sqrt(sampleSize));
    const pValue = this.calculatePValue(tStatistic, sampleSize - 1);

    return {
      sampleSize,
      mean,
      std,
      variance,
      min: Math.min(...scores),
      max: Math.max(...scores),
      confidenceInterval,
      confidenceLevel,
      threshold,
      passesThreshold: mean >= threshold,
      pValue,
      isStatisticallySignificant: pValue < 0.05,
      scores,
      outputs
    };
  }

  // Test de comparación A/B entre dos prompts
  async comparePrompts(
    promptA: string,
    promptB: string,
    evaluator: (output: string) => number,
    sampleSize: number = 30
  ): Promise<ABTestResult> {
    const resultsA = await this.runStatisticalTest(promptA, evaluator, { sampleSize });
    const resultsB = await this.runStatisticalTest(promptB, evaluator, { sampleSize });

    // Welch's t-test para comparar medias
    const pooledVariance =
      (resultsA.variance / sampleSize) + (resultsB.variance / sampleSize);
    const tStatistic = (resultsA.mean - resultsB.mean) / Math.sqrt(pooledVariance);

    // Grados de libertad aproximados (Welch-Satterthwaite)
    const df = Math.pow(pooledVariance, 2) / (
      Math.pow(resultsA.variance / sampleSize, 2) / (sampleSize - 1) +
      Math.pow(resultsB.variance / sampleSize, 2) / (sampleSize - 1)
    );

    const pValue = this.calculatePValue(tStatistic, df);

    // Effect size (Cohen's d)
    const pooledStd = Math.sqrt(
      ((sampleSize - 1) * resultsA.variance + (sampleSize - 1) * resultsB.variance) /
      (2 * sampleSize - 2)
    );
    const cohensD = (resultsA.mean - resultsB.mean) / pooledStd;

    return {
      promptA: {
        prompt: promptA,
        ...resultsA
      },
      promptB: {
        prompt: promptB,
        ...resultsB
      },
      comparison: {
        meanDifference: resultsA.mean - resultsB.mean,
        tStatistic,
        pValue,
        isSignificant: pValue < 0.05,
        effectSize: cohensD,
        effectSizeInterpretation: this.interpretEffectSize(cohensD),
        winner: resultsA.mean > resultsB.mean ? 'A' : 'B',
        recommendation: this.generateRecommendation(resultsA, resultsB, pValue, cohensD)
      }
    };
  }

  private getZScore(confidenceLevel: number): number {
    // Z-scores comunes
    const zScores: Record<number, number> = {
      0.90: 1.645,
      0.95: 1.96,
      0.99: 2.576
    };
    return zScores[confidenceLevel] || 1.96;
  }

  private calculatePValue(tStatistic: number, df: number): number {
    // Aproximación simplificada - en producción usar librería estadística
    const x = df / (df + tStatistic * tStatistic);
    return this.incompleteBeta(df / 2, 0.5, x);
  }

  private incompleteBeta(a: number, b: number, x: number): number {
    // Aproximación numérica simplificada
    // En producción, usar jstat o similar
    if (x < 0 || x > 1) return 0;
    if (x === 0) return 0;
    if (x === 1) return 1;

    // Serie de aproximación
    let result = 0;
    for (let n = 0; n < 100; n++) {
      const term = Math.pow(x, n) / (a + n);
      result += term;
      if (Math.abs(term) < 1e-10) break;
    }
    return result * Math.pow(x, a) / a;
  }

  private interpretEffectSize(d: number): string {
    const absD = Math.abs(d);
    if (absD < 0.2) return 'negligible';
    if (absD < 0.5) return 'small';
    if (absD < 0.8) return 'medium';
    return 'large';
  }

  private generateRecommendation(
    resultsA: StatisticalTestResult,
    resultsB: StatisticalTestResult,
    pValue: number,
    effectSize: number
  ): string {
    if (pValue >= 0.05) {
      return 'No significant difference detected. Both prompts perform similarly.';
    }

    const better = resultsA.mean > resultsB.mean ? 'A' : 'B';
    const worse = better === 'A' ? 'B' : 'A';
    const improvement = Math.abs(resultsA.mean - resultsB.mean) * 100;

    if (Math.abs(effectSize) < 0.2) {
      return `Prompt ${better} is statistically better but the effect is negligible (${improvement.toFixed(1)}% improvement).`;
    }

    if (Math.abs(effectSize) < 0.5) {
      return `Prompt ${better} shows small but significant improvement (${improvement.toFixed(1)}%). Consider adopting it.`;
    }

    return `Strong recommendation: Use Prompt ${better}. It shows ${improvement.toFixed(1)}% improvement with ${this.interpretEffectSize(effectSize)} effect size.`;
  }
}

interface StatisticalTestOptions {
  sampleSize?: number;
  temperature?: number;
  confidenceLevel?: number;
  threshold?: number;
}

interface StatisticalTestResult {
  sampleSize: number;
  mean: number;
  std: number;
  variance: number;
  min: number;
  max: number;
  confidenceInterval: [number, number];
  confidenceLevel: number;
  threshold: number;
  passesThreshold: boolean;
  pValue: number;
  isStatisticallySignificant: boolean;
  scores: number[];
  outputs: string[];
}

interface ABTestResult {
  promptA: StatisticalTestResult & { prompt: string };
  promptB: StatisticalTestResult & { prompt: string };
  comparison: {
    meanDifference: number;
    tStatistic: number;
    pValue: number;
    isSignificant: boolean;
    effectSize: number;
    effectSizeInterpretation: string;
    winner: 'A' | 'B';
    recommendation: string;
  };
}
```

**Ejemplo de uso en tests:**

```typescript
import { describe, it, expect } from 'vitest';

describe('Statistical LLM Testing', () => {
  let runner: StatisticalTestRunner;

  beforeAll(() => {
    runner = new StatisticalTestRunner(llmClient);
  });

  it('should maintain quality threshold across multiple runs', async () => {
    const result = await runner.runStatisticalTest(
      'Summarize the benefits of test-driven development',
      (output) => {
        // Evaluador: verificar que menciona puntos clave
        const keyPoints = ['quality', 'design', 'confidence', 'documentation'];
        const mentioned = keyPoints.filter(kp =>
          output.toLowerCase().includes(kp)
        ).length;
        return mentioned / keyPoints.length;
      },
      {
        sampleSize: 30,
        threshold: 0.6,
        confidenceLevel: 0.95
      }
    );

    expect(result.passesThreshold).toBe(true);
    expect(result.isStatisticallySignificant).toBe(true);
    expect(result.confidenceInterval[0]).toBeGreaterThan(0.5);
  }, 120000); // Timeout largo para múltiples llamadas

  it('should detect better prompt through A/B testing', async () => {
    const promptA = 'Summarize TDD in one paragraph.';
    const promptB = 'As a senior developer, explain test-driven development concisely.';

    const result = await runner.comparePrompts(
      promptA,
      promptB,
      (output) => {
        // Evaluar calidad basada en longitud y contenido
        const hasStructure = output.includes('.') && output.length > 100;
        const mentionsCycle = output.toLowerCase().includes('red') ||
                             output.toLowerCase().includes('green') ||
                             output.toLowerCase().includes('refactor');
        return (hasStructure ? 0.5 : 0) + (mentionsCycle ? 0.5 : 0);
      },
      20
    );

    console.log('A/B Test Results:');
    console.log(`  Prompt A mean: ${result.promptA.mean.toFixed(3)}`);
    console.log(`  Prompt B mean: ${result.promptB.mean.toFixed(3)}`);
    console.log(`  p-value: ${result.comparison.pValue.toFixed(4)}`);
    console.log(`  Effect size: ${result.comparison.effectSize.toFixed(3)} (${result.comparison.effectSizeInterpretation})`);
    console.log(`  Recommendation: ${result.comparison.recommendation}`);

    // No hacer assertions sobre cuál es mejor, solo que el test se completó
    expect(result.comparison.pValue).toBeLessThanOrEqual(1);
  }, 180000);
});
```

---

### Intervalos de Confianza en Testing de IA

**Los intervalos de confianza cuantifican la incertidumbre en las métricas de calidad.**

```typescript
class ConfidenceIntervalCalculator {
  // Calcular intervalo de confianza para proporción (ej: tasa de éxito)
  calculateProportionCI(
    successes: number,
    total: number,
    confidenceLevel: number = 0.95
  ): ConfidenceInterval {
    const proportion = successes / total;
    const z = this.getZScore(confidenceLevel);

    // Wilson score interval (mejor para proporciones pequeñas)
    const denominator = 1 + z * z / total;
    const center = (proportion + z * z / (2 * total)) / denominator;
    const spread = (z / denominator) * Math.sqrt(
      (proportion * (1 - proportion) / total) + (z * z / (4 * total * total))
    );

    return {
      point: proportion,
      lower: Math.max(0, center - spread),
      upper: Math.min(1, center + spread),
      confidenceLevel,
      method: 'wilson'
    };
  }

  // Calcular intervalo de confianza para media
  calculateMeanCI(
    values: number[],
    confidenceLevel: number = 0.95
  ): ConfidenceInterval {
    const n = values.length;
    const mean = values.reduce((a, b) => a + b, 0) / n;
    const std = Math.sqrt(
      values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / (n - 1)
    );

    const t = this.getTScore(n - 1, confidenceLevel);
    const marginOfError = t * (std / Math.sqrt(n));

    return {
      point: mean,
      lower: mean - marginOfError,
      upper: mean + marginOfError,
      confidenceLevel,
      method: 't-distribution'
    };
  }

  // Bootstrap confidence interval (más robusto)
  calculateBootstrapCI(
    values: number[],
    statistic: (sample: number[]) => number,
    confidenceLevel: number = 0.95,
    iterations: number = 1000
  ): ConfidenceInterval {
    const bootstrapStatistics: number[] = [];

    for (let i = 0; i < iterations; i++) {
      // Resample con reemplazo
      const sample = Array(values.length)
        .fill(0)
        .map(() => values[Math.floor(Math.random() * values.length)]);

      bootstrapStatistics.push(statistic(sample));
    }

    // Ordenar para obtener percentiles
    bootstrapStatistics.sort((a, b) => a - b);

    const alpha = 1 - confidenceLevel;
    const lowerIndex = Math.floor((alpha / 2) * iterations);
    const upperIndex = Math.floor((1 - alpha / 2) * iterations);

    return {
      point: statistic(values),
      lower: bootstrapStatistics[lowerIndex],
      upper: bootstrapStatistics[upperIndex],
      confidenceLevel,
      method: 'bootstrap'
    };
  }

  private getZScore(confidenceLevel: number): number {
    const zScores: Record<number, number> = {
      0.90: 1.645,
      0.95: 1.96,
      0.99: 2.576
    };
    return zScores[confidenceLevel] || 1.96;
  }

  private getTScore(df: number, confidenceLevel: number): number {
    // Valores aproximados para t-distribution
    // En producción, usar tabla completa o librería
    if (df >= 120) return this.getZScore(confidenceLevel);
    if (df >= 60) return this.getZScore(confidenceLevel) * 1.01;
    if (df >= 30) return this.getZScore(confidenceLevel) * 1.04;
    if (df >= 10) return this.getZScore(confidenceLevel) * 1.1;
    return this.getZScore(confidenceLevel) * 1.2;
  }
}

interface ConfidenceInterval {
  point: number;
  lower: number;
  upper: number;
  confidenceLevel: number;
  method: string;
}

// Uso práctico en tests
describe('Confidence Interval Testing', () => {
  const calculator = new ConfidenceIntervalCalculator();

  it('should verify success rate with confidence interval', async () => {
    const results: boolean[] = [];

    // Ejecutar 50 veces
    for (let i = 0; i < 50; i++) {
      const output = await llm.generate('Generate a valid JSON object');
      try {
        JSON.parse(output);
        results.push(true);
      } catch {
        results.push(false);
      }
    }

    const successes = results.filter(r => r).length;
    const ci = calculator.calculateProportionCI(successes, results.length, 0.95);

    console.log(`Success rate: ${(ci.point * 100).toFixed(1)}%`);
    console.log(`95% CI: [${(ci.lower * 100).toFixed(1)}%, ${(ci.upper * 100).toFixed(1)}%]`);

    // Verificar que el límite inferior del CI está por encima del umbral aceptable
    expect(ci.lower).toBeGreaterThan(0.8); // Al menos 80% de éxito con 95% confianza
  });

  it('should compare models using confidence intervals', async () => {
    const scoresModelA: number[] = [];
    const scoresModelB: number[] = [];

    // Evaluar ambos modelos
    for (let i = 0; i < 30; i++) {
      const prompt = `Summarize: ${testCases[i]}`;

      const outputA = await modelA.generate(prompt);
      const outputB = await modelB.generate(prompt);

      scoresModelA.push(evaluateQuality(outputA));
      scoresModelB.push(evaluateQuality(outputB));
    }

    const ciA = calculator.calculateMeanCI(scoresModelA);
    const ciB = calculator.calculateMeanCI(scoresModelB);

    console.log(`Model A: ${ciA.point.toFixed(3)} [${ciA.lower.toFixed(3)}, ${ciA.upper.toFixed(3)}]`);
    console.log(`Model B: ${ciB.point.toFixed(3)} [${ciB.lower.toFixed(3)}, ${ciB.upper.toFixed(3)}]`);

    // Si los CIs no se superponen, la diferencia es significativa
    const noOverlap = ciA.lower > ciB.upper || ciB.lower > ciA.upper;
    if (noOverlap) {
      console.log('Significant difference detected!');
    }
  });
});
```

---

### A/B Testing Framework para LLMs

**Framework completo para comparar prompts, modelos, o configuraciones.**

```typescript
interface ABTestConfig {
  name: string;
  description: string;
  variants: {
    name: string;
    promptTemplate: string;
    modelConfig?: Partial<GenerationConfig>;
  }[];
  testCases: TestCase[];
  evaluators: Evaluator[];
  sampleSizePerVariant: number;
  trafficSplit?: number[]; // Distribución de tráfico entre variantes
}

interface TestCase {
  id: string;
  input: Record<string, any>;
  expectedProperties?: Record<string, any>;
}

interface Evaluator {
  name: string;
  evaluate: (output: string, testCase: TestCase) => number;
  weight: number;
}

class ABTestingFramework {
  private results: Map<string, ABTestExecution> = new Map();

  async runABTest(config: ABTestConfig): Promise<ABTestExecution> {
    const execution: ABTestExecution = {
      id: generateId(),
      config,
      startTime: new Date(),
      variantResults: new Map(),
      status: 'running'
    };

    this.results.set(execution.id, execution);

    try {
      // Ejecutar cada variante
      for (const variant of config.variants) {
        const variantResult = await this.runVariant(
          variant,
          config.testCases,
          config.evaluators,
          config.sampleSizePerVariant
        );
        execution.variantResults.set(variant.name, variantResult);
      }

      // Analizar resultados
      execution.analysis = this.analyzeResults(execution);
      execution.status = 'completed';
      execution.endTime = new Date();

    } catch (error) {
      execution.status = 'failed';
      execution.error = error.message;
    }

    return execution;
  }

  private async runVariant(
    variant: ABTestConfig['variants'][0],
    testCases: TestCase[],
    evaluators: Evaluator[],
    samplesPerCase: number
  ): Promise<VariantResult> {
    const caseResults: CaseResult[] = [];

    for (const testCase of testCases) {
      const scores: EvaluatorScore[] = [];

      for (let i = 0; i < samplesPerCase; i++) {
        // Renderizar prompt con variables del test case
        const prompt = this.renderPrompt(variant.promptTemplate, testCase.input);

        // Generar output
        const output = await this.generateOutput(prompt, variant.modelConfig);

        // Evaluar con cada evaluador
        for (const evaluator of evaluators) {
          const score = evaluator.evaluate(output, testCase);
          scores.push({
            evaluatorName: evaluator.name,
            score,
            sampleIndex: i
          });
        }
      }

      caseResults.push({
        testCaseId: testCase.id,
        scores,
        avgScore: scores.reduce((sum, s) => sum + s.score, 0) / scores.length
      });
    }

    // Calcular estadísticas agregadas
    const allScores = caseResults.flatMap(cr => cr.scores.map(s => s.score));

    return {
      variantName: variant.name,
      caseResults,
      aggregateStats: {
        mean: this.mean(allScores),
        std: this.std(allScores),
        median: this.median(allScores),
        min: Math.min(...allScores),
        max: Math.max(...allScores),
        totalSamples: allScores.length
      }
    };
  }

  private analyzeResults(execution: ABTestExecution): ABTestAnalysis {
    const variants = Array.from(execution.variantResults.entries());

    if (variants.length < 2) {
      return { conclusion: 'Need at least 2 variants for comparison' };
    }

    // Comparar cada par de variantes
    const comparisons: VariantComparison[] = [];

    for (let i = 0; i < variants.length; i++) {
      for (let j = i + 1; j < variants.length; j++) {
        const [nameA, resultA] = variants[i];
        const [nameB, resultB] = variants[j];

        const scoresA = resultA.caseResults.flatMap(cr => cr.scores.map(s => s.score));
        const scoresB = resultB.caseResults.flatMap(cr => cr.scores.map(s => s.score));

        // Test estadístico
        const { tStatistic, pValue, significant } = this.tTest(scoresA, scoresB);

        // Effect size
        const effectSize = this.cohenD(scoresA, scoresB);

        comparisons.push({
          variantA: nameA,
          variantB: nameB,
          meanA: resultA.aggregateStats.mean,
          meanB: resultB.aggregateStats.mean,
          difference: resultA.aggregateStats.mean - resultB.aggregateStats.mean,
          tStatistic,
          pValue,
          isSignificant: significant,
          effectSize,
          effectInterpretation: this.interpretEffectSize(effectSize),
          winner: resultA.aggregateStats.mean > resultB.aggregateStats.mean ? nameA : nameB
        });
      }
    }

    // Encontrar ganador global
    const rankings = variants
      .map(([name, result]) => ({
        name,
        mean: result.aggregateStats.mean,
        std: result.aggregateStats.std
      }))
      .sort((a, b) => b.mean - a.mean);

    return {
      comparisons,
      rankings,
      winner: rankings[0].name,
      conclusion: this.generateConclusion(comparisons, rankings)
    };
  }

  private tTest(a: number[], b: number[]): { tStatistic: number; pValue: number; significant: boolean } {
    const meanA = this.mean(a);
    const meanB = this.mean(b);
    const varA = this.variance(a);
    const varB = this.variance(b);

    const pooledVariance = (varA / a.length) + (varB / b.length);
    const tStatistic = (meanA - meanB) / Math.sqrt(pooledVariance);

    // Aproximación de p-value
    const df = a.length + b.length - 2;
    const pValue = Math.min(1, Math.exp(-0.5 * tStatistic * tStatistic)); // Simplificado

    return {
      tStatistic,
      pValue,
      significant: pValue < 0.05
    };
  }

  private cohenD(a: number[], b: number[]): number {
    const pooledStd = Math.sqrt(
      ((a.length - 1) * this.variance(a) + (b.length - 1) * this.variance(b)) /
      (a.length + b.length - 2)
    );
    return (this.mean(a) - this.mean(b)) / pooledStd;
  }

  private interpretEffectSize(d: number): string {
    const absD = Math.abs(d);
    if (absD < 0.2) return 'negligible';
    if (absD < 0.5) return 'small';
    if (absD < 0.8) return 'medium';
    return 'large';
  }

  private generateConclusion(
    comparisons: VariantComparison[],
    rankings: { name: string; mean: number }[]
  ): string {
    const significantComparisons = comparisons.filter(c => c.isSignificant);

    if (significantComparisons.length === 0) {
      return 'No significant differences found between variants. Consider running with more samples.';
    }

    const winner = rankings[0];
    const runnerUp = rankings[1];
    const improvement = ((winner.mean - runnerUp.mean) / runnerUp.mean * 100).toFixed(1);

    return `"${winner.name}" is the recommended variant with ${improvement}% improvement over "${runnerUp.name}".`;
  }

  private renderPrompt(template: string, variables: Record<string, any>): string {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), String(value));
    }
    return result;
  }

  private async generateOutput(prompt: string, config?: Partial<GenerationConfig>): Promise<string> {
    // Implementación dependiente del cliente LLM
    return await llmClient.generate(prompt, config);
  }

  // Utilidades estadísticas
  private mean(values: number[]): number {
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  private variance(values: number[]): number {
    const m = this.mean(values);
    return values.reduce((sum, v) => sum + Math.pow(v - m, 2), 0) / (values.length - 1);
  }

  private std(values: number[]): number {
    return Math.sqrt(this.variance(values));
  }

  private median(values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }
}

interface ABTestExecution {
  id: string;
  config: ABTestConfig;
  startTime: Date;
  endTime?: Date;
  status: 'running' | 'completed' | 'failed';
  variantResults: Map<string, VariantResult>;
  analysis?: ABTestAnalysis;
  error?: string;
}

interface VariantResult {
  variantName: string;
  caseResults: CaseResult[];
  aggregateStats: {
    mean: number;
    std: number;
    median: number;
    min: number;
    max: number;
    totalSamples: number;
  };
}

interface CaseResult {
  testCaseId: string;
  scores: EvaluatorScore[];
  avgScore: number;
}

interface EvaluatorScore {
  evaluatorName: string;
  score: number;
  sampleIndex: number;
}

interface VariantComparison {
  variantA: string;
  variantB: string;
  meanA: number;
  meanB: number;
  difference: number;
  tStatistic: number;
  pValue: number;
  isSignificant: boolean;
  effectSize: number;
  effectInterpretation: string;
  winner: string;
}

interface ABTestAnalysis {
  comparisons?: VariantComparison[];
  rankings?: { name: string; mean: number; std: number }[];
  winner?: string;
  conclusion: string;
}
```

**Ejemplo de configuración de A/B test:**

```typescript
const abTestConfig: ABTestConfig = {
  name: 'Summarization Prompt Optimization',
  description: 'Compare different summarization prompt styles',
  variants: [
    {
      name: 'baseline',
      promptTemplate: 'Summarize the following text:\n\n{{text}}'
    },
    {
      name: 'structured',
      promptTemplate: `Summarize the following text in 2-3 sentences.
Focus on the main points and key takeaways.

Text: {{text}}

Summary:`
    },
    {
      name: 'persona',
      promptTemplate: `You are a professional editor skilled at creating concise summaries.
Summarize this text, capturing the essence in 50 words or less:

{{text}}`
    }
  ],
  testCases: [
    {
      id: 'case1',
      input: { text: 'Long article about machine learning...' },
      expectedProperties: { maxLength: 100 }
    },
    {
      id: 'case2',
      input: { text: 'Technical documentation about APIs...' },
      expectedProperties: { maxLength: 100 }
    }
  ],
  evaluators: [
    {
      name: 'conciseness',
      evaluate: (output, testCase) => {
        const maxLen = testCase.expectedProperties?.maxLength || 100;
        const words = output.split(/\s+/).length;
        return Math.min(1, maxLen / Math.max(words, 1));
      },
      weight: 0.3
    },
    {
      name: 'completeness',
      evaluate: (output, testCase) => {
        // Verificar que captura puntos clave
        const keyTerms = extractKeyTerms(testCase.input.text);
        const mentioned = keyTerms.filter(t => output.includes(t)).length;
        return mentioned / Math.max(keyTerms.length, 1);
      },
      weight: 0.5
    },
    {
      name: 'readability',
      evaluate: (output) => {
        // Flesch-Kincaid simplificado
        const sentences = output.split(/[.!?]+/).length;
        const words = output.split(/\s+/).length;
        if (sentences === 0 || words === 0) return 0;
        const avgSentenceLength = words / sentences;
        return Math.min(1, 20 / avgSentenceLength);
      },
      weight: 0.2
    }
  ],
  sampleSizePerVariant: 10
};

// Ejecutar test
const framework = new ABTestingFramework();
const results = await framework.runABTest(abTestConfig);

console.log('A/B Test Results:');
console.log(JSON.stringify(results.analysis, null, 2));
```

---

### Best Practices para Testing No-determinístico

| Práctica | Descripción |
|----------|-------------|
| **Fijar seeds cuando sea posible** | Usar temperature=0 y seeds fijos para máximo determinismo |
| **Cachear respuestas de tests** | Guardar respuestas para reproducibilidad |
| **Testar propiedades, no valores exactos** | Verificar estructura, longitud, presencia de elementos |
| **Usar muestras múltiples** | Ejecutar N veces y analizar estadísticamente |
| **Calcular intervalos de confianza** | Cuantificar incertidumbre en métricas |
| **Documentar variabilidad esperada** | Establecer rangos aceptables de comportamiento |
| **Separar tests determinísticos de estadísticos** | Diferentes pipelines para diferentes tipos de tests |

**Cuándo usar cada approach:**

```
¿Necesitas resultados 100% reproducibles?
├── Sí → Mockear LLM o usar caching
└── No → ¿Estás comparando variantes?
    ├── Sí → A/B testing con análisis estadístico
    └── No → ¿Necesitas verificar umbral de calidad?
        ├── Sí → Testing estadístico con intervalos de confianza
        └── No → Golden sets con validación flexible
```

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
