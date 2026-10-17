---
title: "Vídeo 26 · Proyecto final"
description: "Una funcionalidad completa en un repo real, de principio a fin: plan, subagentes, revisión, pruebas, commit y PR, con Pi y con omp."
ruta: "pi-oh-my-pi"
orden: 26
duracion: "25 min"
video: "26-proyecto-final.mp4"
subtitulos: "/subtitulos/pi-oh-my-pi/26-proyecto-final.es.vtt"
---

Una funcionalidad completa en un repo real, de principio a fin: plan, subagentes, revisión, pruebas, commit y PR, con Pi y con omp.

<p class="guia__nota">Dura 25 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

## Resumen por capítulos

### 1 · Todo junto

<p><button type="button" class="ir-a" data-t="17">▶ Ir a 0:17</button></p>

- El último vídeo no trae ninguna herramienta nueva: junta todo el curso en una funcionalidad de principio a fin, sobre la tienda de juguete. Primero la rúbrica, antes de empezar; después el plan, antes de tocar nada; el reparto, solo si compensa; luego la implementación, la revisión, las pruebas, el commit y la petición de cambios.
- **Lo que ya está montado:** del vídeo 23, el andamiaje (`AGENTS.md` con sus rutinas de entrada y salida, la lista de funcionalidades, el progreso, `init.sh` y el traspaso); del 24, la rúbrica, la prueba de aceptación, `verificar.sh` y la puerta (una extensión que cargan los dos harnesses); del 25, el coste medido de repartir y la prueba oculta fuera del repositorio.
- **El reparto de papeles:** oh my pi planifica con el modo plan (vídeo 15); Pi implementa en una sesión nueva, con la puerta y sin más contexto que el repositorio; oh my pi revisa con `/review`, como una petición de cambios; y Pi hace de integración continua con el `revisar.sh` del vídeo 10. Entre uno y otro, solo ficheros.
- **Por qué mezclarlos:** si el estado vive en el repositorio, da igual qué harness abra la siguiente sesión (vídeo 23). Y quien revisa no es quien hizo el trabajo (vídeo 24): hoy ni siquiera ha visto esa sesión, ni usa el mismo modelo ni el mismo harness.
- **Mientras lo ves, fíjate en quién decide cada paso:**
  - qué es «terminado» lo decides tú, antes de empezar;
  - el camino lo propone un modelo y lo apruebas tú;
  - si una funcionalidad pasa, lo decide un script;
  - si el cambio tiene sentido, lo opina un revisor;
  - y qué entra en la rama base, otra vez tú.

  Ningún paso depende de que el agente diga que ha terminado.
- **El punto de partida:** el commit del bucle del vídeo 25, con la cuarta funcionalidad (el desglose del pedido) en `pasa`. Sobre él se abre la rama base `final` y, desde ella, la rama de trabajo `ticket-005`. La petición de cambios irá de una a otra, como en un repositorio de equipo.

### 2 · El ticket, antes que el código

<p><button type="button" class="ir-a" data-t="167">▶ Ir a 2:47</button></p>

- **La funcionalidad, `ticket-005`:** un cupón de importe fijo. La tienda solo entiende cupones de porcentaje (`{ porcentaje: 10 }`); ahora tiene que aceptar también `{ importe: 5 }`, que descuenta cinco euros. Respeta la regla que salió del vídeo 15: la forma de objeto del cupón no se toca, se le añade un segundo tipo.
- **Por qué esta:** es pequeña (cambia `totalConCupon` y sus pruebas), pero esa función la usan el envío, el desglose y el ticket, así que un error se propaga por toda la tienda. Y tiene una trampa natural: la función recorre las líneas una a una, y lo fácil es restar los cinco euros en cada línea en lugar de una sola vez.
- **Cuatro frases comprobables en `funcionalidades.json`:**
  1. El importe se resta una sola vez al subtotal, antes del IVA y del envío.
  2. El total con cupón nunca baja de cero.
  3. Un importe que no sea un número finito mayor que cero es un error de tipo.
  4. El cupón de porcentaje sigue como antes.
- **La rúbrica**, con la plantilla de WalkingLab del vídeo 24. Dentro del contrato: el carrito y sus pruebas. Fuera: el envío, el ticket y el desglose, que tienen que seguir funcionando sin tocarlos. Lleva los cinco criterios automáticos (A1–A5) y tres de juicio para el revisor: J1, alcance; J2, pruebas con sentido; J3, reutilizar lo que ya existe.
- **La aceptación cruza piezas:** el pedido de la frontera (una mochila y tres libretas, 42 €) con el cupón de 5 € deja la base en 37 €, el envío en 4,95 € y el total en 49,72 €. Una silla de 45 € queda en 40 € justos, en el umbral, y el envío sale gratis. También comprueba la última línea del ticket.
- **La prueba oculta**, fuera de la tienda y junto a la del vídeo 25: otros pedidos y un cupón mayor que el pedido. La descripción lo cubre y la rúbrica pide que lo cubran las pruebas, pero la aceptación no lo comprueba. Si el agente no lo cubre, lo sabrás tú, y no él.
- **En rojo antes del trabajo:** todo se commitea en `final` con la etiqueta `rubrica-ticket-005`, y `./verificar.sh ticket-005` sale con 1. Fallan cuatro de las cinco pruebas de aceptación; la quinta pasa porque comprueba que el cupón de porcentaje no cambie. Una aceptación que falla antes del trabajo comprueba algo.
- **La verificación, probada sin agente:** una implementación de referencia lo pasa todo; una que resta en cada línea cae en la aceptación; y una que deja la base en negativo pasa `verificar.sh` y solo cae en la prueba oculta. Como A5 compara con la última etiqueta de rúbrica (desde el vídeo 25), `verificar.sh` no se toca: basta con etiquetar.

### 3 · El plan, y por qué no repartimos

<p><button type="button" class="ir-a" data-t="365">▶ Ir a 6:05</button></p>

