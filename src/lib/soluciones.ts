/**
 * Resolutores de ejercicios de soluciones, diluciones y buffers.
 * Cada función recibe los datos del enunciado y devuelve las respuestas
 * numéricas y el desarrollo paso a paso. Así los resultados se calculan
 * siempre con la misma fórmula y no se escriben a mano.
 */

export interface Respuesta {
  etiqueta: string;
  valor: number;
  unidad: string;
}

export interface Eleccion {
  etiqueta: string;
  opciones: string[];
  correcta: number;
}

export interface Solucion {
  respuestas: Respuesta[];
  eleccion?: Eleccion;
  pasos: string[];
}

/** Número con 4 cifras significativas y coma decimal */
export function n(x: number, cifras = 4): string {
  if (!Number.isFinite(x)) return "—";
  if (x === 0) return "0";
  const abs = Math.abs(x);
  let s: string;
  if (abs >= 10000 || abs < 0.0001) {
    const [m, e] = x.toExponential(cifras - 1).split("e");
    s = `${parseFloat(m)} × 10^${parseInt(e)}`;
  } else {
    s = String(parseFloat(x.toPrecision(cifras)));
  }
  return s.replace(".", ",");
}

/** ¿La respuesta del estudiante coincide (±2 %)? */
export function coincide(ingresado: number, correcto: number): boolean {
  if (!Number.isFinite(ingresado)) return false;
  const tol = Math.max(Math.abs(correcto) * 0.02, 1e-9);
  return Math.abs(ingresado - correcto) <= tol;
}

const log10 = (x: number) => Math.log(x) / Math.LN10;

/* =========================================================
   1. Diluciones
   ========================================================= */

/** C₁·V₁ = C₂·V₂ → concentración final. `aPorcentaje` convierte mg/L o g/L a % p/v */
export function dilucionSimple(d: { c1: number; v1: number; vf: number; unidad: string; aPorcentaje?: "mg/L" | "g/L"; soloPorcentaje?: boolean }): Solucion {
  const cf = (d.c1 * d.v1) / d.vf;
  const pasos = [
    "Se usa C₁·V₁ = C₂·V₂ porque la cantidad de soluto no cambia al diluir.",
    `C₂ = (${n(d.c1)} ${d.unidad} × ${n(d.v1)} mL) / ${n(d.vf)} mL = ${n(cf)} ${d.unidad}`,
  ];
  const respuestas: Respuesta[] = d.soloPorcentaje ? [] : [{ etiqueta: "Concentración final", valor: cf, unidad: d.unidad }];
  if (d.aPorcentaje) {
    const gL = d.aPorcentaje === "mg/L" ? cf / 1000 : cf;
    const pct = gL / 10;
    pasos.push(
      d.aPorcentaje === "mg/L" ? `Pasar a g/L: ${n(cf)} mg/L ÷ 1000 = ${n(gL)} g/L` : `Ya está en g/L: ${n(gL)} g/L`,
      `% p/v son gramos en 100 mL: ${n(gL)} g/L ÷ 10 = ${n(pct)} %`,
    );
    respuestas.push({ etiqueta: "Concentración final", valor: pct, unidad: "% p/v" });
  }
  return { respuestas, pasos };
}

/** C₁·V₁ = C₂·V₂ → volumen de la solución concentrada */
export function volumenStock(d: { c1: number; c2: number; v2: number; unidad: string }): Solucion {
  const v1 = (d.c2 * d.v2) / d.c1;
  return {
    respuestas: [
      { etiqueta: "Volumen de solución concentrada", valor: v1, unidad: "mL" },
      { etiqueta: "Volumen de diluyente", valor: d.v2 - v1, unidad: "mL" },
    ],
    pasos: [
      "C₁·V₁ = C₂·V₂, se despeja V₁.",
      `V₁ = (${n(d.c2)} ${d.unidad} × ${n(d.v2)} mL) / ${n(d.c1)} ${d.unidad} = ${n(v1)} mL`,
      `Se miden ${n(v1)} mL del concentrado y se completa hasta ${n(d.v2)} mL (unos ${n(d.v2 - v1)} mL de diluyente).`,
    ],
  };
}

/** Dos diluciones seguidas */
export function dobleDilucion(d: { c0: number; a1: number; v1: number; a2: number; v2: number; unidad?: string }): Solucion {
  const u = d.unidad ?? "M";
  const cA = (d.c0 * d.a1) / d.v1;
  const cB = (cA * d.a2) / d.v2;
  return {
    respuestas: [
      { etiqueta: "Concentración intermedia (sol. A)", valor: cA, unidad: u },
      { etiqueta: "Concentración final", valor: cB, unidad: u },
    ],
    pasos: [
      `Primera dilución: ${n(d.c0)} ${u} × ${n(d.a1)} mL / ${n(d.v1)} mL = ${n(cA)} ${u}`,
      `Segunda dilución: ${n(cA)} ${u} × ${n(d.a2)} mL / ${n(d.v2)} mL = ${n(cB)} ${u}`,
      `Factor de dilución total: ${n(d.v1 / d.a1)} × ${n(d.v2 / d.a2)} = ${n((d.v1 / d.a1) * (d.v2 / d.a2))}`,
    ],
  };
}

/** Diluciones 1/n de un patrón con volumen fijo por tubo */
export function dilucionesPatron(d: { c0: number; unidad: string; factores: number[]; vTubo: number; convertir?: { factor: number; unidad: string } }): Solucion {
  const respuestas: Respuesta[] = [];
  const pasos = ["En una dilución 1/n, una parte es patrón y el total son n partes: V patrón = V tubo / n."];
  for (const f of d.factores) {
    const vp = d.vTubo / f;
    const c = d.c0 / f;
    const cConv = d.convertir ? c * d.convertir.factor : c;
    const uConv = d.convertir ? d.convertir.unidad : d.unidad;
    respuestas.push(
      { etiqueta: `1/${f}: volumen de patrón`, valor: vp, unidad: "mL" },
      { etiqueta: `1/${f}: concentración`, valor: cConv, unidad: uConv },
    );
    pasos.push(
      `1/${f}: patrón = ${n(d.vTubo)} / ${f} = ${n(vp)} mL; diluyente = ${n(d.vTubo - vp)} mL; concentración = ${n(d.c0)} / ${f} = ${n(c)} ${d.unidad}` +
        (d.convertir ? ` = ${n(cConv)} ${uConv}` : ""),
    );
  }
  return { respuestas, pasos };
}

