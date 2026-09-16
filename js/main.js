(function () {
  "use strict";

  // ---------- Hero video: respect reduced motion ----------
  var heroVideo = document.getElementById("heroVideo");
  if (heroVideo) {
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      heroVideo.removeAttribute("autoplay");
      heroVideo.pause();
    }
  }

  // ---------- Nav condensation on scroll ----------
  var nav = document.getElementById("nav");
  function onScrollNav() {
    if (window.scrollY > 40) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  // ---------- Mobile nav toggle ----------
  var navToggle = document.getElementById("navToggle");
  var mobileMenu = document.getElementById("mobileMenu");
  if (navToggle && mobileMenu) {
    var closeMenu = function () {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.classList.remove("is-open");
      mobileMenu.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    };
    navToggle.addEventListener("click", function () {
      var open = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!open));
      navToggle.classList.toggle("is-open", !open);
      mobileMenu.classList.toggle("is-open", !open);
      document.body.classList.toggle("menu-open", !open);
    });
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }

  // ---------- Generic reveal-on-scroll ----------
  var revealEls = document.querySelectorAll(".reveal-up");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // ---------- Tagline word-by-word reveal ----------
  var taglineEl = document.querySelector("[data-word-reveal]");
  if (taglineEl) {
    var text = taglineEl.textContent.trim();
    var words = text.split(/\s+/);
    taglineEl.innerHTML = words
      .map(function (w) { return '<span class="word">' + w + "</span>"; })
      .join(" ");

    var wordEls = taglineEl.querySelectorAll(".word");
    if ("IntersectionObserver" in window) {
      var wordIo = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              wordEls.forEach(function (w, i) {
                setTimeout(function () { w.classList.add("is-active"); }, i * 45);
              });
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      wordIo.observe(taglineEl);
    } else {
      wordEls.forEach(function (w) { w.classList.add("is-active"); });
    }
  }
})();
