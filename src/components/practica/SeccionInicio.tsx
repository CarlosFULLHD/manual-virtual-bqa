import { TextoGlosario } from "@/components/ui/TextoGlosario";
import { fechaLarga } from "@/lib/fechas";
import type { Practica } from "@/lib/types";

export function SeccionInicio({ p }: { p: Practica }) {
  return (
    <div className="stack">
      <div className="callout">
        <div className="eyebrow acento">En pocas palabras</div>
        <p style={{ marginTop: 4 }}>
          <TextoGlosario texto={p.queEs} />
        </p>
      </div>
      <div className="facts">
        <Dato k="Duración" v={p.duracion} />
        <Dato k="Trabajo" v={p.grupo} />
        <Dato k="Nivel de riesgo" v={p.riesgo} />
        <Dato k="Fecha" v={fechaLarga(p.fecha)} />
      </div>
      <div className="grid2">
        <div className="panel">
          <h3>Objetivos</h3>
          <Lista items={p.objetivos} vacio="Sin objetivos cargados." />
        </div>
        <div className="panel">
          <h3>Seguridad antes de empezar</h3>
          <Lista items={p.seguridad} vacio="Sin indicaciones cargadas." />
        </div>
      </div>
      <div className="panel">
        <h3>Fundamento teórico</h3>
        <p className="lectura" style={{ marginTop: 8 }}>
          {p.fundamento ? <TextoGlosario texto={p.fundamento} /> : <span className="muted">Sin fundamento cargado.</span>}
        </p>
      </div>
    </div>
  );
}

function Dato({ k, v }: { k: string; v: string }) {
  return (
    <div className="fact">
      <div className="k">{k}</div>
      <div className="v">{v}</div>
    </div>
  );
}

function Lista({ items, vacio }: { items: string[]; vacio: string }) {
  if (!items.length) return <p className="muted" style={{ marginTop: 8 }}>{vacio}</p>;
  return (
    <ul className="lista" style={{ marginTop: 8 }}>
      {items.map((o) => (
        <li key={o}>{o}</li>
      ))}
    </ul>
  );
}
