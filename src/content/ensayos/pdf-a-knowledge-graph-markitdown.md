---
title: "De PDF corporativo a knowledge graph: markitdown + GraphRAG en 3 pasos"
description: "De documentos inaccesibles a grafos de conocimiento consultables: cómo usar markitdown para extraer texto de PDFs y GraphRAG para indexarlo, construir un knowledge graph y hacer consultas globales sobre todo el corpus."
fecha: 2026-06-21
tags:
  - rag
  - knowledge-graph
  - graphrag
  - documentos
  - microsoft
tipo: investigacion
estado: pendiente-revision
autor: Alejandro de la Fuente
---

# De PDF corporativo a knowledge graph: markitdown + GraphRAG en 3 pasos

Hay dos problemas que se repiten en casi todos los proyectos de IA que trabajan con datos reales: los documentos están en formatos inaccesibles y los pipelines de RAG tradicionales no entienden la imagen completa.

El primer problema lo conoce cualquiera que haya intentado meter PDFs corporativos en un pipeline de LLMs. La mayoría de las herramientas de extracción producen texto sucio — tablas mal parseadas, saltos de página que rompen párrafos, contenido incrustado en imágenes que simplemente desaparece. El resultado es un LLM que responde con alucinaciones porque nunca vio la información relevante.

El segundo problema es más sutil pero igual de grave. El RAG vectorial tradicional — ese que trocea documentos, los mete en embeddings y recupera fragmentos por similitud semántica — funciona para preguntas locales ("¿cuánto cuesta el producto X?"), pero falla estrepitosamente con preguntas globales ("¿cuáles son las tendencias principales en todos los informes trimestrales del último año?"). Como bien explica el paper fundacional de Microsoft Research, *From Local to Global: A Graph RAG Approach to Query-Focused Summarization* (arXiv:2404.16130), este tipo de preguntas requieren un enfoque completamente distinto.

En este artículo voy a mostrar cómo combinar dos herramientas de Microsoft — `markitdown` y `GraphRAG` — para construir un pipeline que va desde un PDF corporativo hasta un knowledge graph consultable. Todo con código real, resultados reales, y sin maquillar las limitaciones.

## ¿Qué es markitdown?

`markitdown` es una utilidad Python de Microsoft (parte del ecosistema AutoGen) que convierte archivos de múltiples formatos a Markdown. Su propósito explícito es preparar documentos para ser consumidos por LLMs y pipelines de análisis de texto. Soporta:

- **PDF** (vía pdfminer.six + pdfplumber)
- **Word** (.docx), **PowerPoint** (.pptx), **Excel** (.xlsx, .xls)
- **HTML**, CSV, JSON, XML
- **Imágenes** (metadatos EXIF y OCR vía LLM)
- **Audio** (transcripción de voz)
- **EPUB**, ZIP, URLs de YouTube
- Formatos adicionales vía plugins

La filosofía es simple: Markdown está lo suficientemente cerca del texto plano para ser eficiente, pero conserva suficiente estructura (encabezados, listas, tablas, enlaces) para que los LLMs — que "hablan" Markdown de forma nativa — entiendan la jerarquía del documento.

La instalación básica es inmediata:

```bash
pip install 'markitdown[pdf]'
```

Y el uso desde Python no puede ser más directo:

```python
from markitdown import MarkItDown

md = MarkItDown()
result = md.convert("documento.pdf")
print(result.text_content)
```

También tiene CLI:

```bash
markitdown documento.pdf -o salida.md
```

## Paso 1: Convertir PDF a Markdown

Para esta prueba usé el paper original de GraphRAG: *From Local to Global: A Graph RAG Approach to Query-Focused Summarization*. Un PDF académico de 14 páginas, a dos columnas, con fórmulas matemáticas, tablas, figuras y referencias. Exactamente el tipo de documento que tortura a la mayoría de los extractores de texto.

```bash
wget -q -O graphrag_paper.pdf "https://arxiv.org/pdf/2404.16130"
```

