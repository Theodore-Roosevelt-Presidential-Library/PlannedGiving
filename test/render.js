/* Renders every tool page headlessly, fails on console errors, and saves a
 * screenshot of each into test/screenshots/. Run: node test/render.js */
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || (function(){ try { return require.resolve('playwright'); } catch(e) { return '/home/claude/.npm-global/lib/node_modules/playwright'; } })());
const http = require('http');
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, p);
  if (!fs.existsSync(f)) { res.writeHead(404); return res.end('nf'); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); res.end(fs.readFileSync(f));
});

(async () => {
  await new Promise(r => server.listen(8089, r));
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1100, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/fonts\.g|net::ERR/.test(m.text())) errors.push('console: ' + m.text()); });
  fs.mkdirSync(path.join(__dirname, 'screenshots'), { recursive: true });
  const tools = JSON.parse(fs.readFileSync(path.join(ROOT, 'dist/manifest.json'))).tools.map(t => t.name);
  let failed = 0;
  for (const name of tools) {
    errors.length = 0;
    await page.goto('http://localhost:8089/tools/' + name + '-embed.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const mounted = await page.$('.trpl-gt[data-tool="' + name + '"] .trpl-body > *');
    const text = await page.evaluate(() => document.body.innerText);
    const ok = mounted && !errors.length && text.includes('not a tax, legal, or financial advisor');
    // exercise: click the first radio in the navigator to be sure the wizard advances
    if (name === 'navigator') { await page.click('.trpl-radio'); await page.waitForTimeout(300); }
    await page.screenshot({ path: path.join(__dirname, 'screenshots', name + '.png'), fullPage: true });
    console.log((ok ? 'PASS ' : 'FAIL ') + name.padEnd(12) + (errors.length ? '  ' + errors.join(' | ') : ''));
    if (!ok) failed++;
  }
  // multi-tool page: all.js with three tools
  errors.length = 0;
  await page.setContent('<div data-trpl-tool="qcd"></div><div data-trpl-tool="stock"></div><div data-trpl-tool="monthly"></div><script src="http://localhost:8089/dist/all.js"></script>', { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  const n = await page.$$eval('.trpl-gt', els => els.length);
  console.log((n === 3 && !errors.length ? 'PASS ' : 'FAIL ') + 'all.js multi-tool page (' + n + ' mounted)' + (errors.length ? ' ' + errors.join(' | ') : ''));
  if (n !== 3 || errors.length) failed++;
  // two separate bundles on one page must not double-inject
  errors.length = 0;
  await page.setContent('<div data-trpl-tool="qcd"></div><div data-trpl-tool="stock"></div><script src="http://localhost:8089/dist/qcd.js"></script><script src="http://localhost:8089/dist/stock.js"></script>', { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  const n2 = await page.$$eval('.trpl-gt', els => els.length);
  const css = await page.$$eval('#trpl-gt-css', els => els.length);
  console.log((n2 === 2 && css === 1 && !errors.length ? 'PASS ' : 'FAIL ') + 'two bundles on one page (' + n2 + ' mounted, ' + css + ' stylesheet)');
  if (n2 !== 2 || css !== 1) failed++;
  await browser.close(); server.close();
  process.exit(failed ? 1 : 0);
})();
