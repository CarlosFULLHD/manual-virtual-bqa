"use client";

import { useEffect, useState } from "react";
import { Icono } from "@/components/ui/Icono";

/** Temporizador con anillo que se vacía */
export function Temporizador({ segundos, mensajeFinal }: { segundos: number; mensajeFinal?: string }) {
  const [restante, setRestante] = useState(segundos);
  const [corriendo, setCorriendo] = useState(false);

  useEffect(() => {
    if (!corriendo) return;
    if (restante <= 0) {
      setCorriendo(false);
      return;
    }
    const id = setTimeout(() => setRestante((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [corriendo, restante]);

  const terminado = restante === 0;
  const r = 30;
  const c = 2 * Math.PI * r;
  const mm = String(Math.floor(restante / 60)).padStart(2, "0");
  const ss = String(restante % 60).padStart(2, "0");

  return (
    <div className={`temporizador ${terminado ? "terminado" : ""}`}>
      <div className="temporizador-anillo">
        <svg width="76" height="76" viewBox="0 0 76 76" aria-hidden="true">
          <circle cx="38" cy="38" r={r} fill="none" stroke="var(--line)" strokeWidth="6" />
          <circle
            cx="38"
            cy="38"
            r={r}
            fill="none"
            stroke={terminado ? "var(--ok)" : "var(--accent)"}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - restante / segundos)}
            transform="rotate(-90 38 38)"
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <span className="mono">
          {mm}:{ss}
        </span>
      </div>
      <div className="stack" style={{ gap: 6 }}>
        <button
          className="btn"
          onClick={() => {
            setRestante(segundos);
            setCorriendo(true);
          }}
        >
          <Icono nombre={corriendo || terminado ? "reiniciar" : "reloj"} tam={16} />
          {corriendo || terminado ? "Reiniciar" : `Iniciar ${segundos >= 60 ? `${Math.round(segundos / 60)} min` : `${segundos} s`}`}
        </button>
        <span className="pequeno" aria-live="polite">
          {terminado ? mensajeFinal ?? "Tiempo cumplido." : corriendo ? "En marcha…" : ""}
        </span>
      </div>
    </div>
  );
}
