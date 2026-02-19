---
sidebar_position: 5
---

# MCP Servers

**Model Context Protocol (MCP)** es la evolución de los tools: servidores reutilizables que extienden las capacidades de cualquier LLM. Crea una vez, usa en cualquier agente o aplicación.

**📦 Código completo:** [codigosinsiesta-examples/taller-ia-agentes-mcp/03-mcp-servers](https://github.com/codigosinsiesta/codigosinsiesta-examples/tree/main/taller-ia-agentes-mcp/03-mcp-servers)

## ¿Qué es MCP?

### El Problema que Resuelve

**Antes de MCP:**
- Cada agente reimplementaba las mismas tools
- Tools eran código hardcoded en el agente
- Difícil compartir tools entre proyectos
- Mantenimiento duplicado

**Con MCP:**
- Tools como servicios independientes
- Protocolo estandarizado
- Reutilizables entre agentes
- Deployables como APIs

### Arquitectura MCP

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   LLM App       │◄──►│   MCP Client     │◄──►│   MCP Server    │
│ (Claude Desktop │    │ (SDK integrado)  │    │ (Tu servidor)   │
│  Chat, agentes) │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                       │
                                               ┌───────▼────────┐
                                               │   Resources    │
                                               │   Tools        │
                                               │   Prompts      │
                                               └────────────────┘
```

### MCP vs Tool Use

| Aspecto | Tool Use | MCP |
|---------|----------|-----|
| **Alcance** | Un agente | Cualquier cliente |
| **Reutilización** | Código duplicado | Servidor compartido |
| **Deployment** | Embedido | Servicio independiente |
| **Mantenimiento** | Alto | Centralizado |
| **Ecosystem** | Limitado | Creciente |

## MCP Server Básico con FastMCP

### Setup del Proyecto

```bash
# Crear proyecto
mkdir mcp-calculator-server
cd mcp-calculator-server

# Inicializar
pnpm init -y
pnpm add fast-mcp zod

# Crear estructura
mkdir src
touch src/index.ts
```

### Servidor Básico

```typescript:src/index.ts
import { FastMCP } from 'fast-mcp';
import { z } from 'zod';

// Crear servidor MCP
const server = new FastMCP({
  name: 'calculator',
  version: '1.0.0',
  description: 'A calculator MCP server with basic arithmetic operations'
});

// Definir tools
server.addTool({
  name: 'add',
  description: 'Add two numbers together',
  parameters: z.object({
    a: z.number().describe('First number'),
    b: z.number().describe('Second number')
  }),
  execute: async ({ a, b }) => {
    const result = a + b;
    return {
      result,
      operation: `${a} + ${b} = ${result}`
    };
  }
});

server.addTool({
  name: 'multiply',
  description: 'Multiply two numbers',
  parameters: z.object({
    a: z.number().describe('First number'),
    b: z.number().describe('Second number')
  }),
  execute: async ({ a, b }) => {
    const result = a * b;
    return {
      result,
      operation: `${a} × ${b} = ${result}`
    };
  }
});

server.addTool({
  name: 'power',
  description: 'Calculate power (a^b)',
  parameters: z.object({
    base: z.number().describe('Base number'),
    exponent: z.number().describe('Exponent (integer)'),
    validate: z.boolean().optional().default(true).describe('Validate inputs')
  }),
  execute: async ({ base, exponent, validate }) => {
    if (validate && !Number.isInteger(exponent)) {
      throw new Error('Exponent must be an integer');
    }

    if (validate && exponent < 0) {
      throw new Error('Negative exponents not supported');
    }

    const result = Math.pow(base, exponent);
    return {
      result,
      operation: `${base}^${exponent} = ${result}`
    };
  }
});

// Iniciar servidor
server.start({
  transport: 'stdio'  // Comunicación via stdin/stdout
}).catch(console.error);
```

### Package.json Scripts

```json:package.json
{
  "scripts": {
    "build": "tsc",
    "start": "tsx src/index.ts",
    "dev": "tsx watch src/index.ts"
  },
  "devDependencies": {
    "tsx": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
```

### Probar el Servidor

```bash
# Construir
pnpm run build

# Ejecutar (se queda esperando input)
pnpm run start
```

## MCP Server Avanzado

### Añadir Resources

```typescript:src/calculator-server.ts
import { FastMCP } from 'fast-mcp';
import { z } from 'zod';

const server = new FastMCP({
  name: 'advanced-calculator',
  version: '2.0.0'
});

// Resource: Historial de cálculos
let calculationHistory: Array<{
  id: string;
  operation: string;
  result: number;
  timestamp: Date;
}> = [];

server.addResource({
  uri: 'calculator://history',
  name: 'Calculation History',
  description: 'History of all calculations performed',
  mimeType: 'application/json',
  read: async () => {
    return {
      history: calculationHistory,
      total: calculationHistory.length,
      lastUpdated: new Date().toISOString()
    };
  }
});

// Resource: Constantes matemáticas
server.addResource({
  uri: 'calculator://constants',
  name: 'Mathematical Constants',
  description: 'Common mathematical constants',
  mimeType: 'application/json',
  read: async () => {
    return {
      pi: Math.PI,
      e: Math.E,
      goldenRatio: (1 + Math.sqrt(5)) / 2,
      sqrt2: Math.SQRT2
    };
  }
});

// Tool mejorado con historial
server.addTool({
  name: 'calculate',
  description: 'Perform a calculation and store in history',
  parameters: z.object({
    expression: z.string().describe('Mathematical expression (e.g., "2 + 3 * 4")'),
    description: z.string().optional().describe('Description of the calculation')
  }),
  execute: async ({ expression, description }) => {
    try {
      // Evaluar expresión (en producción usa una librería segura)
      const result = eval(expression);

      if (typeof result !== 'number' || !isFinite(result)) {
        throw new Error('Invalid calculation result');
      }

      // Registrar en historial
      const calculation = {
        id: `calc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        operation: expression,
        result,
        description: description || expression,
        timestamp: new Date()
      };

      calculationHistory.push(calculation);

      // Mantener solo últimos 100 cálculos
      if (calculationHistory.length > 100) {
        calculationHistory = calculationHistory.slice(-100);
      }

      return {
        result,
        id: calculation.id,
        historyUri: 'calculator://history'
      };

    } catch (error) {
      throw new Error(`Calculation failed: ${error.message}`);
    }
  }
});

// Tool para consultar historial
server.addTool({
  name: 'get_history',
  description: 'Get calculation history',
  parameters: z.object({
    limit: z.number().min(1).max(50).optional().default(10).describe('Number of recent calculations to return'),
    operation: z.string().optional().describe('Filter by operation type')
  }),
  execute: async ({ limit, operation }) => {
    let filtered = calculationHistory;

    if (operation) {
      filtered = filtered.filter(calc =>
        calc.operation.includes(operation) ||
        calc.description.includes(operation)
      );
    }

    const recent = filtered.slice(-limit).reverse();

    return {
      calculations: recent,
      total: filtered.length,
      filtered: operation ? true : false
    };
  }
});

export default server;
```

## MCP con SDK Oficial de Anthropic

### Setup

```bash
# Instalar SDK oficial
pnpm add @modelcontextprotocol/sdk
```

### Servidor con SDK Oficial

```typescript:src/official-mcp-server.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

class FileManagerServer {
  private server: Server;
  private files: Map<string, string> = new Map();

  constructor() {
    this.server = new Server(
      {
        name: 'file-manager',
        version: '1.0.0',
        description: 'A file management MCP server'
      },
      {
        capabilities: {
          tools: {},
          resources: {}
        }
      }
    );

    this.setupHandlers();
  }

  private setupHandlers(): void {
    // List tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'create_file',
            description: 'Create a new file with content',
            inputSchema: {
              type: 'object',
              properties: {
                filename: { type: 'string' },
                content: { type: 'string' }
              },
              required: ['filename', 'content']
            }
          },
          {
            name: 'read_file',
            description: 'Read content of a file',
            inputSchema: {
              type: 'object',
              properties: {
                filename: { type: 'string' }
              },
              required: ['filename']
            }
          },
          {
            name: 'list_files',
            description: 'List all managed files',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          }
        ]
      };
    });

    // List resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: Array.from(this.files.keys()).map(filename => ({
          uri: `file://${filename}`,
          name: filename,
          description: `File: ${filename}`,
          mimeType: 'text/plain'
        }))
      };
    });

    // Read resource
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const uri = request.params.uri;
      const filename = uri.replace('file://', '');

      const content = this.files.get(filename);
      if (!content) {
        throw new Error(`File not found: ${filename}`);
      }

      return {
        contents: [
          {
            uri,
            mimeType: 'text/plain',
            text: content
          }
        ]
      };
    });

    // Call tool
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'create_file':
          const { filename, content } = args as { filename: string; content: string };
          this.files.set(filename, content);
          return {
            content: [
              {
                type: 'text',
                text: `File created: ${filename}`
              }
            ]
          };

        case 'read_file':
          const readFilename = (args as { filename: string }).filename;
          const fileContent = this.files.get(readFilename);
          if (!fileContent) {
            throw new Error(`File not found: ${readFilename}`);
          }
          return {
            content: [
              {
                type: 'text',
                text: fileContent
              }
            ]
          };

        case 'list_files':
          const fileList = Array.from(this.files.keys()).join('\n');
          return {
            content: [
              {
                type: 'text',
                text: fileList || 'No files'
              }
            ]
          };

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('File Manager MCP Server started');
  }
}

