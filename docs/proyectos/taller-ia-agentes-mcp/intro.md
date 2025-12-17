---
sidebar_position: 1
---

# Taller IA, Agentes y MCP

Bienvenido al taller completo sobre construcción de **Agentes de IA** y **MCP Servers** (Model Context Protocol).

## 📚 En esta sección

Este taller te enseñará a:

- Construir agentes de IA con TypeScript
- Implementar patrones de arquitectura para agentes
- Crear y mantener MCP Servers
- Integrar LLMs (Claude, DeepSeek) en aplicaciones reales
- Aplicar testing y best practices

## 🎯 Requisitos Previos

### ¿Por qué TypeScript? (No es opcional)

Los agentes de IA no son "scripts de juguete". Manejan:
- **Datos complejos** de APIs externas
- **Estados distribuidos** entre múltiples llamadas
- **Herramientas asíncronas** con timeouts y reintentos
- **Validación estricta** de inputs/outputs del LLM

**Sin TypeScript sólido:**
- Un typo en un nombre de propiedad → runtime error silencioso
- Tool calls mal formateados → agente que "se vuelve loco"
- Estados inconsistentes → bugs imposibles de debuggear
- Refactoring → semanas de testing manual

**Con TypeScript:**
- El compilador atrapa errores antes de ejecutar
- IntelliSense acelera desarrollo 3x
- Refactoring seguro con "Find All References"
- Contratos claros entre componentes

> **Dato real**: El 80% de bugs en agentes IA vienen de errores de tipos o estados mal manejados. TypeScript previene la mayoría.

### Otros Requisitos

- **Node.js 20+**: ES modules nativos, performance crítica para agentes
- **APIs/LLMs**: Entender que Claude no es magia, es un API con límites
- **Git/CLI**: Version control y debugging de sistemas distribuidos

## 📖 Contenido del Taller

### Parte 1: Fundamentos
- [Introducción](./intro.md) - ¿Qué es un agente de IA?
- [Setup](./setup.md) - Prepara tu entorno

### Parte 2: Agentes Básicos
- [Agente de Tareas](./agente-tareas.md) - Tu primer agente funcional

### Parte 3: Agentes Avanzados
- [Agente Investigador](./agente-investigador.md) - Patrón Plan-Execute-Synthesize

### Parte 4: MCP Servers
- [MCP Servers](./mcp-servers.md) - Crea herramientas reutilizables

### Parte 5: Práctica
- [Ejercicios](./ejercicios.md) - Desafíos para afianzar lo aprendido

## ⚠️ Importante

Este no es un tutorial de "copiar y pegar". Cada línea de código tiene propósito. Si no entiendes algo, **pregunta** y revisa los fundamentos.

---

**Siguiente**: [Setup del Entorno](./setup.md)
