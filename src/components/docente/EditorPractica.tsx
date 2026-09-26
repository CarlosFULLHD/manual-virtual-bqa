"use client";

import { useMemo, useState } from "react";
import { BotonCopiar } from "@/components/ui/Copiar";
import type { Paso, Practica } from "@/lib/types";

const pasoVacio = (): Paso => ({ titulo: "", hacer: "", porque: "", observar: "", error: "" });

function slug(t: string) {
  return (
    t
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "nueva-practica"
  );
}
const lineas = (t: string) => t.split("\n").map((x) => x.trim()).filter(Boolean);
const camel = (s: string) => s.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());

export function EditorPractica({ numeroSugerido }: { numeroSugerido: number }) {
  const [f, setF] = useState({
    numero: numeroSugerido,
    titulo: "",
    unidad: "",
    fecha: new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10),
    duracion: "90 min",
    riesgo: "Bajo" as Practica["riesgo"],
    resumen: "",
    queEs: "",
    objetivos: "",
    fundamento: "",
    seguridad: "",
    materiales: "",
  });
  const [pasos, setPasos] = useState<Paso[]>([pasoVacio()]);
  const set = (k: keyof typeof f, v: string | number) => setF((prev) => ({ ...prev, [k]: v }));

  const practica: Practica = useMemo(() => {
    const pasosLlenos = pasos.filter((p) => p.titulo || p.hacer).map((p) => (p.error ? p : { ...p, error: undefined }));
    return {
      id: slug(f.titulo),
      numero: Number(f.numero),
      titulo: f.titulo,
      unidad: f.unidad,
      duracion: f.duracion,
      grupo: "Parejas",
      riesgo: f.riesgo,
      estado: pasosLlenos.length ? "asignada" : "borrador",
      fecha: f.fecha,
      resumen: f.resumen,
      queEs: f.queEs,
      objetivos: lineas(f.objetivos),
      fundamento: f.fundamento,
      seguridad: lineas(f.seguridad),
      materiales: lineas(f.materiales).map((nombre) => ({ nombre, cantidad: "1" })),
      reactivos: [],
      pasos: pasosLlenos,
      preguntas: [],
      bibliografia: [],
    };
  }, [f, pasos]);

  const nombreVar = camel(practica.id);
  const codigo = `import type { Practica } from "@/lib/types";\n\nexport const ${nombreVar}: Practica = ${JSON.stringify(practica, null, 2)};\n`;

  return (
    <div className="grid2" style={{ alignItems: "start" }}>
      <form className="formulario panel" onSubmit={(e) => e.preventDefault()}>
        <div className="grid2">
          <label>
            N.º
            <input id="e-numero" type="number" value={f.numero} onChange={(e) => set("numero", e.target.value)} />
          </label>
          <label>
            Fecha
            <input id="e-fecha" type="date" value={f.fecha} onChange={(e) => set("fecha", e.target.value)} />
          </label>
        </div>
        <label>
          Título
          <input id="e-titulo" value={f.titulo} placeholder="Ej. Determinación de colesterol total" onChange={(e) => set("titulo", e.target.value)} />
        </label>
        <label>
          Unidad
          <input id="e-unidad" value={f.unidad} placeholder="Ej. Unidad 3 · Análisis clínicos" onChange={(e) => set("unidad", e.target.value)} />
        </label>
        <div className="grid2">
          <label>
            Duración
            <input id="e-duracion" value={f.duracion} onChange={(e) => set("duracion", e.target.value)} />
          </label>
          <label>
            Riesgo
            <select id="e-riesgo" value={f.riesgo} onChange={(e) => set("riesgo", e.target.value)}>
              <option>Bajo</option>
              <option>Moderado</option>
              <option>Alto</option>
            </select>
          </label>
        </div>
        <label>
          Resumen (una línea)
          <input id="e-resumen" value={f.resumen} onChange={(e) => set("resumen", e.target.value)} />
        </label>
        <label>
          Explicación sencilla (qué es la práctica)
          <textarea id="e-queEs" value={f.queEs} onChange={(e) => set("queEs", e.target.value)} />
        </label>
        <label>
          Objetivos (uno por línea)
          <textarea id="e-objetivos" value={f.objetivos} onChange={(e) => set("objetivos", e.target.value)} />
        </label>
        <label>
          Fundamento teórico
          <textarea id="e-fundamento" value={f.fundamento} onChange={(e) => set("fundamento", e.target.value)} />
        </label>
        <label>
          Seguridad (una indicación por línea)
          <textarea id="e-seguridad" value={f.seguridad} onChange={(e) => set("seguridad", e.target.value)} />
        </label>
        <label>
          Materiales (uno por línea)
          <textarea id="e-materiales" value={f.materiales} onChange={(e) => set("materiales", e.target.value)} />
        </label>

        <div className="row entre">
          <b>Pasos del procedimiento</b>
          <button type="button" className="btn small" onClick={() => setPasos((p) => [...p, pasoVacio()])}>
            + Paso
          </button>
        </div>
        {pasos.map((p, i) => (
          <fieldset key={i} className="paso-editor">
            <legend>Paso {i + 1}</legend>
            {(
              [
                ["titulo", "Título", false],
                ["hacer", "Qué hacer", true],
                ["porque", "Por qué se hace", true],
                ["observar", "Qué se debe ver", false],
                ["error", "Error frecuente", false],
              ] as const
            ).map(([campo, etiqueta, largo]) => (
              <label key={campo}>
                {etiqueta}
                {largo ? (
                  <textarea
                    id={`paso-${i}-${campo}`}
                    value={p[campo] ?? ""}
                    onChange={(e) => setPasos((ps) => ps.map((x, j) => (j === i ? { ...x, [campo]: e.target.value } : x)))}
                  />
                ) : (
                  <input
                    id={`paso-${i}-${campo}`}
                    value={p[campo] ?? ""}
                    onChange={(e) => setPasos((ps) => ps.map((x, j) => (j === i ? { ...x, [campo]: e.target.value } : x)))}
                  />
                )}
              </label>
            ))}
            {pasos.length > 1 && (
              <button type="button" className="btn ghost small" onClick={() => setPasos((ps) => ps.filter((_, j) => j !== i))}>
                Quitar paso
              </button>
            )}
          </fieldset>
        ))}
      </form>

      <div className="panel" style={{ position: "sticky", top: 12 }}>
        <h3>Archivo generado</h3>
        <p className="muted pequeno" style={{ margin: "4px 0 10px" }}>
          Guárdalo como <code>src/data/practicas/{practica.id}.ts</code> e impórtalo en <code>index.ts</code>.
        </p>
        <pre className="codigo">{codigo}</pre>
        <div style={{ marginTop: 8 }}>
          <BotonCopiar texto={codigo} etiqueta="Copiar código" />
        </div>
      </div>
    </div>
  );
}
