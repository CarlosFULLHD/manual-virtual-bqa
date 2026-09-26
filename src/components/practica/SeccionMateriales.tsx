"use client";

import { useState } from "react";
import { usePractica } from "@/context/ProgresoContext";
import { GHS } from "@/data/ghs";
import { GhsIcono } from "@/components/ui/GhsIcono";
import { Modal } from "@/components/ui/Modal";
import { TextoGlosario } from "@/components/ui/TextoGlosario";
import { Vacio } from "@/components/ui/Vacio";
import type { Practica, Reactivo } from "@/lib/types";

export function SeccionMateriales({ p }: { p: Practica }) {
  const { progreso, actualizar } = usePractica(p.id);
  const [reactivo, setReactivo] = useState<Reactivo | null>(null);

  if (!p.materiales.length && !p.reactivos.length) return <Vacio />;
  const listos = p.materiales.filter((_, i) => progreso.checks[i]).length;

  return (
    <div className="grid2">
      <section className="panel">
        <div className="row entre">
          <h3>Material y equipo</h3>
          <span className={`pill ${listos === p.materiales.length ? "ok" : ""}`}>
            {listos}/{p.materiales.length} listos
          </span>
        </div>
        <p className="muted pequeno" style={{ margin: "4px 0 8px" }}>
          Marca lo que ya tienes en tu mesa.
        </p>
        {p.materiales.map((m, i) => (
          <div className="check" key={m.nombre}>
            <input
              type="checkbox"
              id={`mat-${i}`}
              checked={!!progreso.checks[i]}
              onChange={(e) => actualizar((pr) => ({ ...pr, checks: { ...pr.checks, [i]: e.target.checked } }))}
            />
            <label htmlFor={`mat-${i}`}>
              <TextoGlosario texto={m.nombre} />
            </label>
            <span className="mono muted">×{m.cantidad}</span>
          </div>
        ))}
      </section>

      <section className="panel">
        <h3>Reactivos</h3>
        <p className="muted pequeno" style={{ margin: "4px 0 10px" }}>
          Toca un reactivo para ver para qué sirve y sus riesgos.
        </p>
        <div className="stack" style={{ gap: 8 }}>
          {p.reactivos.map((r) => (
            <button key={r.id} className="reactivo" onClick={() => setReactivo(r)}>
              <span>
                <b>{r.nombre}</b>
                <br />
                <span className="muted pequeno">{r.concentracion}</span>
              </span>
              <span className="row" style={{ gap: 6 }}>
                {r.ghs.length ? r.ghs.map((g) => <GhsIcono key={g} codigo={g} />) : <span className="pill">Sin pictograma</span>}
              </span>
            </button>
          ))}
        </div>
      </section>

      <Modal abierto={!!reactivo} onCerrar={() => setReactivo(null)} titulo={reactivo?.nombre ?? ""} etiqueta="Reactivo">
        {reactivo && (
          <>
            <p className="muted">{reactivo.concentracion}</p>
            {reactivo.ghs.length > 0 && (
              <div className="row" style={{ marginTop: 10 }}>
                {reactivo.ghs.map((g) => (
                  <span key={g} className="row" style={{ gap: 6 }}>
                    <GhsIcono codigo={g} />
                    <span className="pequeno">{GHS[g]}</span>
                  </span>
                ))}
              </div>
            )}
            <dl className="ficha">
              <dt>¿Para qué sirve aquí?</dt>
              <dd>{reactivo.funcion}</dd>
              <dt>Riesgos</dt>
              <dd>{reactivo.peligros}</dd>
              <dt>Protección</dt>
              <dd>{reactivo.proteccion}</dd>
              <dt>Desecho</dt>
              <dd>{reactivo.desecho}</dd>
              {reactivo.fuente && (
                <>
                  <dt>Fuente</dt>
                  <dd>
                    <a href={reactivo.fuente} target="_blank" rel="noopener noreferrer">
                      Ficha en PubChem ↗
                    </a>
                  </dd>
                </>
              )}
            </dl>
          </>
        )}
      </Modal>
    </div>
  );
}
