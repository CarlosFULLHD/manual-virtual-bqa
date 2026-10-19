"use client";

import { useEffect, useState } from "react";
import { usePractica, type ProgresoPractica } from "@/context/ProgresoContext";
import { Icono } from "@/components/ui/Icono";
import { TextoGlosario } from "@/components/ui/TextoGlosario";
import { Vacio } from "@/components/ui/Vacio";
import { SimuladorTitulacion } from "./SimuladorTitulacion";
import { Temporizador } from "./Temporizador";
import type { Paso, Practica } from "@/lib/types";

export function SeccionProcedimiento({ p }: { p: Practica }) {
  const { progreso, actualizar } = usePractica(p.id);
  const [actual, setActual] = useState(0);
  const [modoLab, setModoLab] = useState(false);

  // Permite abrir un paso directo desde el diagrama de flujo: #paso-3
  useEffect(() => {
    const m = window.location.hash.match(/paso-(\d+)/);
    if (m) setActual(Math.min(p.pasos.length - 1, Math.max(0, parseInt(m[1]) - 1)));
  }, [p.pasos.length]);

  // Mantiene la pantalla encendida en modo laboratorio (si el navegador lo permite)
  useEffect(() => {
    if (!modoLab) return;
    let lock: { release: () => Promise<void> } | null = null;
    const nav = navigator as Navigator & { wakeLock?: { request: (t: "screen") => Promise<{ release: () => Promise<void> }> } };
    nav.wakeLock?.request("screen").then((l) => (lock = l)).catch(() => {});
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModoLab(false);
      if (e.key === "ArrowRight") setActual((a) => Math.min(p.pasos.length - 1, a + 1));
      if (e.key === "ArrowLeft") setActual((a) => Math.max(0, a - 1));
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      lock?.release().catch(() => {});
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [modoLab, p.pasos.length]);

  if (!p.pasos.length) return <Vacio />;

  const paso = p.pasos[actual];
  const hecho = progreso.pasosHechos.includes(actual);
  const total = p.pasos.length;

  const completarYSeguir = () => {
    if (!hecho) actualizar((pr) => ({ ...pr, pasosHechos: [...pr.pasosHechos, actual] }));
    if (actual < total - 1) setActual(actual + 1);
  };
  const desmarcar = () => actualizar((pr) => ({ ...pr, pasosHechos: pr.pasosHechos.filter((i) => i !== actual) }));

  const etapa = p.etapas?.find((e) => e.id === paso.etapa);

  const tarjeta = (
    <TarjetaPaso
      etapa={etapa ? `Etapa ${etapa.id} · ${etapa.nombre}` : undefined}
      key={actual}
      paso={paso}
      n={actual}
      total={total}
      hecho={hecho}
      progreso={progreso}
      grande={modoLab}
      onDato={(id, valor) => actualizar((pr) => ({ ...pr, datos: { ...pr.datos, [id]: valor } }))}
    />
  );

  const navegacion = (
    <div className="paso-nav">
      <button className="btn" onClick={() => setActual(Math.max(0, actual - 1))} disabled={actual === 0}>
        <Icono nombre="atras" tam={18} /> Anterior
      </button>
      {hecho ? (
        <button className="btn ghost" onClick={desmarcar}>
          <Icono nombre="check" tam={18} /> Hecho · desmarcar
        </button>
      ) : null}
      <button className="btn primary grande" onClick={completarYSeguir}>
        {actual < total - 1 ? (
          <>
            {hecho ? "Siguiente" : "Listo, siguiente"} <Icono nombre="flecha" tam={18} />
          </>
        ) : (
          <>
            <Icono nombre="check" tam={18} /> {hecho ? "Último paso hecho" : "Terminar procedimiento"}
          </>
        )}
      </button>
    </div>
  );

  return (
    <>
      <div className="proc-cab">
        <div className="pasos-tira" role="tablist" aria-label="Pasos">
          {p.pasos.map((x, i) => {
            const h = progreso.pasosHechos.includes(i);
            return (
              <button
                key={i}
                role="tab"
                aria-selected={i === actual}
                className={`paso-chip ${h ? "hecho" : ""}`}
                onClick={() => setActual(i)}
                title={x.titulo}
              >
                <span className="paso-chip-icono">{h ? <Icono nombre="check" tam={16} /> : <Icono nombre={x.icono ?? "matraz"} tam={16} />}</span>
                <span className="paso-chip-texto">
                  <span className="mono">{x.etapa ? `${x.etapa}·` : ""}{i + 1}</span> {x.titulo}
                </span>
              </button>
            );
          })}
        </div>
        <button className="btn modo-lab-btn" onClick={() => setModoLab(true)}>
          <Icono nombre="expandir" tam={18} /> Modo laboratorio
        </button>
      </div>

      <div className="barra delgada" aria-hidden="true">
        <div style={{ width: `${(progreso.pasosHechos.length / total) * 100}%` }} />
      </div>
      <p className="muted pequeno" style={{ margin: "6px 0 14px" }}>
        {progreso.pasosHechos.length} de {total} pasos hechos
      </p>

      {tarjeta}
      {navegacion}

      {modoLab && (
        <div className="modo-lab" role="dialog" aria-modal="true" aria-label="Modo laboratorio">
          <div className="modo-lab-cab">
            <span className="mono">
              Paso {actual + 1}/{total}
            </span>
            <div className="barra delgada" style={{ flex: 1 }} aria-hidden="true">
              <div style={{ width: `${((actual + 1) / total) * 100}%` }} />
            </div>
            <button className="btn icono-solo" onClick={() => setModoLab(false)} aria-label="Salir del modo laboratorio">
              <Icono nombre="x" tam={20} />
            </button>
          </div>
          <div className="modo-lab-cuerpo">{tarjeta}</div>
          <div className="modo-lab-pie">{navegacion}</div>
        </div>
      )}
    </>
  );
}

function TarjetaPaso({
  paso,
  etapa,
  n,
  total,
  hecho,
  progreso,
  grande,
  onDato,
}: {
  paso: Paso;
  etapa?: string;
  n: number;
  total: number;
  hecho: boolean;
  progreso: ProgresoPractica;
  grande: boolean;
  onDato: (id: string, valor: string) => void;
}) {
  const [verPorque, setVerPorque] = useState(false);
  return (
    <article className={`paso ${grande ? "paso-grande" : ""} ${hecho ? "paso-hecho" : ""}`} id={`paso-${n + 1}`}>
      <header className="paso-cab">
        <span className="paso-icono">
          <Icono nombre={paso.icono ?? "matraz"} tam={grande ? 32 : 26} />
        </span>
        <div>
          {etapa && <div className="etapa-chip">{etapa}</div>}
          <div className="eyebrow">
            Paso {n + 1} de {total}
            {paso.tiempo && <> · {paso.tiempo}</>}
          </div>
          <h2>{paso.titulo}</h2>
        </div>
        {hecho && (
          <span className="pill ok paso-estado">
            <Icono nombre="check" tam={14} /> Hecho
          </span>
        )}
      </header>

      <p className="paso-accion">
        <TextoGlosario texto={paso.hacer} />
      </p>

      <div className="paso-bloques">
        <div className="bloque ver">
          <span className="bloque-icono">
            <Icono nombre="ojo" tam={20} />
          </span>
          <div>
            <b>Qué debes ver</b>
            <p>
              <TextoGlosario texto={paso.observar} />
            </p>
          </div>
        </div>
        {paso.error && (
          <div className="bloque cuidado">
            <span className="bloque-icono">
              <Icono nombre="alerta" tam={20} />
            </span>
            <div>
              <b>Evita esto</b>
              <p>
                <TextoGlosario texto={paso.error} />
              </p>
            </div>
          </div>
        )}
      </div>

      <button className={`porque-btn ${verPorque ? "abierto" : ""}`} onClick={() => setVerPorque(!verPorque)} aria-expanded={verPorque}>
        <Icono nombre="foco" tam={18} /> ¿Por qué se hace esto?
        <span className="porque-flecha" aria-hidden="true">
          ▾
        </span>
      </button>
      {verPorque && (
        <p className="porque-texto">
          <TextoGlosario texto={paso.porque} />
        </p>
      )}

      {paso.simulador === "titulacion" && (
        <div className="paso-extra">
          <div className="extra-titulo">
            <Icono nombre="gota" tam={16} /> Practica aquí antes de hacerlo en la mesa
          </div>
          <SimuladorTitulacion />
        </div>
      )}

      {paso.temporizador && (
        <div className="paso-extra">
          <div className="extra-titulo">
            <Icono nombre="reloj" tam={16} /> Temporizador
          </div>
          <Temporizador segundos={paso.temporizador} />
        </div>
      )}

      {paso.registro && (
        <div className="paso-extra registro">
          <div className="extra-titulo">
            <Icono nombre="lapiz" tam={16} /> Anota tu dato
          </div>
          <div className="entradas">
            {paso.registro.map((r) => (
              <label key={r.id} className="entrada" htmlFor={`dato-${r.id}`}>
                <span>{r.etiqueta}</span>
                <span className="entrada-caja">
                  <input
                    id={`dato-${r.id}`}
                    inputMode="decimal"
                    placeholder={r.ejemplo}
                    value={progreso.datos[r.id] ?? ""}
                    onChange={(e) => onDato(r.id, e.target.value)}
                  />
                  <span className="entrada-unidad">{r.unidad}</span>
                </span>
              </label>
            ))}
          </div>
          <p className="muted pequeno">Se usa automáticamente en Resultados.</p>
        </div>
      )}
    </article>
  );
}
