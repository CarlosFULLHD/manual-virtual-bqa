import { notFound } from "next/navigation";
import { SeccionAnalisis } from "@/components/caso/SeccionAnalisis";
import { SeccionCasos } from "@/components/caso/SeccionCasos";
import { SeccionFuentes } from "@/components/caso/SeccionFuentes";
import { SeccionFundamento } from "@/components/caso/SeccionFundamento";
import { SeccionTaller } from "@/components/caso/SeccionTaller";
import { SeccionPreparate } from "@/components/practica/SeccionPreparate";
import { SeccionConceptos } from "@/components/teoria/SeccionConceptos";
import { SeccionEjercicios } from "@/components/teoria/SeccionEjercicios";
import { PRACTICAS, getPractica } from "@/data/practicas";
import { seccionesDe, type Practica } from "@/lib/types";

/**
 * Pantallas de los temas teóricos y de los casos clínicos.
 * (Las pantallas de laboratorio tienen su propia carpeta: materiales, procedimiento, etc.)
 */
const PANTALLAS: Record<string, (p: Practica) => React.ReactNode> = {
  // tema teórico
  conceptos: (p) => <SeccionConceptos p={p} />,
  ejercicios: (p) => <SeccionEjercicios p={p} />,
  autoevaluacion: (p) => <SeccionPreparate p={p} />,
  // caso clínico
  fundamento: (p) => <SeccionFundamento p={p} />,
  casos: (p) => <SeccionCasos p={p} />,
  analisis: (p) => <SeccionAnalisis p={p} />,
  taller: (p) => <SeccionTaller p={p} />,
  fuentes: (p) => <SeccionFuentes p={p} />,
};

export function generateStaticParams() {
  return PRACTICAS.flatMap((p) =>
    seccionesDe(p)
      .filter((s) => s.slug in PANTALLAS)
      .map((s) => ({ id: p.id, seccion: s.slug })),
  );
}

export const dynamicParams = false;

export default async function Page({ params }: { params: Promise<{ id: string; seccion: string }> }) {
  const { id, seccion } = await params;
  const p = getPractica(id);
  if (!p) notFound();
  const pantalla = PANTALLAS[seccion];
  if (!pantalla || !seccionesDe(p).some((s) => s.slug === seccion)) notFound();
  return <>{pantalla(p)}</>;
}
