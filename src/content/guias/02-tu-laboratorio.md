---
title: "Vídeo 02 · Tu laboratorio: un sitio donde equivocarte"
description: "Por qué un agente sin aislar es arriesgado y cómo abrir el laboratorio, en tu ordenador o en Codespaces, comprobar que no ve tu máquina y tirarlo y volver a empezar."
ruta: "ia-desde-cero"
orden: 2
duracion: "8 min"
video: "02-tu-laboratorio.mp4"
subtitulos: "/subtitulos/ia-desde-cero/02-tu-laboratorio.es.vtt"
---

Un agente lee, cambia y ejecuta cosas en tu ordenador, y OpenCode, tal como viene, lo hace sin preguntar. Antes de la primera pregunta montamos el laboratorio: un contenedor aislado de tu máquina, en tu ordenador o en GitHub Codespaces. Comprobamos con cuatro órdenes que no ve nada tuyo, vemos qué secretos sí hay dentro en cada vía y aprendemos a tirarlo y volver a empezar.

<p class="guia__nota">Dura 8 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

## Resumen por capítulos

### 1 · Un agente hace cosas de verdad

<p><button type="button" class="ir-a" data-t="18">▶ Ir a 0:18</button></p>

- **Agente de programación:** un programa que rodea al modelo y le deja leer tus ficheros, cambiarlos y ejecutar comandos en tu ordenador. Es como dejarle las llaves de casa a alguien muy capaz y con iniciativa que de vez en cuando se inventa cosas: casi siempre te ordena el salón, pero si un día se equivoca, lo hace con tus llaves.
- **OpenCode, de serie, no pregunta:** ejecuta comandos, edita ficheros y sale de la carpeta del proyecto sin pedir permiso. Lo único que pregunta es antes de leer un fichero de secretos (`.env`). Su documentación lo avisa: los comandos se ejecutan con todos los permisos de tu usuario.
- **La regla de la ruta:** todas las prácticas se hacen dentro del laboratorio. Nunca en tu ordenador directamente, y nunca con código de tu empresa.

### 2 · Una caja con su propio sistema

<p><button type="button" class="ir-a" data-t="90">▶ Ir a 1:30</button></p>

- **Contenedor:** una caja con su propio sistema operativo, sus propios programas y su propio usuario. Lo que pasa dentro se queda dentro: el agente no ve tus documentos, ni tus claves, ni el resto de tu ordenador.
- **Una sola ventana:** la carpeta del proyecto se comparte, así que lo que cambie el agente ahí lo ves también fuera. Todo lo demás se queda al otro lado.
- **Un usuario sin privilegios:** dentro, el agente no puede hacerse administrador, ni instalar nada en el sistema, ni dejarlo en un estado sin vuelta atrás. Si algo sale mal, se tira la caja y se crea otra igual.
- **Dos sitios para la misma caja:** en tu ordenador, si puedes instalar programas, o en una máquina de GitHub desde el navegador, lo que GitHub llama un *codespace*. Es el mismo laboratorio; cambia dónde corre y qué modelo usa el agente.

### 3 · Abrir el laboratorio en tu ordenador

<p><button type="button" class="ir-a" data-t="153">▶ Ir a 2:33</button></p>

- **Lo que necesitas:** Docker Desktop (el programa que crea las cajas), Visual Studio Code y su extensión Dev Containers. En Windows, Docker pide activar una vez un componente del sistema (WSL2), y para eso hacen falta permisos de administrador.
- **Abrirlo:** clona el repositorio del laboratorio, ábrelo en VS Code y elige «Reopen in Container». La primera vez tarda un poco: descarga la imagen, crea la caja e instala OpenCode dentro.
- **Cómo sabes que está listo:** salen dos mensajes, «Comprobado: sin sudo» (el usuario de la caja no puede hacerse administrador) y «Laboratorio listo». `opencode --version` responde con la versión que fija el laboratorio.
- **El modelo:** en esta vía, los gratuitos de OpenCode, sin cuenta, clave ni tarjeta. Y como no hay clave, dentro de la caja no hay ningún secreto que proteger.

### 4 · Comprobar la caja

<p><button type="button" class="ir-a" data-t="218">▶ Ir a 3:38</button></p>

- **No te fíes: compruébalo.** Cuatro órdenes para la primera vez que abras el laboratorio (las tienes en «Código y comandos»):
  1. `whoami` responde `node`: un usuario normal, sin privilegios.
  2. `sudo -n true` falla: la bandera *no new privileges*, que pone el laboratorio, impide ejecutar sudo como administrador, y ningún programa de dentro de la caja puede quitarla.
  3. `ls /Users` no encuentra la carpeta: en un Mac tus ficheros cuelgan de ella, y dentro de la caja no existe. El agente no puede leer lo que no ve.
  4. `npm test` pasa las dos pruebas del proyecto de juguete, una lista de la compra.
