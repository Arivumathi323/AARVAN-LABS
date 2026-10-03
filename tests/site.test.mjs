import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import handler from '../api/contact.js';
const routes=JSON.parse(await readFile(new URL('../dist/routes.json',import.meta.url),'utf8'));
test('all 17 routes contain complete HTML, unique metadata, valid JSON-LD and working local references',async()=>{
 assert.equal(routes.length,17);const titles=new Set();
 for(const route of routes){
  const html=await readFile(new URL('../dist/'+(route.path==='/'?'index':route.path.slice(1))+'.html',import.meta.url),'utf8');
  assert.equal((html.match(/<h1\b/g)||[]).length,1,route.path);
  assert.match(html,/<html lang="en-IN">/);assert.ok(!html.includes('Demo form'));
  const title=html.match(/<title>(.*?)<\/title>/)[1];assert.ok(!titles.has(title));titles.add(title);
  assert.ok(route.title.length+14<=60);assert.ok(route.description.length<=155);
  const schema=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);assert.ok(schema['@graph'].length>=2);
  for(const node of schema['@graph'])if(node['@type']==='FAQPage')assert.equal(node.mainEntity.length,(html.match(/<main[\s\S]*?<\/main>/)[0].match(/<details><summary>/g)||[]).length);
  for(const image of html.matchAll(/<img\b[^>]*>/g)){assert.match(image[0],/alt="[^"]+"/);assert.match(image[0],/width="\d+"/);assert.match(image[0],/height="\d+"/);}
  for(const m of html.matchAll(/(?:src|href)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)){
   const p=m[1];if(p==='/api/contact')continue;const file=p==='/'?'index.html':p.slice(1).includes('.')?p.slice(1):p.slice(1)+'.html';await access(new URL('../dist/'+file,import.meta.url));
  }
 }
 for(const file of ['sitemap.xml','robots.txt','llms.txt'])assert.ok((await readFile(new URL('../dist/'+file,import.meta.url),'utf8')).length>50);
});
const good={name:'Local Test',email:'test@example.com',phone:'+919876543210',interest:'whatsapp-automation',message:'A local validation test only.',website:''};
async function invoke(body=good,method='POST',type='application/json') {const res={code:200,headers:{},setHeader(k,v){this.headers[k]=v;},status(code){this.code=code;return this;},json(data){this.data=data;return this;}};await handler({method,headers:{'content-type':type},body},res);return res;}
test('contact validation, honeypot, configuration, delivery success and failure',async()=>{
 const keys=['RESEND_API_KEY','CONTACT_FROM_EMAIL','CONTACT_TO_EMAIL'];const saved=keys.map(k=>process.env[k]);const oldFetch=globalThis.fetch;
 try{
  keys.forEach(k=>delete process.env[k]);assert.equal((await invoke(good,'GET')).code,405);
  assert.equal((await invoke({...good,email:'invalid'})).code,400);
  assert.equal((await invoke({...good,interest:'unknown'})).code,400);
  assert.equal((await invoke('{bad')).code,400);
  assert.equal((await invoke({...good,website:'spam'})).code,200);
  assert.equal((await invoke(good)).code,503);
  keys.forEach(k=>process.env[k]='test-only');let sent;
  globalThis.fetch=async(url,options)=>{assert.equal(url,'https://api.resend.com/emails');sent=JSON.parse(options.body);return {ok:true,json:async()=>({id:'mock-delivery'})};};
  assert.equal((await invoke(good)).data.ok,true);assert.equal(sent.reply_to,good.email);assert.match(sent.text,/whatsapp-automation/);
  assert.equal((await invoke(new URLSearchParams(good).toString(),'POST','application/x-www-form-urlencoded')).code,200);
  globalThis.fetch=async()=>({ok:false,json:async()=>({message:'provider failure'})});assert.equal((await invoke(good)).code,502);
 }finally{globalThis.fetch=oldFetch;keys.forEach((k,i)=>saved[i]===undefined?delete process.env[k]:process.env[k]=saved[i]);}
});

