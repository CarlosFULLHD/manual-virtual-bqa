"use client";

import { usePractica } from "@/context/ProgresoContext";
import { fechaCorta } from "@/lib/fechas";
import type { Practica } from "@/lib/types";

export function EstadoPractica({ practica }: { practica: Practica }) {
  const { progreso, listo } = usePractica(practica.id);
  if (practica.estado === "borrador") return <span className="pill">Contenido en preparación</span>;
  const total = practica.pasos.length;
  const hechos = listo ? progreso.pasosHechos.length : 0;
  if (total && hechos === total) return <span className="pill ok">Realizada</span>;
  if (hechos) return <span className="pill warn">En curso · {hechos}/{total} pasos</span>;
  return <span className="pill accent">Asignada · {fechaCorta(practica.fecha)}</span>;
}
