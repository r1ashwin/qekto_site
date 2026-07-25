(() => {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const triggers = [...header.querySelectorAll(".nav-trigger")];
  const panels = [...header.querySelectorAll(".mega")];
  const menuToggle = header.querySelector(".menu-toggle");
  const siteNav = header.querySelector(".site-nav");
  const desktop = window.matchMedia("(min-width: 900px)");
  let closeTimer = null;

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
    // Force paint so transition runs.
    void panel.offsetWidth;
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

  function cancelClose() {
    window.clearTimeout(closeTimer);
  }

  function scheduleClose() {
    if (!desktop.matches) return;
    cancelClose();
    closeTimer = window.setTimeout(() => closeAll(), 200);
  }

  triggers.forEach((btn) => {
    const name = btn.dataset.panel;

    btn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      cancelClose();
      togglePanel(name);
    });

    btn.addEventListener("mouseenter", () => {
      if (!desktop.matches) return;
      cancelClose();
      openPanel(name);
    });
  });

  header.addEventListener("mouseleave", scheduleClose);
  header.addEventListener("mouseenter", cancelClose);

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
