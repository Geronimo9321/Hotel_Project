document.addEventListener("DOMContentLoaded", () => {

  // -----------------------------
  // 1. BOTONES "RESERVAR"
  // -----------------------------
  const reservarButtons = document.querySelectorAll(".btn-reservar");

  reservarButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      e.preventDefault(); // evita recarga

      const confirmacion = confirm("¿Desea realizar una reserva?");

      if (!confirmacion) {
        // Si cancela, no hacemos nada
        return;
      }

      // Extraemos el tipo de habitación (data-room o h3 del card)
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
  // 2. VALIDACIÓN TELEFONO
  // -----------------------------
  const inputTelefono = document.querySelector("#telefono");

  if (inputTelefono) {
    inputTelefono.addEventListener("input", () => {
      inputTelefono.value = inputTelefono.value.replace(/[^0-9]/g, "");
    });
  }


  // -----------------------------
  // 3. VALIDACIÓN DE FECHAS
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
  // 4. ALERTAS INMEDIATAS AL CAMBIAR FECHAS
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

});
