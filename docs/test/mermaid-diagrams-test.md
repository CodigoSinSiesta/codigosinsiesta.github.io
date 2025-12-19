---
sidebar_position: 99
title: Test - Diagramas Mermaid
---

# Test: Soporte de Diagramas Mermaid en Docusaurus

Este documento prueba si Docusaurus soporta Mermaid de forma nativa. Los siguientes diagramas deberían renderizarse correctamente si la configuración es adecuada.

## 1. Flowchart (Diagrama de Flujo)

```mermaid
flowchart TD
    A[Inicio] --> B{¿Usar Skill?}
    B -->|Sí, es recurrente| C[Crear SKILL.md]
    B -->|No, es manual| D[Crear Slash Command]
    C --> E[Agregar en .claude/skills/]
    D --> F[Agregar en .claude/commands/]
    E --> G[Testear activación automática]
    F --> H[Testear invocación manual]
    G --> I[Documentar en README]
    H --> I
    I --> J[Fin]
```

## 2. Secuencia (Diagrama de Secuencia)

```mermaid
sequenceDiagram
    actor User
    participant Claude as Claude Code
    participant Skill as Skill Registry
    participant MCP as MCP Server

    User->>Claude: "Necesito procesar este PDF"
    Claude->>Skill: ¿Existe skill relacionado?
    Skill-->>Claude: PDF Processing Skill activado
    Claude->>MCP: Necesito acceder a Google Drive
    MCP-->>Claude: Conexión establecida
    Claude->>Claude: Procesar documento
    Claude-->>User: Resultado procesado
```

## 3. Árbol de Decisión - Cuándo usar cada mecanismo

```mermaid
graph TD
    Start["¿Qué necesitas automatizar?"] --> Q1{"¿Es recurrente y<br/>contextual?"}

    Q1 -->|Sí| Q2{"¿Necesita<br/>paralelismo?"}
    Q1 -->|No| Q3{"¿Es manual<br/>repetible?"}

    Q2 -->|Sí| SubAgent["📌 SUB-AGENT<br/>Contextual isolation<br/>Parallel execution"]
    Q2 -->|No| Skill["✨ SKILL<br/>Auto-invoked<br/>Reusable expertise"]

    Q3 -->|Sí| SlashCmd["⚡ SLASH COMMAND<br/>Manual trigger<br/>One-off workflows"]
    Q3 -->|No| Q4{"¿Necesita<br/>sistema externo?"}

    Q4 -->|Sí| MCP["🔌 MCP SERVER<br/>External integration<br/>API bridge"]
    Q4 -->|No| Prompt["💬 PROMPT<br/>Conversational<br/>Direct instruction"]
```

## 4. Diagrama de Componentes - Arquitectura de Claude Code

```mermaid
graph LR
    A["🧠 LLM<br/>Claude Opus 4.5"]
    B["📝 Prompt<br/>Instructions"]
    C["🛠️ Tools<br/>Read, Write, Bash"]
    D["📚 Context<br/>CLAUDE.md"]

    E["✨ Skills<br/>Auto-invoked"]
    F["⚡ Slash Commands<br/>Manual trigger"]
    G["🔌 MCP Servers<br/>External APIs"]
    H["🤖 Sub-agents<br/>Parallel work"]

    A --> B
    B --> C
    D --> B

    C -.-> E
    C -.-> F
    C -.-> G
    C -.-> H

    style A fill:#ff9999
    style B fill:#99ccff
    style C fill:#99ff99
    style D fill:#ffcc99
    style E fill:#ff99ff
    style F fill:#ffff99
    style G fill:#99ffff
    style H fill:#ff99cc
```

## 5. Gráfico de Gantt - Timeline de Escalada

```mermaid
gantt
    title Escalada de Complejidad: De Prompts a Skills

    section Fase 1
    Experimentar con prompt :p1, 2025-01-01, 1w
    Refinar en conversación :p2, after p1, 1w

    section Fase 2
    Crear slash command :cmd1, after p2, 1w
    Testar en proyecto :cmd2, after cmd1, 1w

    section Fase 3
    Diseñar SKILL.md :skill1, after cmd2, 1w
    Implementar en .claude/skills :skill2, after skill1, 2w
    Documentar expertise :skill3, after skill2, 1w
```

## 6. Estado de Clases (State Diagram)

```mermaid
stateDiagram-v2
    [*] --> Prompt: Usuario escribe instrucción

    Prompt --> SlashCommand: Se repite frecuentemente
    Prompt --> Skill: Es contextual y recurrente

    SlashCommand --> Skill: Maduración y<br/>documentación

    Skill --> MCP: Necesita integración<br/>externa

    Skill --> SubAgent: Requiere<br/>paralelismo

    SubAgent --> [*]: Completado
    Skill --> [*]: Completado
    MCP --> [*]: Completado
```

## 7. Gráfico de Barras - Comparativa de Características

```mermaid
%%{init: {'theme':'base'}}%%
graph LR
    subgraph Características
        A["Auto-invocado"]
        B["Manual trigger"]
        C["Contexto aislado"]
        D["Integración externa"]
    end

    subgraph Skills
        S1["✅"]
        S2["❌"]
        S3["Parcial"]
        S4["Vía MCP"]
    end

    subgraph Slash
        Sh1["❌"]
        Sh2["✅"]
        Sh3["Parcial"]
        Sh4["Vía MCP"]
    end

    subgraph Sub-agents
        Su1["Configurable"]
        Su2["✅"]
        Su3["✅"]
        Su4["Vía MCP"]
    end

    subgraph MCP
        M1["N/A"]
        M2["N/A"]
        M3["Completo"]
        M4["✅"]
    end
```

## Instrucciones para Testear

Para ver si estos diagramas se renderizan correctamente:

```bash
# 1. Retorna a la rama
git checkout feature/test-mermaid-diagrams

# 2. Inicia servidor de desarrollo
bun start

# 3. Abre en navegador
# http://localhost:3000/docs/test/mermaid-diagrams-test

# 4. Verifica que los diagramas se rendericen
```

### Resultados Esperados

- ✅ Flowchart debería mostrarse como diagrama interactivo
- ✅ Secuencia debería mostrar interacciones
- ✅ Árboles de decisión deberían ser navegables
- ✅ Componentes con colores
- ✅ Gantt charts con timeline
- ✅ State diagrams con transiciones

### Si NO se renderizan:

1. **Verificar docusaurus.config.js**:
   ```js
   presets: [
     ['classic', {
       docs: {
         remarkPlugins: [require('mdx-mermaid')],
         // o
         rehypePlugins: [require('rehype-mermaid')],
       },
     }],
   ]
   ```

2. **Instalar dependencia si falta**:
   ```bash
   bun add mdx-mermaid
   # o
   bun add mermaid
   ```

3. **Alternativamente, usar bloques de código sin renderizado**:
   ```
   ````mermaid
   // diagrama aquí
   ````
   ```

---

**Fecha de test**: Diciembre 19, 2025
**Docusaurus versión**: 3.9.2
**Objetivo**: Validar soporte Mermaid para futuros artículos
