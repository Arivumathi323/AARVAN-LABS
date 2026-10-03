import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import contact from './api/contact.js';
// Load local email settings for both npm run dev and direct preview startup.
try { process.loadEnvFile(fileURLToPath(new URL('./.env', import.meta.url))); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
const root=fileURLToPath(new URL('./dist/',import.meta.url));
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.mp4':'video/mp4','.xml':'application/xml','.txt':'text/plain','.json':'application/json'};
http.createServer(async(req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(pathname==='/api/contact'){
   let body=''; for await(const chunk of req){body+=chunk;if(body.length>12000){res.writeHead(413);res.end();return;}}
   req.body=body;res.status=code=>{res.statusCode=code;return res;};res.json=data=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify(data));};await contact(req,res);return;
  }
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
  let relative=pathname==='/'?'index.html':pathname.replace(/^\//,'').replace(/\/$/,'');if(!path.extname(relative))relative+='.html';
  const file=path.resolve(root,relative);if(!file.startsWith(root)){res.writeHead(403);res.end();return;}
  const data=await readFile(file),headers={'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'};
  res.writeHead(200,{...headers,'Content-Length':data.length});res.end(req.method==='HEAD'?undefined:data);
 }catch{res.writeHead(404);res.end('Not found');}
}).listen(4173,'127.0.0.1',()=>console.log('Aarvan Labs preview: http://127.0.0.1:4173'));