/** Diluciones seriadas con el mismo factor en cada tubo */
export function seriada(d: { c0: number; unidad: string; vTransferido: number; vDiluyente: number; tubos: number }): Solucion {
  const factor = (d.vTransferido + d.vDiluyente) / d.vTransferido;
  const respuestas: Respuesta[] = [{ etiqueta: "Factor de dilución por tubo", valor: factor, unidad: "veces" }];
  const pasos = [
    `En cada tubo: ${n(d.vTransferido)} mL que llegan + ${n(d.vDiluyente)} mL de diluyente = ${n(d.vTransferido + d.vDiluyente)} mL. Factor = ${n(factor)} (dilución 1/${n(factor)}).`,
  ];
  let c = d.c0;
  for (let i = 1; i <= d.tubos; i++) {
    c = c / factor;
    respuestas.push({ etiqueta: `Tubo ${i}`, valor: c, unidad: d.unidad });
    pasos.push(`Tubo ${i}: dilución total 1/${n(Math.pow(factor, i))} → ${n(c)} ${d.unidad}`);
  }
  return { respuestas, pasos };
}

/** ¿Cuántas diluciones seriadas hacen falta para llegar a una concentración? */
export function seriadaHasta(d: { c0: number; factor: number; objetivo: number; unidad: string }): Solucion {
  const k = log10(d.c0 / d.objetivo) / log10(d.factor);
  const pasos = [`Cada paso divide entre ${d.factor}. Se busca k tal que ${n(d.c0)} / ${d.factor}^k = ${n(d.objetivo)}.`];
  let c = d.c0;
  for (let i = 1; i <= Math.round(k); i++) {
    c /= d.factor;
    pasos.push(`Dilución ${i}: ${n(c, 6)} ${d.unidad}`);
  }
  return { respuestas: [{ etiqueta: "Número de diluciones", valor: Math.round(k), unidad: "diluciones" }], pasos };
}

/** Pesada en un matraz y luego una alícuota a otro matraz */
export function pesadaYAlicuota(d: { mg: number; v1: number; alicuota: number; v2: number }): Solucion {
  const ci = (d.mg / d.v1) * 1000; // µg/mL
  const fd = d.v2 / d.alicuota;
  const cf = ci / fd;
  return {
    respuestas: [
      { etiqueta: "Concentración inicial", valor: ci, unidad: "µg/mL" },
      { etiqueta: "Factor de dilución", valor: fd, unidad: "veces" },
      { etiqueta: "Concentración final", valor: cf, unidad: "µg/mL" },
    ],
    pasos: [
      `Concentración inicial: ${n(d.mg)} mg / ${n(d.v1)} mL = ${n(d.mg / d.v1)} mg/mL = ${n(ci)} µg/mL`,
      `Factor de dilución: volumen final / alícuota = ${n(d.v2)} / ${n(d.alicuota)} = ${n(fd)}`,
      `Concentración final: ${n(ci)} / ${n(fd)} = ${n(cf)} µg/mL`,
    ],
  };
}

/** Mezcla de soluciones del mismo soluto (más agua opcional) */
export function mezcla(d: { partes: { v: number; c: number }[]; agua?: number; unidad: string }): Solucion {
  const soluto = d.partes.reduce((s, p) => s + p.v * p.c, 0);
  const vt = d.partes.reduce((s, p) => s + p.v, 0) + (d.agua ?? 0);
  const cf = soluto / vt;
  return {
    respuestas: [{ etiqueta: "Concentración final", valor: cf, unidad: d.unidad }],
    pasos: [
      "Se suma la cantidad de soluto de cada solución (C × V) y se divide entre el volumen total.",
      `Soluto total: ${d.partes.map((p) => `${n(p.c)} × ${n(p.v)}`).join(" + ")} = ${n(soluto)}`,
      `Volumen total: ${d.partes.map((p) => n(p.v)).join(" + ")}${d.agua ? ` + ${n(d.agua)} (agua)` : ""} = ${n(vt)} mL`,
      `C final = ${n(soluto)} / ${n(vt)} = ${n(cf)} ${d.unidad}`,
    ],
  };
}

/** ¿Cuánto de una solución concentrada hay que agregar a otra diluida para llegar a Cf? */
export function agregarParaConcentrar(d: { c1: number; v2: number; c2: number; cf: number; unidad: string }): Solucion {
  const v = (d.v2 * (d.cf - d.c2)) / (d.c1 - d.cf);
  return {
    respuestas: [{ etiqueta: "Volumen a agregar", valor: v, unidad: "mL" }],
    pasos: [
      "Balance de soluto con volúmenes aditivos: C₁·V + C₂·V₂ = Cf·(V + V₂).",
      `Se despeja V = V₂·(Cf − C₂) / (C₁ − Cf)`,
      `V = ${n(d.v2)} × (${n(d.cf)} − ${n(d.c2)}) / (${n(d.c1)} − ${n(d.cf)}) = ${n(v)} mL`,
    ],
  };
}

/* =========================================================
   2. Preparar desde sólido o desde reactivo concentrado
   ========================================================= */

export function masaParaMolar(d: { M: number; vmL: number; pm: number; unidadM?: string }): Solucion {
  const g = d.M * (d.vmL / 1000) * d.pm;
  return {
    respuestas: [{ etiqueta: "Masa a pesar", valor: g, unidad: "g" }],
    pasos: [
      "masa = Molaridad × Volumen (L) × Peso molecular",
      `m = ${n(d.M)} mol/L × ${n(d.vmL / 1000)} L × ${n(d.pm)} g/mol = ${n(g)} g`,
    ],
  };
}

