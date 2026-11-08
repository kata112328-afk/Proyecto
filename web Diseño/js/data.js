
const ESTUDIANTES = [
  { id: "1", nombre: "Valentina Rojas", grado: "8°", identificacion: "1023456789", progreso: 86, estado: "Al día" },
  { id: "2", nombre: "Juan Pablo Cárdenas", grado: "7°", identificacion: "1029876543", progreso: 58, estado: "En riesgo" },
  { id: "3", nombre: "María Fernanda López", grado: "9°", identificacion: "1011223344", progreso: 74, estado: "Seguimiento" },
  { id: "4", nombre: "Santiago Torres", grado: "8°", identificacion: "1033445566", progreso: 91, estado: "Al día" },
  { id: "5", nombre: "Isabella Gutiérrez", grado: "7°", identificacion: "1044556677", progreso: 63, estado: "Seguimiento" },
  { id: "6", nombre: "Mateo Hernández", grado: "9°", identificacion: "1055667788", progreso: 47, estado: "En riesgo" }
];

const SEGUIMIENTOS = [
  {
    id: "S-001",
    estudiante: "Juan Pablo Cárdenas",
    fecha: "2026-10-12",
    tipo: "Académico",
    descripcion: "Bajo desempeño en matemáticas reportado por el docente. Dificultad con ecuaciones de primer grado.",
    acciones: "Asignar actividades de refuerzo en BrainBro y cita con acudiente.",
    registradoPor: "Orientadora"
  },
  {
    id: "S-002",
    estudiante: "María Fernanda López",
    fecha: "2026-10-10",
    tipo: "Asistencia",
    descripcion: "Tres inasistencias injustificadas en las últimas dos semanas.",
    acciones: "Llamada a la madre acudiente. Compromiso de asistencia firmado.",
    registradoPor: "Coordinador"
  },
  {
    id: "S-003",
    estudiante: "Mateo Hernández",
    fecha: "2026-10-08",
    tipo: "Convivencia",
    descripcion: "Reporte de conflicto con compañeros en hora de descanso.",
    acciones: "Sesión de mediación programada para el 20 de octubre.",
    registradoPor: "Orientadora"
  },
  {
    id: "S-004",
    estudiante: "Isabella Gutiérrez",
    fecha: "2026-10-05",
    tipo: "Académico",
    descripcion: "Mejora notable en inglés tras completar actividades de la plataforma.",
    acciones: "Continuar plan de refuerzo. Reconocimiento en clase.",
    registradoPor: "Orientadora"
  }
];

const ALERTAS = [
  {
    id: "A-101",
    titulo: "Estudiante en riesgo académico",
    mensaje: "Juan Pablo Cárdenas lleva 2 semanas con progreso inferior al 60%.",
    destinatario: "Orientadora",
    fecha: "2026-10-14",
    tipo: "Automática",
    leida: false
  },
  {
    id: "A-102",
    titulo: "Cita con acudiente",
    mensaje: "Recordatorio: cita con la acudiente de Mateo Hernández mañana 8:00 a.m.",
    destinatario: "Orientadora",
    fecha: "2026-10-15",
    tipo: "Manual",
    leida: false
  },
  {
    id: "A-103",
    titulo: "Nueva actividad asignada",
    mensaje: "Se publicó el quiz 'Ecuaciones de primer grado' para grado 7°.",
    destinatario: "Estudiantes 7°",
    fecha: "2026-10-13",
    tipo: "Automática",
    leida: true
  },
  {
    id: "A-104",
    titulo: "Reporte mensual disponible",
    mensaje: "El reporte de progreso de septiembre ya está listo para descargar.",
    destinatario: "Coordinador",
    fecha: "2026-10-01",
    tipo: "Automática",
    leida: true
  }
];

const ACTIVIDADES = [
  { id: "ACT-01", titulo: "Ecuaciones de primer grado", materia: "Matemáticas", grado: "7°", area: "Académica", preguntas: 10, completadaPor: 18, estado: "Activa" },
  { id: "ACT-02", titulo: "Comprensión lectora: textos narrativos", materia: "Lengua castellana", grado: "8°", area: "Académica", preguntas: 8, completadaPor: 22, estado: "Activa" },
  { id: "ACT-03", titulo: "Vocabulary quiz: daily routines", materia: "Inglés", grado: "7°", area: "Académica", preguntas: 12, completadaPor: 15, estado: "Activa" },
  { id: "ACT-04", titulo: "Sistema solar y planetas", materia: "Ciencias naturales", grado: "9°", area: "Académica", preguntas: 10, completadaPor: 9, estado: "Borrador" },
  { id: "ACT-05", titulo: "Ritmo y notas musicales", materia: "Música", grado: "8°", area: "Musical", preguntas: 6, completadaPor: 27, estado: "Activa" }
];

const PROGRESO_POR_MATERIA = [
  { materia: "Matemáticas", promedio: 62 },
  { materia: "Lengua", promedio: 74 },
  { materia: "Inglés", promedio: 68 },
  { materia: "Ciencias", promedio: 79 },
  { materia: "Sociales", promedio: 81 },
  { materia: "Música", promedio: 88 }
];