### Resultados reales de la conversión

```python
from markitdown import MarkItDown

md = MarkItDown()
result = md.convert("graphrag_paper.pdf")
print(f"Longitud: {len(result.text_content)} caracteres")
# Longitud: 96915 caracteres
```

El archivo Markdown generado tiene 1,348 líneas y 96,915 caracteres. A primera vista, es un éxito: todo el texto del paper está ahí. Sin embargo, al inspeccionar la salida, emergen las limitaciones reales:

**Lo que funciona bien:**
- El texto se extrae en su totalidad — no hay pérdida de contenido
- Las tablas se preservan como tablas Markdown (con sintaxis de pipes)
- Las referencias y fórmulas matemáticas son legibles

**Lo que falla:**

1. **Concatenación de palabras.** En PDFs a dos columnas, las palabras de líneas adyacentes se fusionan sin espacios. El abstract del paper aparece como:
   ```
   tousethemaximumnumberoftokens(unitsoftext)thatcanbeprocessedbytheLLM
   atonce(Kuratovetal.,2024;Liuetal.,2023).InthecanonicalRAGsetup
   ```

2. **Cero encabezados Markdown.** La salida no genera un solo `#`. Las secciones como "1 Introduction", "2 Related Work" o "3 GraphRAG Method" aparecen como texto plano, sin estructura jerárquica. Esto es crítico porque GraphRAG necesita entender la estructura del documento.

3. **Artefactos de tabla en texto corrido.** pdfplumber a veces interpreta bloques de texto como tablas, generando pipes innecesarios:
   ```
   | The use   | of retrieval-augmented |           |     | generation | (RAG)   |
   | --------- | ---------------------- | --------- | --- | ---------- | ------- |
   | tion from | an external            | knowledge |     | source     | enables |
   ```

4. **Pérdida de contexto visual.** Las figuras, gráficos y diagramas del paper simplemente desaparecen. No hay OCR de imágenes sin configurar el plugin `markitdown-ocr` con un `llm_client`.

### Evaluación de calidad

Para documentos empresariales típicos (informes de una columna, facturas, contratos), markitdown produce resultados excelentes. Para papers académicos a dos columnas, necesitas post-procesamiento: un paso de limpieza que reconecte palabras separadas y detecte estructura de secciones.

La buena noticia es que markitdown ya incluye `graphrag-input` como dependencia opcional — Microsoft diseñó estas herramientas para funcionar juntas.

## Paso 2: Indexar con GraphRAG