- **¿Un plan para cambiar una función?** Compensa cuando equivocarse de camino cuesta más que esperar (vídeo 25). El cambio es pequeño, pero la función está en el centro de la tienda: leer un plan cuesta un minuto; un diff equivocado, bastante más.
- **El encargo:** oh my pi con `/plan` (el rol `plan`, DeepSeek Pro). «Prepara el plan de la siguiente funcionalidad de `funcionalidades.json` siguiendo `AGENTS.md`, sin escribir el código: qué cambia, dónde y cómo se prueba.» No le contamos de qué trata: tiene que sacarlo del repositorio. En modo plan puede leer y consultar, pero el plan lo escribe fuera del árbol de trabajo.
- **La sorpresa:** pese a pedirle que no escribiera código, el plan trae la función completa, lista para pegar (y bien razonada). Pero un plan con el código dentro ya no es un plan: es la implementación esperando a que alguien la copie, y quien la copia no decide nada.
- **Refine plan:** «Quita el código del plan. Deja qué cambia y dónde, y los casos de prueba con sus importes calculados a mano. El código lo escribe quien implementa.» En unos veinte segundos lo reescribe sin bloques de código, aunque sigue describiendo la condición, el tope en cero y el redondeo casi frase por frase.
- **La lección:** pedir «sin código» en el encargo no bastó; lo que funcionó fue leer el plan antes de aprobarlo. Un plan no se aprueba porque llegue: se lee contra el contrato. ¿Toca solo el carrito y sus pruebas? ¿Resta el importe una sola vez? ¿Cubre el cupón mayor que el pedido? Aquí, las tres respuestas son sí.
- **La línea que se aprobó sin mirar:** entre sus decisiones, el plan dice que un cupón con la clave `importe` pero sin valor sigue por el camino del porcentaje y queda fuera de alcance. Volverá a salir en el capítulo 6.
- **Save and quit**, con una ruta fuera de la tienda. oh my pi guarda el plan y abre una sesión vacía, y `git status` sigue limpio: el plan es para la siguiente sesión, no para la historia del repositorio. Coste: casi dos céntimos de dólar, refinado incluido.
- **Por qué no «Approve and execute»:** el plan tiene que cruzar de un harness a otro, y eso solo se puede hacer con un fichero. Es el traspaso del vídeo 23: lo que la siguiente sesión necesita, en disco y no en una conversación que la otra herramienta no puede leer.
- **¿Repartimos?** Con los cinco criterios del vídeo 25, `ticket-005` cumple uno (la verificación automática): las pruebas dependen de la misma función, no hay ramas, no hay estado intermedio que guardar y, con `ticket-004`, repartir costó dos veces y media más y tardó más del doble para el mismo resultado. Implementa un solo agente. Habrá un subagente, pero uno y al final: el revisor, el único sitio donde un contexto nuevo aporta algo.

### 4 · La implementación, en Pi

<p><button type="button" class="ir-a" data-t="618">▶ Ir a 10:18</button></p>

- **Pi, en una sesión nueva**, con DeepSeek Flash, la puerta del vídeo 24 y `--no-skills`, para que no cargue nada ajeno al proyecto. No ha visto la conversación de oh my pi ni el plan con código: solo lo que hay en disco. El encargo es una frase: «Trabaja en la siguiente funcionalidad siguiendo `AGENTS.md`; el plan está en este fichero.»
- **La rutina de entrada (vídeo 23):** la carpeta, el plan, el progreso, la lista, el traspaso, el log e `init.sh`. Después lee el carrito, sus pruebas, la rúbrica, la aceptación y `verificar.sh`.
- **El cambio:** marca la funcionalidad en curso y añade a `totalConCupon` una salida al principio: si el cupón trae `importe`, lo valida, lo resta una sola vez al subtotal y no deja bajar de cero. El bucle del porcentaje queda como estaba.
- **Cinco pruebas**, con los importes escritos a mano en comentarios: 42 € que se quedan en 37 €, el envío después del cupón, un pedido justo en el umbral de 40 €, un cupón mayor que el pedido (total 0) y una lista de importes no válidos, del cero a un texto, que tienen que lanzar un error de tipo.
- **Lo que no hace:** no toca el desglose, ni el ticket, ni el envío (los usa sin cambiarlos), ni la aceptación. Si lo intentara, la puerta lo bloquearía como ruta protegida (vídeo 24).
- **La verificación:** Pi ejecuta `./verificar.sh ticket-005` por su cuenta y sale con 0: 5 de 5 en la aceptación y 41 pruebas en verde. Al marcar `pasa`, la puerta vuelve a verificar antes de aceptarlo; si saliera en rojo, desharía el marcado y le devolvería el motivo. En verde a la primera, la puerta no se ve.
- **La rutina de salida:** la salida de `verificar.sh` como evidencia, una entrada en el progreso, el traspaso vacío (no queda nada a medias) y un solo commit, en español y con el prefijo `tienda:` («añade el cupón de importe fijo al carrito»), que también pasa por la puerta. `./init.sh`: ninguna funcionalidad pendiente.
- **Comprobado desde fuera**, porque el resumen del agente es una opinión: unos 40 segundos y 1,4 céntimos de dólar. `verificar.sh` sale con 0 y `git diff --stat final` muestra cuatro ficheros (el carrito, sus pruebas, la lista y el progreso; +74 −5). Es un solo commit y no toca nada fuera del contrato.

> **Aviso de seguridad:** Pi no pide permiso para nada: no tiene aprobaciones por herramienta ni sandbox de serie (vídeo 05), y la puerta no cambia eso. Solo decide quién da por buena una funcionalidad y quién puede hacer commit; no impide borrar un fichero con `bash` ni leer lo que no debe. Para lo demás, usa el contenedor del vídeo 05.

### 5 · La revisión, con otro harness

<p><button type="button" class="ir-a" data-t="823">▶ Ir a 13:43</button></p>

