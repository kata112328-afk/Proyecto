
const estado = {
  vista: "panel",
  seguimientos: SEGUIMIENTOS.slice(),
  alertas: ALERTAS.slice(),
  estudianteSeleccionado: ESTUDIANTES[1],
  busquedaHistorial: "",
  filtroGradoReportes: "Todos",
  filtroGradoActividades: "Todos",
  filtroAreaActividades: "Todas",
  formularioSeguimientoAbierto: false,
  mensajeSeguimiento: "",
  reporteGuardado: false,
  diapositivaCarrusel: 0,
  mural: leerListaGuardada("brainbro-mural"),
  eventos: leerListaGuardada("brainbro-eventos", ["27 de noviembre · Clausuras"]),
  actividadSeleccionada: null,
  quizPantalla: "portada",
  respuestaSeleccionada: null,
  respuestaComprobada: false,
  puntuacionQuiz: 0
};
let temporizadorCarrusel = null;

function leerListaGuardada(clave, valorInicial = []) {
  try {
    const datos = JSON.parse(localStorage.getItem(clave) || "null");
    return Array.isArray(datos) ? datos : valorInicial;
  } catch {
    return valorInicial;
  }
}

// ---------- Utilidades ----------

function escapar(texto) {
  return String(texto)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function insignia(texto, tono) {
  return `<span class="insignia insignia-${tono || "neutral"}">${escapar(texto)}</span>`;
}

function barraProgreso(valor) {
  const tono = valor >= 75 ? "ok" : valor >= 60 ? "medio" : "bajo";
  return `<div class="barra barra-${tono}"><div class="barra-relleno" style="width:${valor}%"></div></div>`;
}

function tonoEstado(estado) {
  return estado === "Al día" ? "ok" : estado === "En riesgo" ? "peligro" : "aviso";
}

// ---------- Pantallas ----------

function mostrarLogin() {
  document.getElementById("pantalla-login").classList.remove("oculto");
  document.getElementById("pantalla-dashboard").classList.add("oculto");
  clearInterval(temporizadorCarrusel);
  temporizadorCarrusel = null;
}

function mostrarDashboard() {
  document.getElementById("pantalla-login").classList.add("oculto");
  document.getElementById("pantalla-dashboard").classList.remove("oculto");
  navegar("panel");
}

function navegar(vista) {
  estado.vista = vista;
  const menu = document.getElementById("menu-navegacion");
  const botonMenu = document.getElementById("boton-menu");
  menu.classList.remove("abierto");
  botonMenu.setAttribute("aria-expanded", "false");
  document.querySelectorAll("#menu-navegacion .nav-item").forEach((boton) => {
    boton.classList.toggle("activo", boton.dataset.vista === vista);
  });
  dibujar();
  actualizarTemporizadorCarrusel();
}

function actualizarTemporizadorCarrusel() {
  clearInterval(temporizadorCarrusel);
  temporizadorCarrusel = null;
  if (estado.vista !== "panel" || document.getElementById("pantalla-dashboard").classList.contains("oculto")) return;
  temporizadorCarrusel = setInterval(() => {
    estado.diapositivaCarrusel = (estado.diapositivaCarrusel + 1) % 3;
    dibujar();
  }, 60000);
}

function dibujar() {
  const contenedor = document.getElementById("contenido");
  const vistas = {
    panel: dibujarPanel,
    seguimiento: dibujarSeguimiento,
    historial: dibujarHistorial,
    reportes: dibujarReportes,
    alertas: dibujarAlertas,
    actividades: dibujarActividades
  };
  contenedor.innerHTML = vistas[estado.vista]();
}

// ---------- Encabezado de página ----------

function encabezado(titulo, subtitulo, accion) {
  return `
    <div class="encabezado">
      <div>
        <h1>${escapar(titulo)}</h1>
        ${subtitulo ? `<p>${escapar(subtitulo)}</p>` : ""}
      </div>
      ${accion || ""}
    </div>`;
}

// ---------- Panel general ----------

function dibujarPanel() {
  const diapositivas = [
    { titulo: "Nuestra comunidad", detalle: "Encuentros y actividades del colegio", imagen: "Screenshot_20220503-202202.jpg", alt: "Comunidad escolar reunida en el patio" },
    { titulo: "Aprendizajes que nos unen", detalle: "Proyectos y experiencias escolares", imagen: "images5.jpg", alt: "Grupo de estudiantes y docentes" },
    { titulo: "Momentos para recordar", detalle: "La vida diaria en nuestro colegio", imagen: "images4.jpg", alt: "Patio y edificio del colegio" }
  ];
  const equipo = Array.from({ length: 20 }, (_, indice) => `
    <div class="cuadro-anuario" role="img" aria-label="Espacio ${indice + 1} de 20, foto pendiente">
      <span aria-hidden="true">+</span><small>${String(indice + 1).padStart(2, "0")}</small>
    </div>`).join("");
  const publicaciones = (elementos) => elementos.map((texto) => `<li>${escapar(texto)}</li>`).join("");

  return `
    <section class="panel-colegio">
      <header class="cabecera-colegio">
        <div>
          <h1>Colegio Guillermo León Valencia</h1>
          <p class="ubicacion-colegio">Engativá · Bogotá</p>
        </div>
        <img class="escudo-colegio" src="../imagen/images3.jpg" alt="Escudo del Colegio Guillermo León Valencia">
      </header>

      <div class="portada-colegio">
        <section class="panel-social panel-mural">
          <div class="titulo-seccion-colegio"><div><p class="sobrelinea-colegio">Comunidad</p><h2>Mural</h2></div></div>
          <form class="form-publicacion" onsubmit="guardarPublicacion(event, 'mural')">
            <label class="solo-lectores" for="entrada-mural">Escribe en el mural</label>
            <textarea id="entrada-mural" name="texto" rows="3" placeholder="Escribe un mensaje..." required></textarea>
            <button type="submit" class="boton-anadir">Añadir</button>
          </form>
          <ul class="lista-publicaciones">${publicaciones(estado.mural)}</ul>
        </section>

        <section class="seccion-carrusel" aria-label="Galería del colegio">
          <div class="titulo-seccion-colegio">
            <div><p class="sobrelinea-colegio">Vida escolar</p><h2>Galería del colegio</h2></div>
            <span class="contador-fotos">${estado.diapositivaCarrusel + 1} / ${diapositivas.length}</span>
          </div>
          <div class="carrusel-escenario" aria-live="polite">
            ${diapositivas.map((diapositiva, indice) => `
              <article class="diapositiva${indice === estado.diapositivaCarrusel ? " activa" : ""}" aria-hidden="${indice !== estado.diapositivaCarrusel}">
                <img class="imagen-carrusel" src="../imagen/${diapositiva.imagen}" alt="${diapositiva.alt}" ${indice === estado.diapositivaCarrusel ? "fetchpriority=high" : "loading=lazy"}>
                <div class="pie-diapositiva"><h3>${diapositiva.titulo}</h3><p>${diapositiva.detalle}</p></div>
              </article>`).join("")}
          </div>
          <div class="controles-carrusel" aria-label="Controles del carrusel">
            <button type="button" class="flecha-carrusel" onclick="irDiapositiva(${estado.diapositivaCarrusel - 1})" aria-label="Fotografía anterior">&#8592;</button>
            <div class="puntos-carrusel" aria-label="Seleccionar fotografía">
              ${diapositivas.map((_, indice) => `<button type="button" class="punto-carrusel${indice === estado.diapositivaCarrusel ? " activo" : ""}" onclick="irDiapositiva(${indice})" aria-label="Mostrar fotografía ${indice + 1}" aria-current="${indice === estado.diapositivaCarrusel ? "true" : "false"}"></button>`).join("")}
            </div>
            <button type="button" class="flecha-carrusel" onclick="irDiapositiva(${estado.diapositivaCarrusel + 1})" aria-label="Fotografía siguiente">&#8594;</button>
          </div>
        </section>

        <aside class="columna-derecha">
          <section class="panel-social panel-anuario">
            <div class="titulo-seccion-colegio">
              <div><p class="sobrelinea-colegio">Diseño anuario</p><h2>Equipo del colegio</h2></div>
              <span class="contador-fotos">20 fotos</span>
            </div>
            <div class="cuadricula-anuario">${equipo}</div>
          </section>

          <section class="panel-social panel-eventos">
            <div class="titulo-seccion-colegio"><div><p class="sobrelinea-colegio">Agenda escolar</p><h2>Eventos</h2></div></div>
            <form class="form-publicacion" onsubmit="guardarPublicacion(event, 'eventos')">
              <label class="solo-lectores" for="entrada-eventos">Añadir un evento</label>
              <textarea id="entrada-eventos" name="texto" rows="2" placeholder="Escribe un evento..." required></textarea>
              <button type="submit" class="boton-anadir">Añadir</button>
            </form>
            <ul class="lista-publicaciones">${publicaciones(estado.eventos)}</ul>
          </section>
        </aside>
      </div>
    </section>`;
}

function guardarPublicacion(evento, tipo) {
  evento.preventDefault();
  const texto = String(new FormData(evento.target).get("texto") || "").trim();
  const claves = { mural: "brainbro-mural", eventos: "brainbro-eventos" };
  if (!texto || !claves[tipo]) return;

  estado[tipo].unshift(texto);
  try {
    localStorage.setItem(claves[tipo], JSON.stringify(estado[tipo]));
  } catch {}
  dibujar();
}

function irDiapositiva(indice) {
  const totalDiapositivas = 3;
  estado.diapositivaCarrusel = (indice + totalDiapositivas) % totalDiapositivas;
  dibujar();
}
const modalregistro = document.getElementById("modalregistro");
const abrirregistro = document.getElementById("abrir-registro");
const cerrarregistro = document.getElementById("cerrar-registro");

function mostrarregistro() {
  modalregistro.classList.add("activo");
  document.body.style.overflow = "hidden";
}

function cerrarModal() {
  modalregistro.classList.remove("activo");
  document.body.style.overflow = "";
}

abrirregistro.addEventListener("click", mostrarregistro);
cerrarregistro.addEventListener("click", cerrarModal);

modalregistro.addEventListener("click", function (evento) {
  if (evento.target === modalregistro) {
    cerrarModal();
  }
});

document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape") {
    if (modalRecuperacion.classList.contains("activo")) {
      cerrarModalRecuperacion();
    } else {
      cerrarModal();
    }
  }
});

