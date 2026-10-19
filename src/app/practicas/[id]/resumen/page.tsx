import { notFound } from "next/navigation";
import { SeccionResumen } from "@/components/practica/SeccionResumen";
import { getPractica } from "@/data/practicas";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = getPractica(id);
  if (!p) notFound();
  return <SeccionResumen p={p} />;
}
