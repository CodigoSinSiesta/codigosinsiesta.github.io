# Specification: AI Agent Development Learning Path

## Overview

Build a comprehensive, structured learning path for the Código Sin Siesta Docusaurus site that guides Spanish-speaking developers from AI fundamentals to building production-ready MCP servers with TypeScript. This feature creates an interactive roadmap with progress tracking, addressing the core pain point that there is no clear pathway for learning AI agent development with TypeScript in Spanish.

## Workflow Type

**Type**: feature

**Rationale**: This is new functionality being added to an existing Docusaurus site. We're creating new content pages, navigation structure, interactive UI components (visual roadmap, bookmark system), and enhancing the existing documentation architecture. This is not a refactoring of existing code or a simple content update - it's a comprehensive feature implementation that includes content architecture, UI development, and state management.

## Task Scope

### Services Involved
- **main** (primary) - Docusaurus React/JavaScript frontend serving Spanish documentation

### This Task Will:
- [ ] Create a structured learning path with 6 progressive modules (Fundamentos → TypeScript → IA Básica → Agentes → MCP → Producción)
- [ ] Build a visual roadmap component showing progression flow with time estimates
- [ ] Implement bookmark/progress tracking functionality using localStorage
- [ ] Integrate the learning path into the existing sidebar navigation
- [ ] Add hands-on projects and exercises for each module
- [ ] Define clear prerequisites and learning objectives per module
- [ ] Support multiple entry points for developers at different skill levels

### Out of Scope:
- Authentication-based progress tracking (using localStorage only)
- Backend API for progress persistence
- Multi-language i18n (Spanish only for this iteration)
- Content Management System integration
- Automated progress validation/quizzes
- Certificate generation

## Service Context

### main

**Tech Stack:**
- Language: JavaScript
- Framework: React + Docusaurus 3.x
- Component Pattern: Functional React components with hooks
- Styling: CSS Modules
- Diagram Support: Mermaid diagrams (already configured)
- i18n: Spanish ('es' locale configured)

**Entry Point:** `docusaurus.config.js`

**How to Run:**
```bash
npm run start
```

**Port:** 3000

**Key Directories:**
- `docs/` - Markdown/MDX content organized by category
- `src/components/` - React components
- `src/css/` - Global and module CSS
- `sidebars.js` - Navigation structure configuration

**Existing Patterns:**
- Content organized in nested folders (e.g., `docs/proyectos/taller-ia-agentes-mcp/`)
- Frontmatter with `sidebar_position` and `title`
- Mermaid diagrams for visual explanations
- Table-based content organization
- Learning path structures with durations and prerequisites (see `guia-composicion/`)

## Files to Modify

| File | Service | What to Change |
|------|---------|---------------|
| `sidebars.js` | main | Add new category "Ruta de Aprendizaje IA Agents" with 6 module entries |
| `docusaurus.config.js` | main | Add navbar item for learning path (optional, if we want top-level nav) |

## Files to Reference

These files show patterns to follow:

| File | Pattern to Copy |
|------|----------------|
| `docs/proyectos/taller-ia-agentes-mcp/intro.md` | Learning path introduction structure with rutas (rápida, completa, empresarial), prerequisites, module table with durations |
| `docs/arquitectura-ia/guia-composicion/01-fundamentos-core-four.md` | Module content structure with Mermaid diagrams, insight boxes, clear navigation to next module |
| `src/components/HomepageFeatures/index.js` | React component pattern for feature cards with SVG icons and CSS modules |
| `sidebars.js` | Nested category structure for multi-module learning paths |

## Patterns to Follow

### Module Content Structure

From `docs/proyectos/taller-ia-agentes-mcp/intro.md`:

```markdown
---
sidebar_position: 1
---

# [Module Title]

[Introduction paragraph explaining what this module covers]

## 🎯 Requisitos Previos

- Requirement 1
- Requirement 2

## 📖 Contenido

- Topic 1
- Topic 2

## 🛠️ Proyecto Práctico

[Hands-on project description]

**Siguiente**: [Next Module](./next-module.md)
```

