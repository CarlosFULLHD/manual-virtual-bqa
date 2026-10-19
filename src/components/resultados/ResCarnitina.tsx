"use client";

import { usePractica } from "@/context/ProgresoContext";
import { BotonCopiar } from "@/components/ui/Copiar";
import { formatear } from "@/lib/calculos";
import type { Practica } from "@/lib/types";
import { CampoDato, GraficoRecta, TablaEditable, TarjetaRecta, ajustar, num } from "./comunes";

const ESTANDARES = [5, 10, 15, 20];

/** Práctica 6: curva de calibración a 602 nm e interpolación de las muestras */
export function ResCarnitina({ p }: { p: Practica }) {
  const { progreso, actualizar } = usePractica(p.id);
  const d = progreso.datos;
  const setDato = (id: string, v: string) => actualizar((pr) => ({ ...pr, datos: { ...pr.datos, [id]: v } }));
  const setTexto = (id: string, v: string) => actualizar((pr) => ({ ...pr, respuestas: { ...pr.respuestas, [id]: v } }));

  const abs = ESTANDARES.map((x) => num(d[`abs${x}`]));
  const recta = ajustar(ESTANDARES, abs);
  const fd = Number.isFinite(num(d.fd)) ? num(d.fd) : 10;
  const muestras = (["A", "B"] as const).map((m) => {
    const a = num(d[`abs${m}`]);
    const peso = num(d[`peso${m}`]);
    const ug = recta.valida ? (a - recta.intercepto) / recta.pendiente : NaN;
    const mg100 = (ug * fd * 100) / (peso * 1000);
    return { m, a, peso, ug, mg100, nombre: progreso.respuestas[`nombre${m}`] ?? "" };
  });

  const tablaTexto =
    "Punto\tL-carnitina (µg)\tAbsorbancia (602 nm)\n" +
    ESTANDARES.map((x, i) => `${i + 1}\t${x}\t${d[`abs${x}`] ?? ""}`).join("\n") +
    (recta.valida ? `\n\nRecta\ty = ${formatear(recta.pendiente, 4)}x + ${formatear(recta.intercepto, 4)}\tR² = ${formatear(recta.r2, 4)}` : "") +
    "\n\nMuestra\tPeso (g)\tAbsorbancia\tµg interpolados\tmg/100 g\n" +
    muestras.map((x) => `${x.nombre || "Muestra " + x.m}\t${d[`peso${x.m}`] ?? ""}\t${d[`abs${x.m}`] ?? ""}\t${formatear(x.ug, 2)}\t${formatear(x.mg100, 2)}`).join("\n");

  return (
    <div className="stack grande">
      <section className="panel">
        <div className="cab-seccion">
          <h2>5.1 — Curva de calibración</h2>
          <span className="muted pequeno">Absorbancia a 602 nm</span>
        </div>
        <div className="entradas" style={{ marginBottom: 14 }}>
          {ESTANDARES.map((x) => (
            <CampoDato key={x} id={`res-abs${x}`} etiqueta={`${x} µg de L-carnitina`} unidad="Abs" valor={d[`abs${x}`] ?? ""} onChange={(v) => setDato(`abs${x}`, v)} />
          ))}
        </div>
        <GraficoRecta
          ejeX="L-carnitina (µg)"
          ejeY="Absorbancia (602 nm)"
          recta={recta}
          series={[{ nombre: "Estándares", color: "var(--teal)", puntos: ESTANDARES.map((x, i) => ({ x, y: abs[i] })) }]}
          marcas={muestras.map((x) => ({ x: x.ug, y: x.a, etiqueta: x.nombre || `Muestra ${x.m}` }))}
        />
        <TarjetaRecta recta={recta} x="µg" y="Abs" minimoR2={0.99} />
      </section>

      <section className="panel">
        <div className="cab-seccion">
          <h2>5.2 — Tus muestras</h2>
        </div>
        <div className="muestras">
          {muestras.map((x) => (
            <div key={x.m} className="muestra">
              <label className="entrada" htmlFor={`nombre${x.m}`}>
                <span>Muestra {x.m}</span>
                <input id={`nombre${x.m}`} className="input-texto" value={x.nombre} placeholder="Ej.: aguacate maduro" onChange={(e) => setTexto(`nombre${x.m}`, e.target.value)} />
              </label>
              <div className="entradas">
                <CampoDato id={`res-peso${x.m}`} etiqueta="Peso" unidad="g" valor={d[`peso${x.m}`] ?? ""} ejemplo="1,0000" onChange={(v) => setDato(`peso${x.m}`, v)} />
                <CampoDato id={`res-absm${x.m}`} etiqueta="Absorbancia" unidad="Abs" valor={d[`abs${x.m}`] ?? ""} onChange={(v) => setDato(`abs${x.m}`, v)} />
              </div>
              <div className="w-salidas">
                <div className="w-salida">
                  <span className="eyebrow">µg interpolados</span>
                  <span className="mono w-numero">{formatear(x.ug, 2)}</span>
                </div>
                <div className="w-salida destacado">
                  <span className="eyebrow">mg / 100 g de muestra</span>
                  <span className="mono w-numero">{formatear(x.mg100, 2)}</span>
                </div>
              </div>
              {Number.isFinite(x.ug) && x.ug < 0 && <p className="aviso">Absorbancia por debajo del blanco: no detectable. Es un resultado válido; se discute.</p>}
            </div>
          ))}
        </div>
        <div className="formula" style={{ marginTop: 14, whiteSpace: "normal" }}>
          µg = (Abs muestra − b) / m &nbsp;·&nbsp; mg/100 g = (µg × factor de dilución × 100) / (peso × 1000)
        </div>
        <div className="row" style={{ marginTop: 12 }}>
          <CampoDato id="res-fd" etiqueta="Factor de dilución" unidad="×" valor={d.fd ?? ""} ejemplo="10" ancho={80} onChange={(v) => setDato("fd", v)} />
          <p className="muted pequeno" style={{ flex: 1, minWidth: 220 }}>
            Según la guía, considera el volumen total del extracto (10 mL), el volumen tomado para la columna (1 mL) y el volumen de elución (12 mL). Por defecto se usa 10 (10 mL / 1 mL, porque todo el eluido se evapora). Ajústalo según indique tu docente.
          </p>
        </div>
      </section>

      <section className="panel">
        <div className="cab-seccion">
          <h2>5.3 — Tabla comparativa entre grupos</h2>
          <span className="muted pequeno">Con los datos de todos los grupos</span>
        </div>
        <TablaEditable
          id="grupos"
          columnas={["Grupo", "Muestra A", "mg/100 g (A)", "Muestra B", "mg/100 g (B)", "Diferencia (%)"]}
          filas={["1", "2", "3", "4", "5"]}
          valores={progreso.respuestas}
          onChange={setTexto}
        />
      </section>

      <section className="panel copiar-panel">
        <div style={{ flex: 1 }}>
          <b>Tablas 5.1 y 5.2 para tu informe</b>
          <p className="muted pequeno">Se pega en Word o Excel separada en columnas.</p>
        </div>
        <BotonCopiar texto={tablaTexto} etiqueta="Copiar tablas" />
      </section>
    </div>
  );
}
