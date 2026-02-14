---
slug: orquestacion-agentes-hooks
title: "Orquestación de Agentes con Hooks: El Patrón que Cambia Todo"
authors: [TellMeAlex]
tags: [ia, agentes, hooks, orquestación, patrones]
image: /img/blog-header.jpg
---

# Orquestación de Agentes con Hooks: El Patrón que Cambia Todo

¿Te imaginas coordinar un equipo de agentes de IA donde cada uno tiene un rol específico, se comunican entre sí, y responden a eventos en tiempo real? Esto no es ciencia ficción: es la **orquestación basada en hooks**, el patrón arquitectónico que está transformando cómo construimos sistemas multi-agente.

<!-- truncate -->

## El Problema: La Complejidad Multi-Agente

Cuando trabajamos con múltiples agentes de IA, surgen desafíos únicos:

- **Coordinación**: ¿Cómo haces que tres agentes colaboren sin crear un caos de llamadas?
- **Control**: ¿Cómo limitas qué puede hacer cada agente sin bloquear su utilidad?
- **Observabilidad**: ¿Cómo sabes qué agente hizo qué cosa y cuándo?
- **Extensibilidad**: ¿Cómo añades nuevos comportamientos sin romper lo existente?

> **La realidad**: Sin un patrón claro, los sistemas multi-agente se convierten en espagueti inmantenible.

### Síntomas de una Mala Arquitectura

Los signos de que tu sistema necesita orquestación:

1. **Lógica duplicada**: El mismo código de validación en 5 lugares diferentes
2. **Debugging imposible**: No sabes quién modificó qué dato
3. **Miedos a cambios**: Añadir una feature simple rompe tres cosas
4. **Timeouts y race conditions**: Agentes pisándose entre sí

---

## Qué es la Orquestación Basada en Hooks

Un **hook** es un punto de extensión en el ciclo de vida de un agente donde puedes inyectar lógica personalizada. Piensa en ello como un sistema de eventos, pero con estructura y orden.

### Analogía: El Director de Orquesta

Imagina una orquesta sinfónica:
- El **director** es el orquestador
- Los **músicos** son los agentes
- Las **partituras** son los hooks

El director no toca cada instrumento, pero define **cuándo** y **cómo** cada músico debe actuar. Los hooks hacen exactamente eso para tus agentes.

### Tipos de Hooks Principales

| Tipo | Cuándo se Ejecuta | Caso de Uso |
|------|------------------|-------------|
| **Pre-tool** | Antes de ejecutar una herramienta | Validación, logging, rate limiting |
| **Post-tool** | Después de ejecutar una herramienta | Procesamiento de resultados, caché |
| **Lifecycle** | Eventos del ciclo de vida del agente | Inicialización, cleanup, error handling |
| **Decision** | Cuando el agente debe tomar una decisión | Routing, delegación, priorización |

---

## Patrones de Hooks en Detalle

### 1. Pre-Tool Hooks: El Guardián

Se ejecutan antes de que un agente use cualquier herramienta. Son tu primera línea de defensa.

```typescript
interface PreToolHook {
  toolName: string;
  agentId: string;
  params: Record<string, any>;
}

async function preToolValidator(hook: PreToolHook): Promise<boolean> {
  // Rate limiting por agente
  const rateLimiter = new RateLimiter(hook.agentId, 100, 'minute');
  if (!rateLimiter.check()) {
    throw new Error('Rate limit exceeded');
  }

  // Validación de parámetros
  const schema = getToolSchema(hook.toolName);
  if (!schema.validate(hook.params)) {
    throw new Error('Invalid parameters');
  }

  // Log de auditoría
  await auditLog.record({
    agent: hook.agentId,
    tool: hook.toolName,
    timestamp: Date.now(),
    action: 'tool_call_start'
  });

  return true; // Permitir ejecución
}
```

**Casos de uso:**
- Validación de permisos
- Rate limiting
- Sanitización de inputs
- Auditoría y compliance

### 2. Post-Tool Hooks: El Procesador

Se ejecutan después de que la herramienta completa su trabajo. Perfectos para transformar o cachear resultados.

