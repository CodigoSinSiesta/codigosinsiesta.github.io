---
title: "Guía 07 · Lo que le cuentas: instrucciones y peticiones"
description: "Las tres capas de lo que el agente lee antes de actuar: el system prompt que trae OpenCode, el AGENTS.md de tu proyecto y tu petición, y cómo escribir bien las dos que dependen de ti."
ruta: "ia-desde-cero"
orden: 7
duracion: "15 min"
---

Antes de hacer nada, el agente lee tres capas de texto: las instrucciones que trae OpenCode de serie, las de tu proyecto y lo que tú le pides. La primera no la eliges. Las otras dos, sí, y casi todo lo que sale bien o mal en una tarea depende de ellas.

<p class="guia__nota">Guía de lectura, sin vídeo. Unos 15 minutos con la práctica del final.</p>

## Lo que aprendes

- Qué es el **system prompt** y por qué el agente llega con instrucciones antes de que escribas nada.
- Qué **`AGENTS.md`** carga OpenCode 2 y cuándo; `CLAUDE.md`, no.
- Cómo empezar uno con `/init` y por qué recortarlo después.
- Las cuatro piezas de una petición: **contexto, instrucción, reglas y ejemplos**.
- Por qué el agente no conoce tu proyecto hasta que lo lee.
- Escribir un `AGENTS.md` para la lista de la compra y ver qué cambia con él.

## Lo que trae el agente: el system prompt

Un **prompt** es el texto que se le envía al modelo. El **system prompt** (instrucciones de sistema) es el que va primero, antes de cualquier mensaje tuyo: quién es el agente, qué herramientas tiene, cómo debe comportarse. Lo escribe quien hace el agente, no tú; en OpenCode 2 se envía antes que cualquier otra instrucción.

La presentación *Agentes como compañeros de codificación* lo compara con unos planos: no son el edificio, pero deciden qué se puede construir y cómo. El system prompt no hace el trabajo, pero marca cómo se hará.

- **Ocupa sitio en cada petición.** En la guía 04, un simple «hola» llevó al modelo varios miles de tokens (trozos de palabra, la unidad con la que lee y escribe), casi todos del manual y las herramientas.
- **No sabe nada de tu proyecto.** Es el mismo para todo el que usa OpenCode. Lo propio de tu código tiene que llegarle por otro sitio.

## AGENTS.md: las instrucciones de tu proyecto

`AGENTS.md` es un fichero Markdown normal que pones en tu repositorio para el agente. La web del formato lo llama un README para agentes: cómo se ejecutan las pruebas, qué convenciones sigue el código, qué no se toca. No tiene campos obligatorios, y lo leen muchos agentes además de OpenCode, como Pi.

Qué carga OpenCode 2, según su documentación:

| Fichero | Cuándo se carga |
|---|---|
| `~/.config/opencode/AGENTS.md` | Siempre, si existe: tus preferencias para todos los proyectos |
| `AGENTS.md` de la carpeta donde abres OpenCode y de las carpetas superiores | Al empezar, todos los que encuentre subiendo |
| `AGENTS.md` de una subcarpeta | Cuando el agente lee o lista algo de esa zona, del más cercano al más lejano |

- **OpenCode 2 solo reconoce `AGENTS.md`.** Un `CLAUDE.md` (el equivalente de Claude Code) no lo carga.
- **Viaja en cada petición**, como el system prompt (guía 04). Por eso conviene que sea corto: empieza pequeño y añade una línea cada vez que el agente tropiece en lo mismo.
- **No es memoria.** El agente no aprende de tus sesiones: vuelve a leer el fichero cada vez.

### Empezar con /init

El comando `/init` le pide al agente que cree o actualice el `AGENTS.md`. Antes lee el README, el `package.json`, la configuración de pruebas y de integración continua, y otros ficheros de instrucciones como `CLAUDE.md` o `.cursorrules`: aunque OpenCode no cargue `CLAUDE.md`, `/init` lo aprovecha para escribir el tuyo.

Aún no sale en la documentación de la versión 2, pero está en su código, y sus instrucciones dan un buen criterio: cada línea debería responder a «¿se le escaparía esto a un agente sin ayuda?». Si no, sobra. Revisa lo que genere y recórtalo.

## Un AGENTS.md mínimo para la lista de la compra

El proyecto del laboratorio es pequeño: `src/compra.js` con las funciones y `tests/compra.test.js` con las pruebas. Un `AGENTS.md` útil cabe en una pantalla:

```markdown
# Lista de la compra

Proyecto de prácticas en JavaScript, sin dependencias.

## Estructura
- `src/compra.js`: las funciones de la lista.
- `tests/compra.test.js`: las pruebas, con `node:test`.

## Comandos
- Pruebas: `npm test`. Pásalas después de cada cambio y dime el resultado.

## Reglas
- Los precios van en céntimos y son siempre enteros. Si hay que redondear, al céntimo.
- Las funciones no modifican la lista que reciben: devuelven una nueva.
- Cada función nueva lleva al menos una prueba.
- No instales dependencias.
- No cambies las pruebas que ya existen sin preguntarme.
```

