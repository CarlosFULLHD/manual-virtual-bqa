import { Icono } from "@/components/ui/Icono";
import { Vacio } from "@/components/ui/Vacio";
import type { Practica } from "@/lib/types";
import { MapaVia } from "./MapaVia";

export function SeccionFundamento({ p }: { p: Practica }) {
  const c = p.caso;
  if (!c) return <Vacio />;
  return (
    <div className="stack grande">
      <div className="bloques-teoria">
        {c.introduccion.map((b) => (
          <section key={b.titulo} className="panel bloque-teoria">
            <span className="clave-icono">
              <Icono nombre={b.icono} tam={22} />
            </span>
            <h3>{b.titulo}</h3>
            <p className="bloque-teoria-texto">{b.texto}</p>
            {b.puntos && (
              <ul className="lista">
                {b.puntos.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <section className="panel">
        <div className="cab-seccion">
          <h2>La vía y dónde puede fallar</h2>
          <span className="muted pequeno">Toca cada enzima</span>
        </div>
        <MapaVia enzimas={c.enzimas} />
      </section>

      <section className="panel">
        <div className="cab-seccion">
          <h2>Cómo se nombran las acilcarnitinas</h2>
        </div>
        <div className="nomenclatura">
          <div>
            <span className="mono nomen-codigo">C8</span>
            <span>8 carbonos, saturada</span>
          </div>
          <div>
            <span className="mono nomen-codigo">C14:1</span>
            <span>14 carbonos y 1 doble enlace</span>
          </div>
          <div>
            <span className="mono nomen-codigo">C16-OH</span>
            <span>16 carbonos con un grupo hidroxilo</span>
          </div>
          <div>
            <span className="mono nomen-codigo">C5DC</span>
            <span>5 carbonos, dicarboxílica</span>
          </div>
        </div>
        <h3 style={{ margin: "18px 0 10px" }}>Marcadores que debes reconocer</h3>
        <div className="marcadores">
          {c.marcadores.map((m) => (
            <div key={m.codigo} className="marcador">
              <span className="mono marcador-codigo">{m.codigo}</span>
              <div>
                <b>{m.nombre}</b>
                <p className="muted pequeno">{m.significado}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
