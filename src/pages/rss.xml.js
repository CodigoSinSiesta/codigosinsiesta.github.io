import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../data/site';

export async function GET(context) {
  const ensayos = (await getCollection('ensayos')).sort(
    (a, b) => b.data.fecha.valueOf() - a.data.fecha.valueOf()
  );

  return rss({
    title: `Artículos · ${SITE.nombre}`,
    description: SITE.descripcion,
    site: context.site,
    items: ensayos.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.fecha,
      link: `/ensayos/${post.id}`,
    })),
    customData: '<language>es</language>',
  });
}
