---
title: "Vídeo 10 · Trabajar con un agente"
description: "La misma tarea mal pedida y bien pedida: objetivo y criterio de terminado, planificar antes de tocar, revisar lo que hace y verificar con pruebas."
ruta: "ia-desde-cero"
orden: 10
duracion: "10 min"
video: "10-trabajar-con-un-agente.mp4"
subtitulos: "/subtitulos/ia-desde-cero/10-trabajar-con-un-agente.es.vtt"
---

El cierre de la ruta junta todas las piezas en una tarea completa, hecha dos veces: una mal pedida y otra bien pedida. De la comparación sale un método que sirve para cualquier agente: pedir con objetivo, contexto, criterio de terminado y reglas; planificar antes de tocar; mirar lo que hace, y verificar ejecutando las pruebas, no preguntando si pasan.

<p class="guia__nota">Dura 10 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

## Resumen por capítulos

### 1 · Pedirlo mal

<p><button type="button" class="ir-a" data-t="16">▶ Ir a 0:16</button></p>

- **La tarea:** descuentos por cantidad en la lista de la compra del laboratorio. Si compras tres o más unidades de un producto, esas unidades salen un 10 % más baratas.
- *En la demo:* al agente *build* le escribimos solo dos palabras, «añade descuentos». Leyó el README, la configuración, el código y las pruebas; intentó preguntar qué tipo de descuento queríamos y, como en la prueba no podía, supuso lo más natural para él: un porcentaje de descuento en cada producto. En la pantalla de OpenCode es posible que esa pregunta sí te llegue.
- **Todo pasa, y no es lo que querías:** cambió el código, escribió tres pruebas, retocó el README (que nadie le había pedido) y `npm test` pasó las cinco pruebas. Pero no hay ni rastro de descuentos por cantidad.
- **Las pruebas no avisan porque las escribió el mismo agente:** comprueban lo que él entendió, no lo que tú tenías en la cabeza.
- **El agente no se equivocó; hizo bien una tarea que no era la tuya.** Como viste en el vídeo 01, donde faltan datos el modelo rellena con lo más probable, y dos palabras lo dejan casi todo por rellenar.

### 2 · Pedirlo bien

<p><button type="button" class="ir-a" data-t="127">▶ Ir a 2:07</button></p>

- **Como a un buen fontanero:** no le dices «arregla el baño», sino qué grifo gotea, cuándo darás el trabajo por bueno y qué no debe tocar.
- **Las cuatro piezas de una buena petición:**

| Pieza | Qué dice | En la demo |
|---|---|---|
| Objetivo | Qué quieres, con sus números | 3 o más unidades de un producto → un 10 % de descuento |
| Contexto | Dónde está lo que hay que cambiar | `src/compra.js` |
| Terminado | Cómo sabrás que está hecho | `total()` aplica el descuento; pruebas nuevas para 2 unidades, para 3 y para un caso que obligue a redondear; `npm test` pasa |
| Reglas | Lo que no se negocia | Precios en céntimos enteros y redondeo al céntimo; no cambiar las pruebas existentes ni otros ficheros; sin dependencias nuevas |

- **El criterio de terminado es la pieza que casi siempre se olvida,** y aquí la más importante: te deja comprobar, sin creerte a nadie, si el trabajo está hecho. Es la fórmula de la guía 07.
- **Y una frase más al final: «antes de tocar nada, dame un plan».** Cuesta un minuto y te ahorra una sesión entera deshaciendo una tarea que no era la tuya. La petición completa está en «Código y comandos».

### 3 · Primero el plan

<p><button type="button" class="ir-a" data-t="213">▶ Ir a 3:33</button></p>

- **El agente *plan* solo piensa y propone:** no edita los ficheros del proyecto, así que lees su propuesta sabiendo que no ha cambiado nada. Se elige con Mayús+Tab.
- *En la demo:* devolvió un plan en tres partes: cambiar la función `total()`, tres pruebas con sus números y ejecutar `npm test`. Por ejemplo, tres unidades a 95 céntimos son 285; con el descuento quedan 256,5, que se redondean a 257.
- **Lo más valioso, al final: dos supuestos para confirmar.**
  1. Si añades pan dos veces, con dos unidades cada vez, cada línea se trata por separado: cuatro panes y ninguno con descuento. **No nos valía:** le pedimos agrupar por nombre y añadir una prueba para ese caso.
  2. El medio céntimo sube al redondear. **Nos valía.**
