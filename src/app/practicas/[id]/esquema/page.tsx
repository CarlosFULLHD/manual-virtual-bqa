import { notFound } from "next/navigation";
import { SeccionEsquema } from "@/components/practica/SeccionEsquema";
import { getPractica } from "@/data/practicas";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = getPractica(id);
  if (!p) notFound();
  return <SeccionEsquema p={p} />;
}
