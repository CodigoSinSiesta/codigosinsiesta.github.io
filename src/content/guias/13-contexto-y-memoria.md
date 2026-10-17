---
title: "Vídeo 13 · Contexto y memoria"
description: "Medir el contexto, adelgazarlo, resumirlo y traspasarlo en la misma sesión. Los sistemas de memoria de omp y las preguntas laterales sin ensuciar la conversación."
ruta: "pi-oh-my-pi"
orden: 13
duracion: "25 min"
video: "13-contexto-y-memoria.mp4"
subtitulos: "/subtitulos/pi-oh-my-pi/13-contexto-y-memoria.es.vtt"
---

Medir el contexto, adelgazarlo, resumirlo y traspasarlo en la misma sesión. Los sistemas de memoria de omp y las preguntas laterales sin ensuciar la conversación.

<p class="guia__nota">Dura 25 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

## Resumen por capítulos

### 1 · Lo que ya sabes del contexto

<p><button type="button" class="ir-a" data-t="18">▶ Ir a 0:18</button></p>

- Del vídeo 03: cada petición lleva el prompt de sistema con tus ficheros de contexto, las herramientas y la rama activa. Cuando no cabe, se compacta: se resume lo antiguo y se conservan los mensajes recientes. Y el resumen lo escribe un modelo, así que puede equivocarse.
- omp lleva esa idea más lejos: cinco métodos de compactar encadenados en orden, adelgazar sin llamar al modelo, resumir en segundo plano antes de que haga falta y memoria entre sesiones.
- El plan tiene tres verbos: medir (`/context`), adelgazar (`/shake`, `/compact`) y traspasar (`/handoff`). Después, preguntas laterales, contexto extendido y memoria.
- Ojo con el coste: `/compact`, `/handoff` y las preguntas laterales llaman al modelo aunque el nombre no lo sugiera.

### 2 · Medir con /context

<p><button type="button" class="ir-a" data-t="115">▶ Ir a 1:55</button></p>

- `/context` da un informe por categorías que no se queda en la conversación: System prompt, System tools (definiciones de herramientas), System context (tus ficheros de contexto), Skills y Messages, más el espacio libre y la reserva para compactar.
- *En la demo:* en una sesión vacía, las herramientas son lo más grande de la petición (3,7K tokens, más que el prompt de sistema). Con `--tools read,bash,edit,write` bajan a 1,1K, y la sesión vacía pasa de 6,7K a 3,6K tokens.
- No es una invitación a quitar herramientas: con un millón de tokens de ventana, 3K son poca cosa. Con una ventana pequeña o muchos servidores MCP, esta cuenta sí cambia decisiones.
- `RULES.md` en `.omp/` es una regla fija que viaja completa en cada petición: para lo poco que debe seguir a la vista aunque la conversación se compacte.
- Atajo: al escribir `/co`, el selector ya enseña el porcentaje de contexto usado.

### 3 · Cuándo compacta solo oh my pi

<p><button type="button" class="ir-a" data-t="306">▶ Ir a 5:06</button></p>

- Compacta al superar un umbral. La reserva es el mayor de dos valores: 16 384 tokens, como Pi, o el 15 % de la ventana. Con un millón, 150 000 tokens.
- Prepara el resumen en segundo plano al acercarse al umbral, y lo comprueba también a mitad de un turno largo, entre herramientas.
- Antes de resumir limpia sin modelo: trunca resultados antiguos de herramientas (protege los recientes), da por superadas las lecturas repetidas y deja en una línea los resultados inútiles.
- Si el proveedor responde que la petición no cabe, omp no la reintenta tal cual: compacta y reintenta el turno. Es la recuperación por desbordamiento del vídeo 03.
- `compaction.methodOrder` fija el orden de los métodos; de fábrica: `remote` (el del proveedor), `snapcompact` (historia en imágenes), `handoff` (traspaso), `shake` (sin modelo) y `soft` (resumen local). Si uno no está disponible o falla, pasa al siguiente.

> **Nota:** la locución remite al «final del vídeo doce» para esta regla. El vídeo que la cuenta es el 03.

### 4 · Adelgazar sin modelo: /shake

<p><button type="button" class="ir-a" data-t="437">▶ Ir a 7:17</button></p>

