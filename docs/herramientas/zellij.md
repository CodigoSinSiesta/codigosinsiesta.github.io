---
sidebar_position: 3
---

# Zellij

El multiplexor de terminal **diseñado para el siglo XXI**. Si Tmux te parece arcaico o Screen te aburre, Zellij es la alternativa moderna que combina potencia con usabilidad intuitiva.

## ¿Por Qué Zellij?

### El Problema con Multiplexores Tradicionales

**Tmux y Screen son poderosos, pero tienen costos ocultos:**

- 🔴 **Curva de aprendizaje empinada**: Keybindings crípticos sin indicaciones visuales
- 🔴 **Configuración compleja**: Sintaxis arcaica y documentación dispersa
- 🔴 **Sin hints on-screen**: Necesitas memorizar todo antes de ser productivo
- 🔴 **Plugin ecosystem limitado**: Difícil de extender sin scripts bash
- 🔴 **Escrito en C**: Más difícil de contribuir o auditar

**Resultado**: Muchos desarrolladores abandonan antes de ver los beneficios del terminal multiplexing.

### Zellij: Multiplexing para Humanos

**Ventajas concretas:**
- 🟢 **UI autodescubrible**: Hints en pantalla te guían constantemente
- 🟢 **Configuración YAML/KDL**: Formato moderno y legible
- 🟢 **Escrito en Rust**: Seguro, rápido, y fácil de contribuir
- 🟢 **Layouts como código**: Define workspaces complejos en archivos
- 🟢 **Plugin system nativo**: WASM plugins para extensibilidad
- 🟢 **Defaults sensatos**: Funciona bien out-of-the-box

## Comparativa: Zellij vs Tmux vs Screen

### Tabla de Características

| Característica | Zellij | Tmux | Screen |
|----------------|--------|------|--------|
| **Lenguaje** | Rust | C | C |
| **Primera versión** | 2021 | 2007 | 1987 |
| **Config format** | KDL/YAML | Custom syntax | Custom syntax |
| **On-screen hints** | ✅ Siempre | ❌ No | ❌ No |
| **Plugin system** | ✅ WASM | ⚠️ Scripts | ❌ Limitado |
| **Layouts como código** | ✅ Nativo | ⚠️ Scripts | ❌ No |
| **Mouse support** | ✅ Default | ⚠️ Config | ⚠️ Config |
| **Session persistence** | ✅ Sí | ✅ Sí | ✅ Sí |
| **Floating panes** | ✅ Nativo | ❌ No | ❌ No |
| **Resource usage** | ~30MB | ~5MB | ~3MB |
| **Madurez** | ⚠️ Joven | ✅ Probado | ✅ Veterano |

### ¿Cuándo Elegir Cada Uno?

**Elige Zellij si:**
- ✅ Eres nuevo en terminal multiplexing
- ✅ Valoras UX moderna y hints visuales
- ✅ Quieres layouts declarativos
- ✅ Te interesa el ecosistema de plugins WASM
- ✅ Prefieres configuración en formatos modernos

**Elige Tmux si:**
- ✅ Ya dominas sus keybindings
- ✅ Necesitas máxima compatibilidad/estabilidad
- ✅ Trabajas en servidores legacy
- ✅ Requires scripting avanzado existente
- ✅ RAM es un factor crítico

**Elige Screen si:**
- ✅ Sistema no tiene Tmux ni Zellij disponibles
- ✅ Solo necesitas sesiones persistentes básicas
- ✅ Ambiente ultra-legacy

### Performance Comparativa

| Métrica | Zellij | Tmux |
|---------|--------|------|
| **Startup time** | ~200ms | ~50ms |
| **RAM idle** | ~30MB | ~5MB |
| **RAM con 10 panes** | ~50MB | ~15MB |
| **Input latency** | ~1ms | ~1ms |
| **Rendering speed** | ✅ Rápido | ✅ Rápido |

**Nota:** Zellij usa más recursos pero ofrece más features. En hardware moderno, la diferencia es imperceptible.

## Instalación

### macOS

```bash
# Usando Homebrew (recomendado)
brew install zellij

# Verificar instalación
zellij --version  # Debe ser 0.40+ recomendado

# Iniciar Zellij
zellij
```

### Linux

```bash
# Ubuntu/Debian - usando cargo (Rust package manager)
# Primero instalar Rust si no tienes
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Instalar Zellij
cargo install zellij

# Alternativa: Descarga binario directamente
# Para la última versión, visita: https://github.com/zellij-org/zellij/releases
curl -L "https://github.com/zellij-org/zellij/releases/latest/download/zellij-x86_64-unknown-linux-musl.tar.gz" | tar xz
sudo mv zellij /usr/local/bin/

# Arch Linux
sudo pacman -S zellij

# Fedora
sudo dnf install zellij

# Verificar
zellij --version
```

### Configuración Inicial

```bash
# Crear directorio de configuración
mkdir -p ~/.config/zellij

# Generar configuración default
zellij setup --dump-config > ~/.config/zellij/config.kdl

# Ver todas las opciones de setup
zellij setup --help
```

**Configuración básica recomendada:**

```kdl
// ~/.config/zellij/config.kdl

// Tema visual
theme "catppuccin-mocha"

// Comportamiento por defecto
default_mode "normal"
default_layout "compact"

// Mouse habilitado
mouse_mode true

// Copiar al clipboard del sistema
copy_on_select true

// Tiempo para cerrar tip del día
ui {
    pane_frames {
        rounded_corners true
    }
}

// Simplificar status bar (opcional)
simplified_ui false
```

### Verificación de Instalación

```bash
# Iniciar Zellij
zellij

# Dentro de Zellij, presiona:
# Ctrl+p → Modo pane (verás hints en pantalla)
# Ctrl+t → Modo tab
# Ctrl+o → Modo session
# Ctrl+q → Cerrar Zellij

# Verificar que los hints aparecen en la parte inferior
# Si los ves, la instalación fue exitosa
```

### Primera Sesión

Al iniciar Zellij por primera vez, notarás inmediatamente la diferencia con Tmux:

```
┌─────────────────────────────────────────────────────────────┐
│ ~/projects                                                   │
│ $                                                            │
│                                                              │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ Zellij (Tab 1)                   <Ctrl+p> Pane <Ctrl+t> Tab │
└─────────────────────────────────────────────────────────────┘
```

**Observa los hints en la parte inferior** - esto es lo que hace a Zellij autodescubrible.

## Arquitectura y Filosofía

### Diseño Modular

