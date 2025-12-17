---
sidebar_position: 2
---

# Tmux

El multiplexor de terminal que **salva vidas de desarrolladores**. Si alguna vez perdiste trabajo por cerrar accidentalmente la terminal, o necesitas múltiples shells simultáneos, Tmux es tu salvador.

## ¿Qué Es Tmux?

**Tmux = Terminal Multiplexer**

Te permite:
- ✅ **Múltiples shells** en una ventana
- ✅ **Sesiones persistentes** (sobreviven a desconexiones)
- ✅ **Split panes** (divide pantalla como iTerm)
- ✅ **Windows tabs** dentro de una sesión
- ✅ **Scripting** para setups complejos
- ✅ **Copy/paste** avanzado entre panes

### Cuándo Lo Necesitas

**Escenario típico:** Desarrollas una app web con:
- Backend server corriendo
- Frontend dev server
- Tests ejecutándose
- Logs monitoreándose
- Git operations

**Sin Tmux:** 5+ terminals abiertas, caos organizacional.

**Con Tmux:** Una ventana organizada con todo dividido eficientemente.

## Instalación y Setup Básico

### Instalar Tmux

```bash
# macOS
brew install tmux

# Ubuntu/Debian
sudo apt install tmux

# Verificar
tmux -V  # 3.3a o superior recomendado
```

### Configuración Básica

```bash
# Crear config directory
mkdir -p ~/.config/tmux

# Archivo de configuración
touch ~/.config/tmux/tmux.conf
```

**Configuración esencial:**

```bash
# ~/.config/tmux/tmux.conf
# Cambiar prefix de Ctrl-b a Ctrl-a (más cómodo)
unbind C-b
set-option -g prefix C-a
bind-key C-a send-prefix

# Mouse support
set -g mouse on

# Mejor colors
set -g default-terminal "screen-256color"
set -ga terminal-overrides ",*256col*:Tc"

# Vi mode keys
setw -g mode-keys vi

# Reload config
bind r source-file ~/.config/tmux/tmux.conf \; display "Config reloaded!"

# Start windows and panes at 1, not 0
set -g base-index 1
setw -g pane-base-index 1

# Renumber windows when one is closed
set -g renumber-windows on

# Status bar
set -g status-bg black
set -g status-fg white
set -g status-left "#[fg=green]#S "
set -g status-right "#[fg=yellow]%H:%M %d-%b-%y"
```

### Iniciar Tmux

```bash
# Nueva sesión
tmux

# Sesión nombrada
tmux new -s desarrollo

# Listar sesiones
tmux ls

# Conectar a sesión existente
tmux attach -t desarrollo
```

## Conceptos Fundamentales

### Arquitectura Jerárquica

```
Tmux Server
├── Session "desarrollo"
│   ├── Window 1 "editor"
│   │   ├── Pane 1: nvim
│   │   └── Pane 2: git status
│   ├── Window 2 "servidores"
│   │   ├── Pane 1: npm run dev
│   │   ├── Pane 2: npm run test:watch
│   │   └── Pane 3: tail -f logs/app.log
│   └── Window 3 "database"
│       └── Pane 1: psql
└── Session "produccion"
    └── Window 1 "monitoring"
        ├── Pane 1: htop
        └── Pane 2: journalctl -f
```

### Sessions: Contenedores de Trabajo

**Sesión = Grupo de windows relacionadas**

```bash
# Crear sesión
tmux new -s mi-proyecto

# Dentro de tmux:
:new-session -s otro-proyecto  # Nueva sesión desde dentro
:sessions                      # Listar sesiones
:switch-client -t mi-proyecto  # Cambiar sesión
:detach                        # Salir pero dejar corriendo
```

### Windows: Pestañas

**Window = Una pantalla completa dividida en panes**

```bash
# Dentro de tmux (prefix = Ctrl-a):
c        # Nueva window
n        # Siguiente window
p        # Anterior window
,        # Renombrar window actual
&        # Cerrar window
```

### Panes: Divisiones de Pantalla

**Pane = Terminal individual dentro de un window**

