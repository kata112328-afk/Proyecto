
# BASE DE DATOS BRAINBRO

## Descripción

La base de datos de BrainBro fue desarrollada en Microsoft SQL Server y permite organizar la información de los usuarios, las actividades educativas, las preguntas, las respuestas y el seguimiento del progreso académico de los estudiantes.

## Herramientas utilizadas

- Microsoft SQL Server.
- SQL Server Management Studio (SSMS).
- Lenguaje SQL.

## Tablas principales

| Tabla | Descripción |
|---|---|
| RegistroUsuario | Almacena la información de los usuarios y sus roles. |
| Padre_Estudiante | Relaciona a los padres o acudientes con los estudiantes. |
| Preguntas | Almacena las preguntas de las diferentes materias y grados. |
| Respuestas | Contiene las respuestas asociadas a las preguntas. |
| Actividades | Organiza las actividades educativas del proyecto. |
| AlertasNotificaciones | Almacena las alertas y notificaciones. |
| VisualizacionProgreso | Permite consultar información del progreso académico. |

## Roles de usuario

- Estudiante.
- Padre o acudiente.
- Profesor.
- Coordinador.

## Cómo abrir la base de datos

1. Abrir SQL Server Management Studio (SSMS).
2. Conectarse al servidor de SQL Server.
3. Abrir el archivo SQL correspondiente que se encuentra en esta carpeta.
4. Ejecutar los scripts según el orden de creación establecido.

## Objetivo

Organizar y almacenar la información necesaria para el funcionamiento de BrainBro y facilitar la consulta de los datos relacionados con el aprendizaje de los estudiantes.