```
Zellij Architecture
├── Server (Rust daemon)
│   ├── Session Manager
│   ├── Plugin System (WASM)
│   └── Layout Engine
├── Client (Terminal UI)
│   ├── Pane Renderer
│   ├── Tab Manager
│   └── Status Bar
└── Plugins
    ├── status-bar (built-in)
    ├── tab-bar (built-in)
    ├── strider (file manager)
    └── Custom WASM plugins
```

### Filosofía de Diseño

**"Discoverability over memorization"**

Zellij prioriza que puedas aprender mientras usas:
- Los modos muestran opciones disponibles
- Cada acción tiene feedback visual
- No necesitas memorizar nada para empezar

**"Layouts as code"**

Tus workspaces son archivos versionables:
- Layouts en KDL son legibles
- Comparte configuraciones via Git
- Reproduce setups complejos instantáneamente

**"Secure by default"**

Escrito en Rust para:
- Memory safety garantizada
- Sin buffer overflows
- Plugins sandboxed via WASM

## Configuración Avanzada

### Archivo de Configuración Principal

El archivo `~/.config/zellij/config.kdl` controla todo el comportamiento de Zellij. KDL (Kdl Document Language) es un formato moderno y legible.

**Configuración completa recomendada:**

```kdl
// ~/.config/zellij/config.kdl

// ═══════════════════════════════════════════════
// TEMA Y APARIENCIA
// ═══════════════════════════════════════════════

theme "catppuccin-mocha"

// Colores personalizados (si no usas tema)
// themes {
//     default {
//         fg "#D8DEE9"
//         bg "#2E3440"
//         black "#3B4252"
//         red "#BF616A"
//         green "#A3BE8C"
//         yellow "#EBCB8B"
//         blue "#81A1C1"
//         magenta "#B48EAD"
//         cyan "#88C0D0"
//         white "#E5E9F0"
//     }
// }

// ═══════════════════════════════════════════════
// COMPORTAMIENTO GENERAL
// ═══════════════════════════════════════════════

// Modo por defecto al iniciar
default_mode "normal"

// Layout por defecto
default_layout "compact"

// Shell por defecto (usa shell del sistema si no se especifica)
// default_shell "zsh"

// Directorio de trabajo por defecto
// default_cwd "/home/user/projects"

// ═══════════════════════════════════════════════
// MOUSE Y CLIPBOARD
// ═══════════════════════════════════════════════

// Habilitar mouse
mouse_mode true

// Copiar automáticamente al seleccionar
copy_on_select true

// Comando para copiar al clipboard (ajustar según OS)
// macOS: "pbcopy"
// Linux con xclip: "xclip -selection clipboard"
// Linux con wl-copy: "wl-copy"
copy_command "pbcopy"

// Guardar historial del clipboard
scrollback_editor "nvim"

// ═══════════════════════════════════════════════
// UI Y EXPERIENCIA
// ═══════════════════════════════════════════════

ui {
    pane_frames {
        // Esquinas redondeadas para panes
        rounded_corners true
        // Ocultar frames cuando solo hay un pane
        hide_session_name false
    }
}

// Simplificar UI (quita algunos elementos visuales)
simplified_ui false

// Auto-layout: ajustar panes automáticamente
// Opciones: true, false
pane_viewport_serialization true

// Scrollback lines (historial por pane)
scroll_buffer_size 10000

// ═══════════════════════════════════════════════
// SESIONES
// ═══════════════════════════════════════════════

// Adjuntar automáticamente a sesión existente
// on_force_close "detach"  // o "quit"

// Serializar sesiones para resurrect
session_serialization true

// Mirror sessions (todos los clientes ven lo mismo)
mirror_session true

// ═══════════════════════════════════════════════
// KEYBINDINGS PERSONALIZADOS
// ═══════════════════════════════════════════════

keybinds {
    // Modo normal
    normal {
        // Bind Ctrl+a como prefix adicional (estilo Tmux)
        bind "Ctrl a" { SwitchToMode "tmux"; }
    }

    // Modo tmux-like (opcional)
    tmux {
        bind "Ctrl a" { Write 1; SwitchToMode "Normal"; }
        bind "\"" { NewPane "Down"; SwitchToMode "Normal"; }
        bind "%" { NewPane "Right"; SwitchToMode "Normal"; }
        bind "z" { ToggleFocusFullscreen; SwitchToMode "Normal"; }
        bind "c" { NewTab; SwitchToMode "Normal"; }
        bind "," { SwitchToMode "RenameTab"; }
        bind "p" { GoToPreviousTab; SwitchToMode "Normal"; }
        bind "n" { GoToNextTab; SwitchToMode "Normal"; }
        bind "d" { Detach; }
    }

    // Navegación entre panes con Alt+flechas
    shared_except "locked" {
        bind "Alt Left" { MoveFocus "Left"; }
        bind "Alt Right" { MoveFocus "Right"; }
        bind "Alt Up" { MoveFocus "Up"; }
        bind "Alt Down" { MoveFocus "Down"; }

        // Redimensionar con Alt+Shift+flechas
        bind "Alt Shift Left" { Resize "Increase Left"; }
        bind "Alt Shift Right" { Resize "Increase Right"; }
        bind "Alt Shift Up" { Resize "Increase Up"; }
        bind "Alt Shift Down" { Resize "Increase Down"; }
    }
}

// ═══════════════════════════════════════════════
// PLUGINS
// ═══════════════════════════════════════════════

plugins {
    tab-bar { path "tab-bar"; }
    status-bar { path "status-bar"; }
    strider { path "strider"; }
    compact-bar { path "compact-bar"; }
}
```

### Directorios y Archivos

```bash
~/.config/zellij/
├── config.kdl          # Configuración principal
├── layouts/            # Layouts personalizados
│   ├── dev.kdl         # Layout para desarrollo
│   └── monitoring.kdl  # Layout para monitoring
└── themes/             # Temas personalizados (opcional)
    └── my-theme.kdl
```

### Variables de Entorno

```bash
# ~/.zshrc o ~/.bashrc

# Directorio de configuración alternativo
export ZELLIJ_CONFIG_DIR="$HOME/.config/zellij"

# Layout por defecto
export ZELLIJ_DEFAULT_LAYOUT="compact"

# Auto-attach a sesión existente
export ZELLIJ_AUTO_ATTACH="true"

# Auto-exit cuando el último cliente se desconecta
export ZELLIJ_AUTO_EXIT="true"
```

## Conceptos Básicos

### Arquitectura Jerárquica

```
Zellij Server
├── Session "desarrollo"
│   ├── Tab 1 "editor"
│   │   ├── Pane 1: nvim (focused)
│   │   └── Pane 2: git status
│   ├── Tab 2 "servidores"
│   │   ├── Pane 1: npm run dev
│   │   ├── Pane 2: npm run test:watch
│   │   └── Pane 3: tail -f logs/app.log
│   │   └── Floating Pane: htop (toggle)
│   └── Tab 3 "database"
│       └── Pane 1: psql
└── Session "produccion"
    └── Tab 1 "monitoring"
        ├── Pane 1: journalctl -f
        └── Pane 2: docker stats
```