```typescript
interface PostToolHook {
  toolName: string;
  agentId: string;
  result: any;
  duration: number;
  success: boolean;
}

async function postToolProcessor(hook: PostToolHook): Promise<any> {
  // Cachear resultados exitosos
  if (hook.success && isCacheable(hook.toolName)) {
    await cache.set(
      generateCacheKey(hook.toolName, hook.agentId),
      hook.result,
      { ttl: 3600 }
    );
  }

  // Métricas de rendimiento
  metrics.record({
    tool: hook.toolName,
    duration: hook.duration,
    success: hook.success,
    agent: hook.agentId
  });

  // Notificar a otros agentes si es necesario
  if (shouldBroadcast(hook.toolName)) {
    await eventBus.publish('tool:completed', {
      tool: hook.toolName,
      agent: hook.agentId,
      summary: summarizeResult(hook.result)
    });
  }

  return hook.result;
}
```

**Casos de uso:**
- Caché de respuestas
- Transformación de datos
- Métricas y observabilidad
- Notificaciones

### 3. Lifecycle Hooks: El Controlador

Manejan los eventos del ciclo de vida completo del agente.

```typescript
interface AgentLifecycle {
  onInit: () => Promise<void>;
  onReady: () => Promise<void>;
  onError: (error: Error) => Promise<void>;
  onComplete: () => Promise<void>;
  onTimeout: () => Promise<void>;
}

class OrchestratedAgent implements AgentLifecycle {
  private context: AgentContext;
  private hooks: HookRegistry;

  async onInit() {
    // Cargar configuración del agente
    this.context = await loadContext(this.id);

    // Registrar hooks dinámicamente
    this.hooks.register('pre-tool', this.validateContext.bind(this));
    this.hooks.register('post-tool', this.persistState.bind(this));

    console.log(`Agent ${this.id} initialized`);
  }

  async onReady() {
    // Notificar al orquestador que estamos listos
    await orchestrationCoordinator.announce(this.id, this.capabilities);
  }

  async onError(error: Error) {
    // Manejo graceful de errores
    await errorReporter.capture(error, { agent: this.id });

    // Notificar a agentes dependientes
    await this.notifyDependents('error', error);
  }

  async onComplete() {
    // Persistir estado final
    await stateManager.save(this.id, this.context);

    // Cleanup de recursos
    await this.hooks.cleanup();
  }

  async onTimeout() {
    // Marcar tarea como incompleta
    await taskQueue.requeue(this.currentTask);

    // Log del timeout
    await metrics.increment('agent.timeouts', { agent: this.id });
  }
}
```

---

## Ejemplo Práctico: Sistema de Code Review Automatizado

Veamos cómo implementar un sistema real usando orquestación con hooks.

### Escenario

Queremos un sistema donde:
1. Un agente analiza código buscando bugs
2. Otro agente verifica estilo y best practices
3. Un tercer agente sugiere mejoras de rendimiento
4. Un agente coordinador consolida los resultados

### Arquitectura con Hooks

```typescript
// Configuración del orquestador
const codeReviewOrchestrator = new AgentOrchestrator({
  name: 'code-review-system',
  hooks: {
    // Hook global: pre-procesamiento de código
    'lifecycle:init': async (context) => {
      const code = context.input.code;
      const language = detectLanguage(code);

      // Enriquecer contexto con información del lenguaje
      context.set('language', language);
      context.set('ast', parseToAST(code, language));

      return context;
    },

    // Hook de routing: decidir qué agentes ejecutar
    'decision:route': async (context) => {
      const agents = [];

      // Siempre ejecutar análisis de bugs
      agents.push('bug-analyzer');

      // Solo verificar estilo si es código nuevo
      if (!context.get('isRefactor')) {
        agents.push('style-checker');
      }

      // Solo analizar rendimiento si hay funciones complejas
      if (hasComplexFunctions(context.get('ast'))) {
        agents.push('performance-advisor');
      }

      return agents;
    },

    // Hook post-agente: procesar resultados individuales
    'post-agent:complete': async (agentResult) => {
      // Filtrar duplicados
      const deduped = removeDuplicates(agentResult.findings);

      // Priorizar por severidad
      return sortBySeverity(deduped);
    },

    // Hook final: consolidar todo
    'lifecycle:complete': async (results) => {
      const report = {
        summary: generateSummary(results),
        findings: mergeFindings(results),
        recommendations: prioritizeRecommendations(results),
        metrics: calculateMetrics(results)
      };

      // Notificar al equipo
      await slack.notify(`Code review completed: ${report.summary}`);

      return report;
    }
  }
});
```