- **Qué mira la revisión:** la verificación dice que se cumple lo que supiste escribir. La revisión mira lo demás: si las pruebas tienen sentido, si se reutiliza lo que había y si el cambio es el mínimo. Son los criterios J1–J3, y no los puntúa un script.
- **`/review` con instrucciones:** en una sesión nueva de oh my pi, lo que escribes detrás del comando se añade al encargo. Aquí, que lance el agente `reviewer` con la herramienta `task`, que puntúe J1–J3 de 0 a 2 con evidencia de fichero y línea, y que dé el veredicto de la rúbrica. En el menú: «Review against a base branch» (al estilo de una petición de cambios), con `final` como base.
- **Cómo funciona:** oh my pi calcula el diff desde el punto en que la rama de trabajo se separó de `final`, lo congela dentro del encargo y le pide al modelo de la conversación (Flash) que lance el revisor. El `reviewer` trabaja con el rol `slow`, aquí DeepSeek Pro: otro modelo, otro harness y un contexto que no ha visto la sesión de Pi.
- **Pide el agente por su nombre:** en la primera grabación no se pidió, y Flash lanzó un subagente genérico con su mismo modelo. El resumen no lo decía; se vio en el registro de la sesión. Repetida pidiéndolo, el registro confirma `reviewer` con Pro. Comprueba siempre en el registro qué modelo ha revisado de verdad.
- **Separar se paga:** cada sesión paga su prefijo y vuelve a leer (vídeo 22). Aquí compensa, porque es justo lo que se compra: un contexto sin contaminar por el trabajo. La revisión cuesta 1,6 céntimos, casi todo del revisor, en unos dos minutos y medio.
- **El veredicto:** ningún defecto, ni grave ni menor, y dos detalles informativos (qué pasa con un cupón con `importe` y `porcentaje` a la vez, que el contrato no define, y un par de importes no válidos más, como `-Infinity`). J1, J2 y J3 a 2, cada uno con su fichero y línea. Veredicto: aceptar.
- **Lo que no menciona:** el cupón con la clave `importe` pero sin valor, la línea del plan que se aprobó sin mirar. El revisor más caro del día leyó el diff, la rúbrica y las pruebas, y no lo señaló.
- **Si revisor y verificación no coinciden, decide la rúbrica, escrita antes:**
  - un criterio A en rojo bloquea, diga lo que diga el revisor;
  - los criterios J los puntúa el revisor: todo a 2, se acepta; algún 1, se revisa; algún 0, se bloquea.

  Nadie negocia la regla con el trabajo delante. Y aceptar no es una garantía (vídeo 24): quiere decir que no encontró nada grave, no que no lo haya.
- **El ancla:** la prueba oculta contra la rama de trabajo pasa, 2 de 2: la silla de 45 € con un cupón de 10 €, y un cupón mayor que el pedido, que deja la base en 0. El agente cubrió ese caso con sus pruebas. Pero el ancla tampoco mira el cupón sin valor: comprueba lo que escribiste, no lo que olvidaste.

### 6 · Integración continua y petición de cambios

<p><button type="button" class="ir-a" data-t="1029">▶ Ir a 17:09</button></p>

- **El commit, por la puerta:** `omp commit` y `/git` (vídeo 18) no se usan. La puerta vigila la herramienta `bash` del agente, y un commit hecho por otro camino no pasa por ella; además, `omp commit` pedía el mensaje en inglés y en pasado, contra lo que dice `AGENTS.md`. Los commits los hace el agente, por la puerta, o los haces tú sabiendo que te la saltas.
- **La regla general:** una barrera tiene que estar por donde pasan todos los caminos. En un equipo, ese sitio es un hook de git o la integración continua, no la sesión de un agente.
- **La integración continua, en local:** el workflow de la tienda (vídeo 10) se dispara en cada pull request y ejecuta `scripts/revisar.sh` con Pi, con el script y los permisos sacados de la rama base, no de la petición. En local, contra `final` y con las mismas herramientas de solo lectura, Pi tarda medio minuto y el informe acaba en `VEREDICTO: OK`. El script sale con el código de las pruebas, no con la opinión del modelo.
- **Lo que encuentra la CI:** el cupón con `importe` sin definir no pasa por la validación: sigue por el camino del porcentaje y devuelve algo que no es un número, en lugar de un error de tipo. Pi, con Flash y solo herramientas de lectura, lo encuentra por su cuenta. El plan lo vio y lo dejó fuera de alcance; el revisor con Pro, no.
- **La lección no es que un modelo sea mejor que otro:** ningún revisor, por sí solo, es la puerta. Por eso hay una rúbrica escrita antes, una verificación que no opina, una prueba oculta y más de una mirada, cada una desde un sitio distinto. Cuando dos apuntan al mismo hueco, no es ruido.
- **Qué hacer con el borde:** la rúbrica dice aceptar (todo a 2, nada en rojo), y un borde menor no bloquea. No se arregla en esta petición, porque el contrato no lo pedía y ampliar el alcance en plena revisión es lo que castiga J1. Queda escrito como riesgo y será un criterio del siguiente ticket: primero la frase, después la prueba y luego el código.
- **Sin publicar nada:** `gh pr create --dry-run` necesita un remoto de GitHub y una cuenta, y su ayuda avisa de que aun así puede subir cambios. La herramienta de GitHub de oh my pi viene apagada de serie y usa la misma cuenta. Las dos se quedan en la diapositiva.
- **La descripción**, de oh my pi en otra sesión nueva: título, qué cambia, cómo se ha verificado, la puntuación de la rúbrica y los riesgos del informe de la CI, borde incluido. Va en un fichero fuera de la tienda, sin commit ni push. Léela antes de usarla: si dice que está verificado, tiene que decir dónde está la evidencia.
- **La petición, con git solo:** un repositorio *bare* (sin carpeta de trabajo) hace de servidor. La rama la subes tú, no el agente, porque en el vídeo 19 `git push` quedó en la lista de lo que el agente no puede hacer. `git request-pull` escribe la petición: desde qué commit, dónde está la rama, el commit con su autor y los ficheros cambiados.
- **Lo que no está en la lista de ficheros:** la rúbrica, la aceptación y `verificar.sh` se commitearon en `final` antes de que empezara ningún agente. La petición solo contiene el trabajo del agente, y lo que lo verifica viene de la rama base. Es la regla del workflow: lo que juzga no puede venir de lo que se juzga.
- **En GitHub** solo cambia el transporte: `gh pr create` con el mismo título y descripción, y el workflow de verdad. Lo que se revisa no cambia, y quien decide fusionar, tampoco: tú.

### 7 · Estado limpio, el curso y cierre

<p><button type="button" class="ir-a" data-t="1292">▶ Ir a 21:32</button></p>

- **Estado limpio** (lección 12 de Learn Harness Engineering): una sesión termina cuando la tarea pasa la verificación y, además, la siguiente puede arrancar sin arreglar nada. Dejarlo para luego es no hacerlo nunca. Aquí lo comprueban `./init.sh` (nada sin commitear, pruebas en verde, ninguna pendiente), `git status` limpio, el traspaso vacío y el plan fuera del repositorio.
- **La cuenta del proyecto:**

