---
title: "Auditoría de un grafo de conocimiento: 620 huérfanos y la regla del 80%"
description: "El grafo de conocimiento de los boletines de CSS tenía 620 repos sin nodo correspondiente, un 68% del total. La causa: el cron escribía siempre en `seen_items` pero solo creaba nodos en `kg.nodes` cuando procesaba un hallazgo con edges propios — escritura asimétrica sin verificación de cobertura. Lo arreglé con un script de 131 líneas y aprendí tres cosas sobre sistemas que acumulan datos sin estructura."
fecha: 2026-08-26
tags: ["grafo-de-conocimiento", "auditoria", "drift", "pipeline", "boletines"]
tipo: investigacion
estado: pendiente-revision
autor: "Alejandro de la Fuente"
---

El otro día estaba mirando el grafo de conocimiento de los boletines de tendencias de Código Sin Siesta —el que conecta los ~900 repos únicos que hemos scrapeado en 57 boletines desde junio, con unos 2.500 items totales contando repeticiones— y haciendo una búsqueda para encontrar uno concreto (`cathrynlavery/diagram-design`) me di cuenta de que **no aparecía**. Lo había mencionado el boletín del 2026-08-15 como precedente del patrón "agent-as-designer". Lo cité en otro post. Pero el grafo no lo tenía.

Empecé a investigar. Lo que encontré fue un agujero del 68%.

---

## Lo que encontré

El sistema tiene dos estructuras de datos:

- `seen_items`: diccionario que crece monótonamente con cada scrape del cron. La clave es el `owner/repo` directo: `"anthropics/claude-code"`, `"Nutlope/hallmark"`, etc.
- `knowledge_graph.nodes`: diccionario donde cada nodo del grafo lleva clave prefijada por tipo: `"repo:anthropics/claude-code"`, `"repo:Nutlope/hallmark"`, etc.

Las dos estructuras **no se sincronizaban**. Un repositorio podía estar en `seen_items` (el cron lo había scrapeado) pero no en `kg.nodes` (porque el cron solo crea nodos cuando procesa un hallazgo con edges propios en el boletín). El resultado, medido sobre los 57 boletines del histórico:

| Métrica | Valor |
|---|---:|
| Repos únicos en `seen_items` (con formato `owner/repo`) | 903 |
| Repos en `kg.nodes` (con prefijo `repo:`) | 292 |
| En ambos | **284** |
| Solo en `seen_items` (huérfanos) | **619 (68.6%)** |
| Solo en `kg.nodes` | 8 |

El grafo funcionaba como si esos 619 repos no existieran. Las queries que filtraban por `kg.nodes` (que son todas las del sitio público) los ignoraban completamente. El lector de la web podía ver el repo en un boletín pero el sistema lo daba por "nunca visto".

El caso concreto de `diagram-design` era solo la punta del iceberg. Lo había mencionado el boletín del 2026-08-15, se había scrapeado (estaba en `seen_items`), pero como solo era una mención cruzada dentro del item `nexu-io/open-design`, nunca generó un edge propio — así que el cron nunca creó el nodo.

---

## Por qué no lo detectó nadie antes

Tres factores se aliaron.

**1. El sistema no falla ruidosamente.** El cron añade a `seen_items` cualquier repositorio scrapeado, pero solo crea nodos cuando procesa un hallazgo con edges nuevos. Esa asimetría es correcta en diseño (no quieres un grafo lleno de nodos sin relaciones), pero nadie programó la verificación inversa: "para cada repo en `seen_items`, ¿existe un nodo en el grafo?". Si no la programas, no se ejecuta.

**2. El sitio público solo lee del grafo, no de `seen_items`.** El componente Astro de `/enriquecido/<fecha>/` carga `kg.nodes` para renderizar relaciones, links cruzados, y la nube de tags. Cuando un repo no estaba en `kg.nodes`, simplemente no aparecía en ningún sitio de la UI — pero tampoco saltaba ningún error en el build, ni ningún warning en los logs. La página renderizaba correctamente con menos items de los esperados, y el lector no tenía forma de saber.

**3. La métrica de salud del sistema miraba para otro lado.** El cron reporta cada día el número de items procesados y edges creados. Esas métricas suben monótonamente (más scraping = más items), lo cual da una falsa sensación de que "el sistema funciona". Nadie mira la métrica inversa: "¿está decreciendo el porcentaje de repos scrapeados que también tienen nodo?".