// Iniciar servidor
const server = new FileManagerServer();
server.start().catch(console.error);
```

## Integración con Claude Desktop

### Configuración

```json:~/.config/claude-dev/settings.json
{
  "mcpServers": {
    "calculator": {
      "command": "node",
      "args": ["/path/to/mcp-calculator-server/dist/index.js"],
      "env": {
        "NODE_ENV": "production"
      }
    },
    "file-manager": {
      "command": "node",
      "args": ["/path/to/mcp-file-manager/dist/index.js"]
    }
  }
}
```

### Testing en Claude Desktop

1. **Reiniciar Claude Desktop**
2. **Verificar tools disponibles**: Los tools aparecerán en la lista de herramientas
3. **Probar interacción**: "Usa la calculadora para sumar 15 + 27"

## Testing de MCP Servers

### Tests Unitarios

```typescript:src/__tests__/calculator-server.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { FastMCP } from 'fast-mcp';

describe('Calculator MCP Server', () => {
  let server: FastMCP;

  beforeEach(() => {
    server = new FastMCP({
      name: 'test-calculator',
      version: '1.0.0'
    });

    // Setup tools como en el servidor real
    server.addTool({
      name: 'add',
      parameters: z.object({ a: z.number(), b: z.number() }),
      execute: async ({ a, b }) => ({ result: a + b })
    });
  });

  it('should add two numbers correctly', async () => {
    const result = await server.callTool('add', { a: 5, b: 3 });
    expect(result.result).toBe(8);
  });

  it('should handle negative numbers', async () => {
    const result = await server.callTool('add', { a: 10, b: -3 });
    expect(result.result).toBe(7);
  });

  it('should handle zero', async () => {
    const result = await server.callTool('add', { a: 0, b: 5 });
    expect(result.result).toBe(5);
  });
});
```

### Tests de Integración

```typescript:src/__tests__/integration.test.ts
import { describe, it, expect } from 'vitest';
import { spawn } from 'child_process';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';