| Paso | Harness · modelo | Coste |
|---|---|---|
| Plan, con el refinado | oh my pi · DeepSeek Pro | casi 2 céntimos |
| Implementación | Pi · DeepSeek Flash | 1,4 céntimos |
| Revisión | oh my pi · Flash + revisor en Pro | 1,6 céntimos |
| Descripción | oh my pi · Flash | 0,2 céntimos |
| Integración continua | Pi · Flash | 1,2 céntimos |
| **Total** | unos 6 minutos de modelo | **unos 6 céntimos de dólar** |

- **Lo que no sale en la cuenta** es el tiempo que pasas leyendo el plan, el diff, la revisión y la descripción. Ese es el que el harness tiene que cuidar, porque no se paraleliza.
- **Simplifica el harness de vez en cuando:** cada pieza existe porque el modelo no hacía algo bien por su cuenta, y los modelos mejoran. Apaga una pieza, repite tus tareas de prueba y, si no empeora, quítala. La puerta, la rúbrica, el traspaso: ninguna es sagrada. Lo que no puede faltar es una forma de medir si hacen falta.
- **Las cinco piezas del vídeo 01, en una sola tarea:** las instrucciones (`AGENTS.md`), las herramientas (las de serie, sin repartir), el entorno (el perfil demo y la carpeta de Pi, aislados), el estado (la lista, el progreso y el traspaso) y el feedback (`verificar.sh`, la puerta, la revisión y la prueba oculta).
- **Los dos harnesses:** Pi es el mínimo; lo que le falta, una extensión de unas decenas de líneas, como la puerta. oh my pi trae las baterías incluidas: plan, revisión, subagentes y bucles a un comando. Han trabajado sobre el mismo repositorio sin saber nada el uno del otro. Esa es la lección de la etapa final del curso: el harness que más importa es el que vive en tu repositorio.
- **Práctica final:** elige una funcionalidad pequeña de un proyecto tuyo. Escribe antes su descripción, su rúbrica y una prueba oculta fuera del repositorio. Planifica con un harness, lee el plan antes de aprobarlo e implementa con otro, sin más puente que los ficheros. Revisa con un contexto limpio, mira en el registro qué modelo revisó de verdad, prepara la petición de cambios y apunta lo que ha costado.
- **Materiales:** la rama `final` de la tienda, con [`rubricas/ticket-005.md`](https://github.com/CodigoSinSiesta/curso-pi-materiales/blob/tienda/final/rubricas/ticket-005.md); la rama `ticket-005`, con el trabajo de Pi; [`fuera/ticket-005-oculta.mjs`](https://github.com/CodigoSinSiesta/curso-pi-materiales/blob/main/fuera/ticket-005-oculta.mjs) y [`extensiones/puerta.ts`](https://github.com/CodigoSinSiesta/curso-pi-materiales/blob/main/extensiones/puerta.ts), en el [repositorio de materiales del curso](https://github.com/CodigoSinSiesta/curso-pi-materiales). Clónalo en `~/csn` y ejecuta `./preparar.sh`.
- **En tu agente:** el flujo no depende de Pi ni de oh my pi. En Claude Code, Codex u opencode, busca el equivalente de cada paso: un plan que se lee antes de aprobarlo, un revisor con contexto limpio y un hook donde poner la puerta. Lo que se lleva de un agente a otro sin cambios es lo que vive en el repositorio: la rúbrica, la verificación, el andamiaje y la prueba oculta.
- **Fin del curso:** no te fíes del resumen del agente, mide lo que cuesta y deja que decida un programa que hayas escrito tú.

## Código y comandos

Lo que aparece en las ventanas de terminal del vídeo, para copiarlo. Se ejecuta en `~/csn/tienda`.

### El ticket en rojo, antes del trabajo

```bash
git log --oneline -4 final
./verificar.sh ticket-005; echo $?   # 1: fallan 4 de las 5 pruebas de aceptación
```

### oh my pi · el plan

```text
/plan
Prepara el plan de la siguiente funcionalidad de funcionalidades.json siguiendo AGENTS.md, sin escribir el código: qué cambia, dónde y cómo se prueba.
```

Si el plan trae código, «Refine plan»:

```text
Quita el código del plan. Deja qué cambia y dónde, y los casos de prueba con sus importes calculados a mano. El código lo escribe quien implementa.
```

### Pi · la implementación

```bash
pi -e ~/csn/extensiones/puerta.ts --no-skills --model deepseek/deepseek-flash
```

- `-e`: carga la puerta del vídeo 24.
- `--no-skills`: sin tus skills personales, solo lo del proyecto.

### oh my pi · la revisión

```text
/review Lánzalo con la herramienta task y agent: reviewer. Puntúa también J1, J2 y J3 de rubricas/ticket-005.md (0-2) con evidencia fichero:línea, y da el veredicto de la rúbrica.
```

En el menú, «Review against a base branch» y, como base, `final`.

### El ancla y la integración continua

```bash
TIENDA=$PWD node --test ~/csn/fuera/ticket-005-oculta.mjs; echo $?   # 0: pasa 2 de 2
PI_TOOLS=read,grep,find,ls scripts/revisar.sh final               # informe.md, VEREDICTO: OK
```

### La petición de cambios, sin GitHub

```bash
git init -q --bare ../remoto/tienda.git          # una vez: el «servidor»
git remote add revision ../remoto/tienda.git
git push -q revision ticket-005
git request-pull final revision ticket-005
```

- `revision`: un remoto *bare* en la misma máquina, que hace de servidor.
- `request-pull`: el commit de partida, dónde está la rama, los commits con su autor y los ficheros cambiados.

## Fuentes

- Learn Harness Engineering (WalkingLab, © 2025, licencia MIT): lección 12 (estado limpio: verificación más un arranque que no haya que arreglar; simplificar el harness apagando piezas) y su plantilla de checklist de estado limpio; lecciones 13 y 14, ya citadas en el vídeo 25. Ideas adaptadas y traducidas, sin texto literal.
- oh my pi: `/review` (modos de revisión; contra una rama base revisa desde el punto en que se separó), el modo plan (vídeo 15), `omp://tools/github.md` (la herramienta de GitHub, apagada de serie) y `omp://cli-reference.md`. Web: https://omp.sh/.
- Pi: `extensions.md` (la puerta, vídeo 24) y [`containerization.md`](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/containerization.md) (el contenedor, vídeo 05). Pi no trae modo plan ni subagentes de serie; hay ejemplos en `examples/extensions/plan-mode/` y `subagent/`.
- git: `git request-pull` y los repositorios *bare*. GitHub CLI: `gh pr create --help` (`--dry-run`).
- Vídeos relacionados: 01 (las cinco piezas), 05 (seguridad), 10 (`revisar.sh` y el workflow), 15 (modo plan), 16 (subagentes), 18 (`/review` y `omp commit`), 19 (`git push` en `deny`), 23 (andamiaje), 24 (rúbrica, puerta y A1–A5) y 25 (uno frente a varios y la prueba oculta).

## Transcripción

<details>
<summary>Ver la transcripción de la locución</summary>

Texto de la locución tal como se dice en el vídeo (los símbolos se leen en voz alta: «punto md» es <code>.md</code>).

**1 · Todo junto**

Último vídeo del curso, y hoy no hay ninguna herramienta nueva: toca juntarlo todo. Una funcionalidad de principio a fin en la tienda de juguete que nos acompaña desde el principio. Con la rúbrica escrita antes de empezar, un plan antes de tocar nada, el reparto solo si compensa, la implementación, la revisión, las pruebas, el commit y la petición de cambios. Con Pi y con oh my pi.

Recordemos lo que ya está montado. Del vídeo veintitrés, el andamiaje: el AGENTS punto md con su rutina de entrada y de salida, la lista de funcionalidades, el progreso, init punto sh y el traspaso. Del veinticuatro, la rúbrica de cada funcionalidad, su prueba de aceptación, verificar punto sh y la puerta, una sola extensión que cargan los dos harness. Y del veinticinco, el coste medido de repartir y la prueba oculta, fuera del repositorio.

El reparto de papeles de hoy. oh my pi planifica, con el modo plan del vídeo quince. Pi implementa, en una sesión nueva, con la puerta cargada y sin más contexto que el repositorio. oh my pi vuelve a entrar para revisar, con barra review, como si fuera una petición de cambios. Y Pi hace de integración continua, con el script de revisión del vídeo diez. Entre uno y otro, solo ficheros.

¿Por qué mezclarlos? No es por lucirse. Es la idea del veintitrés llevada al final: si el estado vive en el repositorio, da igual qué harness abra la siguiente sesión. Y es la separación del veinticuatro: quien revisa no es quien ha hecho el trabajo. Hoy, quien revisa no ha visto la sesión que escribió el código, ni usa el mismo modelo ni el mismo harness.

Mientras lo ves, fíjate en una sola cosa: quién decide en cada paso. Qué es terminado lo decidimos nosotros, antes de empezar. El camino lo propone un modelo y lo aprobamos nosotros. Si una funcionalidad pasa, lo decide un script. Si el cambio tiene sentido, lo opina un revisor. Y qué entra en la rama base, otra vez nosotros. Ningún paso depende de que el agente diga que ha terminado.

Partimos de donde lo dejó el vídeo anterior: la cuarta funcionalidad, el desglose del pedido, en pasa, hecha por el bucle de oh my pi. Sobre ese commit abrimos una rama base, final, y desde ella, la rama de trabajo. La petición de cambios irá de la rama de trabajo a final, como en cualquier repositorio de equipo.

**2 · El ticket, antes que el código**

La funcionalidad es ticket cero cero cinco: un cupón de importe fijo. Hoy la tienda solo entiende cupones de porcentaje, un objeto con porcentaje diez, por ejemplo. Queremos que acepte también un objeto con importe cinco, que descuente cinco euros. En el vídeo quince planificamos códigos de cupón en texto, y de aquella sesión nos quedó una regla: la forma de objeto del cupón no se toca. Hoy le añadimos un segundo tipo.

La elegimos por tres razones. Es pequeña: cambia una función, total con cupón, y sus pruebas. Pero esa función la usan el envío, el desglose del veinticinco y el ticket del veinticuatro, así que un error se propaga por toda la tienda. Y tiene una trampa natural: total con cupón recorre las líneas una a una, y lo fácil es restar los cinco euros en cada línea, en lugar de una sola vez.

El comportamiento lo escribimos en funcionalidades punto json, con frases que se puedan comprobar. El importe se resta una sola vez al subtotal, antes del IVA y del envío. El total con cupón nunca baja de cero. Un importe que no sea un número finito mayor que cero es un error de tipo. Y el cupón de porcentaje sigue igual que antes. Cuatro frases, y cada una se puede convertir en una prueba.

Después, la rúbrica, con la plantilla de WalkingLab del veinticuatro. El contrato: dentro del alcance, el carrito y sus pruebas; fuera, el envío, el ticket y el desglose, que tienen que seguir funcionando sin tocarlos. Los cinco criterios automáticos de siempre, de A uno a A cinco. Y tres de juicio, para un revisor: alcance, pruebas con sentido y reutilizar lo que ya existe.

La prueba de aceptación cruza piezas, como pedía el veinticuatro. El pedido de la frontera, la mochila y tres libretas, suma cuarenta y dos euros; con el cupón de cinco, la base queda en treinta y siete, el envío en cuatro con noventa y cinco, y el total en cuarenta y nueve con setenta y dos. Una silla de cuarenta y cinco se queda en cuarenta justos, en el umbral, y el envío sale gratis. Y comprueba también la última línea del ticket.

Y la prueba oculta, fuera de la tienda, junto a la del veinticinco. Otros pedidos y una pregunta más: qué pasa si el cupón vale más que el pedido. La descripción lo dice, y la rúbrica pide que las pruebas lo cubran, pero la aceptación no lo comprueba. Si el agente lo cubre con sus propias pruebas, bien. Si no, lo sabremos nosotros, y no él.

Lo commiteamos todo en la rama base, con la etiqueta rubrica ticket cero cero cinco, y ejecutamos verificar punto sh ticket cero cero cinco: rojo. Cuatro de las cinco pruebas de aceptación fallan, porque el cupón de importe no existe. La quinta pasa, porque comprueba que el cupón de porcentaje no cambie. Una aceptación que falla antes del trabajo comprueba algo.

Antes de grabar probamos la verificación sin ningún agente. Una implementación de referencia lo pasa todo. Una que resta en cada línea cae en la aceptación. Y una que deja la base en negativo pasa verificar y solo cae en la prueba oculta. Y como A cinco compara con la última etiqueta de rúbrica, desde el veinticinco, no hemos tenido que tocar verificar punto sh: basta con etiquetar.

**3 · El plan, y por qué no repartimos**

¿Hace falta un plan para cambiar una función? En el veinticinco dijimos que compensa cuando equivocarse de camino cuesta más que esperar. El cambio es pequeño, pero la función está en el centro de la tienda. Leer un plan cuesta un minuto. Leer un diff equivocado cuesta bastante más.

Abrimos oh my pi en la tienda, con el perfil demo. Barra plan, y el pie cambia a DeepSeek Pro: el rol plan, como en el quince. El encargo: prepara el plan de la siguiente funcionalidad de funcionalidades punto json siguiendo AGENTS punto md, sin escribir el código: qué cambia, dónde y cómo se prueba. No le contamos de qué trata. Tiene que sacarlo del repositorio.

Pro empieza por lo que pide el AGENTS punto md: el progreso, la lista de funcionalidades y el traspaso. En modo plan puede mirar y ejecutar consultas, pero el plan lo escribe fuera del árbol de trabajo. Lee init punto sh en lugar de ejecutarlo, la rúbrica, la aceptación, el carrito y a quién llama total con cupón. En un par de minutos propone el plan. Y aquí llega la primera sorpresa del día.

Le habíamos pedido que no escribiera el código, y el plan trae la función completa, lista para pegar. Bien razonada, por cierto: resta una sola vez, con el tope en cero y con su error de tipo. Pero un plan con el código dentro ya no es un plan: es la implementación esperando a que alguien la copie. Y quien la copia no decide nada.

Así que no lo aprobamos. Elegimos refine plan y se lo pedimos con otras palabras: quita el código del plan; deja qué cambia y dónde, y los casos de prueba con sus importes calculados a mano; el código lo escribe quien implementa. En unos veinte segundos lo reescribe. Ya no hay bloques de código, aunque sigue siendo muy concreto: describe la condición, el tope en cero y el redondeo casi frase por frase.

La lección es incómoda, pero útil. Pedir en el encargo que no haya código no ha bastado. Lo que ha funcionado es leer el plan antes de aprobarlo, que es para lo que existe ese paso. Un plan no se aprueba por llegar: se lee contra el contrato. ¿Toca solo el carrito y sus pruebas? ¿Resta el importe una sola vez? ¿Cubre el cupón mayor que el pedido? Las tres, sí.

Hay una línea más que conviene recordar. Entre sus decisiones, el plan dice que un cupón con la clave importe, pero sin valor, sigue por el camino del porcentaje como hasta ahora, y que eso queda fuera de alcance. Lo aprobamos así, sin pararnos en ella. Volverá a salir en la revisión.

Save and quit, con una ruta fuera de la tienda, en la carpeta temporal. oh my pi guarda el plan y abre una sesión nueva, vacía. Git status, limpio: el plan es para la siguiente sesión, no para la historia del repositorio. El plan ha costado casi dos céntimos de dólar, con la vuelta de refinado incluida.

¿Por qué no aprobarlo y ejecutar aquí mismo? Approve and execute lo haría. Pero hoy el plan tiene que cruzar de un harness a otro, y la única forma honrada es un fichero. Es lo mismo que el traspaso del veintitrés: lo que la siguiente sesión necesita, escrito en disco, y no en una conversación que la otra herramienta no puede leer.

Y la pregunta del veinticinco: ¿repartimos? Pasemos ticket cero cero cinco por los cinco criterios. Partes independientes: no, las pruebas dependen de la misma función. Ramas o vueltas atrás: solo repetir si verificar falla. Estado intermedio que guardar: ninguno. Verificación automática: sí. Y lo que ahorras frente a lo que cuesta coordinar: con ticket cero cero cuatro, repartir costó dos veces y media más, tardó más del doble y el resultado fue el mismo. Uno de cinco.

Así que implementa un solo agente. Habrá un subagente, pero uno y al final: el revisor. Es el único sitio donde un contexto nuevo aporta algo, porque no ha visto el razonamiento de quien hizo el trabajo. Lo dijimos en el veinticinco: para revisar con contexto limpio, basta un revisor. Y la regla del dieciséis sigue en pie: una tarea pequeña, en la sesión principal.

**4 · La implementación, en Pi**

Cerramos oh my pi y abrimos Pi en la misma carpeta, con DeepSeek Flash, la puerta del veinticuatro y sin skills, para que no cargue nada que no sea del proyecto. Pi no ha visto nada de lo anterior. Ni la conversación de oh my pi, ni el plan con código: solo lo que hay en disco. El encargo es una frase: trabaja en la siguiente funcionalidad siguiendo AGENTS punto md; el plan está en este fichero.

Pi sigue la rutina de entrada, como en el veintitrés: la carpeta, el plan, el progreso, la lista, el traspaso, el log e init punto sh. Después lee el carrito, sus pruebas, la rúbrica, la aceptación y verificar punto sh. Marca la funcionalidad en curso y cambia total con cupón: una salida al principio que, si el cupón trae importe, lo valida, lo resta una sola vez al subtotal y no deja bajar de cero. El bucle del porcentaje queda como estaba.

Y añade cinco pruebas, con los importes escritos a mano en comentarios. Dos líneas que suman cuarenta y dos y se quedan en treinta y siete. El envío después del cupón. Un pedido que cae justo en el umbral de cuarenta. Un cupón mayor que el pedido, que deja el total en cero. Y una lista de importes no válidos, del cero a un texto, que tienen que lanzar un error de tipo.

Fíjate en lo que no hace. No toca el desglose, ni el ticket, ni el envío: los usa sin cambiarlos. Y no toca la aceptación. Si lo intentara, la puerta respondería con ruta protegida, como vimos en el veinticuatro. Hoy no ha hecho falta.

Ahora, la verificación. Pi ejecuta verificar punto sh ticket cero cero cinco por su cuenta: sale con cero, cinco de cinco en la aceptación y cuarenta y una pruebas en verde. Después marca la funcionalidad como pasa, y la puerta, por diseño, vuelve a ejecutar la verificación antes de aceptar el marcado. Si saliera en rojo, lo desharía y le devolvería el motivo. Ha salido en verde a la primera, y cuando todo va bien, la puerta no enseña nada.

Y la rutina de salida. Pi anota como evidencia la salida de verificar, añade al progreso una entrada para esta sesión y deja el traspaso vacío, porque no queda nada a medias. Después hace un solo commit, en español y empezando por tienda dos puntos: añade el cupón de importe fijo al carrito. La puerta verifica otra vez antes de dejarlo pasar. Y para acabar, init punto sh: ninguna funcionalidad pendiente.

Todo en unos cuarenta segundos y por uno coma cuatro céntimos de dólar. Lo comprobamos desde fuera, porque el resumen del agente es una opinión. Verificar punto sh ticket cero cero cinco: cero. Git diff contra final: cuatro ficheros, el carrito, sus pruebas, la lista y el progreso, con setenta y cuatro líneas añadidas y cinco quitadas. Un solo commit, y ningún fichero fuera del contrato.

Recuerda lo que vimos en el vídeo cinco: Pi no pide permiso para nada. No tiene aprobaciones por herramienta ni sandbox de serie. La puerta no cambia eso. No impide que el agente borre un fichero con bash ni que lea lo que no debe: solo decide quién da por buena una funcionalidad y quién puede commitear. Para lo demás, el contenedor del vídeo cinco sigue siendo la respuesta.

**5 · La revisión, con otro harness**

La verificación dice que se cumple lo que supimos escribir. La revisión mira lo demás: si las pruebas tienen sentido, si se reutiliza lo que ya había, si el cambio es el mínimo. Son los tres criterios de juicio de la rúbrica, y no los puntúa un script.

Volvemos a oh my pi, en una sesión nueva. Escribimos barra review y, detrás, una instrucción: lánzalo con la herramienta task y el agente reviewer; puntúa también J uno, J dos y J tres de la rúbrica, con evidencia de fichero y línea, y da el veredicto. Lo que escribes detrás del comando se añade al encargo. En el menú, revisar contra una rama base, al estilo de una petición de cambios. Y como base, final.

oh my pi calcula el diff desde el punto en que la rama de trabajo se separó de final, lo congela dentro del encargo y le pide al modelo de la conversación que lance el revisor. La conversación sigue en Flash. El agente revisor trabaja con el rol slow, que hoy apunta a DeepSeek Pro: otro modelo, otro harness y un contexto que no ha visto la sesión de Pi.

¿Por qué pedir el agente por su nombre? Porque la primera vez que lo grabamos no lo hicimos, y Flash lanzó un subagente genérico, con su mismo modelo, Flash. No lo dijo el resumen; lo vimos en el registro de la sesión. Así que repetimos la revisión pidiéndolo explícitamente, y esta vez el registro lo confirma: el subagente reviewer, con Pro.

Separar también se paga: cada sesión paga su prefijo y vuelve a leer lo que necesita, como medimos en el veintidós. Aquí compensa, porque lo que compramos es justo eso, un contexto que no está contaminado por el trabajo. La revisión ha costado uno coma seis céntimos, casi todo del revisor, en unos dos minutos y medio.

El resultado. Ningún defecto, ni grave ni menor. Dos detalles informativos: qué pasa si un cupón trae importe y porcentaje a la vez, que el contrato no define, y que a la lista de importes no válidos le faltan un par de casos, como menos infinito. J uno, J dos y J tres, a dos, cada uno con su fichero y su línea. Veredicto: aceptar.

Y hay algo que no menciona. La línea del plan que aprobamos sin pararnos, el cupón con la clave importe pero sin valor, no aparece en la revisión. El revisor más caro del día ha leído el diff, la rúbrica y las pruebas, y no la ha señalado. Enseguida veremos quién sí.

¿Y si el revisor y verificar no están de acuerdo? La rúbrica ya lo decide, porque la escribimos antes. Lo automático lo manda el script: si un criterio A sale en rojo, se bloquea, diga lo que diga el revisor. Lo de juicio lo puntúa el revisor: con todo a dos se acepta, con algún uno se revisa y con algún cero se bloquea. Nadie negocia la regla con el trabajo delante.

Y recuerda lo que dijimos en el veinticuatro: el veredicto de un revisor no es una garantía. Aceptar quiere decir que no ha encontrado nada grave, no que no lo haya. Por eso, después del revisor, llega una pieza que no depende de ningún modelo.

El ancla. Ejecutamos la prueba oculta contra la rama de trabajo. Pasa, dos de dos: la silla de cuarenta y cinco euros con un cupón de diez, y un cupón mayor que el pedido, que deja la base en cero. El agente cubrió ese caso con sus propias pruebas. Pero el ancla tampoco mira el cupón sin valor: comprueba lo que escribimos, no lo que olvidamos.

**6 · Integración continua y petición de cambios**

Una decisión sobre el commit. oh my pi tiene un comando que genera el mensaje, o eme pe commit, y una interfaz para commitear, barra git. Los vimos en el dieciocho, y hoy no los usamos. La puerta vigila la herramienta bash del agente: un commit que se hace por otro camino no pasa por ella. Y en el dieciocho, o eme pe commit pedía el mensaje en inglés y en pasado, contra lo que dice nuestro AGENTS punto md.

Así que los commits los hace el agente, por la puerta, o los haces tú, sabiendo que te la saltas. La regla general: una barrera tiene que estar donde pasan todos los caminos. En un equipo, ese sitio es un hook de git o la integración continua, no la sesión de un agente.

Y la integración continua. Desde el vídeo diez, la tienda tiene un workflow que se dispara con cada pull request y ejecuta el script de revisión con Pi, con el script y los permisos sacados de la rama base, no de la petición. Lo ejecutamos en local contra final, con las mismas herramientas de solo lectura. Pi tarda medio minuto, y el informe termina con un veredicto: OK. El script sale con cero, el código de las pruebas, no la opinión del modelo.

Pero el informe trae algo que la revisión no tenía. El cupón con el importe sin definir no pasa por la validación: sigue por el camino del porcentaje y devuelve algo que no es un número, en lugar de un error de tipo. Pi, con Flash y solo herramientas de lectura, lo encuentra por su cuenta. El plan lo había visto y lo dejó fuera de alcance. El revisor con Pro, no.

La lección no es que un modelo sea mejor que otro. Es que ningún revisor, por sí solo, es la puerta. El más caro del día no lo vio todo. Por eso hay una rúbrica escrita antes, una verificación que no opina, una prueba oculta y más de una mirada, cada una desde un sitio distinto. Cuando dos de ellas apuntan al mismo hueco, no es ruido.

¿Y qué hacemos con el borde? La rúbrica lo decide: todo a dos y nada en rojo es aceptar, y un borde menor no bloquea. No lo arreglamos en esta petición de cambios, porque el contrato no lo pedía, y ampliar el alcance en plena revisión es justo lo que castiga J uno. Lo dejamos escrito como riesgo, y será un criterio del siguiente ticket: primero la frase, después la prueba y luego el código.

Llega la petición de cambios, y aquí hay un límite del curso: no publicamos nada ni enseñamos cuentas. El cliente gh tiene un guion guion dry run para preparar una pull request sin crearla, pero necesita un remoto de GitHub y una cuenta, y su propia ayuda avisa de que aun así puede subir cambios. oh my pi trae una herramienta de GitHub, apagada de serie y con la misma cuenta detrás. Las dos se quedan en la diapositiva.

Primero, la descripción. Se la pedimos a oh my pi, en otra sesión nueva: título, qué cambia, cómo se ha verificado, la puntuación de la rúbrica y los riesgos, sacados del informe de la integración continua. En un fichero fuera de la tienda, sin commit y sin push. El borde del cupón sin valor queda en los riesgos. La leemos antes de usarla: si dice que todo está verificado, tiene que decir dónde está la evidencia.

Después, lo que git sabía hacer antes de GitHub. Un repositorio sin carpeta de trabajo, en otro sitio de la máquina, hace de servidor. La rama la subimos nosotros, no el agente: en el diecinueve pusimos git push en la lista de lo que el agente no puede hacer. Y git request pull escribe la petición: desde qué commit, dónde está la rama, el commit del agente con su autor y los ficheros cambiados.

Fíjate en lo que no aparece en la lista de ficheros: ni la rúbrica, ni la aceptación, ni verificar punto sh. Se commitearon en final antes de que empezara ningún agente. La petición solo contiene el trabajo del agente, y lo que lo verifica viene de la rama base. Es la misma regla que sigue el workflow: lo que juzga no puede venir de lo que se juzga.

Juntas, las tres piezas son la petición de cambios: la rama en el servidor, el resumen de git con su descripción, y una revisión automática que no ha hecho quien escribió el código. En GitHub cambiaría el transporte: gh pr create, con el mismo título y la misma descripción, y el workflow de verdad. Lo que se revisa no cambia, y quien decide fusionar, tampoco: tú.

**7 · Estado limpio, el curso y cierre**

Queda lo que la lección doce de Learn Harness Engineering dice que todo el mundo deja para luego: dejar el repositorio limpio. Para la lección, una sesión ha terminado cuando la tarea pasa la verificación y, además, la siguiente sesión puede arrancar sin arreglar nada. Dejarlo para luego, dice, es no hacerlo nunca.

Lo comprobamos con lo que ya teníamos. Init punto sh: la carpeta, nada sin commitear, las pruebas en verde y ninguna funcionalidad pendiente. Git status, limpio. El traspaso, vacío, y el plan, fuera del repositorio. El arranque funciona, la verificación funciona, el progreso está escrito, y nadie tiene que adivinar qué pasó.

Y la cuenta del proyecto entero. El plan, casi dos céntimos. La implementación en Pi, uno coma cuatro. La revisión, uno coma seis. La descripción, dos décimas. Y la integración continua, uno coma dos. En total, unos seis céntimos de dólar y unos seis minutos de modelo. Lo que no sale en esa cuenta es el tiempo que pasamos leyendo el plan, el diff, la revisión y la descripción. Ese tiempo es el que el harness tiene que cuidar, porque no se paraleliza.

La lección deja un consejo para después de este curso. Cada pieza del harness existe porque el modelo no hacía algo bien por su cuenta. Los modelos mejoran, así que de vez en cuando apaga una pieza, repite tus tareas de prueba y mira si empeora. Si no empeora, quítala. La puerta, la rúbrica, el traspaso: ninguna es sagrada. Lo que no puede faltar es una forma de medir si hacen falta.

Repasemos el curso entero. En el vídeo uno dijimos que un harness tiene cinco piezas: instrucciones, herramientas, entorno, estado y feedback. Hoy han salido todas en una sola tarea. Las instrucciones, en el AGENTS punto md. Las herramientas, las de serie, sin repartir. El entorno, el perfil demo y la carpeta de Pi, aislados. El estado, en la lista, el progreso y el traspaso. Y el feedback, en verificar, la puerta, la revisión y la prueba oculta.

Y los dos harness. Pi, el mínimo: casi nada de serie, y lo que le falta, una extensión de unas decenas de líneas, como la puerta. oh my pi, el de las baterías incluidas: plan, revisión, subagentes y bucles a un comando de distancia. Hoy han trabajado sobre el mismo repositorio sin saber nada el uno del otro. Esa es la lección del bloque D: el harness que más importa es el que vive en tu repositorio.

La práctica final. Elige una funcionalidad pequeña de un proyecto tuyo. Escribe antes su descripción, su rúbrica y una prueba oculta fuera del repositorio. Planifica con un harness, lee el plan antes de aprobarlo e implementa con otro, sin más puente que los ficheros. Revisa con un contexto limpio, mira en el registro qué modelo revisó de verdad, prepara la petición de cambios y apunta lo que ha costado.

Y aquí termina el curso de Pi y oh my pi. Gracias por llegar hasta el final. No te fíes del resumen del agente, mide lo que cuesta y deja que decida un programa que hayas escrito tú. Nos vemos en la próxima formación de Código Sin Siesta.

## Notas de producción

- Locución: 63 párrafos (62 + apertura), 4.198 palabras, 7 capítulos; párrafos de 44 a 83 palabras (sin la apertura).
  Sin versiones ni marcas pendientes. `NaN`, `undefined` y `Math.max` no se leen.
- Planos: `work/shots.js` (`node sync_check.mjs` limpio); hojas en `work/comparar/hoja-01…18.png`. Una figura
  reutilizada (`v24-puerta`); ninguna nueva.

</details>

