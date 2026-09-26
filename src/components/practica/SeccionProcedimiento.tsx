"use client";

import { useState } from "react";
import { usePractica } from "@/context/ProgresoContext";
import { TextoGlosario } from "@/components/ui/TextoGlosario";
import { Vacio } from "@/components/ui/Vacio";
import { SimuladorTitulacion } from "./SimuladorTitulacion";
import { Temporizador } from "./Temporizador";
import type { Practica } from "@/lib/types";

export function SeccionProcedimiento({ p }: { p: Practica }) {
  const { progreso, actualizar } = usePractica(p.id);
  const [actual, setActual] = useState(0);

  if (!p.pasos.length) return <Vacio />;
  const paso = p.pasos[actual];
  const hecho = progreso.pasosHechos.includes(actual);

  const alternarHecho = () => {
    actualizar((pr) => ({
      ...pr,
      pasosHechos: hecho ? pr.pasosHechos.filter((i) => i !== actual) : [...pr.pasosHechos, actual],
    }));
    if (!hecho && actual < p.pasos.length - 1) setActual(actual + 1);
  };

  return (
    <div className="proc">
      <nav className="lista-pasos" aria-label="Pasos">
        {p.pasos.map((x, i) => {
          const h = progreso.pasosHechos.includes(i);
          return (
            <button key={i} aria-current={i === actual ? "true" : undefined} className={h ? "hecho" : undefined} onClick={() => setActual(i)}>
              <span className="punto">{h ? "✓" : i + 1}</span>
              <span>{x.titulo}</span>
            </button>
          );
        })}
        <p className="muted pequeno" style={{ padding: "8px 10px" }}>
          {progreso.pasosHechos.length} de {p.pasos.length} completados
        </p>
      </nav>

      <article className="tarjeta">
        <header className="tarjeta-cab">
          <div>
            <div className="eyebrow">
              Paso {actual + 1} de {p.pasos.length}
            </div>
            <h2>{paso.titulo}</h2>
          </div>
          <button className={`btn small ${hecho ? "" : "primary"}`} onClick={alternarHecho}>
            {hecho ? "✓ Completado" : "Marcar como hecho"}
          </button>
        </header>

        <Campo etiqueta="Qué hacer" texto={paso.hacer} />
        <Campo etiqueta="Por qué se hace" texto={paso.porque} />
        <Campo etiqueta="Qué se debe ver" texto={paso.observar} />
        {paso.error && <Campo etiqueta="Error frecuente" texto={paso.error} tono="error" />}

        {paso.simulador === "titulacion" && (
          <div className="campo">
            <div className="lab">Pruébalo aquí</div>
            <div className="val">
              <SimuladorTitulacion />
            </div>
          </div>
        )}

        {paso.temporizador && (
          <div className="campo">
            <div className="lab">Temporizador</div>
            <div className="val">
              <Temporizador key={actual} segundos={paso.temporizador} mensajeFinal="Si el rosado sigue, llegaste al punto final. Anota el volumen." />
            </div>
          </div>
        )}

        {paso.registro && (
          <div className="campo registro">
            <div className="lab">Anota tu dato</div>
            <div className="val">
              <div className="entradas">
                {paso.registro.map((r) => (
                  <label key={r.id} className="entrada" htmlFor={`dato-${r.id}`}>
                    {r.etiqueta} ({r.unidad})
                    <input
                      id={`dato-${r.id}`}
                      inputMode="decimal"
                      placeholder={r.ejemplo}
                      value={progreso.datos[r.id] ?? ""}
                      onChange={(e) => {
                        const valor = e.target.value;
                        actualizar((pr) => ({ ...pr, datos: { ...pr.datos, [r.id]: valor } }));
                      }}
                    />
                  </label>
                ))}
              </div>
              <p className="muted pequeno" style={{ marginTop: 6 }}>
                Se pasa solo a la sección Cálculos.
              </p>
            </div>
          </div>
        )}
      </article>
    </div>
  );
}

function Campo({ etiqueta, texto, tono }: { etiqueta: string; texto: string; tono?: "error" }) {
  return (
    <div className={`campo ${tono ?? ""}`}>
      <div className="lab">{etiqueta}</div>
      <div className="val">
        <TextoGlosario texto={texto} />
      </div>
    </div>
  );
}
