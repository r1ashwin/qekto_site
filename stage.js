(() => {
  const rail = document.querySelector(".rail");
  if (!rail) return;

  const beats = [...rail.querySelectorAll(".beat")];
  const dots = [...document.querySelectorAll(".desktop-stepper .step-dot")];
  const mq = window.matchMedia("(min-width: 900px)");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
  }

  function play() {
    if (reduceMotion || !mq.matches) return;
    stop();
    timer = window.setInterval(() => showDesktop(index + 1), 4200);
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

  rail.addEventListener("mouseenter", () => {
    if (mq.matches) stop();
  });
  rail.addEventListener("mouseleave", () => {
    if (mq.matches) play();
  });

  // Desktop: wheel advances steps instead of scrolling the page
  let wheelLock = false;
  window.addEventListener(
    "wheel",
    (e) => {
      if (!mq.matches || wheelLock) return;
      e.preventDefault();
      wheelLock = true;
      showDesktop(index + (e.deltaY > 0 ? 1 : -1));
      play();
      window.setTimeout(() => {
        wheelLock = false;
      }, 700);
    },
    { passive: false }
  );

  mq.addEventListener("change", applyMode);
  applyMode();
})();
