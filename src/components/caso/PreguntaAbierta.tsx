"use client";

import { useState } from "react";
import { Icono } from "@/components/ui/Icono";
import type { PreguntaAbierta as TPregunta } from "@/lib/types";

/** Pregunta de desarrollo: espacio para responder, ideas clave a pedido y búsqueda de artículos */
export function PreguntaAbierta({ q, valor, onChange }: { q: TPregunta; valor: string; onChange: (v: string) => void }) {
  const [verIdeas, setVerIdeas] = useState(false);
  const escrita = valor.trim().length > 20;
  return (
    <article className={`pregunta-abierta ${escrita ? "escrita" : ""}`} id={`q-${q.id}`}>
      <header className="row entre">
        <h3>{q.titulo}</h3>
        {escrita && (
          <span className="pill ok">
            <Icono nombre="check" tam={14} /> Respondida
          </span>
        )}
      </header>
      <p className="pregunta-abierta-texto">{q.pregunta}</p>
      <label className="eyebrow" htmlFor={`resp-${q.id}`}>
        Tu respuesta
      </label>
      <textarea id={`resp-${q.id}`} value={valor} placeholder="Escribe con tus palabras. Se guarda sola en este navegador." onChange={(e) => onChange(e.target.value)} />
      <div className="row" style={{ marginTop: 10 }}>
        {q.ideasClave?.length ? (
          <button className={`btn ${verIdeas ? "" : "primary"}`} onClick={() => setVerIdeas(!verIdeas)} aria-expanded={verIdeas}>
            <Icono nombre="foco" tam={18} /> {verIdeas ? "Ocultar ideas clave" : "Ver ideas clave"}
          </button>
        ) : null}
        {q.buscar && (
          <a className="btn" href={`https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(q.buscar)}`} target="_blank" rel="noopener noreferrer">
            <Icono nombre="buscar" tam={18} /> Buscar artículos en PubMed ↗
          </a>
        )}
        {!escrita && !verIdeas && q.ideasClave?.length ? <span className="muted pequeno">Intenta responder antes de ver las ideas.</span> : null}
      </div>
      {verIdeas && q.ideasClave && (
        <div className="ideas-clave">
          <span className="eyebrow">Una buena respuesta debería tocar…</span>
          <ul className="lista">
            {q.ideasClave.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