export function molaridadDesdeMasa(d: { g: number; pm: number; vmL: number }): Solucion {
  const mol = d.g / d.pm;
  const M = mol / (d.vmL / 1000);
  return {
    respuestas: [{ etiqueta: "Molaridad", valor: M, unidad: "M" }],
    pasos: [`Moles = ${n(d.g)} g / ${n(d.pm)} g/mol = ${n(mol)} mol`, `M = ${n(mol)} mol / ${n(d.vmL / 1000)} L = ${n(M)} M`],
  };
}

const molaridadConcentrado = (densidad: number, pureza: number, pm: number) => (densidad * 1000 * (pureza / 100)) / pm;

/** Reactivo concentrado (densidad y % p/p) que se diluye */
export function concentradoDiluido(d: { densidad: number; pureza: number; pm: number; vTomado: number; vFinal: number }): Solucion {
  const Mc = molaridadConcentrado(d.densidad, d.pureza, d.pm);
  const Mf = (Mc * d.vTomado) / d.vFinal;
  return {
    respuestas: [
      { etiqueta: "Molaridad del concentrado", valor: Mc, unidad: "M" },
      { etiqueta: "Molaridad final", valor: Mf, unidad: "M" },
    ],
    pasos: [
      "Primero se calcula la molaridad del reactivo concentrado: M = (densidad × 1000 × % p/p ÷ 100) / PM.",
      `M conc. = (${n(d.densidad)} g/mL × 1000 mL × ${n(d.pureza / 100)}) / ${n(d.pm)} g/mol = ${n(Mc)} M`,
      `Luego C₁·V₁ = C₂·V₂: ${n(Mc)} M × ${n(d.vTomado)} mL / ${n(d.vFinal)} mL = ${n(Mf)} M`,
    ],
  };
}

/** Volumen de reactivo concentrado para preparar una solución normal o molar */
export function volumenConcentrado(d: { densidad: number; pureza: number; pm: number; eq: number; vFinalmL: number; objetivo: number; unidad: "N" | "M" }): Solucion {
  const Mc = molaridadConcentrado(d.densidad, d.pureza, d.pm);
  const Cc = d.unidad === "N" ? Mc * d.eq : Mc;
  const v = (d.objetivo * d.vFinalmL) / Cc;
  const pasos = [`M conc. = (${n(d.densidad)} × 1000 × ${n(d.pureza / 100)}) / ${n(d.pm)} = ${n(Mc)} M`];
  if (d.unidad === "N") pasos.push(`Normalidad = M × equivalentes por mol = ${n(Mc)} × ${d.eq} = ${n(Cc)} N`);
  pasos.push(`V = (${n(d.objetivo)} ${d.unidad} × ${n(d.vFinalmL)} mL) / ${n(Cc)} ${d.unidad} = ${n(v)} mL`, "Siempre se agrega el ácido sobre el agua, nunca al revés.");
  return { respuestas: [{ etiqueta: "Volumen de reactivo concentrado", valor: v, unidad: "mL" }], pasos };
}

/** Gramos de sal por litro para tener cierta cantidad de un ion por mL */
export function salParaIon(d: { mgPorMl: number; pmSal: number; pmIon: number; ion: string }): Solucion {
  const gL = d.mgPorMl;
  const g = (gL * d.pmSal) / d.pmIon;
  return {
    respuestas: [{ etiqueta: "Masa de sal por litro", valor: g, unidad: "g" }],
    pasos: [
      `${n(d.mgPorMl)} mg/mL de ${d.ion} equivalen a ${n(gL)} g por litro.`,
      `Cada mol de sal aporta un mol de ${d.ion}: factor = PM sal / PM ion = ${n(d.pmSal)} / ${n(d.pmIon)} = ${n(d.pmSal / d.pmIon)}`,
      `Masa de sal = ${n(gL)} g × ${n(d.pmSal / d.pmIon)} = ${n(g)} g`,
    ],
  };
}

/** Masa de sal para preparar una solución con X ppm de un elemento */
export function salParaPpm(d: { ppm: number; vmL: number; pmSal: number; pmElemento: number; atomos?: number; elemento: string }): Solucion {
  const at = d.atomos ?? 1;
  const mgElem = d.ppm * (d.vmL / 1000);
  const mgSal = (mgElem * d.pmSal) / (d.pmElemento * at);
  return {
    respuestas: [{ etiqueta: "Masa de sal a pesar", valor: mgSal, unidad: "mg" }],
    pasos: [
      `En solución acuosa, 1 ppm = 1 mg/L. Se necesitan ${n(d.ppm)} mg/L × ${n(d.vmL / 1000)} L = ${n(mgElem)} mg de ${d.elemento}.`,
      `Cada mol de sal contiene ${at} mol de ${d.elemento}: factor = ${n(d.pmSal)} / (${at} × ${n(d.pmElemento)}) = ${n(d.pmSal / (d.pmElemento * at))}`,
      `Masa de sal = ${n(mgElem)} mg × ${n(d.pmSal / (d.pmElemento * at))} = ${n(mgSal)} mg`,
    ],
  };
}

/** mL de una disolución molar que contienen cierta masa de soluto */
export function volumenParaMasa(d: { g: number; pm: number; M: number }): Solucion {
  const mol = d.g / d.pm;
  const mL = (mol / d.M) * 1000;
  return {
    respuestas: [{ etiqueta: "Volumen necesario", valor: mL, unidad: "mL" }],
    pasos: [`Moles = ${n(d.g)} g / ${n(d.pm)} g/mol = ${n(mol)} mol`, `V = ${n(mol)} mol / ${n(d.M)} mol/L = ${n(mol / d.M)} L = ${n(mL)} mL`],
  };
}

/* =========================================================
   3. Normalidad y equivalentes
   ========================================================= */

