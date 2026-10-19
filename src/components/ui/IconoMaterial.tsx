import type { TipoIconoMaterial } from "@/lib/types";

/** Dibujos simples de material de laboratorio (viewBox 64×64) */
export function IconoMaterial({ tipo = "generico", tam = 56 }: { tipo?: TipoIconoMaterial; tam?: number }) {
  const vidrio = { fill: "var(--vidrio-fondo)", stroke: "var(--vidrio)", strokeWidth: 2, strokeLinejoin: "round" as const };
  const liquido = { fill: "var(--liquido)" };
  let dibujo: React.ReactNode;
  switch (tipo) {
    case "bureta":
      dibujo = (
        <>
          <rect x="27" y="4" width="10" height="44" rx="2" {...vidrio} />
          <rect x="29" y="14" width="6" height="33" {...liquido} />
          {[12, 20, 28, 36, 44].map((y) => (
            <line key={y} x1="27" x2="32" y1={y} y2={y} stroke="var(--vidrio)" strokeWidth="1.2" />
          ))}
          <rect x="24" y="48" width="16" height="5" rx="1.5" fill="var(--ink)" />
          <path d="M31 53h2v6l-1 3-1-3z" fill="var(--vidrio)" />
        </>
      );
      break;
    case "soporte":
      dibujo = (
        <>
          <rect x="10" y="54" width="44" height="6" rx="2" fill="var(--muted)" />
          <rect x="18" y="4" width="4" height="52" rx="1" fill="var(--muted)" />
          <rect x="20" y="20" width="26" height="4" rx="2" fill="var(--muted)" />
          <circle cx="46" cy="22" r="4" fill="none" stroke="var(--muted)" strokeWidth="2.4" />
        </>
      );
      break;
    case "erlenmeyer":
      dibujo = (
        <>
          <path d="M25 6h14v18l14 30a3 3 0 0 1-2.7 4.3H13.7A3 3 0 0 1 11 54l14-30z" {...vidrio} />
          <path d="M17.5 42h29l5 11a2 2 0 0 1-1.8 2.9H14.3a2 2 0 0 1-1.8-2.9z" {...liquido} />
          <path d="M23 6h18" stroke="var(--vidrio)" strokeWidth="3" strokeLinecap="round" />
        </>
      );
      break;
    case "pipeta":
      dibujo = (
        <>
          <path d="M30 3h4v18l3 3v14l-3 3v18l-2 3-2-3V41l-3-3V24l3-3z" {...vidrio} />
          <path d="M28 30h8v7h-8z" {...liquido} />
          <line x1="28" x2="36" y1="14" y2="14" stroke="var(--acento)" strokeWidth="1.6" />
        </>
      );
      break;
    case "propipeta":
      dibujo = (
        <>
          <circle cx="32" cy="24" r="16" fill="var(--acento-suave)" stroke="var(--acento)" strokeWidth="2" />
          <path d="M28 40h8v14h-8z" fill="var(--acento-suave)" stroke="var(--acento)" strokeWidth="2" />
          <circle cx="32" cy="24" r="4" fill="var(--acento)" />
          <circle cx="22" cy="18" r="2.5" fill="var(--acento)" />
          <circle cx="42" cy="18" r="2.5" fill="var(--acento)" />
        </>
      );
      break;
    case "vaso":
      dibujo = (
        <>
          <path d="M14 8h36l-3 48a3 3 0 0 1-3 3H20a3 3 0 0 1-3-3z" {...vidrio} />
          <path d="M16.3 34h31.4l-1.6 22H18z" {...liquido} />
          <path d="M11 8h6" stroke="var(--vidrio)" strokeWidth="3" strokeLinecap="round" />
          {[18, 26].map((y) => (
            <line key={y} x1="40" x2="46" y1={y} y2={y} stroke="var(--vidrio)" strokeWidth="1.2" />
          ))}
        </>
      );
      break;
    case "embudo":
      dibujo = (
        <>
          <path d="M8 10h48L37 34v22l-10 4V34z" {...vidrio} />
        </>
      );
      break;
    case "piseta":
      dibujo = (
        <>
          <path d="M20 22h24v34a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4z" fill="var(--agua-suave)" stroke="var(--agua)" strokeWidth="2" />
          <rect x="26" y="15" width="12" height="7" rx="1.5" fill="var(--agua)" />
          <path d="M36 16 50 6" stroke="var(--agua)" strokeWidth="2.4" strokeLinecap="round" />
        </>
      );
      break;
    case "tubo":
      dibujo = (
        <>
          <path d="M26 6h12v44a6 6 0 0 1-12 0z" {...vidrio} />
          <path d="M26 32h12v18a6 6 0 0 1-12 0z" {...liquido} />
        </>
      );
      break;
    case "bano":
      dibujo = (
        <>
          <rect x="8" y="24" width="48" height="30" rx="4" fill="var(--agua-suave)" stroke="var(--agua)" strokeWidth="2" />
          <path d="M12 34c4-3 6 3 10 0s6 3 10 0 6 3 10 0 6 3 10 0" fill="none" stroke="var(--agua)" strokeWidth="1.8" />
          <rect x="26" y="12" width="8" height="30" rx="4" {...vidrio} />
          <path d="M18 8c-2 3 2 4 0 7M44 8c-2 3 2 4 0 7" fill="none" stroke="var(--muted)" strokeWidth="1.6" strokeLinecap="round" />
        </>
      );
      break;
    case "espectro":
      dibujo = (
        <>
          <rect x="6" y="20" width="52" height="32" rx="5" fill="var(--vidrio-fondo)" stroke="var(--muted)" strokeWidth="2" />
          <rect x="12" y="26" width="22" height="12" rx="2" fill="var(--ink)" />
          <path d="M15 34l4-4 4 3 5-5 3 3" fill="none" stroke="var(--acento-medio)" strokeWidth="1.6" />
          <rect x="42" y="12" width="10" height="16" rx="2" {...vidrio} />
          <circle cx="16" cy="45" r="2.5" fill="var(--acento)" />
          <circle cx="25" cy="45" r="2.5" fill="var(--muted)" />
        </>
      );
      break;
    case "centrifuga":
      dibujo = (
        <>
          <rect x="8" y="26" width="48" height="30" rx="6" fill="var(--vidrio-fondo)" stroke="var(--muted)" strokeWidth="2" />
          <ellipse cx="32" cy="26" rx="24" ry="9" fill="var(--surface)" stroke="var(--muted)" strokeWidth="2" />
          <circle cx="32" cy="26" r="3" fill="var(--muted)" />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <circle key={a} cx={32 + 15 * Math.cos((a * Math.PI) / 180)} cy={26 + 5.5 * Math.sin((a * Math.PI) / 180)} r="2.2" fill="var(--acento)" />
          ))}
        </>
      );
      break;
    case "balanza":
      dibujo = (
        <>
          <rect x="10" y="40" width="44" height="16" rx="4" fill="var(--vidrio-fondo)" stroke="var(--muted)" strokeWidth="2" />
          <rect x="20" y="45" width="24" height="7" rx="1.5" fill="var(--ink)" />
          <rect x="30" y="30" width="4" height="10" fill="var(--muted)" />
          <ellipse cx="32" cy="29" rx="18" ry="4" fill="var(--surface)" stroke="var(--muted)" strokeWidth="2" />
          <path d="M26 24h12l-2-8h-8z" fill="var(--liquido)" stroke="var(--vidrio)" strokeWidth="1.6" />
        </>
      );
      break;
    case "cronometro":
      dibujo = (
        <>
          <circle cx="32" cy="36" r="20" fill="var(--surface)" stroke="var(--muted)" strokeWidth="2.4" />
          <path d="M32 36V24M32 36l8 5" stroke="var(--acento)" strokeWidth="2.4" strokeLinecap="round" />
          <rect x="28" y="8" width="8" height="6" rx="2" fill="var(--muted)" />
        </>
      );
      break;
    case "agitador":
      dibujo = (
        <>
          <rect x="10" y="42" width="44" height="14" rx="4" fill="var(--vidrio-fondo)" stroke="var(--muted)" strokeWidth="2" />
          <circle cx="44" cy="49" r="3" fill="var(--acento)" />
          <path d="M20 16h24l-2 26H22z" {...vidrio} />
          <path d="M22.6 30h18.8l-1 12H23.6z" {...liquido} />
          <path d="M27 37c2-3 8-3 10 0" fill="none" stroke="var(--agua)" strokeWidth="1.8" strokeLinecap="round" />
        </>
      );
      break;
    case "columna":
      dibujo = (
        <>
          <rect x="26" y="4" width="12" height="42" rx="2" {...vidrio} />
          <rect x="28" y="22" width="8" height="22" fill="var(--acento-medio)" />
          <rect x="28" y="10" width="8" height="12" {...liquido} />
          <rect x="24" y="46" width="16" height="5" rx="1.5" fill="var(--ink)" />
          <path d="M31 51h2v8l-1 2-1-2z" fill="var(--vidrio)" />
        </>
      );
      break;
    case "mortero":
      dibujo = (
        <>
          <path d="M10 28h44c0 16-9 26-22 26S10 44 10 28z" fill="var(--vidrio-fondo)" stroke="var(--muted)" strokeWidth="2.2" />
          <path d="M40 8l6 4-14 24-5-3z" fill="var(--surface)" stroke="var(--muted)" strokeWidth="2" strokeLinejoin="round" />
          <rect x="22" y="54" width="20" height="4" rx="2" fill="var(--muted)" />
        </>
      );
      break;
    case "gradilla":
      dibujo = (
        <>
          <rect x="6" y="24" width="52" height="5" rx="2" fill="var(--muted)" />
          <rect x="6" y="50" width="52" height="5" rx="2" fill="var(--muted)" />
          {[14, 28, 42].map((x) => (
            <g key={x}>
              <path d={`M${x} 10h8v36a4 4 0 0 1-8 0z`} {...vidrio} />
              <path d={`M${x} 32h8v14a4 4 0 0 1-8 0z`} {...liquido} />
            </g>
          ))}
        </>
      );
      break;
    case "termometro":
      dibujo = (
        <>
          <rect x="28" y="6" width="8" height="38" rx="4" {...vidrio} />
          <circle cx="32" cy="50" r="8" fill="var(--acento)" />
          <rect x="30.5" y="22" width="3" height="26" fill="var(--acento)" />
          {[14, 20, 26].map((y) => (
            <line key={y} x1="36" x2="40" y1={y} y2={y} stroke="var(--vidrio)" strokeWidth="1.4" />
          ))}
        </>
      );
      break;
    default:
      dibujo = <circle cx="32" cy="32" r="18" {...vidrio} />;
  }
  return (
    <svg width={tam} height={tam} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      {dibujo}
    </svg>
  );
}