- *En la demo:* para un registro de 2000 líneas, el agente usa `grep` y trae solo las 14 líneas con error. Es lo que hace un buen agente con un fichero grande.
- `/shake` (modo elide) quita resultados de herramientas y bloques grandes. No llama al modelo: es instantáneo y gratis. *En la demo:* Messages baja de 13K a 8,1K tokens.
- La pantalla no cambia: adelgaza lo que recibe el modelo. Cada resultado quitado queda como una referencia `artifact://` a una copia guardada junto a la sesión, que el modelo puede volver a leer.
- Quita los resultados, no lo que el modelo concluyó a partir de ellos: lo ya digerido puede irse. `/shake images` y `/shake thinking` quitan imágenes y razonamiento.
- En la lista automática, shake es prudente. El `/shake` manual es más agresivo: lánzalo cuando sepas qué sobra.

### 5 · /compact y sus modos

<p><button type="button" class="ir-a" data-t="602">▶ Ir a 10:02</button></p>

- `/compact [modo] [foco]`: sin modo recorre la lista; con modo lo fuerza. Los modos son `soft`, `remote` y `snapcompact`, no comandos sueltos.
- `soft` es el resumen local de Pi, con secciones fijas (objetivo, restricciones, progreso, decisiones, siguientes pasos, contexto crítico). Gasta modelo. *En la demo:* el total baja de 15K a 9,3K tokens y Messages, de 8,1K a 2,6K. El resumen detecta un desliz del modelo y avisa de reverificarlo; luego el modelo distingue lo que sabe del resumen de lo que supone.
- `remote` usa la compactación del proveedor (OpenAI, Anthropic o un servidor propio) y cae a local si falla. Con OpenAI, en tu fichero queda un marcador, no un resumen legible.
- `snapcompact` imprime la historia en imágenes que el modelo lee de vuelta: sin modelo, sin clave, sin red. Solo con modelos que aceptan imágenes, y solo compensa con historias largas.
- Todos, también shake, cambian el principio de la conversación y rompen la caché (vídeo 04): la siguiente petición se paga casi entera. Adelgaza cuando compense.

| Necesitas… | Usa |
|---|---|
| Quitar resultados de herramientas que ya no sirven | `/shake` (gratis) |
| Seguir con menos peso, conservando lo importante | `/compact soft` con foco |
| Cambiar de fase o dejar el trabajo listo para retomarlo | `/handoff` con foco |
| Una pregunta suelta que no ensucie la sesión | `/btw` |

### 6 · Traspasar con /handoff

<p><button type="button" class="ir-a" data-t="873">▶ Ir a 14:33</button></p>

- `/handoff [foco]` resume la sesión en un documento de traspaso, pensado para que otra instancia del agente retome el trabajo: estado, decisiones y siguientes pasos. Gasta modelo.
- No abre una sesión nueva: compacta en el sitio, con el mismo id y el mismo fichero. Versiones antiguas sí abrían sesión aparte; puede que lo leas en guías viejas.
- Frente a `/compact`, el modelo recibe el documento como el contexto de trabajo de una instancia anterior, y la petición aprovecha la caché de tus turnos. No funciona mientras el agente responde; si cancelas, no se guarda nada.
- El concepto de traspaso del vídeo 01 es un documento para empezar limpio; omp lo implementa como una compactación más dentro de la misma sesión.
- Un traspaso es un resumen de un modelo. Lo que tiene que sobrevivir (código, tests, decisiones) va al repositorio: vídeo 23.

### 7 · Preguntas laterales y contexto extendido

<p><button type="button" class="ir-a" data-t="1021">▶ Ir a 17:01</button></p>

- `/btw <pregunta>` responde aparte, incluso con un turno en marcha, y la pregunta no entra en la conversación (Messages no crece por ella). `f` abre una pregunta de seguimiento; el historial sobrevive al retomar, pero no entra en las exportaciones.
- No es gratis: cada pregunta envía el contexto actual al proveedor. Úsala para dudas de verdad, no como chat paralelo. Si la pregunta necesita trabajo, eso es `/tan`, una tarea en paralelo (vídeo 16).
- `/extended-context on|off|status` cambia a la ventana grande en los modelos que tienen dos. `on` y `off` se guardan en tu configuración, no solo en la sesión.
- Una ventana mayor tampoco es gratis: el umbral de compactación sube con ella y cada petición puede llevar muchos más tokens. Antes, pregúntate si te basta con adelgazar.

### 8 · Memoria entre sesiones

<p><button type="button" class="ir-a" data-t="1162">▶ Ir a 19:22</button></p>

