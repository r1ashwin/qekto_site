(() => {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const triggers = [...header.querySelectorAll(".nav-trigger")];
  const panels = [...header.querySelectorAll(".mega")];
  const menuToggle = header.querySelector(".menu-toggle");
  const drawer = document.querySelector(".mobile-drawer");
  const desktop = window.matchMedia("(min-width: 900px)");
  let closeTimer = null;

  function closeMega() {
    triggers.forEach((btn) => btn.setAttribute("aria-expanded", "false"));
    panels.forEach((panel) => {
      panel.hidden = true;
      panel.classList.remove("is-open");
    });
    header.classList.remove("mega-open");
  }

  function openMega(name) {
    const panel = header.querySelector(`#panel-${name}`);
    const trigger = header.querySelector(`.nav-trigger[data-panel="${name}"]`);
    if (!panel || !trigger) return;
    closeMega();
    trigger.setAttribute("aria-expanded", "true");
    panel.hidden = false;
    void panel.offsetWidth;
    panel.classList.add("is-open");
    header.classList.add("mega-open");
  }

  function toggleMega(name) {
    const trigger = header.querySelector(`.nav-trigger[data-panel="${name}"]`);
    if (!trigger) return;
    if (trigger.getAttribute("aria-expanded") === "true") {
      closeMega();
      return;
    }
    openMega(name);
  }

  function cancelClose() {
    window.clearTimeout(closeTimer);
  }

  function scheduleClose() {
    if (!desktop.matches) return;
    cancelClose();
    closeTimer = window.setTimeout(() => closeMega(), 200);
  }

  triggers.forEach((btn) => {
    const name = btn.dataset.panel;

    btn.addEventListener("click", (event) => {
      if (!desktop.matches) return;
      event.preventDefault();
      event.stopPropagation();
      cancelClose();
      toggleMega(name);
    });

    btn.addEventListener("mouseenter", () => {
      if (!desktop.matches) return;
      cancelClose();
      openMega(name);
    });
  });

  header.addEventListener("mouseleave", scheduleClose);
  header.addEventListener("mouseenter", cancelClose);

  document.addEventListener("click", (event) => {
    if (!desktop.matches) return;
    if (!header.contains(event.target)) closeMega();
  });

  header.querySelectorAll(".mega a").forEach((link) => {
    link.addEventListener("click", () => closeMega());
  });

  /* —— Mobile Stripe-style drawer —— */
  if (!drawer || !menuToggle) return;

  const backBtn = drawer.querySelector(".mobile-back");
  const closeBtn = drawer.querySelector(".mobile-close");
  const mobilePanels = [...drawer.querySelectorAll(".mobile-panel")];

  function showMobilePanel(name) {
    mobilePanels.forEach((panel) => {
      const on = panel.dataset.panel === name;
      panel.hidden = !on;
      panel.classList.toggle("is-active", on);
    });
    const isRoot = name === "root";
    if (backBtn) {
      backBtn.hidden = isRoot;
      backBtn.setAttribute("aria-hidden", isRoot ? "true" : "false");
    }
    drawer.dataset.view = name;
  }

  function openDrawer() {
    drawer.hidden = false;
    void drawer.offsetWidth;
    drawer.classList.add("is-open");
    document.body.classList.add("drawer-open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close menu");
    showMobilePanel("root");
  }

  function closeDrawer() {
    drawer.classList.remove("is-open");
    document.body.classList.remove("drawer-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
    window.setTimeout(() => {
      if (!drawer.classList.contains("is-open")) drawer.hidden = true;
    }, 280);
    showMobilePanel("root");
  }

  menuToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    if (desktop.matches) return;
    if (drawer.classList.contains("is-open")) closeDrawer();
    else openDrawer();
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      closeDrawer();
    });
  }

  if (backBtn) {
    backBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      showMobilePanel("root");
    });
  }

  drawer.querySelectorAll("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () => showMobilePanel(btn.dataset.go));
  });

  drawer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeDrawer());
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (desktop.matches) closeMega();
    else if (drawer.classList.contains("is-open")) closeDrawer();
  });

  desktop.addEventListener("change", () => {
    if (desktop.matches) closeDrawer();
    else closeMega();
  });
})();
