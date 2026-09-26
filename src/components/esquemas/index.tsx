import type { TipoMontaje } from "@/lib/types";
import { MontajeTitulacion } from "./MontajeTitulacion";

/** Registro de dibujos de montaje. Agregar aquí nuevos montajes (baño maría, centrífuga, etc.) */
export function Montaje({ tipo }: { tipo: TipoMontaje }) {
  switch (tipo) {
    case "titulacion":
      return <MontajeTitulacion />;
  }
}