document.getElementById("form-registro").addEventListener("submit", function (evento) {
  evento.preventDefault();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmar-clave").value;
  if (password !== confirmPassword) {
    alert("Las contraseñas no coinciden. Por favor, inténtalo de nuevo.");
    return;
  }
  alert("Registro exitoso. Ahora puedes iniciar sesión.");
});

// ---------- Seguimiento de casos (CU-04) ----------

function alternarFormularioSeguimiento() {
  estado.formularioSeguimientoAbierto = !estado.formularioSeguimientoAbierto;
  estado.mensajeSeguimiento = "";
  dibujar();
}

function guardarSeguimiento(evento) {
  evento.preventDefault();
  const datos = new FormData(evento.target);
  const descripcion = String(datos.get("descripcion") || "").trim();
  const acciones = String(datos.get("acciones") || "").trim();
  if (!descripcion || !acciones) {
    estado.mensajeSeguimiento = "Faltan datos obligatorios.";
    dibujar();
    return;
  }
  estado.seguimientos.unshift({
    id: `S-${String(estado.seguimientos.length + 1).padStart(3, "0")}`,
    estudiante: String(datos.get("estudiante")),
    fecha: String(datos.get("fecha")),
    tipo: String(datos.get("tipo")),
    descripcion: descripcion,
    acciones: acciones,
    registradoPor: "Equipo institucional"
  });
  estado.mensajeSeguimiento = "Seguimiento registrado exitosamente.";
  estado.formularioSeguimientoAbierto = false;
  dibujar();
}

