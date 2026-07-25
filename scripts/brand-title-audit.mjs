import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const expected = '<span class="brand-copy"><span class="brand-title">Harvest Moon: Echoes of Teradea</span><span class="brand-subtitle">Wiki &amp; Guides</span></span>';
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
  const brandCount = (html.match(/<a class="brand"/g) || []).length;
  const titleCount = html.split(expected).length - 1;
  if (brandCount !== 1) errors.push(`${rel}: expected one brand link, found ${brandCount}`);
  if (titleCount !== 1) errors.push(`${rel}: full two-line brand title missing or duplicated`);
  if (html.includes('<span>Echoes Guide</span>')) errors.push(`${rel}: legacy short brand remains`);
}

const css = await readFile(path.join(root, 'styles.css'), 'utf8');
for (const selector of ['.brand-copy', '.brand-title', '.brand-subtitle']) {
  if (!css.includes(selector)) errors.push(`styles.css: missing ${selector}`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Brand title audit passed: ${htmlFiles.length} pages show the full title on line one and “Wiki & Guides” on line two.`);