describe('MCP Server Integration', () => {
  it('should respond to tool calls', async () => {
    // Iniciar servidor en proceso separado
    const serverProcess = spawn('node', ['dist/index.js'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    // Crear cliente MCP
    const client = new Client({
      name: 'test-client',
      version: '1.0.0'
    });

    // Conectar via stdio
    await client.connect({
      transport: {
        readable: serverProcess.stdout,
        writable: serverProcess.stdin
      }
    });

    // Listar tools
    const tools = await client.request({ method: 'tools/list' });
    expect(tools.tools).toContainEqual(
      expect.objectContaining({ name: 'add' })
    );

    // Ejecutar tool
    const result = await client.request({
      method: 'tools/call',
      params: {
        name: 'add',
        arguments: { a: 2, b: 3 }
      }
    });

    expect(result.content[0].text).toContain('5');

    // Cleanup
    serverProcess.kill();
  });
});
```

## Deployment Básico

### Como Servicio Systemd

```bash:~/mcp-calculator.service
[Unit]
Description=MCP Calculator Server
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/mcp-calculator-server
ExecStart=/usr/bin/node dist/index.js
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

```bash
# Instalar y habilitar
sudo cp ~/mcp-calculator.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable mcp-calculator
sudo systemctl start mcp-calculator
```

### Docker Deployment

```dockerfile:Dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY dist/ ./dist/
USER node

CMD ["node", "dist/index.js"]
```

```yaml:docker-compose.yml
version: '3.8'
services:
  calculator-mcp:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

## Ejemplos de MCP Servers Útiles

### 1. Git Helper Server

```typescript
// Tools: status, commit, push, pull, branch management
server.addTool({
  name: 'git_status',
  description: 'Get git repository status',
  execute: async () => {
    const { exec } = await import('child_process');
    return new Promise((resolve, reject) => {
      exec('git status --porcelain', (error, stdout) => {
        if (error) reject(error);
        else resolve({ status: stdout.trim() });
      });
    });
  }
});
```

### 2. Database Explorer Server

```typescript
// Tools: query, schema inspection, data export
server.addTool({
  name: 'db_query',
  description: 'Execute SQL query safely',
  parameters: z.object({
    query: z.string().describe('SELECT query only'),
    limit: z.number().optional().default(100)
  }),
  execute: async ({ query, limit }) => {
    // Validate query is read-only
    if (!query.toUpperCase().startsWith('SELECT')) {
      throw new Error('Only SELECT queries allowed');
    }

    const result = await this.db.query(query + ` LIMIT ${limit}`);
    return result;
  }
});
```

### 3. API Client Server

```typescript
// Tools: HTTP requests, API testing, response parsing
server.addTool({
  name: 'http_request',
  description: 'Make HTTP request to API',
  parameters: z.object({
    method: z.enum(['GET', 'POST', 'PUT', 'DELETE']),
    url: z.string().url(),
    headers: z.record(z.string()).optional(),
    body: z.string().optional()
  }),
  execute: async ({ method, url, headers, body }) => {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', ...headers },
      body
    });

    const data = await response.json();
    return {
      status: response.status,
      headers: Object.fromEntries(response.headers),
      data
    };
  }
});
```

## Debugging MCP Servers

### Logging

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/mcp-server.log' }),
    new winston.transports.Console()
  ]
});

// Usar en tools
server.addTool({
  name: 'debug_tool',
  execute: async (params) => {
    logger.info('Tool executed', { tool: 'debug_tool', params });

    try {
      const result = await performOperation(params);
      logger.info('Tool completed successfully', { result });
      return result;
    } catch (error) {
      logger.error('Tool failed', { error: error.message, params });
      throw error;
    }
  }
});
```

### Health Checks

```typescript
server.addResource({
  uri: 'server://health',
  name: 'Server Health',
  read: async () => {
    return {
      status: 'healthy',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      tools: server.listTools().length,
      timestamp: new Date().toISOString()
    };
  }
});
```

## Conclusión

**MCP Servers representan el futuro de las herramientas para IA:**

- **Reutilizables**: Un servidor, múltiples clientes
- **Mantenibles**: Lógica centralizada
- **Escalables**: Deployables independientemente
- **Estandarizados**: Protocolo común

**Próximos pasos:**
1. Crea tu primer MCP Server
2. Intégralo con Claude Desktop
3. Explora los [Ejercicios](./ejercicios.md) para practicar
4. Comparte tus servers en la comunidad

¿Ya tienes un MCP Server funcionando? ¿Qué tools has creado? 🔧