### Definición de Agentes Individuales

```typescript
// Agente 1: Análisis de Bugs
const bugAnalyzer = new Agent({
  id: 'bug-analyzer',
  model: 'claude-3-opus',
  systemPrompt: `Eres un experto en encontrar bugs y vulnerabilidades.
                 Analiza el código proporcionado y reporta:
                 - Bugs potenciales
                 - Vulnerabilidades de seguridad
                 - Edge cases no manejados`,

  hooks: {
    'pre-tool': [
      // Solo permitir herramientas de análisis
      (ctx) => ['read_file', 'search_code'].includes(ctx.tool)
    ],
    'post-tool': [
      // Estructurar findings
      (result) => ({
        ...result,
        findings: result.findings.map(normalizeFinding)
      })
    ]
  }
});

// Agente 2: Verificador de Estilo
const styleChecker = new Agent({
  id: 'style-checker',
  model: 'claude-3-sonnet',
  systemPrompt: `Eres un experto en clean code y best practices.
                 Verifica: nomenclatura, estructura, legibilidad.`,

  hooks: {
    'pre-tool': [
      // Cargar reglas de estilo del proyecto
      async (ctx) => {
        ctx.config = await loadStyleConfig(ctx.projectId);
        return true;
      }
    ]
  }
});

// Agente 3: Asesor de Rendimiento
const performanceAdvisor = new Agent({
  id: 'performance-advisor',
  model: 'claude-3-opus',
  systemPrompt: `Eres un experto en optimización de rendimiento.
                 Identifica: cuellos de botella, memory leaks, O(n²) loops.`,

  hooks: {
    'post-tool': [
      // Añadir benchmarks sugeridos
      async (result) => {
        for (const suggestion of result.suggestions) {
          suggestion.benchmark = await generateBenchmark(suggestion);
        }
        return result;
      }
    ]
  }
});
```

---

## Mejores Prácticas de Orquestación

### 1. Principio de Responsabilidad Única

Cada hook debe hacer **una sola cosa** bien.

```typescript
// ❌ Mal: Hook que hace demasiadas cosas
'pre-tool': [(ctx) => {
  validate(ctx);
  log(ctx);
  transform(ctx);
  cache(ctx);
}]

// ✅ Bien: Hooks separados
'pre-tool': [
  validateParams,
  logAccess,
  transformInput,
  checkCache
]
```

### 2. Idempotencia

Los hooks deben poder ejecutarse múltiples veces sin efectos secundarios no deseados.

```typescript
async function idempotentHook(ctx: HookContext) {
  const key = `hook:${ctx.id}:${ctx.step}`;

  // Verificar si ya se ejecutó
  if (await redis.exists(key)) {
    return await redis.get(key);
  }

  // Ejecutar y cachear
  const result = await processHook(ctx);
  await redis.set(key, result, { nx: true }); // Solo si no existe

  return result;
}
```

### 3. Timeouts y Circuit Breakers

Siempre protege tus hooks contra fallos.

```typescript
const protectedHook = withProtection(myHook, {
  timeout: 5000,           // 5 segundos máximo
  retries: 2,              // 2 reintentos
  circuitBreaker: {
    threshold: 5,          // Después de 5 fallos
    resetAfter: 60000      // Abrir por 1 minuto
  },
  fallback: (ctx) => ctx.defaultValue  // Valor por defecto si falla
});
```

### 4. Observabilidad

Todo hook debe ser observable.

```typescript
const observableHook = withTelemetry(myHook, {
  // Métricas automáticas
  metrics: ['duration', 'success', 'retries'],

  // Tracing distribuido
  tracing: {
    serviceName: 'agent-orchestrator',
    spanName: (ctx) => `hook:${ctx.name}`
  },

  // Logging estructurado
  logging: {
    level: 'info',
    fields: ['agentId', 'toolName', 'duration']
  }
});
```

---

## Casos de Uso Comunes

### Caso 1: Pipeline de Datos Multi-Agente

