import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import vm from 'node:vm';

const base = new URL('./', import.meta.url);
for (const page of ['index.html', 'about.html']) {
  const html = await readFile(new URL(page, base), 'utf8');
  const schema = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  assert(schema.some((item) => item['@type'] === 'Organization'));
  assert(html.includes(`href="https://aarvanlabs.vercel.app/${page === 'index.html' ? '' : page}"`));
  assert.equal([...html.matchAll(/name="description"/g)].length, 1);
  for (const [, ref] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if (/^(https?:|#)/.test(ref)) continue;
    if (ref === 'assets/images/mascot.png') continue;
    await access(new URL(ref.split('#')[0], base));
  }
  if (page === 'index.html') {
    const faq = schema.find((item) => item['@type'] === 'FAQPage');
    assert.equal(faq.mainEntity.length, 3);
    assert.equal([...html.matchAll(/<details>/g)].length, 3);
    for (const question of faq.mainEntity) {
      assert(html.includes(question.name)); assert(html.includes(question.acceptedAnswer.text));
    }
  }
}
assert((await readFile(new URL('robots.txt', base), 'utf8')).includes('Sitemap: https://aarvanlabs.vercel.app/sitemap.xml'));
assert((await readFile(new URL('sitemap.xml', base), 'utf8')).includes('https://aarvanlabs.vercel.app/about.html'));
const jpeg = await readFile(new URL('assets/images/og-image.jpg', base));
assert.equal(jpeg.readUInt16BE(0), 0xffd8);

// Simulate browser events to verify fallback and performance state transitions.
const source = await readFile(new URL('js/enhancements.js', base), 'utf8');
function runtime({ mobile = false, paused = false, gsap = false } = {}) {
  const events = new Map(), raf = new Map(), timers = new Map(), observers = [];
  let sequence = 0, arcs = 0, activeContext = false, reverted = false;
  const node = () => {
    const classes = new Set();
    return { handlers: {}, hidden: true, textContent: '', dataset: {}, children: [],
      style: { setProperty(key, value) { this[key] = value; }, removeProperty(key) { delete this[key]; } },
      classList: { contains: (key) => classes.has(key), add: (key) => classes.add(key), remove: (key) => classes.delete(key), toggle: (key, on) => on ? classes.add(key) : classes.delete(key) },
      addEventListener(key, fn) { this.handlers[key] = fn; },
      setAttribute() {}, append(child) { this.children.push(child); }, prepend(child) { this.children.unshift(child); }
    };
  };
  const root = node(); if (paused) root.classList.add('motion-paused');
  root.scrollHeight = 2000; root.clientHeight = 500;
  const progress = node(), loader = node(), tilt = node(), video = node(), videoSource = node(), canvas = node();
  video.paused = false; video.readyState = 1; video.querySelector = () => videoSource;
  video.play = () => Promise.resolve();
  canvas.getContext = () => ({ setTransform() {}, clearRect() {}, beginPath() {}, arc() { arcs++; }, fill() {} });
  const hero = node(); hero.clientWidth = 1200; hero.clientHeight = 800;
  hero.getBoundingClientRect = () => ({ left: 0, width: 1200 });
  const children = { '.hero-video': video, '.video-loader': loader, '.hero-particles': canvas, '.mascot-tilt': tilt };
  hero.querySelector = (selector) => children[selector];
  const sections = [node(), node()];
  const counters = [5, 3, 1].map((value) => { const counter = node(); counter.dataset.counter = String(value); return counter; });
  const media = { matches: false, addEventListener() {} };
  const document = { documentElement: root, body: node(), hidden: false,
    querySelector: (selector) => selector === '.hero' ? hero : progress,
    querySelectorAll: (selector) => selector === '.section' ? sections : selector === '[data-counter]' ? counters : [],
    createElementNS: () => node(), addEventListener: (key, fn) => events.set(key, fn)
  };
  const fromCalls = [], toCalls = [];
  const window = { scrollY: 750, devicePixelRatio: 3,
    matchMedia: (query) => query.includes('reduced') ? media : { ...media, matches: mobile },
    addEventListener: (key, fn) => events.set(`window:${key}`, fn)
  };
  if (gsap) {
    window.ScrollTrigger = {};
    window.gsap = { registerPlugin() {}, context(fn) { fn(); activeContext = true; return { revert() { reverted = true; } }; }, from: (targets, config) => fromCalls.push({ targets, config }), to: (_, config) => toCalls.push(config) };
  }
  class IntersectionObserver { constructor(fn) { this.fn = fn; observers.push(this); } observe() {} }
  class MutationObserver { constructor(fn) { events.set('mutation', fn); } observe() {} }
  vm.runInNewContext(source, { document, window, IntersectionObserver, MutationObserver,
    requestAnimationFrame: (fn) => { const id = ++sequence; raf.set(id, fn); return id; }, cancelAnimationFrame: (id) => raf.delete(id),
    setTimeout: (fn) => { const id = ++sequence; timers.set(id, fn); return id; }, clearTimeout: (id) => timers.delete(id)
  });
  events.get('DOMContentLoaded')();
  const frame = (time) => { const queued = [...raf.values()]; raf.clear(); queued.forEach((fn) => fn(time)); };
  return { root, hero, canvas, video, videoSource, progress, loader, tilt, sections, counters, document, events, raf, timers, observers, frame, fromCalls, toCalls,
    get arcs() { return arcs; }, get activeContext() { return activeContext; }, get reverted() { return reverted; }
  };
}
const desktop = runtime(); desktop.frame(100);
assert.equal(desktop.arcs, 50); assert.equal(desktop.canvas.width, 1800);
assert.equal(desktop.progress.style.transform, 'scaleX(0.5)');
assert.equal(desktop.loader.hidden, false);
desktop.video.handlers.playing(); assert.equal(desktop.loader.hidden, true);
desktop.videoSource.handlers.error(); assert(desktop.hero.classList.contains('video-fallback'));
desktop.hero.handlers.pointermove({ pointerType: 'mouse', clientX: 3000 }); desktop.frame(116);
assert.equal(desktop.tilt.style['--mascot-tilt'], '8deg');
desktop.root.classList.add('motion-paused'); desktop.events.get('mutation')(); assert.equal(desktop.raf.size, 0);
assert.equal(desktop.counters[0].textContent, '5');
const phone = runtime({ mobile: true }); phone.frame(100); assert.equal(phone.arcs, 20);
phone.hero.handlers.pointermove({ pointerType: 'mouse', clientX: 1200 }); assert.equal(phone.tilt.style['--mascot-tilt'], undefined);
phone.document.hidden = true; phone.events.get('visibilitychange')(); assert.equal(phone.raf.size, 0);
const fallback = runtime(); [...fallback.timers.values()][0](); assert(fallback.hero.classList.contains('video-fallback'));
const reduced = runtime({ paused: true }); reduced.frame(100); assert.equal(reduced.arcs, 0); assert.equal(reduced.loader.hidden, true);
const animated = runtime({ gsap: true }); assert(animated.activeContext); assert.equal(animated.fromCalls.length, 5);
assert.equal(animated.fromCalls[1].config.stagger, .15); assert.equal(animated.fromCalls[2].config.stagger, .2);
assert.equal(animated.fromCalls[3].config.scale, .92); assert.equal(animated.fromCalls[4].config.y, 60);
assert.equal(animated.toCalls.length, 3); assert(animated.toCalls.every((config) => config.duration === 2));
animated.root.classList.add('motion-paused'); animated.events.get('mutation')(); assert(animated.reverted);
console.log('PASS: SEO, JSON-LD, FAQ parity, About links, JPEG, desktop/mobile particles, DPR cap, motion pause, video error/timeout, tilt limit and GSAP reveal/counter configuration.');