function dibujarSeguimiento() {
  const opcionesEstudiantes = ESTUDIANTES.map((e) => `<option>${escapar(e.nombre)}</option>`).join("");

  const formulario = estado.formularioSeguimientoAbierto
    ? `
    <div class="tarjeta margen-abajo">
      <form class="rejilla-formulario" onsubmit="guardarSeguimiento(event)">
        <select name="estudiante" class="entrada">${opcionesEstudiantes}</select>
        <select name="tipo" class="entrada">
          <option>Académico</option><option>Convivencia</option><option>Asistencia</option><option>Familiar</option>
        </select>
        <input name="fecha" type="date" value="2026-10-16" class="entrada">
        <textarea name="descripcion" rows="3" placeholder="Descripción de la situación" class="entrada ancho-completo"></textarea>
        <textarea name="acciones" rows="2" placeholder="Acciones a tomar" class="entrada ancho-completo"></textarea>
        <div class="ancho-completo"><button type="submit" class="boton boton-primario">Guardar seguimiento</button></div>
      </form>
    </div>`
    : "";

  const mensaje = estado.mensajeSeguimiento
    ? `<p class="mensaje-ok">${escapar(estado.mensajeSeguimiento)}</p>`
    : "";

  const lista = estado.seguimientos.map(
    (s) => `
    <div class="tarjeta margen-abajo">
      <div class="fila-espaciada">
        <div class="fila">
          <span class="id-registro">${escapar(s.id)}</span>
          <h3>${escapar(s.estudiante)}</h3>
          ${insignia(s.tipo, "ok")}
        </div>
        <span class="celda-gris">${escapar(s.fecha)} · ${escapar(s.registradoPor)}</span>
      </div>
      <p class="texto-normal">${escapar(s.descripcion)}</p>
      <p class="texto-acciones"><span class="acciones-titulo">Acciones:</span> ${escapar(s.acciones)}</p>
    </div>`
  ).join("");

  return `
    ${encabezado(
    "Seguimiento de casos",
    "Crea y consulta reportes de seguimiento con fecha y acciones a tomar (CU-04).",
    `<button class="boton boton-primario" onclick="alternarFormularioSeguimiento()">${estado.formularioSeguimientoAbierto ? "Cancelar" : "+ Nuevo seguimiento"}</button>`
  )}
    ${mensaje}
    ${formulario}
    <div>${lista}</div>`;
}

// ---------- Historial del estudiante (CU-05) ----------

function buscarHistorial(valor) {
  estado.busquedaHistorial = valor;
  dibujar();
  const buscador = document.getElementById("buscador-historial");
  if (buscador) {
    buscador.focus();
    buscador.setSelectionRange(valor.length, valor.length);
  }
}

function seleccionarEstudiante(id) {
  estado.estudianteSeleccionado = ESTUDIANTES.find((e) => e.id === id);
  dibujar();
}

function dibujarHistorial() {
  const seleccion = estado.estudianteSeleccionado;
  const filtrados = ESTUDIANTES.filter((e) =>
    e.nombre.toLowerCase().includes(estado.busquedaHistorial.toLowerCase())
  );

  const opciones = filtrados.length === 0
    ? `<li class="celda-gris">No se encontraron estudiantes.</li>`
    : filtrados.map(
      (e) => `
        <li>
          <button class="opcion-estudiante ${e.id === seleccion.id ? "activa" : ""}" onclick="seleccionarEstudiante('${e.id}')">
            ${escapar(e.nombre)} <span class="celda-gris">· ${escapar(e.grado)}</span>
          </button>
        </li>`
    ).join("");

  const registros = estado.seguimientos
    .filter((s) => s.estudiante === seleccion.nombre)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  const lineaTiempo = registros.length === 0
    ? `<div class="tarjeta"><p class="celda-gris">Sin historial disponible.</p></div>`
    : `
    <ol class="linea-tiempo">
      ${registros.map(
      (s) => `
        <li>
          <span class="punto-tiempo"></span>
          <div class="tarjeta">
            <div class="fila-espaciada">
              ${insignia(s.tipo, "ok")}
              <span class="celda-gris chico">${escapar(s.fecha)}</span>
            </div>
            <p class="texto-normal">${escapar(s.descripcion)}</p>
            <p class="texto-acciones">${escapar(s.acciones)}</p>
          </div>
        </li>`
    ).join("")}
    </ol>`;

  return `
    ${encabezado("Historial del estudiante", "Consulta cronológica de seguimientos. Los registros no se pueden eliminar (CU-05).")}
    <div class="cuadricula-historial">
      <div class="tarjeta">
        <input id="buscador-historial" class="entrada" placeholder="Buscar estudiante..." value="${escapar(estado.busquedaHistorial)}" oninput="buscarHistorial(this.value)">
        <ul class="lista-estudiantes">${opciones}</ul>
      </div>
      <div class="columna-historial">
        <div class="tarjeta margen-abajo">
          <h2 class="titulo-estudiante">${escapar(seleccion.nombre)}</h2>
          <p class="celda-gris">Grado ${escapar(seleccion.grado)} · ID ${escapar(seleccion.identificacion)}</p>
          <div class="fila margen-arriba">
            ${barraProgreso(seleccion.progreso)}
            <span class="negrita">${seleccion.progreso}%</span>
          </div>
        </div>
        ${lineaTiempo}
      </div>
    </div>`;
}

