// Descarga de vídeos para verlos sin conexión.
// Los nombres de caché son los mismos que usa public/sw.js: si cambias uno, cambia el otro.

export const CACHE_PAGINAS = 'csi-paginas-v1';
export const CACHE_VIDEOS = 'csi-videos-v1';

export interface VideoDescargable {
  id: string;
  titulo: string;
  /** URL absoluta del vídeo en el bucket. */
  url: string;
  /** Página de la guía, para que también abra sin conexión. */
  href: string;
  subtitulos?: string;
}

export interface Espacio {
  uso: number;
  cuota: number;
  libre: number;
}

export const soportado = () =>
  typeof window !== 'undefined' && 'caches' in window && 'serviceWorker' in navigator;

export function formatearBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 MB';
  const mb = bytes / 1024 ** 2;
  return mb >= 1024 ? `${(mb / 1024).toFixed(2).replace('.', ',')} GB` : `${Math.round(mb)} MB`;
}

export async function tamanoVideo(url: string): Promise<number | null> {
  try {
    const res = await fetch(url, { method: 'HEAD', mode: 'cors' });
    const n = Number(res.headers.get('content-length'));
    return res.ok && n > 0 ? n : null;
  } catch {
    return null;
  }
}

export async function urlsDescargadas(): Promise<Set<string>> {
  const cache = await caches.open(CACHE_VIDEOS);
  return new Set((await cache.keys()).map((r) => r.url));
}

export async function espacio(): Promise<Espacio | null> {
  if (!navigator.storage?.estimate) return null;
  const { usage = 0, quota = 0 } = await navigator.storage.estimate();
  return { uso: usage, cuota: quota, libre: Math.max(0, quota - usage) };
}

/** Pide al navegador que no purgue lo descargado cuando falte espacio. */
export async function pedirPersistencia(): Promise<boolean> {
  try {
    return (await navigator.storage?.persist?.()) ?? false;
  } catch {
    return false;
  }
}

/** La página de la guía, sus subtítulos y los ficheros /_astro/ que usa, para que abra sin red. */
async function guardarPagina(video: VideoDescargable, signal: AbortSignal) {
  const cache = await caches.open(CACHE_PAGINAS);
  const res = await fetch(video.href, { signal });
  if (!res.ok) return;
  const html = await res.clone().text();
  await cache.put(video.href, res);

  const extra = new Set<string>(video.subtitulos ? [video.subtitulos] : []);
  for (const m of html.matchAll(/(?:href|src)="(\/_astro\/[^"]+)"/g)) extra.add(m[1]);

  await Promise.allSettled(
    [...extra].map(async (ruta) => {
      if (await cache.match(ruta)) return;
      const r = await fetch(ruta, { signal });
      if (r.ok) await cache.put(ruta, r);
    })
  );
}

/**
 * Descarga un vídeo a la caché. Se aborta con `signal`; un vídeo a medias no queda guardado.
 * `onProgreso` recibe los bytes leídos hasta el momento y el total (0 si el servidor no lo dice).
 */
export async function descargarVideo(
  video: VideoDescargable,
  opciones: { signal: AbortSignal; onProgreso: (leidos: number, total: number) => void }
): Promise<void> {
  const { signal, onProgreso } = opciones;

  await guardarPagina(video, signal).catch((e) => {
    if (signal.aborted) throw e;
  });

  const res = await fetch(video.url, { mode: 'cors', signal });
  if (!res.ok || !res.body) throw new Error(`El servidor respondió ${res.status}`);

  const total = Number(res.headers.get('content-length')) || 0;
  const lector = res.body.getReader();
  let leidos = 0;
  const flujo = new ReadableStream<Uint8Array>({
    async pull(control) {
      const { done, value } = await lector.read();
      if (done) return control.close();
      leidos += value.byteLength;
      onProgreso(leidos, total);
      control.enqueue(value);
    },
    cancel: (motivo) => lector.cancel(motivo),
  });

  const cache = await caches.open(CACHE_VIDEOS);
  try {
    await cache.put(
      video.url,
      new Response(flujo, {
        status: 200,
        headers: {
          'Content-Type': res.headers.get('content-type') ?? 'video/mp4',
          ...(total ? { 'Content-Length': String(total) } : {}),
        },
      })
    );
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      throw new Error('No queda espacio en el dispositivo para este vídeo.');
    }
    throw e;
  }
}

export async function borrarVideo(url: string): Promise<void> {
  const cache = await caches.open(CACHE_VIDEOS);
  await cache.delete(url, { ignoreVary: true });
}
