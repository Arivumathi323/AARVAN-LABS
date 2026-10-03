'use strict';

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('js-enabled');
  const header = document.getElementById('site-header');
  const toggle = document.querySelector('.menu-toggle');
  const links = document.getElementById('nav-links');
  const mobile = window.matchMedia('(max-width: 768px)');

  function setMenu(open, returnFocus = false) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    links.classList.toggle('is-open', open);
    header.classList.toggle('menu-open', open);
    if (returnFocus) toggle.focus();
  }

  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  links.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setMenu(false, true);
  });
  document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) setMenu(false);
  });
  header.addEventListener('focusout', (event) => {
    if (!header.contains(event.relatedTarget)) setMenu(false);
  });
  mobile.addEventListener('change', () => setMenu(false));
  const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  document.querySelectorAll('.project-image img').forEach((image) => {
    const fallback = () => { image.hidden = true; };
    image.addEventListener('error', fallback);
    if (image.complete && !image.naturalWidth) fallback();
  });

  document.getElementById('fiverr-link')?.addEventListener('click', (event) => {
    if (event.currentTarget.getAttribute('href') !== '#') return;
    event.preventDefault();
    document.getElementById('fiverr-status').textContent = 'Our Fiverr link is coming soon. Connect with us using the social links below.';
  });
});

