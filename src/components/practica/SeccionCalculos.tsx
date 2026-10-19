import { ResCarnitina } from "@/components/resultados/ResCarnitina";
import { ResFitoquimico } from "@/components/resultados/ResFitoquimico";
import { ResLipolisis } from "@/components/resultados/ResLipolisis";
import { ResMetabolismo } from "@/components/resultados/ResMetabolismo";
import { Vacio } from "@/components/ui/Vacio";
import type { Practica } from "@/lib/types";

/**
 * Pantalla de Resultados: cada práctica tiene su propia calculadora
 * (ver components/resultados). Los datos anotados en el procedimiento llegan solos.
 */
export function SeccionCalculos({ p }: { p: Practica }) {
  switch (p.resultados) {
    case "lipolisis":
      return <ResLipolisis p={p} />;
    case "carnitina":
      return <ResCarnitina p={p} />;
    case "metabolismo":
      return <ResMetabolismo p={p} />;
    case "fitoquimico":
      return <ResFitoquimico p={p} />;
    default:
      return <Vacio mensaje="Esta práctica todavía no tiene resultados configurados." />;
  }
}
