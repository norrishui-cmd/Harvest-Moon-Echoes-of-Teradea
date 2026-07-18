import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const publisherId = 'ca-pub-9505220977121599';
const sellerId = 'pub-9505220977121599';
const errors = [];

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
  const html = await readFile(file, 'utf8');
  const rel = path.relative(root, file).replaceAll(path.sep, '/');
  const metaCount = (html.match(new RegExp(`name=["']google-adsense-account["']\\s+content=["']${publisherId}["']`, 'gi')) || []).length;
  const scriptCount = (html.match(new RegExp(`pagead2\\.googlesyndication\\.com/pagead/js/adsbygoogle\\.js\\?client=${publisherId}`, 'gi')) || []).length;
  if (metaCount !== 1) errors.push(`${rel}: expected one AdSense account meta tag, found ${metaCount}`);
  if (scriptCount !== 1) errors.push(`${rel}: expected one AdSense script, found ${scriptCount}`);
  if (!html.includes('crossorigin="anonymous"')) errors.push(`${rel}: AdSense script missing crossorigin=anonymous`);
}

const adsTxt = (await readFile(path.join(root, 'ads.txt'), 'utf8')).trim();
const expected = `google.com, ${sellerId}, DIRECT, f08c47fec0942fa0`;
if (adsTxt !== expected) errors.push(`/ads.txt must contain exactly: ${expected}`);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`AdSense audit passed: ${htmlFiles.length} HTML pages configured once; root /ads.txt is valid.`);
