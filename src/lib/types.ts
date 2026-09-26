/**
 * Modelo de datos de una práctica.
 * Todas las prácticas tienen la misma estructura; el sistema solo lee estos datos.
 * Para agregar una práctica nueva se crea un archivo en src/data/practicas/
 * y se registra en src/data/practicas/index.ts.
 */

export type EstadoPractica = "asignada" | "borrador";
export type NivelRiesgo = "Bajo" | "Moderado" | "Alto";
export type CodigoGHS = "GHS01" | "GHS02" | "GHS03" | "GHS04" | "GHS05" | "GHS06" | "GHS07" | "GHS08" | "GHS09";

export interface Material {
  nombre: string;
  cantidad: string;
}

export interface Reactivo {
  id: string;
  nombre: string;
  concentracion: string;
  /** Para qué sirve en esta práctica, en lenguaje sencillo */
  funcion: string;
  peligros: string;
  ghs: CodigoGHS[];
  proteccion: string;
  desecho: string;
  /** Enlace a la ficha de seguridad o PubChem */
  fuente?: string;
}

/** Campo donde el estudiante anota un dato medido durante un paso */
export interface CampoRegistro {
  id: string;
  etiqueta: string;
  unidad: string;
  ejemplo: string;
}

/** Simulaciones visuales disponibles para un paso */
export type TipoSimulador = "titulacion";

export interface Paso {
  titulo: string;
  hacer: string;
  porque: string;
  observar: string;
  error?: string;
  /** Segundos del temporizador, si el paso lo necesita */
  temporizador?: number;
  simulador?: TipoSimulador;
  registro?: CampoRegistro[];
}

/** Dibujos de montaje disponibles (ver src/components/esquemas) */
export type TipoMontaje = "titulacion";

export interface Esquema {
  montaje?: TipoMontaje;
  reaccion?: string;
  reaccionTexto?: string;
  reaccionExplicacion?: string;
  /** Paso de decisión que se agrega al final del diagrama de flujo */
  decision?: string;
  /** Último bloque del diagrama antes de "Fin" */
  cierre?: string;
}

/** Tipos de cálculo registrados en src/lib/calculos.ts */
export type TipoCalculo = "acidez-titulable";

export interface ConfigCalculo {
  tipo: TipoCalculo;
  /** ids de los CampoRegistro que se usan como repeticiones */
  entradas: string[];
  /** valores de ejemplo cuando el estudiante todavía no anotó datos */
  ejemplo: number[];
  params: Record<string, number>;
}

export interface Referencia {
  min: number;
  max: number;
  unidad: string;
  nota: string;
  /** Límites de la escala visual */
  escalaMin: number;
  escalaMax: number;
}

export interface Fuente {
  texto: string;
  url?: string;
}

export interface Practica {
  id: string;
  numero: number;
  titulo: string;
  unidad: string;
  duracion: string;
  grupo: string;
  riesgo: NivelRiesgo;
  estado: EstadoPractica;
  /** Fecha programada, formato AAAA-MM-DD */
  fecha: string;
  resumen: string;
  /** Explicación en palabras simples de qué se hace y por qué */
  queEs: string;
  objetivos: string[];
  fundamento: string;
  seguridad: string[];
  materiales: Material[];
  reactivos: Reactivo[];
  esquema?: Esquema;
  pasos: Paso[];
  calculo?: ConfigCalculo;
  referencia?: Referencia;
  causas?: { alto: string[]; bajo: string[] };
  preguntas: string[];
  bibliografia: Fuente[];
}

export const SECCIONES = [
  { slug: "inicio", nombre: "Inicio" },
  { slug: "materiales", nombre: "Materiales" },
  { slug: "esquema", nombre: "Esquema" },
  { slug: "procedimiento", nombre: "Procedimiento" },
  { slug: "calculos", nombre: "Cálculos" },
  { slug: "conclusiones", nombre: "Conclusiones" },
] as const;

export type SlugSeccion = (typeof SECCIONES)[number]["slug"];
