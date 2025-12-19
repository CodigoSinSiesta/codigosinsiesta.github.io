---
sidebar_position: 5
title: Mejores Prácticas y Recursos
---

## Mejores Prácticas y Lecciones Aprendidas

### Keep Skills Focused

**❌ Mal: Skill genérico que hace demasiado**
```yaml
---
description: Ayuda con el desarrollo web
---

Ayuda con HTML, CSS, JavaScript, React, Vue, testing, deployment, y debugging.
```

**Problema**: Descripción demasiado vaga, se activará en contextos incorrectos.

**✅ Bien: Skill específico**
```yaml
---
description: Genera componentes React con TypeScript siguiendo convenciones del proyecto
---

Cuando el usuario pida crear un componente React:
1. Usa TypeScript
2. Aplica props typing con interface
3. Incluye JSDoc
4. Genera test correspondiente
```

**Lección**: Un skill debe resolver **una cosa bien**, no muchas cosas mediocre.

### Write Specific Descriptions

La descripción del skill es **crítica** para que Claude lo active correctamente.

**❌ Mal**:
```yaml
---
description: Ayuda con commits
---
```

**✅ Bien**:
```yaml
---
description: Genera mensajes de commit siguiendo Conventional Commits cuando el usuario mencione crear un commit o commit changes
---
```

**Tips**:
- Incluir palabras clave que el usuario usaría ("crear commit", "commit changes")
- Ser específico sobre el dominio ("Conventional Commits", no solo "commits")
- Evitar ambigüedad ("ayuda con" es vago)

### Restrict Tools en Sub-agents

**❌ Mal: Sub-agent con acceso completo**
```yaml
---
name: doc-generator
---

Genera documentación del código.

# Tools: todas disponibles
```

**Problema**: Si un bug en el prompt, podría modificar código de producción accidentalmente.

**✅ Bien: Restrict tools a lo necesario**
```yaml
---
name: doc-generator
tools:
  - Read
  - Write: "docs/**/*.md"  # Solo puede escribir en docs/
---

Genera documentación del código.
```

**Lección**: Aplicar principio de least privilege. Si el sub-agent solo lee código y escribe docs, no necesita Bash, Grep, ni Write en otros directorios.

### Prompt Engineering Primero

**Workflow recomendado**:

1. **Empezar conversacional**: Refinar el prompt en conversación hasta que funcione perfectamente
2. **Capturar el prompt final**: Guardar la versión que funciona
3. **Evaluar reusabilidad**: ¿Se usará frecuentemente? ¿Es siempre igual?
4. **Escalar gradualmente**:
   - Si es manual y frecuente → Slash command
   - Si debe ser automático → Skill
   - Si necesita paralelismo → Sub-agent
   - Si necesita integración externa → MCP

**Anti-patrón**: Saltar directamente a crear skills sin probar el prompt conversacionalmente. Resultado: skills con prompts mal refinados que no funcionan bien.

### Composición > Sobre-ingeniería

**❌ Mal: Arquitectura innecesariamente compleja**
```
Skill A llama a Sub-agent B que usa MCP C que llama a otro Sub-agent D
```

**Problema**: Debugging imposible, cadena de dependencias frágil, fiabilidad baja.

**✅ Bien: Composición simple**
```
Skill usa MCP directamente
O: Sub-agents paralelos que reportan a agente principal
```

**Regla**: Máximo **2 niveles de profundidad** en composición. Preferir composición horizontal (sub-agents en paralelo) sobre vertical (anidamiento).

### Testing e Iteración

**Skills y Sub-agents necesitan testing**:

1. **Crear casos de prueba**: Situaciones específicas donde el skill debería activarse
2. **Verificar activación**: ¿Se activa cuando debe? ¿No se activa cuando no debe?
3. **Probar edge cases**: Inputs malformados, archivos inexistentes, etc.
4. **Iterar descripciones**: Refinar descripción del skill según falsos positivos/negativos

**Ejemplo de test log**:
```markdown
# Test: Commit Message Skill

## Caso 1: Usuario dice "create a commit"
- ✅ Skill se activó
- ✅ Generó mensaje Conventional Commit correcto

## Caso 2: Usuario dice "what's the last commit?"
- ❌ Skill se activó (falso positivo)
- Fix: Mejorar descripción para especificar "crear" no "consultar"

## Caso 3: Usuario hace commit con git directamente
- ⚠️ Skill no se activó (esperado, no hay mención en conversación)
```

## Conclusión: Skills como Nivel Composicional Superior

Skills, MCP Servers, Sub-agents y Slash Commands no son tecnologías competidoras, son piezas complementarias de un sistema composicional. Entender cuándo usar cada uno es la diferencia entre una arquitectura elegante y un sistema sobre-ingenierizado.

**El prompt es la unidad fundamental**. Todo lo demás (skills, sub-agents, MCPs) son formas de componer, reutilizar, y escalar prompts. No entregues el control a abstracciones complejas prematuramente. Empieza con prompts conversacionales, refina, y solo entonces escala.

**Skills son automatización contextual**. Cuando un procedimiento se repite frecuentemente y debe ser automático, skills son la respuesta. Pero no conviertas todo en skills. La carga cognitiva de 50 skills con descripciones vagas es peor que 5 slash commands bien documentados.

**MCP es conectividad**. Para integrar sistemas externos, no hay substituto. Pero no crees un MCP solo porque puedes. Usa las herramientas nativas de Claude Code cuando basten.

**Sub-agents son para paralelismo y especialización**. Si necesitas procesar 100 archivos en paralelo, o restringir deliberadamente el contexto y herramientas de una tarea, sub-agents son ideales. Pero evita cadenas largas de sub-agents anidados.

**Slash commands son control manual**. Para flujos que el usuario dispara explícitamente y que están en fase de experimentación, slash commands proveen el balance perfecto entre reusabilidad y flexibilidad.

El futuro de la programación agentica no es maximizar el uso de todas las capacidades avanzadas, sino elegir la herramienta correcta para cada trabajo y componer con elegancia. Keep it simple, iterate, y escala solo cuando el patrón de uso lo justifique.

## Referencias y Recursos

### Documentación Oficial

- [Claude Code Docs - Inicio](https://code.claude.com/docs)
- [Skills en Claude Code](https://code.claude.com/docs/en/skills)
- [Sub-agents en Claude Code](https://code.claude.com/docs/en/sub-agents)
- [Model Context Protocol Specification](https://modelcontextprotocol.io)
- [Repositorio de MCP Servers oficiales](https://github.com/modelcontextprotocol/servers)

### Artículos y Guías

- [Skills Explained - Anthropic Blog](https://claude.com/blog/skills-explained)
- [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Understanding Claude Code's Full Stack: MCP, Skills, Subagents, and Hooks](https://alexop.dev/posts/understanding-claude-code-full-stack/)
- [Video: Skills Composicionales en Claude Code](https://www.youtube.com/watch?v=kFpLzCVLA20)

### Estándares y Convenciones

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)

---

*Última actualización: Diciembre 2025*
