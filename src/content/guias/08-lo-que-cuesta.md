---
title: "Guía 08 · Lo que cuesta"
description: "Qué se paga al usar un modelo, por qué una sesión larga sale cada vez más cara, qué hace la caché, qué tienen de gratis los modelos gratuitos y cuándo merece la pena pagar."
ruta: "ia-desde-cero"
orden: 8
duracion: "12 min"
---

Qué se paga al usar un modelo, por qué una sesión larga sale cada vez más cara, qué hace la caché, qué tienen de gratis los modelos gratuitos y cuándo merece la pena pagar.

<p class="guia__nota">Guía sin vídeo. Los precios cambian cada pocos meses: aquí van como orden de magnitud y con enlace a la página oficial de cada proveedor.</p>

## Resumen

- **Qué se paga:** los tokens que envías (entrada) y los que escribe el modelo (salida), a precios distintos.
- **Por qué una sesión larga sale cara:** cada petición reenvía toda la conversación.
- **Qué hace la caché:** cobra a una fracción del precio el principio de la petición, que se repite.
- **Qué tienen de gratis los gratuitos:** no cobran, pero tienen tope, caducan y cada uno trata tus datos a su manera.
- **Cuándo pagar:** cuando lo gratuito te frena más de lo que te ahorra.

## Se paga por tokens

En la [guía 01](/rutas/ia-desde-cero/01-que-es-la-ia) vimos que el modelo no trabaja con palabras, sino con **tokens**: trozos de texto, a menudo una palabra corta o parte de una larga. Los proveedores cobran por tokens, y separan dos cuentas:

| | Qué es | Cómo se cobra |
|---|---|---|
| **Entrada** | Todo lo que OpenCode envía en una petición: manual del agente, herramientas, `AGENTS.md`, conversación y lo leído | Por millón de tokens |
| **Salida** | Lo que escribe el modelo: respuesta, código y peticiones de herramienta | Por millón, varias veces más caro |

Aun así, un agente envía muchísimo más de lo que recibe, y por eso **la entrada suele ser la mayor parte de la factura**.

## Por qué una sesión larga cuesta cada vez más

La [ventana de contexto](/rutas/ia-desde-cero/04-la-ventana-de-contexto) es todo lo que el modelo tiene delante en una petición. No recuerda nada entre peticiones: OpenCode le reenvía la conversación entera cada vez. Y una pregunta tuya pueden ser varias peticiones, una más por cada herramienta que usa.

Lo medimos en el laboratorio para el vídeo 04, con el agente *plan* y uno de los modelos gratuitos:

| Momento de la sesión | Tokens de entrada de la petición |
|---|---|
| Sesión nueva, solo «hola» | 5.474 |
| Tras leer cuatro ficheros pequeños | 8.307 |

Antes de que digas nada, el manual y las herramientas ya ocupan varios miles de tokens, en todas las peticiones. Y cada fichero leído se suma a lo que viene detrás y no se descuenta nunca. Con ficheros de un proyecto real, el salto es mucho mayor.

<p class="guia__nota">Las cifras se midieron el 2 de noviembre de 2026 con OpenCode 2.2.5. Cambian con el modelo y con la versión de OpenCode: tómalas como orden de magnitud.</p>

Por eso **en una sesión larga cada mensaje cuesta más que el anterior**: otra razón para abrir una sesión nueva (`/new`) al cambiar de tarea.

## La caché: por qué abarata

Casi todo lo que se envía es igual que en la petición anterior; solo cambia el final. La **caché de prompts** del proveedor guarda ese principio ya procesado durante un rato y, si la siguiente petición empieza exactamente igual, lo cobra mucho más barato y responde antes.

- **Tiene que coincidir exactamente.** Otro manual, otra herramienta u otro modelo, y se cobra todo a precio completo.
- **Caduca.** En Anthropic, por ejemplo, dura unos minutos por defecto: tras una pausa, la siguiente petición se paga entera.
- **El descuento es grande.** En Anthropic y OpenAI, lo leído de la caché cuesta en torno a una décima parte de la entrada normal, o menos.

En el laboratorio, en la primera vuelta de la tarea del vídeo 05, casi 2.000 de unos 5.400 tokens de entrada salieron ya de la caché.

## Una cuenta de ejemplo

<p class="guia__nota">Ejemplo ilustrativo con números redondos e inventados. No es el precio de ningún modelo: los reales están en la página de cada proveedor.</p>

Supón un modelo que cobra **1 $ por millón de tokens de entrada** y **5 $ por millón de salida**, y una sesión de **40 peticiones** que empieza en unos 6.000 tokens de entrada y acaba en unos 30.000.

- **Entrada:** de media, unos 18.000 tokens por petición × 40 = 720.000 tokens → **0,72 $**.
- **Salida:** unos 500 tokens por petición × 40 = 20.000 tokens → **0,10 $**.
- **Total sin caché:** unos **0,82 $**.
- **Con caché:** si el 90 % de la entrada sale de la caché a una décima parte del precio, la entrada baja a unos 0,14 $, y el total, a unos **0,24 $**.

