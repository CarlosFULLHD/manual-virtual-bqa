import type { Practica } from "@/lib/types";
import { acidezLeche } from "./acidez-leche";
import { glucosa } from "./glucosa";
import { proteinas } from "./proteinas";

/**
 * Registro de todas las prácticas.
 * Para agregar una nueva: crear el archivo en esta carpeta e importarlo aquí.
 */
export const PRACTICAS: Practica[] = [acidezLeche, glucosa, proteinas].sort((a, b) => a.numero - b.numero);

export function getPractica(id: string): Practica | undefined {
  return PRACTICAS.find((p) => p.id === id);
}
