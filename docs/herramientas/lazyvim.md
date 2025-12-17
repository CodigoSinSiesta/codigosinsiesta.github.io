---
sidebar_position: 1
---

# LazyVim

La configuración de Neovim que te hace **competitivo con VS Code** pero manteniendo el control total. Si estás cansado de IDEs pesados y quieres velocidad real, LazyVim es tu camino.

## ¿Por Qué Abandonar VS Code?

### El Problema con IDEs Modernos

**VS Code y similares son comodidad con costo oculto:**

- 🔴 **Performance decay**: Cada extensión añade 5-20ms de latency
- 🔴 **Batería killer**: 3-5x más consumo que terminal + Neovim
- 🔴 **Context switching**: Mouse clicks para todo
- 🔴 **Vendor lock-in**: Dependes de Microsoft/GitHub
- 🔴 **Resource heavy**: 500MB+ RAM para proyectos medianos

**Resultado**: Desarrolladores pasan **15-30 minutos diarios** esperando que el IDE responda.

### Neovim + LazyVim: La Alternativa Realista

**Ventajas concretas:**
- 🟢 **< 100ms response time** (siempre)
- 🟢 **< 50MB RAM** típico uso
- 🟢 **Batería de 8+ horas** en laptop
- 🟢 **Keyboard-first workflow** (10x más rápido)
- 🟢 **Configuración como código** (versionable, reproducible)
- 🟢 **Terminal integrado** (no más switching)

## Instalación: De VS Code a LazyVim

### Prerrequisitos

```bash
# Instalar Neovim 0.9+
brew install neovim

# Verificar versión
nvim --version  # Debe ser 0.9.x o superior

# Instalar herramientas necesarias
brew install ripgrep fd lazygit

# Instalar fuente con ligatures (opcional pero recomendado)
brew tap homebrew/cask-fonts
brew install --cask font-fira-code
```

### Backup y Limpieza

```bash
# Backup VS Code settings (opcional)
cp ~/Library/Application\ Support/Code/User/settings.json ~/vscode-backup.json

# Desinstalar extensiones pesadas de VS Code (opcional)
code --uninstall-extension ms-vscode.vscode-typescript-next
code --uninstall-extension ms-vscode-remote.remote-containers
```

### Instalar LazyVim

```bash
# Backup config existente (si tienes)
mv ~/.config/nvim ~/.config/nvim.backup

# Clonar LazyVim starter
git clone https://github.com/LazyVim/starter ~/.config/nvim

# Remover .git para tu propia configuración
rm -rf ~/.config/nvim/.git

# Entrar a Neovim (primera vez instala plugins)
nvim
```

**Primera ejecución toma 5-10 minutos** mientras instala plugins.

### Verificación

```bash
# Abrir Neovim
nvim

# Verificar instalación
:Lazy  # Debe mostrar interface de Lazy
:checkhealth  # Debe pasar todos los checks
```

## Arquitectura: Plugins Lazy-Loaded

### ¿Cómo Funciona Lazy Loading?

**LazyVim carga plugins solo cuando los necesitas:**

```lua
-- Ejemplo: Plugin se carga solo al abrir archivo TypeScript
{
  "neovim/nvim-lspconfig",
  event = "BufReadPre *.ts,*.tsx",  -- Lazy load trigger
  config = function()
    -- Configuración aquí
  end
}
```

**Resultado:** Startup time de **50-200ms** en lugar de segundos.

### Estructura Modular

```
~/.config/lua/
├── config/          # Configuración general
│   ├── autocmds.lua
│   ├── keymaps.lua
│   ├── lazy.lua
│   └── options.lua
├── plugins/         # Plugins organizados por categoría
│   ├── coding.lua   # Autocomplete, snippets
│   ├── colorscheme.lua
│   ├── editor.lua   # Telescope, treesitter
│   ├── lsp.lua      # Language servers
│   ├── treesitter.lua
│   └── ui.lua       # Statusline, tabs
└── plugins.lua      # Punto de entrada
```

## Keybindings Esenciales

### Filosofía: Mnemonics

