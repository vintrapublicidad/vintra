/**
 * Vintra Agency Portfolio - Core Script
 * Stack: Lenis Smooth Scroll + Navigation + WhatsApp Direct + Custom Cursor
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Accessibility: Check for prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 2. Initialize Lenis Smooth Scrolling
  let lenis = null;
  if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync Lenis with GSAP ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }

  // 3. Header Scroll Effects
  const header = document.getElementById('main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('bg-[#0A090D]/90', 'backdrop-blur-xl', 'border-b', 'border-white/10', 'py-3.5');
        header.classList.remove('py-5', 'bg-transparent');
      } else {
        header.classList.remove('bg-[#0A090D]/90', 'backdrop-blur-xl', 'border-b', 'border-white/10', 'py-3.5');
        header.classList.add('py-5', 'bg-transparent');
      }
    }, { passive: true });
  }

  // 4. Fullscreen Navigation Menu
  const menuToggle = document.getElementById('menu-toggle');
  const menuClose = document.getElementById('menu-close');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
    mobileMenu.classList.add('opacity-100', 'pointer-events-auto');
    mobileMenu.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();

    if (typeof gsap !== 'undefined') {
      gsap.fromTo('.menu-anim-item', 
        { y: 35, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.08, ease: 'power3.out', delay: 0.1 }
      );
    }
  }

  function closeMobileMenu() {
    mobileMenu.classList.add('opacity-0', 'pointer-events-none');
    mobileMenu.classList.remove('opacity-100', 'pointer-events-auto');
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (lenis) lenis.start();
  }

  if (menuToggle) menuToggle.addEventListener('click', openMobileMenu);
  if (menuClose) menuClose.addEventListener('click', closeMobileMenu);

  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          if (lenis) {
            lenis.scrollTo(targetElement, { offset: -70 });
          } else {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('opacity-0')) {
      closeMobileMenu();
    }
  });

  // 5. WhatsApp Integration Trigger
  window.openVintraWhatsApp = function(topic = 'general') {
    const phoneNumber = '5491100000000'; // Número de contacto de Vintra
    let text = 'Hola Vintra, vi su web y quiero potenciar mi negocio con ustedes.';
    if (topic === 'proyectos') {
      text = 'Hola Vintra, me gustaron sus proyectos. Quiero cotizar una web moderna para mi marca.';
    } else if (topic === 'servicios') {
      text = 'Hola Vintra, estoy interesado en sus servicios de Desarrollo Web y Publicidad.';
    }
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // 6. Video Fallback Handling
  const heroVid = document.getElementById('hero-video');
  const heroFallback = document.getElementById('hero-fallback-glow');
  if (heroVid) {
    heroVid.play().catch(() => {
      if (heroFallback) heroFallback.classList.remove('hidden');
    });
    heroVid.addEventListener('error', () => {
      if (heroFallback) heroFallback.classList.remove('hidden');
    });
  }

  // 7. Custom Cursor
  const cursor = document.getElementById('custom-cursor');
  const cursorDot = document.getElementById('custom-cursor-dot');
  if (cursor && cursorDot && window.matchMedia('(pointer: fine)').matches) {
    let cursorX = 0, cursorY = 0, dotX = 0, dotY = 0;
    document.addEventListener('mousemove', (e) => {
      cursorX = e.clientX; cursorY = e.clientY;
      cursorDot.style.left = cursorX + 'px';
      cursorDot.style.top = cursorY + 'px';
      cursor.classList.add('active');
      cursorDot.classList.add('active');
    });
    function animateCursor() {
      dotX += (cursorX - dotX) * 0.12;
      dotY += (cursorY - dotY) * 0.12;
      cursor.style.left = dotX + 'px';
      cursor.style.top = dotY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
    document.querySelectorAll('a, button, [role="button"]').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });
    document.addEventListener('mouseleave', () => {
      cursor.classList.remove('active');
      cursorDot.classList.remove('active');
    });
  }
});
