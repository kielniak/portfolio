'use strict';

const root = document.documentElement;

/* ===== Przełącznik motywu ===== */
const themeBtn = document.getElementById('theme-toggle');

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  // ikona pokazuje motyw, na który się przełączysz
  themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
  themeBtn.setAttribute(
    'aria-label',
    theme === 'dark' ? 'Przełącz na jasny motyw' : 'Przełącz na ciemny motyw'
  );
}

applyTheme(root.getAttribute('data-theme') || 'dark');

themeBtn.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try {
    localStorage.setItem('theme', next);
  } catch (e) {
    /* localStorage może być zablokowany, wtedy motyw działa bez zapamiętywania */
  }
});

/* ===== Menu mobilne ===== */
const menuBtn = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

function setMenu(open) {
  navLinks.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.textContent = open ? '✕' : '☰';
  menuBtn.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
}

menuBtn.addEventListener('click', () => {
  setMenu(!navLinks.classList.contains('open'));
});

// zamknij menu po kliknięciu w link
navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

// zamknij menu klawiszem Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') setMenu(false);
});

/* ===== Animacje pojawiania się sekcji ===== */
root.classList.add('js');

const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animacja tylko raz
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  // starsze przeglądarki: pokaż wszystko od razu
  revealEls.forEach((el) => el.classList.add('visible'));
}

/* ===== Podświetlanie aktywnej sekcji w menu ===== */
const sections = document.querySelectorAll('main section[id]');
const links = document.querySelectorAll('.nav-links a');

if ('IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((link) => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === '#' + entry.target.id
            );
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );
  sections.forEach((section) => navObserver.observe(section));
}

/* ===== Rok w stopce ===== */
document.getElementById('year').textContent = new Date().getFullYear();