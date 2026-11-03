---
title: "Vídeo 01 · Qué es la IA con la que vas a programar"
description: "Qué es un modelo de lenguaje y qué no es: completa texto pieza a pieza (tokens), no responde siempre lo mismo y se equivoca con la misma seguridad con la que acierta."
ruta: "ia-desde-cero"
orden: 1
duracion: "8 min"
video: "01-que-es-la-ia.mp4"
subtitulos: "/subtitulos/ia-desde-cero/01-que-es-la-ia.es.vtt"
---

Antes de instalar nada, qué hay al otro lado cuando le escribes a una IA. Un modelo de lenguaje continúa tu texto pieza a pieza; esas piezas se llaman tokens, y con ellas se miden sus límites y su precio. Elige con algo de azar, así que no responde siempre lo mismo. Y se equivoca con la misma seguridad con la que acierta, sobre todo cuando le falta información. Con estas tres ideas se entiende todo lo que viene en la ruta.

<p class="guia__nota">Dura 8 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

## Resumen por capítulos

### 1 · Un autocompletado muy bueno

<p><button type="button" class="ir-a" data-t="16">▶ Ir a 0:16</button></p>

- **Un modelo de lenguaje continúa tu texto.** Es como el teclado del móvil, que después de «nos vemos» te sugiere «mañana» sin saber nada de tu agenda, pero a una escala enorme: lo han entrenado con cantidades gigantescas de libros, páginas web, documentación y código, y ha aprendido qué suele venir después de qué.
- **Pieza a pieza:** recibe lo que has escrito, calcula cuál es la siguiente pieza más adecuada, la añade al final y vuelve a empezar con ella incluida. Por eso ves la respuesta aparecer poco a poco, como si alguien la tecleara.
- **Lo que no hace:** no busca la respuesta en una base de datos, no consulta internet (salvo que una herramienta lo haga por él, vídeo 05) y no ejecuta tu código para ver si funciona. Escribe lo que, según todo lo que ha visto, tiene más sentido escribir a continuación.
- **Y aun así acierta mucho:** ha visto tanto que, en la mayoría de problemas habituales, lo que «tiene más sentido escribir» coincide con una solución correcta. La palabra importante es *la mayoría*.

### 2 · Las piezas se llaman tokens

<p><button type="button" class="ir-a" data-t="123">▶ Ir a 2:03</button></p>

- **Token:** la pieza de texto con la que trabaja el modelo. No es exactamente una palabra: las cortas y frecuentes suelen ser un token, y las largas o raras se parten en varios («programación» puede quedar en dos o tres trozos). Los signos de puntuación, los espacios y los símbolos del código también cuentan, así que una línea de código gasta más tokens de lo que parece.
- **Cada modelo trocea a su manera:** la misma frase no mide lo mismo en todos.
- **Por qué te importa:** con tokens se mide todo lo que el modelo puede tener delante a la vez, que tiene un límite (la *ventana de contexto*, vídeo 04). Y con tokens se paga en los modelos de pago, tanto los que envías como los que te devuelve (guía 08).
- **Cómo leer las cifras:** «admite tantos miles de tokens» o «cuesta tanto por millón de tokens» hablan de piezas de texto, no de palabras ni de peticiones.

### 3 · Por qué no responde siempre lo mismo

<p><button type="button" class="ir-a" data-t="196">▶ Ir a 3:16</button></p>

- **Varias candidatas en cada paso:** el modelo no tiene una única siguiente pieza posible, sino varias, cada una con su probabilidad. Después de «nos vemos», «mañana» puede ser muy probable; «luego», algo menos.
- **Elige con un poco de azar:** casi siempre una de las más probables, pero no siempre la misma. Si eligiera siempre la primera, sonaría repetitivo y rígido. Ese grado de azar se puede ajustar, y a menudo lo verás llamado *temperatura*.
- **Consecuencia:** la misma pregunta dos veces puede dar dos respuestas distintas. A veces cambian solo las palabras; otras, la solución entera (una vez un bucle, otra una función de una librería). Y a veces una es correcta y la otra no.
- **La regla:** no es un fallo, es su forma de funcionar. Una respuesta del modelo es un intento, no un veredicto: si algo importa, se comprueba, y en programación se comprueba ejecutando el código y sus pruebas.

