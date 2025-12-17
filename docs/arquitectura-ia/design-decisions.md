---
sidebar_position: 2
---

# Decisiones de Diseño en Sistemas IA

**¿REST, GraphQL, o gRPC? ¿API de OpenAI o self-hosted? ¿SQL o vector database?**

Las decisiones arquitectónicas en sistemas IA no son opcionales. Un error aquí multiplica los problemas downstream. Esta guía te ayuda a tomar decisiones fundamentadas.

## 🏗️ API Design: ¿Cómo Expones tus Agentes?

### REST: Simple pero Limitado
```typescript
// Para agentes simples con llamadas directas
POST /api/agents/analyze
Content-Type: application/json

{
  "task": "analyze codebase",
  "files": ["src/**/*.ts"],
  "output": "summary"
}
```

**Cuándo usar REST:**
- Agentes con interfaces predecibles
- Equipos pequeños (< 5 personas)
- Prototipos rápidos
- Integración con sistemas legacy

**Tradeoffs:**
✅ Simple de entender y debuggear
✅ Herramientas maduras (Postman, curl)
❌ Streaming limitado para respuestas largas
❌ Schema evolution complicado

### GraphQL: Flexible pero Complejo
```graphql
# Para agentes que necesitan queries complejas
query AnalyzeRepository($owner: String!, $repo: String!) {
  agent(task: "security_audit") {
    findings(type: VULNERABILITY) {
      file
      line
      severity
      description
    }
    metrics {
      complexity
      coverage
    }
  }
}
```

**Cuándo usar GraphQL:**
- Interfaces dinámicas según el tipo de agente
- Equipos medianos (5-15 personas)
- Productos con múltiples consumidores
- Evolución frecuente de requirements

**Tradeoffs:**
✅ Queries precisas, menos over/under-fetching
✅ Schema fuerte con type safety
❌ Complejidad inicial alta
❌ Caching más complicado

### gRPC: Performance pero Verbose
```protobuf
// Para agentes de alta performance
service AgentService {
  rpc AnalyzeStream(stream AnalysisRequest) returns (stream AnalysisResponse);
}

message AnalysisRequest {
  string task = 1;
  repeated string files = 2;
  AnalysisOptions options = 3;
}
```

**Cuándo usar gRPC:**
- Agentes con streaming en tiempo real
- Microservicios con agentes especializados
- Equipos grandes (> 15 personas)
- Requisitos de baja latencia

**Tradeoffs:**
✅ Mejor performance que REST/GraphQL
✅ Streaming nativo bidireccional
❌ Debugging más difícil
❌ Herramientas menos maduras

## 🗄️ Storage: ¿Dónde Guardas el Conocimiento?

### Vector Databases: Para Contexto Semántico
```typescript
// Pinecone, Weaviate, Qdrant
const vectorStore = new PineconeStore({
  apiKey: process.env.PINECONE_API_KEY,
  indexName: 'agent-knowledge'
});

// Embedding del código para búsqueda semántica
const embedding = await openai.embeddings.create({
  model: "text-embedding-3-small",
  input: codeSnippet
});

await vectorStore.addDocuments([
  new Document({
    pageContent: codeSnippet,
    metadata: { file: 'src/agent.ts', type: 'function' },
    embedding
  })
]);
```

**Cuándo usar Vector DB:**
- RAG (Retrieval-Augmented Generation)
- Búsqueda semántica en código/documentos
- Agentes que necesitan contexto amplio
- Sistemas de recomendación

### SQL Databases: Para Datos Estructurados
```sql
-- PostgreSQL con pgvector para híbrido
CREATE TABLE agent_memories (
  id UUID PRIMARY KEY,
  agent_id VARCHAR(50) NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'conversation', 'learning', 'error'
  content TEXT NOT NULL,
  embedding vector(1536), -- OpenAI ada-002
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX ON agent_memories USING ivfflat (embedding vector_cosine_ops);
```

**Cuándo usar SQL:**
- Datos relacionales (usuarios, proyectos, permisos)
- Queries complejas con joins
- Transacciones ACID
- Reporting y analytics

