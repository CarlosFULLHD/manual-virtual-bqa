"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SECCIONES } from "@/lib/types";

function indiceActual(pathname: string) {
  const slug = pathname.split("/").pop();
  return Math.max(0, SECCIONES.findIndex((s) => s.slug === slug));
}

/** Pestañas numeradas de la práctica */
export function NavSecciones({ id }: { id: string }) {
  const actual = indiceActual(usePathname());
  return (
    <nav className="stepper" aria-label="Secciones de la práctica">
      {SECCIONES.map((s, i) => (
        <Link
          key={s.slug}
          href={`/practicas/${id}/${s.slug}`}
          aria-current={i === actual ? "step" : undefined}
          className={i < actual ? "hecho" : undefined}
        >
          <span className="n">{i + 1}</span>
          {s.nombre}
        </Link>
      ))}
    </nav>
  );
}

/** Botones anterior / siguiente al pie de cada sección */
export function PieSecciones({ id }: { id: string }) {
  const i = indiceActual(usePathname());
  const ant = SECCIONES[i - 1];
  const sig = SECCIONES[i + 1];
  return (
    <div className="navpie">
      {ant ? (
        <Link className="btn" href={`/practicas/${id}/${ant.slug}`}>
          ← {ant.nombre}
        </Link>
      ) : (
        <span />
      )}
      {sig ? (
        <Link className="btn primary" href={`/practicas/${id}/${sig.slug}`}>
          {sig.nombre} →
        </Link>
      ) : (
        <Link className="btn primary" href="/">
          Terminar
        </Link>
      )}
    </div>
  );
}
