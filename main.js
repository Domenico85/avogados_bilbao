/* =============================================
   ARANDA & ASOCIADOS — main.js
   Vanilla JS · Sin dependencias
   ============================================= */

(function () {
  "use strict";

  /* ── 1. CURSOR PERSONALIZADO ── */
  const cursor    = document.getElementById("cursor");
  const cursorDot = document.getElementById("cursorDot");

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // El punto sigue al instante
    cursorDot.style.left = mouseX + "px";
    cursorDot.style.top  = mouseY + "px";
  });

  // El círculo grande sigue con inercia
  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.12;
    cursorY += (mouseY - cursorY) * 0.12;
    cursor.style.left = cursorX + "px";
    cursor.style.top  = cursorY + "px";
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Efecto hover en elementos interactivos
  const hoverTargets = document.querySelectorAll(
    "a, button, .servicio-card, .equipo-card, input, select, textarea"
  );
  hoverTargets.forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
  });


  /* ── 2. NAVBAR — scroll y menú móvil ── */
  const nav       = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const navLinks  = document.getElementById("navLinks");

  // Añadir clase scrolled al bajar
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });

  // Menú hamburguesa
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", open);
  });

  // Cerrar menú al hacer click en un enlace
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.classList.remove("open");
    });
  });


  /* ── 3. SCROLL REVEAL ── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Escalonamiento suave para elementos en grid
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, delay);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  // Asignar delays escalonados a elementos de grids
  function assignStaggerDelays(selector, delayStep = 100) {
    const groups = {};
    document.querySelectorAll(selector).forEach((el) => {
      const parent = el.parentElement;
      if (!groups[parent]) groups[parent] = [];
      groups[parent].push(el);
    });
    Object.values(groups).forEach((siblings) => {
      siblings.forEach((el, i) => {
        el.dataset.delay = i * delayStep;
      });
    });
  }

  assignStaggerDelays(".servicio-card", 80);
  assignStaggerDelays(".equipo-card", 100);
  assignStaggerDelays(".stat", 80);

  document.querySelectorAll(".reveal, .reveal-slow").forEach((el) => {
    revealObserver.observe(el);
  });

  // Hero revela inmediatamente al cargar
  window.addEventListener("load", () => {
    document.querySelectorAll(".hero .reveal").forEach((el, i) => {
      setTimeout(() => el.classList.add("visible"), 200 + i * 150);
    });
  });


  /* ── 4. CONTADORES ANIMADOS ── */
  function animateCounter(el, target, duration = 1800) {
    const start = performance.now();
    const startVal = 0;

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Easing easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(startVal + (target - startVal) * ease);
      el.textContent = current.toLocaleString("es-ES");
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const nums = entry.target.querySelectorAll(".stat-num[data-target]");
          nums.forEach((el) => {
            const target = parseInt(el.dataset.target, 10);
            animateCounter(el, target);
            delete el.dataset.target; // evitar re-animación
          });
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  const statsSection = document.querySelector(".stats");
  if (statsSection) counterObserver.observe(statsSection);


  /* ── 5. FORMULARIO DE CONTACTO ── */
  const form = document.getElementById("contactForm");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const nombre  = form.querySelector("#nombre").value.trim();
      const email   = form.querySelector("#email").value.trim();
      const mensaje = form.querySelector("#mensaje").value.trim();

      // Validación básica
      if (!nombre || !email || !mensaje) {
        shakeForm();
        return;
      }
      if (!isValidEmail(email)) {
        highlightField(form.querySelector("#email"));
        return;
      }

      // Simular envío
      const btn = form.querySelector(".btn-submit");
      btn.textContent = "Enviando…";
      btn.disabled = true;

      setTimeout(() => {
        form.innerHTML = `
          <div class="form-success">
            <p>✓ Mensaje recibido</p>
            <p style="font-size:0.9rem; margin-top:12px; font-style:normal; color: var(--gray-500);">
              Nos pondremos en contacto con usted en menos de 24 horas.
            </p>
          </div>
        `;
      }, 1200);
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function shakeForm() {
    form.style.animation = "shake 0.4s var(--ease)";
    form.addEventListener("animationend", () => (form.style.animation = ""), { once: true });
  }

  function highlightField(field) {
    field.style.borderBottomColor = "#c0392b";
    field.focus();
    setTimeout(() => (field.style.borderBottomColor = ""), 2000);
  }

  // Añadir keyframe de shake dinámicamente
  const styleEl = document.createElement("style");
  styleEl.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-8px); }
      40%       { transform: translateX(8px); }
      60%       { transform: translateX(-5px); }
      80%       { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(styleEl);


  /* ── 6. PARALLAX SUTIL EN HERO ── */
  const heroBgText = document.querySelector(".hero-bg-text");

  if (heroBgText) {
    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroBgText.style.transform = `translateY(calc(-50% + ${scrollY * 0.25}px))`;
      }
    }, { passive: true });
  }


  /* ── 7. SMOOTH SCROLL con OFFSET DE NAV ── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h"), 10) || 72;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });


  /* ── 8. EFECTO HOVER EN CARDS DE SERVICIO (tilt 3D) ── */
  document.querySelectorAll(".servicio-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 8;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -8;
      card.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${y}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

})();
