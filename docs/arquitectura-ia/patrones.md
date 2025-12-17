---
sidebar_position: 1
---

# Patrones de Arquitectura para IA

Catálogo exhaustivo de patrones arquitectónicos específicos para sistemas basados en IA. Cada patrón incluye cuándo usarlo, tradeoffs, y ejemplos de implementación.

## 🧠 Patrones de Agentes

### Reactor Pattern

**Agente que responde reactivamente a eventos externos.**

```typescript
class ReactorAgent {
  private eventQueue: Event[] = [];
  private tools: Map<string, Tool> = new Map();

  async processEvent(event: Event): Promise<void> {
    // 1. Analizar evento con LLM
    const analysis = await this.llm.analyze(event);

    // 2. Determinar acción basada en análisis
    const action = this.determineAction(analysis);

    // 3. Ejecutar tool correspondiente
    if (action.tool && this.tools.has(action.tool)) {
      const result = await this.tools.get(action.tool).execute(action.params);
      await this.handleResult(result);
    }
  }

  private determineAction(analysis: Analysis): Action {
    // Lógica simple: mapear análisis directo a acción
    switch (analysis.type) {
      case 'user_query': return { tool: 'search', params: analysis.data };
      case 'error': return { tool: 'log_error', params: analysis.data };
      default: return { tool: 'unknown', params: {} };
    }
  }
}
```

**Cuándo usar:**
- ✅ Sistemas de monitoreo
- ✅ Chatbots reactivos
- ✅ Alertas automáticas
- ✅ Procesamiento de eventos en tiempo real

**Tradeoffs:**
- **Pros**: Simple, rápido, bajo overhead
- **Cons**: No planifica, limitado a respuestas directas

**Ejemplo real:** Agente que responde a errores en logs de aplicación.

---

### Plan-Execute-Synthesize Pattern

**Agente que planifica antes de actuar, ejecuta sistemáticamente, y sintetiza resultados.**

```typescript
interface PlanStep {
  id: string;
  description: string;
  tool: string;
  params: any;
  dependencies: string[]; // IDs de steps que deben completarse antes
}

class PlanningAgent {
  async execute(task: string): Promise<SynthesisResult> {
    // 1. PLAN: Descomponer tarea en steps
    const plan = await this.createPlan(task);

    // 2. EXECUTE: Ejecutar steps en orden correcto
    const results = await this.executePlan(plan);

    // 3. SYNTHESIZE: Combinar resultados en respuesta final
    return this.synthesizeResults(results);
  }

  private async createPlan(task: string): Promise<PlanStep[]> {
    const prompt = `Create a detailed plan for: ${task}
Return as JSON array of steps with dependencies.`;

    const response = await this.llm.generate(prompt);
    return JSON.parse(this.extractJSON(response));
  }

  private async executePlan(plan: PlanStep[]): Promise<StepResult[]> {
    const completed = new Map<string, StepResult>();
    const pending = [...plan];

    while (pending.length > 0) {
      // Encontrar steps ready para ejecutar
      const ready = pending.filter(step =>
        step.dependencies.every(dep => completed.has(dep))
      );

      // Ejecutar en paralelo si no hay dependencias entre ellos
      const results = await Promise.all(
        ready.map(step => this.executeStep(step))
      );

      // Marcar como completados
      results.forEach(result => completed.set(result.stepId, result));

      // Remover de pending
      pending.splice(0, ready.length);
    }

    return Array.from(completed.values());
  }
}
```

**Cuándo usar:**
- ✅ Tareas complejas multi-step
- ✅ Investigación y análisis
- ✅ Automatización de workflows
- ✅ Reportes y síntesis

**Tradeoffs:**
- **Pros**: Sistemático, confiable, maneja complejidad
- **Cons**: Más lento, mayor uso de tokens, overhead de planificación

**Ejemplo real:** Agente investigador que busca información, la analiza, y genera reportes.

---

### Chain Pattern

**Múltiples agentes especializados conectados en secuencia.**

```typescript
class ChainAgent {
  private agents: Agent[] = [];

  addAgent(agent: Agent): void {
    this.agents.push(agent);
  }

  async execute(input: any): Promise<any> {
    let currentInput = input;

    for (const agent of this.agents) {
      // Cada agente procesa output del anterior
      currentInput = await agent.process(currentInput);

      // Validar que el output es válido para siguiente agente
      if (!this.validateTransition(currentInput)) {
        throw new Error(`Invalid transition between agents`);
      }
    }

    return currentInput;
  }
}

// Ejemplo: Chain para procesamiento de código
const codeChain = new ChainAgent();
codeChain.addAgent(new CodeAnalyzerAgent());    // Analiza código
codeChain.addAgent(new SecurityCheckerAgent()); // Verifica seguridad
codeChain.addAgent(new OptimizerAgent());       // Optimiza
codeChain.addAgent(new FormatterAgent());       // Formatea
```

