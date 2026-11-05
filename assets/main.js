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
    if (open) nav.querySelector(".nav-links a")?.focus();
  });

  const closeNav = () => {
    if (nav?.contains(document.activeElement) && document.activeElement !== toggle) toggle?.focus();
    nav?.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
  };
  nav?.querySelectorAll(".nav-links a").forEach((link) => link.addEventListener("click", closeNav));
  document.addEventListener("click", (e) => {
    if (nav?.classList.contains("is-open") && !nav.contains(e.target)) closeNav();
  });
  nav?.addEventListener("focusout", (e) => {
    if (nav.classList.contains("is-open") && e.relatedTarget && !nav.contains(e.relatedTarget)) closeNav();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav?.classList.contains("is-open")) {
      closeNav();
      toggle?.focus();
    }
  });

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
        toast("Email copied");
      } catch {
        window.location.href = `mailto:${btn.dataset.copy}`;
      }
    })
  );

  const form = document.querySelector("[data-rfq-form]");
  if (form) {
    const tabs = form.querySelectorAll(".form-tabs button");
    const submitLabel = form.querySelector("[data-submit-label]");
    const submitBtn = form.querySelector("[type=submit]");
    const setMode = (mode) => {
      form.dataset.mode = mode;
      tabs.forEach((t) => t.setAttribute("aria-pressed", String(t.dataset.mode === mode)));
      if (submitLabel) submitLabel.textContent = mode === "software" ? "Request a software quote" : "Request a quote";
      form.elements.files?.setAttribute("aria-describedby", mode === "software" ? "f-files-hint-s" : "f-files-hint-m");
      const msg = form.elements.message;
      if (msg?.dataset[mode === "software" ? "placeholderSoftware" : "placeholderMachining"]) {
        msg.placeholder = msg.dataset[mode === "software" ? "placeholderSoftware" : "placeholderMachining"];
      }
    };
    tabs.forEach((t) => t.addEventListener("click", () => setMode(t.dataset.mode)));
    document.querySelectorAll("[data-mode-link]").forEach((a) =>
      a.addEventListener("click", (e) => {
        setMode(a.dataset.modeLink);
        const plain = !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button);
        if (plain && (location.pathname === "/" || location.pathname === "/index.html")) {
          e.preventDefault();
          history.replaceState(null, "", `/?mode=${a.dataset.modeLink}#contact`);
          document.getElementById("contact")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
          form.elements.name?.focus({ preventScroll: true });
        }
      })
    );
    const body = form.querySelector("[data-form-body]");
    const done = form.querySelector("[data-form-done]");
    const doneText = form.querySelector("[data-done-text]");
    const doneNext = form.querySelector("[data-done-next]");
    form.querySelector("[data-form-again]")?.addEventListener("click", () => {
      if (done) done.hidden = true;
      if (body) body.hidden = false;
      form.elements.name?.focus();
    });
    const startMode = new URLSearchParams(location.search).get("mode");
    if (startMode === "software" || startMode === "machining") setMode(startMode);

    const draftMailto = () => {
      const v = (name) => (form.elements[name]?.value || "").trim();
      const mode = form.dataset.mode || "machining";
      const lines = [`Name: ${v("name")}`, `Email: ${v("email")}`];
      if (v("company")) lines.push(`Company: ${v("company")}`);
      let subject;
      if (mode === "machining") {
        subject = `RFQ: machined parts${v("company") ? ` for ${v("company")}` : ""}`;
        lines.push(`Quantity: ${v("qty") || "TBD"}`, `Material: ${v("material")}`, `Finish: ${v("finish")}`);
        if (v("date")) lines.push(`Need by: ${v("date")}`);
      } else {
        subject = `Software project: ${v("type") || "Software project"}`;
        lines.push(`Type: ${v("type")}`);
        if (v("stack")) lines.push(`Stack: ${v("stack")}`);
      }
      lines.push("", (v("message") || "(details)").slice(0, 1500));
      const files = form.elements.files?.files;
      if (files && files.length) {
        lines.push("", "Please attach:");
        for (const file of files) lines.push(`- ${file.name}`);
      }
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    };

    // Turnstile: only loads when the page carries a site key.
    const siteKey = document.querySelector('meta[name="turnstile-sitekey"]')?.content?.trim();
    const slot = form.querySelector("[data-turnstile]");
    let widgetId = null;
    const resetCheck = () => {
      if (widgetId !== null && window.turnstile) window.turnstile.reset(widgetId);
    };
    if (siteKey && slot) {
      window.__zpTurnstileReady = () => {
        widgetId = window.turnstile.render(slot, { sitekey: siteKey, theme: "dark", appearance: "interaction-only" });
      };
      const s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=__zpTurnstileReady";
      s.async = true;
      s.defer = true;
      document.head.appendChild(s);
    }

    const statusEl = form.querySelector("[data-form-status]");
    const setStatus = (msg, isError) => {
      if (!statusEl) return;
      statusEl.textContent = msg;
      statusEl.classList.toggle("is-error", Boolean(isError));
    };
    const markInvalid = (input, invalid) => {
      if (!input) return;
      input.setAttribute("aria-invalid", invalid ? "true" : "false");
      if (statusEl?.id) input.setAttribute("aria-describedby", statusEl.id);
    };
    form.elements.name?.addEventListener("input", () => markInvalid(form.elements.name, false));
    form.elements.email?.addEventListener("input", () => markInvalid(form.elements.email, false));

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = (form.elements.name?.value || "").trim();
      const email = (form.elements.email?.value || "").trim();
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      markInvalid(form.elements.name, !name);
      markInvalid(form.elements.email, !emailOk);
      if (!name) {
        form.elements.name.focus();
        setStatus("Add your name so I know who to reply to.", true);
        return;
      }
      if (!emailOk) {
        form.elements.email.focus();
        setStatus(email ? "That email address looks incomplete. Check it so I can reply." : "Add an email address so I can reply.", true);
        return;
      }

      if (siteKey && !form.querySelector('[name="cf-turnstile-response"]')?.value) {
        setStatus("One moment. The security check is still finishing. Try again in a few seconds.", true);
        return;
      }
      const picked = [...(form.elements.files?.files || [])];
      const MB = 1024 * 1024;
      const okExt = new Set("step stp stl iges igs dxf dwg pdf zip png jpg jpeg webp f3d f3z 3mf txt csv".split(" "));
      const badType = picked.find((f) => !okExt.has((f.name.split(".").pop() || "").toLowerCase()));
      if (badType) {
        setStatus(`${badType.name} is not a file type I can take. Use STEP, PDF, or a zip.`, true);
        return;
      }
      const oversize = picked.find((f) => f.size > 20 * MB);
      if (picked.length > 6) {
        setStatus("The form takes up to 6 files. Zip them together, or email the extras.", true);
        return;
      }
      if (oversize) {
        setStatus(`${oversize.name} is over 20 MB. Email it to jacob@zonumprecision.com instead.`, true);
        return;
      }
      if (picked.reduce((n, f) => n + f.size, 0) > 40 * MB) {
        setStatus("Those files add up to more than 40 MB. Email the larger ones to jacob@zonumprecision.com.", true);
        return;
      }
      const fileCount = picked.length;
      const data = new FormData(form);
      data.set("mode", form.dataset.mode || "machining");
      if (submitBtn) submitBtn.disabled = true;
      setStatus("", false);
      const idleLabel = submitLabel ? submitLabel.textContent : "";
      if (submitLabel) submitLabel.textContent = "Sending…";
      try {
        const res = await fetch("/api/rfq", { method: "POST", body: data, signal: AbortSignal.timeout(60000) });
        let payload = {};
        try {
          payload = await res.json();
        } catch {
          payload = {};
        }
        if (!res.ok) {
          if (res.status >= 500) {
            draftMailto();
            setStatus("The site could not send that, so I opened your email app with the message filled in. Attach your files there. Messages over 1,500 characters are trimmed, so paste in the full text.", true);
            return;
          }
          throw new Error(payload.error || "That did not send. Email jacob@zonumprecision.com and I will pick it up there.");
        }
        form.reset();
        const mode = form.dataset.mode || "machining";
        const filesNote = fileCount ? ` ${fileCount} file${fileCount === 1 ? "" : "s"} included.` : mode === "machining" ? " No files came with this request. Reply to my email with the STEP file and PDF drawing, or send them to jacob@zonumprecision.com." : "";
        setStatus("", false);
        if (doneText) doneText.textContent = `I'll reply to ${email}, usually within a day or two.${filesNote}`;
        if (doneNext) doneNext.textContent = mode === "software" ? "Next, I read what you sent and reply with questions or a fixed-scope quote." : "Next, I check the parts for manufacturability and send a quote with a lead time.";
        if (body && done) {
          body.hidden = true;
          done.hidden = false;
          done.focus();
        } else {
          setStatus(`Sent. I'll reply to ${email}, usually within a day or two.${filesNote}`, false);
        }
      } catch (err) {
        if (err && (err.name === "TypeError" || err.name === "TimeoutError" || err.name === "AbortError")) {
          draftMailto();
          setStatus("The site could not send that, so I opened your email app with the message filled in. Attach your files there. Messages over 1,500 characters are trimmed, so paste in the full text.", true);
        } else {
          setStatus(err.message || "That did not send. Email jacob@zonumprecision.com and I will pick it up there.", true);
        }
      } finally {
        resetCheck();
        if (submitLabel) submitLabel.textContent = idleLabel;
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
