<!--
  Gestor de vídeos sin conexión: lista los vídeos del curso, deja marcar varios, calcula el espacio
  que hace falta frente al disponible y los descarga de uno en uno mostrando el avance.
  La lógica de caché vive en src/lib/offline.ts; el service worker (public/sw.js) los sirve.
-->
<script lang="ts">
  import { onMount } from 'svelte';
  import {
    soportado,
    formatearBytes,
    tamanoVideo,
    urlsDescargadas,
    espacio,
    pedirPersistencia,
    descargarVideo,
    borrarVideo,
    type VideoDescargable,
    type Espacio,
  } from '../lib/offline';

  interface Grupo {
    ruta: string;
    titulo: string;
    videos: (VideoDescargable & { duracion: string })[];
  }

  type Estado = 'libre' | 'guardado' | 'cola' | 'bajando' | 'error';

  let { grupos }: { grupos: Grupo[] } = $props();

  const todos = $derived(grupos.flatMap((g) => g.videos));

  let ok = $state(true);
  let enLinea = $state(true);
  let tamanos = $state<Record<string, number | null>>({});
  let estados = $state<Record<string, Estado>>({});
  let errores = $state<Record<string, string>>({});
  let progreso = $state<Record<string, number>>({}); // bytes ya descargados de cada vídeo
  let marcados = $state<Record<string, boolean>>({});
  let disco = $state<Espacio | null>(null);
  let persistente = $state<boolean | null>(null);
  let trabajando = $state(false);
  let controlador: AbortController | null = null;
  let instalador = $state<any>(null);
  let instalada = $state(false);

  const estado = (id: string): Estado => estados[id] ?? 'libre';
  const seleccion = $derived(todos.filter((v) => marcados[v.id]));
  // Lo ya guardado no cuenta como espacio nuevo.
  const porBajar = $derived(seleccion.filter((v) => estado(v.id) !== 'guardado'));
  const necesario = $derived(porBajar.reduce((s, v) => s + (tamanos[v.id] ?? 0), 0));
  const sinTamano = $derived(porBajar.filter((v) => tamanos[v.id] == null).length);
  const faltaEspacio = $derived(disco !== null && necesario > disco.libre * 0.9);
  const guardados = $derived(todos.filter((v) => estado(v.id) === 'guardado'));
  const ocupado = $derived(guardados.reduce((s, v) => s + (tamanos[v.id] ?? 0), 0));

  // Avance global del lote en curso.
  const lote = $derived(todos.filter((v) => ['cola', 'bajando'].includes(estado(v.id)) || (trabajando && marcados[v.id])));
  const loteTotal = $derived(porBajar.reduce((s, v) => s + (tamanos[v.id] ?? 0), 0));
  const loteBajado = $derived(porBajar.reduce((s, v) => s + (progreso[v.id] ?? 0), 0));
  const lotePct = $derived(loteTotal > 0 ? Math.min(100, Math.round((loteBajado / loteTotal) * 100)) : 0);
  const posicion = $derived(porBajar.filter((v) => estado(v.id) === 'guardado' || estado(v.id) === 'bajando').length);

  async function refrescarDisco() {
    disco = await espacio();
  }

  async function refrescarGuardados() {
    const urls = await urlsDescargadas();
    for (const v of todos) {
      if (urls.has(v.url)) estados[v.id] = 'guardado';
      else if (estados[v.id] === 'guardado') estados[v.id] = 'libre';
    }
  }

  onMount(() => {
    ok = soportado();
    enLinea = navigator.onLine;
    instalada = window.matchMedia('(display-mode: standalone)').matches;
    const alRed = () => (enLinea = navigator.onLine);
    const alInstalar = (e: Event) => {
      e.preventDefault();
      instalador = e;
    };
    window.addEventListener('online', alRed);
    window.addEventListener('offline', alRed);
    window.addEventListener('beforeinstallprompt', alInstalar);
    window.addEventListener('appinstalled', () => (instalada = true));

    if (ok) {
      void (async () => {
        await refrescarGuardados();
        await refrescarDisco();
        persistente = (await navigator.storage?.persisted?.()) ?? null;
        // Los tamaños salen de una petición HEAD por vídeo (sin descargar nada).
        await Promise.all(
          todos.map(async (v) => {
            tamanos[v.id] = await tamanoVideo(v.url);
          })
        );
      })();
    }
    return () => {
      window.removeEventListener('online', alRed);
      window.removeEventListener('offline', alRed);
      window.removeEventListener('beforeinstallprompt', alInstalar);
    };
  });

  function marcarGrupo(g: Grupo, valor: boolean) {
    for (const v of g.videos) marcados[v.id] = valor;
  }
  const grupoMarcado = (g: Grupo) => g.videos.every((v) => marcados[v.id]);

  function marcarPendientes() {
    for (const v of todos) marcados[v.id] = estado(v.id) !== 'guardado';
  }

  async function descargar() {
    if (trabajando || porBajar.length === 0) return;
    trabajando = true;
    controlador = new AbortController();
    persistente = await pedirPersistencia();
    const cola = [...porBajar];
    for (const v of cola) {
      estados[v.id] = 'cola';
      progreso[v.id] = 0;
      delete errores[v.id];
    }

    for (const v of cola) {
      if (controlador.signal.aborted) break;
      estados[v.id] = 'bajando';
      try {
        await descargarVideo(v, {
          signal: controlador.signal,
          onProgreso: (leidos, total) => {
            progreso[v.id] = leidos;
            if (total && tamanos[v.id] == null) tamanos[v.id] = total;
          },
        });
        estados[v.id] = 'guardado';
        marcados[v.id] = false;
      } catch (e) {
        if (controlador.signal.aborted) {
          estados[v.id] = 'libre';
        } else {
          estados[v.id] = 'error';
          errores[v.id] = e instanceof Error ? e.message : 'No se pudo descargar.';
        }
        progreso[v.id] = 0;
      }
      await refrescarDisco();
    }
    for (const v of cola) if (estado(v.id) === 'cola') estados[v.id] = 'libre';
    trabajando = false;
    controlador = null;
  }

  function cancelar() {
    controlador?.abort();
  }

  async function borrar(lista: VideoDescargable[]) {
    for (const v of lista) {
      await borrarVideo(v.url);
      estados[v.id] = 'libre';
      progreso[v.id] = 0;
    }
    await refrescarDisco();
  }

  async function instalar() {
    if (!instalador) return;
    instalador.prompt();
    await instalador.userChoice;
    instalador = null;
  }

  const pct = (v: VideoDescargable) => {
    const t = tamanos[v.id];
    return t ? Math.min(100, Math.round(((progreso[v.id] ?? 0) / t) * 100)) : 0;
  };
