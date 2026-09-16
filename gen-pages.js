#!/usr/bin/env node
/* Generates index.html (gallery + embed snippets) and tools/<name>.html
 * (standalone page per tool, usable as an iframe src or a direct link).
 * Run after build.js:  node build.js && node gen-pages.js */
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'dist/manifest.json'), 'utf8'));
// Organization config (read from src/config.js without a browser)
const ORG = (() => { const w = {}; new Function('window', fs.readFileSync(path.join(ROOT, 'src/config.js'), 'utf8'))(w); return w.TRPL_ORG; })();
const BASE = ORG.urls.tools.replace(/\/?$/, '/');
const SITE = ORG.site;

const ORDER = ['navigator', 'states', 'ndcredit', 'qcd', 'stock', 'bunching', 'daf', 'bequest', 'beneficiary', 'intent', 'estate', 'lifeincome', 'matching', 'monthly', 'deadlines'];
const STAFF = ['acknowledgments'];
const BLURB = {
  navigator: 'Seven questions that point a visitor to the right giving method, with reasons, links, and questions for their advisor. Built for the top of the Support page.',
  states: 'How every state treats a charitable gift on its income tax — filter to one state to see what it means for a gift, and which giving method fits.',
  ndcredit: 'North Dakota’s 40% state credit for endowment and planned gifts — for individuals, businesses, trusts, and estates: credit size, how much a donor can use, why it beats a deduction in ND, the federal-deduction interplay, and net cost.',
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
  monthly: 'A slider that turns a monthly amount into yearly and multi-year impact and links to the monthly giving form.',
  deadlines: 'Pick a gift type and see when it counts, the start-by date for this year, and what to do — checks, stock, QCDs, DAFs, wires, property.',
  acknowledgments: 'Staff tool: IRS-compliant acknowledgment letters for every gift type, plus the North Dakota endowment qualification letter donors attach to Schedule ND-1QEC.'
};
const tools = ORDER.filter(n => n !== 'ndcredit' || ORG.features.ndCredit).map(n => manifest.tools.find(t => t.name === n)).filter(Boolean);
const staffTools = ORG.features.staffTools ? STAFF.map(n => manifest.tools.find(t => t.name === n)).filter(Boolean) : [];

