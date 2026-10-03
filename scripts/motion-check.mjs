import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const b=await chromium.launch({channel:'msedge',headless:true});
const context=await b.newContext({viewport:{width:1440,height:1000}});const p=await context.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto('http://127.0.0.1:4173/');await p.waitForFunction(()=>typeof window.gsap==='object' && document.querySelector('.animated-circuit'));
await p.getByRole('button',{name:'Pause motion'}).click();assert.equal(await p.getByRole('button',{name:'Play motion'}).getAttribute('aria-pressed'),'true');
assert.equal(errors.length,0);const noJs=await b.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const q=await noJs.newPage();await q.goto('http://127.0.0.1:4173/services/ai-agent-development');assert.equal(await q.getByRole('heading',{level:1}).textContent(),'AI Agent Development Services');assert.equal(await q.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await b.close();console.log('Desktop animation controls and JavaScript-disabled mobile content passed.');
