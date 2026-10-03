'use strict';

function initializeMotion() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionButton = document.getElementById('motion-toggle');
  const video = document.querySelector('.hero-video');
  let paused = reducedMotion.matches || window.matchMedia('(max-width: 768px)').matches;
  let context;

  function updateMotion() {
    document.documentElement.classList.toggle('motion-paused', paused);
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.textContent = paused ? 'Play motion' : 'Pause motion';
    if (paused) {
      video.pause();
      if (context) { context.revert(); context = null; }
    } else {
      const playback = video.play();
      if (playback) playback.catch(() => { /* Static hero remains visible if autoplay is blocked. */ });
    }
  }

  function animate() {
    if (paused || !window.gsap || !window.ScrollTrigger) return;
    window.gsap.registerPlugin(window.ScrollTrigger);
    context = window.gsap.context(() => {
      window.gsap.from('.hero h1, .hero-subtext', { y: 28, opacity: 0, duration: .9, stagger: .2, ease: 'power2.out', clearProps: 'all' });
      window.gsap.utils.toArray('.section-heading').forEach((heading) => {
        window.gsap.from(heading, { y: 40, opacity: 0, duration: .75, ease: 'power2.out', clearProps: 'all', scrollTrigger: { trigger: heading, start: 'top 90%', once: true } });
      });
    });
  }

  motionButton.addEventListener('click', () => { paused = !paused; updateMotion(); });
  reducedMotion.addEventListener('change', (event) => { paused = event.matches; updateMotion(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) video.pause();
    else if (!paused) { const playback = video.play(); if (playback) playback.catch(() => {}); }
  });
  video.addEventListener('error', () => { video.hidden = true; });
  updateMotion();
  animate();
}
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded",initializeMotion); else initializeMotion();

