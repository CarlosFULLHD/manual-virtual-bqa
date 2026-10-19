"use client";

import { useState } from "react";
import { usePractica } from "@/context/ProgresoContext";
import { Icono } from "@/components/ui/Icono";
import { Vacio } from "@/components/ui/Vacio";
import { aciertosQuiz } from "@/lib/progreso";
import { tipoDe, type Practica } from "@/lib/types";

const LETRAS = ["A", "B", "C", "D", "E"];

export function SeccionPreparate({ p }: { p: Practica }) {
  const { progreso, actualizar } = usePractica(p.id);
  const quiz = p.quiz ?? [];
  const primeraSinResponder = quiz.findIndex((_, i) => progreso.quiz[i] === undefined);
  const [actual, setActual] = useState<number | null>(null);
  const idx = actual ?? (primeraSinResponder === -1 ? quiz.length : primeraSinResponder);

  if (!quiz.length && !p.seguridad.length) return <Vacio />;
  const { ok, total } = aciertosQuiz(p, progreso);

  return (
    <div className="stack grande">
      {p.seguridad.length > 0 && (
        <section className="panel">
          <div className="row entre">
            <h3>
              <Icono nombre="escudo" tam={18} style={{ verticalAlign: "-3px", marginRight: 6 }} />
              Antes de entrar, confirma
            </h3>
            <span className="pill">
              {p.seguridad.filter((_, i) => progreso.checks[`seg-${i}`]).length}/{p.seguridad.length}
            </span>
          </div>
          <div className="seguridad-grid">
            {p.seguridad.map((s, i) => {
              const marcado = !!progreso.checks[`seg-${i}`];
              return (
                <button
                  key={s}
                  className={`seguridad-item ${marcado ? "marcado" : ""}`}
                  aria-pressed={marcado}
                  onClick={() => actualizar((pr) => ({ ...pr, checks: { ...pr.checks, [`seg-${i}`]: !marcado } }))}
                >
                  <span className="caja-check">{marcado && <Icono nombre="check" tam={16} />}</span>
                  <span>{s}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {quiz.length > 0 && (
        <section className="quiz">
          <div className="quiz-cab">
            <div>
              <div className="eyebrow">{tipoDe(p) === "laboratorio" ? "Quiz previo" : "Autoevaluación"}</div>
              <h2>{tipoDe(p) === "laboratorio" ? "¿Estás listo para el laboratorio?" : "¿Cuánto entendiste?"}</h2>
            </div>
            <div className="quiz-progreso" aria-label={`Pregunta ${Math.min(idx + 1, quiz.length)} de ${quiz.length}`}>
              {quiz.map((q, i) => {
                const r = progreso.quiz[i];
                const estado = r === undefined ? "" : r === q.correcta ? "bien" : "mal";
                return (
                  <button key={i} className={`quiz-punto ${estado} ${i === idx ? "actual" : ""}`} onClick={() => setActual(i)} aria-label={`Ir a la pregunta ${i + 1}`}>
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {idx < quiz.length ? (
            <Pregunta
              key={idx}
              n={idx}
              total={quiz.length}
              pregunta={quiz[idx]}
              respuesta={progreso.quiz[idx]}
              onResponder={(op) => {
                setActual(idx);
                actualizar((pr) => ({ ...pr, quiz: { ...pr.quiz, [idx]: op } }));
              }}
              onSiguiente={() => setActual(idx + 1)}
            />
          ) : (
            <div className="quiz-final">
              <div className="quiz-puntaje">
                <span className="mono">
                  {ok}/{total}
                </span>
              </div>
              <h3>{ok === total ? "¡Perfecto!" : ok >= total * 0.6 ? "¡Bien! Repasa las que fallaste." : "Conviene repasar antes de seguir."}</h3>
              <p className="muted">Las respuestas quedan guardadas. Puedes tocar cualquier número para revisarlas.</p>
              <button
                className="btn"
                onClick={() => {
                  actualizar((pr) => ({ ...pr, quiz: {} }));
                  setActual(0);
                }}
              >
                <Icono nombre="reiniciar" tam={18} /> Intentar de nuevo
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function Pregunta({
  n,
  total,
  pregunta,
  respuesta,
  onResponder,
  onSiguiente,
}: {
  n: number;
  total: number;
  pregunta: NonNullable<Practica["quiz"]>[number];
  respuesta: number | undefined;
  onResponder: (op: number) => void;
  onSiguiente: () => void;
}) {
  const respondida = respuesta !== undefined;
  const acerto = respuesta === pregunta.correcta;
  return (
    <div className="pregunta">
      <p className="pregunta-texto">{pregunta.pregunta}</p>
      <div className="opciones">
        {pregunta.opciones.map((op, i) => {
          let clase = "";
          if (respondida && i === pregunta.correcta) clase = "correcta";
          else if (respondida && i === respuesta) clase = "incorrecta";
          return (
            <button key={op} className={`opcion ${clase}`} disabled={respondida} onClick={() => onResponder(i)}>
              <span className="opcion-letra">{LETRAS[i]}</span>
              <span>{op}</span>
              {clase === "correcta" && <Icono nombre="check" tam={18} />}
              {clase === "incorrecta" && <Icono nombre="x" tam={18} />}
            </button>
          );
        })}
      </div>
      {respondida && (
        <div className={`retro ${acerto ? "bien" : "mal"}`} role="status">
          <b>{acerto ? "¡Correcto!" : "No exactamente."}</b> {pregunta.explicacion}
        </div>
      )}
      {respondida && (
        <div className="row" style={{ justifyContent: "flex-end", marginTop: 12 }}>
          <button className="btn primary" onClick={onSiguiente}>
            {n + 1 < total ? "Siguiente pregunta" : "Ver resultado"} <Icono nombre="flecha" tam={18} />
          </button>
        </div>
      )}
    </div>
  );
}