**Diferencia clave con Tmux:** En Zellij, "Tabs" equivalen a "Windows" de Tmux, y los panes funcionan similar pero con mejor soporte visual.

### Panes: Divisiones de Pantalla

**Pane = Terminal individual dentro de un tab**

Zellij soporta dos tipos de panes:

**Panes fijos (tiled):**
```
┌──────────────────┬──────────────────┐
│                  │                  │
│    Pane 1        │    Pane 2        │
│    (nvim)        │    (terminal)    │
│                  │                  │
├──────────────────┴──────────────────┤
│                                     │
│            Pane 3 (logs)            │
│                                     │
└─────────────────────────────────────┘
```

**Panes flotantes (floating):**
```
┌─────────────────────────────────────┐
│                              ┌─────┐│
│    Pane principal            │Float││
│    (nvim)                    │Pane ││
│                              │     ││
│                              └─────┘│
│                                     │
└─────────────────────────────────────┘
```

**Crear y manejar panes:**

```bash
# Entrar modo pane: Ctrl+p
# Dentro del modo pane:
n        # Nuevo pane (hacia abajo por defecto)
d        # Pane abajo
r        # Pane a la derecha
w        # Floating pane (toggle)
x        # Cerrar pane actual
f        # Fullscreen toggle (zoom)

# Navegación entre panes:
h/j/k/l  # Vi-style: izquierda/abajo/arriba/derecha
←/↓/↑/→  # Flechas también funcionan

# Redimensionar:
+        # Aumentar tamaño
-        # Reducir tamaño
=        # Igualar tamaño de todos los panes
```

**Floating Panes (exclusivo de Zellij):**

```bash
# Toggle floating pane layer
Ctrl+p → w

# Dentro de floating layer:
# - Los panes flotan sobre los fijos
# - Perfectos para htop, logs temporales, etc.
# - Se pueden mover y redimensionar libremente

# Mover floating pane
Ctrl+p → m (en modo pane, luego arrastra o usa flechas)
```

### Tabs: Pestañas de Trabajo

**Tab = Pantalla completa con sus propios panes (equivale a Window en Tmux)**

```bash
# Entrar modo tab: Ctrl+t
# Dentro del modo tab:
n        # Nuevo tab
x        # Cerrar tab actual
r        # Renombrar tab
h/l      # Tab anterior/siguiente (vi-style)
1-9      # Ir a tab por número

# Reordenar tabs:
[        # Mover tab a la izquierda
]        # Mover tab a la derecha

# Sync panes (escribir en todos):
s        # Toggle sync (todo lo que escribas va a todos los panes)
```

**Visualización de tabs:**

```
│ Tab 1: editor │ Tab 2: servers │ Tab 3: db │ + │
                       ▲
                 Tab activo (resaltado)
```

### Sessions: Contenedores de Trabajo

**Session = Grupo de tabs relacionados que persisten**

```bash
# Comandos de sesión desde terminal:
zellij                        # Nueva sesión anónima
zellij -s mi-proyecto         # Nueva sesión nombrada
zellij list-sessions          # Listar sesiones activas
zellij attach mi-proyecto     # Conectar a sesión existente
zellij attach -c mi-proyecto  # Crear si no existe, attach si existe
zellij kill-session mi-proyecto  # Terminar sesión

# Dentro de Zellij:
Ctrl+o                        # Modo session
# Dentro del modo session:
d        # Detach (salir pero dejar corriendo)
w        # Session manager (selector visual)
```

**Session Manager (Ctrl+o → w):**

```
┌─────────── Session Manager ───────────┐
│                                       │
│  > desarrollo    [3 tabs] [attached]  │
│    produccion    [2 tabs]             │
│    testing       [1 tab]              │
│                                       │
│  [Enter] Attach  [n] New  [d] Delete  │
└───────────────────────────────────────┘
```

**Detach y Reattach (sesiones persistentes):**

```bash
# Detach (dentro de Zellij)
Ctrl+o → d

# La sesión sigue corriendo en background
# Tus servidores, editores, etc. siguen activos

# Reattach desde otra terminal o después de reiniciar terminal
zellij attach mi-proyecto

# Listar para ver qué sesiones existen
zellij ls
# Output:
# mi-proyecto [Created 2h ago] (3 tabs)
# produccion [Created 1d ago] (2 tabs)
```

### Modos de Operación

Una característica única de Zellij es su sistema de modos con hints visuales:

```
┌─────────────────────────────────────────────────────────────┐
│ ... contenido del terminal ...                              │
├─────────────────────────────────────────────────────────────┤
│ PANE │ n new │ d down │ r right │ x close │ f fullscreen │  │
└─────────────────────────────────────────────────────────────┘
         ▲
    Hints del modo actual (autodescubrible)
```

**Modos principales:**

| Modo | Atajo | Propósito |
|------|-------|-----------|
| **Normal** | (default) | Escribir en terminal |
| **Locked** | `Ctrl+g` | Desactiva todos los atajos de Zellij |
| **Pane** | `Ctrl+p` | Crear, cerrar, navegar panes |
| **Tab** | `Ctrl+t` | Crear, cerrar, navegar tabs |
| **Resize** | `Ctrl+n` | Redimensionar panes |
| **Move** | `Ctrl+h` | Mover panes de posición |
| **Search** | `Ctrl+s` | Buscar en scrollback |
| **Session** | `Ctrl+o` | Gestionar sesiones |
| **Scroll** | `Ctrl+f` | Scroll en historial |
| **Tmux** | (config) | Modo compatible con Tmux |

**Flujo típico:**
1. Estás en modo Normal escribiendo comandos
2. Presionas `Ctrl+p` para entrar modo Pane
3. Los hints aparecen mostrando opciones
4. Presionas `n` para crear nuevo pane
5. Vuelves automáticamente a modo Normal

## Sistema de Layouts

### ¿Qué Son los Layouts?

Los layouts son archivos KDL que definen la estructura de panes y tabs. Son el equivalente a "scripts de setup" en Tmux, pero declarativos y más legibles.

**Ventajas:**
- ✅ Versionables en Git
- ✅ Compartibles con el equipo
- ✅ Reproducibles instantáneamente
- ✅ Legibles sin documentación

### Layout Básico: Development

