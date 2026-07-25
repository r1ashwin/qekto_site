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
  let observers = [];
  let wheelLock = false;

  function restartAnims(beat) {
    beat.querySelectorAll(".bar, .pub-pick, .lift-line").forEach((el) => {
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
      void fill.offsetWidth;
      if (dot.classList.contains("is-active") && mq.matches && !reduceMotion) {
        fill.style.animation = `step-progress ${dwell}ms linear forwards`;
      } else if (dot.classList.contains("is-active") && !mq.matches) {
        fill.style.width = "100%";
      } else if (!mq.matches) {
        fill.style.width = "";
      } else {
        fill.style.width = "";
      }
    });
  }

  function showDesktop(next) {
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
    timer = window.setInterval(() => showDesktop(index + 1), dwell);
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function clearMobileObservers() {
    observers.forEach((o) => o.disconnect());
    observers = [];
  }

  function setupMobile() {
    document.body.classList.remove("desktop-lock");
    stop();
    clearMobileObservers();
    beats.forEach((beat) => {
      beat.classList.remove("is-active");
      beat.classList.remove("is-on-screen");
    });
    if (beats[0]) beats[0].classList.add("is-on-screen");
    setActiveDot(0);
    restartProgress();

    const io = new IntersectionObserver(
      (entries) => {
        let best = null;
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (!best || entry.intersectionRatio > best.intersectionRatio) {
            best = entry;
          }
        });
        if (!best || best.intersectionRatio < 0.55) return;
        const i = Number(best.target.dataset.beat);
        if (Number.isNaN(i)) return;
        beats.forEach((beat, bi) => {
          beat.classList.toggle("is-on-screen", bi === i);
        });
        setActiveDot(i);
        restartAnims(best.target);
        restartProgress();
      },
      { threshold: [0.55, 0.7, 0.85] }
    );

    beats.forEach((beat) => io.observe(beat));
    observers.push(io);
  }

  function setupDesktop() {
    document.body.classList.add("desktop-lock");
    clearMobileObservers();
    beats.forEach((beat) => beat.classList.remove("is-on-screen"));
    showDesktop(index);
    play();
  }

  function applyMode() {
    if (mq.matches) setupDesktop();
    else setupMobile();
  }

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const go = Number(dot.dataset.go);
      if (mq.matches) {
        showDesktop(go);
        play();
        return;
      }
      const target = beats[go];
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Desktop: wheel / trackpad advances beats immediately — don't wait for countdown.
  window.addEventListener(
    "wheel",
    (event) => {
      if (!mq.matches) return;
      event.preventDefault();
      if (wheelLock) return;
      if (Math.abs(event.deltaY) < 8) return;

      wheelLock = true;
      if (event.deltaY > 0) showDesktop(index + 1);
      else showDesktop(index - 1);
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
      showDesktop(index + 1);
      play();
    } else if (event.key === "ArrowUp" || event.key === "PageUp") {
      event.preventDefault();
      showDesktop(index - 1);
      play();
    }
  });

  mq.addEventListener("change", applyMode);
  applyMode();
})();