/** Volumen de solución molar para preparar una solución normal (redox o ácido-base) */
export function normalDesdeMolar(d: { M: number; eq: number; vmL: number; N: number; motivo: string }): Solucion {
  const Nstock = d.M * d.eq;
  const v = (d.N * d.vmL) / Nstock;
  return {
    respuestas: [
      { etiqueta: "Normalidad de la solución de partida", valor: Nstock, unidad: "N" },
      { etiqueta: "Volumen a tomar", valor: v, unidad: "mL" },
    ],
    pasos: [
      `Equivalentes por mol: ${d.eq} (${d.motivo}).`,
      `N de partida = M × eq = ${n(d.M)} × ${d.eq} = ${n(Nstock)} N`,
      `V₁ = (${n(d.N)} N × ${n(d.vmL)} mL) / ${n(Nstock)} N = ${n(v)} mL, y se completa a ${n(d.vmL)} mL.`,
    ],
  };
}

/** Normalidad de una solución que contiene X mg de un ion por mL */
export function normalidadIon(d: { mgPorMl: number; pm: number; valencia: number; ion: string }): Solucion {
  const M = d.mgPorMl / d.pm;
  const N = M * d.valencia;
  return {
    respuestas: [{ etiqueta: "Normalidad", valor: N, unidad: "N" }],
    pasos: [
      `${n(d.mgPorMl)} mg/mL = ${n(d.mgPorMl)} g/L de ${d.ion}.`,
      `M = ${n(d.mgPorMl)} g/L / ${n(d.pm)} g/mol = ${n(M)} M`,
      `N = M × valencia = ${n(M)} × ${d.valencia} = ${n(N)} N`,
    ],
  };
}

/** Normalidad redox a partir de una masa disuelta */
export function normalidadRedox(d: { g: number; pm: number; vmL: number; electrones: number }): Solucion {
  const M = d.g / d.pm / (d.vmL / 1000);
  const N = M * d.electrones;
  return {
    respuestas: [
      { etiqueta: "Molaridad", valor: M, unidad: "M" },
      { etiqueta: "Normalidad", valor: N, unidad: "N" },
    ],
    pasos: [
      `M = (${n(d.g)} g / ${n(d.pm)} g/mol) / ${n(d.vmL / 1000)} L = ${n(M)} M`,
      `Cada mol intercambia ${d.electrones} electrones → N = ${n(M)} × ${d.electrones} = ${n(N)} N`,
    ],
  };
}

/** Mezcla de dos sales con un ion común (eq = equivalentes por mol de cada sal) */
export function mezclaIonComun(d: {
  n1: number; pm1: number; nombre1: string; eq1?: number;
  n2: number; pm2: number; nombre2: string; eq2?: number;
  vAlicuota: number; ion: string; v1?: number; v2?: number;
}): Solucion {
  const v1 = d.v1 ?? 1;
  const v2 = d.v2 ?? 1;
  const eq1 = d.eq1 ?? 1;
  const eq2 = d.eq2 ?? 1;
  const f1 = v1 / (v1 + v2);
  const f2 = v2 / (v1 + v2);
  const c1 = d.n1 * f1;
  const c2 = d.n2 * f2;
  const g1 = (c1 / eq1) * d.pm1;
  const g2 = (c2 / eq2) * d.pm2;
  const meq = (c1 + c2) * d.vAlicuota;
  return {
    respuestas: [
      { etiqueta: `${d.nombre1} en la mezcla`, valor: g1, unidad: "g/L" },
      { etiqueta: `${d.nombre2} en la mezcla`, valor: g2, unidad: "g/L" },
      { etiqueta: `${d.ion} en ${n(d.vAlicuota)} mL`, valor: meq, unidad: "mEq" },
    ],
    pasos: [
      `Al mezclar, cada solución se diluye: ${d.nombre1} queda ${n(d.n1)} × ${n(f1)} = ${n(c1)} N y ${d.nombre2} queda ${n(d.n2)} × ${n(f2)} = ${n(c2)} N.`,
      `Peso equivalente = PM / equivalentes por mol. ${d.nombre1}: ${n(c1)} Eq/L × ${n(d.pm1)}/${eq1} = ${n(g1)} g/L; ${d.nombre2}: ${n(c2)} Eq/L × ${n(d.pm2)}/${eq2} = ${n(g2)} g/L`,
      `${d.ion} total = ${n(c1)} + ${n(c2)} = ${n(c1 + c2)} Eq/L = ${n((c1 + c2) * 1000)} mEq/L`,
      `En ${n(d.vAlicuota)} mL: ${n((c1 + c2) * 1000)} mEq/L × ${n(d.vAlicuota / 1000)} L = ${n(meq)} mEq`,
    ],
  };
}

/* =========================================================
   4. ppm, porcentajes y unidades clínicas
   ========================================================= */

export function litrosConPpm(d: { g: number; ppm: number }): Solucion {
  const L = (d.g * 1000) / d.ppm;
  return {
    respuestas: [{ etiqueta: "Volumen de agua", valor: L, unidad: "L" }],
    pasos: [`1 ppm = 1 mg/L. Se tienen ${n(d.g)} g = ${n(d.g * 1000)} mg.`, `Litros = ${n(d.g * 1000)} mg / ${n(d.ppm)} mg/L = ${n(L)} L`],
  };
}

/** ppm de un contaminante en un alimento y comparación con el límite legal */
export function ppmAlimento(d: { moles: number; pm: number; gMuestra: number; limite: number; elemento: string }): Solucion {
  const mg = d.moles * d.pm * 1000;
  const ppm = mg / (d.gMuestra / 1000);
  const apto = ppm <= d.limite;
  return {
    respuestas: [{ etiqueta: `Contenido de ${d.elemento}`, valor: ppm, unidad: "ppm" }],
    eleccion: { etiqueta: "¿Es apto para consumo?", opciones: ["Sí, es apto", "No es apto"], correcta: apto ? 0 : 1 },
    pasos: [
      `Masa de ${d.elemento}: ${n(d.moles)} mol × ${n(d.pm)} g/mol = ${n(d.moles * d.pm)} g = ${n(mg)} mg`,
      `En sólidos, ppm = mg/kg: ${n(mg)} mg / ${n(d.gMuestra / 1000)} kg = ${n(ppm)} ppm`,
      `Límite legal: ${n(d.limite)} ppm → ${apto ? "está por debajo: es apto." : "lo supera: no es apto."}`,
    ],
  };
}

