import { Icono } from "@/components/ui/Icono";
import { Vacio } from "@/components/ui/Vacio";
import type { Practica } from "@/lib/types";

/** Artículos de la guía y búsquedas listas para encontrar casos clínicos reales */
export function SeccionFuentes({ p }: { p: Practica }) {
  const c = p.caso;
  if (!c && !p.bibliografia.length) return <Vacio />;
  return (
    <div className="stack grande">
      {c && c.busquedas.length > 0 && (
        <section>
          <div className="cab-seccion">
            <h2>Busca casos clínicos reales</h2>
            <span className="muted pequeno">Se abren en PubMed con el filtro ya aplicado</span>
          </div>
          <div className="busquedas">
            {c.busquedas.map((b) => (
              <a key={b.url} className="acceso" href={b.url} target="_blank" rel="noopener noreferrer">
                <span className="acceso-icono">
                  <Icono nombre="buscar" tam={22} />
                </span>
                <span>
                  <b>{b.titulo}</b>
                  <span className="muted pequeno">{b.descripcion}</span>
                </span>
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="panel">
        <h2>Cómo leer un caso clínico en 4 pasos</h2>
        <ol className="objetivos">
          {[
            "Presentación: edad, síntomas y qué lo desencadenó (ayuno, infección).",
            "Laboratorio: qué acilcarnitinas están elevadas y cuántas veces sobre el corte.",
            "Confirmación: qué estudio cerró el diagnóstico (orina, enzima, gen).",
            "Evolución: qué tratamiento recibió y cómo respondió.",
          ].map((t, i) => (
            <li key={t}>
              <span className="objetivo-num">{i + 1}</span>
              {t}
            </li>
          ))}
        </ol>
      </section>

      <section>
        <div className="cab-seccion">
          <h2>Artículos de la guía</h2>
          <span className="muted pequeno">{p.bibliografia.length} referencias</span>
        </div>
        <div className="articulos">
          {p.bibliografia.map((b) => (
            <article key={b.texto} className="articulo">
              <Icono nombre="libro" tam={20} />
              <p>{b.texto}</p>
              {b.url && (
                <a className="btn small" href={b.url} target="_blank" rel="noopener noreferrer">
                  Abrir ↗
                </a>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
