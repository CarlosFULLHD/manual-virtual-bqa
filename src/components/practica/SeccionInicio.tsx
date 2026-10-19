import Link from "next/link";
import { Icono } from "@/components/ui/Icono";
import { TextoGlosario } from "@/components/ui/TextoGlosario";
import { HistoriaCarrusel } from "./HistoriaCarrusel";
import { seccionesDe, tipoDe, type Practica } from "@/lib/types";

const QUE_HAY: Record<string, string> = {
  conceptos: "Lecciones cortas con fórmula, ejemplo guiado y calculadora",
  ejercicios: "Ejercicios de la cátedra que se corrigen solos",
  autoevaluacion: "Un quiz rápido para comprobar que entendiste",
  fundamento: "La teoría que necesitas, con el mapa interactivo de la vía",
  casos: "Cinco perfiles para identificar diagnóstico, enzima, gen y marcador",
  analisis: "Preguntas de razonamiento con ideas clave y artículos",
  taller: "Un caso clínico completo para resolver en grupo",
  fuentes: "Artículos de la guía y búsqueda de casos clínicos reales",
};

export function SeccionInicio({ p }: { p: Practica }) {
  const tipo = tipoDe(p);
  const recorrido = seccionesDe(p).filter((s) => s.slug !== "inicio");
  return (
    <div className="stack grande">
      {p.claves ? (
        <div className="claves">
          <Clave icono="ojo" titulo={tipo === "teoria" ? "¿De qué trata?" : tipo === "caso" ? "¿Qué se analiza?" : "¿Qué medimos?"} texto={p.claves.mide} />
          <Clave icono={tipo === "laboratorio" ? "gota" : "herramientas"} titulo="¿Con qué?" texto={p.claves.con} />
          <Clave icono="bandera" titulo={tipo === "laboratorio" ? "¿Cómo sé que terminé?" : "¿Cómo sé que lo domino?"} texto={p.claves.senal} destacado />
        </div>
      ) : (
        <div className="callout">
          <p>
            <TextoGlosario texto={p.queEs} />
          </p>
        </div>
      )}

      {p.historia?.length ? (
        <section>
          <div className="cab-seccion">
            <h2>Entiéndelo en 30 segundos</h2>
          </div>
          <HistoriaCarrusel tarjetas={p.historia} />
        </section>
      ) : null}

      {tipo !== "laboratorio" && (
        <section>
          <div className="cab-seccion">
            <h2>Tu recorrido</h2>
            <span className="muted pequeno">{tipo === "teoria" ? "Todo es teoría y ejercicios: no hay laboratorio" : "Trabajo de análisis: no hay laboratorio"}</span>
          </div>
          <div className="recorrido">
            {recorrido.map((s, i) => (
              <Link key={s.slug} href={`/practicas/${p.id}/${s.slug}`} className="recorrido-item">
                <span className="objetivo-num">{i + 1}</span>
                <span>
                  <b>{s.nombre}</b>
                  <span className="muted pequeno">{QUE_HAY[s.slug] ?? ""}</span>
                </span>
                <Icono nombre="flecha" tam={18} />
              </Link>
            ))}
          </div>
        </section>
      )}

      {p.objetivos.length > 0 && (
        <section className="panel">
          <h3>Al terminar vas a poder…</h3>
          <ul className="objetivos">
            {p.objetivos.map((o, i) => (
              <li key={o}>
                <span className="objetivo-num">{i + 1}</span>
                {o}
              </li>
            ))}
          </ul>
        </section>
      )}

      {p.fundamento && (
        <details className="desplegable">
          <summary>
            <Icono nombre="libro" tam={18} />
            <span>
              <b>Fundamento teórico</b>
              <span className="muted pequeno">Si quieres saber más</span>
            </span>
          </summary>
          <div className="desplegable-cuerpo">
            <p className="lectura">
              <TextoGlosario texto={p.queEs} />
            </p>
            <p className="lectura" style={{ marginTop: 10 }}>
              <TextoGlosario texto={p.fundamento} />
            </p>
          </div>
        </details>
      )}
    </div>
  );
}

function Clave({ icono, titulo, texto, destacado }: { icono: string; titulo: string; texto: string; destacado?: boolean }) {
  return (
    <div className={`clave ${destacado ? "destacada" : ""}`}>
      <span className="clave-icono">
        <Icono nombre={icono} tam={22} />
      </span>
      <div className="clave-titulo">{titulo}</div>
      <div className="clave-texto">{texto}</div>
    </div>
  );
}
