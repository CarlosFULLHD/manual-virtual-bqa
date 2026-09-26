import { GHS } from "@/data/ghs";
import type { CodigoGHS } from "@/lib/types";

/** Pictograma SGA simplificado (rombo rojo). Reemplazar por los SVG oficiales si se desea. */
export function GhsIcono({ codigo, tam = 34 }: { codigo: CodigoGHS; tam?: number }) {
  return (
    <svg className="ghs" width={tam} height={tam} viewBox="0 0 34 34" role="img" aria-label={`${codigo}: ${GHS[codigo]}`}>
      <title>{`${codigo}: ${GHS[codigo]}`}</title>
      <rect x="6" y="6" width="22" height="22" transform="rotate(45 17 17)" fill="#fff" stroke="#D0021B" strokeWidth="2.4" />
      <g fill="#111">{simbolo(codigo)}</g>
    </svg>
  );
}

function simbolo(c: CodigoGHS) {
  switch (c) {
    case "GHS02":
      return <path d="M17 25c-4 0-6-3-5-6 1-2 3-3 3-6 3 2 5 5 5 8 1-1 1-2 1-3 2 2 2 7-4 7z" />;
    case "GHS05":
      return (
        <>
          <path d="M11 13h5l-1 3m5-3h4l-1 3" stroke="#111" strokeWidth="1.6" fill="none" />
          <rect x="10" y="21" width="14" height="3" />
        </>
      );
    case "GHS06":
      return (
        <>
          <circle cx="17" cy="14" r="4" />
          <path d="M11 22l12-3M11 19l12 3" stroke="#111" strokeWidth="1.6" />
        </>
      );
    case "GHS08":
      return (
        <>
          <circle cx="17" cy="11" r="2.5" />
          <path d="M13 25l1-9h6l1 9z" />
          <path d="M15 18l2 2 2-2" stroke="#fff" strokeWidth="1.2" fill="none" />
        </>
      );
    case "GHS07":
    default:
      return (
        <>
          <rect x="15.5" y="10" width="3" height="10" rx="1" />
          <circle cx="17" cy="23.5" r="1.8" />
        </>
      );
  }
}