```
Extractor Agent → pre-hook: validar fuente
        ↓
Transformer Agent → post-hook: cachear transformaciones
        ↓
Validator Agent → pre-hook: rate limiting
        ↓
Loader Agent → lifecycle: cleanup al completar
```

### Caso 2: Asistente de Desarrollo

```
Code Generator → post-hook: formatear código
        ↓
Test Writer → pre-hook: cargar configuración de testing
        ↓
Doc Generator → lifecycle: esperar a tests pasen
        ↓
Reviewer → decision: evaluar calidad
```

### Caso 3: Sistema de Soporte

```
Classifier → post-hook: asignar prioridad
        ↓
Researcher → pre-hook: cargar knowledge base
        ↓
Responder → decision: escalar si es complejo
        ↓
Escalator → lifecycle: notificar humanos
```

---

## Anti-Patrones a Evitar

### 1. El Hook Dios

Un hook que hace todo: validación, transformación, logging, y decisión.

```typescript
// ❌ Nunca hagas esto
'app.pre-tool': async (ctx) => {
  // 500 líneas de lógica mezclada
}
```

**Solución**: Divide en hooks específicos.

### 2. Acoplamiento Temporal

Hooks que dependen del orden de ejecución sin declararlo explícitamente.

```typescript
// ❌ Asume que hookB corre después de hookA
const hookB = (ctx) => ctx.dataFromHookA  // Puede ser undefined!
```

**Solución**: Usa dependencias explícitas.

```typescript
const hookB = withDependency(hookB, {
  requires: ['hookA'],
  timeout: 10000
});
```

### 3. Hooks Bloqueantes

Hooks que detienen todo el flujo por operaciones lentas.

```typescript
// ❌ Bloquea por hasta 30 segundos
const slowHook = async (ctx) => {
  await externalAPI.call();  // Sin timeout
}
```

**Solución**: Usa timeouts y procesamiento async.

---

## Herramientas y Frameworks

### oh-my-opencode

Framework de orquestación que implementa hooks de forma nativa:

```yaml
# oh-my-opencode config
orchestration:
  hooks:
    pre-tool:
      - name: rate-limiter
        config:
          maxRequests: 100
          window: 60s
      - name: validator
        config:
          schema: ./schemas/tool-params.json

    post-tool:
      - name: cache
        config:
          backend: redis
          ttl: 3600
      - name: metrics
        config:
          endpoint: /metrics

  agents:
    - id: main-agent
      model: claude-3-opus
      hooks:
        - rate-limiter
        - validator
        - cache
        - metrics
```

### Otras Alternativas

- **LangChain**: Callbacks system similar a hooks
- **AutoGPT**: Plugin system extensible
- **CrewAI**: Task-based orchestration con hooks
- **Custom**: Siempre puedes construir el tuyo con event emitters

---

## Conclusión: El Poder de la Orquestación

La orquestación basada en hooks no es solo un patrón técnico: es una **filosofía de diseño** que promueve:

- **Modularidad**: Cada pieza hace una cosa bien
- **Extensibilidad**: Añade comportamiento sin tocar código existente
- **Observabilidad**: Cada acción es trazable
- **Resiliencia**: Fallos aislados, recuperación graceful

Cuando diseñes tu próximo sistema multi-agente, pregúntate:

> **¿Dónde debería estar este código?** ¿Dentro del agente, o en un hook?

Si la respuesta es "depende del contexto" o "varía según el proyecto", probablemente deberías usar un hook.

---

## Siguientes Pasos

1. **Audita tu código actual**: ¿Dónde tienes lógica duplicada entre agentes?
2. **Identifica puntos de extensión**: ¿Qué comportamiento quieres personalizable?
3. **Empieza pequeño**: Un pre-tool hook de logging es un gran primer paso
4. **Itera**: Añade hooks gradualmente, mide el impacto

---

## Recursos Adicionales

- [Documentación de oh-my-opencode](https://github.com/oh-my-opencode)
- [Patrones de diseño para sistemas multi-agente](https://example.com)
- [Telemetría y observabilidad en agentes](https://example.com)
- [Best practices en rate limiting](https://example.com)

---

**¿Usas hooks en tus sistemas de IA?** Cuéntanos tu experiencia en los comentarios o en redes sociales. La orquestación efectiva es clave para el futuro de los sistemas de IA, y cada insight cuenta.