**Cuándo usar:**
- ✅ Pipelines de procesamiento
- ✅ Validación en capas
- ✅ Transformaciones secuenciales
- ✅ QA automatizado

**Tradeoffs:**
- **Pros**: Modular, testable, debugging fácil
- **Cons**: Latencia acumulada, fallo en un paso para todo

---

### Collaborative Pattern

**Múltiples agentes trabajando en paralelo y combinando resultados.**

```typescript
class CollaborativeAgent {
  private agents: Agent[] = [];

  async execute(task: Task): Promise<CollaborativeResult> {
    // Dividir tarea en subtareas
    const subtasks = await this.divideTask(task);

    // Ejecutar agentes en paralelo
    const promises = this.agents.map((agent, index) =>
      agent.execute(subtasks[index])
    );

    // Esperar todos los resultados
    const results = await Promise.all(promises);

    // Combinar resultados
    return this.combineResults(results);
  }

  private async divideTask(task: Task): Promise<Subtask[]> {
    const prompt = `Divide this task into ${this.agents.length} subtasks: ${task.description}`;
    const response = await this.llm.generate(prompt);
    return this.parseSubtasks(response);
  }

  private combineResults(results: AgentResult[]): CollaborativeResult {
    // Votación mayoritaria para decisiones
    // Promedio para métricas
    // Concatenación para texto
    return {
      consensus: this.findConsensus(results),
      alternatives: results,
      confidence: this.calculateConfidence(results)
    };
  }
}
```

**Cuándo usar:**
- ✅ Tareas paralelizables
- ✅ Validación cruzada
- ✅ Ensemble methods
- ✅ Búsqueda exhaustiva

**Tradeoffs:**
- **Pros**: Paralelo, robusto, mejor calidad
- **Cons**: Costoso, coordinación compleja

---

### Hierarchical Pattern

**Agentes organizados en estructura maestro-subordinado.**

```typescript
class HierarchicalAgent {
  private masterAgent: MasterAgent;
  private workerAgents: WorkerAgent[] = [];

  async execute(complexTask: ComplexTask): Promise<Result> {
    // Master descompone tarea compleja
    const subtasks = await this.masterAgent.decompose(complexTask);

    // Asigna subtareas a workers apropiados
    const assignments = this.assignSubtasks(subtasks);

    // Workers ejecutan en paralelo
    const results = await Promise.all(
      assignments.map(assignment =>
        assignment.worker.execute(assignment.subtask)
      )
    );

    // Master sintetiza resultados finales
    return this.masterAgent.synthesize(results);
  }

  private assignSubtasks(subtasks: Subtask[]): Assignment[] {
    return subtasks.map(subtask => ({
      subtask,
      worker: this.findBestWorker(subtask)
    }));
  }
}
```

**Cuándo usar:**
- ✅ Organizaciones complejas
- ✅ Especialización por dominio
- ✅ Control centralizado
- ✅ Escalabilidad horizontal

**Tradeoffs:**
- **Pros**: Escalabilidad, especialización
- **Cons**: Complejidad de coordinación, latencia

## 🔧 Patrones de Integración LLM

### Tool Use Pattern

**LLM que decide dinámicamente qué herramientas usar.**

```typescript
interface Tool {
  name: string;
  description: string;
  parameters: JSONSchema;
  execute: (params: any) => Promise<any>;
}

class ToolUseAgent {
  private tools: Tool[] = [];

  async execute(userQuery: string): Promise<string> {
    const messages = [{ role: 'user', content: userQuery }];

    while (true) {
      // Pedir al LLM que elija tool
      const response = await this.llm.chat({
        messages,
        tools: this.tools.map(t => ({
          name: t.name,
          description: t.description,
          parameters: t.parameters
        }))
      });

      if (response.toolCalls) {
        // Ejecutar tools
        for (const call of response.toolCalls) {
          const tool = this.tools.find(t => t.name === call.name);
          if (tool) {
            const result = await tool.execute(call.parameters);
            messages.push({
              role: 'tool',
              content: JSON.stringify(result)
            });
          }
        }
      } else {
        // Respuesta final
        return response.content;
      }
    }
  }
}
```

**Cuándo usar:**
- ✅ Agentes versátiles
- ✅ Integración con sistemas externos
- ✅ Automatización flexible

---

### Retrieval Augmented Generation (RAG)

