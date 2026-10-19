"use client";

import { usePractica } from "@/context/ProgresoContext";
import { Anillo } from "@/components/ui/Anillo";
import { fechaCorta } from "@/lib/fechas";
import { porcentajeAvance } from "@/lib/progreso";
import type { Practica } from "@/lib/types";

export function EstadoPractica({ practica }: { practica: Practica }) {
  const { progreso, listo } = usePractica(practica.id);
  if (practica.estado === "borrador") return <span className="pill">Próximamente</span>;
  const pct = listo ? porcentajeAvance(practica, progreso) : 0;
  if (pct >= 100) return <span className="pill ok">Completada</span>;
  if (pct > 0) return <span className="pill warn">En curso · {pct}%</span>;
  return <span className="pill accent">Para el {fechaCorta(practica.fecha)}</span>;
}

export function AnilloPractica({ practica, tam = 56 }: { practica: Practica; tam?: number }) {
  const { progreso, listo } = usePractica(practica.id);
  return <Anillo valor={listo && practica.estado !== "borrador" ? porcentajeAvance(practica, progreso) : 0} tam={tam} />;
}