### Redis: Para Cache y Sesiones
```typescript
// Cache de embeddings frecuentes
const cacheKey = `embedding:${hash(codeSnippet)}`;
const cached = await redis.get(cacheKey);
if (!cached) {
  const embedding = await openai.embeddings.create({...});
  await redis.setex(cacheKey, 3600, JSON.stringify(embedding)); // 1 hora
}
```

**Cuándo usar Redis:**
- Cache de resultados costosos
- Sesiones de agentes
- Rate limiting
- Pub/sub entre agentes

## 🤖 LLM Selection: ¿API o Self-Hosted?

### API Services: Fácil pero Dependiente
```typescript
// OpenAI/Claude APIs
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const response = await client.chat.completions.create({
  model: "gpt-4-turbo-preview",
  messages: [{ role: "user", content: task }],
  tools: agentTools,
  temperature: 0.1 // Baja para consistencia
});
```

**Cuándo usar APIs:**
- Prototipos y MVPs
- Equipos pequeños sin infra expertise
- Presupuesto flexible
- Modelos actualizados automáticamente

**Tradeoffs:**
✅ Cero mantenimiento de modelos
✅ Modelos state-of-the-art
❌ Costos variables impredecibles
❌ Dependencia de terceros
❌ Rate limits y downtime

### Self-Hosted: Control pero Complejidad
```yaml
# Docker Compose para vLLM
version: '3.8'
services:
  vllm:
    image: vllm/vllm-openai:latest
    ports:
      - "8000:8000"
    environment:
      - MODEL_NAME=meta-llama/Llama-2-70b-chat-hf
      - TOKENIZERS_PARALLELISM=false
    volumes:
      - ./models:/root/.cache/huggingface
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 2
              capabilities: [gpu]
```

**Cuándo usar Self-Hosted:**
- Aplicaciones críticas con SLA estrictos
- Datos sensibles (compliance)
- Costos predecibles a largo plazo
- Equipos con expertise en MLOps

**Tradeoffs:**
✅ Control total sobre modelos y datos
✅ Costos predecibles
❌ Mantenimiento complejo
❌ Hardware costoso (GPUs)
❌ Model updates manuales

## 🚀 Deployment: ¿Serverless o Containers?

### Serverless: Escalado Automático
```yaml
# AWS Lambda para agentes simples
functions:
  analyzeCode:
    handler: src/handlers/analyze.handler
    runtime: nodejs20.x
    timeout: 900 # 15 minutos máximo
    memorySize: 2048
    environment:
      OPENAI_API_KEY: ${env:OPENAI_API_KEY}
```

**Cuándo usar Serverless:**
- Agentes con carga variable
- Equipos sin DevOps
- Costos basados en uso real
- Prototipos rápidos

**Tradeoffs:**
✅ Escalado automático
✅ Cero mantenimiento de servers
❌ Timeouts estrictos (15 min Lambda)
❌ Cold starts
❌ Vendor lock-in

### Containers: Control Completo
```dockerfile
# Multi-stage para agentes optimizados
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS runtime
RUN apk add --no-cache dumb-init
USER node
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]
```

**Cuándo usar Containers:**
- Agentes complejos con dependencias
- Equipos con Kubernetes expertise
- Aplicaciones stateful
- Requisitos de compliance específicos

**Tradeoffs:**
✅ Control total del runtime
✅ Portabilidad entre clouds
❌ Orquestación compleja (Kubernetes)
❌ Costos de gestión de infraestructura

## 🎯 Decision Tree: ¿Qué Elegir Según tu Caso?

```
¿Equipo pequeño (< 5 devs) Y prototipo?
├── SÍ → REST + API services + Serverless
└── NO → ¿Datos sensibles o compliance?
    ├── SÍ → gRPC + Self-hosted + Containers
    └── NO → ¿Performance crítica?
        ├── SÍ → GraphQL + Vector DB + Self-hosted + Containers
        └── NO → REST + SQL + API services + Serverless
```

## ⚠️ Decisiones que te Arrepentirás

- **Empezar con API sin plan de migración**: Los costos se disparan
- **Vector DB para todo**: No todo es búsqueda semántica
- **Serverless para agentes stateful**: Pierdes estado entre llamadas
- **Self-hosted sin MLOps**: Actualizaciones de modelos son un infierno

**Recuerda**: Las decisiones arquitectónicas se pagan caro cambiar después. Toma tiempo para evaluar tradeoffs antes de comprometerte.