Si la sesión llegara a 150.000 tokens en vez de 30.000, la entrada se multiplicaría por cinco. Lo que encarece es **lo que se acumula y se reenvía**.

## Qué tienen de gratis los modelos gratuitos

Los modelos gratuitos de OpenCode no cobran ni piden cuenta ni clave. Pero tienen condiciones:

- **Tope de mensajes,** que se reinicia a una hora fija. OpenCode no publica la cifra.
- **«Por tiempo limitado».** Así aparecen todos en su tabla de modelos, y la lista cambia casi cada semana. Por eso no nombramos ninguno: se eligen con `/models`.
- **Privacidad distinta por modelo.** Unos dicen que ni guardan ni entrenan con lo que envías; otros pueden usarlo para mejorar el modelo, lo guardan 30 días o son solo para pruebas. Míralo en la tabla antes de elegir, y practica siempre con el proyecto de juguete.
- **En Codespaces llegan agotados:** en nuestras pruebas, «Free usage limit reached» a la primera petición. Sospechamos que el límite va por IP y que las de Codespaces se comparten, pero OpenCode no lo documenta.

### Las alternativas gratuitas de Codespaces

| | NVIDIA (build.nvidia.com) | GitHub Copilot |
|---|---|---|
| Qué hace falta | Cuenta gratuita del NVIDIA Developer Program, con verificación por SMS (falla en algunos países) | Cuenta de GitHub; `/connect` y un código de dispositivo |
| Límites | Sin créditos desde 2025: límites de ritmo según modelo y carga, que NVIDIA no publica | Los de tu plan. Lo probamos con uno de empresa; Copilot Free está sin comprobar |
| Condiciones | Solo evaluación y prototipos; prohíbe subir datos personales y recoge, anonimizado, lo enviado para mejorar sus productos | Las de tu plan |
| Lo que entra en la caja | Tu clave, legible por el agente | El token de Copilot, legible por el agente |

De cómo proteger esa clave o ese token se ocupa la [guía 09](/rutas/ia-desde-cero/09-lo-que-puede-romper).

## Cuándo merece la pena pagar

Para hacer esta ruta no hace falta. Pagar empieza a tener sentido cuando:

- **El tope te frena** a menudo a mitad de tarea: el tiempo perdido vale más que lo que cuesta.
- **El modelo no da para la tarea.** Uno mejor que acierta a la primera puede salir más barato que uno gratuito al que hay que pedírselo tres veces, reenviando todo en cada intento.
- **Necesitas otras condiciones de privacidad.** Lee los términos del proveedor; y el código de tu empresa, solo donde tu empresa diga.

Pagues o no, ahorra lo mismo que mejora el trabajo: sesiones cortas por tarea, no hacerle leer lo que no necesita y no cambiar de modelo a mitad de sesión, que invalida la caché.

## Pruébalo en OpenCode

En el laboratorio, en la rama de la guía 05:

1. Abre OpenCode y empieza una sesión nueva con `/new`.
2. Antes de escribir nada, mira el pie de la pantalla: tokens y porcentaje de la ventana de contexto.
3. Pídele la tarea de la guía 05: «quita un producto de la lista» con su prueba y `npm test`. Aprueba los permisos que pida.
4. Apunta lo que marca el pie tras cada paso: sube en cada lectura y no baja.
5. Al acabar, compáralo con el principio: esa diferencia se reenvía en cada petición nueva de esta sesión.

Con un modelo gratuito el pie no muestra gasto, porque no hay nada que cobrar; con uno de pago, aparecería lo gastado en dólares.

## Fuentes

- OpenCode, [tabla de modelos de Console](https://opencode.ai/v2/docs/console/models/): modelos gratuitos «for a limited time», su privacidad y precios por millón de tokens de entrada, salida y caché.
- OpenCode, [changelog](https://opencode.ai/changelog) (v2.1.2: el tope de mensajes gratuitos y su reinicio) y [FAQ](https://opencode.ai/download).
- OpenCode, [proveedores](https://opencode.ai/v2/docs/providers): conectar GitHub Copilot con `/connect`.
- Anthropic, [precios](https://platform.claude.com/docs/en/about-claude/pricing) y [caché de prompts](https://platform.claude.com/docs/en/build-with-claude/prompt-caching).
- OpenAI, [caché de prompts](https://developers.openai.com/api/docs/guides/prompt-caching).
- GitHub, [planes de Copilot](https://github.com/features/copilot/plans).
- NVIDIA, [documentación de la API](https://docs.api.nvidia.com/nim/docs/product), [términos del plan de prueba](https://assets.ngc.nvidia.com/products/api-catalog/legal/NVIDIA%20API%20Trial%20Terms%20of%20Service.pdf) y [el anuncio en el foro](https://forums.developer.nvidia.com/t/cannot-find-the-amount-of-credits-left-on-nim-api/337051) de que ya no hay créditos.
- Las cifras de tokens se midieron en el laboratorio el 2 de noviembre de 2026; cambian con el modelo.
