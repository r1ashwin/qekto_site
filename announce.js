(() => {
  const bar = document.querySelector(".announce");
  if (!bar) return;

  const tabs = [...bar.querySelectorAll(".announce-tab")];
  const messages = [...bar.querySelectorAll(".announce-msg")];
  const pill = bar.querySelector(".announce-pill");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dwell = 5000;
  let current = 0;
  let paused = false;

  function placePill() {
    const tab = tabs[current];
    pill.style.width = `${tab.offsetWidth}px`;
    pill.style.transform = `translateX(${tab.offsetLeft}px)`;
  }

  function show(next) {
    if (next === current) return;
    const leaving = messages[current];
    const entering = messages[next];

    leaving.classList.remove("is-shown");
    leaving.classList.add("is-leaving");
    leaving.inert = true;

    // Reset the entering message below the bar without animating, so it always rises from the bottom.
    entering.style.transition = "none";
    entering.classList.remove("is-leaving");
    void entering.offsetWidth;
    entering.style.transition = "";
    entering.classList.add("is-shown");
    entering.inert = false;

    tabs[current].classList.remove("is-active");
    tabs[current].setAttribute("aria-selected", "false");
    current = next;
    tabs[current].classList.add("is-active");
    tabs[current].setAttribute("aria-selected", "true");
    placePill();
  }

  messages.forEach((msg, i) => {
    msg.inert = i !== current;
  });
  pill.style.transition = "none";
  placePill();
  void pill.offsetWidth;
  pill.style.transition = "";
  window.addEventListener("resize", placePill);
  document.fonts?.ready.then(placePill);

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => show(i));
  });

  if (reduceMotion) return;

  bar.addEventListener("mouseenter", () => {
    paused = true;
  });
  bar.addEventListener("mouseleave", () => {
    paused = false;
  });
  bar.addEventListener("focusin", () => {
    paused = true;
  });
  bar.addEventListener("focusout", () => {
    paused = false;
  });

  setInterval(() => {
    if (paused || document.hidden) return;
    show((current + 1) % messages.length);
  }, dwell);
})();

(() => {
  const bar = document.querySelector(".taglines");
  if (!bar) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const lines = [...bar.querySelectorAll(".tagline")];
  let current = 0;

  lines.forEach((line, i) => {
    line.setAttribute("aria-hidden", i === 0 ? "false" : "true");
  });

  function flip() {
    if (document.hidden) return;
    const leaving = lines[current];
    current = (current + 1) % lines.length;
    const entering = lines[current];

    leaving.classList.remove("is-shown");
    leaving.classList.add("is-leaving");
    leaving.setAttribute("aria-hidden", "true");

    entering.style.transition = "none";
    entering.classList.remove("is-leaving");
    void entering.offsetWidth;
    entering.style.transition = "";
    entering.classList.add("is-shown");
    entering.setAttribute("aria-hidden", "false");
  }

  setInterval(flip, 6000);
})();
