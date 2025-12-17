# Plan de Contenido - Herramientas

## Objetivo
Guías técnicas sobre herramientas interesantes para desarrollo. Cada guía es práctica y enfocada en productividad.

## 1. LazyVim (lazyvim.md)

### Contenido
- ¿Qué es LazyVim? (Neovim config moderno)
- Por qué abandonar VS Code/JetBrains (si quieres)
- Instalación y setup básico
- Estructura modular de plugins
- Customización práctica
- Keybindings esenciales
- Plugins recomendados para desarrollo
- Performance vs. comodidad

### Temas Clave
- Lazy loading de plugins
- Configuración en Lua
- Integración con LSP
- Terminal integrada
- Git integration

### Ejercicios
- Instalar LazyVim
- Customizar 5 keybindings propios
- Agregar 3 plugins nuevos
- Comparar velocidad con VS Code

---

## 2. Tmux (tmux.md)

### Contenido
- ¿Qué es Tmux? (terminal multiplexer)
- Cuando necesitas Tmux
- Instalación y configuración básica
- Conceptos: Sessions, Windows, Panes
- Keybindings esenciales
- Workflow práctico
- Scripting en Tmux
- Persistencia de sesiones

### Temas Clave
- Navegación eficiente
- Layouts automáticos
- Captura de histórico
- Clipboard integration
- Desarrollo remoto

### Casos de Uso
- Desarrollo local con múltiples servicios
- Servidor remoto sin SSH cada vez
- Testing paralelo
- CI/CD local

### Ejercicios
- Setup sesión de desarrollo típica
- Crear script que inicie stack completo
- Compartir sesión con otro desarrollador

---

## 3. Zellij (zellij.md)

### Contenido
- ¿Qué es Zellij? (Tmux alternativa moderna)
- Comparativa Tmux vs Zellij
- Instalación
- Configuración básica
- Keybindings intuitivos
- Layout system avanzado
- UI y experiencia
- Cuándo elegir Zellij over Tmux

### Temas Clave
- Layouts como código
- Tab navigation
- Plugin system
- Built-in UI utilities
- Performance

### Ejercicios
- Setup Zellij desde cero
- Crear 3 layouts personalizados
- Comparar workflow vs Tmux

---

## 4. Dev Tools (dev-tools.md)

### Contenido

**Build Tools**
- esbuild (rápido)
- SWC (super rápido)
- Turbopack (el futuro)
- Cuándo usar cada uno

**Package Managers**
- npm (default)
- pnpm (monorepo friendly)
- bun (rápido y moderno)
- Comparativa de velocidad

**Testing**
- Vitest (rápido, Vite native)
- Jest (standard, lento)
- Playwright vs Cypress
- Test pyramid en práctica

**Linting & Formatting**
- ESLint configuración moderna
- Prettier vs. manual formatting
- Husky + lint-staged
- Pre-commit hooks

**Git Tools**
- Conventional commits
- Commitizen para templates
- Git hooks automatizados
- Tags y releases

**CLI Tools (Recomendadas)**
- bat (cat mejorado)
- rg/ripgrep (grep moderno)
- fd (find moderno)
- sd (sed moderno)
- eza (ls mejorado)

### Temas Clave
- Decisiones pragmáticas
- Performance en desarrollo
- DX (Developer Experience)
- Automatización sensata

### Comparativas
- Tabla de herramientas legacy vs. modernas
- Benchmarks de velocidad
- Curva de aprendizaje

---

## Estado del Plan
- [ ] Contenido de lazyvim.md
- [ ] Contenido de tmux.md
- [ ] Contenido de zellij.md
- [ ] Contenido de dev-tools.md
- [ ] Agregar screenshots/demos
- [ ] Agregar links a repositorios oficiales
- [ ] Incluir config files de ejemplo
- [ ] Testing en desarrollo local