**LLM potenciado con base de conocimiento externa.**

```typescript
class RAGSystem {
  private vectorDB: VectorDatabase;
  private embedder: Embedder;

  async query(question: string): Promise<string> {
    // 1. Convertir pregunta a embedding
    const questionEmbedding = await this.embedder.embed(question);

    // 2. Buscar documentos relevantes
    const relevantDocs = await this.vectorDB.search(questionEmbedding, {
      limit: 5,
      threshold: 0.8
    });

    // 3. Crear contexto con documentos encontrados
    const context = relevantDocs.map(doc => doc.content).join('\n\n');

    // 4. Generar respuesta con contexto
    const prompt = `Context:\n${context}\n\nQuestion: ${question}\n\nAnswer:`;

    return this.llm.generate(prompt);
  }

  async addDocument(content: string): Promise<void> {
    const embedding = await this.embedder.embed(content);
    await this.vectorDB.insert({ content, embedding });
  }
}
```

**Cuándo usar:**
- ✅ Conocimiento actualizado
- ✅ Dominios específicos
- ✅ Reducción de hallucinations
- ✅ Transparencia de fuentes

---

### Fine-tuning Pattern

**Modelo personalizado entrenado con datos específicos.**

```typescript
class FineTunedAgent {
  private baseModel: LLM;
  private fineTunedModel: LLM;

  async shouldUseFineTuned(query: string): Promise<boolean> {
    // Decidir si usar modelo fine-tuned vs base
    const analysis = await this.baseModel.analyze(query);

    return analysis.domainSpecificity > 0.8 &&
           analysis.complexity > 0.7;
  }

  async execute(query: string): Promise<string> {
    if (await this.shouldUseFineTuned(query)) {
      return this.fineTunedModel.generate(query);
    } else {
      return this.baseModel.generate(query);
    }
  }
}

// Training data format
interface TrainingExample {
  prompt: string;
  completion: string;
  domain: string;
  quality: number;
}
```

**Cuándo usar:**
- ✅ Terminología específica
- ✅ Estilo consistente
- ✅ Rendimiento mejorado
- ✅ Costo reducido a largo plazo

---

### Ensemble Pattern

**Múltiples LLMs votando para mejor respuesta.**

```typescript
class EnsembleAgent {
  private models: LLM[] = [];

  async execute(query: string): Promise<EnsembleResult> {
    // Ejecutar todos los modelos en paralelo
    const responses = await Promise.all(
      this.models.map(model => model.generate(query))
    );

    // Aplicar estrategias de ensemble
    const consensus = this.findConsensus(responses);
    const confidence = this.calculateConfidence(responses);

    return {
      answer: consensus,
      confidence,
      alternatives: responses,
      reasoning: this.explainConsensus(responses)
    };
  }

  private findConsensus(responses: string[]): string {
    // Votación mayoritaria para respuestas categóricas
    // Promedio para respuestas numéricas
    // Concatenación inteligente para texto

    const scores = new Map<string, number>();
    responses.forEach(response => {
      const normalized = this.normalizeResponse(response);
      scores.set(normalized, (scores.get(normalized) || 0) + 1);
    });

    return Array.from(scores.entries())
      .sort((a, b) => b[1] - a[1])[0][0];
  }
}
```

**Cuándo usar:**
- ✅ Alta confiabilidad requerida
- ✅ Reducción de errores
- ✅ Validación cruzada

---

### Fallback Pattern

**LLM principal con respaldo automático.**

```typescript
class FallbackAgent {
  private primaryLLM: LLM;
  private fallbackLLM: LLM;

  async execute(query: string): Promise<string> {
    try {
      const result = await this.primaryLLM.generate(query);

      // Validar calidad de respuesta
      if (this.isValidResponse(result)) {
        return result;
      } else {
        return await this.fallback(query, 'Low quality response');
      }
    } catch (error) {
      return this.fallback(query, error.message);
    }
  }

  private async fallback(query: string, reason: string): Promise<string> {
    console.warn(`Fallback triggered: ${reason}`);

    // Usar modelo más conservador o con instrucciones diferentes
    const fallbackPrompt = `Please provide a careful, conservative answer: ${query}`;

    return this.fallbackLLM.generate(fallbackPrompt);
  }

  private isValidResponse(response: string): boolean {
    return response.length > 10 &&
           !response.includes('uncertain') &&
           this.hasConcreteAnswer(response);
  }
}
```

**Cuándo usar:**
- ✅ Alta disponibilidad
- ✅ Sistemas críticos
- ✅ Manejo de fallos

## 📊 Patrones de Estado

