"use client";

import { usePractica } from "@/context/ProgresoContext";
import { BotonCopiar } from "@/components/ui/Copiar";
import { Vacio } from "@/components/ui/Vacio";
import { ejecutarCalculo, formatear } from "@/lib/calculos";
import type { Practica } from "@/lib/types";

export function SeccionCalculos({ p }: { p: Practica }) {
  const { progreso } = usePractica(p.id);
  if (!p.calculo) return <Vacio mensaje="Esta práctica todavía no tiene cálculos configurados." />;

  const { calc, resultado: r, esEjemplo } = ejecutarCalculo(p.calculo, progreso.datos);

  const tablaTexto =
    `Repetición\t${calc.entradaNombre} (${calc.entradaUnidad})\t${r.unidad}\n` +
    r.filas.map((f, i) => `${i + 1}\t${formatear(f.entrada, 2)}\t${formatear(f.resultado, 3)}`).join("\n") +
    `\nPromedio\t\t${formatear(r.promedio, 3)}\nDesviación estándar\t\t${formatear(r.desviacion, 4)}\nCV (%)\t\t${formatear(r.cv, 1)}`;

  return (
    <div className="stack">
      {esEjemplo && (
        <div className="callout neutro">
          Todavía no anotaste datos en el procedimiento. Se muestran <b>valores de ejemplo</b> (
          {p.calculo.ejemplo.map((x) => formatear(x, 2)).join(" · ")} {calc.entradaUnidad}).
        </div>
      )}
      <div className="grid2">
        <section className="panel">
          <div className="eyebrow">Resultado</div>
          <div className="numero-grande">{formatear(r.promedio, 3)} %</div>
          <p className="muted">
            {r.unidad}
            {r.secundario && ` · ${formatear(r.secundario.valor, 1)} ${r.secundario.unidad}`}
          </p>
          <div className="facts" style={{ marginTop: 12 }}>
            <div className="fact">
              <div className="k">Desv. estándar</div>
              <div className="v mono">{formatear(r.desviacion, 4)}</div>
            </div>
            <div className="fact">
              <div className="k">CV</div>
              <div className="v mono">{formatear(r.cv, 1)} %</div>
            </div>
            <div className="fact">
              <div className="k">Repeticiones</div>
              <div className="v mono">{r.n}</div>
            </div>
          </div>
          {r.cv > 5 && (
            <p className="aviso" style={{ marginTop: 10 }}>
              ⚠ El CV es mayor a 5 %: las repeticiones no fueron parecidas. Revisa si hubo algún error.
            </p>
          )}
        </section>

        <section className="panel">
          <h3>Cómo se calculó</h3>
          <div className="formula" style={{ marginTop: 8 }}>
            {calc.formula}
          </div>
          <p className="muted pequeno" style={{ marginTop: 8 }}>
            {calc.leyenda(p.calculo.params)}
          </p>
          <div className="tabla-scroll" style={{ marginTop: 8 }}>
            <table className="tabla">
              <thead>
                <tr>
                  <th>Rep.</th>
                  <th className="num">
                    {calc.entradaNombre} ({calc.entradaUnidad})
                  </th>
                  <th className="num">Desarrollo</th>
                  <th className="num">%</th>
                </tr>
              </thead>
              <tbody>
                {r.filas.map((f, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td className="num">{formatear(f.entrada, 2)}</td>
                    <td className="num pequeno">{f.desarrollo}</td>
                    <td className="num">{formatear(f.resultado, 3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="panel">
        <h3>Tabla para el informe</h3>
        <p className="muted pequeno" style={{ margin: "4px 0 10px" }}>
          Cópiala y pégala en tu informe (Word o Excel).
        </p>
        <BotonCopiar texto={tablaTexto} etiqueta="Copiar tabla" />
      </section>
    </div>
  );
}
