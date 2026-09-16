#!/usr/bin/env node
/* ============================================================================
 * Build: produces ONE self-contained JavaScript file per tool in dist/.
 *   dist/<tool>.js  = tax-data + config + core (with CSS inlined) + tool
 *   dist/all.js     = everything, for pages that use several tools
 * No dependencies. Run:  node build.js
 * ========================================================================== */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
const VERSION = pkg.version;

const read = f => fs.readFileSync(path.join(SRC, f), 'utf8');
const css = read('styles.css').replace(/\s+/g, ' ').trim();
const core = read('core.js')
  .replace(/__VERSION__/g, VERSION)
  .replace('"__CSS__"', JSON.stringify(css));
const shared = ['/* TRPL Giving Tools v' + VERSION + ' — https://givingtools.labs.trlibrary.com — built ' + new Date().toISOString().slice(0, 10) + ' */',
  read('tax-data.js'), read('config.js'), core, read('share.js'), read('glossary.js')].join('\n');

fs.mkdirSync(DIST, { recursive: true });
const tools = fs.readdirSync(path.join(SRC, 'tools')).filter(f => f.endsWith('.js')).sort();
const manifest = [];
let all = shared;
for (const f of tools) {
  const name = f.replace(/\.js$/, '');
  const src = read('tools/' + f);
  const meta = (src.match(/@tool\s+(.+)/) || [])[1] || name;
  fs.writeFileSync(path.join(DIST, name + '.js'), shared + '\n' + src);
  all += '\n' + src;
  manifest.push({ name, title: meta.trim(), file: 'dist/' + name + '.js', bytes: Buffer.byteLength(shared + src) });
}
fs.writeFileSync(path.join(DIST, 'all.js'), all);
fs.writeFileSync(path.join(DIST, 'manifest.json'), JSON.stringify({ version: VERSION, taxYear: (read('tax-data.js').match(/taxYear:\s*(\d{4})/) || [])[1], built: new Date().toISOString(), tools: manifest }, null, 2));
console.log('Built ' + manifest.length + ' tools → dist/  (v' + VERSION + ')');
manifest.forEach(m => console.log('  ' + m.name.padEnd(14) + (m.bytes / 1024).toFixed(1) + ' KB'));
