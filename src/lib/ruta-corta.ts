import type { RutaCorta } from '../data/ruta-corta-pi-oh-my-pi';
import { enlaceCapitulo, guiaDe, hrefGuia, numeroVideo, type GuiaIndexada } from './guias';
import { minutosDe } from './capitulos';

// Resuelve la ruta corta contra las guías: título, enlace y duración de cada parada, y el total.
// Si una guía citada no existe, el build falla.
export function resolverRutaCorta(rc: RutaCorta, indice: Map<string, GuiaIndexada>) {
  const quien = 'La ruta corta';
  const paradas = rc.paradas.map((p) => {
    const { guia } = guiaDe(indice, p.guia, quien);
    return {
      ...p,
      video: numeroVideo(guia.data.orden),
      titulo: guia.data.title.replace(/^Vídeo \d+ · /, ''),
      href: hrefGuia(guia),
      duracion: guia.data.duracion,
      minutos: minutosDe(guia.data.duracion),
      saltos: p.teSaltas.map((s) => ({
        tema: s.tema,
        enlaces: s.guias.map((id, i) => {
          if (i === 0 && s.capitulo) {
            const e = enlaceCapitulo(indice, { guia: id, capitulo: s.capitulo }, quien);
            return { href: e.href, texto: `vídeo ${e.video} · ${e.capitulo.etiqueta}` };
          }
          const g = guiaDe(indice, id, quien).guia;
          return { href: hrefGuia(g), texto: `vídeo ${numeroVideo(g.data.orden)}` };
        }),
      })),
    };
  });
  return { paradas, minutos: paradas.reduce((t, p) => t + p.minutos, 0) };
}
