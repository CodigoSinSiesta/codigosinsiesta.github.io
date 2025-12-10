# Plan de Implementación: Sitio Docusaurus para codigosinsiesta.github.io

**Fecha de inicio:** 10 de diciembre de 2024
**Objetivo:** Crear sitio web principal para la organización usando Docusaurus 3

## Estado del Proyecto

### ✅ Completadas

1. **Crear repositorio codigosinsiesta.github.io en GitHub**
   - Repositorio creado en: https://github.com/CodigoSinSiesta/codigosinsiesta.github.io
   - Tipo: Organización GitHub Pages

2. **Clonar repositorio localmente**
   - Clonado en: `/Users/alejandro/dev/codigosinsiesta.github.io`

3. **Instalar Docusaurus 3 en el repositorio**
   - Template: Classic
   - Versión: 3.9.2
   - Lenguaje: JavaScript

4. **Configurar docusaurus.config.js para GitHub Pages organizacional**
   - `url`: 'https://codigosinsiesta.github.io'
   - `baseUrl`: '/' (crítico para org pages)
   - `organizationName`: 'codigosinsiesta'
   - `projectName`: 'codigosinsiesta.github.io'
   - `trailingSlash`: false
   - `i18n`: Configurado en español ('es')
   - Navegación y footer personalizados
   - Enlaces al proyecto ai-presentation

5. **Crear archivo static/.nojekyll**
   - Previene procesamiento Jekyll en GitHub Pages

6. **Crear workflow .github/workflows/deploy.yml**
   - Deploy automático en push a main
   - Build con Node.js 20
   - Deployment con GitHub Pages Actions

7. **Crear workflow .github/workflows/test-deploy.yml**
   - Testing en Pull Requests
   - Validación de build antes de merge

8. **Crear PLAN.md para seguimiento de progreso**
   - Este archivo

### 🔄 Pendientes

9. **Personalizar landing page**
   - Archivo: `src/pages/index.js`
   - Customizar para Código Sin Siesta

10. **Configurar estructura de documentación**
    - Directorio: `docs/`
    - Crear documentación inicial
    - Actualizar `sidebars.js`

11. **Configurar blog**
    - Directorio: `blog/`
    - Personalizar posts de ejemplo

12. **Hacer commit inicial y push**
    - Subir todo el código a GitHub
    - Activar primer deployment

13. **Configurar GitHub Pages Settings para usar GitHub Actions**
    - Settings → Pages → Source: "GitHub Actions"

14. **Verificar deployment en https://codigosinsiesta.github.io/**
    - Validar que el sitio esté funcionando
    - Verificar que ai-presentation siga accesible

---

## Notas Técnicas

### Configuración Crítica
- **baseUrl: '/'** para páginas de organización (vs. `/proyecto/` para project pages)
- **trailingSlash: false** para evitar problemas de SEO y 404s
- Archivo `.nojekyll` esencial para prevenir procesamiento Jekyll

### Convivencia de Sitios
- Sitio principal: `https://codigosinsiesta.github.io/`
- Proyecto AI Presentation: `https://codigosinsiesta.github.io/ai-presentation/`
- Ambos funcionan independientemente sin conflictos

### Workflows GitHub Actions
1. **deploy.yml**: Deploy automático en main
2. **test-deploy.yml**: Validación en PRs

---

## Próximos Pasos

1. Personalizar contenido (landing, docs, blog)
2. Hacer commit y push inicial
3. Configurar GitHub Pages Settings
4. Verificar deployment
5. (Opcional) Agregar navegación entre sitios en futuras iteraciones

---

**Última actualización:** 10 de diciembre de 2024
