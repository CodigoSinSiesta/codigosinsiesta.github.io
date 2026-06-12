/**
 * Migración one-shot: posts Docusaurus (blog/) → colección Astro (src/content/ensayos/).
 *
 * - fecha: del nombre de fichero/carpeta (YYYY-MM-DD-slug)
 * - description: primer párrafo antes de <!-- truncate -->, recortado a ~200 chars
 * - autor: mapeo desde authors.yml (TellMeAlex / codigosinsiesta)
 * - elimina el marcador <!-- truncate -->
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';

const BLOG = 'blog';
const OUT = 'src/content/ensayos';

const AUTORES = {
  TellMeAlex: 'Alejandro de la Fuente',
  codigosinsiesta: 'Código Sin Siesta',
};

function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) throw new Error('sin frontmatter');
  const fm = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if (v.startsWith('[') && v.endsWith(']')) {
      fm[kv[1]] = v.slice(1, -1).split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    } else {
      fm[kv[1]] = v.replace(/^["']|["']$/g, '');
    }
  }
  return { fm, body: raw.slice(m[0].length) };
}

function plainText(md) {
  return md
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[#>*_`~\[\]()|-]/g, ' ')
    .replace(/!\S*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function yamlStr(s) {
  return `"${String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

const entries = [];
for (const name of readdirSync(BLOG)) {
  if (name === 'authors.yml' || name === 'tags.yml') continue;
  const full = join(BLOG, name);
  const isDir = statSync(full).isDirectory();
  const file = isDir ? join(full, 'index.md') : full;
  if (!file.endsWith('.md')) continue;
  const stem = basename(name, '.md');
  const dm = stem.match(/^(\d{4}-\d{2}-\d{2})-(.+)$/);
  if (!dm) {
    console.warn(`saltado (sin fecha en nombre): ${name}`);
    continue;
  }
  entries.push({ file, fecha: dm[1], slugFromName: dm[2] });
}

for (const { file, fecha, slugFromName } of entries) {
  const raw = readFileSync(file, 'utf8');
  const { fm, body } = parseFrontmatter(raw);
  const slug = fm.slug || slugFromName;
  const truncateIdx = body.indexOf('<!-- truncate -->');
  const intro = truncateIdx >= 0 ? body.slice(0, truncateIdx) : body;
  const description = plainText(intro).slice(0, 200).trim();
  const cleanBody = body.replace(/<!--\s*truncate\s*-->\n?/g, '').trim();
  const autorKey = Array.isArray(fm.authors) ? fm.authors[0] : fm.authors;
  const autor = AUTORES[autorKey] || AUTORES.codigosinsiesta;
  const tags = Array.isArray(fm.tags) ? fm.tags : [];

  const out = [
    '---',
    `title: ${yamlStr(fm.title)}`,
    `description: ${yamlStr(description)}`,
    `fecha: ${fecha}`,
    `tags: [${tags.map((t) => yamlStr(t)).join(', ')}]`,
    `autor: ${yamlStr(autor)}`,
    '---',
    '',
    cleanBody,
    '',
  ].join('\n');

  writeFileSync(join(OUT, `${slug}.md`), out);
  console.log(`✓ ${slug}.md (${fecha})`);
}
console.log(`\n${entries.length} ensayos migrados a ${OUT}/`);
