import Link from "next/link";
import { AnilloPractica, EstadoPractica } from "@/components/layout/EstadoPractica";
import { ProximaPractica } from "@/components/inicio/ProximaPractica";
import { Icono } from "@/components/ui/Icono";
import { PRACTICAS } from "@/data/practicas";
import { numero2 } from "@/lib/fechas";
import { NOMBRE_TIPO, tipoDe } from "@/lib/types";

export default function Inicio() {
  const disponibles = PRACTICAS.filter((p) => p.estado !== "borrador");
  return (
    <div className="stack grande">
      <ProximaPractica practicas={disponibles} />

      <section>
        <div className="cab-seccion">
          <h2>Prácticas y temas</h2>
          <span className="muted pequeno">{PRACTICAS.length} en la gestión</span>
        </div>
        <div className="grid-practicas">
          {PRACTICAS.map((p) => {
            const borrador = p.estado === "borrador";
            return (
              <Link key={p.id} href={`/practicas/${p.id}/inicio`} className={`practica-card ${borrador ? "borrador" : ""}`}>
                <div className="practica-card-top">
                  <span className="practica-num">{p.etiqueta ?? numero2(p.numero)}</span>
                  <AnilloPractica practica={p} tam={44} />
                </div>
                <div className="eyebrow">
                  <span className={`tipo-chip tipo-${tipoDe(p)}`}>{NOMBRE_TIPO[tipoDe(p)]}</span>
                </div>
                <h3>{p.titulo}</h3>
                <div className="practica-card-pie">
                  <EstadoPractica practica={p} />
                  <span className="meta">
                    <Icono nombre="reloj" tam={14} /> {p.duracion}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="accesos">
        <Link href="/herramientas" className="acceso">
          <span className="acceso-icono">
            <Icono nombre="herramientas" tam={24} />
          </span>
          <span>
            <b>Calculadoras de laboratorio</b>
            <span className="muted pequeno">Diluciones, soluciones, unidades y estadística</span>
          </span>
          <Icono nombre="flecha" tam={18} />
        </Link>
        <Link href="/glosario" className="acceso">
          <span className="acceso-icono">
            <Icono nombre="libro" tam={24} />
          </span>
          <span>
            <b>Glosario</b>
            <span className="muted pequeno">Términos del laboratorio explicados fácil</span>
          </span>
          <Icono nombre="flecha" tam={18} />
        </Link>
      </section>
    </div>
  );
}
