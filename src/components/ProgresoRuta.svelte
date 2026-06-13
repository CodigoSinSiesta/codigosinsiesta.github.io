<!--
  Barra de progreso de una ruta — lee `csi-progreso:<ruta>` de localStorage
  y muestra completadas/total. Solo cuenta slugs que existen en la ruta.
-->
<script>
  let { ruta, slugs = [] } = $props();

  let completadas = $state(0);

  $effect(() => {
    try {
      const lista = JSON.parse(localStorage.getItem(`csi-progreso:${ruta}`) ?? '[]');
      completadas = slugs.filter((s) => lista.includes(s)).length;
    } catch {
      completadas = 0;
    }
  });

  const pct = $derived(slugs.length ? Math.round((completadas / slugs.length) * 100) : 0);
</script>

{#if completadas > 0}
  <div class="progreso" role="status">
    <div class="track" aria-hidden="true">
      <div class="fill" style:width={`${pct}%`}></div>
    </div>
    <span class="label">{completadas}/{slugs.length} módulos completados</span>
  </div>
{/if}

<style>
  .progreso {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    margin-block: 1rem 1.5rem;
  }

  .track {
    flex: 1;
    max-width: 280px;
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
  }
</style>