/** % p/v de un aminoácido → µmol/L y comparación con el valor normal */
export function porcentajeAMicromolar(d: { pct: number; pm: number; limite: number; analito: string }): Solucion {
  const mgL = d.pct * 10000;
  const umol = (mgL / d.pm) * 1000;
  const normal = umol < d.limite;
  return {
    respuestas: [{ etiqueta: `Concentración de ${d.analito}`, valor: umol, unidad: "µmol/L" }],
    eleccion: { etiqueta: "¿Es un valor normal?", opciones: ["Sí, es normal", "No, está elevado"], correcta: normal ? 0 : 1 },
    pasos: [
      `${n(d.pct)} % p/v = ${n(d.pct)} g en 100 mL = ${n(d.pct * 10)} g/L = ${n(mgL)} mg/L`,
      `µmol/L = (${n(mgL)} mg/L / ${n(d.pm)} g/mol) × 1000 = ${n(umol)} µmol/L`,
      `Se compara con el límite de ${n(d.limite)} µmol/L → ${normal ? "es normal." : "está por encima de lo normal."}`,
    ],
  };
}

/** µL de anticoagulante (o precipitante) para un volumen de sangre */
export function microlitrosReactivo(d: { pct: number; mgPorMl: number; mLSangre: number }): Solucion {
  const mgNecesarios = d.mgPorMl * d.mLSangre;
  const mgPorMlReactivo = d.pct * 10;
  const uL = (mgNecesarios / mgPorMlReactivo) * 1000;
  return {
    respuestas: [{ etiqueta: "Volumen de reactivo", valor: uL, unidad: "µL" }],
    pasos: [
      `Se necesitan ${n(d.mgPorMl)} mg/mL × ${n(d.mLSangre)} mL = ${n(mgNecesarios)} mg.`,
      `El reactivo al ${n(d.pct)} % p/v tiene ${n(d.pct)} g en 100 mL = ${n(mgPorMlReactivo)} mg/mL.`,
      `V = ${n(mgNecesarios)} mg / ${n(mgPorMlReactivo)} mg/mL = ${n(mgNecesarios / mgPorMlReactivo)} mL = ${n(uL)} µL`,
    ],
  };
}

/** ¿Qué volumen contiene más moles? a) % p/v  b) molar */
export function compararMoles(d: { vA: number; pctA: number; vB: number; MB: number; pm: number }): Solucion {
  const a = ((d.pctA / 100) * d.vA) / d.pm * 1000;
  const b = d.MB * d.vB;
  return {
    respuestas: [
      { etiqueta: "Opción a", valor: a, unidad: "mmol" },
      { etiqueta: "Opción b", valor: b, unidad: "mmol" },
    ],
    eleccion: { etiqueta: "¿Cuál contiene más moles?", opciones: ["La opción a", "La opción b"], correcta: a > b ? 0 : 1 },
    pasos: [
      `a) ${n(d.pctA)} % p/v → ${n(d.pctA)} g/100 mL × ${n(d.vA)} mL = ${n((d.pctA / 100) * d.vA)} g; ÷ ${n(d.pm)} g/mol = ${n(a)} mmol`,
      `b) ${n(d.MB)} mol/L × ${n(d.vB)} mL = ${n(b)} mmol`,
      `Tiene más moles la opción ${a > b ? "a" : "b"}.`,
    ],
  };
}

export function porcentajeDeMasa(d: { pct: number; masa: number; unidadMasa: string; unidadRespuesta: string; factor?: number }): Solucion {
  const r = (d.pct / 100) * d.masa * (d.factor ?? 1);
  return {
    respuestas: [{ etiqueta: "Masa de proteínas", valor: r, unidad: d.unidadRespuesta }],
    pasos: [`${n(d.pct)} % de ${n(d.masa)} ${d.unidadMasa} = ${n(d.pct / 100)} × ${n(d.masa)}${d.factor ? ` × ${d.factor}` : ""} = ${n(r)} ${d.unidadRespuesta}`],
  };
}

/** mEq/L ↔ mmol/L y cantidad en una alícuota */
export function electrolitos(d: { iones: { nombre: string; mEqL: number; valencia: number; pm?: number }[]; alicuotamL?: number; pedir: "mmol/L" | "mEq" | "mg" }): Solucion {
  const respuestas: Respuesta[] = [];
  const pasos = ["mEq/L = mmol/L × valencia. Para iones monovalentes ambos valores coinciden."];
  for (const i of d.iones) {
    const mmolL = i.mEqL / i.valencia;
    if (d.pedir === "mmol/L") {
      respuestas.push({ etiqueta: i.nombre, valor: mmolL, unidad: "mmol/L" });
      pasos.push(`${i.nombre}: ${n(i.mEqL)} mEq/L ÷ ${i.valencia} = ${n(mmolL)} mmol/L`);
    } else if (d.pedir === "mEq") {
      const v = (i.mEqL * (d.alicuotamL ?? 0)) / 1000;
      respuestas.push({ etiqueta: i.nombre, valor: v, unidad: "mEq" });
      pasos.push(`${i.nombre}: ${n(i.mEqL)} mEq/L × ${n((d.alicuotamL ?? 0) / 1000)} L = ${n(v)} mEq`);
    } else {
      const mg = mmolL * (i.pm ?? 0) * ((d.alicuotamL ?? 0) / 1000);
      respuestas.push({ etiqueta: i.nombre, valor: mg, unidad: "mg" });
      pasos.push(`${i.nombre}: ${n(i.mEqL)} mEq/L ÷ ${i.valencia} = ${n(mmolL)} mmol/L; × ${n(i.pm ?? 0)} mg/mmol × ${n((d.alicuotamL ?? 0) / 1000)} L = ${n(mg)} mg`);
    }
  }
  return { respuestas, pasos };
}

