(function () {
  "use strict";

  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");
  const navLinks = document.querySelectorAll(".nav-list a[href^='#']");
  const sections = document.querySelectorAll("main section[id]");
  const form = document.getElementById("quote-form");
  const formSuccess = document.getElementById("form-success");
  const yearEl = document.getElementById("year");
  const preloader = document.getElementById("preloader");
  const faqItems = document.querySelectorAll(".faq-item");
  const counters = document.querySelectorAll("[data-count]");
  const testimonialTrack = document.querySelector(".testimonial-track");
  const testimonialPrev = document.querySelector(".testimonial-prev");
  const testimonialNext = document.querySelector(".testimonial-next");
  const testimonialDots = document.querySelector(".testimonial-dots");

  let lastScrollY = 0;
  let testimonialIndex = 0;
  let testimonialTimer;

  /* Year */
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Preloader */
  function hidePreloader() {
    if (!preloader) return;
    preloader.classList.add("hidden");
    setTimeout(function () {
      preloader.remove();
    }, 600);
  }

  if (document.readyState === "complete") {
    hidePreloader();
  } else {
    window.addEventListener("load", hidePreloader);
    setTimeout(hidePreloader, 2500);
  }

  /* Header scroll behavior */
  function onScroll() {
    const y = window.scrollY;
    if (header) {
      header.classList.toggle("scrolled", y > 24);
      header.classList.remove("header-hidden");
    }
    lastScrollY = y;
    updateActiveNav();
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Active navigation */
  function updateActiveNav() {
    if (!sections.length || !navLinks.length) return;
    const offset = (header ? header.offsetHeight : 80) + 48;
    let current = "";

    sections.forEach(function (section) {
      if (window.scrollY >= section.offsetTop - offset) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(function (link) {
      const href = link.getAttribute("href");
      link.classList.toggle("active", href === "#" + current);
    });
  }

  /* Mobile nav */
  function closeNav() {
    if (!navToggle || !siteNav) return;
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    siteNav.classList.remove("open");
    document.body.classList.remove("nav-open");
  }

  function openNav() {
    if (!navToggle || !siteNav) return;
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
    siteNav.classList.add("open");
    document.body.classList.add("nav-open");
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      expanded ? closeNav() : openNav();
    });

    document.addEventListener("click", function (e) {
      if (
        document.body.classList.contains("nav-open") &&
        !siteNav.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        closeNav();
      }
    });
  }

  document.querySelectorAll(".site-nav a").forEach(function (link) {
    link.addEventListener("click", closeNav);
  });

  /* Scroll reveal with stagger */
  const revealTargets = document.querySelectorAll(
    "[data-reveal], .section-header, .service-card, .benefit-item, .process-step, " +
    ".testimonial-card, .faq-item, .gallery-item, .compare-card, .about-visual, " +
    ".contact-card, .quote-form, .feature-panel, .hero-panel"
  );

  revealTargets.forEach(function (el, i) {
    el.classList.add("reveal");
    if (!el.dataset.revealDelay) {
      el.style.setProperty("--reveal-delay", (i % 6) * 0.07 + "s");
    }
  });

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );

    revealTargets.forEach(function (el) {
      revealObserver.observe(el);
    });

    /* Stagger children in grids */
    document.querySelectorAll(
      ".services-bento, .benefits-grid, .process-timeline, .features-panels, .gallery-grid"
    ).forEach(function (grid) {
      Array.from(grid.children).forEach(function (child, i) {
        if (!child.classList.contains("reveal")) {
          child.classList.add("reveal");
        }
        child.style.setProperty("--reveal-delay", i * 0.09 + "s");
        revealObserver.observe(child);
      });
    });

    /* Counter animation */
    const counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (el) {
      counterObserver.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) {
      el.classList.add("visible");
    });
    counters.forEach(animateCounter);
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || "";
    const prefix = el.dataset.prefix || "";
    const duration = 1800;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      el.textContent = prefix + value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  /* FAQ accordion */
  faqItems.forEach(function (item) {
    const trigger = item.querySelector(".faq-trigger");
    const panel = item.querySelector(".faq-panel");

    if (!trigger || !panel) return;

    trigger.addEventListener("click", function () {
      const isOpen = item.classList.contains("open");

      faqItems.forEach(function (other) {
        other.classList.remove("open");
        const otherTrigger = other.querySelector(".faq-trigger");
        const otherPanel = other.querySelector(".faq-panel");
        if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
        if (otherPanel) otherPanel.style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add("open");
        trigger.setAttribute("aria-expanded", "true");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });

  /* Testimonials slider */
  function getTestimonialSlides() {
    return testimonialTrack
      ? Array.from(testimonialTrack.querySelectorAll(".testimonial-card"))
      : [];
  }

  function goToTestimonial(index) {
    const slides = getTestimonialSlides();
    if (!slides.length || !testimonialTrack) return;

    testimonialIndex = (index + slides.length) % slides.length;
    testimonialTrack.style.transform =
      "translateX(-" + testimonialIndex * 100 + "%)";

    if (testimonialDots) {
      testimonialDots.querySelectorAll("button").forEach(function (dot, i) {
        dot.classList.toggle("active", i === testimonialIndex);
        dot.setAttribute("aria-selected", i === testimonialIndex ? "true" : "false");
      });
    }
  }

  function startTestimonialAutoplay() {
    clearInterval(testimonialTimer);
    testimonialTimer = setInterval(function () {
      goToTestimonial(testimonialIndex + 1);
    }, 6000);
  }

  if (testimonialTrack) {
    const slides = getTestimonialSlides();

    if (testimonialDots && slides.length) {
      slides.forEach(function (_, i) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", "Go to testimonial " + (i + 1));
        dot.setAttribute("role", "tab");
        if (i === 0) {
          dot.classList.add("active");
          dot.setAttribute("aria-selected", "true");
        }
        dot.addEventListener("click", function () {
          goToTestimonial(i);
          startTestimonialAutoplay();
        });
        testimonialDots.appendChild(dot);
      });
    }

    if (testimonialPrev) {
      testimonialPrev.addEventListener("click", function () {
        goToTestimonial(testimonialIndex - 1);
        startTestimonialAutoplay();
      });
    }

    if (testimonialNext) {
      testimonialNext.addEventListener("click", function () {
        goToTestimonial(testimonialIndex + 1);
        startTestimonialAutoplay();
      });
    }

    startTestimonialAutoplay();
    testimonialTrack.addEventListener("mouseenter", function () {
      clearInterval(testimonialTimer);
    });
    testimonialTrack.addEventListener("mouseleave", startTestimonialAutoplay);
  }

  /* Parallax hero */
  const hero = document.querySelector(".hero");
  const heroBg = document.querySelector(".hero-bg");

  if (hero && heroBg && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener(
      "scroll",
      function () {
        const rect = hero.getBoundingClientRect();
        if (rect.bottom > 0) {
          heroBg.style.transform = "translateY(" + window.scrollY * 0.35 + "px)";
        }
      },
      { passive: true }
    );
  }

  /* Form */
  function validatePhone(value) {
    return value.replace(/\D/g, "").length >= 10;
  }

  function setFieldError(field, hasError) {
    if (!field) return;
    field.classList.toggle("error", hasError);
    const group = field.closest(".form-group");
    if (group) group.classList.toggle("has-error", hasError);
  }

  if (form) {
    form.querySelectorAll("input, textarea").forEach(function (field) {
      field.addEventListener("input", function () {
        setFieldError(field, false);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = form.querySelector("#name");
      const phone = form.querySelector("#phone");
      let valid = true;

      setFieldError(name, false);
      setFieldError(phone, false);

      if (!name.value.trim()) {
        setFieldError(name, true);
        valid = false;
      }
      if (!validatePhone(phone.value)) {
        setFieldError(phone, true);
        valid = false;
      }

      if (!valid) {
        (name.classList.contains("error") ? name : phone).focus();
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Sending…";
      }

      setTimeout(function () {
        form.classList.add("submitted");
        if (formSuccess) formSuccess.hidden = false;
        if (btn) {
          btn.disabled = false;
          btn.textContent = "Submit Quote Request";
        }
      }, 800);
    });
  }
})();
