/**
 * BARBER HOUSE — nav.js
 * Comportamento do header e do menu responsivo.
 *
 * - Adiciona .header--scrolled ao header quando a página é rolada.
 * - Abre/fecha o menu mobile (.nav__list--open) e mantém aria-expanded.
 * - Fecha o menu ao clicar em um link, pressionar ESC ou ampliar a tela.
 * - Bloqueia a rolagem da página (body.no-scroll) com o menu aberto.
 * - Mantém o foco do teclado dentro do menu enquanto ele está aberto.
 */

const SCROLL_THRESHOLD = 24;                  // px rolados até o header ganhar fundo
const DESKTOP_QUERY = "(min-width: 64em)";    // mesmo ponto de quebra do CSS (1024px)

export function initNav() {
  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const menu = document.querySelector("[data-nav-menu]");

  if (header) initHeaderScroll(header);
  if (toggle && menu) initMenu(toggle, menu);
}

/* --------------------------------------------------------------------------
   Header: fundo sólido ao rolar
   -------------------------------------------------------------------------- */
function initHeaderScroll(header) {
  let ticking = false;

  const update = () => {
    header.classList.toggle("header--scrolled", window.scrollY > SCROLL_THRESHOLD);
    ticking = false;
  };

  // requestAnimationFrame evita recalcular a cada pixel rolado
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );

  update(); // estado inicial (ex.: página recarregada já rolada)
}

/* --------------------------------------------------------------------------
   Menu mobile
   -------------------------------------------------------------------------- */
function initMenu(toggle, menu) {
  const label = toggle.querySelector(".nav__toggle-label");
  const desktop = window.matchMedia(DESKTOP_QUERY);
  let isOpen = false;

  const setOpen = (open) => {
    isOpen = open;
    toggle.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("nav__list--open", open);
    document.body.classList.toggle("no-scroll", open);
    if (label) label.textContent = open ? "Fechar menu" : "Menu";
  };

  toggle.addEventListener("click", () => setOpen(!isOpen));

  // Fecha ao escolher um link do menu (navegação por âncora ou botão Agendar)
  menu.addEventListener("click", (event) => {
    if (isOpen && event.target.closest("a")) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (!isOpen) return;

    if (event.key === "Escape") {
      setOpen(false);
      toggle.focus();
      return;
    }

    if (event.key === "Tab") trapFocus(event, toggle);
  });

  // Se a tela for ampliada para o layout desktop, garante o menu fechado
  desktop.addEventListener("change", (event) => {
    if (event.matches && isOpen) setOpen(false);
  });
}

/** Mantém o Tab circulando entre o botão do menu e os links enquanto o menu está aberto. */
function trapFocus(event, toggle) {
  const nav = toggle.closest("nav");
  if (!nav) return;

  const focusable = [...nav.querySelectorAll("a[href], button:not([disabled])")];
  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
