import { redirect } from "next/navigation";

export default async function PracticaIndex({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/practicas/${id}/inicio`);
}
