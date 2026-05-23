// ── Theme Toggle ──
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

function getPreferredTheme() {
  const stored = localStorage.getItem('theme');
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

// Apply on load (before paint to avoid flash)
setTheme(getPreferredTheme());

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

// React to OS preference changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    setTheme(e.matches ? 'dark' : 'light');
  }
});

// ── Accordion Logic ──
const headers = document.querySelectorAll('.accordion-header');

function openSection(section) {
  const header = section.querySelector('.accordion-header');
  const body = section.querySelector('.accordion-body');
  header.setAttribute('aria-expanded', 'true');
  body.classList.add('open');
}

function closeSection(section) {
  const header = section.querySelector('.accordion-header');
  const body = section.querySelector('.accordion-body');
  header.setAttribute('aria-expanded', 'false');
  body.classList.remove('open');
}

headers.forEach(header => {
  header.addEventListener('click', () => {
    const section = header.closest('.accordion-section');
    const isOpen = header.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeSection(section);
    } else {
      openSection(section);
    }
  });
});

// ── Expand All / Collapse All ──
document.getElementById('expand-all').addEventListener('click', () => {
  document.querySelectorAll('.accordion-section').forEach(section => openSection(section));
});
document.getElementById('collapse-all').addEventListener('click', () => {
  document.querySelectorAll('.accordion-section').forEach(section => closeSection(section));
});

// ── Mobile Nav FAB ──
const navFab = document.getElementById('nav-fab');
const tocSidebar = document.getElementById('toc-sidebar');
const tocClose = document.getElementById('toc-close');

if (navFab) {
  navFab.addEventListener('click', () => {
    tocSidebar.classList.toggle('open');
  });
}

if (tocClose) {
  tocClose.addEventListener('click', () => {
    tocSidebar.classList.remove('open');
  });
}

// Close sidebar when clicking a TOC link on mobile
const tocLinks = tocSidebar.querySelectorAll('a');
tocLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    if (window.innerWidth <= 1100) {
      tocSidebar.classList.remove('open');
    }

    const sectionId = link.getAttribute('data-section');
    if (sectionId) {
      const section = document.getElementById('section-' + sectionId);
      if (section) {
        openSection(section);
        setTimeout(() => {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  });
});

// ── Active Section Highlighting ──
const sections = document.querySelectorAll('.accordion-body[id]');

function highlightActive() {
  let current = '';
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 160) {
      current = section.id;
    }
  });
  tocLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href === '#' + current) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', highlightActive, { passive: true });
highlightActive();

// ── Progress Bar ──
const progressBar = document.getElementById('progress-bar');

function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (docHeight > 0) {
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = progress + '%';
  }
}

window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// ── Keyboard Navigation ──
headers.forEach(header => {
  header.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      header.click();
    }
  });
});
