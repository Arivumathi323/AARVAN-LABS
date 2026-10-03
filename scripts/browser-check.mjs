import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'msedge',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});const page=await context.newPage();
const errors=[];page.on('pageerror',error=>errors.push(error.message));
await mkdir('artifacts',{recursive:true});
await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
await page.screenshot({path:'artifacts/home-desktop.png'});
const desktop=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
await page.getByRole('navigation',{name:'Main navigation'}).getByText('Services',{exact:true}).click();
await page.getByRole('link',{name:'WhatsApp Automation',exact:true}).first().click();
assert.ok(page.url().endsWith('/services/whatsapp-automation'));
await page.getByRole('main').getByRole('link',{name:'Book a Free Call',exact:true}).first().click();
assert.equal(await page.getByLabel("I'm interested in").inputValue(),'whatsapp-automation');
await page.getByLabel('Name',{exact:true}).fill('Local Test');await page.getByLabel('Email',{exact:true}).fill('test@example.com');await page.getByLabel('Phone / WhatsApp').fill('+919876543210');await page.getByLabel('Message',{exact:true}).fill('A local preview form check.');
await page.getByRole('button',{name:'Send Message'}).click();await page.getByRole('status').filter({hasText:'Email delivery is not configured'}).waitFor();
await page.route('**/api/contact',route=>route.fulfill({json:{ok:true}}));await page.getByRole('button',{name:'Send Message'}).click();await page.getByRole('status').filter({hasText:'Your enquiry has been sent'}).waitFor();
await page.setViewportSize({width:390,height:844});await page.goto('http://127.0.0.1:4173/learn');
await page.getByRole('button',{name:'Open navigation'}).click();await page.getByRole('navigation',{name:'Main navigation'}).getByText('Learn',{exact:true}).click();await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'1:1 Mentorship',exact:true}).click();assert.ok(page.url().endsWith('/learn/one-on-one-mentorship'));
await page.waitForLoadState('load');await page.getByRole('button',{name:'Open navigation'}).waitFor({state:'visible'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
await page.screenshot({path:'artifacts/learn-mobile.png'});
const mobile=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
await page.goto('http://127.0.0.1:4173/');await page.waitForLoadState('load');await page.getByRole('button',{name:'Open navigation'}).waitFor({state:'visible'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await page.screenshot({path:'artifacts/home-mobile.png'});
const results={errors,desktopA11y:desktop.violations.map(x=>({id:x.id,impact:x.impact,nodes:x.nodes.map(n=>n.target)})),mobileA11y:mobile.violations.map(x=>({id:x.id,impact:x.impact,nodes:x.nodes.map(n=>n.target)}))};
await writeFile('artifacts/browser-results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));await browser.close();assert.equal(errors.length,0);assert.equal(results.desktopA11y.length,0);assert.equal(results.mobileA11y.length,0);


