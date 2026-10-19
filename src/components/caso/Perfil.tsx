import { formatear } from "@/lib/calculos";
import type { Analito, RatioCaso } from "@/lib/types";

/**
 * Perfil de acilcarnitinas: cada fila muestra el valor, la referencia y
 * una barra con cuántas veces supera (o no alcanza) el valor de corte.
 */
export function Perfil({ analitos, ratios, resaltarClave = false }: { analitos: Analito[]; ratios?: RatioCaso[]; resaltarClave?: boolean }) {
  return (
    <div className="stack">
      <div className="tabla-scroll">
        <table className="perfil">
          <thead>
            <tr>
              <th>Acilcarnitina</th>
              <th className="num">Valor (µmol/L)</th>
              <th className="num">Referencia</th>
              <th>Respecto al corte</th>
            </tr>
          </thead>
          <tbody>
            {analitos.map((a) => {
              const veces = a.valor / a.corte;
              const anormal = a.bajo ? veces < 1 : veces > 1;
              // escala logarítmica: 1× = 25 % de la barra, 20× = 100 %
              const ancho = a.bajo ? Math.max(6, Math.min(100, veces * 100)) : Math.max(6, Math.min(100, 25 + (Math.log10(Math.max(veces, 0.2)) / Math.log10(20)) * 75));
              return (
                <tr key={a.nombre} className={resaltarClave && a.clave ? "fila-clave" : undefined}>
                  <td>
                    {a.nombre}
                    {resaltarClave && a.clave && <span className="pill accent" style={{ marginLeft: 6 }}>marcador clave</span>}
                  </td>
                  <td className="num">
                    <b>{formatear(a.valor, a.valor >= 5 ? 0 : 2)}</b>
                  </td>
                  <td className="num muted">{a.referencia}</td>
                  <td>
                    <div className={`perfil-barra ${a.bajo ? "bajo" : ""}`}>
                      <div className={anormal ? "anormal" : "normal"} style={{ width: `${ancho}%` }} />
                      {!a.bajo && <span className="perfil-corte" aria-hidden="true" />}
                    </div>
                    <span className={`perfil-veces ${anormal ? "anormal" : ""}`}>
                      {anormal ? (a.bajo ? `${formatear(veces * 100, 0)} % del mínimo` : `${formatear(veces, 1)}× el corte`) : "normal"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {ratios && ratios.length > 0 && (
        <div className="ratios">
          {ratios.map((r) => (
            <div key={r.nombre} className="ratio">
              <span className="eyebrow">{r.nombre}</span>
              <span className="mono ratio-valor">{r.valor}</span>
              <span className="muted pequeno">
                corte {r.corte} · {r.nota}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
