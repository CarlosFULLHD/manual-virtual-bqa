"use client";

import { usePractica } from "@/context/ProgresoContext";
import { BotonCopiar } from "@/components/ui/Copiar";
import { formatear } from "@/lib/calculos";
import type { Practica } from "@/lib/types";
import { CampoDato, num } from "./comunes";

const TEJIDOS = [
  { id: "Pechuga", nombre: "Pechuga", ref: [8, 15] as const },
  { id: "Muslo", nombre: "Muslo", ref: null },
  { id: "Higado", nombre: "Hígado", ref: [20, 50] as const },
];
// Mezcla de reacción de la guía: 2,5 mL buffer + 0,1 NADH + 0,1 extracto + 0,1 piruvato
const V_TOTAL = 2.8;
const V_EXTRACTO = 0.1;
const EPSILON_MM = 6.22; // mM⁻¹·cm⁻¹ (6.220 M⁻¹cm⁻¹)

/** Práctica 11: actividad de LDH, glucógeno y triglicéridos hepáticos */
export function ResMetabolismo({ p }: { p: Practica }) {
  const { progreso, actualizar } = usePractica(p.id);
  const d = progreso.datos;
  const setDato = (id: string, v: string) => actualizar((pr) => ({ ...pr, datos: { ...pr.datos, [id]: v } }));
  const def = (id: string, porDefecto: number) => (Number.isFinite(num(d[id])) ? num(d[id]) : porDefecto);

  const ldh = TEJIDOS.map((t) => {
    const delta = num(d[`d${t.id}`]);
    const ui = (delta * V_TOTAL) / (EPSILON_MM * 1 * V_EXTRACTO);
    const prot = num(d[`prot${t.id}`]);
    return { ...t, delta, ui, esp: ui / prot };
  });
  const maxUI = Math.max(...ldh.map((x) => (Number.isFinite(x.ui) ? x.ui : 0)), 0.0001);

  const glucogeno = TEJIDOS.map((t) => {
    const glu = num(d[`glu${t.id}`]);
    const vol = def(`volGlu${t.id}`, 2);
    const g = def(`gGlu${t.id}`, 0.0625);
    const mgG = (glu * vol * 0.9) / 1000 / g;
    return { ...t, glu, vol, g, mgG };
  });

  const absTG = num(d.absTG), absStd = num(d.absStd);
  const cStd = def("cStd", 200);
  const tgDl = (absTG / absStd) * cStd;
  const vRes = def("vResTG", 1);
  const gHig = def("gHigTG", 0.2);
  const tgG = (tgDl * (vRes / 100)) / gHig;

  const tablaTexto =
    "Tabla A — LDH\nTejido\tΔAbs/min (340 nm)\tActividad (UI/mL extracto)\tProteína (mg/mL)\tActividad específica (UI/mg prot.)\n" +
    ldh.map((x) => `${x.nombre}\t${d[`d${x.id}`] ?? ""}\t${formatear(x.ui, 3)}\t${d[`prot${x.id}`] ?? ""}\t${formatear(x.esp, 3)}`).join("\n") +
    "\n\nTabla B — Glucógeno\nTejido\t[Glucosa] µg/mL\tGlucógeno (mg/g tejido)\n" +
    glucogeno.map((x) => `${x.nombre}\t${d[`glu${x.id}`] ?? ""}\t${formatear(x.mgG, 2)}`).join("\n") +
    `\n\nTabla C — Triglicéridos hepáticos\nAbs (505 nm)\tTG (mg/dL en extracto)\tTG (mg/g tejido hepático)\n${d.absTG ?? ""}\t${formatear(tgDl, 1)}\t${formatear(tgG, 2)}`;

  return (
    <div className="stack grande">
      <section className="panel">
        <div className="cab-seccion">
          <h2>Tabla A — Actividad de LDH</h2>
          <span className="muted pequeno">340 nm · 25 °C</span>
        </div>
        <div className="tabla-scroll">
          <table className="tabla tabla-datos">
            <thead>
              <tr>
                <th>Tejido</th>
                <th>ΔAbs/min</th>
                <th className="num">UI/mL extracto</th>
                <th>Proteína (mg/mL)</th>
                <th className="num">UI/mg proteína</th>
                <th>Comparación</th>
              </tr>
            </thead>
            <tbody>
              {ldh.map((x) => (
                <tr key={x.id}>
                  <th scope="row">{x.nombre}</th>
                  <td>
                    <CampoDato id={`res-d${x.id}`} valor={d[`d${x.id}`] ?? ""} ancho={80} ejemplo="0,100" onChange={(v) => setDato(`d${x.id}`, v)} />
                  </td>
                  <td className="num">
                    <b>{formatear(x.ui, 3)}</b>
                  </td>
                  <td>
                    <CampoDato id={`res-prot${x.id}`} valor={d[`prot${x.id}`] ?? ""} ancho={80} onChange={(v) => setDato(`prot${x.id}`, v)} />
                  </td>
                  <td className="num">{formatear(x.esp, 3)}</td>
                  <td style={{ minWidth: 120 }}>
                    <div className="perfil-barra">
                      <div className="normal" style={{ width: `${Number.isFinite(x.ui) ? (x.ui / maxUI) * 100 : 0}%`, opacity: 1, background: "var(--accent)" }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="formula" style={{ marginTop: 12, whiteSpace: "normal" }}>
          Actividad (UI/mL) = (ΔAbs/min × Vol. total) / (ε × d × Vol. extracto) = ΔAbs/min × {formatear(V_TOTAL, 1)} mL / (6,22 mM⁻¹cm⁻¹ × 1 cm × {formatear(V_EXTRACTO, 1)} mL)
        </div>
        <p className="muted pequeno" style={{ marginTop: 6 }}>
          La proteína del extracto se cuantifica aparte (Bradford o Biuret). Esperado: mayor actividad en pechuga (fibras blancas) que en muslo (fibras rojas).
        </p>
      </section>

      <section className="panel">
        <div className="cab-seccion">
          <h2>Tabla B — Contenido de glucógeno</h2>
          <span className="muted pequeno">Fenol-sulfúrico · 490 nm</span>
        </div>
        <div className="tabla-scroll">
          <table className="tabla tabla-datos">
            <thead>
              <tr>
                <th>Tejido</th>
                <th>[Glucosa] interpolada (µg/mL)</th>
                <th>Volumen final (mL)</th>
                <th>Tejido en la alícuota (g)</th>
                <th className="num">Glucógeno (mg/g)</th>
                <th>Referencia</th>
              </tr>
            </thead>
            <tbody>
              {glucogeno.map((x) => {
                const dentro = x.ref && Number.isFinite(x.mgG) ? x.mgG >= x.ref[0] && x.mgG <= x.ref[1] : null;
                return (
                  <tr key={x.id}>
                    <th scope="row">{x.nombre}</th>
                    <td>
                      <CampoDato id={`res-glu${x.id}`} valor={d[`glu${x.id}`] ?? ""} ancho={90} onChange={(v) => setDato(`glu${x.id}`, v)} />
                    </td>
                    <td>
                      <CampoDato id={`res-vol${x.id}`} valor={d[`volGlu${x.id}`] ?? ""} ejemplo="2" ancho={70} onChange={(v) => setDato(`volGlu${x.id}`, v)} />
                    </td>
                    <td>
                      <CampoDato id={`res-g${x.id}`} valor={d[`gGlu${x.id}`] ?? ""} ejemplo="0,0625" ancho={90} onChange={(v) => setDato(`gGlu${x.id}`, v)} />
                    </td>
                    <td className="num">
                      <b>{formatear(x.mgG, 2)}</b>
                    </td>
                    <td>
                      {x.ref ? (
                        <span className={`pill ${dentro === null ? "" : dentro ? "ok" : "warn"}`}>
                          {x.ref[0]}–{x.ref[1]} mg/g
                        </span>
                      ) : (
                        <span className="muted pequeno">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="formula" style={{ marginTop: 12, whiteSpace: "normal" }}>
          Glucógeno (mg/g) = [Glucosa] µg/mL × volumen final (mL) × 0,9 / 1000 / g de tejido
        </div>
        <p className="muted pequeno" style={{ marginTop: 6 }}>
          0,9 es el factor de la guía (1 g de glucosa = 0,9 g de glucógeno). Si no cambias los valores, se asume un volumen final de 2 mL y 0,0625 g de tejido en la alícuota (0,5 mL de un extracto de 0,5 g en 4 mL). Ajusta ambos a lo que realmente usaste, incluida cualquier dilución.
        </p>
      </section>

      <section className="panel">
        <div className="cab-seccion">
          <h2>Tabla C — Triglicéridos hepáticos</h2>
          <span className="muted pequeno">GPO-PAP · 505 nm</span>
        </div>
        <div className="entradas">
          <CampoDato id="res-absTG" etiqueta="Abs muestra" unidad="Abs" valor={d.absTG ?? ""} onChange={(v) => setDato("absTG", v)} />
          <CampoDato id="res-absStd" etiqueta="Abs estándar" unidad="Abs" valor={d.absStd ?? ""} onChange={(v) => setDato("absStd", v)} />
          <CampoDato id="res-cStd" etiqueta="Concentración del estándar" unidad="mg/dL" valor={d.cStd ?? ""} ejemplo="200" onChange={(v) => setDato("cStd", v)} />
          <CampoDato id="res-vRes" etiqueta="Volumen de resuspensión" unidad="mL" valor={d.vResTG ?? ""} ejemplo="1" onChange={(v) => setDato("vResTG", v)} />
          <CampoDato id="res-gHig" etiqueta="Hígado pesado" unidad="g" valor={d.gHigTG ?? ""} ejemplo="0,2" onChange={(v) => setDato("gHigTG", v)} />
        </div>
        <div className="w-salidas" style={{ marginTop: 14 }}>
          <div className="w-salida">
            <span className="eyebrow">TG en el extracto</span>
            <span className="mono w-numero">
              {formatear(tgDl, 1)} <span>mg/dL</span>
            </span>
          </div>
          <div className="w-salida destacado">
            <span className="eyebrow">TG por gramo de hígado</span>
            <span className="mono w-numero">
              {formatear(tgG, 2)} <span>mg/g</span>
            </span>
          </div>
        </div>
        <div className="formula" style={{ marginTop: 12, whiteSpace: "normal" }}>
          TG (mg/dL) = (Abs muestra / Abs estándar) × [estándar] &nbsp;·&nbsp; TG (mg/g) = TG (mg/dL) × volumen (dL) / g de hígado
        </div>
      </section>

      <section className="panel copiar-panel">
        <div style={{ flex: 1 }}>
          <b>Tablas A, B y C para tu informe</b>
          <p className="muted pequeno">Se pega en Word o Excel separada en columnas.</p>
        </div>
        <BotonCopiar texto={tablaTexto} etiqueta="Copiar tablas" />
      </section>
    </div>
  );
}
