---
sidebar_position: 4
---

# Agente Investigador

El siguiente nivel en construcción de agentes: el patrón **Plan-Execute-Synthesize**. De agentes reactivos simples a investigadores inteligentes que planifican, ejecutan estrategias complejas, y sintetizan conocimiento profundo.

## Patrón Plan-Execute-Synthesize

### ¿Por Qué Este Patrón?

Los agentes simples (como el [Agente de Tareas](./agente-tareas.md)) responden directamente a inputs. Los agentes investigadores **piensan primero, actúan después**.

```
Input → PLANIFICACIÓN → EJECUCIÓN → SÍNTESIS → Output
```

**Ejemplo conceptual:**
- **Input**: "Investiga el impacto de la IA en el desarrollo de software"
- **Plan**: Desglosar en subtareas (metricas, casos reales, tendencias)
- **Execute**: Buscar datos, analizar estudios, entrevistar expertos
- **Synthesize**: Crear reporte comprehensivo con insights

### Arquitectura del Patrón

```typescript
interface InvestigationPlan {
  id: string;
  title: string;
  subtasks: Subtask[];
  dependencies: Dependency[];
  estimatedTime: number;
  resources: Resource[];
}

interface Subtask {
  id: string;
  description: string;
  type: 'research' | 'analysis' | 'synthesis' | 'validation';
  tools: Tool[];
  estimatedTime: number;
  successCriteria: string[];
}

interface InvestigationResult {
  plan: InvestigationPlan;
  execution: ExecutionResult[];
  synthesis: SynthesisResult;
  metadata: InvestigationMetadata;
}
```

## Construcción Paso a Paso

### Paso 1: Arquitectura Base

```typescript:src/agents/investigation-agent.ts
import { Anthropic } from '@anthropic-ai/sdk';
import { z } from 'zod';

const InvestigationPlanSchema = z.object({
  title: z.string(),
  subtasks: z.array(z.object({
    id: z.string(),
    description: z.string(),
    type: z.enum(['research', 'analysis', 'synthesis', 'validation']),
    tools: z.array(z.string()),
    estimatedTime: z.number(),
    successCriteria: z.array(z.string())
  })),
  dependencies: z.array(z.object({
    from: z.string(),
    to: z.string(),
    type: z.enum(['requires', 'enhances', 'parallel'])
  }))
});

export class InvestigationAgent {
  private client: Anthropic;
  private tools: Map<string, Tool> = new Map();
  private memory: InvestigationMemory;

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
    this.memory = new InvestigationMemory();
    this.initializeTools();
  }

  async investigate(topic: string): Promise<InvestigationResult> {
    // 1. PLAN: Crear plan de investigación
    const plan = await this.createInvestigationPlan(topic);

    // 2. EXECUTE: Ejecutar plan
    const executionResults = await this.executePlan(plan);

    // 3. SYNTHESIZE: Sintetizar resultados
    const synthesis = await this.synthesizeResults(plan, executionResults);

    return {
      plan,
      execution: executionResults,
      synthesis,
      metadata: {
        topic,
        duration: Date.now() - Date.now(), // Calcular duración real
        toolsUsed: this.getToolsUsed(executionResults),
        quality: this.assessQuality(synthesis)
      }
    };
  }
}
```

### Paso 2: Planificación Inteligente

```typescript:src/agents/planning-engine.ts
export class PlanningEngine {
  async createPlan(topic: string): Promise<InvestigationPlan> {
    const prompt = `Create a comprehensive investigation plan for: "${topic}"

Break down the investigation into logical subtasks with dependencies.

For each subtask, specify:
- Type: research, analysis, synthesis, or validation
- Tools needed
- Estimated time in minutes
- Success criteria

Consider dependencies between subtasks.

