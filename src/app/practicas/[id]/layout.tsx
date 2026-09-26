import Link from "next/link";
import { notFound } from "next/navigation";
import { NavSecciones, PieSecciones } from "@/components/layout/NavSecciones";
import { PRACTICAS, getPractica } from "@/data/practicas";
import { numero2 } from "@/lib/fechas";

export function generateStaticParams() {
  return PRACTICAS.map((p) => ({ id: p.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: getPractica(id)?.titulo ?? "Práctica" };
}

export default async function PracticaLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = getPractica(id);
  if (!p) notFound();

  return (
    <>
      <div className="practica-cab">
        <Link href="/" className="btn ghost small">
          ← Todas las prácticas
        </Link>
        <div className="eyebrow" style={{ marginTop: 8 }}>
          Práctica {numero2(p.numero)} · {p.unidad}
        </div>
        <h1>{p.titulo}</h1>
      </div>
      <NavSecciones id={p.id} />
      <section>{children}</section>
      <PieSecciones id={p.id} />
    </>
  );
}
