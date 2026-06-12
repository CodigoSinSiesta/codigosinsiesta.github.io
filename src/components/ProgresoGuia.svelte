<!--
  Botón "marcar módulo como completado" — persiste en localStorage
  bajo `csi-progreso:<ruta>` (array JSON de slugs de guía completados).
-->
<script>
  let { ruta, guia } = $props();

  const KEY = `csi-progreso:${ruta}`;
  let completada = $state(false);

  function leer() {
    try {
      return JSON.parse(localStorage.getItem(KEY) ?? '[]');
    } catch {
      return [];
    }
  }

  $effect(() => {
    completada = leer().includes(guia);
  });

  function toggle() {
    const lista = leer();
    const nueva = completada ? lista.filter((s) => s !== guia) : [...lista, guia];
    localStorage.setItem(KEY, JSON.stringify(nueva));
    completada = !completada;
  }
</script>

<button class="progreso-btn" class:done={completada} onclick={toggle}>
  {completada ? '✓ módulo completado' : 'marcar como completado'}
</button>

<style>
  .progreso-btn {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    letter-spacing: 0.08em;
    padding: 0.55rem 1.2rem;
    border-radius: var(--radius-sm);
    cursor: pointer;
    background: transparent;
    border: 1px solid var(--color-borde2);
    color: var(--color-tinta2);
    transition: all var(--transition-fast);
  }

  .progreso-btn:hover {
    border-color: var(--color-cielo);
    color: var(--color-tinta);
  }

  .progreso-btn.done {
    background: var(--color-ok-bg);
    border-color: var(--color-ok-bd);
    color: var(--color-ok);
  }
</style>
