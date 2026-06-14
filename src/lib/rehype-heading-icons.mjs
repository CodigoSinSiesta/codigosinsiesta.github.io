// Plugin rehype: sustituye el emoji inicial de cada H2/H3 por un icono SVG inline
// (estilo trazo, coherente con la marca, sin depender de fuentes de emoji del sistema).
// El markdown conserva el emoji como marcador semántico; aquí se transforma a SVG.

const EMOJI_A_ICONO = {
  '🎯': 'target',
  '📖': 'book',
  '🛠': 'wrench',
  '📚': 'library',
  '⚠': 'alert',
  '🚀': 'rocket',
  '🎉': 'sparkles',
};

// Trazos tipo Lucide (viewBox 0 0 24 24, stroke currentColor).
const ICONOS = {
  target: [['circle', { cx: 12, cy: 12, r: 9 }], ['circle', { cx: 12, cy: 12, r: 5 }], ['circle', { cx: 12, cy: 12, r: 1 }]],
  book: [
    ['path', { d: 'M12 7v14' }],
    ['path', { d: 'M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z' }],
  ],
  wrench: [
    ['path', { d: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' }],
  ],
  library: [['path', { d: 'm16 6 4 14' }], ['path', { d: 'M12 6v14' }], ['path', { d: 'M8 8v12' }], ['path', { d: 'M4 4v16' }]],
  alert: [
    ['path', { d: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z' }],
    ['path', { d: 'M12 9v4' }],
    ['path', { d: 'M12 17h.01' }],
  ],
  rocket: [
    ['path', { d: 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z' }],
    ['path', { d: 'm12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z' }],
    ['path', { d: 'M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0' }],
    ['path', { d: 'M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5' }],
  ],
  sparkles: [
    ['path', { d: 'M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.14 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z' }],
  ],
};

const EMOJI_INICIAL = /^(\p{Extended_Pictographic})️?\s*/u;

function el(tagName, properties, children = []) {
  return { type: 'element', tagName, properties, children };
}

function construirIcono(nombre) {
  return el(
    'svg',
    {
      className: ['heading-icon'],
      viewBox: '0 0 24 24',
      width: '1em',
      height: '1em',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 1.75,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      'aria-hidden': 'true',
      focusable: 'false',
    },
    ICONOS[nombre].map(([t, p]) => el(t, p, []))
  );
}

export default function rehypeHeadingIcons() {
  return (tree) => {
    const visitar = (node) => {
      if (node.type === 'element' && (node.tagName === 'h2' || node.tagName === 'h3')) {
        const primero = node.children[0];
        if (primero && primero.type === 'text') {
          const m = primero.value.match(EMOJI_INICIAL);
          const nombre = m && EMOJI_A_ICONO[m[1]];
          if (nombre) {
            primero.value = primero.value.slice(m[0].length);
            node.children.unshift(construirIcono(nombre));
            node.properties = node.properties || {};
            const cls = node.properties.className || [];
            node.properties.className = (Array.isArray(cls) ? cls : [cls]).concat('with-icon');
          }
        }
      }
      if (node.children) for (const hijo of node.children) visitar(hijo);
    };
    visitar(tree);
  };
}
