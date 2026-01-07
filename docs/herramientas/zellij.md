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

## Conceptos Básicos

> **📝 Sección en desarrollo.** Próximamente: Layout system, Panes vs Tabs, Sessions management, Keybindings intuitivos.

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