**Key Points:**
- Use frontmatter for sidebar positioning
- Spanish headings and emoji icons for visual hierarchy
- Clear prerequisites section
- Practical project at each level
- Navigation links to next/previous modules

### Visual Diagrams with Mermaid

From `docs/arquitectura-ia/guia-composicion/01-fundamentos-core-four.md`:

```markdown
```mermaid
graph TB
    A["📚 Contexto"]
    B["🧠 Modelo"]

    style A fill:#0288d1,stroke:#fff,stroke-width:2px,color:#fff
    style B fill:#7b1fa2,stroke:#fff,stroke-width:2px,color:#fff
```
```

**Key Points:**
- Mermaid is already configured in docusaurus.config.js
- Use emojis in node labels for visual appeal
- Custom styling with fill colors matching brand
- Dark/light mode support configured

### React Component Pattern

From `src/components/HomepageFeatures/index.js`:

```javascript
import styles from './styles.module.css';

const ItemList = [
  { title: 'Title', description: 'Desc' }
];

function Item({title, description}) {
  return (
    <div className="text--center padding-horiz--md">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default function Component() {
  return (
    <section className={styles.features}>
      <div className="container">
        {ItemList.map((props, idx) => (
          <Item key={idx} {...props} />
        ))}
      </div>
    </section>
  );
}
```

**Key Points:**
- Use CSS modules for scoped styles
- Functional components with prop destructuring
- Map over data arrays for rendering
- Docusaurus theming classes (`text--center`, `padding-horiz--md`)

## Requirements

### Functional Requirements

1. **6-Module Learning Path Structure**
   - Description: Create progressive modules covering Fundamentos de IA → TypeScript Esencial → Conceptos de IA → Agentes con Claude → MCP Servers → Producción y Deployment
   - Acceptance: Each module has its own markdown file with frontmatter, prerequisites, learning objectives, and hands-on project

2. **Visual Roadmap Component**
   - Description: Interactive React component displaying the learning path flow with module cards, time estimates, and completion status
   - Acceptance: Roadmap renders on intro page, shows all 6 modules with progression arrows, displays estimated time per module, and highlights current position

3. **Bookmark/Progress Tracking**
   - Description: LocalStorage-based system to save user's current module position and completed modules
   - Acceptance: "Marcar como completado" button on each module, progress persists across sessions, visual indicator shows completed modules on roadmap

4. **Multiple Entry Points**
   - Description: Guidance for developers to skip to their appropriate level (beginner, intermediate, advanced)
   - Acceptance: Intro page includes skill assessment section mapping experience levels to recommended starting modules

5. **Hands-on Projects Integration**
   - Description: Each module includes a practical coding exercise or project
   - Acceptance: Every module has "🛠️ Proyecto Práctico" section with clear instructions, GitHub repo links, and expected outcomes

### Edge Cases

