"use client";

import { usePractica } from "@/context/ProgresoContext";
import { Vacio } from "@/components/ui/Vacio";
import type { Practica } from "@/lib/types";
import { PreguntaAbierta } from "./PreguntaAbierta";

/** Actividades 1.2 y 1.3: preguntas de razonamiento sobre los cinco casos */
export function SeccionAnalisis({ p }: { p: Practica }) {
  const c = p.caso;
  const { progreso, actualizar } = usePractica(p.id);
  if (!c) return <Vacio />;
  const total = c.analisis.reduce((s, b) => s + b.preguntas.length, 0);
  const hechas = c.analisis.flatMap((b) => b.preguntas).filter((q) => (progreso.respuestas[q.id] ?? "").trim().length > 20).length;
  return (
    <div className="stack grande">
      <div className="callout">
        <b>Actividad individual (60 min).</b> Responde de forma razonada, apoyándote en los perfiles de la sección Casos y en el mapa de la vía.{" "}
        <span className="mono">
          {hechas}/{total}
        </span>{" "}
        respondidas.
      </div>
      {c.analisis.map((bloque) => (
        <section key={bloque.titulo} className="stack">
          <h2>{bloque.titulo}</h2>
          {bloque.preguntas.map((q) => (
            <PreguntaAbierta
              key={q.id}
              q={q}
              valor={progreso.respuestas[q.id] ?? ""}
              onChange={(v) => actualizar((pr) => ({ ...pr, respuestas: { ...pr.respuestas, [q.id]: v } }))}
            />
          ))}
        </section>
      ))}
    </div>
  );
}
