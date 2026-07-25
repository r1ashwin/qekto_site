(() => {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const triggers = [...header.querySelectorAll(".nav-trigger")];
  const panels = [...header.querySelectorAll(".mega")];
  const menuToggle = header.querySelector(".menu-toggle");
  const siteNav = header.querySelector(".site-nav");

  function closeAll() {
    triggers.forEach((btn) => btn.setAttribute("aria-expanded", "false"));
    panels.forEach((panel) => {
      panel.hidden = true;
    });
    header.classList.remove("mega-open");
  }

  function openPanel(name) {
    const panel = header.querySelector(`#panel-${name}`);
    const trigger = header.querySelector(`.nav-trigger[data-panel="${name}"]`);
    if (!panel || !trigger) return;
    const wasOpen = trigger.getAttribute("aria-expanded") === "true";
    closeAll();
    if (wasOpen) return;
    trigger.setAttribute("aria-expanded", "true");
    panel.hidden = false;
    header.classList.add("mega-open");
  }

  triggers.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      openPanel(btn.dataset.panel);
    });
  });

  document.addEventListener("click", (event) => {
    if (!header.contains(event.target)) closeAll();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAll();
  });

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
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
