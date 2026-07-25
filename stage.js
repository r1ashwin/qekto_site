(() => {
  const stage = document.querySelector(".stage");
  if (!stage) return;

  const panels = [...stage.querySelectorAll(".panel")];
  const dots = [...stage.querySelectorAll(".step-dot")];
  const total = panels.length;
  let index = 0;
  let timer = null;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dwell = 3200;

  function show(next) {
    index = ((next % total) + total) % total;
    stage.dataset.step = String(index);

    panels.forEach((panel, i) => {
      const on = i === index;
      panel.classList.toggle("is-active", on);
      // retrigger CSS animations on viz children
      if (on) {
        panel.querySelectorAll(".meter-fill, .placement, .lift-line, .lift-dot.end").forEach((el) => {
          el.style.animation = "none";
          void el.offsetWidth;
          el.style.animation = "";
        });
      }
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
      dot.setAttribute("aria-selected", i === index ? "true" : "false");
    });
  }

  function play() {
    if (reduceMotion) return;
    stop();
    timer = window.setInterval(() => show(index + 1), dwell);
  }

  function stop() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      show(Number(dot.dataset.go));
      play();
    });
  });

  stage.addEventListener("mouseenter", stop);
  stage.addEventListener("mouseleave", play);
  stage.addEventListener("focusin", stop);
  stage.addEventListener("focusout", (e) => {
    if (!stage.contains(e.relatedTarget)) play();
  });

  show(0);
  play();
})();
