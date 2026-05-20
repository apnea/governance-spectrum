// Mobile TOC toggle
const tocToggle = document.getElementById('toc-toggle');
const tocSidebar = document.getElementById('toc-sidebar');
const tocClose = document.getElementById('toc-close');

if (tocToggle) {
  tocToggle.addEventListener('click', () => {
    tocSidebar.classList.toggle('open');
  });
}

if (tocClose) {
  tocClose.addEventListener('click', () => {
    tocSidebar.classList.remove('open');
  });
}

// Close sidebar when clicking a link on mobile
const tocLinks = tocSidebar.querySelectorAll('a');
tocLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 1100) {
      tocSidebar.classList.remove('open');
    }
  });
});

// Active section highlighting
const sections = document.querySelectorAll('section[id]');
const tocListItems = tocSidebar.querySelectorAll('.toc-list > li');

function highlightActive() {
  let current = '';
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 120) {
      current = section.id;
    }
  });
  tocLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', highlightActive, { passive: true });
highlightActive();
