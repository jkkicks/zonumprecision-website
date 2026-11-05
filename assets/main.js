(() => {
  const EMAIL = "jacob@zonumprecision.com";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const nav = document.querySelector("[data-nav]");
  const toggle = document.querySelector("[data-nav-toggle]");

  const onScroll = () => nav?.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  toggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  nav?.querySelectorAll(".nav-links a").forEach((link) =>
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
    })
  );

  const toastEl = document.querySelector("[data-toast]");
  let toastTimer;
  const toast = (msg) => {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 2200);
  };

  document.querySelectorAll("[data-copy]").forEach((btn) =>
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        toast("Email copied to clipboard");
      } catch {
        window.location.href = `mailto:${btn.dataset.copy}`;
      }
    })
  );

  const form = document.querySelector("[data-rfq-form]");
  if (form) {
    const tabs = form.querySelectorAll(".form-tabs button");
    const setMode = (mode) => {
      form.dataset.mode = mode;
      tabs.forEach((t) => t.setAttribute("aria-pressed", String(t.dataset.mode === mode)));
    };
    tabs.forEach((t) => t.addEventListener("click", () => setMode(t.dataset.mode)));
    document.querySelectorAll("[data-mode-link]").forEach((a) =>
      a.addEventListener("click", () => setMode(a.dataset.modeLink))
    );

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = (name) => (form.elements[name]?.value || "").trim();
      const mode = form.dataset.mode;
      const name = v("name");
      if (!name) {
        form.elements.name.focus();
        toast("Add your name so I know who to reply to");
        return;
      }

      const lines = [`Name: ${name}`];
      if (v("company")) lines.push(`Company: ${v("company")}`);
      let subject;
      if (mode === "machining") {
        subject = `RFQ: machined parts${v("company") ? ` for ${v("company")}` : ""}`;
        lines.push(`Quantity: ${v("qty") || "TBD"}`, `Material: ${v("material")}`, `Finish: ${v("finish")}`);
        if (v("date")) lines.push(`Need by: ${v("date")}`);
        lines.push("", v("message") || "(details)", "", "Attached: STEP model + PDF drawing");
      } else {
        subject = `Software project: ${v("type")}`;
        lines.push(`Type: ${v("type")}`);
        if (v("stack")) lines.push(`Stack: ${v("stack")}`);
        lines.push("", v("message") || "(details)");
      }

      const href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
      window.location.href = href;
      toast("Opening your email app…");
    });
  }

  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
