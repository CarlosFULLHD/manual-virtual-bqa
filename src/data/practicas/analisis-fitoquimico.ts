import type { Practica } from "@/lib/types";

/**
 * Práctica 13 — Metabolismo vegetal: metabolitos secundarios y su interacción con el metabolismo humano.
 * Contenido tomado de la guía de la cátedra.
 *
 * Lo que NO está en la guía y se agregó para completar las pantallas (revisar con el docente):
 *  - La lista de equipos (la guía solo enumera reactivos).
 *  - Los minutos de cada etapa (la guía no da tiempos).
 *  - Las tres preguntas de análisis (salen del objetivo "relacionar los metabolitos con vías metabólicas").
 *  - La curva de glucosa se tomó como 80, 40, 20, 10 y 5 µg/mL (la guía dice "µL/mL").
 *  - La fila "Lugol" está en la tabla de registro de la guía, pero no en el procedimiento.
 */
export const analisisFitoquimico: Practica = {
  id: "analisis-fitoquimico",
  tipo: "laboratorio",
  numero: 13,
  titulo: "Metabolismo vegetal: metabolitos secundarios y su interacción con el metabolismo humano",
  unidad: "Laboratorio · Análisis fitoquímico",
  duracion: "3 h",
  grupo: "Grupos, una planta por grupo",
  riesgo: "Alto",
  estado: "asignada",
  fecha: "2026-11-27",
  resumen: "Prepara una infusión, haz su marcha fitoquímica con pruebas de color y relaciona sus metabolitos con el metabolismo energético humano.",
  queEs:
    "Las plantas sintetizan metabolitos secundarios (compuestos fenólicos, terpenos y alcaloides) que cumplen funciones de defensa y que, al consumirse, conservan actividad biológica en el organismo humano. En esta práctica se prepara una infusión de la planta asignada, se identifican sus grupos de metabolitos con pruebas de color y se propone cómo podrían actuar sobre el metabolismo energético.",
  claves: {
    mide: "Qué grupos de metabolitos secundarios tiene una infusión",
    con: "Pruebas de color (marcha fitoquímica) y lectura a 490 nm",
    senal: "Tabla de pruebas completa y esquema planta → efecto armado",
  },
  historia: [
    { icono: "matraz", titulo: "La infusión", texto: "2 g de planta seca por 100 mL de agua a 90–95 °C, 10 minutos." },
    { icono: "rosado", titulo: "Pruebas de color", texto: "Cada reactivo da un color o un precipitado con una familia de metabolitos." },
    { icono: "huella", titulo: "El perfil", texto: "Se anota cada prueba como (–), (+), (++) o (+++)." },
    { icono: "via", titulo: "El esquema", texto: "Planta → grupo fitoquímico → metabolito → diana molecular → vía metabólica → posible efecto." },
  ],
  objetivos: [
    "Objetivo general: determinar el perfil fitoquímico preliminar de una infusión vegetal seleccionada y relacionar sus metabolitos con sus posibles mecanismos de acción sobre el metabolismo energético humano.",
    "Preparar extractos acuosos (infusiones) de la planta asignada bajo condiciones estandarizadas.",
    "Realizar un tamizaje fitoquímico cualitativo (marcha fitoquímica) para identificar los principales grupos de metabolitos secundarios presentes.",
    "Cuantificar polifenoles totales y/o flavonoides totales mediante espectrofotometría.",
    "Relacionar los metabolitos identificados con vías metabólicas específicas (glucólisis, β-oxidación, ciclo de Krebs, termogénesis, señalización AMPK/insulina) mediante revisión bibliográfica.",
  ],
  fundamento:
    "Las plantas sintetizan metabolitos primarios (carbohidratos, lípidos, proteínas, ácidos nucleicos), esenciales para el crecimiento, y metabolitos secundarios, que cumplen funciones ecológicas: defensa contra herbívoros y patógenos, atracción de polinizadores y protección frente a radiación UV y estrés oxidativo. Se agrupan en tres familias: compuestos fenólicos (flavonoides, taninos, ácidos fenólicos, antocianinas), terpenos y terpenoides (aceites esenciales, saponinas, esteroles) y alcaloides (compuestos nitrogenados, incluida la cafeína). Al ser consumidos, muchos interactúan con enzimas, receptores y vías de señalización. Sus principales puntos de acción sobre el metabolismo energético son: (a) la vía AMPK, el sensor energético celular, que activan polifenoles como el ácido clorogénico (yerba mate, café), la curcumina y el cinamaldehído; (b) la termogénesis y la proteína desacopladora UCP1: las catequinas del té verde (EGCG) y la cafeína inhiben la COMT y prolongan la acción de la noradrenalina; (c) la sensibilidad a la insulina y el transportador GLUT4, que el cinamaldehído (canela) ayuda a translocar a la membrana; (d) el estrés oxidativo mitocondrial: flavonoides y antocianinas (flor de jamaica, moringa) captan radicales libres e inducen enzimas antioxidantes (vía Nrf2/ARE); y (e) la motilidad gastrointestinal: el mentol (menta) y el anetol (hinojo) actúan sobre canales iónicos del músculo liso (por ejemplo TRPM8). La actividad depende de la estructura: los grupos hidroxilo de los polifenoles determinan su capacidad antioxidante; los anillos aromáticos conjugados de los flavonoides permiten su unión a enzimas; y las estructuras xantínicas (cafeína, teobromina) antagonizan receptores de adenosina A1/A2A.",
  seguridad: [
    "H₂SO₄ y HCl concentrados: usar en campana de extracción, con guantes y gafas.",
    "Agregar el H₂SO₄ cuidadosamente por la pared del tubo, gota a gota.",
    "El cloroformo se maneja en campana: sus vapores son tóxicos.",
    "El fenol es tóxico y provoca quemaduras: evitar todo contacto con la piel.",
    "El acetato de plomo es tóxico: no desechar por el desagüe.",
  ],
  quiz: [
    {
      pregunta: "¿Cuáles son las tres grandes familias de metabolitos secundarios?",
      opciones: ["Carbohidratos, lípidos y proteínas", "Compuestos fenólicos, terpenos y alcaloides", "Vitaminas, minerales y fibra", "Ácidos nucleicos, enzimas y hormonas"],
      correcta: 1,
      explicacion: "Carbohidratos, lípidos y proteínas son metabolitos primarios. Los secundarios se agrupan en fenólicos, terpenos y alcaloides.",
    },
    {
      pregunta: "¿Qué detecta la prueba de Liebermann-Burchard?",
      opciones: ["Alcaloides", "Taninos", "Triterpenos", "Azúcares"],
      correcta: 2,
      explicacion: "Con ácido acético, cloroformo y una gota de H₂SO₄ se observa la coloración, sobre todo en la interfase.",
    },
    {
      pregunta: "Un precipitado naranja o rojizo con Dragendorff indica…",
      opciones: ["Flavonoides", "Alcaloides", "Taninos", "Cumarinas"],
      correcta: 1,
      explicacion: "Dragendorff y Mayer son las pruebas de alcaloides. Mayer da un precipitado color crema.",
    },
    {
      pregunta: "En la prueba de Shinoda, ¿qué se agrega al extracto?",
      opciones: ["Cinta de magnesio y HCl concentrado", "KOH al 5 %", "Gelatina y NaCl", "Acetato de plomo"],
      correcta: 0,
      explicacion: "Según el color se distinguen flavonas (naranja), flavonoides (rojo), flavonoles (rojo azulado) y otros.",
    },
    {
      pregunta: "¿Qué indica una 'nube' al agregar gelatina–cloruro de sodio?",
      opciones: ["Alcaloides", "Taninos", "Triterpenos", "Azúcares reductores"],
      correcta: 1,
      explicacion: "Los taninos precipitan proteínas como la gelatina. El acetato de plomo también los precipita.",
    },
    {
      pregunta: "¿Qué hace la AMPK en la célula?",
      opciones: ["Almacena glucógeno", "Actúa como sensor energético: promueve el catabolismo cuando falta ATP", "Sintetiza ácidos grasos", "Transporta glucosa por la sangre"],
      correcta: 1,
      explicacion: "Se activa cuando sube la relación AMP/ATP. Polifenoles como el ácido clorogénico pueden activarla.",
    },
  ],
  etapas: [
    { id: "A", nombre: "Preparación del extracto", minutos: 20 },
    { id: "B", nombre: "Determinación de azúcares reductores", minutos: 30 },
    { id: "C", nombre: "Triterpenos: Liebermann-Burchard", minutos: 15 },
    { id: "D", nombre: "Compuestos fenólicos", minutos: 40 },
    { id: "E", nombre: "Alcaloides", minutos: 15 },
  ],
  tablas: [
    {
      titulo: "Plantas para elegir (una por grupo)",
      nota: "Se presenta como té o droga vegetal para infusión.",
      columnas: ["Planta", "Nombre científico"],
      filas: [
        ["Té verde", "Camellia sinensis"],
        ["Yerba mate", "Ilex paraguariensis"],
        ["Jengibre", "Zingiber officinale"],
        ["Canela", "Cinnamomum spp."],
        ["Moringa", "Moringa oleifera"],
        ["Hibisco", "Hibiscus sabdariffa"],
        ["Romero", "Salvia rosmarinus"],
        ["Manzanilla", "Matricaria chamomilla"],
        ["Menta", "Mentha spp."],
        ["Fenogreco", "Trigonella foenum-graecum"],
      ],
    },
    {
      titulo: "Prueba de Shinoda (magnesio + HCl)",
      columnas: ["Compuesto", "Color"],
      filas: [["Flavonas", "Naranja"], ["Flavonoides", "Rojo"], ["Flavonoles", "Rojo azulado"], ["Flavononas", "Verde"], ["Flavononoles", "Verde azulado"], ["Xantanos", "Violeta"]],
    },
    {
      titulo: "Prueba del ácido sulfúrico",
      columnas: ["Compuesto", "Color"],
      filas: [["Chalconas", "Rojo azulado"], ["Auronas", "Rojo – guindo"], ["Flavonas", "Amarillo intenso"], ["Flavononas", "Naranja o guindo"], ["Flavonoles", "Amarillo intenso"]],
    },
    {
      titulo: "Prueba del zinc y prueba de KOH",
      columnas: ["Prueba", "Compuesto", "Color"],
      filas: [
        ["Zinc + HCl", "Leucoantocianidinas", "Rojo"],
        ["Zinc + HCl", "Catequinas", "Café amarillento"],
        ["KOH 5 %", "Cumarinas", "Cambio de color de fuerte a tenue (rojo a amarillo)"],
        ["KOH 5 %", "Antraquinonas", "Rojo"],
      ],
    },
  ],
  materiales: [
    { icono: "balanza", nombre: "Balanza", cantidad: "1" },
    { icono: "vaso", nombre: "Vaso de precipitados para la infusión", cantidad: "1" },
    { icono: "embudo", nombre: "Embudo y papel filtro", cantidad: "1" },
    { icono: "termometro", nombre: "Termómetro", cantidad: "1" },
    { icono: "tubo", nombre: "Tubos de ensayo", cantidad: "varios" },
    { icono: "gradilla", nombre: "Gradilla", cantidad: "1" },
    { icono: "bano", nombre: "Baño María (90 °C) y baño de hielo", cantidad: "1" },
    { icono: "agitador", nombre: "Vortex", cantidad: "1" },
    { icono: "pipeta", nombre: "Micropipetas", cantidad: "1 juego" },
    { icono: "espectro", nombre: "Lector de microplaca o espectrofotómetro (490 nm)", cantidad: "1" },
  ],
  reactivos: [
    { id: "glucosa", nombre: "Solución madre de glucosa", concentracion: "1 mg/mL en agua destilada", funcion: "Con ella se arman los puntos de la curva de azúcares.", peligros: "Ninguno.", ghs: [], proteccion: "—", desecho: "—" },
    { id: "fenol", nombre: "Fenol", concentracion: "5 %", funcion: "Con el H₂SO₄ da color con los azúcares (se lee a 490 nm).", peligros: "Tóxico por contacto, ingestión e inhalación; provoca quemaduras.", ghs: ["GHS05", "GHS06", "GHS08"], proteccion: "Campana, guantes y gafas.", desecho: "Residuos orgánicos tóxicos." },
    { id: "h2so4", nombre: "Ácido sulfúrico (H₂SO₄)", concentracion: "Concentrado", funcion: "Se usa en azúcares, Liebermann-Burchard y la prueba del ácido sulfúrico para fenólicos.", peligros: "Corrosivo: quemaduras graves. Libera mucho calor con agua.", ghs: ["GHS05"], proteccion: "Campana, guantes y gafas.", desecho: "Neutralizar; residuos ácidos." },
    { id: "acetico", nombre: "Ácido acético", concentracion: "—", funcion: "Liebermann-Burchard (triterpenos).", peligros: "Corrosivo e inflamable.", ghs: ["GHS02", "GHS05"], proteccion: "Campana, guantes y gafas.", desecho: "Residuos orgánicos." },
    { id: "cloroformo", nombre: "Cloroformo", concentracion: "—", funcion: "Liebermann-Burchard (triterpenos).", peligros: "Tóxico por inhalación; sospechoso de causar cáncer.", ghs: ["GHS06", "GHS08"], proteccion: "Solo en campana; guantes de nitrilo.", desecho: "Residuos halogenados." },
    { id: "mg", nombre: "Cinta de magnesio", concentracion: "Un trocito", funcion: "Prueba de Shinoda (flavonoides).", peligros: "Sólido inflamable.", ghs: ["GHS02"], proteccion: "Lejos de llamas.", desecho: "Según indicación del laboratorio." },
    { id: "zn", nombre: "Zinc", concentracion: "Granalla o polvo", funcion: "Prueba del zinc (leucoantocianidinas y catequinas).", peligros: "El polvo es inflamable y tóxico para organismos acuáticos.", ghs: ["GHS02", "GHS09"], proteccion: "Guantes.", desecho: "Residuos de metales." },
    { id: "hcl", nombre: "HCl", concentracion: "Concentrado", funcion: "Pruebas de Shinoda y del zinc (4 gotas).", peligros: "Corrosivo: quemaduras graves. Vapores irritantes.", ghs: ["GHS05", "GHS07"], proteccion: "Campana, guantes y gafas.", desecho: "Neutralizar." },
    { id: "koh", nombre: "KOH", concentracion: "5 %", funcion: "Prueba de KOH (cumarinas y antraquinonas).", peligros: "Corrosivo para piel y ojos.", ghs: ["GHS05"], proteccion: "Guantes y gafas.", desecho: "Neutralizar." },
    { id: "gelatina", nombre: "Gelatina–NaCl", concentracion: "Gelatina 1 % – NaCl 10 %", funcion: "Detecta taninos: forman una nube al precipitar la gelatina.", peligros: "Ninguno.", ghs: [], proteccion: "—", desecho: "Desagüe con agua." },
    { id: "plomo", nombre: "Acetato de plomo", concentracion: "5 %", funcion: "Detecta taninos: forma un precipitado.", peligros: "Tóxico para la reproducción; daña órganos por exposición repetida; muy tóxico para organismos acuáticos.", ghs: ["GHS08", "GHS09"], proteccion: "Guantes; no pipetear con la boca.", desecho: "Residuos de metales pesados. No al desagüe." },
    { id: "dragendorff", nombre: "Reactivo de Dragendorff", concentracion: "—", funcion: "Alcaloides: precipitado naranja o rojizo.", peligros: "Contiene bismuto y yoduro en medio ácido: irritante.", ghs: ["GHS07"], proteccion: "Guantes y gafas.", desecho: "Residuos de metales pesados." },
    { id: "mayer", nombre: "Reactivo de Mayer", concentracion: "—", funcion: "Alcaloides: precipitado color crema.", peligros: "Contiene mercurio: muy tóxico.", ghs: ["GHS06", "GHS08", "GHS09"], proteccion: "Guantes; evitar todo contacto.", desecho: "Residuos de mercurio." },
  ],
  esquema: {
    cadena: [
      { id: "planta", nombre: "Planta", ayuda: "La que le tocó a tu grupo. Ej.: té verde" },
      { id: "grupo", nombre: "Grupo fitoquímico", ayuda: "El que dio positivo en tus pruebas. Ej.: compuestos fenólicos (catequinas)" },
      { id: "metabolito", nombre: "Metabolito bioactivo propuesto", ayuda: "Ej.: EGCG" },
      { id: "diana", nombre: "Diana molecular", ayuda: "Enzima, receptor o canal sobre el que actúa. Ej.: COMT" },
      { id: "via", nombre: "Vía metabólica", ayuda: "Ej.: termogénesis / lipólisis" },
      { id: "efecto", nombre: "Posible efecto", ayuda: "Ej.: mayor gasto energético" },
    ],
  },
  pasos: [
    { etapa: "A", titulo: "Pesar la planta", icono: "medir", tiempo: "3 min", hacer: "Pesar 2 g de material vegetal seco (o 1 bolsita comercial) por cada 100 mL de agua.", porque: "Usar siempre la misma proporción permite comparar las plantas de los distintos grupos.", observar: "Condiciones estandarizadas: 2 g por 100 mL." },
    { etapa: "A", titulo: "Calentar el agua", icono: "reloj", tiempo: "5 min", hacer: "Calentar agua destilada hasta 90–95 °C (no hervir, salvo indicación específica de la planta).", porque: "El agua caliente extrae los metabolitos; hervir puede degradar algunos.", observar: "Termómetro entre 90 y 95 °C." },
    { etapa: "A", titulo: "Infusionar 10 minutos", icono: "reloj", tiempo: "10 min", hacer: "Verter el agua sobre el material vegetal, cubrir y dejar infusionar durante 10 minutos.", porque: "Tapar evita que se pierdan los compuestos volátiles.", observar: "El agua toma el color de la planta.", temporizador: 600 },
    { etapa: "A", titulo: "Filtrar y enfriar", icono: "gotas", tiempo: "5 min", hacer: "Filtrar y dejar enfriar a temperatura ambiente. Este extracto se usará para todas las pruebas posteriores.", porque: "Las pruebas de color se leen mejor en un extracto sin partículas.", observar: "Extracto transparente, coloreado." },
    { etapa: "B", titulo: "Preparar la curva de glucosa", icono: "grafico", tiempo: "10 min", hacer: "Preparar la solución madre de glucosa a 1 mg/mL en agua destilada y hacer diluciones seriadas para obtener los puntos de la curva (80, 40, 20, 10 y 5 µg/mL).", porque: "La curva permite convertir la absorbancia de la muestra en concentración de azúcares.", observar: "5 tubos rotulados con su concentración." },
    { etapa: "B", titulo: "Reacción fenol-sulfúrico", icono: "alerta", tiempo: "5 min", hacer: "En tubos limpios agregar 40 µL de las muestras, 40 µL de fenol al 5 % y homogenizar; luego añadir 200 µL de H₂SO₄ concentrado a cada tubo. Vortex 5 segundos.", porque: "El ácido deshidrata los azúcares y el producto reacciona con el fenol dando color.", observar: "El tubo se calienta y aparece un color amarillo-anaranjado.", error: "Agregar el ácido de golpe o fuera de la campana." },
    { etapa: "B", titulo: "Incubar a 90 °C", icono: "reloj", tiempo: "5 min", hacer: "Incubar en baño María a 90 °C durante 5 minutos exactos.", porque: "El tiempo exacto hace que el color sea comparable entre tubos.", observar: "Cronometrar.", temporizador: 300 },
    { etapa: "B", titulo: "Enfriar en hielo", icono: "reloj", tiempo: "5 min", hacer: "Enfriar en baño de hielo 5 minutos.", porque: "Detiene la reacción y estabiliza el color.", observar: "Tubos fríos antes de leer.", temporizador: 300 },
    {
      etapa: "B",
      titulo: "Leer a 490 nm",
      icono: "grafico",
      tiempo: "5 min",
      hacer: "Transferir 200 µL de cada tubo al pocillo correspondiente y leer a 490 nm.",
      porque: "La absorbancia a 490 nm es proporcional a la cantidad de azúcares.",
      observar: "Más color = más absorbancia = más azúcares.",
      registro: [
        { id: "g5", etiqueta: "Glucosa 5 µg/mL", unidad: "Abs", ejemplo: "0,060" },
        { id: "g10", etiqueta: "Glucosa 10 µg/mL", unidad: "Abs", ejemplo: "0,118" },
        { id: "g20", etiqueta: "Glucosa 20 µg/mL", unidad: "Abs", ejemplo: "0,240" },
        { id: "g40", etiqueta: "Glucosa 40 µg/mL", unidad: "Abs", ejemplo: "0,475" },
        { id: "g80", etiqueta: "Glucosa 80 µg/mL", unidad: "Abs", ejemplo: "0,950" },
        { id: "gMuestra", etiqueta: "Extracto de la planta", unidad: "Abs", ejemplo: "0,310" },
      ],
    },
    { etapa: "C", titulo: "Liebermann-Burchard", icono: "alerta", tiempo: "10 min", hacer: "Colocar 1 mL de ácido acético + 1 mL de cloroformo en un tubo. Enfriar en baño de hielo. Añadir 1 mL de muestra. Añadir cuidadosamente 1 gota de H₂SO₄ concentrado por la pared del tubo. Mantener en baño de hielo.", porque: "Los triterpenos reaccionan en medio ácido fuerte dando compuestos coloreados.", observar: "Observar la coloración desarrollada, especialmente en la interfase.", error: "Agitar el tubo: la lectura se hace en la interfase." },
    { etapa: "D", titulo: "Prueba de Shinoda", icono: "gotas", tiempo: "5 min", hacer: "En un tubo de ensayo colocar 500 µL del extracto con un trocito de cinta de magnesio y 4 gotas de HCl concentrado, en la campana de extracción.", porque: "El magnesio en medio ácido reduce los flavonoides y cambia su color.", observar: "Naranja: flavonas. Rojo: flavonoides. Rojo azulado: flavonoles. Verde: flavononas. Verde azulado: flavononoles. Violeta: xantanos." },
    { etapa: "D", titulo: "Prueba del ácido sulfúrico", icono: "gotas", tiempo: "5 min", hacer: "En un tubo de ensayo colocar 500 µL del extracto y 3 gotas de ácido sulfúrico concentrado, en la campana de extracción.", porque: "Cada tipo de flavonoide da un color distinto con el ácido.", observar: "Rojo azulado: chalconas. Rojo-guindo: auronas. Amarillo intenso: flavonas o flavonoles. Naranja o guindo: flavononas." },
    { etapa: "D", titulo: "Prueba del zinc", icono: "gotas", tiempo: "5 min", hacer: "En un tubo de ensayo colocar 500 µL del extracto con un trocito de zinc en granalla o polvo y 4 gotas de HCl concentrado.", porque: "Distingue leucoantocianidinas de catequinas.", observar: "Rojo: leucoantocianidinas. Café amarillento: catequinas." },
    { etapa: "D", titulo: "Prueba de KOH", icono: "gotas", tiempo: "5 min", hacer: "En un tubo de ensayo colocar 500 µL del extracto y 3 gotas de KOH al 5 %.", porque: "Cumarinas y antraquinonas cambian de color en medio alcalino.", observar: "Cambio de color de fuerte a tenue (rojo a amarillo): cumarinas. Rojo: antraquinonas." },
    { etapa: "D", titulo: "Gelatina–cloruro de sodio", icono: "ojo", tiempo: "5 min", hacer: "En un tubo de ensayo colocar 2 mL del extracto con 5 gotas de gelatina–cloruro de sodio.", porque: "Los taninos precipitan proteínas como la gelatina.", observar: "La formación de una sustancia en forma de nube indica taninos." },
    { etapa: "D", titulo: "Acetato de plomo", icono: "ojo", tiempo: "5 min", hacer: "En un tubo de ensayo añadir 1 mL de extracto y 1 mL de acetato de plomo al 5 %.", porque: "El plomo forma compuestos insolubles con los taninos.", observar: "La formación de un precipitado indica taninos.", error: "Desechar por el desagüe: va a residuos de metales pesados." },
    { etapa: "E", titulo: "Dragendorff", icono: "ojo", tiempo: "5 min", hacer: "Colocar 1 mL de muestra con 1 mL de reactivo de Dragendorff.", porque: "El reactivo forma un complejo insoluble con los alcaloides.", observar: "Positivo: precipitado naranja o rojizo." },
    { etapa: "E", titulo: "Mayer", icono: "ojo", tiempo: "5 min", hacer: "Colocar 1 mL de muestra con 1 mL de reactivo de Mayer.", porque: "Confirma la presencia de alcaloides con un segundo reactivo.", observar: "Positivo: precipitado de color crema." },
  ],
  resultados: "fitoquimico",
  analisis: [
    {
      titulo: "Relación con el metabolismo energético humano",
      preguntas: [
        { id: "f1", titulo: "Tus hallazgos", pregunta: "¿Qué grupos de metabolitos secundarios dieron positivo en tu planta y con qué intensidad? ¿Coincide con lo que reporta la bibliografía para esa especie?", buscar: "phytochemical screening infusion polyphenols flavonoids" },
        { id: "f2", titulo: "Mecanismo de acción", pregunta: "Elige el metabolito más relevante de tu planta y explica sobre cuál de los puntos de intervención actúa (AMPK, termogénesis/UCP1, sensibilidad a la insulina/GLUT4, estrés oxidativo mitocondrial o motilidad gastrointestinal) y con qué vía metabólica se relaciona (glucólisis, β-oxidación, ciclo de Krebs, termogénesis, señalización AMPK/insulina).", buscar: "polyphenols AMPK activation energy metabolism" },
        { id: "f3", titulo: "Estructura y actividad", pregunta: "¿Qué característica estructural del metabolito explica su actividad (grupos hidroxilo, anillos aromáticos conjugados, estructura xantínica)?" },
      ],
    },
  ],
  preguntas: [],
  bibliografia: [
    { texto: "Crișan, D., et al. (2025). Effects of Moringa oleifera Lam. Supplementation on Cardiometabolic Outcomes: A Meta-Analysis of Randomized Controlled Trials with GRADE Assessment.", url: "https://pubmed.ncbi.nlm.nih.gov/41305552/" },
    { texto: "Mokgalaboni, K., et al. (2026). Moringa oleifera on hyperglycemia and hypertension in metabolic diseases: Systematic review, exploratory meta-analysis and meta-regression. Metabolism Open, 29, 100451.", url: "https://pubmed.ncbi.nlm.nih.gov/41816507/" },
    { texto: "Malekahmadi, M., et al. (2024). The effect of chamomile consumption on glycemic markers in humans and animals: a systematic review and meta-analysis.", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11196442/" },
    { texto: "Efficacy and safety of Hibiscus sabdariffa in cardiometabolic health: An overview of reviews and updated dose-response meta-analysis. (2025).", url: "https://pubmed.ncbi.nlm.nih.gov/39870328/" },
    { texto: "Wang, J., et al. (2022). The effect of ginger supplementation on metabolic profiles in patients with type 2 diabetes mellitus: A systematic review and meta-analysis of randomized controlled trials.", url: "https://www.sciencedirect.com/science/article/pii/S0965229922000048" },
    { texto: "Salimi, S., et al. (2024). Efficacy of Ginger, Cardamom, Purslane, Saffron and Cinnamon Consumption on Lipid Profile, Glycemic Control, Blood Pressure and Markers of Anthropometric and Inflammation in Metabolic Syndrome Patients.", url: "https://www.benthamscience.com/article/137986" },
  ],
};
