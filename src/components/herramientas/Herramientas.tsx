"use client";

import { useState } from "react";
import { BotonCopiar } from "@/components/ui/Copiar";
import { Icono } from "@/components/ui/Icono";
import { estadistica, formatear, masaSolucionMolar, parseNumero, volumenDilucion } from "@/lib/calculos";

const PESTANAS = [
  { id: "dilucion", nombre: "Diluciones", icono: "gotas" },
  { id: "solucion", nombre: "Preparar solución", icono: "matraz" },
  { id: "unidades", nombre: "Convertir unidades", icono: "reiniciar" },
  { id: "estadistica", nombre: "Estadística", icono: "grafico" },
] as const;

type Pestana = (typeof PESTANAS)[number]["id"];

export function Herramientas() {
  const [tab, setTab] = useState<Pestana>("dilucion");
  return (
    <div className="stack grande">
      <div className="pestanas" role="tablist">
        {PESTANAS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} className="pestana" onClick={() => setTab(t.id)}>
            <Icono nombre={t.icono} tam={18} />
            {t.nombre}
          </button>
        ))}
      </div>
      {tab === "dilucion" && <Dilucion />}
      {tab === "solucion" && <Solucion />}
      {tab === "unidades" && <Unidades />}
      {tab === "estadistica" && <Estadistica />}
    </div>
  );
}

function Campo({ id, etiqueta, unidad, valor, onChange }: { id: string; etiqueta: string; unidad: string; valor: string; onChange: (v: string) => void }) {
  return (
    <label className="entrada" htmlFor={id}>
      <span>{etiqueta}</span>
      <span className="entrada-caja">
        <input id={id} inputMode="decimal" value={valor} onChange={(e) => onChange(e.target.value)} />
        <span className="entrada-unidad">{unidad}</span>
      </span>
    </label>
  );
}

function Resultado({ etiqueta, valor, unidad, detalle }: { etiqueta: string; valor: string; unidad: string; detalle?: string }) {
  return (
    <div className="herr-resultado">
      <span className="eyebrow">{etiqueta}</span>
      <span className="herr-numero mono">
        {valor} <span>{unidad}</span>
      </span>
      {detalle && <span className="formula pequeno">{detalle}</span>}
    </div>
  );
}

/* ---------- C1V1 = C2V2 ---------- */
function Dilucion() {
  const [c1, setC1] = useState("100");
  const [c2, setC2] = useState("25");
  const [v2, setV2] = useState("10");
  const n1 = parseNumero(c1), n2 = parseNumero(c2), nv2 = parseNumero(v2);
  const ok = n1 && n2 !== null && nv2 !== null && n2 <= n1;
  const v1 = ok ? volumenDilucion(n1!, n2!, nv2!) : NaN;
  return (
    <section className="panel herr">
      <div>
        <h2>Diluciones</h2>
        <p className="muted pequeno">¿Cuánto de la solución concentrada necesito? Se usa C₁·V₁ = C₂·V₂.</p>
      </div>
      <div className="entradas">
        <Campo id="c1" etiqueta="Concentración que tengo (C₁)" unidad="mg/dL" valor={c1} onChange={setC1} />
        <Campo id="c2" etiqueta="Concentración que quiero (C₂)" unidad="mg/dL" valor={c2} onChange={setC2} />
        <Campo id="v2" etiqueta="Volumen final (V₂)" unidad="mL" valor={v2} onChange={setV2} />
      </div>
      {n1 !== null && n2 !== null && n2 > n1 ? (
        <p className="aviso">La concentración que quieres no puede ser mayor que la que tienes.</p>
      ) : (
        <div className="herr-salida">
          <Resultado etiqueta="Toma de la solución concentrada" valor={formatear(v1, 2)} unidad="mL" detalle={`V₁ = (${c2} × ${v2}) / ${c1}`} />
          <Resultado etiqueta="Completa con agua/diluyente" valor={formatear((nv2 ?? NaN) - v1, 2)} unidad="mL" />
        </div>
      )}
      <p className="muted pequeno">Las unidades de C₁ y C₂ pueden ser cualquiera, siempre que sean las mismas.</p>
    </section>
  );
}