### Stateless Pattern

**Cada request es independiente, sin estado entre llamadas.**

```typescript
class StatelessAgent {
  async execute(query: string, context?: any): Promise<Response> {
    // Toda la información necesaria viene en el request
    const prompt = this.buildPrompt(query, context);

    const response = await this.llm.generate(prompt);

    // No se guarda estado entre requests
    return { answer: response, sessionId: null };
  }
}
```

**Cuándo usar:**
- ✅ APIs públicas
- ✅ Escalabilidad máxima
- ✅ Simplicidad

**Tradeoffs:**
- **Pros**: Simple, escalable, stateless
- **Cons**: Repetición, no aprendizaje, limitado contexto

---

### Lightweight State Pattern

**Estado temporal en memoria durante sesión.**

```typescript
class SessionAgent {
  private sessions: Map<string, Session> = new Map();

  async execute(query: string, sessionId: string): Promise<Response> {
    let session = this.sessions.get(sessionId);

    if (!session) {
      session = this.createSession(sessionId);
      this.sessions.set(sessionId, session);
    }

    // Actualizar estado basado en query
    session.history.push(query);
    session.lastActivity = Date.now();

    const context = this.buildContext(session);
    const response = await this.llm.generate(context + query);

    // Actualizar estado con respuesta
    session.history.push(response);

    return { answer: response, sessionId };
  }

  private createSession(sessionId: string): Session {
    return {
      id: sessionId,
      history: [],
      createdAt: Date.now(),
      lastActivity: Date.now(),
      metadata: {}
    };
  }
}
```

**Cuándo usar:**
- ✅ Conversaciones
- ✅ Contexto temporal
- ✅ Sesiones de usuario

---

### Persistent State Pattern

**Estado durable en base de datos.**

```typescript
class PersistentAgent {
  private db: Database;

  async execute(query: string, userId: string): Promise<Response> {
    // Cargar estado del usuario
    const userState = await this.db.getUserState(userId);

    // Actualizar estado
    userState.lastQuery = query;
    userState.queryCount++;
    userState.preferences = this.updatePreferences(userState, query);

    // Generar respuesta con contexto histórico
    const context = this.buildContext(userState);
    const response = await this.llm.generate(context + query);

    // Persistir cambios
    await this.db.saveUserState(userId, userState);

    return { answer: response, userId };
  }
}
```

**Cuándo usar:**
- ✅ Personalización
- ✅ Historial largo
- ✅ Aprendizaje continuo

---

### Hybrid State Pattern

**Cache rápido + base de datos para durabilidad.**

```typescript
class HybridAgent {
  private cache: Cache;
  private db: Database;

  async execute(query: string, userId: string): Promise<Response> {
    // Intentar cache primero
    let userState = await this.cache.get(`user:${userId}`);

    if (!userState) {
      // Fallback a DB
      userState = await this.db.getUserState(userId);

      // Popular cache
      await this.cache.set(`user:${userId}`, userState, 3600); // 1 hora
    }

    // Procesar como siempre
    const response = await this.processWithState(query, userState);

    // Actualizar ambos stores
    await Promise.all([
      this.cache.set(`user:${userId}`, userState, 3600),
      this.db.saveUserState(userId, userState)
    ]);

    return response;
  }
}
```

**Cuándo usar:**
- ✅ Alto rendimiento
- ✅ Alta disponibilidad
- ✅ Datos críticos

## 🔒 Patrones de Seguridad

### Sandbox Pattern

**Ejecución aislada de herramientas potencialmente peligrosas.**

```typescript
class SandboxedAgent {
  async executeTool(toolName: string, params: any): Promise<any> {
    // Crear container aislado
    const container = await this.createSandbox();

    try {
      // Ejecutar tool dentro del sandbox
      const result = await container.execute(toolName, params);

      // Validar resultado antes de devolver
      return this.validateResult(result);
    } finally {
      // Limpiar sandbox
      await container.destroy();
    }
  }

  private async createSandbox(): Promise<Sandbox> {
    return Docker.createContainer({
      image: 'secure-runtime',
      network: 'isolated',
      memory: '256MB',
      cpu: '0.5',
      readOnly: true,
      tmpfs: { '/tmp': '' }
    });
  }
}
```

**Cuándo usar:**
- ✅ Tools no confiables
- ✅ Código de usuario
- ✅ Acceso a filesystem

---

### Validation Pattern

**Validación estricta de inputs y outputs.**

