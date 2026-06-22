---
title: "Del caos al conocimiento: gestionando productos multi-repo con agentes de IA"
description: "Cómo definir un producto, extraer decisiones de reuniones, aplicar Specification-Driven Development y consolidar especificaciones en un knowledge graph — todo coordinado por agentes de IA a través de múltiples repositorios."
fecha: 2026-06-21
tags:
  - product-management
  - agentic-engineering
  - sdd
  - knowledge-graph
  - multi-repo
  - especificaciones
tipo: ensayo
autor: Alejandro de la Fuente
---

# Del caos al conocimiento: gestionando productos multi-repo con agentes de IA

## 0. Resumen ejecutivo

Este artículo describe un sistema integral para gestionar el conocimiento de producto usando agentes de IA. Es un marco de trabajo que va desde la transcripción de una reunión hasta el código desplegado en múltiples repositorios, pasando por definiciones enriquecidas, SDD, knowledge graphs y contract testing. La primera mitad es teoría fundacional; la segunda es práctica incremental con roadmap, quickstart y herramientas.

Si tu producto vive en un solo repo, este artículo te sobra en un 40%. Si vive en tres, cinco o quince — y las decisiones de arquitectura se toman en una reunión el martes y el jueves ya nadie recuerda por qué — este artículo es para ti.

---

## 1. El problema: el conocimiento de producto se evapora

### 1.1. Dónde vive hoy el conocimiento de producto

Hagamos un ejercicio. ¿Dónde está ahora mismo la respuesta a estas preguntas en tu proyecto?

- ¿Por qué decidimos usar Postgres y no MongoDB?
- ¿Qué significa exactamente "usuario premium" en nuestro modelo de negocio?
- ¿Cuál es el contrato exacto entre el servicio de notificaciones y el de pagos?
- ¿Qué problema de usuario resolvía el endpoint `POST /v2/orders/bulk` que ya nadie usa?

Las respuestas viven en sitios distintos según la fase del proyecto:

| Fase | Dónde está el conocimiento |
|------|---------------------------|
| Descubrimiento | Slack, Notion, la cabeza del PM |
| Decisión | Actas de reunión, hilos de Discord, un Miro |
| Especificación | Un Google Doc que alguien actualizó hace 3 sprints |
| Implementación | PR descriptions, comentarios en código, `ARCHITECTURE.md` (si hay suerte) |
| Mantenimiento | La memoria de los dos seniors que siguen en el equipo |

El conocimiento de producto es **nómada**: migra de herramienta en herramienta, se diluye con cada traspaso, y cuando más lo necesitas — seis meses después, durante una incidencia — ya no está donde crees.

### 1.2. Los 5 patrones de pérdida de conocimiento

Tras observar este problema en proyectos de 3 a 40 desarrolladores, identifico cinco patrones recurrentes:

**Patrón 1: La decisión huérfana.** Se toma una decisión importante en una reunión. Queda registrada en el acta. El acta se pierde en un canal de Slack o en una carpeta de Drive que nadie vuelve a abrir. Seis meses después, un desarrollador nuevo pregunta "¿por qué hicimos esto así?" y nadie lo sabe.

**Patrón 2: La especificación zombie.** El documento de especificaciones se escribió con ilusión en el sprint 0. En el sprint 3 ya nadie lo actualiza. En el sprint 8 contradice directamente lo que hace el código. Pero sigue ahí, dando falsa seguridad.

**Patrón 3: El susurro del senior.** El conocimiento crítico — "ese módulo no se toca porque tiene un bug de concurrencia que solo sé reproducir yo" — solo existe en la cabeza de una persona. Cuando esa persona se va de vacaciones, el módulo es tierra de nadie.

**Patrón 4: La divergencia silenciosa.** Dos equipos implementan el mismo concepto (digamos, "descuento") de forma ligeramente distinta en dos repos. La diferencia es sutil — un campo se llama `discount_percent` en un servicio y `discount_rate` en otro. No rompe nada. Hasta que un tercer servicio intenta integrarse con ambos y el mapping se vuelve una pesadilla.

**Patrón 5: El README mentiroso.** El `README.md` del repo describe una arquitectura que era cierta hace 8 meses. Ahora el servicio hace el doble de cosas, se conecta a tres bases de datos distintas y tiene una dependencia circular con otro servicio que el README ni menciona.

### 1.3. El coste real de las especificaciones desactualizadas

No es abstracto. Tiene coste medible:

- **Onboarding**: un desarrollador nuevo tarda 3-4 semanas en ser productivo en una codebase sin documentación fiable. Con documentación viva, 1-2 semanas.
- **Incidencias**: cuando algo falla en producción, el tiempo hasta identificar la causa raíz se multiplica por 3-5 si no hay trazabilidad entre la decisión de diseño y el código.
- **Refactorings**: sin specs claras, los refactorings se evitan. La deuda técnica se acumula. Cuando finalmente se aborda, el riesgo de regresión es altísimo porque nadie sabe exactamente qué comportamientos hay que preservar.
- **Rotación**: cada baja de un senior es una amputación de conocimiento. Sin un sistema que capture ese conocimiento *antes* de que se vaya, el equipo pierde meses de contexto.

### 1.4. El multiplicador multi-repo

Todos los problemas anteriores se agravan cuando el producto está distribuido en N repositorios. No es lineal — es combinatorio:

- **Una decisión de producto** puede afectar a 3 repos. Si cada repo tiene su propio `ARCHITECTURE.md`, hay que actualizar 3 documentos. Si los formatos son distintos, 3 actualizaciones *diferentes*. Si los equipos son distintos, 3 conversaciones.
- **Un cambio de interfaz** entre dos servicios requiere coordinación entre dos repos, dos pipelines de CI, dos deployments. Si la especificación de esa interfaz no está consolidada en un solo lugar, el riesgo de desincronización es del 100%.
- **La trazabilidad** se vuelve imposible: ¿este endpoint en `repo-a` por qué acepta este parámetro opcional? La respuesta está en una decisión que se tomó para `repo-b` hace 4 meses y que nunca se documentó en `repo-a`.

El multi-repo no es una nota al pie. Es el escenario real. Y la solución no puede ser "un repo de documentación que alguien mantiene a mano". Tiene que ser **un sistema que se mantiene solo**.

### 1.5. ¿Es SDD para ti? Un diagnóstico antes de seguir

