import Link from "next/link";
import { EstadoPractica } from "@/components/layout/EstadoPractica";
import { PRACTICAS } from "@/data/practicas";
import { numero2 } from "@/lib/fechas";

export default function Inicio() {
  return (
    <>
      <div className="home-cab">
        <div>
          <div className="eyebrow">Gestión 2026 · 3.er año</div>
          <h1>Prácticas de laboratorio</h1>
          <p className="muted" style={{ marginTop: 4 }}>
            Elige una práctica para prepararte antes de entrar al laboratorio.
          </p>
        </div>
      </div>
      <div className="lista-practicas">
        {PRACTICAS.map((p) => (
          <article key={p.id} className="practica-card">
            <div className="practica-num">{numero2(p.numero)}</div>
            <div>
              <div className="eyebrow">{p.unidad}</div>
              <h3>{p.titulo}</h3>
              <p className="muted">{p.resumen}</p>
              <div className="row" style={{ gap: 8, marginTop: 8 }}>
                <EstadoPractica practica={p} />
                <span className="pill">⏱ {p.duracion}</span>
                <span className="pill">Riesgo {p.riesgo.toLowerCase()}</span>
              </div>
            </div>
            <Link href={`/practicas/${p.id}/inicio`} className={`btn ir ${p.estado === "borrador" ? "" : "primary"}`}>
              {p.estado === "borrador" ? "Ver" : "Iniciar práctica"}
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}