/* ---------- Preparar solución ---------- */
const COMPUESTOS = [
  { nombre: "NaOH (hidróxido de sodio)", pm: 40.0, eq: 1 },
  { nombre: "NaCl (cloruro de sodio)", pm: 58.44, eq: 1 },
  { nombre: "Na₂CO₃ (carbonato de sodio)", pm: 105.99, eq: 2 },
  { nombre: "CuSO₄·5H₂O (sulfato cúprico)", pm: 249.69, eq: 2 },
  { nombre: "Glucosa", pm: 180.16, eq: 1 },
  { nombre: "Otro (escribir PM)", pm: 0, eq: 1 },
];

function Solucion() {
  const [tipo, setTipo] = useState<"M" | "N" | "pv">("M");
  const [comp, setComp] = useState(0);
  const [pmLibre, setPmLibre] = useState("");
  const [eqLibre, setEqLibre] = useState("1");
  const [conc, setConc] = useState("0.1");
  const [vol, setVol] = useState("250");
  const c = COMPUESTOS[comp];
  const pm = c.pm || parseNumero(pmLibre) || NaN;
  const eq = c.pm ? c.eq : parseNumero(eqLibre) || 1;
  const nc = parseNumero(conc) ?? NaN, nv = parseNumero(vol) ?? NaN;
  let masa = NaN, detalle = "";
  if (tipo === "M") {
    masa = masaSolucionMolar(nc, nv, pm);
    detalle = `m = ${conc} mol/L × ${formatear(nv / 1000, 3)} L × ${formatear(pm, 2)} g/mol`;
  } else if (tipo === "N") {
    masa = masaSolucionMolar(nc, nv, pm / eq);
    detalle = `m = ${conc} eq/L × ${formatear(nv / 1000, 3)} L × ${formatear(pm / eq, 2)} g/eq`;
  } else {
    masa = (nc * nv) / 100;
    detalle = `m = ${conc} g/100 mL × ${vol} mL / 100`;
  }
  return (
    <section className="panel herr">
      <div>
        <h2>Preparar una solución</h2>
        <p className="muted pequeno">¿Cuántos gramos pesar? Elige el tipo de concentración.</p>
      </div>
      <div className="segmento" role="radiogroup" aria-label="Tipo de concentración">
        {(
          [
            ["M", "Molar (M)"],
            ["N", "Normal (N)"],
            ["pv", "% p/v"],
          ] as const
        ).map(([k, t]) => (
          <button key={k} role="radio" aria-checked={tipo === k} onClick={() => setTipo(k)}>
            {t}
          </button>
        ))}
      </div>
      <div className="entradas">
        {tipo !== "pv" && (
          <label className="entrada" htmlFor="comp">
            <span>Compuesto</span>
            <select id="comp" value={comp} onChange={(e) => setComp(Number(e.target.value))}>
              {COMPUESTOS.map((x, i) => (
                <option key={x.nombre} value={i}>
                  {x.nombre}
                </option>
              ))}
            </select>
          </label>
        )}
        {tipo !== "pv" && !c.pm && <Campo id="pm" etiqueta="Peso molecular" unidad="g/mol" valor={pmLibre} onChange={setPmLibre} />}
        {tipo === "N" && !c.pm && <Campo id="eq" etiqueta="Equivalentes por mol" unidad="eq" valor={eqLibre} onChange={setEqLibre} />}
        <Campo id="conc" etiqueta="Concentración" unidad={tipo === "M" ? "mol/L" : tipo === "N" ? "eq/L" : "%"} valor={conc} onChange={setConc} />
        <Campo id="vol" etiqueta="Volumen a preparar" unidad="mL" valor={vol} onChange={setVol} />
      </div>
      <div className="herr-salida">
        <Resultado etiqueta="Pesa" valor={formatear(masa, 3)} unidad="g" detalle={detalle} />
      </div>
      <p className="muted pequeno">Disuelve en menos agua de la final y luego enrasa en un matraz aforado.</p>
    </section>
  );
}

