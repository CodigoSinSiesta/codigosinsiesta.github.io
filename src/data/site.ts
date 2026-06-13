export const SITE = {
  nombre: 'Código Sin Siesta',
  dominio: 'https://codigosinsiesta.com',
  claim: 'Donde la disciplina gana a la velocidad',
  descripcion:
    'El dojo de Código Sin Siesta: rutas de aprendizaje, ensayos y talleres para developers que construyen con IA sin perder el techo de calidad.',
};

export const NAV = [
  { href: '/', label: 'Inicio' },
  { href: '/rutas', label: 'Rutas' },
  { href: '/ensayos', label: 'Ensayos' },
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
