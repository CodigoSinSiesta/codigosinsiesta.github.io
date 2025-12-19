# Plan de Reestructuración de Documentación: Composición de Agentes

Este plan detalla la fragmentación del archivo "Muro de las Lamentaciones" (`docs/arquitectura-ia/composicion-agentes-claude.md`) en una estructura modular y mantenible.

## 🎯 Objetivos
- Modularizar el contenido para mejorar la legibilidad.
- Facilitar el mantenimiento futuro.
- Aplicar arquitectura de información coherente.
- Ejecutar la tarea de forma paralela usando sub-agentes.

## 📂 Nueva Estructura Propuesta
- `docs/arquitectura-ia/guia-composicion/`
  - `_category_.json` -> Configuración de la sección.
  - `01-fundamentos-core-four.md` -> Intro y los Core Four.
  - `02-comparativa-y-decision.md` -> Diferencias, tabla y árbol de decisión.
  - `03-patrones-de-diseno.md` -> Los 4 patrones de composición y buenas prácticas.
  - `04-casos-practicos.md` -> Ejemplos reales detallados.
  - `05-conclusiones-y-recursos.md` -> Resumen final y enlaces.

## 📝 Tareas

- [x] **Fase 1: Preparación**
  - [x] Crear el directorio `docs/arquitectura-ia/guia-composicion/`.
  - [x] Generar el archivo `_category_.json`.
  - [x] Identificar rangos de líneas exactos para cada módulo.

- [x] **Fase 2: Ejecución Paralela (Delegación a Sub-agentes)**
  - [x] Sub-agente A: Extraer Fundamentos y Core Four.
  - [x] Sub-agente B: Extraer Comparativa y Matriz de Decisión.
  - [x] Sub-agente C: Extraer Patrones y Buenas Prácticas.
  - [x] Sub-agente D: Extraer Casos Prácticos.
  - [x] Sub-agente E: Extraer Conclusiones y Referencias.

- [x] **Fase 3: Limpieza y Enlace**
  - [x] Eliminar o redirigir el archivo original.
  - [x] Verificar `sidebars.js`.
  - [x] Validar renderizado de diagramas Mermaid en los nuevos archivos.

---
*Progreso registrado por el Agente Senior Architect.*
