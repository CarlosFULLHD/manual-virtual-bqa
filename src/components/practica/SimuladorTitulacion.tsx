"use client";

import { useState } from "react";
import { MontajeTitulacion } from "@/components/esquemas/MontajeTitulacion";
import { formatear } from "@/lib/calculos";

/**
 * Simulación visual del viraje de la fenolftaleína.
 * `puntoFinal` es el volumen (mL) en que la muestra de ejemplo cambia de color.
 */
export function SimuladorTitulacion({ puntoFinal = 1.53, maximo = 3 }: { puntoFinal?: number; maximo?: number }) {
  const [v, setV] = useState(0);

  let color = "var(--leche)";
  let mensaje = "Incoloro: todavía hay ácido. Sigue agregando.";
  if (v === 0) mensaje = "Mueve el control para agregar NaOH y mira cómo cambia el color.";
  if (v >= puntoFinal - 0.25 && v < puntoFinal) {
    color = "color-mix(in srgb, var(--leche) 80%, var(--rosa-palido))";
    mensaje = "Cerca del final: el rosado tarda en desaparecer. Ve gota a gota.";
  }
  if (v >= puntoFinal && v < puntoFinal + 0.15) {
    color = "var(--rosa-palido)";
    mensaje = "Rosado pálido que se mantiene: punto final. Cierra la llave y anota el volumen.";
  }
  if (v >= puntoFinal + 0.15) {
    color = "var(--rosa-intenso)";
    mensaje = "Rosado intenso: te pasaste del punto final. El resultado saldría más alto.";
  }

  return (
    <div className="simulador">
      <MontajeTitulacion liquido={color} compacto />
      <div>
        <label htmlFor="sim-naoh" className="negrita pequeno">
          NaOH agregado: <span className="mono">{formatear(v, 2)} mL</span>
        </label>
        <input
          id="sim-naoh"
          type="range"
          min={0}
          max={maximo}
          step={0.05}
          value={v}
          onChange={(e) => setV(parseFloat(e.target.value))}
        />
        <p aria-live="polite" style={{ marginTop: 6 }}>
          {mensaje}
        </p>
      </div>
    </div>
  );
}