- La memoria guarda lo aprendido y lo inyecta en sesiones futuras. Viene apagada (`memory.backend: off`). Backends: `local` (resume tus sesiones antiguas al arrancar, con modelo y sin que escribas nada), `mnemopi` (SQLite en tu máquina) y `hindsight` (servidor externo, pensado para equipos).
- *En la demo:* mnemopi sin modelo ni embeddings. El modelo guarda un hecho con la herramienta descubrible `retain`; en una sesión nueva lo recuerda y avisa de que no es una verificación fresca.
- `/memory view` enseña lo inyectado. Había dos recuerdos: el pedido y otro que mnemopi guardó solo, el turno entero con una errata. La retención automática guarda lo que pasa, no solo lo que pides, y sin corregir.
- `/memory stats`, `queue`, `sync` y `clear` (o `reset`) gestionan la memoria; con Hindsight, `clear` no borra el banco del servidor.
- Límite honesto: la memoria es una pista, no la verdad. Si contradice al código o a ti, gana el código y ganas tú.

### 9 · Repaso, práctica y cierre

<p><button type="button" class="ir-a" data-t="1402">▶ Ir a 23:22</button></p>

- Medir: `/context` da categorías, espacio libre y reserva. Las herramientas cuestan contexto en cada petición, y ahora sabes cuánto.
- Adelgazar: omp compacta solo, recorriendo `methodOrder`. `/shake` quita peso sin modelo y deja lo quitado recuperable; `/compact` resume (soft legible, remote del proveedor, snapcompact en imágenes).
- Traspasar: `/handoff` escribe un traspaso y compacta en la misma sesión. `/btw` no ensucia la sesión, pero se paga. La memoria lleva lo aprendido a la siguiente sesión como pista.
- Práctica: mide con `/context` antes de escribir nada, trabaja unos turnos, mide otra vez y lanza `/shake`. Compacta con soft y un foco concreto, busca un error en el resumen, termina con `/handoff` y compara qué conserva cada documento.

## Código y comandos

Lo que aparece en las ventanas de terminal del vídeo, para copiarlo.

### Memoria de la demo

No aparece en el vídeo; está aquí como referencia.

```text
omp --profile demo config set memory.backend mnemopi
omp --profile demo config set mnemopi.noEmbeddings true
omp --profile demo config set mnemopi.llmMode none
```

- `noEmbeddings` busca solo por texto y no descarga un modelo de embeddings. Si quieres búsqueda por significado, actívalos; para recuerdos en castellano existe la variante multilingüe.
- `llmMode none` hace que mnemopi no llame a ningún modelo: la memoria no cuesta nada.

En el perfil demo también se bajó `keepRecentTokens` (los tokens recientes que la compactación conserva siempre) de 20 000 a 3000, para que una sesión pequeña tenga algo que compactar. En tu trabajo real no lo toques.

## Fuentes

