/**
 * Vintra — Animations Engine (Inspired by Marcus Lorenzet portfolio)
 * Powered by GSAP + ScrollTrigger
 */

(function () {
  'use strict';

  function initAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP or ScrollTrigger not loaded yet, retrying...');
      setTimeout(initAnimations, 100);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      document.querySelectorAll('.scrub-word').forEach(w => w.style.opacity = '1');
      return;
    }

    // =========================================================================
    // 1. HERO ENTRANCE MASK REVEAL
    // =========================================================================
    const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    heroTl.fromTo('.hero-badge-pill', 
      { opacity: 0, y: -20 }, 
      { opacity: 1, y: 0, duration: 0.8, delay: 0.2 }
    );

    heroTl.fromTo('.hero-mask-line', 
      { y: '115%', opacity: 0 }, 
      { y: '0%', opacity: 1, duration: 1.1, stagger: 0.12, ease: 'power4.out' }, 
      '-=0.5'
    );

    heroTl.fromTo('.hero-sub-p', 
      { opacity: 0, y: 25 }, 
      { opacity: 1, y: 0, duration: 0.8 }, 
      '-=0.6'
    );

    heroTl.fromTo('.hero-actions-group', 
      { opacity: 0, y: 25 }, 
      { opacity: 1, y: 0, duration: 0.8 }, 
      '-=0.6'
    );

    heroTl.fromTo('.hero-stats-row', 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.8 }, 
      '-=0.5'
    );

    // =========================================================================
    // 2. TEXT SCRUBBER (Marcus Lorenzet's Signature Word Illuminate Scroll Effect)
    // =========================================================================
    const scrubTrigger = document.querySelector('.text-scrub-trigger');
    if (scrubTrigger) {
      const originalText = scrubTrigger.innerText.trim();
      const words = originalText.split(/\s+/);
      
      scrubTrigger.innerHTML = words.map(word => {
        return `<span class="scrub-word inline-block mr-[0.25em]">${word}</span>`;
      }).join('');

      const scrubWords = scrubTrigger.querySelectorAll('.scrub-word');

      gsap.to(scrubWords, {
        opacity: 1,
        color: '#FFFFFF',
        stagger: 0.08,
        ease: 'none',
        scrollTrigger: {
          trigger: scrubTrigger,
          start: 'top 80%',
          end: 'bottom 45%',
          scrub: 0.9,
        }
      });
    }

    // =========================================================================
    // 3. PROJECT CARDS REVEAL & PARALLAX
    // =========================================================================
    const projectCards = document.querySelectorAll('.project-card-item');
    projectCards.forEach((card, index) => {
      gsap.fromTo(card, 
        { opacity: 0, y: 50, scale: 0.97 }, 
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      const img = card.querySelector('.project-img-inner');
      if (img) {
        gsap.fromTo(img, 
          { yPercent: -4, scale: 1.06 }, 
          {
            yPercent: 4,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2
            }
          }
        );
      }
    });

    // =========================================================================
    // 4. FLOATING DOCK (Marcus Lorenzet "Let's Talk" bottom bar)
    // =========================================================================
    const floatingDock = document.getElementById('floating-dock');
    if (floatingDock) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
          floatingDock.classList.remove('opacity-0', 'translate-y-8', 'pointer-events-none');
          floatingDock.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
        } else {
          floatingDock.classList.add('opacity-0', 'translate-y-8', 'pointer-events-none');
          floatingDock.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
        }
      }, { passive: true });
    }

    // =========================================================================
    // 5. HERO VIDEO PARALLAX
    // =========================================================================
    const heroVid = document.getElementById('hero-video');
    if (heroVid) {
      gsap.to(heroVid, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    // =========================================================================
    // 6. STATS NUMBER COUNTER
    // =========================================================================
    const counters = document.querySelectorAll('.stat-counter');
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target') || '0', 10);
      ScrollTrigger.create({
        trigger: counter,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.to(counter, {
            innerText: target,
            duration: 1.6,
            snap: { innerText: 1 },
            ease: 'power2.out'
          });
        }
      });
    });

    // =========================================================================
    // 7. FOOTER REVEAL
    // =========================================================================
    const footerHeadline = document.querySelector('.footer-giant-title');
    if (footerHeadline) {
      gsap.fromTo(footerHeadline,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerHeadline,
            start: 'top 85%',
          }
        }
      );
    }
  }

  // Ejecutar cuando el DOM esté listo o cargado
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
  } else {
    initAnimations();
  }

})();
