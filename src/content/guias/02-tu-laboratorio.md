---
title: "Vídeo 02 · Tu laboratorio: un sitio donde equivocarte"
description: "Por qué un agente sin aislar es arriesgado y cómo abrir el laboratorio, en tu ordenador o en Codespaces, comprobar que no ve tu máquina y tirarlo y volver a empezar."
ruta: "ia-desde-cero"
orden: 2
duracion: "8 min"
video: "02-tu-laboratorio.mp4"
subtitulos: "/subtitulos/ia-desde-cero/02-tu-laboratorio.es.vtt"
---

Por qué un agente sin aislar es arriesgado y cómo abrir el laboratorio, en tu ordenador o en Codespaces, comprobar que no ve tu máquina y tirarlo y volver a empezar.

<p class="guia__nota">Dura 8 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

## Resumen por capítulos

### 1 · Un agente hace cosas de verdad

<p><button type="button" class="ir-a" data-t="18">▶ Ir a 0:18</button></p>

- **Un agente:** Ahora le damos manos al modelo — Lee tus ficheros, los cambia y ejecuta comandos en tu ordenador
- **Las llaves de tu casa**
  - `casi siempre` · Te ordena el salón: capaz, rápido y con iniciativa
  - `un día` · Se equivoca: y lo hace con tus llaves
- **La regla de la ruta:** Todas las prácticas, dentro del laboratorio — Nunca en tu ordenador directamente, y nunca con código de tu empresa

### 2 · Una caja con su propio sistema

<p><button type="button" class="ir-a" data-t="90">▶ Ir a 1:30</button></p>

- **Una sola ventana**
  - `se comparte` · La carpeta del proyecto: lo que cambie el agente lo ves también fuera
  - `no entra` · Todo lo demás: se queda al otro lado
- **Un usuario sin privilegios**
  - `01` · No es administrador: ni puede llegar a serlo
  - `02` · No instala en el sistema: ni lo deja roto para siempre
  - `03` · Se tira y se crea otra: si algo sale mal

### 3 · Abrir el laboratorio en tu ordenador

<p><button type="button" class="ir-a" data-t="153">▶ Ir a 2:33</button></p>


### 4 · Comprobar la caja

<p><button type="button" class="ir-a" data-t="218">▶ Ir a 3:38</button></p>

- **Comprobar la caja:** No te fíes: compruébalo — Cuatro órdenes, la primera vez que abras el laboratorio
- **Al revés: el agente con todo aprobado**
  - `le pedimos` · Administrador y /etc: aprobándole todo automáticamente
  - `no pudo` · Lo frenó la caja: no el agente

### 5 · Si no puedes instalar nada: Codespaces

<p><button type="button" class="ir-a" data-t="285">▶ Ir a 4:45</button></p>

- **Otra opción:** Si ya tienes Copilot, también vale — Desde OpenCode te conectas a Copilot y usas sus modelos
- **En Codespaces, dentro sí hay secretos**
  - `secreto` · Tu clave de NVIDIA: o tu sesión de Copilot
  - `secreto` · El permiso de GitHub: para escribir en tu repositorio
  - `al terminar` · Borra el codespace: el agente puede leerlos

### 6 · Tirar y volver a empezar

<p><button type="button" class="ir-a" data-t="379">▶ Ir a 6:19</button></p>

- **Lo más importante:** Se puede romper sin miedo — El proyecto se devuelve a como estaba; la caja se tira y se crea otra
- **Si se estropea la caja**
  - `en tu ordenador` · Rebuild Container: se crea de nuevo, idéntica
  - `en Codespaces` · Borra y abre otro: desde la plantilla

### 7 · Antes de la primera pregunta

<p><button type="button" class="ir-a" data-t="429">▶ Ir a 7:09</button></p>

- **Lo que escribes viaja al proveedor**
  - `01` · Sale de la caja: todo lo que le escribes
  - `02` · Unos no guardan nada: según lo que dicen
  - `03` · Otros pueden usarlo: para mejorar sus modelos
- **La regla, en dos partes**
  - `01` · Todo en el laboratorio: todas las prácticas, ahí dentro
  - `02` · Solo el proyecto de prácticas: nunca código de tu empresa, secretos ni datos personales

## Fuentes

