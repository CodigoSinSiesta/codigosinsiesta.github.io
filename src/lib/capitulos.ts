import type { MarkdownHeading } from 'astro';

// Capítulos de una guía con vídeo: cada «### N · título» del resumen seguido de su botón «Ir a» (data-t).
// Lo usan la página de la guía, el glosario y la ruta corta, así que el formato se lee en un solo sitio.
export interface Capitulo {
  // Número del capítulo («6» en «### 6 · La compactación»); null si el título no lo lleva.
  n: number | null;
  titulo: string;
  // Título sin el número («La compactación»).
  nombre: string;
  // Segundo del vídeo en que empieza.
  t: number;
  etiqueta: string;
  // Id del encabezado en la página de la guía.
  slug?: string;
}

export const mmss = (t: number) => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;

export function capitulosDeGuia(body: string, headings: MarkdownHeading[]): Capitulo[] {
  return [...body.matchAll(/^###\s+(.+?)\s*\n+<p><button[^>]*data-t="(\d+)"/gm)].map(([, titulo, t]) => {
    const m = titulo.match(/^(\d+)\s*·\s*(.+)$/);
    return {
      n: m ? Number(m[1]) : null,
      titulo,
      nombre: m ? m[2] : titulo,
      t: Number(t),
      etiqueta: mmss(Number(t)),
      slug: headings.find((h) => h.depth === 3 && h.text === titulo)?.slug,
    };
  });
}

// «22 min» → 22. El campo `duracion` de las guías es aproximado y va en minutos.
export const minutosDe = (duracion: string) => parseFloat(duracion) || 0;

// 138 → «2 h 18 min».
export const horasYMinutos = (min: number) => {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return h ? `${h} h${m ? ` ${m} min` : ''}` : `${m} min`;
};