// ---------- Reportes y progreso (CU-07, CU-08) ----------

function filtrarReportesPorGrado(grado) {
  estado.filtroGradoReportes = grado;
  estado.reporteGuardado = false;
  dibujar();
}

function guardarReporte() {
  estado.reporteGuardado = true;
  dibujar();
}

function dibujarReportes() {
  const lista = estado.filtroGradoReportes === "Todos"
    ? ESTUDIANTES
    : ESTUDIANTES.filter((e) => e.grado === estado.filtroGradoReportes);
  const promedio = Math.round(lista.reduce((total, e) => total + e.progreso, 0) / (lista.length || 1));

  const barras = PROGRESO_POR_MATERIA.map(
    (m) => `
    <div class="columna-barra">
      <span class="valor-barra">${m.promedio}%</span>
      <div class="barra-grafico" style="height:${m.promedio * 1.8}px"></div>
      <span class="celda-gris chico">${escapar(m.materia)}</span>
    </div>`
  ).join("");

  const opcionesEstudiantes = ESTUDIANTES.map((e) => `<option>${escapar(e.nombre)}</option>`).join("");
  const etiquetaPromedio = `Promedio general ${estado.filtroGradoReportes !== "Todos" ? "grado " + estado.filtroGradoReportes : ""}`;

  return `
    ${encabezado(
    "Reportes y progreso",
    "Estadísticas del progreso académico y generación de reportes (CU-07, CU-08).",
    `<select class="entrada ancho-corto" onchange="filtrarReportesPorGrado(this.value)">
        <option ${estado.filtroGradoReportes === "Todos" ? "selected" : ""}>Todos</option>
        <option ${estado.filtroGradoReportes === "6°" ? "selected" : ""}>7°</option>
        <option ${estado.filtroGradoReportes === "7°" ? "selected" : ""}>8°</option>
        <option ${estado.filtroGradoReportes === "8°" ? "selected" : ""}>9°</option>
      </select>`
  )}
    <div class="cuadricula-reportes">
      <div class="tarjeta grafico-materias">
        <h2 class="margen-abajo">Promedio por materia</h2>
        <div class="grafico-barras">${barras}</div>
      </div>
      <div class="tarjeta tarjeta-promedio">
        <p class="celda-gris">${etiquetaPromedio}</p>
        <p class="promedio-grande">${promedio}%</p>
        <p class="celda-gris">${lista.length} estudiantes</p>
      </div>
    </div>
    <div class="tarjeta margen-arriba">
      <h2 class="margen-abajo">Generar nuevo reporte</h2>
      <div class="rejilla-formulario">
        <select class="entrada">${opcionesEstudiantes}</select>
        <select class="entrada"><option>Periodo 1 — 2027</option><option>Periodo 2 — 2027 </option><option>Periodo 3 — 2027</option></select>
        <select class="entrada"><option>Periodo 1 — 2028</option><option>Periodo 2 — 2028 </option><option>Periodo 3 — 2028</option></select>
        <textarea rows="3" placeholder="Comentarios del reporte" class="entrada ancho-completo"></textarea>
      </div>
      <div class="fila margen-arriba">
        <button class="boton boton-primario" onclick="guardarReporte()">Guardar reporte</button>
        ${estado.reporteGuardado ? `<span class="texto-exito">Reporte guardado correctamente.</span>` : ""}
      </div>
    </div>`;
}

// ---------- Alertas y notificaciones (CU-06) ----------

function enviarNotificacion(evento) {
  evento.preventDefault();
  const datos = new FormData(evento.target);
  const titulo = String(datos.get("Buscar por.." ) || "").trim();

  if (!titulo) return;
  estado.alertas.unshift({
    id: `A-${100 + estado.alertas.length + 1}`,
    titulo: titulo,
    mensaje: String(datos.get("mensaje") || ""),
    destinatario: String(datos.get("destinatario")),
    fecha: "2026-10-16",
    tipo: "Manual",
    leida: false
  });
  dibujar();
}
dibujar();

  const estadoEl = document.getElementById("estado-notificacion");
  if (estadoEl) {
    estadoEl.textContent = "Envío exitoso";
    estadoEl.style.display = "block";
    setTimeout(() => {
      estadoEl.style.display = "none";
    }, 3000);
  }
