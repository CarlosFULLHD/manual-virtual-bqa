import type { Metadata } from "next";
import { EditorPractica } from "@/components/docente/EditorPractica";
import { PRACTICAS } from "@/data/practicas";

export const metadata: Metadata = { title: "Panel docente" };

export default function PanelDocente() {
  const siguiente = Math.max(...PRACTICAS.map((p) => p.numero)) + 1;
  return (
    <>
      <div className="eyebrow">Modo docente</div>
      <h1>Nueva práctica</h1>
      <p className="muted lectura" style={{ margin: "4px 0 16px" }}>
        Llena el formulario y copia el código generado en un archivo nuevo dentro de <code>src/data/practicas/</code>. Luego
        regístralo en <code>index.ts</code>. Lo que dejes vacío aparecerá como “en preparación” para los estudiantes.
      </p>
      <EditorPractica numeroSugerido={siguiente} />
    </>
  );
}
