/**
 * Dibujo del montaje de titulación: soporte universal, bureta y Erlenmeyer.
 * `liquido` permite cambiar el color del contenido del matraz (lo usa el simulador).
 */
export function MontajeTitulacion({
  liquido = "var(--leche)",
  compacto = false,
  sinEtiquetas = false,
  nivelBureta = 1,
}: {
  liquido?: string;
  compacto?: boolean;
  sinEtiquetas?: boolean;
  /** Fracción de la bureta llena (0-1) */
  nivelBureta?: number;
}) {
  const alto = 148 * Math.max(0, Math.min(1, nivelBureta));
  return (
    <svg
      viewBox={compacto ? "60 0 150 290" : "0 0 360 300"}
      width={compacto ? 130 : 340}
      style={{ maxWidth: "100%", display: "block", margin: "auto" }}
      role="img"
      aria-label="Soporte universal con bureta sobre un matraz Erlenmeyer"
    >
      <rect x="40" y="276" width="170" height="10" rx="2" fill="var(--muted)" />
      <rect x="60" y="20" width="6" height="258" fill="var(--muted)" />
      <rect x="62" y="96" width="70" height="6" rx="2" fill="var(--muted)" />
      <rect x="124" y="20" width="16" height="170" rx="3" fill="var(--surface)" stroke="var(--vidrio)" strokeWidth="2" />
      <rect x="127" y={188 - alto} width="10" height={alto} fill="var(--accent-soft)" opacity={0.9} style={{ transition: "all .3s" }} />
      {Array.from({ length: 14 }, (_, i) => (
        <line key={i} x1="124" x2={i % 5 === 0 ? 133 : 130} y1={40 + i * 10} y2={40 + i * 10} stroke="var(--vidrio)" strokeWidth="1" />
      ))}
      <rect x="120" y="190" width="24" height="7" rx="2" fill="var(--ink)" />
      <path d="M130 197h4v16l-2 5-2-5z" fill="var(--vidrio)" />
      <path d="M120 222h24v18l22 34H98l22-34z" fill="var(--surface)" stroke="var(--vidrio)" strokeWidth="2" />
      <path d="M109 257h46l11 17H98z" fill={liquido} style={{ transition: "fill .3s" }} />
      {!compacto && !sinEtiquetas && (
        <g fontSize="12" fill="var(--ink)">
          <line x1="142" y1="70" x2="200" y2="70" stroke="var(--muted)" />
          <text x="204" y="74">Bureta (NaOH 0,1 N)</text>
          <line x1="132" y1="99" x2="200" y2="112" stroke="var(--muted)" />
          <text x="204" y="116">Pinza para bureta</text>
          <line x1="140" y1="194" x2="200" y2="170" stroke="var(--muted)" />
          <text x="204" y="174">Llave de goteo</text>
          <line x1="160" y1="262" x2="200" y2="238" stroke="var(--muted)" />
          <text x="204" y="236">Erlenmeyer con leche</text>
          <text x="204" y="250" fill="var(--muted)">+ fenolftaleína</text>
          <line x1="66" y1="50" x2="20" y2="40" stroke="var(--muted)" />
          <text x="4" y="34">Soporte</text>
        </g>
      )}
    </svg>
  );
}