- Documentación de oh my pi ([omp.sh](https://omp.sh)). Grabado con omp 18.6.1.
- `compaction.md`: cuándo y cómo compacta, `methodOrder`, shake, snapcompact, los modos remotos y qué ve el modelo después.
- `handoff-generation-pipeline.md`: cómo se genera el traspaso y por qué compacta en el sitio.
- `memory.md` y `mnemosyne-memory-backend.md`: los backends de memoria, `/memory` y «Treat memory as heuristic context».
- `settings.md`, sección «Context, compaction, and memory»: umbrales, reserva y `/extended-context`.
- `slash-command-internals.md`: cómo funciona `/btw`.
- Vídeos relacionados del curso: 03 (contexto y compactación en Pi), 04 (caché), 07 (coste de las herramientas), 16 (`/tan`) y 23 (el traspaso en el repositorio).

## Transcripción

<details>
<summary>Ver la transcripción de la locución</summary>

Texto de la locución tal como se dice en el vídeo (los símbolos se leen en voz alta: «punto md» es <code>.md</code>).

**1 · Lo que ya sabes del contexto**

En el vídeo tres vimos cómo Pi monta lo que el modelo recibe en cada petición: el prompt de sistema con tus ficheros de contexto, las herramientas, y la rama activa de la conversación. Vimos también la compactación: cuando la conversación no cabe, se resume lo antiguo y se conservan los mensajes recientes. Y sacamos una lección incómoda: el resumen lo escribe un modelo, y puede equivocarse.

oh my pi hereda esa idea, pero la lleva mucho más lejos. No tiene una forma de compactar, sino cinco, encadenadas en orden. Puede adelgazar una sesión sin llamar al modelo. Puede resumir en segundo plano antes de que lo necesites. Y añade algo que Pi no tiene: memoria entre sesiones, para que lo aprendido en una conversación llegue a la siguiente.

El plan de hoy tiene tres verbos: medir, adelgazar y traspasar. Mediremos con barra context, y por fin cumpliremos lo que prometimos en el vídeo once: cuánto contexto cuestan las herramientas. Adelgazaremos con barra shake, sin modelo, y con barra compact y sus modos. Y traspasaremos con barra handoff. Después, barra by the way y el contexto extendido, y al final la memoria.

Trabajamos como siempre en la tienda, con el perfil demo y DeepSeek V cuatro punto uno Flash, que tiene una ventana de un millón de tokens. Hoy sí editamos algún test, porque no vamos a rebobinar. Y varios comandos de hoy llaman al modelo sin que el nombre lo sugiera: barra compact, barra handoff y las preguntas laterales. Te lo iremos diciendo, porque eso es dinero.

**2 · Medir con barra context**

Empezamos sin gastar nada. Arrancamos oh my pi con el perfil demo y la opción guion guion no session, para no dejar una sesión a medias, y escribimos barra context. Aparece un informe, context usage, con el nombre del modelo y el tamaño de su ventana: un millón. El informe no se queda en la conversación: lo miras, pulsas escape y desaparece.

El informe tiene un medidor de bloques de colores y una leyenda. System prompt es el prompt de sistema de oh my pi: dos mil seiscientos tokens. System tools son las definiciones de las herramientas: tres mil setecientos. System context recoge lo que se inyecta además, como tus ficheros de contexto: cuatrocientos cuarenta y dos. Skills, cero, porque el perfil demo no las carga. Y Messages, cero: aún no hemos escrito nada.

Debajo, el espacio libre y una franja rayada: el autocompact buffer, ciento cincuenta mil tokens, el quince por ciento de la ventana. Es la reserva que oh my pi deja libre para la respuesta y para compactar a tiempo. Ahora veremos de dónde sale ese quince por ciento. Lo importante: sabes de un vistazo cuánto margen te queda antes de que algo pase sin pedirlo.

Fíjate en las herramientas. En una sesión vacía, sin haber escrito nada, son lo más grande de la petición, más que el propio prompt de sistema. Es lo que vimos en el vídeo siete con los servidores MCP: cada herramienta viaja en cada petición, con su nombre, su descripción y sus parámetros. En el vídeo doce vimos que el perfil demo tiene doce activas de veinte disponibles. Eso se paga en cada turno, aunque no las uses.

Lo comprobamos. Salimos y volvemos a entrar con guion guion tools y solo cuatro herramientas: read, bash, edit y write. Barra context otra vez. System tools baja de tres mil setecientos a mil cien. Y el prompt de sistema también adelgaza, de dos mil seiscientos a dos mil, porque parte de sus instrucciones hablan de las herramientas que ya no están. En total, la sesión vacía pasa de seis mil setecientos tokens a tres mil seiscientos.

No te estamos diciendo que quites herramientas: con un millón de tokens de ventana, tres mil son poca cosa. Te decimos que ahora sabes medir lo que cuestan, que era la promesa del vídeo once. Y que con un modelo de ventana pequeña, o con muchos servidores MCP, esta cuenta sí cambia decisiones.

Una nota sobre el prompt de sistema. Tus ficheros de contexto, como AGENTS punto md, se cargan al empezar. Pero oh my pi admite además un RULES punto md, en punto omp, que se convierte en una regla fija y viaja completo en cada petición. Sirve para lo poco que debe seguir a la vista aunque la conversación crezca o se compacte.

Un atajo para no abrir el informe: el selector de comandos. Al escribir barra c o, barra context ya dice en su descripción uno por ciento, seis mil seiscientos noventa y nueve de un millón. Barra compact repite el porcentaje. Y barra extended context dice off. Es lo que vimos en el vídeo doce: muchas descripciones del menú te cuentan el estado.

**3 · Cuándo compacta solo oh my pi**

Antes de adelgazar a mano, conviene saber qué hace oh my pi por su cuenta. Como Pi, compacta cuando el contexto supera un umbral. Pero la reserva cambia. Pi guardaba siempre dieciséis mil trescientos ochenta y cuatro tokens. oh my pi reserva el mayor de dos valores: esos mismos tokens, o el quince por ciento de la ventana. Con un millón de tokens, el quince por ciento gana: los ciento cincuenta mil de la franja rayada.

El umbral se puede fijar a mano, con un porcentaje o con un número de tokens, en los ajustes de compactación. Y según la documentación se comprueba en dos momentos: al terminar un turno, y también a mitad de un turno largo, entre una llamada a herramienta y la siguiente. Es importante en tareas con muchas herramientas, donde un solo turno puede llenar la ventana.

Lo más llamativo es la compactación especulativa, activada de fábrica. Cuando te acercas al umbral, oh my pi empieza a preparar el resumen en segundo plano, sin parar tu trabajo. Cuando cruzas el umbral, ese resumen ya está listo y se aplica al instante. Hoy no lo veremos: con un millón de tokens, nuestra sesión de juguete no se acerca ni de lejos.

Hay también limpieza previa, sin modelo. Si los resultados de herramientas ocupan mucho, oh my pi puede sustituir los antiguos por un aviso de salida truncada, protegiendo siempre los más recientes. Las lecturas de un fichero que has vuelto a leer después se dan por superadas. Y los resultados inútiles, como una búsqueda sin coincidencias, se quedan en una línea.

Recuerda lo que dijimos al final del vídeo doce: el contexto lleno no se reintenta, eso es compactación. Si el proveedor responde que la petición no cabe, oh my pi compacta y reintenta el turno. Tú solo ves el aviso.

¿Y cómo compacta? Recorriendo una lista de métodos en orden, el ajuste compaction method order. De fábrica es remote, snapcompact, handoff, shake y soft. Si un método no está disponible para tu modelo, o falla, pasa al siguiente. Esa lista es la clave del vídeo: cada nombre es una forma distinta de adelgazar, y ahora vamos a ver casi todas en la tienda.

**4 · Adelgazar sin modelo: barra shake**

Primero, hacemos crecer la sesión. Arrancamos una sesión normal y le pedimos tres cosas. Leer todos los ficheros de src y de test, ejecutar los tests y resumir la tienda: quince de quince pasan. Mirar un registro de pedidos de dos mil líneas, que hemos dejado fuera del repositorio, y contar los errores de envío. Y añadir un test para un subtotal de exactamente cuarenta euros.

El segundo turno tiene una lección. Esperábamos que leyera las dos mil líneas, y no lo hizo: usó grep desde bash y solo trajo las catorce líneas con error. Es lo que hace un buen agente con un fichero grande. Y fíjate en un desliz: en la nota final dice dos de los pedidos y luego enumera nueve. Lo guardamos, porque luego reaparece.

El tercer turno, el del test, también razona. Ve que ya había una comprobación de cuarenta euros dentro de otra prueba, crea el caso dedicado, quita la duplicada y ejecuta los tests: dieciséis de dieciséis. Barra context: ahora Messages ocupa trece mil tokens, de un total de veinte mil.

Barra shake. Sin argumentos usa el modo elide, que quita los resultados de herramientas y los bloques grandes. No llama al modelo, así que es instantáneo y gratis. Responde con una línea: ha sacudido once resultados de herramientas y ha liberado unos cuatro mil ochocientos tokens. Barra context lo confirma: Messages baja de trece mil a ocho mil cien.

Fíjate en que la pantalla no cambia. Los diffs y la salida de los tests siguen ahí. Lo que ha adelgazado es lo que recibe el modelo. Cada resultado quitado se sustituye por una referencia artifact, que apunta a una copia guardada junto a la sesión. Si el modelo vuelve a necesitarlo, puede leerla. Y el fichero de sesión sigue teniendo todo.

Lo comprobamos: cuántas líneas de error había en el registro. Responde catorce, sin volver a leer nada. No le hacía falta: el dato estaba en su propia respuesta, y shake quita los resultados de las herramientas, no lo que el modelo concluyó a partir de ellos. Esa es la idea: lo que ya se digirió puede irse.

Hay otros dos modos. Barra shake images quita las imágenes, útil si has pegado capturas que ya no hacen falta. Y barra shake thinking quita los bloques de razonamiento del modelo, que en sesiones largas pueden ocupar más que las respuestas. Ninguno de los tres llama al modelo.

Un matiz. Shake también está en la lista automática, pero allí es prudente: protege una ventana de tokens recientes y solo actúa si el ahorro merece la pena. El barra shake manual es más agresivo. Por eso conviene lanzarlo cuando sabes qué sobra, no por costumbre.

**5 · Barra compact y sus modos**

Shake quita peso, pero no resume. Para eso está barra compact. Igual que en el vídeo tres, en una sesión de juguete casi no habría nada que compactar, porque se conservan siempre veinte mil tokens recientes. Así que en el perfil demo hemos bajado ese margen, keep recent tokens, a tres mil. En tu trabajo real no lo toques.

Barra compact admite un modo y unas instrucciones de foco. Sin modo, recorre la lista de métodos. Con modo, lo fuerza. Hay tres: soft, remote y snapcompact. Y un aviso: barra snapcompact, barra remote y barra soft no existen como comandos. Son modos de barra compact, aunque alguna guía los presente sueltos.

Soft es el más parecido a Pi: un resumen local que escribe el modelo activo. Lo lanzamos con foco: barra compact soft, conserva la decisión sobre el caso de cuarenta euros y el estado de los tests. Esto gasta modelo. Abajo aparece compacting context, con escape para cancelar, y en unos segundos termina.

En el transcript aparece una línea fina: soft compacted, de quince mil a nueve mil trescientos, con control o. Aquí control o activa la expansión, y subiendo con la rueda aparece el resumen entero: compactado de quince mil ciento cincuenta y uno a nueve mil trescientos cuarenta y cuatro tokens. Las rutas que ves difuminadas llevan el nombre de usuario.

Léelo, como en el vídeo tres. Tiene secciones fijas: el objetivo, las restricciones y preferencias, el progreso con lo hecho, lo que está en curso y lo bloqueado, las decisiones clave, los siguientes pasos y el contexto crítico. Y una sorpresa buena: el resumen detecta el desliz del registro. Escribe que el texto decía dos pedidos pero listaba nueve, y que conviene reverificar esa cifra.

Más abajo, dos cosas que merece la pena ver. El turno del test aparece como un turno partido: la petición original, lo que se había hecho y lo que quedaba. Y al final, la lista de ficheros de la sesión, agrupados por carpeta y marcados como leídos o escritos. Además, una nota dice que las salidas de herramientas se entregaron como referencias artifact. Es la huella de barra shake.

Barra context lo remata: Messages baja de ocho mil cien a dos mil seiscientos. ¿Qué recibe ahora el modelo? Lo mismo que en Pi: el prompt de sistema, el resumen como un mensaje más, y los mensajes recientes. Si vuelves a compactar, oh my pi le pasa al modelo el resumen anterior junto con lo nuevo para que lo actualice. Cada pasada es otra oportunidad de perder un detalle.

Lo probamos con una pregunta: qué casos límite cubren ya los tests, sin ejecutar nada. Responde con los del resumen, treinta y nueve con noventa y nueve, cuarenta, cincuenta, y añade la validación de la entrada, pero marcada como inferencia, no reverificada. Es la actitud correcta: distingue lo que sabe por el resumen de lo que supone.

Remote usa la compactación del propio proveedor, cuando la ruta del modelo la ofrece: la de OpenAI en su API de Responses, la de Anthropic, o un servidor propio. Si falla, cae a un resumen local. Tiene una contrapartida honesta: con los carriles de OpenAI, lo que se guarda en tu fichero es un marcador, no un resumen legible. DeepSeek usa la API de completions, así que aquí no aplica.

Snapcompact es la idea más rara de oh my pi. No resume: imprime la historia antigua, en texto apretado, sobre imágenes con una fuente de píxeles, y el modelo las lee de vuelta. No llama a ningún modelo, no necesita clave ni red. Solo funciona con modelos que aceptan imágenes, y DeepSeek Flash las acepta, así que lo probamos.

Barra compact snapcompact. Y la respuesta es un aviso y un error: snapcompact no reduciría el contexto. Tiene razón. Acabamos de compactar con soft, la historia antigua es diminuta, y convertirla en imágenes costaría más que dejarla como texto. Es una herramienta para historias largas, no para sesiones recién compactadas. No admite foco, porque no hay resumen que orientar.

Y el coste que comparten todos, también shake: cambian el principio de la conversación. Recuerda el vídeo cuatro. La caché del proveedor sirve mientras el principio de la petición no cambia. Después de adelgazar, la siguiente petición se paga casi entera. Adelgaza cuando compense, no a cada rato.

**6 · Traspasar con barra handoff**

Seguimos trabajando. El caso que el modelo había marcado como inferencia, la validación, se lo pedimos: un test que compruebe que un subtotal negativo lanza TypeError. Lo añade, quita los valores negativos de la prueba genérica para no duplicar, y diecisiete de diecisiete. Antes del traspaso, barra session: apuntamos el identificador.

Barra handoff resume la sesión en un documento de traspaso. No es un resumen cualquiera: está pensado para que otra instancia del agente retome el trabajo, con el estado, las decisiones y los siguientes pasos. Admite foco, así que escribimos: barra handoff, céntrate en el estado de los tests y en lo que falta por hacer. Gasta modelo.

Abajo aparece generating handoff, con escape para cancelar. El documento no se escribe en pantalla mientras se genera. Al terminar, el transcript se reconstruye con un divisor nuevo, handed off, de catorce mil a nueve mil cuatrocientos, y dos avisos: la sesión se ha compactado dos veces, y context handed off and compacted in place.

Fíjate en lo de in place. Barra handoff no abre una sesión nueva. Guarda el documento como una compactación más, en el mismo fichero. Barra session lo confirma: el mismo identificador y la misma ruta. Lo que sí cambia son los recuentos: mensajes y tokens bajan, porque reflejan lo que queda vivo después del traspaso. Versiones anteriores sí abrían sesión aparte; puede que lo leas en guías antiguas.

¿Qué gana entonces frente a barra compact? El documento está escrito como un traspaso, y el modelo lo recibe marcado como el contexto de trabajo de una instancia anterior, no como instrucciones nuevas. Y la petición se hace con la misma clave de caché que tus turnos, así que aprovecha la caché. No funciona mientras el agente está respondiendo, y si cancelas no se guarda nada.

Handoff también está en la lista automática, en tercer lugar. Con el ajuste handoff save to disk, los traspasos automáticos se guardan además como un fichero markdown entre los artefactos de la sesión; los manuales, como el nuestro, no.

Y la pregunta de siempre: ¿esto sustituye a dejar las cosas escritas? No. Un traspaso es un resumen de un modelo, con los mismos riesgos que vimos en el vídeo tres. Lo que de verdad tiene que sobrevivir, el código, los tests, las decisiones, va al repositorio. De eso trata entero el vídeo veintitrés.

**7 · Preguntas laterales y contexto extendido**

A veces quieres preguntar algo sin que la pregunta se quede en la sesión. Para eso está barra by the way. Lanzamos un turno, que ejecute los tests y explique cada resultado en una línea, y con el turno en marcha preguntamos: qué ficheros hemos modificado hoy.

El turno termina con su tabla de diecisiete tests, y debajo, aparte, el panel de la pregunta lateral: solo test barra envio punto test punto js, sin commitear, con los casos de cuarenta euros y del subtotal negativo, y src intacto. Abajo, las teclas: ce para copiar, efe para una pregunta de seguimiento y escape para cerrar.

Pulsamos efe y preguntamos qué caso límite falta por probar. Se abre la hoja del historial: a la izquierda, el tema, y a la derecha, las dos preguntas con sus respuestas. Y la respuesta es buena: falta el subtotal cero, que es válido y paga cuatro noventa y cinco, y el caso de menos cero, que no lanza error. Material para el próximo test.

Ni la pregunta ni la respuesta entran en la conversación. Barra context lo confirma: Messages ha crecido por el turno de los tests, no por las preguntas laterales. El historial se guarda en una carpeta propia junto a la sesión y sobrevive si la retomas, pero no entra en las exportaciones.

Que no se quede en la sesión no significa que sea gratis. Cada pregunta lateral envía el contexto actual al proveedor, y la respuesta se paga. Úsala para dudas de verdad, no como chat paralelo. Y si la pregunta necesita trabajo de verdad, eso es barra tan, que veremos en el vídeo dieciséis.

El contexto extendido es otra cosa. Algunos modelos ofrecen dos ventanas, una estándar y otra mucho mayor, a veces con otro precio. Barra extended context on activa la grande, off vuelve a la estándar, y status te dice cómo está. En cámara solo lanzamos status, y responde: extended context is off.

Dos avisos. Primero, on y off guardan el ajuste en tu configuración, no solo en esta sesión. Segundo, una ventana mayor no es gratis aunque el modelo no cobre recargo: el umbral de compactación sube con ella, y cada petición puede llevar muchos más tokens. Antes de activarlo, pregúntate si no te bastaría con adelgazar.

**8 · Memoria entre sesiones**

Hasta ahora, todo vivía dentro de una sesión. Cuando abres otra, el modelo empieza de cero, salvo por tus ficheros de contexto. La memoria cambia eso: guarda lo aprendido y lo inyecta en sesiones futuras. Viene apagada. Se elige un backend en barra settings, o con el ajuste memory backend.

Hay tres principales. Local resume tus sesiones antiguas del proyecto al arrancar. Mnemopi guarda recuerdos en una base SQLite en tu máquina. Y Hindsight usa un servidor de memoria externo. Hay un cuarto, sharpshooter, que la documentación nombra sin explicar, así que no lo contamos.

Local trabaja en dos fases, en segundo plano, al arrancar. Primero, un modelo lee cada sesión pasada y extrae decisiones, restricciones, fallos resueltos y flujos que se repiten. Después, otra pasada lo consolida en un documento de memoria y un resumen corto que se inyecta al empezar cada sesión. Fíjate en el coste: todo eso usa modelo al arrancar, sin que escribas nada.

Para la demo usamos mnemopi, configurado fuera de cámara en el perfil demo con dos ajustes: no embeddings, para que busque solo por texto y no descargue un modelo de embeddings, y llm mode none, para que no llame a ningún modelo. Así, la memoria de hoy no cuesta nada.

Abrimos una sesión y miramos barra memory stats: un banco para la tienda, con cero memorias, y la base de datos dentro de la carpeta del perfil demo, no en tu configuración real. Le pedimos que use la herramienta retain para guardar un hecho: el límite de envío gratis es cuarenta euros y el caso exacto ya tiene test.

El modelo primero lee la documentación de la herramienta, en la dirección xd barra barra retain, porque es una de las herramientas que se descubren al usarlas. Luego llama a retain: una memoria guardada. Barra memory stats ya cuenta una memoria, con la fecha de la última.

Cerramos y abrimos otra sesión. Preguntamos cuál es el límite de envío gratis y si el caso de cuarenta euros tiene test, sin leer ficheros. Responde cuarenta euros y que sí tiene test. Y añade algo importante: que lo sabe por la memoria de una sesión anterior, que no es una verificación fresca, y que si queremos lo comprueba con npm test.

Barra memory view enseña exactamente lo que se ha inyectado. Arriba, las instrucciones que recibe el modelo: los recuerdos son conocimiento de fondo, no instrucciones del usuario, y el mensaje actual y la salida de las herramientas mandan sobre ellos. Debajo, el bloque memories.

Y aquí hay una sorpresa. Hay dos recuerdos, no uno. El nuestro, el de retain. Y otro que mnemopi guardó por su cuenta: el turno entero, con nuestra petición y la respuesta tal cual, incluida una errata del modelo. Es la retención automática, que viene activada. Guarda lo que pasa, no solo lo que le pides, y lo guarda sin corregir.

Si quieres búsqueda por significado, activa los embeddings; la variante de fábrica está pensada para inglés, y para recuerdos en castellano existe la multilingüe. Si dejas que mnemopi use modelo, gastará en cada consolidación. Hindsight, la opción de equipo, necesita un servidor y a veces un token, así que solo lo ves en diapositiva.

Barra memory tiene más subcomandos. Queue enseña lo pendiente de consolidar. Sync pide consolidar. Y clear, o reset, borra la memoria; con Hindsight no borra el banco del servidor. Clear nunca lo lanzamos en cámara.

Y el límite honesto, que la propia documentación subraya. La memoria es contexto heurístico, no la verdad del repositorio. Puede estar desfasada, y como acabas de ver, puede guardar cosas que no querías. Si contradice al código o a lo que tú dices, gana el código y ganas tú. Por eso nos gusta que el modelo ofreciera comprobarlo con los tests.

**9 · Repaso, práctica y cierre**

Repasemos. Barra context mide: categorías, espacio libre y la reserva para compactar. Las herramientas cuestan contexto en cada petición, y ahora sabes medirlo: de tres mil setecientos a mil cien con cuatro herramientas. oh my pi compacta solo con un umbral y recorriendo una lista de métodos. Barra shake adelgaza sin modelo y deja lo quitado recuperable.

Barra compact resume, con soft para un resumen local legible, remote para el del proveedor y snapcompact para archivar en imágenes, cuando hay historia que archivar. Barra handoff escribe un traspaso y compacta en el sitio, con el mismo identificador. Las preguntas laterales no ensucian la sesión, pero se pagan. Y la memoria lleva lo aprendido a la siguiente sesión, como pista, no como verdad.

La práctica: en tu perfil de pruebas, abre una sesión en un repositorio pequeño y mide con barra context antes de escribir nada. Trabaja unos turnos, mide otra vez y lanza barra shake. Compacta con soft y un foco concreto, y lee el resumen buscando un error. Termina con barra handoff y compara los dos documentos: qué conserva cada uno.

En el próximo vídeo, modelos, roles y razonamiento: cambiar de modelo a mitad de tarea, los roles como smol, slow o advisor, el esfuerzo de razonamiento, y cómo repartir el trabajo entre DeepSeek Flash, el barato, y DeepSeek V cuatro Pro, el que revisa. Nos vemos allí.

</details>