function marcarLeida(id) {
  estado.alertas = estado.alertas.map((a) => (a.id === id ? { ...a, leida: true } : a));
  dibujar();
}

function dibujarAlertas() {
  const tarjetas = estado.alertas.map(
    (a) => `
    <div class="tarjeta margen-abajo ${a.leida ? "" : "alerta-nueva"}">
      <div class="fila-superior">
        <div>
          <p class="alerta-titulo">${a.leida ? "" : '<span class="punto"></span>'}${escapar(a.titulo)}</p>
          <p class="texto-normal gris">${escapar(a.mensaje)}</p>
          <p class="celda-gris chico">Para: ${escapar(a.destinatario)} · ${escapar(a.fecha)}</p>
        </div>
        <div class="columna-derecha">
          ${insignia(a.tipo, a.tipo === "Automática" ? "neutral" : "ok")}
          ${a.leida ? "" : `<button class="enlace" onclick="marcarLeida('${a.id}')">Marcar leída</button>`}
        </div>
      </div>
    </div>`
  ).join("");

  return `
    ${encabezado("Alertas y notificaciones", "Envía notificaciones manuales y revisa las automáticas (CU-06).")}
    <div class="cuadricula-alertas">
      <div class="tarjeta">
        <h2 class="margen-abajo">Nueva notificación</h2>
        <form class="columna-formulario" onsubmit="enviarNotificacion(event)">
          <select name="buscar Por.." class="entrada" required>
  <option value="" disabled selected>Buscar por...</option>
  <button type="submit" class="boton boton-primario">Enviar notificación</button>

  <option value="Nombre">Nombre</option>
  <option value="Documento">Documento</option>
  <option value="Correo">Correo</option>
</select>
          <select name="destinatario" class="entrada">
            <option>Padres grado 6°</option><option>Padres grado 7°</option><option>Padres grado 8°</option><option>Coordinador</option><option>Estudiantes</option>
          </select>
          <textarea name="mensaje" rows="4" placeholder="Mensaje" class="entrada"></textarea>
          <button type="submit" class="boton boton-primario">Enviar notificación</button>
        </form>
      </div>
      <div class="columna-alertas">${tarjetas}</div>
    </div>`;
}

// ---------- Actividades educativas (CU-09) ----------

function filtrarActividades() {
  estado.filtroGradoActividades = document.getElementById("filtro-grado-act").value;
  estado.filtroAreaActividades = document.getElementById("filtro-area-act").value;
  dibujar();
}

const MATERIAS_VISUALES = {
  "Matemáticas": { icono: "∑", estilo: "matematicas" },
  "Español": { icono: "Aa", estilo: "espanol" },
  "Inglés": { icono: "EN", estilo: "ingles" },
  "Ciencias": { icono: "⚗", estilo: "ciencias" },
  "Música": { icono: "♫", estilo: "musica" },
  "Geometría": { icono: "△", estilo: "geometria" },
  "Sociales": { icono: "◎", estilo: "sociales" },
  "Sistemas": { icono: "⌘", estilo: "sistemas" },
  "Educación Física": { icono: "⚽", estilo: "fisica" },
  "Artes": { icono: "✿", estilo: "artes" }
};

const PREGUNTAS_DEMO = {
  "ACT-01": { texto: "¿Cuál es el valor de x en la ecuación 2x + 4 = 12?", opciones: ["2", "4", "6", "8"], correcta: 1 },
  "ACT-02": { texto: "¿Qué elemento suele contar los hechos de una narración?", opciones: ["El narrador", "El índice", "El glosario", "La portada"], correcta: 0 },
  "ACT-03": { texto: "¿Qué significa la palabra inglesa ‘usually’?", opciones: ["Nunca", "A veces", "Usualmente", "Ayer"], correcta: 2 },
  "ACT-04": { texto: "¿A qué temperatura hierve el agua al nivel del mar?", opciones: ["50 °C", "75 °C", "100 °C", "150 °C"], correcta: 2 },
  "ACT-05": { texto: "En un compás de 4/4, ¿cuántos tiempos suele durar una negra?", opciones: ["1 tiempo", "2 tiempos", "3 tiempos", "4 tiempos"], correcta: 0 },
  "ACT-06": { texto: "¿Cuánto suman los ángulos interiores de un triángulo?", opciones: ["90°", "180°", "270°", "360°"], correcta: 1 },
  "ACT-07": { texto: "¿En qué fecha se conmemora el inicio del proceso de independencia de Colombia?", opciones: ["20 de julio de 1810", "7 de agosto de 1819", "12 de octubre de 1492", "11 de noviembre de 1811"], correcta: 0 },
  "ACT-08": { texto: "¿Qué combinación de teclas se usa habitualmente para guardar un archivo?", opciones: ["Ctrl + P", "Ctrl + S", "Ctrl + Z", "Ctrl + X"], correcta: 1 },
  "ACT-09": { texto: "¿Qué conviene hacer antes de iniciar una actividad física intensa?", opciones: ["Calentar el cuerpo", "Dejar de hidratarse", "Evitar moverse", "Contener la respiración"], correcta: 0 },
  "ACT-10": { texto: "¿Cuáles son los colores primarios tradicionales en pintura?", opciones: ["Rojo, amarillo y azul", "Verde, naranja y violeta", "Negro, blanco y gris", "Rosa, café y turquesa"], correcta: 0 }
};

