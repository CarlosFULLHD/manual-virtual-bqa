"use client";

import Link from "next/link";
import { useState } from "react";
import { usePractica } from "@/context/ProgresoContext";
import { Anillo } from "@/components/ui/Anillo";
import { BotonCopiar } from "@/components/ui/Copiar";
import { Icono } from "@/components/ui/Icono";
import { aciertosQuiz, porcentajeAvance } from "@/lib/progreso";
import { SECCIONES, seccionesDe, tipoDe, type Practica } from "@/lib/types";
import { EJERCICIOS } from "@/data/ejercicios/soluciones";
import { avanceCaso } from "@/lib/progreso";

/** Pantalla final: cambia según el tipo de práctica */
export function SeccionResumen({ p }: { p: Practica }) {
  const tipo = tipoDe(p);
  if (tipo === "teoria") return <ResumenTeoria p={p} />;
  if (tipo === "caso") return <ResumenCaso p={p} />;
  return <ResumenLaboratorio p={p} />;
}

function Cabecera({ pct, pendientes, titulo }: { pct: number; pendientes: string[]; titulo: string }) {
  return (
    <section className={`resumen-hero ${pct >= 100 ? "completo" : ""}`}>
      {pct >= 100 && (
        <div className="confeti" aria-hidden="true">
          {Array.from({ length: 18 }, (_, i) => (
            <span key={i} style={{ left: `${(i * 37) % 100}%`, animationDelay: `${(i % 6) * 0.15}s` }} />
          ))}
        </div>
      )}
      <Anillo valor={pct} tam={96} grosor={9} />
      <div>
        <div className="eyebrow">{titulo}</div>
        <h2>{pct >= 100 ? "¡Completado!" : pct >= 60 ? "¡Ya casi terminas!" : "Vas avanzando"}</h2>
        <p className="muted">{pendientes.length ? `Te falta revisar: ${pendientes.join(", ")}.` : "Revisaste todas las secciones."}</p>
      </div>
    </section>
  );
}

