import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const publisherId = 'ca-pub-9505220977121599';
const start = '<!-- ADSENSE_START -->';
const end = '<!-- ADSENSE_END -->';
const block = `${start}\n<meta name="google-adsense-account" content="${publisherId}">\n<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}" crossorigin="anonymous"></script>\n${end}`;

async function walk(dir) {
  const files = [];
  for (const name of await readdir(dir)) {
    if (['.git', 'node_modules'].includes(name)) continue;
    const full = path.join(dir, name);
    (await stat(full)).isDirectory() ? files.push(...await walk(full)) : files.push(full);
  }
  return files;
}

const htmlFiles = (await walk(root)).filter(file => file.endsWith('.html'));
for (const file of htmlFiles) {
  let html = await readFile(file, 'utf8');
  html = html.replace(/<!-- ADSENSE_START -->[\s\S]*?<!-- ADSENSE_END -->\s*/g, '');
  html = html.replace(/<meta\s+name=["']google-adsense-account["'][^>]*>\s*/gi, '');
  html = html.replace(/<script[^>]*pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js[^>]*><\/script>\s*/gi, '');
  if (!/<head(?:\s[^>]*)?>/i.test(html)) throw new Error(`${path.relative(root, file)} has no <head>`);
  html = html.replace(/<head(?:\s[^>]*)?>/i, match => `${match}\n${block}`);
  await writeFile(file, html);
}

await writeFile(path.join(root, 'ads.txt'), 'google.com, pub-9505220977121599, DIRECT, f08c47fec0942fa0\n');
console.log(`Configured AdSense publisher ${publisherId} on ${htmlFiles.length} HTML pages and wrote /ads.txt.`);
