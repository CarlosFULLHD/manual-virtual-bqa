"use client";

import Link from "next/link";
import { useProgreso } from "@/context/ProgresoContext";
import { Anillo } from "@/components/ui/Anillo";
import { Icono } from "@/components/ui/Icono";
import { IlustracionHistoria } from "@/components/ui/IlustracionHistoria";
import { fechaLarga, numero2 } from "@/lib/fechas";
import { porcentajeAvance } from "@/lib/progreso";
import { NOMBRE_TIPO, seccionesDe, tipoDe, type Practica } from "@/lib/types";

function diasHasta(iso: string) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const f = new Date(`${iso}T00:00:00`);
  return Math.round((f.getTime() - hoy.getTime()) / 864e5);
}

/** Tarjeta principal: la práctica en curso o la próxima por fecha */
export function ProximaPractica({ practicas }: { practicas: Practica[] }) {
  const { obtener, listo } = useProgreso();
  if (!practicas.length) return null;

  const conAvance = practicas.map((p) => ({ p, pr: obtener(p.id), pct: listo ? porcentajeAvance(p, obtener(p.id)) : 0 }));
  const pendientes = conAvance.filter((x) => x.pct < 100);
  const futuras = pendientes.filter((x) => diasHasta(x.p.fecha) >= 0).sort((a, b) => a.p.fecha.localeCompare(b.p.fecha));
  const elegida = conAvance.find((x) => x.pct > 0 && x.pct < 100) ?? futuras[0] ?? pendientes[0] ?? conAvance[0];
  const { p, pr, pct } = elegida;
  const secciones = seccionesDe(p);
  const siguiente = secciones.find((s) => !pr.visitadas.includes(s.slug)) ?? secciones[0];
  const tipo = tipoDe(p);
  const dias = diasHasta(p.fecha);
  const cuando = dias < 0 ? "Ya pasó" : dias === 0 ? "¡Es hoy!" : dias === 1 ? "Mañana" : `En ${dias} días`;

  return (
    <section className="hero">
      <div className="hero-texto">
        <div className="hero-chip">
          <Icono nombre="reloj" tam={14} /> {cuando} · {fechaLarga(p.fecha).replace(/^./, (c) => c.toUpperCase())}
        </div>
        <div className="eyebrow">{pct > 0 ? "Sigue donde te quedaste" : "Lo que sigue"} · {NOMBRE_TIPO[tipo]} {p.etiqueta ?? numero2(p.numero)}</div>
        <h1>{p.titulo}</h1>
        <p className="hero-resumen">{p.resumen}</p>
        <div className="row" style={{ marginTop: 18 }}>
          <Link className="btn primary grande" href={`/practicas/${p.id}/${pct > 0 ? siguiente.slug : "inicio"}`}>
            {pct > 0 ? `Continuar: ${siguiente.nombre}` : "Empezar"} <Icono nombre="flecha" tam={18} />
          </Link>
          {tipo === "laboratorio" && p.quiz?.length ? (
            <Link className="btn" href={`/practicas/${p.id}/preparate`}>
              <Icono nombre="quiz" tam={18} /> Quiz rápido
            </Link>
          ) : null}
          {tipo === "teoria" && (
            <Link className="btn" href={`/practicas/${p.id}/ejercicios`}>
              <Icono nombre="lapiz" tam={18} /> Ir a los ejercicios
            </Link>
          )}
          {tipo === "caso" && (
            <Link className="btn" href={`/practicas/${p.id}/casos`}>
              <Icono nombre="usuario" tam={18} /> Ver los casos
            </Link>
          )}
        </div>
      </div>
      <div className="hero-visual">
        <IlustracionHistoria tipo={tipo === "teoria" ? "idea" : tipo === "caso" ? "huella" : p.historia?.length ? "rosado" : "matraz"} />
        <div className="hero-anillo">
          <Anillo valor={pct} tam={72} grosor={7} />
          <span className="pequeno muted">tu avance</span>
        </div>
      </div>
    </section>
  );
}
