import {execFileSync} from 'node:child_process';
import {readFile,writeFile} from 'node:fs/promises';
for(const name of ['thozhan','nova','vision-os','geo-audit','konsolv'])execFileSync('ffmpeg',['-y','-i',`assets/images/projects/${name}.png`,'-vf','scale=960:-1','-quality','82',`assets/images/projects/${name}.webp`,'-loglevel','error']);
execFileSync('ffmpeg',['-y','-i','assets/images/logo.png','-vf','scale=640:-1','-quality','85','assets/images/logo.webp','-loglevel','error']);
let template=await readFile('templates/home.html','utf8');template=template.replace(/(assets\/images\/projects\/[^".]+)\.png/g,'$1.webp').replaceAll('assets/images/logo.png','assets/images/logo.webp');await writeFile('templates/home.html',template);
