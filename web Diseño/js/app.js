
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
  reporteGuardado: false
};

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
}

function mostrarDashboard() {
  document.getElementById("pantalla-login").classList.add("oculto");
  document.getElementById("pantalla-dashboard").classList.remove("oculto");
  navegar("panel");
}

function navegar(vista) {
  estado.vista = vista;
  document.querySelectorAll("#menu-navegacion .nav-item").forEach((boton) => {
    boton.classList.toggle("activo", boton.dataset.vista === vista);
  });
  dibujar();
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
  const enRiesgo = ESTUDIANTES.filter((e) => e.estado === "En riesgo").length;
  const pendientes = estado.alertas.filter((a) => !a.leida).length;
  const actividadesActivas = ACTIVIDADES.filter((a) => a.estado === "Activa").length;

  const tarjetas = [
    { etiqueta: "Estudiantes", valor: ESTUDIANTES.length },
    { etiqueta: "En riesgo", valor: enRiesgo },
    { etiqueta: "Seguimientos del mes", valor: estado.seguimientos.length },
    { etiqueta: "Actividades activas", valor: actividadesActivas }
  ];

  const filas = ESTUDIANTES.map(
    (e) => `
    <tr>
      <td class="celda-nombre">${escapar(e.nombre)}</td>
      <td class="celda-gris">${escapar(e.grado)}</td>
      <td>
        <div class="celda-progreso">${barraProgreso(e.progreso)}<span class="celda-gris chico">${e.progreso}%</span></div>
      </td>
      <td>${insignia(e.estado, tonoEstado(e.estado))}</td>
    </tr>`
  ).join("");

  const alertasRecientes = estado.alertas.slice(0, 3).map(
    (a) => `
    <li class="alerta-mini">
      <p class="alerta-mini-titulo">${a.leida ? "" : '<span class="punto"></span>'}${escapar(a.titulo)}</p>
      <p class="alerta-mini-mensaje">${escapar(a.mensaje)}</p>
    </li>`
  ).join("");

  return `
    ${encabezado("Buen día", `Tienes ${pendientes} alertas sin leer y ${enRiesgo} estudiantes en riesgo.`)}
    <div class="cuadricula-estadisticas">
      ${tarjetas.map((t) => `<div class="tarjeta"><p class="etiqueta">${t.etiqueta}</p><p class="valor">${t.valor}</p></div>`).join("")}
    </div>
    <div class="cuadricula-panel">
      <div class="tarjeta panel-tabla">
        <div class="titulo-fila">
          <h2>Estudiantes</h2>
          <button class="enlace" onclick="navegar('historial')">Ver historial</button>
        </div>
        <table class="tabla">
          <thead><tr><th>Nombre</th><th>Grado</th><th>Progreso</th><th>Estado</th></tr></thead>
          <tbody>${filas}</tbody>
        </table>
      </div>
      <div class="tarjeta">
        <div class="titulo-fila">
          <h2>Alertas recientes</h2>
          <button class="enlace" onclick="navegar('alertas')">Ver todas</button>
        </div>
        <ul class="lista-alertas-mini">${alertasRecientes}</ul>
      </div>
    </div>`;
}
const modalregistro = document.getElementById("modalregistro");
const abrirregistro = document.getElementById("Abrir Registro");
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
    cerrarModal();
  }
});

document.getElementById("form-registro").addEventListener("submit", function (evento) {
  evento.preventDefault();
  const password = document.getElementById("clave").value;
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
    registradoPor: "Orientadora"
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
        <option ${estado.filtroGradoReportes === "7°" ? "selected" : ""}>7°</option>
        <option ${estado.filtroGradoReportes === "8°" ? "selected" : ""}>8°</option>
        <option ${estado.filtroGradoReportes === "9°" ? "selected" : ""}>9°</option>
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
        <select class="entrada"><option>Periodo 3 — 2026</option><option>Periodo 2 — 2026</option></select>
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
  const titulo = String(datos.get("titulo") || "").trim();
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
          <input name="titulo" placeholder="Título" class="entrada">
          <select name="destinatario" class="entrada">
            <option>Padres grado 7°</option><option>Padres grado 8°</option><option>Padres grado 9°</option><option>Coordinador</option><option>Estudiantes</option>
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

function dibujarActividades() {
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
        ${opcion("7°", estado.filtroGradoActividades)}
        ${opcion("8°", estado.filtroGradoActividades)}
        ${opcion("9°", estado.filtroGradoActividades)}
      </select>
      <select id="filtro-area-act" class="entrada ancho-medio" onchange="filtrarActividades()">
        ${opcion("Todas", estado.filtroAreaActividades)}
        ${opcion("Académica", estado.filtroAreaActividades)}
        ${opcion("Deportiva", estado.filtroAreaActividades)}
        ${opcion("Musical", estado.filtroAreaActividades)}
        ${opcion("Tecnológica", estado.filtroAreaActividades)}
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
