// Rellena dist/sw.js con la lista de todo lo que el service worker debe guardar para funcionar sin
// conexión: todas las páginas HTML, los recursos con hash, los iconos, los subtítulos y el índice de búsqueda.
// Va después de `pagefind`, para que el índice ya esté en dist/.
//
// Uso:  node scripts/build-sw.mjs        (lo ejecuta `pnpm build`)

import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist');

// Ficheros de dist/ que NO se guardan: el propio worker y lo que solo sirve a rastreadores o redes sociales.
const EXCLUIR = new Set(['/sw.js', '/robots.txt', '/rss.xml', '/og-card.png', '/bot-avatar.png', '/CNAME']);
const EXCLUIR_PREFIJO = ['/sitemap'];

function* ficheros(dir) {
  for (const nombre of readdirSync(dir)) {
    const ruta = join(dir, nombre);
    if (statSync(ruta).isDirectory()) yield* ficheros(ruta);
    else yield ruta;
  }
}

const rutas = [];
const hash = createHash('sha1');

for (const fichero of [...ficheros(DIST)].sort()) {
  const url = '/' + relative(DIST, fichero).split(sep).join('/');
  if (EXCLUIR.has(url) || EXCLUIR_PREFIJO.some((p) => url.startsWith(p))) continue;

  // Las páginas se sirven con barra final: dist/rutas/x/index.html es /rutas/x/.
  const ruta = url === '/index.html' ? '/' : url.endsWith('/index.html') ? url.slice(0, -'index.html'.length) : url;
  // Codificada como la ve el navegador (/tags/búsqueda/ → /tags/b%C3%BAsqueda/); si no, la limpieza
  // de activate() no la reconocería en la caché.
  rutas.push(new URL(ruta, 'http://sitio').pathname);
  hash.update(ruta).update(readFileSync(fichero));
}

const version = hash.digest('hex').slice(0, 10);
const swPath = join(DIST, 'sw.js');
let sw = readFileSync(swPath, 'utf8');

const reemplazos = [
  [/^const VERSION = .*;$/m, `const VERSION = '${version}';`],
  [/^const PRECACHE = .*;$/m, `const PRECACHE = ${JSON.stringify(rutas)};`],
];
for (const [patron, nuevo] of reemplazos) {
  if (!patron.test(sw)) throw new Error(`dist/sw.js no tiene la línea ${patron}; ¿cambió public/sw.js?`);
  sw = sw.replace(patron, () => nuevo);
}
writeFileSync(swPath, sw);

const paginas = rutas.filter((r) => r.endsWith('/') || r.endsWith('.html')).length;
console.log(`sw.js ${version}: ${rutas.length} recursos a guardar (${paginas} páginas)`);
