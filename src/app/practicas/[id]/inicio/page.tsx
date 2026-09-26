import { notFound } from "next/navigation";
import { SeccionInicio } from "@/components/practica/SeccionInicio";
import { getPractica } from "@/data/practicas";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = getPractica(id);
  if (!p) notFound();
  return <SeccionInicio p={p} />;
}