### 4 · Se equivoca con seguridad

<p><button type="button" class="ir-a" data-t="271">▶ Ir a 4:31</button></p>

- **El modelo no sabe cuándo no sabe.** Como el arquitecto que, en lugar de decir «no lo sé», se inventa una normativa que suena razonable: el plano parece impecable hasta que llega el inspector.
- **Alucinación:** una respuesta que suena correcta, escrita con total seguridad, y que es falsa. En código tiene formas reconocibles: una función que no existe en tu librería pero cuyo nombre encaja con las demás, una opción de un comando que nunca ha existido o un parámetro con el nombre de otra versión. Todo con el mismo tono tranquilo que cuando acierta.
- **Por qué pasa:** escribe lo que tiene sentido escribir, y una función inventada con buen nombre tiene muchísimo sentido. Ninguna parte del modelo comprueba si existe de verdad.
- **Fecha de corte:** un modelo aprende con textos hasta una fecha y después no se entera de nada más. Si una librería cambió después, seguirá escribiendo la versión antigua sin avisarte.
- **Se equivoca más cuando le falta información:** si no ha visto tu proyecto, se imagina cómo es; si no conoce tu versión de la librería, supone una. Cuanto menos contexto real tiene, más rellena los huecos con lo probable.
- **Las dos defensas de toda la ruta:** darle información real (tus ficheros, tus versiones y tus reglas) para que no tenga que imaginarla, y verificar lo que hace sin fiarte del tono con el que lo dice. Es justo lo que añade un *agente de programación* (vídeo 02): puede leer tus ficheros y ejecutar tus pruebas.

Una alucinación en código, como la del vídeo:

```text
import { format } from 'date-fns';

format.enEspanolLargo(new Date());
// TypeError: format.enEspanolLargo is not a function
```

- `date-fns` es una librería real, y por eso suena creíble; `enEspanolLargo` no existe: el nombre encaja con los demás, pero es inventado.
- Te enteras al ejecutar (el `TypeError`), no al leerlo.

### 5 · Hay muchos modelos

<p><button type="button" class="ir-a" data-t="390">▶ Ir a 6:30</button></p>

- **No hay una sola IA:** hay muchos modelos, de muchas empresas y proyectos, y salen versiones nuevas cada pocos meses.
- **Grandes y pequeños:** los grandes razonan mejor, se equivocan menos y resuelven tareas más largas, pero son más lentos y más caros. Los pequeños son rápidos y baratos, y se equivocan más. No hay uno mejor para todo: se elige según la tarea.
- **En esta ruta, OpenCode:** una herramienta de código abierto que hoy ofrece modelos gratuitos, sin cuenta ni tarjeta, suficientes para aprender y seguir los ejemplos. No nombramos ninguno porque la lista de gratuitos cambia casi cada semana; en el vídeo 03 aprendes a elegirlo.

### 6 · Lo que te llevas

<p><button type="button" class="ir-a" data-t="438">▶ Ir a 7:18</button></p>

- **Las tres ideas:** un modelo de lenguaje completa texto pieza a pieza, y esas piezas (tokens) miden sus límites y su precio; no responde siempre lo mismo, porque elige con algo de azar; y se equivoca con la misma seguridad con la que acierta, sobre todo cuando le falta información.
- **Práctica:** si tienes a mano cualquier chat de IA, hazle la misma pregunta de programación dos veces, en dos conversaciones nuevas, y compara las respuestas. Si no lo tienes, lo harás en el laboratorio.

**Siguiente:** [Vídeo 02 · Tu laboratorio: un sitio donde equivocarte](/rutas/ia-desde-cero/02-tu-laboratorio)

## Fuentes

