// Renderiza un HTML a PNG con Chrome headless. Por defecto regenera
// public/og-card.png (1200×630) desde scripts/og-card/og-card.html.
//
// Uso:  node scripts/og-card/render.mjs [input.html] [output.png] [w] [h]
//   p.ej.  node scripts/og-card/render.mjs avatar.html ../../public/bot-avatar.png 1024 1024
//   (rutas relativas resueltas desde este directorio)
//
// Conduce Chrome vía el protocolo CDP para poder esperar a
// `document.fonts.ready` ANTES de capturar — si se usa el screenshot one-shot
// de Chrome, la captura se dispara antes de que Google Fonts termine de
// descargar y el PNG sale con la fuente de fallback (Arial) en vez de
// Space Grotesk / JetBrains Mono.
//
// No requiere dependencias npm: localiza un Chrome/Chromium ya instalado.

import { spawn } from 'node:child_process';
import { mkdtempSync, existsSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const [inArg = 'og-card.html', outArg = '../../public/og-card.png', wArg, hArg] =
  process.argv.slice(2);
const HTML = /^https?:\/\//.test(inArg)
  ? inArg
  : pathToFileURL(resolve(__dirname, inArg)).href;
const OUT = resolve(__dirname, outArg);
const WIDTH = Number(wArg) || 1200;
const HEIGHT = Number(hArg) || 630;

const CANDIDATES = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  process.env.CHROME_PATH,
].filter(Boolean);

const chromeBin = CANDIDATES.find((p) => existsSync(p));
if (!chromeBin) {
  console.error('No se encontró Chrome/Chromium. Define CHROME_PATH.');
  process.exit(1);
}

const userDataDir = mkdtempSync(join(tmpdir(), 'og-card-'));
const port = 9333;

const chrome = spawn(chromeBin, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${userDataDir}`,
  `--window-size=${WIDTH},${HEIGHT}`,
  '--hide-scrollbars',
  '--force-color-profile=srgb',
  '--no-first-run',
  '--disable-extensions',
]);

async function waitForDevtools() {
  for (let i = 0; i < 50; i++) {
    try {
      // El endpoint a usar es el de un *page target*, no el del navegador:
      // el target de navegador no expone los dominios Page/Runtime/Emulation.
      const res = await fetch(`http://127.0.0.1:${port}/json/list`);
      if (res.ok) {
        const page = (await res.json()).find((t) => t.type === 'page');
        if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error('Chrome DevTools no respondió con un page target');
}

async function main() {
  const wsUrl = await waitForDevtools();
  const sock = new WebSocket(wsUrl); // global desde Node 22

  let id = 0;
  const pending = new Map();
  const send = (method, params = {}) =>
    new Promise((res) => {
      const msgId = ++id;
      pending.set(msgId, res);
      sock.send(JSON.stringify({ id: msgId, method, params }));
    });

  await new Promise((res) => (sock.onopen = res));
  sock.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      if (msg.error) console.error(`CDP error (${msg.id}):`, msg.error);
      pending.get(msg.id)(msg.result);
      pending.delete(msg.id);
    }
  };

  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: WIDTH,
    height: HEIGHT,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await send('Page.navigate', { url: HTML });
  await new Promise((r) => setTimeout(r, 800));
  await send('Runtime.evaluate', {
    expression: 'document.fonts.ready.then(() => true)',
    awaitPromise: true,
  });
  await new Promise((r) => setTimeout(r, 250));

  const { data } = await send('Page.captureScreenshot', { format: 'png' });

  writeFileSync(OUT, Buffer.from(data, 'base64'));
  console.log(`✓ og-card.png regenerada (${WIDTH}×${HEIGHT}) → ${OUT}`);

  sock.close();
  chrome.kill();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  chrome.kill();
  process.exit(1);
});
