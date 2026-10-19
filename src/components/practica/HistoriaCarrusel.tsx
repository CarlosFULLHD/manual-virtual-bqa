"use client";

import { useState } from "react";
import { Icono } from "@/components/ui/Icono";
import { IlustracionHistoria } from "@/components/ui/IlustracionHistoria";
import type { TarjetaHistoria } from "@/lib/types";

/** Explicación paso a paso con tarjetas: se avanza con los botones o tocando los puntos */
export function HistoriaCarrusel({ tarjetas }: { tarjetas: TarjetaHistoria[] }) {
  const [i, setI] = useState(0);
  const t = tarjetas[i];
  const ultima = i === tarjetas.length - 1;
  return (
    <div className="historia">
      <div className="historia-escena" key={i}>
        <div className="historia-ilustracion">
          <IlustracionHistoria tipo={t.icono} />
        </div>
        <div>
          <div className="historia-paso mono">
            {i + 1} / {tarjetas.length}
          </div>
          <h3 className="historia-titulo">{t.titulo}</h3>
          <p className="historia-texto">{t.texto}</p>
        </div>
      </div>
      <div className="historia-controles">
        <div className="puntos" role="tablist" aria-label="Tarjetas">
          {tarjetas.map((x, j) => (
            <button
              key={j}
              role="tab"
              aria-selected={j === i}
              aria-label={`Tarjeta ${j + 1}: ${x.titulo}`}
              className={j <= i ? "lleno" : undefined}
              onClick={() => setI(j)}
            />
          ))}
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn icono-solo" onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0} aria-label="Anterior">
            <Icono nombre="atras" tam={18} />
          </button>
          <button className="btn primary" onClick={() => setI(ultima ? 0 : i + 1)}>
            {ultima ? (
              <>
                <Icono nombre="reiniciar" tam={18} /> Ver de nuevo
              </>
            ) : (
              <>
                Siguiente <Icono nombre="flecha" tam={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
