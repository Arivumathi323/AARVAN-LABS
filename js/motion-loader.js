'use strict';
(async()=>{
 const load=src=>new Promise(resolve=>{const script=document.createElement('script');script.src=src;script.onload=resolve;script.onerror=resolve;document.head.append(script);});
 if(!matchMedia('(max-width: 768px), (prefers-reduced-motion: reduce)').matches){
  await load('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js');
  await load('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js');
 }
 await load('/js/animations.js');await load('/js/enhancements.js');
})();
