import type { Metadata } from "next";
import { Herramientas } from "@/components/herramientas/Herramientas";

export const metadata: Metadata = { title: "Herramientas" };

export default function PaginaHerramientas() {
  return (
    <div className="stack grande">
      <div>
        <div className="eyebrow">Herramientas</div>
        <h1>Calculadoras de laboratorio</h1>
        <p className="muted" style={{ marginTop: 4 }}>
          Los cálculos que se repiten en todas las prácticas, resueltos al instante.
        </p>
      </div>
      <Herramientas />
    </div>
  );
}
