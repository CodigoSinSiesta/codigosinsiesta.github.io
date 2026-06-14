---
title: "Módulo 1: Fundamentos de IA para Desarrolladores"
ruta: "agentes-ia"
orden: 1
duracion: "1.5 horas"
---
Bienvenido al primer módulo de la ruta de aprendizaje. Aquí construirás la base conceptual que necesitas para entender cómo funcionan los agentes de IA desde la perspectiva de un desarrollador.

**⏱️ Duración estimada:** 1.5 horas

## 🎯 Requisitos Previos

- **JavaScript básico**: Variables, funciones, async/await
- **Uso de terminal**: Poder ejecutar comandos npm
- **Cuenta de Anthropic**: Para obtener API key de Claude

### Lo que NO necesitas

- Conocimiento previo de IA o Machine Learning
- Matemáticas avanzadas
- Python o frameworks de ML

## 📖 Contenido

### 1. ¿Qué es un Agente de IA?

Un agente de IA es un programa que:
1. **Recibe un objetivo** del usuario
2. **Planifica pasos** para lograr el objetivo
3. **Ejecuta acciones** usando herramientas
4. **Evalúa resultados** y ajusta su enfoque
5. **Repite** hasta completar la tarea o fallar

```
┌─────────────────────────────────────────────────────────┐
│                     CICLO DEL AGENTE                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│    ┌──────────┐     ┌──────────┐     ┌──────────┐      │
│    │ Objetivo │────▶│ Planear  │────▶│ Ejecutar │      │
│    └──────────┘     └──────────┘     └────┬─────┘      │
│                                           │             │
│                     ┌──────────┐          │             │
│                     │ Evaluar  │◀─────────┘             │
│                     └────┬─────┘                        │
│                          │                              │
│              ┌───────────┴───────────┐                  │
│              ▼                       ▼                  │
│         ┌─────────┐           ┌──────────┐             │
│         │ Repetir │           │ Terminar │             │
│         └─────────┘           └──────────┘             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Diferencia clave con chatbots tradicionales:**

| Chatbot tradicional | Agente de IA |
|---------------------|--------------|
| Responde preguntas | Completa tareas |
| Una sola interacción | Múltiples pasos |
| Solo genera texto | Ejecuta herramientas |
| Sin memoria de contexto | Mantiene estado |

### 2. LLMs: El Cerebro del Agente

Los **Large Language Models** (LLMs) como Claude son modelos de lenguaje entrenados con enormes cantidades de texto. Pero para un desarrollador, lo importante es entender qué PUEDEN y qué NO PUEDEN hacer.

#### Lo que un LLM PUEDE hacer bien

- ✅ Entender instrucciones en lenguaje natural
- ✅ Generar código, texto, y estructuras de datos
- ✅ Razonar sobre problemas paso a paso
- ✅ Seguir formatos específicos (JSON, XML, etc.)
- ✅ Decidir qué herramienta usar y cuándo

#### Lo que un LLM NO PUEDE hacer

- ❌ Ejecutar código (solo lo genera)
- ❌ Acceder a internet o bases de datos (sin herramientas)
- ❌ Recordar conversaciones anteriores (sin contexto)
- ❌ Garantizar respuestas 100% correctas
- ❌ Operar en tiempo real (latencia de segundos)

> **Insight clave**: El LLM es el "cerebro" que decide, pero necesita "manos" (herramientas) para actuar en el mundo real.

### 3. LLMs vs. Machine Learning Tradicional

Si vienes del mundo del ML tradicional, aquí están las diferencias clave:

| ML Tradicional | LLMs para Agentes |
|----------------|-------------------|
| Entrenas tu propio modelo | Usas un modelo pre-entrenado |
| Necesitas datasets etiquetados | Solo necesitas prompts |
| Predice valores numéricos | Genera texto/decisiones |
| Especializado en una tarea | Generalista (multi-propósito) |
| Meses de desarrollo | Horas de desarrollo |

**Para un desarrollador esto significa:**
- No necesitas infraestructura de ML
- No necesitas GPUs ni entrenamiento
- Tu trabajo es **orquestar** el LLM, no entrenarlo

### 4. APIs de LLMs: La Interfaz de Comunicación

Los LLMs como Claude se acceden mediante APIs HTTP. Entender esta interfaz es fundamental.

#### Estructura básica de una request

```javascript
// Anatomía de una llamada a Claude API
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01'
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-20250514',      // Modelo a usar
    max_tokens: 1024,               // Límite de tokens de salida
    messages: [                     // Historial de conversación
      { role: 'user', content: '¿Qué hora es?' }
    ]
  })
});
```

#### Conceptos clave de la API

**Tokens**: Son fragmentos de texto (aproximadamente 4 caracteres = 1 token)
- Input tokens: Lo que envías (tu prompt)
- Output tokens: Lo que recibes (respuesta)
- Pagas por ambos

**Context Window**: Memoria máxima del modelo
- Claude puede manejar ~200,000 tokens
- Incluye TODO: instrucciones + historial + respuesta
- Si te pasas, el modelo no puede responder

**Temperature**: Control de creatividad (0.0 = determinista, 1.0 = creativo)
- Para agentes, usa 0.0-0.3 (respuestas consistentes)
- Para contenido creativo, usa 0.7-1.0

### 5. Prompting Básico

El prompt es tu principal herramienta de comunicación con el LLM. Aquí están los patrones fundamentales.

#### Estructura de un buen prompt

```markdown
# ROL
Eres un asistente de programación experto en JavaScript.

# CONTEXTO
El usuario está trabajando en un proyecto de Node.js con Express.

# TAREA
Responde preguntas técnicas sobre código JavaScript.

# FORMATO
- Usa bloques de código con syntax highlighting
- Explica tu razonamiento paso a paso
- Si no sabes algo, dilo claramente

