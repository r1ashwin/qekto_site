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
  let userPaused = false;

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
      if (dot.classList.contains("is-active") && mq.matches && !reduceMotion && !userPaused) {
        fill.style.animation = `step-progress ${dwell}ms linear forwards`;
      } else if (dot.classList.contains("is-active")) {
        fill.style.width = "100%";
      } else {
        fill.style.width = "";
      }
    });
  }

  function scrollToBeat(i, behavior = "smooth") {
    const target = beats[i];
    if (!target) return;
    target.scrollIntoView({ behavior, block: "start" });
  }

  function activateBeat(i, { fromUser = false } = {}) {
    if (Number.isNaN(i) || i < 0 || i >= beats.length) return;
    setActiveDot(i);
    beats.forEach((beat, bi) => {
      const on = bi === i;
      beat.classList.toggle("is-active", on);
      beat.classList.toggle("is-on-screen", on);
      if (on) restartAnims(beat);
    });
    if (fromUser) {
      userPaused = true;
      stop();
    }
    restartProgress();
  }

  function play() {
    if (reduceMotion || !mq.matches || userPaused) return;
    stop();
    restartProgress();
    timer = window.setInterval(() => {
      if (index >= beats.length - 1) {
        stop();
        return;
      }
      scrollToBeat(index + 1);
    }, dwell);
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function clearObservers() {
    observers.forEach((o) => o.disconnect());
    observers = [];
  }

  function setupScrollWatch() {
    clearObservers();
    const io = new IntersectionObserver(
      (entries) => {
        let best = null;
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (!best || entry.intersectionRatio > best.intersectionRatio) {
            best = entry;
          }
        });
        if (!best || best.intersectionRatio < 0.45) return;
        const i = Number(best.target.dataset.beat);
        if (Number.isNaN(i) || i === index) return;
        activateBeat(i);
        if (mq.matches && !userPaused) play();
      },
      { threshold: [0.45, 0.6, 0.75] }
    );

    beats.forEach((beat) => io.observe(beat));
    observers.push(io);
  }

  function setupMobile() {
    document.body.classList.remove("desktop-lock");
    stop();
    userPaused = true;
    beats.forEach((beat) => {
      beat.classList.remove("is-active");
      beat.classList.remove("is-on-screen");
    });
    if (beats[0]) beats[0].classList.add("is-on-screen");
    setActiveDot(0);
    restartProgress();
    setupScrollWatch();
  }

  function setupDesktop() {
    document.body.classList.remove("desktop-lock");
    userPaused = false;
    activateBeat(Math.min(index, beats.length - 1));
    setupScrollWatch();
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
      userPaused = true;
      stop();
      scrollToBeat(go);
      activateBeat(go, { fromUser: true });
    });
  });

  let wheelLock = false;
  window.addEventListener(
    "wheel",
    () => {
      if (!mq.matches) return;
      userPaused = true;
      stop();
      restartProgress();
      if (wheelLock) return;
      wheelLock = true;
      window.setTimeout(() => {
        wheelLock = false;
      }, 400);
    },
    { passive: true }
  );

  mq.addEventListener("change", applyMode);
  applyMode();
})();
