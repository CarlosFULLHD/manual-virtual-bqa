"use client";

import { usePractica } from "@/context/ProgresoContext";
import { PreguntaAbierta } from "@/components/caso/PreguntaAbierta";
import { Icono } from "@/components/ui/Icono";
import { TablaInfoVista } from "@/components/ui/TablaInfoVista";
import { Vacio } from "@/components/ui/Vacio";
import type { Practica } from "@/lib/types";

/** Cierre de una práctica de laboratorio: resultados esperados, preguntas de análisis y conclusión */
export function SeccionConclusiones({ p }: { p: Practica }) {
  const { progreso, actualizar } = usePractica(p.id);
  const bloques = p.analisis ?? [];
  if (!bloques.length && !p.esperados) return <Vacio />;

  const preguntas = bloques.flatMap((b) => b.preguntas);
  const hechas = preguntas.filter((q) => (progreso.respuestas[q.id] ?? "").trim().length > 20).length;

  return (
    <div className="stack grande">
      {p.esperados && (
        <section className="panel">
          <div className="cab-seccion">
            <h2>{p.esperados.titulo}</h2>
            <span className="muted pequeno">Compara con lo que obtuviste</span>
          </div>
          <TablaInfoVista tabla={p.esperados} sinTitulo />
        </section>
      )}

      {bloques.length > 0 && (
        <div className="callout">
          <b>Preguntas de análisis e interpretación.</b> Respóndelas con tus resultados a la vista.{" "}
          <span className="mono">
            {hechas}/{preguntas.length}
          </span>{" "}
          respondidas.
        </div>
      )}

      {bloques.map((bloque) => (
        <section key={bloque.titulo} className="stack">
          <h2>{bloque.titulo}</h2>
          {bloque.preguntas.map((q) => (
            <PreguntaAbierta key={q.id} q={q} valor={progreso.respuestas[q.id] ?? ""} onChange={(v) => actualizar((pr) => ({ ...pr, respuestas: { ...pr.respuestas, [q.id]: v } }))} />
          ))}
        </section>
      ))}

      <section className="panel">
        <div className="cab-seccion">
          <h2>Tu conclusión</h2>
          <span className="muted pequeno">Responde a los objetivos de la práctica</span>
        </div>
        <ul className="objetivos" style={{ marginBottom: 12 }}>
          {p.objetivos.map((o, i) => (
            <li key={o} className="muted pequeno">
              <span className="objetivo-num">{i + 1}</span>
              {o}
            </li>
          ))}
        </ul>
        <textarea
          id="conclusion"
          aria-label="Tu conclusión"
          placeholder="¿Qué encontraste? ¿Se cumplió lo esperado? ¿Qué explica las diferencias?"
          value={progreso.conclusion}
          onChange={(e) => {
            const v = e.target.value;
            actualizar((pr) => ({ ...pr, conclusion: v }));
          }}
        />
      </section>

      {p.bibliografia.length > 0 && (
        <details className="desplegable">
          <summary>
            <Icono nombre="libro" tam={18} />
            <span>
              <b>Bibliografía</b>
              <span className="muted pequeno">{p.bibliografia.length} fuentes de la guía</span>
            </span>
          </summary>
          <div className="desplegable-cuerpo">
            <ul className="lista">
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
          </div>
        </details>
      )}
    </div>
  );
}
