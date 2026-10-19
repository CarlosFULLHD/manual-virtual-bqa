import Link from "next/link";
import { notFound } from "next/navigation";
import { AnilloPractica } from "@/components/layout/EstadoPractica";
import { NavSecciones, PieSecciones } from "@/components/layout/NavSecciones";
import { Icono } from "@/components/ui/Icono";
import { PRACTICAS, getPractica } from "@/data/practicas";
import { numero2 } from "@/lib/fechas";
import { NOMBRE_TIPO, seccionesDe, tipoDe } from "@/lib/types";

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
  const secciones = seccionesDe(p);
  const tipo = tipoDe(p);

  return (
    <>
      <div className="practica-cab">
        <Link href="/" className="volver">
          <Icono nombre="atras" tam={16} /> Prácticas
        </Link>
        <div className="practica-cab-fila">
          <span className={`insignia tipo-${tipo}`}>{p.etiqueta ?? numero2(p.numero)}</span>
          <div className="practica-cab-texto">
            <div className="eyebrow">
              <span className={`tipo-chip tipo-${tipo}`}>{NOMBRE_TIPO[tipo]}</span> {p.unidad.replace(/^(Laboratorio|Tema teórico|Caso clínico) · /, "")}
            </div>
            <h1>{p.titulo}</h1>
            <div className="row chips">
              <span className="meta">
                <Icono nombre="reloj" tam={14} /> {p.duracion}
              </span>
              <span className="meta">
                <Icono nombre="usuario" tam={14} /> {p.grupo}
              </span>
              {tipo === "laboratorio" && (
                <span className="meta">
                  <Icono nombre="escudo" tam={14} /> Riesgo {p.riesgo.toLowerCase()}
                </span>
              )}
            </div>
          </div>
          <div className="practica-cab-anillo">
            <AnilloPractica practica={p} tam={60} />
          </div>
        </div>
      </div>
      <NavSecciones id={p.id} secciones={secciones} />
      <section className="contenido-seccion">{children}</section>
      <PieSecciones id={p.id} secciones={secciones} />
    </>
  );
}
