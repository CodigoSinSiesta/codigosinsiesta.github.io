# 📋 PROMPT MAESTRO - Relleno de Contenido de Documentación

## 🎯 OBJETIVO GENERAL
Llenar las 16 páginas placeholder con contenido real y de calidad siguiendo los planes detallados, manteniendo coherencia, calidad y consistencia en toda la documentación.

---

## 📊 TAREAS DESGLOSADAS

### FASE 1: TALLER IA, AGENTES Y MCP (6 páginas)
**Referencia**: `PLAN_CONTENIDO_TALLER_IA.md`

#### 1.1 `docs/proyectos/taller-ia-agentes-mcp/setup.md`
- **Contenido**: Guía paso a paso para preparar el entorno
- **Secciones esperadas**:
  - Requisitos del sistema (Node.js 20+, npm/pnpm, Git)
  - Instalación de dependencias principales
  - Configuración de variables de entorno (.env)
  - API keys (Claude, DeepSeek)
  - Verificación de setup con test commands
- **Tono**: Técnico, directo, sin suposiciones
- **Ejemplos**: Comandos reales, archivos .env de ejemplo

#### 1.2 `docs/proyectos/taller-ia-agentes-mcp/agente-tareas.md`
- **Contenido**: Construcción del primer agente funcional
- **Secciones esperadas**:
  - Conceptos fundamentales (¿Qué es un agente?)
  - Ciclo básico: Prompt → LLM → Tools → Response
  - Patrón Tool Use (definir tools, llamarlas, procesar)
  - Construcción paso a paso
  - Manejo de errores
  - Testing del agente
- **Tono**: Educativo, progresivo (de fácil a complejo)
- **Ejemplos**: Código TypeScript completo y funcional

#### 1.3 `docs/proyectos/taller-ia-agentes-mcp/agente-investigador.md`
- **Contenido**: Patrón avanzado Plan-Execute-Synthesize
- **Secciones esperadas**:
  - Arquitectura del patrón
  - Planificación de tareas
  - Ejecución paralela/secuencial
  - Síntesis de resultados
  - Manejo de contexto y memoria
  - Debugging
- **Tono**: Profundo, con diagramas conceptuales
- **Ejemplos**: Agente que investiga un tema completo

#### 1.4 `docs/proyectos/taller-ia-agentes-mcp/mcp-servers.md`
- **Contenido**: Creación de MCP Servers
- **Secciones esperadas**:
  - ¿Qué es MCP? (vs Tool Use)
  - FastMCP setup y ejemplos
  - SDK oficial de Anthropic
  - Integración con Claude Desktop
  - Testing de MCP Servers
  - Deployment básico
- **Tono**: Práctico, con comparativas
- **Ejemplos**: 2-3 MCP Servers pequeños funcionales

#### 1.5 `docs/proyectos/taller-ia-agentes-mcp/ejercicios.md`
- **Contenido**: Ejercicios progresivos sin soluciones
- **Secciones esperadas**:
  - Nivel 1 (Fácil): 2-3 ejercicios básicos
  - Nivel 2 (Medio): 2-3 ejercicios intermedios
  - Nivel 3 (Avanzado): 2-3 ejercicios complejos
  - Checklist de validación para cada uno
- **Tono**: Desafiante, pero justo
- **Ejemplos**: Enunciados claros, sin código

---

### FASE 2: AI PRESENTATION - 4R FRAMEWORK (3 páginas)
**Referencia**: `PLAN_CONTENIDO_AI_PRESENTATION.md`

#### 2.1 `docs/proyectos/ai-presentation/vibe-coding-vs-engineering.md`
- **Contenido**: El problema - Métricas y datos reales
- **Secciones esperadas**:
  - El paradox (85% usan IA, 32% confían en calidad)
  - Impacto real en PRs (+154%), reviews (+91%), bugs (+9%)
  - Code churn (+41%), 211M LOC copy-pasted
  - Vulnerabilidades (30% tiene issues)
  - Estudio METR 2025
  - Síntomas en proyectos reales
- **Tono**: Data-driven, convincente pero no alarmista
- **Ejemplos**: Gráficas de datos, casos reales

#### 2.2 `docs/proyectos/ai-presentation/4r-framework.md`
- **Contenido**: La solución - Los 4 pilares
- **Secciones esperadas**:
  - **Risk**: Security assessment, SAST, threat modeling
  - **Readability**: Complejidad, linting, peer review
  - **Reliability**: TDD, mutation testing, coverage
  - **Resilience**: Circuit breakers, logging, monitoring
  - Cómo se integran los 4 pilares
  - Checklist por pilar
  - Ejemplo antes/después
