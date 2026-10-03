import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'msedge',headless:true});
try{for(const width of [390,1440]){const page=await browser.newPage({viewport:{width,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>{const v=document.querySelector('.hero-video');return v && !v.paused && v.currentTime>0.2;});assert.equal(await page.locator('#motion-toggle').count(),0);assert.equal(await page.locator('video').evaluate(v=>v.loop&&v.muted&&v.autoplay),true);assert.deepEqual(errors,[]);console.log(width+': muted looping autoplay confirmed; button removed');await page.close();}}finally{await browser.close();}
