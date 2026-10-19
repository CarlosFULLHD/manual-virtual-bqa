"use client";

import { formatear, parseNumero, regresionLineal } from "@/lib/calculos";

/** Campo numérico ligado a un dato guardado de la práctica */
export function CampoDato({ id, etiqueta, unidad, valor, onChange, ejemplo, ancho }: { id: string; etiqueta?: string; unidad?: string; valor: string; onChange: (v: string) => void; ejemplo?: string; ancho?: number }) {
  return (
    <label className="entrada" htmlFor={id}>
      {etiqueta && <span>{etiqueta}</span>}
      <span className="entrada-caja">
        <input id={id} inputMode="decimal" value={valor} placeholder={ejemplo} onChange={(e) => onChange(e.target.value)} style={ancho ? { width: ancho } : undefined} aria-label={etiqueta ?? id} />
        {unidad && <span className="entrada-unidad">{unidad}</span>}
      </span>
    </label>
  );
}

export const num = (s: string | undefined) => parseNumero(s) ?? NaN;

export interface Recta {
  pendiente: number;
  intercepto: number;
  r2: number;
  valida: boolean;
}

/** Ajuste lineal de los puntos que tengan dato */
export function ajustar(xs: number[], ys: number[]): Recta {
  const pares = xs.map((x, i) => [x, ys[i]] as const).filter(([, y]) => Number.isFinite(y));
  if (pares.length < 2) return { pendiente: NaN, intercepto: NaN, r2: NaN, valida: false };
  const r = regresionLineal(pares.map((p) => p[0]), pares.map((p) => p[1]));
  return { pendiente: r.pendiente, intercepto: r.intercepto, r2: r.r2, valida: Number.isFinite(r.pendiente) && r.pendiente !== 0 };
}

/** Gráfico de puntos con su recta de ajuste (y series extra opcionales) */
export function GraficoRecta({
  series,
  recta,
  ejeX,
  ejeY,
  marcas = [],
}: {
  series: { nombre: string; puntos: { x: number; y: number }[]; color: string }[];
  recta?: Recta;
  ejeX: string;
  ejeY: string;
  marcas?: { x: number; y: number; etiqueta: string }[];
}) {
  const W = 560, H = 280, m = { t: 16, r: 20, b: 44, l: 56 };
  const todos = [...series.flatMap((s) => s.puntos), ...marcas].filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y));
  if (!todos.length) return <div className="vacio">Anota tus datos para ver el gráfico.</div>;
  const xmax = Math.max(...todos.map((p) => p.x)) * 1.08 || 1;
  const ymax = Math.max(...todos.map((p) => p.y)) * 1.15 || 1;
  const X = (x: number) => m.l + (x / xmax) * (W - m.l - m.r);
  const Y = (y: number) => H - m.b - (Math.max(0, y) / ymax) * (H - m.t - m.b);
  const ticks = [0, 0.25, 0.5, 0.75, 1];
  return (
    <div className="grafico-scroll">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={`${ejeY} frente a ${ejeX}`}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={m.l} x2={W - m.r} y1={Y(ymax * t)} y2={Y(ymax * t)} stroke="var(--line)" strokeDasharray={t ? "3 4" : undefined} />
            <text x={m.l - 8} y={Y(ymax * t) + 4} textAnchor="end" fontSize="11" fill="var(--muted)" fontFamily="var(--mono)">
              {formatear(ymax * t, ymax < 2 ? 2 : 1)}
            </text>
            <text x={X(xmax * t)} y={H - m.b + 16} textAnchor="middle" fontSize="11" fill="var(--muted)" fontFamily="var(--mono)">
              {formatear(xmax * t, xmax < 10 ? 1 : 0)}
            </text>
          </g>
        ))}
        <text x={(W + m.l - m.r) / 2} y={H - 6} textAnchor="middle" fontSize="12" fill="var(--muted)">
          {ejeX}
        </text>
        <text x={14} y={(H - m.b + m.t) / 2} textAnchor="middle" fontSize="12" fill="var(--muted)" transform={`rotate(-90 14 ${(H - m.b + m.t) / 2})`}>
          {ejeY}
        </text>
        {recta?.valida && (
          <line x1={X(0)} y1={Y(recta.intercepto)} x2={X(xmax)} y2={Y(recta.intercepto + recta.pendiente * xmax)} stroke="var(--teal)" strokeWidth="2" />
        )}
        {series.map((s) => (
          <g key={s.nombre}>
            {s.puntos.filter((p) => Number.isFinite(p.y)).length > 1 && !recta && (
              <polyline fill="none" stroke={s.color} strokeWidth="2" points={s.puntos.filter((p) => Number.isFinite(p.y)).map((p) => `${X(p.x)},${Y(p.y)}`).join(" ")} />
            )}
            {s.puntos.filter((p) => Number.isFinite(p.y)).map((p, i) => (
              <circle key={i} cx={X(p.x)} cy={Y(p.y)} r="5.5" fill={s.color} stroke="var(--surface)" strokeWidth="2" />
            ))}
          </g>
        ))}
        {marcas.filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y)).map((p) => (
          <g key={p.etiqueta}>
            <line x1={X(p.x)} y1={Y(p.y)} x2={X(p.x)} y2={Y(0)} stroke="var(--accent)" strokeDasharray="3 3" />
            <rect x={X(p.x) - 5} y={Y(p.y) - 5} width="10" height="10" fill="var(--accent)" transform={`rotate(45 ${X(p.x)} ${Y(p.y)})`} />
            <text x={X(p.x) + 9} y={Y(p.y) - 8} fontSize="11.5" fill="var(--accent-ink)" fontWeight="600">
              {p.etiqueta}
            </text>
          </g>
        ))}
      </svg>
      <div className="leyenda">
        {series.map((s) => (
          <span key={s.nombre}>
            <i style={{ background: s.color }} /> {s.nombre}
          </span>
        ))}
        {recta?.valida && (
          <span>
            <i style={{ background: "var(--teal)", height: 3 }} /> Recta de ajuste
          </span>
        )}
      </div>
    </div>
  );
}

