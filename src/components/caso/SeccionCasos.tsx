"use client";

import { useState } from "react";
import { usePractica } from "@/context/ProgresoContext";
import { Icono } from "@/components/ui/Icono";
import { Vacio } from "@/components/ui/Vacio";
import type { Practica } from "@/lib/types";
import { Perfil } from "./Perfil";

const CAMPOS = [
  { k: "diagnostico", nombre: "Diagnóstico probable" },
  { k: "enzima", nombre: "Enzima deficiente" },
  { k: "gen", nombre: "Gen afectado" },
  { k: "marcador", nombre: "Marcador clave" },
] as const;

/** Actividad 1.1: identificar diagnóstico, enzima, gen y marcador de cada perfil */
export function SeccionCasos({ p }: { p: Practica }) {
  const c = p.caso;
  const { progreso, actualizar } = usePractica(p.id);
  const [i, setI] = useState(0);
  const [comprobado, setComprobado] = useState<Record<string, boolean>>({});
  if (!c) return <Vacio />;

  const caso = c.casos[i];
  const eleccion = (k: string) => progreso.elecciones[`${caso.id}.${k}`] ?? "";
  const correcto = (casoId: string, resp: Record<string, string>) => CAMPOS.every((f) => progreso.elecciones[`${casoId}.${f.k}`] === resp[f.k]);
  const resuelto = correcto(caso.id, caso.respuesta);
  const completo = CAMPOS.every((f) => eleccion(f.k) !== "");
  const mostrar = comprobado[caso.id] || resuelto;
  const nResueltos = c.casos.filter((x) => correcto(x.id, x.respuesta)).length;

  return (
    <div className="stack grande">
      <div className="casos-tabs" role="tablist" aria-label="Casos clínicos">
        {c.casos.map((x, j) => {
          const ok = correcto(x.id, x.respuesta);
          return (
            <button key={x.id} role="tab" aria-selected={j === i} className={`caso-tab ${ok ? "ok" : ""}`} onClick={() => setI(j)}>
              <span className="caso-tab-num">{ok ? <Icono nombre="check" tam={16} /> : j + 1}</span>
              {x.titulo}
            </button>
          );
        })}
        <span className="pill" style={{ marginLeft: "auto" }}>
          {nResueltos}/{c.casos.length} identificados
        </span>
      </div>

      <section className="caso-presentacion" key={caso.id}>
        <span className="paso-icono">
          <Icono nombre="usuario" tam={26} />
        </span>
        <div>
          <div className="eyebrow">{caso.titulo} · Presentación</div>
          <p>{caso.presentacion}</p>
        </div>
      </section>

      <section className="panel">
        <div className="cab-seccion">
          <h2>Perfil de acilcarnitinas (MS/MS, sangre seca)</h2>
          <span className="muted pequeno">La línea marca el valor de corte</span>
        </div>
        <Perfil analitos={caso.analitos} ratios={caso.ratios} resaltarClave={resuelto} />
      </section>

      <section className="panel">
        <div className="cab-seccion">
          <h2>Tu interpretación</h2>
          <span className="muted pequeno">Actividad 1.1</span>
        </div>
        <div className="identificacion">
          {CAMPOS.map((f) => {
            const v = eleccion(f.k);
            const ok = v === caso.respuesta[f.k];
            return (
              <label key={f.k} className={`entrada ${mostrar && v ? (ok ? "bien" : "mal") : ""}`} htmlFor={`${caso.id}-${f.k}`}>
                <span>
                  {f.nombre} {mostrar && v ? ok ? <Icono nombre="check" tam={14} /> : <Icono nombre="x" tam={14} /> : null}
                </span>
                <select
                  id={`${caso.id}-${f.k}`}
                  value={v}
                  onChange={(e) => {
                    const valor = e.target.value;
                    setComprobado((s) => ({ ...s, [caso.id]: false }));
                    actualizar((pr) => ({ ...pr, elecciones: { ...pr.elecciones, [`${caso.id}.${f.k}`]: valor } }));
                  }}
                >
                  <option value="">Elegir…</option>
                  {c.opciones[f.k].map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.texto}
                    </option>
                  ))}
                </select>
              </label>
            );
          })}
        </div>

        {mostrar && (
          <div className={`retro ${resuelto ? "bien" : "mal"}`} role="status">
            {resuelto ? (
              <>
                <b>¡Correcto!</b> {caso.explicacion}
              </>
            ) : (
              <>
                <b>Hay algo que revisar.</b> Mira qué longitud de cadena es la que más se aleja del corte y vuelve al mapa de la vía en Fundamento.
              </>
            )}
          </div>
        )}

        <div className="row" style={{ marginTop: 12 }}>
          {!resuelto && (
            <button className="btn primary" disabled={!completo} onClick={() => setComprobado((s) => ({ ...s, [caso.id]: true }))}>
              <Icono nombre="check" tam={18} /> Comprobar
            </button>
          )}
          {i < c.casos.length - 1 && (
            <button className={`btn ${resuelto ? "primary" : ""}`} onClick={() => setI(i + 1)}>
              Siguiente caso <Icono nombre="flecha" tam={18} />
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