- **Tono**: Estructurado, con tablas comparativas
- **Ejemplos**: Código "vibe" vs "responsable"

#### 2.3 `docs/proyectos/ai-presentation/best-practices.md`
- **Contenido**: Herramientas y patrones prácticos
- **Secciones esperadas**:
  - Pre-commit hooks (Husky + lint-staged)
  - Stack PRs methodology (200-400 LOC)
  - Augmented reviewers (GitHub Copilot, CodeRabbit, Kudu)
  - Prompt engineering seguro
  - Guardrails structure
  - Casos reales (Amazon, UK Government)
- **Tono**: Pragmático, actionable
- **Ejemplos**: Configuraciones reales, snippets

---

### FASE 3: HERRAMIENTAS (4 páginas)
**Referencia**: `PLAN_CONTENIDO_HERRAMIENTAS.md`

#### 3.1 `docs/herramientas/lazyvim.md`
- **Contenido**: Editor Neovim moderno
- **Secciones esperadas**:
  - ¿Qué es LazyVim?
  - Instalación y setup básico
  - Estructura modular
  - Customización práctica
  - Keybindings esenciales
  - Plugins recomendados
  - Performance vs comodidad
- **Tono**: Para alguien que quiere abandonar VS Code
- **Ejemplos**: Config files, keybindings personalizados

#### 3.2 `docs/herramientas/tmux.md`
- **Contenido**: Terminal multiplexer
- **Secciones esperadas**:
  - ¿Cuándo necesitas Tmux?
  - Instalación y config básica
  - Conceptos: Sessions, Windows, Panes
  - Keybindings esenciales
  - Workflow práctico
  - Scripting en Tmux
  - Casos de uso reales
- **Tono**: Hands-on, con ejemplos de workflows
- **Ejemplos**: Scripts de setup, configuraciones

#### 3.3 `docs/herramientas/zellij.md`
- **Contenido**: Alternativa moderna a Tmux
- **Secciones esperadas**:
  - ¿Qué es Zellij?
  - Comparativa Tmux vs Zellij
  - Instalación
  - Configuración
  - Keybindings intuitivos
  - Layout system
  - Cuándo elegir Zellij
- **Tono**: Comparativo, moderno
- **Ejemplos**: Layouts, configuraciones

#### 3.4 `docs/herramientas/dev-tools.md`
- **Contenido**: Herramientas modernas vs legacy
- **Secciones esperadas**:
  - Build Tools (esbuild, SWC, Turbopack)
  - Package Managers (npm, pnpm, bun)
  - Testing (Vitest, Jest, Playwright vs Cypress)
  - Linting & Formatting (ESLint, Prettier, Husky)
  - Git Tools (Conventional commits, Commitizen)
  - CLI Tools (bat, rg, fd, sd, eza)
  - Decisiones pragmáticas
- **Tono**: Comparativo con benchmarks
- **Ejemplos**: Tabla de herramientas, benchmarks

---

### FASE 4: ARQUITECTURA PARA IA (4 páginas)
**Referencia**: `PLAN_CONTENIDO_ARQUITECTURA_IA.md`

#### 4.1 `docs/arquitectura-ia/patrones.md`
- **Contenido**: Patrones específicos para sistemas IA
- **Secciones esperadas**:
  - Patrones de Agentes (Reactor, Plan-Execute-Synthesize, Chain, Collaborative, Hierarchical)
  - Patrones de Integración LLM (Tool Use, RAG, Fine-tuning, Ensemble, Fallback)
  - Patrones de Estado (Stateless, Lightweight, Persistent, Hybrid)
  - Patrones de Seguridad (Sandbox, Validation, Rate Limiting, Audit)
  - Cuándo usar cada uno
  - Tradeoffs explícitos
- **Tono**: Académico pero práctico
- **Ejemplos**: Diagramas, código por cada patrón

#### 4.2 `docs/arquitectura-ia/design-decisions.md`
- **Contenido**: Decisiones arquitectónicas clave
- **Secciones esperadas**:
  - API Design (REST vs gRPC vs GraphQL)
  - Storage (Vector DB, SQL vs NoSQL, caching)
  - LLM Selection (API vs Self-hosted)
  - Tooling (orquestación, monitoring)
  - Deployment (Serverless vs containers)
  - Decision tree según caso de uso
  - Recomendaciones por tamaño de equipo
