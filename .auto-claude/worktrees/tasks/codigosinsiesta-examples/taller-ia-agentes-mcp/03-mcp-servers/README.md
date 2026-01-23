# 03 - Calculator MCP Server

A Model Context Protocol (MCP) server that provides calculator tools and calculation history resources. This example demonstrates how to build an MCP server using Fast-MCP that can be integrated with Claude Desktop and other MCP clients.

## 🎯 What You'll Learn

- **MCP Server Architecture**: How to build a server that exposes tools to AI clients
- **Fast-MCP Framework**: Using Fast-MCP for quick server development
- **Tool Definition**: Create tools with schema validation using Zod
- **Resource Management**: Expose calculation history as a resource
- **STDIO Transport**: Communicate with clients via standard input/output
- **Error Handling**: Validate inputs and handle calculation errors

## ✨ Features

- 🧮 **Basic Arithmetic**: Add, multiply, and power operations
- 📊 **Expression Calculator**: Evaluate complex mathematical expressions
- 📝 **Calculation History**: Store and retrieve past calculations
- 🔍 **History Filtering**: Search calculations by operation type
- 🛡️ **Input Validation**: Schema validation with Zod
- 📦 **Resource Exposure**: History accessible as MCP resource

## 🚀 Quick Start

### Prerequisites

- Node.js 20.0 or higher
- npm or yarn
- Claude Desktop or another MCP-compatible client

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment (optional):
   ```bash
   cp .env.example .env
   ```

### Run the Server

**Standalone mode** (for testing):
```bash
npm start
```

**Development mode** with auto-reload:
```bash
npm run dev
```

## 🔌 Integration with Claude Desktop

To use this MCP server with Claude Desktop, add it to your configuration file:

### macOS/Linux

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "calculator": {
      "command": "node",
      "args": [
        "/absolute/path/to/03-mcp-servers/dist/server.js"
      ]
    }
  }
}
```

### Windows

Edit `%APPDATA%\Claude\claude_desktop_config.json` with the same structure.

### Using tsx instead of building

For development, you can use tsx directly:

```json
{
  "mcpServers": {
    "calculator": {
      "command": "npx",
      "args": [
        "-y",
        "tsx",
        "/absolute/path/to/03-mcp-servers/src/server.ts"
      ]
    }
  }
}
```

After updating the config, restart Claude Desktop.

## 💬 Available Tools

### 1. add

Add two numbers together.

**Parameters:**
- `a` (number): First number
- `b` (number): Second number

**Example:**
```
Result: 5 + 3 = 8
```

### 2. multiply

Multiply two numbers.

**Parameters:**
- `a` (number): First number
- `b` (number): Second number

**Example:**
```
Result: 4 × 6 = 24
```

### 3. power

Calculate power (a^b).

**Parameters:**
- `base` (number): Base number
- `exponent` (number): Exponent (must be integer)
- `validate` (boolean, optional): Enable input validation (default: true)

**Example:**
```
Result: 2^8 = 256
```

### 4. calculate

Evaluate a mathematical expression and store in history.

**Parameters:**
- `expression` (string): Mathematical expression (e.g., "2 + 3 * 4")
- `description` (string, optional): Description of the calculation

**Returns:**
- Calculation result
- Unique calculation ID
- History resource URI

**Example:**
```
Expression: (5 + 3) * 2 - 4
Result: 12
ID: calc_1234567890_abcdef123
```

### 5. get_history

Retrieve calculation history.

**Parameters:**
- `limit` (number, optional): Number of recent calculations (1-50, default: 10)
- `operation` (string, optional): Filter by operation type

**Returns:**
- Array of recent calculations
- Total count
- Filter status

## 📁 Project Structure

```
03-mcp-servers/
├── src/
│   ├── server.ts             # Main MCP server implementation
│   └── tools.ts              # Tool definitions and logic
├── .env.example              # Environment template
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
└── README.md                 # This file
```

## 🔧 How It Works

### 1. MCP Server Initialization

The server is created using Fast-MCP:

```typescript
const server = new FastMCP({
  name: 'calculator',
  version: '1.0.0',
  description: 'A calculator MCP server with basic arithmetic operations'
});
```

### 2. Tool Registration

Tools are registered with schema validation:

```typescript
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
```

### 3. STDIO Communication

The server uses STDIO transport to communicate with MCP clients:

```typescript
server.start({
  transport: 'stdio'  // Standard input/output communication
}).catch(console.error);
```

### 4. State Management

Calculation history is stored in memory:

```typescript
export let calculationHistory: Array<{
  id: string;
  operation: string;
  result: number;
  timestamp: Date;
}> = [];
```

**Note:** In production, consider persisting to a database.

## 🎓 Key Concepts

### MCP Protocol

The Model Context Protocol (MCP) allows AI applications to:
- **Discover Tools**: Clients can list available tools
- **Execute Tools**: Invoke tools with validated parameters
- **Access Resources**: Retrieve data like calculation history
- **Bidirectional Communication**: STDIO enables two-way messaging

### Fast-MCP Framework

Fast-MCP simplifies MCP server development:
- **Type-safe**: Full TypeScript support with Zod validation
- **Lightweight**: Minimal overhead and quick startup
- **Standard Compliant**: Follows MCP specification
- **Easy Integration**: Works with Claude Desktop and other clients

### Tool Schema Validation

Zod schemas ensure type safety and clear error messages:

```typescript
parameters: z.object({
  base: z.number().describe('Base number'),
  exponent: z.number().describe('Exponent (integer)'),
  validate: z.boolean().optional().default(true)
})
```

## 🔍 Testing the Server

### Manual Testing

1. Start the server in development mode:
   ```bash
   npm run dev
   ```

2. The server will wait for MCP protocol messages on stdin

3. Test with Claude Desktop or use the MCP Inspector tool

### Using MCP Inspector

Install the MCP Inspector for interactive testing:

```bash
npx @modelcontextprotocol/inspector node src/server.ts
```

This opens a web interface where you can:
- Browse available tools
- Test tool execution
- View calculation history
- Inspect request/response messages

## 🛠️ Development

```bash
# Run in development mode with auto-reload
npm run dev

