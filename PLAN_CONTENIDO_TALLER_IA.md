# Plan de Contenido - Taller IA, Agentes y MCP

## Objetivo
Documentación completa para aprender a construir agentes de IA y MCP Servers con TypeScript, desde cero hasta casos avanzados.

## 1. Setup del Entorno (setup.md)

### Contenido
- Requisitos del sistema (Node.js 20+, npm/pnpm, Git)
- Instalación de dependencias principales
- Configuración de variables de entorno (.env)
- API keys (Claude, DeepSeek)
- Estructura de proyecto recomendada
- Verificación de setup (test commands)

### Temas Clave
- DevContainer setup (si aplica)
- TypeScript strict mode
- Configuración de tsconfig.json

---

## 2. Agente de Tareas (agente-tareas.md)

### Contenido
- ¿Qué es un agente de IA? (conceptos fundamentales)
- Ciclo básico: Prompt → LLM → Tools → Response
- Patrón Tool Use (definir tools, llamarlas, procesar respuestas)
- Construcción paso a paso del primer agente
- Manejo de errores básico
- Testing del agente

### Temas Clave
- Definición de tools en JSON Schema
- Llamadas a APIs de Claude/DeepSeek
- Loops de ejecución
- Type safety con TypeScript

### Ejemplo Práctico
Agente simple que:
- Lee tareas de un archivo o BD
- Decide qué herramientas usar
- Ejecuta acciones
- Reporta resultado

---

## 3. Agente Investigador (agente-investigador.md)

### Contenido
- Patrón avanzado: Plan-Execute-Synthesize
- Cómo el agente planifica antes de actuar
- Ejecución paralela/secuencial de tareas
- Síntesis de resultados
- Manejo de contexto y memoria
- Debugging de agentes complejos

### Temas Clave
- State management en agentes
- Prompt engineering para planning
- Chain-of-Thought prompting
- Iteración y refinamiento

### Ejemplo Práctico
Agente que investiga un tema:
1. Plan: desglosa subtareas
2. Execute: busca info en múltiples fuentes
3. Synthesize: sintetiza un reporte final

---

## 4. MCP Servers (mcp-servers.md)

### Contenido
- ¿Qué es MCP (Model Context Protocol)?
- Diferencia entre Tool Use y MCP Servers
- Construcción de MCP Server con FastMCP
- Construcción con SDK oficial de Anthropic
- Integración con Claude Desktop
- Testing de MCP Servers
- Deployment básico

### Temas Clave
- Spec de MCP
- Definición de resources y tools
- Manejo de streaming
- Error handling
- Versionado de MCP Servers

### Ejemplos Prácticos
1. MCP Server de Notas (CRUD)
2. MCP Server de Utilidades (calc, conversiones, etc.)
3. MCP Server que conecta con APIs externas

---

## 5. Ejercicios Prácticos (ejercicios.md)

### Contenido
- Ejercicios progresivos (fácil → difícil)
- Desafíos sin soluciones (para aprender)
- Checklist de validación para cada ejercicio

### Ejercicios Propuestos

**Nivel 1: Fundamentals**
1. Crear agente que responde preguntas sobre un documento
2. Crear MCP Server simple con 3 tools

**Nivel 2: Intermediate**
3. Agente que genera reportes a partir de datos
4. Agente que planifica y ejecuta tareas secuencialmente
5. Integrar un MCP Server con múltiples fuentes de datos

**Nivel 3: Advanced**
6. Agente multi-paso con iteración (refina resultados)
7. MCP Server con estado persistente (BD)
8. Agente que se comunica con otros agentes

---

## Estado del Plan
- [ ] Contenido de setup.md
- [ ] Contenido de agente-tareas.md
- [ ] Contenido de agente-investigador.md
- [ ] Contenido de mcp-servers.md
- [ ] Contenido de ejercicios.md
- [ ] Actualizar intro.md con links correctos
- [ ] Testing en desarrollo local
- [ ] Verificar todas las rutas en Docusaurus