- **Revisar un plan no es decir que sí:** es buscar la decisión que el agente ha tomado por ti. Si el primer supuesto hubiera llegado al código sin que nadie lo leyera, lo habría descubierto un cliente en la caja.
- Con el plan corregido, se pasa a *build* con Mayús+Tab y se le pide que lo ejecute.

### 4 · Mirar lo que hace

<p><button type="button" class="ir-a" data-t="294">▶ Ir a 4:54</button></p>

- **Mientras *build* trabaja, mira cada paso:** qué fichero lee, qué cambia y qué comando quiere ejecutar. En el laboratorio, las ediciones y la shell piden permiso: cada petición es un momento para mirar antes de que pase.
- **Un fichero de más es la primera señal de que va por su cuenta:** la sesión mal pedida tocó tres (`compra.js`, `compra.test.js` y `README.md`); la bien pedida, dos (`compra.js` y `compra.test.js`), justo los del plan.
- **Si se va por donde no es, no esperes a que acabe:** Esc lo para y te devuelve el control; le explicas qué no te gusta y sigue desde ahí. Si ya ha cambiado ficheros, `/undo` los devuelve a como estaban, aunque no deshace los comandos que haya ejecutado.
- **Al final, lee el cambio.** Aquí fueron unas cuarenta líneas: una función que agrupa los productos por nombre, suma las unidades, aplica el descuento a partir de tres y redondea al céntimo, y cuatro pruebas nuevas. Si un cambio es tan grande que no lo puedes leer, la tarea era demasiado grande: pártela en trozos.

### 5 · Verificar de verdad

<p><button type="button" class="ir-a" data-t="371">▶ Ir a 6:11</button></p>

- *En la demo:* *build* ejecutó `npm test` y pasaron seis pruebas: las dos de siempre y las cuatro nuevas. Ese era el criterio de terminado, y no depende de lo que diga el agente: lo comprueban las pruebas. (El plan hablaba de tres pruebas nuevas; la cuarta es la de agrupar por nombre que pedimos al corregirlo.)
- **Decir que pasan no es haberlas ejecutado.** Con la shell sin permiso le preguntamos «¿pasan las pruebas?». No pudo ejecutarlas y lo dijo, pero en lugar de pararse hizo las cuentas a mano y concluyó que «deberían» pasar. Si no le dejas ejecutar, el agente no se para: deduce el resultado. Si en su respuesta no ves la salida de `npm test`, no se ha verificado nada: pídeselo, o ejecútalo tú.
- **Primera trampa del dinero, la coma flotante:** con precios en euros, dos panes a 1,20 y una leche a 0,95 deberían dar 3,35, y `npm test` falla porque da 3,34 seguido de una ristra de nueves. No es un fallo del agente ni de JavaScript: los ordenadores guardan los decimales en binario, y 1,20 no cabe exacto (igual que un tercio no se escribe exacto con decimales). Con dinero, se cuenta en céntimos enteros: 120 es un entero exacto.
- **Segunda trampa, la unidad supuesta:** con el código nuevo, tres panes a 1,20 euros con descuento dan 3 en lugar de 3,24, porque el código redondea a la unidad dando por hecho que la unidad es el céntimo. Por eso «precios en céntimos enteros» iba en las reglas, y por eso merece estar en tu `AGENTS.md`: es justo lo que el agente no puede adivinar.

### 6 · Todo esto tiene nombre

<p><button type="button" class="ir-a" data-t="484">▶ Ir a 8:04</button></p>

- **El método, en cinco pasos:**
  1. Pide con objetivo, contexto, criterio de terminado y reglas.
  2. Planifica en *plan* y busca los supuestos.
  3. Pasa a *build* y mira lo que hace, con Esc a mano.
  4. Verifica ejecutando, no preguntando; si algo falla, otra vuelta a corregir.
  5. Lee el cambio antes de darlo por bueno.
