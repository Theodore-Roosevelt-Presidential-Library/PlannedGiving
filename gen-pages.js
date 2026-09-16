#!/usr/bin/env node
/* Generates index.html (gallery + embed snippets) and tools/<name>.html
 * (standalone page per tool, usable as an iframe src or a direct link).
 * Run after build.js:  node build.js && node gen-pages.js */
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'dist/manifest.json'), 'utf8'));
const BASE = 'https://givingtools.labs.trlibrary.com/';

const ORDER = ['navigator', 'ndcredit', 'qcd', 'stock', 'bunching', 'daf', 'bequest', 'beneficiary', 'intent', 'estate', 'lifeincome', 'matching', 'monthly'];
const BLURB = {
  navigator: 'Seven questions that point a visitor to the right giving method, with reasons, links, and questions for their advisor. Built for the top of the Support page.',
  ndcredit: 'North Dakota’s 40% state credit for endowment and planned gifts: credit size, how much a donor can use, the federal-deduction interplay, and net cost.',
  qcd: 'Eligibility check, RMD estimate, and a side-by-side of giving from an IRA versus withdrawing and giving cash.',
  stock: 'Give shares or sell-then-give: capital gains avoided, deduction value, net cost, and transfer steps.',
  bunching: 'Every-year giving versus bunching two or three years into one, with the new ½%-of-AGI floor built in.',
  daf: 'Sponsor-specific grant steps, a copyable grant recommendation, and a DAF-or-direct decision helper.',
  bequest: 'Builds sample will or trust language — percentage, residuary, amount, or asset — with the Foundation’s legal details.',
  beneficiary: 'Account-by-account instructions for naming the Foundation as a beneficiary and which assets are best left to charity.',
  intent: 'The “I’ve included the Library in my plans” form. Embeds a DonorPerfect form when configured; otherwise a pre-filled email.',
  estate: 'Federal estate tax exposure, how a charitable bequest changes it, and a flag for the 18 states with their own death taxes.',
  lifeincome: 'Educational illustrations of a gift annuity, unitrust, and annuity trust using ACGA rates and the current §7520 rate.',
  matching: 'What a gift becomes with an employer match, and how to claim it.',
  monthly: 'A slider that turns a monthly amount into yearly and multi-year impact and links to the monthly giving form.'
};
const tools = ORDER.map(n => manifest.tools.find(t => t.name === n)).filter(Boolean);

