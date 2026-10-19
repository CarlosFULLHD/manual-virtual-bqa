"use client";

import { useEffect, useRef, useState } from "react";
import { MontajeTitulacion } from "@/components/esquemas/MontajeTitulacion";
import { Icono } from "@/components/ui/Icono";
import { formatear } from "@/lib/calculos";

type Fase = "inicio" | "acido" | "cerca" | "final" | "pasado";

const MENSAJES: Record<Fase, string> = {
  inicio: "Agrega NaOH con los botones y mira el matraz.",
  acido: "Sigue incoloro: todavía hay ácido. Continúa.",
  cerca: "¡Cerca! El rosado tarda en irse. Ahora solo gota a gota.",
  final: "Rosado pálido que se mantiene: ¡punto final! Aquí cierras la llave y anotas.",
  pasado: "Rosado intenso: te pasaste. En el laboratorio tendrías que repetir.",
};

/**
 * Simulación del viraje de la fenolftaleína.
 * `puntoFinal`: volumen (mL) en que la muestra de ejemplo vira.
 */
export function SimuladorTitulacion({ puntoFinal = 1.53, capacidad = 3 }: { puntoFinal?: number; capacidad?: number }) {
  const [v, setV] = useState(0);
  const [destello, setDestello] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fase: Fase =
    v === 0 ? "inicio" : v < puntoFinal - 0.25 ? "acido" : v < puntoFinal ? "cerca" : v < puntoFinal + 0.15 ? "final" : "pasado";

  const colorBase =
    fase === "final" ? "var(--rosa-palido)" : fase === "pasado" ? "var(--rosa-intenso)" : fase === "cerca" ? "var(--rosa-leve)" : "var(--leche)";
  const color = destello && (fase === "acido" || fase === "cerca") ? "var(--rosa-palido)" : colorBase;

  const agregar = (ml: number) => {
    setV((x) => Math.min(capacidad, Math.round((x + ml) * 100) / 100));
    setDestello(true);
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(() => setDestello(false), fase === "cerca" ? 900 : 350);
  };
  useEffect(() => () => {
    if (t.current) clearTimeout(t.current);
  }, []);

  return (
    <div className={`simulador fase-${fase}`}>
      <div className="simulador-dibujo">
        <MontajeTitulacion liquido={color} compacto nivelBureta={1 - v / capacidad} />
      </div>
      <div className="simulador-panel">
        <div className="simulador-lectura">
          <span className="muted pequeno">Lectura de la bureta</span>
          <span className="mono simulador-ml">{formatear(v, 2)} mL</span>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn" onClick={() => agregar(0.05)} disabled={v >= capacidad}>
            <Icono nombre="gota" tam={16} /> 1 gota
          </button>
          <button className="btn" onClick={() => agregar(0.5)} disabled={v >= capacidad}>
            <Icono nombre="gotas" tam={16} /> Chorrito
          </button>
          <button className="btn ghost" onClick={() => setV(0)} aria-label="Reiniciar simulación">
            <Icono nombre="reiniciar" tam={16} /> Reiniciar
          </button>
        </div>
        <p className="simulador-msg" aria-live="polite">
          {MENSAJES[fase]}
        </p>
      </div>
    </div>
  );
}