Return as JSON matching this schema:
{
  "title": "Investigation title",
  "subtasks": [
    {
      "id": "unique_id",
      "description": "What to do",
      "type": "research|analysis|synthesis|validation",
      "tools": ["tool1", "tool2"],
      "estimatedTime": 30,
      "successCriteria": ["Criterion 1", "Criterion 2"]
    }
  ],
  "dependencies": [
    {
      "from": "subtask1",
      "to": "subtask2",
      "type": "requires|enhances|parallel"
    }
  ]
}`;

    const response = await this.llm.generate(prompt);
    const planData = JSON.parse(this.extractJSON(response));

    return InvestigationPlanSchema.parse(planData);
  }

  private extractJSON(text: string): string {
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    return jsonMatch ? jsonMatch[1] : text;
  }
}
```

### Paso 3: Ejecución con Manejo de Dependencias

```typescript:src/agents/execution-engine.ts
export class ExecutionEngine {
  async executePlan(plan: InvestigationPlan): Promise<ExecutionResult[]> {
    const results = new Map<string, ExecutionResult>();
    const pending = new Set(plan.subtasks.map(s => s.id));
    const executing = new Set<string>();

    while (pending.size > 0) {
      // Encontrar subtasks ready para ejecutar
      const readyTasks = plan.subtasks.filter(subtask => {
        if (!pending.has(subtask.id) || executing.has(subtask.id)) return false;

        // Verificar dependencias
        return plan.dependencies
          .filter(dep => dep.to === subtask.id && dep.type === 'requires')
          .every(dep => results.has(dep.from));
      });

      if (readyTasks.length === 0) {
        // Deadlock detection
        throw new Error('Circular dependency or impossible plan detected');
      }

      // Ejecutar tasks ready en paralelo
      const executionPromises = readyTasks.map(async (task) => {
        executing.add(task.id);
        pending.delete(task.id);

        try {
          const result = await this.executeSubtask(task);
          results.set(task.id, result);
          return result;
        } finally {
          executing.delete(task.id);
        }
      });

      await Promise.all(executionPromises);
    }

    return Array.from(results.values());
  }

  private async executeSubtask(subtask: Subtask): Promise<ExecutionResult> {
    const startTime = Date.now();

    try {
      // Seleccionar tools apropiadas
      const toolResults = await Promise.all(
        subtask.tools.map(toolName => {
          const tool = this.tools.get(toolName);
          if (!tool) throw new Error(`Tool ${toolName} not found`);
          return tool.execute(subtask);
        })
      );

      const result = {
        subtaskId: subtask.id,
        success: true,
        data: toolResults,
        duration: Date.now() - startTime,
        quality: this.assessQuality(toolResults, subtask.successCriteria)
      };

      return result;

    } catch (error) {
      return {
        subtaskId: subtask.id,
        success: false,
        error: error.message,
        duration: Date.now() - startTime,
        data: []
      };
    }
  }
}
```

### Paso 4: Síntesis Inteligente

```typescript:src/agents/synthesis-engine.ts
export class SynthesisEngine {
  async synthesizeResults(
    plan: InvestigationPlan,
    executionResults: ExecutionResult[]
  ): Promise<SynthesisResult> {

    // Preparar datos para síntesis
    const successfulResults = executionResults.filter(r => r.success);
    const failedResults = executionResults.filter(r => !r.success);

    // Crear contexto comprehensivo
    const synthesisContext = this.buildSynthesisContext(plan, successfulResults);

    const prompt = `Synthesize a comprehensive investigation report based on the following:

INVESTIGATION TOPIC: ${plan.title}

EXECUTION SUMMARY:
- Total subtasks: ${plan.subtasks.length}
- Successful: ${successfulResults.length}
- Failed: ${failedResults.length}

DETAILED RESULTS:
${synthesisContext}

SYNTHESIS REQUIREMENTS:
1. Executive Summary (2-3 paragraphs)
2. Key Findings (bullet points)
3. Detailed Analysis (sections by subtask type)
4. Conclusions and Recommendations
5. Future Research Directions
6. Confidence Assessment