1. **localStorage Unavailable** - Gracefully degrade to no progress tracking, display warning message
2. **Incomplete Previous Module** - Show warning but allow navigation (don't enforce sequential completion)
3. **Mobile Responsiveness** - Roadmap component must work on mobile (vertical stacking if needed)
4. **Outdated Browser** - Support modern browsers only (ES6+), display compatibility message for old browsers

## Implementation Notes

### DO
- Follow the numbered file naming convention from `guia-composicion` (01-fundamentos.md, 02-typescript.md, etc.)
- Reuse existing Mermaid diagram patterns for visual roadmap representation
- Use the same table structure from `taller-ia-agentes-mcp/intro.md` for module overviews
- Keep Spanish naming conventions (Ruta Rápida, Ruta Completa, Ruta Empresarial)
- Include emoji icons (🎯, 📖, 🛠️, ⚠️) for visual hierarchy like existing content
- Link to existing content (4R Framework, taller-ia-agentes-mcp) for cross-references
- Use Docusaurus theme classes for consistent styling

### DON'T
- Create new authentication system (use localStorage only)
- Change existing content structure in other sections
- Use external UI libraries (stick to React and Docusaurus built-ins)
- Hardcode Spanish text without considering future i18n (even though out of scope now)
- Create API endpoints or backend services
- Override Docusaurus core styles unnecessarily

## Development Environment

### Start Services

```bash
# Install dependencies (if not already installed)
npm install

# Start development server
npm run start
```

### Service URLs
- Main Site: http://localhost:3000
- Live reload enabled by default

### Required Environment Variables
None required for this feature (static site, no API keys needed)

## Success Criteria

The task is complete when:

1. [ ] 6+ modules exist in `docs/ruta-aprendizaje-ia-agents/` with frontmatter, prerequisites, learning objectives, and hands-on projects
2. [ ] Visual roadmap component renders on the intro page showing progression flow and time estimates
3. [ ] Bookmark functionality works: users can mark modules complete and see progress persist across page reloads
4. [ ] Sidebar navigation includes the new "Ruta de Aprendizaje IA Agents" category with all 6 modules
5. [ ] Intro page includes skill assessment/entry point guidance for different experience levels
6. [ ] No console errors in browser console
7. [ ] Existing tests still pass (npm run build succeeds)
8. [ ] New functionality verified via browser at http://localhost:3000
9. [ ] All modules link to previous/next module for easy navigation
10. [ ] Mobile responsive design verified (roadmap works on mobile)

## QA Acceptance Criteria

**CRITICAL**: These criteria must be verified by the QA Agent before sign-off.

### Unit Tests
| Test | File | What to Verify |
|------|------|----------------|
| Progress tracking localStorage | `src/components/LearningPathRoadmap/__tests__/progress.test.js` | Save/load progress to localStorage, handle missing data gracefully |
| Module completion logic | `src/components/LearningPathRoadmap/__tests__/completion.test.js` | Mark complete/incomplete, calculate percentage complete |

### Integration Tests
| Test | Services | What to Verify |
|------|----------|----------------|
| Roadmap renders modules | main (Docusaurus) | Component fetches module data, renders all cards with correct info |
| Navigation flow | main (Docusaurus) | Links between modules work, sidebar navigation active states correct |

### End-to-End Tests
| Flow | Steps | Expected Outcome |
|------|-------|------------------|
| Complete Learning Path Flow | 1. Visit intro page 2. Mark module 1 complete 3. Refresh page 4. Navigate to module 2 | Progress persists, roadmap shows module 1 complete, module 2 highlighted |
| Skill Level Assessment | 1. Visit intro page 2. Read skill assessment 3. Click "skip to module 3" link | User lands on correct intermediate module |

### Browser Verification (frontend)
| Page/Component | URL | Checks |
|----------------|-----|--------|
| Learning Path Intro | `http://localhost:3000/docs/ruta-aprendizaje-ia-agents/intro` | Roadmap renders, "Rutas" section present, skill assessment visible |
| Module 1 (Fundamentos) | `http://localhost:3000/docs/ruta-aprendizaje-ia-agents/01-fundamentos` | Prerequisites shown, learning objectives listed, project section exists, "marcar completado" button works |
| Module 6 (Producción) | `http://localhost:3000/docs/ruta-aprendizaje-ia-agents/06-produccion` | Final module content complete, links back to intro or next resources |
| Sidebar Navigation | Any learning path page | New category appears in sidebar, all 6 modules listed, active state highlights current page |
| Mobile View | All learning path pages | Roadmap stacks vertically, buttons are tappable, text readable |

### Database Verification
Not applicable (no database, using localStorage only)

### Build Verification
| Check | Command | Expected |
|-------|---------|----------|
| Production build succeeds | `npm run build` | Build completes without errors, all pages generated |
| No broken links | `npm run build` (Docusaurus checks links) | No broken internal links reported |
| Bundle size reasonable | Check `build/` folder size | No significant increase (< 500KB added) |

### QA Sign-off Requirements
- [ ] All 6 modules have complete content (not placeholder text)
- [ ] Visual roadmap component renders correctly in light and dark mode
- [ ] localStorage progress tracking works across browser sessions
- [ ] Sidebar navigation includes new category with correct structure
- [ ] Mobile responsiveness verified on viewport < 768px
- [ ] No console errors or warnings in browser console
- [ ] Production build (`npm run build`) succeeds
- [ ] No regressions in existing documentation sections
- [ ] Cross-browser testing (Chrome, Firefox, Safari) shows consistent behavior
- [ ] Code follows existing Docusaurus patterns (no custom CSS overrides without justification)
- [ ] All links to external resources (GitHub repos, Claude docs) are valid
- [ ] Spanish language quality verified (no machine translation artifacts)

## Module Breakdown (Implementation Detail)

### Proposed 6-Module Structure

1. **Módulo 1: Fundamentos de IA para Desarrolladores**
   - Prerequisites: JavaScript básico
   - Duration: 1.5 horas
   - Topics: Qué es un agente de IA, LLMs vs. tradicional ML, API calls, prompting básico
   - Project: Primer prompt a Claude API

2. **Módulo 2: TypeScript Esencial para Agentes**
   - Prerequisites: Módulo 1, JavaScript ES6+
   - Duration: 2 horas
   - Topics: Por qué TypeScript, tipos para API responses, zod validation, error handling
   - Project: Typed tool function para agente

3. **Módulo 3: Conceptos Clave de IA Agents**
   - Prerequisites: Módulo 2
   - Duration: 2.5 horas
   - Topics: Tool calling, ReAct pattern, state management, multi-turn conversations
   - Project: Agente simple de tareas

4. **Módulo 4: Agentes Avanzados con Claude**
   - Prerequisites: Módulo 3
   - Duration: 3 horas
   - Topics: Prompt engineering avanzado, context windows, streaming, error recovery
   - Project: Agente investigador con memoria

5. **Módulo 5: MCP Servers - Model Context Protocol**
   - Prerequisites: Módulo 4
   - Duration: 2.5 horas
   - Topics: Qué es MCP, crear servidor MCP, FastMCP framework, tool schemas
   - Project: MCP server para integración externa (weather, database, etc.)

6. **Módulo 6: Producción y Deployment**
   - Prerequisites: Módulo 5
   - Duration: 3 horas
   - Topics: Testing strategies, security patterns, rate limiting, monitoring, deployment
   - Project: Deploy agente completo con MCP server

**Total Time**: 14.5 hours (Ruta Completa)

**Alternative Paths**:
- Ruta Rápida (4 horas): Módulos 1, 2, 3 + proyecto final simplificado
- Ruta Empresarial (20+ horas): Todos los módulos + 4R Framework + ejercicios adicionales

## Content Creation Strategy

### Phase 1: Structure Setup
1. Create folder `docs/ruta-aprendizaje-ia-agents/`
2. Create 7 markdown files (intro.md + 01-06.md)
3. Add frontmatter and basic structure to all files
4. Update sidebars.js with new category

### Phase 2: Core Content
1. Write intro.md with roadmap description and rutas
2. Fill in module 1 (Fundamentos) completely as reference
3. Fill in modules 2-6 with content

### Phase 3: Interactive Components
1. Build LearningPathRoadmap React component
2. Implement localStorage progress tracking hook
3. Add "Marcar como completado" button component
4. Integrate roadmap into intro.md

### Phase 4: Polish
1. Add Mermaid diagrams to key modules
2. Cross-link to existing taller-ia-agentes-mcp content
3. Add GitHub repo links for projects
4. Proofread Spanish content

### Phase 5: Testing & QA
1. Verify all acceptance criteria
2. Test on mobile
3. Production build test
4. Cross-browser verification
