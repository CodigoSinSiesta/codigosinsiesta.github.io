// Ruta corta del curso «Pi y oh my pi»: seis vídeos para quien tiene una tarde.
// Se muestra en la portada de la ruta (bloque «¿Poco tiempo? La ruta corta») y en
// /rutas/pi-oh-my-pi/ruta-corta. La duración total se calcula con el campo `duracion` de cada guía.
// Entre todas las paradas, `teSaltas` nombra cada vídeo que queda fuera, para que nadie se pierda.

export interface SaltoRutaCorta {
  tema: string;
  // Guías donde está lo que te saltas (ids de la colección `guias`).
  guias: string[];
  // Opcional: capítulo concreto de la primera guía.
  capitulo?: number;
}

export interface ParadaRutaCorta {
  guia: string;
  porQue: string;
  teSaltas: SaltoRutaCorta[];
}

export interface RutaCorta {
  href: string;
  intro: string;
  paradas: ParadaRutaCorta[];
}

export const RUTA_CORTA_PI: RutaCorta = {
  href: '/rutas/pi-oh-my-pi/ruta-corta',
  intro:
    'Seis vídeos para una tarde: el marco, lo que pasa dentro de un agente, cómo ponerle límites, cómo gobernarlo con código, qué añade un agente completo y cómo saber que el trabajo está hecho. Cada uno se entiende solo; de lo que te saltas, te decimos en qué vídeo está.',
  paradas: [
    {
      guia: '01-que-es-un-harness',
      porQue:
        'Te da el vocabulario de todo lo demás: las cinco piezas del harness y la pregunta que repetirás en cada vídeo, qué pieza ha fallado antes de cambiar de modelo. Y ves la misma tarea con Pi y con oh my pi.',
      teSaltas: [
        {
          tema: 'Instalar Pi, conectar un proveedor y la primera tarea: steering, follow-up y cómo leer el pie',
          guias: ['02-instalar-pi-primera-tarea'],
        },
      ],
    },
    {
      guia: '03-pi-por-dentro',
      porQue:
        'El modelo mental que te llevas a cualquier agente: qué recibe el modelo en cada turno, la sesión como un árbol que puedes rebobinar y bifurcar, y qué se pierde al compactar.',
      teSaltas: [
        {
          tema: 'Conectar modelos, rotar entre ellos, el nivel de razonamiento y los modelos locales',
          guias: ['04-modelos-y-proveedores'],
        },
      ],
    },
    {
      guia: '05-seguridad-y-aislamiento',
      porQue:
        'Pi no pide permiso ni trae sandbox. Ves por qué el propio repositorio es una superficie de ataque, qué protege la confianza de proyecto (y qué no) y cómo meter el agente entero en un contenedor. Es lo primero que puedes aplicar mañana, uses el agente que uses.',
      teSaltas: [
        {
          tema: 'Un AGENTS.md que funcione, el prompt de sistema, prompt templates y skills',
          guias: ['06-personalizar-sin-codigo'],
        },
        {
          tema: 'MCP y codemode: conectar servidores sin llenar el contexto',
          guias: ['07-mcp-y-codemode'],
        },
      ],
    },
    {
      guia: '08-extensiones-i',
      porQue:
        'La diferencia entre pedir y obligar: que el modelo pregunte antes de borrar es una petición; que el agente no pueda ejecutar nada sin tu permiso es código. Construyes un modo de aprobación sobre el evento tool_call, la misma pieza que en el vídeo 24 se convierte en una puerta.',
      teSaltas: [
        {
          tema: 'Extensiones con estado que sobreviven a rebobinar la sesión, y cómo empaquetarlas',
          guias: ['09-extensiones-ii-y-paquetes'],
        },
        {
          tema: 'Pi sin interfaz: scripts, integración continua, modo JSON, RPC y SDK',
          guias: ['10-pi-programatico'],
        },
      ],
    },
    {
      guia: '11-de-pi-a-oh-my-pi',
      porQue:
        'Qué añade un agente con baterías incluidas sobre el mismo núcleo, qué cambia de sitio y qué recoge de tu configuración de Claude Code o Codex. Cierra con una tabla para decidir entre Pi y oh my pi.',
      teSaltas: [
        {
          tema: 'Sesiones, contexto y memoria en oh my pi',
          guias: ['12-la-tui-y-las-sesiones', '13-contexto-y-memoria'],
        },
        {
          tema: 'Roles de modelo, nivel de razonamiento y el advisor',
          guias: ['14-modelos-roles-y-razonamiento'],
        },
        {
          tema: 'Modo plan, objetivos con presupuesto y /loop',
          guias: ['15-planificar-y-dirigir'],
        },
        {
          tema: 'Subagentes y trabajo en paralelo',
          guias: ['16-subagentes-y-paralelo'],
        },
        {
          tema: 'El IDE integrado, git, worktrees y la revisión automática',
          guias: ['17-el-ide-integrado', '18-git-calidad-y-entrega'],
        },
        {
          tema: 'Modos de aprobación, hooks, reglas TTSR y secretos: el siguiente si vas a usar oh my pi en equipo',
          guias: ['19-aprobaciones-reglas-y-hooks'],
        },
        {
          tema: 'Extender oh my pi, usarlo en scripts e integración continua, y sus métricas',
          guias: ['20-extender-omp', '21-omp-programatico-metricas-equipo'],
        },
      ],
    },
    {
      guia: '24-verificar-de-verdad',
      porQue:
        'Cierra el círculo: definir antes qué es terminado, escribir una rúbrica y convertir la regla en una puerta, para que no baste con que el agente diga «hecho». Es la idea que más te llevas a cualquier agente: sacar el juicio de «terminado» fuera del agente.',
      teSaltas: [
        {
          tema: 'Diseñar tu harness: medir el roster y el prefijo, límites centralizados, anfitrión y sandbox',
          guias: ['22-disenar-tu-harness'],
        },
        {
          tema: 'El repo como sistema de registro: progreso, traspaso y la lista de funcionalidades de la que parte el vídeo 24',
          guias: ['23-el-repo-como-sistema-de-registro'],
          capitulo: 4,
        },
        {
          tema: 'Cuándo compensa un bucle o varios agentes, y lo que cuesta orquestar',
          guias: ['25-bucles-grafos-y-coste'],
        },
        {
          tema: 'El proyecto final: todo junto en un repo real, con Pi y con oh my pi',
          guias: ['26-proyecto-final'],
        },
      ],
    },
  ],
};
