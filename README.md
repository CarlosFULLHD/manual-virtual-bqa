# Manual Virtual · Bioquímica Aplicada

Manual virtual e interactivo de prácticas de laboratorio de Bioquímica Aplicada (UMSA).
Proyecto piloto hecho con **Next.js 16 (App Router) + React 19 + TypeScript**.

Pensado principalmente para el **estudiante**: poco texto, pantallas visuales e interactivas.
**Todo el contenido proviene de las guías de la cátedra** (los PDF de cada práctica).

### Contenido cargado

| N.º | Tipo | Título | Fuente |
|-----|------|--------|--------|
| L2 | Tema teórico | Preparación de soluciones, diluciones y buffers | Laboratorio 2 + Ejercicios 2 + Práctica (149 ejercicios con corrección) |
| 5 | Caso clínico | Tamizaje neonatal: defectos de la β-oxidación | Práctica 5 |
| 6 | Laboratorio | L-carnitina en alimentos | Práctica 6 |
| 7 | Laboratorio | Digestión y emulsificación de lípidos | Práctica 7 |
| 11 | Laboratorio | Adaptaciones metabólicas al ejercicio y ayuno | Práctica 11 |
| 13 | Laboratorio | Metabolitos secundarios vegetales | Práctica 13 |

### Tres tipos de práctica

Cada práctica declara su `tipo` y con eso cambian sus pantallas (ver `SECCIONES_POR_TIPO` en `src/lib/types.ts`):

- **`laboratorio`** — Inicio · Prepárate (seguridad + quiz) · Materiales · Esquema · Procedimiento · Resultados · Conclusiones · Resumen.
- **`teoria`** — Inicio · Conceptos (lecciones con fórmula, ejemplo guiado y mini calculadora) · Ejercicios (se corrigen solos y muestran la solución paso a paso) · Autoevaluación · Resumen. *Sin laboratorio ni conclusiones.*
- **`caso`** — Inicio · Fundamento (con mapa interactivo de la vía) · Casos (perfiles para identificar diagnóstico, enzima, gen y marcador) · Análisis (preguntas con ideas clave y búsqueda en PubMed) · Taller (caso complejo, ordenar estudios) · Artículos · Resumen. *Sin laboratorio.*

Además: **Herramientas** (diluciones, preparar soluciones, unidades, estadística) y **Glosario** con buscador. Los términos técnicos se marcan solos en los textos.

### Qué se agregó a lo que dicen las guías

Para que la app sea interactiva se escribieron, a partir del contenido de cada guía: las preguntas de los quiz, el "por qué" y "qué debes ver" de cada paso, las ideas clave de la Práctica 5, los tiempos por paso y los datos de peligro de los reactivos (pictogramas SGA). **Conviene que el docente los revise.** Los detalles están comentados al inicio de cada archivo de `src/data/practicas/`.

---

## Requisitos

- Node.js **20.9 o superior** (recomendado 22)
- npm

## Correr en tu computadora

```bash
npm install
npm run dev
```

Abrir http://localhost:3000

Otros comandos:

```bash
npm run build      # compila para producción
npm run start      # sirve la versión compilada
npm run typecheck  # revisa tipos de TypeScript
```

## Publicar en Vercel

1. Subir este repositorio a GitHub.
2. En https://vercel.com → **Add New… → Project** → importar el repositorio.
3. Vercel detecta Next.js solo. No hace falta cambiar nada ni poner variables de entorno.
4. **Deploy**. Cada `git push` a `main` vuelve a publicar la app.

---

## Estructura del proyecto

```
src/
├── app/                               # Rutas (App Router)
│   ├── page.tsx                       # Inicio: lo que sigue + todas las prácticas
│   ├── herramientas/ · glosario/ · docente/
│   └── practicas/[id]/
│       ├── layout.tsx                 # Cabecera + pestañas según el tipo
│       ├── inicio/ · resumen/         # Comunes a todos los tipos
│       ├── preparate/ · materiales/ · esquema/ · procedimiento/ · calculos/ · conclusiones/   # Laboratorio
│       └── [seccion]/page.tsx         # Teoría (conceptos, ejercicios, autoevaluacion) y caso (fundamento, casos, analisis, taller, fuentes)
├── components/
│   ├── practica/                      # Pantallas de laboratorio
│   ├── resultados/                    # Una calculadora de resultados por práctica (lipólisis, carnitina, metabolismo, fitoquímico)
│   ├── teoria/                        # Lecciones, mini calculadoras y ejercicios
│   ├── caso/                          # Perfil de acilcarnitinas, mapa de la vía, preguntas, taller
│   ├── esquemas/ · herramientas/ · glosario/ · inicio/ · layout/ · ui/
├── data/
│   ├── practicas/                     # ← Un archivo por práctica + index.ts
│   ├── ejercicios/soluciones.ts       # Banco de ejercicios (enunciado + resolutor)
│   └── glosario.ts
├── context/ProgresoContext.tsx        # Avance del estudiante (localStorage)
└── lib/
    ├── types.ts                       # Modelo de datos y tipos de práctica
    ├── soluciones.ts                  # Resolutores: calculan la respuesta y el paso a paso
    ├── calculos.ts · progreso.ts · fechas.ts
```

## Cómo agregar contenido

- **Práctica de laboratorio:** copiar `src/data/practicas/digestion-lipidos.ts`, cambiar el contenido y registrarla en `index.ts`. Si necesita cálculos propios, crear su componente en `src/components/resultados/` y agregarlo en `SeccionCalculos.tsx`.
- **Tema teórico:** copiar `soluciones.ts` (lecciones + quiz). Los ejercicios van en `src/data/ejercicios/`: cada uno es un enunciado más un resolutor de `src/lib/soluciones.ts`, así la respuesta siempre se calcula.
- **Caso clínico:** copiar `tamizaje-beta-oxidacion.ts` (bloques de teoría, casos con sus analitos, preguntas y taller).

## Limitaciones del piloto

- El avance, los datos y la conclusión de cada estudiante se guardan **solo en su navegador** (localStorage).
- No hay inicio de sesión. El botón Estudiante/Docente solo cambia la vista.
- Las fechas de cada práctica son provisionales: se cambian en el campo `fecha` de cada archivo.
- En la guía de L-carnitina el archivo dice "Práctica 6" y el encabezado interno "Práctica 10": confirmar el número.

## Siguientes pasos sugeridos

1. Cargar las prácticas que faltan del manual.
2. Base de datos + inicio de sesión (por ejemplo Supabase o Vercel Postgres) para que el docente vea el avance.
3. Cuestionario previo al laboratorio con corrección automática.
4. Calculadora de curva de calibración con gráfico para las prácticas de espectrofotometría.
5. Exportar la tabla de resultados a PDF / Excel.