Structure the response with clear headings and actionable insights.
Assess the quality and completeness of the investigation.`;

    const synthesis = await this.llm.generate(prompt, {
      maxTokens: 4000,
      temperature: 0.3 // Más determinístico para síntesis
    });

    return {
      summary: this.extractSection(synthesis, 'Executive Summary'),
      findings: this.extractFindings(synthesis),
      analysis: this.extractSection(synthesis, 'Detailed Analysis'),
      conclusions: this.extractSection(synthesis, 'Conclusions'),
      recommendations: this.extractSection(synthesis, 'Recommendations'),
      quality: this.assessSynthesisQuality(synthesis, plan),
      confidence: this.calculateConfidence(successfulResults, failedResults)
    };
  }

  private buildSynthesisContext(plan: InvestigationPlan, results: ExecutionResult[]): string {
    return results.map(result => {
      const subtask = plan.subtasks.find(s => s.id === result.subtaskId);
      return `
SUBTASK: ${subtask?.description}
TYPE: ${subtask?.type}
DURATION: ${result.duration}ms
QUALITY: ${result.quality}/10

RESULTS:
${JSON.stringify(result.data, null, 2)}
`;
    }).join('\n---\n');
  }
}
```

## Manejo de Memoria y Contexto

### Memoria de Investigación

```typescript:src/memory/investigation-memory.ts
export class InvestigationMemory {
  private investigations: Map<string, Investigation> = new Map();
  private learnings: Learning[] = [];

  // Recordar patrones exitosos
  recordSuccessfulPattern(topic: string, plan: InvestigationPlan, result: InvestigationResult) {
    const pattern: SuccessfulPattern = {
      topic,
      planStructure: this.extractPlanStructure(plan),
      quality: result.metadata.quality,
      duration: result.metadata.duration,
      tools: result.metadata.toolsUsed
    };

    this.learningPatterns.push(pattern);
  }

  // Aprender de errores
  recordFailure(topic: string, error: Error, context: any) {
    this.failurePatterns.push({
      topic,
      error: error.message,
      context,
      timestamp: Date.now()
    });
  }

  // Sugerir mejoras basadas en memoria
  suggestImprovements(topic: string): ImprovementSuggestion[] {
    const relevantPatterns = this.findRelevantPatterns(topic);

    return relevantPatterns.map(pattern => ({
      type: 'plan_optimization',
      suggestion: `Based on similar investigation "${pattern.topic}", consider ${pattern.improvement}`,
      confidence: pattern.successRate
    }));
  }

  // Contexto acumulado
  buildContextForTopic(topic: string): ContextualMemory {
    return {
      previousInvestigations: this.findRelatedInvestigations(topic),
      learnedPatterns: this.findRelevantPatterns(topic),
      commonPitfalls: this.findCommonErrors(topic),
      successfulStrategies: this.findSuccessfulStrategies(topic)
    };
  }
}
```

### Contexto Evolutivo

```typescript:src/agents/context-manager.ts
export class ContextManager {
  private contextStack: Context[] = [];

  // Evolucionar contexto durante investigación
  updateContext(newFindings: any): void {
    const currentContext = this.getCurrentContext();

    // Integrar nuevos findings
    const updatedContext = this.mergeContexts(currentContext, {
      findings: newFindings,
      timestamp: Date.now(),
      confidence: this.assessFindingConfidence(newFindings)
    });

    this.contextStack.push(updatedContext);
  }

  // Resolver ambigüedades con contexto
  resolveAmbiguity(question: string): ResolvedAnswer {
    const context = this.getCurrentContext();

    // Buscar información relevante en contexto acumulado
    const relevantInfo = this.searchContext(question, context);

    if (relevantInfo.confidence > 0.8) {
      return {
        answer: relevantInfo.data,
        confidence: relevantInfo.confidence,
        source: 'context_memory'
      };
    }

    return {
      answer: null,
      needsResearch: true,
      suggestedQuestions: this.generateFollowUpQuestions(question, context)
    };
  }

  // Generar insights emergentes
  generateInsights(): Insight[] {
    const context = this.getCurrentContext();

    return this.insightEngine.analyze(context).map(insight => ({
      type: insight.type,
      description: insight.description,
      confidence: insight.confidence,
      supportingEvidence: insight.evidence
    }));
  }
}
```

