import type { TablaInfo } from "@/lib/types";

/** Tabla informativa de la guía (grupos, colores de reacción, valores esperados…) */
export function TablaInfoVista({ tabla, sinTitulo = false }: { tabla: TablaInfo; sinTitulo?: boolean }) {
  return (
    <div className="tabla-info">
      {!sinTitulo && <h3>{tabla.titulo}</h3>}
      <div className="tabla-scroll">
        <table className="tabla">
          <thead>
            <tr>
              {tabla.columnas.map((c) => (
                <th key={c}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tabla.filas.map((f, i) => (
              <tr key={i}>
                {f.map((celda, j) => (j === 0 ? <th key={j} scope="row">{celda}</th> : <td key={j}>{celda}</td>))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {tabla.nota && <p className="muted pequeno" style={{ marginTop: 8 }}>{tabla.nota}</p>}
    </div>
  );
}
