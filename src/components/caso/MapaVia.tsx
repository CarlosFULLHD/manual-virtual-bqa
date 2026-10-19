"use client";

import { useState } from "react";
import type { ContenidoCaso } from "@/lib/types";

const LARGOS = [20, 18, 16, 14, 12, 10, 8, 6, 4];
const col = (c: number) => (20 - c) / 2 + 1;

/**
 * Mapa interactivo de la β-oxidación: el ácido graso se acorta de izquierda a derecha
 * y cada enzima cubre un tramo de longitudes. Al tocar una enzima se ve qué se acumula si falla.
 */
export function MapaVia({ enzimas }: { enzimas: ContenidoCaso["enzimas"] }) {
  const [sel, setSel] = useState(enzimas[0].id);
  const e = enzimas.find((x) => x.id === sel)!;
  return (
    <div className="mapa-via">
      <div className="mapa-scroll">
        <div className="mapa-grid">
          {LARGOS.map((c) => (
            <div key={c} className={`mapa-carbono ${c <= e.hasta && c >= e.desde ? "afectado" : ""}`} style={{ gridColumn: col(c) }}>
              C{c}
            </div>
          ))}
          <div className="mapa-flecha" style={{ gridColumn: "1 / -1" }} aria-hidden="true">
            <span>ácido graso largo</span>
            <span>se acorta 2 carbonos por vuelta →</span>
            <span>corto</span>
          </div>
          {enzimas.map((x, i) => (
            <button
              key={x.id}
              className={`mapa-enzima ${x.id === sel ? "activa" : ""} ${x.id === "etf" ? "transversal" : ""}`}
              style={{ gridColumn: `${col(x.hasta)} / ${col(x.desde) + 1}`, gridRow: i + 3 }}
              aria-pressed={x.id === sel}
              onClick={() => setSel(x.id)}
            >
              <b>{x.sigla}</b>
              <span>{x.rango}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="mapa-detalle" aria-live="polite" key={e.id}>
        <div className="eyebrow">Si falla esta enzima</div>
        <h3>{e.nombre}</h3>
        <dl className="mapa-datos">
          <div>
            <dt>Se acumula</dt>
            <dd className="mono">{e.acumula}</dd>
          </div>
          <div>
            <dt>Enfermedad</dt>
            <dd>{e.enfermedad}</dd>
          </div>
          <div>
            <dt>Gen</dt>
            <dd className="mono">{e.gen}</dd>
          </div>
        </dl>
        <p>{e.nota}</p>
      </div>
    </div>
  );
}