const head = (title, extra = '', fontBase = 'fonts') => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} — ${SITE.title} · ${SITE.tagline}</title>
<meta name="robots" content="index,follow">
<meta name="description" content="${title}. Free planned-giving and tax-smart giving tools from the ${ORG.name}.">
<style>
  @font-face{font-family:"Dharma Gothic E";font-weight:700;src:url(${fontBase}/dharma_type-dharmagothice-bold.woff2) format("woff2");font-display:swap}
  @font-face{font-family:"Clearface";font-weight:400;src:url(${fontBase}/clearfacestd-regular.woff2) format("woff2");font-display:swap}
  @font-face{font-family:"Clearface";font-weight:400;font-style:italic;src:url(${fontBase}/clearfacestd-italic.woff2) format("woff2");font-display:swap}
  @font-face{font-family:"Clearface";font-weight:700;src:url(${fontBase}/clearfacestd-heavy.woff2) format("woff2");font-display:swap}
  @font-face{font-family:"Frutiger";font-weight:400;src:url(${fontBase}/frutigerltstd-regular.woff2) format("woff2");font-display:swap}
  @font-face{font-family:"Frutiger";font-weight:700;src:url(${fontBase}/frutigerltstd-bold.woff2) format("woff2");font-display:swap}
  :root { --night:#092A4D; --forest:#1B4633; --bright:#8FC895; --sand:#D1CCBD; --orange:#E7805D; --orange-dark:#D07556; --ink:#25282A; --nav:#404040; --cream:#F0ECE3; --cream-light:#FAF8F4; }
  html,body { margin:0; background:#fff; color:var(--ink); font-family:"Clearface", Georgia, serif; font-size:18px; line-height:1.55; -webkit-font-smoothing:antialiased; }
  .wrap { max-width: 1000px; margin: 0 auto; padding: 0 20px 60px; }
  header.site { background: var(--nav); color:#fff; padding: 18px 0; }
  header.site .wrap { display:flex; align-items:center; justify-content:space-between; gap:16px; padding-bottom:0; flex-wrap:wrap; }
  header.site a { color:#fff; text-decoration:none; }
  .brand { font-family: "Dharma Gothic E", "Arial Narrow", sans-serif; text-transform: uppercase; letter-spacing:.02em; font-weight:700; font-size:26px; line-height:1; }
  .brand small { display:block; font-family:"Clearface", Georgia, serif; text-transform:none; font-size:13px; letter-spacing:.02em; color:#fff; font-weight:400; margin-top:2px; }
  nav.site a { margin-left: 22px; font-family: "Frutiger", Arial, sans-serif; font-weight:700; font-size:15px; }
  nav.site a.cta { background: var(--orange); color: var(--ink); padding: 10px 18px; border-radius: 2px; }
  h1 { font-family: "Dharma Gothic E", "Arial Narrow", sans-serif; text-transform: uppercase; font-size: clamp(48px, 8vw, 88px); line-height:.92; margin: 44px 0 14px; color: var(--ink); font-weight:700; }
  .lede { font-size: 20px; max-width: 760px; margin: 0 0 34px; }
  .grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 18px; }
  .card { background:var(--cream-light); border:1px solid #E4DFD3; border-radius:4px; padding:22px; display:flex; flex-direction:column; gap:10px; }
  .card h3 { margin:0; font-family: "Dharma Gothic E", "Arial Narrow", sans-serif; text-transform: uppercase; font-size:26px; line-height:1; color: var(--ink); font-weight:700; }
  .card p { margin:0; font-size:16px; flex:1; }
  .card .links { display:flex; gap:8px; flex-wrap:wrap; margin-top:6px; }
  .btn { display:inline-block; font-family: "Frutiger", Arial, sans-serif; font-weight:700; font-size:14px; padding:10px 16px; border-radius:2px; border:1px solid var(--orange-dark); color: var(--ink); text-decoration:none; background:#fff; }
  .btn:hover { background: var(--orange-dark); }
  .btn.primary { background: var(--orange); border-color: var(--orange); color:var(--ink); }
  .btn.primary:hover { background: var(--orange-dark); border-color: var(--orange-dark); }
  pre { background:var(--ink); color:#F3F1EA; padding:14px 16px; border-radius:4px; overflow:auto; font-size:13.5px; line-height:1.5; }
  code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
  p code { background: var(--cream); padding: 1px 5px; border-radius: 2px; font-size: 15px; }
  .note { background:var(--cream-light); border-left:4px solid var(--orange); padding:14px 18px; border-radius:0 4px 4px 0; margin: 24px 0; }
  h2 { font-family: "Dharma Gothic E", "Arial Narrow", sans-serif; text-transform: uppercase; color: var(--ink); margin: 48px 0 12px; font-size:36px; line-height:1; font-weight:700; }
  h3.snippet { font-family:"Dharma Gothic E", "Arial Narrow", sans-serif; text-transform:uppercase; color:var(--ink); margin:28px 0 6px; font-size:24px; line-height:1; }
  footer { margin-top: 50px; font-family:"Frutiger", Arial, sans-serif; font-size: 13px; color:#4F5052; border-top:1px solid #E4DFD3; padding-top:18px; }
  footer a { color: inherit; }
  .embed-page { background:#fff; }
  ${extra}
</style>
</head>
<body>`;

const siteHeader = `<header class="site"><div class="wrap">
  <a href="${BASE}" class="brand">${SITE.title}<small>${SITE.tagline}</small></a>
  <nav class="site">${SITE.nav.map(n => `<a href="${n[1]}">${n[0]}</a>`).join('')}<a href="${SITE.repoUrl}">GitHub</a><a class="cta" href="${ORG.urls.donate}">Donate</a></nav>
</div></header>`;

const footer = `<footer><p>${ORG.name} · ${ORG.taxStatus} · EIN ${ORG.ein} · ${ORG.address} · <a href="mailto:${ORG.contactEmail}">${ORG.contactEmail}</a></p>
<p>${ORG.name} is not a tax, legal, or financial advisor. These tools provide general education and estimates only; please consult your own advisors. Federal figures reflect tax year ${manifest.taxYear}; reviewed annually. Open source under the MIT license.</p></footer>`;

/* ---------- index.html ---------- */
let index = head('Planned Giving Tools') + siteHeader + `<div class="wrap">
<h1>${SITE.heading}</h1>
<p class="lede">${SITE.lede}</p>
<div class="grid">
${tools.map(t => `<div class="card"><h3>${t.title}</h3><p>${BLURB[t.name] || ''}</p><div class="links"><a class="btn primary" href="support/tools/${t.name}/">Open tool</a><a class="btn" href="#embed-${t.name}">Embed code</a></div></div>`).join('\n')}
</div>

<h2>For Library staff</h2>
<p>Internal drafting aids that share the same figures and legal details. Not linked from donor-facing pages.</p>
<div class="grid">
${staffTools.map(t => `<div class="card"><h3>${t.title}</h3><p>${BLURB[t.name] || ''}</p><div class="links"><a class="btn primary" href="support/tools/${t.name}/">Open tool</a></div></div>`).join('\n')}
</div>

<h2>Every tool can be saved and shared</h2>
<p>Each tool ends with three buttons: <b>Download advisor summary (PDF)</b> — a one-page recap of what was entered, what the tool showed, the notes, and the questions to bring to an advisor, with the Library’s legal details; <b>Print</b>; and <b>Copy link to this scenario</b>, which puts the inputs in the URL so a donor can send their exact scenario to an advisor — or development can send a prospect a link that opens a calculator already filled in (for example <code>?qcd.age=75&amp;qcd.gift=20000</code>). Several tools also produce paperwork: a QCD request letter, a broker transfer letter, a draft IRS Form 8283, a pre-filled Schedule ND-1QEC, and a signable Heritage Society statement of intent. Everything is generated in the browser; nothing a donor types is sent anywhere.</p>

<h2>How to embed</h2>
<p>Each tool is a single JavaScript file that carries its own styles, the current tax figures, and the Foundation’s details. Paste one snippet where you want the tool to appear. Several tools can share a page.</p>
<pre><code>&lt;div data-trpl-tool="navigator"&gt;&lt;/div&gt;
&lt;script src="${BASE}dist/navigator.js" async&gt;&lt;/script&gt;</code></pre>
<p>Options go on the <code>div</code> as data attributes: <code>data-theme="dark"</code>, <code>data-accent="#1B4532"</code>, <code>data-hide-header="true"</code>, <code>data-intent-form-url="https://…"</code> (DonorPerfect intent form), <code>data-contact-email</code>, <code>data-contact-name</code>, <code>data-contact-phone</code>. Full reference in <a href="${SITE.repoUrl}/blob/main/docs/EMBED.md">docs/EMBED.md</a>.</p>
<div class="note"><b>Tax figures are reviewed every year.</b> All rates and limits live in one file (<code>src/tax-data.js</code>) stamped with the tax year and review date, and every tool prints that stamp in its footer. A scheduled reminder opens a review issue each November when the IRS publishes the next year’s figures. See <a href="${SITE.repoUrl}/blob/main/docs/TAX-REVIEW.md">docs/TAX-REVIEW.md</a>.</div>

<h2>Embed snippets</h2>
${tools.map(t => `<h3 class="snippet" id="embed-${t.name}">${t.title}</h3>
<pre><code>&lt;div data-trpl-tool="${t.name}"&gt;&lt;/div&gt;
&lt;script src="${BASE}dist/${t.name}.js" async&gt;&lt;/script&gt;</code></pre>
<p style="font-size:15px;color:#4F5052">Or as an iframe: <code>&lt;iframe src="${BASE}support/tools/${t.name}/embed" style="width:100%;height:900px;border:0"&gt;&lt;/iframe&gt;</code></p>`).join('\n')}

<h2>Try them together</h2>
<p>A live demo of the Navigator, the way it would sit at the top of the Support page:</p>
<div class="tool-page"><div data-trpl-tool="navigator" data-tool-base="support/tools/"></div></div>
<script src="dist/navigator.js" async></script>
${footer}
</div></body></html>`;
fs.writeFileSync(path.join(ROOT, 'index.html'), index);

/* ---------- support/tools/<name>/index.html ----------
 * Mirrors the URL structure planned for trlibrary.com (/support/tools/<name>),
 * so the same path works on either host. Cross-links inside the tools use a
 * relative tool base here; on trlibrary.com the config default applies. */
const TOOLS_DIR = path.join(ROOT, 'support', 'tools');
fs.mkdirSync(TOOLS_DIR, { recursive: true });
for (const t of tools.concat(staffTools)) {
  const dir = path.join(TOOLS_DIR, t.name);
  fs.mkdirSync(dir, { recursive: true });
  const page = head(t.title, '', '../../../fonts') + siteHeader + `<div class="wrap tool-page">
<p style="margin:26px 0 12px"><a href="../">← All giving tools</a></p>
<div data-trpl-tool="${t.name}" data-tool-base="../"></div>
<script src="../../../dist/${t.name}.js" async></script>
<p style="font-size:15px;color:#4F5052;margin-top:22px">Embed this tool on your own page: <code>&lt;div data-trpl-tool="${t.name}"&gt;&lt;/div&gt;&lt;script src="${BASE}dist/${t.name}.js" async&gt;&lt;/script&gt;</code></p>
${footer}
</div></body></html>`;
  fs.writeFileSync(path.join(dir, 'index.html'), page);
  // bare embed page (no site chrome) — ideal for iframes: /support/tools/<name>/embed
  fs.writeFileSync(path.join(dir, 'embed.html'), head(t.title, 'body{background:#fff} .wrap{padding:0}', '../../../fonts').replace('<body>', '<body class="embed-page">') + `<div class="wrap tool-page"><div data-trpl-tool="${t.name}" data-tool-base="../"></div><script src="../../../dist/${t.name}.js" async></script></div></body></html>`);
}
// /support/tools/ gallery = same as the home page, one directory deeper
fs.writeFileSync(path.join(TOOLS_DIR, 'index.html'), index.replace(/href="support\/tools\//g, 'href="').replace(/src="dist\//g, 'src="../../dist/').replace(/url\(fonts\//g, 'url(../../fonts/').replace('data-tool-base="support/tools/"', 'data-tool-base="./"'));
// /support/ → tools gallery
fs.mkdirSync(path.join(ROOT, 'support'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'support', 'index.html'), '<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=tools/"><title>Giving Tools</title><a href="tools/">Giving tools</a>');
console.log('Wrote index.html, support/tools/index.html and ' + tools.length * 2 + ' tool pages under support/tools/<name>/');
