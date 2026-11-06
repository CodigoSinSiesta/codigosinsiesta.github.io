// Service worker de Código Sin Siesta.
//
// - Sitio: al instalarse guarda TODAS las páginas y recursos (la lista la genera scripts/build-sw.mjs
//   tras el build), así que se navega sin conexión aunque no se haya visitado antes cada página.
// - Vídeos: solo se guardan cuando el usuario los descarga desde /descargas (ver src/lib/offline.ts,
//   que comparte el nombre de caché). Aquí solo se SIRVEN, resolviendo las peticiones Range.
//
// Este dominio también aloja otros despliegues (/tecnoboletin/, decks...). Por eso solo se
// intercepta lo que pertenece a este sitio; el resto pasa de largo.

// Estas dos líneas las reescribe scripts/build-sw.mjs en dist/sw.js; en bruto valen para desarrollo.
const VERSION = 'dev';
const PRECACHE = [];

const PAGINAS = 'csi-paginas-v1';
const VIDEOS = 'csi-videos-v1';

const PREFIJOS_PAGINA = ['/rutas', '/ensayos', '/talleres', '/descargas'];
// /_astro/ lleva hash en el nombre (inmutable); el resto puede cambiar sin cambiar de URL.
const PREFIJOS_INMUTABLES = ['/_astro/'];
const PREFIJOS_REVALIDAR = ['/icons/', '/subtitulos/', '/pagefind/', '/favicon.svg', '/manifest.webmanifest'];
const TIEMPO_RED_MS = 4000;
const PARALELO = 8;

self.addEventListener('install', (event) => {
  event.waitUntil(precachear().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Lo que ya no está en el sitio (páginas retiradas, restos de versiones anteriores) sobra.
      // La caché de vídeos no se toca nunca.
      const vigentes = new Set(PRECACHE);
      const cache = await caches.open(PAGINAS);
      for (const peticion of await cache.keys()) {
        const { pathname } = new URL(peticion.url);
        if (PRECACHE.length > 0 && !vigentes.has(pathname)) await cache.delete(peticion);
      }
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // Vídeo de otro origen (el bucket): lo servimos desde la caché solo si está descargado.
  if (request.destination === 'video' && url.origin !== self.location.origin) {
    event.respondWith(servirVideo(request));
    return;
  }

  if (url.origin !== self.location.origin) return;

  if (PREFIJOS_INMUTABLES.some((p) => url.pathname.startsWith(p))) {
    event.respondWith(cachePrimero(request));
    return;
  }
  if (PREFIJOS_REVALIDAR.some((p) => url.pathname.startsWith(p))) {
    event.respondWith(revalidar(request, event));
    return;
  }

  const esPagina =
    url.pathname === '/' || PREFIJOS_PAGINA.some((p) => url.pathname === p || url.pathname.startsWith(`${p}/`));
  if (request.mode === 'navigate' && esPagina) {
    // Las páginas se guardan con barra final (así las sirve Pages); /rutas/x pasa a /rutas/x/.
    const ultimo = url.pathname.split('/').pop() ?? '';
    if (!url.pathname.endsWith('/') && !ultimo.includes('.')) {
      event.respondWith(Response.redirect(`${url.origin}${url.pathname}/${url.search}`, 302));
      return;
    }
    event.respondWith(redPrimero(request));
  }
});

// Guarda todo el sitio. Es todo o nada: si algo falla (p. ej. se corta la red a medias), la instalación
// se rechaza y el navegador la reintenta en la siguiente visita, sin dejar una copia a medias.
async function precachear() {
  if (PRECACHE.length === 0) return;
  const cache = await caches.open(PAGINAS);
  const pendientes = [];
  for (const ruta of PRECACHE) {
    // Los ficheros con hash no cambian: no se vuelven a bajar en cada despliegue.
    if (ruta.startsWith('/_astro/') && (await cache.match(ruta))) continue;
    pendientes.push(ruta);
  }
  for (let i = 0; i < pendientes.length; i += PARALELO) {
    await Promise.all(
      pendientes.slice(i, i + PARALELO).map(async (ruta) => {
        const respuesta = await fetch(ruta, { cache: 'reload' });
        // Una respuesta que viene de una redirección no se puede servir como página.
        if (!respuesta.ok || respuesta.redirected) throw new Error(`${ruta}: ${respuesta.status}`);
        await cache.put(ruta, respuesta);
      })
    );
  }
}

async function cachePrimero(request) {
  const cache = await caches.open(PAGINAS);
  const guardada = await cache.match(request);
  if (guardada) return guardada;
  const respuesta = await fetch(request);
  if (respuesta.ok) cache.put(request, respuesta.clone());
  return respuesta;
}

// Sirve lo guardado al instante y actualiza la copia en segundo plano.
async function revalidar(request, event) {
  const cache = await caches.open(PAGINAS);
  const guardada = await cache.match(request);
  const actualizada = fetch(request)
    .then((res) => {
      if (res.ok) cache.put(request, res.clone());
      return res;
    })
    .catch(() => undefined);
  if (guardada) {
    event.waitUntil(actualizada);
    return guardada;
  }
  return (await actualizada) ?? Response.error();
}

async function redPrimero(request) {
  const cache = await caches.open(PAGINAS);
  const { pathname } = new URL(request.url);
  try {
    const respuesta = await Promise.race([
      fetch(request),
      new Promise((_, rechazar) => setTimeout(() => rechazar(new Error('lento')), TIEMPO_RED_MS)),
    ]);
    if (respuesta.ok && !respuesta.redirected) cache.put(pathname, respuesta.clone());
    return respuesta;
  } catch {
    // Sin red (o red muy lenta): la copia guardada; si esa página no existe, el aviso de «no encontrada».
    return (await cache.match(pathname)) ?? (await cache.match('/404.html')) ?? Response.error();
  }
}

async function servirVideo(request) {
  const cache = await caches.open(VIDEOS);
  const guardado = await cache.match(request.url, { ignoreVary: true });
  if (!guardado) return fetch(request);
  return responderRango(request, guardado);
}

// <video> pide el fichero por trozos (Range) y la Cache API no los resuelve sola.
async function responderRango(request, completa) {
  const cabecera = request.headers.get('range');
  const m = cabecera && /^bytes=(\d*)-(\d*)$/.exec(cabecera);
  if (!m) return completa;

  const blob = await completa.blob();
  const total = blob.size;
  let inicio;
  let fin;
  if (m[1] === '') {
    inicio = Math.max(0, total - Number(m[2]));
    fin = total - 1;
  } else {
    inicio = Number(m[1]);
    fin = m[2] ? Math.min(Number(m[2]), total - 1) : total - 1;
  }
  if (inicio >= total || inicio > fin) {
    return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${total}` } });
  }
  return new Response(blob.slice(inicio, fin + 1), {
    status: 206,
    headers: {
      'Content-Type': completa.headers.get('Content-Type') || 'video/mp4',
      'Content-Range': `bytes ${inicio}-${fin}/${total}`,
      'Content-Length': String(fin - inicio + 1),
      'Accept-Ranges': 'bytes',
    },
  });
}
