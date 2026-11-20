/**
 * BARBER HOUSE — gallery.js
 * Lightbox simples da galeria de cortes.
 *
 * - Clique/toque em uma foto abre a versão ampliada (data-full) em um <dialog>.
 * - Navegação por botões, setas do teclado e deslize no celular (swipe).
 * - Fecha com ESC (nativo do <dialog>), botão, clique fora da imagem.
 * - Ao fechar, o foco volta para a foto que foi aberta.
 */

const SWIPE_THRESHOLD = 50; // px mínimos de deslize horizontal para trocar de foto

export function initGallery() {
  const dialog = document.querySelector("[data-lightbox]");
  const buttons = [...document.querySelectorAll("[data-gallery-item]")];
  if (!dialog || buttons.length === 0) return;

  const image = dialog.querySelector("[data-lightbox-image]");
  const caption = dialog.querySelector("[data-lightbox-caption]");
  const btnClose = dialog.querySelector("[data-lightbox-close]");
  const btnPrev = dialog.querySelector("[data-lightbox-prev]");
  const btnNext = dialog.querySelector("[data-lightbox-next]");

  // Navegadores sem suporte a <dialog>: abre a foto grande em outra aba
  if (typeof dialog.showModal !== "function") {
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        window.open(button.dataset.full, "_blank", "noopener");
      });
    });
    return;
  }

  let current = 0;
  let opener = null;

  /** Mostra a foto de índice i (com navegação circular). */
  const show = (index) => {
    current = (index + buttons.length) % buttons.length;
    const button = buttons[current];
    const thumb = button.querySelector("img");

    image.src = button.dataset.full;
    image.alt = thumb ? thumb.alt : "";
    caption.textContent = button.dataset.caption || "";

    preload(current + 1);
    preload(current - 1);
  };

  /** Pré-carrega as fotos vizinhas para a troca parecer instantânea. */
  const preload = (index) => {
    const neighbor = buttons[(index + buttons.length) % buttons.length];
    new Image().src = neighbor.dataset.full;
  };

  const open = (index, trigger) => {
    opener = trigger;
    show(index);
    dialog.showModal();
    document.body.classList.add("no-scroll");
  };

  const close = () => dialog.close();

  /* --- Abrir --- */
  buttons.forEach((button, index) => {
    button.addEventListener("click", () => open(index, button));
  });

  /* --- Fechar --- */
  btnClose.addEventListener("click", close);

  // Clique no fundo (fora da foto e dos botões) fecha
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) close();
  });

  // Dispara tanto com close() quanto com ESC
  dialog.addEventListener("close", () => {
    document.body.classList.remove("no-scroll");
    image.removeAttribute("src");
    if (opener) opener.focus();
  });

  /* --- Navegar --- */
  btnPrev.addEventListener("click", () => show(current - 1));
  btnNext.addEventListener("click", () => show(current + 1));

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") show(current - 1);
    if (event.key === "ArrowRight") show(current + 1);
  });

  /* --- Deslizar no celular --- */
  let touchStartX = 0;

  dialog.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.changedTouches[0].clientX;
    },
    { passive: true }
  );

  dialog.addEventListener(
    "touchend",
    (event) => {
      const deltaX = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;
      show(deltaX > 0 ? current - 1 : current + 1);
    },
    { passive: true }
  );
}