- Presentación [Coding agents](https://codigosinsiesta.com/coding-agents-presentation/): la analogía del arquitecto que se inventa la normativa.
- Presentación [IA Generativa: conceptos fundamentales](https://codigosinsiesta.com/ai-presentation/): la ventana de contexto como un escritorio.

## Transcripción

<details>
<summary>Ver la transcripción de la locución</summary>

Texto de la locución tal como se dice en el vídeo (los símbolos se leen en voz alta: «punto md» es <code>.md</code>).

**1 · Un autocompletado muy bueno**

Si nunca has usado inteligencia artificial para programar, este es tu sitio. En esta ruta vamos a empezar desde cero, y lo primero no es instalar nada. Lo primero es entender qué hay al otro lado cuando le escribes a una IA. Porque casi todos los problemas que vas a tener al trabajar con ella vienen de imaginarla como algo que no es.

Piensa en el teclado de tu móvil. Cuando escribes «nos vemos», te sugiere «mañana», «luego» o «el lunes». No sabe nada de tu agenda. Ha visto muchísimos mensajes y sabe qué palabras suelen venir después de otras.

Un modelo de lenguaje hace lo mismo, a una escala enorme. Lo han entrenado con cantidades gigantescas de texto: libros, páginas web, documentación y mucho, mucho código. De todo eso ha aprendido qué suele venir después de qué. Y cuando le haces una pregunta, lo que hace es continuar tu texto.

Funciona así. Recibe lo que has escrito, calcula cuál es la siguiente pieza más adecuada, la añade al final y vuelve a empezar, ahora con esa pieza incluida. Pieza a pieza, va construyendo la respuesta. Por eso, cuando usas una de estas herramientas, ves el texto aparecer poco a poco, como si alguien lo estuviera tecleando.

Fíjate en lo que no hace. No busca la respuesta en una base de datos. No consulta internet, salvo que una herramienta lo haga por él, y eso lo veremos más adelante. Tampoco ejecuta tu código para comprobar si funciona. Escribe lo que, según todo lo que ha visto, tiene más sentido escribir a continuación.

Y aun así, escribe código sorprendentemente bueno. Ha visto tanto que, para la mayoría de problemas habituales, lo que «tiene más sentido escribir» coincide con una solución correcta. La clave está en esa palabra: la mayoría.

**2 · Las piezas se llaman tokens**

Antes hemos dicho «pieza». Esas piezas tienen nombre: tokens. Un token no es exactamente una palabra. Las palabras cortas y frecuentes suelen ser un solo token. Las largas o raras se parten en varios. Los signos de puntuación, los espacios y los símbolos del código también cuentan.

Por ejemplo, una palabra como «programación» puede partirse en dos o tres trozos, según el modelo. Y una línea de código, con sus paréntesis, puntos y comas, gasta bastantes más tokens de lo que parece a simple vista. Cada modelo parte el texto a su manera, así que la misma frase no mide lo mismo en todos.

¿Por qué te importa esto, si nunca vas a contar tokens a mano? Por dos motivos que veremos con calma en esta ruta. El primero: todo lo que el modelo puede tener delante a la vez se mide en tokens, y tiene un límite. A eso lo llamaremos la ventana de contexto, y tiene vídeo propio. El segundo: cuando un modelo es de pago, se paga por tokens, tanto los que le envías como los que te devuelve.

Así que, cuando leas «este modelo admite tantos miles de tokens» o «cuesta tanto por millón de tokens», ya sabes de qué hablan: de piezas de texto, no de palabras ni de peticiones.

**3 · Por qué no responde siempre lo mismo**

Vamos con la segunda idea. En cada paso, el modelo no tiene una única pieza posible. Tiene varias candidatas, cada una con su probabilidad. Después de «nos vemos», «mañana» puede ser muy probable, «luego» algo menos, y «el lunes», menos todavía.

Si eligiera siempre la más probable, respondería siempre igual, y sus respuestas sonarían repetitivas y rígidas. Por eso, normalmente, elige con un poco de azar: casi siempre una de las más probables, pero no siempre la misma. Ese grado de azar se puede ajustar, y a menudo verás que lo llaman temperatura.

La consecuencia práctica es importante. Si le haces la misma pregunta dos veces, puedes recibir dos respuestas distintas. A veces cambian solo las palabras. Otras, cambia la solución entera: una vez usa un bucle y otra una función de una librería. Y a veces una de las dos es correcta y la otra no.

Eso no es un fallo. Es su forma de funcionar. Pero cambia cómo debes trabajar con él. Una respuesta del modelo es un intento, no un veredicto. Si algo importa, se comprueba. Y en programación tenemos una forma muy buena de comprobar: ejecutar el código y sus pruebas.

**4 · Se equivoca con la misma seguridad con la que acierta**

Y llegamos a la tercera idea, la más importante de todas. El modelo no sabe cuándo no sabe.

Imagina un arquitecto que, cuando no conoce una normativa concreta, en lugar de decir «no lo sé», se inventa una que suena perfectamente razonable. El plano parece impecable, hasta que llega el inspector. Eso es, más o menos, lo que llamamos una alucinación: una respuesta que suena correcta, escrita con total seguridad, y que es falsa.

En código, las alucinaciones tienen formas muy reconocibles. Una función que no existe en la librería que estás usando, pero cuyo nombre encaja perfectamente con las demás. Una opción de un comando que nunca ha existido. Un parámetro con el nombre de otra versión. Todo con el mismo tono tranquilo con el que te explica algo verdadero.

¿Por qué pasa? Porque el modelo escribe lo que tiene sentido escribir a continuación, y una función inventada con buen nombre tiene muchísimo sentido. No hay ninguna parte del modelo que compruebe si esa función existe de verdad.

Hay otra causa, más sencilla. Un modelo aprende con textos hasta una fecha, y después no se entera de nada más. A eso se le llama su fecha de corte. Si una librería cambió después de esa fecha, el modelo seguirá escribiendo la versión antigua, sin avisarte.

Y fíjate en cuándo se equivoca más: cuando le falta información. Si no ha visto tu proyecto, se imagina cómo es. Si no conoce tu versión de la librería, supone una. Cuanto menos contexto real tiene, más rellena los huecos con lo que le parece probable.

De aquí salen las dos defensas que vamos a usar durante toda la ruta. La primera: darle información real, tus ficheros, tus versiones y tus reglas, para que no tenga que imaginarlas. La segunda: verificar lo que hace, sin fiarte del tono con el que lo dice. Y las dos son justo lo que añade un agente de programación, que veremos dentro de poco: puede leer tus ficheros y puede ejecutar tus pruebas.

**5 · Hay muchos modelos**

Una última cosa antes de ponernos manos a la obra. No hay una sola IA. Hay muchos modelos, de muchas empresas y proyectos distintos, y salen versiones nuevas cada pocos meses.

En general, los modelos grandes razonan mejor, cometen menos errores y resuelven tareas más largas, pero son más lentos y más caros. Los pequeños son rápidos y baratos, y se equivocan más. No hay uno mejor para todo: se elige según la tarea.

En esta ruta vamos a usar OpenCode, una herramienta de código abierto que hoy ofrece modelos gratuitos, sin cuenta ni tarjeta. Son más que suficientes para aprender y para seguir los ejemplos. Eso sí, no vamos a nombrar ninguno en concreto: la lista de modelos gratuitos cambia casi cada semana, y te enseñaremos a elegir uno cuando lo instales.

**6 · Lo que te llevas**

Repasemos. Un modelo de lenguaje completa texto, pieza a pieza. Esas piezas se llaman tokens, y con ellos se miden sus límites y su precio. No responde siempre lo mismo, porque elige con algo de azar. Y se equivoca con la misma seguridad con la que acierta, sobre todo cuando le falta información.

Con estas tres ideas ya puedes entender todo lo que viene. En el próximo vídeo prepararemos tu laboratorio: un entorno aislado de tu ordenador donde el agente pueda trabajar sin riesgo, con OpenCode instalado dentro. Y en el siguiente recorreremos OpenCode y le haremos la primera pregunta.

Te propongo una pequeña práctica antes de seguir. Si tienes a mano cualquier chat de IA, hazle la misma pregunta de programación dos veces, en dos conversaciones nuevas, y compara las respuestas. Y si no lo tienes, no pasa nada: lo haremos juntos en el laboratorio.

Nos vemos en el siguiente vídeo.

</details>