# Type-check without building
npm run typecheck

# Build the project
npm run build
```

## 🚨 Important Notes

### Security Considerations

The `calculate` tool uses `eval()` for demonstration purposes. **In production:**

- ❌ **Never use eval()** with user input
- ✅ Use a safe expression parser like [math.js](https://mathjs.org/) or [expr-eval](https://www.npmjs.com/package/expr-eval)

### Memory Limitations

- History is stored in memory and limited to 100 calculations
- Data is lost when the server restarts
- For production, use a database like SQLite, PostgreSQL, or MongoDB

## 📚 Next Steps

After completing this example:

1. **Add more tools**: Implement subtract, divide, modulo operations
2. **Persistent storage**: Store history in a database
3. **Advanced features**: Add support for scientific functions (sin, cos, log)
4. **Resources**: Expose calculation statistics as MCP resources
5. **Error handling**: Improve validation and error messages
6. **Move to next example**: Explore more complex MCP server patterns

## 📖 Additional Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [Fast-MCP GitHub Repository](https://github.com/punkpeye/fast-mcp)
- [MCP Specification](https://spec.modelcontextprotocol.io/)
- [Claude Desktop MCP Guide](https://docs.anthropic.com/claude/docs/model-context-protocol)
- [Workshop Full Documentation](https://codigosinsiesta.com/docs/proyectos/taller-ia-agentes-mcp/mcp-servers)

## 🤝 Contributing

Found a bug or want to improve this example? Contributions are welcome! Please check the main repository for contribution guidelines.

## 📄 License

MIT License - See LICENSE file for details

---

**Part of the Código Sin Siesta AI Agents & MCP Workshop**

[← Back to Workshop](../) | [← Previous: Research Agent](../02-agente-investigador/)