/* =========================================================
   5. Buffers (Henderson–Hasselbalch)
   pH = pKa + log([base] / [ácido])
   ========================================================= */

const razon = (pH: number, pKa: number) => Math.pow(10, pH - pKa);
const pasoRazon = (pH: number, pKa: number) =>
  `Henderson–Hasselbalch: [base]/[ácido] = 10^(pH − pKa) = 10^(${n(pH)} − ${n(pKa)}) = ${n(razon(pH, pKa))}`;

/** Volúmenes de ácido y base conjugada (soluciones stock) para un buffer */
export function bufferVolumenes(d: { pH: number; pKa: number; vTotalmL: number; cStock: number; cFinal?: number; nombreAcido: string; nombreBase: string }): Solucion {
  const r = razon(d.pH, d.pKa);
  const fBase = r / (1 + r);
  const pasos = [pasoRazon(d.pH, d.pKa), `Fracción de base = r / (1 + r) = ${n(fBase)}; fracción de ácido = ${n(1 - fBase)}`];
  let vBase: number;
  let vAcido: number;
  if (d.cFinal && d.cFinal !== d.cStock) {
    const molTotal = d.cFinal * (d.vTotalmL / 1000);
    vBase = ((molTotal * fBase) / d.cStock) * 1000;
    vAcido = ((molTotal * (1 - fBase)) / d.cStock) * 1000;
    pasos.push(
      `Moles totales de buffer: ${n(d.cFinal)} M × ${n(d.vTotalmL / 1000)} L = ${n(molTotal)} mol`,
      `${d.nombreBase}: ${n(molTotal * fBase)} mol / ${n(d.cStock)} M = ${n(vBase)} mL`,
      `${d.nombreAcido}: ${n(molTotal * (1 - fBase))} mol / ${n(d.cStock)} M = ${n(vAcido)} mL`,
      `Se mezclan y se completa con agua hasta ${n(d.vTotalmL)} mL.`,
    );
  } else {
    vBase = d.vTotalmL * fBase;
    vAcido = d.vTotalmL - vBase;
    pasos.push(
      "Como ambas soluciones tienen la misma concentración, la razón de moles es igual a la razón de volúmenes.",
      `${d.nombreBase}: ${n(d.vTotalmL)} mL × ${n(fBase)} = ${n(vBase)} mL`,
      `${d.nombreAcido}: ${n(d.vTotalmL)} − ${n(vBase)} = ${n(vAcido)} mL`,
    );
  }
  return {
    respuestas: [
      { etiqueta: d.nombreAcido, valor: vAcido, unidad: "mL" },
      { etiqueta: d.nombreBase, valor: vBase, unidad: "mL" },
    ],
    pasos,
  };
}

/** pH de un buffer a partir de la razón base/ácido */
export function bufferPH(d: { pKa: number; base: number; acido: number; detalle: string }): Solucion {
  const pH = d.pKa + log10(d.base / d.acido);
  return {
    respuestas: [{ etiqueta: "pH", valor: pH, unidad: "" }],
    pasos: [d.detalle, `pH = pKa + log(base/ácido) = ${n(d.pKa)} + log(${n(d.base)} / ${n(d.acido)}) = ${n(d.pKa)} + (${n(log10(d.base / d.acido))}) = ${n(pH)}`],
  };
}

/** Gramos de sal (base conjugada) a añadir a una solución de ácido débil */
export function bufferGramosSal(d: { vAcidomL: number; cAcido: number; pH: number; pKa: number; pmSal: number }): Solucion {
  const r = razon(d.pH, d.pKa);
  const molAcido = d.cAcido * (d.vAcidomL / 1000);
  const molSal = molAcido * r;
  const g = molSal * d.pmSal;
  return {
    respuestas: [{ etiqueta: "Masa de sal a añadir", valor: g, unidad: "g" }],
    pasos: [
      pasoRazon(d.pH, d.pKa),
      `Moles de ácido: ${n(d.cAcido)} M × ${n(d.vAcidomL / 1000)} L = ${n(molAcido)} mol`,
      `Moles de sal = moles de ácido × razón = ${n(molAcido)} × ${n(r)} = ${n(molSal)} mol`,
      `Masa = ${n(molSal)} mol × ${n(d.pmSal)} g/mol = ${n(g)} g`,
    ],
  };
}

/** Gramos de las dos sales de un buffer (p. ej. fosfato) */
export function bufferDosSales(d: { vmL: number; c: number; pH: number; pKa: number; pmAcido: number; pmBase: number; nombreAcido: string; nombreBase: string }): Solucion {
  const r = razon(d.pH, d.pKa);
  const mol = d.c * (d.vmL / 1000);
  const molBase = (mol * r) / (1 + r);
  const molAcido = mol - molBase;
  return {
    respuestas: [
      { etiqueta: d.nombreAcido, valor: molAcido * d.pmAcido, unidad: "g" },
      { etiqueta: d.nombreBase, valor: molBase * d.pmBase, unidad: "g" },
    ],
    pasos: [
      pasoRazon(d.pH, d.pKa),
      `Moles totales: ${n(d.c)} M × ${n(d.vmL / 1000)} L = ${n(mol)} mol`,
      `${d.nombreBase}: ${n(mol)} × ${n(r)} / (1 + ${n(r)}) = ${n(molBase)} mol × ${n(d.pmBase)} g/mol = ${n(molBase * d.pmBase)} g`,
      `${d.nombreAcido}: ${n(mol)} − ${n(molBase)} = ${n(molAcido)} mol × ${n(d.pmAcido)} g/mol = ${n(molAcido * d.pmAcido)} g`,
    ],
  };
}

