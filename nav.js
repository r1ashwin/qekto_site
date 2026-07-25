(() => {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const triggers = [...header.querySelectorAll(".nav-trigger")];
  const panels = [...header.querySelectorAll(".mega")];
  const menuToggle = header.querySelector(".menu-toggle");
  const siteNav = header.querySelector(".site-nav");
  const desktop = window.matchMedia("(min-width: 900px)");
  let hoverTimer = null;

  function closeAll() {
    triggers.forEach((btn) => btn.setAttribute("aria-expanded", "false"));
    panels.forEach((panel) => {
      panel.hidden = true;
      panel.classList.remove("is-open");
    });
    header.classList.remove("mega-open");
  }

  function openPanel(name) {
    const panel = header.querySelector(`#panel-${name}`);
    const trigger = header.querySelector(`.nav-trigger[data-panel="${name}"]`);
    if (!panel || !trigger) return;
    closeAll();
    trigger.setAttribute("aria-expanded", "true");
    panel.hidden = false;
    panel.classList.add("is-open");
    header.classList.add("mega-open");
  }

  function togglePanel(name) {
    const trigger = header.querySelector(`.nav-trigger[data-panel="${name}"]`);
    if (!trigger) return;
    if (trigger.getAttribute("aria-expanded") === "true") {
      closeAll();
      return;
    }
    openPanel(name);
  }

  triggers.forEach((btn) => {
    const name = btn.dataset.panel;

    btn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      togglePanel(name);
    });

    btn.addEventListener("mouseenter", () => {
      if (!desktop.matches) return;
      window.clearTimeout(hoverTimer);
      openPanel(name);
    });

    const item = btn.closest(".nav-item");
    if (!item) return;

    item.addEventListener("mouseleave", () => {
      if (!desktop.matches) return;
      hoverTimer = window.setTimeout(() => closeAll(), 160);
    });

    item.addEventListener("mouseenter", () => {
      if (!desktop.matches) return;
      window.clearTimeout(hoverTimer);
    });
  });

  panels.forEach((panel) => {
    panel.addEventListener("mouseenter", () => {
      if (!desktop.matches) return;
      window.clearTimeout(hoverTimer);
    });
    panel.addEventListener("mouseleave", () => {
      if (!desktop.matches) return;
      hoverTimer = window.setTimeout(() => closeAll(), 160);
    });
  });

  document.addEventListener("click", (event) => {
    if (!header.contains(event.target)) closeAll();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAll();
  });

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const open = header.classList.toggle("nav-open");
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (!open) closeAll();
    });
  }

  header.querySelectorAll(".mega a").forEach((link) => {
    link.addEventListener("click", () => {
      closeAll();
      header.classList.remove("nav-open");
      if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
    });
  });
})();
