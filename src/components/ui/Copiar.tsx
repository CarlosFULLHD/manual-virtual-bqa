"use client";

import { useState } from "react";

/** Botón que copia texto al portapapeles; si falla, muestra el texto para copiarlo a mano */
export function BotonCopiar({ texto, etiqueta = "Copiar" }: { texto: string; etiqueta?: string }) {
  const [estado, setEstado] = useState<"idle" | "ok" | "manual">("idle");
  return (
    <div className="stack" style={{ gap: 8 }}>
      <div className="row">
        <button
          type="button"
          className="btn small"
          onClick={() =>
            navigator.clipboard
              .writeText(texto)
              .then(() => {
                setEstado("ok");
                setTimeout(() => setEstado("idle"), 2000);
              })
              .catch(() => setEstado("manual"))
          }
        >
          {etiqueta}
        </button>
        {estado === "ok" && <span className="pill ok">Copiado</span>}
      </div>
      {estado === "manual" && <textarea readOnly value={texto} onFocus={(e) => e.currentTarget.select()} aria-label="Texto para copiar" />}
    </div>
  );
}
