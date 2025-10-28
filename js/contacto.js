document.addEventListener("DOMContentLoaded", () => {
	const form = document.getElementById("form-contacto");
	const nombre = document.getElementById("nombre");
	const email = document.getElementById("email");
	const telefono = document.getElementById("telefono");
	const mensaje = document.getElementById("mensaje");

//Valida solo números en el campo teléfono
	if (telefono) {
		telefono.addEventListener("input", () => {
		telefono.value = telefono.value.replace(/[^0-9]/g, "");
		});
	}

	form.addEventListener("submit", (e) => {
		e.preventDefault();

		//validaciones
		if (!nombre.value.trim()) {
			alert("Por favor ingresa tu nombre.");
			nombre.focus();
			return;
		}

		if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
			alert("Por favor ingresa un correo electrónico válido.");
			email.focus();
			return;
		}

		if (!telefono.value.trim()) {
			alert("Por favor ingresa tu teléfono.");
			telefono.focus();
			return;
		}

		if (!mensaje.value.trim()) {
			alert("Por favor ingresa tu mensaje.");
			mensaje.focus();
			return;
		}

		//Si todo esta bien, se puede enviar
		alert("¡Mensaje enviado correctamente!");
		form.reset();
	});
});