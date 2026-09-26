import type { CodigoGHS } from "@/lib/types";

/** Pictogramas del Sistema Globalmente Armonizado (SGA / GHS) */
export const GHS: Record<CodigoGHS, string> = {
  GHS01: "Explosivo",
  GHS02: "Inflamable",
  GHS03: "Comburente",
  GHS04: "Gas a presión",
  GHS05: "Corrosivo",
  GHS06: "Toxicidad aguda",
  GHS07: "Irritante / nocivo",
  GHS08: "Peligro para la salud",
  GHS09: "Peligro para el medio ambiente",
};
