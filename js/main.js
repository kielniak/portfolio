'use strict';

const root = document.documentElement;
const $ = (id) => document.getElementById(id);

const themeBtn = $('theme-toggle');

function applyTheme(theme) {
  const dark = theme === 'dark';
  root.dataset.theme = theme;
  themeBtn.textContent = dark ? '☀️' : '🌙';
  themeBtn.setAttribute('aria-label', dark ? 'Przełącz na jasny motyw' : 'Przełącz na ciemny motyw');
}

applyTheme(root.dataset.theme || 'dark');

themeBtn.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try { localStorage.setItem('theme', next); } catch {}
});

const menuBtn = $('menu-toggle');
const navLinks = $('nav-links');

function setMenu(open) {
  navLinks.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
  menuBtn.textContent = open ? '✕' : '☰';
}

menuBtn.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => e.key === 'Escape' && setMenu(false));

root.classList.add('js');

const revealEls = document.querySelectorAll('.reveal');
const hasObserver = 'IntersectionObserver' in window;

if (hasObserver) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.filter((e) => e.isIntersecting).forEach((e) => {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    });
  }, { threshold: 0.12 });

  revealEls.forEach((el) => revealObserver.observe(el));

  const links = document.querySelectorAll('.nav-links a');
  const navObserver = new IntersectionObserver((entries) => {
    entries.filter((e) => e.isIntersecting).forEach((e) => {
      links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  document.querySelectorAll('main section[id]').forEach((s) => navObserver.observe(s));
} else {
  revealEls.forEach((el) => el.classList.add('visible'));
}

$('year').textContent = new Date().getFullYear();