- **Casi nada de esto lo hace el modelo:** el modelo escribe texto, y nada más. Lo que le da las herramientas, pide los permisos, separa *plan* de *build*, ejecuta las pruebas y te deja pararlo con Esc es el programa que lo rodea: el *harness*. OpenCode es un harness, y trabajar bien con un agente es, en buena parte, saber usar el tuyo.
- **Práctica:** en la rama `guia-10` del laboratorio, pide «añade descuentos», a secas, y mira qué hace y qué ficheros toca. Después devuelve la rama a como estaba con `git reset --hard`, escribe la petición entera, mándala a *plan*, busca al menos un supuesto que no te valga y corrígelo antes de pasar a *build*. La tarea está terminada cuando ves con tus ojos la salida de `npm test`, no cuando el agente te dice que pasa.

**Siguiente:** aquí acaba la ruta, y hay dos caminos. Para entender un agente por dentro, el curso [Pi y oh my pi](/rutas/pi-oh-my-pi), que empieza explicando qué es un harness y acaba con el tuyo propio. Para seguir con OpenCode en un proyecto más grande, guiado por especificaciones, los [talleres](/talleres), con el taller de OpenCode.

## Código y comandos

### La petición bien pedida

La que se usó en la demo, para la práctica. Mándala al agente *plan* (Mayús+Tab):

```text
Quiero descuentos por cantidad en la lista de la compra (src/compra.js). Objetivo: si un producto se compra 3 o más veces, esas unidades llevan un 10 % de descuento. Terminado cuando: total() aplica el descuento, hay pruebas nuevas para 2 unidades (sin descuento), 3 unidades (con descuento) y un caso que obligue a redondear, y npm test pasa. Reglas: los precios siguen en céntimos enteros y se redondea al céntimo; no cambies las pruebas que ya existen ni otros ficheros; sin dependencias nuevas. Antes de tocar nada, dame un plan.
```

### Volver a empezar la práctica

```bash
git status          # qué ficheros ha tocado el agente
git reset --hard    # deja la rama como estaba (borra los cambios sin guardar)
npm test            # comprueba tú mismo que las pruebas pasan
```

## Fuentes

