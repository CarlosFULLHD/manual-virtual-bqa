"use client";

import { useState } from "react";
import type { PuntoMontaje, TipoMontaje } from "@/lib/types";
import { MontajeTitulacion } from "./MontajeTitulacion";

/** Dibujo del montaje con puntos numerados: al tocarlos se explica cada parte */
export function MontajeInteractivo({ tipo, puntos }: { tipo: TipoMontaje; puntos: PuntoMontaje[] }) {
  const [sel, setSel] = useState(0);
  const punto = puntos[sel];
  return (
    <div className="montaje">
      <div className="montaje-dibujo">
        {tipo === "titulacion" && <MontajeTitulacion sinEtiquetas />}
        <svg viewBox="0 0 360 300" className="montaje-capa" aria-hidden="false" role="group" aria-label="Partes del montaje">
          {puntos.map((pt, i) => (
            <g
              key={pt.titulo}
              className={`hotspot ${i === sel ? "activo" : ""}`}
              onClick={() => setSel(i)}
              role="button"
              tabIndex={0}
              aria-label={pt.titulo}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSel(i)}
            >
              <circle cx={pt.x} cy={pt.y} r="15" className="hotspot-halo" />
              <circle cx={pt.x} cy={pt.y} r="11" className="hotspot-punto" />
              <text x={pt.x} y={pt.y + 4} textAnchor="middle" className="hotspot-num">
                {i + 1}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className="montaje-info" aria-live="polite">
        <div className="montaje-chips">
          {puntos.map((pt, i) => (
            <button key={pt.titulo} className={`chip ${i === sel ? "activo" : ""}`} onClick={() => setSel(i)}>
              <span className="mono">{i + 1}</span> {pt.titulo}
            </button>
          ))}
        </div>
        <div className="montaje-detalle">
          <h3>{punto.titulo}</h3>
          <p>{punto.texto}</p>
        </div>
      </div>
    </div>
  );
}
