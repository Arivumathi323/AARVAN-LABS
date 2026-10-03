import lighthouse from 'lighthouse';
import {launch} from 'chrome-launcher';
import {writeFile} from 'node:fs/promises';
const chrome=await launch({chromePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',chromeFlags:['--headless','--disable-gpu']});
try{const result=await lighthouse('http://127.0.0.1:4173/',{port:chrome.port,output:'html',onlyCategories:['performance','accessibility','best-practices','seo'],logLevel:'error'});await writeFile('artifacts/lighthouse.html',result.report);console.log(JSON.stringify({scores:Object.fromEntries(Object.entries(result.lhr.categories).map(([key,value])=>[key,value.score])),issues:Object.entries(result.lhr.audits).filter(([,v])=>v.score!==null&&v.score<.9).map(([key,v])=>({key,title:v.title,score:v.score,display:v.displayValue}))},null,2));}finally{await chrome.kill();}