- **Tono**: Orientado a decisiones
- **Ejemplos**: Decision trees, matrices de evaluación

#### 4.3 `docs/arquitectura-ia/testing-strategies.md`
- **Contenido**: Testing en sistemas IA
- **Secciones esperadas**:
  - Unit Testing (tools, prompts, parsing)
  - Integration Testing (agentes completos, multi-agent)
  - Testing de Calidad (BLEU, ROUGE, métricas custom)
  - Testing de Seguridad (prompt injection, validation)
  - Testing de Performance (latency, throughput, cost)
  - Determinismo vs no-determinismo
  - Herramientas especializadas
- **Tono**: Práctico, con pipeline CI/CD
- **Ejemplos**: Test suites reales, configuraciones

#### 4.4 `docs/arquitectura-ia/security-patterns.md`
- **Contenido**: Seguridad en sistemas IA
- **Secciones esperadas**:
  - Input Validation (sanitización, type checking, limits)
  - Output Validation (parsing seguro, schema validation)
  - Tool Execution (sandbox, permissions, rate limiting)
  - Data Protection (encryption, PII redaction)
  - Model Security (adversarial detection, jailbreak attempts)
  - Infrastructure (secret management, DDoS protection)
  - Checklist pre-deployment
- **Tono**: Riguroso, orientado a compliance
- **Ejemplos**: Checklists, código de ejemplo

---

## 🛠️ INSTRUCCIONES DE EJECUCIÓN

### Por cada página:

1. **Lee el plan correspondiente** en `PLAN_CONTENIDO_*.md`
2. **Abre el archivo markdown** en `docs/**/archivo.md`
3. **Reemplaza "En construcción"** con contenido real siguiendo el plan
4. **Mantén coherencia**:
   - Frontmatter: `sidebar_position` debe ser único en su sección
   - Links internos: usa rutas relativas cuando sea posible
   - Código: usa triple backticks con lenguaje (`typescript`, `bash`, `yaml`)
   - Emojis: solo en headings, no en párrafos normales
5. **Testing local**:
   ```bash
   pnpm run build      # Verifica que no hay errores
   pnpm start          # http://localhost:3000 (opcional, lento)
   ```
6. **Commit por página**:
   ```bash
   git add docs/section/file.md
   git commit -m "feat: Add [SECCIÓN] - [TEMA] with comprehensive guide"
   ```

---

## 📅 ORDEN RECOMENDADO

**Prioridad Alta** (más usados):
1. Taller IA - Setup
2. Taller IA - Agente Tareas
3. 4R Framework (completo)
4. Dev Tools

**Prioridad Media** (frecuentes):
5. Taller IA - Agente Investigador
6. Herramientas (LazyVim, Tmux)
7. Arquitectura - Patrones

**Prioridad Baja** (reference):
8. Taller IA - MCP Servers
9. Taller IA - Ejercicios
10. Herramientas - Zellij
11. Arquitectura - Decisiones, Testing, Seguridad

---

## ✅ CHECKLIST FINAL

- [ ] Las 16 páginas tienen contenido real (no "En construcción")
- [ ] Todos los links internos funcionan
- [ ] No hay frontmatter duplicado o incorrecto
- [ ] El build no tiene errores: `pnpm run build` exitoso
- [ ] Cada página tiene al menos 300-500 palabras
- [ ] Código incluye ejemplos funcionales (no pseudocódigo)
- [ ] Markdown es limpio y bien formateado
- [ ] Consistency en tono y estructura

---

## 🚀 RESULTADO ESPERADO

Una documentación **profesional, exhaustiva y usable** que:
- No deja dudas sobre los temas
- Tiene ejemplos reales ejecutables
- Mantiene coherencia visual y narrativa
- Es fácil de navegar
- Refleja la calidad técnica de la organización

**No hay shortcuts. No hay relleno. Solo conocimiento legítimo.**

---

## 📝 NOTAS IMPORTANTES

- **Tono general**: Educativo pero directo, como si enseñaras a un junior que quiere aprender de verdad
- **Evita**: Introducir conceptos sin explicar, pseudocódigo, ejemplos incompletos
- **Incluye**: Links a referencias, advertencias, casos reales, antipatterns
- **Formato**: Usa blockquotes (`>`) para consejos importantes, callouts para advertencias
- **Código**: Siempre executable, testeado, con comentarios donde sea necesario

---

**Fecha de creación**: 2025-12-17  
**Rama**: `feat/clean-documentation-structure`  
**Estado**: Listo para ejecución
