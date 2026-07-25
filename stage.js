(() => {
  const rail = document.querySelector(".rail");
  if (!rail) return;

  const beats = [...rail.querySelectorAll(".beat")];
  const dots = [...document.querySelectorAll(".stepper .step-dot")];
  const mq = window.matchMedia("(min-width: 900px)");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dwell = 3800;

  let index = 0;
  let timer = null;
  let wheelLock = false;
  let touchStartY = null;

  function restartAnims(beat) {
    beat.querySelectorAll(".bar, .pub-pick, .lift-line, .lift-area").forEach((el) => {
      el.style.animation = "none";
      void el.offsetWidth;
      el.style.animation = "";
    });
  }

  function setActiveDot(i) {
    index = i;
    rail.dataset.step = String(i);
    dots.forEach((dot, di) => {
      dot.classList.toggle("is-active", di === i);
    });
  }

  function restartProgress() {
    dots.forEach((dot) => {
      const fill = dot.querySelector(".step-fill");
      if (!fill) return;
      fill.style.animation = "none";
      fill.style.width = "";
      fill.style.height = "";
      void fill.offsetWidth;
      if (dot.classList.contains("is-active") && mq.matches && !reduceMotion) {
        fill.style.animation = `step-progress ${dwell}ms linear forwards`;
      } else if (dot.classList.contains("is-active")) {
        fill.style.height = "100%";
        fill.style.width = "100%";
      }
    });
  }

  function showBeat(next) {
    index = ((next % beats.length) + beats.length) % beats.length;
    setActiveDot(index);
    beats.forEach((beat, i) => {
      const on = i === index;
      beat.classList.toggle("is-active", on);
      beat.classList.toggle("is-on-screen", on);
      if (on) restartAnims(beat);
    });
    restartProgress();
  }

  function play() {
    if (reduceMotion || !mq.matches) return;
    stop();
    restartProgress();
    timer = window.setInterval(() => showBeat(index + 1), dwell);
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function setupMobile() {
    document.body.classList.remove("desktop-lock");
    document.body.classList.add("mobile-lock");
    stop();
    showBeat(index);
  }

  function setupDesktop() {
    document.body.classList.remove("mobile-lock");
    document.body.classList.add("desktop-lock");
    showBeat(index);
    play();
  }

  function applyMode() {
    if (mq.matches) setupDesktop();
    else setupMobile();
  }

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const go = Number(dot.dataset.go);
      if (Number.isNaN(go)) return;
      showBeat(go);
      if (mq.matches) play();
    });
  });

  window.addEventListener(
    "wheel",
    (event) => {
      if (!mq.matches) return;
      event.preventDefault();
      if (wheelLock) return;
      if (Math.abs(event.deltaY) < 8) return;

      wheelLock = true;
      if (event.deltaY > 0) showBeat(index + 1);
      else showBeat(index - 1);
      play();

      window.setTimeout(() => {
        wheelLock = false;
      }, 520);
    },
    { passive: false }
  );

  window.addEventListener("keydown", (event) => {
    if (!mq.matches) return;
    if (event.key === "ArrowDown" || event.key === "PageDown" || event.key === " ") {
      event.preventDefault();
      showBeat(index + 1);
      play();
    } else if (event.key === "ArrowUp" || event.key === "PageUp") {
      event.preventDefault();
      showBeat(index - 1);
      play();
    }
  });

  // Phone: swipe up/down switches beats on the same screen.
  window.addEventListener(
    "touchstart",
    (event) => {
      if (mq.matches) return;
      touchStartY = event.changedTouches[0].clientY;
    },
    { passive: true }
  );

  window.addEventListener(
    "touchend",
    (event) => {
      if (mq.matches || touchStartY == null) return;
      const dy = event.changedTouches[0].clientY - touchStartY;
      touchStartY = null;
      if (Math.abs(dy) < 48) return;
      if (dy < 0) showBeat(index + 1);
      else showBeat(index - 1);
    },
    { passive: true }
  );

  function beatFromHash() {
    const id = window.location.hash.replace("#", "");
    if (!id) return;
    const i = beats.findIndex((beat) => beat.id === id);
    if (i < 0) return;
    showBeat(i);
    if (mq.matches) play();
  }

  window.addEventListener("hashchange", beatFromHash);
  mq.addEventListener("change", applyMode);
  applyMode();
  beatFromHash();
})();