- [documentación de OpenCode](https://opencode.ai/v2/docs/): los agentes *build* y *plan*, Esc y `/undo`.
- Presentaciones [IA Generativa: conceptos fundamentales](https://codigosinsiesta.com/ai-presentation/) (la fórmula: contexto, instrucción, reglas y ejemplos) y [Taller de OpenCode](https://codigosinsiesta.com/taller-opencode-presentation/) (el harness).
- El [laboratorio de la ruta](https://github.com/CodigoSinSiesta/empieza-aqui-laboratorio): la lista de la compra y sus pruebas.
- Las dos peticiones, la mal pedida y la bien pedida, se hicieron de verdad en el laboratorio.

## Transcripción

<details>
<summary>Ver la transcripción de la locución</summary>

Texto de la locución tal como se dice en el vídeo (los símbolos se leen en voz alta: «punto md» es <code>.md</code>).

**1 · Pedirlo mal**

A lo largo de esta ruta hemos desmontado un agente pieza a pieza: el modelo que completa texto, el laboratorio, la ventana de contexto, el bucle, las herramientas, las instrucciones, lo que cuesta y lo que puede romper. En este último vídeo lo juntamos todo para trabajar de verdad.

Vamos a hacer la misma tarea dos veces, una mal pedida y otra bien pedida, y a comparar lo que sale. La tarea es pequeña: descuentos por cantidad en la lista de la compra del laboratorio. Si compras tres o más unidades de un producto, esas unidades salen un diez por ciento más baratas. Empezamos como empieza casi todo el mundo, escribiendo dos palabras al agente build: «añade descuentos».

Esto es lo que pasó de verdad en el laboratorio. El agente leyó el README, la configuración, el código y las pruebas. Luego intentó preguntarnos qué tipo de descuento queríamos. En nuestra prueba no podía preguntar, así que supuso lo que le pareció más natural: un porcentaje de descuento en cada producto. Si trabajas en la pantalla de OpenCode, es posible que esa pregunta sí te llegue.

Después cambió el código, escribió tres pruebas nuevas, retocó el README, que nadie le había pedido, y ejecutó ene pe eme test. Pasaron las cinco pruebas. Terminó con un resumen impecable y una oferta: si preferías otro tipo de descuento, se lo dices y lo ajusta.

Fíjate en lo que tenemos. Todo funciona, todo está probado y nada es lo que queríamos: no hay ni rastro de descuentos por cantidad. Y las pruebas no avisan, porque las ha escrito el mismo agente. Comprueban lo que él entendió, no lo que tú tenías en la cabeza.

El agente no se equivocó. Hizo bien una tarea que no era la tuya. Recuerda el primer vídeo: donde faltan datos, el modelo rellena con lo más probable. Y dos palabras lo dejan casi todo por rellenar.

**2 · Pedirlo bien**

La segunda vez escribimos la petición con cuatro piezas. Piensa en cómo le encargas un trabajo a un buen fontanero. No le dices «arregla el baño». Le dices qué grifo gotea, cuándo darás el trabajo por bueno y qué no debe tocar.

La primera pieza es el objetivo, con sus números: tres o más unidades de un producto, un diez por ciento de descuento. La segunda es el contexto: dónde está lo que hay que cambiar, el fichero compra punto js. La tercera es la que casi siempre se olvida: el criterio de terminado. Para nosotros, terminado es que el total aplique el descuento, que haya pruebas nuevas para dos unidades, para tres y para un caso que obligue a redondear, y que ene pe eme test pase.

La cuarta pieza son las reglas, lo que no se negocia. Los precios siguen en céntimos enteros y se redondea al céntimo. No se cambian las pruebas que ya existen ni ningún otro fichero. Y nada de dependencias nuevas.

Objetivo, contexto, terminado y reglas: es la fórmula de la guía siete, con una pieza que ahí casi no pesaba y aquí es la más importante. El criterio de terminado es lo que te deja comprobar, sin creerte a nadie, si el trabajo está hecho.

Y al final, una frase más: «antes de tocar nada, dame un plan». Parece más trabajo, pero es un minuto. Lo que te ahorra es una sesión entera deshaciendo una tarea que no era la tuya.

**3 · Primero el plan**

Esa petición la mandamos al agente plan, el que solo piensa y propone. Lo eliges con mayúsculas tabulador. Plan no edita los ficheros del proyecto, así que puedes leer su propuesta sabiendo que todavía no ha cambiado nada.

Leyó el código y las pruebas, y devolvió un plan en tres partes: cómo cambiar la función del total, las tres pruebas con sus números, y ejecutar ene pe eme test. Por ejemplo, tres unidades a noventa y cinco céntimos son doscientos ochenta y cinco; con el descuento quedan doscientos cincuenta y seis y medio, que se redondean a doscientos cincuenta y siete.

Y lo más valioso estaba al final: dos supuestos, para que se los confirmáramos. El segundo era el redondeo: el medio céntimo sube. Ese nos valía. El primero, no. Decía que, si añades pan dos veces, con dos unidades cada vez, cada línea se trata por separado. Es decir: cuatro panes, y ninguno con descuento.

Eso es revisar un plan. No es leerlo y decir que sí: es buscar la decisión que el agente ha tomado por ti. Le contestamos que agrupara por nombre y que añadiera una prueba para ese caso. Si ese supuesto hubiera llegado al código sin que nadie lo leyera, lo habría descubierto un cliente en la caja. Con el plan corregido, pasamos a build con mayúsculas tabulador y le pedimos que lo ejecutara.

**4 · Mirar lo que hace**

Mientras build trabaja, no te vayas a por un café. Mira cada paso: qué fichero lee, qué cambia y qué comando quiere ejecutar. En el laboratorio, las ediciones y la shell piden permiso, y cada petición es un momento para mirar antes de que pase.

Compara las dos sesiones por los ficheros que tocaron. La mal pedida cambió tres: el código, las pruebas y el README. La bien pedida cambió dos, el código y las pruebas, justo los que decía el plan. Un fichero de más que nadie ha pedido es la primera señal de que el agente va por su cuenta.

Si ves que se va por donde no es, no esperes a que acabe. Pulsa escape: el agente se para y te devuelve el control. Le explicas qué no te gusta y sigue desde ahí. Si ya ha cambiado ficheros, barra undo los devuelve a como estaban, aunque no deshace los comandos que haya ejecutado.

Y al final, lee el cambio. Aquí fueron unas cuarenta líneas: una función que agrupa los productos por nombre, suma las unidades, aplica el descuento a partir de tres y redondea al céntimo, y cuatro pruebas nuevas. Se lee en un par de minutos. Si un cambio es tan grande que no lo puedes leer, la tarea era demasiado grande: pártela en trozos.

**5 · Verificar de verdad**

Build ejecutó ene pe eme test y pasaron seis pruebas: las dos de siempre y las cuatro nuevas. Ese era nuestro criterio de terminado, y es una comprobación que no depende de lo que diga el agente: la hacen las pruebas.

Ahora, un experimento. Con la shell sin permiso, le preguntamos: «¿pasan las pruebas?». No pudo ejecutarlas, y lo dijo. Pero en lugar de pararse, leyó el código, repasó las seis pruebas haciendo las cuentas a mano y concluyó que todas deberían pasar. Es lo mismo que nos pasó al preparar el laboratorio: si no le dejas ejecutar, el agente no se para; deduce el resultado.

Esta vez fue honesto y dijo «deberían». Pero quédate con la diferencia, porque no siempre será tan claro: que un agente diga que las pruebas pasan no es lo mismo que haberlas ejecutado. Si en su respuesta no ves la salida de ene pe eme test, no se ha verificado nada. Pídeselo, o ejecútalo tú.

Las pruebas también enseñan por qué la lista guarda los precios en céntimos. Añadimos una prueba con euros: dos panes a uno con veinte y una leche a cero noventa y cinco. Tienen que salir tres con treinta y cinco. Ene pe eme test falla: el total da tres con treinta y cuatro y una ristra de nueves.

No es un fallo del agente ni de JavaScript. Los ordenadores guardan los decimales en binario, y uno con veinte no cabe exacto, igual que un tercio no se puede escribir exacto con decimales. Es lo que se llama coma flotante. Con dinero, la salida es contar en céntimos enteros.

Y hay una segunda trampa, distinta. Con el código nuevo, tres panes a uno con veinte en euros dan tres justos en lugar de tres con veinticuatro, porque el código redondea a la unidad dando por hecho que la unidad es el céntimo. Por eso «precios en céntimos enteros» iba en las reglas de la petición, y por eso merece estar en tu AGENTS punto md: es justo lo que el agente no puede adivinar.

**6 · Todo esto tiene nombre**

Repasemos el método. Pide con objetivo, contexto, criterio de terminado y reglas. Planifica en plan y busca los supuestos. Pasa a build y mira lo que hace, con escape a mano. Verifica ejecutando, no preguntando, y si algo falla, vuelta a corregir. Y antes de darlo por bueno, lee el cambio, porque decir que pasa no es ejecutarlo.

Ahora fíjate en una cosa: casi nada de esto lo ha hecho el modelo. El modelo escribe texto. Lo que le da las herramientas, pide los permisos, separa plan de build, ejecuta las pruebas y te deja pararlo con escape es el programa que lo rodea. Eso tiene nombre: harness. OpenCode es un harness, y trabajar bien con un agente es, en buena parte, saber usar el tuyo.

Aquí termina esta ruta, y tienes dos caminos. Si quieres entender un agente por dentro, el curso de Pi empieza justo donde lo dejamos, explicando qué es un harness, y acaba con el tuyo propio. Si prefieres seguir con OpenCode en un proyecto más grande, guiado por especificaciones, tienes el taller de OpenCode.

Te propongo la última práctica, en el laboratorio. Cambia a la rama guía diez y pide «añade descuentos», a secas. Mira qué hace y qué ficheros toca. Después, devuelve la rama a como estaba con git reset guion guion hard y escribe la petición entera, con objetivo, contexto, terminado y reglas. Mándala a plan, busca al menos un supuesto que no te valga y corrígelo antes de pasar a build. La tarea está terminada cuando ves con tus propios ojos la salida de ene pe eme test, no cuando el agente te dice que pasa.

Gracias por llegar hasta aquí. El siguiente paso es el vídeo uno del curso de Pi: qué es un harness de agente. Nos vemos allí.

</details>

