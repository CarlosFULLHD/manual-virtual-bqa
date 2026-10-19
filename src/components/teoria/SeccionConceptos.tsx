"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePractica } from "@/context/ProgresoContext";
import { Icono } from "@/components/ui/Icono";
import { Vacio } from "@/components/ui/Vacio";
import { EJERCICIOS } from "@/data/ejercicios/soluciones";
import type { Leccion, Practica } from "@/lib/types";
import { Widget } from "./Widgets";

/** Lecciones del tema: una idea, una fórmula, un ejemplo guiado y una calculadora para probar */
export function SeccionConceptos({ p }: { p: Practica }) {
  const lecciones = p.lecciones ?? [];
  const { progreso, actualizar, listo } = usePractica(p.id);
  const [i, setI] = useState(0);

  useEffect(() => {
    const h = window.location.hash.slice(1);
    const idx = lecciones.findIndex((l) => l.id === h);
    if (idx >= 0) setI(idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const leccion = lecciones[i];
  useEffect(() => {
    if (!listo || !leccion) return;
    actualizar((pr) => (pr.lecciones.includes(leccion.id) ? pr : { ...pr, lecciones: [...pr.lecciones, leccion.id] }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listo, leccion?.id]);

  if (!lecciones.length) return <Vacio />;
  const nEjercicios = EJERCICIOS.filter((e) => e.leccion === leccion.id).length;

  return (
    <div className="lecciones">
      <nav className="lecciones-lista" aria-label="Lecciones">
        {lecciones.map((l, j) => {
          const vista = progreso.lecciones.includes(l.id);
          return (
            <button key={l.id} className={`leccion-item ${vista ? "vista" : ""}`} aria-current={j === i ? "true" : undefined} onClick={() => setI(j)}>
              <span className="leccion-num">{vista && j !== i ? <Icono nombre="check" tam={14} /> : j + 1}</span>
              <span>{l.titulo}</span>
            </button>
          );
        })}
      </nav>

      <div className="stack grande" key={leccion.id}>
        <TarjetaLeccion l={leccion} n={i + 1} total={lecciones.length} />

        <div className="paso-nav">
          <button className="btn" onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}>
            <Icono nombre="atras" tam={18} /> Anterior
          </button>
          {nEjercicios > 0 && (
            <Link className="btn" href={`/practicas/${p.id}/ejercicios#${leccion.id}`}>
              <Icono nombre="lapiz" tam={18} /> Practicar ({nEjercicios} ejercicios)
            </Link>
          )}
          {i < lecciones.length - 1 && (
            <button className="btn primary grande" onClick={() => setI(i + 1)}>
              Siguiente lección <Icono nombre="flecha" tam={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function TarjetaLeccion({ l, n, total }: { l: Leccion; n: number; total: number }) {
  const [pasosVistos, setPasosVistos] = useState(0);
  const ej = l.ejemplo;
  return (
    <>
      <article className="leccion">
        <header className="paso-cab">
          <span className="paso-icono">
            <Icono nombre={l.icono} tam={26} />
          </span>
          <div>
            <div className="eyebrow">
              Lección {n} de {total}
            </div>
            <h2>{l.titulo}</h2>
          </div>
        </header>

        <p className="leccion-idea">{l.idea}</p>

        {l.formula && (
          <div className="formula-grande">
            <span className="eyebrow">La fórmula</span>
            <div className="mono">{l.formula}</div>
          </div>
        )}

        <div className="leccion-dos">
          {l.variables && (
            <div>
              <h3>Qué significa</h3>
              <ul className="lista">
                {l.variables.map((v) => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
            </div>
          )}
          {l.metodo && (
            <div>
              <h3>Cómo se resuelve</h3>
              <ol className="metodo">
                {l.metodo.map((m, j) => (
                  <li key={m}>
                    <span className="objetivo-num">{j + 1}</span>
                    {m}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {l.cuidado && (
          <div className="bloque cuidado" style={{ marginTop: 14 }}>
            <span className="bloque-icono">
              <Icono nombre="alerta" tam={20} />
            </span>
            <div>
              <b>Ojo con esto</b>
              <ul className="lista" style={{ marginTop: 2 }}>
                {l.cuidado.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </article>

      {ej && (
        <section className="panel">
          <div className="cab-seccion">
            <h2>Ejemplo guiado</h2>
            <span className="muted pequeno">
              {Math.min(pasosVistos, ej.pasos.length)} de {ej.pasos.length} pasos
            </span>
          </div>
          <p className="ejemplo-enunciado">{ej.enunciado}</p>
          <ol className="calculo-pasos">
            {ej.pasos.slice(0, pasosVistos).map((paso, j) => (
              <li key={j} className="calculo-paso">
                <span className="calculo-num">{j + 1}</span>
                <div className="formula" style={{ flex: 1 }}>
                  {paso}
                </div>
              </li>
            ))}
          </ol>
          {pasosVistos >= ej.pasos.length ? (
            <div className="retro bien" role="status">
              <b>Resultado:</b> {ej.resultado}
            </div>
          ) : (
            <p className="muted pequeno" style={{ margin: "10px 0 0" }}>
              Intenta pensar el paso antes de mostrarlo.
            </p>
          )}
          <div className="row" style={{ marginTop: 12 }}>
            {pasosVistos < ej.pasos.length ? (
              <button className="btn primary" onClick={() => setPasosVistos(pasosVistos + 1)}>
                {pasosVistos === 0 ? "Mostrar el primer paso" : "Siguiente paso"} <Icono nombre="flecha" tam={18} />
              </button>
            ) : (
              <button className="btn" onClick={() => setPasosVistos(0)}>
                <Icono nombre="reiniciar" tam={18} /> Ocultar y repetir
              </button>
            )}
          </div>
        </section>
      )}

      {l.widget && (
        <section className="panel">
          <div className="cab-seccion">
            <h2>Prueba con tus números</h2>
            <span className="muted pequeno">Cambia los valores y mira qué pasa</span>
          </div>
          <Widget tipo={l.widget} />
        </section>
      )}
    </>
  );
}
