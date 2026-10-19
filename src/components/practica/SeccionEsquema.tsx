import Link from "next/link";
import { Fragment } from "react";
import { Montaje } from "@/components/esquemas";
import { EsquemaCadena } from "@/components/esquemas/EsquemaCadena";
import { MontajeInteractivo } from "@/components/esquemas/MontajeInteractivo";
import { Icono } from "@/components/ui/Icono";
import { Vacio } from "@/components/ui/Vacio";
import type { Practica } from "@/lib/types";

export function SeccionEsquema({ p }: { p: Practica }) {
  if (!p.pasos.length && !p.esquema) return <Vacio />;
  const e = p.esquema;
  const etapas = p.etapas ?? [];
  const total = etapas.reduce((s, x) => s + x.minutos, 0);
  const grupos = etapas.length
    ? etapas.map((et) => ({ etapa: et, pasos: p.pasos.map((paso, i) => ({ paso, i })).filter((x) => x.paso.etapa === et.id) })).filter((g) => g.pasos.length)
    : [{ etapa: null, pasos: p.pasos.map((paso, i) => ({ paso, i })) }];

  return (
    <div className="stack grande">
      {etapas.length > 0 && (
        <section className="panel">
          <div className="cab-seccion">
            <h2>Organización del tiempo</h2>
            <span className="muted pequeno">
              {Math.floor(total / 60)} h {total % 60 ? `${total % 60} min` : ""} en total
            </span>
          </div>
          <div className="linea-tiempo" role="img" aria-label="Duración de cada etapa">
            {etapas.map((et) => (
              <div key={et.id} style={{ flexGrow: et.minutos }} title={`${et.nombre}: ${et.minutos} min`}>
                <b>{et.id}</b>
                <span>{et.minutos}′</span>
              </div>
            ))}
          </div>
          <ol className="etapas">
            {etapas.map((et) => (
              <li key={et.id}>
                <span className="calculo-num">{et.id}</span>
                <span>{et.nombre}</span>
                <span className="mono muted">{et.minutos} min</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {e?.cadena && (
        <section className="panel">
          <div className="cab-seccion">
            <h2>Esquema que debe elaborar tu grupo</h2>
            <span className="muted pequeno">Después de obtener los resultados</span>
          </div>
          <EsquemaCadena practicaId={p.id} cadena={e.cadena} />
        </section>
      )}

      {e?.montaje && (
        <section className="panel">
          <div className="cab-seccion">
            <h2>Así se arma el equipo</h2>
            <span className="muted pequeno">Toca los números</span>
          </div>
          {e.puntos?.length ? <MontajeInteractivo tipo={e.montaje} puntos={e.puntos} /> : <Montaje tipo={e.montaje} />}
        </section>
      )}

      {(e?.reaccion || e?.especies) && (
        <section className="panel">
          <h2>La reacción clave</h2>
          {e.especies && (
            <div className="reaccion">
              {e.especies.reactivos.map((x, i) => (
                <Fragment key={x.nombre}>
                  {i > 0 && <span className="operador">+</span>}
                  <div className={`especie ${i === 0 ? "acido" : "base"}`}>
                    <span className="especie-nombre">{x.nombre}</span>
                    <span className="especie-lugar">{x.detalle}</span>
                  </div>
                </Fragment>
              ))}
              <span className="operador flecha-reaccion">
                <Icono nombre="flecha" tam={22} />
              </span>
              {e.especies.productos.map((x) => (
                <div key={x.nombre} className="especie producto">
                  <span className="especie-nombre">{x.nombre}</span>
                  <span className="especie-lugar">{x.detalle}</span>
                </div>
              ))}
            </div>
          )}
          {e.reaccion && <div className="ecuacion">{e.reaccion}</div>}
          {e.reaccionExplicacion && (
            <p className="nota-icono">
              <Icono nombre="foco" tam={18} /> {e.reaccionExplicacion}
            </p>
          )}
        </section>
      )}

      {p.pasos.length > 0 && (
        <section className="panel">
          <div className="cab-seccion">
            <h2>Diagrama de flujo</h2>
            <span className="muted pequeno">Toca un paso para abrirlo</span>
          </div>
          <ol className="flujo">
            <li className="flujo-item">
              <div className="flujo-caja terminal">Inicio</div>
              <div className="flujo-flecha" aria-hidden="true" />
            </li>
            {grupos.map((g) => (
              <li key={g.etapa?.id ?? "todo"} className="flujo-item">
                <div className={g.etapa ? "flujo-etapa" : "flujo-sin-etapa"}>
                  {g.etapa && (
                    <div className="flujo-etapa-titulo">
                      <b>Etapa {g.etapa.id}</b> {g.etapa.nombre} <span className="mono">· {g.etapa.minutos} min</span>
                    </div>
                  )}
                  {g.pasos.map(({ paso, i }) => (
                    <Link key={i} href={`/practicas/${p.id}/procedimiento#paso-${i + 1}`} className="flujo-caja proceso enlace">
                      <span className="flujo-num mono">{i + 1}</span>
                      <Icono nombre={paso.icono ?? "matraz"} tam={18} />
                      <span>{paso.titulo}</span>
                      {paso.tiempo && <span className="flujo-tiempo">{paso.tiempo}</span>}
                    </Link>
                  ))}
                </div>
                <div className="flujo-flecha" aria-hidden="true" />
              </li>
            ))}
            {e?.decision && (
              <li className="flujo-item">
                <div className="flujo-caja decision">{e.decision}</div>
                <div className="flujo-flecha" aria-hidden="true" />
              </li>
            )}
            <li className="flujo-item">
              <div className="flujo-caja terminal">Fin</div>
            </li>
          </ol>
        </section>
      )}
    </div>
  );
}