# RESTRICCIONES
- No uses bibliotecas que no se hayan mencionado
- Mantén las respuestas concisas (< 500 palabras)
```

#### Los 4 componentes de un prompt efectivo

1. **Rol**: Define quién es el asistente
2. **Contexto**: Proporciona información necesaria
3. **Tarea**: Especifica qué hacer
4. **Formato**: Define cómo debe responder

#### Anti-patrones a evitar

```javascript
// ❌ Prompt vago
"Ayúdame con mi código"

// ✅ Prompt específico
"Tengo esta función que debería filtrar usuarios por edad,
pero devuelve un array vacío. ¿Puedes identificar el bug?
[código aquí]"
```

### 6. Costos y Límites

Antes de construir agentes, entiende los costos:

| Modelo | Input (por 1M tokens) | Output (por 1M tokens) |
|--------|----------------------|------------------------|
| Claude 3.5 Sonnet | $3 | $15 |
| Claude 3 Opus | $15 | $75 |
| Claude 3 Haiku | $0.25 | $1.25 |

**Ejemplo de costo real:**
- Un prompt típico de agente: ~2,000 tokens input
- Respuesta típica: ~500 tokens output
- Costo por interacción (Sonnet): ~$0.0135 (~1.4 centavos)
- 1000 interacciones/día ≈ $13.50/día

**Rate limits típicos:**
- Requests por minuto (RPM): 50-1000 según tier
- Tokens por minuto (TPM): 40,000-100,000 según tier
- Si excedes: HTTP 429 (rate limited)

> **Tip**: Usa Haiku para tareas simples, Sonnet para la mayoría de casos, Opus solo cuando necesites máxima calidad.

## 🛠️ Proyecto Práctico: Tu Primer Prompt a Claude API

Vamos a hacer tu primera llamada a la API de Claude. Este proyecto te enseñará la base de toda interacción con el modelo.

### Paso 1: Configurar ambiente

```bash
# Crear directorio del proyecto
mkdir mi-primer-agente && cd mi-primer-agente

# Inicializar proyecto Node.js
npm init -y

# Instalar SDK de Anthropic
npm install @anthropic-ai/sdk
```

### Paso 2: Configurar API key

```bash
# Obtén tu API key de https://console.anthropic.com/
# Crea archivo .env (NUNCA lo subas a git)
echo "ANTHROPIC_API_KEY=tu_api_key_aqui" > .env

# Añade .env a .gitignore
echo ".env" >> .gitignore
```

### Paso 3: Crear el script

Crea un archivo `index.js`:

```javascript


// Inicializar cliente (usa ANTHROPIC_API_KEY del environment)
const anthropic = new Anthropic();

async function primerPrompt() {
  console.log('🚀 Enviando primer prompt a Claude...\n');

  const mensaje = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Eres un asistente experto en desarrollo de software.

Explícame en 3 puntos breves qué es un "agente de IA"
y por qué es diferente de un chatbot tradicional.

Usa formato Markdown con bullet points.`
      }
    ]
  });

  console.log('📝 Respuesta de Claude:\n');
  console.log(mensaje.content[0].text);

  console.log('\n📊 Estadísticas:');
  console.log(`- Tokens de entrada: ${mensaje.usage.input_tokens}`);
  console.log(`- Tokens de salida: ${mensaje.usage.output_tokens}`);
  console.log(`- Modelo usado: ${mensaje.model}`);
}

primerPrompt().catch(console.error);
```

### Paso 4: Ejecutar

```bash
# Añade "type": "module" a package.json para ES modules
npm pkg set type=module

# Cargar variables de entorno y ejecutar
node --env-file=.env index.js
```

### Resultado esperado

Deberías ver algo como:

```
🚀 Enviando primer prompt a Claude...

📝 Respuesta de Claude:

## Agente de IA vs Chatbot Tradicional

• **Autonomía y acciones**: Un agente de IA puede ejecutar tareas
  de forma autónoma usando herramientas externas...

• **Ciclo de razonamiento**: Los agentes implementan un ciclo
  de "pensar-actuar-observar"...

• **Persistencia de estado**: A diferencia de los chatbots
  que olvidan entre mensajes...

📊 Estadísticas:
- Tokens de entrada: 67
- Tokens de salida: 187
- Modelo usado: claude-sonnet-4-20250514
```

### 🎯 Verificación de Aprendizaje

Antes de pasar al siguiente módulo, asegúrate de poder responder:

1. ¿Cuál es la diferencia entre un chatbot y un agente de IA?
2. ¿Qué significa "context window" y por qué importa?
3. ¿Cuáles son los 4 componentes de un prompt efectivo?
4. ¿Qué es un token y cómo afecta los costos?

### 🚀 Reto Extra

Modifica el script para:
1. Hacer 3 prompts diferentes en secuencia
2. Calcular el costo total estimado
3. Experimentar con diferentes valores de `temperature`

## ⚠️ Errores Comunes

### Error: Invalid API Key
```
Error: 401 Unauthorized - Invalid API key
```
**Solución**: Verifica que tu API key esté correcta y que la variable de entorno se esté cargando.

### Error: Rate Limited
```
Error: 429 Too Many Requests
```
**Solución**: Espera unos segundos y reintenta. En producción, implementa exponential backoff.

### Error: Context Window Exceeded
```
Error: Request too large for model context window
```
**Solución**: Reduce el tamaño de tu prompt o historial de conversación.

## 📚 Recursos Adicionales

- [Documentación oficial de Anthropic](https://docs.anthropic.com/)
- [Guía de Prompt Engineering de Anthropic](https://docs.anthropic.com/claude/docs/intro-to-prompting)
- [Antropic Cookbook](https://github.com/anthropics/anthropic-cookbook)