```kdl
// ~/.config/zellij/layouts/dev.kdl
layout {
    // Configuración del layout
    default_tab_template {
        pane size=1 borderless=true {
            plugin location="zellij:tab-bar"
        }
        children
        pane size=2 borderless=true {
            plugin location="zellij:status-bar"
        }
    }

    // Tab 1: Editor con terminal lateral
    tab name="editor" focus=true {
        pane split_direction="vertical" {
            pane name="code" size="70%" command="nvim"
            pane name="terminal" size="30%"
        }
    }

    // Tab 2: Servidores de desarrollo
    tab name="servers" {
        pane split_direction="horizontal" {
            pane name="backend" size="50%" {
                command "npm"
                args "run" "dev:backend"
                cwd "/projects/my-app/backend"
            }
            pane name="frontend" size="50%" {
                command "npm"
                args "run" "dev:frontend"
                cwd "/projects/my-app/frontend"
            }
        }
    }

    // Tab 3: Tests en watch mode
    tab name="tests" {
        pane command="npm" {
            args "run" "test:watch"
        }
    }
}
```

**Usar el layout:**

```bash
# Iniciar Zellij con layout específico
zellij --layout dev

# O configurar como default
# En config.kdl:
# default_layout "dev"
```

### Layout Avanzado: Microservicios

```kdl
// ~/.config/zellij/layouts/microservices.kdl
layout {
    default_tab_template {
        pane size=1 borderless=true {
            plugin location="zellij:tab-bar"
        }
        children
        pane size=2 borderless=true {
            plugin location="zellij:status-bar"
        }
    }

    // Tab de overview con todos los servicios
    tab name="overview" focus=true {
        pane split_direction="vertical" {
            // Columna izquierda: servicios core
            pane split_direction="horizontal" size="50%" {
                pane name="auth-service" {
                    command "docker"
                    args "compose" "up" "auth"
                    cwd "/projects/platform"
                }
                pane name="user-service" {
                    command "docker"
                    args "compose" "up" "users"
                    cwd "/projects/platform"
                }
            }
            // Columna derecha: servicios auxiliares
            pane split_direction="horizontal" size="50%" {
                pane name="api-gateway" {
                    command "docker"
                    args "compose" "up" "gateway"
                    cwd "/projects/platform"
                }
                pane name="logs" {
                    command "docker"
                    args "compose" "logs" "-f"
                    cwd "/projects/platform"
                }
            }
        }
    }

    // Tab de monitoring
    tab name="monitor" {
        pane split_direction="horizontal" {
            pane name="htop" size="50%" command="htop"
            pane name="docker-stats" size="50%" {
                command "docker"
                args "stats"
            }
        }
    }

    // Tab de database
    tab name="database" {
        pane name="psql" {
            command "psql"
            args "-h" "localhost" "-U" "postgres" "-d" "app_db"
        }
    }
}
```

### Layout con Floating Panes

```kdl
// ~/.config/zellij/layouts/with-floating.kdl
layout {
    default_tab_template {
        pane size=1 borderless=true {
            plugin location="zellij:tab-bar"
        }
        children
        pane size=2 borderless=true {
            plugin location="zellij:status-bar"
        }
    }

    tab name="main" {
        // Panes fijos
        pane split_direction="vertical" {
            pane name="editor" size="70%" command="nvim"
            pane name="terminal" size="30%"
        }

        // Floating panes (aparecen encima)
        floating_panes {
            pane name="htop" {
                command "htop"
                x 10
                y 5
                width 80
                height 20
            }
            pane name="lazygit" {
                command "lazygit"
                x "50%"
                y "50%"
                width "80%"
                height "80%"
            }
        }
    }
}
```

### Layouts Built-in

Zellij incluye layouts predefinidos:

```bash
# Ver layouts disponibles
zellij setup --list-layouts

# Layouts comunes:
zellij --layout default     # Un tab, un pane
zellij --layout compact     # Minimal status bar
zellij --layout disable-status-bar  # Sin status bar

# Strider (file manager integrado)
zellij --layout strider     # File browser + terminal
```

### Crear Layout desde Sesión Actual

```bash
# Dentro de Zellij, puedes exportar tu layout actual:
# (Esta feature requiere versión 0.38+)

# Dumpar layout actual
zellij action dump-layout > my-current-layout.kdl

# El archivo resultante contendrá la estructura exacta
# de tabs y panes que tienes actualmente
```

## Keybindings Esenciales

### Referencia Rápida por Modo

**Modo Normal (default):**
```bash
Ctrl+p    # → Modo Pane
Ctrl+t    # → Modo Tab
Ctrl+n    # → Modo Resize
Ctrl+h    # → Modo Move
Ctrl+s    # → Modo Search
Ctrl+o    # → Modo Session
Ctrl+f    # → Modo Scroll
Ctrl+g    # → Modo Locked (desactiva atajos)
Ctrl+q    # Quit (cerrar Zellij)
```

**Modo Pane (Ctrl+p):**
```bash
n        # Nuevo pane (dirección default)
d        # Nuevo pane abajo
r        # Nuevo pane derecha
x        # Cerrar pane
f        # Fullscreen toggle
w        # Toggle floating panes
e        # Embed floating pane to tiled
z        # Toggle pane frames
h/j/k/l  # Navegar panes (vi-style)
←/↓/↑/→  # Navegar panes (flechas)
Enter    # Volver a Normal mode
Esc      # Volver a Normal mode
```

**Modo Tab (Ctrl+t):**
```bash
n        # Nuevo tab
x        # Cerrar tab
r        # Renombrar tab
h/l      # Tab anterior/siguiente
1-9      # Ir a tab número N
Tab      # Toggle último tab usado
[        # Mover tab izquierda
]        # Mover tab derecha
s        # Toggle sync (escribir en todos los panes)
b        # Break pane to new tab
Enter    # Volver a Normal mode
```

**Modo Session (Ctrl+o):**
```bash
d        # Detach (salir, sesión sigue corriendo)
w        # Session manager (selector)
Enter    # Volver a Normal mode
```

**Modo Resize (Ctrl+n):**
```bash
h/j/k/l  # Redimensionar en dirección
←/↓/↑/→  # Redimensionar con flechas
+        # Aumentar tamaño
-        # Reducir tamaño
=        # Igualar tamaños
Enter    # Volver a Normal mode
```

**Modo Scroll (Ctrl+f):**
```bash
j/k      # Scroll arriba/abajo
Ctrl+u   # Page up
Ctrl+d   # Page down
g        # Ir al inicio
G        # Ir al final
/        # Buscar (hacia adelante)
?        # Buscar (hacia atrás)
n        # Siguiente match
N        # Match anterior
e        # Editar scrollback en $EDITOR
Enter    # Volver a Normal mode
```

### Cheatsheet Visual

