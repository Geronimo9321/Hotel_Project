// Precios individuales
const services = {
  base: 150,
  traslado: 20,
  piscina: 15,
  restaurante: 30,
  roomService: 25,
  activity: 50
};

// Calcular precio por noche sumando servicios
function calculatePricePerNight() {
  return services.base + services.traslado + services.piscina + services.restaurante + services.roomService + services.activity;
}

// Referencias a elementos
const modal = document.getElementById("priceModal");
const reserveButtons = document.querySelectorAll(".btn-reservar");
const span = document.getElementsByClassName("close-btn")[0];
const nightsInput = document.getElementById("nights");
const pricePerNightElem = document.getElementById("pricePerNight");
const totalPriceElem = document.getElementById("totalPrice");
const roomNameElem = document.getElementById("roomName");
const confirmBtn = document.getElementById("confirmReserve");

// Precio total por noche inicial
const pricePerNight = calculatePricePerNight();
pricePerNightElem.textContent = pricePerNight;

// Función para calcular total según noches
function calculateTotal() {
  const nights = parseInt(nightsInput.value) || 1;
  totalPriceElem.textContent = pricePerNight * nights;
}

// Abrir modal para cada habitación
reserveButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const roomName = btn.getAttribute("data-room");
    roomNameElem.textContent = roomName;
    modal.style.display = "block";
    calculateTotal();
  });
});

// Cerrar modal
span.onclick = () => {
  modal.style.display = "none";
}

// Cerrar si clic fuera del modal
window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Actualizar total al cambiar la cantidad de noches
nightsInput.addEventListener("input", calculateTotal);

// Confirmar reserva y redirigir a reserva.html
confirmBtn.addEventListener("click", () => {
  const room = roomNameElem.textContent;
  const nights = nightsInput.value;
  window.location.href = `reservar.html?room=${encodeURIComponent(room)}&nights=${nights}`;
});
