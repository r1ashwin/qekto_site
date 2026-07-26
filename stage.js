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
  let paused = false;
  let wheelAccum = 0;
  let wheelIgnoreUntil = 0;
  let wheelCooldownTimer = null;
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
    if (reduceMotion || !mq.matches || paused) return;
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

  function pauseAuto() {
    paused = true;
    stop();
    // Freeze the active progress fill where it is.
    dots.forEach((dot) => {
      const fill = dot.querySelector(".step-fill");
      if (!fill || !dot.classList.contains("is-active")) return;
      const style = window.getComputedStyle(fill);
      const width = style.width;
      const height = style.height;
      fill.style.animation = "none";
      fill.style.width = width;
      fill.style.height = height;
    });
  }

  function resumeAuto() {
    if (!mq.matches) return;
    paused = false;
    play();
  }

  function setupMobile() {
    document.body.classList.remove("desktop-lock");
    document.body.classList.add("mobile-lock");
    paused = false;
    stop();
    showBeat(index);
  }

  function setupDesktop() {
    document.body.classList.remove("mobile-lock");
    document.body.classList.add("desktop-lock");
    paused = false;
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
      if (mq.matches && !paused) play();
    });
  });

  // Pause auto-advance while reading the center demo.
  rail.addEventListener("mouseenter", () => {
    if (!mq.matches) return;
    pauseAuto();
  });
  rail.addEventListener("mouseleave", () => {
    if (!mq.matches) return;
    resumeAuto();
  });

  window.addEventListener(
    "wheel",
    (event) => {
      if (!mq.matches) return;
      event.preventDefault();

      const now = Date.now();
      // Hard ignore covers the whole trackpad gesture + inertia.
      if (now < wheelIgnoreUntil) return;

      // Normalize line/page deltas so one notch isn’t huge on some mice.
      let dy = event.deltaY;
      if (event.deltaMode === 1) dy *= 16;
      if (event.deltaMode === 2) dy *= 48;

      wheelAccum += dy;
      if (Math.abs(wheelAccum) < 60) return;

      const goingDown = wheelAccum > 0;
      wheelAccum = 0;
      // Block everything until this gesture is done, then a short residual gap.
      wheelIgnoreUntil = now + 780;
      stop();
      if (goingDown) showBeat(index + 1);
      else showBeat(index - 1);

      if (wheelCooldownTimer) window.clearTimeout(wheelCooldownTimer);
      wheelCooldownTimer = window.setTimeout(() => {
        wheelAccum = 0;
        wheelIgnoreUntil = Date.now() + 180;
        wheelCooldownTimer = null;
        if (!paused) play();
      }, 780);
    },
    { passive: false }
  );

  window.addEventListener("keydown", (event) => {
    if (!mq.matches) return;
    if (event.key === "ArrowDown" || event.key === "PageDown" || event.key === " ") {
      event.preventDefault();
      showBeat(index + 1);
      if (!paused) play();
    } else if (event.key === "ArrowUp" || event.key === "PageUp") {
      event.preventDefault();
      showBeat(index - 1);
      if (!paused) play();
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
    if (mq.matches && !paused) play();
  }

  window.addEventListener("hashchange", beatFromHash);
  mq.addEventListener("change", applyMode);
  applyMode();
  beatFromHash();
})();