```
┌─────────────────────────────────────────────────────────────┐
│                    ZELLIJ CHEATSHEET                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  CAMBIAR MODO                    ACCIONES RÁPIDAS           │
│  ────────────                    ────────────────           │
│  Ctrl+p  Pane mode               Ctrl+q  Quit               │
│  Ctrl+t  Tab mode                                           │
│  Ctrl+n  Resize mode             EN CUALQUIER MODO          │
│  Ctrl+h  Move mode               ─────────────────          │
│  Ctrl+s  Search mode             Enter/Esc  → Normal        │
│  Ctrl+o  Session mode                                       │
│  Ctrl+f  Scroll mode             NAVEGACIÓN                 │
│  Ctrl+g  Lock mode               ──────────                 │
│                                  Alt+←/→/↑/↓  Mover focus   │
│  PANE MODE (Ctrl+p)              Alt+[/]      Tab prev/next │
│  ─────────────────                                          │
│  n  Nuevo pane        f  Fullscreen                         │
│  d  Pane abajo        w  Toggle floating                    │
│  r  Pane derecha      x  Cerrar pane                        │
│                                                             │
│  TAB MODE (Ctrl+t)               SESSION MODE (Ctrl+o)      │
│  ─────────────────               ──────────────────         │
│  n  Nuevo tab         r  Rename  d  Detach                  │
│  x  Cerrar tab        s  Sync    w  Session manager         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Workflows Avanzados

### Setup de Desarrollo Web

**Escenario típico:** Desarrollas una aplicación web fullstack con:
- Editor principal (Neovim)
- Backend server corriendo
- Frontend dev server
- Tests en watch mode
- Git operations

**Workflow con layouts:**

```bash
# Crear layout personalizado para tu proyecto
mkdir -p ~/.config/zellij/layouts

# Iniciar con tu layout
zellij --layout ~/.config/zellij/layouts/web-dev.kdl -s mi-proyecto
```

**Layout web-dev.kdl:**

```kdl
// ~/.config/zellij/layouts/web-dev.kdl
layout {
    default_tab_template {
        pane size=1 borderless=true {
            plugin location="zellij:tab-bar"
        }
        children
        pane size=2 borderless=true {
            plugin location="zellij:status-bar"
        }
    }

    // Tab 1: Editor principal
    tab name="editor" focus=true {
        pane split_direction="vertical" {
            pane name="code" size="70%" command="nvim" {
                args "."
            }
            pane split_direction="horizontal" size="30%" {
                pane name="terminal"
                pane name="git" {
                    command "lazygit"
                }
            }
        }
    }

    // Tab 2: Servidores
    tab name="servers" {
        pane split_direction="vertical" {
            pane name="backend" size="50%" {
                command "npm"
                args "run" "dev:backend"
            }
            pane name="frontend" size="50%" {
                command "npm"
                args "run" "dev:frontend"
            }
        }
    }

    // Tab 3: Tests
    tab name="tests" {
        pane name="test-runner" {
            command "npm"
            args "run" "test:watch"
        }
    }

    // Tab 4: Logs y monitoring
    tab name="logs" {
        pane split_direction="horizontal" {
            pane name="app-logs" size="70%" {
                command "tail"
                args "-f" "logs/app.log"
            }
            pane name="htop" size="30%" command="htop"
        }
    }
}
```

**Uso diario:**

```bash
# Alias recomendado en ~/.zshrc
alias webdev="zellij --layout web-dev -s web-$(basename $PWD)"

# Iniciar desarrollo
cd ~/projects/mi-app
webdev

# Navegar entre tabs
Ctrl+t → 1-4  # Ir a tab por número
Ctrl+t → h/l  # Tab anterior/siguiente

# Ver logs temporalmente (floating pane)
Ctrl+p → w    # Activar floating
Ctrl+p → n    # Nuevo pane flotante
tail -f logs/error.log

# Cerrar floating y volver al trabajo
Ctrl+p → w    # Toggle floating off
```

### Desarrollo con Microservicios

**Escenario:** Plataforma con múltiples servicios Docker.

```bash
# Iniciar con layout de microservicios
zellij --layout microservices -s platform-dev
```

**Workflow típico:**

```bash
# Tab 1: Overview (todos los servicios)
# Ya definido en el layout, muestra:
# ┌───────────────┬───────────────┐
# │ auth-service  │ api-gateway   │
# ├───────────────┼───────────────┤
# │ user-service  │ logs (docker) │
# └───────────────┴───────────────┘

# Navegar entre servicios
Alt+←/→/↑/↓   # Mover focus entre panes

# Zoom en un servicio específico
Ctrl+p → f    # Fullscreen toggle

# Ver logs de un servicio específico (floating)
Ctrl+p → w → n
docker logs -f auth-service

# Reiniciar un servicio
# Navegar al pane del servicio
Ctrl+c        # Matar proceso actual
docker compose up auth  # Reiniciar

# Sync input (escribir en todos los panes)
Ctrl+t → s    # Toggle sync
# Ahora todo lo que escribas va a todos los panes del tab
# Útil para: exit, clear, comandos comunes
Ctrl+t → s    # Toggle off cuando termines
```

### Desarrollo con Pair Programming

**Escenario:** Sesión compartida con colega remoto.

```bash
# Host: Crear sesión nombrada
zellij -s pair-session

# Guest: Conectar a la misma sesión (si tienen acceso al mismo server)
ssh user@host -t zellij attach pair-session

# Ambos ven y pueden interactuar con la misma sesión
# Los cambios son instantáneos para ambos
```

**Configuración para pair programming:**

```kdl
// ~/.config/zellij/config.kdl

// Habilitar mirror para pair programming
mirror_session true

// Serializar sesiones para recuperación
session_serialization true
```

### Workflow de Debugging

**Escenario:** Investigar un bug en producción.

```bash
# Layout rápido para debugging
zellij action new-tab --name "debug" --layout debug

# O crear tab manualmente:
Ctrl+t → n                    # Nuevo tab
Ctrl+t → r → debug → Enter    # Renombrar

# Setup de panes para debugging
Ctrl+p → r                    # Pane derecha (logs)
Ctrl+p → d                    # Pane abajo (en izquierdo, para DB)

# Resultado:
# ┌─────────────────┬─────────────────┐
# │ Terminal (curl) │                 │
# │                 │  Logs (tail)    │
# ├─────────────────┤                 │
# │ DB (psql/redis) │                 │
# └─────────────────┴─────────────────┘

# Búsqueda en logs (scroll mode)
# En el pane de logs:
Ctrl+f                # Entrar scroll mode
/ERROR               # Buscar "ERROR"
n                    # Siguiente match
N                    # Match anterior
e                    # Abrir en editor para análisis
```

### Scripts de Automatización

**Script para iniciar proyecto automáticamente:**

```bash
#!/bin/bash
# ~/.scripts/zellij-project.sh

