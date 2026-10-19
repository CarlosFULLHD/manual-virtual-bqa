import * as S from "@/lib/soluciones";
import type { Solucion } from "@/lib/soluciones";

/**
 * Banco de ejercicios de preparación de soluciones, diluciones y buffers.
 * Enunciados tomados de los tres documentos de la cátedra:
 *   L2 = "Laboratorio 2. Preparación de soluciones y buffers"
 *   E2 = "Ejercicios: prep. buffers y diluciones"
 *   P  = "Práctica: factores de conversión, preparación de soluciones"
 * La respuesta de cada ejercicio la calcula su resolutor (src/lib/soluciones.ts).
 */

export type Fuente = "Laboratorio 2" | "Ejercicios 2" | "Práctica";

export interface Ejercicio {
  id: string;
  fuente: Fuente;
  numero: number;
  /** id de la lección a la que pertenece */
  leccion: string;
  enunciado: string;
  /** Dato que se asumió porque el enunciado no lo trae */
  nota?: string;
  resolver: () => Solucion;
}

const L2 = "Laboratorio 2" as const;
const E2 = "Ejercicios 2" as const;
const P = "Práctica" as const;
const ej = (fuente: Fuente, numero: number, leccion: string, enunciado: string, resolver: () => Solucion, nota?: string): Ejercicio => ({
  id: `${fuente === L2 ? "L2" : fuente === E2 ? "E2" : "P"}-${numero}`,
  fuente,
  numero,
  leccion,
  enunciado,
  resolver,
  nota,
});

// Datos habituales de reactivos concentrados (aparecen en los propios ejercicios)
const HNO3 = { densidad: 1.4, pureza: 65, pm: 63 };
const H2SO4 = { densidad: 1.84, pureza: 96, pm: 98 };
const H3PO4 = { densidad: 1.7, pureza: 85, pm: 98 };
const HCl = { densidad: 1.19, pureza: 37, pm: 36.5 };