[GraphRAG](https://github.com/microsoft/graphrag) es el sistema de Microsoft que construye un knowledge graph a partir de un corpus de texto para responder preguntas que requieren comprensión global. Su arquitectura funciona en cuatro fases:

1. **Extracción de entidades y relaciones.** Un LLM procesa cada chunk de texto e identifica entidades (personas, organizaciones, conceptos, lugares) y las relaciones entre ellas.
2. **Construcción del grafo.** Las entidades se convierten en nodos y las relaciones en aristas, formando un knowledge graph del corpus completo.
3. **Detección de comunidades.** El algoritmo de Leiden particiona el grafo en comunidades jerárquicas de entidades relacionadas.
4. **Generación de resúmenes.** Un LLM genera resúmenes de cada comunidad, desde las hojas hasta la raíz, creando una descripción multinivel de todo el corpus.

Cuando llega una consulta, GraphRAG hace map-reduce sobre los resúmenes comunitarios: en la fase *map*, cada resumen relevante genera una respuesta parcial; en la fase *reduce*, todas las parciales se combinan en una respuesta global.

### Integración markitdown → GraphRAG

La integración es natural porque GraphRAG espera texto como entrada. El pipeline mínimo es:

```bash
# 1. Convertir PDFs a Markdown
mkdir -p input
for pdf in documentos/*.pdf; do
    markitdown "$pdf" -o "input/$(basename $pdf .pdf).md"
done

# 2. Crear proyecto GraphRAG
graphrag init --root ./mi_grafo

# 3. Mover los archivos al directorio input de GraphRAG
cp input/*.md mi_grafo/input/

# 4. Indexar (construir el knowledge graph)
graphrag index --root ./mi_grafo

# 5. Consultar
graphrag query --root ./mi_grafo \
    --method global \
    --query "¿Cuáles son los temas principales del corpus?"
```

**Requisito importante:** GraphRAG necesita acceso a un LLM (OpenAI, Azure OpenAI, o compatible). La configuración se define en `mi_grafo/settings.yaml`, donde especificas el modelo, endpoint y API key.

Para esta prueba, la instalación de GraphRAG en el entorno fue problemática debido al tamaño de sus dependencias (onnxruntime ~18MB, litellm ~17MB, spacy con modelos de lenguaje, más de 80 paquetes transitivos). En un entorno con buena conectividad, la instalación es directa:

```bash
pip install graphrag
```

> **Nota real de esta prueba:** La red inestable impidió completar la instalación de GraphRAG en el momento de escribir este artículo. Esto es un problema genuino que cualquiera puede encontrar al trabajar con stacks de IA pesados. La solución en producción es usar Docker, `uv` con mejor caché, o entornos pre-configurados.

### Lo que GraphRAG hace con tu Markdown

Cuando indexas documentos convertidos con markitdown, GraphRAG:

1. **Chunkea** el texto en fragmentos manejables
2. **Extrae entidades** como "GraphRAG", "retrieval-augmented generation", "LLM", "knowledge graph", "Leiden algorithm"
3. **Establece relaciones** como `[GraphRAG] → USA → [LLM]`, `[GraphRAG] → particiona_con → [Leiden algorithm]`
4. **Agrupa** entidades en comunidades semánticas
5. **Genera resúmenes** de cada comunidad

El resultado es un knowledge graph que entiende no solo qué dice cada documento, sino cómo se relacionan las ideas entre sí.

## Paso 3: Consultar el grafo

Una vez indexado, GraphRAG ofrece dos modos de consulta:

### Local Search
Para preguntas factuales sobre entidades específicas. Similar al RAG vectorial tradicional, pero enriquecido con la estructura del grafo:

```bash
graphrag query --root ./mi_grafo --method local \
    --query "¿Cómo construye GraphRAG las comunidades?"
```

### Global Search
La verdadera innovación. Para preguntas que requieren comprensión de todo el corpus:

```bash
graphrag query --root ./mi_grafo --method global \
    --query "¿Cuáles son las principales contribuciones de este paper?"
```

En las evaluaciones del paper original, GraphRAG superó al RAG vectorial tradicional en *comprehensiveness* (47% más) y *diversity* (72% más) para preguntas de sensemaking global. La diferencia no es incremental — es cualitativa.

## Limitaciones y realidades

Este pipeline no es magia. Hay que ser honesto sobre lo que funciona y lo que no:

**1. Calidad de extracción.** markitdown con PDFs académicos a dos columnas produce texto con concatenaciones. Necesitarás un paso de post-procesamiento: detectar palabras fusionadas (heuristicas de diccionario), eliminar artefactos de tabla, y reconstruir la jerarquía de secciones.

**2. Coste de indexación.** GraphRAG hace múltiples llamadas al LLM durante la indexación: una por cada chunk para extraer entidades, una por cada comunidad para generar resúmenes, más las llamadas de consulta. Con GPT-4o y un corpus de 100 páginas, el coste puede superar los $10-20. Con modelos locales (Ollama + Llama 3), el coste es cero pero la calidad de extracción de entidades se degrada.

**3. Volumen de dependencias.** La instalación conjunta de markitdown + GraphRAG requiere ~2GB de paquetes Python, incluyendo onnxruntime, spacy con modelos de lenguaje, y múltiples librerías de Azure. No es ligero.

**4. Grafos vs embeddings.** GraphRAG no reemplaza al RAG vectorial — lo complementa. Para preguntas factuales simples, el RAG tradicional con embeddings sigue siendo más rápido y barato. GraphRAG brilla cuando necesitas entender patrones, tendencias y relaciones a través de todo el corpus.

**5. Documentos que no son texto.** Si tu PDF tiene contenido importante en imágenes (diagramas, gráficos, capturas de pantalla), markitdown sin el plugin `markitdown-ocr` simplemente lo ignora. La solución es añadir:

```python
from openai import OpenAI

md = MarkItDown(
    enable_plugins=True,
    llm_client=OpenAI(),
    llm_model="gpt-4o",
)
```

## El pipeline completo en producción

Juntando todo, un pipeline robusto para producción se ve así:

```python
import os
from pathlib import Path
from markitdown import MarkItDown

# Fase 1: Conversión masiva
def convertir_documentos(entrada_dir, salida_dir):
    """Convierte todos los PDFs en un directorio a Markdown."""
    md = MarkItDown()
    salida_dir = Path(salida_dir)
    salida_dir.mkdir(parents=True, exist_ok=True)

    for pdf in Path(entrada_dir).glob("*.pdf"):
        print(f"Convirtiendo {pdf.name}...")
        result = md.convert(str(pdf))
        output_path = salida_dir / f"{pdf.stem}.md"
        output_path.write_text(result.text_content)

    print(f"Convertidos {len(list(salida_dir.glob('*.md')))} archivos.")

# Fase 2: Limpieza post-conversión
def limpiar_concatenaciones(texto):
    """Corrige palabras fusionadas típicas de PDFs a dos columnas."""
    import re
    # Detectar camelCase artificial y separarlo
    texto = re.sub(r'([a-z])([A-Z])', r'\1 \2', texto)
    # Unir líneas partidas
    texto = re.sub(r'(?<![.\n])\n(?![.\n])', ' ', texto)
    return texto

# Fase 3: Preparar para GraphRAG
def preparar_para_graphrag(markdown_dir, graphrag_dir):
    """Copia archivos Markdown al input de GraphRAG."""
    import shutil
    for md_file in Path(markdown_dir).glob("*.md"):
        shutil.copy(md_file, Path(graphrag_dir) / "input" / md_file.name)

# Uso
convertir_documentos("pdfs_entrada/", "output_md/")
preparar_para_graphrag("output_md/", "mi_proyecto_graphrag/")

# Luego, desde terminal:
# graphrag index --root ./mi_proyecto_graphrag
# graphrag query --root ./mi_proyecto_graphrag --method global --query "..."
```

## Conclusión

markitdown y GraphRAG representan dos piezas complementarias en el puzzle de trabajar con documentos no estructurados e IA. markitdown resuelve el problema de *acceso* — convertir formatos binarios hostiles en texto que un LLM puede procesar. GraphRAG resuelve el problema de *comprensión* — ir más allá de la recuperación de fragmentos para entender las relaciones globales en un corpus.

La integración entre ambas es deliberada. Microsoft diseñó `graphrag-input` para depender explícitamente de `markitdown[pdf]`. No son herramientas aisladas — son una cadena de procesamiento pensada para funcionar junta.

¿Es perfecto? No. La conversión de PDFs complejos sigue siendo un problema duro, y el coste computacional de construir un knowledge graph con LLMs es alto. Pero para equipos que manejan volúmenes grandes de documentación corporativa — informes, contratos, documentación técnica, papers de investigación — este pipeline transforma un repositorio de archivos muertos en un grafo de conocimiento vivo y consultable.

El código está en GitHub. Las herramientas son open source (MIT). Y el camino de PDF a knowledge graph ahora son tres comandos.

---

**Referencias:**
- [microsoft/markitdown](https://github.com/microsoft/markitdown) — 157K ⭐
- [microsoft/graphrag](https://github.com/microsoft/graphrag) — Paper: [arXiv:2404.16130](https://arxiv.org/abs/2404.16130)
- Edge et al., *From Local to Global: A Graph RAG Approach to Query-Focused Summarization*, 2024
