import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const ensayos = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/ensayos' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    fecha: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    autor: z.string().default('Código Sin Siesta'),
  }),
});

const guias = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/guias' }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
    ruta: z.string(), // slug de la ruta a la que pertenece
    orden: z.number(),
    duracion: z.string().default(''),
  }),
});

export const collections = { ensayos, guias };