export const EJERCICIOS: Ejercicio[] = [
  /* ---------------- Unidades, ppm y unidades clínicas ---------------- */
  ej(L2, 21, "unidades", "Si el agua contiene 0,5 ppm de NaClO (hipoclorito de sodio), ¿cuántos litros de agua se pueden tratar con 4,72 g de NaClO?", () => S.litrosConPpm({ g: 4.72, ppm: 0.5 })),
  ej(L2, 22, "unidades", "Si un agua mineral contiene 2 ppm de CaCO₃, ¿cuántos litros de agua contienen 0,5 g de CaCO₃?", () => S.litrosConPpm({ g: 0.5, ppm: 2 })),
  ej(P, 11, "unidades", "Si el agua potable contiene 0,5 ppm de KF (PM = 58,1 g/mol), ¿cuántos litros de agua se pueden fluorar con 5,81 g de KF?", () => S.litrosConPpm({ g: 5.81, ppm: 0.5 })),
  ej(P, 39, "unidades", "Si el agua potable contiene 3 ppm de NaHCO₃ (PM = 84 g/mol), ¿cuántos litros de agua se pueden tratar con 25,2 g de NaHCO₃?", () => S.litrosConPpm({ g: 25.2, ppm: 3 })),
  ej(L2, 24, "unidades", "Una muestra de suero tiene 140 mEq/L de Na⁺ y 100 mEq/L de Cl⁻. ¿Cuántos mmol/L de cada ion están presentes si ambos son monovalentes?", () =>
    S.electrolitos({ iones: [{ nombre: "Na⁺", mEqL: 140, valencia: 1 }, { nombre: "Cl⁻", mEqL: 100, valencia: 1 }], pedir: "mmol/L" })),
  ej(P, 12, "unidades", "Un fotómetro de llama analiza una solución de suero fisiológico. Si el suero contiene 142 mEq/L de Na⁺ y 103 mEq/L de Cl⁻, ¿cuántos mEq de cada ion habrá en una alícuota de 2 mL?", () =>
    S.electrolitos({ iones: [{ nombre: "Na⁺", mEqL: 142, valencia: 1 }, { nombre: "Cl⁻", mEqL: 103, valencia: 1 }], alicuotamL: 2, pedir: "mEq" })),
  ej(P, 40, "unidades", "Un analizador de electrolitos reporta los resultados en mEq/L. Si se analiza un suero con 4,5 mEq/L de K⁺ y 2,3 mEq/L de Ca²⁺, ¿cuántos mg de cada ion hay en 10 mL de suero? (PM K = 39,1; PM Ca = 40,08 g/mol)", () =>
    S.electrolitos({ iones: [{ nombre: "K⁺", mEqL: 4.5, valencia: 1, pm: 39.1 }, { nombre: "Ca²⁺", mEqL: 2.3, valencia: 2, pm: 40.08 }], alicuotamL: 10, pedir: "mg" })),
  ej(L2, 25, "unidades", "¿Qué volumen de disolución contiene mayor número de moles de glucosa? a) 20 mL de glucosa al 5 % p/v. b) 30 mL de glucosa 0,1 M.", () => S.compararMoles({ vA: 20, pctA: 5, vB: 30, MB: 0.1, pm: 180.16 }), "PM glucosa = 180,16 g/mol"),
  ej(L2, 26, "unidades", "¿Qué volumen de disolución contiene mayor número de moles de HCl? a) 15 mL de HCl al 2 % p/v. b) 10 mL de HCl 0,05 M.", () => S.compararMoles({ vA: 15, pctA: 2, vB: 10, MB: 0.05, pm: 36.5 }), "PM HCl = 36,5 g/mol"),
  ej(P, 13, "unidades", "¿Qué volumen de disolución contiene mayor número de moles de KOH? a) 15 mL de KOH al 5 % p/v. b) 30 mL de KOH 0,25 M. (PM KOH = 56 g/mol)", () => S.compararMoles({ vA: 15, pctA: 5, vB: 30, MB: 0.25, pm: 56 })),
  ej(P, 41, "unidades", "¿Qué volumen de disolución contiene mayor número de moles de HCl? a) 20 mL de HCl al 3 % p/v. b) 40 mL de HCl 0,1 M. (PM HCl = 36,5 g/mol)", () => S.compararMoles({ vA: 20, pctA: 3, vB: 40, MB: 0.1, pm: 36.5 })),
  ej(L2, 27, "unidades", "¿Cuántos μL de heparina al 5 % se deben utilizar para anticoagular 3 mL de sangre, si la concentración de heparina debe ser de 0,5 mg por mL de sangre?", () => S.microlitrosReactivo({ pct: 5, mgPorMl: 0.5, mLSangre: 3 })),
  ej(L2, 28, "unidades", "¿Cuántos μL de citrato de sodio al 3,8 % p/v se necesitan para anticoagular 4 mL de sangre si se requiere 1 mg de citrato por mL de sangre?", () => S.microlitrosReactivo({ pct: 3.8, mgPorMl: 1, mLSangre: 4 })),
  ej(P, 14, "unidades", "¿Cuántos μL de anticoagulante al 8 % p/v de citrato de sodio se deben usar para extraer 4 mL de sangre, de tal forma que la concentración de citrato por mL de sangre sea de 1,5 mg?", () => S.microlitrosReactivo({ pct: 8, mgPorMl: 1.5, mLSangre: 4 })),
  ej(P, 42, "unidades", "¿Cuántos μL de solución al 12 % p/v de oxalato de amonio se deben usar para precipitar el calcio de 3 mL de sangre, si se requiere 2 mg de oxalato por mL de sangre?", () => S.microlitrosReactivo({ pct: 12, mgPorMl: 2, mLSangre: 3 })),
  ej(L2, 29, "unidades", "La tirosina se encuentra normalmente en plasma a concentraciones inferiores a 100 μmol/L. Si una muestra tiene 0,001 % p/v de tirosina, ¿la considerarías normal?", () => S.porcentajeAMicromolar({ pct: 0.001, pm: 181.19, limite: 100, analito: "tirosina" }), "PM tirosina = 181,19 g/mol"),
  ej(L2, 30, "unidades", "La leucina se encuentra normalmente en plasma a menos de 200 μmol/L. Una muestra tiene 0,003 % p/v de leucina. ¿La considerarías normal?", () => S.porcentajeAMicromolar({ pct: 0.003, pm: 131.17, limite: 200, analito: "leucina" }), "PM leucina = 131,17 g/mol"),
  ej(P, 15, "unidades", "La leucina es un aminoácido esencial que en plasma normal se encuentra a menos de 155 μmol/L (PM = 131 g/mol). Una muestra tiene 0,0018 % p/v de leucina. ¿Es un valor normal?", () => S.porcentajeAMicromolar({ pct: 0.0018, pm: 131, limite: 155, analito: "leucina" })),
  ej(P, 43, "unidades", "La valina es un aminoácido esencial que en plasma normal se encuentra a menos de 310 μmol/L (PM = 117 g/mol). Una muestra tiene 0,003 % p/v de valina. ¿Es normal?", () => S.porcentajeAMicromolar({ pct: 0.003, pm: 117, limite: 310, analito: "valina" })),
  ej(L2, 31, "unidades", "Se analizó una muestra de 50 g de harina de pescado y se encontró que el contenido de plomo era de 1,2 × 10⁻⁵ moles. Si el límite legal es 0,3 ppm, ¿se puede consumir?", () => S.ppmAlimento({ moles: 1.2e-5, pm: 207.2, gMuestra: 50, limite: 0.3, elemento: "plomo" }), "PM Pb = 207,2 g/mol"),
  ej(L2, 32, "unidades", "Una muestra de 30 g de arroz contiene 8,5 × 10⁻⁶ moles de cadmio. Si el límite legal es 0,1 ppm, ¿es apto para consumo?", () => S.ppmAlimento({ moles: 8.5e-6, pm: 112.41, gMuestra: 30, limite: 0.1, elemento: "cadmio" }), "PM Cd = 112,41 g/mol"),
  ej(P, 16, "unidades", "Se analizó una muestra de 40 g de atún y se encontró que el contenido de cadmio era de 4,5 × 10⁻⁵ moles. Por ley, alimentos con más de 0,1 ppm de cadmio no son aptos. ¿Es apto? (PM Cd = 112,4 g/mol)", () => S.ppmAlimento({ moles: 4.5e-5, pm: 112.4, gMuestra: 40, limite: 0.1, elemento: "cadmio" })),
  ej(P, 44, "unidades", "Se analizó una muestra de 20 g de harina de trigo y se encontró que el contenido de plomo era de 2,9 × 10⁻⁶ moles. Por ley, alimentos con más de 0,3 ppm de plomo no son aptos. ¿Es apto? (PM Pb = 207 g/mol)", () => S.ppmAlimento({ moles: 2.9e-6, pm: 207, gMuestra: 20, limite: 0.3, elemento: "plomo" })),
  ej(L2, 53, "unidades", "El trigo contiene 12 % de proteínas. ¿Cuál es la masa de proteínas en un saco de 50 kg de trigo?", () => S.porcentajeDeMasa({ pct: 12, masa: 50, unidadMasa: "kg", unidadRespuesta: "kg" })),
  ej(L2, 54, "unidades", "La quinua contiene 14,1 % de proteínas. ¿Cuántos gramos de proteínas hay en 30 kg de quinua?", () => S.porcentajeDeMasa({ pct: 14.1, masa: 30, unidadMasa: "kg", unidadRespuesta: "g", factor: 1000 })),
  ej(P, 27, "unidades", "El trigo contiene 12,5 % de proteínas. ¿Cuál es la masa de proteínas en un saco de 60 kg de trigo?", () => S.porcentajeDeMasa({ pct: 12.5, masa: 60, unidadMasa: "kg", unidadRespuesta: "kg" })),

  /* ---------------- Diluciones ---------------- */
  ej(L2, 1, "dilucion", "Se toman 50 mL de una solución de KMnO₄ de 800 mg/L y se diluyen hasta 250 mL. Calcule la concentración final en mg/L y en %.", () => S.dilucionSimple({ c1: 800, v1: 50, vf: 250, unidad: "mg/L", aPorcentaje: "mg/L" })),
  ej(L2, 2, "dilucion", "Se toman 15 mL de una solución de NaCl de 2 g/L y se diluyen hasta 150 mL. Calcule la concentración final en %.", () => S.dilucionSimple({ c1: 2, v1: 15, vf: 150, unidad: "g/L", aPorcentaje: "g/L", soloPorcentaje: true })),
  ej(P, 1, "dilucion", "Se toman 8 mL de una solución de CuSO₄ de 2500 mg/L y se diluyen hasta 200 mL. Calcule la concentración final en %.", () => S.dilucionSimple({ c1: 2500, v1: 8, vf: 200, unidad: "mg/L", aPorcentaje: "mg/L", soloPorcentaje: true })),
  ej(P, 29, "dilucion", "Se toman 12 mL de una solución de MnSO₄ de 3000 mg/L y se diluyen hasta 300 mL. Calcule la concentración final en %.", () => S.dilucionSimple({ c1: 3000, v1: 12, vf: 300, unidad: "mg/L", aPorcentaje: "mg/L", soloPorcentaje: true })),
  ej(L2, 11, "dilucion", "A partir de una solución al 40 % de ácido sulfosalicílico, preparar 200 mL de solución al 3 % para uso como desproteinizante.", () => S.volumenStock({ c1: 40, c2: 3, v2: 200, unidad: "%" })),
  ej(L2, 12, "dilucion", "A partir de una solución al 25 % de ácido perclórico, preparar 100 mL de solución al 5 % para precipitación de proteínas.", () => S.volumenStock({ c1: 25, c2: 5, v2: 100, unidad: "%" })),
  ej(P, 6, "dilucion", "A partir de una solución al 50 % de ácido tricloroacético, preparar 400 mL al 10 % para uso como desproteinizante.", () => S.volumenStock({ c1: 50, c2: 10, v2: 400, unidad: "%" })),
  ej(P, 34, "dilucion", "A partir de una solución al 20 % de ácido tricloroacético, preparar 600 mL al 10 % para uso como desproteinizante.", () => S.volumenStock({ c1: 20, c2: 10, v2: 600, unidad: "%" })),
  ej(L2, 55, "dilucion", "Se desean preparar 500 mL de ácido acético 0,1 M a partir de ácido acético glacial 17,4 M (MM = 60,0 g/mol). ¿Qué volumen en mL del ácido concentrado se necesita?", () => S.volumenStock({ c1: 17.4, c2: 0.1, v2: 500, unidad: "M" })),
  ej(L2, 56, "dilucion", "Se desean preparar 3 L de HCl 0,2 M a partir de HCl concentrado 12 M. ¿Qué volumen en mL del ácido concentrado se necesita?", () => S.volumenStock({ c1: 12, c2: 0.2, v2: 3000, unidad: "M" })),
  ej(P, 28, "dilucion", "Se desean preparar 1,5 litros de NaOH 0,1 M a partir de una solución de NaOH 6,25 M. ¿Cuántos mL son necesarios?", () => S.volumenStock({ c1: 6.25, c2: 0.1, v2: 1500, unidad: "M" })),
  ej(L2, 37, "dilucion", "Una alícuota de 50 mL de solución 0,6 M se diluye a 200 mL (sol. A). Luego 20 mL de la sol. A se diluyen a 400 mL. Calcule la molaridad de la solución final.", () => S.dobleDilucion({ c0: 0.6, a1: 50, v1: 200, a2: 20, v2: 400 })),
  ej(L2, 38, "dilucion", "Se toman 15 mL de una solución 1,2 M y se diluyen a 300 mL (sol. B). Luego 5 mL de la sol. B se diluyen a 100 mL. Calcule la molaridad final.", () => S.dobleDilucion({ c0: 1.2, a1: 15, v1: 300, a2: 5, v2: 100 })),
  ej(P, 19, "dilucion", "Una alícuota de 30 mL de una disolución 1,5 M se diluye hasta 600 mL (sol. A). Una alícuota de 25 mL de la sol. A se diluye a 500 mL. Calcule la Molaridad final.", () => S.dobleDilucion({ c0: 1.5, a1: 30, v1: 600, a2: 25, v2: 500 })),
  ej(P, 47, "dilucion", "Una alícuota de 60 mL de una disolución 0,4 M se diluye hasta 800 mL (sol. A). Una alícuota de 30 mL de la sol. A se diluye a 400 mL. Calcule la Molaridad final.", () => S.dobleDilucion({ c0: 0.4, a1: 60, v1: 800, a2: 30, v2: 400 })),
  ej(E2, 23, "dilucion", "Pesar exactamente alrededor de 25 mg de ácido ascórbico, transferir a un matraz aforado de 100 mL, disolver en agua destilada y completar a volumen. Transferir 10 mL de esta solución a un matraz aforado de 50 mL y completar a volumen con agua destilada. Hallar el factor de dilución, la concentración inicial y la concentración final.", () => S.pesadaYAlicuota({ mg: 25, v1: 100, alicuota: 10, v2: 50 })),
  ej(E2, 33, "dilucion", "Pesar exactamente alrededor de 40 mg de quercetina, transferir a un matraz aforado de 100 mL, disolver en etanol y completar a volumen. Transferir 5 mL de esta solución a un matraz aforado de 50 mL y completar a volumen con etanol. Hallar el factor de dilución, la concentración inicial y la concentración final.", () => S.pesadaYAlicuota({ mg: 40, v1: 100, alicuota: 5, v2: 50 })),

  /* ---------------- Diluciones seriadas y patrones ---------------- */
  ej(L2, 45, "seriadas", "Se preparan 6 tubos de ensayo con 2 mL de agua destilada y se traspasan 2 mL de cada tubo al siguiente a partir de una solución de azul de metileno al 5 %. ¿Cuál es la dilución en cada tubo?", () => S.seriada({ c0: 5, unidad: "%", vTransferido: 2, vDiluyente: 2, tubos: 6 })),
  ej(L2, 46, "seriadas", "Se preparan 4 tubos con 3 mL de tampón salino y se traspasan 1 mL de cada tubo al siguiente a partir de una solución de rojo Congo al 2 %. ¿Cuál es la concentración en cada tubo?", () => S.seriada({ c0: 2, unidad: "%", vTransferido: 1, vDiluyente: 3, tubos: 4 })),
  ej(P, 23, "seriadas", "Si se preparan 6 tubos con 2 mL de agua destilada y se traspasan 2 mL de cada tubo al siguiente a partir de una solución de azul de metileno al 8 %, ¿cuál sería la dilución final de cada tubo?", () => S.seriada({ c0: 8, unidad: "%", vTransferido: 2, vDiluyente: 2, tubos: 6 })),
  ej(E2, 24, "seriadas", "Partiendo de una solución madre de ácido ascórbico a 1000 μg/mL, realizar diluciones seriadas 1:10 para obtener 5 soluciones. Indicar las concentraciones finales de cada solución.", () => S.seriada({ c0: 1000, unidad: "µg/mL", vTransferido: 1, vDiluyente: 9, tubos: 5 })),
  ej(E2, 34, "seriadas", "Comenzando con una solución madre de glucosa a 200 mg/mL, realizar una serie de diluciones seriadas 1:5 para obtener 6 soluciones diluidas. Calcular las concentraciones finales de cada solución.", () => S.seriada({ c0: 200, unidad: "mg/mL", vTransferido: 1, vDiluyente: 4, tubos: 6 })),
  ej(E2, 36, "seriadas", "Realiza una serie de diluciones seriadas 1:4 comenzando con 80 mL de una solución madre de 5 M. ¿Cuántas diluciones necesitas para alcanzar una concentración de 0,078125 M?", () => S.seriadaHasta({ c0: 5, factor: 4, objetivo: 0.078125, unidad: "M" })),
  ej(L2, 49, "seriadas", "Se dispone de un patrón de glucosa de 10 g/L. Se realizan tres diluciones: 1/2, 1/10 y 1/20. Cada tubo debe contener exactamente 4 mL. a) ¿Qué volúmenes de patrón y diluyente contiene cada dilución? b) ¿Cuál es la concentración de cada dilución en g/L?", () => S.dilucionesPatron({ c0: 10, unidad: "g/L", factores: [2, 10, 20], vTubo: 4 })),
  ej(L2, 50, "seriadas", "Se tiene un patrón de proteínas de 2 g/L. Se realizan diluciones 1/4, 1/8 y 1/16. Cada tubo debe contener 3 mL. a) ¿Qué volúmenes de patrón y diluyente contiene cada dilución? b) ¿Cuál es la concentración de cada dilución en mg/mL?", () => S.dilucionesPatron({ c0: 2, unidad: "g/L", factores: [4, 8, 16], vTubo: 3, convertir: { factor: 1, unidad: "mg/mL" } })),
  ej(P, 25, "seriadas", "Se dispone de un patrón de albúmina de 80 g/L. Se realizan tres diluciones: 1/8, 1/40 y 1/80. Cada tubo debe tener 4 mL. a) ¿Qué volúmenes de patrón y diluyente contiene cada dilución? b) ¿Cuál es la concentración de cada dilución en %?", () => S.dilucionesPatron({ c0: 80, unidad: "g/L", factores: [8, 40, 80], vTubo: 4, convertir: { factor: 0.1, unidad: "% p/v" } })),
  ej(E2, 28, "seriadas", "Se realizaron diluciones de 1:10, 1:20 y 1:5 de una solución concentrada. Hallar los volúmenes para cada dilución considerando un volumen final de 5 mL.", () => S.dilucionesPatron({ c0: 1, unidad: "× la concentración inicial", factores: [10, 20, 5], vTubo: 5 })),
  ej(E2, 38, "seriadas", "Se realizaron diluciones de 1:15, 1:25 y 1:8 de una solución concentrada. Hallar los volúmenes para cada dilución considerando un volumen final de 5 mL.", () => S.dilucionesPatron({ c0: 1, unidad: "× la concentración inicial", factores: [15, 25, 8], vTubo: 5 })),
  ej(E2, 25, "seriadas", "Una solución madre de NaCl tiene una concentración de 5 M. Prepara 25 mL de una dilución 1:200. Describe el procedimiento paso a paso.", () => S.dilucionesPatron({ c0: 5, unidad: "M", factores: [200], vTubo: 25 })),
  ej(E2, 35, "seriadas", "Una solución madre de glucosa tiene una concentración de 1 M. Prepara 15 mL de una dilución 1:10. Describe el procedimiento paso a paso.", () => S.dilucionesPatron({ c0: 1, unidad: "M", factores: [10], vTubo: 15 })),
  ej(L2, 9, "seriadas", "Preparar dos soluciones estándar de hierro de tal forma que la segunda tenga 10 μg/mL a partir de una solución madre de 1000 μg/mL.", () =>
    S.abierto([
      "Hay que diluir 100 veces en total (1000 → 10 µg/mL). Se reparte en dos pasos de 1:10.",
      "Estándar 1: 1 mL de la solución madre en matraz aforado de 10 mL, completar con agua → 100 µg/mL.",
      "Estándar 2: 1 mL del estándar 1 en matraz aforado de 10 mL, completar con agua → 10 µg/mL.",
      "También sirve cualquier otra combinación cuyo producto sea 100 (por ejemplo 1:20 y 1:5).",
    ])),
  ej(L2, 10, "seriadas", "Preparar tres soluciones estándar de zinc de tal forma que la tercera tenga 2 μg/mL. Indique las diluciones necesarias a partir de una solución de 100 μg/mL.", () =>
    S.abierto([
      "Dilución total necesaria: 100 / 2 = 50 veces, repartida en tres pasos.",
      "Una opción: 1:2 → 50 µg/mL (5 mL + 5 mL); 1:5 → 10 µg/mL (2 mL a 10 mL); 1:5 → 2 µg/mL (2 mL a 10 mL).",
      "Comprobación: 2 × 5 × 5 = 50.",
    ])),
  ej(E2, 27, "seriadas", "Con una solución madre de 8 M, prepara 200 mL de una dilución 1:1000 mediante tres pasos de dilución seriada. Indica los volúmenes utilizados en cada paso.", () =>
    S.abierto([
      "1:1000 = 1:10 × 1:10 × 1:10. Solo el último paso necesita el volumen final de 200 mL.",
      "Paso 1: 1 mL de madre + 9 mL de diluyente → 0,8 M.",
      "Paso 2: 1 mL del paso 1 + 9 mL de diluyente → 0,08 M.",
      "Paso 3: 20 mL del paso 2 llevados a 200 mL → 0,008 M. (Para tener esos 20 mL, el paso 2 se prepara con 2,5 mL + 22,5 mL.)",
    ])),
  ej(E2, 29, "seriadas", "Tienes una solución madre de 1,2 M. Describe cómo prepararías 500 mL de una solución 0,012 M mediante diluciones seriadas.", () =>
    S.abierto([
      "Dilución total: 1,2 / 0,012 = 100 veces = 1:10 × 1:10.",
      "Paso 1: 10 mL de madre en matraz de 100 mL, completar → 0,12 M.",
      "Paso 2: 50 mL del paso 1 en matraz de 500 mL, completar → 0,012 M.",
    ])),
  ej(E2, 31, "seriadas", "Disolver una cantidad exactamente pesada de ácido ascórbico en agua destilada, agitando durante 1 minuto. Hacer las diluciones necesarias hasta obtener soluciones de aproximadamente 0,1; 0,3 y 0,5 mg de ácido ascórbico por mL.", () =>
    S.abierto([
      "Conviene preparar una madre de 1 mg/mL: pesar 50 mg y llevar a 50 mL.",
      "0,1 mg/mL: 1 mL de madre llevado a 10 mL.",
      "0,3 mg/mL: 3 mL de madre llevados a 10 mL.",
      "0,5 mg/mL: 5 mL de madre llevados a 10 mL.",
      "Como la pesada nunca es exactamente 50 mg, se recalculan las concentraciones reales con el peso anotado.",
    ])),
  ej(E2, 30, "seriadas", "Para la valoración de alcaloides en hojas de boldo, la farmacopea indica que se debe preparar una solución de boldina en fase móvil con una concentración de 0,012 mg/mL. Indicar cuánto de boldina se pesará y realizar diluciones para llegar a la concentración determinada. Considerar que solo se cuenta con 20 mL de fase móvil.", () =>
    S.abierto([
      "Con 20 mL alcanzan dos matraces de 10 mL.",
      "Pesar 1,2 mg de boldina y llevar a 10 mL → 0,12 mg/mL.",
      "Tomar 1 mL y llevar a 10 mL → 0,012 mg/mL. Solvente usado: 10 + 9 = 19 mL.",
      "Pesar 1,2 mg exige una balanza analítica de 0,01 mg; se anota el peso real y se corrige la concentración.",
    ])),

  /* ---------------- Preparar pesando un sólido ---------------- */
  ej(L2, 57, "solido", "Calcular los gramos de NaOH para preparar 500 mL a una concentración 50 mM.", () => S.masaParaMolar({ M: 0.05, vmL: 500, pm: 40 }), "PM NaOH = 40 g/mol"),
  ej(L2, 60, "solido", "Calcular los gramos para preparar 100 mL de una solución 10 mM de CuSO₄ a partir de CuSO₄·5H₂O.", () => S.masaParaMolar({ M: 0.01, vmL: 100, pm: 249.69 }), "PM CuSO₄·5H₂O = 249,69 g/mol (se pesa el hidrato)"),
  ej(L2, 58, "solido", "¿Cuál es la concentración molar de la solución que contiene 20 g de NaHCO₃ en 300 mL de solución?", () => S.molaridadDesdeMasa({ g: 20, pm: 84, vmL: 300 }), "PM NaHCO₃ = 84 g/mol"),
  ej(L2, 41, "solido", "El jugo de limón es una solución acuosa de ácido cítrico. Si una muestra es 0,30 M en ácido cítrico, ¿cuántos gramos hay en 250 mL?", () => S.masaParaMolar({ M: 0.3, vmL: 250, pm: 192 }), "PM ácido cítrico = 192 g/mol"),
  ej(L2, 42, "solido", "El vino es una solución de ácido tartárico. Si una muestra es 0,05 M en ácido tartárico, ¿cuántos gramos hay en 750 mL?", () => S.masaParaMolar({ M: 0.05, vmL: 750, pm: 150.09 }), "PM ácido tartárico = 150,09 g/mol"),
  ej(P, 21, "solido", "El vinagre de vino tiene una concentración de 0,75 M de ácido acético (PM = 60 g/mol). ¿Cuántos gramos de ácido acético hay en 600 mL?", () => S.masaParaMolar({ M: 0.75, vmL: 600, pm: 60 })),
  ej(P, 49, "solido", "El zumo de limón es aproximadamente 0,3 M en ácido cítrico (PM = 192 g/mol). ¿Cuántos gramos de ácido cítrico hay en 250 mL de zumo?", () => S.masaParaMolar({ M: 0.3, vmL: 250, pm: 192 })),
  ej(L2, 13, "solido", "Se desea una solución que contenga 5 mg de ión Fe³⁺ por mL. ¿Cuántos gramos de FeCl₃·6H₂O se deberán disolver por litro de solución?", () => S.salParaIon({ mgPorMl: 5, pmSal: 270.3, pmIon: 55.85, ion: "Fe³⁺" }), "PM FeCl₃·6H₂O = 270,3; PM Fe = 55,85 g/mol"),
  ej(L2, 14, "solido", "Se desea una solución que contenga 20 mg de ión Zn²⁺ por mL. ¿Cuántos gramos de ZnSO₄·7H₂O se deben disolver por litro?", () => S.salParaIon({ mgPorMl: 20, pmSal: 287.56, pmIon: 65.38, ion: "Zn²⁺" }), "PM ZnSO₄·7H₂O = 287,56; PM Zn = 65,38 g/mol"),
  ej(P, 7, "solido", "Se desea una solución que contenga 15 mg de ión Fe²⁺ por mL. ¿Cuántos gramos de FeSO₄·7H₂O (PM = 278 g/mol) se deberán disolver por litro? (PM Fe = 55,85 g/mol)", () => S.salParaIon({ mgPorMl: 15, pmSal: 278, pmIon: 55.85, ion: "Fe²⁺" })),
  ej(P, 35, "solido", "Se desea una solución que contenga 8 mg de ión Mg²⁺ por mL. ¿Cuántos gramos de MgSO₄·7H₂O (PM = 246,5 g/mol) se deberán disolver por litro? (PM Mg = 24,3 g/mol)", () => S.salParaIon({ mgPorMl: 8, pmSal: 246.5, pmIon: 24.3, ion: "Mg²⁺" })),
  ej(L2, 43, "solido", "¿Qué peso de KMnO₄ debe pesarse para preparar 250 mL de una solución que contenga 20 ppm de manganeso? (MM KMnO₄ = 158 g/mol, MM Mn = 54,9 g/mol)", () => S.salParaPpm({ ppm: 20, vmL: 250, pmSal: 158, pmElemento: 54.9, elemento: "Mn" })),
  ej(L2, 44, "solido", "¿Qué peso de FeCl₃ debe pesarse para preparar 100 mL de una solución que contenga 50 ppm de hierro?", () => S.salParaPpm({ ppm: 50, vmL: 100, pmSal: 162.2, pmElemento: 55.85, elemento: "Fe" }), "PM FeCl₃ = 162,2; PM Fe = 55,85 g/mol"),
  ej(P, 22, "solido", "¿Qué peso de K₂Cr₂O₇ (PM = 294,18 g/mol) debe pesarse para preparar 1 L de una solución que contenga 8 ppm de cromo? (PM Cr = 52 g/mol)", () => S.salParaPpm({ ppm: 8, vmL: 1000, pmSal: 294.18, pmElemento: 52, atomos: 2, elemento: "Cr" })),
  ej(P, 50, "solido", "¿Qué peso de Na₂SO₄ (PM = 142 g/mol) debe pesarse para preparar 500 mL de una solución que contenga 15 ppm de azufre? (PM S = 32 g/mol)", () => S.salParaPpm({ ppm: 15, vmL: 500, pmSal: 142, pmElemento: 32, elemento: "S" })),
  ej(L2, 15, "solido", "Una reacción requiere 5 g de hidróxido de sodio. ¿Cuántos mL de una disolución 2 M de NaOH deberán utilizarse?", () => S.volumenParaMasa({ g: 5, pm: 40, M: 2 }), "PM NaOH = 40 g/mol"),
  ej(L2, 16, "solido", "Una reacción requiere 7,4 g de cloruro de calcio. ¿Cuántos mL de una disolución 1,5 M de CaCl₂ deberán utilizarse?", () => S.volumenParaMasa({ g: 7.4, pm: 111, M: 1.5 }), "PM CaCl₂ = 111 g/mol"),
  ej(P, 8, "solido", "Una reacción requiere 18,9 g de ácido fosfórico (PM = 98 g/mol). ¿Cuántos mL de una disolución 2,5 M deberán utilizarse?", () => S.volumenParaMasa({ g: 18.9, pm: 98, M: 2.5 })),
  ej(P, 36, "solido", "Una reacción requiere 7,4 g de hidróxido de calcio (PM = 74 g/mol). ¿Cuántos mL de una disolución 1,5 M deberán utilizarse?", () => S.volumenParaMasa({ g: 7.4, pm: 74, M: 1.5 })),

  /* ---------------- Desde un reactivo concentrado ---------------- */
  ej(L2, 51, "concentrado", "Se dispone de HNO₃ con densidad 1,40 g/mL y concentración 65 % p/p (MM = 63 g/mol). Si se toman 8,0 mL y se diluyen a 1000 mL, ¿cuál es la concentración molar de la nueva solución?", () => S.concentradoDiluido({ ...HNO3, vTomado: 8, vFinal: 1000 })),
  ej(L2, 52, "concentrado", "Se dispone de HCl con densidad 1,18 g/mL y concentración 37 % p/p (MM = 36,5 g/mol). Si se toman 2,0 mL y se diluyen a 100 mL, ¿cuál es la Molaridad resultante?", () => S.concentradoDiluido({ densidad: 1.18, pureza: 37, pm: 36.5, vTomado: 2, vFinal: 100 })),
  ej(P, 26, "concentrado", "Se dispone de una solución de H₃PO₄ (PM = 98 g/mol) cuya densidad es 1,70 g/mL y concentración 85 % p/p. Se toman 4,0 mL y se diluyen hasta 700 mL. ¿Cuál es la concentración molar de la nueva solución?", () => S.concentradoDiluido({ ...H3PO4, vTomado: 4, vFinal: 700 })),
  ej(P, 3, "concentrado", "¿Qué volumen de HCl concentrado (densidad = 1,19 g/mL, pureza = 37 %, PM = 36,5 g/mol) es necesario para preparar 1 L de una solución 0,5 N?", () => S.volumenConcentrado({ ...HCl, eq: 1, vFinalmL: 1000, objetivo: 0.5, unidad: "N" })),
  ej(P, 31, "concentrado", "¿Qué volumen de H₂SO₄ concentrado (densidad = 1,84 g/mL, pureza = 96 %, PM = 98 g/mol) es necesario para preparar 3 L de una solución 0,1 N?", () => S.volumenConcentrado({ ...H2SO4, eq: 2, vFinalmL: 3000, objetivo: 0.1, unidad: "N" })),
  ej(L2, 3, "concentrado", "Preparar 250 mL de una solución de HNO₃ 50 mM a partir de ácido nítrico concentrado.", () => S.volumenConcentrado({ ...HNO3, eq: 1, vFinalmL: 250, objetivo: 0.05, unidad: "M" }), "Se usa HNO₃ concentrado de densidad 1,40 g/mL, 65 % p/p y PM 63 (datos del ejercicio 51)"),
  ej(L2, 4, "concentrado", "Preparar 1 L de una solución de H₂SO₄ 25 mM a partir de ácido sulfúrico concentrado.", () => S.volumenConcentrado({ ...H2SO4, eq: 2, vFinalmL: 1000, objetivo: 0.025, unidad: "M" }), "Se usa H₂SO₄ concentrado de densidad 1,84 g/mL, 96 % p/p y PM 98"),
  ej(L2, 5, "concentrado", "¿Qué volumen de H₃PO₄ concentrado es necesario para preparar 1 L de solución 0,3 N?", () => S.volumenConcentrado({ ...H3PO4, eq: 3, vFinalmL: 1000, objetivo: 0.3, unidad: "N" }), "Se usa H₃PO₄ concentrado de densidad 1,70 g/mL, 85 % p/p y PM 98; 3 equivalentes por mol"),
  ej(L2, 6, "concentrado", "¿Qué volumen de HNO₃ concentrado es necesario para preparar 500 mL de solución 0,5 N?", () => S.volumenConcentrado({ ...HNO3, eq: 1, vFinalmL: 500, objetivo: 0.5, unidad: "N" }), "Se usa HNO₃ concentrado de densidad 1,40 g/mL, 65 % p/p y PM 63"),
  ej(L2, 59, "concentrado", "Preparar 800 mL de Ca(OH)₂ 0,2 M a partir de una solución concentrada del 10 % p/v.", () => S.volumenDesdePorcentaje({ pct: 10, pm: 74.09, M: 0.2, vmL: 800 }), "PM Ca(OH)₂ = 74,09 g/mol"),

  /* ---------------- Normalidad y equivalentes ---------------- */
  ej(L2, 7, "normalidad", "A partir de una solución 2 M de K₂Cr₂O₇, preparar 200 mL de solución 1 N, donde el dicromato actúa como oxidante y su número de oxidación pasa de +6 a +3.", () => S.normalDesdeMolar({ M: 2, eq: 6, vmL: 200, N: 1, motivo: "2 átomos de Cr × 3 electrones cada uno" })),
  ej(P, 4, "normalidad", "A partir de una solución 2 M de K₂Cr₂O₇, preparar 250 mL de una solución 4 N donde el dicromato actúa como oxidante y el Cr pasa de +6 a +3.", () => S.normalDesdeMolar({ M: 2, eq: 6, vmL: 250, N: 4, motivo: "2 átomos de Cr × 3 electrones cada uno" })),
  ej(L2, 33, "normalidad", "¿Cuál es la Normalidad de una disolución de BaCl₂ que contiene 15 mg de ión Ba²⁺ por mililitro? (MM Ba = 137,3 g/mol)", () => S.normalidadIon({ mgPorMl: 15, pm: 137.3, valencia: 2, ion: "Ba²⁺" })),
  ej(L2, 34, "normalidad", "¿Cuál es la Normalidad de una disolución de CaCl₂ que contiene 8 mg de ión Ca²⁺ por mililitro?", () => S.normalidadIon({ mgPorMl: 8, pm: 40.08, valencia: 2, ion: "Ca²⁺" }), "PM Ca = 40,08 g/mol"),
  ej(P, 17, "normalidad", "¿Cuál es la Normalidad de una disolución de CaCl₂ que contiene 12 mg de ión Ca²⁺ por mililitro? (PM Ca = 40,08 g/mol)", () => S.normalidadIon({ mgPorMl: 12, pm: 40.08, valencia: 2, ion: "Ca²⁺" })),
  ej(P, 45, "normalidad", "¿Cuál es la Normalidad de una disolución de MgCl₂ que contiene 18 mg de ión Mg²⁺ por mililitro? (PM Mg = 24,3 g/mol)", () => S.normalidadIon({ mgPorMl: 18, pm: 24.3, valencia: 2, ion: "Mg²⁺" })),
  ej(L2, 35, "normalidad", "Una disolución de KMnO₄ se prepara disolviendo 5 g en agua suficiente para hacer 500 mL. ¿Cuál es la Normalidad basándose en: MnO₄⁻ + 5e⁻ → Mn²⁺?", () => S.normalidadRedox({ g: 5, pm: 158, vmL: 500, electrones: 5 }), "PM KMnO₄ = 158 g/mol"),
  ej(L2, 36, "normalidad", "Una disolución de Ce(SO₄)₂ se prepara disolviendo 8 g en agua para obtener 250 mL. ¿Cuál es la Normalidad si Ce⁴⁺ + e⁻ → Ce³⁺?", () => S.normalidadRedox({ g: 8, pm: 332.24, vmL: 250, electrones: 1 }), "PM Ce(SO₄)₂ = 332,24 g/mol"),
  ej(P, 18, "normalidad", "Una disolución de KMnO₄ se prepara disolviendo 15 g en agua suficiente para 500 mL. ¿Cuál es la Normalidad basándose en la semirreacción MnO₄⁻ + Fe²⁺ → Mn²⁺ + Fe³⁺? (PM KMnO₄ = 158 g/mol)", () => S.normalidadRedox({ g: 15, pm: 158, vmL: 500, electrones: 5 })),
  ej(P, 46, "normalidad", "Una disolución de Na₂Cr₂O₇ (PM = 262 g/mol) se prepara disolviendo 20 g en agua suficiente para 2 litros. ¿Cuál es la Normalidad, sabiendo que Cr pasa de +6 a +3?", () => S.normalidadRedox({ g: 20, pm: 262, vmL: 2000, electrones: 6 })),

  /* ---------------- Mezclas ---------------- */
  ej(L2, 47, "mezclas", "Se mezclan 200 mL de eosina al 10 % con 400 mL al 30 %. Luego se añaden 600 mL de agua destilada. ¿Cuál es la concentración final?", () => S.mezcla({ partes: [{ v: 200, c: 10 }, { v: 400, c: 30 }], agua: 600, unidad: "%" })),
  ej(L2, 48, "mezclas", "Se mezclan 500 mL de alcohol etílico al 70 % con 250 mL al 96 % y luego se añaden 250 mL de agua destilada. ¿Cuál es la concentración final en %?", () => S.mezcla({ partes: [{ v: 500, c: 70 }, { v: 250, c: 96 }], agua: 250, unidad: "%" })),
  ej(P, 24, "mezclas", "Si se mezclan 250 mL de rojo congo al 30 % con 450 mL al 60 %. Luego se añaden 800 mL de agua destilada. ¿Cuál es la concentración final?", () => S.mezcla({ partes: [{ v: 250, c: 30 }, { v: 450, c: 60 }], agua: 800, unidad: "%" })),
  ej(L2, 19, "mezclas", "¿Cuántos mL de solución de KOH 2 N se deben agregar a 1 L de solución 0,10 N para obtener una solución 0,15 N?", () => S.agregarParaConcentrar({ c1: 2, v2: 1000, c2: 0.1, cf: 0.15, unidad: "N" })),
  ej(L2, 20, "mezclas", "¿Cuántos mL de H₂SO₄ 1 N se deben agregar a 500 mL de solución 0,05 N para obtener una solución 0,2 N?", () => S.agregarParaConcentrar({ c1: 1, v2: 500, c2: 0.05, cf: 0.2, unidad: "N" })),
  ej(L2, 39, "mezclas", "¿Cuántos mL de solución de NaOH 0,8 M se deben agregar a 100 mL de NaOH 0,05 M para obtener una solución 0,2 M? (Suponga volúmenes aditivos)", () => S.agregarParaConcentrar({ c1: 0.8, v2: 100, c2: 0.05, cf: 0.2, unidad: "M" })),
  ej(L2, 40, "mezclas", "¿Cuántos mL de HNO₃ 0,6 M se deben agregar a 75 mL de HNO₃ 0,1 M para obtener una solución 0,25 M? (Suponga volúmenes aditivos)", () => S.agregarParaConcentrar({ c1: 0.6, v2: 75, c2: 0.1, cf: 0.25, unidad: "M" })),
  ej(P, 10, "mezclas", "¿Cuántos mL de NaOH 5 N se deben agregar a 3 L de solución 0,08 N para obtener una solución 0,1 N?", () => S.agregarParaConcentrar({ c1: 5, v2: 3000, c2: 0.08, cf: 0.1, unidad: "N" })),
  ej(P, 20, "mezclas", "¿Cuántos mL de HNO₃ 0,8 M se deben agregar a 120 mL de HNO₃ 0,05 M para obtener una Molaridad de 0,2 M? Suponga volúmenes aditivos.", () => S.agregarParaConcentrar({ c1: 0.8, v2: 120, c2: 0.05, cf: 0.2, unidad: "M" })),
  ej(P, 38, "mezclas", "¿Cuántos mL de KOH 4 N se deben agregar a 1,5 L de solución 0,15 N para obtener una solución 0,2 N?", () => S.agregarParaConcentrar({ c1: 4, v2: 1500, c2: 0.15, cf: 0.2, unidad: "N" })),
  ej(P, 48, "mezclas", "¿Cuántos mL de H₂SO₄ 1,5 M se deben agregar a 200 mL de H₂SO₄ 0,2 M para obtener una Molaridad de 0,5 M? Suponga volúmenes aditivos.", () => S.agregarParaConcentrar({ c1: 1.5, v2: 200, c2: 0.2, cf: 0.5, unidad: "M" })),
  ej(L2, 17, "mezclas", "Se mezclan volúmenes iguales de dos disoluciones: una 0,4 N de KCl y otra 0,3 N de KNO₃. a) Calcular la concentración en g/L de cada sustancia en la disolución final. b) ¿Cuántos miliequivalentes de K⁺ hay en 10 mL de la mezcla?", () => S.mezclaIonComun({ n1: 0.4, pm1: 74.55, nombre1: "KCl", n2: 0.3, pm2: 101.1, nombre2: "KNO₃", vAlicuota: 10, ion: "K⁺" }), "PM KCl = 74,55; PM KNO₃ = 101,1 g/mol"),
  ej(L2, 18, "mezclas", "Se mezclan 100 mL de NaHCO₃ 0,6 N con 100 mL de Na₂SO₄ 0,3 N. a) Calcular la concentración en g/L de cada sustancia en la mezcla. b) ¿Cuántos mEq de Na⁺ hay en 20 mL de la disolución final?", () => S.mezclaIonComun({ n1: 0.6, pm1: 84, nombre1: "NaHCO₃", n2: 0.3, pm2: 142, eq2: 2, nombre2: "Na₂SO₄", vAlicuota: 20, ion: "Na⁺", v1: 100, v2: 100 }), "PM NaHCO₃ = 84; PM Na₂SO₄ = 142 g/mol (2 equivalentes por mol)"),
  ej(P, 9, "mezclas", "Se mezclan volúmenes iguales de dos disoluciones: una 0,8 N de KCl y otra 0,3 N de KNO₃. a) Calcule la concentración en g/L de cada sustancia en la disolución final. b) ¿Cuántos miliequivalentes de K⁺ hay en 10 mL de la disolución final? (PM KCl = 74,5; PM KNO₃ = 101 g/mol)", () => S.mezclaIonComun({ n1: 0.8, pm1: 74.5, nombre1: "KCl", n2: 0.3, pm2: 101, nombre2: "KNO₃", vAlicuota: 10, ion: "K⁺" })),
  ej(P, 37, "mezclas", "Se mezclan volúmenes iguales de dos disoluciones: una 1,0 N de NaNO₃ y otra 0,5 N de NaHCO₃. a) Calcule la concentración en g/L de cada sustancia en la solución final. b) ¿Cuántos miliequivalentes de Na⁺ hay en 20 mL de la disolución final? (PM NaNO₃ = 85; PM NaHCO₃ = 84 g/mol)", () => S.mezclaIonComun({ n1: 1, pm1: 85, nombre1: "NaNO₃", n2: 0.5, pm2: 84, nombre2: "NaHCO₃", vAlicuota: 20, ion: "Na⁺" })),

  /* ---------------- Buffers: preparar ---------------- */
  ej(L2, 61, "buffers", "Calcule los volúmenes de ácido acético 0,1 M y acetato de sodio 0,1 M necesarios para preparar 500 mL de un buffer a pH 4,76. (pKa = 4,76)", () => S.bufferVolumenes({ pH: 4.76, pKa: 4.76, vTotalmL: 500, cStock: 0.1, nombreAcido: "Ácido acético 0,1 M", nombreBase: "Acetato de sodio 0,1 M" })),
  ej(E2, 1, "buffers", "Calcule los volúmenes de ácido acético 0,2 M y acetato de sodio 0,2 M necesarios para preparar 750 mL de un buffer a pH 5,2. (pKa = 4,76)", () => S.bufferVolumenes({ pH: 5.2, pKa: 4.76, vTotalmL: 750, cStock: 0.2, nombreAcido: "Ácido acético 0,2 M", nombreBase: "Acetato de sodio 0,2 M" })),
  ej(L2, 63, "buffers", "Se desea preparar 1 litro de buffer acetato 0,1 M a pH 4,5. ¿Qué volúmenes de ácido acético 1 M y acetato de sodio 1 M se deben mezclar? (pKa = 4,76)", () => S.bufferVolumenes({ pH: 4.5, pKa: 4.76, vTotalmL: 1000, cStock: 1, cFinal: 0.1, nombreAcido: "Ácido acético 1 M", nombreBase: "Acetato de sodio 1 M" })),
  ej(E2, 3, "buffers", "Se desea preparar 2 litros de buffer acetato 0,05 M a pH 4,3. ¿Qué volúmenes de ácido acético 0,5 M y acetato de sodio 0,5 M se deben mezclar? (pKa = 4,76)", () => S.bufferVolumenes({ pH: 4.3, pKa: 4.76, vTotalmL: 2000, cStock: 0.5, cFinal: 0.05, nombreAcido: "Ácido acético 0,5 M", nombreBase: "Acetato de sodio 0,5 M" })),
  ej(L2, 66, "buffers", "¿Qué volúmenes de una solución 0,1 M de NaH₂PO₄ y 0,1 M de Na₂HPO₄ se deben mezclar para preparar 200 mL de buffer fosfato a pH 7,0? (pKa₂ = 7,2)", () => S.bufferVolumenes({ pH: 7, pKa: 7.2, vTotalmL: 200, cStock: 0.1, nombreAcido: "NaH₂PO₄ 0,1 M", nombreBase: "Na₂HPO₄ 0,1 M" })),
  ej(E2, 6, "buffers", "¿Qué volúmenes de KH₂PO₄ 0,2 M y K₂HPO₄ 0,2 M se deben mezclar para preparar 300 mL de buffer fosfato a pH 7,5? (pKa₂ = 7,2)", () => S.bufferVolumenes({ pH: 7.5, pKa: 7.2, vTotalmL: 300, cStock: 0.2, nombreAcido: "KH₂PO₄ 0,2 M", nombreBase: "K₂HPO₄ 0,2 M" })),
  ej(E2, 9, "buffers", "Preparar 1 litro de buffer carbonato-bicarbonato a pH 10,0 usando Na₂CO₃ (MM = 106 g/mol) y NaHCO₃ (MM = 84 g/mol), ambos a 0,05 M. ¿Qué volúmenes se necesitan? (pKa₂ = 10,33)", () => S.bufferVolumenes({ pH: 10, pKa: 10.33, vTotalmL: 1000, cStock: 0.05, nombreAcido: "NaHCO₃ 0,05 M", nombreBase: "Na₂CO₃ 0,05 M" })),
  ej(E2, 13, "buffers", "Preparar 400 mL de buffer citrato a pH 5,0 usando ácido cítrico 0,1 M y citrato de sodio 0,1 M. (pKa₂ = 4,76). ¿Qué volúmenes se mezclan?", () => S.bufferVolumenes({ pH: 5, pKa: 4.76, vTotalmL: 400, cStock: 0.1, nombreAcido: "Ácido cítrico 0,1 M", nombreBase: "Citrato de sodio 0,1 M" })),
  ej(L2, 67, "buffers", "Se prepara un buffer fosfato mezclando 60 mL de Na₂HPO₄ 0,1 M con 40 mL de NaH₂PO₄ 0,1 M. ¿Cuál es el pH resultante? (pKa₂ = 7,2)", () => S.bufferPH({ pKa: 7.2, base: 60, acido: 40, detalle: "Como las dos soluciones son 0,1 M, la razón de moles es la razón de volúmenes: base 60 (Na₂HPO₄), ácido 40 (NaH₂PO₄)." })),
  ej(E2, 7, "buffers", "Se prepara un buffer fosfato mezclando 35 mL de Na₂HPO₄ 0,1 M con 65 mL de NaH₂PO₄ 0,1 M. ¿Cuál es el pH resultante? (pKa₂ = 7,2)", () => S.bufferPH({ pKa: 7.2, base: 35, acido: 65, detalle: "Como las dos soluciones son 0,1 M, la razón de moles es la razón de volúmenes: base 35 (Na₂HPO₄), ácido 65 (NaH₂PO₄)." })),
  ej(L2, 62, "buffers", "¿Cuántos gramos de acetato de sodio (MM = 82 g/mol) deben añadirse a 300 mL de una solución de ácido acético 0,2 M para obtener un buffer a pH 5,0? (pKa = 4,76)", () => S.bufferGramosSal({ vAcidomL: 300, cAcido: 0.2, pH: 5, pKa: 4.76, pmSal: 82 })),
  ej(E2, 2, "buffers", "¿Cuántos gramos de acetato de potasio (MM = 98 g/mol) deben añadirse a 500 mL de una solución de ácido acético 0,15 M para obtener un buffer a pH 4,9? (pKa = 4,76)", () => S.bufferGramosSal({ vAcidomL: 500, cAcido: 0.15, pH: 4.9, pKa: 4.76, pmSal: 98 })),
  ej(E2, 10, "buffers", "¿Cuántos gramos de Na₂CO₃ deben disolverse en 600 mL de NaHCO₃ 0,1 M para obtener un buffer a pH 9,8? (pKa₂ = 10,33; MM Na₂CO₃ = 106 g/mol)", () => S.bufferGramosSal({ vAcidomL: 600, cAcido: 0.1, pH: 9.8, pKa: 10.33, pmSal: 106 })),
  ej(L2, 65, "buffers", "Preparar 250 mL de un buffer fosfato 0,05 M a pH 7,4 utilizando NaH₂PO₄ (MM = 120 g/mol) y Na₂HPO₄ (MM = 142 g/mol). (pKa₂ = 7,2). ¿Cuántos gramos de cada sal se necesitan?", () => S.bufferDosSales({ vmL: 250, c: 0.05, pH: 7.4, pKa: 7.2, pmAcido: 120, pmBase: 142, nombreAcido: "NaH₂PO₄", nombreBase: "Na₂HPO₄" })),
  ej(E2, 5, "buffers", "Preparar 500 mL de buffer fosfato 0,1 M a pH 6,8 usando NaH₂PO₄ (MM = 120 g/mol) y Na₂HPO₄ (MM = 142 g/mol). (pKa₂ = 7,2). ¿Cuántos gramos de cada sal se necesitan?", () => S.bufferDosSales({ vmL: 500, c: 0.1, pH: 6.8, pKa: 7.2, pmAcido: 120, pmBase: 142, nombreAcido: "NaH₂PO₄", nombreBase: "Na₂HPO₄" })),

  /* ---------------- Buffers: ajustar y poner a prueba ---------------- */
  ej(L2, 71, "buffers2", "Se tienen 500 mL de ácido acético 0,2 M. ¿Cuántos mL de NaOH 0,2 M se deben agregar para obtener un buffer a pH 5,0? (pKa = 4,76). ¿Cuál será la concentración final del buffer?", () => S.bufferTitularAcido({ vmL: 500, c: 0.2, cNaOH: 0.2, pH: 5, pKa: 4.76 })),
  ej(E2, 15, "buffers2", "Se tienen 800 mL de ácido acético 0,3 M. ¿Cuántos mL de NaOH 0,3 M se deben agregar para obtener un buffer a pH 4,5? (pKa = 4,76). ¿Cuál será la concentración total del buffer resultante?", () => S.bufferTitularAcido({ vmL: 800, c: 0.3, cNaOH: 0.3, pH: 4.5, pKa: 4.76 })),
  ej(L2, 72, "buffers2", "Se tienen 100 mL de Tris base 0,1 M. ¿Cuántos mL de HCl 0,1 M se deben agregar para obtener un buffer a pH 7,8? (pKa = 8,06)", () => S.bufferTitularBase({ vmL: 100, c: 0.1, cHCl: 0.1, pH: 7.8, pKa: 8.06 })),
  ej(E2, 16, "buffers2", "Se tienen 200 mL de Tris base 0,2 M. ¿Cuántos mL de HCl 0,2 M se deben agregar para obtener un buffer a pH 8,3? (pKa = 8,06)", () => S.bufferTitularBase({ vmL: 200, c: 0.2, cHCl: 0.2, pH: 8.3, pKa: 8.06 })),
  ej(E2, 17, "buffers2", "A 600 mL de Na₂HPO₄ 0,1 M se le agrega HCl 0,1 M. ¿Cuántos mL de HCl se necesitan para alcanzar el pH de mayor capacidad buffer del sistema (pH = pKa₂ = 7,2)?", () => S.bufferTitularBase({ vmL: 600, c: 0.1, cHCl: 0.1, pH: 7.2, pKa: 7.2 })),
  ej(L2, 69, "buffers2", "Preparar 1 litro de buffer Tris-HCl 50 mM a pH 8,0. Se dispone de Tris base (MM = 121 g/mol) y HCl 1 M. (pKa = 8,06). ¿Cuántos gramos de Tris y cuántos mL de HCl 1 M se necesitan?", () => S.bufferPesarYAjustar({ vL: 1, c: 0.05, pm: 121, cAjuste: 1, pH: 8, pKa: 8.06, especie: "base", nombre: "Tris base", ajuste: "HCl" })),
  ej(E2, 11, "buffers2", "Preparar 500 mL de buffer Tris-HCl 100 mM a pH 7,6. Se dispone de Tris base (MM = 121 g/mol) y HCl 0,5 M. (pKa = 8,06). ¿Cuántos gramos de Tris y cuántos mL de HCl se necesitan?", () => S.bufferPesarYAjustar({ vL: 0.5, c: 0.1, pm: 121, cAjuste: 0.5, pH: 7.6, pKa: 8.06, especie: "base", nombre: "Tris base", ajuste: "HCl" })),
  ej(E2, 18, "buffers2", "En un laboratorio de bioquímica se necesitan 3 litros de buffer HEPES (MM = 238,3 g/mol; pKa = 7,55) a pH 7,2 y concentración 25 mM para cultivo celular. Se ajustará el pH con NaOH 1 M. ¿Cuántos gramos de HEPES y cuántos mL aproximados de NaOH se necesitan?", () => S.bufferPesarYAjustar({ vL: 3, c: 0.025, pm: 238.3, cAjuste: 1, pH: 7.2, pKa: 7.55, especie: "acido", nombre: "HEPES", ajuste: "NaOH" })),
  ej(L2, 64, "buffers2", "Un buffer acetato tiene una relación [CH₃COO⁻]/[CH₃COOH] = 3:1. ¿Cuál es el pH de este buffer? (pKa = 4,76). Si se agregan 2 mEq de HCl a 1 litro de este buffer con concentración total 0,1 M, ¿cuál será el nuevo pH?", () => S.bufferRazonMasFuerte({ pKa: 4.76, base: 3, acido: 1, cTotal: 0.1, vL: 1, mEq: 2, con: "HCl" })),
  ej(E2, 4, "buffers2", "Un buffer acetato tiene una relación [CH₃COO⁻]/[CH₃COOH] = 1:4. ¿Cuál es el pH? (pKa = 4,76). Si se agregan 3 mEq de NaOH a 1 litro de este buffer con concentración total 0,2 M, ¿cuál será el nuevo pH?", () => S.bufferRazonMasFuerte({ pKa: 4.76, base: 1, acido: 4, cTotal: 0.2, vL: 1, mEq: 3, con: "NaOH" })),
  ej(L2, 75, "buffers2", "Se prepara un buffer acetato 0,1 M a pH 4,76 y se divide en dos porciones de 100 mL. A la primera porción se le agregan 5 mL de HCl 0,1 M y a la segunda 5 mL de NaOH 0,1 M. a) Calcule el nuevo pH en cada caso. b) Compare con el cambio de pH que sufriría el agua pura al agregarle la misma cantidad de ácido o base. (pKa = 4,76)", () => S.bufferMasFuerte({ vmL: 100, cTotal: 0.1, pH0: 4.76, pKa: 4.76, vAdd: 5, cAdd: 0.1 })),
  ej(E2, 20, "buffers2", "Se prepara un buffer fosfato 0,1 M a pH 7,2 y se toman dos alícuotas de 150 mL. A la primera se le añaden 8 mL de HCl 0,1 M y a la segunda 8 mL de NaOH 0,1 M. a) Calcule el nuevo pH en cada alícuota. b) ¿Cuántos mL adicionales de HCl 0,1 M serían necesarios para saturar la capacidad buffer de la primera alícuota (considere que el límite es pH 6,7)? (pKa₂ = 7,2)", () => {
    const a = S.bufferMasFuerte({ vmL: 150, cTotal: 0.1, pH0: 7.2, pKa: 7.2, vAdd: 8, cAdd: 0.1 });
    const b = S.bufferSaturar({ vmL: 150, cTotal: 0.1, pKa: 7.2, pH0: 7.2, yaAgregadoMmol: 0.8, pHLimite: 6.7, cHCl: 0.1 });
    return { respuestas: [...a.respuestas, ...b.respuestas], pasos: [...a.pasos.slice(0, 4), ...b.pasos] };
  }),
  ej(L2, 68, "buffers2", "Calcule la capacidad buffer de un sistema fosfato 0,1 M a pH 7,2. ¿Cuántos mmoles de NaOH puede neutralizar 100 mL de este buffer sin que el pH varíe más de 0,5 unidades? (pKa₂ = 7,2)", () => S.bufferCapacidad({ vmL: 100, cTotal: 0.1, pH0: 7.2, pKa: 7.2, delta: 0.5, con: "NaOH" })),
  ej(E2, 8, "buffers2", "¿Cuántos mmoles de HCl puede neutralizar 200 mL de un buffer fosfato 0,05 M a pH 7,2 sin que el pH varíe más de 0,5 unidades? (pKa₂ = 7,2)", () => S.bufferCapacidad({ vmL: 200, cTotal: 0.05, pH0: 7.2, pKa: 7.2, delta: 0.5, con: "HCl" })),
  ej(L2, 74, "buffers2", "Un buffer fosfato salino (PBS) estándar se prepara con las siguientes sales para 1 litro: NaCl (8 g), KCl (0,2 g), Na₂HPO₄ (1,44 g) y KH₂PO₄ (0,24 g). a) Calcule la molaridad de cada componente. b) Determine el pH teórico del buffer fosfato formado (pKa₂ = 7,2). (MM: NaCl = 58,44; KCl = 74,55; Na₂HPO₄ = 142; KH₂PO₄ = 136 g/mol)", () => {
    const nacl = 8 / 58.44, kcl = 0.2 / 74.55, base = 1.44 / 142, acido = 0.24 / 136;
    const pH = 7.2 + Math.log10(base / acido);
    return {
      respuestas: [
        { etiqueta: "NaCl", valor: nacl * 1000, unidad: "mM" },
        { etiqueta: "KCl", valor: kcl * 1000, unidad: "mM" },
        { etiqueta: "Na₂HPO₄", valor: base * 1000, unidad: "mM" },
        { etiqueta: "KH₂PO₄", valor: acido * 1000, unidad: "mM" },
        { etiqueta: "pH teórico", valor: pH, unidad: "" },
      ],
      pasos: [
        `Molaridad = gramos / PM (en 1 L): NaCl = 8 / 58,44 = ${S.n(nacl)} M; KCl = 0,2 / 74,55 = ${S.n(kcl)} M`,
        `Na₂HPO₄ = 1,44 / 142 = ${S.n(base)} M (base); KH₂PO₄ = 0,24 / 136 = ${S.n(acido)} M (ácido)`,
        `pH = 7,2 + log(${S.n(base)} / ${S.n(acido)}) = ${S.n(pH)}`,
        "El PBS real se ajusta a pH 7,4 con pH-metro: el valor medido es menor que el teórico por la alta fuerza iónica de la solución.",
      ],
    };
  }),
  ej(L2, 73, "buffers2", "A 400 mL de H₃PO₄ 0,1 M se le agrega NaOH 0,1 M gota a gota. ¿Cuántos mL de NaOH se necesitan para alcanzar el pH de mayor capacidad buffer del sistema fosfato (pH = pKa₂ = 7,2)?", () => {
    const mol = 0.1 * 0.4;
    const v = ((mol * 1.5) / 0.1) * 1000;
    return {
      respuestas: [{ etiqueta: "Volumen de NaOH", valor: v, unidad: "mL" }],
      pasos: [
        `Moles de H₃PO₄: 0,1 M × 0,4 L = ${S.n(mol)} mol`,
        `Primer equivalente: todo el H₃PO₄ pasa a H₂PO₄⁻ → ${S.n(mol)} mol de NaOH`,
        `Para pH = pKa₂ la mitad del H₂PO₄⁻ debe pasar a HPO₄²⁻ → ${S.n(mol / 2)} mol más`,
        `Total: ${S.n(mol * 1.5)} mol / 0,1 M = ${S.n(v)} mL`,
      ],
    };
  }),
  ej(E2, 12, "buffers2", "Se disuelven 9,075 g de Tris base (MM = 121 g/mol) en 600 mL de agua. Se ajusta el pH a 8,0 con HCl 1 M y se completa a 750 mL. a) ¿Cuál es la molaridad del buffer? b) ¿Qué volumen de HCl 1 M se agregó aproximadamente? (pKa = 8,06)", () => {
    const mol = 9.075 / 121;
    const M = mol / 0.75;
    const hcl = S.bufferTitularBase({ vmL: 750, c: M, cHCl: 1, pH: 8, pKa: 8.06 });
    return {
      respuestas: [{ etiqueta: "Molaridad del buffer", valor: M, unidad: "M" }, ...hcl.respuestas],
      pasos: [`Moles de Tris: 9,075 g / 121 g/mol = ${S.n(mol)} mol`, `Molaridad = ${S.n(mol)} mol / 0,750 L = ${S.n(M)} M (cuenta el volumen final, no los 600 mL iniciales)`, ...hcl.pasos],
    };
  }),
  ej(L2, 70, "buffers2", "Se disuelven 6,05 g de Tris base (MM = 121 g/mol) en 800 mL de agua. Se ajusta el pH a 7,4 con HCl concentrado y se completa a 1 litro. ¿Cuál es la molaridad del buffer? ¿Es adecuado este pH para un buffer Tris considerando su pKa = 8,06?", () => {
    const M = 6.05 / 121 / 1;
    return {
      respuestas: [{ etiqueta: "Molaridad del buffer", valor: M, unidad: "M" }],
      pasos: [
        `Moles de Tris: 6,05 / 121 = ${S.n(M)} mol en 1 L → ${S.n(M)} M (50 mM)`,
        "Un buffer funciona bien en el intervalo pKa ± 1, es decir, entre pH 7,06 y 9,06 para Tris.",
        "pH 7,4 está dentro del intervalo, pero a 0,66 unidades del pKa: solo ~18 % queda como base libre, así que amortigua bien frente a bases y poco frente a ácidos. Sirve, aunque no está en su zona de máxima capacidad.",
      ],
    };
  }),
];

export const FUENTES: Fuente[] = [L2, E2, P];
