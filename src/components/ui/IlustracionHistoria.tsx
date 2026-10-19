import type { TarjetaHistoria } from "@/lib/types";

/** Ilustraciones para las tarjetas de "En 30 segundos" (viewBox 120×90) */
export function IlustracionHistoria({ tipo }: { tipo: TarjetaHistoria["icono"] }) {
  const matraz = (relleno: string) => (
    <>
      <path d="M50 10h20v20l20 38a4 4 0 0 1-3.6 5.8H33.6A4 4 0 0 1 30 68l20-38z" fill="var(--surface)" stroke="var(--vidrio)" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M38.5 52h43l8.3 16.5a2.5 2.5 0 0 1-2.2 3.6H32.4a2.5 2.5 0 0 1-2.2-3.6z" fill={relleno} />
    </>
  );
  let d: React.ReactNode;
  switch (tipo) {
    case "leche":
      d = matraz("var(--leche)");
      break;
    case "bacteria":
      d = (
        <>
          {matraz("var(--leche)")}
          {[
            [48, 62, 0],
            [66, 58, 40],
            [58, 67, -30],
            [74, 66, 15],
          ].map(([x, y, r], i) => (
            <g key={i} transform={`rotate(${r} ${x} ${y})`}>
              <rect x={x - 6} y={y - 2.5} width="12" height="5" rx="2.5" fill="var(--bacteria)" />
            </g>
          ))}
          <text x="92" y="30" fontSize="11" fill="var(--muted)" fontFamily="var(--mono)">
            ácido
          </text>
          <path d="M88 34 76 48" stroke="var(--muted)" strokeWidth="1.2" strokeDasharray="2 2" />
        </>
      );
      break;
    case "gota":
      d = (
        <>
          {matraz("var(--leche)")}
          <rect x="56" y="0" width="8" height="6" rx="1" fill="var(--vidrio)" />
          <path d="M60 14s5 5.5 5 9a5 5 0 0 1-10 0c0-3.5 5-9 5-9z" fill="var(--acento-suave)" stroke="var(--acento)" strokeWidth="1.6" />
          <text x="72" y="24" fontSize="11" fill="var(--muted)" fontFamily="var(--mono)">
            NaOH
          </text>
        </>
      );
      break;
    case "rosado":
      d = (
        <>
          {matraz("var(--rosa-palido)")}
          <path d="M94 16l3 6 6 1-4.5 4 1 6-5.5-3-5.5 3 1-6L85 23l6-1z" fill="var(--acento)" opacity=".8" />
        </>
      );
      break;
    case "matraz":
      d = matraz("var(--liquido)");
      break;
    case "sangre":
      d = (
        <>
          <rect x="22" y="14" width="76" height="52" rx="6" fill="var(--surface)" stroke="var(--vidrio)" strokeWidth="2.4" />
          {[40, 60, 80].map((x, i) => (
            <circle key={x} cx={x} cy="44" r="8" fill={i === 0 ? "var(--acento)" : "none"} stroke="var(--acento-medio)" strokeWidth="1.8" strokeDasharray={i === 0 ? undefined : "3 3"} />
          ))}
          <path d="M32 24h34M32 30h20" stroke="var(--vidrio)" strokeWidth="2" strokeLinecap="round" />
        </>
      );
      break;
    case "via":
      d = (
        <>
          {[0, 1, 2, 3].map((f) => (
            <g key={f}>
              {Array.from({ length: 8 - f * 2 }, (_, i) => (
                <circle key={i} cx={16 + i * 12} cy={14 + f * 17} r="4.5" fill={i >= 6 - f * 2 ? "var(--acento)" : "var(--acento-medio)"} />
              ))}
            </g>
          ))}
        </>
      );
      break;
    case "bloqueo":
      d = (
        <>
          {Array.from({ length: 6 }, (_, i) => (
            <circle key={i} cx={18 + i * 12} cy="26" r="5" fill="var(--acento-medio)" />
          ))}
          <path d="M90 14l16 24M106 14 90 38" stroke="var(--mal)" strokeWidth="4" strokeLinecap="round" />
          {Array.from({ length: 6 }, (_, i) => (
            <circle key={i} cx={18 + i * 12} cy="58" r="5" fill="var(--acento)" />
          ))}
          <rect x="88" y="50" width="22" height="16" rx="5" fill="var(--teal-soft)" stroke="var(--teal)" strokeWidth="1.6" />
          <path d="M60 34v14" stroke="var(--muted)" strokeWidth="1.6" strokeDasharray="2 3" />
        </>
      );
      break;
    case "huella":
      d = (
        <>
          {[10, 16, 58, 20, 12, 8].map((h, i) => (
            <rect key={i} x={16 + i * 16} y={72 - h} width="10" height={h} rx="2.5" fill={i === 2 ? "var(--acento)" : "var(--acento-medio)"} />
          ))}
          <path d="M10 73h100" stroke="var(--muted)" strokeWidth="1.6" />
          <path d="M10 52h100" stroke="var(--mal)" strokeWidth="1.2" strokeDasharray="4 3" />
        </>
      );
      break;
    case "idea":
    default:
      d = (
        <>
          <rect x="18" y="56" width="18" height="16" rx="3" fill="var(--acento-suave)" />
          <rect x="46" y="40" width="18" height="32" rx="3" fill="var(--acento-medio)" />
          <rect x="74" y="20" width="18" height="52" rx="3" fill="var(--acento)" />
          <path d="M14 76h86" stroke="var(--muted)" strokeWidth="1.6" />
        </>
      );
  }
  return (
    <svg viewBox="0 0 120 80" width="100%" aria-hidden="true" focusable="false" style={{ maxWidth: 160 }}>
      {d}
    </svg>
  );
}
