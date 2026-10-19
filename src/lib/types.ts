/**
 * Modelo de datos de una práctica.
 * Todas las prácticas tienen la misma estructura; el sistema solo lee estos datos.
 * Para agregar una práctica nueva se crea un archivo en src/data/practicas/
 * y se registra en src/data/practicas/index.ts.
 */

export type EstadoPractica = "asignada" | "borrador";
export type NivelRiesgo = "Bajo" | "Moderado" | "Alto";
export type CodigoGHS = "GHS01" | "GHS02" | "GHS03" | "GHS04" | "GHS05" | "GHS06" | "GHS07" | "GHS08" | "GHS09";

/** Iconos disponibles para materiales (ver src/components/ui/IconoMaterial.tsx) */
export type TipoIconoMaterial =
  | "bureta" | "soporte" | "erlenmeyer" | "pipeta" | "propipeta" | "vaso" | "embudo" | "piseta" | "tubo" | "generico"
  | "bano" | "espectro" | "centrifuga" | "balanza" | "cronometro" | "agitador" | "columna" | "mortero" | "gradilla" | "termometro";

export interface Material {
  nombre: string;
  cantidad: string;
  icono?: TipoIconoMaterial;
}

/** Tarjeta de la explicación rápida ("En 30 segundos") */
export interface TarjetaHistoria {
  icono: "leche" | "bacteria" | "gota" | "rosado" | "matraz" | "idea" | "sangre" | "via" | "bloqueo" | "huella";
  titulo: string;
  texto: string;
}

/** Pregunta del cuestionario previo */
export interface Pregunta {
  pregunta: string;
  opciones: string[];
  /** índice de la opción correcta */
  correcta: number;
  explicacion: string;
}

