/**
 * PageCraft — script.js
 * Funcionalidades: Navbar scroll, animações fade-in, menu mobile,
 * hover nos cards, scroll suave e feedback visual nos CTAs.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────────
     1. NAVBAR — adiciona classe .scrolled ao scroll
  ───────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  const handleNavbar = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavbar, { passive: true });
  handleNavbar(); // run on load


  /* ─────────────────────────────────────────────
     2. MENU HAMBURGUER (mobile)
  ───────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      // Animação das barras do hamburger
      hamburger.classList.toggle('active', isOpen);
    });

    // Fecha o menu ao clicar em um link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
      });
    });

    // Fecha ao clicar fora
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
      }
    });
  }


  /* ─────────────────────────────────────────────
     3. ANIMAÇÕES FADE-IN AO SCROLL (IntersectionObserver)
  ───────────────────────────────────────────── */
  const fadeEls = document.querySelectorAll('.fade-in');

  if (fadeEls.length > 0) {
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target); // anima apenas uma vez
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    fadeEls.forEach(el => fadeObserver.observe(el));
  }


  /* ─────────────────────────────────────────────
     4. SCROLL SUAVE PARA ÂNCORAS (botões e links internos)
  ───────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });


  /* ─────────────────────────────────────────────
     5. FEEDBACK VISUAL NOS BOTÕES CTA
  ───────────────────────────────────────────── */
  const ctaButtons = document.querySelectorAll('.btn-primary, .btn-cta-whatsapp, .btn-cta-insta, .btn-card');

  ctaButtons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      // Efeito de ripple
      const ripple = document.createElement('span');
      ripple.classList.add('ripple-effect');

      const rect   = this.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height);
      const x      = e.clientX - rect.left - size / 2;
      const y      = e.clientY - rect.top  - size / 2;

      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255,255,255,0.3);
        transform: scale(0);
        animation: ripple-anim 0.55s ease-out forwards;
        pointer-events: none;
      `;

      // Garante que o botão tenha position relative para o ripple funcionar
      if (getComputedStyle(this).position === 'static') {
        this.style.position = 'relative';
      }
      this.style.overflow = 'hidden';
      this.appendChild(ripple);

      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  // Injeta a keyframe de ripple no <head> (uma vez)
  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `
      @keyframes ripple-anim {
        to { transform: scale(2.5); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }


  /* ─────────────────────────────────────────────
     6. HOVER INTERATIVO NOS SERVICE CARDS (paralax leve)
  ───────────────────────────────────────────── */
  const serviceCards = document.querySelectorAll('.service-card');

  serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const centerX = rect.width  / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) *  4;

      card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease';
    });
  });


  /* ─────────────────────────────────────────────
     7. SCROLL SUAVE ESCONDENDO O BOTÃO FLOAT
        (esconde ao chegar na seção de CTA)
  ───────────────────────────────────────────── */
  const whatsappFloat = document.getElementById('whatsappFloat');
  const ctaSection    = document.getElementById('contato');

  if (whatsappFloat && ctaSection) {
    const floatObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // CTA visível → esconde o float (redundante)
            whatsappFloat.style.opacity = '0';
            whatsappFloat.style.pointerEvents = 'none';
          } else {
            whatsappFloat.style.opacity = '1';
            whatsappFloat.style.pointerEvents = 'all';
          }
        });
      },
      { threshold: 0.4 }
    );

    floatObserver.observe(ctaSection);
  }


  /* ─────────────────────────────────────────────
     8. ANIMAÇÃO DE CONTAGEM NOS NÚMEROS DA HERO PROOF
  ───────────────────────────────────────────── */
  const proofItems = document.querySelectorAll('.proof-item strong');

  const parseTarget = (text) => {
    const match = text.match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
  };

  const animateCount = (el, target, originalText, duration = 1200) => {
    const start  = performance.now();

    const step = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current  = Math.floor(ease * target);

      el.textContent = originalText.replace(/\d+/, current);

      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const originalText = el.textContent;
          const target = parseTarget(originalText);

          if (target !== null) {
            animateCount(el, target, originalText);
          }

          countObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  proofItems.forEach(item => countObserver.observe(item));


  /* ─────────────────────────────────────────────
     9. ANIMAÇÃO DOS HAMBURGUER SPANS (X ao abrir)
  ───────────────────────────────────────────── */
  const injectHamburgerStyle = () => {
    if (!document.getElementById('hamburger-style')) {
      const style = document.createElement('style');
      style.id = 'hamburger-style';
      style.textContent = `
        .hamburger.active span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        .hamburger.active span:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }
        .hamburger.active span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }
      `;
      document.head.appendChild(style);
    }
  };

  injectHamburgerStyle();


  /* ─────────────────────────────────────────────
     10. HIGHLIGHT ATIVO NO MENU (active link por seção)
  ───────────────────────────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navAnchors.forEach(a => {
            a.style.color = '';
            if (a.getAttribute('href') === `#${entry.target.id}`) {
              if (!a.classList.contains('nav-cta')) {
                a.style.color = 'var(--purple)';
              }
            }
          });
        }
      });
    },
    { threshold: 0.4, rootMargin: '-80px 0px -40% 0px' }
  );

  sections.forEach(s => sectionObserver.observe(s));

}); // end DOMContentLoaded