/** NaOH que se agrega a un ácido débil para formar el buffer */
export function bufferTitularAcido(d: { vmL: number; c: number; cNaOH: number; pH: number; pKa: number }): Solucion {
  const r = razon(d.pH, d.pKa);
  const mol = d.c * (d.vmL / 1000);
  const molBase = (mol * r) / (1 + r);
  const vNaOH = (molBase / d.cNaOH) * 1000;
  const cFinal = mol / ((d.vmL + vNaOH) / 1000);
  return {
    respuestas: [
      { etiqueta: "Volumen de NaOH", valor: vNaOH, unidad: "mL" },
      { etiqueta: "Concentración total del buffer", valor: cFinal, unidad: "M" },
    ],
    pasos: [
      pasoRazon(d.pH, d.pKa),
      `Moles de ácido iniciales: ${n(d.c)} M × ${n(d.vmL / 1000)} L = ${n(mol)} mol`,
      `Cada mol de NaOH convierte un mol de ácido en su base conjugada. Se necesita base = ${n(mol)} × ${n(r)} / (1 + ${n(r)}) = ${n(molBase)} mol`,
      `V NaOH = ${n(molBase)} mol / ${n(d.cNaOH)} M = ${n(vNaOH)} mL`,
      `Concentración total = ${n(mol)} mol / ${n((d.vmL + vNaOH) / 1000)} L = ${n(cFinal)} M`,
    ],
  };
}

/** HCl que se agrega a una base débil (Tris) para formar el buffer */
export function bufferTitularBase(d: { vmL: number; c: number; cHCl: number; pH: number; pKa: number }): Solucion {
  const r = razon(d.pH, d.pKa);
  const mol = d.c * (d.vmL / 1000);
  const molAcido = mol / (1 + r);
  const vHCl = (molAcido / d.cHCl) * 1000;
  return {
    respuestas: [{ etiqueta: "Volumen de HCl", valor: vHCl, unidad: "mL" }],
    pasos: [
      `${pasoRazon(d.pH, d.pKa)} (base = Tris, ácido = Tris-H⁺)`,
      `Moles de Tris: ${n(d.c)} M × ${n(d.vmL / 1000)} L = ${n(mol)} mol`,
      `Cada mol de HCl convierte un mol de Tris en Tris-H⁺. Se necesita Tris-H⁺ = ${n(mol)} / (1 + ${n(r)}) = ${n(molAcido)} mol`,
      `V HCl = ${n(molAcido)} mol / ${n(d.cHCl)} M = ${n(vHCl)} mL`,
    ],
  };
}

/** Preparar un buffer pesando la base (Tris, HEPES ácido…) y ajustando con ácido o base fuerte */
export function bufferPesarYAjustar(d: { vL: number; c: number; pm: number; cAjuste: number; pH: number; pKa: number; especie: "base" | "acido"; nombre: string; ajuste: string }): Solucion {
  const r = razon(d.pH, d.pKa);
  const mol = d.c * d.vL;
  const g = mol * d.pm;
  // si se pesa la base, se agrega HCl para formar el ácido conjugado; si se pesa el ácido, NaOH para formar la base
  const molAjuste = d.especie === "base" ? mol / (1 + r) : (mol * r) / (1 + r);
  const v = (molAjuste / d.cAjuste) * 1000;
  return {
    respuestas: [
      { etiqueta: `Masa de ${d.nombre}`, valor: g, unidad: "g" },
      { etiqueta: `Volumen de ${d.ajuste}`, valor: v, unidad: "mL" },
    ],
    pasos: [
      `Moles de ${d.nombre}: ${n(d.c)} M × ${n(d.vL)} L = ${n(mol)} mol → ${n(mol)} × ${n(d.pm)} g/mol = ${n(g)} g`,
      pasoRazon(d.pH, d.pKa),
      d.especie === "base"
        ? `El ${d.ajuste} convierte base en ácido conjugado: ácido = ${n(mol)} / (1 + ${n(r)}) = ${n(molAjuste)} mol`
        : `El ${d.ajuste} convierte ácido en base conjugada: base = ${n(mol)} × ${n(r)} / (1 + ${n(r)}) = ${n(molAjuste)} mol`,
      `V ${d.ajuste} = ${n(molAjuste)} mol / ${n(d.cAjuste)} M = ${n(v)} mL (valor aproximado; el ajuste fino se hace con pH-metro).`,
    ],
  };
}

/** pH de un buffer después de agregar ácido o base fuertes, comparado con agua */
export function bufferMasFuerte(d: { vmL: number; cTotal: number; pH0: number; pKa: number; vAdd: number; cAdd: number }): Solucion {
  const r0 = razon(d.pH0, d.pKa);
  const mmol = d.cTotal * d.vmL;
  const base0 = (mmol * r0) / (1 + r0);
  const acido0 = mmol - base0;
  const add = d.vAdd * d.cAdd;
  const pHacido = d.pKa + log10((base0 - add) / (acido0 + add));
  const pHbase = d.pKa + log10((base0 + add) / (acido0 - add));
  const hAgua = add / (d.vmL + d.vAdd);
  const pHaguaAcido = -log10(hAgua);
  return {
    respuestas: [
      { etiqueta: "pH al agregar HCl", valor: pHacido, unidad: "" },
      { etiqueta: "pH al agregar NaOH", valor: pHbase, unidad: "" },
    ],
    pasos: [
      `Buffer inicial: ${n(d.cTotal)} M × ${n(d.vmL)} mL = ${n(mmol)} mmol totales → base = ${n(base0)} mmol, ácido = ${n(acido0)} mmol`,
      `Se agregan ${n(d.vAdd)} mL × ${n(d.cAdd)} M = ${n(add)} mmol.`,
      `Con HCl (la base lo neutraliza): pH = ${n(d.pKa)} + log((${n(base0)} − ${n(add)}) / (${n(acido0)} + ${n(add)})) = ${n(pHacido)}`,
      `Con NaOH (el ácido lo neutraliza): pH = ${n(d.pKa)} + log((${n(base0)} + ${n(add)}) / (${n(acido0)} − ${n(add)})) = ${n(pHbase)}`,
      `En agua pura la misma cantidad daría [H⁺] = ${n(add)} mmol / ${n(d.vmL + d.vAdd)} mL = ${n(hAgua)} M → pH ${n(pHaguaAcido)} con ácido y pH ${n(14 - pHaguaAcido)} con base. El buffer casi no cambia; el agua cambia varias unidades.`,
    ],
  };
}

