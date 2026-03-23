window.history.scrollRestoration = "manual";
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

window.addEventListener("DOMContentLoaded", () => {
  // === Typed Text (Loading Screen) ===
  new Typed("#typed-title", {
    strings: ["Speedrun Learning"],
    typeSpeed: 45,
    showCursor: true,
    cursorChar: "|",
    loop: false,
  });

  // === Spinner Build ===
  const container = document.querySelector(".spinner-container");
  if (container) {
    const COUNT = 16;

    for (let n = 0; n < COUNT; n++) {
      const circle = document.createElement("div");
      circle.classList.add("circle");

      const SIZE = 20;
      const step = SIZE / COUNT;
      const localSize = SIZE - step * n;
      const offset = (step * n) / 2;

      circle.style.width = localSize + "vw";
      circle.style.height = localSize + "vw";
      circle.style.left = offset + "vw";
      circle.style.top = offset + "vw";
      circle.style.animationDuration = (9 / (n + 1)) + "s";

      container.appendChild(circle);
    }
  }

  // === Fade Out Loading ===
  setTimeout(() => {
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) loadingScreen.style.opacity = "0";

    const bg = document.getElementById("background-fade");
    if (bg) bg.style.opacity = "1";

    document.body.classList.add("loaded");

    setTimeout(() => {
      if (loadingScreen) loadingScreen.style.display = "none";
    }, 450);
  }, 1250);

  // === Hero Rotating Word (typed-in) ===
  const heroRotates = [
    document.getElementById("hero-rotate"),
    document.getElementById("hero-rotate-mobile"),
  ].filter(Boolean);

  if (heroRotates.length > 0) {
    const heroRotateSlots = heroRotates.map((element) => element.parentElement).filter(Boolean);
    const words = ["systems", "focus", "consistency", "independence"];
    const charDelay = 75;   // typing speed (ms per character)
    const holdTime = 3750;  // how long the word stays visible
    const blankPause = 350; // pause with empty space between words
    const outTime = 400;    // must match your CSS .is-swapping transition
    let i = 0;
    let rotateIntervalId = null;
    let swapTimeoutId = null;
    let blankTimeoutId = null;

    function renderWord(word) {
      heroRotates.forEach((heroRotate) => {
        heroRotate.innerHTML = "";
        [...word].forEach((ch, idx) => {
          const span = document.createElement("span");
          span.className = "char";
          span.textContent = ch === " " ? "\u00A0" : ch;
          span.style.animationDelay = `${idx * charDelay}ms`;
          heroRotate.appendChild(span);
        });
      });
    }

    function clearRotationTimers() {
      if (rotateIntervalId) {
        clearInterval(rotateIntervalId);
        rotateIntervalId = null;
      }
      if (swapTimeoutId) {
        clearTimeout(swapTimeoutId);
        swapTimeoutId = null;
      }
      if (blankTimeoutId) {
        clearTimeout(blankTimeoutId);
        blankTimeoutId = null;
      }
    }

    function startDesktopRotation() {
      clearRotationTimers();
      heroRotates.forEach((heroRotate) => heroRotate.classList.remove("is-swapping"));
      renderWord(words[i]);

      rotateIntervalId = setInterval(() => {
        heroRotates.forEach((heroRotate) => heroRotate.classList.add("is-swapping"));

        swapTimeoutId = setTimeout(() => {
          heroRotates.forEach((heroRotate) => {
            heroRotate.innerHTML = "";
          });

          blankTimeoutId = setTimeout(() => {
            i = (i + 1) % words.length;
            heroRotates.forEach((heroRotate) => heroRotate.classList.remove("is-swapping"));
            renderWord(words[i]);
          }, blankPause);
        }, outTime);
      }, holdTime);
    }

    heroRotateSlots.forEach((slot) => {
      slot.style.minWidth = "10.5ch";
    });
    startDesktopRotation();
  }

  // === Mobile Menu Toggle ===
  const menuBtn = document.getElementById("srMenuButton");
  const mobileMenu = document.getElementById("srMobileMenu");

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = mobileMenu.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Close when clicking a link
    mobileMenu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        mobileMenu.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });

    // Close when clicking outside
    document.addEventListener("click", () => {
      mobileMenu.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
    });

    // Close on resize back to desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 800) {
        mobileMenu.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  } 
});
