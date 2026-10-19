"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { usePractica } from "@/context/ProgresoContext";
import { Icono } from "@/components/ui/Icono";
import type { Seccion } from "@/lib/types";

const ICONOS: Record<string, string> = {
  inicio: "foco",
  preparate: "quiz",
  materiales: "mesa",
  esquema: "esquema",
  procedimiento: "pasos",
  calculos: "grafico",
  conclusiones: "bandera",
  conceptos: "libro",
  ejercicios: "lapiz",
  autoevaluacion: "quiz",
  fundamento: "libro",
  casos: "usuario",
  analisis: "pregunta",
  taller: "esquema",
  fuentes: "buscar",
};

export function indiceSeccion(pathname: string, secciones: Seccion[]) {
  const slug = pathname.split("/").pop();
  return secciones.findIndex((s) => s.slug === slug);
}

/** Pestañas de la práctica. También registra qué secciones ya se visitaron. */
export function NavSecciones({ id, secciones: SECCIONES }: { id: string; secciones: Seccion[] }) {
  const pathname = usePathname();
  const actual = indiceSeccion(pathname, SECCIONES);
  const { progreso, actualizar, listo } = usePractica(id);
  const slugActual = SECCIONES[actual]?.slug;

  useEffect(() => {
    if (!listo || !slugActual) return;
    actualizar((pr) => (pr.visitadas.includes(slugActual) ? pr : { ...pr, visitadas: [...pr.visitadas, slugActual] }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listo, slugActual]);

  if (actual < 0) return null;

  return (
    <nav className="secciones" aria-label="Secciones de la práctica">
      <div className="secciones-barra" aria-hidden="true">
        <div style={{ width: `${((actual + 1) / SECCIONES.length) * 100}%` }} />
      </div>
      <div className="secciones-lista">
        {SECCIONES.map((s, i) => {
          const visitada = progreso.visitadas.includes(s.slug);
          return (
            <Link
              key={s.slug}
              href={`/practicas/${id}/${s.slug}`}
              aria-current={i === actual ? "step" : undefined}
              className={visitada && i !== actual ? "visitada" : undefined}
            >
              <span className="sec-icono">{visitada && i !== actual ? <Icono nombre="check" tam={16} /> : <Icono nombre={ICONOS[s.slug]} tam={16} />}</span>
              <span className="sec-nombre">{s.nombre}</span>
              <span className="sec-corto">{s.corto}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/** Botones anterior / siguiente al pie de cada sección */
export function PieSecciones({ id, secciones: SECCIONES }: { id: string; secciones: Seccion[] }) {
  const i = indiceSeccion(usePathname(), SECCIONES);
  if (i < 0) return null;
  const ant = SECCIONES[i - 1];
  const sig = SECCIONES[i + 1];
  return (
    <div className="navpie">
      {ant ? (
        <Link className="btn" href={`/practicas/${id}/${ant.slug}`}>
          <Icono nombre="atras" tam={18} /> {ant.nombre}
        </Link>
      ) : (
        <span />
      )}
      {sig ? (
        <Link className="btn primary grande" href={`/practicas/${id}/${sig.slug}`}>
          Siguiente: {sig.nombre} <Icono nombre="flecha" tam={18} />
        </Link>
      ) : (
        <Link className="btn primary grande" href={`/practicas/${id}/resumen`}>
          Ver mi resumen <Icono nombre="estrella" tam={18} />
        </Link>
      )}
    </div>
  );
}
