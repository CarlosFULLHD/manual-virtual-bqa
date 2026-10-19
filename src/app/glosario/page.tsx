import type { Metadata } from "next";
import { Glosario } from "@/components/glosario/Glosario";

export const metadata: Metadata = { title: "Glosario" };

export default function PaginaGlosario() {
  return (
    <div className="stack grande">
      <div>
        <div className="eyebrow">Glosario</div>
        <h1>Palabras del laboratorio</h1>
        <p className="muted" style={{ marginTop: 4 }}>
          Los términos que aparecen en las prácticas, explicados en simple.
        </p>
      </div>
      <Glosario />
    </div>
  );
}