**LazyVim usa sistema mnemónico:**
- `<leader>` = `<space>` (fácil de presionar)
- `<leader>f` = **f**ind/files
- `<leader>s` = **s**earch
- `<leader>g` = **g**it
- `<leader>l` = **l**sp
- `<leader>c` = **c**ode

### Keybindings Críticos

```lua
-- Modo normal
<space>ff    -- Find files (Telescope)
<space>fg    -- Live grep (buscar en archivos)
<space>fb    -- Buffers abiertos
<space>fh    -- Help tags

<space>ss    -- Search/replace con spectre
<space>sw    -- Search word under cursor

<space>gg    -- Git status (lazygit)
<space>gb    -- Git branches
<space>gc    -- Git commits

<space>la    -- Code actions LSP
<space>ld    -- Go to definition
<space>lr    -- Rename symbol
<space>lf    -- Format code

<space>ca    -- Run code actions
<space>cf    -- Format buffer

<space>xx    -- Toggle trouble (diagnostics)
<space>xq    -- Quickfix list

-- Windows/panes
<C-h/j/k/l>  -- Navigate panes (vim-tmux-navigator)
<space>wv    -- Split vertical
<space>ws    -- Split horizontal
<space>wd    -- Close window

-- Terminal
<space>ft    -- Toggle terminal
<C-\>        -- Open terminal
```

### Customizar Keybindings

```lua
-- ~/.config/lua/config/keymaps.lua
local map = vim.keymap.set

-- Tu custom keybindings
map("n", "<leader>pv", "<cmd>Ex<CR>", { desc = "Project view" })
map("n", "<leader>pf", "<cmd>Telescope find_files<CR>", { desc = "Find files" })

-- Override existentes
map("n", "<C-s>", "<cmd>w<CR>", { desc = "Save file" })
```

## LSP: Desarrollo con Superpoderes

### Language Servers Configurados

**Por defecto incluye:**
- TypeScript/JavaScript
- Python
- Go
- Rust
- Lua
- JSON/YAML
- Markdown

### Añadir Nuevo LSP

```lua
-- ~/.config/lua/plugins/lsp.lua
return {
  {
    "neovim/nvim-lspconfig",
    opts = {
      servers = {
        -- Añadir nuevo servidor
        eslint = {},
        rust_analyzer = {
          settings = {
            ["rust-analyzer"] = {
              checkOnSave = {
                command = "clippy"
              }
            }
          }
        }
      }
    }
  }
}
```

### Formateo Automático

```lua
-- Formateo al guardar
vim.api.nvim_create_autocmd("BufWritePre", {
  pattern = { "*.ts", "*.tsx", "*.js", "*.jsx" },
  command = "lua vim.lsp.buf.format()"
})
```

## Plugins Recomendados

### Para Desarrollo Web

```lua
-- ~/.config/lua/plugins/coding.lua
return {
  -- Autocomplete mejorado
  {
    "hrsh7th/nvim-cmp",
    dependencies = {
      "hrsh7th/cmp-nvim-lsp",
      "hrsh7th/cmp-buffer",
      "hrsh7th/cmp-path",
      "saadparwaiz1/cmp_luasnip"
    }
  },

  -- Snippets
  {
    "L3MON4D3/LuaSnip",
    config = function()
      require("luasnip.loaders.from_vscode").lazy_load()
    end
  },

  -- Pairs inteligentes
  {
    "windwp/nvim-autopairs",
    event = "InsertEnter",
    config = true
  },

  -- Comentarios inteligentes
  {
    "numToStr/Comment.nvim",
    config = true
  }
}
```

### Para Git

```lua
-- ~/.config/lua/plugins/git.lua
return {
  -- LazyGit integrado
  {
    "kdheepak/lazygit.nvim",
    cmd = "LazyGit",
    keys = {
      { "<leader>gg", "<cmd>LazyGit<CR>", desc = "LazyGit" }
    }
  },

  -- Git blame inline
  {
    "f-person/git-blame.nvim",
    event = "BufReadPre"
  }
}
```

### Para Productividad

