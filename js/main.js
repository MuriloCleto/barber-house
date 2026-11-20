/**
 * BARBER HOUSE — main.js
 * Ponto de entrada: importa os módulos e inicializa a página.
 */

import { CONFIG } from "./config.js";
import { initNav } from "./nav.js";
import { initReveal } from "./reveal.js";
import { initGallery } from "./gallery.js";

/**
 * Monta o link do WhatsApp com a mensagem pronta.
 * @param {string} [message] Mensagem personalizada; se omitida, usa a padrão do config.
 */
function buildWhatsAppUrl(message = CONFIG.whatsappMessage) {
  const number = CONFIG.whatsappNumber.replace(/\D/g, ""); // mantém só dígitos
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * Aplica o link do WhatsApp a todos os elementos com data-whatsapp
 * (botões "Agendar", botão flutuante, rodapé).
 * Para uma mensagem diferente em um botão específico, use
 * data-whatsapp-message="Texto da mensagem" no elemento.
 */
function initWhatsAppLinks() {
  document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    link.href = buildWhatsAppUrl(link.dataset.whatsappMessage);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
}

/** Atualiza o ano do copyright. */
function initYear() {
  const year = String(new Date().getFullYear());
  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = year;
  });
}

function init() {
  initWhatsAppLinks();
  initYear();
  initNav();
  initReveal();
  initGallery();
}

// Scripts do tipo module já executam após o HTML ser lido, mas a checagem
// mantém o código seguro caso a tag <script> seja movida no futuro.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
