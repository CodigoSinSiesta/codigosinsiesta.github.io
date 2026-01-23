# Taller: AI Agents & Model Context Protocol

This section contains complete working examples from our AI Agents and Model Context Protocol workshop. Each example builds on previous concepts, guiding you through creating intelligent agents using Claude and the MCP.

## 📚 Examples

### [01-agente-tareas](./01-agente-tareas/) - Task Management Agent
Build a task management agent with memory capabilities. Learn how to:
- Create structured tools for task CRUD operations
- Implement agent memory and context
- Handle user interactions with Claude

### [02-agente-investigador](./02-agente-investigador/) - Research Agent
Develop a research agent that can search the web and synthesize information. Topics covered:
- Web search integration
- Information synthesis
- Multi-step reasoning

### [03-mcp-servers](./03-mcp-servers/) - MCP Server Implementation
Create your own Model Context Protocol server. You'll learn:
- MCP architecture and standards
- Server setup and configuration
- Tool registration and handling

## 🚀 Getting Started

Each example directory contains:
- **README.md** with detailed setup instructions
- **package.json** with all dependencies
- **.env.example** with required environment variables
- Complete, runnable source code

### Prerequisites

- Node.js 20.0 or higher
- npm or yarn
- Anthropic API key (get one at https://console.anthropic.com)

### Quick Start

1. Navigate to an example:
   ```bash
   cd 01-agente-tareas
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env and add your API keys
   ```

4. Run the example:
   ```bash
   npm start
   ```

## 📖 Documentation

For detailed explanations and step-by-step tutorials, visit:
- [Workshop Overview](https://codigosinsiesta.com/docs/proyectos/taller-ia-agentes-mcp/)
- [Task Agent Tutorial](https://codigosinsiesta.com/docs/proyectos/taller-ia-agentes-mcp/agente-tareas)
- [Research Agent Tutorial](https://codigosinsiesta.com/docs/proyectos/taller-ia-agentes-mcp/agente-investigador)
- [MCP Servers Tutorial](https://codigosinsiesta.com/docs/proyectos/taller-ia-agentes-mcp/mcp-servers)

## 💡 Learning Path

We recommend following the examples in order:

1. **Start with the Task Agent** to understand basic agent structure and tools
2. **Move to the Research Agent** to learn about external integrations
3. **Finish with MCP Servers** to understand the protocol layer

Each example includes inline comments and documentation to guide you through the code.

## 🤝 Need Help?

- Check the [documentation](https://codigosinsiesta.com/docs)
- Review the README in each example directory
- Open an issue if you find bugs or have questions

Happy coding! 🎉
