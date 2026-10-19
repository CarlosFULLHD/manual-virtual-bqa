"use client";

import { useMemo, useState } from "react";
import { GLOSARIO } from "@/data/glosario";
import { Icono } from "@/components/ui/Icono";

const quitarTildes = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function Glosario() {
  const [q, setQ] = useState("");
  const terminos = useMemo(
    () =>
      Object.entries(GLOSARIO)
        .sort(([a], [b]) => a.localeCompare(b, "es"))
        .filter(([t, d]) => !q || quitarTildes(t + " " + d).includes(quitarTildes(q))),
    [q],
  );
  return (
    <>
      <label className="buscador" htmlFor="buscar-glosario">
        <Icono nombre="buscar" tam={20} />
        <input id="buscar-glosario" type="search" placeholder="Buscar un término…" value={q} onChange={(e) => setQ(e.target.value)} />
      </label>
      {terminos.length ? (
        <div className="glosario-grid">
          {terminos.map(([t, d]) => (
            <article key={t} className="glosario-item">
              <span className="glosario-letra">{t.charAt(0).toUpperCase()}</span>
              <div>
                <h3>{t.charAt(0).toUpperCase() + t.slice(1)}</h3>
                <p className="muted">{d}</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="vacio">No encontramos “{q}”.</div>
      )}
    </>
  );
}
