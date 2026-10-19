"use client";

import { usePractica } from "@/context/ProgresoContext";
import { BotonCopiar } from "@/components/ui/Copiar";
import { formatear } from "@/lib/calculos";
import type { Practica } from "@/lib/types";
import { CampoDato, GraficoRecta, TarjetaRecta, ajustar, num } from "./comunes";

// Filas de la tabla de registro de la guía
const PRUEBAS = [
  { id: "azucares", nombre: "Azúcares reductores", detecta: "Azúcares" },
  { id: "lugol", nombre: "Lugol", detecta: "" },
  { id: "lb", nombre: "Liebermann-Burchard", detecta: "Triterpenos" },
  { id: "shinoda", nombre: "Shinoda", detecta: "Flavonoides" },
  { id: "h2so4", nombre: "Ácido sulfúrico (H₂SO₄)", detecta: "Flavonoides" },
  { id: "zinc", nombre: "Zinc + HCl", detecta: "Leucoantocianidinas / catequinas" },
  { id: "koh", nombre: "KOH 5 %", detecta: "Cumarinas / antraquinonas" },
  { id: "gelatina", nombre: "Gelatina–NaCl", detecta: "Taninos" },
  { id: "plomo", nombre: "Acetato de plomo 5 %", detecta: "Taninos" },
  { id: "dragendorff", nombre: "Dragendorff", detecta: "Alcaloides" },
  { id: "mayer", nombre: "Mayer", detecta: "Alcaloides" },
];
const NIVELES = [
  { v: "-", t: "–", titulo: "Negativo" },
  { v: "+", t: "+", titulo: "Reacción débil" },
  { v: "++", t: "++", titulo: "Reacción moderada" },
  { v: "+++", t: "+++", titulo: "Reacción intensa" },
];
const CURVA = [5, 10, 20, 40, 80];

