"use client";

import { usePractica } from "@/context/ProgresoContext";
import { BotonCopiar } from "@/components/ui/Copiar";
import type { Esquema } from "@/lib/types";

/** Esquema que el grupo debe elaborar: una cadena de eslabones para completar */
export function EsquemaCadena({ practicaId, cadena }: { practicaId: string; cadena: NonNullable<Esquema["cadena"]> }) {
  const { progreso, actualizar } = usePractica(practicaId);
  const valor = (id: string) => progreso.respuestas[`cadena.${id}`] ?? "";
  const completos = cadena.filter((c) => valor(c.id).trim()).length;
  const texto = cadena.map((c) => `${c.nombre.toUpperCase()}: ${valor(c.id) || "…"}`).join("\n   ↓\n");
  return (
    <div className="stack">
      <ol className="cadena">
        {cadena.map((c, i) => (
          <li key={c.id} className={valor(c.id).trim() ? "lleno" : ""}>
            <span className="calculo-num">{i + 1}</span>
            <label htmlFor={`cadena-${c.id}`}>
              <b>{c.nombre}</b>
              <input
                id={`cadena-${c.id}`}
                className="input-texto"
                value={valor(c.id)}
                placeholder={c.ayuda}
                onChange={(e) => {
                  const v = e.target.value;
                  actualizar((pr) => ({ ...pr, respuestas: { ...pr.respuestas, [`cadena.${c.id}`]: v } }));
                }}
              />
            </label>
          </li>
        ))}
      </ol>
      <div className="row entre">
        <span className="muted pequeno">
          {completos}/{cadena.length} eslabones completos. Apóyate en tus resultados y en la bibliografía.
        </span>
        <BotonCopiar texto={texto} etiqueta="Copiar esquema" />
      </div>
    </div>
  );
}
