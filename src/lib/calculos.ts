import type { ConfigCalculo, TipoCalculo } from "./types";

/* ---------- utilidades estadísticas ---------- */

export interface Estadistica {
  n: number;
  promedio: number;
  desviacion: number;
  cv: number;
}

export function estadistica(valores: number[]): Estadistica {
  const n = valores.length;
  if (n === 0) return { n: 0, promedio: NaN, desviacion: NaN, cv: NaN };
  const promedio = valores.reduce((s, x) => s + x, 0) / n;
  const desviacion =
    n > 1 ? Math.sqrt(valores.reduce((s, x) => s + (x - promedio) ** 2, 0) / (n - 1)) : 0;
  const cv = promedio !== 0 ? (desviacion / promedio) * 100 : 0;
  return { n, promedio, desviacion, cv };
}

/** Porcentaje de error respecto a un valor de referencia */
export function porcentajeError(obtenido: number, referencia: number): number {
  return (Math.abs(obtenido - referencia) / referencia) * 100;
}

/** C1·V1 = C2·V2 → devuelve V1 */
export function volumenDilucion(c1: number, c2: number, v2: number): number {
  return (c2 * v2) / c1;
}

/** Masa (g) de soluto para una solución molar: m = M · V(L) · PM */
export function masaSolucionMolar(molaridad: number, volumenMl: number, pesoMolecular: number): number {
  return molaridad * (volumenMl / 1000) * pesoMolecular;
}

/** Regresión lineal por mínimos cuadrados (para curvas de calibración) */
export function regresionLineal(x: number[], y: number[]) {
  const n = x.length;
  const mx = x.reduce((a, b) => a + b, 0) / n;
  const my = y.reduce((a, b) => a + b, 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) {
    sxy += (x[i] - mx) * (y[i] - my);
    sxx += (x[i] - mx) ** 2;
    syy += (y[i] - my) ** 2;
  }
  const pendiente = sxy / sxx;
  const intercepto = my - pendiente * mx;
  const r2 = (sxy * sxy) / (sxx * syy);
  return { pendiente, intercepto, r2, interpolar: (yDesconocido: number) => (yDesconocido - intercepto) / pendiente };
}

/* ---------- calculadoras por tipo de práctica ---------- */

export interface FilaCalculo {
  entrada: number;
  desarrollo: string;
  resultado: number;
}

export interface ResultadoCalculo extends Estadistica {
  filas: FilaCalculo[];
  unidad: string;
  /** Resultado expresado en otra unidad habitual */
  secundario?: { valor: number; unidad: string };
}

interface Calculadora {
  formula: string;
  leyenda: (p: Record<string, number>) => string;
  entradaNombre: string;
  entradaUnidad: string;
  /** Frase con los números del resultado, para iniciar la conclusión */
  frase: (r: ResultadoCalculo) => string;
  calcular: (valores: number[], p: Record<string, number>) => ResultadoCalculo;
}

const f = (x: number, d = 2) => formatear(x, d);

export const CALCULADORAS: Record<TipoCalculo, Calculadora> = {
  "acidez-titulable": {
    formula: "% ácido láctico = (V NaOH × N × 0,09 × 100) / V muestra",
    leyenda: (p) =>
      `N = ${f(p.normalidad, 1)} · V muestra = ${p.volumenMuestra} mL · 0,09 = miliequivalente del ácido láctico (g)`,
    entradaNombre: "V NaOH",
    entradaUnidad: "mL",
    frase: (r) =>
      `La acidez titulable de la muestra fue de ${formatear(r.promedio, 3)} % expresada como ácido láctico` +
      (r.secundario ? ` (${formatear(r.secundario.valor, 1)} ${r.secundario.unidad})` : "") +
      `, con un coeficiente de variación de ${formatear(r.cv, 1)} % entre ${r.n} repeticiones. `,
    calcular(valores, p) {
      const filas = valores.map((v) => {
        const r = (v * p.normalidad * p.meq * 100) / p.volumenMuestra;
        return {
          entrada: v,
          desarrollo: `${f(v)} × ${f(p.normalidad, 1)} × 0,09 × 100 / ${p.volumenMuestra}`,
          resultado: r,
        };
      });
      const est = estadistica(filas.map((x) => x.resultado));
      return {
        ...est,
        filas,
        unidad: "% ácido láctico",
        // 1 °Dornic = 0,01 % de ácido láctico
        secundario: { valor: est.promedio * 100, unidad: "°Dornic" },
      };
    },
  },
};

/** Lee los datos anotados por el estudiante; si no hay, usa los de ejemplo */
export function obtenerValores(config: ConfigCalculo, datos: Record<string, string>) {
  const anotados = config.entradas
    .map((id) => parseNumero(datos[id]))
    .filter((x): x is number => x !== null);
  const esEjemplo = anotados.length === 0;
  return { valores: esEjemplo ? config.ejemplo : anotados, esEjemplo };
}

export function ejecutarCalculo(config: ConfigCalculo, datos: Record<string, string>) {
  const { valores, esEjemplo } = obtenerValores(config, datos);
  const calc = CALCULADORAS[config.tipo];
  return { calc, resultado: calc.calcular(valores, config.params), esEjemplo };
}

/* ---------- formato ---------- */

export function parseNumero(texto: string | undefined): number | null {
  if (texto === undefined || texto.trim() === "") return null;
  const n = parseFloat(texto.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export function formatear(x: number, decimales = 3): string {
  if (!Number.isFinite(x)) return "—";
  return x.toLocaleString("es-BO", { minimumFractionDigits: decimales, maximumFractionDigits: decimales });
}