- **Al revés, con todo aprobado:** le pedimos al agente que intentara hacerse administrador y escribir en las carpetas del sistema, aprobándole todo automáticamente. No pudo. Lo que lo frenó no fue el agente, fue la caja.

### 5 · Si no puedes instalar nada: Codespaces

<p><button type="button" class="ir-a" data-t="285">▶ Ir a 4:45</button></p>

- **Sin instalar nada:** desde la página del laboratorio en GitHub, «Use this template» y luego «Open in a codespace». Con una cuenta gratuita de GitHub tienes una cuota de horas cada mes. La caja es la misma y las comprobaciones dan lo mismo; aquí, además, ni siquiera corre en tu ordenador.
- **Los gratuitos de OpenCode no sirven aquí:** en nuestras pruebas, desde Codespaces respondieron a la primera petición que se había alcanzado el límite gratuito. Por eso esta vía usa otro proveedor gratuito.
- **NVIDIA, el que hemos probado:** te creas una cuenta en build.nvidia.com, verificas tu teléfono y generas una clave gratuita. La guardas en GitHub como secreto de Codespaces llamado `NVIDIA_API_KEY`: así entra en la caja como variable de entorno sin escribirla nunca en el repositorio. Dentro, eliges con `/models` el modelo `nvidia/poolside/laguna-xs-2.1` (Laguna XS 2.1), que funciona bien para programar.
- **Si ya tienes GitHub Copilot:** en OpenCode escribes `/connect`, eliges GitHub Copilot y usas sus modelos.
- **En esta vía sí hay secretos dentro:** tu clave de NVIDIA o tu sesión de Copilot, y el permiso que GitHub da al codespace para escribir en tu repositorio. El agente puede leerlos, así que al terminar conviene borrar el codespace.

### 6 · Tirar y volver a empezar

<p><button type="button" class="ir-a" data-t="379">▶ Ir a 6:19</button></p>

- **Se puede romper sin miedo:** si el agente deja el proyecto hecho un lío, lo devuelves a como estaba; si la caja entera se estropea, la tiras y creas otra.
- **El proyecto:** cada guía tiene su rama en el repositorio (`guia-02`, `guia-03`…). Para dejar una guía como al principio, cambias a su rama y la devuelves al estado del repositorio con `git reset --hard` (en «Código y comandos»).
- **La caja:** en tu ordenador, «Rebuild Container» la crea de nuevo, idéntica. En Codespaces, borras el codespace y abres otro desde la plantilla.
- **Acostúmbrate:** no es un fracaso, es la forma normal de trabajar con agentes. Probar, ver qué pasa y, si no te gusta, volver atrás.

### 7 · Antes de la primera pregunta

<p><button type="button" class="ir-a" data-t="429">▶ Ir a 7:09</button></p>

- **Lo que escribes sale de la caja:** viaja al proveedor del modelo. Con los modelos gratuitos, algunos proveedores dicen que no guardan nada y otros pueden usar lo que les envías para mejorar sus modelos (en el vídeo 03 ves dónde comprobarlo).
- **La regla, en dos partes:** todas las prácticas, en el laboratorio; y en el laboratorio, solo el proyecto de prácticas. Nunca código de tu empresa, ni secretos, ni datos personales.
- **Práctica:** abre el laboratorio por la vía que te encaje y haz las cuatro comprobaciones: con qué usuario trabajas, que sudo falla, que no ves las carpetas de tu ordenador y que las pruebas pasan. Después, tíralo y vuelve a crearlo.

**Siguiente:** [Vídeo 03 · Cómo funciona OpenCode](/rutas/ia-desde-cero/03-como-funciona-opencode)

## Código y comandos

Lo que aparece en las ventanas de terminal del vídeo, para copiarlo en la terminal del laboratorio.

### Comprobar la caja

```bash
opencode --version   # la versión que fija el laboratorio
whoami               # node
sudo -n true         # falla: The "no new privileges" flag is set…
ls /Users            # No such file or directory
npm test             # pasan las dos pruebas (# fail 0)
```

- `sudo -n`: no pide contraseña; si no puede subir a administrador, falla al momento.
- Lo que va detrás de `#` es lo que debería responder cada orden; no hace falta copiarlo.

### Volver a empezar una guía

```bash
git checkout guia-03
git reset --hard origin/guia-03
```

- Cambia `03` por el número de la guía.
- `reset --hard origin/guia-03` deja la rama exactamente como en el repositorio: descarta tus cambios y tus commits locales. Aquí es lo que quieres; fuera del laboratorio, piénsalo dos veces.

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

