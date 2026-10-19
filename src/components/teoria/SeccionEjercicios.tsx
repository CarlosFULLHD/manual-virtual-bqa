"use client";

import { useEffect, useMemo, useState } from "react";
import { usePractica } from "@/context/ProgresoContext";
import { Icono } from "@/components/ui/Icono";
import { EJERCICIOS, FUENTES, type Ejercicio, type Fuente } from "@/data/ejercicios/soluciones";
import { parseNumero } from "@/lib/calculos";
import { coincide, n } from "@/lib/soluciones";
import type { Practica } from "@/lib/types";

const POR_PAGINA = 6;

/** Banco de ejercicios con corrección automática y solución paso a paso */
export function SeccionEjercicios({ p }: { p: Practica }) {
  const { progreso, actualizar } = usePractica(p.id);
  const lecciones = p.lecciones ?? [];
  const [leccion, setLeccion] = useState<string>("todas");
  const [fuente, setFuente] = useState<Fuente | "todas">("todas");
  const [soloPendientes, setSoloPendientes] = useState(false);
  const [visibles, setVisibles] = useState(POR_PAGINA);

  useEffect(() => {
    const h = window.location.hash.slice(1);
    if (lecciones.some((l) => l.id === h)) setLeccion(h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lista = useMemo(
    () =>
      EJERCICIOS.filter(
        (e) =>
          (leccion === "todas" || e.leccion === leccion) &&
          (fuente === "todas" || e.fuente === fuente) &&
          (!soloPendientes || progreso.ejercicios[e.id] !== "ok"),
      ),
    // los pendientes se recalculan solo al cambiar filtros, para que un ejercicio no desaparezca al resolverlo
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [leccion, fuente, soloPendientes],
  );

  const resueltos = EJERCICIOS.filter((e) => progreso.ejercicios[e.id] === "ok").length;
  const cambiar = (f: () => void) => {
    f();
    setVisibles(POR_PAGINA);
  };

  return (
    <div className="stack grande">
      <section className="panel">
        <div className="mesa-cab">
          <div>
            <h2>Ejercicios</h2>
            <p className="muted pequeno">Escribe tu resultado y compruébalo. Se acepta un margen de ±2 %.</p>
          </div>
          <div className="mesa-contador">
            <span className="mono">
              {resueltos}/{EJERCICIOS.length}
            </span>
          </div>
        </div>
        <div className="barra" aria-hidden="true">
          <div style={{ width: `${(resueltos / EJERCICIOS.length) * 100}%` }} />
        </div>

        <div className="filtro">
          <span className="eyebrow">Tema</span>
          <div className="chips-opciones" style={{ marginTop: 0 }}>
            <button className={`chip ${leccion === "todas" ? "activo" : ""}`} aria-pressed={leccion === "todas"} onClick={() => cambiar(() => setLeccion("todas"))}>
              Todos
            </button>
            {lecciones.map((l) => {
              const total = EJERCICIOS.filter((e) => e.leccion === l.id);
              const ok = total.filter((e) => progreso.ejercicios[e.id] === "ok").length;
              return (
                <button key={l.id} className={`chip ${leccion === l.id ? "activo" : ""}`} aria-pressed={leccion === l.id} onClick={() => cambiar(() => setLeccion(l.id))}>
                  {l.titulo}{" "}
                  <span className="mono muted">
                    {ok}/{total.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="filtro">
          <span className="eyebrow">Documento</span>
          <div className="chips-opciones" style={{ marginTop: 0 }}>
            <button className={`chip ${fuente === "todas" ? "activo" : ""}`} aria-pressed={fuente === "todas"} onClick={() => cambiar(() => setFuente("todas"))}>
              Todos
            </button>
            {FUENTES.map((f) => (
              <button key={f} className={`chip ${fuente === f ? "activo" : ""}`} aria-pressed={fuente === f} onClick={() => cambiar(() => setFuente(f))}>
                {f}
              </button>
            ))}
            <button className={`chip ${soloPendientes ? "activo" : ""}`} aria-pressed={soloPendientes} onClick={() => cambiar(() => setSoloPendientes(!soloPendientes))}>
              {soloPendientes && <Icono nombre="check" tam={14} />} Solo pendientes
            </button>
          </div>
        </div>
      </section>

      {lista.length === 0 && <div className="vacio">No hay ejercicios con esos filtros.</div>}

      {lista.slice(0, visibles).map((e) => (
        <TarjetaEjercicio
          key={e.id}
          e={e}
          tema={lecciones.find((l) => l.id === e.leccion)?.titulo ?? ""}
          estado={progreso.ejercicios[e.id]}
          onResultado={(r) => actualizar((pr) => ({ ...pr, ejercicios: { ...pr.ejercicios, [e.id]: r } }))}
        />
      ))}

      {visibles < lista.length && (
        <button className="btn grande" style={{ alignSelf: "center" }} onClick={() => setVisibles(visibles + POR_PAGINA)}>
          Ver más ejercicios ({lista.length - visibles} restantes)
        </button>
      )}
    </div>
  );
}

function TarjetaEjercicio({ e, tema, estado, onResultado }: { e: Ejercicio; tema: string; estado?: "ok" | "mal"; onResultado: (r: "ok" | "mal") => void }) {
  const sol = useMemo(() => e.resolver(), [e]);
  const [valores, setValores] = useState<string[]>(() => sol.respuestas.map(() => ""));
  const [opcion, setOpcion] = useState<number | null>(null);
  const [comprobado, setComprobado] = useState(false);
  const [verSolucion, setVerSolucion] = useState(false);

  const abierto = sol.respuestas.length === 0 && !sol.eleccion;
  const aciertos = sol.respuestas.map((r, i) => coincide(parseNumero(valores[i]) ?? NaN, r.valor));
  const eleccionOk = !sol.eleccion || opcion === sol.eleccion.correcta;
  const todoOk = aciertos.every(Boolean) && eleccionOk;
  const incompleto = valores.some((v) => v.trim() === "") || (sol.eleccion && opcion === null);

  const comprobar = () => {
    setComprobado(true);
    onResultado(todoOk ? "ok" : "mal");
  };

  return (
    <article className={`ejercicio ${estado === "ok" ? "resuelto" : ""}`} id={e.id}>
      <header className="ejercicio-cab">
        <span className="pill">
          {e.fuente} · N.º {e.numero}
        </span>
        <span className="pill accent">{tema}</span>
        {estado === "ok" && (
          <span className="pill ok">
            <Icono nombre="check" tam={14} /> Resuelto
          </span>
        )}
      </header>
      <p className="ejercicio-enunciado">{e.enunciado}</p>
      {e.nota && (
        <p className="nota-icono pequeno" style={{ marginTop: 6 }}>
          <Icono nombre="foco" tam={16} /> {e.nota}
        </p>
      )}

      {!abierto && (
        <div className="ejercicio-respuestas">
          {sol.respuestas.map((r, i) => {
            const clase = comprobado ? (aciertos[i] ? "bien" : "mal") : "";
            return (
              <label key={i} className={`entrada ${clase}`} htmlFor={`${e.id}-${i}`}>
                <span>{r.etiqueta}</span>
                <span className="entrada-caja">
                  <input
                    id={`${e.id}-${i}`}
                    inputMode="decimal"
                    value={valores[i]}
                    onChange={(ev) => {
                      const v = ev.target.value;
                      setValores((vs) => vs.map((x, j) => (j === i ? v : x)));
                      setComprobado(false);
                    }}
                  />
                  {r.unidad && <span className="entrada-unidad">{r.unidad}</span>}
                  {comprobado && <span className="entrada-marca">{aciertos[i] ? <Icono nombre="check" tam={16} /> : <Icono nombre="x" tam={16} />}</span>}
                </span>
              </label>
            );
          })}
          {sol.eleccion && (
            <div className="entrada" style={{ width: "100%" }}>
              <span>{sol.eleccion.etiqueta}</span>
              <div className="chips-opciones" style={{ marginTop: 0 }}>
                {sol.eleccion.opciones.map((o, i) => (
                  <button
                    key={o}
                    className={`chip ${opcion === i ? "activo" : ""} ${comprobado && opcion === i ? (eleccionOk ? "bien" : "mal") : ""}`}
                    aria-pressed={opcion === i}
                    onClick={() => {
                      setOpcion(i);
                      setComprobado(false);
                    }}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {comprobado && (
        <div className={`retro ${todoOk ? "bien" : "mal"}`} role="status">
          {todoOk ? (
            <b>¡Correcto!</b>
          ) : (
            <>
              <b>Todavía no.</b> Revisa lo marcado con ✕. Fíjate en las unidades y en qué volumen es el final.
            </>
          )}
        </div>
      )}

      <div className="row" style={{ marginTop: 12 }}>
        {!abierto && (
          <button className="btn primary" onClick={comprobar} disabled={!!incompleto}>
            <Icono nombre="check" tam={18} /> Comprobar
          </button>
        )}
        <button className="btn" onClick={() => setVerSolucion(!verSolucion)} aria-expanded={verSolucion}>
          <Icono nombre="foco" tam={18} /> {verSolucion ? "Ocultar solución" : abierto ? "Ver una forma de resolverlo" : "Ver solución paso a paso"}
        </button>
        {abierto && estado !== "ok" && (
          <button className="btn ghost" onClick={() => onResultado("ok")}>
            <Icono nombre="check" tam={18} /> Ya lo resolví
          </button>
        )}
      </div>

      {verSolucion && (
        <div className="solucion">
          <ol className="calculo-pasos">
            {sol.pasos.map((paso, i) => (
              <li key={i} className="calculo-paso">
                <span className="calculo-num">{i + 1}</span>
                <div className="solucion-paso">{paso}</div>
              </li>
            ))}
          </ol>
          {sol.respuestas.length > 0 && (
            <div className="solucion-final">
              <span className="eyebrow">Respuesta</span>
              {sol.respuestas.map((r, i) => (
                <div key={i}>
                  {r.etiqueta}: <b className="mono">{n(r.valor)}</b> {r.unidad}
                </div>
              ))}
              {sol.eleccion && (
                <div>
                  {sol.eleccion.etiqueta} <b>{sol.eleccion.opciones[sol.eleccion.correcta]}</b>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
