"use client";

import { Fragment, useMemo, useState } from "react";
import { GLOSARIO } from "@/data/glosario";
import { Modal } from "./Modal";

const LETRAS = "a-zA-ZáéíóúüñÁÉÍÓÚÜÑ";
const escapar = (t: string) => t.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
const TERMINOS = Object.keys(GLOSARIO).sort((a, b) => b.length - a.length);
const CLAVES = new Map(TERMINOS.map((t) => [t.toLowerCase(), t]));
const REGEX = new RegExp(`(?<![${LETRAS}])(${TERMINOS.map(escapar).join("|")})(?![${LETRAS}])`, "gi");

/**
 * Muestra un texto y convierte los términos del glosario en botones
 * que abren su definición. Solo se marca la primera aparición de cada término.
 */
export function TextoGlosario({ texto }: { texto: string }) {
  const [termino, setTermino] = useState<string | null>(null);

  const partes = useMemo(() => {
    const vistos = new Set<string>();
    const out: (string | { termino: string; original: string })[] = [];
    let ultimo = 0;
    for (const m of texto.matchAll(REGEX)) {
      const clave = m[0].toLowerCase();
      if (vistos.has(clave) || m.index === undefined) continue;
      vistos.add(clave);
      out.push(texto.slice(ultimo, m.index), { termino: CLAVES.get(clave) ?? clave, original: m[0] });
      ultimo = m.index + m[0].length;
    }
    out.push(texto.slice(ultimo));
    return out;
  }, [texto]);

  return (
    <>
      {partes.map((p, i) =>
        typeof p === "string" ? (
          <Fragment key={i}>{p}</Fragment>
        ) : (
          <button key={i} type="button" className="termino" onClick={() => setTermino(p.termino)}>
            {p.original}
          </button>
        ),
      )}
      <Modal abierto={termino !== null} onCerrar={() => setTermino(null)} titulo={termino ?? ""} etiqueta="Glosario">
        <p style={{ marginTop: 8 }}>{termino ? GLOSARIO[termino] : ""}</p>
      </Modal>
    </>
  );
}
