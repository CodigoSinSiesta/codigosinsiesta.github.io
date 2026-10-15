export const SITE = {
  nombre: 'Código Sin Siesta',
  dominio: 'https://codigosinsiesta.com',
  claim: 'Donde la disciplina gana a la velocidad',
  descripcion:
    'Código Sin Siesta: guías de aprendizaje, artículos y talleres para developers que construyen con IA sin perder el techo de calidad.',
};

// Dónde se alojan los vídeos de las guías (almacenamiento de objetos, fuera del repo: pesan demasiado para Pages).
// Por ahora es la URL pública de desarrollo de R2; con un dominio propio (p. ej. videos.codigosinsiesta.com) bastará
// con cambiarla aquí o con PUBLIC_VIDEOS_URL en el build.
export const VIDEOS_BASE_URL = (import.meta.env.PUBLIC_VIDEOS_URL ?? 'https://pub-d737b0b6e6dc4ae0b7abe1ec46efa01c.r2.dev').replace(/\/$/, '');

export const NAV = [
  { href: '/', label: 'Inicio' },
  { href: '/rutas', label: 'Guías' },
  { href: '/ensayos', label: 'Artículos' },
  // El boletín es otro despliegue bajo el mismo dominio (/tecnoboletin),
  // no una ruta de este sitio Astro: por eso es un enlace normal y no
  // aparece en el sitemap de aquí.
  { href: '/tecnoboletin/', label: 'Boletín' },
  { href: '/talleres', label: 'Talleres' },
];

export const FOOTER = {
  copyright: `© ${new Date().getFullYear()} Código Sin Siesta · MIT`,
  tagline: 'Hecho con ♥ · donde la disciplina gana a la velocidad',
  links: [
    { href: 'https://github.com/CodigoSinSiesta', label: 'GitHub', icon: 'github' },
    { href: 'mailto:hola@codigosinsiesta.com', label: 'Email', icon: 'envelope' },
  ],
};