## Debugging de Agentes Complejos

### Logging Estructurado

```typescript:src/debugging/agent-debugger.ts
export class AgentDebugger {
  private logs: DebugLog[] = [];

  logPhase(phase: string, data: any): void {
    this.logs.push({
      timestamp: Date.now(),
      phase,
      data,
      contextId: this.currentContextId
    });

    // Log estructurado
    console.log(JSON.stringify({
      level: 'info',
      phase,
      contextId: this.currentContextId,
      data: this.sanitizeData(data)
    }));
  }

  // Tracing de decisiones
  traceDecision(decision: Decision, reasoning: string[]): void {
    this.logs.push({
      timestamp: Date.now(),
      phase: 'decision',
      data: { decision, reasoning },
      contextId: this.currentContextId
    });
  }

  // Performance monitoring
  recordPerformance(operation: string, duration: number, success: boolean): void {
    this.performanceMetrics.push({
      operation,
      duration,
      success,
      timestamp: Date.now()
    });
  }

  // Error analysis
  analyzeErrors(): ErrorAnalysis {
    const errors = this.logs.filter(log => log.phase === 'error');

    return {
      totalErrors: errors.length,
      errorTypes: this.categorizeErrors(errors),
      commonPatterns: this.findErrorPatterns(errors),
      suggestions: this.generateErrorSuggestions(errors)
    };
  }

  // Visualización de ejecución
  generateExecutionGraph(plan: InvestigationPlan, results: ExecutionResult[]): string {
    // Generar graphviz DOT format para visualización
    return `
digraph Investigation {
  ${plan.subtasks.map(task => `"${task.id}" [label="${task.description}"]`).join('\n  ')}

  ${plan.dependencies.map(dep => `"${dep.from}" -> "${dep.to}" [label="${dep.type}"]`).join('\n  ')}

  ${results.map(result => {
    const color = result.success ? 'green' : 'red';
    return `"${result.subtaskId}" [color=${color}]`;
  }).join('\n  ')}
}`;
  }
}
```

### Herramientas de Debugging

```typescript:src/debugging/debug-tools.ts
export class DebugTools {
  // Simular ejecución paso a paso
  async debugExecute(plan: InvestigationPlan, stepCallback?: (step: any) => void): Promise<ExecutionResult[]> {
    const results: ExecutionResult[] = [];

    for (const subtask of plan.subtasks) {
      if (stepCallback) {
        await stepCallback({ type: 'starting', subtask });
      }

      const result = await this.executeWithDebugging(subtask);

      if (stepCallback) {
        await stepCallback({ type: 'completed', subtask, result });
      }

      results.push(result);
    }

    return results;
  }

  // Validar plan antes de ejecución
  validatePlan(plan: InvestigationPlan): ValidationResult {
    const issues: ValidationIssue[] = [];

    // Verificar dependencias circulares
    if (this.hasCircularDependencies(plan.dependencies)) {
      issues.push({
        severity: 'error',
        message: 'Circular dependency detected',
        suggestion: 'Review and fix dependency graph'
      });
    }

    // Verificar recursos disponibles
    for (const subtask of plan.subtasks) {
      const missingTools = subtask.tools.filter(tool => !this.toolRegistry.has(tool));
      if (missingTools.length > 0) {
        issues.push({
          severity: 'warning',
          message: `Missing tools: ${missingTools.join(', ')}`,
          suggestion: 'Add missing tools or adjust subtask requirements'
        });
      }
    }

    return {
      isValid: issues.filter(i => i.severity === 'error').length === 0,
      issues
    };
  }

  // Generar reportes de debugging
  generateDebugReport(plan: InvestigationPlan, results: ExecutionResult[]): DebugReport {
    return {
      executionSummary: this.summarizeExecution(results),
      performanceAnalysis: this.analyzePerformance(results),
      errorAnalysis: this.analyzeErrors(results),
      planQuality: this.assessPlanQuality(plan),
      recommendations: this.generateRecommendations(plan, results)
    };
  }
}
```

