import { DiagramaFlujo } from "@/components/esquemas/DiagramaFlujo";
import { Montaje } from "@/components/esquemas";
import { Vacio } from "@/components/ui/Vacio";
import type { Practica } from "@/lib/types";

export function SeccionEsquema({ p }: { p: Practica }) {
  if (!p.pasos.length && !p.esquema) return <Vacio />;
  const e = p.esquema;
  return (
    <div className="stack">
      <div className="grid2">
        <section className="panel">
          <h3>Diagrama de flujo</h3>
          <p className="muted pequeno" style={{ margin: "4px 0 14px" }}>
            Se arma solo a partir de los pasos del procedimiento.
          </p>
          <DiagramaFlujo pasos={p.pasos} decision={e?.decision} cierre={e?.cierre} />
        </section>
        {e?.montaje && (
          <section className="panel">
            <h3>Montaje del equipo</h3>
            <p className="muted pequeno" style={{ margin: "4px 0 8px" }}>
              Cómo debe quedar armado en la mesa.
            </p>
            <div className="svg-scroll">
              <Montaje tipo={e.montaje} />
            </div>
          </section>
        )}
      </div>
      {e?.reaccion && (
        <section className="panel">
          <h3>Reacción química</h3>
          <div className="ecuacion" style={{ marginTop: 10 }}>
            {e.reaccion}
          </div>
          <p className="muted" style={{ marginTop: 8 }}>
            En palabras: {e.reaccionTexto}. {e.reaccionExplicacion}
          </p>
        </section>
      )}
    </div>
  );
}
