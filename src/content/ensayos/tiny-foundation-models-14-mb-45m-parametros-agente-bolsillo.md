---
title: "Tiny foundation models: 14 MB, 45M parámetros y un agente entero en tu bolsillo"
description: "El 'agente local' en 2026 ya no necesita una M3 Max ni un A100. cactus-compute/needle ejecuta tool calling en 28 MB de RAM con un binario de 14 MB. Análisis técnico del paper, ejemplos hands-on, comparativa con FunctionGemma, Apple FM y LFM2.5, y por qué este cambio de escala importa más de lo que parece."
fecha: 2026-08-12
tags: ["ia", "edge", "on-device", "tiny-ml", "agentes", "wearables", "cactus"]
tipo: ensayo
autor: "Alejandro de la Fuente"
---

El mes pasado estuve en una conversación con un equipo que está construyendo un asistente para personas mayores en smart speakers y gateways de hogar. El requisito era claro: el modelo tiene que correr en el dispositivo del usuario, sin red, sin mandar datos a la nube, y consumir menos batería que la linterna. Cualquier modelo de 7B parámetros quedaba descartado de entrada.

Cuando les mencioné [`cactus-compute/needle`](https://github.com/cactus-compute/needle) —45 millones de parámetros, 14 MB de binario, 28 MB de RAM en sesión completa, soporte nativo de tool calling— la conversación cambió. Hasta entonces habían evaluado Phi-4 mini y modelos quantized de 7B sobre hardware edge, con resultados poco prometedores en latencia y batería. Por primera vez, el "asistente local con acciones" tenía un modelo específico para ese nicho.

Este artículo es sobre lo que significa ese cambio de escala. Y sobre por qué, cuando hablamos de "agente en local", ya no nos referimos a lo mismo que hace un año.

## La nueva frontera de tamaño

Enero de 2025. "Agente local" significaba "LLaMA 7B cuantizado corriendo en una M3 Max". Funcionaba, pero exigía hardware específico, RAM abundante, y batería a tope. Cualquier despliegue real requería un servidor.

Agosto de 2026. "Agente local" puede significar "modelo de 45M parámetros corriendo en un Pixel de gama media con 28 MB de RAM ocupados". La conversación sobre dónde corre el modelo ya no es principalmente técnica (qué SoC, qué runtime): es de producto (qué margen, qué regulación, qué experiencia offline, qué coste de actualización).

La convergencia es esto: teléfonos, wearables, smart home y vehículos llevan años acumulando capacidad de cómputo y sensores. Lo que les faltaba era un modelo pequeño, ejecutable, con tool calling nativo. Needle 2 es la primera apuesta seria que cumple los cuatro requisitos a la vez.

## Qué es un tiny foundation model y qué no es

Antes de entrar en Needle específicamente, una definición operativa. Un **tiny foundation model** (TFM) en 2026 es un modelo que cumple cuatro condiciones:

1. **Menos de 50M parámetros.** Por debajo de ese umbral, el binario cabe en la flash de dispositivos básicos y se puede distribuir como un asset normal.
2. **Binario único.** No hay modelo por un lado, tokenizer por otro, y configuración por otro. Un solo archivo `.cact` o equivalente que se carga y se ejecuta.
3. **Soporte nativo de tool calling y structured extraction.** No es un modelo de lenguaje al que le enchufas un wrapper. El modelo fue entrenado para emitir function calls y extraer JSON con gramática.
4. **Memoria acotada y predecible.** La sesión completa —contexto, herramientas, KV cache— cabe en un orden de magnitud conocido (decenas de MB), no en "depende del prompt".

Lo que un TFM **no es**:

- No es un LLM grande cuantizado a 4 bits. Eso da un modelo de 4 GB con un comportamiento similar al original. Un TFM es arquitectura y entrenamiento distintos, no compresión.
- No es un SLM (small language model) clásico tipo Phi-2 o TinyLlama. Esos son de 1-3B parámetros, diseñados para lenguaje general. Un TFM está especializado en una tarea (tool calling, extracción) y optimizado para footprint.
- No es un modelo de embedding. No genera texto libre; emite calls o JSON estructurado. La diferencia importa para el diseño de producto.

## Anatomía de cactus-compute/needle

[`cactus-compute/needle`](https://github.com/cactus-compute/needle) (3.963★, MIT) es la implementación de referencia de Needle 2, documentada en el paper [arXiv:2607.18363](https://arxiv.org/abs/2607.18363). El README empieza con un resumen que merece la pena citar entero:

> Needle 2 is an open 45M-parameter model for tool calling, device use and structured extraction. The whole model is a single 14MB binary that runs a full session in about 28MB of RAM. It is built on our Simple Attention Network findings, compressed to CQ2-bit with Cactus Quants, and baked into its own engine.

Lo que eso significa pieza a pieza:

| Métrica | Valor | Comparación |
|---|---|---|
| Parámetros | 45M | ~16x menor que FunctionGemma 270M |
| Binario único | 14 MB | Cabe en la flash de cualquier dispositivo moderno |
| RAM en sesión | ~28 MB | 28 MB totales, contexto incluido |
| Cuantización | CQ2-bit (2 bits) | vs f16 de FunctionGemma |
| Tool calling | Nativo, grammar-constrained | vs prompting con JSON |
| Confidence scoring | Calibrado, aprendido | vs heurística |

La arquitectura del modelo se llama **Simple Attention Network** y combina cuatro ingredientes:

1. **Hadamard MLP en lugar de FFN.** Una matriz ortonormal fija de Walsh-Hadamard reemplaza la red feed-forward estándar. Sin pesos que cargar, se aplica en n log n. Reduce parámetros y cómputo sin perder capacidad.
2. **GQA (Grouped Query Attention).** Múltiples heads de query comparten la misma key-value. Reduce la huella de la KV cache — clave para mantener la sesión en 28 MB.
3. **Engram key-value memory.** Sitios a dos capas disparan filas (kₜ, vₜ) recuperadas de tablas hash de n-gramas. Memoria explícita inyectada en el cómputo, sin coste de inferencia sobre los n-gramas.
4. **Multi-lane hyper-connections.** Varios streams residuales en paralelo, normalizados por Sinkhorn. Permite que el modelo combine información de varias rutas sin que una domine.

El resultado: un modelo que en benchmarks está al nivel de FunctionGemma 270M (de Google) y Apple FM, siendo 5-70x más pequeño y cuantizado a 2 bits donde los demás están a f16.

**Lo que el paper no te dice en el README, pero importa para tu producto:**

- El contexto es una ventana deslizante de **256 tokens** con las herramientas fijadas como KV sinks. Por eso la memoria total no crece con la conversación. Sesión larga = mismo consumo de RAM.
- El modelo **rechaza peticiones fuera de catálogo** devolviendo la lista vacía `[]`. No hay fallback a texto libre. Si declaras tres herramientas, el modelo solo puede llamar a esas tres.
- El campo `reasoning` se genera sin restricción gramatical. Solo el `call` está constrained. La consecuencia: la derivación puede ser legible aunque el JSON de la call siempre esté bien formado.

## Grammar-constrained decoding nativo y confidence scoring calibrado

Dos features técnicas que parecen menores pero que cambian el diseño de producto.

**Grammar-constrained decoding nativo.** Cuando declaras una herramienta con tipos, Needle genera automáticamente una gramática a nivel de byte. El decoder solo puede emitir tokens que produzcan strings válidos según esa gramática. Si declaras `Literal["heat", "cool", "auto"]` para un campo, el modelo no puede emitir `"heating"`. Si declaras `Annotated[float, Field(gt=0, le=10000)]` para amount, no puede emitir `-50` ni `10001`.

Comparación: el approach alternativo es "pídele al LLM que devuelva JSON válido y luego valida en Python". Funciona, pero un 5-15% de las veces tienes que reintentar. Cada reintento cuesta tokens, latencia y batería. Con grammar-constrained decoding, el modelo emite JSON válido **a la primera**. La diferencia en latencia media es de 2-4x.

```python
# del README de Needle
from typing import Annotated

@needle.tool
def send_money(
    amount: Annotated[float, needle.Field(gt=0, le=10000, description="USD, hasta 10.000")],
    to:     Annotated[str,   needle.Field(pattern=r"^@[a-z0-9_]+$", description="handle destinatario")],
    memo:   Annotated[str,   needle.Field(max_length=80)] = "",
):
    """Send money to a handle."""
    return {"sent": amount, "to": to}
```

El `pattern=r"^@[a-z0-9_]+$"` se compila a una gramática. El modelo emite handles válidos o no emite nada.

**Confidence scoring calibrado.** Cada respuesta del modelo lleva un campo `confidence` entre 0 y 1. Es la mínima entre dos señales: una cabeza calibrada post-hoc que puntúa el prompt completo más la call producida, y la probabilidad de decoding de los tokens de la call. Si las dos señales no coinciden, la confianza baja.

```json
{
  "type": "call",
  "success": true,
  "function_calls": [
    {"name": "set_lights", "arguments": {"room": "living room", "on": true, "brightness": 30}}
  ],
  "reasoning": "'living room' -> room; 'dim' -> on true, brightness 30",
  "confidence": 0.94
}
```

El contrato es directo: fijas un threshold para tu producto (digamos 0.85). Por encima, ejecutas. Por debajo, escalas a un modelo más grande o repreguntas al usuario. Esto convierte "el modelo a veces falla" en "el modelo falla con probabilidad N, y la decisión de qué hacer la tomas tú".

Para los que vienen de la generación de texto con LLMs grandes: esta es la diferencia entre "esperar que el modelo alucine" y "medir programáticamente la incertidumbre". El diseño de producto cambia completamente cuando tienes una señal cuantitativa.

## Hands-on: `pip install cactus-needle`

La forma más rápida de probar Needle es instalar el paquete Python y declarar dos o tres herramientas:

```bash
pip install cactus-needle
```

El primer arranque descarga los pesos desde HuggingFace (`Cactus-Compute/needle2`) y los cachea. A partir de ahí, todo es offline.

```python
import needle

@needle.tool
def get_weather(city: str):
    """Get the current weather for a city."""
    return {"city": city, "temp_c": 27, "sky": "clear"}

agent = needle.Needle(tools=[get_weather])
result = agent.run("qué tiempo hace ahora en Lagos")

print(result["results"])
# [{'city': 'Lagos', 'temp_c': 27, 'sky': 'clear'}]
```

El modelo lee la firma y el docstring, decide qué herramienta llamar, ejecuta la función con los argumentos que extrajo, y devuelve los resultados. Todo en local. La latencia medida en el README: **4300 tokens/s en prefill, 850 tokens/s en decode** en hardware de referencia (probablemente M-class).

El caso más interesante es con varias herramientas y constraints:

```python
from typing import Literal

@needle.tool
def set_thermostat(
    temperature: int,
    mode: Literal["heat", "cool", "auto"] = "auto",
):
    """Configura el termostato.

    Args:
      temperature: temperatura objetivo en Celsius
      mode: estrategia de climatización
    """
    return {"temperature": temperature, "mode": mode}

agent = needle.Needle(tools=[set_thermostat])
agent.run("ponlo a 21 y refresca la habitación")
```

El `Literal["heat", "cool", "auto"]` se compila a una gramática con tres opciones. El modelo **no puede** emitir `mode: "calor"`. Si lo intenta, el decoder lo bloquea a nivel de token. Es la diferencia entre "el modelo respeta el esquema" y "el esquema es físicamente imposible de violar".

## El contexto: dos rutas al inference local-first

Hay una conversación complementaria que merece la pena traer aquí. El espacio "inferencia local en dispositivo" se está consolidando con dos rutas distintas, que se complementan en lugar de competir:

**Ruta A — Tool-calling edge (cactus-compute/needle).** Modelos especializados en emitir calls estructuradas. No generan texto libre. Optimizados para footprint mínimo y latencia predecible. Casos de uso: asistentes de dispositivo, smart home, asistentes para personas mayores, IoT industrial.

**Ruta B — Multimodal edge (antirez/h3.c).** Modelos multimodales pequeños escritos en C puro, diseñados para correr en cualquier sitio (incluso microcontroladores). Procesan imagen y texto. No están optimizados para tool calling, sino para comprensión sensorial local.

Las dos rutas atacan el mismo problema ("inferencia en el dispositivo") desde dos ángulos distintos. Needle es para cuando tu dispositivo necesita **actuar**. h3.c es para cuando tu dispositivo necesita **percibir**. En un producto real, probablemente acabas combinando las dos: h3.c para procesar la imagen del termómetro, Needle para decidir si subir o bajar la temperatura según el resultado.

## Cuándo un tiny FM es la elección correcta

La decisión no es técnica, es de producto. Un TFM es la elección correcta cuando cumples al menos dos de estas condiciones:

**Restricción dura de privacidad.** Tu producto maneja datos que no pueden salir del dispositivo. Historial médico, finanzas personales, conversaciones íntimas. Cualquier modelo que toque un servidor remoto queda descartado por diseño.

**Restricción dura de latencia.** Tu producto necesita responder en menos de 200ms. La latencia de red ya consume 50-150ms en buenas condiciones. Si el modelo corre en el dispositivo, te ahorras la red.

**Restricción dura de coste.** Tu producto hace miles de inferencias por usuario al día. A 0.001€ por inferencia, mil inferencias son 1€ por usuario. Multiplica por 100k usuarios y tienes un problema de margen.

**Restricción dura de hardware.** Tu dispositivo tiene margen para correr un binario de 14 MB y mantener la sesión en 28-64 MB de RAM. Esto incluye teléfonos de gama baja, smart speakers, gateways de smart home, vehículos con SoC dedicado, microcontroladores con PSRAM. Una pulsera o wearable compacto típico (Nordic nRF5340, Apollo4) tiene 256 KB-512 KB de RAM y 1-4 MB de flash: ahí un TFM de 28 MB no entra sin rediseñar el SoC. Si tu dispositivo está en ese rango, este artículo te dice qué hardware necesitas diseñar, no que el modelo actual entre.

**Caso de uso narrow.** Tu producto hace una cosa concreta (clasificar tickets, extraer datos de facturas, controlar luces) y no necesita razonamiento general. Los TFM están optimizados para tareas específicas.

Si marcas tres o más, el TFM no es solo la elección correcta — es probablemente la única opción viable.

**Ejemplo aterrizado: pulsera para personas mayores.**

| Condición | ¿Se cumple? | Notas |
|---|---|---|
| Restricción de privacidad | Sí | Datos médicos y de localización, no pueden salir del dispositivo |
| Restricción de latencia | Sí | Alertas críticas en menos de 200ms |
| Restricción de coste | Sí | 1.000 inferencias/día a 0.001€ = 1€/usuario/día; insostenible en cloud |
| Restricción de hardware | **No** | Pulsera típica (Nordic nRF5340) tiene 256 KB-512 KB de RAM; Needle necesita 28 MB |
| Caso de uso narrow | Sí | Alertas, recordatorios, llamadas; razonamiento general no requerido |

Resultado: 4 de 5, pero la condición de hardware es bloqueadora. **Veredicto explícito: las pulseras compactas actuales no pueden correr Needle.** El caso sí encajaría en smart speakers, gateways de hogar, tablets fijas o teléfonos. Si tu producto es wearable barato, este artículo te sirve para diseñar el SoC del siguiente modelo, no para desplegar Needle hoy.

## La frontier size-vs-quality

Datos del README y del paper. Advertencia honesta: los benchmarks son del propio equipo (cactus-compute), así que tómalos con la cautela habitual. La columna "RAM en inferencia" incluye modelo + KV cache + overhead del runtime; "RAM del peso" es solo el binario del modelo. Las cifras de competidores son estimaciones de la documentación pública de cada uno, no medidas propias.

| Modelo | Parámetros | Bit-width | RAM peso | RAM en inferencia | Tool calling nativo | Notas |
|---|---|---|---|---|---|---|
| **Needle 2** | 45M | 2 bits | ~14 MB | ~28 MB | Sí | Binario único, grammar-constrained, confidence scoring |
| FunctionGemma 270M | 270M | f16 | ~540 MB | ~1.0-1.5 GB | Sí | De Google, formato gemma estándar |
| Apple FM | ~3B (estimado, no público) | mixto (4-8 bits) | ~1.5 GB | ~3-5 GB | Limitado | Privado, solo Apple Intelligence |
| LFM2.5 230M | 230M | f16 por defecto | ~460 MB | ~700 MB-1 GB | Parcial | De Liquid AI, multilingüe |
| Phi-4 mini | ~3.8B | mixto | ~2 GB | ~6-8 GB | Sí | De Microsoft, razonamiento general |

Lo que la tabla muestra: Needle es 5-70x más pequeño que la competencia a tool calling equivalente. La pregunta razonable es cuánto pierdes en calidad por esa reducción.

La respuesta honesta: en benchmarks de tool calling estandarizados (Berkeley Function Calling Leaderboard y similares), Needle está al nivel de FunctionGemma en métricas principales, con dos diferencias cualitativas:

1. Needle es **mejor** en consistencia: la varianza entre ejecuciones es menor, porque la gramática fuerza outputs válidos y la cuantización a 2 bits afecta menos al reasoning que al lenguaje libre.
2. Needle es **peor** en tareas que requieren razonamiento largo o chaining multi-paso. El contexto deslizante de 256 tokens limita la profundidad de las cadenas.

La implicación práctica: Needle es ideal como **primera capa** en una arquitectura agent. El agente principal (Claude, GPT-4, lo que sea) hace el planning y el reasoning. Needle hace el 90% de las ejecuciones mecánicas que no necesitan contexto largo: clasificar, extraer, transformar, decidir entre A y B.

## Limitaciones reales y modos de fallo

Honestidad. Un modelo de 45M parámetros tiene límites que un LLM grande no tiene. Identificarlos antes evita frustración en producción.

**Limitación 1: contexto corto.** La ventana es 256 tokens. Cualquier tarea que requiera mirar más allá de un párrafo se queda fuera. Needle está diseñado para turnos cortos, no para conversaciones largas.

**Limitación 2: razonamiento multi-paso limitado.** El modelo puede encadenar dos o tres llamadas si las dependencias están claras (`search_for_contact` → `send_message` con el `contact_id`). Más allá de eso, pierde el hilo.

**Limitación 3: zero-shot fuera de catálogo.** Si declaras cinco herramientas y el usuario pide algo que ninguna resuelve, Needle devuelve `[]`. No intenta improvisar. Es lo correcto para producción (no ejecuta acciones no autorizadas), pero requiere que el catálogo de herramientas cubra los casos de uso reales.

**Limitación 4: languages.** El modelo está entrenado mayoritariamente en inglés. En español funciona, pero con menos precisión en tools con nombres y descripciones complicadas. El README sugiere que el multilingual coverage se expandirá en versiones futuras. Para mercados con multilingüismo fuerte (catalán + español, euskera + español) hay que hacer fine-tune por mercado y testear la calidad por idioma antes de desplegar.

**Limitación 5: latencia real en hardware con thermal throttling y batería baja.** Los benchmarks del README (`4300 tokens/s` en prefill, `850 tokens/s` en decode) están medidos en hardware de referencia. En un SoC de dispositivo wearable bajo carga térmica o con batería al 20%, esa cifra puede caer 5-10x. Si tu producto promete una latencia fija ("alerta en menos de 200ms"), el cálculo debe hacerse en el peor caso, no en el banco de pruebas. Sin perfilado térmico, no puedes calcular autonomía.

**Limitación 6: actualizaciones OTA del modelo.** Un `.cact` de 14 MB en una flota de 100k dispositivos no se actualiza como una app. Necesitas decidir: ¿delta-updates para reducir el payload? ¿particionado A/B para no romper dispositivos a mitad de update? ¿cómo verificas que la nueva versión se cargó correctamente antes de borrar la antigua? No hay respuestas estándar — cada equipo de firmware lo resuelve a su manera, y Needle no trae tooling para esto.

**Limitación 7: certificación regulatoria.** Si tu producto toma decisiones críticas para la salud del usuario (alertas médicas, recordatorios de medicación, detección de caídas), puede reclasificarse como producto sanitario: Clase IIa en la UE (MDR), 510(k) en FDA. Eso obliga a documentar el comportamiento del modelo entre versiones, validar que las actualizaciones no introducen regresiones, y mantener un registro de cambios firmados por el responsable regulatorio. Needle cambia de versión cada pocas semanas; tu proceso regulatorio probablemente necesita cadencia trimestral. La desalineación es un riesgo de cumplimiento.

**Mitigación: arquitectura híbrida.** El patrón que mejor funciona en producción:

```
[input] → [tiny FM para clasificación/intent]
              ↓ (confidence > threshold?)
[ejecutar herramienta directamente]
              ↓ (confidence < threshold?)
[escalar a LLM grande para planning + ejecución]
```

Tiny FM hace el 80% del trabajo en local, gratis y rápido. LLM grande solo se invoca para el 20% ambiguo. Resultado: coste por interacción 5-10x menor, latencia media menor, y la garantía de que las acciones críticas se deciden en local.

### Caso de uso aterrizado: asistente en smart speaker para personas mayores

Para que el caso no quede abstracto, una concreción. Imagina un smart speaker de gama media (1 GB de RAM, Cortex-A53, batería a red eléctrica sin restricción de energía) que asiste a personas mayores en casa:

```python
from typing import Literal, Annotated
import needle

@needle.tool
def trigger_emergency_alert(
    type: Literal["fall", "no_movement", "low_heart_rate", "gas_smell"],
    confidence_threshold: Annotated[float, needle.Field(ge=0.0, le=1.0)] = 0.85,
):
    """Lanza una alerta a servicios de emergencia o familiares.

    Args:
      type: tipo de incidente detectado
      confidence_threshold: confianza mínima para actuar sin repreguntar
    """
    return {"alert_type": type, "escalated": True}

@needle.tool
def schedule_medication_reminder(
    medication: str,
    time_iso: str,
):
    """Programa un recordatorio de medicación.

    Args:
      medication: nombre del medicamento
      time_iso: hora en formato ISO 8601
    """
    return {"scheduled": True, "medication": medication, "at": time_iso}

@needle.tool
def call_emergency_contact(name: Annotated[str, needle.Field(pattern=r"^[A-Za-záéíóúñ ]{2,40}$")]):
    """Llama al contacto de emergencia configurado."""
    return {"calling": name, "status": "ringing"}

agent = needle.Needle(tools=[trigger_emergency_alert, schedule_medication_reminder, call_emergency_contact])
```

Las métricas de aceptación razonables para este caso: >95% de las alertas de caída detectadas correctamente, <2% de falsos positivos que generen ansiedad al usuario. El confidence score permite fijar el threshold: si la pulsera externa (que detecta la caída) reporta "caída probable" con 0.92 y el modelo confirma "entorno coherente con caída" con 0.88, se ejecuta la alerta. Si el modelo devuelve `[]` o confidence <0.7, el sistema repregunta al usuario por voz antes de escalar.

**Limitación hardware explícita:** este caso funciona en smart speaker, gateway de hogar o tablet fija. Una pulsera compacta típica (Nordic nRF5340, Apollo4) tiene 100-1000x menos RAM de la que Needle necesita. Si tu producto es wearable barato, este artículo no te sirve para producción hoy; te sirve para decidir qué hardware diseñar.

## Implicaciones para el stack de agents

El cambio relevante no es "existe un modelo pequeño". Es lo que ese modelo pequeño habilita en el diseño de productos.

**Edge-first como decisión de producto, no técnica.** Cuando el modelo cabe en el dispositivo, ya no estás decidiendo entre "servidor en la nube" y "servidor on-premise". Estás decidiendo si la lógica corre **en el dispositivo del usuario o en tu infraestructura**. Eso cambia el cálculo de márgenes, el modelo de privacidad, la regulación aplicable, y la experiencia de uso cuando no hay red.

**El modelo no se descarga. Ya viene pre-instalado.** Es plausible que la distribución de modelos TFMs evolucione hacia patrones ya conocidos: fuentes tipográficas, codecs de audio, bibliotecas estándar del sistema. El modelo vendría embebido en el sistema operativo, en el firmware, o en el bundle de la app. El usuario no "instala un LLM"; usa el dispositivo. Si esa dinámica se consolida, los marketplaces de modelos abiertos quedan como una capa de nicho (developers, customización, fine-tuning), no como el canal principal de distribución — la mayor parte del uso saldría por defecto del dispositivo del usuario.

**El agent runtime se fragmenta por hardware.** Los frameworks de agentes ya no diseñan solo para servidores potentes. Diseñan para gradiente: el mismo agente decide en tiempo real si una subtarea la hace en local con un TFM, en edge con un modelo mediano, o en la nube con un modelo grande. Es la evolución natural de lo que se llamó "cascade routing" pero a nivel de dispositivo.

**Las herramientas cambian de granularidad.** Un LLM grande puede razonar sobre herramientas abstractas ("busca información sobre el clima"). Un TFM necesita herramientas concretas con contratos precisos. El diseño de productos agent-first en edge va a empujar hacia APIs más estrechas, más tipadas, más parecidas a function calls que a endpoints REST ambiguos.

## Cierre

La pregunta ya no es "qué modelo grande uso". Es "qué decisiones dejo en el dispositivo del usuario". Y la respuesta, en 2026, depende de qué tan estrechas sean tus herramientas y qué tan predecible sea tu latencia.

cactus-compute/needle no es la única apuesta en el espacio. Habrá competidores —Apple FM es el más obvio cuando se abra más allá del ecosistema Apple, y los modelos chinos (Qwen, GLM) sacarán versiones sub-100M tarde o temprano. Pero la dirección está clara: el modelo pequeño, especializado, ejecutable en local, ya es un componente realista de producto.

Si tu próximo producto tiene un componente agent, y ese componente va a correr en un smart speaker, gateway o teléfono: **diseña desde el principio para que parte de la lógica viva en el dispositivo**. El modelo existe, el tooling está maduro, los cuellos de botella que quedan son de hardware y regulación, no de IA.

---

## Apéndice — Recursos

| Recurso | URL | Notas |
|---|---|---|
| Repositorio | https://github.com/cactus-compute/needle | MIT, 3.963★, 268 líneas de README |
| Pesos | https://huggingface.co/Cactus-Compute/needle2 | Auto-descarga en el primer `import needle` |
| Paper | https://arxiv.org/abs/2607.18363 | Simple Attention Network, 2026 |
| Cita BibTeX | (en README, sección Citation) | Cactus Compute, Inc. 2026 |
| Playground | `needle playground` | Servidor local en `127.0.0.1:7860` |

Estrellas verificadas vía GitHub REST API el 2026-08-12. Datos de arquitectura del paper arXiv 2607.18363.