- El [laboratorio de la ruta](https://github.com/CodigoSinSiesta/empieza-aqui-laboratorio): el dev container, su `README` y el `opencode.json` con los permisos en «preguntar».
- [permisos de OpenCode](https://opencode.ai/v2/docs/permissions/): qué hace OpenCode por defecto (lo permite todo salvo leer `.env`).
- [Dev Containers](https://containers.dev/) y [GitHub Codespaces](https://docs.github.com/es/codespaces): las dos formas de abrir la caja.
- [build.nvidia.com](https://build.nvidia.com/) y [GitHub Copilot](https://github.com/features/copilot): los proveedores para Codespaces.
- Las comprobaciones que se ven en pantalla se hicieron de verdad, en local y en Codespaces, el 2 de noviembre de 2026.

## Transcripción

<details>
<summary>Ver la transcripción de la locución</summary>

Texto de la locución tal como se dice en el vídeo (los símbolos se leen en voz alta: «punto md» es <code>.md</code>).

**1 · Un agente hace cosas de verdad**

En el vídeo anterior vimos que un modelo de lenguaje completa texto y que se equivoca con la misma seguridad con la que acierta. Ahora vamos a darle manos. Un agente de programación es un programa que rodea al modelo y le deja leer tus ficheros, cambiarlos y ejecutar comandos en tu ordenador.

Piensa en dejarle las llaves de tu casa a alguien muy capaz, muy rápido y con mucha iniciativa, que de vez en cuando se inventa cosas con total seguridad. La mayoría de las veces te ordenará el salón. Pero si un día se equivoca, lo hará con tus llaves.

Y eso es justo lo que pasa con OpenCode tal como viene. Por defecto, ejecuta comandos, edita ficheros y sale de la carpeta del proyecto sin preguntarte. Lo único que pregunta, de serie, es antes de leer un fichero de configuración con secretos. Su propia documentación lo dice: los comandos se ejecutan con todos los permisos de tu usuario.

Así que, antes de la primera pregunta, vamos a construir un sitio donde equivocarse no cueste nada. Lo llamaremos el laboratorio, y la regla de esta ruta es sencilla: todas las prácticas se hacen ahí dentro. Nunca en tu ordenador directamente, y nunca con código de tu empresa.

**2 · Una caja con su propio sistema**

El laboratorio es un contenedor. Imagina una caja que tiene dentro su propio sistema operativo, sus propios programas y su propio usuario. Lo que pasa dentro de la caja se queda dentro de la caja: el agente no ve tus documentos, ni tus claves, ni el resto de tu ordenador.

Solo hay una ventana entre la caja y tu ordenador: la carpeta del proyecto. Lo que el agente cambie ahí lo verás también fuera, porque es justo con lo que vas a trabajar. Todo lo demás se queda al otro lado.

Además, dentro de la caja el agente trabaja con un usuario sin privilegios. No puede hacerse administrador, ni instalar nada en el sistema, ni dejarlo en un estado del que no se vuelve. Si algo sale mal, se tira la caja y se crea otra igual.

Esa caja puede estar en tu ordenador o en la nube. Si puedes instalar programas, la tendrás en tu ordenador. Si no, GitHub te deja abrir la misma caja en una máquina suya, desde el navegador. A eso lo llama un codespace. Las dos son el mismo laboratorio; cambia dónde corre y qué modelo usa el agente.

**3 · Abrir el laboratorio en tu ordenador**

Empecemos por la vía recomendada, la de tu ordenador. Necesitas tres cosas: Docker Desktop, que es el programa que crea las cajas, Visual Studio Code y su extensión Dev Containers. Si usas Windows, Docker te pedirá activar una vez un componente del sistema, y para eso hacen falta permisos de administrador.

Con eso instalado, clonas el repositorio del laboratorio, lo abres en Visual Studio Code y eliges «Reopen in Container». La primera vez tarda un poco: descarga la imagen, crea la caja e instala OpenCode dentro.

Cuando termina verás dos mensajes. El primero dice «Comprobado: sin sudo», y significa que el usuario de la caja no puede hacerse administrador. El segundo dice «Laboratorio listo». En la terminal escribes opencode guion guion version, y te responde con la versión que fija el laboratorio.

En esta vía, el agente usa los modelos gratuitos de OpenCode. No hace falta cuenta, ni clave, ni tarjeta: el laboratorio arranca y ya puedes trabajar. Y como no hay ninguna clave, dentro de la caja no hay ningún secreto que proteger.

**4 · Comprobar la caja**

No te fíes de lo que te cuento: compruébalo. Son cuatro órdenes, y te aconsejo hacerlas la primera vez que abras el laboratorio.

La primera, who am i, te dice con qué usuario trabajas: node, un usuario normal, sin privilegios.

La segunda intenta hacerse administrador con sudo. Y falla. El mensaje dice que la bandera «no new privileges» está activada y que eso impide ejecutar sudo como administrador. Esa bandera es la que pone el laboratorio, y ningún programa de dentro de la caja puede quitarla.

La tercera busca las carpetas de tu ordenador. En un Mac, tus ficheros cuelgan de una carpeta llamada Users. Dentro de la caja esa carpeta no existe: el agente no puede leer lo que no ve.

Y la cuarta, ene pe eme test, ejecuta las pruebas del proyecto de juguete, una lista de la compra. Pasan las dos. Lo hicimos también al revés: le pedimos al agente que intentara hacerse administrador y escribir en las carpetas del sistema, aprobándole todo automáticamente. No pudo. Lo que lo frenó no fue el agente, fue la caja.

**5 · Si no puedes instalar nada: Codespaces**

Si no puedes instalar Docker, por ejemplo en un ordenador del trabajo, tienes la segunda vía: Codespaces. Desde la página del laboratorio en GitHub eliges «Use this template» y luego «Open in a codespace». Con una cuenta gratuita de GitHub tienes una cuota de horas cada mes.

La caja es la misma, y las comprobaciones dan lo mismo: usuario node, sudo bloqueado y nada de tu ordenador a la vista. De hecho, aquí ni siquiera corre en tu ordenador.

Pero hay una diferencia importante. Desde Codespaces, los modelos gratuitos de OpenCode llegan con el tope agotado: en nuestras pruebas respondieron que se había alcanzado el límite gratuito a la primera petición. Así que en esta vía usamos otro proveedor gratuito.

El que hemos probado es NVIDIA. Te creas una cuenta en build punto nvidia punto com, verificas tu teléfono y generas una clave gratuita. Esa clave la guardas en GitHub como un secreto de Codespaces llamado NVIDIA underscore API underscore KEY. Así entra en la caja sin escribirla nunca en el repositorio. Dentro, eliges el modelo Laguna XS dos punto uno, que funciona bien para programar.

Y si ya tienes GitHub Copilot, también vale: desde OpenCode te conectas a Copilot y usas sus modelos.

Ten en cuenta una cosa. En esta vía, dentro de la caja sí hay secretos: tu clave de NVIDIA o tu sesión de Copilot, y el permiso que GitHub da al codespace para escribir en tu repositorio. El agente puede leerlos. Por eso, al terminar, conviene borrar el codespace.

**6 · Tirar y volver a empezar**

Y llegamos a lo más importante del laboratorio: se puede romper sin miedo. Si el agente deja el proyecto hecho un lío, lo devuelves a como estaba. Si la caja entera se estropea, la tiras y creas otra.

Cada guía de esta ruta tiene su rama en el repositorio: guía cero dos, guía cero tres, y así hasta la diez. Para dejar una guía como al principio, cambias a su rama y la devuelves al estado del repositorio con git reset guion guion hard.

Si lo que se ha estropeado es la caja, en tu ordenador eliges «Rebuild Container» y se crea de nuevo, idéntica. En Codespaces, borras el codespace y abres otro desde la plantilla.

Acostúmbrate a hacerlo. No es un fracaso, es la forma normal de trabajar con agentes: probar, ver qué pasa y, si no te gusta, volver atrás.

**7 · Antes de la primera pregunta**

Una última cosa antes de hablar con el agente. Todo lo que le escribes viaja al proveedor del modelo. Con los modelos gratuitos, algunos proveedores dicen que no guardan nada, y otros pueden usar lo que les envías para mejorar sus modelos.

Por eso, la regla de la ruta tiene dos partes. Todas las prácticas se hacen en el laboratorio. Y en el laboratorio solo va el proyecto de prácticas: nunca código de tu empresa, ni secretos, ni datos personales.

Te propongo la práctica de este vídeo. Abre el laboratorio, por la vía que te encaje, y haz las cuatro comprobaciones: con qué usuario trabajas, que sudo falla, que no ves las carpetas de tu ordenador y que las pruebas pasan. Después, tíralo y vuelve a crearlo.

En el próximo vídeo abrimos OpenCode por primera vez: qué hay en la pantalla, cómo elegir el modelo y cómo se le pide algo. Nos vemos allí.

</details>

