/**
 * BARBER HOUSE — reveal.js
 * Animações de entrada ao rolar a página.
 *
 * Observa os elementos [data-reveal] e adiciona .is-visible quando eles
 * entram na tela (uma única vez por elemento). O CSS cuida da animação.
 *
 * O estado "oculto" só é ativado (html.js-reveal) quando a animação é
 * possível; sem IntersectionObserver ou com movimento reduzido, todo o
 * conteúdo simplesmente permanece visível.
 */

export function initReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  if (items.length === 0) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target); // anima só na primeira vez
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px", // dispara um pouco antes do elemento chegar à base da tela
    }
  );

  document.documentElement.classList.add("js-reveal");
  items.forEach((item) => observer.observe(item));
}
