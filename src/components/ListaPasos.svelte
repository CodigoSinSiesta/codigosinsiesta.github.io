<!--
  Lista de pasos de una ruta con progreso interactivo.
  Persiste en localStorage `csi-progreso:<ruta>` (array JSON de claves).
  La clave de una guía es su id (sincroniza con ProgresoGuia en la página de guía);
  la de un paso manual (ensayo/deck/taller) es su href.
  Un paso con `progreso` guarda en la ruta indicada (una guía prestada de otra ruta).
-->
<script>
  let { ruta, pasos = [] } = $props();

  const KEY = (r) => `csi-progreso:${r}`;
  const rutaDe = (paso) => paso.progreso ?? ruta;
  const rutas = [...new Set([ruta, ...pasos.map(rutaDe)])];
  let hechos = $state({});

  function leer(r) {
    try {
      return JSON.parse(localStorage.getItem(KEY(r)) ?? '[]');
    } catch {
      return [];
    }
  }

  $effect(() => {
    hechos = Object.fromEntries(rutas.map((r) => [r, leer(r)]));
  });

  const hecho = (paso) => (hechos[rutaDe(paso)] ?? []).includes(paso.key);

  function toggle(paso) {
    const r = rutaDe(paso);
    const lista = leer(r);
    const nueva = lista.includes(paso.key) ? lista.filter((s) => s !== paso.key) : [...lista, paso.key];
    localStorage.setItem(KEY(r), JSON.stringify(nueva));
    hechos = { ...hechos, [r]: nueva };
  }

  const total = $derived(pasos.length);
  const completadas = $derived(pasos.filter(hecho).length);
  const pct = $derived(total ? Math.round((completadas / total) * 100) : 0);

  const BADGE = { guia: 'módulo', ensayo: 'ensayo', deck: 'deck', taller: 'taller' };
</script>

<div class="progreso" role="status" aria-label={`Progreso: ${completadas} de ${total}`}>
  <div class="track" aria-hidden="true">
    <div class="fill" style:width={`${pct}%`}></div>
  </div>
  <span class="label">{completadas}/{total} completados · {pct}%</span>
</div>

<ol class="pasos">
  {#each pasos as paso, i (paso.key)}
    {@const done = hecho(paso)}
    <li class="paso" class:done>
      <button
        class="check"
        class:done
        aria-pressed={done}
        title={done ? 'Marcar como pendiente' : 'Marcar como completado'}
        onclick={() => toggle(paso)}
      >
        {done ? '✓' : String(paso.numero ?? i + 1).padStart(2, '0')}
      </button>
      <div class="cuerpo">
        <span class="badge">{BADGE[paso.tipo]}</span>
        <h3><a href={paso.href}>{paso.titulo}</a></h3>
        {#if paso.meta}<p class="meta">{paso.meta}</p>{/if}
      </div>
    </li>
  {/each}
</ol>

<style>
  .progreso {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    margin-block: 1.5rem 2rem;
  }
  .track {
    flex: 1;
    max-width: 320px;
    height: 6px;
    border-radius: 999px;
    background: var(--color-fondo-alt);
    border: 1px solid var(--color-borde);
    overflow: hidden;
  }
  .fill {
    height: 100%;
    background: linear-gradient(90deg, var(--color-cobalto), var(--color-electrico), var(--color-cielo));
    transition: width var(--transition-base);
  }
  .label {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--color-tinta3);
    white-space: nowrap;
  }

  .pasos {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .paso {
    display: flex;
    gap: 1.1rem;
    align-items: flex-start;
    padding: 1.4rem 0;
    border-bottom: 1px solid var(--color-borde);
  }

  .check {
    flex-shrink: 0;
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 50%;
    font-family: var(--font-mono);
    font-weight: 700;
    font-size: 0.95rem;
    cursor: pointer;
    background: transparent;
    border: 1px solid var(--color-borde2);
    color: var(--color-cielo);
    transition: all var(--transition-fast);
  }
  .check:hover {
    border-color: var(--color-cielo);
    color: var(--color-tinta);
  }
  .check.done {
    background: var(--color-ok-bg);
    border-color: var(--color-ok-bd);
    color: var(--color-ok);
  }

  .cuerpo {
    padding-top: 0.15rem;
  }
  .cuerpo h3 {
    margin: 0.5rem 0 0;
  }
  .cuerpo h3 a {
    color: var(--color-tinta);
  }
  .cuerpo h3 a:hover {
    color: var(--color-cielo);
    text-decoration: none;
  }
  .paso.done .cuerpo h3 a {
    color: var(--color-tinta3);
  }
</style>