```bash
# Crear panes
%        # Split vertical
"        # Split horizontal

# Navegar panes
h/j/k/l  # Vi-like navigation (izq/abajo/arriba/derecha)
o        # Siguiente pane
;        # Último pane usado

# Redimensionar panes
:resize-pane -D 10  # Abajo 10 líneas
:resize-pane -U 10  # Arriba 10 líneas
:resize-pane -L 10  # Izquierda 10 columnas
:resize-pane -R 10  # Derecha 10 columnas

# Cerrar pane
x        # Confirmar cierre
```

## Keybindings Esenciales

### Prefix Commands (Ctrl-a + letra)

```bash
# Sesiones
:new     # Nueva sesión
:s       # Lista sesiones para elegir

# Windows
c        # Nueva window
w        # Lista windows
n/p      # Siguiente/anterior window
,        # Renombrar window
&        # Cerrar window

# Panes
%        # Split vertical
"        # Split horizontal
o        # Siguiente pane
;        # Último pane usado
x        # Cerrar pane
z        # Zoom pane (fullscreen toggle)

# Navegación Vi-mode
h/j/k/l  # Mover entre panes

# Copy mode (para copiar texto)
[        # Entrar copy mode
space    # Start selection
enter    # Copy selection
]        # Paste
```

### Copy/Paste Avanzado

```bash
# Entrar copy mode
Ctrl-a [

# Navegar (vi keys)
h/j/k/l  # Mover cursor
w/b      # Siguiente/anterior palabra
/        # Buscar hacia adelante
?        # Buscar hacia atrás

# Seleccionar y copiar
Space    # Start selection
Enter    # Copy y salir copy mode

# Pegar
Ctrl-a ]
```

## Workflows Prácticos

### Setup de Desarrollo Web

```bash
# Crear nueva sesión
tmux new -s web-dev

# Dentro de tmux:
# Window 1: Editor + Terminal
Ctrl-a %          # Split vertical
Ctrl-a :rename-window "editor"

# Pane izquierdo: Editor
vim

# Pane derecho: Git status + comandos
git status
# Ctrl-a o para cambiar panes

# Window 2: Servidores
Ctrl-a c
Ctrl-a :rename-window "servidores"
Ctrl-a %          # Split vertical
Ctrl-a "          # Split horizontal del pane derecho

# Pane superior izquierdo: Backend
cd backend && npm run dev

# Pane inferior izquierdo: Frontend
cd frontend && npm run dev

# Pane derecho: Tests
npm run test:watch

# Window 3: Monitoring
Ctrl-a c
Ctrl-a :rename-window "logs"
tail -f backend/logs/app.log
```

### Desarrollo con Microservicios

```bash
# Sesión para microservicios
tmux new -s microservices

# Window por servicio
Ctrl-a c && Ctrl-a :rename-window "auth-service"
cd auth && docker-compose up

Ctrl-a c && Ctrl-a :rename-window "user-service"
cd user && npm run dev

Ctrl-a c && Ctrl-a :rename-window "api-gateway"
cd gateway && go run main.go

# Window de monitoring
Ctrl-a c && Ctrl-a :rename-window "monitoring"
Ctrl-a %  # Split vertical
htop      # Izquierdo: recursos
docker stats  # Derecho: containers
```

## Scripting y Automatización

### Crear Layouts Complejos

```bash
# Script para setup de desarrollo
#!/bin/bash
SESSION="dev"

# Crear sesión si no existe
tmux has-session -t $SESSION 2>/dev/null
if [ $? != 0 ]; then
    # Nueva sesión
    tmux new-session -d -s $SESSION

    # Window 1: Editor
    tmux rename-window -t $SESSION:1 "editor"
    tmux send-keys -t $SESSION:1 "cd ~/projects/my-app && nvim" C-m

    # Window 2: Servidores
    tmux new-window -t $SESSION:2 -n "servidores"
    tmux split-window -h -t $SESSION:2
    tmux split-window -v -t $SESSION:2.1
    tmux send-keys -t $SESSION:2.1 "cd ~/projects/my-app/backend && npm run dev" C-m
    tmux send-keys -t $SESSION:2.2 "cd ~/projects/my-app/frontend && npm start" C-m
    tmux send-keys -t $SESSION:2.3 "cd ~/projects/my-app && npm run test:watch" C-m

    # Window 3: Database
    tmux new-window -t $SESSION:3 -n "database"
    tmux send-keys -t $SESSION:3 "cd ~/projects/my-app && docker-compose up db" C-m
fi

# Conectar
tmux attach -t $SESSION
```