```typescript
class ValidatedAgent {
  private inputSchema: Schema;
  private outputSchema: Schema;

  async execute(input: any): Promise<any> {
    // Validar input
    const validatedInput = this.validateInput(input);

    // Procesar
    const rawOutput = await this.llm.generate(validatedInput);

    // Validar output
    const validatedOutput = this.validateOutput(rawOutput);

    return validatedOutput;
  }

  private validateInput(input: any): ValidatedInput {
    try {
      return this.inputSchema.parse(input);
    } catch (error) {
      throw new ValidationError(`Invalid input: ${error.message}`);
    }
  }

  private validateOutput(output: any): ValidatedOutput {
    // Intentar parsear como JSON
    try {
      const parsed = JSON.parse(output);
      return this.outputSchema.parse(parsed);
    } catch {
      // Si no es JSON válido, intentar extraer información útil
      return this.fallbackValidation(output);
    }
  }
}
```

**Cuándo usar:**
- ✅ APIs públicas
- ✅ Datos de usuario
- ✅ Integraciones críticas

---

### Rate Limiting Pattern

**Protección contra abuso y sobrecarga.**

```typescript
class RateLimitedAgent {
  private limiter: RateLimiter;

  async execute(query: string, userId: string): Promise<Response> {
    // Verificar rate limit
    const allowed = await this.limiter.check(userId, {
      windowMs: 60000,    // 1 minuto
      maxRequests: 10     // 10 requests por minuto
    });

    if (!allowed) {
      throw new RateLimitError('Too many requests');
    }

    // Procesar normalmente
    return this.processQuery(query);
  }
}

// Multi-level rate limiting
class MultiLevelLimiter {
  async check(userId: string, config: RateLimitConfig): Promise<boolean> {
    const checks = await Promise.all([
      this.userLimiter.check(userId, config),
      this.globalLimiter.check('global', config),
      this.endpointLimiter.check('endpoint', config)
    ]);

    return checks.every(check => check);
  }
}
```

**Cuándo usar:**
- ✅ APIs públicas
- ✅ Recursos limitados
- ✅ Prevención de abuso

---

### Logging & Audit Pattern

**Trazabilidad completa de todas las operaciones.**

```typescript
class AuditedAgent {
  private logger: StructuredLogger;
  private auditTrail: AuditTrail;

  async execute(query: string, context: RequestContext): Promise<Response> {
    const requestId = generateId();
    const startTime = Date.now();

    // Log entrada
    await this.logger.info('Agent execution started', {
      requestId,
      userId: context.userId,
      query: this.sanitizeQuery(query),
      timestamp: startTime
    });

    try {
      const result = await this.processQuery(query, context);

      // Log éxito
      await this.logger.info('Agent execution completed', {
        requestId,
        duration: Date.now() - startTime,
        resultSize: JSON.stringify(result).length
      });

      // Audit trail
      await this.auditTrail.record({
        requestId,
        userId: context.userId,
        action: 'agent_execute',
        status: 'success',
        metadata: { queryLength: query.length }
      });

      return result;

    } catch (error) {
      // Log error
      await this.logger.error('Agent execution failed', {
        requestId,
        error: error.message,
        stack: error.stack,
        duration: Date.now() - startTime
      });

      // Audit trail de error
      await this.auditTrail.record({
        requestId,
        userId: context.userId,
        action: 'agent_execute',
        status: 'error',
        metadata: { errorType: error.constructor.name }
      });

      throw error;
    }
  }
}
```

**Cuándo usar:**
- ✅ Sistemas críticos
- ✅ Cumplimiento regulatorio
- ✅ Debugging de producción
- ✅ Análisis forense

## Decision Tree: ¿Qué Patrón Usar?

```
¿Es una tarea simple y directa?
├── Sí → Reactor Pattern
└── No → ¿Requiere planificación?
    ├── Sí → Plan-Execute-Synthesize
    └── No → ¿Es una pipeline secuencial?
        ├── Sí → Chain Pattern
        └── No → ¿Se puede paralelizar?
            ├── Sí → Collaborative Pattern
            └── No → Hierarchical Pattern
```

## Conclusión

**Los patrones no son recetas rígidas, sino herramientas para pensar arquitectónicamente.** El mejor patrón es aquel que:

- Resuelve tu problema específico
- Tiene tradeoffs aceptables
- Se puede implementar con tus recursos
- Evoluciona con tus necesidades

**Pregunta clave**: ¿Qué patrón mejor modela cómo quieres que tu sistema IA se comporte?

> *"La arquitectura de IA no se trata de usar el patrón más moderno, sino del patrón que mejor expresa la esencia de tu problema."*

Próximos: [Decisiones de Diseño](./design-decisions.md) - tradeoffs concretos para cada aspecto de sistemas IA. ⚖️
