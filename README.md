# Manual Virtual · Bioquímica Aplicada

Manual virtual e interactivo de prácticas de laboratorio de Bioquímica Aplicada (UMSA).
Proyecto piloto hecho con **Next.js 16 (App Router) + React 19 + TypeScript**.

Cada práctica se recorre en 6 secciones:

| # | Sección | Qué muestra |
|---|---------|-------------|
| 1 | **Inicio** | Explicación sencilla, objetivos, seguridad y fundamento teórico |
| 2 | **Materiales** | Lista de materiales para marcar y reactivos con ficha de riesgos (pictogramas SGA) |
| 3 | **Esquema** | Diagrama de flujo generado desde los pasos, dibujo del montaje y reacción química |
| 4 | **Procedimiento** | Tarjetas paso a paso: qué hacer, por qué, qué se debe ver, error frecuente, simulador, temporizador y registro de datos |
| 5 | **Cálculos** | Resultado automático con la fórmula, desarrollo, promedio, desviación estándar, CV y tabla para copiar al informe |
| 6 | **Conclusiones** | Comparación con el valor de referencia, causas probables, preguntas guía, conclusión y bibliografía |

Los términos técnicos (bureta, enrasar, punto final…) se marcan solos y abren su definición del glosario.

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
├── app/                              # Rutas (App Router)
│   ├── layout.tsx                    # Layout general: fuentes, barra superior, estado
│   ├── page.tsx                      # Pantalla inicial: lista de prácticas
│   ├── globals.css                   # Estilos y colores (claro / oscuro)
│   ├── not-found.tsx
│   ├── docente/page.tsx              # Panel docente: generador de prácticas
│   └── practicas/[id]/
│       ├── layout.tsx                # Cabecera + pestañas de la práctica
│       ├── page.tsx                  # Redirige a /inicio
│       ├── inicio/page.tsx
│       ├── materiales/page.tsx
│       ├── esquema/page.tsx
│       ├── procedimiento/page.tsx
│       ├── calculos/page.tsx
│       └── conclusiones/page.tsx
├── components/
│   ├── layout/                       # Barra superior, pestañas, estado de la práctica
│   ├── practica/                     # Una componente por sección + simulador + temporizador
│   ├── esquemas/                     # Diagrama de flujo y dibujos de montaje (SVG)
│   ├── docente/                      # Editor de prácticas
│   └── ui/                           # Modal, glosario, pictogramas SGA, copiar, vacío
├── context/ProgresoContext.tsx       # Rol y avance del estudiante (localStorage)
├── data/
│   ├── practicas/                    # ← Contenido: un archivo por práctica
│   │   ├── index.ts                  # Registro de prácticas
│   │   ├── acidez-leche.ts           # Práctica completa de ejemplo
│   │   ├── glucosa.ts                # Borrador
│   │   └── proteinas.ts              # Borrador
│   ├── glosario.ts
│   └── ghs.ts
└── lib/
    ├── types.ts                      # Modelo de datos de una práctica
    ├── calculos.ts                   # Calculadoras y estadística
    └── fechas.ts
```

Rutas resultantes:

- `/` lista de prácticas
- `/practicas/acidez-leche/inicio` … `/conclusiones`
- `/docente` panel docente

## Cómo agregar una práctica

**Opción rápida:** entrar como *Docente* → **Panel docente**, llenar el formulario y copiar el código generado.

**Paso a paso:**

1. Crear `src/data/practicas/mi-practica.ts` siguiendo el tipo `Practica` de `src/lib/types.ts`
   (se puede copiar `acidez-leche.ts` como plantilla).
2. Importarla y agregarla al arreglo en `src/data/practicas/index.ts`.
3. Si la práctica necesita un **cálculo nuevo**, agregarlo en `CALCULADORAS` de `src/lib/calculos.ts`
   y su nombre en `TipoCalculo` (`types.ts`). Ya existen funciones para regresión lineal (curvas de calibración),
   diluciones, masa de soluto y % de error.
4. Si necesita un **dibujo de montaje nuevo**, crear el SVG en `src/components/esquemas/` y registrarlo en `esquemas/index.tsx`.

Las secciones sin datos se muestran como “en preparación”, así que se puede publicar una práctica a medias.

## Limitaciones del piloto

- El avance, los datos y la conclusión de cada estudiante se guardan **solo en su navegador** (localStorage).
- No hay inicio de sesión. El botón Estudiante/Docente solo cambia la vista.
- El contenido de la práctica de ejemplo (cantidades, concentraciones, rango de referencia) debe
  **revisarse con el manual de la cátedra**.

## Siguientes pasos sugeridos

1. Cargar las prácticas reales del manual.
2. Base de datos + inicio de sesión (por ejemplo Supabase o Vercel Postgres) para que el docente vea el avance.
3. Cuestionario previo al laboratorio con corrección automática.
4. Calculadora de curva de calibración con gráfico para las prácticas de espectrofotometría.
5. Exportar la tabla de resultados a PDF / Excel.
