"use client";

import { usePractica } from "@/context/ProgresoContext";
import { BotonCopiar } from "@/components/ui/Copiar";
import { formatear } from "@/lib/calculos";
import type { Practica } from "@/lib/types";
import { CampoDato, GraficoRecta, TablaEditable, TarjetaRecta, ajustar, num } from "./comunes";

const TIEMPOS = [0, 10, 20, 30];

/** Práctica 7: AGL = (V NaOH × N NaOH × 1000) / V alícuota, y velocidad de lipólisis */
export function ResLipolisis({ p }: { p: Practica }) {
  const { progreso, actualizar } = usePractica(p.id);
  const d = progreso.datos;
  const setDato = (id: string, v: string) => actualizar((pr) => ({ ...pr, datos: { ...pr.datos, [id]: v } }));
  const setTexto = (id: string, v: string) => actualizar((pr) => ({ ...pr, respuestas: { ...pr.respuestas, [id]: v } }));

  const N = Number.isFinite(num(d.nNaOH)) ? num(d.nNaOH) : 0.01;
  const agl = (v: number) => (v * N * 1000) / 1;
  const control = TIEMPOS.map((t) => agl(num(d[`c${t}`])));
  const experimental = TIEMPOS.map((t) => agl(num(d[`e${t}`])));
  const nPuntos = Math.min(4, Math.max(2, Number(d.zonaLineal) || 4));
  const recta = ajustar(TIEMPOS.slice(0, nPuntos), experimental.slice(0, nPuntos));
  const hayDatos = experimental.some(Number.isFinite);

  const tablaTexto =
    "Tiempo (min)\tV NaOH control (mL)\tAGL control (µmol/mL)\tV NaOH experimental (mL)\tAGL experimental (µmol/mL)\n" +
    TIEMPOS.map((t, i) => `${t}\t${d[`c${t}`] ?? ""}\t${formatear(control[i], 2)}\t${d[`e${t}`] ?? ""}\t${formatear(experimental[i], 2)}`).join("\n") +
    (recta.valida ? `\n\nVelocidad de lipólisis\t${formatear(recta.pendiente, 4)}\tµmol AGL/mL/min\nIntercepto\t${formatear(recta.intercepto, 4)}\nR²\t${formatear(recta.r2, 4)}` : "");

  return (
    <div className="stack grande">
      <section className="panel">
        <div className="cab-seccion">
          <h2>Tabla B — Observaciones de emulsificación</h2>
          <span className="muted pequeno">Turbidez, separación de fases, tamaño de gotas</span>
        </div>
        <TablaEditable
          id="tablaB"
          columnas={["Tubo", "t = 0 min (inmediato)", "t = 5 min", "t = 15 min", "Estabilidad"]}
          filas={["1 · Sin sales biliares", "2 · Con sales biliares"]}
          valores={progreso.respuestas}
          onChange={setTexto}
        />
      </section>

      <section className="panel">
        <div className="cab-seccion">
          <h2>Tabla C — Lipólisis: registro de titulación</h2>
          {hayDatos ? <span className="pill ok">Con tus datos</span> : <span className="pill warn">Anota los volúmenes</span>}
        </div>
        <div className="entradas" style={{ marginBottom: 14 }}>
          <CampoDato id="res-n" etiqueta="Normalidad exacta del NaOH" unidad="N" valor={d.nNaOH ?? ""} ejemplo="0,0100" onChange={(v) => setDato("nNaOH", v)} />
        </div>
        <div className="tabla-scroll">
          <table className="tabla tabla-datos">
            <thead>
              <tr>
                <th>Tiempo (min)</th>
                <th>V NaOH control (mL)</th>
                <th className="num">AGL control (µmol/mL)</th>
                <th>V NaOH experimental (mL)</th>
                <th className="num">AGL experimental (µmol/mL)</th>
              </tr>
            </thead>
            <tbody>
              {TIEMPOS.map((t, i) => (
                <tr key={t}>
                  <th scope="row" className="mono">
                    {t}
                  </th>
                  <td>
                    <CampoDato id={`res-c${t}`} valor={d[`c${t}`] ?? ""} unidad="mL" ancho={80} onChange={(v) => setDato(`c${t}`, v)} />
                  </td>
                  <td className="num">{formatear(control[i], 2)}</td>
                  <td>
                    <CampoDato id={`res-e${t}`} valor={d[`e${t}`] ?? ""} unidad="mL" ancho={80} onChange={(v) => setDato(`e${t}`, v)} />
                  </td>
                  <td className="num">
                    <b>{formatear(experimental[i], 2)}</b>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="formula" style={{ marginTop: 12 }}>
          AGL (µmol/mL) = (V NaOH × N NaOH × 1000) / V alícuota = V × {formatear(N, 4)} × 1000 / 1 mL
        </div>
      </section>

      <section className="panel">
        <div className="cab-seccion">
          <h2>Tabla D — Velocidad de lipólisis</h2>
          <label className="row pequeno" htmlFor="zona">
            Puntos de la zona lineal:
            <select id="zona" value={nPuntos} onChange={(e) => setDato("zonaLineal", e.target.value)}>
              <option value={2}>0–10 min</option>
              <option value={3}>0–20 min</option>
              <option value={4}>0–30 min</option>
            </select>
          </label>
        </div>
        <GraficoRecta
          ejeX="Tiempo (min)"
          ejeY="AGL (µmol/mL)"
          recta={recta}
          series={[
            { nombre: "Experimental (con lipasa)", color: "var(--accent)", puntos: TIEMPOS.map((t, i) => ({ x: t, y: experimental[i] })) },
            { nombre: "Control (sin lipasa)", color: "var(--muted)", puntos: TIEMPOS.map((t, i) => ({ x: t, y: control[i] })) },
          ]}
        />
        <TarjetaRecta recta={recta} x="t" y="AGL" />
        {recta.valida && (
          <div className="resultado-grid" style={{ marginTop: 14 }}>
            <div className="resultado-principal">
              <div className="eyebrow">Velocidad de lipólisis</div>
              <div className="resultado-numero mono">{formatear(recta.pendiente, 3)}</div>
              <div className="resultado-unidad">µmol AGL / mL / min (pendiente de la zona lineal)</div>
            </div>
            <div className="panel precision">
              <div className="eyebrow">AGL a t = 30 min</div>
              <span className="mono precision-num">{formatear(experimental[3], 2)}</span>
              <p className="muted pequeno">µmol/mL en el experimental · control: {formatear(control[3], 2)}</p>
            </div>
          </div>
        )}
      </section>

      <section className="panel">
        <div className="cab-seccion">
          <h2>Tabla comparativa inter-grupos</h2>
          <span className="muted pequeno">Complétala con los datos del pizarrón</span>
        </div>
        <TablaEditable
          id="intergrupos"
          columnas={["Grupo · Muestra", "Emulsión sin sales biliares", "Emulsión con sales biliares", "Velocidad (µmol/mL/min)", "AGL t = 30 min (µmol/mL)"]}
          filas={["1 · Aceite vegetal", "2 · Mantequilla", "3 · Aceite de coco", "4 · Grasa animal", "5 · Aceite de oliva extra virgen"]}
          valores={progreso.respuestas}
          onChange={setTexto}
        />
      </section>

      <section className="panel copiar-panel">
        <div style={{ flex: 1 }}>
          <b>Tabla C y D para tu informe</b>
          <p className="muted pequeno">Se pega en Word o Excel separada en columnas.</p>
        </div>
        <BotonCopiar texto={tablaTexto} etiqueta="Copiar tabla" />
      </section>
    </div>
  );
}
