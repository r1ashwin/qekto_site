(() => {
  const rail = document.querySelector(".rail");
  if (!rail) return;

  const beats = [...rail.querySelectorAll(".beat")];
  const dots = [...document.querySelectorAll(".desktop-stepper .step-dot")];
  const mq = window.matchMedia("(min-width: 900px)");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dwell = 3800;

  let index = 0;
  let timer = null;
  let observers = [];

  function restartAnims(beat) {
    beat.querySelectorAll(".bar, .pub-pick, .lift-line").forEach((el) => {
      el.style.animation = "none";
      void el.offsetWidth;
      el.style.animation = "";
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
      }
    });
  }

  function showDesktop(next) {
    index = ((next % beats.length) + beats.length) % beats.length;
    rail.dataset.step = String(index);
    beats.forEach((beat, i) => {
      const on = i === index;
      beat.classList.toggle("is-active", on);
      beat.classList.toggle("is-on-screen", on);
      if (on) restartAnims(beat);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
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
      beat.classList.add("is-on-screen");
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.45) {
            entry.target.classList.add("is-on-screen");
            restartAnims(entry.target);
          }
        });
      },
      { threshold: [0.45, 0.6] }
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
      if (!mq.matches) return;
      showDesktop(Number(dot.dataset.go));
      play();
    });
  });

  mq.addEventListener("change", applyMode);
  applyMode();
})();