function abrirActividad(id) {
  estado.actividadSeleccionada = ACTIVIDADES.find((actividad) => actividad.id === id);
  estado.quizPantalla = "portada";
  estado.respuestaSeleccionada = null;
  estado.respuestaComprobada = false;
  estado.puntuacionQuiz = 0;
  dibujar();
}

function cerrarActividad() {
  estado.actividadSeleccionada = null;
  dibujar();
}

function empezarQuiz() {
  estado.quizPantalla = "pregunta";
  estado.respuestaSeleccionada = null;
  estado.respuestaComprobada = false;
  dibujar();
}

function seleccionarRespuesta(indice) {
  if (estado.respuestaComprobada) return;
  estado.respuestaSeleccionada = indice;
  estado.respuestaComprobada = true;
  if (indice === PREGUNTAS_DEMO[estado.actividadSeleccionada.id].correcta) {
    estado.puntuacionQuiz += 1;
  }
  dibujar();
}

function dibujarExperienciaQuiz() {
  const actividad = estado.actividadSeleccionada;
  const visual = MATERIAS_VISUALES[actividad.materia] || { icono: "?", estilo: "default" };
  const pregunta = PREGUNTAS_DEMO[actividad.id];

  if (estado.quizPantalla === "resultado") {
    const correcta = estado.puntuacionQuiz > 0;
    return `
      <section class="quiz-resultado">
        <button type="button" class="boton-volver-quiz" onclick="cerrarActividad()">&#8592; Actividades</button>
        <div class="resultado-caja ${correcta ? "resultado-correcto" : "resultado-reintentar"}">
          <span class="resultado-icono">${correcta ? "★" : "↻"}</span>
          <p class="etiqueta-vista-previa">Vista previa</p>
          <h1>${correcta ? "¡Muy bien!" : "¡Sigue practicando!"}</h1>
          <p>Resultado de demostración: ${estado.puntuacionQuiz} de 1 respuesta correcta.</p>
          <button type="button" class="boton boton-primario" onclick="cerrarActividad()">Volver a actividades</button>
        </div>
      </section>`;
  }

  if (estado.quizPantalla === "portada") {
    return `
      <section class="quiz-experiencia">
        <button type="button" class="boton-volver-quiz" onclick="cerrarActividad()">&#8592; Actividades</button>
        <div class="portada-quiz materia-${visual.estilo}">
          <div class="portada-quiz-ilustracion" role="img" aria-label="Ilustración de ${escapar(actividad.materia)}">${visual.icono}</div>
          <p class="etiqueta-vista-previa">Vista previa · ${escapar(actividad.materia)}</p>
          <h1>${escapar(actividad.titulo)}</h1>
          <p class="portada-quiz-detalle">Grado ${escapar(actividad.grado)} · 1 pregunta de demostración</p>
          <button type="button" class="boton-empezar-quiz" onclick="empezarQuiz()">Empezar</button>
        </div>
      </section>`;
  }

  return `
    <section class="quiz-experiencia">
      <div class="cabecera-quiz">
        <button type="button" class="boton-volver-quiz" onclick="cerrarActividad()">&#8592; Salir</button>
        <div class="quiz-materia"><span class="quiz-icono-mini materia-${visual.estilo}">${visual.icono}</span><span>${escapar(actividad.materia)}</span></div>
        <span class="quiz-progreso">1 / 1</span>
      </div>
      <div class="pregunta-quiz">
        <p class="etiqueta-vista-previa">Pregunta de demostración</p>
        <h1>${escapar(pregunta.texto)}</h1>
      </div>
      <div class="respuestas-quiz" role="group" aria-label="Selecciona una respuesta">
        ${pregunta.opciones.map((opcion, indice) => {
          let clase = "";
          if (estado.respuestaComprobada && indice === pregunta.correcta) clase = "respuesta-correcta";
          else if (estado.respuestaSeleccionada === indice) clase = "respuesta-incorrecta";
          return `<button type="button" class="respuesta-quiz ${clase}" onclick="seleccionarRespuesta(${indice})" ${estado.respuestaComprobada ? "disabled" : ""}>${escapar(opcion)}</button>`;
        }).join("")}
      </div>
      ${estado.respuestaComprobada ? `
        <div class="pie-quiz">
          <p class="retroalimentacion-quiz ${estado.respuestaSeleccionada === pregunta.correcta ? "correcta" : "incorrecta"}">${estado.respuestaSeleccionada === pregunta.correcta ? "¡Respuesta correcta!" : `La respuesta correcta es: ${escapar(pregunta.opciones[pregunta.correcta])}`}</p>
          <button type="button" class="boton boton-primario" onclick="estado.quizPantalla = 'resultado'; dibujar()">Ver resultado</button>
        </div>` : ""}
    </section>`;
}

