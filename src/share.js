/* ============================================================================
 * TRPL Giving Tools — SHARE, PDF & PAPERWORK HELPERS
 * Shareable scenarios (state <-> URL), the on-demand pdf-lib loader, a small
 * flowing-document builder, AcroForm filling, the advisor one-pager, and the
 * Heritage Society statement of intent. Loaded after core.js; guarded.
 * ========================================================================== */
(function (GT) {
  if (GT.shareBar) return;
  var h = GT.h, ORG = GT.ORG, T = GT.T, button = GT.button, copyButton = GT.copyButton, field = GT.field, section = GT.section, numberInput = GT.numberInput, checkbox = GT.checkbox;

  /* ---- Shareable scenarios: ?tool.key=value ------------------------------ */
  function state(name, defaults) {
    var out = {}; Object.keys(defaults).forEach(function (k) { out[k] = Array.isArray(defaults[k]) ? defaults[k].slice() : defaults[k]; });
    try {
      var q = new URLSearchParams(location.search), pre = name + '.';
      q.forEach(function (v, k) {
        if (k.indexOf(pre) !== 0) return; var key = k.slice(pre.length); if (!(key in defaults)) return;
        var d = defaults[key];
        if (Array.isArray(d)) out[key] = v ? v.split(',') : [];
        else if (typeof d === 'boolean') out[key] = v === '1' || v === 'true';
        else if (typeof d === 'number') { var n = parseFloat(v); if (!isNaN(n)) out[key] = n; }
        else out[key] = v;
      });
    } catch (e) { }
    return out;
  }
  function applyState(ctl, s) {
    Object.keys(ctl).forEach(function (k) {
      var c = ctl[k]; if (!c || !c.set || s[k] == null) return;
      try { c.set(c.type === 'bool' ? !!s[k] : c.type === 'number' ? Number(s[k]) : String(s[k])); } catch (e) { }
    });
  }
  function shareUrl(name, s) {
    var q = new URLSearchParams();
    Object.keys(s).forEach(function (k) { var v = s[k]; if (v == null || v === '' || typeof v === 'function') return; q.set(name + '.' + k, Array.isArray(v) ? v.join(',') : typeof v === 'boolean' ? (v ? '1' : '0') : String(v)); });
    return location.origin + location.pathname + '?' + q.toString();
  }
  function shareButton(name, getState) { return copyButton(function () { return shareUrl(name, getState()); }, 'Copy link to this scenario'); }

  /* ---- PDF plumbing ------------------------------------------------------ */
  function loadPdfLib() {
    return new Promise(function (res, rej) {
      if (window.PDFLib) return res(window.PDFLib);
      var sc = document.createElement('script'); sc.src = GT.base + 'vendor/pdf-lib.min.js'; sc.async = true;
      sc.onload = function () { res(window.PDFLib); }; sc.onerror = function () { rej(new Error('PDF library failed to load')); };
      document.head.appendChild(sc);
    });
  }
  function downloadBytes(bytes, filename) {
    var blob = new Blob([bytes], { type: 'application/pdf' }), url = URL.createObjectURL(blob);
    var a = h('a', { href: url, download: filename }); document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
  }
  function stripHtml(x) { var d = document.createElement('div'); d.innerHTML = x; return (d.textContent || '').replace(/\s+/g, ' ').trim(); }
  /* The built-in PDF fonts speak WinAnsi only; map the symbols we use and drop the rest. */
  var GLYPH_MAP = { '\u2605': '*', '\u2713': '-', '\u2714': '-', '\u2248': '~', '\u2192': '->', '\u2190': '<-', '\u2264': '<=', '\u2265': '>=', '\u2212': '-', '\u2153': '1/3', '\u2154': '2/3', '\u00bd': '1/2', '\u00bc': '1/4', '\u00be': '3/4', '\u2009': ' ', '\u202f': ' ', '\u00a0': ' ' };
  var WINANSI_EXTRA = '\u2018\u2019\u201a\u201c\u201d\u201e\u2020\u2021\u2022\u2026\u2030\u2039\u203a\u20ac\u2122\u2013\u2014\u02dc\u02c6\u0152\u0153\u0160\u0161\u0178\u017d\u017e\u0192';
  function pdfSafe(text) {
    return GT.brandify(String(text)).split('').map(function (ch) {
      if (GLYPH_MAP[ch] != null) return GLYPH_MAP[ch];
      var c = ch.charCodeAt(0); return (c < 0x100 || WINANSI_EXTRA.indexOf(ch) >= 0) ? ch : '';
    }).join('');
  }
  function today() { return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }); }

  /* Simple flowing document. blocks: {h}, {p}, {small}, {kv:[[k,v]]}, {ul:[]}, {sig:[labels]}, {gap:n} */
  function makePDF(opts) {
    return loadPdfLib().then(function (P) {
      return P.PDFDocument.create().then(function (doc) {
        return Promise.all([doc.embedFont(P.StandardFonts.Helvetica), doc.embedFont(P.StandardFonts.HelveticaBold)]).then(function (fonts) {
          var F = fonts[0], B = fonts[1], W = 612, H = 792, M = 54, y, page, o = ORG(), t = T();
          var ink = P.rgb(0.145, 0.157, 0.165), orange = P.rgb(0.906, 0.502, 0.365), gray = P.rgb(0.31, 0.314, 0.32), line = P.rgb(0.85, 0.83, 0.78);
          function wrap(text, font, size, width) {
            var words = pdfSafe(text).split(/\s+/), lines = [], cur = '';
            words.forEach(function (w) { var tryLine = cur ? cur + ' ' + w : w; if (font.widthOfTextAtSize(tryLine, size) > width && cur) { lines.push(cur); cur = w; } else cur = tryLine; });
            if (cur) lines.push(cur); return lines;
          }
          function footer() {
            var fy = M - 14;
            page.drawLine({ start: { x: M, y: fy + 18 }, end: { x: W - M, y: fy + 18 }, thickness: 0.5, color: line });
            var ft = opts.footer || (o.name + ' · ' + o.taxStatus + ' · EIN ' + o.ein + ' · ' + o.address + ' · ' + o.contactEmail);
            wrap(ft, F, 7.5, W - 2 * M - 60).slice(0, 2).forEach(function (ln, i) { page.drawText(ln, { x: M, y: fy + 6 - i * 9, size: 7.5, font: F, color: gray }); });
            page.drawText('Page ' + doc.getPageCount(), { x: W - M - 40, y: fy + 6, size: 7.5, font: F, color: gray });
          }
          function header() {
            page.drawText(pdfSafe(o.name).toUpperCase(), { x: M, y: y, size: 9, font: B, color: orange }); y -= 16;
            wrap(opts.title, B, 18, W - 2 * M).forEach(function (ln) { page.drawText(ln, { x: M, y: y - 6, size: 18, font: B, color: ink }); y -= 22; });
            y -= 6;
            if (opts.subtitle) { page.drawText(pdfSafe(opts.subtitle), { x: M, y: y, size: 9.5, font: F, color: gray }); y -= 12; }
            page.drawLine({ start: { x: M, y: y - 4 }, end: { x: W - M, y: y - 4 }, thickness: 1.5, color: ink }); y -= 22;
          }
          function newPage() { page = doc.addPage([W, H]); y = H - M; if (doc.getPageCount() === 1) header(); else y -= 10; }
          function ensure(n) { if (y - n < M + 30) { footer(); newPage(); } }
          function para(text, size, font, color, x, width) {
            size = size || 10.5; font = font || F; x = x || M; width = width || (W - 2 * M);
            wrap(stripHtml(text), font, size, width).forEach(function (ln) { ensure(size + 4); page.drawText(ln, { x: x, y: y, size: size, font: font, color: color || ink }); y -= size * 1.42; });
          }
          newPage();
          (opts.blocks || []).forEach(function (b) {
            if (!b) return;
            if (b.h) { ensure(30); y -= 6; page.drawText(pdfSafe(String(b.h)).toUpperCase(), { x: M, y: y, size: 10, font: B, color: orange }); y -= 16; }
            else if (b.p) { para(b.p); y -= 6; }
            else if (b.small) { para(b.small, 8.5, F, gray); y -= 4; }
            else if (b.kv) {
              b.kv.forEach(function (row) {
                ensure(16); var k = stripHtml(row[0]), v = stripHtml(row[1] == null ? '' : row[1]);
                var kl = wrap(k, F, 10, 250), vl = wrap(v || '—', B, 10, W - 2 * M - 270);
                var start = y;
                kl.forEach(function (ln, i) { page.drawText(ln, { x: M, y: start - i * 13, size: 10, font: F, color: gray }); });
                vl.forEach(function (ln, i) { page.drawText(ln, { x: M + 270, y: start - i * 13, size: 10, font: B, color: ink }); });
                y = start - Math.max(kl.length, vl.length) * 13 - 3;
              }); y -= 6;
            }
            else if (b.ul) { b.ul.forEach(function (it) { ensure(16); page.drawText('•', { x: M + 4, y: y, size: 10.5, font: F, color: orange }); wrap(stripHtml(it), F, 10.5, W - 2 * M - 18).forEach(function (ln) { ensure(15); page.drawText(ln, { x: M + 18, y: y, size: 10.5, font: F, color: ink }); y -= 15; }); y -= 2; }); y -= 6; }
            else if (b.sig) { ensure(60); y -= 24; b.sig.forEach(function (lab, i) { var x = M + i * 260; page.drawLine({ start: { x: x, y: y }, end: { x: x + 230, y: y }, thickness: 0.8, color: ink }); page.drawText(pdfSafe(lab), { x: x, y: y - 12, size: 8.5, font: F, color: gray }); }); y -= 36; }
            else if (b.gap) { y -= b.gap; }
          });
          if (opts.disclaimer !== false) {
            ensure(80); y -= 8; page.drawLine({ start: { x: M, y: y }, end: { x: W - M, y: y }, thickness: 0.5, color: line }); y -= 14;
            para(o.name + ' is not a tax, legal, or financial advisor. This document contains general information and estimates prepared from figures you entered; it is not advice. Please review it with your own attorney, accountant, or financial advisor. Federal figures reflect tax year ' + t.taxYear + ' (reviewed ' + t.lastReviewed + '). Prepared ' + today() + ' with {{org}}’s giving tools at ' + o.urls.tools + '.', 8, F, gray);
          }
          footer();
          return doc.save();
        });
      });
    });
  }
  /* Fill a bundled AcroForm. fields: { 'Field name': 'text' | true }. opts.stamp draws a draft notice on page 1. */
  function fillForm(file, fields, opts) {
    opts = opts || {};
    return Promise.all([loadPdfLib(), fetch(GT.base + file).then(function (r) { if (!r.ok) throw new Error('form not found'); return r.arrayBuffer(); })]).then(function (rs) {
      var P = rs[0];
      return P.PDFDocument.load(rs[1]).then(function (doc) {
        var form = doc.getForm();
        Object.keys(fields).forEach(function (k) {
          var v = fields[k]; if (v == null || v === '') return;
          try { if (v === true) form.getCheckBox(k).check(); else { var f = form.getTextField(k); f.setText(pdfSafe(v)); if (opts.fontSize) f.setFontSize(opts.fontSize); } }
          catch (e) { if (window.console) console.warn('[TRPL Giving Tools] form field not found:', k); }
        });
        return doc.embedFont(P.StandardFonts.HelveticaBold).then(function (fnt) {
          if (opts.stamp) { var pg = doc.getPages()[0]; pg.drawText(pdfSafe(opts.stamp), { x: 36, y: pg.getHeight() - 22, size: 8, font: fnt, color: P.rgb(0.82, 0.46, 0.34) }); }
          return doc.save();
        });
      });
    });
  }
  /* Turn multi-line letter text into document blocks (one block per line, gaps for blank lines) */
  function letterBlocks(text) { return String(text).split('\n').map(function (ln) { return ln.trim() ? { p: ln } : { gap: 8 }; }); }
  function draftStamp() { return 'DRAFT — prepared with {{org}}’s giving tools on ' + new Date().toLocaleDateString('en-US') + '. Estimates only; review with your tax preparer before filing.'; }

  /* ---- Advisor one-pager, read from what the tool is showing ------------- */
  function visible(el) { return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length); }
  function summaryFromDOM(root) {
    var inputs = [], results = [], notes = [], questions = [];
    Array.prototype.forEach.call(root.querySelectorAll('.trpl-field'), function (f) {
      if (!visible(f) || f.closest('.trpl-sharebar')) return;
      var lab = f.querySelector('.trpl-label'); if (!lab) return;
      var val = '', sel = f.querySelector('select'), inp = f.querySelector('input:not([type=radio]):not([type=checkbox]), textarea');
      if (sel) val = sel.options[sel.selectedIndex] ? sel.options[sel.selectedIndex].text : '';
      else if (f.querySelector('input[type=radio], input[type=checkbox]')) val = Array.prototype.map.call(f.querySelectorAll('input:checked'), function (c) { var sp = c.parentNode.querySelector('span'); return sp ? stripHtml(sp.innerHTML) : ''; }).join('; ') || '—';
      else if (inp) { var pre = f.querySelector('.trpl-prefix'), suf = f.querySelector('.trpl-suffix'); val = inp.value ? (pre ? pre.textContent : '') + inp.value + (suf ? suf.textContent : '') : ''; }
      if (val !== '') inputs.push([lab.textContent, val]);
    });
    Array.prototype.forEach.call(root.querySelectorAll('.trpl-stat'), function (st) {
      if (!visible(st)) return; var sub = st.querySelector('.trpl-stat-sub');
      results.push([st.querySelector('.trpl-stat-label').textContent, st.querySelector('.trpl-stat-value').textContent + (sub ? ' — ' + stripHtml(sub.innerHTML) : '')]);
    });
    Array.prototype.forEach.call(root.querySelectorAll('.trpl-textout'), function (x) { if (visible(x) && x.textContent.trim()) notes.push(x.textContent.trim()); });
    function textOf(el) { var c = el.cloneNode(true); Array.prototype.forEach.call(c.querySelectorAll('.trpl-actions, .trpl-btn, .trpl-tag'), function (x) { x.parentNode.removeChild(x); }); return Array.prototype.map.call(c.querySelectorAll('h4, p, li'), function (x) { return stripHtml(x.innerHTML); }).filter(Boolean).join(' ') || stripHtml(c.innerHTML); }
    Array.prototype.forEach.call(root.querySelectorAll('.trpl-callout, .trpl-rec'), function (c) { if (visible(c)) notes.push(textOf(c)); });
    Array.prototype.forEach.call(root.querySelectorAll('.trpl-advisor li'), function (li) { questions.push(stripHtml(li.innerHTML)); });
    return { inputs: inputs, results: results, notes: notes, questions: questions };
  }
  function advisorPDF(root, title) {
    var o = ORG(), sm = summaryFromDOM(root), blocks = [];
    blocks.push({ p: 'A summary of the scenario explored with {{org}}’s “' + title + '” tool, prepared to share with a financial, tax, or legal advisor.' });
    if (sm.inputs.length) { blocks.push({ h: 'What was entered' }); blocks.push({ kv: sm.inputs }); }
    if (sm.results.length) { blocks.push({ h: 'What the tool showed' }); blocks.push({ kv: sm.results }); }
    if (sm.notes.length) { blocks.push({ h: 'Notes' }); blocks.push({ ul: sm.notes.slice(0, 8) }); }
    if (sm.questions.length) { blocks.push({ h: 'Questions to discuss with your advisor' }); blocks.push({ ul: sm.questions }); }
    blocks.push({ h: 'About {{org}}' }); blocks.push({ kv: [['Legal name', o.name], ['Tax ID (EIN)', o.ein], ['Address', o.address], ['Gift planning contact', (o.contactName ? o.contactName + ', ' : '') + o.contactEmail]] });
    return makePDF({ title: title, subtitle: 'Advisor summary · prepared ' + today(), blocks: blocks });
  }
  function shareBar(name, root, title, getState) {
    var status = h('p.help');
    var pdfBtn = button('Download advisor summary (PDF)', function () {
      pdfBtn.disabled = true; status.textContent = 'Preparing your summary…';
      advisorPDF(root, title).then(function (bytes) { downloadBytes(bytes, (title.replace(/[^a-z0-9]+/gi, '-') + '-summary.pdf').toLowerCase()); status.textContent = 'Downloaded. Print it or attach it to an email to your advisor.'; })
        .catch(function (e) { status.textContent = 'Sorry — the PDF could not be prepared (' + e.message + '). Use Print instead.'; })
        .then(function () { pdfBtn.disabled = false; });
    }, 'highlight');
    return h('div.sharebar', [
      h('div.eyebrow', 'Save or share this'),
      h('div.actions', [pdfBtn, button('Print', function () { window.print(); }, 'secondary'), getState ? shareButton(name, getState) : null]),
      status
    ]);
  }

  /* ---- Heritage Society statement of intent ------------------------------ */
  function intentStatement(opts) {
    var o = ORG(); opts = opts || {};
    var blocks = [
      { p: 'I/we are pleased to share that the ' + o.name + ' has been included in my/our estate plans through ' + (opts.kind || 'a gift in my/our will or trust') + '. This statement is provided so {{org}} can plan for the future and recognize my/our commitment through the ' + o.legacySociety + '. It is an expression of intent, not a legal obligation, and may be changed at any time.' },
      { h: 'Donor' }, { kv: [['Name(s)', opts.name], ['Address', opts.address], ['Email / phone', opts.contact]] },
      { h: 'Gift' }, { kv: [['Type of gift', opts.kind], ['Description (optional)', opts.description], ['Estimated value (optional)', opts.value || 'Prefer not to say'], ['Purpose', opts.purpose || 'General charitable purposes'], ['Recognition', opts.anonymous ? 'Please keep my/our gift anonymous' : 'You may list my/our name(s) in ' + o.legacySociety + ' recognition']] },
      { h: 'Documents' }, { p: 'Where possible, a copy of the relevant page of the will, trust, or beneficiary designation is attached or will be provided. {{Org}} keeps this information confidential.' },
      { sig: ['Donor signature', 'Date'] }, { sig: ['Second donor signature (if joint)', 'Date'] },
      { small: 'Return to: ' + o.name + ', ' + o.address + ' · ' + o.contactEmail + (o.urls.intentForm ? ' · or complete the online form at ' + o.urls.intentForm : '') }
    ];
    return makePDF({ title: o.legacySociety + ' statement of intent', subtitle: 'Confidential · ' + o.name, blocks: blocks, disclaimer: false });
  }
  function intentStatementSection(getKind, getDescription) {
    var o = ORG(), st = h('p.help');
    function txt(ph) { var i = numberInput({ value: '', placeholder: ph }); i.input.type = 'text'; return i; }
    var name = txt('Name(s)'), addr = txt('Street, city, state, ZIP'), contact = txt('Email or phone'), value = txt('Optional'), anon = checkbox('Keep my gift anonymous in any recognition');
    var btn = button('Download statement of intent (PDF)', function () {
      btn.disabled = true; st.textContent = 'Preparing…';
      intentStatement({ name: name.input.value, address: addr.input.value, contact: contact.input.value, value: value.input.value, anonymous: anon.get(), kind: getKind ? getKind() : '', description: getDescription ? getDescription() : '' })
        .then(function (b) { downloadBytes(b, 'heritage-society-statement-of-intent.pdf'); st.innerHTML = 'Downloaded. Sign it and return it to <a href="mailto:' + o.contactEmail + '">' + o.contactEmail + '</a>' + (o.urls.intentForm ? ', or use the <a href="' + o.urls.intentForm + '" target="_blank" rel="noopener">online form</a>' : '') + '.'; })
        .catch(function (e) { st.textContent = 'Could not build the PDF (' + e.message + ').'; }).then(function () { btn.disabled = false; });
    }, 'primary');
    return section('Printable statement of intent', [
      h('p.help', 'Prefer paper? Download a signable ' + o.legacySociety + ' statement to keep with your estate documents and mail or email to {{org}}.'),
      h('div.grid', [field('Name(s)', name), field('Mailing address', addr), field('Email or phone', contact), field('Estimated value', value, 'Entirely optional — it helps {{org}} plan.')]),
      h('div', [anon.el]), h('div.actions', [btn]), st
    ]);
  }

  Object.assign(GT, { pdfSafe: pdfSafe, letterBlocks: letterBlocks, state: state, applyState: applyState, shareUrl: shareUrl, shareButton: shareButton, loadPdfLib: loadPdfLib, downloadBytes: downloadBytes, stripHtml: stripHtml, makePDF: makePDF, fillForm: fillForm, draftStamp: draftStamp, summaryFromDOM: summaryFromDOM, advisorPDF: advisorPDF, shareBar: shareBar, intentStatement: intentStatement, intentStatementSection: intentStatementSection });
})(window.TRPLGivingTools);
