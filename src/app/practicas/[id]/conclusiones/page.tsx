import { notFound } from "next/navigation";
import { SeccionConclusiones } from "@/components/practica/SeccionConclusiones";
import { getPractica } from "@/data/practicas";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = getPractica(id);
  if (!p) notFound();
  return <SeccionConclusiones p={p} />;
}