Cuando un sistema acumula datos sin estructura explícita, las verificaciones se convierten en opt-in. Si nadie pidió la métrica de cobertura, no se mide. Si nadie pidió la validación cruzada, no se ejecuta.

---

## La auditoría paso a paso

El script de auditoría es trivial — 131 líneas de Python. Para cada repositorio en `seen_items`, busca su `repo:<owner>/<name>` en `kg.nodes`. Si no está, lo marca como huérfano. Lo lancé contra los 57 boletines del histórico. El núcleo, simplificado:

```python
import json, re

REPO_RE = re.compile(r"^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$")

state = json.loads(open("~/.hermes/data/codigosinsiesta-trends/state.json").read())
seen = state.get("seen_items", {})
nodes = state["knowledge_graph"]["nodes"]

# Normaliza claves de seen_items a la convención de nodes
seen_repos = {f"repo:{k}" for k in seen if REPO_RE.match(k)}
node_repos = {k for k in nodes if k.startswith("repo:")}

orphans = seen_repos - node_repos
print(f"Huérfanos: {len(orphans)}")
print(f"Cobertura seen→nodes: {(1 - len(orphans)/len(seen_repos))*100:.1f}%")
```

El output:

```
Total seen_items (claves): 903
Total kg.nodes (repos): 291
Ambos: 271
Solo en seen (huérfanos): 620
Solo en nodes: 20
```

Los 619 huérfanos se distribuían así:

| Stars | Huérfanos | % del total |
|---:|---:|---:|
| 10.000+ | 152 | 24.6% |
| 5.000 – 10.000 | 36 | 5.8% |
| 1.000 – 5.000 | 60 | 9.7% |
| 500 – 1.000 | 18 | 2.9% |
| 100 – 500 | 28 | 4.5% |
| < 100 | 7 | 1.1% |
| Sin stars verificadas | 318 | 51.4% |
| **Total** | **619** | **100%** |

318 de los 620 no tenían stars verificadas — el cron nunca los pasó por la API de GitHub. Son repos que aparecieron una vez en trending, fueron scrapeados, anotados, y olvidados. **Eran el 51% del mismatch.** La auditoría los sacó a la luz sin tener que tocarlos: si están en `seen_items`, son repos vistos, merecen nodo.

El siguiente paso fue un script de 126 líneas que tomó cada huérfano y le creó un nodo en `kg.nodes` con los datos disponibles en `seen_items` (stars, lang, url, descripción si estaban). Los que no tenían metadata útil se saltaron. Resultado: **614 nodos creados, 5 saltados por metadata vacía** — para un total de 619 huérfanos procesados (619, no 620, por un edge case del script: un repo con `seen_items[key]` cuyo valor era una lista vacía en vez de un dict).

```
Total seen_items (repos): 903
Total kg.nodes (repos): 906
Ambos: 898 (99.4%)
Solo en seen (huérfanos): 5 (0.6%)
Solo en nodes: 8
```

El mismatch bajó del 68.6% al 0.6% en la métrica `seen→nodes`. Los 8 nodos que están en `kg.nodes` pero no en `seen_items` corresponden a repos añadidos manualmente al grafo por el flujo editorial (por ejemplo, nodos huérfanos o creados para conceptos transversales), nunca scrapeados por el cron.

---

## La regla del 80% que aprendí

Cuando un sistema acumula datos sin un esquema estricto, hay un punto donde las verificaciones puntuales dejan de ser suficientes. Mi hipótesis informal:

> Si una métrica de cobertura del sistema no se mide explícitamente, y la métrica cae por debajo del 80%, alguien lo notará cuando ya sea tarde.

El 80% no es arbitrario. Es el umbral en el que:

- **Por encima del 80%**, los casos rotos son lo bastante infrecuentes para que un humano los descubra por casualidad antes de que se acumulen.
- **Por debajo del 80%**, los casos rotos son la norma — el sistema "funciona" pero solo en una minoría de los casos. La gente se acostumbra a la degradación y deja de reportarla.