/** Práctica 13: tabla de la marcha fitoquímica y curva de azúcares a 490 nm */
export function ResFitoquimico({ p }: { p: Practica }) {
  const { progreso, actualizar } = usePractica(p.id);
  const d = progreso.datos;
  const e = progreso.elecciones;
  const r = progreso.respuestas;
  const setDato = (id: string, v: string) => actualizar((pr) => ({ ...pr, datos: { ...pr.datos, [id]: v } }));
  const setNivel = (id: string, v: string) => actualizar((pr) => ({ ...pr, elecciones: { ...pr.elecciones, [`prueba.${id}`]: pr.elecciones[`prueba.${id}`] === v ? "" : v } }));
  const setTexto = (id: string, v: string) => actualizar((pr) => ({ ...pr, respuestas: { ...pr.respuestas, [id]: v } }));

  const abs = CURVA.map((x) => num(d[`g${x}`]));
  const recta = ajustar(CURVA, abs);
  const absM = num(d.gMuestra);
  const conc = recta.valida ? (absM - recta.intercepto) / recta.pendiente : NaN;
  const dil = Number.isFinite(num(d.dilMuestra)) ? num(d.dilMuestra) : 1;

  const positivos = PRUEBAS.filter((x) => (e[`prueba.${x.id}`] ?? "").includes("+") && x.detecta);
  const familias = [...new Set(positivos.map((x) => x.detecta))];
  const hechas = PRUEBAS.filter((x) => e[`prueba.${x.id}`]).length;

  const tablaTexto =
    `Planta: ${r.planta ?? ""}\nPrueba fitoquímica\tResultado\tObservación\n` +
    PRUEBAS.map((x) => `${x.nombre}\t${e[`prueba.${x.id}`] === "-" ? "(–)" : e[`prueba.${x.id}`] ? `(${e[`prueba.${x.id}`]})` : ""}\t${r[`obs.${x.id}`] ?? ""}`).join("\n") +
    (Number.isFinite(conc) ? `\n\nAzúcares (fenol-sulfúrico, 490 nm)\t${formatear(conc * dil, 1)} µg/mL` : "");

  return (
    <div className="stack grande">
      <section className="panel">
        <div className="cab-seccion">
          <h2>Registro de resultados</h2>
          <span className="pill">
            {hechas}/{PRUEBAS.length} pruebas
          </span>
        </div>
        <label className="entrada" htmlFor="planta" style={{ marginBottom: 14, maxWidth: 360 }}>
          <span>Planta de tu grupo</span>
          <input id="planta" className="input-texto" value={r.planta ?? ""} placeholder="Ej.: yerba mate" onChange={(ev) => setTexto("planta", ev.target.value)} />
        </label>
        <div className="tabla-scroll">
          <table className="tabla tabla-datos">
            <thead>
              <tr>
                <th>Prueba fitoquímica</th>
                <th>Resultado</th>
                <th>Color u observación</th>
              </tr>
            </thead>
            <tbody>
              {PRUEBAS.map((x) => (
                <tr key={x.id}>
                  <th scope="row">
                    {x.nombre}
                    {x.detecta && <span className="muted pequeno bloque-linea">{x.detecta}</span>}
                  </th>
                  <td>
                    <div className="niveles" role="group" aria-label={`Resultado de ${x.nombre}`}>
                      {NIVELES.map((n) => (
                        <button key={n.v} className={`nivel ${e[`prueba.${x.id}`] === n.v ? "activo" : ""} ${n.v === "-" ? "neg" : ""}`} aria-pressed={e[`prueba.${x.id}`] === n.v} title={n.titulo} onClick={() => setNivel(x.id, n.v)}>
                          {n.t}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td>
                    <input className="input-texto" value={r[`obs.${x.id}`] ?? ""} onChange={(ev) => setTexto(`obs.${x.id}`, ev.target.value)} aria-label={`Observación de ${x.nombre}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted pequeno" style={{ marginTop: 8 }}>
          (–) Negativo · (+) Reacción débil · (++) Reacción moderada · (+++) Reacción intensa
        </p>
        {familias.length > 0 && (
          <div className="retro bien" style={{ marginTop: 12 }}>
            <b>Grupos detectados en tu planta:</b> {familias.join(", ")}. Úsalos para armar el esquema planta → efecto en la sección Esquema.
          </div>
        )}
      </section>

      <section className="panel">
        <div className="cab-seccion">
          <h2>Curva de glucosa (490 nm)</h2>
          <span className="muted pequeno">Método fenol-sulfúrico</span>
        </div>
        <div className="entradas" style={{ marginBottom: 14 }}>
          {CURVA.map((x) => (
            <CampoDato key={x} id={`res-g${x}`} etiqueta={`${x} µg/mL`} unidad="Abs" valor={d[`g${x}`] ?? ""} ancho={90} onChange={(v) => setDato(`g${x}`, v)} />
          ))}
        </div>
        <GraficoRecta
          ejeX="Glucosa (µg/mL)"
          ejeY="Absorbancia (490 nm)"
          recta={recta}
          series={[{ nombre: "Estándares de glucosa", color: "var(--teal)", puntos: CURVA.map((x, i) => ({ x, y: abs[i] })) }]}
          marcas={[{ x: conc, y: absM, etiqueta: r.planta || "Extracto" }]}
        />
        <TarjetaRecta recta={recta} x="µg/mL" y="Abs" />
        <div className="entradas" style={{ marginTop: 14 }}>
          <CampoDato id="res-gM" etiqueta="Absorbancia del extracto" unidad="Abs" valor={d.gMuestra ?? ""} onChange={(v) => setDato("gMuestra", v)} />
          <CampoDato id="res-dil" etiqueta="Dilución del extracto (si la hubo)" unidad="×" valor={d.dilMuestra ?? ""} ejemplo="1" ancho={80} onChange={(v) => setDato("dilMuestra", v)} />
        </div>
        <div className="w-salidas" style={{ marginTop: 14 }}>
          <div className="w-salida destacado">
            <span className="eyebrow">Azúcares en el extracto</span>
            <span className="mono w-numero">
              {formatear(conc * dil, 1)} <span>µg/mL (equivalentes de glucosa)</span>
            </span>
          </div>
        </div>
        {Number.isFinite(conc) && conc > 80 && <p className="aviso">La muestra queda por encima del punto más alto de la curva (80 µg/mL): conviene diluir el extracto y repetir.</p>}
      </section>

      <section className="panel copiar-panel">
        <div style={{ flex: 1 }}>
          <b>Tabla de resultados para tu informe</b>
          <p className="muted pequeno">Se pega en Word o Excel separada en columnas.</p>
        </div>
        <BotonCopiar texto={tablaTexto} etiqueta="Copiar tabla" />
      </section>
    </div>
  );
}