## Ejemplo Completo: Investigación de Mercado

```typescript
// Ejemplo: Investigar "Tendencias en desarrollo móvil 2024"
const agent = new InvestigationAgent(process.env.ANTHROPIC_API_KEY);

const result = await agent.investigate("Tendencias en desarrollo móvil 2024");

console.log("Plan creado:", result.plan.title);
console.log("Subtasks ejecutadas:", result.execution.length);
console.log("Síntesis generada:", result.synthesis.summary);

// Output esperado:
// Plan: "Investigation: Mobile Development Trends 2024"
// Subtasks: [research_frameworks, analyze_adoption, validate_predictions, synthesize_report]
// Síntesis: Comprehensive report on React Native, Flutter, native development trends
```

## Optimizaciones Avanzadas

### Paralelización Inteligente

```typescript:src/optimization/parallel-executor.ts
export class ParallelExecutor {
  async executeWithOptimization(plan: InvestigationPlan): Promise<ExecutionResult[]> {
    // Analizar grafo de dependencias
    const dependencyGraph = this.buildDependencyGraph(plan);

    // Encontrar caminos críticos
    const criticalPath = this.findCriticalPath(dependencyGraph);

    // Paralelizar donde sea posible
    const executionPlan = this.optimizeForParallelism(plan, criticalPath);

    return this.executeOptimizedPlan(executionPlan);
  }

  private optimizeForParallelism(plan: InvestigationPlan, criticalPath: string[]): OptimizedPlan {
    // Agrupar subtasks que pueden ejecutarse en paralelo
    const parallelGroups = this.groupParallelTasks(plan, criticalPath);

    // Asignar recursos basado en complejidad
    const resourceAllocation = this.allocateResources(parallelGroups);

    return {
      parallelGroups,
      resourceAllocation,
      estimatedDuration: this.calculateOptimizedDuration(parallelGroups)
    };
  }
}
```

### Caching Inteligente

```typescript:src/optimization/smart-cache.ts
export class SmartCache {
  private cache: Map<string, CachedResult> = new Map();

  async getOrCompute(key: string, computeFn: () => Promise<any>): Promise<any> {
    // Verificar cache
    const cached = this.cache.get(key);
    if (cached && !this.isExpired(cached)) {
      return cached.data;
    }

    // Computar si no está en cache o expiró
    const result = await computeFn();

    // Cachear resultado
    this.cache.set(key, {
      data: result,
      timestamp: Date.now(),
      ttl: this.calculateTTL(result)
    });

    return result;
  }

  // Invalidar cache basado en cambios
  invalidateRelated(topic: string): void {
    const keysToDelete = Array.from(this.cache.keys())
      .filter(key => key.includes(topic));

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  // Pre-warming para topics relacionados
  async warmCache(relatedTopics: string[]): Promise<void> {
    const warmingPromises = relatedTopics.map(topic =>
      this.getOrCompute(`prewarm_${topic}`, async () => {
        // Computación ligera para pre-warming
        return { topic, prewarmed: true };
      })
    );

    await Promise.all(warmingPromises);
  }
}
```

## Conclusión

El patrón **Plan-Execute-Synthesize** eleva a los agentes de herramientas reactivas a **investigadores inteligentes**. La diferencia clave:

- **Agentes simples**: Responden directamente
- **Agentes investigadores**: Piensan, planifican, ejecutan sistemáticamente, y sintetizan conocimiento

**Próximos pasos:**
1. Experimenta con topics complejos
2. Añade más tools especializadas
3. Implementa caching y optimizaciones
4. Explora [MCP Servers](./mcp-servers.md) para tools más poderosas

¿Tu agente investigador ya está funcionando? ¿Qué insights ha descubierto? 🔍
