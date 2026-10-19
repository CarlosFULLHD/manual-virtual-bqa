"use client";

import { useState } from "react";
import { usePractica } from "@/context/ProgresoContext";
import { GHS } from "@/data/ghs";
import { GhsIcono } from "@/components/ui/GhsIcono";
import { Icono } from "@/components/ui/Icono";
import { IconoMaterial } from "@/components/ui/IconoMaterial";
import { Modal } from "@/components/ui/Modal";
import { TablaInfoVista } from "@/components/ui/TablaInfoVista";
import { TextoGlosario } from "@/components/ui/TextoGlosario";
import { Vacio } from "@/components/ui/Vacio";
import type { Practica, Reactivo } from "@/lib/types";

function nivel(r: Reactivo) {
  if (r.ghs.some((g) => ["GHS05", "GHS06", "GHS08", "GHS02"].includes(g))) return "alto";
  if (r.ghs.length) return "medio";
  return "bajo";
}
const NIVEL_TEXTO = { alto: "Cuidado", medio: "Precaución", bajo: "Seguro" };

export function SeccionMateriales({ p }: { p: Practica }) {
  const { progreso, actualizar } = usePractica(p.id);
  const [reactivo, setReactivo] = useState<Reactivo | null>(null);

  if (!p.materiales.length && !p.reactivos.length) return <Vacio />;
  const listos = p.materiales.filter((_, i) => progreso.checks[i]).length;
  const todo = listos === p.materiales.length;
  const vistos = progreso.reactivosVistos;

  return (
    <div className="stack grande">
      {p.tablas?.length ? (
        <section className="panel">
          <div className="stack grande">
            {p.tablas.map((t) => (
              <TablaInfoVista key={t.titulo} tabla={t} />
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <div className="mesa-cab">
          <div>
            <h2>Equipos y materiales</h2>
            <p className="muted pequeno">Toca cada uno cuando ya lo tengas en tu mesa.</p>
          </div>
          <div className={`mesa-contador ${todo ? "listo" : ""}`}>
            {todo ? (
              <>
                <Icono nombre="check" tam={18} /> ¡Mesa lista!
              </>
            ) : (
              <span className="mono">
                {listos}/{p.materiales.length}
              </span>
            )}
          </div>
        </div>
        <div className="barra" aria-hidden="true">
          <div style={{ width: `${(listos / p.materiales.length) * 100}%` }} />
        </div>
        <div className="materiales-grid">
          {p.materiales.map((m, i) => {
            const ok = !!progreso.checks[i];
            return (
              <button
                key={m.nombre}
                className={`material ${ok ? "listo" : ""}`}
                aria-pressed={ok}
                onClick={() => actualizar((pr) => ({ ...pr, checks: { ...pr.checks, [i]: !ok } }))}
              >
                <span className="material-check">{ok && <Icono nombre="check" tam={14} />}</span>
                <span className="material-cant mono">×{m.cantidad}</span>
                <IconoMaterial tipo={m.icono} tam={52} />
                <span className="material-nombre">{m.nombre}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <div className="cab-seccion">
          <h2>Reactivos</h2>
          <span className="muted pequeno">
            {vistos.filter((v) => p.reactivos.some((r) => r.id === v)).length}/{p.reactivos.length} revisados
          </span>
        </div>
        <div className="reactivos-grid">
          {p.reactivos.map((r) => {
            const n = nivel(r);
            const visto = vistos.includes(r.id);
            return (
              <button key={r.id} className={`reactivo nivel-${n}`} onClick={() => setReactivo(r)}>
                <div className="reactivo-top">
                  <span className={`semaforo ${n}`}>{NIVEL_TEXTO[n]}</span>
                  {visto && (
                    <span className="visto">
                      <Icono nombre="check" tam={14} /> Revisado
                    </span>
                  )}
                </div>
                <b className="reactivo-nombre">{r.nombre}</b>
                <span className="muted pequeno">{r.concentracion}</span>
                <span className="reactivo-funcion">{r.funcion.split(". ")[0].replace(/\.$/, "")}.</span>
                <span className="row" style={{ gap: 4, marginTop: "auto" }}>
                  {r.ghs.map((g) => (
                    <GhsIcono key={g} codigo={g} tam={30} />
                  ))}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <Modal abierto={!!reactivo} onCerrar={() => setReactivo(null)} titulo={reactivo?.nombre ?? ""} etiqueta={reactivo?.concentracion}>
        {reactivo && (
          <div className="stack" style={{ marginTop: 12 }}>
            <div className="ficha-bloque">
              <Icono nombre="foco" tam={20} />
              <div>
                <b>¿Para qué sirve aquí?</b>
                <p>
                  <TextoGlosario texto={reactivo.funcion} />
                </p>
              </div>
            </div>
            <div className="ficha-bloque peligro">
              <Icono nombre="alerta" tam={20} />
              <div>
                <b>Riesgos</b>
                <p>{reactivo.peligros}</p>
                {reactivo.ghs.length > 0 && (
                  <div className="row" style={{ marginTop: 8 }}>
                    {reactivo.ghs.map((g) => (
                      <span key={g} className="row" style={{ gap: 6 }}>
                        <GhsIcono codigo={g} tam={30} />
                        <span className="pequeno">{GHS[g]}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="ficha-dos">
              <div className="ficha-bloque">
                <Icono nombre="escudo" tam={20} />
                <div>
                  <b>Protección</b>
                  <p>{reactivo.proteccion}</p>
                </div>
              </div>
              <div className="ficha-bloque">
                <Icono nombre="reiniciar" tam={20} />
                <div>
                  <b>Desecho</b>
                  <p>{reactivo.desecho}</p>
                </div>
              </div>
            </div>
            <div className="row entre">
              {reactivo.fuente ? (
                <a href={reactivo.fuente} target="_blank" rel="noopener noreferrer" className="pequeno">
                  Ver ficha completa ↗
                </a>
              ) : (
                <span className="muted pequeno">Revisa siempre la ficha de seguridad del frasco que uses.</span>
              )}
              <button
                className="btn primary"
                onClick={() => {
                  const id = reactivo.id;
                  actualizar((pr) => (pr.reactivosVistos.includes(id) ? pr : { ...pr, reactivosVistos: [...pr.reactivosVistos, id] }));
                  setReactivo(null);
                }}
              >
                <Icono nombre="check" tam={18} /> Entendido
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
