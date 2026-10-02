import { cp, mkdir } from 'node:fs/promises';
await mkdir(new URL('./dist/', import.meta.url), { recursive: true });
for (const item of ['index.html', 'about.html', 'robots.txt', 'sitemap.xml', 'css', 'js', 'assets']) {
  await cp(new URL(`./${item}`, import.meta.url), new URL(`./dist/${item}`, import.meta.url), { recursive: true });
}
console.log('Static website prepared in dist/');
