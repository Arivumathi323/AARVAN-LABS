'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 768px), (hover: none), (pointer: coarse)');
  const isPaused = () => reduced.matches || root.classList.contains('motion-paused');

  // A compositor transform updates the progress line once per animation frame.
  const progress = document.querySelector('.scroll-progress');
  let progressFrame = 0;
  const updateProgress = () => {
    progressFrame = 0;
    const height = root.scrollHeight - root.clientHeight;
    progress.style.transform = `scaleX(${height > 0 ? Math.min(1, Math.max(0, window.scrollY / height)) : 0})`;
  };
  const requestProgress = () => { if (!progressFrame) progressFrame = requestAnimationFrame(updateProgress); };
  window.addEventListener('scroll', requestProgress, { passive: true });
  window.addEventListener('resize', requestProgress, { passive: true });
  if (window.ResizeObserver) new ResizeObserver(requestProgress).observe(document.body);
  requestProgress();

  // Video load/error state also covers <source> errors and blocked autoplay.
  const video = hero.querySelector('.hero-video');
  const loader = hero.querySelector('.video-loader');
  let loadingTimer;
  const stopLoading = () => { clearTimeout(loadingTimer); loader.hidden = true; };
  const useGradient = () => { stopLoading(); hero.classList.add('video-fallback'); };
  const waitForVideo = () => {
    if (isPaused()) { stopLoading(); return; }
    loader.hidden = false;
    clearTimeout(loadingTimer);
    loadingTimer = setTimeout(useGradient, 10000);
  };
  video.addEventListener('playing', () => { stopLoading(); hero.classList.remove('video-fallback'); });
  video.addEventListener('error', useGradient);
  video.querySelector('source')?.addEventListener('error', useGradient);
  video.addEventListener('waiting', waitForVideo);
  video.addEventListener('stalled', waitForVideo);
  video.addEventListener('pause', stopLoading);
  if (video.error) useGradient();
  else if (video.paused || video.readyState < 3) waitForVideo();
  const motionVideo = () => {
    if (isPaused()) stopLoading();
    else if (video.paused && !video.error) {
      waitForVideo();
      video.play()?.catch(useGradient);
    }
  };

  // Canvas particles: bounded DPR, no per-frame layout reads, stop offscreen.
  const canvas = hero.querySelector('.hero-particles');
  const ctx = canvas.getContext('2d');
  let width = 1, height = 1, particles = [], particleFrame = 0, previousTime = 0;
  let heroVisible = true;
  const resizeParticles = () => {
    width = hero.clientWidth;
    height = hero.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles = Array.from({ length: mobile.matches ? 20 : 50 }, () => ({ x: Math.random() * width, y: Math.random() * height, radius: 1 + Math.random() * 1.6, speed: 6 + Math.random() * 12 }));
  };
  const drawParticles = (time) => {
    particleFrame = 0;
    if (!ctx || isPaused() || !heroVisible || document.hidden) return;
    const seconds = previousTime ? Math.min((time - previousTime) / 1000, .05) : 0;
    previousTime = time;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(255, 107, 0, 0.2)';
    for (const particle of particles) {
      particle.y -= particle.speed * seconds;
      if (particle.y < -4) { particle.y = height + 4; particle.x = Math.random() * width; }
      ctx.beginPath(); ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2); ctx.fill();
    }
    particleFrame = requestAnimationFrame(drawParticles);
  };
  const syncParticles = () => {
    if (particleFrame) cancelAnimationFrame(particleFrame);
    particleFrame = 0; previousTime = 0;
    if (ctx && !isPaused() && heroVisible && !document.hidden) particleFrame = requestAnimationFrame(drawParticles);
    else if (ctx && isPaused()) ctx.clearRect(0, 0, width, height);
  };
  resizeParticles();
  if (window.ResizeObserver) new ResizeObserver(() => { resizeParticles(); syncParticles(); }).observe(hero);
  else window.addEventListener('resize', () => { resizeParticles(); syncParticles(); }, { passive: true });

  // Tilt the wrapper so the existing image float keeps its own transform.
  const tilt = hero.querySelector('.mascot-tilt');
  let tiltFrame = 0, targetTilt = 0;
  const resetTilt = () => { if (tiltFrame) cancelAnimationFrame(tiltFrame); tiltFrame = 0; tilt.style.removeProperty('--mascot-tilt'); hero.classList.remove('is-tilting'); };
  hero.addEventListener('pointermove', (event) => {
    if (mobile.matches || isPaused() || event.pointerType !== 'mouse') return;
    const bounds = hero.getBoundingClientRect();
    targetTilt = Math.max(-8, Math.min(8, ((event.clientX - bounds.left) / bounds.width - .5) * 16));
    hero.classList.add('is-tilting');
    if (!tiltFrame) tiltFrame = requestAnimationFrame(() => { tilt.style.setProperty('--mascot-tilt', `${targetTilt}deg`); tiltFrame = 0; });
  }, { passive: true });
  hero.addEventListener('pointerleave', resetTilt);

  // Thin SVG traces with dash pulses; only visible sections animate.
  const ns = 'http://www.w3.org/2000/svg';
  const sections = document.querySelectorAll('.section');
  sections.forEach((section) => {
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 1200 700');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('class', 'animated-circuit');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    ['M0 120H150L210 180V350H300L360 410H430', 'M1200 530H1060L980 450V250H880L810 180H730'].forEach((d) => {
      for (const pulse of [false, true]) {
        const path = document.createElementNS(ns, 'path');
        path.setAttribute('d', d); path.setAttribute('pathLength', '1000');
        if (pulse) path.setAttribute('class', 'trace-pulse');
        svg.append(path);
      }
    });
    section.prepend(svg);
  });
  if (window.IntersectionObserver) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.target === hero) { heroVisible = entry.isIntersecting; syncParticles(); }
      else entry.target.classList.toggle('circuit-visible', entry.isIntersecting);
    }));
    observer.observe(hero); sections.forEach((section) => observer.observe(section));
  } else sections.forEach((section) => section.classList.add('circuit-visible'));

  // Add reveals alongside the existing hero and section-heading animation.
  let revealContext;
  const finishCounters = () => document.querySelectorAll('[data-counter]').forEach((node) => { node.textContent = node.dataset.counter; });
  const reveal = () => {
    if (!window.gsap || !window.ScrollTrigger || isPaused()) { finishCounters(); return; }
    const gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);
    revealContext = gsap.context(() => {
      const enter = (targets, from, trigger) => gsap.from(targets, {
        ...from, duration: .85, ease: 'power2.out', clearProps: 'transform,opacity,visibility',
        scrollTrigger: { trigger, start: 'top 88%', once: true },
        onStart() { this.targets().forEach((node) => node.classList.add('reveal-active')); },
        onComplete() { this.targets().forEach((node) => node.classList.remove('reveal-active')); }
      });
      enter('.about-grid > div', { x: -60, opacity: 0 }, '.about-grid');
      enter('.values li', { scale: .82, opacity: 0, stagger: .15 }, '.values');
      enter('.service-card', { y: 50, opacity: 0, stagger: .2 }, '.services-grid');
      enter('.project-card', { scale: .92, rotationX: 8, transformPerspective: 900, opacity: 0, stagger: .15 }, '.projects-grid');
      enter('.contact-form', { y: 60, opacity: 0 }, '.contact-form');
      document.querySelectorAll('[data-counter]').forEach((node) => {
        const counter = { value: 0 };
        gsap.to(counter, { value: Number(node.dataset.counter), duration: 2, ease: 'power1.out',
          scrollTrigger: { trigger: '.stats', start: 'top 88%', once: true },
          onStart: () => { node.textContent = '0'; },
          onUpdate: () => { node.textContent = String(Math.round(counter.value)); }
        });
      });
    });
  };
  const syncMotion = () => {
    motionVideo(); syncParticles();
    if (isPaused()) {
      resetTilt();
      if (revealContext) { revealContext.revert(); revealContext = null; }
      document.querySelectorAll('.reveal-active').forEach((node) => node.classList.remove('reveal-active'));
      finishCounters();
    }
  };
  new MutationObserver(syncMotion).observe(root, { attributes: true, attributeFilter: ['class'] });
  reduced.addEventListener('change', syncMotion);
  mobile.addEventListener('change', () => { resetTilt(); resizeParticles(); syncParticles(); });
  document.addEventListener('visibilitychange', syncParticles);
  window.addEventListener('pagehide', () => { clearTimeout(loadingTimer); if (particleFrame) cancelAnimationFrame(particleFrame); resetTilt(); });
  reveal(); syncParticles();
});
