import type { SVGProps } from "react";

/** Iconos de línea (24×24). Heredan el color del texto. */
const P: Record<string, React.ReactNode> = {
  inicio: <path d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z" />,
  matraz: (
    <>
      <path d="M9 3h6M10 3v6l-5.5 9.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3" />
      <path d="M7.5 15h9" />
    </>
  ),
  herramientas: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2.5" />
      <path d="M8 7h8M8 12h2M14 12h2M8 16h2M14 16h2" />
    </>
  ),
  libro: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" />
      <path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5" />
    </>
  ),
  quiz: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17.2v.1" />
    </>
  ),
  mesa: (
    <>
      <path d="M3 10h18M5 10v10M19 10v10" />
      <path d="M8 10V6h3v4M14 10V4h2v6" />
    </>
  ),
  esquema: (
    <>
      <rect x="8" y="3" width="8" height="5" rx="1.5" />
      <rect x="3" y="16" width="8" height="5" rx="1.5" />
      <rect x="13" y="16" width="8" height="5" rx="1.5" />
      <path d="M12 8v4M7 16v-4h10v4" />
    </>
  ),
  pasos: (
    <>
      <path d="M9 6h11M9 12h11M9 18h11" />
      <circle cx="4.5" cy="6" r="1.5" />
      <circle cx="4.5" cy="12" r="1.5" />
      <circle cx="4.5" cy="18" r="1.5" />
    </>
  ),
  grafico: (
    <>
      <path d="M4 4v16h16" />
      <path d="M8 16v-4M12 16V8M16 16v-6" />
    </>
  ),
  bandera: (
    <>
      <path d="M5 21V4M5 4h11l-2 4 2 4H5" />
    </>
  ),
  ojo: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  alerta: (
    <>
      <path d="M12 3 2 20h20z" />
      <path d="M12 10v4M12 17v.1" />
    </>
  ),
  escudo: <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" />,
  reloj: (
    <>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 2.5M9 2h6" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  flecha: <path d="M5 12h14M13 6l6 6-6 6" />,
  atras: <path d="M19 12H5M11 6l-6 6 6 6" />,
  pregunta: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 16v.1M12 13c0-2 2.5-2 2.5-4a2.5 2.5 0 0 0-5 0" />
    </>
  ),
  foco: (
    <>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" />
    </>
  ),
  expandir: <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />,
  gota: <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />,
  copiar: (
    <>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </>
  ),
  estrella: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />,
  reiniciar: (
    <>
      <path d="M4 12a8 8 0 1 0 2.3-5.7" />
      <path d="M4 4v4h4" />
    </>
  ),
  buscar: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  lapiz: <path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4" />,
  // iconos de pasos
  mezclar: (
    <>
      <path d="M8 3h8l-1 4v11a3 3 0 0 1-6 0V7z" />
      <path d="M4 10c2-1.5 3 1.5 5 0M15 14c2-1.5 3 1.5 5 0" />
    </>
  ),
  medir: (
    <>
      <path d="M11 2h2v14l-1 6-1-6z" />
      <path d="M13 6h2M13 9h2M13 12h2" />
    </>
  ),
  gotas: (
    <>
      <path d="M8 6s3.5 3.8 3.5 6.3a3.5 3.5 0 0 1-7 0C4.5 9.8 8 6 8 6z" />
      <path d="M16.5 10s3 3.2 3 5.3a3 3 0 0 1-6 0c0-2.1 3-5.3 3-5.3z" />
    </>
  ),
  bureta: (
    <>
      <rect x="10" y="2" width="4" height="14" rx="1" />
      <path d="M9 16h6M12 16v3M12 21v.1M14 5h-2M14 8h-2M14 11h-2" />
    </>
  ),
  titular: (
    <>
      <path d="M12 2v7M12 11v.1" />
      <path d="M9 13h6v2l4 6H5l4-6z" />
    </>
  ),
  repetir: (
    <>
      <path d="M17 2l3 3-3 3" />
      <path d="M4 11V9a4 4 0 0 1 4-4h12M7 22l-3-3 3-3" />
      <path d="M20 13v2a4 4 0 0 1-4 4H4" />
    </>
  ),
  calcular: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2.5" />
      <path d="M8 7h8M8.5 12h1M14.5 12h1M8.5 16h1M14.5 16h1" />
    </>
  ),
  usuario: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
};

export type NombreIcono = keyof typeof P;

export function Icono({ nombre, tam = 20, ...rest }: { nombre: string; tam?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={tam}
      height={tam}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {P[nombre] ?? P.matraz}
    </svg>
  );
}