```lua
-- ~/.config/lua/plugins/productivity.lua
return {
  -- Búsqueda/reemplazo visual
  {
    "nvim-pack/nvim-spectre",
    keys = {
      { "<leader>sr", "<cmd>Spectre<CR>", desc = "Search and replace" }
    }
  },

  -- Multi-cursor
  {
    "mg979/vim-visual-multi",
    event = "BufReadPre"
  },

  -- Surround operations
  {
    "kylechui/nvim-surround",
    config = true
  }
}
```

## Performance Tuning

### Optimizar Startup Time

```lua
-- ~/.config/lua/config/lazy.lua
return {
  performance = {
    rtp = {
      disabled_plugins = {
        "gzip",
        "matchit",
        "matchparen",
        "netrwPlugin",
        "tarPlugin",
        "tohtml",
        "tutor",
        "zipPlugin",
      },
    },
  },
}
```

### Lazy Loading Estratégico

```lua
-- Solo cargar cuando necesites
{
  "nvim-telescope/telescope.nvim",
  cmd = "Telescope",  -- Cargar en comando
  keys = {            -- O en keybinding
    { "<leader>ff", "<cmd>Telescope find_files<CR>" }
  }
}
```

## Troubleshooting Común

### Plugin No Carga

```vim
:Lazy sync    # Sincronizar plugins
:Lazy clean   # Limpiar plugins no usados
:Lazy update  # Actualizar todos
```

### LSP No Funciona

```vim
:LspInfo      # Ver estado del LSP
:LspRestart   # Reiniciar LSP
```

### Keybinding No Funciona

```vim
:verbose map <leader>ff  # Ver qué comando está asignado
```

### Lentitud

```vim
:profile start profile.log
:profile func *
:profile file *
" Ejecutar acciones lentas
:profile stop
:e profile.log  # Ver qué consume tiempo
```

## Migración Gradual desde VS Code

### Semana 1: Básicos

```bash
# Instalar LazyVim
# Aprender navegación básica: h,j,k,l
# Usar para editar archivos simples
```

### Semana 2: LSP y Búsqueda

```bash
# Configurar LSP para tu lenguaje principal
# Aprender Telescope: <space>ff, <space>fg
# Reemplazar "Find in Files" de VS Code
```

### Semana 3: Git y Terminal

```bash
# Configurar lazygit: <space>gg
# Terminal integrado: <space>ft
# Reemplazar terminal externo
```

### Semana 4: Plugins y Customización

```bash
# Añadir plugins específicos de tu stack
# Customizar keybindings
# Crear autocmds para workflows
```

## Comparativa Real: LazyVim vs VS Code

### Tarea: Refactorizar Componente React

| Métrica | VS Code | LazyVim |
|---------|---------|---------|
| **Startup** | 3-5s | 0.2s |
| **RAM uso** | 600MB | 80MB |
| **Buscar archivo** | Cmd+P (0.5s) | `<space>ff` (0.1s) |
| **Buscar en código** | Cmd+Shift+F (2s) | `<space>fg` (0.3s) |
| **Rename symbol** | F2 (1s) | `<space>lr` (instant) |
| **Format code** | Alt+Shift+F (1s) | `<space>cf` (instant) |
| **Terminal toggle** | Ctrl+` (0.5s) | `<space>ft` (instant) |

### Resultado: **3x más rápido** en workflow típico

## Conclusión

**LazyVim no es para todo el mundo.** Es para desarrolladores que:

- ✅ Quieren **velocidad máxima**
- ✅ Valoran **control total** de su entorno
- ✅ Están dispuestos a **invertir tiempo inicial** por productividad lifetime
- ✅ Prefieren **terminal-first workflows**

Si eres de los que pasan más tiempo **esperando** que el IDE responda que programando, LazyVim te cambiará la vida.

**Pregunta final**: ¿Cuántos minutos pierdes diariamente esperando VS Code?

> *"VS Code te hace sentir productivo. LazyVim te hace ser productivo."*

Próximos: [Tmux](./tmux.md) para gestión de terminales, y [Zellij](./zellij.md) como alternativa moderna. 🖥️