const head = (title, extra = '') => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} — Giving Tools · Theodore Roosevelt Presidential Library</title>
<meta name="robots" content="index,follow">
<meta name="description" content="${title}. Free planned-giving and tax-smart giving tools from the Theodore Roosevelt Presidential Library Foundation.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap" rel="stylesheet">
<style>
  :root { --night:#092A4D; --forest:#1B4532; --bright:#8FC895; --sand:#D1CCBD; --orange:#E7805D; --ink:#25282A; --bg:#f6f4ef; }
  html,body { margin:0; background:var(--bg); color:var(--ink); font-family:"Source Serif 4", Georgia, serif; font-size:17px; line-height:1.55; }
  .wrap { max-width: 980px; margin: 0 auto; padding: 0 16px 60px; }
  header.site { background: var(--night); color:#fff; padding: 22px 0; }
  header.site .wrap { display:flex; align-items:center; justify-content:space-between; gap:16px; padding-bottom:0; flex-wrap:wrap; }
  header.site a { color:#fff; text-decoration:none; }
  .brand { font-family: Oswald, "Arial Narrow", sans-serif; text-transform: uppercase; letter-spacing:.06em; font-weight:700; font-size:18px; }
  .brand small { display:block; font-size:12px; letter-spacing:.14em; color: var(--bright); font-weight:500; }
  nav.site a { margin-left: 16px; font-family: Oswald, sans-serif; text-transform: uppercase; letter-spacing:.08em; font-size:13px; }
  h1 { font-family: Oswald, "Arial Narrow", sans-serif; text-transform: uppercase; font-size: clamp(30px, 5vw, 46px); line-height:1.05; margin: 40px 0 10px; color: var(--night); }
  .lede { font-size: 20px; max-width: 720px; margin: 0 0 30px; color:#3c4247; }
  .grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
  .card { background:#fff; border:1px solid #e2ded4; border-radius:12px; padding:20px; display:flex; flex-direction:column; gap:10px; }
  .card h3 { margin:0; font-family: Oswald, sans-serif; text-transform: uppercase; font-size:19px; color: var(--forest); letter-spacing:.02em; }
  .card p { margin:0; font-size:15px; color:#3c4247; flex:1; }
  .card .links { display:flex; gap:8px; flex-wrap:wrap; }
  .btn { display:inline-block; font-family: Oswald, sans-serif; text-transform: uppercase; letter-spacing:.06em; font-size:13px; padding:9px 14px; border-radius:8px; border:2px solid var(--forest); color: var(--forest); text-decoration:none; }
  .btn.primary { background: var(--forest); color:#fff; }
  .btn.orange { background: var(--orange); border-color: var(--orange); color:#fff; }
  pre { background:#0f1d2c; color:#e9f1ea; padding:14px 16px; border-radius:10px; overflow:auto; font-size:13.5px; line-height:1.5; }
  code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
  .note { background:#fff; border-left:4px solid var(--orange); padding:14px 18px; border-radius:0 10px 10px 0; margin: 24px 0; }
  h2 { font-family: Oswald, sans-serif; text-transform: uppercase; color: var(--night); margin: 44px 0 12px; font-size:26px; }
  footer { margin-top: 50px; font-size: 13px; color:#5b6166; border-top:1px solid #e2ded4; padding-top:18px; }
  .tool-page .trpl-gt { --trpl-font-display: Oswald, "Arial Narrow", sans-serif; --trpl-font: "Source Serif 4", Georgia, serif; }
  .embed-page { background:#fff; }
  ${extra}
</style>
</head>
<body>`;

const siteHeader = `<header class="site"><div class="wrap">
  <a href="${BASE}" class="brand">Giving Tools<small>Theodore Roosevelt Presidential Library</small></a>
  <nav class="site"><a href="https://www.trlibrary.com/support">Ways to give</a><a href="https://www.trlibrary.com/heritage-society">Heritage Society</a><a href="https://github.com/Theodore-Roosevelt-Presidential-Library/PlannedGiving">GitHub</a></nav>
</div></header>`;

const footer = `<footer><p>Theodore Roosevelt Presidential Library Foundation · 501(c)(3) · EIN 47-1324043 · 1401 East Calgary Ave, Suite 210, Bismarck, ND 58503 · <a href="mailto:giving@trlibrary.com">giving@trlibrary.com</a></p>
<p>The Foundation is not a tax, legal, or financial advisor. These tools provide general education and estimates only; please consult your own advisors. Federal figures reflect tax year ${manifest.taxYear}; reviewed annually. Open source under the MIT license.</p></footer>`;

/* ---------- index.html ---------- */
let index = head('Planned Giving Tools') + siteHeader + `<div class="wrap">
<h1>Tools for tax-smart giving</h1>
<p class="lede">Free, open-source calculators and guides that help supporters of the Theodore Roosevelt Presidential Library — and their advisors — find the smartest way to give. Every tool drops onto any web page with one line of JavaScript.</p>
<div class="grid">
${tools.map(t => `<div class="card"><h3>${t.title}</h3><p>${BLURB[t.name] || ''}</p><div class="links"><a class="btn primary" href="tools/${t.name}.html">Open tool</a><a class="btn" href="#embed-${t.name}">Embed code</a></div></div>`).join('\n')}
</div>

<h2>How to embed</h2>
<p>Each tool is a single JavaScript file that carries its own styles, the current tax figures, and the Foundation’s details. Paste one snippet where you want the tool to appear. Several tools can share a page.</p>
<pre><code>&lt;div data-trpl-tool="navigator"&gt;&lt;/div&gt;
&lt;script src="${BASE}dist/navigator.js" async&gt;&lt;/script&gt;</code></pre>
<p>Options go on the <code>div</code> as data attributes: <code>data-theme="dark"</code>, <code>data-accent="#1B4532"</code>, <code>data-hide-header="true"</code>, <code>data-intent-form-url="https://…"</code> (DonorPerfect intent form), <code>data-contact-email</code>, <code>data-contact-name</code>, <code>data-contact-phone</code>. Full reference in <a href="https://github.com/Theodore-Roosevelt-Presidential-Library/PlannedGiving/blob/main/docs/EMBED.md">docs/EMBED.md</a>.</p>
<div class="note"><b>Tax figures are reviewed every year.</b> All rates and limits live in one file (<code>src/tax-data.js</code>) stamped with the tax year and review date, and every tool prints that stamp in its footer. A scheduled reminder opens a review issue each November when the IRS publishes the next year’s figures. See <a href="https://github.com/Theodore-Roosevelt-Presidential-Library/PlannedGiving/blob/main/docs/TAX-REVIEW.md">docs/TAX-REVIEW.md</a>.</div>

<h2>Embed snippets</h2>
${tools.map(t => `<h3 id="embed-${t.name}" style="font-family:Oswald,sans-serif;text-transform:uppercase;color:var(--forest);margin:26px 0 6px">${t.title}</h3>
<pre><code>&lt;div data-trpl-tool="${t.name}"&gt;&lt;/div&gt;
&lt;script src="${BASE}dist/${t.name}.js" async&gt;&lt;/script&gt;</code></pre>
<p style="font-size:14px;color:#5b6166">Or as an iframe: <code>&lt;iframe src="${BASE}tools/${t.name}.html" style="width:100%;height:900px;border:0"&gt;&lt;/iframe&gt;</code></p>`).join('\n')}

<h2>Try them together</h2>
<p>A live demo of the Navigator, the way it would sit at the top of the Support page:</p>
<div class="tool-page"><div data-trpl-tool="navigator"></div></div>
<script src="dist/navigator.js" async></script>
${footer}
</div></body></html>`;
fs.writeFileSync(path.join(ROOT, 'index.html'), index);

/* ---------- tools/<name>.html ---------- */
fs.mkdirSync(path.join(ROOT, 'tools'), { recursive: true });
for (const t of tools) {
  const page = head(t.title) + siteHeader + `<div class="wrap tool-page">
<p style="margin:26px 0 12px"><a href="../">← All giving tools</a></p>
<div data-trpl-tool="${t.name}"></div>
<script src="../dist/${t.name}.js" async></script>
<p style="font-size:14px;color:#5b6166;margin-top:22px">Embed this tool on your own page: <code>&lt;div data-trpl-tool="${t.name}"&gt;&lt;/div&gt;&lt;script src="${BASE}dist/${t.name}.js" async&gt;&lt;/script&gt;</code></p>
${footer}
</div></body></html>`;
  fs.writeFileSync(path.join(ROOT, 'tools', t.name + '.html'), page);
  // bare embed page (no site chrome) — ideal for iframes
  fs.writeFileSync(path.join(ROOT, 'tools', t.name + '-embed.html'), head(t.title, 'body{background:#fff} .wrap{padding:0}') .replace('<body>', '<body class="embed-page">') + `<div class="wrap tool-page"><div data-trpl-tool="${t.name}"></div><script src="../dist/${t.name}.js" async></script></div></body></html>`);
}
console.log('Wrote index.html and ' + tools.length * 2 + ' tool pages');