</script>

{#if !ok}
  <div class="aviso aviso--warn" role="alert">
    <strong>Tu navegador no permite guardar vídeos sin conexión.</strong>
    Prueba con una versión reciente de Chrome, Edge, Firefox o Safari, y no uses una ventana privada.
  </div>
{:else}
  {#if !enLinea}
    <div class="aviso aviso--warn" role="status">Sin conexión: puedes ver lo ya descargado, pero no descargar más.</div>
  {/if}

  <section class="resumen" aria-label="Estado del almacenamiento">
    <div>
      <span class="resumen__n">{guardados.length}<small>/{todos.length}</small></span>
      <span class="resumen__t">vídeos guardados</span>
    </div>
    <div>
      <span class="resumen__n">{formatearBytes(ocupado)}</span>
      <span class="resumen__t">ocupados por el curso</span>
    </div>
    <div>
      <span class="resumen__n">{disco ? formatearBytes(disco.libre) : '—'}</span>
      <span class="resumen__t">disponibles en este dispositivo</span>
    </div>
  </section>

  {#if persistente === false}
    <p class="nota">
      El navegador puede borrar las descargas si le falta espacio. Instalar la app o marcar el sitio como favorito
      suele evitarlo.
    </p>
  {/if}

  {#if !instalada}
    <div class="instalar">
      <div>
        <strong>Instala la app</strong>
        <span>Se abre como una aplicación, sin barra del navegador, y las descargas están más protegidas.</span>
        <span class="ios">En iPhone/iPad: Compartir → «Añadir a pantalla de inicio».</span>
      </div>
      {#if instalador}
        <button type="button" class="btn btn--ghost" onclick={instalar}>Instalar</button>
      {/if}
    </div>
  {/if}

  <div class="barra">
    <button type="button" class="btn btn--ghost" onclick={marcarPendientes} disabled={trabajando}>
      Marcar los que faltan
    </button>
    <button
      type="button"
      class="btn btn--ghost"
      onclick={() => (marcados = {})}
      disabled={trabajando || seleccion.length === 0}
    >
      Quitar marcas
    </button>
  </div>

  {#each grupos as g (g.ruta)}
    <section class="grupo">
      <header class="grupo__cab">
        <label class="check">
          <input
            type="checkbox"
            checked={grupoMarcado(g)}
            disabled={trabajando}
            onchange={(e) => marcarGrupo(g, e.currentTarget.checked)}
          />
          <h2>{g.titulo}</h2>
        </label>
        <span class="meta">{g.videos.length} vídeos</span>
      </header>

      <ul class="lista">
        {#each g.videos as v (v.id)}
          {@const e = estado(v.id)}
          <li class="fila" class:fila--bajando={e === 'bajando'}>
            <label class="check">
              <input type="checkbox" bind:checked={marcados[v.id]} disabled={trabajando} />
              <span class="fila__titulo">{v.titulo}</span>
            </label>
            <span class="fila__meta">
              {v.duracion}
              · {tamanos[v.id] != null ? formatearBytes(tamanos[v.id] as number) : tamanos[v.id] === null ? 'tamaño desconocido' : 'calculando…'}
            </span>

            <span class="fila__estado">
              {#if e === 'guardado'}
                <span class="badge badge--ok">✓ guardado</span>
                <button type="button" class="enlace" disabled={trabajando} onclick={() => borrar([v])}>quitar</button>
              {:else if e === 'bajando'}
                <span class="badge">{pct(v)}%</span>
              {:else if e === 'cola'}
                <span class="badge">en cola</span>
              {:else if e === 'error'}
                <span class="badge badge--warn">error</span>
              {/if}
            </span>

            {#if e === 'bajando'}
              <div class="pista" role="progressbar" aria-valuenow={pct(v)} aria-valuemin="0" aria-valuemax="100" aria-label={`Descargando ${v.titulo}`}>
                <div class="pista__relleno" style:width={`${pct(v)}%`}></div>
              </div>
              <span class="fila__bytes">{formatearBytes(progreso[v.id] ?? 0)} de {formatearBytes(tamanos[v.id] ?? 0)}</span>
            {/if}
            {#if errores[v.id]}<p class="fila__error">{errores[v.id]}</p>{/if}
          </li>
        {/each}
      </ul>
    </section>
  {/each}

  <div class="panel" class:panel--activo={trabajando || seleccion.length > 0} role="region" aria-label="Descarga">
    {#if trabajando}
      <div class="panel__fila">
        <strong>Descargando vídeo {Math.min(porBajar.length, posicion + 1)} de {porBajar.length}</strong>
        <span>{formatearBytes(loteBajado)} de {formatearBytes(loteTotal)} · {lotePct}%</span>
      </div>
      <div class="pista pista--grande" role="progressbar" aria-valuenow={lotePct} aria-valuemin="0" aria-valuemax="100" aria-label="Avance total">
        <div class="pista__relleno" style:width={`${lotePct}%`}></div>
      </div>
      <p class="panel__nota">Mantén esta pestaña abierta hasta que termine. Si la cierras, el vídeo en curso se descarta y los terminados se conservan.</p>
      <button type="button" class="btn btn--ghost" onclick={cancelar}>Cancelar</button>
    {:else if seleccion.length > 0}
      <div class="panel__fila">
        <strong>
          {porBajar.length}
          {porBajar.length === 1 ? 'vídeo' : 'vídeos'} por descargar
        </strong>
        <span class:malo={faltaEspacio}>
          Necesitas {formatearBytes(necesario)}{sinTamano > 0 ? ' (+ algunos de tamaño desconocido)' : ''}
          {#if disco}· disponibles {formatearBytes(disco.libre)}{/if}
        </span>
      </div>
      {#if disco && necesario > 0}
        <div class="pista pista--grande" class:pista--mala={faltaEspacio} aria-hidden="true">
          <div class="pista__relleno" style:width={`${Math.min(100, (necesario / Math.max(1, disco.libre)) * 100)}%`}></div>
        </div>
      {/if}
      {#if faltaEspacio}
        <p class="panel__nota malo" role="alert">
          No hay espacio suficiente. Desmarca algunos vídeos o libera espacio en el dispositivo.
        </p>
      {/if}
      <div class="panel__acciones">
        <button type="button" class="btn btn--primary" onclick={descargar} disabled={!enLinea || faltaEspacio || porBajar.length === 0}>
          Descargar {porBajar.length}
          {porBajar.length === 1 ? 'vídeo' : 'vídeos'}
        </button>
        {#if seleccion.some((v) => estado(v.id) === 'guardado')}
          <button type="button" class="btn btn--ghost" onclick={() => borrar(seleccion.filter((v) => estado(v.id) === 'guardado'))}>
            Quitar los guardados marcados
          </button>
        {/if}
      </div>
    {:else}
      <p class="panel__nota">Marca los vídeos que quieras llevarte. Verás cuánto espacio necesitas antes de empezar.</p>
      {#if guardados.length > 0}
        <button type="button" class="btn btn--ghost" onclick={() => borrar(guardados)}>Quitar todas las descargas</button>
      {/if}
    {/if}
  </div>
{/if}

<style>
  .aviso {
    border: 1px solid var(--color-borde2);
    border-radius: var(--radius-sm);
    padding: 0.9rem 1.1rem;
    margin-bottom: 1.5rem;
    color: var(--color-tinta2);
  }
  .aviso--warn {
    background: var(--color-warn-bg);
    border-color: var(--color-warn-bd);
    color: var(--color-warn);
  }
  .resumen {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  .resumen > div {
    background: var(--color-fondo-elev);
    border: 1px solid var(--color-borde);
    border-radius: var(--radius-sm);
    padding: 1rem 1.2rem;
    display: flex;
    flex-direction: column;
  }
  .resumen__n {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 1.6rem;
    color: var(--color-tinta);
  }
  .resumen__n small {
    color: var(--color-tinta3);
    font-size: 1rem;
  }
  .resumen__t {
    font-size: 0.85rem;
    color: var(--color-tinta3);
  }
  .nota {
    font-size: 0.9rem;
    color: var(--color-tinta3);
  }
  .instalar {
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    border: 1px dashed var(--color-borde2);
    border-radius: var(--radius-sm);
    padding: 0.9rem 1.1rem;
    margin-bottom: 1.5rem;
  }
  .instalar div {
    display: flex;
    flex-direction: column;
    font-size: 0.92rem;
    color: var(--color-tinta2);
  }
  .instalar strong {
    color: var(--color-tinta);
  }
  .ios {
    color: var(--color-tinta3);
    font-size: 0.85rem;
  }
  .barra {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-bottom: 1.5rem;
  }
  .btn {
    cursor: pointer;
    background: transparent;
  }
  .btn--primary {
    background: linear-gradient(90deg, var(--color-cobalto), var(--color-azul), var(--color-electrico));
  }
  .btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  .grupo {
    margin-bottom: 2rem;
  }
  .grupo__cab {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
    border-bottom: 1px solid var(--color-borde);
    padding-bottom: 0.5rem;
    margin-bottom: 0.5rem;
  }
  .grupo__cab h2 {
    font-size: 1.25rem;
    margin: 0;
  }
  .meta {
    font-size: 0.85rem;
    color: var(--color-tinta3);
  }
  .check {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    cursor: pointer;
    min-width: 0;
  }
  .check input {
    width: 1.15rem;
    height: 1.15rem;
    accent-color: var(--color-electrico);
    flex: none;
  }
  .lista {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .fila {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0.15rem 1rem;
    align-items: center;
    padding: 0.65rem 0.25rem;
    border-bottom: 1px solid var(--color-borde);
  }
  .fila--bajando {
    background: var(--color-fondo-elev);
  }
  .fila__titulo {
    color: var(--color-tinta);
  }
  .fila__meta {
    grid-column: 1;
    padding-left: 1.85rem;
    font-size: 0.85rem;
    color: var(--color-tinta3);
  }
  .fila__estado {
    grid-column: 2;
    grid-row: 1 / span 2;
    display: flex;
    gap: 0.6rem;
    align-items: center;
  }
  .fila__bytes {
    grid-column: 1 / -1;
    font-size: 0.8rem;
    color: var(--color-tinta3);
    padding-left: 1.85rem;
  }
  .fila__error {
    grid-column: 1 / -1;
    margin: 0;
    font-size: 0.85rem;
    color: var(--color-err);
    padding-left: 1.85rem;
  }
  .enlace {
    background: none;
    border: 0;
    padding: 0;
    color: var(--color-cielo);
    cursor: pointer;
    font: inherit;
    font-size: 0.85rem;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .enlace:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
  .pista {
    grid-column: 1 / -1;
    height: 6px;
    border-radius: 99px;
    background: var(--color-borde);
    overflow: hidden;
    margin: 0.35rem 0 0.1rem 1.85rem;
  }
  .pista--grande {
    height: 10px;
    margin: 0.6rem 0;
  }
  .pista__relleno {
    height: 100%;
    background: linear-gradient(90deg, var(--color-azul), var(--color-cielo));
    transition: width 0.2s linear;
  }
  .pista--mala .pista__relleno {
    background: var(--color-err);
  }
  .panel {
    position: sticky;
    bottom: 0;
    margin-top: 2rem;
    padding: 1rem 1.25rem;
    background: var(--color-fondo-alt);
    border: 1px solid var(--color-borde2);
    border-radius: var(--radius-sm);
    box-shadow: 0 -10px 30px rgba(15, 23, 42, 0.6);
  }
  .panel__fila {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.25rem 1.5rem;
    color: var(--color-tinta2);
  }
  .panel__fila strong {
    color: var(--color-tinta);
  }
  .panel__nota {
    margin: 0.5rem 0 0.75rem;
    font-size: 0.88rem;
    color: var(--color-tinta3);
  }
  .panel__acciones {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-top: 0.5rem;
  }
  .malo {
    color: var(--color-err);
  }
  /* En pantallas bajas el panel fijo taparía la lista. */
  @media (max-height: 700px) {
    .panel {
      position: static;
    }
  }
</style>
