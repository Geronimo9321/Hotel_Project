// js/app.js
document.addEventListener("DOMContentLoaded", () => {

  // -----------------------------
  // Helper: detectar botón de "consultar"
  // -----------------------------
  function isConsultButton(button) {
    // 1) data-action explícito
    if (button.dataset.action && button.dataset.action.toLowerCase() === "consultar") return true;

    // 2) texto del botón que contenga "consult" / "consultar"
    const txt = (button.textContent || "").trim().toLowerCase();
    if (txt.includes("consult")) return true;

    // 3) si está dentro de una sección de servicios (id con 'servic')
    const section = button.closest("section");
    if (section && section.id && section.id.toLowerCase().includes("servic")) return true;

    return false;
  }

  // -----------------------------
  // 1. BOTONES "RESERVAR" / "CONSULTAR"
  // -----------------------------
  const reservarButtons = document.querySelectorAll(".btn-reservar");

  reservarButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      // evita comportamiento por defecto (submit / recarga)
      e.preventDefault();

      // Detectamos si es un botón para "consultar servicio"
      if (isConsultButton(button)) {
        const confirmacion = confirm("¿Desea consultar este servicio?");
        if (confirmacion) {
          // Redirige a la página de servicios. Ajustá la ruta si tu archivo está en otra carpeta.
          window.location.href = "./src/servicio.html";
        }
        // si cancela, no hacemos nada
        return;
      }

      // Si no es botón de consulta, asumimos que es un botón de reserva
      const confirmacionReserva = confirm("¿Desea realizar una reserva?");
      if (!confirmacionReserva) return;

      // Extraemos el tipo de habitación/servicio (data-room o h3 del card)
      let room = button.dataset.room || "";
      if (!room) {
        const card = button.closest(".room-card");
        room = card ? (card.querySelector("h3")?.textContent?.trim() || "") : "";
      }

      const params = new URLSearchParams();
      if (room) params.set("habitacion", room);

      // Redirige a reservar.html dentro de src/
      const target = "./src/reservar.html" + (params.toString() ? "?" + params.toString() : "");
      window.location.href = target;
    });
  });


  // -----------------------------
  // 2. VALIDACIÓN TELEFONO (mantener)
  // -----------------------------
  const inputTelefono = document.querySelector("#telefono");
  if (inputTelefono) {
    inputTelefono.addEventListener("input", () => {
      inputTelefono.value = inputTelefono.value.replace(/[^0-9]/g, "");
    });
  }


  // -----------------------------
  // 3. VALIDACIÓN DE FECHAS (mantener)
  // -----------------------------
  const formReserva = document.querySelector(".reserva-container form");
  const inputIngreso = document.getElementById("fecha");         // Fecha de ingreso
  const inputSalida = document.getElementById("fecha-salida");   // Fecha de salida

  function todayYMD() {
    const d = new Date();
    d.setHours(0,0,0,0);
    return d.toISOString().slice(0,10);
  }

  function isValidYMD(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const dt = new Date(value + "T00:00:00");
    return !isNaN(dt.getTime()) && dt.toISOString().slice(0,10) === value;
  }

  function ymdToDate(value) {
    return new Date(value + "T00:00:00");
  }

  function validarFechas(ingresoVal, salidaVal) {
    const hoy = todayYMD();

    if (!ingresoVal || !salidaVal) {
      return { ok: false, msg: "Por favor completá ambas fechas: ingreso y salida." };
    }

    if (!isValidYMD(ingresoVal) || !isValidYMD(salidaVal)) {
      return { ok: false, msg: "Fechas incorrectas. Usá el formato YYYY-MM-DD (p. ej. 2025-10-26)." };
    }

    const ingreso = ymdToDate(ingresoVal);
    const salida = ymdToDate(salidaVal);
    const hoyDate = ymdToDate(hoy);

    if (ingreso < hoyDate) {
      return { ok: false, msg: "La fecha de ingreso no puede ser anterior a hoy." };
    }

    if (salida <= ingreso) {
      if (salida.getTime() === ingreso.getTime()) {
        return { ok: false, msg: "No se permite que la fecha de ingreso y salida sean el mismo día." };
      }
      return { ok: false, msg: "La fecha de salida debe ser posterior a la fecha de ingreso." };
    }

    return { ok: true, msg: "" };
  }

  if (formReserva) {
    formReserva.addEventListener("submit", (e) => {
      const ingresoVal = inputIngreso ? inputIngreso.value.trim() : "";
      const salidaVal = inputSalida ? inputSalida.value.trim() : "";

      const resultado = validarFechas(ingresoVal, salidaVal);

      if (!resultado.ok) {
        e.preventDefault();
        alert(resultado.msg);

        if (inputIngreso && (!isValidYMD(ingresoVal) || ymdToDate(ingresoVal) < ymdToDate(todayYMD()))) {
          inputIngreso.focus();
        } else if (inputSalida) {
          inputSalida.focus();
        }

        return false;
      }
    });
  }

  // -----------------------------
  // 4. ALERTAS INMEDIATAS AL CAMBIAR FECHAS (mantener)
  // -----------------------------
  function attachChangeAlerts() {
    if (!inputIngreso || !inputSalida) return;

    inputIngreso.addEventListener("change", () => {
      const r = validarFechas(inputIngreso.value.trim(), inputSalida.value.trim());
      if (!r.ok && inputSalida.value) {
        alert(r.msg);
      }
    });

    inputSalida.addEventListener("change", () => {
      const r = validarFechas(inputIngreso.value.trim(), inputSalida.value.trim());
      if (!r.ok && inputIngreso.value) {
        alert(r.msg);
      }
    });
  }
  attachChangeAlerts();

}); // DOMContentLoaded
