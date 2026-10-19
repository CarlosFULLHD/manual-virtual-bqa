/** Anillo de progreso circular */
export function Anillo({ valor, tam = 56, grosor = 6, etiqueta }: { valor: number; tam?: number; grosor?: number; etiqueta?: string }) {
  const r = (tam - grosor) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(100, valor));
  return (
    <div className="anillo" style={{ width: tam, height: tam }} role="img" aria-label={`${v}% completado`}>
      <svg width={tam} height={tam} viewBox={`0 0 ${tam} ${tam}`} aria-hidden="true">
        <circle cx={tam / 2} cy={tam / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={grosor} />
        <circle
          cx={tam / 2}
          cy={tam / 2}
          r={r}
          fill="none"
          stroke={v === 100 ? "var(--ok)" : "var(--accent)"}
          strokeWidth={grosor}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - v / 100)}
          transform={`rotate(-90 ${tam / 2} ${tam / 2})`}
          style={{ transition: "stroke-dashoffset .6s ease" }}
        />
      </svg>
      <span className="anillo-num">{etiqueta ?? `${v}%`}</span>
    </div>
  );
}