/** Tarjeta con la ecuación de la recta y su R² */
export function TarjetaRecta({ recta, x, y, minimoR2 }: { recta: Recta; x: string; y: string; minimoR2?: number }) {
  if (!recta.valida) return <div className="callout neutro">Se necesitan al menos dos puntos para calcular la recta.</div>;
  const ok = minimoR2 === undefined || recta.r2 >= minimoR2;
  return (
    <div className="recta">
      <div>
        <span className="eyebrow">Ecuación de la recta</span>
        <span className="mono recta-eq">
          {y} = {formatear(recta.pendiente, 4)} · {x} {recta.intercepto >= 0 ? "+" : "−"} {formatear(Math.abs(recta.intercepto), 4)}
        </span>
      </div>
      <div>
        <span className="eyebrow">R²</span>
        <span className="mono recta-eq">{formatear(recta.r2, 4)}</span>
        {minimoR2 !== undefined && <span className={`pill ${ok ? "ok" : "warn"}`}>{ok ? `Lineal (≥ ${formatear(minimoR2, 2)})` : `Menor a ${formatear(minimoR2, 2)}: revisa los puntos`}</span>}
      </div>
    </div>
  );
}

/** Tabla editable de texto libre (observaciones, comparación entre grupos) */
export function TablaEditable({
  id,
  columnas,
  filas,
  valores,
  onChange,
}: {
  id: string;
  columnas: string[];
  filas: string[];
  valores: Record<string, string>;
  onChange: (clave: string, v: string) => void;
}) {
  return (
    <div className="tabla-scroll">
      <table className="tabla tabla-editable">
        <thead>
          <tr>
            {columnas.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((f, i) => (
            <tr key={f}>
              <th scope="row">{f}</th>
              {columnas.slice(1).map((c, j) => {
                const clave = `${id}.${i}.${j}`;
                return (
                  <td key={c}>
                    <input value={valores[clave] ?? ""} onChange={(e) => onChange(clave, e.target.value)} aria-label={`${f}: ${c}`} />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
