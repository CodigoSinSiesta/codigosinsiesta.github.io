<!--
  Easter egg del Laboratorio: terminal que "teclea" el manifiesto en la home.
  Respeta prefers-reduced-motion mostrando todas las líneas de golpe.
-->
<script>
  import TerminalWindow from '@codigosinsiesta/theme/components/TerminalWindow.svelte';

  const SEQUENCE = [
    { type: 'cmd', text: 'whoami' },
    { type: 'out', text: 'código sin siesta — devs que no se duermen' },
    { type: 'cmd', text: 'ls rutas/' },
    { type: 'out', text: 'agentes-ia/    agentic-engineering/' },
    { type: 'cmd', text: 'cat manifiesto.md' },
    { type: 'out', text: 'sin conceptos sólidos, la IA solo amplifica el ruido.' },
    { type: 'ok', text: '✓ disciplina > velocidad' },
    { type: 'comment', text: 'elige una ruta y empieza' },
  ];

  let lines = $state([]);

  $effect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      lines = SEQUENCE;
      return;
    }
    let i = 0;
    lines = [];
    const id = setInterval(() => {
      lines = [...lines, SEQUENCE[i]];
      i += 1;
      if (i >= SEQUENCE.length) clearInterval(id);
    }, 650);
    return () => clearInterval(id);
  });
</script>

<TerminalWindow title="codigosinsiesta.com · zsh" {lines} minHeight={300} />