### Alias Útiles

```bash
# ~/.zshrc o ~/.bashrc
alias tdev="~/.scripts/tmux-dev.sh"
alias tkill="tmux kill-session -t"
alias tls="tmux ls"
alias ta="tmux attach -t"
```

## Persistencia y Recuperación

### Sesiones Sobreviven Desconexiones

```bash
# Detach (salir pero dejar corriendo)
Ctrl-a d

# Reattach desde cualquier terminal
tmux attach -t desarrollo

# En otro computador (si usas SSH)
ssh user@server -t tmux attach -t desarrollo
```

### Respawn Commands

```bash
# Si un comando muere, tmux puede respawnearlo
# Configurar en tmux.conf:
set -g remain-on-exit on  # No cerrar pane cuando comando termina

# Respawn manual
Ctrl-a :respawn-pane -k  # Mata y reinicia último comando
```

### Backup/Restore Sesiones

```bash
# Instalar tmux-resurrect
git clone https://github.com/tmux-plugins/tmux-resurrect ~/.tmux/plugins/resurrect

# Añadir a tmux.conf:
run-shell ~/.tmux/plugins/resurrect/resurrect.tmux

# Keybindings:
Ctrl-a Ctrl-s  # Save sesión
Ctrl-a Ctrl-r  # Restore sesión
```

## Integración con Herramientas

### Con Vim/Neovim

```vim
" ~/.config/nvim/init.vim
" Navegación seamless entre tmux panes y vim splits
let g:tmux_navigator_no_mappings = 1

nnoremap <silent> <C-h> :TmuxNavigateLeft<cr>
nnoremap <silent> <C-j> :TmuxNavigateDown<cr>
nnoremap <silent> <C-k> :TmuxNavigateUp<cr>
nnoremap <silent> <C-l> :TmuxNavigateRight<cr>
```

### Con Zsh

```bash
# ~/.zshrc
# Auto-start tmux
if command -v tmux &> /dev/null && [ -z "$TMUX" ]; then
    tmux attach -t default || tmux new -s default
fi
```

## Troubleshooting

### Problemas Comunes

```bash
# Colors no funcionan
# En tmux.conf:
set -g default-terminal "screen-256color"

# Mouse no funciona
# En tmux.conf:
set -g mouse on

# Vi keys no funcionan en copy mode
# Verificar: setw -g mode-keys vi

# Sesión no se encuentra
tmux ls  # Listar sesiones disponibles
```

### Comandos Útiles

```bash
# Debug
tmux info          # Información del servidor
tmux display-message "#S #W #P"  # Mostrar sesión/window/pane actual

# Kill everything
tmux kill-server   # Mata todas las sesiones
tmux kill-session -t nombre  # Mata sesión específica

# Config reload
tmux source ~/.config/tmux/tmux.conf
```

## Alternativas Modernas

**Zellij** es una alternativa más moderna a Tmux:
- ✅ Layouts como código
- ✅ UI más intuitiva
- ✅ Plugins en Rust
- ❌ Menos madura que Tmux

**Comparativa:**
- **Tmux**: Estable, probado, scripting poderoso
- **Zellij**: Moderno, UX mejor, pero menos features

## Conclusión

**Tmux no es solo una herramienta, es una filosofía de trabajo.** Te enseña a pensar en términos de sesiones organizadas, workflows reproducibles, y persistencia.

**Principio**: Si lo haces más de una vez, scriptéalo en Tmux.

**Resultado**: Desarrollo más eficiente, menos context switching, y nunca más perder trabajo por terminal cerrada.

> *"Tmux es como git para tu terminal: guarda estados, permite branching, y te rescata de desastres."*

Próximo: [Zellij](./zellij.md) - la alternativa moderna a Tmux con mejor UX. 🔄
