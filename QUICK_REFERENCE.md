# AI-Presentation: Quick Reference Guide

## What is This Project?

**ai-presentation** is an interactive web-based presentation about "Vibe Coding vs Software Engineering" - exploring the 4R Framework for responsible AI-assisted development.

**Live URL:** https://codigosinsiesta.github.io/ai-presentation/

---

## Quick Stats

| Metric | Value |
|--------|-------|
| **Type** | Interactive Web Presentation |
| **Slides** | 28 |
| **Framework** | Astro 4.16.18 |
| **Components** | Svelte 5.45.5 |
| **Styling** | Tailwind CSS 4.1.17 |
| **Animations** | GSAP 3.13.0 |
| **Status** | Active ✅ |
| **Deployment** | GitHub Pages (Auto) |
| **Created** | Dec 5, 2025 |
| **Last Update** | Dec 11, 2025 |

---

## Project Structure

```
src/
├── components/
│   ├── Navigation.svelte          (21 slides navigation)
│   ├── slides/                     (28 .astro & .svelte slides)
│   └── ui/                         (Button, Card components)
├── layouts/
│   └── PresentationLayout.astro   (main template)
├── styles/                         (custom CSS)
└── utils/
    └── animations.ts              (GSAP utilities)
```

---

## Core Technologies

```
Frontend:
├─ Astro       → Static site generation + interactive islands
├─ Svelte      → Lightweight reactive components
├─ TypeScript  → Type-safe development
├─ Tailwind    → Utility-first CSS framework
└─ GSAP        → Professional animations

DevOps:
├─ pnpm        → Fast package manager
├─ GitHub Actions → CI/CD pipeline
├─ GitHub Pages   → Static hosting
└─ Node.js 20  → Runtime
```

---

## Essential Scripts

```bash
pnpm dev      # Start dev server (http://localhost:4321)
pnpm build    # Build with type checking + optimization
pnpm preview  # Preview built site
```

---

## Deployment Pipeline

```
┌─ PUSH to main ─┐
│                │
└─→ GitHub Actions (deploy.yml)
    │
    ├─→ Build Stage
    │   ├─ Checkout code
    │   ├─ Install dependencies
    │   ├─ Type check (astro check)
    │   ├─ Build (astro build → dist/)
    │   └─ Upload artifact
    │
    └─→ Deploy Stage
        └─ Deploy to GitHub Pages
            → https://codigosinsiesta.github.io/ai-presentation/
```

**Status:** ✅ Fully Automated | Triggers: Push to main or Manual

---

## Slides Overview (28 Total)

### Structure
- **Slide 01:** Hero slide with presenters
- **Slides 02-04:** Problem & Context (Paradox, Metrics, Churn)
- **Slides 05-07:** Framework & Theory (Best Practices, Prompts, Framework 4R)
- **Slides 08-10:** Deep Dives (Risk, Workshop, Reliability)
- **Slides 11-13:** Patterns & Implementation (Resilience, Feedback, Stack)
- **Slides 14-18:** Advanced Topics & Closing (Hooks, Guardrails, Cases, etc.)

### Format Mix
- **11 Astro slides** (static)
- **17 Svelte slides** (interactive with client:load)

---

## Key Features

✨ **Interactive Navigation**
- Smooth slide transitions
- Audience engagement via feedback form

📐 **Professional Design**
- Custom typography (Space Grotesk, IBM Plex Sans, JetBrains Mono)
- Responsive layout with Tailwind
- Consistent visual theme

⚡ **Performance**
- Static generation → Fast loading
- Lightweight Svelte components
- Optimized animations

🔒 **Quality & Safety**
- TypeScript strict mode
- Branch protection on main
- Automated type checking

---

## Repository Health

| Item | Status |
|------|--------|
| **Issues** | 0 Open ✅ |
| **PRs** | 0 Open ✅ |
| **Main Branch** | Protected ✅ |
| **Build** | Passing ✅ |
| **CI/CD** | Active ✅ |
| **Code Quality** | TypeScript ✅ |

---

## Recent Activity

```
Dec 11  → Fix URL: tellmeales.dev → tellmealex.dev [MERGED PR #2]
Dec 09  → Add slides for MCPs, Workshop, Feedback
Dec 08  → Add Jose David as co-presenter
```

---

## Collaborators

- **TellMeAlex** - Main author & presenter
- **Copilot** - Automated code improvements
- **Jose David** - Co-presenter

---

## Development Workflow

1. **Make changes** in a branch
2. **Commit** with descriptive messages
3. **Create PR** for review
4. **Merge to main**
5. **Auto-deploy** via GitHub Actions ✨

---

## Common Commands

```bash
# Development
pnpm dev          # Hot reload on localhost:4321

# Production
pnpm build        # Optimize + type check + build
pnpm preview      # Test production build locally

# Astro
pnpm astro add [integration]  # Add new integration
pnpm astro check              # Type checking
```

---

## Configuration Files

| File | Purpose |
|------|---------|
| `astro.config.mjs` | Astro framework config |
| `tailwind.config.mjs` | Tailwind CSS customization |
| `tsconfig.json` | TypeScript settings |
| `postcss.config.mjs` | PostCSS configuration |
| `.github/workflows/deploy.yml` | CI/CD pipeline |

---

## Important URLs

| Description | URL |
|-------------|-----|
| **Live Presentation** | https://codigosinsiesta.github.io/ai-presentation/ |
| **GitHub Repository** | https://github.com/CodigoSinSiesta/ai-presentation |
| **Issues & PRs** | https://github.com/CodigoSinSiesta/ai-presentation/issues |
| **Actions/CI** | https://github.com/CodigoSinSiesta/ai-presentation/actions |

---

## Topics & Keywords

`#4r-framework` `#ai-coding` `#software-engineering` `#astro` `#svelte` `#web-presentation` `#code-quality` `#ai`

---

## Next Steps / Ideas

- [ ] Add speaker notes section
- [ ] Implement live polls during presentation
- [ ] Add presentation mode (fullscreen + timer)
- [ ] Create printable PDF version
- [ ] Add multi-language support
- [ ] Track presentation metrics

---

## Troubleshooting

### Port 4321 already in use?
```bash
lsof -i :4321  # Find process
kill -9 <PID>  # Kill it
pnpm dev       # Try again
```

### Build errors?
```bash
rm -rf node_modules dist .astro
pnpm install
pnpm build
```

### Type errors?
```bash
pnpm astro check
```

---

## Support & Contact

For issues, questions, or contributions:
- **Author:** TellMeAlex
- **Organization:** CodigoSinSiesta
- **GitHub Issues:** https://github.com/CodigoSinSiesta/ai-presentation/issues

---

**Last Updated:** December 11, 2025
**Status:** ✅ Production Ready
