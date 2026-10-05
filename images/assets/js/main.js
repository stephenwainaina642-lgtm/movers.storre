/* ============================================================
   SITE BEHAVIOUR
   Nav state, mobile menu, FAQ accordion, the moving/transport
   quote form and the (secondary) water order form.
   ============================================================ */
function trackEvent(name, params) {
  if (window.dataLayer && typeof window.dataLayer.push === "function") {
    window.dataLayer.push({ event: name, ...(params || {}) });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("siteNav");
  if (nav) {
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("mobileMenu");
  const closeBtn = document.getElementById("mmClose");
  const setMenu = (open) => {
    if (!menu) return;
    menu.classList.toggle("open", open);
    menu.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.style.overflow = open ? "hidden" : "";
    if (toggle) toggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (open && closeBtn) closeBtn.focus();
  };
  if (toggle) toggle.addEventListener("click", () => setMenu(true));
  if (closeBtn) closeBtn.addEventListener("click", () => setMenu(false));
  if (menu) menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  document.querySelectorAll(".faq-item").forEach((item) => {
    const btn = item.querySelector(".faq-q");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const open = item.getAttribute("data-open") === "true";
      item.setAttribute("data-open", open ? "false" : "true");
      btn.setAttribute("aria-expanded", open ? "false" : "true");
    });
  });

  document.querySelectorAll("[data-wa]").forEach((el) =>
    el.addEventListener("click", () => trackEvent("whatsapp_click", { kind: el.getAttribute("data-wa") })));
  document.querySelectorAll("[data-call]").forEach((el) =>
    el.addEventListener("click", () => trackEvent("phone_click", {})));

  document.querySelectorAll("form[data-quote-form]").forEach((form) => {
    const wrap = form.parentElement;
    const success = wrap.querySelector(".form-success");
    const kind = form.getAttribute("data-quote-form"); // "moving" | "water"

    const service = form.querySelector('select[name="service"]');
    const groups = form.querySelectorAll("[data-group]");
    const sync = () => {
      if (!service) return;
      const v = service.value;
      const isMove = v === "House Moving" || v === "Office Moving" || v === "Relocation Service";
      const isTransport = v === "Goods Transport" || v === "Furniture Transport" || v === "Other Transport";
      groups.forEach((el) => {
        const g = el.getAttribute("data-group");
        el.style.display = (g === "move" && isMove) || (g === "transport" && isTransport) ? "" : "none";
      });
    };
    if (service) { service.addEventListener("change", sync); sync(); }

    const validate = () => {
      let ok = true;
      form.querySelectorAll("[data-req]").forEach((input) => {
        const field = input.closest(".form-field");
        const err = field && field.querySelector(".field-error");
        const v = input.value.trim();
        const bad = input.type === "tel" ? !/^[0-9+()\s-]{7,}$/.test(v) : v.length === 0;
        if (field) field.classList.toggle("error", bad);
        if (err) err.textContent = bad ? input.getAttribute("data-req") : "";
        if (bad) ok = false;
      });
      return ok;
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validate()) {
        const first = form.querySelector(".form-field.error input, .form-field.error select");
        if (first) first.focus();
        return;
      }
      const btn = form.querySelector("button[type='submit']");
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      const done = (note) => {
        form.classList.add("hide");
        if (success) { success.classList.add("show"); success.setAttribute("tabindex", "-1"); success.focus(); }
        trackEvent("quote_form_submit", { kind, ...(note ? { note } : {}) });
      };
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(form)).toString(),
      }).then(() => done()).catch(() => done("fetch_failed_fallback"));
    });
  });
});
