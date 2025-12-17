---
sidebar_position: 6
---

# Ejercicios Prácticos

Ejercicios progresivos para dominar el desarrollo de agentes de IA. Cada nivel construye sobre el anterior, desde conceptos básicos hasta sistemas complejos multi-agente.

## 🟢 Nivel 1: Fundamentos (Principiante)

Ejercicios básicos para entender los conceptos core de agentes y Tool Use.

### Ejercicio 1.1: Tu Primera Tool

**🎯 Objetivo:** Crear una tool simple que el agente pueda usar para responder preguntas básicas sobre el clima.

**📋 Requisitos:**
- Haber completado el [setup del entorno](./setup.md)
- Entender el patrón Tool Use básico
- Conocimientos de TypeScript básicos

**🔧 Tarea:**
Implementa un agente que pueda responder preguntas como:
- "¿Qué temperatura hace hoy?"
- "¿Va a llover mañana?"
- "¿Hace frío en Madrid?"

**🛠️ Especificaciones:**
- Crea una tool llamada `get_weather` que tome como parámetro `location` (string)
- La tool debe devolver datos simulados de clima (temperatura, condiciones, humedad)
- El agente debe usar la tool automáticamente cuando se le pregunte sobre el clima
- Maneja al menos 5 ciudades diferentes

**✨ Pistas:**
- Usa datos hardcodeados para simular una API del clima
- Define la tool con un JSON Schema simple
- El agente debe detectar automáticamente cuándo usar la tool

**✅ Checklist de Validación:**
- [ ] El agente responde correctamente a preguntas de clima sin tool
- [ ] El agente usa la tool cuando se le pregunta sobre el clima
- [ ] La tool maneja al menos 3 ciudades diferentes
- [ ] Los datos de respuesta incluyen temperatura y condiciones
- [ ] No hay errores de sintaxis o ejecución

### Ejercicio 1.2: Agente Matemático

**🎯 Objetivo:** Construir un agente que pueda resolver operaciones matemáticas básicas usando tools.

**📋 Requisitos:**
- Tool Use funcionando
- Manejo básico de parámetros
- TypeScript con validación de tipos

**🔧 Tarea:**
Crea un agente calculadora que pueda:
- Sumar dos números
- Restar dos números
- Multiplicar dos números
- Dividir dos números (con manejo de división por cero)

**🛠️ Especificaciones:**
- Implementa 4 tools separadas: `add`, `subtract`, `multiply`, `divide`
- Cada tool toma dos parámetros numéricos: `a` y `b`
- La tool `divide` debe devolver error si `b` es 0
- El agente debe elegir automáticamente qué tool usar basado en la pregunta del usuario

**✨ Pistas:**
- Usa Zod para validar que los parámetros sean números
- Define cada operación como una tool independiente
- El prompt del agente debe incluir instrucciones claras sobre cuándo usar cada tool

**✅ Checklist de Validación:**
- [ ] El agente identifica correctamente qué operación realizar
- [ ] Todas las operaciones matemáticas funcionan correctamente
- [ ] La división por cero está manejada con un mensaje de error claro
- [ ] Los parámetros se validan correctamente antes de ejecutar
- [ ] El agente explica el resultado de forma natural

### Ejercicio 1.3: Agente de Lista de Tareas (Simple)

**🎯 Objetivo:** Extender el agente de tareas básico con operaciones CRUD completas.

**📋 Requisitos:**
- Conocimiento del [Agente de Tareas](./agente-tareas.md)
- Manejo de arrays y objetos en TypeScript
- Persistencia básica de datos

**🔧 Tarea:**
Mejora el agente de tareas para que pueda:
- Crear nuevas tareas
- Listar todas las tareas
- Marcar tareas como completadas
- Eliminar tareas completadas

**🛠️ Especificaciones:**
- Usa un archivo JSON para persistir las tareas
- Implementa 4 tools: `create_task`, `list_tasks`, `complete_task`, `delete_completed`
- Cada tarea tiene: id (único), título, descripción, estado (pending/completed), fecha de creación
- El agente debe mantener el estado entre conversaciones

**✨ Pistas:**
- Usa `fs/promises` para leer/escribir el archivo JSON
- Genera IDs únicos con `crypto.randomUUID()` o `uuid`
- Mantén el estado consistente entre llamadas

**✅ Checklist de Validación:**
- [ ] Se pueden crear tareas con título y descripción
- [ ] Listar tareas muestra todas las tareas con su estado
- [ ] Completar tareas cambia su estado correctamente
- [ ] Eliminar tareas completadas las remueve del archivo
- [ ] Los datos persisten entre reinicios del programa

## 🟡 Nivel 2: Intermedio (Medio)

Ejercicios que introducen conceptos avanzados como memoria y razonamiento multi-paso.

### Ejercicio 2.1: Agente con Memoria Conversacional

