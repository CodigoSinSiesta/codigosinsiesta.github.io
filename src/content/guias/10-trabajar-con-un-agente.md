---
title: "Vídeo 10 · Trabajar con un agente"
description: "La misma tarea mal pedida y bien pedida: objetivo y criterio de terminado, planificar antes de tocar, revisar lo que hace y verificar con pruebas."
ruta: "ia-desde-cero"
orden: 10
duracion: "10 min"
video: "10-trabajar-con-un-agente.mp4"
subtitulos: "/subtitulos/ia-desde-cero/10-trabajar-con-un-agente.es.vtt"
---

La misma tarea mal pedida y bien pedida: objetivo y criterio de terminado, planificar antes de tocar, revisar lo que hace y verificar con pruebas.

<p class="guia__nota">Dura 10 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

## Resumen por capítulos

### 1 · Pedirlo mal

<p><button type="button" class="ir-a" data-t="16">▶ Ir a 0:16</button></p>

- **La misma tarea, dos veces**
  - `una` · Mal pedida: «añade descuentos»
  - `otra` · Bien pedida: objetivo, contexto, terminado y reglas
  - *Tres o más unidades de un producto → un 10 % menos*
- *En la demo:* OpenCode en el laboratorio: dos palabras al agente build
- **Todo pasa, y no es lo que querías**
  - `entendió` · Un % por producto: y sus pruebas comprueban eso
  - `querías` · Descuento por cantidad: tres o más unidades, un 10 % menos
- **Vídeo 01:** Donde faltan datos, rellena con lo más probable — Y dos palabras lo dejan casi todo por rellenar.

### 2 · Pedirlo bien

<p><button type="button" class="ir-a" data-t="127">▶ Ir a 2:07</button></p>

- **Como a un buen fontanero**
  - `qué` · Qué grifo gotea: no «arregla el baño»
  - `cuándo` · Cuándo está bien: cómo darás el trabajo por bueno
  - `límites` · Qué no tocar: lo que no se negocia
- **Tres piezas de la petición**
  - `objetivo` · 3 o más unidades → −10 %: con sus números
  - `contexto` · src/compra.js: dónde está lo que hay que cambiar
  - `terminado` · Pruebas de 2, 3 y redondeo: y npm test pasa
- **La cuarta pieza: las reglas**
  - `regla` · Céntimos enteros: y se redondea al céntimo
  - `regla` · No tocar lo demás: ni las pruebas que ya existen ni otros ficheros
  - `regla` · Sin dependencias nuevas: nada que instalar
- *En la demo:* La petición entera, escrita en OpenCode
- **Un minuto:** Antes de tocar nada, dame un plan — Te ahorra una sesión entera deshaciendo una tarea que no era la tuya.

### 3 · Primero el plan

<p><button type="button" class="ir-a" data-t="213">▶ Ir a 3:33</button></p>

- *En la demo:* La petición, en el agente plan
- **El plan, en tres partes:** Cambiar total() (en src/compra.js) → Tres pruebas (200 · 270 · 257) → npm test (las 5 pasan)
- **Supuestos a confirmar**
  - `supuesto 2` · El medio céntimo sube: 256,5 → 257 · nos vale
  - `supuesto 1` · Cada línea por separado: pan 2 + pan 2: sin descuento

### 4 · Mirar lo que hace

<p><button type="button" class="ir-a" data-t="294">▶ Ir a 4:54</button></p>

- **Los ficheros que tocó cada sesión**
  - `mal pedida` · 3 ficheros: compra.js · compra.test.js · README.md
  - `bien pedida` · 2 ficheros: compra.js · compra.test.js

### 5 · Verificar de verdad

<p><button type="button" class="ir-a" data-t="371">▶ Ir a 6:11</button></p>

- *En la demo:* npm test en OpenCode, sobre el cambio de la sesión bien pedida
- **El dinero, en enteros**
  - `euros` · 1,20 en binario: no cabe exacto
  - `céntimos` · 120 céntimos: un entero, exacto

### 6 · Todo esto tiene nombre

<p><button type="button" class="ir-a" data-t="484">▶ Ir a 8:04</button></p>

- **Casi nada de esto lo hace el modelo**
  - `modelo` · Escribe texto: y nada más
  - `harness` · El programa que lo rodea: herramientas, permisos, plan y build, pruebas, escape

## Fuentes

- [documentación de OpenCode](https://opencode.ai/v2/docs/): los agentes *build* y *plan*, Esc y `/undo`.
- Presentaciones [Vibe coding vs software engineering](https://codigosinsiesta.com/ai-presentation/) (la fórmula: contexto, instrucción, reglas y ejemplos) y [Taller de OpenCode](https://codigosinsiesta.com/taller-opencode-presentation/) (el harness).
- El [laboratorio de la ruta](https://github.com/CodigoSinSiesta/empieza-aqui-laboratorio): la lista de la compra y sus pruebas.
- Las dos peticiones, la mal pedida y la bien pedida, se hicieron de verdad en el laboratorio.
- Siguiente paso: el curso [Pi y oh my pi](/rutas/pi-oh-my-pi).

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

