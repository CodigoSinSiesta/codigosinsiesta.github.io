---
slug: del-vibe-coding-al-agentic-engineering
title: "Del vibe coding al agentic engineering: por qué el techo de calidad sigue siendo tuyo"
authors: [codigosinsiesta]
tags: [ia, software-engineering, agentes, agentic-engineering, harness-engineering, calidad]
---

En 2025, "vibe coding" era la etiqueta para casi todo: desde el estudiante que genera código sin entender lo que hace hasta el senior que usa Claude para multiplicar su output 10×. En abril de 2026, Andrej Karpathy fue a Sequoia AI Ascent y separó las dos cosas de una vez por todas. Y lo que dijo importa más de lo que parece.

<!-- truncate -->

## El corte que faltaba

Karpathy lleva tiempo hablando de vibe coding. Pero este año añadió el complemento: **agentic engineering**. La distinción es quirúrgica:

| | Vibe coding | Agentic engineering |
|---|---|---|
| Objetivo | **Elevar el suelo** — que cualquiera pueda construir algo | **Preservar el techo** — calidad profesional cuando delegas a agentes |
| Audiencia | Todo el mundo | Ingenieros de software |
| Métrica | "¿Funciona?" | "¿Funciona, es seguro, es mantenible y voy más rápido?" |
| Responsabilidad | Implícita | Explícita: vulnerabilidades, diseño, criterio arquitectónico |

> "You're not allowed to introduce vulnerabilities due to vibe coding. You are still responsible for your software just as before, but can you go faster? And spoiler is you can — but how do you do that properly?"

Vibe coding elevó el suelo. Estupendo. Pero alguien tiene que preservar el techo. Y ese alguien eres tú — no tu agente.

## El mapa completo: tres capas, no una

Lo que Karpathy describió en Sequoia encaja perfectamente con un mapa que la industria lleva meses construyendo por separado:

```
Negocio     →  Agents-as-a-Service
Disciplina  →  Agentic Engineering
Sustrato    →  Harness Engineering
```

No son sinónimos. No son etapas. Son **capas con responsabilidades distintas**.

### Capa 1 — Harness Engineering: el sustrato técnico

El harness es la arquitectura que envuelve al LLM: tools tipadas, permisos declarativos, contexto gestionado, verificación, observabilidad. Es **dónde** trabaja el agente.

La evidencia empírica es contundente. El paper NLAH de Tsinghua (marzo 2026) demostró +16.8 puntos de accuracy cambiando solo la representación del harness — sin tocar el modelo. Stanford publicó meta-harness ese mismo mes: 6× más varianza en el output explicada por la arquitectura que por el modelo elegido. Y Factory construyó un clon de Slack en 16.5 horas con 89% de test coverage — no porque el modelo sea mágico, sino porque el harness estaba bien diseñado.

La arquitectura que envuelve al modelo explica más varianza que el modelo. Eso no es una opinión — es el resultado empírico que tres equipos independientes han replicado en los últimos seis meses.

### Capa 2 — Agentic Engineering: la disciplina del ingeniero

El harness es infraestructura. La disciplina es lo que hace el humano que la dirige. Karpathy lo describe como un reparto de responsabilidades muy concreto:

| El humano pone | El agente pone |
|---|---|
| Aesthetics, taste, oversight | Detalles de API (`keep_dims` vs `keep_dim`) |
| Decisiones arquitectónicas | Fill-in-the-blanks del código |
| Spec detallada y criterio | Investigación, codegen, refactor |

El agente hace el trabajo pesado. Tú haces el trabajo que requiere entendimiento.

Karpathy cuenta que en uno de sus proyectos el agente intentó cruzar la cuenta de Stripe con la de Google **por email**, sin entender que pueden ser distintos. *"This is the kind of thing where you have to be in charge of the spec."* Nadie más puede estar a cargo de eso.

Y añade algo más duro: el código generado a veces es bloaty, con copy-paste, abstracciones frágiles. *"It works but it's just gross."* Los labs aún no tienen un reward de aesthetics en el RL. Entretanto, revisar y refactorizar sigue siendo tu trabajo.

### Capa 3 — Agents-as-a-Service: el modelo de producto

Cuando el sustrato está bien diseñado y hay disciplina para dirigirlo, el modelo de producto cambia. Ya no vendes una herramienta — vendes el resultado de un agente trabajando.

| | SaaS clásico | Agents-as-a-Service |
|---|---|---|
| Qué vendes | Una herramienta | Un resultado |
| Quién trabaja | El cliente | Tu agente |
| Disposición a pagar | Limitada | Mayor — la delegación efectiva tiene más valor que la capacidad |

No porque sea un buzzword nuevo. Sino porque cuando construir software se vuelve commodity, **las apps simples dejan de diferenciarse**. La palanca es ejecutar más trabajo por el cliente, no añadir más funcionalidades.

## Las tres capas se necesitan mutuamente

El harness sin disciplina es infraestructura inerte — tienes las tools, pero nadie sabe dónde meter los approval gates ni cómo descomponer el spec. La disciplina sin harness es intención sin ejecución — sabes qué quieres construir pero el agente opera en caos. Y el AaaS sin las dos capas debajo es humo de marketing — prometes resultados y entregas un wrapper de GPT que falla en producción.

Lo que Karpathy, Bascuñana y los equipos de investigación de Tsinghua y Stanford están describiendo de formas distintas es lo mismo: **los multiplicadores de productividad que traen los agentes solo se materializan si hay ingeniería seria debajo**.

El 10× del que lleva años hablándose en Silicon Valley se queda corto, según Karpathy:

> "I think this is magnified a lot more. 10× is not the speed-up you gain. People who are very good at this peak a lot more than 10× from my perspective right now."

Pero ese "más de 10×" no es gratis. Depende de lo bien que ejerces de director: con qué criterio eliges tools, dónde metes gates de revisión, qué dejas en el spec, qué esperas revisar a posteriori.

## Lo que no se puede delegar

La frase con la que Karpathy cerró su charla en Sequoia es la que más nos resuena en Código Sin Siesta:

> "You can outsource your thinking but you can't outsource your understanding."

Puedes delegarle la implementación. No puedes delegarle el entendimiento de qué construir ni por qué merece la pena. No puedes delegarle el criterio para detectar cuando el agente está haciendo algo incorrecto. No puedes delegarle la responsabilidad sobre las vulnerabilidades que introduce.

El entendimiento no es delegable. Y por eso aprender en profundidad — arquitectura, patrones, fundamentos — sigue mereciendo la pena aunque la inteligencia se abarate.

Es exactamente la razón por la que esta comunidad existe.

---

## Lo que viene en Código Sin Siesta

Hemos actualizado nuestras presentaciones con este material:

- [Harness Engineering](https://codigosinsiesta.github.io/harness-engineering-presentation/) — ahora con el contexto completo de las tres capas
- [Patrones de Orquestación](https://codigosinsiesta.github.io/orquestacion-patrones-presentation/) — con RecursiveMAS como frontier pattern en la taxonomía evolutiva

Y si quieres explorar las fuentes primarias:
- [Andrej Karpathy en Sequoia AI Ascent 2026](https://www.youtube.com/watch?v=96jN2OCOfLs)
- [G Bascuñana — De SaaS a Agentes](https://www.youtube.com/watch?v=LK81gDhCOGw)
- [RecursiveMAS — arXiv:2604.25917](https://arxiv.org/abs/2604.25917)
- [Building Effective Agents — Anthropic](https://www.anthropic.com/research/building-effective-agents)