**🎯 Objetivo:** Implementar un agente que recuerde el contexto de conversaciones anteriores.

**📋 Requisitos:**
- Nivel 1 completado
- Entendimiento de arrays y objetos
- Manejo de estado en aplicaciones

**🔧 Tarea:**
Crea un agente que pueda recordar información personal del usuario:
- Recordar el nombre del usuario
- Recordar preferencias (ej: comida favorita, color preferido)
- Recordar hechos importantes mencionados anteriormente
- Corregir información cuando el usuario la actualiza

**🛠️ Especificaciones:**
- Implementa tools para: `remember_fact`, `recall_fact`, `update_fact`, `forget_fact`
- Usa un sistema de memoria basado en clave-valor
- El agente debe usar la memoria para personalizar respuestas
- Persiste la memoria entre sesiones

**✨ Pistas:**
- Usa un Map o objeto simple para almacenar los hechos
- Las claves pueden ser: "user_name", "favorite_food", "last_topic", etc.
- Incluye timestamps para saber cuándo se recordó cada hecho

**✅ Checklist de Validación:**
- [ ] El agente recuerda el nombre del usuario en conversaciones posteriores
- [ ] Puede recordar múltiples hechos sobre el usuario
- [ ] Actualiza información cuando se le corrige
- [ ] Olvida información cuando se le pide
- [ ] Usa la información recordada para personalizar respuestas

### Ejercicio 2.2: Agente de Investigación Web (Simulado)

**🎯 Objetivo:** Construir un agente que pueda "investigar" temas usando tools simuladas de búsqueda web.

**📋 Requisitos:**
- Tool chaining básico
- Razonamiento secuencial
- Manejo de arrays de resultados

**🔧 Tarea:**
Implementa un agente investigador que pueda:
- Buscar información sobre un tema
- Encontrar fuentes relacionadas
- Resumir la información encontrada
- Presentar conclusiones

**🛠️ Especificaciones:**
- Crea tools: `search_topic`, `find_related_sources`, `summarize_info`
- `search_topic` devuelve resultados simulados de búsqueda
- El agente debe encadenar tools automáticamente para investigar un tema completo
- Implementa al menos 5 temas con datos simulados

**✨ Pistas:**
- Crea una base de datos simulada con información sobre varios temas
- La tool `search_topic` filtra esta base de datos
- `find_related_sources` puede devolver URLs o referencias simuladas
- `summarize_info` combina múltiples resultados

**✅ Checklist de Validación:**
- [ ] El agente puede investigar un tema desde cero
- [ ] Usa múltiples tools en secuencia automáticamente
- [ ] Combina información de diferentes fuentes
- [ ] Proporciona resúmenes coherentes
- [ ] Maneja temas no encontrados con mensajes apropiados

### Ejercicio 2.3: Agente de Compras con Carrito

**🎯 Objetivo:** Crear un agente que maneje un carrito de compras inteligente con recomendaciones.

**📋 Requisitos:**
- Manejo complejo de estado
- Lógica condicional en tools
- Validación de business rules

**🔧 Tarea:**
Construye un agente de e-commerce que pueda:
- Mostrar catálogo de productos
- Agregar productos al carrito
- Calcular totales con descuentos
- Recomendar productos relacionados
- Procesar checkout simple

**🛠️ Especificaciones:**
- Implementa tools: `browse_catalog`, `add_to_cart`, `view_cart`, `apply_discount`, `checkout`
- Mantén estado del carrito entre interacciones
- Implementa lógica de descuentos (ej: 10% descuento en compras > $50)
- Recomienda productos basándose en el historial del carrito

**✨ Pistas:**
- Define un catálogo de productos con precios, categorías, etc.
- El carrito es un array de items con cantidades
- Los descuentos pueden aplicarse automáticamente basados en reglas
- Las recomendaciones pueden ser productos de la misma categoría

**✅ Checklist de Validación:**
- [ ] El catálogo muestra productos organizados por categorías
- [ ] Se pueden agregar múltiples productos al carrito
- [ ] Los totales se calculan correctamente con descuentos
- [ ] Las recomendaciones son relevantes al contenido del carrito
- [ ] El checkout valida que haya items en el carrito

## 🟠 Nivel 3: Avanzado (Experto)

Ejercicios que requieren patrones complejos y pensamiento sistémico.

### Ejercicio 3.1: Plan-Execute-Synthesize Pattern

**🎯 Objetivo:** Implementar el patrón avanzado Plan-Execute-Synthesize para resolver problemas complejos.

**📋 Requisitos:**
- Nivel 2 completado
- Entendimiento de planificación
- Manejo de tareas paralelas

**🔧 Tarea:**
Crea un agente que planifique y ejecute proyectos de desarrollo de software:
- Analizar requisitos
- Crear plan de tareas
- Ejecutar tareas en paralelo cuando sea posible
- Sintetizar resultados en una entrega final