/** Punto interactivo sobre el dibujo del montaje (coordenadas del viewBox 0 0 360 300) */
export interface PuntoMontaje {
  x: number;
  y: number;
  titulo: string;
  texto: string;
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

export type IconoPaso = "mezclar" | "medir" | "gotas" | "bureta" | "titular" | "ojo" | "repetir" | "calcular" | "reloj" | "matraz" | "grafico" | "alerta" | "lapiz";

export interface Paso {
  /** Etapa o parte del procedimiento a la que pertenece (id de `etapas`) */
  etapa?: string;
  titulo: string;
  icono?: IconoPaso;
  /** Tiempo aproximado, p. ej. "2 min" */
  tiempo?: string;
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

export interface Especie {
  nombre: string;
  /** De dónde viene o cómo queda, p. ej. "en la leche" */
  detalle: string;
}

export interface Esquema {
  montaje?: TipoMontaje;
  puntos?: PuntoMontaje[];
  /** Versión visual de la reacción: qué entra y qué sale */
  especies?: { reactivos: Especie[]; productos: Especie[] };
  reaccion?: string;
  reaccionTexto?: string;
  reaccionExplicacion?: string;
  /** Eslabones de un esquema que el estudiante debe completar (p. ej. planta → metabolito → efecto) */
  cadena?: { id: string; nombre: string; ayuda: string }[];
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

/* ---------- Extras de una práctica de laboratorio ---------- */

/** Etapa del procedimiento, con su tiempo estimado */
export interface Etapa {
  id: string;
  nombre: string;
  minutos: number;
}

/** Tabla informativa (grupos y muestras, colores de reacción, valores esperados…) */
export interface TablaInfo {
  titulo: string;
  nota?: string;
  columnas: string[];
  filas: string[][];
}

/** Calculadoras de resultados disponibles (ver components/resultados) */
export type TipoResultados = "lipolisis" | "carnitina" | "metabolismo" | "fitoquimico";

/* ---------- Contenido de un tema teórico ---------- */

export interface Leccion {
  id: string;
  titulo: string;
  icono: string;
  /** La idea central en una frase */
  idea: string;
  formula?: string;
  /** Qué significa cada letra de la fórmula */
  variables?: string[];
  /** Cómo se resuelve, en pasos cortos */
  metodo?: string[];
  ejemplo?: { enunciado: string; pasos: string[]; resultado: string };
  /** Errores típicos */
  cuidado?: string[];
  /** Mini calculadora interactiva asociada (ver components/teoria/Widgets.tsx) */
  widget?: "dilucion" | "molar" | "concentrado" | "mezcla" | "seriada" | "buffer" | "unidades" | "normalidad";
}

/* ---------- Contenido de un caso clínico ---------- */

export interface Analito {
  nombre: string;
  valor: number;
  /** Texto de la referencia, p. ej. "<0.25" o "20–50" */
  referencia: string;
  /** Límite numérico para graficar (corte superior, o inferior si `bajo`) */
  corte: number;
  /** true si lo anormal es estar por debajo del corte */
  bajo?: boolean;
  nota?: string;
  clave?: boolean;
}

export interface RatioCaso {
  nombre: string;
  valor: string;
  corte: string;
  nota: string;
}

export interface CasoClinico {
  id: string;
  titulo: string;
  presentacion: string;
  analitos: Analito[];
  ratios: RatioCaso[];
  /** Respuestas de la tabla de identificación (ids de OPCIONES) */
  respuesta: { diagnostico: string; enzima: string; gen: string; marcador: string };
  explicacion: string;
}

export interface PreguntaAbierta {
  id: string;
  titulo: string;
  pregunta: string;
  /** Ideas que una buena respuesta debería tocar (se muestran a pedido). Opcional. */
  ideasClave?: string[];
  /** Búsqueda sugerida en PubMed para profundizar */
  buscar?: string;
}

export interface BloqueTeoria {
  titulo: string;
  icono: string;
  texto: string;
  puntos?: string[];
}

export interface ContenidoCaso {
  introduccion: BloqueTeoria[];
  /** Marcadores y su significado */
  marcadores: { codigo: string; nombre: string; significado: string }[];
  /** Enzimas de la vía para el diagrama interactivo */
  enzimas: { id: string; nombre: string; sigla: string; rango: string; desde: number; hasta: number; acumula: string; enfermedad: string; gen: string; nota: string }[];
  casos: CasoClinico[];
  opciones: {
    diagnostico: { id: string; texto: string }[];
    enzima: { id: string; texto: string }[];
    gen: { id: string; texto: string }[];
    marcador: { id: string; texto: string }[];
  };
  analisis: { titulo: string; preguntas: PreguntaAbierta[] }[];
  taller: {
    titulo: string;
    paciente: string;
    antecedentes: string;
    presentacion: string;
    analitos: Analito[];
    preguntas: PreguntaAbierta[];
    /** Estudios de confirmación para ordenar */
    estudios: { id: string; estudio: string; muestra: string; porque: string }[];
  };
  rubrica: { criterio: string; excelente: string }[];
  busquedas: { titulo: string; descripcion: string; url: string }[];
}

export interface Practica {
  id: string;
  /** Si se omite, es una práctica de laboratorio */
  tipo?: TipoPractica;
  /** Texto que reemplaza al número en la insignia (p. ej. "L2") */
  etiqueta?: string;
  lecciones?: Leccion[];
  caso?: ContenidoCaso;
  /** Laboratorio: etapas con tiempos, tablas informativas, calculadora de resultados y preguntas de análisis */
  etapas?: Etapa[];
  tablas?: TablaInfo[];
  resultados?: TipoResultados;
  /** Tabla de resultados esperados (se muestra en Conclusiones) */
  esperados?: TablaInfo;
  analisis?: { titulo: string; preguntas: PreguntaAbierta[] }[];
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
  /** Explicación visual en 3-5 tarjetas cortas */
  historia?: TarjetaHistoria[];
  /** Qué medimos, con qué y cómo sabemos que terminamos (una frase corta cada uno) */
  claves?: { mide: string; con: string; senal: string };
  quiz?: Pregunta[];
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
  /** Frases para interpretar el resultado según quede dentro, arriba o abajo del rango */
  interpretacion?: { ok: string[]; alto: string[]; bajo: string[] };
  preguntas: string[];
  bibliografia: Fuente[];
}

/* =========================================================
   Tipos de práctica y sus pantallas
   - laboratorio: práctica experimental (materiales, procedimiento, resultados, conclusiones)
   - teoria: tema teórico con lecciones y ejercicios (sin laboratorio ni conclusiones)
   - caso: resolución de casos clínicos, paso a paso (sin laboratorio)
   ========================================================= */

export type TipoPractica = "laboratorio" | "teoria" | "caso";

export interface Seccion {
  slug: string;
  nombre: string;
  corto: string;
}

export const SECCIONES_POR_TIPO: Record<TipoPractica, Seccion[]> = {
  laboratorio: [
    { slug: "inicio", nombre: "Inicio", corto: "Inicio" },
    { slug: "preparate", nombre: "Prepárate", corto: "Quiz" },
    { slug: "materiales", nombre: "Materiales", corto: "Mesa" },
    { slug: "esquema", nombre: "Esquema", corto: "Esquema" },
    { slug: "procedimiento", nombre: "Procedimiento", corto: "Pasos" },
    { slug: "calculos", nombre: "Resultados", corto: "Datos" },
    { slug: "conclusiones", nombre: "Conclusiones", corto: "Cierre" },
  ],
  teoria: [
    { slug: "inicio", nombre: "Inicio", corto: "Inicio" },
    { slug: "conceptos", nombre: "Conceptos", corto: "Teoría" },
    { slug: "ejercicios", nombre: "Ejercicios", corto: "Ejercicios" },
    { slug: "autoevaluacion", nombre: "Autoevaluación", corto: "Quiz" },
  ],
  caso: [
    { slug: "inicio", nombre: "Inicio", corto: "Inicio" },
    { slug: "fundamento", nombre: "Fundamento", corto: "Teoría" },
    { slug: "casos", nombre: "Casos", corto: "Casos" },
    { slug: "analisis", nombre: "Análisis", corto: "Análisis" },
    { slug: "taller", nombre: "Taller", corto: "Taller" },
    { slug: "fuentes", nombre: "Artículos", corto: "Fuentes" },
  ],
};

/** Compatibilidad: secciones de una práctica de laboratorio */
export const SECCIONES = SECCIONES_POR_TIPO.laboratorio;

export function tipoDe(p: Pick<Practica, "tipo">): TipoPractica {
  return p.tipo ?? "laboratorio";
}

export function seccionesDe(p: Pick<Practica, "tipo">): Seccion[] {
  return SECCIONES_POR_TIPO[tipoDe(p)];
}

export const NOMBRE_TIPO: Record<TipoPractica, string> = {
  laboratorio: "Laboratorio",
  teoria: "Tema teórico",
  caso: "Caso clínico",
};