Antes de invertir tiempo en el resto del artículo, responde estas preguntas. Si marcas menos de 3, quizás no necesitas SDD — y este artículo incluye una sección de [alternativas ligeras](#16-alternativas-a-sdd-cuando-esto-es-demasiado).

- [ ] ¿Tu producto tiene **3 o más repositorios** que se comunican entre sí?
- [ ] ¿Los **contratos entre servicios** (APIs, eventos) cambian al menos una vez al mes?
- [ ] ¿Has sufrido el **patrón de la especificación zombie**? (un documento de specs que nadie actualiza)
- [ ] ¿Has perdido horas depurando una integración porque dos servicios interpretaban distinto el mismo campo?
- [ ] ¿Cuando un servicio cambia su API, **no sabes con certeza** qué otros servicios se ven afectados?
- [ ] ¿Tu equipo dedica más de 2 horas/semana a **coordinación cross-repo** (avisar, sincronizar, perseguir)?
- [ ] ¿Has tenido un bug en producción causado por una **divergencia silenciosa** entre la spec y el código?

**Resultado**:
- **6-7 ✓**: SDD te va a cambiar la vida. Sigue leyendo.
- **4-5 ✓**: SDD te aportará valor, pero quizás puedas empezar solo con el repo de producto y contract testing. Lee la [sección de alternativas](#16-alternativas-a-sdd-cuando-esto-es-demasiado) antes de decidir.
- **0-3 ✓**: Probablemente no necesitas SDD todavía. Lee la sección de alternativas para encontrar un punto de partida más ligero.

### 1.6. Alternativas a SDD: cuando esto es demasiado

No todo proyecto necesita SDD. Aquí tienes opciones más ligeras ordenadas de menor a mayor fricción:

**Opción A: RFCs (esfuerzo: mínimo).** Cuando se toma una decisión que afecta a más de un repo, se escribe un RFC en `product-specs/rfcs/`. El equipo discute, objeta, refina. Cuando hay consenso, el RFC se acepta y sus artefactos pasan a `requirements/` o `contracts/`. Sin agentes, sin contratos automatizados, sin grafo. Esto ya resuelve los patrones 1 (decisión huérfana) y 3 (susurro del senior). Para equipos de 2-5 personas con 2-3 repos, puede ser suficiente. Ver sección 3.6 para el formato completo.

**Opción B: ADRs + README cross-repo (esfuerzo: bajo).** Similar a la opción A pero con ADRs en cada repo en lugar de RFCs centralizados. Escribe un ADR cuando tomes una decisión técnica. Mantén un `README.md` en el repo principal con las dependencias entre servicios. Más simple de empezar pero más difícil de consultar cross-repo que los RFCs centralizados.

**Opción C: BDD ligero con Gherkin (esfuerzo: medio).** Escribe las funcionalidades cross-cutting como escenarios Gherkin en un repo compartido. Cada equipo implementa los escenarios que le corresponden. No hay contract testing automatizado entre servicios, pero sí una especificación ejecutable común. Ideal si tu fricción principal es el patrón 4 (divergencia silenciosa de conceptos de negocio).

**Opción D: Contract testing sin SDD completo (esfuerzo: medio).** Define contratos OpenAPI/AsyncAPI para las APIs entre servicios. Configura tests de contrato en CI. No necesitas knowledge graph ni agentes ni extracción de decisiones desde reuniones. Esto ataca directamente el patrón 2 (especificación zombie) en su manifestación más dañina: las APIs. Es la fase Walk del roadmap, y puedes quedarte aquí indefinidamente.

**Opción E: SDD completo (esfuerzo: alto).** Lo que describe el resto del artículo. Solo recomendable si has marcado 5+ en el diagnóstico, tu equipo tiene experiencia con CI/CD y testing, y el coste de la descoordinación cross-repo justifica la inversión.

**Señales de que deberías parar o reducir**:
- El repo de producto lleva 2 sprints sin un PR mergeado → el equipo no tiene capacidad de revisión. Vuelve a la opción A y reevalúa en 3 meses.
- Los tests de contrato generan más falsos positivos que bugs reales → tus contratos son demasiado rígidos o cambian demasiado. Relaja los umbrales.
- El agente de reuniones extrae decisiones con menos del 70% de precisión → las transcripciones de tu equipo no son lo bastante estructuradas. Vuelve al modo borrador (notificaciones pasivas, sin PRs).

---

## 2. Parte I: Definir el producto (más allá de los repos)

### 2.0. Workspaces: la unidad de trabajo del agente multi-repo

Antes de definir el producto, definamos dónde trabaja el agente. Un **workspace** es el entorno que un agente de IA ve cuando empieza a trabajar: un directorio con archivos, un `AGENTS.md` que le da contexto, y skills que le dan procedimientos. En un sistema multi-repo, el workspace cambia según la tarea.

**El problema del agente sin workspaces.** Imagina un agente que tiene que actualizar un contrato OpenAPI. Ese contrato define la interfaz entre `payment-service` y `order-service`. El agente necesita:

- Leer la spec en `product-specs/contracts/payment-api-v2.yaml` → workspace del repo de producto
- Actualizar la implementación en `payment-service/src/api/payments.py` → workspace de payment-service
- Actualizar los tipos del consumidor en `order-service/src/types/payment.ts` → workspace de order-service
- Verificar que los tests pasan en ambos repos → CI, no un workspace

Sin workspaces bien definidos, el agente está perdido: ¿dónde está cada cosa? ¿qué convenciones aplican en cada repo? ¿quién es responsable de qué?

**El workspace como abstracción.** Un workspace no es "un repo". Es "un repo + su AGENTS.md + sus skills + los contratos que declara implementar + las dependencias que declara tener". El agente no trabaja sobre archivos sueltos; trabaja sobre un workspace que le proporciona:

| Componente | Qué aporta |
|---|---|
| `AGENTS.md` | Stack, convenciones, arquitectura, límites |
| `.agent/skills/` | Procedimientos ejecutables (tests, deploy, migraciones) |
| Referencia a contratos | "Este servicio implementa `product-specs/contracts/payment-api-v2.yaml`" |
| Dependencias declaradas | "Este servicio consume `order-service`, `notification-service`" |
| `CLAUDE.md` / `.cursorrules` | Reglas adicionales específicas del asistente |

**Cómo los workspaces habilitan el sistema del artículo.** Todo el pipeline depende de que cada agente sepa en qué workspace operar en cada momento:

- **Agente de reuniones** → workspace `product-specs` (extrae decisiones, las guarda donde corresponde)
- **Agente SDD** → workspace del repo de código (lee el contrato desde product-specs, genera tests en el lenguaje y framework que dicta el AGENTS.md local)
- **Agente de drift** → lee la declaración "implementa el contrato X" del AGENTS.md local y valida contra él
- **Agente coordinador** → consulta los AGENTS.md de los repos afectados para saber cómo generar PRs compatibles

Sin workspaces, cada agente tendría que descubrir todo esto desde cero en cada ejecución. Con workspaces, el contexto se hereda.

**La regla de oro del workspace multi-repo**: el agente siempre sabe *en qué repo está* porque el `AGENTS.md` se lo dice, y siempre sabe *con qué otros repos se relaciona* porque los contratos y las dependencias están declarados explícitamente.

### 2.1. La pirámide de definiciones

Todo producto tiene definiciones en múltiples niveles de abstracción. La clave es que cada nivel tiene un propósito distinto, una audiencia distinta y una frecuencia de cambio distinta:

```
        ┌──────────────┐
        │   VISIÓN     │  ← ¿Por qué existe este producto?
        ├──────────────┤     Cambia cada 1-2 años
        │ ESTRATEGIA   │  ← ¿Qué problemas resolvemos y para quién?
        ├──────────────┤     Cambia cada 3-6 meses
        │  REQUISITOS  │  ← ¿Qué capacidades necesita el producto?
        ├──────────────┤     Cambia cada sprint
        │   SPECS      │  ← ¿Cómo se implementa cada capacidad?
        ├──────────────┤     Cambia cada feature
        │   CÓDIGO     │  ← La implementación concreta
        └──────────────┘     Cambia cada commit
```

Cada nivel responde a una pregunta distinta. Y cada nivel debe vivir en el lugar adecuado.

### 2.2. Definiciones cross-cutting vs repo-specific

En un producto multi-repo, la pregunta clave es: **¿esta definición pertenece al producto o a un repo concreto?**

| Tipo de definición | Pertenece a | Ejemplo |
|---|---|---|
| **Visión** | Producto | "Ser la plataforma de pagos más rápida de LATAM" |
| **Estrategia** | Producto | "Soportar PIX y SPEI antes de Q3" |
| **Requisitos cross-cutting** | Producto | "Toda operación de pago debe ser idempotente" |
| **Contratos entre servicios** | Producto | "El servicio de pagos expone `POST /payments` con este schema" |
| **Requisitos repo-specific** | Repo | "El worker de reconciliación debe procesar 1000 tx/min" |
| **Decisiones de implementación** | Repo | "Usamos PostgreSQL con particionamiento por fecha" |
| **Código** | Repo | La implementación concreta |

La regla: **si afecta a más de un repo, pertenece al producto**. Si solo afecta a uno, pertenece a ese repo. Parece obvio, pero casi nadie lo aplica de forma sistemática.

### 2.3. Arquitectura multi-repo correcta: contratos como seams

Un producto multi-repo no es N repos sueltos. Es un grafo de repos que se relacionan mediante **contratos explícitos**. La arquitectura correcta no es la que "funciona", sino la que **un agente de IA puede entender sin ambigüedad**.

**El antipatrón: dependencias implícitas.** Dos servicios se llaman por HTTP, pero la relación no está documentada en ninguna parte. El desarrollador de `order-service` sabe que llama a `payment-service` porque lo recuerda. El agente de IA no lo recuerda — tiene que descubrirlo rastreando código. Esto es frágil y caro.

**El patrón correcto: contratos declarados.** Cada repo declara explícitamente qué contratos implementa y de qué otros repos depende. Esta declaración vive en el `AGENTS.md`:

```markdown
## Contratos
- **Provee**: `product-specs/contracts/payment-api-v2.yaml`
- **Consume**: `product-specs/contracts/notification-events-v1.yaml`
- **Consume**: `product-specs/contracts/auth-api-v1.yaml`
```

Con esto, el agente sabe inmediatamente el rol de este repo en el ecosistema: es proveedor de la API de pagos y consumidor de notificaciones y autenticación.

**Los tres patrones de relación entre repos:**

| Patrón | Ejemplo | Contrato |
|---|---|---|
| **Proveedor-Consumidor** | `payment-service` → API → `order-service` | OpenAPI |
| **Publicador-Suscriptor** | `payment-service` → eventos → `notification-service` | AsyncAPI |
| **Dependencia de librería** | `shared-models` → package → todos los servicios | JSON Schema |

**Por qué los contratos son las seams.** En arquitectura de software, un *seam* es un punto donde dos componentes se acoplan y donde puedes cambiar uno sin romper el otro si respetas el contrato. En multi-repo, los contratos OpenAPI/AsyncAPI/JSON Schema son las seams. Definen exactamente qué espera cada lado y permiten que ambos evolucionen de forma independiente.

**La regla de los cuatro niveles de acoplamiento:**

1. **Acoplamiento de contrato (deseable).** "Necesito que me envíes un JSON con estos campos." El contrato OpenAPI lo define. Ambos lados pueden cambiar su implementación interna sin romper nada.
2. **Acoplamiento de implementación (peligroso).** "Sé que usas Postgres y que la tabla `orders` tiene una columna `status` de tipo enum." Si el proveedor cambia su BD, el consumidor se rompe. Esto es lo que genera las divergencias silenciosas del patrón 4.
3. **Acoplamiento temporal (a evitar).** "Necesito que despliegues tu cambio antes que el mío." Si dos servicios necesitan deploy coordinado, el contrato no es lo bastante flexible. Los contratos deben soportar versionado para que cada lado despliegue a su ritmo.

4. **Acoplamiento de base de datos (a eliminar).** Dos servicios leen y escriben las mismas tablas. Esto es el acoplamiento más peligroso en multi-repo porque no hay contrato que lo medie: un cambio de schema en un servicio rompe al otro en runtime, no en CI. Cada servicio debe ser dueño exclusivo de sus datos. Si dos servicios necesitan los mismos datos, que uno se los sirva al otro vía API (acoplamiento de contrato, nivel 1).

**Ejemplo de arquitectura multi-repo bien definida:**

```
product-specs/                    ← Repo de conocimiento (sin código)
├── contracts/
│   ├── payment-api-v2.yaml       ← Contrato que payment-service PROVEE
│   ├── notification-events-v1.yaml ← Contrato que payment-service PUBLICA
│   └── auth-api-v1.yaml          ← Contrato que auth-service PROVEE
├── requirements/
│   ├── REQ-IDEM-001.md           ← "Toda operación de pago debe ser idempotente"
│   └── REQ-RATE-002.md           ← "Rate limiting por tenant"
└── AGENTS.md                     ← Contexto para el agente de producto

payment-service/                  ← Repo de código
├── AGENTS.md                     ← "Provee payment-api-v2, consume auth-api-v1"
├── .agent/skills/run-tests.md
└── src/...

order-service/                    ← Repo de código
├── AGENTS.md                     ← "Consume payment-api-v2, notification-events-v1"
├── .agent/skills/deploy-staging.md
└── src/...
```

Un agente que lee `order-service/AGENTS.md` ve inmediatamente: "Este servicio consume la API de pagos v2 y los eventos de notificación v1." Sabe qué contratos validar, qué tipos generar, y qué repos notificar si algo cambia.

### 2.5. Formato de cada nivel

Cada nivel necesita un formato distinto porque su consumidor es distinto:

- **Visión y estrategia**: Markdown. Lo leen personas. Vive en el repo de producto (no en el de código).
- **Requisitos cross-cutting**: Markdown + escenarios Gherkin. Lo leen PMs, tech leads y agentes de IA. Debe ser parseable.
- **Contratos entre servicios**: OpenAPI, AsyncAPI, Protocol Buffers, JSON Schema. Deben ser **especificaciones ejecutables**, no documentos descriptivos. Si el contrato no se puede validar automáticamente, no es un contrato.
- **Requisitos repo-specific**: Issues de GitHub, PR templates, `CONTRIBUTING.md`. Viven en el repo correspondiente.
- **Decisiones de implementación**: ADRs (Architecture Decision Records). Formato estandarizado con contexto, decisión, consecuencias. Viven en cada repo en `docs/adr/`.

### 2.4. ¿Qué es el knowledge graph de producto exactamente?

El artículo usa "knowledge graph" decenas de veces. Conviene definirlo antes de seguir.

**No es una base de datos de grafos.** Es un modelo de relaciones. Al principio — fase Crawl y Walk del roadmap — el knowledge graph **es el propio repo `product-specs/`**. Los nodos son los ficheros markdown (requisitos, ADRs, contratos). Las aristas son las referencias explícitas: "este servicio implementa este contrato", "este requisito depende de esta decisión". No necesitas Neo4j. Necesitas que los ficheros se referencien entre sí de forma consistente.

**A partir de la fase Run**, cuando tienes 50+ nodos y necesitas consultas de impacto ("¿qué servicios se ven afectados si cambio este contrato?"), migras a un grafo real. La herramienta depende de tu escala:

| Fase | Implementación | Consultas posibles |
|---|---|---|
| Crawl/Walk | Repo `product-specs/` con referencias cruzadas en markdown | "Lee el requisito REQ-IDEM-001 y dime qué repos lo implementan" |
| Run inicial | SQLite + embeddings (Turso, zvec) + `codebase-memory-mcp` | "¿Qué servicios dependen de payment-service?" |
| Run avanzado | Neo4j + GraphRAG | "Si cambio el campo `amount` de integer a decimal, ¿qué repos necesitan ajustes y qué tests se rompen?" |

**La regla**: no despliegues una base de datos de grafos hasta que el repo de producto tenga más nodos de los que puedas seguir mentalmente. Hasta entonces, markdown con enlaces entre ficheros es suficiente — y es infinitamente más fácil de mantener.

He visto equipos que intentan resolver esto con UN documento: un Notion, un Google Doc, un Confluence. Es el "documento de arquitectura" que supuestamente lo contiene todo.

No funciona. Por tres razones:

1. **Nadie lo lee.** Es demasiado largo, demasiado genérico y demasiado estático.
2. **Nadie lo actualiza.** Actualizarlo requiere ir a otra herramienta, buscar la sección correcta, escribir en un formato distinto al del código. Fricción = abandono.
3. **No es accionable.** Un documento no puede romper el CI si el código no lo cumple. Un contrato OpenAPI sí.

La alternativa es un **grafo de definiciones**: muchos documentos pequeños, interconectados, cada uno viviendo donde debe vivir, con trazabilidad automática entre ellos.

### 2.7. Versionado de definiciones

¿Qué se versiona y cómo?

- **Contratos entre servicios**: versionado semántico estricto. Un cambio en el schema de una API es un breaking change hasta que se demuestre lo contrario. Cada versión del contrato genera tests de compatibilidad que se ejecutan en CI.
- **Requisitos cross-cutting**: versionado por fecha. "A día 2026-06-21, el requisito de idempotencia aplica a todas las operaciones de escritura." Si cambia, se crea una nueva versión con la fecha de cambio.
- **ADRs**: inmutables una vez aceptados. Si una decisión se revierte, se escribe un nuevo ADR que depreca el anterior. No se edita el original.
- **Código**: Git. Como siempre.

La clave es que las definiciones **de producto** no viven en el mismo sistema de versionado que el código. Viven en un repo de conocimiento (o en un sistema de grafos) que los repos de código consultan, pero no contienen.

### 2.8. Preparar los repos para agentes de IA

Todo el sistema que describe este artículo depende de agentes de IA que leen, escriben y razonan sobre los repos. Pero un repo sin preparar es un repo donde el agente tropieza: explora a ciegas, adivina convenciones y consume tokens en reconocimiento en lugar de en trabajo productivo.

**El problema concreto.** Un agente entra en un repo por primera vez. Sin contexto, dedica 5-10 turnos a responder preguntas básicas: ¿qué lenguaje? ¿dónde están los tests? ¿cómo se ejecutan? ¿qué arquitectura sigue este proyecto? ¿hay código que no deba tocar? Cada turno cuesta tokens. Y cada agente diferente repite la misma exploración desde cero.

**La solución: `AGENTS.md`.** Es un archivo que se inyecta automáticamente en el system prompt del agente antes de que empiece a trabajar. Es el equivalente a un documento de onboarding para desarrolladores humanos. Así se ve uno real:

```markdown
# AGENTS.md — payment-service

## Stack
- Python 3.12, FastAPI, SQLAlchemy 2.0, PostgreSQL 16
- Tests: pytest con pytest-asyncio, xdist para paralelismo
- CI: GitHub Actions, despliegue en Kubernetes (helm)
- Tipado estricto (mypy con `--strict`)

## Convenciones
- Conventional Commits (`feat:`, `fix:`, `docs:`)
- Tests en `tests/` replicando la estructura de `src/`
- No uses `print()` en producción; usa `structlog`

## Arquitectura
- Hexagonal: `domain/` (puro), `application/` (casos de uso), `infrastructure/` (adapters)
- Las decisiones de arquitectura están en `docs/adr/`

## Contratos
- **Provee**: `product-specs/contracts/payment-api-v2.yaml`
- **Consume**: `product-specs/contracts/auth-api-v1.yaml`

## Límites
- NO modificar `src/infrastructure/legacy_gateway.py` sin consultar
- NO añadir dependencias sin discutirlo en #platform-eng
- NO cambiar la firma de endpoints públicos sin actualizar el contrato en product-specs
```

**Nótese la sección `## Contratos`**: es el mismo formato estructurado que introdujimos en la sección 2.3. El agente puede parsearla sin ambigüedad: este servicio *provee* la API de pagos y *consume* la de autenticación. Si la API de pagos cambia, el agente de drift sabe exactamente qué validar. Si la API de autenticación cambia, el agente coordinador sabe que este repo es un consumidor afectado.

**Qué gana el sistema con esto:**

| Sin AGENTS.md | Con AGENTS.md |
|---|---|
| El agente explora 5-10 turnos para entender el repo | Entiende el repo en el primer turno |
| Adivina convenciones (y a veces falla) | Sabe las convenciones exactas |
| Puede tocar código prohibido | Sabe qué no tocar |
| No sabe cómo ejecutar tests | Ejecuta `pytest -n auto` directamente |
| Cada agente repite la exploración | Todos los agentes heredan el mismo contexto |
| No conecta código con specs de producto | Sabe que `payment-api-v2.yaml` es su contrato |

**Cómo conecta con el pipeline del artículo:**

- **El agente de reuniones** lee el `AGENTS.md` del repo de producto para saber dónde guardar las specs extraídas.
- **El agente SDD** lee el `AGENTS.md` de cada repo para saber qué lenguaje y framework de testing usar al generar tests.
- **El agente de drift** lee la sección `## Contratos` del AGENTS.md local para saber qué specs validar contra qué código: "este servicio *provee* X e *Y*, *consume* Z".
- **El agente coordinador cross-repo** consulta los `AGENTS.md` de los repos para saber cómo notificar a cada equipo y qué convenciones respetar al generar PRs.

**Project-specific skills: el siguiente nivel.** Un `AGENTS.md` da contexto. Un skill de proyecto da procedimientos ejecutables. Cada repo debería tener un directorio `.agent/skills/` con al menos:

| Skill | Qué hace |
|---|---|
| `run-tests` | Ejecuta la suite de tests con los flags correctos |
| `deploy-staging` | Despliega en staging con verificación de salud |
| `add-migration` | Crea una migración de BD con el naming correcto |
| `update-contract` | Actualiza el contrato OpenAPI y regenera tipos en consumidores |
| `incident-response` | Playbook para cuando algo falla en producción |

Ejemplo de `run-tests`:

```markdown
---
name: run-tests
description: "Ejecuta la suite de tests del proyecto"
---

# Ejecutar tests

1. Activa el entorno virtual: `source .venv/bin/activate`
2. Ejecuta todos los tests: `pytest -n auto --cov=src --cov-report=term`
3. Si algún test falla, NO intentes arreglar código sin entender el fallo.
   Vuelve a ejecutar solo el test fallido: `pytest tests/path/test_file.py::test_name -v`
4. Si la cobertura baja del 80%, añade tests antes de seguir.
```

**El repo de producto también necesita su `AGENTS.md`:**

```markdown
# AGENTS.md — product-specs

## Propósito
Este repo contiene las definiciones cross-cutting del producto. No contiene código.

## Estructura
- `requirements/`: un fichero markdown por requisito
- `contracts/`: OpenAPI/AsyncAPI/JSON Schema
- `decisions/`: una decisión por fichero
- `architecture/`: diagramas y decisiones globales

## Cómo contribuir
1. Crea una rama `specs/<slug>`
2. Usa el template de `requirements/template.md`
3. Abre PR. El CI valida contratos y referencias cruzadas
4. Asigna un revisor humano

## Skills
- `validate-specs`: valida sintaxis de contratos y consistencia de refs
- `impact-analysis`: dado un cambio en una spec, identifica repos afectados
```

**El ahorro real.** Sin `AGENTS.md`, cada agente gasta ~80% de sus tokens de los primeros turnos en entender el entorno. Con él, ese porcentaje baja a ~10%. En un sistema con 3 agentes ejecutándose diariamente, la diferencia es de cientos de miles de tokens ahorrados cada semana. Y lo que es más importante: el agente acierta más porque no está adivinando.

---

## 3. Parte II: Extraer decisiones de las reuniones

### 3.1. La transcripción como materia prima

Cada reunión donde se discute el producto genera decisiones. Algunas son explícitas ("vale, usamos Postgres"), otras implícitas ("bueno, si el servicio de notificaciones ya hace eso, lo reutilizamos"). El problema no es capturarlas — con herramientas de transcripción automática (Teams, Otter, Fireflies) ya lo hacemos. El problema es **extraer la decisión del ruido**.

Una reunión de 45 minutos genera ~8,000 palabras de transcripción. De esas, quizá 200 contienen decisiones relevantes para el producto. El resto es contexto, discusión, tangentes y small talk.

### 3.2. Pipeline de extracción

El pipeline tiene cuatro etapas:

```
Transcripción → Extracción de decisiones → Clasificación → Enriquecimiento
```

**Etapa 1: Transcripción.** Automática. Teams, Google Meet, Otter.ai. El output es texto plano con timestamps y speakers. Se guarda en crudo como fuente inmutable.

**Etapa 2: Extracción de decisiones.** Un agente de IA procesa la transcripción y extrae tuplas `(decisión, rationale, speakers, timestamp)`. Ejemplo:

```yaml
- decision: "Migrar el servicio de autenticación de JWT a OAuth 2.0 con PKCE"
  rationale: "JWT no escala con el nuevo requisito de single sign-on multi-dispositivo"
  speakers: ["Alejandro", "Marina"]
  timestamp: "2026-06-21T10:23:00Z"
  confidence: alta
```

**Etapa 3: Clasificación de impacto.** ¿Esta decisión afecta a qué repos? ¿A qué nivel de la pirámide de definiciones? El agente asigna etiquetas:

```yaml
- decision: "Migrar el servicio de autenticación de JWT a OAuth 2.0 con PKCE"
  impact:
    repos: ["auth-service", "api-gateway", "web-app", "mobile-app"]
    definition_level: "requisito cross-cutting"
    breaking_change: true
    affected_contracts: ["auth-service/openapi.yaml"]
```

**Etapa 4: Enriquecimiento.** La decisión extraída se vincula con las definiciones existentes. Si la decisión modifica un requisito, se genera un diff. Si crea un requisito nuevo, se propone como adición.

### 3.3. Cómo una decisión modifica una definición: el diff semántico

Imagina que la decisión "migrar a OAuth 2.0" modifica el requisito cross-cutting `REQ-AUTH-001`:

```diff
# REQ-AUTH-001: Autenticación de usuarios
- El sistema usará JWT con refresh tokens de 7 días
+ El sistema usará OAuth 2.0 con PKCE. Los access tokens tendrán
+ una validez de 15 minutos. Los refresh tokens, 30 días.
+ Los clientes públicos (SPA, mobile) deben usar PKCE.
+ Los clientes confidenciales (backend) pueden usar client_secret.
+
+ Motivación: decisión del 2026-06-21. Ver [ADM-2026-06-21-001].
```

El agente no escribe esto automáticamente — lo **propone** como un PR al repo de conocimiento. Un humano revisa, aprueba y mergea. Pero el 80% del trabajo (extraer, clasificar, redactar el diff) ya está hecho.

### 3.4. Clasificación automática del impacto

¿Cómo sabe el agente que esta decisión afecta a 4 repos? Porque el knowledge graph de producto ya contiene:

- Un nodo `auth-service` con arista `expone_contrato → auth-api`
- Un nodo `api-gateway` con arista `depende_de → auth-service`
- Nodos `web-app` y `mobile-app` con arista `depende_de → api-gateway`

Cuando el agente ve "migrar autenticación", consulta el grafo: ¿qué nodos dependen directa o transitivamente de `auth-service`? La respuesta: 4 repos. La clasificación de impacto es automática porque el grafo ya modela las dependencias.

### 3.5. Ejemplo real

**Reunión**: Daily del equipo de plataforma. 12 minutos.

**Frase clave**: *"Ayer estuvimos viendo que el rate limiting actual no distingue entre tenants. Si un tenant se pasa de llamadas, afecta a todos los demás. Habría que mover el rate limiter al API gateway con contadores por tenant."*

**Lo que el agente extrae**:

```yaml
decision: "Mover rate limiting al API gateway con contadores por tenant"
rationale: "El rate limiting actual es global y un tenant ruidoso degrada a los demás"
impact:
  repos: ["api-gateway", "billing-service"]
  definition_level: "requisito cross-cutting"
  breaking_change: false
  new_requirement: "REQ-RATE-002: Rate limiting por tenant en API gateway"
```

**Lo que el agente propone**: un PR al repo de conocimiento que:
1. Crea `REQ-RATE-002` con la especificación del nuevo rate limiting
2. Actualiza el contrato del API gateway para reflejar los headers `X-RateLimit-Tenant-*`
3. Añade una arista `api-gateway → implementa → REQ-RATE-002` al knowledge graph
4. Notifica al equipo de billing-service que su integración con el gateway puede necesitar ajustes

Todo esto en menos de 2 minutos tras finalizar la reunión. El humano solo tiene que revisar y aprobar.

### 3.6. RFCs: el mecanismo que falta entre la decisión y la spec

El pipeline de extracción genera propuestas. Pero una propuesta no es una spec. Entre "el agente dice que decidimos X" y "X es un requisito en `product-specs`" hay un paso crítico que el artículo no puede dar por sentado: **la discusión y el consenso**.

Ahí entran los RFCs (Request for Comments). Un RFC es un documento breve que propone un cambio, explica su motivación, detalla el impacto y **solicita feedback explícito** antes de convertirse en spec.

**El ciclo completo con RFCs:**

```
Reunión → Transcripción → Extracción → RFC (discusión) → Spec (consolidada)
                                         ↑
                                    El equipo discute,
                                    objeta, refina.
                                    Solo cuando hay consenso
                                    se convierte en spec.
```

**Formato de un RFC en `product-specs/rfcs/`:**

```markdown
# RFC-004: Rate limiting por tenant en API gateway

**Estado**: propuesto
**Autor**: agente-reuniones (extraído de daily 2026-06-21)
**Fecha**: 2026-06-21
**Afecta a**: api-gateway, billing-service
**Tipo**: requisito cross-cutting

## Motivación
El rate limiting actual es global. Un tenant ruidoso degrada a los demás.

## Propuesta
Mover el rate limiter al API gateway con contadores por tenant.
Añadir headers `X-RateLimit-Tenant-Remaining` y `X-RateLimit-Tenant-Reset`.

## Impacto
- api-gateway: nuevo middleware de rate limiting
- billing-service: debe leer los nuevos headers para facturación
- No es breaking change (headers adicionales, no modificados)

## Alternativas consideradas
- Rate limiting en cada servicio: más complejo, inconsistente entre servicios
- Rate limiting externo (Kong, Envoy): añade dependencia operativa

## Preguntas abiertas
- ¿El límite por tenant es fijo o configurable por plan?
- ¿Qué pasa cuando un tenant excede el límite? ¿429 o degradación?
```

**Estados de un RFC:**

```
propuesto → en discusión → aceptado → implementado (se convierte en spec)
                         → rechazado
                         → pospuesto
```

**Por qué los RFCs son el pegamento entre las secciones 3 y 4 del artículo:**

- **Sección 3** (extracción de decisiones) termina con el agente generando propuestas. Esas propuestas son RFCs en estado `propuesto`.
- **Sección 4** (SDD) empieza con specs consolidadas. Esas specs son RFCs que pasaron a estado `aceptado`.
- El paso intermedio — discusión, objeción, refinamiento — es humano. El agente no decide; propone. El RFC es el mecanismo que formaliza esa propuesta y la somete a escrutinio.

**RFCs como alternativa ligera a SDD completo.** Si tu equipo no está listo para SDD con contratos OpenAPI y contract testing, los RFCs solos ya aportan un valor enorme: capturan decisiones, las hacen visibles, fuerzan a escribir el *por qué* y el *impacto*, y crean un histórico consultable. Es la opción más ligera para empezar — incluso más ligera que la Opción A de la sección 1.6.

**Integración con el resto del sistema:**

- Los RFCs viven en `product-specs/rfcs/`. Cuando se aceptan, sus artefactos (requisitos, contratos) se mueven a `requirements/` o `contracts/`.
- El CI (`validate-specs.yml`) puede verificar que un RFC en estado `aceptado` tiene sus artefactos correspondientes creados.
- El agente de drift puede cruzar RFCs aceptados con el código para detectar propuestas que nunca se implementaron.
- Los RFCs rechazados no se borran. Documentan caminos que se exploraron y se descartaron — conocimiento valiosísimo para el futuro.

---

## 4. Parte III: SDD — Specification-Driven Development

### 4.1. Qué es SDD (explicado para quien nunca lo ha usado)

SDD significa **Specification-Driven Development**: escribir qué debe hacer el sistema *antes* de escribir el código que lo hace, y usar esa especificación como un contrato que se verifica automáticamente.

Pero antes de seguir: ¿qué es exactamente una spec? El artículo ha usado la palabra decenas de veces. Es hora de definirla.

**Una spec (especificación) es una descripción formal y verificable de lo que algo debe hacer.** No es un documento de Word. No es un diagrama en un Miro. No es una conversación de Slack. Es un artefacto que un sistema automático puede leer, validar y usar para verificar que el código lo cumple.

**Los cinco tipos de spec y cuándo usar cada uno:**

| Tipo | Formato | Qué describe | Quién la consume | Ejemplo |
|---|---|---|---|---|
| **Spec de contrato** | OpenAPI, AsyncAPI, JSON Schema, Proto | La interfaz entre dos componentes | CI (contract testing), generadores de tipos, agentes | `POST /payments` acepta `amount`, `currency`, devuelve `payment_id` |
| **Spec de comportamiento** | Gherkin, Markdown estructurado | Qué debe hacer el sistema desde la perspectiva del usuario | Tests de aceptación, PMs, QA | "Dado un usuario logueado, cuando añade un producto al carrito, entonces ve el total actualizado" |
| **Spec de requisito** | Markdown con template | Una capacidad que el producto debe tener | Todo el equipo, agentes de IA | "REQ-IDEM-001: toda operación de pago debe ser idempotente" |
| **Spec de arquitectura** | ADR, C4, diagramas como código | Una decisión técnica y su contexto | Desarrolladores, architectos, agentes | "ADR-003: usamos Postgres en vez de MongoDB porque necesitamos integridad transaccional" |
| **Spec de dominio** | Glosario, JSON Schema de eventos | El lenguaje compartido del negocio | Todos los equipos, agentes | "Un 'pedido confirmado' es un pedido cuyo pago ha sido verificado y cuyo stock ha sido reservado" |

**La diferencia crítica**: una spec de contrato (OpenAPI) la valida una máquina. Una spec de comportamiento (Gherkin) la ejecuta un test. Una spec de requisito (REQ-IDEM-001) la interpreta un humano — pero está escrita con suficiente precisión para que un agente pueda verificar si el código la cumple. Una spec de arquitectura (ADR) documenta el *por qué*, no el *qué*. Una spec de dominio (glosario) no se verifica — se *consulta*. Es el diccionario que evita que dos equipos llamen `discount_percent` y `discount_rate` al mismo concepto.

**Cómo se relaciona esto con la pirámide de la sección 2.1.** Aquel modelo (Visión → Estrategia → Requisitos → Specs → Código) describe *niveles de abstracción*. Esta taxonomía describe *tipos de artefactos*. Se cruzan así:

| Nivel de la pirámide | Tipo de spec que lo materializa |
|---|---|
| Visión / Estrategia | Spec de dominio (glosario, lenguaje ubicuo) |
| Requisitos cross-cutting | Spec de requisito (REQ-XXX-NNN) |
| Specs | Spec de contrato (OpenAPI) + Spec de comportamiento (Gherkin) |
| Decisiones de implementación | Spec de arquitectura (ADR) |
| Código | El código mismo (no es una spec, es la implementación) |

**Lo que NO es una spec:**
- Un comentario en Slack: "el endpoint acepta esto y devuelve aquello"
- Un diagrama dibujado a mano en una pizarra
- Un ticket de Jira que dice "implementar pagos"
- Un `ARCHITECTURE.md` que describe el sistema "más o menos"

Todos estos son *inputs* valiosos para *crear* specs. Pero no son specs. La diferencia es la verificabilidad: ¿puede una máquina determinar si el código cumple esto? Si la respuesta es no, tienes una nota, no una spec.

Imagina que estás montando un servicio de pagos. Sin SDD, la conversación es:

> *"El endpoint de pago acepta un JSON con amount, currency y payment_method. Si el pago es con tarjeta, además necesita card_token. Devuelve un payment_id y el status."*

Con SDD, en lugar de esa frase ambigua, escribes esto:

```yaml
# payment-api-v2.yaml (OpenAPI)
POST /payments:
  requestBody:
    required: true
    content:
      application/json:
        schema:
          type: object
          required: [amount, currency, payment_method]
          properties:
            amount:
              type: integer
              minimum: 1
            currency:
              type: string
              enum: [EUR, USD, MXN]
            payment_method:
              type: string
              enum: [card, transfer]
            card_token:
              type: string
              description: "Requerido solo si payment_method es card"
  responses:
    '201':
      content:
        application/json:
          schema:
            type: object
            properties:
              payment_id: { type: string }
              status: { type: string, enum: [pending, completed, failed] }
```

**¿Qué ganas?** Tres cosas que una frase ambigua no te da:

1. **Validación automática.** El CI ejecuta un test que envía peticiones reales a tu endpoint y verifica que las respuestas cumplen el contrato. Si cambias `status` por `state`, el test falla. No hay ambigüedad.
2. **Tipos generados.** Del mismo YAML, un agente genera `PaymentRequest` y `PaymentResponse` en TypeScript (frontend) y en Python (backend). Un solo source of truth, dos codebases, cero discrepancias.
3. **Documentación viva.** La spec *es* la documentación. No hay un Google Doc desactualizado en alguna carpeta. La spec está en el repo, versionada, y si no se cumple, el CI truena.

**SDD vs TDD**: TDD dice "escribe el test antes del código". SDD dice "escribe la especificación antes del test". Un test de TDD verifica una unidad de código. Una spec de SDD define el contrato completo de una API, un evento o un requisito funcional. No compiten: SDD genera los tests que TDD usaría.

**Glosario rápido** (términos que aparecen en esta sección):

| Término | Qué es | Ejemplo |
|---|---|---|
| **OpenAPI** | Formato estándar para describir APIs REST | El YAML de arriba |
| **AsyncAPI** | Lo mismo que OpenAPI pero para eventos/mensajería | Kafka, RabbitMQ, SQS |
| **JSON Schema** | Estándar para describir la forma de un JSON | `{ "type": "object", "properties": {...} }` |
| **Gherkin** | Lenguaje para describir comportamientos en lenguaje natural | `Dado que el usuario está logueado...` |
| **ADR** | Architecture Decision Record: documento que captura una decisión técnica y su contexto | "Usamos Postgres en vez de MongoDB porque..." |
| **Contract testing** | Tests que verifican que proveedor y consumidor cumplen el contrato | Pact, Schemathesis |
| **Drift** | Divergencia entre lo que dice la spec y lo que hace el código | La spec dice `status` pero el código devuelve `state` |

### 4.2. El ciclo SDD

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  1. ESPECIFICAR    →  2. VALIDAR    →  3. IMPLEMENTAR│
│       ↑                                        │     │
│       │                                        ↓     │
│  5. CONSOLIDAR    ←  4. VERIFICAR  ←─────────────── │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**1. Especificar**: Se escribe (o se genera) qué debe hacer el sistema. El formato depende del nivel: Gherkin para requisitos funcionales, OpenAPI para APIs, JSON Schema para payloads.

**2. Validar**: Un humano — o un agente con criterio — revisa que la especificación tiene sentido, es completa y no contradice otras especificaciones existentes. Esta validación se apoya en el knowledge graph: ¿la nueva spec introduce inconsistencias con specs ya consolidadas?

**3. Implementar**: Se escribe el código que cumple la especificación. El desarrollador (humano o agente) no tiene que interpretar un documento ambiguo: tiene un contrato preciso y tests generados automáticamente.

**4. Verificar**: Los tests generados desde la especificación se ejecutan contra la implementación. Si pasan, la spec y el código están alineados. Si fallan, el CI lo rechaza.

**5. Consolidar**: La especificación verificada se integra en el knowledge graph de producto. Se actualizan las aristas (qué código implementa qué spec), se marcan specs obsoletas, se detecta drift.

### 4.3. SDD multi-repo

En un entorno multi-repo, SDD requiere una capa adicional de coordinación:

**Las specs viven en el producto.** Un repo de conocimiento (o un sistema de grafos) contiene todas las especificaciones cross-cutting y los contratos entre servicios.

**El código vive en los repos.** Cada repo contiene solo las specs que le son específicas (ADRs, requisitos internos) y una referencia a las specs de producto que implementa.

**Los contratos se validan en ambos lados.** Si el `auth-service` expone `POST /auth/token` según OpenAPI, tanto el `auth-service` (proveedor) como el `web-app` (consumidor) validan que su implementación cumple el contrato. El CI de cada repo ejecuta tests de contrato generados desde la spec compartida.

### 4.4. Cómo las specs se convierten en código

El salto de spec a código no es mágico, pero los agentes de IA lo acortan drásticamente:

**Caso 1: API endpoint.** La spec es un OpenAPI. Un agente genera el scaffolding del endpoint (validación de inputs, estructura de respuesta, manejo de errores) en el lenguaje del repo. El desarrollador solo rellena la lógica de negocio.

**Caso 2: Requisito funcional.** La spec es un escenario Gherkin. Un agente genera el test de aceptación en el framework del proyecto (pytest, Jest, Cypress). El test falla inicialmente (RED). El desarrollador escribe la implementación mínima para que pase (GREEN).

**Caso 3: Contrato entre servicios.** La spec es un JSON Schema. Un agente genera types/validators en ambos lenguajes (TypeScript en el frontend, Python en el backend) desde la misma fuente. Si el schema cambia, ambos lados se actualizan simultáneamente.

### 4.5. Tests como especificaciones ejecutables

El principio más importante de SDD: **si no tiene test, no es una especificación, es un deseo**.

| Tipo de spec | Test generado | Framework |
|---|---|---|
| API contract (OpenAPI) | Contract test (Dredd, Schemathesis) | CI del proveedor y consumidor |
| Event schema (AsyncAPI) | Schema validation test | CI del publicador y suscriptor |
| Requisito funcional (Gherkin) | Acceptance test (Behave, Cucumber) | CI del repo que lo implementa |
| Requisito no funcional | Benchmark/load test (k6, locust) | CI con umbrales de SLO |
| ADR | Compliance test (policy as code) | CI que verifica que el código no viola la decisión |

### 4.6. Contract testing cross-repo

El contract testing entre servicios merece mención especial. Es la práctica que hace viable SDD multi-repo.

**Problema**: El `auth-service` cambia el formato de respuesta de `POST /auth/token`. El `web-app` consume ese endpoint. Si nadie se da cuenta, el cambio rompe `web-app` en producción.

**Solución**: Ambos repos ejecutan tests de contrato en CI generados desde la misma spec OpenAPI, que vive en el repo de producto.

- El **proveedor** (`auth-service`) ejecuta tests que verifican que su implementación cumple el contrato.
- El **consumidor** (`web-app`) ejecuta tests que verifican que su código puede parsear las respuestas definidas en el contrato.

Cuando alguien propone un cambio en el contrato (vía PR al repo de producto), el CI de ambos repos se ejecuta contra la nueva versión. Si alguno falla, el cambio no se mergea hasta que el equipo correspondiente adapte su implementación. Para evitar deadlocks (el consumidor no puede validar hasta que el proveedor implemente), el CI del consumidor valida contra un mock del nuevo contrato, no contra el endpoint real. Una vez ambos pasan, el proveedor despliega primero y el consumidor después.

### 4.7. Herramientas reales que ya implementan SDD

El artículo ha descrito SDD como metodología. Pero no hace falta construir el sistema desde cero. Existen herramientas maduras que ya implementan el ciclo especificar→implementar→archivar dentro de un repositorio. Son el motor que puede impulsar la fase SDD del pipeline.

**[OpenSpec](https://github.com/Fission-AI/OpenSpec)** (56K ⭐, MIT, TypeScript). Framework ligero de SDD para coding assistants. Se instala con `npm install -g @fission-ai/openspec`. Su flujo:

```
/opsx:propose "add-dark-mode"
  → crea proposal.md, specs/, design.md, tasks.md en el repo

/opsx:apply
  → implementa las tareas secuencialmente, validando contra las specs

/opsx:archive
  → archiva el cambio, las specs quedan como documentación viva
```

Filosofía: *"fluid not rigid, iterative not waterfall, easy not complex, built for brownfield not just greenfield"*. Funciona con 20+ asistentes de IA (Claude Code, Codex, Cursor, Copilot, Windsurf). OpenSpec es SDD intra-repo: ideal para la fase de implementación de cada servicio.

**[GSD Core](https://github.com/open-gsd/gsd-core)** (heredero de `get-shit-done`, 64K ⭐ original, MIT). Sistema de meta-prompting y context engineering que ejecuta coding agents en un ciclo de 5 fases: **Discuss → Plan → Execute → Verify → Ship**. Su innovación clave: cada fase corre en subagentes con contexto fresco (200K tokens), resolviendo el problema de context rot que degrada la calidad cuando un agente acumula demasiada historia.

**Cómo encajan en el sistema del artículo:**

| Herramienta | Qué cubre del pipeline | Dónde se usa |
|---|---|---|
| **OpenSpec** | SDD intra-repo: especificar → implementar → archivar | Fase Walk/Run, dentro de cada repo de código |
| **GSD Core** | Ciclo completo con subagentes: planificar → ejecutar → verificar → ship | Fase Run, como motor del agente SDD |
| **El artículo (product-specs)** | Lo que ninguna de las dos cubre: contratos cross-repo, trazabilidad, extracción de decisiones, knowledge graph de producto | El sistema por encima de los repos |

OpenSpec y GSD no compiten con el sistema del artículo. Lo complementan. Son el "cómo" dentro de cada repo. El artículo aporta el "qué" y el "por qué" a nivel de producto: los contratos entre servicios, la trazabilidad end-to-end, y el knowledge graph que conecta todo. Puedes usar OpenSpec para que el agente SDD genere specs dentro de `payment-service`, mientras `product-specs/contracts/` sigue siendo la fuente de verdad de la interfaz entre servicios.

---

## 5. Parte IV: Consolidación de especificaciones

### 5.1. El problema del drift

El drift es la divergencia entre lo que dicen las specs y lo que hace el código. En un entorno multi-repo, el drift es el enemigo principal.

Ocurre así: alguien hace un hotfix en `repo-a` que cambia un comportamiento. El cambio es urgente, no hay tiempo de actualizar la spec. La spec queda obsoleta. Tres sprints después, otro equipo implementa una feature en `repo-b` basándose en la spec obsoleta. La feature falla en integración. Se pierden días depurando.

**El drift no se previene con disciplina. Se previene con automatización.**

### 5.2. Single source of truth multi-repo

En un producto multi-repo, el single source of truth no puede ser un repo. Tiene que ser un sistema que está **por encima** de los repos.

Propongo esta arquitectura:

```
┌─────────────────────────────────────────┐
│         PRODUCT KNOWLEDGE GRAPH          │
│  (repo: product-specs o sistema externo) │
│                                          │
│  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │ Vision   │  │Requisitos│  │Contratos│ │
│  │Estrategia│  │cross-cut │  │  APIs   │ │
│  └──────────┘  └──────────┘  └────────┘ │
│        │             │            │       │
└────────┼─────────────┼────────────┼───────┘
         │             │            │
    ┌────▼───┐    ┌────▼───┐   ┌───▼─────┐
    │ repo-a │    │ repo-b │   │ repo-c  │
    │ ADRs   │    │ ADRs   │   │ ADRs    │
    │ código │    │ código │   │ código  │
    └────────┘    └────────┘   └─────────┘
```

El knowledge graph contiene las definiciones que afectan a más de un repo. Cada repo contiene sus propias definiciones locales (ADRs, requisitos internos) y **apunta** a las definiciones de producto que implementa.

### 5.3. El knowledge graph de producto como fuente canónica

¿Por qué un grafo y no una carpeta de markdown? Porque las definiciones no son documentos aislados: son entidades que se relacionan entre sí.

Un knowledge graph de producto contiene:

- **Nodos**: requisitos, contratos, ADRs, servicios, equipos, releases, incidencias
- **Aristas**: implementa, depende_de, contradice, reemplaza, motiva, afecta_a

Ejemplo de consulta que un grafo responde y un sistema de documentos no:

> "¿Qué servicios se ven afectados si cambiamos el requisito de idempotencia?"

En un grafo: `REQ-IDEM-001 ←[implementa]— payment-service, order-service, notification-service`. Respuesta instantánea.

En documentos: buscar "idempotencia" en 15 `ARCHITECTURE.md`. Rezar.

### 5.4. Nodos y aristas cross-repo

Modelar dependencias entre servicios es el caso de uso más potente del grafo:

```yaml
nodos:
  - id: "payment-service"
    tipo: servicio
    repo: "github.com/org/payment-service"
  - id: "notification-service"
    tipo: servicio
    repo: "github.com/org/notification-service"
  - id: "order-service"
    tipo: servicio
    repo: "github.com/org/order-service"

aristas:
  - de: "order-service"
    tipo: "depende_de"
    a: "payment-service"
    contrato: "payment-api-v2"
  - de: "payment-service"
    tipo: "notifica_a"
    a: "notification-service"
    contrato: "payment-events-v1"
```

Con este modelo, una pregunta como "si `payment-service` cambia su API, ¿qué repos necesitan revisión?" se responde con una consulta de grafo: seguir las aristas `depende_de` y `notifica_a` desde `payment-service`. Resultado: `order-service`, `notification-service`. Dos PRs automáticos de notificación.

### 5.5. Trazabilidad

La trazabilidad es la capacidad de responder "¿por qué esta línea de código existe?".

En un sistema maduro, deberías poder hacer clic en cualquier endpoint, cualquier validación, cualquier estructura de datos y ver su linaje completo:

```
POST /v2/orders/bulk
  ↑ implementa
  REQ-ORDER-003: "Creación de pedidos en lote"
    ↑ motivado por
    DEC-2026-03-15: "Soportar pedidos B2B con más de 100 líneas"
      ↑ extraído de
      Reunión 2026-03-14: Product Review Q1
```

Esto no es un lujo. Es lo que permite que un desarrollador nuevo entienda el código en horas en lugar de semanas. Y es lo que permite que un refactoring no sea un salto de fe.

**Herramientas para trazabilidad**:
- `codebase-memory-mcp` (9.6k ⭐): indexa el código de múltiples repos en un knowledge graph vía MCP. Cada símbolo (función, clase, endpoint) es un nodo. Las referencias entre ellos son aristas. Conecta con las specs de producto.
- `microsoft/markitdown`: convierte documentos de especificación (PDFs, DOCs, MDs) en texto estructurado que el grafo puede ingerir.
- `GraphRAG`: construye el grafo de entidades y relaciones desde las specs, permitiendo consultas globales como "¿qué partes del sistema asumen que el usuario siempre tiene email?"

Para una tabla consolidada de todas las herramientas mencionadas, ver el [Apéndice](#8-apéndice-stack-de-herramientas-recomendado).

---

## 6. Parte V: El pipeline completo con agentes de IA

### 6.1. Arquitectura del sistema

```
┌────────────────────────────────────────────────────────────────┐
│                    PRODUCT KNOWLEDGE GRAPH                       │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌────────────────┐  │
│  │ Visión  │  │Requisitos│  │Contratos │  │Dependencias    │  │
│  │Estrateg.│  │cross-cut │  │(OAS/JSON)│  │cross-repo      │  │
│  └─────────┘  └──────────┘  └──────────┘  └────────────────┘  │
│                                                                  │
└──────────────────────┬──────────────────────────────────────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
    ┌────▼────┐   ┌────▼────┐   ┌────▼────┐
    │ AGENTE  │   │ AGENTE  │   │ AGENTE  │
    │reuniones│   │  SDD    │   │  drift  │
    └─────────┘   └─────────┘   └─────────┘
         │             │             │
    ┌────▼────┐   ┌────▼────┐   ┌────▼────┐
    │Transcrip│   │Spec →   │   │Código vs│
    │→ decisión│   │tests    │   │spec     │
    │→ impacto │   │→ código │   │→ alerta │
    └─────────┘   └─────────┘   └─────────┘
                       │
         ┌─────────────┼─────────────┐
    ┌────▼────┐   ┌────▼────┐   ┌────▼────┐
    │ repo-a  │   │ repo-b  │   │ repo-c  │
    │ CI/CD   │   │ CI/CD   │   │ CI/CD   │
    └─────────┘   └─────────┘   └─────────┘
```

Tres agentes especializados, un grafo compartido, N repos de código.

### 6.2. Flujo completo

**Paso 1: Reunión.** El equipo discute. Teams/Google Meet transcribe.

**Paso 2: Extracción.** El agente de reuniones procesa la transcripción, extrae decisiones, las clasifica por impacto (¿qué repos? ¿qué nivel de definición?).

**Paso 3: Enriquecimiento.** Las decisiones se convierten en propuestas de cambio sobre las definiciones existentes. Se generan PRs al repo de conocimiento.

**Paso 4: Validación humana.** Un miembro del equipo revisa los PRs. Aprueba, rechaza o ajusta. El 80% del trabajo de redacción ya está hecho.

**Paso 5: Consolidación.** Las definiciones aprobadas se integran en el knowledge graph. Se actualizan aristas, se marcan specs obsoletas, se notifica a los repos afectados.

**Paso 6: SDD.** El agente SDD toma las specs consolidadas y genera:
- Tests de contrato para APIs
- Escenarios de aceptación para requisitos funcionales
- Tipos y validadores para schemas

**Paso 7: Dispatch.** Los artefactos generados se envían a los repos correspondientes vía PR. Cada repo ejecuta su CI, que ahora incluye los nuevos tests.

**Paso 8: Verificación.** El agente de drift monitorea que el código en cada repo sigue cumpliendo las specs. Si detecta divergencia, alerta.

**Paso 9: Loop.** La siguiente reunión genera nuevas decisiones. El ciclo se repite.

### 6.3. Tooling concreto por etapa

| Etapa | Herramienta | Formato |
|---|---|---|
| Transcripción | Teams, Otter, Fireflies | Texto + JSON |
| Extracción | Agente con LLM + prompt especializado en decisiones | YAML estructurado |
| Clasificación | Agente consultando knowledge graph | Etiquetas de impacto |
| Enriquecimiento | Agente generando diffs contra specs existentes | PR en repo de specs |
| Validación | Humano revisando PR | GitHub Review |
| Consolidación | GraphRAG + codebase-memory-mcp | Grafo actualizado |
| SDD | Agente generando tests desde specs | Ficheros de test + PR |
| Dispatch | GitHub Actions + MCP | CI por repo |
| Verificación | Agente de drift comparando código vs specs | Alertas, PRs correctivos |

### 6.4. El agente como coordinador cross-repo

El agente no reemplaza al desarrollador. Lo que hace es eliminar la fricción de coordinación:

- **Antes**: Ana cambia la API de pagos. Tiene que avisar a los 3 equipos que la consumen, actualizar la documentación, esperar a que todos desplieguen.
- **Ahora**: Ana propone el cambio en la spec. El CI notifica automáticamente a los 3 repos consumidores. Cada equipo revisa el impacto en su propio tiempo. Cuando todos están listos, el cambio se despliega coordinadamente.

El agente es el que:
1. Detecta qué repos se ven afectados por un cambio (consultando el grafo)
2. Genera PRs con los ajustes necesarios en cada repo (tipos, validadores, tests)
3. Notifica a los equipos responsables
4. Verifica que todos los CI pasan antes de autorizar el merge

### 6.5. Ejemplo end-to-end

**Contexto**: Producto de e-commerce con 5 repos: `web-app`, `mobile-app`, `api-gateway`, `payment-service`, `notification-service`. El knowledge graph de producto está en `product-specs`.

**Reunión**: Product Review. 30 minutos. Se decide añadir "pago en 3 cuotas sin intereses" como opción de pago.

**Lo que ocurre automáticamente**:

1. **Extracción**: El agente identifica la decisión y la clasifica:
   ```yaml
   decision: "Añadir pago en cuotas sin intereses"
   impact:
     repos: [payment-service, api-gateway, web-app, mobile-app]
     new_requirement: "REQ-PAY-008: Pago fraccionado"
     affected_contracts: [payment-api-v2]
   ```

2. **Enriquecimiento**: El agente crea `REQ-PAY-008.md` en `product-specs` y propone una actualización del contrato `payment-api-v2` para aceptar un campo `installments`.

3. **SDD**: De la spec actualizada, el agente genera:
   - Tests de contrato para `payment-api-v2` con el nuevo campo
   - Tipos TypeScript para `web-app` y `mobile-app`
   - Validadores Python para `api-gateway`

4. **Dispatch**: 4 PRs, uno por repo afectado. Cada PR contiene los cambios mínimos necesarios.

5. **Verificación**: Los CI de los 4 repos ejecutan los nuevos tests. Si todos pasan, los PRs se pueden mergear.

6. **Consolidación**: El knowledge graph se actualiza: nuevo nodo `REQ-PAY-008`, nuevas aristas `payment-service → implementa → REQ-PAY-008`, etc.

**Tiempo total desde el fin de la reunión hasta los PRs listos para revisión**: ~10-15 minutos (dependiendo de la velocidad del LLM y la complejidad de los cambios).

**Trabajo humano restante**: Revisar los PRs, ajustar la lógica de negocio en `payment-service`, aprobar y mergear.

### 6.6. Modos de fallo y cómo mitigarlos

Ningún sistema automático es infalible. Estos son los fallos más probables y cómo prepararse:

**Fallo 1: El agente alucina una decisión.** La transcripción dice "habría que mirar si migramos a Kafka" y el agente extrae "Decisión: migrar a Kafka". **Mitigación**: el paso de validación humana no es opcional. Todo PR generado desde transcripciones debe ser revisado por un humano antes del merge. Además, el agente debe reportar un `confidence_score` y no generar PRs automáticos para extracciones de confianza baja.

**Fallo 2: El knowledge graph se desincroniza.** Un servicio cambia su API sin pasar por el repo de producto. El grafo dice que `payment-service` expone `v2` pero en producción ya va por `v3`. **Mitigación**: el agente de drift debe ejecutarse periódicamente (diario, no solo en CI), comparando los contratos declarados en el grafo con lo que realmente devuelven los endpoints. Si detecta divergencia, genera una alerta, no un PR automático — alguien tiene que decidir si el cambio fue intencionado o es un bug.

**Fallo 3: Fatiga de alertas.** El detector de drift genera 15 alertas a la semana, la mayoría falsos positivos. El equipo aprende a ignorarlas. **Mitigación**: empezar con umbrales generosos, solo alertar sobre divergencias en contratos (OpenAPI/AsyncAPI), no en documentación narrativa. Añadir un mecanismo de "snooze" por servicio. Medir la tasa de falsos positivos y ajustar.

**Fallo 4: El repo de producto se convierte en otra especificación zombie.** Los PRs generados se acumulan sin revisar. Nadie mergea. El sistema se degrada a ruido. **Mitigación**: integrar la revisión de specs en la definición de "done" del equipo. Un PR de spec no revisado bloquea el siguiente PR de spec. Si el equipo no tiene capacidad de revisión, es preferible no generar PRs y limitarse a notificaciones pasivas.

**Fallo 5: Costes inesperados.** Procesar 20 horas de reuniones a la semana con un LLM, mantener un Neo4j, ejecutar CI adicional... **Mitigación**: empezar con modelos pequeños para la extracción (GPT-4o-mini es suficiente para identificar decisiones en transcripciones). Usar embeddings locales (zvec, Turso) para el grafo en lugar de Neo4j al principio. Medir coste por reunión desde el día 1.

### 6.7. Roadmap incremental: crawl → walk → run

El sistema completo que he descrito es el estado final. Nadie debería intentar implementarlo de golpe. Aquí está el camino progresivo, con pasos tan concretos que puedes ejecutarlos mañana:

**Fase 1: Crawl (semana 1-2).** El objetivo es crear el repositorio de producto y el hábito de documentar. Cero dependencias externas.

- **Día 1**: Crea el repo `product-specs/` con la estructura de la [sección 6.10](#610-template-del-repositorio-de-producto). Escribe `README.md` explicando qué es y quién lo mantiene.
- **Día 2**: Escribe `vision.md` — una página sobre qué es el producto y por qué existe. Sin tecnicismos: lo debe entender cualquier persona del equipo.
- **Día 3-4**: Identifica y escribe 3 requisitos cross-cutting. Elige los que más fricción generan hoy entre repos. Usa este template:

```markdown
# REQ-XXX-NNN: [Título descriptivo]

**Alcance**: cross-cutting
**Repos que implementan**: [repo-a], [repo-b]
**Fecha**: YYYY-MM-DD

## Descripción
[Qué debe hacer el sistema, en 2-3 frases. Sin ambigüedad.]

## Comportamiento esperado
- [Comportamiento 1 verificable]
- [Comportamiento 2 verificable]

## Motivación
[Qué problema resuelve. Referencia a ADRs o decisiones si existen.]
```

- **Día 5**: Escribe un ADR en cada repo usando [este template](https://adr.github.io/madr/). Elige una decisión técnica reciente que aún esté fresca.
- **Checkpoint**: ¿Tiene el equipo 3 requisitos cross-cutting y 1 ADR por repo? Si sí, crea un canal de Slack #product-specs y comparte los enlaces. Si no, itera.

**Fase 2: Walk (mes 1-3).** El objetivo es añadir contract testing y medir el valor antes de automatizar.

- **Semana 3-4**: Elige la API que más problemas de integración causa. Escribe su contrato en OpenAPI y guárdalo en `product-specs/contracts/`. Usa [Swagger Editor](https://editor.swagger.io/) si nunca has escrito OpenAPI.
- **Semana 5-6**: Configura contract testing en CI para ESA API. Schemathesis es la opción más simple: `pip install schemathesis && schemathesis run payment-api-v2.yaml --base-url=http://localhost:8080`. El objetivo es que el CI del proveedor falle si la implementación no cumple el contrato.
- **Semana 7-8**: Añade el lado consumidor: el repo que llama a esa API debe validar en su CI que puede parsear las respuestas del contrato. Pact es buena opción aquí.
- **Semana 9-12**: Introduce el agente de reuniones en modo borrador. No generes PRs todavía. Solo extrae decisiones de las transcripciones y publícalas en #product-specs para que el equipo las revise. Mide precisión durante 2 semanas: ¿cuántas decisiones extrae? ¿Cuántas son correctas?
- **Checkpoint**: ¿Falla el CI cuando alguien rompe un contrato? ¿El equipo confía en las extracciones del agente (>70% precisión)? Si sí, avanza a Run. Si no, quédate aquí — ya tienes el 60% del valor.

**Fase 3: Run (mes 3-6).** Cerrar el ciclo con agentes, grafo y drift detection.

- **Mes 4**: El agente de reuniones ahora genera PRs automáticos al repo de producto (con revisión humana obligatoria). Empieza con 1 reunión/semana, escala gradualmente.
- **Mes 5**: El agente SDD genera tests desde las specs para todos los servicios con contrato OpenAPI/AsyncAPI. Los tests se envían como PRs a cada repo. Si usas OpenSpec (`/opsx:apply`), intégralo aquí como motor de implementación intra-repo.
- **Mes 6**: Activa el agente de drift en modo diario. Solo alerta, no corrige. Introduce el knowledge graph con SQLite + embeddings (no Neo4j todavía). Conecta specs → contratos → código.
- **Más allá**: Incorpora fuentes adicionales (Jira, Google Docs vía markitdown), migra a Neo4j si el grafo supera 50 nodos, añade dashboards de trazabilidad. Si el volumen de features crece, GSD Core (`Discuss → Plan → Execute → Verify → Ship`) puede estructurar el ciclo de desarrollo con subagentes de contexto fresco.

**Lo que NO deberías hacer en ningún momento**:
- Desplegar tres agentes el primer mes. Uno, en modo borrador, tras 8 semanas.
- Usar Neo4j antes de tener 50+ nodos. SQLite + embeddings locales bastan.
- Automatizar los PRs sin haber medido la precisión del agente durante al menos 2 semanas.
- Forzar al equipo. El sistema debe ganarse su sitio demostrando que ahorra tiempo.

### 6.8. Quickstart: 15 minutos para empezar

No necesitas leer el artículo entero para empezar. Esto es lo mínimo:

```bash
# 1. Crea el repo de producto (2 min)
mkdir product-specs && cd product-specs && git init
echo "# Product Specs" > README.md
git add -A && git commit -m "init: product specs repository"

# 2. Escribe un requisito cross-cutting (8 min)
mkdir -p requirements
cat > requirements/REQ-IDEM-001.md << EOF
# REQ-IDEM-001: Idempotencia en operaciones de escritura

**Alcance**: cross-cutting
**Repos que implementan**: payment-service, order-service
**Fecha**: $(date +%Y-%m-%d)

## Descripción
Toda operación de escritura (POST, PUT, PATCH, DELETE) debe ser
idempotente. Una misma petición enviada N veces produce el mismo
resultado que enviada 1 vez.

## Comportamiento esperado
- Cada petición incluye un `Idempotency-Key` único
- Si el servidor ya procesó esa key, devuelve el resultado almacenado
- Si no, procesa la petición y almacena el resultado

## Motivación
La red no es fiable. Sin idempotencia, un retry del cliente puede
cobrar dos veces, crear dos pedidos o enviar dos notificaciones.
EOF

# 3. Escribe un ADR en un repo de código (5 min)
# Asume que payment-service/ existe como directorio;
# si no, créalo con: mkdir -p payment-service && cd payment-service && git init
cd ../payment-service
mkdir -p docs/adr
cat > docs/adr/001-use-postgres.md << EOF
# ADR-001: Usar PostgreSQL como base de datos principal

**Estado**: aceptado
**Fecha**: $(date +%Y-%m-%d)

## Contexto
Necesitamos una base de datos relacional para el servicio de pagos.

## Decisión
Usaremos PostgreSQL 16.

## Consecuencias
- Tipado fuerte, integridad transaccional
- El equipo ya conoce Postgres
- Necesitaremos réplicas de lectura para escalar
EOF

git add docs/adr/ && git commit -m "docs: ADR-001 PostgreSQL"
```

En 15 minutos has creado el repo de producto, un requisito cross-cutting y un ADR. Has dado el primer paso para atacar los patrones 1 (decisión huérfana) y 3 (susurro del senior). El resto del artículo te dice cómo escalar desde aquí.

### 6.9. ¿Y si solo quiero el 20% del sistema?

Muchos lectores no necesitarán — ni querrán — el sistema completo. Aquí tienes tres combinaciones mínimas que ya aportan valor:

**Combo mínimo viable (1 semana):** repo de producto + 3 requisitos cross-cutting + 1 ADR por repo. Coste: 0€. Valor: eliminas los patrones 1 (decisión huérfana) y 3 (susurro del senior). Esto solo ya justifica el esfuerzo.

**Combo intermedio (1 mes):** lo anterior + 1 contrato OpenAPI + contract testing en CI para una API. Coste: 0€ (Schemathesis es open source). Valor: eliminas el patrón 2 (especificación zombie) para la API que más te duele. Este es el punto dulce para equipos de 3-8 personas.

**Combo avanzado (3 meses):** lo anterior + agente de reuniones en modo borrador + codebase-memory-mcp en 1 repo piloto. Coste: ~$5-10/mes en tokens LLM. Valor: el conocimiento de las reuniones ya no se pierde y empiezas a tener trazabilidad código → decisión.

El sistema completo (fase Run) está ahí si lo necesitas. Pero no es el punto de partida. Es el punto de llegada.

### 6.10. Template del repositorio de producto

El repo `product-specs/` es el corazón del sistema. Esta es su estructura recomendada:

```
product-specs/
├── README.md                  # Qué es esto, cómo usarlo, quién lo mantiene
├── vision.md                  # Visión y estrategia del producto (~1 página)
├── requirements/              # Requisitos cross-cutting
│   ├── REQ-AUTH-001.md        #   Un fichero por requisito
│   ├── REQ-IDEM-002.md
│   └── REQ-RATE-003.md
├── contracts/                 # Contratos entre servicios
│   ├── payment-api-v2.yaml    #   OpenAPI / AsyncAPI / JSON Schema
│   ├── notification-events-v1.yaml
│   └── README.md              #   Convenciones de versionado de contratos
├── rfcs/                       # Propuestas en discusión (RFC-001, RFC-002...)
│   └── template.md
├── decisions/                 # Decisiones de producto ya aceptadas (no ADRs de repo)
│   ├── 2026-06-21-pago-cuotas.md
│   └── template.md
├── glossary.md                # Glosario compartido: ¿qué significa "tenant"?
├── architecture/              # Diagramas y decisiones de arquitectura global
│   └── system-context.md
└── .github/
    └── workflows/
        └── validate-specs.yml  # CI que valida consistencia de specs y contratos
```

**Reglas del repo de producto**:

1. **Un requisito por fichero.** `REQ-AUTH-001.md` es autónomo. Se puede linkear, referenciar y versionar individualmente.
2. **Cada requisito declara su alcance.** En el frontmatter o en las primeras líneas: ¿cross-cutting o repo-specific? ¿Qué repos implementan este requisito?
3. **Los contratos son parseables.** Nada de "el endpoint acepta un JSON con estos campos aproximadamente". OpenAPI, AsyncAPI o JSON Schema. Validables automáticamente.
4. **Las decisiones son inmutables.** Una vez escritas y aceptadas, no se editan. Si se revierten, se escribe una nueva decisión que referencia y depreca la anterior.
5. **El README explica el flujo.** Cualquier persona del equipo debe entender en 5 minutos cómo contribuir al repo de producto.

---

## 7. Conclusión: el producto que se documenta solo

El sistema que he descrito no es ciencia ficción. Cada pieza existe hoy:

- **Transcripción automática**: Teams, Otter, Fireflies
- **Extracción de decisiones**: LLMs con prompts especializados
- **Knowledge graph**: GraphRAG, codebase-memory-mcp, Graphify
- **SDD**: OpenAPI + contract testing + generación de tipos
- **CI cross-repo**: GitHub Actions + MCP
- **Coordinación**: agentes de IA

Lo que falta es integrarlo. Y eso es exactamente lo que propongo — pero no de golpe. La sección [6.7](#67-roadmap-incremental-crawl--walk--run) detalla el camino progresivo: empieza con un repo de markdown y un hábito de documentación. Añade contract testing cuando duela no tenerlo. Introduce agentes cuando el volumen de decisiones supere la capacidad humana de procesarlas.

El producto que se documenta solo no es un producto sin documentación. Es un producto donde la documentación **emerge del trabajo diario** en lugar de ser una tarea aparte que nadie hace. Las reuniones generan decisiones, las decisiones enriquecen las specs, las specs generan tests, los tests verifican el código, y el grafo mantiene la trazabilidad de todo.

En un mundo multi-repo, esto no es un lujo. Es la única forma de mantener la coherencia sin ahogar a los equipos en coordinación manual.

El agente de IA no es el que decide. Es el que **recuerda, conecta y propaga**. El humano sigue decidiendo. Pero ya no tiene que perseguir a tres equipos para contarles lo que se decidió en la reunión del martes.

---

## 8. Apéndices

### 8.1. Stack de herramientas recomendado

| Capa | Herramienta | Propósito | Fase | Complejidad |
|---|---|---|---|---|
| **Transcripción** | Teams / Otter / Fireflies | Capturar reuniones como texto | Crawl | Baja |
| **Repo de producto** | Git + Markdown | Definiciones cross-cutting, contratos, decisiones | Crawl | Baja |
| **Contract testing** | Schemathesis / Pact | Validar proveedores y consumidores en CI | Walk | Media |
| **Extracción** | Agente LLM (GPT-4o-mini, Claude) | Extraer decisiones, rationale, impacto | Walk | Media |
| **Contratos** | OpenAPI 3.1 / AsyncAPI / JSON Schema | APIs, eventos, payloads | Walk | Media |
| **Codebase indexing** | codebase-memory-mcp | Indexar código de N repos en el grafo | Walk | Alta |
| **SDD** | Agente LLM + templates de test | Generar tests desde specs | Run | Alta |
| **Grafo de producto** | GraphRAG + Neo4j (o SQLite + embeddings) | Nodos y aristas cross-repo, consultas de impacto | Run | Alta |
| **Drift detection** | Agente + codebase-memory-mcp | Comparar código vs specs, alertar divergencias | Run | Alta |
| **CI/CD** | GitHub Actions + MCP | Ejecutar tests cross-repo | Walk | Media |
| **Documentación** | markitdown + GraphRAG | Convertir docs externos, indexar, consultar | Run | Media |

**Nota sobre costes**: empezar con modelos pequeños (GPT-4o-mini, ~$0.15/1M tokens) para extracción de decisiones. Un Neo4j en la nube cuesta ~$65/mes (AuraDB Professional); plantéatelo solo a partir de la fase Run. Mientras tanto, SQLite + embeddings locales (Turso, zvec) cubren el 80% de los casos de uso de grafo con coste cero.

### 8.2. RACI: quién hace qué en este sistema

| Actividad | Responsible (ejecuta) | Accountable (responde) | Consulted (opina) | Informed (se le informa) |
|---|---|---|---|---|
| Escribir requisitos cross-cutting | Tech lead / Architect | Product Manager | Equipos de desarrollo | Toda la organización |
| Mantener contratos (OpenAPI) | Desarrollador del servicio proveedor | Tech lead del proveedor | Desarrolladores de servicios consumidores | Arquitecto |
| Revisar PRs de specs generadas | Tech lead / Architect | Product Manager | — | Equipo afectado |
| Aprobar cambios de contrato | Tech lead del proveedor + Tech lead del consumidor | Arquitecto | Equipos afectados | PM |
| Revisar extracciones del agente | Cualquier miembro del equipo | Tech lead | — | Canal #product-specs |
| Mantener AGENTS.md | Desarrollador del repo | Tech lead del repo | — | Agentes de IA (lo consumen) |
| Actuar sobre alertas de drift | Desarrollador que introdujo el cambio | Tech lead del repo | — | Arquitecto |

**Regla de oro**: el agente **propone**, nunca **decide**. Todo PR generado automáticamente requiere revisión humana. Si no hay capacidad de revisión, el agente se limita a notificar.

### 8.3. Convención de naming para requisitos

Los requisitos en `product-specs/requirements/` siguen este formato: `REQ-{CAT}-{NNN}.md`

- `CAT`: categoría de 3-4 letras. `AUTH` (autenticación), `IDEM` (idempotencia), `PAY` (pagos), `RATE` (rate limiting), `NOTIF` (notificaciones).
- `NNN`: número secuencial dentro de la categoría, empezando en 001.

La categoría la asigna quien crea el requisito. El número lo asigna el CI (`validate-specs.yml`) al validar el PR: busca el número más alto existente en esa categoría y asigna el siguiente. Si el PR no sigue la convención, el CI lo rechaza.

---

*Este artículo es el marco de trabajo. Queda como ejercicio práctico construir el pipeline con herramientas concretas, código ejecutable y un ejemplo funcionando sobre un producto multi-repo de verdad.*
