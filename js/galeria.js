// js/galeria.js
document.addEventListener("DOMContentLoaded", () => {
  // Recopilar todos los elementos que activan galería
  const items = Array.from(document.querySelectorAll("img.gallery-item[data-group]"));
  if (!items.length) return;

  // Crear modal en DOM
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-inner" role="dialog" aria-modal="true" aria-label="Galería de servicios">
      <button class="modal-close" aria-label="Cerrar">✕</button>
      <button class="modal-prev" aria-label="Anterior">◀</button>
      <img class="modal-img" src="" alt="">
      <button class="modal-next" aria-label="Siguiente">▶</button>
      <div class="modal-caption"></div>
    </div>
  `;
  document.body.appendChild(modal);

  const imgEl = modal.querySelector(".modal-img");
  const captionEl = modal.querySelector(".modal-caption");
  const btnClose = modal.querySelector(".modal-close");
  const btnPrev = modal.querySelector(".modal-prev");
  const btnNext = modal.querySelector(".modal-next");

  let groupName = "";
  let groupNodes = [];
  let index = 0;

  // Helper: recolecta nodos del grupo
  function gatherGroup(g) {
    return Array.from(document.querySelectorAll(`img.gallery-item[data-group="${g}"]`));
  }

  function openModal(g, startIndex = 0) {
    groupName = g;
    groupNodes = gatherGroup(g);
    if (!groupNodes.length) return;
    index = Math.min(Math.max(0, startIndex), groupNodes.length - 1);
    render();
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    btnClose.focus();
  }

  function closeModal() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  function render() {
    const node = groupNodes[index];
    const src = node.dataset.full || node.src;
    const title = node.dataset.title || node.alt || `${index + 1} / ${groupNodes.length}`;
    imgEl.src = src;
    imgEl.alt = node.alt || "";
    captionEl.textContent = title;
    btnPrev.style.display = index > 0 ? "block" : "none";
    btnNext.style.display = index < groupNodes.length - 1 ? "block" : "none";
  }

  // click en cada thumbnail de la página
  items.forEach(el => {
    el.style.cursor = "zoom-in";
    el.addEventListener("click", () => {
      const g = el.dataset.group;
      const nodes = gatherGroup(g);
      const start = nodes.indexOf(el);
      openModal(g, start);
    });
  });

  // controles
  btnClose.addEventListener("click", closeModal);
  btnPrev.addEventListener("click", () => { if (index > 0) { index--; render(); }});
  btnNext.addEventListener("click", () => { if (index < groupNodes.length - 1) { index++; render(); }});

  // teclado
  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("open")) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") { if (index > 0) { index--; render(); }}
    if (e.key === "ArrowRight") { if (index < groupNodes.length - 1) { index++; render(); }}
  });

  // click fuera cierra
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
});
