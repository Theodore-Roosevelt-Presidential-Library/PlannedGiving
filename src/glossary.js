/* ============================================================================
 * TRPL Giving Tools — GLOSSARY & TOOLTIPS
 * Plain-language definitions with "where to find it" guidance. After a tool
 * renders (and whenever it re-renders), the first mention of each term in
 * labels, help text, intros, stat labels and callouts becomes an accessible
 * tooltip: dotted underline, opens on hover/focus/tap, closes on Escape or an
 * outside click. Add or edit entries here; no per-tool wiring needed.
 * ========================================================================== */
(function (GT) {
  if (GT.glossify) return;
  var h = GT.h;

  /* term: [aliases…], def, how (where to find it / what to do) */
  var TERMS = [
    { t: 'adjusted gross income', a: ['AGI'], d: 'Your total income minus a few “above-the-line” adjustments such as retirement-plan contributions and student-loan interest — before the standard or itemized deduction.', w: 'Line 11 of your most recent Form 1040. Many charitable limits (the ½% floor, the 30% and 60% caps) are percentages of this number.' },
    { t: 'modified adjusted gross income', a: ['MAGI'], d: 'Adjusted gross income with certain items added back. Different rules use slightly different versions.', w: 'Used for Medicare premium surcharges (IRMAA), the SALT cap phase-down, and the senior deduction phase-out. Your preparer can tell you which version applies.' },
    { t: 'taxable income', d: 'What is left after subtracting the standard or itemized deduction from adjusted gross income; the number your tax brackets are applied to.', w: 'Line 15 of Form 1040. Some states, including North Dakota, start their own calculation from this figure.' },
    { t: 'tax bracket', a: ['marginal rate', 'marginal tax bracket', 'federal tax bracket', 'federal income tax bracket'], d: 'The rate that applies to your last dollar of taxable income — 10%, 12%, 22%, 24%, 32%, 35% or 37%. A deduction saves you roughly this percentage of its amount.', w: 'Find your taxable income on Form 1040, line 15, and compare it with the bracket thresholds for your filing status. Your best guess is fine for these estimates.' },
    { t: 'itemize', a: ['itemized deductions', 'itemizing', 'itemizers'], d: 'Listing individual deductions (state and local taxes, mortgage interest, charitable gifts, large medical bills) on Schedule A instead of taking the flat standard deduction. Only worth doing when the list adds up to more than the standard deduction.', w: 'If your Form 1040 came with a Schedule A, you itemized. About nine in ten households take the standard deduction.' },
    { t: 'standard deduction', d: 'A flat amount everyone may subtract from income instead of itemizing. It is higher for people 65 or older.', w: 'The tools use the current year’s figures automatically.' },
    { t: 'non-itemizer deduction', a: ['non-itemizer charitable deduction'], d: 'Starting in 2026, people who take the standard deduction may also deduct a limited amount of cash gifts made directly to charities ($1,000 single, $2,000 joint). Gifts to donor-advised funds and gifts of stock do not count.', w: 'Keep your acknowledgment letters; you claim it on Form 1040 without itemizing.' },
    { t: 'qualified charitable distribution', a: ['QCD', 'QCDs'], d: 'A transfer of up to the annual limit sent directly from your IRA to a charity once you are 70½. It is excluded from your taxable income entirely — which usually beats taking the money out and deducting a gift.', w: 'Ask your IRA custodian for a “qualified charitable distribution”; the check must be payable to the charity. Employer plans such as 401(k)s cannot make QCDs, and QCDs cannot go to a donor-advised fund.' },
    { t: 'required minimum distribution', a: ['RMD', 'RMDs'], d: 'The minimum amount the IRS requires you to withdraw from a traditional IRA or 401(k) each year once you reach the required age (currently 73). It is taxed as ordinary income.', w: 'Your custodian calculates it each January from your December 31 balance. A QCD can satisfy some or all of it.' },
    { t: 'IRA custodian', a: ['custodian'], d: 'The financial institution that holds your IRA — Fidelity, Schwab, Vanguard, a bank, or a brokerage.', w: 'Its name is on your IRA statement. Custodians have their own QCD request forms; a letter works too.' },
    { t: 'cost basis', a: ['basis', 'adjusted basis'], d: 'What you paid for an investment, adjusted for reinvested dividends, splits, and similar events. The difference between basis and current value is your gain.', w: 'Your brokerage statement or the “cost basis” tab in your account shows it per lot; for inherited shares it is usually the value on the date of death.' },
    { t: 'fair market value', a: ['market value', 'FMV'], d: 'What an asset would sell for between a willing buyer and seller. For publicly traded stock given to charity, the IRS uses the average of the high and low prices on the date of the gift.', w: 'The charity’s acknowledgment will describe the shares and date but not state a value; your broker’s records or the day’s price history give the figure for Form 8283.' },
    { t: 'capital gains tax', a: ['capital gains', 'long-term capital gains', 'long-term capital gains rate'], d: 'Tax on the profit when you sell an investment. Assets held more than a year get the lower long-term rates (0%, 15% or 20%); a year or less is taxed as ordinary income. Giving appreciated shares to charity avoids this tax entirely.', w: 'Your long-term rate depends on taxable income; most givers are at 15%.' },
    { t: 'net investment income tax', a: ['NIIT', '3.8% net investment income tax'], d: 'An extra 3.8% tax on investment income (including capital gains) for higher-income taxpayers — above $200,000 of modified AGI for singles and $250,000 for joint filers.', w: 'If you paid it last year, Form 8960 was attached to your return.' },
    { t: 'donor-advised fund', a: ['DAF', 'DAFs', 'donor-advised funds'], d: 'A charitable account you open at a sponsor such as Fidelity Charitable, Schwab’s DAFgiving360, or a community foundation. You get the deduction when you put money in and recommend grants to charities over time.', w: 'Grants can be recommended online in minutes. Contributions of appreciated stock work especially well. DAF grants cannot pay for anything that benefits you, such as event tickets.' },
    { t: 'bunching', d: 'Combining two or three years of charitable giving into one tax year so that itemized deductions exceed the standard deduction that year — often by funding a donor-advised fund — then taking the standard deduction in the other years.', w: 'Compare the two approaches in the bunching tool; the savings come from the timing, not from giving more.' },
    { t: 'bequest', a: ['gift in your will', 'bequests'], d: 'A gift made through your will or living trust. It can be a dollar amount, a percentage, a specific asset, or whatever remains after other gifts. It costs nothing now and can be changed at any time.', w: 'Your attorney adds a sentence or two to your will or trust; the bequest tool drafts sample language with the charity’s legal name and tax ID.' },
    { t: 'residuary', a: ['residue', 'residuary gift', 'rest, residue, and remainder'], d: 'What remains of an estate after debts, expenses, and specific gifts are paid. A residuary gift gives the charity all or a percentage of that remainder.', w: 'Residuary gifts scale with your estate and are the most common form of charitable bequest.' },
    { t: 'codicil', d: 'A short, signed amendment to an existing will. It lets you add a charitable gift without rewriting the whole document.', w: 'Ask your attorney whether a codicil or a new will is better for your situation; a trust is changed with an amendment.' },
    { t: 'beneficiary designation', a: ['beneficiary designations', 'beneficiary form'], d: 'The form on file with your retirement plan, IRA, life insurance policy, or bank that names who receives the account when you die. It overrides your will for that asset.', w: 'Log in to the account or ask the institution for the form; you can name a charity for any percentage as primary or contingent beneficiary.' },
    { t: 'contingent beneficiary', a: ['contingent'], d: 'A backup: someone (or a charity) who receives the asset only if the primary beneficiary does not survive you.', w: 'A simple way to include a charity while family comes first.' },
    { t: 'step-up in basis', a: ['step-up', 'steps up'], d: 'When someone inherits an appreciated asset, its cost basis resets to the value on the date of death, wiping out the built-in capital gain. This is why appreciated stock is often better left to family, and retirement accounts to charity.', w: 'Retirement accounts do not get a step-up; heirs pay income tax on them.' },
    { t: 'marital deduction', d: 'Anything left to a U.S.-citizen spouse passes free of federal estate tax, without limit.', w: 'Estate tax, if any, is usually due when the second spouse dies.' },
    { t: 'portability', a: ['deceased spouse unused exemption', 'DSUE'], d: 'A surviving spouse may use whatever part of the estate-tax exemption the first spouse did not use — but only if the first spouse’s estate filed a return electing it.', w: 'Ask your attorney whether a Form 706 was filed to elect portability.' },
    { t: 'estate tax exemption', a: ['exemption', 'basic exclusion amount'], d: 'The amount each person can leave (or give during life) before federal estate tax applies — $15 million in 2026, indexed for inflation. Only estates above it owe tax, at 40%.', w: 'Charitable bequests are fully deductible from the taxable estate; a dozen states have much lower thresholds of their own.' },
    { t: 'annual exclusion', d: 'The amount you can give to any one person each year without filing a gift-tax return — $19,000 in 2026. Gifts to charity are unlimited and never count.', w: 'Larger gifts to individuals reduce your lifetime exemption and are reported on Form 709.' },
    { t: 'charitable gift annuity', a: ['gift annuity', 'CGA', 'CGAs'], d: 'A contract with a charity: you make a gift, and the charity pays you (or you and a spouse) a fixed amount for life. Part of the gift is deductible now, and part of each payment may be tax-free for a period.', w: 'Charities must be licensed in many states to issue them; rates are suggested by the American Council on Gift Annuities.' },
    { t: 'charitable remainder trust', a: ['remainder trust', 'charitable remainder unitrust', 'unitrust', 'CRUT', 'charitable remainder annuity trust', 'CRAT'], d: 'A trust you fund with cash or appreciated assets that pays you (or others) income for life or up to 20 years; what remains goes to charity. A unitrust pays a fixed percentage of the trust’s value each year; an annuity trust pays a fixed dollar amount.', w: 'Requires an attorney, a trustee, and annual tax filings; usually sensible above a few hundred thousand dollars.' },
    { t: '§7520 rate', a: ['7520 rate', 'IRS §7520 rate', 'section 7520 rate', 'IRS discount rate'], d: 'A monthly interest rate the IRS publishes for valuing life-income gifts and trusts. A higher rate means a larger charitable deduction for gift annuities and remainder trusts.', w: 'You may use the rate for the month of the gift or either of the two prior months — whichever helps.' },
    { t: 'life expectancy', d: 'The IRS’s actuarial estimate of how many more years a person of a given age will live, used to value lifetime payments. It is an average, not a prediction.', w: 'The tools use rounded IRS figures for illustration; real deduction calculations use the full tables.' },
    { t: 'qualified endowment fund', a: ['qualified endowment', 'endowment fund', 'endowment'], d: 'For North Dakota’s tax credit: a permanent, irrevocable fund held by an eligible nonprofit, invested to produce income, from which only earnings (not principal) may be spent.', w: 'The nonprofit must confirm in writing that the fund qualifies; attach that letter to Schedule ND-1QEC.' },
    { t: 'carryforward', a: ['carried forward', 'carryover'], d: 'When a credit or deduction is larger than you can use this year, the unused part may be applied in later years — three years for the North Dakota credit, five years for excess charitable deductions.', w: 'Your preparer tracks the balance on the relevant schedule each year.' },
    { t: 'SALT cap', a: ['SALT', 'state and local taxes'], d: 'The limit on deducting state and local income, sales, and property taxes on Schedule A — $40,400 in 2026, phasing down for incomes above about $505,000, and scheduled to fall back to $10,000 in 2030.', w: 'If your state and local taxes are below the cap, the IRS safe harbor may let you treat a state charitable credit’s disallowed amount as state tax paid.' },
    { t: 'Form 8283', d: 'The IRS form that reports noncash gifts (stock, property) when they total more than $500 in a year. Publicly traded securities go in Section A and need no appraisal; other property over $5,000 needs a qualified appraisal and Section B.', w: 'The stock tool drafts Section A; your preparer attaches it to your return.' },
    { t: 'Schedule A', d: 'The form for itemized deductions — state and local taxes, mortgage interest, charitable gifts, medical expenses.', w: 'If you itemized last year, it is attached to your Form 1040.' },
    { t: 'matching gift', a: ['employer match', 'matching gifts'], d: 'A program under which an employer gives to the same charity its employee gave to, usually dollar for dollar up to an annual cap. Many programs include retirees and spouses.', w: 'Search your employer in {{org}}’s matching-gift lookup or ask HR; you submit a short request after you give.' },
    { t: 'DTC transfer', a: ['DTC', 'DTC number', 'DTC instructions'], d: 'The electronic system brokers use to move securities between accounts. A charity’s “DTC instructions” are its broker’s DTC number and account details.', w: 'Give them to your broker with the number of shares; most listed-stock transfers settle in one to three business days.' },
    { t: 'quid pro quo', d: 'A payment to a charity that is partly a gift and partly a purchase — a gala ticket, an auction item, a membership with real benefits. Only the amount above the value of what you received is deductible.', w: 'For payments over $75 the charity must tell you the value of the benefits in its acknowledgment.' },
    { t: 'IRMAA', a: ['Medicare premium surcharge', 'Medicare Part B and D premiums'], d: 'An income-related surcharge on Medicare Part B and D premiums for people whose modified AGI two years earlier was above certain thresholds. Keeping income down — for example with a QCD instead of a taxable withdrawal — can lower it.', w: 'Social Security notifies you each year if it applies.' },
    { t: 'Form 1099-R', a: ['1099-R'], d: 'The form your IRA custodian sends reporting distributions for the year. It does not identify a QCD; you or your preparer mark the qualified amount on your return.', w: 'Keep the charity’s acknowledgment letter with it.' },
    { t: 'letter of intent', a: ['statement of intent'], d: 'A non-binding note telling a charity you have included it in your plans. It lets the charity thank you, understand your wishes, and plan — and can be changed at any time.', w: 'Use the online form, a pre-filled email, or the printable statement from these tools.' },
    { t: 'ACGA', a: ['American Council on Gift Annuities', 'ACGA suggested rate'], d: 'The nonprofit council that publishes suggested maximum payout rates for charitable gift annuities by age, which most charities adopt.', w: 'Rates are reviewed periodically; the current schedule is built into the illustrator.' },
    { t: 'Uniform Lifetime Table', d: 'The IRS table used to compute required minimum distributions: each year’s balance divided by the factor for your age.', w: 'Appears in IRS Publication 590-B.' },
    { t: 'appreciated', a: ['appreciated stock', 'appreciated securities', 'appreciated assets'], d: 'Worth more now than what you paid. Giving appreciated assets held more than a year lets you avoid the capital gains tax and, if you itemize, deduct the full current value.', w: 'Give the shares themselves; do not sell first.' }
  ];

  /* Build a lookup and an alternation regex (longest first so multi-word terms win). */
  var INDEX = {}, ALL = [];
  TERMS.forEach(function (e) { [e.t].concat(e.a || []).forEach(function (k) { INDEX[k.toLowerCase()] = e; ALL.push(k); }); });
  ALL.sort(function (a, b) { return b.length - a.length; });
  var RX = new RegExp('(^|[^A-Za-z0-9§])(' + ALL.map(function (k) { return k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|') + ')(?![A-Za-z0-9])', 'i');

  var SELECTORS = '.trpl-label, .trpl-help, .trpl-intro, .trpl-stat-label, .trpl-callout p, .trpl-callout, .trpl-rec p, .trpl-radio span, .trpl-list li';
  var openTip = null;
  function closeTip() { if (openTip) { openTip.tip.remove(); openTip.btn.setAttribute('aria-expanded', 'false'); openTip = null; } }
  document.addEventListener('click', function (e) { if (openTip && !openTip.btn.contains(e.target) && !openTip.tip.contains(e.target)) closeTip(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeTip(); });

  function showTip(btn, entry) {
    if (openTip && openTip.btn === btn) return;
    closeTip();
    var tip = h('div.tip', { role: 'tooltip', id: 'trpl-tip-' + Math.random().toString(36).slice(2, 8) }, [
      h('div.tip-term', entry.t),
      h('p', entry.d),
      entry.w ? h('p.tip-how', { html: '<b>Where to find it / what to do:</b> ' + entry.w }) : null
    ]);
    btn.setAttribute('aria-describedby', tip.id); btn.setAttribute('aria-expanded', 'true');
    var root = btn.closest('.trpl-gt'); root.appendChild(tip);
    var rb = root.getBoundingClientRect(), bb = btn.getBoundingClientRect();
    var width = Math.min(380, rb.width - 32); tip.style.width = width + 'px';
    var left = bb.left - rb.left; if (left + width > rb.width - 16) left = Math.max(16, rb.width - 16 - width);
    tip.style.left = left + 'px'; tip.style.top = (bb.bottom - rb.top + 8) + 'px';
    tip.addEventListener('mouseleave', function () { if (openTip && openTip.tip === tip && !openTip.pinned && !btn.matches(':hover, :focus')) closeTip(); });
    openTip = { btn: btn, tip: tip };
  }

  function wrapFirst(node, seen) {
    // Walk text nodes; wrap the first unseen term in each element. Skip inside existing terms, links, buttons, inputs.
    var walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, { acceptNode: function (n) { return n.parentNode.closest('.trpl-term, a, button, .trpl-tip, input, select, textarea, .trpl-h2, .trpl-question, .trpl-sharebar') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; } });
    var texts = []; while (walker.nextNode()) texts.push(walker.currentNode);
    texts.forEach(function (tn) {
      var guard = 0;
      while (guard++ < 6) {
        var m = RX.exec(tn.nodeValue); if (!m) return;
        var key = m[2].toLowerCase(), entry = INDEX[key];
        if (!entry || seen[entry.t]) { // skip this occurrence, keep scanning the rest of the node
          var skipAt = m.index + m[1].length + m[2].length;
          var rest = tn.splitText(skipAt); tn = rest; continue;
        }
        seen[entry.t] = true;
        var at = m.index + m[1].length;
        var mid = tn.splitText(at), after = mid.splitText(m[2].length);
        var btn = h('button.term', { type: 'button', 'aria-expanded': 'false', 'aria-label': m[2] + ' — definition' }, m[2]);
        btn.addEventListener('click', function (e) { e.stopPropagation(); if (openTip && openTip.btn === btn && openTip.pinned) closeTip(); else { showTip(btn, entry); openTip.pinned = true; } });
        btn.addEventListener('mouseenter', function () { if (window.matchMedia('(hover: hover)').matches) showTip(btn, entry); });
        btn.addEventListener('mouseleave', function () { setTimeout(function () { if (openTip && openTip.btn === btn && !openTip.pinned && !openTip.tip.matches(':hover') && document.activeElement !== btn) closeTip(); }, 250); });
        btn.addEventListener('focus', function () { showTip(btn, entry); });
        btn.addEventListener('blur', function () { setTimeout(function () { if (openTip && openTip.btn === btn && !openTip.pinned && !openTip.tip.matches(':hover')) closeTip(); }, 150); });
        mid.parentNode.replaceChild(btn, mid);
        tn = after;
      }
    });
  }

  function glossify(root) {
    if (!root || root.getAttribute('data-glossary') === 'off') return;
    var seen = {};
    // Terms already wrapped in this root count as seen, so re-renders don't add duplicates
    Array.prototype.forEach.call(root.querySelectorAll('.trpl-term'), function (b) { var e = INDEX[b.textContent.toLowerCase()]; if (e) seen[e.t] = true; });
    Array.prototype.forEach.call(root.querySelectorAll(SELECTORS), function (el) { wrapFirst(el, seen); });
  }
  function watch(root) {
    if (root.__trplGlossaryWatch) return;
    var pending = null;
    var mo = new MutationObserver(function (muts) {
      if (muts.every(function (m) { return Array.prototype.every.call(m.addedNodes, function (n) { return n.nodeType === 1 && (n.classList.contains('trpl-tip') || n.classList.contains('trpl-term')); }); })) return;
      clearTimeout(pending); pending = setTimeout(function () { glossify(root); }, 60);
    });
    mo.observe(root, { childList: true, subtree: true });
    root.__trplGlossaryWatch = mo;
  }
  GT.glossify = glossify; GT.glossaryWatch = watch; GT.glossary = TERMS;
})(window.TRPLGivingTools);