/** Resumen de un tema teórico: lecciones, ejercicios y autoevaluación */
function ResumenTeoria({ p }: { p: Practica }) {
  const { progreso, listo } = usePractica(p.id);
  const pct = listo ? porcentajeAvance(p, progreso) : 0;
  const quiz = aciertosQuiz(p, progreso);
  const lecciones = p.lecciones ?? [];
  const pendientes = seccionesDe(p).filter((s) => !progreso.visitadas.includes(s.slug)).map((s) => s.nombre);
  const bien = EJERCICIOS.filter((e) => progreso.ejercicios[e.id] === "ok").length;
  return (
    <div className="stack grande">
      <Cabecera pct={pct} pendientes={pendientes} titulo="Resumen del tema" />
      <div className="resumen-grid">
        <Tarjeta icono="libro" titulo="Lecciones vistas" valor={`${progreso.lecciones.length}/${lecciones.length}`} href={`/practicas/${p.id}/conceptos`} />
        <Tarjeta icono="lapiz" titulo="Ejercicios resueltos" valor={`${bien}/${EJERCICIOS.length}`} href={`/practicas/${p.id}/ejercicios`} />
        <Tarjeta icono="quiz" titulo="Autoevaluación" valor={quiz.total ? `${quiz.ok}/${quiz.total}` : "—"} href={`/practicas/${p.id}/autoevaluacion`} />
        <Tarjeta icono="herramientas" titulo="Calculadoras" valor="Abrir" href="/herramientas" />
      </div>
      <section className="panel">
        <h2>Tu avance por tema</h2>
        <div className="avance-temas">
          {lecciones.map((l) => {
            const total = EJERCICIOS.filter((e) => e.leccion === l.id);
            const ok = total.filter((e) => progreso.ejercicios[e.id] === "ok").length;
            return (
              <Link key={l.id} href={`/practicas/${p.id}/ejercicios#${l.id}`} className="avance-tema">
                <span>{l.titulo}</span>
                <span className="barra delgada" aria-hidden="true">
                  <span style={{ width: `${total.length ? (ok / total.length) * 100 : 0}%` }} />
                </span>
                <span className="mono pequeno">
                  {ok}/{total.length}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
      <Link href="/" className="btn" style={{ alignSelf: "flex-start" }}>
        <Icono nombre="inicio" tam={18} /> Volver al inicio
      </Link>
    </div>
  );
}

/** Resumen de un caso clínico: identificación de casos y respuestas escritas listas para copiar */
function ResumenCaso({ p }: { p: Practica }) {
  const { progreso, listo } = usePractica(p.id);
  const pct = listo ? porcentajeAvance(p, progreso) : 0;
  const a = avanceCaso(p, progreso);
  const c = p.caso;
  const pendientes = seccionesDe(p).filter((s) => !progreso.visitadas.includes(s.slug)).map((s) => s.nombre);
  if (!c) return null;
  const texto = (id: string) => progreso.respuestas[id]?.trim() || "(sin responder)";
  const nombre = (grupo: keyof typeof c.opciones, id: string | undefined) => c.opciones[grupo].find((o) => o.id === id)?.texto ?? "—";
  const informe = [
    `PRÁCTICA ${p.numero}: ${p.titulo.toUpperCase()}`,
    "",
    "ACTIVIDAD 1.1 — IDENTIFICACIÓN DIAGNÓSTICA",
    ...c.casos.map(
      (x) =>
        `${x.titulo}: ${nombre("diagnostico", progreso.elecciones[`${x.id}.diagnostico`])} | Enzima: ${nombre("enzima", progreso.elecciones[`${x.id}.enzima`])} | Gen: ${nombre("gen", progreso.elecciones[`${x.id}.gen`])} | Marcador: ${nombre("marcador", progreso.elecciones[`${x.id}.marcador`])}`,
    ),
    ...c.analisis.flatMap((b) => ["", b.titulo.toUpperCase(), ...b.preguntas.flatMap((q) => ["", q.titulo, q.pregunta, "R: " + texto(q.id)])]),
    "",
    "ACTIVIDAD 2 — " + c.taller.titulo.toUpperCase(),
    ...c.taller.preguntas.slice(0, 2).flatMap((q) => ["", q.titulo, "R: " + texto(q.id)]),
    "",
    "2.3 — Plan de confirmación diagnóstica",
    ...(progreso.elecciones["taller.orden"] ?? "").split(",").filter(Boolean).map((id, i) => `${i + 1}°. ${c.taller.estudios.find((e) => e.id === id)?.estudio ?? ""}`),
    "Justificación: " + texto("2.3"),
    ...c.taller.preguntas.slice(2).flatMap((q) => ["", q.titulo, "R: " + texto(q.id)]),
  ].join("\n");
  return (
    <div className="stack grande">
      <Cabecera pct={pct} pendientes={pendientes} titulo="Resumen del caso" />
      <div className="resumen-grid">
        <Tarjeta icono="usuario" titulo="Casos identificados" valor={`${a.identificados}/${a.totalCasos}`} href={`/practicas/${p.id}/casos`} />
        <Tarjeta icono="pregunta" titulo="Preguntas respondidas" valor={`${a.escritas}/${a.totalPreguntas}`} href={`/practicas/${p.id}/analisis`} />
        <Tarjeta icono="esquema" titulo="Taller" valor="Abrir" href={`/practicas/${p.id}/taller`} />
        <Tarjeta icono="buscar" titulo="Artículos" valor={String(p.bibliografia.length)} href={`/practicas/${p.id}/fuentes`} />
      </div>
      <section className="panel">
        <div className="cab-seccion">
          <h2>Tus respuestas</h2>
          <BotonCopiar texto={informe} etiqueta="Copiar todo" />
        </div>
        <p className="muted pequeno" style={{ marginBottom: 10 }}>
          Todo lo que elegiste y escribiste, en el orden de la guía. Pégalo en Word para entregar.
        </p>
        <pre className="informe">{informe}</pre>
      </section>
      <Link href="/" className="btn" style={{ alignSelf: "flex-start" }}>
        <Icono nombre="inicio" tam={18} /> Volver al inicio
      </Link>
    </div>
  );
}

/** Resumen de una práctica de laboratorio y texto listo para el informe */
function ResumenLaboratorio({ p }: { p: Practica }) {
  const { progreso, listo, reiniciar } = usePractica(p.id);
  const [confirmar, setConfirmar] = useState(false);
  const pct = listo ? porcentajeAvance(p, progreso) : 0;
  const quiz = aciertosQuiz(p, progreso);
  const preguntas = (p.analisis ?? []).flatMap((b) => b.preguntas);
  const respondidas = preguntas.filter((q) => (progreso.respuestas[q.id] ?? "").trim().length > 20).length;
  const datos = p.pasos.flatMap((x) => x.registro ?? []);
  const pendientes = SECCIONES.filter((s) => !progreso.visitadas.includes(s.slug));

  const informe = [
    `PRÁCTICA ${p.numero}: ${p.titulo.toUpperCase()}`,
    "",
    "OBJETIVOS",
    ...p.objetivos.map((o, i) => `${i + 1}. ${o}`),
    "",
    "FUNDAMENTO",
    p.fundamento,
    "",
    "MATERIALES",
    ...p.materiales.map((m) => `- ${m.nombre} (${m.cantidad})`),
    "",
    "REACTIVOS",
    ...p.reactivos.map((r) => `- ${r.nombre}, ${r.concentracion}`),
    "",
    "PROCEDIMIENTO",
    ...p.pasos.map((x, i) => `${i + 1}. ${x.hacer}`),
    "",
    "DATOS REGISTRADOS",
    ...datos.map((c) => `${c.etiqueta}: ${progreso.datos[c.id] || "—"} ${c.unidad}`),
    ...(p.analisis ?? []).flatMap((bl) => ["", bl.titulo.toUpperCase(), ...bl.preguntas.flatMap((q) => ["", q.titulo, q.pregunta, "R: " + (progreso.respuestas[q.id]?.trim() || "(sin responder)")])]),
    "",
    "CONCLUSIÓN",
    progreso.conclusion || "(pendiente)",
    "",
    "BIBLIOGRAFÍA",
    ...p.bibliografia.map((b) => `- ${b.texto}${b.url ? ` ${b.url}` : ""}`),
  ].join("\n");

  return (
    <div className="stack grande">
      <section className={`resumen-hero ${pct >= 100 ? "completo" : ""}`}>
        {pct >= 100 && (
          <div className="confeti" aria-hidden="true">
            {Array.from({ length: 18 }, (_, i) => (
              <span key={i} style={{ left: `${(i * 37) % 100}%`, animationDelay: `${(i % 6) * 0.15}s` }} />
            ))}
          </div>
        )}
        <Anillo valor={pct} tam={96} grosor={9} />
        <div>
          <div className="eyebrow">Resumen de la práctica</div>
          <h2>{pct >= 100 ? "¡Práctica completada!" : pct >= 60 ? "¡Ya casi terminas!" : "Vas avanzando"}</h2>
          <p className="muted">
            {pendientes.length ? `Te falta revisar: ${pendientes.map((s) => s.nombre).join(", ")}.` : "Revisaste todas las secciones."}
          </p>
        </div>
      </section>

      <div className="resumen-grid">
        <Tarjeta icono="quiz" titulo="Quiz" valor={quiz.total ? `${quiz.ok}/${quiz.total}` : "—"} href={`/practicas/${p.id}/preparate`} />
        <Tarjeta
          icono="mesa"
          titulo="Materiales"
          valor={`${p.materiales.filter((_, i) => progreso.checks[i]).length}/${p.materiales.length}`}
          href={`/practicas/${p.id}/materiales`}
        />
        <Tarjeta icono="pasos" titulo="Pasos" valor={`${progreso.pasosHechos.length}/${p.pasos.length}`} href={`/practicas/${p.id}/procedimiento`} />
        <Tarjeta icono="pregunta" titulo="Preguntas respondidas" valor={`${respondidas}/${preguntas.length}`} href={`/practicas/${p.id}/conclusiones`} />
      </div>

      <section className="panel">
        <div className="cab-seccion">
          <h2>Borrador para tu informe</h2>
          <BotonCopiar texto={informe} etiqueta="Copiar todo" />
        </div>
        <p className="muted pequeno" style={{ marginBottom: 10 }}>
          Junta todo lo de la práctica en orden. Las tablas de resultados se copian desde la pantalla Resultados.
        </p>
        <pre className="informe">{informe}</pre>
      </section>

      <div className="row entre">
        <Link href="/" className="btn">
          <Icono nombre="inicio" tam={18} /> Volver a las prácticas
        </Link>
        {confirmar ? (
          <div className="row">
            <span className="pequeno">¿Borrar todo tu avance de esta práctica?</span>
            <button className="btn small" onClick={() => setConfirmar(false)}>
              Cancelar
            </button>
            <button
              className="btn small peligro"
              onClick={() => {
                reiniciar();
                setConfirmar(false);
              }}
            >
              Sí, borrar
            </button>
          </div>
        ) : (
          <button className="btn ghost" onClick={() => setConfirmar(true)}>
            <Icono nombre="reiniciar" tam={18} /> Empezar de cero
          </button>
        )}
      </div>
    </div>
  );
}

function Tarjeta({ icono, titulo, valor, href, nota }: { icono: string; titulo: string; valor: string; href: string; nota?: string }) {
  return (
    <Link href={href} className="resumen-tarjeta">
      <Icono nombre={icono} tam={22} />
      <span className="muted pequeno">{titulo}</span>
      <span className="mono resumen-valor">{valor}</span>
      {nota && <span className="pill">{nota}</span>}
    </Link>
  );
}