PROJECT_NAME=$1
PROJECT_PATH=${2:-$(pwd)}

if [ -z "$PROJECT_NAME" ]; then
    echo "Usage: zellij-project.sh <project-name> [path]"
    exit 1
fi

# Verificar si sesión existe
if zellij list-sessions | grep -q "$PROJECT_NAME"; then
    echo "Attaching to existing session: $PROJECT_NAME"
    zellij attach "$PROJECT_NAME"
else
    echo "Creating new session: $PROJECT_NAME"
    cd "$PROJECT_PATH"

    # Detectar tipo de proyecto y usar layout apropiado
    if [ -f "docker-compose.yml" ]; then
        zellij --layout microservices -s "$PROJECT_NAME"
    elif [ -f "package.json" ]; then
        zellij --layout web-dev -s "$PROJECT_NAME"
    elif [ -f "Cargo.toml" ]; then
        zellij --layout rust-dev -s "$PROJECT_NAME"
    else
        zellij --layout default -s "$PROJECT_NAME"
    fi
fi
```

**Aliases útiles:**

```bash
# ~/.zshrc

# Zellij básicos
alias zj="zellij"
alias zja="zellij attach"
alias zjl="zellij list-sessions"
alias zjk="zellij kill-session"
alias zjd="zellij delete-session"

# Por proyecto
alias zj-web="zellij --layout web-dev"
alias zj-micro="zellij --layout microservices"

# Función inteligente
zj-project() {
    ~/.scripts/zellij-project.sh "$@"
}

# Auto-attach o crear
zj-auto() {
    local session="${1:-default}"
    zellij attach -c "$session"  # -c = create if not exists
}
```

## Sistema de Plugins

### Arquitectura de Plugins

Zellij usa **WebAssembly (WASM)** para plugins, lo que permite:
- ✅ **Seguridad**: Plugins ejecutan en sandbox aislado
- ✅ **Portabilidad**: Mismos plugins funcionan en todas las plataformas
- ✅ **Performance**: WASM es casi tan rápido como código nativo
- ✅ **Lenguaje agnóstico**: Escribe plugins en Rust, Go, C, etc.

```
┌─────────────────────────────────────────────────────────────┐
│                    Zellij Server                            │
├─────────────────────────────────────────────────────────────┤
│  Plugin Host (WASM Runtime)                                 │
│  ┌──────────────┬──────────────┬──────────────┐             │
│  │ tab-bar.wasm │status-bar.wasm│strider.wasm │             │
│  │ (built-in)   │  (built-in)   │ (built-in)  │             │
│  └──────────────┴──────────────┴──────────────┘             │
│  ┌──────────────────────────────────────────────┐           │
│  │          Custom Plugins (.wasm)               │           │
│  └──────────────────────────────────────────────┘           │
├─────────────────────────────────────────────────────────────┤
│  Zellij API (Events, Actions, UI)                           │
└─────────────────────────────────────────────────────────────┘
```

### Plugins Built-in

**tab-bar**: Barra de tabs en la parte superior

```kdl
// Incluido por defecto en layouts
pane size=1 borderless=true {
    plugin location="zellij:tab-bar"
}
```

**status-bar**: Barra de estado con hints de keybindings

```kdl
// Muestra modos y acciones disponibles
pane size=2 borderless=true {
    plugin location="zellij:status-bar"
}
```

**compact-bar**: Versión compacta de tab-bar + status-bar

```kdl
// Una sola línea con tabs y modo actual
pane size=1 borderless=true {
    plugin location="zellij:compact-bar"
}
```

**strider**: File manager integrado

```kdl
// Browser de archivos en panel lateral
pane size="20%" {
    plugin location="zellij:strider"
}
```

### Usar Plugins en Layouts

**Layout con strider (file manager):**

```kdl
// ~/.config/zellij/layouts/with-strider.kdl
layout {
    default_tab_template {
        pane size=1 borderless=true {
            plugin location="zellij:tab-bar"
        }
        children
        pane size=2 borderless=true {
            plugin location="zellij:status-bar"
        }
    }

    tab name="editor" {
        pane split_direction="vertical" {
            // File browser a la izquierda
            pane size="20%" {
                plugin location="zellij:strider"
            }
            // Editor principal
            pane size="80%" command="nvim"
        }
    }
}
```

**Layout minimalista (compact-bar):**

```kdl
// ~/.config/zellij/layouts/minimal.kdl
layout {
    default_tab_template {
        // Solo una línea para todo
        pane size=1 borderless=true {
            plugin location="zellij:compact-bar"
        }
        children
        // Sin status-bar adicional
    }

    tab name="main" {
        pane
    }
}
```

### Plugins de la Comunidad

**Instalación de plugins externos:**

```bash
# Los plugins se descargan como archivos .wasm
# Directorio de plugins:
mkdir -p ~/.config/zellij/plugins

# Ejemplo: descargar plugin (hipotético)
curl -L https://example.com/my-plugin.wasm \
    -o ~/.config/zellij/plugins/my-plugin.wasm
```

**Usar plugin externo en layout:**

```kdl
// Referencia a plugin local
pane {
    plugin location="file:~/.config/zellij/plugins/my-plugin.wasm"
}
```

**Plugins populares de la comunidad:**

| Plugin | Descripción | Uso |
|--------|-------------|-----|
| **zellij-forgot** | Muestra keybindings olvidados | Aprendizaje |
| **zjstatus** | Status bar personalizable | UI |
| **zellij-nav** | Navegación estilo vim | Productividad |
| **room** | Sesiones por directorio | Organización |

### Configurar Plugins

**En config.kdl:**

```kdl
// ~/.config/zellij/config.kdl

plugins {
    // Plugins built-in
    tab-bar { path "tab-bar"; }
    status-bar { path "status-bar"; }
    strider { path "strider"; }
    compact-bar { path "compact-bar"; }

    // Plugin externo
    my-plugin { path "file:~/.config/zellij/plugins/my-plugin.wasm"; }
}
```

### Desarrollo de Plugins (Avanzado)

**Para crear plugins personalizados, necesitas:**

1. **Rust toolchain**:
```bash
rustup target add wasm32-wasi
```

2. **Template de plugin**:
```bash
cargo new --lib my-zellij-plugin
```

3. **Cargo.toml**:
```toml
[package]
name = "my-zellij-plugin"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
zellij-tile = "0.40"
```

4. **src/lib.rs básico**:
```rust
use zellij_tile::prelude::*;

#[derive(Default)]
struct MyPlugin;