**🛠️ Especificaciones:**
- Implementa el patrón PES: Plan → Execute → Synthesize
- Tools: `analyze_requirements`, `create_plan`, `execute_task`, `synthesize_results`
- Maneja dependencias entre tareas
- Ejecuta hasta 3 tareas en paralelo

**✨ Pistas:**
- El plan es un array de tareas con dependencias
- `execute_task` puede simular ejecución con delays aleatorios
- La síntesis combina resultados de todas las tareas completadas
- Incluye manejo de fallos en tareas individuales

**✅ Checklist de Validación:**
- [ ] El agente crea planes realistas para proyectos complejos
- [ ] Respeta dependencias entre tareas
- [ ] Puede ejecutar tareas en paralelo
- [ ] Sintetiza resultados de múltiples tareas
- [ ] Maneja fallos gracefully

### Ejercicio 3.2: Sistema Multi-Agente

**🎯 Objetivo:** Construir un sistema donde múltiples agentes especializados colaboren para resolver problemas.

**📋 Requisitos:**
- Arquitectura de agentes compleja
- Comunicación inter-agente
- Coordinación de tareas

**🔧 Tarea:**
Implementa un equipo de agentes para desarrollo de software:
- **Product Manager Agent**: Define requisitos y prioridades
- **Developer Agent**: Implementa features
- **QA Agent**: Revisa y testa código
- **Coordinator Agent**: Orquesta el trabajo del equipo

**🛠️ Especificaciones:**
- Cada agente tiene herramientas especializadas
- Los agentes pueden delegar tareas entre ellos
- Implementa un sistema de mensajes para comunicación
- El coordinator maneja el flujo de trabajo completo

**✨ Pistas:**
- Usa un bus de mensajes simple para comunicación inter-agente
- Cada agente tiene un rol y contexto específicos
- El coordinator conoce las capacidades de cada agente
- Implementa timeouts y reintentos para comunicación

**✅ Checklist de Validación:**
- [ ] Cada agente tiene herramientas especializadas funcionando
- [ ] Los agentes pueden comunicarse entre ellos
- [ ] El coordinator delega tareas apropiadamente
- [ ] El sistema completo puede resolver problemas complejos
- [ ] Maneja fallos en agentes individuales

### Ejercicio 3.3: Agente con Auto-Mejora

**🎯 Objetivo:** Crear un agente que aprende de sus errores y mejora su rendimiento con el tiempo.

**📋 Requisitos:**
- Logging avanzado
- Análisis de patrones
- Sistema de feedback

**🔧 Tarea:**
Construye un agente que:
- Registra todas sus acciones y resultados
- Analiza sus errores comunes
- Adapta su comportamiento basado en el historial
- Mejora automáticamente sus prompts y estrategias

**🛠️ Especificaciones:**
- Implementa logging detallado de todas las interacciones
- Crea tools para `analyze_performance`, `identify_patterns`, `optimize_strategy`
- El agente mantiene métricas de éxito/error
- Puede ajustar sus prompts basado en análisis de fallos

**✨ Pistas:**
- Registra cada tool call con resultado y tiempo de ejecución
- Analiza patrones en los errores más comunes
- Implementa un sistema de "lecciones aprendidas"
- Los ajustes pueden ser cambios en prompts o lógica de decisión

**✅ Checklist de Validación:**
- [ ] El agente registra todas sus acciones detalladamente
- [ ] Puede identificar patrones en sus errores
- [ ] Adapta su comportamiento basado en análisis
- [ ] Muestra mejora en rendimiento con el tiempo
- [ ] Maneja casos edge mejor después de aprender

## 🏆 Consejos Generales para Todos los Niveles

### Mejores Prácticas

1. **Empieza Simple**: Implementa la funcionalidad core antes de optimizaciones
2. **Testea Incrementalmente**: Verifica cada tool individualmente antes de integrar
3. **Logging Es Tu Amigo**: Añade logs detallados para debugging
4. **Maneja Errores Gracefully**: Tu agente debe ser robusto ante inputs inesperados
5. **Itera y Mejora**: Los primeros intentos fallarán - aprende de ellos

### Debugging Común

- **El agente no usa tools**: Verifica que las tool definitions estén correctas
- **Parámetros inválidos**: Asegúrate de que el schema JSON coincida con lo que espera el LLM
- **Loops infinitos**: Implementa límites de iteraciones y timeouts
- **Estado inconsistente**: Usa validación estricta al leer/escribir estado

### Recursos Adicionales

- [Setup del Entorno](./setup.md) - Para preparar tu entorno
- [Agente de Tareas](./agente-tareas.md) - Base para ejercicios de tareas
- [Agente Investigador](./agente-investigador.md) - Patrones avanzados
- [MCP Servers](./mcp-servers.md) - Para ejercicios de MCP

¿Has completado algún ejercicio? ¡Comparte tu experiencia en los issues del repositorio! 🚀
