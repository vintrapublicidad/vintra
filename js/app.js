/**
 * Vintra Agency Portfolio - Core Script
 * Stack: Lenis Smooth Scroll + GSAP ScrollTrigger + Fullscreen Menu + Real Data
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Accessibility: Check for prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 2. Initialize Lenis Smooth Scrolling
  let lenis = null;
  if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync Lenis with GSAP ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }

  // 3. Header Scroll Effects (Glassmorphism on scroll)
  const header = document.getElementById('main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('bg-[#0B0914]/90', 'backdrop-blur-xl', 'border-b', 'border-white/10', 'py-3.5');
        header.classList.remove('py-5', 'bg-transparent');
      } else {
        header.classList.remove('bg-[#0B0914]/90', 'backdrop-blur-xl', 'border-b', 'border-white/10', 'py-3.5');
        header.classList.add('py-5', 'bg-transparent');
      }
    }, { passive: true });
  }

  // 4. Fullscreen Mobile Navigation
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

    // Stagger animate menu items
    if (typeof gsap !== 'undefined') {
      gsap.fromTo('.menu-anim-item', 
        { y: 40, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.1 }
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

  // Handle ESC key to close fullscreen menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('opacity-0')) {
      closeMobileMenu();
    }
  });

  // 5. GSAP ScrollTrigger Animations
  if (!prefersReducedMotion && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance timeline
    const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    heroTl.from('.hero-badge', { opacity: 0, y: -20, duration: 0.7, delay: 0.15 })
          .from('.hero-title-line', { opacity: 0, y: 50, duration: 1, stagger: 0.12 }, '-=0.4')
          .from('.hero-desc', { opacity: 0, y: 25, duration: 0.8 }, '-=0.6')
          .from('.hero-cta-btn', { opacity: 0, y: 20, duration: 0.8 }, '-=0.5');

    // Subtle Fade-in & Parallax on Projects
    const projectCards = document.querySelectorAll('.project-card-item');
    projectCards.forEach((card) => {
      const img = card.querySelector('.project-img-inner');
      const meta = card.querySelector('.project-meta');

      // Subtle scroll fade-in
      gsap.fromTo(card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Subtle image movement
      if (img) {
        gsap.fromTo(img,
          { scale: 1.05 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.5,
            }
          }
        );
      }
    });

    // Stacking Cards Scroll Effect (2 Services)
    const stackedCards = document.querySelectorAll('.stacked-service-card');
    stackedCards.forEach((card, i) => {
      if (i < stackedCards.length - 1) {
        ScrollTrigger.create({
          trigger: stackedCards[i + 1],
          start: 'top 40%',
          end: 'top 15%',
          scrub: true,
          onUpdate: (self) => {
            const scale = 1 - (self.progress * 0.04);
            const opacity = 1 - (self.progress * 0.2);
            card.style.transform = `scale(${scale})`;
            card.style.filter = `brightness(${opacity})`;
          }
        });
      }
    });

    // Generic Section Reveal
    gsap.utils.toArray('.section-reveal').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out'
      });
    });
  }

  // 6. WhatsApp Message Trigger
  window.openVintraWhatsApp = function(topic = 'general') {
    const phoneNumber = '5491100000000'; // Número de contacto directo de Vintra
    let text = 'Hola Vintra, vi su web y quiero potenciar mi negocio con ustedes.';
    if (topic === 'proyectos') {
      text = 'Hola Vintra, me gustaron sus proyectos. Quiero cotizar una web moderna para mi marca.';
    } else if (topic === 'servicios') {
      text = 'Hola Vintra, estoy interesado en sus servicios de Desarrollo Web y Publicidad.';
    }
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // 7. Video Fallback Handling
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
});
