---
sidebar_position: 1
---

# Taller IA, Agentes y MCP

Bienvenido al taller completo sobre construcción de **Agentes de IA** y **MCP Servers** (Model Context Protocol).

**📦 Repositorio:** [github.com/CodigoSinSiesta/codigosinsiesta.github.io](https://github.com/CodigoSinSiesta/codigosinsiesta.github.io)  
**🌐 Sitio en vivo:** [codigosinsiesta.github.io](https://codigosinsiesta.github.io/)

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

### Rutas de Aprendizaje

#### 🟢 Ruta Rápida (2-3 horas)
```
Setup → Agente de Tareas → Experimentar
```
Perfecto si quieres construir algo ya. Te enseña los conceptos mínimos.

#### 🔵 Ruta Completa (1 semana)
```
Setup → Agente de Tareas → Agente Investigador → Ejercicios
```
Aprenderás patrones avanzados y consolidarás conocimiento.

#### 🟡 Ruta Empresarial (2 semanas)
```
Setup → Agente de Tareas → Agente Investigador → MCP Servers → 4R Framework → Ejercicios
```
Incluye arquitectura escalable, seguridad y best practices.

### Módulos Detallados

| Módulo | Duración | Requisitos | Aprenderás |
|--------|----------|-----------|-----------|
| **[Setup](./setup.md)** | 10 min | Nada | Ambiente + API keys + verificación |
| **[Agente de Tareas](./agente-tareas.md)** | 1 hora | Setup completo | Patrón Tool Use, ciclo de agentes |
| **[Agente Investigador](./agente-investigador.md)** | 2 horas | Agente de Tareas | Plan-Execute-Synthesize, memoria |
| **[MCP Servers](./mcp-servers.md)** | 1.5 horas | Node.js + TypeScript | Spec MCP, FastMCP, integración |
| **[Ejercicios](./ejercicios.md)** | 3-5 horas | Todos los anteriores | Consolidar y crear desde cero |

### Conexión con Otros Recursos

- **4R Framework**: Aplica principios de seguridad y calidad a tu agente
  - [Link: 4R Framework](/docs/proyectos/ai-presentation/4r-framework.md)

- **Herramientas de Desarrollo**: Setup recomendado
  - [Dev Tools](/docs/herramientas/dev-tools.md) — Build tools, testing, linting
  - [Tmux](/docs/herramientas/tmux.md) — Para ejecutar múltiples servicios

## ⚠️ Importante

Este no es un tutorial de "copiar y pegar". Cada línea de código tiene propósito. Si no entiendes algo, **pregunta** y revisa los fundamentos.

---

**Siguiente**: [Setup del Entorno](./setup.md)