/* ---------- Conversión de unidades clínicas ---------- */
const ANALITOS = [
  { nombre: "Glucosa", de: "mg/dL", a: "mmol/L", factor: 1 / 18.016 },
  { nombre: "Colesterol", de: "mg/dL", a: "mmol/L", factor: 1 / 38.67 },
  { nombre: "Triglicéridos", de: "mg/dL", a: "mmol/L", factor: 1 / 88.57 },
  { nombre: "Urea", de: "mg/dL", a: "mmol/L", factor: 1 / 6.006 },
  { nombre: "Creatinina", de: "mg/dL", a: "µmol/L", factor: 88.4 },
  { nombre: "Ácido úrico", de: "mg/dL", a: "µmol/L", factor: 59.48 },
];

function Unidades() {
  const [i, setI] = useState(0);
  const [valor, setValor] = useState("100");
  const [invertir, setInvertir] = useState(false);
  const a = ANALITOS[i];
  const n = parseNumero(valor) ?? NaN;
  const res = invertir ? n / a.factor : n * a.factor;
  return (
    <section className="panel herr">
      <div>
        <h2>Convertir unidades</h2>
        <p className="muted pequeno">Unidades convencionales ↔ Sistema Internacional.</p>
      </div>
      <div className="chips-opciones">
        {ANALITOS.map((x, j) => (
          <button key={x.nombre} className={`chip ${j === i ? "activo" : ""}`} aria-pressed={j === i} onClick={() => setI(j)}>
            {x.nombre}
          </button>
        ))}
      </div>
      <div className="conversor">
        <Campo id="valor" etiqueta={invertir ? a.a : a.de} unidad={invertir ? a.a : a.de} valor={valor} onChange={setValor} />
        <button className="btn icono-solo" onClick={() => setInvertir(!invertir)} aria-label="Invertir conversión">
          <Icono nombre="repetir" tam={20} />
        </button>
        <Resultado etiqueta={invertir ? a.de : a.a} valor={formatear(res, 2)} unidad={invertir ? a.de : a.a} />
      </div>
      <p className="muted pequeno">
        Factor: 1 {a.de} = {formatear(a.factor, 4)} {a.a}
      </p>
    </section>
  );
}

/* ---------- Estadística rápida ---------- */
function Estadistica() {
  const [texto, setTexto] = useState("1,50\n1,60\n1,50");
  const [ref, setRef] = useState("");
  const valores = texto
    .split(/[\n;\t ]+/)
    .map((x) => parseNumero(x))
    .filter((x): x is number => x !== null);
  const e = estadistica(valores);
  const r = parseNumero(ref);
  const error = r ? (Math.abs(e.promedio - r) / r) * 100 : NaN;
  const resumen = `n = ${e.n}\nPromedio = ${formatear(e.promedio, 4)}\nDesviación estándar = ${formatear(e.desviacion, 4)}\nCV = ${formatear(e.cv, 2)} %${r ? `\n% error = ${formatear(error, 2)} %` : ""}`;
  return (
    <section className="panel herr">
      <div>
        <h2>Estadística rápida</h2>
        <p className="muted pequeno">Pega o escribe tus valores, uno por línea.</p>
      </div>
      <div className="herr-dos">
        <label className="entrada" htmlFor="valores">
          <span>Valores</span>
          <textarea id="valores" value={texto} onChange={(ev) => setTexto(ev.target.value)} style={{ minHeight: 140 }} />
        </label>
        <div className="stack">
          <div className="resumen-grid dos">
            <Resultado etiqueta="Promedio" valor={formatear(e.promedio, 3)} unidad="" />
            <Resultado etiqueta="Desv. estándar" valor={formatear(e.desviacion, 4)} unidad="" />
            <Resultado etiqueta="CV" valor={formatear(e.cv, 2)} unidad="%" />
            <Resultado etiqueta="n" valor={String(e.n)} unidad="" />
          </div>
          <Campo id="ref" etiqueta="Valor de referencia (opcional)" unidad="" valor={ref} onChange={setRef} />
          {r ? <Resultado etiqueta="% de error" valor={formatear(error, 2)} unidad="%" /> : null}
          <BotonCopiar texto={resumen} etiqueta="Copiar resultados" />
        </div>
      </div>
    </section>
  );
}