register_plugin!(MyPlugin);

impl ZellijPlugin for MyPlugin {
    fn load(&mut self, configuration: BTreeMap<String, String>) {
        // Inicialización
    }

    fn render(&mut self, rows: usize, cols: usize) {
        // Renderizar UI
        println!("Hello from my plugin!");
    }
}
```

5. **Compilar**:
```bash
cargo build --release --target wasm32-wasi
# Output: target/wasm32-wasi/release/my_zellij_plugin.wasm
```

**Documentación completa**: https://zellij.dev/documentation/plugins

## Integración con Herramientas

### Con Neovim/LazyVim

**Navegación seamless entre Zellij panes y Vim splits:**

```lua
-- ~/.config/nvim/lua/plugins/zellij.lua
-- Plugin: https://github.com/zellij-org/zellij-nav.nvim
return {
    {
        "swaits/zellij-nav.nvim",
        lazy = true,
        event = "VeryLazy",
        keys = {
            { "<C-h>", "<cmd>ZellijNavigateLeft<cr>", desc = "Navigate left" },
            { "<C-j>", "<cmd>ZellijNavigateDown<cr>", desc = "Navigate down" },
            { "<C-k>", "<cmd>ZellijNavigateUp<cr>", desc = "Navigate up" },
            { "<C-l>", "<cmd>ZellijNavigateRight<cr>", desc = "Navigate right" },
        },
        config = true,
    },
}
```

**En Zellij config, habilitar passthrough:**

```kdl
// ~/.config/zellij/config.kdl
keybinds {
    shared_except "locked" {
        // Pasar Ctrl+h/j/k/l a la aplicación cuando está en Neovim
        bind "Ctrl h" { MoveFocusOrTab "Left"; }
        bind "Ctrl j" { MoveFocus "Down"; }
        bind "Ctrl k" { MoveFocus "Up"; }
        bind "Ctrl l" { MoveFocusOrTab "Right"; }
    }
}
```

### Con Git/Lazygit

**Layout optimizado para Git workflows:**

```kdl
// ~/.config/zellij/layouts/git-workflow.kdl
layout {
    default_tab_template {
        pane size=1 borderless=true {
            plugin location="zellij:compact-bar"
        }
        children
    }

    tab name="code" focus=true {
        pane split_direction="vertical" {
            pane size="70%" command="nvim" { args "."; }
            pane size="30%"
        }
    }

    tab name="git" {
        pane command="lazygit"
    }

    tab name="history" {
        pane command="git" {
            args "log" "--oneline" "--graph" "--all"
        }
    }
}
```

### Con Docker

**Aliases para desarrollo con containers:**

```bash
# ~/.zshrc

# Docker dentro de Zellij
zj-docker() {
    zellij action new-tab --name "docker"
    zellij action write-chars "docker compose up -d && docker compose logs -f"
    zellij action write 13  # Enter
}

# Monitorear containers en floating pane
zj-docker-stats() {
    zellij action toggle-floating-panes
    zellij action new-pane --floating
    zellij action write-chars "docker stats"
    zellij action write 13
}
```

### Con SSH

**Sesiones persistentes en servidores remotos:**

```bash
# Conectar a servidor y crear/attach sesión
ssh user@server -t "zellij attach -c production"

# El flag -t fuerza TTY allocation
# -c = create session if doesn't exist

# Alias para servidores frecuentes
alias prod="ssh user@prod-server -t 'zellij attach -c prod'"
alias staging="ssh user@staging -t 'zellij attach -c staging'"
```

**Beneficio:** Si se cae la conexión SSH, la sesión de Zellij sigue corriendo. Solo reconectas.

## Migración desde Tmux

### Tabla de Equivalencias

| Acción | Tmux | Zellij |
|--------|------|--------|
| **Iniciar** | `tmux` | `zellij` |
| **Nueva sesión nombrada** | `tmux new -s name` | `zellij -s name` |
| **Listar sesiones** | `tmux ls` | `zellij ls` |
| **Attach** | `tmux attach -t name` | `zellij attach name` |
| **Detach** | `Ctrl+b d` | `Ctrl+o d` |
| **Nueva window/tab** | `Ctrl+b c` | `Ctrl+t n` |
| **Split horizontal** | `Ctrl+b "` | `Ctrl+p d` |
| **Split vertical** | `Ctrl+b %` | `Ctrl+p r` |
| **Navegar panes** | `Ctrl+b ←/→/↑/↓` | `Ctrl+p h/j/k/l` o `Alt+←/→/↑/↓` |
| **Cerrar pane** | `Ctrl+b x` | `Ctrl+p x` |
| **Zoom pane** | `Ctrl+b z` | `Ctrl+p f` |
| **Renombrar window** | `Ctrl+b ,` | `Ctrl+t r` |
| **Siguiente window** | `Ctrl+b n` | `Ctrl+t l` o `Ctrl+t n` |
| **Anterior window** | `Ctrl+b p` | `Ctrl+t h` o `Ctrl+t p` |
| **Copy mode** | `Ctrl+b [` | `Ctrl+f` (scroll mode) |
| **Sync panes** | `Ctrl+b :setw synchronize-panes` | `Ctrl+t s` |

### Keybindings Tmux-Compatible

Zellij puede configurarse para usar keybindings similares a Tmux:

```kdl
// ~/.config/zellij/config.kdl

keybinds {
    // Modo tmux: Ctrl+a como prefix
    normal {
        bind "Ctrl a" { SwitchToMode "tmux"; }
    }

    tmux {
        // Salir del modo tmux
        bind "Ctrl a" { Write 1; SwitchToMode "Normal"; }
        bind "Esc" { SwitchToMode "Normal"; }

        // Splits (igual que tmux)
        bind "\"" { NewPane "Down"; SwitchToMode "Normal"; }
        bind "%" { NewPane "Right"; SwitchToMode "Normal"; }

        // Windows/Tabs
        bind "c" { NewTab; SwitchToMode "Normal"; }
        bind "," { SwitchToMode "RenameTab"; }
        bind "n" { GoToNextTab; SwitchToMode "Normal"; }
        bind "p" { GoToPreviousTab; SwitchToMode "Normal"; }
        bind "w" { GoToTab 1; SwitchToMode "Normal"; }
        bind "1" { GoToTab 1; SwitchToMode "Normal"; }
        bind "2" { GoToTab 2; SwitchToMode "Normal"; }
        bind "3" { GoToTab 3; SwitchToMode "Normal"; }
        bind "4" { GoToTab 4; SwitchToMode "Normal"; }
        bind "5" { GoToTab 5; SwitchToMode "Normal"; }

        // Panes
        bind "z" { ToggleFocusFullscreen; SwitchToMode "Normal"; }
        bind "x" { CloseFocus; SwitchToMode "Normal"; }
        bind "o" { FocusNextPane; SwitchToMode "Normal"; }

        // Navegación vi-style
        bind "h" { MoveFocus "Left"; SwitchToMode "Normal"; }
        bind "j" { MoveFocus "Down"; SwitchToMode "Normal"; }
        bind "k" { MoveFocus "Up"; SwitchToMode "Normal"; }
        bind "l" { MoveFocus "Right"; SwitchToMode "Normal"; }

        // Session
        bind "d" { Detach; }
        bind "(" { SwitchToMode "Session"; }

        // Copy mode
        bind "[" { SwitchToMode "Scroll"; }
    }
}
```

