import type { Paso } from "@/lib/types";

/** Diagrama de flujo generado automáticamente a partir de los pasos del procedimiento */
export function DiagramaFlujo({ pasos, decision, cierre }: { pasos: Paso[]; decision?: string; cierre?: string }) {
  const bloques: { texto: string; tipo: "terminal" | "proceso" | "decision" }[] = [
    { texto: "Inicio", tipo: "terminal" },
    ...pasos.map((p, i) => ({ texto: `${i + 1}. ${p.titulo}`, tipo: "proceso" as const })),
    ...(decision ? [{ texto: decision, tipo: "decision" as const }] : []),
    ...(cierre ? [{ texto: cierre, tipo: "proceso" as const }] : []),
    { texto: "Fin", tipo: "terminal" },
  ];
  return (
    <ol className="flujo" aria-label="Diagrama de flujo del procedimiento">
      {bloques.map((b, i) => (
        <li key={i} className="flujo-item">
          <div className={`flujo-caja ${b.tipo}`}>{b.texto}</div>
          {i < bloques.length - 1 && <div className="flujo-flecha" aria-hidden="true" />}
        </li>
      ))}
    </ol>
  );
}
