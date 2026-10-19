"use client";

import { useState } from "react";
import { usePractica } from "@/context/ProgresoContext";
import { Icono } from "@/components/ui/Icono";
import { Vacio } from "@/components/ui/Vacio";
import type { Practica } from "@/lib/types";
import { Perfil } from "./Perfil";
import { PreguntaAbierta } from "./PreguntaAbierta";

/** Actividad 2: caso clínico complejo, resuelto en orden */
export function SeccionTaller({ p }: { p: Practica }) {
  const c = p.caso;
  const { progreso, actualizar } = usePractica(p.id);
  const [comprobado, setComprobado] = useState(false);
  if (!c) return <Vacio />;
  const t = c.taller;

  // Orden de los estudios: se guarda como lista de ids. Al inicio aparecen desordenados.
  const inicial = [...t.estudios].sort((a, b) => ((a.id.charCodeAt(1) * 7) % 5) - ((b.id.charCodeAt(1) * 7) % 5)).map((e) => e.id);
  const orden = (progreso.elecciones["taller.orden"] ?? inicial.join(",")).split(",");
  const ordenCorrecto = orden.join(",") === t.estudios.map((e) => e.id).join(",");
  const mover = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= orden.length) return;
    const nuevo = [...orden];
    [nuevo[i], nuevo[j]] = [nuevo[j], nuevo[i]];
    setComprobado(false);
    actualizar((pr) => ({ ...pr, elecciones: { ...pr.elecciones, "taller.orden": nuevo.join(",") } }));
  };

  const pregunta = (id: string) => {
    const q = t.preguntas.find((x) => x.id === id);
    if (!q) return null;
    return (
      <PreguntaAbierta q={q} valor={progreso.respuestas[q.id] ?? ""} onChange={(v) => actualizar((pr) => ({ ...pr, respuestas: { ...pr.respuestas, [q.id]: v } }))} />
    );
  };

  return (
    <div className="stack grande">
      <div className="callout">
        <b>Actividad grupal (3–4 personas, 60 min).</b> Lean el caso y respondan en orden. Al final, cada grupo expone sus conclusiones en 5 minutos.
      </div>

      <section className="historia-clinica">
        <header>
          <span className="paso-icono">
            <Icono nombre="usuario" tam={26} />
          </span>
          <div>
            <div className="eyebrow">Caso clínico</div>
            <h2>{t.paciente}</h2>
          </div>
        </header>
        <div className="historia-clinica-cuerpo">
          <div>
            <h3>Antecedentes</h3>
            <p>{t.antecedentes}</p>
          </div>
          <div>
            <h3>Presentación</h3>
            <p>{t.presentacion}</p>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="cab-seccion">
          <h2>Tamizaje neonatal MS/MS</h2>
          <span className="muted pequeno">Muestra a las 16 horas</span>
        </div>
        <Perfil analitos={t.analitos} />
      </section>

      {pregunta("2.1")}
      {pregunta("2.2")}

      <article className="pregunta-abierta">
        <header className="row entre">
          <h3>2.3 — Plan de confirmación diagnóstica</h3>
          {ordenCorrecto && (
            <span className="pill ok">
              <Icono nombre="check" tam={14} /> Orden correcto
            </span>
          )}
        </header>
        <p className="pregunta-abierta-texto">Ordena cronológicamente los estudios de confirmación que solicitarías, del más urgente al que puede esperar. Usa las flechas.</p>
        <ol className="ordenar">
          {orden.map((id, i) => {
            const e = t.estudios.find((x) => x.id === id);
            if (!e) return null;
            const enSitio = t.estudios[i].id === id;
            return (
              <li key={id} className={comprobado || ordenCorrecto ? (enSitio ? "bien" : "mal") : ""}>
                <span className="calculo-num">{i + 1}°</span>
                <div className="ordenar-texto">
                  <b>{e.estudio}</b>
                  <span className="muted pequeno">Muestra: {e.muestra}</span>
                  {ordenCorrecto && <span className="pequeno">{e.porque}</span>}
                </div>
                <div className="ordenar-botones">
                  <button className="btn icono-solo small" onClick={() => mover(i, -1)} disabled={i === 0} aria-label={`Subir ${e.estudio}`}>
                    ↑
                  </button>
                  <button className="btn icono-solo small" onClick={() => mover(i, 1)} disabled={i === orden.length - 1} aria-label={`Bajar ${e.estudio}`}>
                    ↓
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
        {!ordenCorrecto && (
          <div className="row" style={{ marginTop: 10 }}>
            <button className="btn primary" onClick={() => setComprobado(true)}>
              <Icono nombre="check" tam={18} /> Comprobar orden
            </button>
            {comprobado && <span className="aviso">Los marcados en rojo no están en su lugar. Piensa qué resultado necesitas primero para tratar a la paciente.</span>}
          </div>
        )}
        <label className="eyebrow" htmlFor="resp-2.3" style={{ display: "block", marginTop: 14 }}>
          Justifica la urgencia de cada uno
        </label>
        <textarea
          id="resp-2.3"
          value={progreso.respuestas["2.3"] ?? ""}
          placeholder="¿Por qué ese orden?"
          onChange={(ev) => {
            const v = ev.target.value;
            actualizar((pr) => ({ ...pr, respuestas: { ...pr.respuestas, "2.3": v } }));
          }}
        />
      </article>

      {pregunta("2.4")}
      {pregunta("2.5")}

      <details className="desplegable">
        <summary>
          <Icono nombre="estrella" tam={18} />
          <span>
            <b>Rúbrica de evaluación</b>
            <span className="muted pequeno">15 puntos en total · se aprueba con 10 · Actividad 1: 7 puntos, Actividad 2: 8 puntos</span>
          </span>
        </summary>
        <div className="desplegable-cuerpo">
          <div className="tabla-scroll">
            <table className="tabla">
              <thead>
                <tr>
                  <th>Criterio</th>
                  <th>Para el puntaje máximo</th>
                </tr>
              </thead>
              <tbody>
                {c.rubrica.map((r) => (
                  <tr key={r.criterio}>
                    <td>
                      <b>{r.criterio}</b>
                    </td>
                    <td>{r.excelente}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </details>
    </div>
  );
}
