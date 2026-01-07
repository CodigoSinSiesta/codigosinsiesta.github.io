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

> **📝 Próximamente:** Testing de agentes completos, multi-agent interactions, tool chaining validation, y end-to-end workflows.

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