### Migrar Scripts de Tmux

**Script Tmux original:**

```bash
#!/bin/bash
# tmux-dev.sh
tmux new-session -d -s dev
tmux rename-window -t dev:1 'editor'
tmux send-keys -t dev:1 'nvim .' C-m
tmux new-window -t dev:2 -n 'servers'
tmux split-window -h -t dev:2
tmux send-keys -t dev:2.1 'npm run dev:backend' C-m
tmux send-keys -t dev:2.2 'npm run dev:frontend' C-m
tmux select-window -t dev:1
tmux attach -t dev
```

**Equivalente en Zellij (layout file):**

```kdl
// ~/.config/zellij/layouts/dev.kdl
layout {
    default_tab_template {
        pane size=1 borderless=true {
            plugin location="zellij:tab-bar"
        }
        children
        pane size=2 borderless=true {
            plugin location="zellij:status-bar"
        }
    }

    tab name="editor" focus=true {
        pane command="nvim" {
            args "."
        }
    }

    tab name="servers" {
        pane split_direction="vertical" {
            pane command="npm" {
                args "run" "dev:backend"
            }
            pane command="npm" {
                args "run" "dev:frontend"
            }
        }
    }
}
```

**Uso:**
```bash
# En lugar de: ./tmux-dev.sh
zellij --layout dev -s dev
```

### Diferencias Clave a Tener en Cuenta

**1. Modos vs Prefix:**
- **Tmux**: `Ctrl+b` + comando (prefix mode)
- **Zellij**: Modos dedicados con hints (`Ctrl+p` para panes, `Ctrl+t` para tabs)

**2. Configuración:**
- **Tmux**: `~/.tmux.conf` (sintaxis propia)
- **Zellij**: `~/.config/zellij/config.kdl` (formato KDL moderno)

**3. Layouts:**
- **Tmux**: Scripts bash que envían comandos
- **Zellij**: Archivos declarativos KDL

**4. Plugins:**
- **Tmux**: Scripts bash/shell
- **Zellij**: Binarios WASM (sandboxed)

**5. UI:**
- **Tmux**: Sin hints por defecto
- **Zellij**: Hints siempre visibles (desactivables)

### Plan de Migración Gradual

**Semana 1: Familiarización**
```bash
# Instalar Zellij junto a Tmux
brew install zellij

# Usar Zellij para tareas simples
zellij  # Sin configuración, solo explorar

# Aprender modos básicos:
# Ctrl+p → crear/navegar panes
# Ctrl+t → crear/navegar tabs
# Ctrl+o → sesiones
```

**Semana 2: Configuración básica**
```bash
# Crear config con keybindings Tmux-like
zellij setup --dump-config > ~/.config/zellij/config.kdl

# Añadir keybindings Tmux (ver sección anterior)
# Probar flujo de trabajo básico
```

**Semana 3: Layouts**
```bash
# Convertir tus scripts Tmux a layouts Zellij
# Crear layouts para tus proyectos principales
# Configurar aliases
```

**Semana 4: Migración completa**
```bash
# Usar Zellij como principal
# Mantener Tmux como backup
# Documentar diferencias que encuentres
```

## Troubleshooting

### Problemas Comunes

**Zellij no inicia:**
```bash
# Verificar versión
zellij --version

# Verificar que no hay sesión corrupta
rm -rf /tmp/zellij-*

# Iniciar con debug
RUST_LOG=debug zellij
```

**Colores incorrectos:**
```bash
# Verificar TERM
echo $TERM  # Debe ser algo como xterm-256color

# En tu shell config:
export TERM=xterm-256color

# En config.kdl si persiste:
env {
    TERM "xterm-256color"
}
```

**Mouse no funciona:**
```kdl
// ~/.config/zellij/config.kdl
mouse_mode true
```

**Copy al clipboard no funciona:**
```kdl
// Para macOS:
copy_command "pbcopy"

// Para Linux con xclip:
copy_command "xclip -selection clipboard"

// Para Linux con wl-copy (Wayland):
copy_command "wl-copy"
```

**Keybindings no responden:**
```bash
# Verificar que no estás en modo "locked"
# Si ves "LOCKED" en status bar:
Ctrl+g  # Toggle lock mode

# Verificar config
zellij setup --check
```

**Sesión no se puede recuperar:**
```bash
# Listar sesiones
zellij ls

# Si una sesión está corrupta:
zellij delete-session nombre-sesion

# Forzar kill
zellij kill-session nombre-sesion

# Nuclear option: matar todo
pkill -f zellij
```

### Comandos de Diagnóstico

```bash
# Ver configuración actual
zellij setup --check

# Listar layouts disponibles
zellij setup --list-layouts

# Generar config default para comparar
zellij setup --dump-config

# Ver plugins disponibles
zellij plugin --list

# Debug mode
RUST_LOG=zellij=debug zellij 2>&1 | tee zellij-debug.log
```

### Obtener Ayuda

```bash
# Ayuda general
zellij --help

# Ayuda de subcomando
zellij attach --help
zellij action --help

# Documentación oficial
# https://zellij.dev/documentation

# GitHub issues
# https://github.com/zellij-org/zellij/issues
```

## Conclusión

**Zellij representa el futuro del terminal multiplexing.** No es solo una alternativa a Tmux - es una reimaginación de cómo debería funcionar un multiplexor moderno.

**Para quién es:**
- ✅ Desarrolladores que valoran UX moderna
- ✅ Equipos que quieren compartir configuraciones
- ✅ Usuarios nuevos en terminal multiplexing
- ✅ Quienes buscan extensibilidad via plugins

**Principio**: Si necesitas memorizar todo antes de ser productivo, la herramienta falló en su diseño.

> *"Tmux te hace poderoso después de semanas de práctica. Zellij te hace productivo desde el minuto uno."*

Relacionado: [Tmux](./tmux.md) para el enfoque tradicional probado, [LazyVim](./lazyvim.md) para edición modal moderna.
