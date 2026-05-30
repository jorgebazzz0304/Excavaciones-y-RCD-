/* ============================================
   Excavaciones y RCD Luis González SL - Miajadas
   main.js — v20260529
   ============================================ */
(function () {
  "use strict";

  /* ------ utils ------ */
  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[" + name + "]", e); }
  }

  /* ------ Smooth scroll for anchor links ------ */
  function initSmoothScroll() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]') || e.target.closest('[data-scroll]');
      if (!a) return;
      var id = a.getAttribute("href") || a.getAttribute("data-scroll");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 70;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - navH,
        behavior: "smooth"
      });
      // Close mobile menu
      var nav = document.querySelector(".nav");
      if (nav) nav.classList.remove("is-open");
    });
  }

  /* ------ Active nav link on scroll ------ */
  function initActiveNav() {
    var links = document.querySelectorAll(".nav__link[data-target]");
    var sections = [];

    links.forEach(function (link) {
      var id = link.getAttribute("data-target");
      var sec = document.getElementById(id);
      if (sec) sections.push({ el: sec, link: link, id: id });
    });

    if (!sections.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.classList.remove("is-active"); });
          var match = sections.find(function (s) { return s.el === entry.target; });
          if (match) match.link.classList.add("is-active");
        }
      });
    }, {
      rootMargin: "-" + (parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 70) + "px 0px -60% 0px",
      threshold: 0
    });

    sections.forEach(function (s) { io.observe(s.el); });
  }

  /* ------ Mobile nav toggle ------ */
  function initMobileNav() {
    var toggle = document.querySelector(".nav__toggle");
    var nav = document.querySelector(".nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });

    // Close on outside click
    document.addEventListener("click", function (e) {
      if (nav.classList.contains("is-open") && !nav.contains(e.target)) {
        nav.classList.remove("is-open");
      }
    });
  }

  /* ------ Carruseles de tarjetas (navegación manual con flechas) ------ */
  function initCarousels() {
    var cards = document.querySelectorAll("[data-carousel]");
    cards.forEach(function (card) {
      var imgs = card.querySelectorAll(".photo-card__img");
      if (imgs.length < 2) return;

      var state = { current: 0 };

      // Crear flechas
      var prevBtn = document.createElement("button");
      prevBtn.type = "button";
      prevBtn.className = "carousel-arrow carousel-arrow--prev";
      prevBtn.setAttribute("aria-label", "Imagen anterior");
      prevBtn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 4.5 8 12l7.5 7.5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

      var nextBtn = document.createElement("button");
      nextBtn.type = "button";
      nextBtn.className = "carousel-arrow carousel-arrow--next";
      nextBtn.setAttribute("aria-label", "Imagen siguiente");
      nextBtn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8.5 4.5 7.5 7.5-7.5 7.5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

      function go(delta) {
        imgs[state.current].classList.remove("is-active");
        state.current = (state.current + delta + imgs.length) % imgs.length;
        imgs[state.current].classList.add("is-active");
      }

      prevBtn.addEventListener("click", function (e) { e.stopPropagation(); go(-1); });
      nextBtn.addEventListener("click", function (e) { e.stopPropagation(); go(1); });

      card.appendChild(prevBtn);
      card.appendChild(nextBtn);
    });
  }

  /* ------ Scroll reveal ------ */
  function initReveal() {
    var targets = document.querySelectorAll(".reveal");
    if (!targets.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.04, rootMargin: "0px 0px -2% 0px" });

    targets.forEach(function (el) { io.observe(el); });

    // 6s safety net — force reveal anything in viewport still hidden
    setTimeout(function () {
      document.querySelectorAll(".reveal:not(.is-visible)").forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add("is-visible");
        }
      });
    }, 6000);
  }

  /* ------ Boot ------ */
  function boot() {
    safe(initSmoothScroll, "initSmoothScroll");
    safe(initActiveNav,    "initActiveNav");
    safe(initMobileNav,    "initMobileNav");
    safe(initReveal,       "initReveal");
    safe(initCarousels,    "initCarousels");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

})();