function dibujarActividades() {
  if (estado.actividadSeleccionada) return dibujarExperienciaQuiz();

  const lista = ACTIVIDADES.filter(
    (a) =>
      (estado.filtroGradoActividades === "Todos" || a.grado === estado.filtroGradoActividades) &&
      (estado.filtroAreaActividades === "Todas" || a.area === estado.filtroAreaActividades)
    );

  const opcion = (valor, actual) => `<option ${valor === actual ? "selected" : ""}>${valor}</option>`;

  const tarjetas = lista.length === 0
    ? `<div class="tarjeta"><p class="celda-gris">No hay actividades disponibles con estos filtros.</p></div>`
    : lista.map(
      (a) => `
        <div class="tarjeta tarjeta-actividad">
          <div class="imagen-materia materia-${(MATERIAS_VISUALES[a.materia] || { estilo: "default" }).estilo}" role="img" aria-label="Ilustración de ${escapar(a.materia)}">
            <span>${(MATERIAS_VISUALES[a.materia] || { icono: "?" }).icono}</span>
          </div>
          <div class="fila-espaciada">
            <span class="materia">${escapar(a.materia)}</span>
            ${insignia(a.estado, a.estado === "Activa" ? "ok" : "neutral")}
          </div>
          <h3 class="titulo-actividad">${escapar(a.titulo)}</h3>
          <p class="celda-gris chico">Grado ${escapar(a.grado)} · ${escapar(a.area)}</p>
          <div class="pie-actividad">
            <div><p class="negrita">${a.preguntas}</p><p class="celda-gris chico">preguntas</p></div>
            <div><p class="negrita">${a.completadaPor}</p><p class="celda-gris chico">la completaron</p></div>
          </div>
          <button type="button" class="boton boton-primario boton-ancho boton-ingresar-quiz" onclick="abrirActividad('${escapar(a.id)}')">Ingresar</button>
        </div>`
    ).join("");

  return `
    ${encabezado(
    "Actividades educativas",
    "Quizzes por materia, grado y área de conocimiento (CU-09).",
    `<button class="boton boton-primario">+ Crear actividad</button>`
  )}
    <div class="fila filtros margen-abajo">
      <select id="filtro-grado-act" class="entrada ancho-corto" onchange="filtrarActividades()">
        ${opcion("Todos", estado.filtroGradoActividades)}
        ${opcion("6°", estado.filtroGradoActividades)}
        ${opcion("7°", estado.filtroGradoActividades)}
        ${opcion("8°", estado.filtroGradoActividades)}
      </select>
      <select id="filtro-area-act" class="entrada ancho-medio" onchange="filtrarActividades()">
        ${opcion("Todas", estado.filtroAreaActividades)}
        ${opcion("Académica", estado.filtroAreaActividades)}
        ${opcion("Tecnológica", estado.filtroAreaActividades)}
        ${opcion("Libre", estado.filtroAreaActividades)}
      </select>
      <select id="filtro-estado-act" class="entrada ancho-medio" onchange="filtrarActividades()">
        ${opcion("Todos", estado.filtroEstadoActividades)}
        ${opcion("Activa", estado.filtroEstadoActividades)}
        ${opcion("Finalizada", estado.filtroEstadoActividades)} 
      </select>
    </div>
    <div class="cuadricula-actividades">${tarjetas}</div>`;
}

// ---------- Inicio de sesión ----------

document.getElementById("form-login").addEventListener("submit", (evento) => {
  evento.preventDefault();
  const datos = new FormData(evento.target);
  const correo = String(datos.get("correo") || "").trim();
  const clave = String(datos.get("clave") || "").trim();
  const error = document.getElementById("login-error");
  if (!correo || !clave) {
    error.textContent = "Por favor completa tu correo y contraseña.";
    error.classList.remove("oculto");
    return;
  }
  error.classList.add("oculto");
  mostrarDashboard();
});

document.getElementById("enlace-salir").addEventListener("click", (evento) => {
  evento.preventDefault();
  mostrarLogin();
});

document.querySelectorAll("#menu-navegacion .nav-item").forEach((boton) => {
  boton.addEventListener("click", () => navegar(boton.dataset.vista));
});

const botonMenu = document.getElementById("boton-menu");
const menuNavegacion = document.getElementById("menu-navegacion");

botonMenu.addEventListener("click", () => {
  const abierto = menuNavegacion.classList.toggle("abierto");
  botonMenu.setAttribute("aria-expanded", String(abierto));
});

document.addEventListener("click", (evento) => {
  if (!menuNavegacion.contains(evento.target) && !botonMenu.contains(evento.target)) {
    menuNavegacion.classList.remove("abierto");
    botonMenu.setAttribute("aria-expanded", "false");
  }
});

const modalRecuperacion = document.getElementById("modal-recuperacion");
const formularioRecuperacion = document.getElementById("form-recuperacion");
let codigoRecuperacion = "";
let correoRecuperacion = "";
let vencimientoCodigo = 0;
let intentosCodigo = 0;
let codigoVerificado = false;
let intervaloCodigo = null;

function mostrarPasoRecuperacion(pasoActivo) {
  ["correo", "codigo", "nueva-clave"].forEach((paso) => {
    document.getElementById(`paso-${paso}`).classList.toggle("oculto", paso !== pasoActivo);
  });
}

function mostrarMensajeRecuperacion(texto, tipo) {
  const mensaje = document.getElementById("mensaje-recuperacion");
  mensaje.textContent = texto;
  mensaje.classList.remove("oculto", "error", "exito");
  mensaje.classList.add(tipo);
}

function actualizarCuentaRegresiva() {
  const restante = vencimientoCodigo - Date.now();
  const temporizador = document.getElementById("temporizador-recuperacion");
  if (restante <= 0) {
    clearInterval(intervaloCodigo);
    intervaloCodigo = null;
    document.getElementById("codigo-recuperacion").disabled = true;
    document.getElementById("verificar-codigo").disabled = true;
    temporizador.textContent = "El código venció. Genera uno nuevo para continuar.";
    mostrarMensajeRecuperacion("El tiempo terminó. Solicita otro código.", "error");
    return;
  }

  const segundos = Math.ceil(restante / 1000);
  const minutosTexto = String(Math.floor(segundos / 60)).padStart(2, "0");
  const segundosTexto = String(segundos % 60).padStart(2, "0");
  temporizador.textContent = `El código vence en ${minutosTexto}:${segundosTexto}`;
}

