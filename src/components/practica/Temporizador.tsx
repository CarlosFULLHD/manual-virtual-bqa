"use client";

import { useEffect, useState } from "react";

export function Temporizador({ segundos, mensajeFinal }: { segundos: number; mensajeFinal?: string }) {
  const [restante, setRestante] = useState(segundos);
  const [corriendo, setCorriendo] = useState(false);

  useEffect(() => {
    setRestante(segundos);
    setCorriendo(false);
  }, [segundos]);

  useEffect(() => {
    if (!corriendo) return;
    if (restante <= 0) {
      setCorriendo(false);
      return;
    }
    const t = setTimeout(() => setRestante((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [corriendo, restante]);

  const mm = String(Math.floor(restante / 60)).padStart(2, "0");
  const ss = String(restante % 60).padStart(2, "0");
  const terminado = restante === 0;

  return (
    <div className="row">
      <span className="temporizador" style={{ color: terminado ? "var(--ok)" : undefined }}>
        {mm}:{ss}
      </span>
      <button
        className="btn small"
        onClick={() => {
          setRestante(segundos);
          setCorriendo(true);
        }}
      >
        {corriendo || terminado ? "Reiniciar" : `Iniciar ${segundos} s`}
      </button>
      <span className="muted pequeno" aria-live="polite">
        {terminado ? mensajeFinal ?? "Tiempo cumplido." : ""}
      </span>
    </div>
  );
}
