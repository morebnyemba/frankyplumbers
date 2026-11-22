/* Franky Plumbers — site behaviour (no dependencies) */
(() => {
  "use strict";

  // Single source of truth for contact details used by JS.
  // Keep in sync with the hard-coded tel:/wa.me links in the HTML.
  const WHATSAPP_NUMBER = "263770000000"; // international format, digits only

  const header = document.querySelector(".site-header");
  const body = document.body;

  /* Sticky header: switch to solid bar once we scroll past the top bar */
  if (header) {
    const onScroll = () => header.classList.toggle("is-stuck", window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Mobile nav */
  const toggle = document.querySelector(".nav-toggle");
  const closeBtn = document.querySelector(".nav-close");
  const backdrop = document.querySelector(".nav-backdrop");
  const setNav = (open) => {
    body.classList.toggle("nav-open", open);
    toggle?.setAttribute("aria-expanded", String(open));
    if (open) closeBtn?.focus();
  };
  toggle?.addEventListener("click", () => setNav(!body.classList.contains("nav-open")));
  closeBtn?.addEventListener("click", () => { setNav(false); toggle?.focus(); });
  backdrop?.addEventListener("click", () => setNav(false));
  document.querySelectorAll(".nav a").forEach((a) => a.addEventListener("click", () => setNav(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && body.classList.contains("nav-open")) setNav(false); });

  /* Reveal on scroll */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* Animated counters */
  const counters = document.querySelectorAll("[data-count]");
  const animate = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = (el.dataset.count.split(".")[1] || "").length;
    const start = performance.now();
    const dur = 1400;
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { animate(e.target); co.unobserve(e.target); } });
    }, { threshold: 0.5 });
    counters.forEach((c) => co.observe(c));
  }

  /* Quote / contact forms -> WhatsApp hand-off.
     No backend required; swap for a POST to your API (e.g. a Django endpoint) when ready. */
  document.querySelectorAll("form[data-quote]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      if (data.get("company")) return; // honeypot filled -> bot

      const lines = [
        "Hi Franky Plumbers, I'd like a quote.",
        `Name: ${data.get("name") || ""}`,
        `Phone: ${data.get("phone") || ""}`,
        data.get("service") ? `Service: ${data.get("service")}` : "",
        data.get("area") ? `Area: ${data.get("area")}` : "",
        data.get("message") ? `Details: ${data.get("message")}` : "",
      ].filter(Boolean);

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
      const status = form.querySelector(".form-status");
      if (status) status.textContent = "Opening WhatsApp… we usually reply within 15 minutes.";
      window.open(url, "_blank", "noopener");
      form.reset();
    });
  });

  /* Footer year */
  document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
