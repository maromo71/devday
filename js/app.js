document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle (Defensivo)
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      const path1 = mobileMenuBtn.querySelector('path:first-child');
      if (path1) {
        if (mobileMenu.classList.contains('hidden')) {
          path1.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
        } else {
          path1.setAttribute('d', 'M6 18L18 6M6 6l12 12');
        }
      }
    });

    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        const path1 = mobileMenuBtn.querySelector('path:first-child');
        if (path1) {
          path1.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
        }
      });
    });
  }

  // 2. Countdown Timer (Fuso Horário de Brasília / São Paulo: UTC-3)
  const eventDate = Date.UTC(2026, 9, 17, 11, 0, 0);
  const countdownContainer = document.getElementById('countdown-container');

  if (countdownContainer) {
    const elDays = document.getElementById('days');
    const elHours = document.getElementById('hours');
    const elMinutes = document.getElementById('minutes');
    const elSeconds = document.getElementById('seconds');

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = eventDate - now;

      if (difference <= 0) {
        countdownContainer.innerHTML = `
          <div class="text-2xl font-bold text-red-500 py-4 glow-text-red">
            O Evento já começou! Acompanhe a programação ao vivo.
          </div>
        `;
        clearInterval(countdownInterval);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      if (elDays) elDays.innerText = String(days).padStart(2, '0');
      if (elHours) elHours.innerText = String(hours).padStart(2, '0');
      if (elMinutes) elMinutes.innerText = String(minutes).padStart(2, '0');
      if (elSeconds) elSeconds.innerText = String(seconds).padStart(2, '0');
    };

    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);
  }

  // 3. Tracks Tabs Switcher (Programação)
  const tabTrilha1 = document.getElementById('tab-trilha1');
  const tabTrilha2 = document.getElementById('tab-trilha2');
  const gridTrilha1 = document.getElementById('grid-trilha1');
  const gridTrilha2 = document.getElementById('grid-trilha2');

  if (tabTrilha1 && tabTrilha2 && gridTrilha1 && gridTrilha2) {
    const switchTab = (activeTab, inactiveTab, showGrid, hideGrid) => {
      activeTab.classList.add('active', 'text-white');
      activeTab.classList.remove('text-zinc-400');
      inactiveTab.classList.remove('active', 'text-white');
      inactiveTab.classList.add('text-zinc-400');

      showGrid.classList.remove('hidden');
      showGrid.style.opacity = '0';
      setTimeout(() => {
        showGrid.style.transition = 'opacity 0.4s ease';
        showGrid.style.opacity = '1';
      }, 50);

      hideGrid.classList.add('hidden');
    };

    tabTrilha1.addEventListener('click', () => {
      switchTab(tabTrilha1, tabTrilha2, gridTrilha1, gridTrilha2);
    });

    tabTrilha2.addEventListener('click', () => {
      switchTab(tabTrilha2, tabTrilha1, gridTrilha2, gridTrilha1);
    });
  }

  // 4. Live Search Filter for Lectures
  const searchInput = document.getElementById('lecture-search');
  const searchFeedback = document.getElementById('search-feedback');

  if (searchInput && searchFeedback) {
    const filterLectures = () => {
      const query = searchInput.value.toLowerCase().trim();
      const isTrilha1Active = gridTrilha1 && !gridTrilha1.classList.contains('hidden');
      const activeGrid = isTrilha1Active ? gridTrilha1 : gridTrilha2;

      let visibleCountInActive = 0;
      let totalCardsInActive = 0;

      const cards = document.querySelectorAll('.lecture-card');
      cards.forEach(card => {
        const title = card.getAttribute('data-title').toLowerCase();
        const speaker = card.getAttribute('data-speaker').toLowerCase();
        const courseTags = card.getAttribute('data-courses').toLowerCase();
        const matches = title.includes(query) || speaker.includes(query) || courseTags.includes(query);

        const isCardInActiveGrid = activeGrid && card.parentElement.id === activeGrid.id;
        if (isCardInActiveGrid) {
          totalCardsInActive++;
        }

        if (matches) {
          card.style.display = '';
          if (isCardInActiveGrid) visibleCountInActive++;
        } else {
          card.style.display = 'none';
        }
      });

      if (visibleCountInActive === 0 && totalCardsInActive > 0) {
        searchFeedback.classList.remove('hidden');
        searchFeedback.innerText = 'Nenhuma palestra encontrada nesta trilha para o termo buscado.';
      } else {
        searchFeedback.classList.add('hidden');
      }
    };

    searchInput.addEventListener('input', filterLectures);

    if (tabTrilha1) tabTrilha1.addEventListener('click', filterLectures);
    if (tabTrilha2) tabTrilha2.addEventListener('click', filterLectures);
  }

  // 5. Active Navbar Link Highlighter on Scroll
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (sections.length > 0 && navLinks.length > 0) {
    const highlightNav = () => {
      let scrollPos = window.scrollY || document.documentElement.scrollTop;
      scrollPos += 120; // offset

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    };

    window.addEventListener('scroll', highlightNav);
    highlightNav();
  }

  // 6. Theme Toggler (Suporte a temas Light/Dark com persistência)
  const themeToggle = document.getElementById('theme-toggle');
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('color-theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('color-theme', 'dark');
    }
  };

  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);
});

