'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const mascot = document.getElementById('mascot');
  const logo = document.getElementById('mascot-fallback');
  if (!mascot || !logo) return;
  function useLogo() {
    mascot.hidden = true;
    logo.hidden = false;
  }
  mascot.addEventListener('error', useLogo);
  if (mascot.complete && !mascot.naturalWidth) useLogo();
});
