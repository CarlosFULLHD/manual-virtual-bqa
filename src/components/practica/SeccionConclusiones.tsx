"use client";

import { usePractica } from "@/context/ProgresoContext";
import { Vacio } from "@/components/ui/Vacio";
import { ejecutarCalculo, formatear } from "@/lib/calculos";
import type { Practica } from "@/lib/types";

export function SeccionConclusiones({ p }: { p: Practica }) {
  const { progreso, actualizar } = usePractica(p.id);
  if (!p.calculo || !p.referencia) return <Vacio />;

  const { calc, resultado: r, esEjemplo } = ejecutarCalculo(p.calculo, progreso.datos);
  const ref = p.referencia;
  const pos = (x: number) => Math.min(100, Math.max(0, ((x - ref.escalaMin) / (ref.escalaMax - ref.escalaMin)) * 100));
  const estado = r.promedio < ref.min ? "bajo" : r.promedio > ref.max ? "alto" : "ok";
  const etiqueta = { ok: "Dentro del rango", alto: "Por encima del rango", bajo: "Por debajo del rango" }[estado];

  const insertarDatos = () => actualizar((pr) => ({ ...pr, conclusion: calc.frase(r) + pr.conclusion }));

  return (
    <div className="stack">
      <section className="panel">
        <div className="row entre">
          <h3>Resultado frente al valor de referencia</h3>
          <span className={`pill ${estado === "ok" ? "ok" : "warn"}`}>{etiqueta}</span>
        </div>
        <div className="rango" role="img" aria-label={`Resultado ${formatear(r.promedio, 3)}; rango ${ref.min} a ${ref.max}`}>
          <div className="pista" />
          <div className="zona-ok" style={{ left: `${pos(ref.min)}%`, width: `${pos(ref.max) - pos(ref.min)}%` }} />
          <div className="marca" style={{ left: `calc(${pos(r.promedio)}% - 1.5px)` }} />
          <span className="lbl" style={{ left: `${pos(ref.min)}%` }}>
            {formatear(ref.min, 2)}
          </span>
          <span className="lbl" style={{ left: `${pos(ref.max)}%` }}>
            {formatear(ref.max, 2)}
          </span>
        </div>
        <p style={{ marginTop: 14 }}>
          Tu resultado:{" "}
          <b className="mono">
            {formatear(r.promedio, 3)} {ref.unidad}
          </b>
          {esEjemplo && <span className="muted"> (ejemplo)</span>}. Rango de referencia: {formatear(ref.min, 2)} a {formatear(ref.max, 2)}.
        </p>
        <p className="muted pequeno" style={{ marginTop: 4 }}>
          {ref.nota}
        </p>
        {estado !== "ok" && p.causas && (
          <div className="callout neutro" style={{ marginTop: 10 }}>
            <b>Causas probables</b>
            <ul className="lista">
              {p.causas[estado].map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="panel">
        <h3>Preguntas para guiar tu conclusión</h3>
        <ol className="lista" style={{ marginTop: 8 }}>
          {p.preguntas.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ol>
        <label htmlFor="conclusion" className="negrita" style={{ display: "block", margin: "14px 0 6px" }}>
          Tu conclusión
        </label>
        <textarea
          id="conclusion"
          placeholder="Escribe aquí con tus propias palabras…"
          value={progreso.conclusion}
          onChange={(e) => {
            const v = e.target.value;
            actualizar((pr) => ({ ...pr, conclusion: v }));
          }}
        />
        <div className="row" style={{ marginTop: 8 }}>
          <button className="btn small" onClick={insertarDatos}>
            Insertar datos del resultado
          </button>
          <span className="muted pequeno">Agrega una frase con tus números; el análisis lo escribes tú.</span>
        </div>
      </section>

      <section className="panel">
        <h3>Bibliografía</h3>
        <ul className="lista" style={{ marginTop: 8 }}>
          {p.bibliografia.map((b) => (
            <li key={b.texto}>
              {b.texto}{" "}
              {b.url && (
                <a href={b.url} target="_blank" rel="noopener noreferrer">
                  Abrir ↗
                </a>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
