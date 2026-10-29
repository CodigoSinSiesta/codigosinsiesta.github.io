// Service worker de Código Sin Siesta.
//
// - Páginas y recursos propios: se guardan al visitarlos y se sirven sin conexión.
// - Vídeos: solo se guardan cuando el usuario los descarga desde /descargas (ver src/lib/offline.ts,
//   que comparte los nombres de caché). Aquí solo se SIRVEN, resolviendo las peticiones Range.
//
// Este dominio también aloja otros despliegues (/tecnoboletin/, decks...). Por eso solo se
// intercepta lo que pertenece a este sitio; el resto pasa de largo.

const PAGINAS = 'csi-paginas-v1';
const VIDEOS = 'csi-videos-v1';

const PREFIJOS_PAGINA = ['/rutas', '/ensayos', '/talleres', '/descargas'];
const PREFIJOS_ESTATICOS = ['/_astro/', '/icons/', '/subtitulos/', '/favicon.svg', '/manifest.webmanifest'];
const TIEMPO_RED_MS = 4000;

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PAGINAS);
      // Mejor esfuerzo: que falle uno no debe impedir instalar el worker.
      await Promise.allSettled(['/', '/descargas', '/favicon.svg'].map((u) => cache.add(u)));
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Las cachés de páginas de versiones anteriores sobran; la de vídeos no se toca nunca.
      for (const nombre of await caches.keys()) {
        if (nombre.startsWith('csi-paginas-') && nombre !== PAGINAS) await caches.delete(nombre);
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

  if (PREFIJOS_ESTATICOS.some((p) => url.pathname.startsWith(p))) {
    event.respondWith(cachePrimero(request));
    return;
  }

  const esPagina = url.pathname === '/' || PREFIJOS_PAGINA.some((p) => url.pathname.startsWith(p));
  if (request.mode === 'navigate' && esPagina) {
    event.respondWith(redPrimero(request));
  }
});

async function cachePrimero(request) {
  const cache = await caches.open(PAGINAS);
  const guardada = await cache.match(request);
  if (guardada) return guardada;
  const respuesta = await fetch(request);
  if (respuesta.ok) cache.put(request, respuesta.clone());
  return respuesta;
}

async function redPrimero(request) {
  const cache = await caches.open(PAGINAS);
  try {
    const respuesta = await Promise.race([
      fetch(request),
      new Promise((_, rechazar) => setTimeout(() => rechazar(new Error('lento')), TIEMPO_RED_MS)),
    ]);
    if (respuesta.ok) cache.put(request, respuesta.clone());
    return respuesta;
  } catch {
    return (
      (await cache.match(request, { ignoreSearch: true })) ??
      (await cache.match('/descargas')) ??
      Response.error()
    );
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
