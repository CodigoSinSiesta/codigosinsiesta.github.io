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

> **📝 Sección en desarrollo.** Próximamente: Layouts personalizados, Plugin ecosystem, Integración con herramientas, Scripting capabilities.

## Migración desde Tmux

> **📝 Sección en desarrollo.** Próximamente: Equivalencias de comandos, Keybindings translation, Config files migration, Troubleshooting.

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
