(() => {
      const root = document.documentElement;
      root.classList.add('js');

      const header = document.querySelector('.topbar-wrap');
      const menuButton = document.querySelector('.menu-toggle');
      const nav = document.querySelector('#main-nav');
      const progress = document.querySelector('.scroll-progress');
      const backToTop = document.querySelector('.back-to-top');
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const closeMenu = () => {
        if (!menuButton || !nav) return;
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open navigation');
        nav.classList.remove('is-open');
      };

      menuButton?.addEventListener('click', () => {
        const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
        menuButton.setAttribute('aria-expanded', String(!isOpen));
        menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
        nav?.classList.toggle('is-open', !isOpen);
      });

      nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape') closeMenu();
      });
      document.addEventListener('click', event => {
        if (nav?.classList.contains('is-open') && !nav.contains(event.target) && !menuButton?.contains(event.target)) {
          closeMenu();
        }
      });

      const updateScrollUI = () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
        if (progress) progress.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
        header?.classList.toggle('is-scrolled', window.scrollY > 12);
        backToTop?.classList.toggle('is-visible', window.scrollY > 480);
      };
      window.addEventListener('scroll', updateScrollUI, { passive: true });
      window.addEventListener('resize', updateScrollUI, { passive: true });
      updateScrollUI();

      backToTop?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
      });

      const revealItems = document.querySelectorAll('.reveal');
      if (reducedMotion || !('IntersectionObserver' in window)) {
        revealItems.forEach(item => item.classList.add('is-visible'));
      } else {
        const revealObserver = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              revealObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
        revealItems.forEach(item => revealObserver.observe(item));
      }

      const navLinks = [...document.querySelectorAll('#main-nav a[href^="#"]')];
      const sections = navLinks
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);
      if ('IntersectionObserver' in window && sections.length) {
        const sectionObserver = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            navLinks.forEach(link => {
              if (link.getAttribute('href') === `#${entry.target.id}`) {
                link.setAttribute('aria-current', 'location');
              } else {
                link.removeAttribute('aria-current');
              }
            });
          });
        }, { rootMargin: '-22% 0px -65% 0px', threshold: 0 });
        sections.forEach(section => sectionObserver.observe(section));
      }

      // A subtle cursor-following glow gives feature cards a tactile hover response.
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        document.querySelectorAll('.feature-card').forEach(card => {
          card.addEventListener('pointermove', event => {
            const bounds = card.getBoundingClientRect();
            card.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
            card.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
          });
        });
      }
    })();