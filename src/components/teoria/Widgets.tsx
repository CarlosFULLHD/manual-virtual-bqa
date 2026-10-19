"use client";

import { useState } from "react";
import { formatear, parseNumero } from "@/lib/calculos";
import type { Leccion } from "@/lib/types";

/** Mini calculadoras para "jugar" con la fórmula de cada lección */
export function Widget({ tipo }: { tipo: NonNullable<Leccion["widget"]> }) {
  switch (tipo) {
    case "dilucion":
      return <WDilucion />;
    case "seriada":
      return <WSeriada />;
    case "molar":
      return <WMolar />;
    case "concentrado":
      return <WConcentrado />;
    case "normalidad":
      return <WNormalidad />;
    case "mezcla":
      return <WMezcla />;
    case "buffer":
      return <WBuffer />;
    case "unidades":
      return <WUnidades />;
  }
}

function Campo({ id, etiqueta, unidad, valor, onChange }: { id: string; etiqueta: string; unidad?: string; valor: string; onChange: (v: string) => void }) {
  return (
    <label className="entrada" htmlFor={id}>
      <span>{etiqueta}</span>
      <span className="entrada-caja">
        <input id={id} inputMode="decimal" value={valor} onChange={(e) => onChange(e.target.value)} />
        {unidad && <span className="entrada-unidad">{unidad}</span>}
      </span>
    </label>
  );
}

function Salida({ etiqueta, valor, unidad }: { etiqueta: string; valor: string; unidad?: string }) {
  return (
    <div className="w-salida">
      <span className="eyebrow">{etiqueta}</span>
      <span className="mono w-numero">
        {valor} {unidad && <span>{unidad}</span>}
      </span>
    </div>
  );
}

const num = (s: string) => parseNumero(s) ?? NaN;

function WDilucion() {
  const [c1, setC1] = useState("800");
  const [v1, setV1] = useState("50");
  const [v2, setV2] = useState("250");
  const c2 = (num(c1) * num(v1)) / num(v2);
  const fd = num(v2) / num(v1);
  const intensidad = Math.max(0.08, Math.min(1, 1 / (fd || 1)));
  return (
    <div className="widget">
      <div className="entradas">
        <Campo id="w-c1" etiqueta="C₁ (concentrada)" valor={c1} onChange={setC1} />
        <Campo id="w-v1" etiqueta="V₁ que tomo" unidad="mL" valor={v1} onChange={setV1} />
        <Campo id="w-v2" etiqueta="V₂ final" unidad="mL" valor={v2} onChange={setV2} />
      </div>
      <div className="w-vasos" aria-hidden="true">
        <div className="w-vaso">
          <div style={{ height: "45%", background: "var(--accent)" }} />
        </div>
        <span className="w-flecha">→ × 1/{formatear(fd, 1)}</span>
        <div className="w-vaso ancho">
          <div style={{ height: "85%", background: "var(--accent)", opacity: intensidad }} />
        </div>
      </div>
      <div className="w-salidas">
        <Salida etiqueta="C₂ (final)" valor={formatear(c2, 3)} />
        <Salida etiqueta="Factor de dilución" valor={formatear(fd, 2)} unidad="veces" />
        <Salida etiqueta="Diluyente" valor={formatear(num(v2) - num(v1), 1)} unidad="mL" />
      </div>
    </div>
  );
}