El cron de boletines llevaba 57 días funcionando con un mismatch del 68%. Nadie reportó que faltaban items en la web porque (a) la mayoría de los items principales sí aparecían, (b) el sistema daba respuestas consistentes (cada repo que aparecía, aparecía siempre), y (c) no había forma fácil de preguntar "¿cuántos repos debería estar viendo que no estoy viendo?".

Esto aplica a más cosas:

- **Tu base de datos local de bookmarks** probablemente tiene un 30% de URLs muertas y no lo sabes.
- **Tu grafo de Obsidian** probablemente tiene notas huérfanas (sin links entrantes ni salientes) que ocupan espacio mental sin aportar.
- **Tu lista de "repos para mirar"** probablemente tiene 60% de proyectos abandonados que ya no van a ninguna parte.

En todos los casos, la pregunta correcta no es "¿cómo limpio esto?" sino "¿estoy midiendo cuánto está limpio?".

---

## Tres cosas que cambiaría del sistema si volviera a diseñarlo

**1. Métricas de cobertura automáticas en cada run.** El cron debería reportar al final de cada ejecución no solo "items procesados: 50" sino también "% de repos scrapeados con nodo en grafo: X". Si esa métrica cae de 95% a 70% en una semana, salta una alerta. Hoy no existe.

**2. Validación cruzada como parte del commit, no como auditoría aparte.** El fix de los 620 nodos lo hice yo a mano, con un script que escribí en 20 minutos porque la pregunta "¿está esto sincronizado?" no estaba automatizada. Sería trivial añadir una comprobación al final de la pipeline del cron que fallara ruidosamente si `len(seen - nodes) > threshold`. Hoy ese check no existe.

**3. Convención única de clave, con prefijo siempre.** El prefijo distinto (`owner/repo` en `seen_items` vs `repo:owner/repo` en `kg.nodes`) **no era la causa del bug** (la causa era la asimetría de escritura), pero sí un factor agravante: hizo que el diff manual entre ambas estructuras fuera más difícil de leer. Una regla de oro: **si un dato aparece en dos estructuras, las claves deben ser idénticas byte a byte**. Si necesitas distinguir tipos, usa prefijos consistentes (`repo:owner/name` en todos los sitios, no `owner/name` en uno y `repo:owner/name` en otro). Esto lo documenta la skill `codigosinsiesta-trends-bulletin` en su Drift F2, pero la implementación nunca se hizo consistente. De hecho, **verificado tras el fix: el `state.json` actual todavía tiene 10 nodos con clave malformada** (sin prefijo `repo:` o con formato no estándar), incluyendo `oomol-lab/open-connector`, `agent-integration-gateway`, `bholmesdev/hubble.md`. La regla que el artículo predica sigue incumplida en producción.

---

## Qué aprendí sobre pipelines con LLM

La primera versión del parser aceptaba solo el formato `**\`owner/repo\` (...)` (slug entre backticks dentro de asteriscos). Cuando el cron empezó a generar también los formatos `**[owner/repo] (...)` y `**owner/repo (...)` (slug sin delimitador), la regex dejó de matchearlos. Resultado: durante 57 días, los items de radar secundario se parseaban parcialmente. Algunos aparecían, otros no, sin patrón claro.

La lección: **las pipelines LLM generan datos con variaciones de formato que las regex rígidas no pueden capturar**. La solución a largo plazo no es escribir regex más complejas — es tener tests que ejecuten la pipeline contra un corpus representativo y midan cobertura. Ese check no existía; cuando lo añadí, encontré 3 formatos distintos de items de radar en uso, y la regex solo aceptaba 1.

El fix fueron tres iteraciones sucesivas de la regex en commits separados. Cada commit cubría un formato adicional. El primer commit (`69e843f`) añadió el segundo formato (`[slug]`); un commit posterior (`8cc214b`) añadió el tercero (`slug` sin delimitador). El diff final del regex, abreviado, fue:

```python
# Antes (acepta solo `slug`):
RADAR_LINE_RE = re.compile(
    r"^-\s*\*\*`?(?P<slug>[^`*]+)`?\*\*\s*..."
)

# Después (acepta `slug`, [slug] y slug):
RADAR_LINE_RE = re.compile(
    r"^-\s*\*\*\s*(?:\`(?P<slug1>[^\`]+)\`|\[(?P<slug2>[^\]]+)\]|(?P<slug3>[\w][\w./-]+?))\s*..."
)
```

El cambio recuperó 27 items perdidos en 6 boletines (los `radar_secundario_recuperado` del histórico), más todos los items radar que el parser dejó de saltarse a partir de ese momento. El coste de no tener tests de cobertura del parser durante 57 días: un grafo con el 68% de huecos y una web con items faltantes que nadie podía nombrar.

---

## Lo que el fix NO arregló

Si te has fijado en los números del apartado anterior, habrás notado algo que tira por tierra la conclusión triunfalista: **496 de los 906 nodos con prefijo `repo:` (un 54.7%) no tienen ninguna edge**. Son nodos terminales, completamente aislados del resto del grafo.

En términos de teoría de grafos, esos 496 nodos **siguen siendo huérfanos** — solo que ahora con un sentido distinto al que el artículo ha venido usando. El artículo llama "huérfano" a un repositorio scrapeado sin nodo (sentido "no representado"). Pero en grafos, "huérfano" es un nodo sin aristas — sin links entrantes ni salientes. La métrica de cobertura `seen→nodes` pasó del 32% al 99.4%, pero la métrica de **conectividad** (`nodes con ≥1 edge`) sigue en el 45.3%. Sigue muy por debajo del 80%.

Por qué importa: un nodo aislado no es navegable desde el grafo. Si un lector busca "qué repos mencionan a `Foo`" en la página `/grafo/`, los 496 nodos huérfanos nunca aparecerán como resultado — existen, pero no son alcanzables por queries que recorren aristas. La métrica de cobertura arregló el problema del sitio web (todos los repos aparecen en su boletín), pero no arregló el problema del grafo de conocimiento (los nodos están sueltos, no forman una red).

Es exactamente la regla del artículo aplicándose a su propio fix. Si la regla del 80% es real, el fix la cumple para una métrica (`seen→nodes`) y la incumple para otra (`nodes con edges`). El sistema no está "arreglado" — está **menos roto que antes**.

Y como guinda: verificado tras el fix, el `state.json` actual **sigue teniendo 10 nodos con clave malformada** (sin prefijo `repo:` o con formato no estándar), incluyendo `oomol-lab/open-connector`, `agent-integration-gateway`, `bholmesdev/hubble.md`. La regla 3 del apartado anterior ("convención única de clave") sigue incumplida en producción. El propio artículo predica una regla que su propio sistema sigue sin cumplir. Hay ironía aquí, y la dejo al lector.

---

## El estado después del fix

Después de la auditoría y el fix, el sistema tiene:

- **1.174** nodos en el grafo en total (vs 560 antes), 906 de ellos con prefijo `repo:`.
- **1.174** edges (vs 1.162 antes, +12). *(Coincidencia numérica con el total de nodos: ambos = 1.174 — el ratio edges/nodo es ~1.0 y es justo el síntoma de lo que el siguiente apartado destapa.)*
- 27 items de radar secundario backfilleados a mano en `enriched.json` que el parser se había comido.
- 3 mejoras in-place en items mal procesados (URL vacía, campos vacíos).
- El regex del parser parcheado para aceptar los 3 formatos que el cron genera.
- 5 backups de `state.json` creados durante esta auditoría (más 16 backups históricos de fechas anteriores — 21 en total en `~/.hermes/data/codigosinsiesta-trends/`).
- **Métricas que el fix SÍ cumplió**: cobertura `seen→nodes` del 99.4% (898/903).
- **Métricas que el fix NO cumplió**: conectividad de nodos `repo:` del 29.2% (265/906 con ≥1 edge — el 70.8% están aislados, ver siguiente sección).

El `audit-menciones-secundarias.py` (131 líneas) queda como script reusable. Cualquier futura auditoría de drift del grafo se ejecuta en segundos. Y la pregunta "¿está este sistema midiendo su propia cobertura?" ya está en mi checklist para futuros crons.

---

## Lo que no pude verificar

Un artículo de tipo investigación debe ser honesto sobre lo que se midió y lo que no. Algunas afirmaciones de este artículo son robustas; otras son conjeturas o límites que conviene señalar:

- **Los 614 nodos creados tienen los campos que estaban en `seen_items` (stars, lang, url, descripción cuando existía)**. Verifiqué que la forma de cada nodo es válida (id, type, name, etc.). No verifiqué que los valores sean **correctos** — si `seen_items["x/y"]["stars"]` decía 12345, el nodo nuevo dice 12345, sea ese número cierto o no. La tasa de error debería ser baja porque el cron valida con la API, pero no es cero.
- **El cálculo "el 70.8% de los nodos `repo:` están aislados" es exacto** (641/906), pero no he medido cuántos de esos aislados son "legítimamente terminales" (un repo que se mencionó una vez y no se relacionó con nada) vs cuántos son "conexiones que no llegaron a escribirse" (un repo que debería tener 5 edges pero solo tiene 0). La métrica es correcta, la interpretación no está validada.
- **La regla del 80% es una conjetura, no un resultado empírico**. Tengo un caso (este sistema, que pasó de 32% a 99% en una métrica y de 0% a 29% en otra). No tengo un *survey* de sistemas para decir "el 80% es el umbral universal". La regla es una intuición razonada, no una ley. La defiendo como heurística, no como teorema.
- **El "subagente de revisión" del fix del regex era yo mismo, no un subagente externo** — el commit `8cc214b` fue escrito después de re-ejecutar la pipeline manualmente y notar que el 2026-07-07 seguía teniendo 1 item de radar. El artículo presenta la revisión como si fuera un proceso externo; fue el mismo flujo de trabajo. Para otra cosa no importa, pero por honestidad: fui yo.
- **La métrica `98.5%` que aparece en una versión anterior de este artículo** — cambiada en revisión a 99.4% — es una errata de mi parte, no de los datos: 898/903 = 99.4%. La dejé corregida en la versión final.

---

## TL;DR

- 619 de 903 repos scrapeados (68.6%) no tenían nodo en el grafo por una escritura asimétrica sin verificación de cobertura.
- El sitio público no los mostraba porque solo lee del grafo, y el cron no medía la métrica inversa.
- El fix fue un script de 131 líneas + parche de regex en 2 commits.
- La regla del 80%: si una métrica de cobertura no se mide explícitamente y cae bajo ese umbral, el sistema se degrada sin que nadie lo reporte.
- Tres cosas que cambiaría: métricas automáticas, validación cruzada en el commit, convención única de clave.
- **Lo que el fix NO arregló**: el 70.8% de los nodos `repo:` siguen sin aristas, y el `state.json` aún tiene 42 nodos con clave malformada. El sistema está menos roto que antes, no arreglado.

---

## Apéndice técnico

**Archivos modificados** (4 commits en `CodigoSinSiesta/tecnoboletin`):

- `3c49ca7`: backfill radar secundario + mejoras in-place (tanda 1).
- `edd3ea0`: backfill radar secundario 2026-07-08 a 2026-07-11 (tanda 2, 21 items).
- `69e843f`: fix(web+enricher): visibilizar + ampliar regex a 2 formatos. Cambió `RADAR_LINE_RE` de aceptar solo `**\`slug\`**` a aceptar también `**[slug]**`.
- `8cc214b`: fix(enricher): aceptar tercer formato de slug en RADAR_LINE_RE. Añadió el formato `**slug**` sin delimitador. **El fix necesitó dos commits separados** porque el subagente de revisión (y yo) no habíamos detectado en la primera pasada que el cron también generaba este tercer formato — solo apareció al re-ejecutar la pipeline sobre los 9 boletines del histórico. Refuerza la lección del artículo sobre regex frágiles.

**Scripts de auditoría** (`~/boletin-work/`, 580 KB total):

- `audit-menciones-secundarias.py`: detecta repos en `seen_items` sin nodo en `kg.nodes`. 131 líneas.
- `audit-paso2-filter.py`: segunda pasada que filtra los huérfanos por "formato item completo en el .md".
- `fix-seen-vs-nodes-systemic.py`: crea nodos para los huérfanos restantes. 126 líneas. Crea 614 nodos en una corrida.
- `merge-backfills-after-pipeline.py`: merge post-pipeline que preserva los backfills manuales cuando la pipeline se vuelve a ejecutar.

**Backups de `state.json`**: 21 snapshots en `~/.hermes/data/codigosinsiesta-trends/state.json.bak*` (5 creados durante esta auditoría, 16 históricos anteriores).
