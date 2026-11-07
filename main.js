/* Alchemy Salon & Spa — interactions: mobile menu, scroll-spy, tabs, FAQ, lightbox, reveal */
(function () {
  "use strict";

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector("[data-menu-toggle]");
  var nav = document.querySelector("[data-mobile-menu]");
  var toggleIcon = toggle ? toggle.querySelector("i") : null;
  function setMenu(open) {
    if (!toggle || !nav) return;
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (toggleIcon) toggleIcon.className = open ? "bi bi-x-lg" : "bi bi-list";
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setMenu(!nav.classList.contains("open"));
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) setMenu(false);
    });
  }

  /* ---------- Scroll-spy ---------- */
  var spyLinks = document.querySelectorAll("[data-spy]");
  var sections = [];
  spyLinks.forEach(function (link) {
    var el = document.getElementById(link.getAttribute("data-spy"));
    if (el) sections.push({ link: link, el: el });
  });
  if ("IntersectionObserver" in window && sections.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        sections.forEach(function (s) {
          s.link.classList.toggle("active", s.el === entry.target);
        });
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    sections.forEach(function (s) { observer.observe(s.el); });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- Tabs ---------- */
  var tabBtns = Array.prototype.slice.call(document.querySelectorAll("[role='tab']"));
  var panels = Array.prototype.slice.call(document.querySelectorAll(".tab-panel"));
  function selectTab(btn, focus) {
    tabBtns.forEach(function (b) {
      var selected = b === btn;
      b.setAttribute("aria-selected", String(selected));
      b.tabIndex = selected ? 0 : -1;
    });
    panels.forEach(function (p) {
      p.classList.toggle("active", p.id === btn.getAttribute("data-tab"));
    });
    if (focus) btn.focus();
  }
  tabBtns.forEach(function (btn, i) {
    btn.addEventListener("click", function () { selectTab(btn, false); });
    btn.addEventListener("keydown", function (e) {
      var next = null;
      if (e.key === "ArrowRight") next = tabBtns[(i + 1) % tabBtns.length];
      if (e.key === "ArrowLeft") next = tabBtns[(i - 1 + tabBtns.length) % tabBtns.length];
      if (e.key === "Home") next = tabBtns[0];
      if (e.key === "End") next = tabBtns[tabBtns.length - 1];
      if (next) { e.preventDefault(); selectTab(next, true); }
    });
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq-item");
      var open = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  /* ---------- Lightbox (gallery) ---------- */
  var lbImages = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lightbox-img");
  var lbCaption = document.getElementById("lightbox-caption");
  var current = 0;
  var lastFocus = null;

  function showImage(i) {
    current = (i + lbImages.length) % lbImages.length;
    var img = lbImages[current];
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt || "";
    lbCaption.textContent = img.getAttribute("data-lightbox") || img.alt || "";
  }
  function openLightbox(i) {
    if (!lightbox) return;
    lastFocus = document.activeElement;
    showImage(i);
    lightbox.hidden = false;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
    var closeBtn = lightbox.querySelector(".lb-close");
    if (closeBtn) closeBtn.focus();
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  lbImages.forEach(function (img, i) {
    img.addEventListener("click", function () { openLightbox(i); });
    img.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightbox(i); }
    });
  });
  if (lightbox) {
    lightbox.querySelector(".lb-close").addEventListener("click", closeLightbox);
    lightbox.querySelector(".lb-prev").addEventListener("click", function () { showImage(current - 1); });
    lightbox.querySelector(".lb-next").addEventListener("click", function () { showImage(current + 1); });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (lightbox.classList.contains("open")) {
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") showImage(current - 1);
        if (e.key === "ArrowRight") showImage(current + 1);
      }
    });
  }
})();
