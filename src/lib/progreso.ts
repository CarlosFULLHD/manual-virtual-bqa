import type { ProgresoPractica } from "@/context/ProgresoContext";
import { seccionesDe, tipoDe, type Practica } from "./types";

/** Cuántos ejercicios tiene el banco de un tema (se pasa desde el componente que lo conoce) */
export const EJERCICIOS_META = 20;

/** Porcentaje de avance de una práctica (0-100) según su tipo */
export function porcentajeAvance(p: Practica, pr: ProgresoPractica): number {
  const partes: number[] = [];
  const secciones = seccionesDe(p);
  partes.push(Math.min(1, pr.visitadas.filter((s) => secciones.some((x) => x.slug === s)).length / secciones.length));
  if (p.quiz?.length) partes.push(Object.keys(pr.quiz).length / p.quiz.length);

  const tipo = tipoDe(p);
  if (tipo === "laboratorio") {
    if (p.materiales.length) partes.push(p.materiales.filter((_, i) => pr.checks[i]).length / p.materiales.length);
    if (p.pasos.length) partes.push(pr.pasosHechos.length / p.pasos.length);
    partes.push(pr.conclusion.trim().length > 40 ? 1 : 0);
  } else if (tipo === "teoria") {
    if (p.lecciones?.length) partes.push(pr.lecciones.length / p.lecciones.length);
    const bien = Object.values(pr.ejercicios).filter((e) => e === "ok").length;
    partes.push(Math.min(1, bien / EJERCICIOS_META));
  } else if (p.caso) {
    const { identificados, totalCasos, escritas, totalPreguntas } = avanceCaso(p, pr);
    partes.push(identificados / totalCasos);
    partes.push(escritas / totalPreguntas);
  }
  return Math.round((partes.reduce((a, b) => a + b, 0) / partes.length) * 100);
}

export function aciertosQuiz(p: Practica, pr: ProgresoPractica) {
  const total = p.quiz?.length ?? 0;
  const ok = (p.quiz ?? []).filter((q, i) => pr.quiz[i] === q.correcta).length;
  return { ok, total, respondidas: Object.keys(pr.quiz).length };
}

/** Avance en un caso clínico: casos identificados correctamente y preguntas con respuesta escrita */
export function avanceCaso(p: Practica, pr: ProgresoPractica) {
  const c = p.caso;
  if (!c) return { identificados: 0, totalCasos: 1, escritas: 0, totalPreguntas: 1 };
  const campos = ["diagnostico", "enzima", "gen", "marcador"] as const;
  const identificados = c.casos.filter((caso) => campos.every((k) => pr.elecciones[`${caso.id}.${k}`] === caso.respuesta[k])).length;
  const preguntas = [...c.analisis.flatMap((b) => b.preguntas), ...c.taller.preguntas];
  const escritas = preguntas.filter((q) => (pr.respuestas[q.id] ?? "").trim().length > 20).length;
  return { identificados, totalCasos: c.casos.length, escritas, totalPreguntas: preguntas.length };
}
