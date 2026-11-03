import { getCollection, render, type CollectionEntry } from 'astro:content';
import { capitulosDeGuia, type Capitulo } from './capitulos';

// Índice de las guías de una ruta con sus capítulos, para que el glosario y la ruta corta
// enlacen a un capítulo concreto sin copiar a mano minutos ni anclas.
export interface GuiaIndexada {
  guia: CollectionEntry<'guias'>;
  capitulos: Capitulo[];
}

export async function indexarGuias(ruta: string): Promise<Map<string, GuiaIndexada>> {
  const guias = await getCollection('guias', (g) => g.data.ruta === ruta);
  const indice = new Map<string, GuiaIndexada>();
  for (const guia of guias) {
    const { headings } = await render(guia);
    indice.set(guia.id, { guia, capitulos: capitulosDeGuia(guia.body ?? '', headings) });
  }
  return indice;
}

export const numeroVideo = (orden: number) => String(orden).padStart(2, '0');

export const hrefGuia = (guia: CollectionEntry<'guias'>) => `/rutas/${guia.data.ruta}/${guia.id}`;

export function guiaDe(indice: Map<string, GuiaIndexada>, id: string, quien: string): GuiaIndexada {
  const g = indice.get(id);
  if (!g) throw new Error(`${quien} cita la guía «${id}», que no existe en esta ruta`);
  return g;
}

export interface CapituloEnlazado {
  // /rutas/<ruta>/<guia>?t=SEGUNDOS#ancla-del-capitulo: la guía abre en el capítulo y deja el vídeo en su minuto.
  href: string;
  video: string;
  tituloGuia: string;
  capitulo: Capitulo;
}

export function enlaceCapitulo(
  indice: Map<string, GuiaIndexada>,
  ref: { guia: string; capitulo: number },
  quien: string
): CapituloEnlazado {
  const { guia, capitulos } = guiaDe(indice, ref.guia, quien);
  const capitulo = capitulos.find((c) => c.n === ref.capitulo);
  if (!capitulo) throw new Error(`${quien} cita el capítulo ${ref.capitulo} de «${ref.guia}», que no existe`);
  if (!capitulo.slug) throw new Error(`${quien}: el capítulo ${ref.capitulo} de «${ref.guia}» no tiene ancla`);
  return {
    href: `${hrefGuia(guia)}?t=${capitulo.t}#${capitulo.slug}`,
    video: numeroVideo(guia.data.orden),
    tituloGuia: guia.data.title.replace(/^Vídeo \d+ · /, ''),
    capitulo,
  };
}
