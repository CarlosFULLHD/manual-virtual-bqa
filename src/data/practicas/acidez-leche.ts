import type { Practica } from "@/lib/types";

/**
 * Práctica de ejemplo completa.
 * IMPORTANTE: revisar cantidades, concentraciones y rango de referencia
 * con el manual oficial de la cátedra antes de usarla con estudiantes.
 */
export const acidezLeche: Practica = {
  id: "acidez-leche",
  numero: 4,
  titulo: "Determinación de acidez titulable en leche",
  unidad: "Unidad 2 · Análisis de alimentos",
  duracion: "90 min",
  grupo: "Parejas",
  riesgo: "Bajo",
  estado: "asignada",
  fecha: "2026-10-02",
  resumen: "Medir cuánta acidez tiene una muestra de leche para saber si está fresca o empezó a descomponerse.",
  queEs:
    "La leche fresca es casi neutra. Con el tiempo, las bacterias que tiene naturalmente consumen la lactosa (el azúcar de la leche) y la convierten en ácido láctico. Mientras más ácido láctico, más alterada está la leche. En esta práctica medimos ese ácido agregando de a poco una base (NaOH) hasta neutralizarlo. Un indicador, la fenolftaleína, avisa cuándo terminamos: la leche se pone rosada.",
  objetivos: [
    "Determinar la acidez titulable de una muestra de leche expresada como % de ácido láctico.",
    "Aplicar correctamente la técnica de titulación ácido-base con indicador.",
    "Comparar el resultado con el valor de referencia y concluir sobre la calidad de la muestra.",
  ],
  fundamento:
    "El ácido láctico presente en la leche reacciona con el hidróxido de sodio en una reacción de neutralización, formando lactato de sodio y agua. La fenolftaleína es incolora en medio ácido y vira a rosado cuando el pH supera aproximadamente 8,2, es decir, cuando ya no queda ácido libre. Conociendo el volumen y la normalidad del NaOH gastado se calcula la cantidad de ácido presente en la muestra.",
  seguridad: [
    "Usar guardapolvo, gafas de seguridad y guantes de nitrilo.",
    "El NaOH irrita piel y ojos: si salpica, lavar con abundante agua durante 15 minutos.",
    "La fenolftaleína está disuelta en alcohol: mantenerla lejos de mecheros encendidos.",
    "No pipetear con la boca; usar propipeta.",
  ],
  materiales: [
    { nombre: "Bureta de 25 mL", cantidad: "1" },
    { nombre: "Soporte universal con pinza para bureta", cantidad: "1" },
    { nombre: "Matraz Erlenmeyer de 125 mL", cantidad: "3" },
    { nombre: "Pipeta volumétrica de 9 mL (o graduada de 10 mL)", cantidad: "1" },
    { nombre: "Propipeta", cantidad: "1" },
    { nombre: "Vaso de precipitados de 100 mL", cantidad: "1" },
    { nombre: "Embudo pequeño", cantidad: "1" },
    { nombre: "Piseta con agua destilada", cantidad: "1" },
  ],
  reactivos: [
    {
      id: "naoh",
      nombre: "Hidróxido de sodio (NaOH)",
      concentracion: "0,1 N",
      funcion:
        "Es la base que neutraliza el ácido de la leche. Como conocemos su concentración exacta, el volumen gastado nos dice cuánto ácido había.",
      peligros: "En solución 0,1 N provoca irritación de piel y ojos. Concentrado es corrosivo.",
      ghs: ["GHS07"],
      proteccion: "Gafas, guantes de nitrilo y guardapolvo.",
      desecho: "Neutralizar y desechar en el recipiente de residuos acuosos indicado por el laboratorio.",
      fuente: "https://pubchem.ncbi.nlm.nih.gov/compound/Sodium-hydroxide",
    },
    {
      id: "fenolftaleina",
      nombre: "Fenolftaleína",
      concentracion: "1 % en etanol",
      funcion:
        "Indicador. No reacciona con la leche; solo cambia de color (incoloro a rosado) cuando todo el ácido fue neutralizado.",
      peligros: "Sospechosa de causar cáncer y defectos genéticos. El etanol en que está disuelta es inflamable.",
      ghs: ["GHS02", "GHS08"],
      proteccion: "Guantes; evitar el contacto y las llamas cercanas.",
      desecho: "Recipiente de residuos orgánicos.",
      fuente: "https://pubchem.ncbi.nlm.nih.gov/compound/Phenolphthalein",
    },
    {
      id: "leche",
      nombre: "Muestra de leche",
      concentracion: "Fluida, a temperatura ambiente",
      funcion: "Es la muestra que se analiza.",
      peligros: "Sin peligros químicos. No consumir la muestra en el laboratorio.",
      ghs: [],
      proteccion: "Guantes.",
      desecho: "Por el desagüe con abundante agua.",
    },
    {
      id: "agua",
      nombre: "Agua destilada",
      concentracion: "—",
      funcion: "Enjuagar el material entre repeticiones.",
      peligros: "Ninguno.",
      ghs: [],
      proteccion: "—",
      desecho: "—",
    },
  ],
  esquema: {
    montaje: "titulacion",
    reaccion: "CH₃–CH(OH)–COOH  +  NaOH  →  CH₃–CH(OH)–COONa  +  H₂O",
    reaccionTexto: "ácido láctico + hidróxido de sodio → lactato de sodio + agua",
    reaccionExplicacion:
      'Por cada molécula de ácido láctico se gasta una de NaOH. Por eso el volumen de NaOH gastado "cuenta" cuánto ácido había.',
    decision: "¿Ya tienes 3 volúmenes? Si no, volver al paso 2",
    cierre: "Calcular % de acidez",
  },
  pasos: [
    {
      titulo: "Preparar la muestra",
      hacer: "Homogeneizar la leche invirtiendo el envase cerrado varias veces. Dejar que llegue a temperatura ambiente.",
      porque: "La grasa sube y se separa. Si no se mezcla, la alícuota que se tome no representa a toda la muestra.",
      observar: "La leche debe verse uniforme, sin capa de crema arriba.",
      error: "Medir la leche recién sacada del refrigerador o sin mezclar.",
    },
    {
      titulo: "Medir la muestra",
      hacer: "Con la pipeta volumétrica y la propipeta, tomar 9 mL de leche y colocarlos en un matraz Erlenmeyer.",
      porque: "El cálculo final depende del volumen de muestra. Por eso se usa material volumétrico, que es el más exacto.",
      observar: "Enrasar con el menisco a la altura de los ojos. Dejar que la pipeta escurra sola.",
      error: "Soplar la pipeta al final o leer el menisco desde arriba.",
    },
    {
      titulo: "Agregar el indicador",
      hacer: "Añadir 3 a 5 gotas de fenolftaleína al matraz y agitar suavemente.",
      porque: "El indicador es el que avisa, con un cambio de color, cuándo ya se neutralizó todo el ácido.",
      observar:
        "La leche debe seguir blanca. Si se pone rosada ya en este paso, el matraz tenía restos de base o la muestra está alterada.",
      error: "Poner demasiadas gotas: el cambio de color se vuelve más difícil de ver.",
    },
    {
      titulo: "Preparar la bureta",
      hacer:
        "Curar la bureta con un poco de NaOH 0,1 N, llenarla con el embudo, eliminar las burbujas de la punta y enrasar en 0,00 mL.",
      porque:
        "Si queda agua en la bureta, el NaOH se diluye y el resultado sale mal. Las burbujas ocupan volumen que se leería como NaOH gastado.",
      observar: "Punta de la bureta llena de líquido, sin burbujas. Retirar el embudo antes de enrasar.",
      error: "Dejar el embudo puesto: sigue goteando y cambia la lectura.",
      registro: [{ id: "vinicial", etiqueta: "Lectura inicial", unidad: "mL", ejemplo: "0,00" }],
    },
    {
      titulo: "Titular",
      hacer:
        "Colocar el matraz debajo de la bureta. Abrir la llave y dejar caer el NaOH gota a gota mientras se agita el matraz con movimientos circulares.",
      porque: "El NaOH va neutralizando el ácido láctico. Mientras quede ácido, la fenolftaleína sigue incolora.",
      observar:
        "Donde cae la gota aparece un rosado que desaparece al agitar. Cerca del final el rosado tarda más en irse: ahí conviene ir más despacio.",
      error: "Agregar el NaOH en chorro. Es fácil pasarse del punto final.",
      simulador: "titulacion",
    },
    {
      titulo: "Detectar el punto final",
      hacer: "Cerrar la llave cuando el rosado pálido se mantenga por 30 segundos. Leer el volumen en la bureta y anotarlo.",
      porque: "Ese es el punto final: el ácido se neutralizó por completo. El volumen leído es el NaOH gastado.",
      observar: "Rosado pálido y parejo en toda la leche, que no desaparece en 30 s.",
      error: "Pasarse a un rosado intenso. El resultado sale más alto de lo real.",
      temporizador: 30,
      registro: [{ id: "v1", etiqueta: "Volumen gastado, repetición 1", unidad: "mL", ejemplo: "1,50" }],
    },
    {
      titulo: "Repetir por triplicado",
      hacer: "Lavar el matraz, repetir los pasos 2 a 6 dos veces más y anotar cada volumen.",
      porque: "Con tres repeticiones se puede sacar un promedio y ver si la técnica fue precisa.",
      observar: "Los tres volúmenes deberían ser parecidos (diferencia menor a 0,1 mL).",
      error: "Olvidar volver a enrasar la bureta antes de cada repetición.",
      registro: [
        { id: "v2", etiqueta: "Repetición 2", unidad: "mL", ejemplo: "1,60" },
        { id: "v3", etiqueta: "Repetición 3", unidad: "mL", ejemplo: "1,50" },
      ],
    },
  ],
  calculo: {
    tipo: "acidez-titulable",
    entradas: ["v1", "v2", "v3"],
    ejemplo: [1.5, 1.6, 1.5],
    params: { normalidad: 0.1, volumenMuestra: 9, meq: 0.09 },
  },
  referencia: {
    min: 0.13,
    max: 0.18,
    unidad: "% ácido láctico",
    nota: "Valor orientativo para leche fresca de vaca. Confirmar el rango con el manual de la cátedra.",
    escalaMin: 0.08,
    escalaMax: 0.25,
  },
  causas: {
    alto: [
      "La leche está en proceso de acidificación (conservación deficiente).",
      "Se pasó el punto final (rosado intenso).",
      "La bureta no se curó: el NaOH se diluyó con agua y se gastó más volumen.",
    ],
    bajo: [
      "La leche fue neutralizada o adulterada con sustancias alcalinas.",
      "Se detuvo la titulación antes del punto final.",
      "Se midió menos leche de la indicada.",
    ],
  },
  preguntas: [
    "¿El resultado está dentro del rango de referencia? ¿Qué significa eso para la calidad de la leche?",
    "¿Las tres repeticiones fueron parecidas? ¿Qué dice el coeficiente de variación sobre tu técnica?",
    "¿Qué fuente de error pudo influir más en el resultado?",
  ],
  bibliografia: [
    { texto: "Manual de prácticas de Bioquímica Aplicada, UMSA (práctica correspondiente)." },
    { texto: "PubChem. Sodium hydroxide. National Library of Medicine.", url: "https://pubchem.ncbi.nlm.nih.gov/compound/Sodium-hydroxide" },
    { texto: "PubChem. Phenolphthalein. National Library of Medicine.", url: "https://pubchem.ncbi.nlm.nih.gov/compound/Phenolphthalein" },
    { texto: 'PubMed: búsqueda "milk titratable acidity".', url: "https://pubmed.ncbi.nlm.nih.gov/?term=milk+titratable+acidity" },
  ],
};