Que los precios van en céntimos se puede deducir del código, pero es fácil saltárselo; que no toque las pruebas existentes no lo dice ningún fichero.

## Cómo pedir: contexto, instrucción, reglas y ejemplos

`AGENTS.md` vale para todo el proyecto. Tu petición vale para una tarea. La presentación *IA generativa: conceptos fundamentales* la divide en cuatro piezas:

| Pieza | Qué le dices | En la lista de la compra |
|---|---|---|
| **Contexto** | Dónde está y qué hay alrededor | «En `src/compra.js`, junto a `anadir` y `total`» |
| **Instrucción** | Qué hay que hacer y qué esperas recibir | «Añade `rebajar(lista, nombre, porcentaje)`, que rebaja el precio de un producto» |
| **Reglas** | Lo obligatorio y lo prohibido | «El precio sigue en céntimos enteros; no toques otros ficheros» |
| **Ejemplos** | La forma del resultado | «Pan a 120 céntimos rebajado un 10 % queda a 108» |

Las reglas de siempre van a `AGENTS.md`; en la petición quedan las de esta tarea. El ejemplo es la pieza que más se olvida y la que más ahorra: un caso con sus números deja menos sitio a interpretaciones que cualquier explicación.

<p class="guia__nota">La diapositiva añade porcentajes de mejora al usar las cuatro piezas. No los repetimos porque no citan fuente.</p>

En la guía 10 verás la misma tarea pedida mal y bien, con estas piezas más una que ahí importa mucho: cómo sabrás que está terminada.

## Por qué no conoce tu proyecto hasta que lo lee

El modelo aprendió de texto público hasta su fecha de corte (guía 01). Tu repositorio no estaba ahí, y aunque estuviera, no sabría cómo lo tienes hoy. Cada sesión empieza solo con el system prompt, tus `AGENTS.md` y tu petición; lo demás lo busca con sus herramientas (`read`, `glob`, `grep`, guía 05), y cada fichero leído ocupa sitio en la ventana de contexto (guía 04).

- **Lo que no le cuentas, lo adivina.** Rellena con lo más probable: en muchos proyectos JavaScript los precios van en euros con decimales; en el tuyo, no.
- **Lo que le cuentas, se ahorra buscarlo.** Señalar el fichero con `@` (guía 03) o tenerlo en `AGENTS.md` le evita vueltas de leer y buscar.

## Pruébalo en OpenCode

Hazlo dentro del laboratorio, en la rama `guia-07`. Vas a hacer la misma petición dos veces, sin `AGENTS.md` y con él.

1. **Sin `AGENTS.md`.** Comprueba que no hay ninguno (`ls`), abre `opencode`, elige un modelo gratuito y, en el agente *build*, escribe una petición corta a propósito:

   ```text
   Añade una función rebajar(lista, nombre, porcentaje) que rebaje el precio de un producto.
   ```

   Aprueba lo que te pida y fíjate en cuatro cosas: si el precio rebajado sigue siendo un entero (prueba con 95 céntimos y un 15 %), si modifica la lista o devuelve una nueva, si añade una prueba y si ejecuta `npm test` por su cuenta.

2. **Deja la lista como estaba:** `/undo`, o en la terminal `git restore .`.

3. **Escribe el `AGENTS.md`** del apartado anterior en la raíz del proyecto. Puedes copiarlo tú o pedírselo al agente.

4. **Con `AGENTS.md`.** Abre una sesión nueva (`/new`) para que lo cargue desde el principio y repite exactamente la misma petición. Mira las mismas cuatro cosas.

5. **Compara.** Lo esperable es que la segunda vez respete más reglas sin que se las hayas dicho en la petición. Como el modelo no responde siempre igual (guía 01), si la diferencia no es clara, repite cada versión una vez más antes de sacar conclusiones.

Para ir más allá: en otra rama, borra tu `AGENTS.md`, ejecuta `/init` y compara lo que escribe el agente con lo que escribiste tú. ¿Qué ha visto que tú no pusiste? ¿Qué sobra?

## Fuentes

- [Documentación de OpenCode 2: instrucciones](https://opencode.ai/v2/docs/instructions/): qué `AGENTS.md` carga, en qué orden, y que no usa `CLAUDE.md`.
- [Las instrucciones de `/init` en el código de OpenCode](https://github.com/anomalyco/opencode/blob/v2.2.5/packages/core/src/plugin/command/initialize.txt) (versión 2.2.5): qué lee antes de escribir el `AGENTS.md`.
- [agents.md](https://agents.md): el formato `AGENTS.md`, compartido por muchos agentes.
- Presentaciones [Agentes como compañeros de codificación](https://codigosinsiesta.com/coding-agents-presentation/) (diapositiva 04, el system prompt y los planos), [IA generativa: conceptos fundamentales](https://codigosinsiesta.com/ai-presentation/) (diapositiva 06, la fórmula) y [Agentes de codificación con OpenCode](https://codigosinsiesta.com/taller-opencode-presentation/) (`AGENTS.md`, el system prompt de tu repositorio).
- El [laboratorio de la ruta](https://github.com/CodigoSinSiesta/empieza-aqui-laboratorio): la lista de la compra y sus pruebas.