/** mmol de ácido o base fuertes que tolera un buffer antes de cambiar `delta` unidades de pH */
export function bufferCapacidad(d: { vmL: number; cTotal: number; pH0: number; pKa: number; delta: number; con: "NaOH" | "HCl" }): Solucion {
  const mmol = d.cTotal * d.vmL;
  const r0 = razon(d.pH0, d.pKa);
  const base0 = (mmol * r0) / (1 + r0);
  const pHf = d.con === "NaOH" ? d.pH0 + d.delta : d.pH0 - d.delta;
  const rf = razon(pHf, d.pKa);
  const basef = (mmol * rf) / (1 + rf);
  const x = Math.abs(basef - base0);
  return {
    respuestas: [{ etiqueta: `mmol de ${d.con} que puede neutralizar`, valor: x, unidad: "mmol" }],
    pasos: [
      `Buffer: ${n(d.cTotal)} M × ${n(d.vmL)} mL = ${n(mmol)} mmol totales; a pH ${n(d.pH0)} la base es ${n(base0)} mmol y el ácido ${n(mmol - base0)} mmol.`,
      `Límite: pH ${n(pHf)} → base/ácido = 10^(${n(pHf)} − ${n(d.pKa)}) = ${n(rf)} → base = ${n(basef)} mmol`,
      `Cambio en la base = |${n(basef)} − ${n(base0)}| = ${n(x)} mmol de ${d.con}`,
    ],
  };
}

/** HCl adicional hasta el límite de capacidad de una alícuota de buffer */
export function bufferSaturar(d: { vmL: number; cTotal: number; pKa: number; pH0: number; yaAgregadoMmol: number; pHLimite: number; cHCl: number }): Solucion {
  const mmol = d.cTotal * d.vmL;
  const r0 = razon(d.pH0, d.pKa);
  const base0 = (mmol * r0) / (1 + r0);
  const rl = razon(d.pHLimite, d.pKa);
  const basel = (mmol * rl) / (1 + rl);
  const totalHCl = base0 - basel;
  const extra = totalHCl - d.yaAgregadoMmol;
  return {
    respuestas: [{ etiqueta: "HCl adicional", valor: extra / d.cHCl, unidad: "mL" }],
    pasos: [
      `Base inicial: ${n(base0)} mmol. A pH ${n(d.pHLimite)}: base/ácido = ${n(rl)} → base = ${n(basel)} mmol`,
      `HCl total para llegar al límite: ${n(base0)} − ${n(basel)} = ${n(totalHCl)} mmol`,
      `Ya se agregaron ${n(d.yaAgregadoMmol)} mmol → faltan ${n(extra)} mmol = ${n(extra / d.cHCl)} mL de HCl ${n(d.cHCl)} M`,
    ],
  };
}

/** pH de un buffer dado por su razón base:ácido y pH tras agregar ácido o base fuertes */
export function bufferRazonMasFuerte(d: { pKa: number; base: number; acido: number; cTotal: number; vL: number; mEq: number; con: "HCl" | "NaOH" }): Solucion {
  const pH0 = d.pKa + log10(d.base / d.acido);
  const mmol = d.cTotal * d.vL * 1000;
  const b0 = (mmol * d.base) / (d.base + d.acido);
  const a0 = mmol - b0;
  const b1 = d.con === "HCl" ? b0 - d.mEq : b0 + d.mEq;
  const a1 = d.con === "HCl" ? a0 + d.mEq : a0 - d.mEq;
  const pH1 = d.pKa + log10(b1 / a1);
  return {
    respuestas: [
      { etiqueta: "pH inicial", valor: pH0, unidad: "" },
      { etiqueta: `pH tras agregar ${d.con}`, valor: pH1, unidad: "" },
    ],
    pasos: [
      `pH inicial = ${n(d.pKa)} + log(${d.base}/${d.acido}) = ${n(pH0)}`,
      `En ${n(d.vL)} L de buffer ${n(d.cTotal)} M hay ${n(mmol)} mmol: base = ${n(b0)} mmol, ácido = ${n(a0)} mmol`,
      d.con === "HCl"
        ? `El HCl consume base y forma ácido: base = ${n(b0)} − ${n(d.mEq)} = ${n(b1)}; ácido = ${n(a0)} + ${n(d.mEq)} = ${n(a1)}`
        : `El NaOH consume ácido y forma base: base = ${n(b0)} + ${n(d.mEq)} = ${n(b1)}; ácido = ${n(a0)} − ${n(d.mEq)} = ${n(a1)}`,
      `Nuevo pH = ${n(d.pKa)} + log(${n(b1)}/${n(a1)}) = ${n(pH1)}`,
    ],
  };
}

/** Volumen de una solución en % p/v para preparar una solución molar */
export function volumenDesdePorcentaje(d: { pct: number; pm: number; M: number; vmL: number }): Solucion {
  const Mstock = (d.pct * 10) / d.pm;
  const v = (d.M * d.vmL) / Mstock;
  return {
    respuestas: [
      { etiqueta: "Molaridad de la solución concentrada", valor: Mstock, unidad: "M" },
      { etiqueta: "Volumen a tomar", valor: v, unidad: "mL" },
    ],
    pasos: [
      `${n(d.pct)} % p/v = ${n(d.pct * 10)} g/L → M = ${n(d.pct * 10)} / ${n(d.pm)} = ${n(Mstock)} M`,
      `V₁ = (${n(d.M)} M × ${n(d.vmL)} mL) / ${n(Mstock)} M = ${n(v)} mL, y se completa a ${n(d.vmL)} mL.`,
    ],
  };
}

/** Ejercicio de diseño: no tiene una única respuesta numérica */
export function abierto(pasos: string[]): Solucion {
  return { respuestas: [], pasos };
}
