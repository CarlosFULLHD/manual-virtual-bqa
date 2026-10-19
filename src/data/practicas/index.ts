import type { Practica } from "@/lib/types";
import { adaptacionesMetabolicas } from "./adaptaciones-metabolicas";
import { analisisFitoquimico } from "./analisis-fitoquimico";
import { carnitinaAlimentos } from "./carnitina-alimentos";
import { digestionLipidos } from "./digestion-lipidos";
import { soluciones } from "./soluciones";
import { tamizajeBetaOxidacion } from "./tamizaje-beta-oxidacion";

/**
 * Registro de todas las prácticas. Todo el contenido proviene de las guías de la cátedra.
 * Para agregar una nueva: crear el archivo en esta carpeta e importarlo aquí.
 */
export const PRACTICAS: Practica[] = [
  soluciones,
  tamizajeBetaOxidacion,
  carnitinaAlimentos,
  digestionLipidos,
  adaptacionesMetabolicas,
  analisisFitoquimico,
].sort((a, b) => a.numero - b.numero);

export function getPractica(id: string): Practica | undefined {
  return PRACTICAS.find((p) => p.id === id);
}