function generarCodigoDeDemostracion() {
  codigoRecuperacion = String(Math.floor(100000 + Math.random() * 900000));
  vencimientoCodigo = Date.now() + 3 * 60 * 1000;
  intentosCodigo = 0;
  codigoVerificado = false;
  document.getElementById("codigo-demo").textContent = codigoRecuperacion;
  document.getElementById("aviso-codigo-demo").classList.remove("oculto");
  document.getElementById("codigo-recuperacion").value = "";
  document.getElementById("codigo-recuperacion").disabled = false;
  document.getElementById("verificar-codigo").disabled = false;
  document.getElementById("mensaje-recuperacion").classList.add("oculto");
  mostrarPasoRecuperacion("codigo");
  actualizarCuentaRegresiva();
  clearInterval(intervaloCodigo);
  intervaloCodigo = setInterval(actualizarCuentaRegresiva, 1000);
}

function abrirModalRecuperacion(evento) {
  evento.preventDefault();
  limpiarRecuperacion();
  modalRecuperacion.classList.add("activo");
  modalRecuperacion.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.getElementById("correo-recuperacion").focus();
}

function limpiarRecuperacion() {
  clearInterval(intervaloCodigo);
  intervaloCodigo = null;
  formularioRecuperacion.reset();
  codigoRecuperacion = "";
  correoRecuperacion = "";
  vencimientoCodigo = 0;
  intentosCodigo = 0;
  codigoVerificado = false;
  mostrarPasoRecuperacion("correo");
  document.getElementById("aviso-codigo-demo").classList.add("oculto");
  document.getElementById("mensaje-recuperacion").classList.add("oculto");
  document.getElementById("cerrar-exito-recuperacion").classList.add("oculto");
}

function cerrarModalRecuperacion() {
  modalRecuperacion.classList.remove("activo");
  modalRecuperacion.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  limpiarRecuperacion();
}

document.getElementById("abrir-recuperacion").addEventListener("click", abrirModalRecuperacion);
document.getElementById("cerrar-recuperacion").addEventListener("click", cerrarModalRecuperacion);
document.getElementById("cerrar-exito-recuperacion").addEventListener("click", cerrarModalRecuperacion);

modalRecuperacion.addEventListener("click", (evento) => {
  if (evento.target === modalRecuperacion) cerrarModalRecuperacion();
});

document.getElementById("enviar-codigo").addEventListener("click", () => {
  const correo = document.getElementById("correo-recuperacion");
  if (!correo.checkValidity()) {
    correo.reportValidity();
    return;
  }
  correoRecuperacion = correo.value.trim();
  generarCodigoDeDemostracion();
});

document.getElementById("reenviar-codigo").addEventListener("click", generarCodigoDeDemostracion);

document.getElementById("verificar-codigo").addEventListener("click", () => {
  const entradaCodigo = document.getElementById("codigo-recuperacion");
  if (Date.now() >= vencimientoCodigo) {
    actualizarCuentaRegresiva();
    return;
  }
  if (!/^\d{6}$/.test(entradaCodigo.value.trim())) {
    mostrarMensajeRecuperacion("Escribe los seis dígitos del código.", "error");
    return;
  }
  if (entradaCodigo.value.trim() !== codigoRecuperacion) {
    intentosCodigo += 1;
    const restantes = 5 - intentosCodigo;
    if (restantes <= 0) {
      clearInterval(intervaloCodigo);
      intervaloCodigo = null;
      entradaCodigo.disabled = true;
      document.getElementById("verificar-codigo").disabled = true;
      mostrarMensajeRecuperacion("Se agotaron los intentos. Genera un código nuevo.", "error");
      return;
    }
    mostrarMensajeRecuperacion(`El código no coincide. Te quedan ${restantes} intentos.`, "error");
    return;
  }

  codigoVerificado = true;
  clearInterval(intervaloCodigo);
  intervaloCodigo = null;
  document.getElementById("aviso-codigo-demo").classList.add("oculto");
  document.getElementById("destino-codigo").textContent = `Correo verificado: ${correoRecuperacion}`;
  document.getElementById("mensaje-recuperacion").classList.add("oculto");
  mostrarPasoRecuperacion("nueva-clave");
  document.getElementById("nueva-clave").focus();
});

formularioRecuperacion.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const nuevaClave = document.getElementById("nueva-clave").value;
  const confirmarClave = document.getElementById("confirmar-nueva-clave").value;
  if (!codigoVerificado) {
    mostrarMensajeRecuperacion("Primero verifica el código.", "error");
  } else if (nuevaClave.length < 8) {
    mostrarMensajeRecuperacion("La contraseña debe tener al menos 8 caracteres.", "error");
  } else if (nuevaClave !== confirmarClave) {
    mostrarMensajeRecuperacion("Las contraseñas no coinciden.", "error");
  } else {
    mostrarPasoRecuperacion("");
    mostrarMensajeRecuperacion(`Demostración completada. Al conectar el backend, se actualizará la cuenta y se avisará a ${correoRecuperacion}.`, "exito");
    document.getElementById("cerrar-exito-recuperacion").classList.remove("oculto");
  }
});
