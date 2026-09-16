/* ============================================================================
 * TRPL Giving Tools — CORE RUNTIME
 * Shared by every embed. Guarded so that several tools on one page share one
 * copy. No dependencies, no build-time framework, ES2017.
 * ========================================================================== */
(function () {
  if (window.TRPLGivingTools && window.TRPLGivingTools.version === '__VERSION__') return;

  var GT = window.TRPLGivingTools = window.TRPLGivingTools || {};
  GT.version = '__VERSION__';
  GT.registry = GT.registry || {};
  GT.mounted = GT.mounted || [];

  /* ---------------------------------------------------------------------- */
  /* Styles — injected once. Everything is scoped under .trpl-gt so the host */
  /* page's CSS and ours stay out of each other's way.                       */
  /* ---------------------------------------------------------------------- */
  var CSS = "__CSS__";
  /* Where this bundle was loaded from, so fonts resolve on the tools site,
   * on trlibrary.com, and in local development alike. */
  var SCRIPT_BASE = (function () {
    var src = document.currentScript && document.currentScript.src;
    return src ? src.replace(/dist\/[^\/]*$/, '') : ((window.TRPL_ORG && window.TRPL_ORG.urls.tools) || '/');
  })();
  GT.base = GT.base || SCRIPT_BASE;
  var FONTS = (window.TRPL_ORG && window.TRPL_ORG.fonts) || [];
  function injectCSS(loadFonts) {
    if (loadFonts !== false && FONTS.length && !document.getElementById('trpl-gt-fonts')) {
      var f = document.createElement('style');
      f.id = 'trpl-gt-fonts';
      f.textContent = FONTS.map(function (x) { return '@font-face{font-family:"' + x[0] + '";font-weight:' + x[1] + ';font-style:' + x[2] + ';font-display:swap;src:url("' + GT.base + 'fonts/' + x[3] + '.woff2") format("woff2")}'; }).join('') + ((window.TRPL_ORG && window.TRPL_ORG.fontFallbackCss) || '');
      document.head.appendChild(f);
    }
    if (document.getElementById('trpl-gt-css')) return;
    var s = document.createElement('style');
    s.id = 'trpl-gt-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ---------------------------------------------------------------------- */
  /* Tiny DOM helper: h('div.cls', {attr}, [children])                       */
  /* ---------------------------------------------------------------------- */
  function h(tag, attrs, children) {
    if (Array.isArray(attrs) || typeof attrs === 'string' || attrs instanceof Node) { children = attrs; attrs = null; }
    var parts = tag.split('.'), el = document.createElement(parts[0] || 'div');
    if (parts.length > 1) el.className = parts.slice(1).map(function (c) { return 'trpl-' + c; }).join(' ');
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (k === 'html') el.innerHTML = v;
      else if (k === 'text') el.textContent = v;
      else if (k === 'on') Object.keys(v).forEach(function (ev) { el.addEventListener(ev, v[ev]); });
      else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else if (v === false || v == null) { /* skip */ }
      else if (v === true) el.setAttribute(k, '');
      else el.setAttribute(k, v);
    });
    append(el, children);
    return el;
  }
  function append(el, children) {
    if (children == null) return el;
    if (!Array.isArray(children)) children = [children];
    children.forEach(function (c) {
      if (c == null || c === false) return;
      if (Array.isArray(c)) return append(el, c);
      el.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
    });
    return el;
  }
  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); return el; }

  /* ---------------------------------------------------------------------- */
  /* Numbers                                                                 */
  /* ---------------------------------------------------------------------- */
  function num(v, fallback) { var n = parseFloat(String(v == null ? '' : v).replace(/[^0-9.\-]/g, '')); return isNaN(n) ? (fallback || 0) : n; }
  function money(n, opts) {
    opts = opts || {};
    var neg = n < 0; n = Math.abs(n);
    var s = (opts.cents ? n.toFixed(2) : Math.round(n).toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (neg ? '−$' : '$') + s;
  }
  function pct(r, d) { return (r * 100).toFixed(d == null ? 1 : d).replace(/\.0+$/, '') + '%'; }
  function clamp(n, lo, hi) { return Math.min(hi, Math.max(lo, n)); }
  function interp(table, x) {
    var keys = Object.keys(table).map(Number).sort(function (a, b) { return a - b; });
    if (x <= keys[0]) return table[keys[0]];
    if (x >= keys[keys.length - 1]) return table[keys[keys.length - 1]];
    for (var i = 0; i < keys.length - 1; i++) {
      if (x >= keys[i] && x <= keys[i + 1]) {
        var t = (x - keys[i]) / (keys[i + 1] - keys[i]);
        return table[keys[i]] + t * (table[keys[i + 1]] - table[keys[i]]);
      }
    }
    return table[keys[0]];
  }

  /* ---------------------------------------------------------------------- */
  /* Tax helpers (all figures come from window.TRPL_TAX)                     */
  /* ---------------------------------------------------------------------- */
  var T = function () { return window.TRPL_TAX; };
  var ORG = function () { return window.TRPL_ORG; };

  function marginalRate(taxable, status) {
    var b = T().brackets[status] || T().brackets.single;
    for (var i = 0; i < b.length; i++) if (taxable <= b[i][0]) return b[i][1];
    return b[b.length - 1][1];
  }
  function ltcgRate(taxable, status) {
    var t = T().ltcg[status] || T().ltcg.single;
    return taxable <= t[0] ? 0 : taxable <= t[1] ? 0.15 : 0.20;
  }
  /* Value of $1 of itemized deduction at a marginal rate, honoring the
   * OBBBA 35% cap for 37%-bracket filers. */
  function deductionRate(marginal) { return Math.min(marginal, T().charitable.topBracketCap); }
  function stdDeduction(status, count65) {
    return (T().standardDeduction[status] || 0) + (count65 || 0) * (T().additional65[status] || 0);
  }
  function seniorBonus(status, count65, magi) {
    var s = T().seniorBonus, yr = T().taxYear;
    if (!count65 || yr < s.firstYear || yr > s.lastYear) return 0;
    var full = s.amount * count65, over = Math.max(0, (magi || 0) - s.phaseStart[status]);
    return Math.max(0, full - s.phaseRate * over);
  }
  function saltAllowed(paid, status, magi) {
    var s = T().salt, cap = s.cap[status], over = Math.max(0, (magi || 0) - s.phaseStart[status]);
    cap = Math.max(s.floor[status], cap - s.phaseRate * over);
    return Math.min(paid || 0, cap);
  }
  /* Deductible charitable amount for an itemizer after the 0.5%-of-AGI floor */
  function charitableAfterFloor(gifts, agi) { return Math.max(0, gifts - T().charitable.itemizerFloorPct * (agi || 0)); }
  function nonItemizerDeduction(cashGifts, status) { return Math.min(cashGifts || 0, T().charitable.nonItemizer[status] || 0); }
  function lifeExpectancy(age) { return interp(T().lifeExpectancy, age); }
  function pvAnnuity(payment, rate, years) { if (rate === 0) return payment * years; return payment * (1 - Math.pow(1 + rate, -years)) / rate; }

  /* ---------------------------------------------------------------------- */
  /* Form controls. Each returns {el, get(), set()} and calls onChange.      */
  /* ---------------------------------------------------------------------- */
  var uid = 0;
  function field(label, control, help) {
    var id = 'trpl-f' + (++uid);
    control.input.id = id;
    return h('div.field', [h('label.label', { 'for': id }, label), control.el, help ? h('div.help', { html: help }) : null]);
  }
  function moneyInput(opts) {
    opts = opts || {};
    var inp = h('input.input', { type: 'text', inputmode: 'decimal', value: opts.value != null ? money(opts.value).slice(1) : '', placeholder: opts.placeholder || '0', 'aria-label': opts.aria || '' });
    var wrap = h('div.money', [h('span.prefix', '$'), inp]);
    function get() { return num(inp.value); }
    inp.addEventListener('input', function () { opts.onChange && opts.onChange(get()); });
    inp.addEventListener('blur', function () { if (inp.value !== '') inp.value = money(get()).slice(1); });
    return { el: wrap, input: inp, type: 'number', get: get, set: function (v) { inp.value = money(v).slice(1); } };
  }
  function numberInput(opts) {
    opts = opts || {};
    var inp = h('input.input', { type: 'number', min: opts.min, max: opts.max, step: opts.step || 1, value: opts.value, placeholder: opts.placeholder || '' });
    var wrap = opts.suffix ? h('div.money', [inp, h('span.suffix', opts.suffix)]) : inp;
    function get() { var v = num(inp.value, opts.value || 0); return opts.min != null ? clamp(v, opts.min, opts.max == null ? Infinity : opts.max) : v; }
    inp.addEventListener('input', function () { opts.onChange && opts.onChange(get()); });
    return { el: wrap, input: inp, type: inp.type === 'text' ? 'text' : 'number', get: get, set: function (v) { inp.value = v; } };
  }
  function percentInput(opts) {
    opts = opts || {};
    var inp = h('input.input', { type: 'number', min: opts.min == null ? 0 : opts.min, max: opts.max == null ? 100 : opts.max, step: opts.step || 0.1, value: opts.value != null ? +(opts.value * 100).toFixed(2) : '' });
    var wrap = h('div.money', [inp, h('span.suffix', '%')]);
    function get() { return num(inp.value) / 100; }
    inp.addEventListener('input', function () { opts.onChange && opts.onChange(get()); });
    return { el: wrap, input: inp, type: 'number', get: get, set: function (v) { inp.value = +(v * 100).toFixed(2); } };
  }
  function select(opts) {
    var sel = h('select.input', opts.options.map(function (o) { return h('option', { value: o[0], selected: o[0] === opts.value }, o[1]); }));
    sel.addEventListener('change', function () { opts.onChange && opts.onChange(sel.value); });
    return { el: sel, input: sel, type: 'string', get: function () { return sel.value; }, set: function (v) { sel.value = v; } };
  }
  function radios(opts) {
    var name = 'trpl-r' + (++uid), value = opts.value;
    var wrap = h('div.radios' + (opts.stacked ? '.stacked' : ''), { role: 'radiogroup', 'aria-label': opts.aria || '' });
    var inputs = opts.options.map(function (o) {
      var r = h('input', { type: 'radio', name: name, value: o[0], checked: o[0] === value });
      r.addEventListener('change', function () { value = o[0]; opts.onChange && opts.onChange(value); });
      wrap.appendChild(h('label.radio', [r, h('span', { html: o[1] })]));
      return r;
    });
    return { el: wrap, input: inputs[0] || wrap, type: 'string', get: function () { return value; }, set: function (v) { value = v; inputs.forEach(function (r) { r.checked = r.value === v; }); } };
  }
  function checks(opts) {
    var value = opts.value || [];
    var wrap = h('div.radios.stacked');
    opts.options.forEach(function (o) {
      var c = h('input', { type: 'checkbox', value: o[0], checked: value.indexOf(o[0]) >= 0 });
      c.addEventListener('change', function () {
        value = value.filter(function (v) { return v !== o[0]; });
        if (c.checked) value.push(o[0]);
        opts.onChange && opts.onChange(value);
      });
      wrap.appendChild(h('label.radio', [c, h('span', { html: o[1] })]));
    });
    return { el: wrap, input: wrap, get: function () { return value; } };
  }
  function checkbox(labelText, opts) {
    opts = opts || {};
    var c = h('input', { type: 'checkbox', checked: !!opts.value });
    c.addEventListener('change', function () { opts.onChange && opts.onChange(c.checked); });
    var el = h('label.radio.single', [c, h('span', { html: labelText })]);
    return { el: el, input: c, type: 'bool', get: function () { return c.checked; }, set: function (v) { c.checked = !!v; } };
  }
  var FILING = [['single', 'Single'], ['mfj', 'Married filing jointly'], ['hoh', 'Head of household'], ['mfs', 'Married filing separately']];
  var BRACKETS = function () { return T().marginalRates.map(function (r) { return [String(r), pct(r, 0) + ' bracket']; }); };

  /* ---------------------------------------------------------------------- */
  /* Result / layout components                                              */
  /* ---------------------------------------------------------------------- */
  function stat(label, value, sub, tone) {
    return h('div.stat' + (tone ? '.' + tone : ''), [h('div.stat-label', label), h('div.stat-value', value), sub ? h('div.stat-sub', { html: sub }) : null]);
  }
  function bars(rows, opts) {
    // rows: [{label, value, tone}] — horizontal comparison bars
    opts = opts || {};
    var max = Math.max.apply(null, rows.map(function (r) { return Math.abs(r.value); }).concat([1]));
    return h('div.bars', rows.map(function (r) {
      var w = Math.max(2, Math.abs(r.value) / max * 100);
      return h('div.bar-row', [
        h('div.bar-label', r.label),
        h('div.bar-track', [h('div.bar-fill' + (r.tone ? '.' + r.tone : ''), { style: { width: w + '%' } })]),
        h('div.bar-value', opts.format ? opts.format(r.value) : money(r.value))
      ]);
    }));
  }
  function callout(kind, html) { return h('div.callout.' + kind, { html: html }); }
  function section(title, children) { return h('div.section', [title ? h('h3.h3', title) : null, children]); }
  function li(html) { return h('li', { html: html }); }
  function list(items, cls) { return h('ul.list' + (cls ? '.' + cls : ''), items.filter(Boolean).map(function (i) { return h('li', { html: i }); })); }
  function button(label, onClick, kind) { return h('button.btn' + (kind ? '.' + kind : ''), { type: 'button', on: { click: onClick } }, label); }
  function linkBtn(label, href, kind) { return h('a.btn' + (kind ? '.' + kind : ''), { href: href, target: '_blank', rel: 'noopener' }, label); }
  function copyButton(getText, label) {
    var b = button(label || 'Copy text', function () {
      var t = getText();
      var done = function () { b.textContent = 'Copied ✓'; setTimeout(function () { b.textContent = label || 'Copy text'; }, 1800); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, function () { fallback(t); done(); });
      else { fallback(t); done(); }
    }, 'secondary');
    function fallback(t) { var ta = h('textarea', { style: { position: 'fixed', opacity: 0 } }); ta.value = t; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) { } document.body.removeChild(ta); }
    return b;
  }
  function advisorQuestions(items) {
    return h('details.advisor', [h('summary', 'Questions to bring to your advisor'), list(items)]);
  }
  function disclaimer(extra) {
    var o = ORG(), t = T();
    return h('div.disclaimer', [
      h('p', { html: '<strong>' + o.name + ' is not a tax, legal, or financial advisor.</strong> This tool offers general education and rough estimates to help you ask better questions. It is not advice. Results depend on details this tool cannot know. Please consult your own attorney, accountant, or financial advisor before making a gift.' }),
      extra ? h('p', { html: extra }) : null,
      h('p.fine', { html: 'Federal figures reflect tax year <strong>' + t.taxYear + '</strong> (last reviewed ' + t.lastReviewed + '). ' + t.lawNote + ' State and local taxes vary and are only partly reflected. ' + o.name + ' · ' + o.taxStatus + ' · EIN ' + o.ein + ' · <a href="' + o.urls.tools + '" target="_blank" rel="noopener">About these tools</a>' })
    ]);
  }
  function toolUrl(name) { var b = ORG().urls.toolBase || ORG().urls.tools; return b.replace(/\/?$/, '/') + name; }
  function contactLine() {
    var o = ORG();
    var who = o.contactName ? o.contactName + ' · ' : '';
    return h('p.contact', { html: 'Questions? ' + who + '<a href="mailto:' + o.contactEmail + '">' + o.contactEmail + '</a>' + (o.contactPhone ? ' · ' + o.contactPhone : '') });
  }
  function intentCTA(text) {
    var o = ORG();
    var href = o.urls.intentForm || ('mailto:' + o.contactEmail + '?subject=' + encodeURIComponent('I have included the Library in my plans') + '&body=' + encodeURIComponent('Hello,\n\nI would like to let you know that I have included the ' + o.name + ' in my estate plans.\n\nName:\nPhone:\nBest way to reach me:\n\nThank you.'));
    return h('div.cta', [h('p', text || 'If you have already included the Library in your plans, please let us know so we can thank you and welcome you to the ' + o.legacySociety + '.'), linkBtn('Tell us about your gift', href, 'primary')]);
  }

  /* ---------------------------------------------------------------------- */
  /* Mounting                                                                */
  /* ---------------------------------------------------------------------- */
  function readOptions(el) {
    var o = {};
    Array.prototype.forEach.call(el.attributes, function (a) {
      if (a.name.indexOf('data-') === 0) o[a.name.slice(5).replace(/-([a-z])/g, function (_, c) { return c.toUpperCase(); })] = a.value;
    });
    return o;
  }
  function applyOverrides(opts) {
    var o = ORG();
    if (opts.intentFormUrl) o.urls.intentForm = opts.intentFormUrl;
    if (opts.toolBase) o.urls.toolBase = opts.toolBase;
    if (opts.contactEmail) o.contactEmail = opts.contactEmail;
    if (opts.contactName) o.contactName = opts.contactName;
    if (opts.contactPhone) o.contactPhone = opts.contactPhone;
    if (opts.offersGiftAnnuities) o.offersGiftAnnuities = opts.offersGiftAnnuities === 'true';
    if (opts.ndFundName) o.ndEndowment.fundName = opts.ndFundName;
    if (opts.ndConfirmed) o.ndEndowment.confirmed = opts.ndConfirmed === 'true';
    if (opts.ndGiveUrl) o.ndEndowment.giveUrl = opts.ndGiveUrl;
  }
  function mount(name, el) {
    var def = GT.registry[name];
    if (!def || el.getAttribute('data-trpl-mounted')) return;
    el.setAttribute('data-trpl-mounted', '1');
    var opts = readOptions(el);
    injectCSS(opts.loadFonts !== 'false');
    applyOverrides(opts);
    var root = h('div.gt', { 'data-tool': name, 'data-theme': opts.theme || 'light' });
    if (opts.accent) root.style.setProperty('--trpl-accent', opts.accent);
    if (opts.compact === 'true') root.classList.add('trpl-compact');
    clear(el).appendChild(root);
    var head = h('div.head', [h('div.eyebrow', ORG().shortName === 'the Library' ? 'Giving Tools' : ORG().shortName), h('h2.h2', def.title), def.intro ? h('p.intro', { html: def.intro }) : null]);
    if (opts.hideHeader === 'true') head.style.display = 'none';
    root.appendChild(head);
    var body = h('div.body');
    root.appendChild(body);
    try {
      def.render(body, GT, opts);
      if (def.share !== false && GT.shareBar) body.appendChild(GT.shareBar(name, root, def.title, def.getState));
    }
    catch (e) { body.appendChild(callout('warn', 'This tool could not load. Please refresh the page or contact ' + ORG().contactEmail + '.')); if (window.console) console.error('[TRPL Giving Tools]', name, e); }
    if (def.disclaimer !== false) root.appendChild(disclaimer(def.disclaimerExtra));
    GT.mounted.push({ name: name, el: el });
  }
  function mountAll(name) {
    var sel = name ? '[data-trpl-tool="' + name + '"]' : '[data-trpl-tool]';
    var els = document.querySelectorAll(sel);
    if (!els.length && name && document.currentScript) {
      var ph = h('div', { 'data-trpl-tool': name });
      document.currentScript.parentNode.insertBefore(ph, document.currentScript.nextSibling);
      els = [ph];
    }
    Array.prototype.forEach.call(els, function (el) { mount(el.getAttribute('data-trpl-tool'), el); });
  }
  GT.register = function (name, def) {
    GT.registry[name] = def;
    var run = function () { mountAll(name); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  };
  GT.mount = mount; GT.mountAll = mountAll;

  /* Public helper surface used by the tools */
  Object.assign(GT, {
    h: h, append: append, clear: clear, num: num, money: money, pct: pct, clamp: clamp, interp: interp,
    T: T, ORG: ORG, marginalRate: marginalRate, ltcgRate: ltcgRate, deductionRate: deductionRate, stdDeduction: stdDeduction,
    seniorBonus: seniorBonus, saltAllowed: saltAllowed, charitableAfterFloor: charitableAfterFloor, nonItemizerDeduction: nonItemizerDeduction,
    lifeExpectancy: lifeExpectancy, pvAnnuity: pvAnnuity,
    field: field, moneyInput: moneyInput, numberInput: numberInput, percentInput: percentInput, select: select, radios: radios, checks: checks, checkbox: checkbox,
    FILING: FILING, BRACKETS: BRACKETS,
    stat: stat, bars: bars, callout: callout, section: section, list: list, li: li, button: button, linkBtn: linkBtn, copyButton: copyButton,
    advisorQuestions: advisorQuestions, disclaimer: disclaimer, toolUrl: toolUrl, contactLine: contactLine, intentCTA: intentCTA
  });
})();