function WSeriada() {
  const [c0, setC0] = useState("5");
  const [vt, setVt] = useState("2");
  const [vd, setVd] = useState("2");
  const [tubos, setTubos] = useState(6);
  const factor = (num(vt) + num(vd)) / num(vt);
  const lista = Array.from({ length: tubos }, (_, i) => num(c0) / Math.pow(factor, i + 1));
  return (
    <div className="widget">
      <div className="entradas">
        <Campo id="w-c0" etiqueta="Concentración inicial" valor={c0} onChange={setC0} />
        <Campo id="w-vt" etiqueta="Volumen que paso" unidad="mL" valor={vt} onChange={setVt} />
        <Campo id="w-vd" etiqueta="Diluyente por tubo" unidad="mL" valor={vd} onChange={setVd} />
        <label className="entrada" htmlFor="w-tubos">
          <span>Tubos: {tubos}</span>
          <input id="w-tubos" type="range" min={2} max={8} value={tubos} onChange={(e) => setTubos(Number(e.target.value))} />
        </label>
      </div>
      <div className="w-tubos">
        {lista.map((c, i) => (
          <div key={i} className="w-tubo">
            <div className="w-tubo-vidrio">
              <div style={{ opacity: Math.max(0.06, 1 / Math.pow(factor || 1, i + 1)) }} />
            </div>
            <span className="mono">1/{formatear(Math.pow(factor, i + 1), 0)}</span>
            <span className="mono muted">{formatear(c, c < 0.1 ? 4 : 2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WMolar() {
  const [M, setM] = useState("0.05");
  const [v, setV] = useState("500");
  const [pm, setPm] = useState("40");
  const g = num(M) * (num(v) / 1000) * num(pm);
  return (
    <div className="widget">
      <div className="entradas">
        <Campo id="w-m" etiqueta="Molaridad" unidad="mol/L" valor={M} onChange={setM} />
        <Campo id="w-v" etiqueta="Volumen" unidad="mL" valor={v} onChange={setV} />
        <Campo id="w-pm" etiqueta="Peso molecular" unidad="g/mol" valor={pm} onChange={setPm} />
      </div>
      <div className="w-salidas">
        <Salida etiqueta="Hay que pesar" valor={formatear(g, 3)} unidad="g" />
        <Salida etiqueta="Moles" valor={formatear(num(M) * (num(v) / 1000), 4)} unidad="mol" />
      </div>
    </div>
  );
}

function WConcentrado() {
  const [d, setD] = useState("1.40");
  const [p, setP] = useState("65");
  const [pm, setPm] = useState("63");
  const [eq, setEq] = useState("1");
  const M = (num(d) * 1000 * (num(p) / 100)) / num(pm);
  return (
    <div className="widget">
      <div className="entradas">
        <Campo id="w-d" etiqueta="Densidad" unidad="g/mL" valor={d} onChange={setD} />
        <Campo id="w-p" etiqueta="Pureza" unidad="% p/p" valor={p} onChange={setP} />
        <Campo id="w-pm2" etiqueta="Peso molecular" unidad="g/mol" valor={pm} onChange={setPm} />
        <Campo id="w-eq" etiqueta="H⁺ por molécula" valor={eq} onChange={setEq} />
      </div>
      <div className="w-salidas">
        <Salida etiqueta="Gramos de ácido por litro" valor={formatear(num(d) * 1000 * (num(p) / 100), 0)} unidad="g" />
        <Salida etiqueta="Molaridad" valor={formatear(M, 2)} unidad="M" />
        <Salida etiqueta="Normalidad" valor={formatear(M * num(eq), 2)} unidad="N" />
      </div>
    </div>
  );
}

function WNormalidad() {
  const [M, setM] = useState("2");
  const [eq, setEq] = useState(6);
  const ejemplos = [
    { t: "HCl", e: 1 },
    { t: "H₂SO₄", e: 2 },
    { t: "H₃PO₄", e: 3 },
    { t: "KMnO₄ (→Mn²⁺)", e: 5 },
    { t: "K₂Cr₂O₇ (→Cr³⁺)", e: 6 },
  ];
  return (
    <div className="widget">
      <div className="chips-opciones" style={{ marginTop: 0 }}>
        {ejemplos.map((x) => (
          <button key={x.t} className={`chip ${eq === x.e ? "activo" : ""}`} aria-pressed={eq === x.e} onClick={() => setEq(x.e)}>
            {x.t} · {x.e} eq
          </button>
        ))}
      </div>
      <div className="entradas">
        <Campo id="w-mn" etiqueta="Molaridad" unidad="M" valor={M} onChange={setM} />
      </div>
      <div className="w-salidas">
        <Salida etiqueta="Equivalentes por mol" valor={String(eq)} />
        <Salida etiqueta="Normalidad" valor={formatear(num(M) * eq, 2)} unidad="N" />
      </div>
    </div>
  );
}

function WMezcla() {
  const [c1, setC1] = useState("10");
  const [v1, setV1] = useState("200");
  const [c2, setC2] = useState("30");
  const [v2, setV2] = useState("400");
  const [agua, setAgua] = useState("600");
  const vt = num(v1) + num(v2) + (parseNumero(agua) ?? 0);
  const cf = (num(c1) * num(v1) + num(c2) * num(v2)) / vt;
  return (
    <div className="widget">
      <div className="entradas">
        <Campo id="w-mc1" etiqueta="Solución 1: C" valor={c1} onChange={setC1} />
        <Campo id="w-mv1" etiqueta="Solución 1: V" unidad="mL" valor={v1} onChange={setV1} />
        <Campo id="w-mc2" etiqueta="Solución 2: C" valor={c2} onChange={setC2} />
        <Campo id="w-mv2" etiqueta="Solución 2: V" unidad="mL" valor={v2} onChange={setV2} />
        <Campo id="w-ma" etiqueta="Agua agregada" unidad="mL" valor={agua} onChange={setAgua} />
      </div>
      <div className="w-salidas">
        <Salida etiqueta="Volumen total" valor={formatear(vt, 0)} unidad="mL" />
        <Salida etiqueta="Concentración final" valor={formatear(cf, 2)} />
      </div>
    </div>
  );
}

const SISTEMAS = [
  { nombre: "Acetato", pKa: 4.76 },
  { nombre: "Fosfato", pKa: 7.2 },
  { nombre: "Tris", pKa: 8.06 },
  { nombre: "Carbonato", pKa: 10.33 },
];

function WBuffer() {
  const [sis, setSis] = useState(1);
  const [pH, setPH] = useState(7.0);
  const pKa = SISTEMAS[sis].pKa;
  const r = Math.pow(10, pH - pKa);
  const base = (r / (1 + r)) * 100;
  const enRango = Math.abs(pH - pKa) <= 1;
  return (
    <div className="widget">
      <div className="chips-opciones" style={{ marginTop: 0 }}>
        {SISTEMAS.map((s, i) => (
          <button
            key={s.nombre}
            className={`chip ${i === sis ? "activo" : ""}`}
            aria-pressed={i === sis}
            onClick={() => {
              setSis(i);
              setPH(s.pKa);
            }}
          >
            {s.nombre} · pKa {formatear(s.pKa, 2)}
          </button>
        ))}
      </div>
      <label className="entrada" htmlFor="w-ph" style={{ width: "100%" }}>
        <span>
          pH deseado: <b className="mono">{formatear(pH, 2)}</b>
        </span>
        <input id="w-ph" type="range" min={pKa - 2} max={pKa + 2} step={0.05} value={pH} onChange={(e) => setPH(Number(e.target.value))} />
      </label>
      <div className="w-razon" role="img" aria-label={`${formatear(100 - base, 0)} % ácido y ${formatear(base, 0)} % base`}>
        <div className="w-acido" style={{ width: `${100 - base}%` }}>
          {100 - base > 12 && <span>Ácido {formatear(100 - base, 0)} %</span>}
        </div>
        <div className="w-base" style={{ width: `${base}%` }}>
          {base > 12 && <span>Base {formatear(base, 0)} %</span>}
        </div>
      </div>
      <div className="w-salidas">
        <Salida etiqueta="[base] / [ácido]" valor={formatear(r, 3)} />
        <Salida etiqueta="Para 100 mL (misma conc.)" valor={`${formatear(100 - base, 1)} + ${formatear(base, 1)}`} unidad="mL" />
      </div>
      <p className={enRango ? "muted pequeno" : "aviso"}>
        {enRango ? "Dentro del intervalo útil (pKa ± 1)." : "Fuera del intervalo útil (pKa ± 1): este sistema amortigua mal a ese pH."}
      </p>
    </div>
  );
}

function WUnidades() {
  const [pct, setPct] = useState("0.9");
  const [pm, setPm] = useState("58.44");
  const gL = num(pct) * 10;
  const M = gL / num(pm);
  return (
    <div className="widget">
      <div className="entradas">
        <Campo id="w-pct" etiqueta="Concentración" unidad="% p/v" valor={pct} onChange={setPct} />
        <Campo id="w-upm" etiqueta="Peso molecular" unidad="g/mol" valor={pm} onChange={setPm} />
      </div>
      <div className="w-salidas">
        <Salida etiqueta="g/L" valor={formatear(gL, 3)} />
        <Salida etiqueta="mg/L (ppm)" valor={formatear(gL * 1000, 0)} />
        <Salida etiqueta="Molaridad" valor={formatear(M, 4)} unidad="M" />
        <Salida etiqueta="mmol/L" valor={formatear(M * 1000, 1)} />
      </div>
    </div>
  );
}
