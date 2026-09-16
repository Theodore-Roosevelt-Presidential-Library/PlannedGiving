/* @tool Life-Income Gift Illustrator
 * Educational ballpark figures for a charitable gift annuity, a charitable
 * remainder unitrust, and a charitable remainder annuity trust. Uses ACGA
 * suggested rates, the current §7520 rate, and simplified life-expectancy
 * math — clearly labeled as estimates. */
(function (GT) {
  var h = GT.h, T = GT.T, ORG = GT.ORG, money = GT.money, pct = GT.pct;

  GT.register('lifeincome', {
    title: 'Gifts that pay you income',
    intro: 'Some gifts give something back: fixed or variable payments for life or a term of years, a partial income-tax deduction now, and a gift to the Library later. These illustrations show the shape of each option so you can have an informed conversation with your advisor.',
    disclaimerExtra: 'Illustrations only. Actual deductions are calculated with IRS actuarial tables (Table 2010CM) and the §7520 rate for the month of the gift; the simplified life-expectancy math here can differ by several percentage points. Charitable gift annuities are regulated by state insurance departments and are issued only by charities licensed to do so.',
    render: function (root) {
      var t = T(), o = ORG();
      var s = GT.state('lifeincome', { kind: 'cga', age: 75, gift: 100000, r7520: t.sec7520.rate, payout: 0.05, termType: 'life', years: 20, rate: '0.24', asset: 'cash', basis: 40000 });
      var out = h('div.section');
      var ctl = {
        kind: GT.radios({ stacked: true, options: [
          ['cga', '<b>Charitable gift annuity</b> — a simple contract: fixed payments for life, backed by the charity'],
          ['crut', '<b>Charitable remainder unitrust</b> — a trust paying a fixed <i>percentage</i> of its value each year (payments rise and fall with the trust)'],
          ['crat', '<b>Charitable remainder annuity trust</b> — a trust paying a fixed <i>dollar amount</i> each year']], value: 'cga', onChange: function (v) { s.kind = v; toggle(); calc(); } }),
        age: GT.numberInput({ min: 18, max: 105, value: s.age, onChange: function (v) { s.age = v; calc(); } }),
        gift: GT.moneyInput({ value: s.gift, onChange: function (v) { s.gift = v; calc(); } }),
        r7520: GT.percentInput({ value: s.r7520, max: 15, step: 0.2, onChange: function (v) { s.r7520 = v; calc(); } }),
        payout: GT.percentInput({ value: s.payout, min: 5, max: 50, step: 0.5, onChange: function (v) { s.payout = GT.clamp(v, .05, .5); calc(); } }),
        termType: GT.radios({ options: [['life', 'For my lifetime'], ['years', 'For a fixed number of years']], value: 'life', onChange: function (v) { s.termType = v; toggle(); calc(); } }),
        years: GT.numberInput({ min: 1, max: 20, value: s.years, onChange: function (v) { s.years = v; calc(); } }),
        rate: GT.select({ options: GT.BRACKETS(), value: s.rate, onChange: function (v) { s.rate = v; calc(); } }),
        asset: GT.radios({ options: [['cash', 'Cash'], ['stock', 'Appreciated stock']], value: 'cash', onChange: function (v) { s.asset = v; toggle(); calc(); } }),
        basis: GT.moneyInput({ value: s.basis, onChange: function (v) { s.basis = v; calc(); } })
      };
      GT.applyState(ctl, s); this.getState = function () { return s; };
      var payoutField = GT.field('Annual payout rate', ctl.payout, 'Trusts must pay at least 5% and no more than 50% per year. Lower payout rates leave more for the Library and a larger deduction.');
      var termField = GT.field('Payment period', ctl.termType);
      var yearsField = GT.field('Number of years', ctl.years, 'Term trusts can run up to 20 years.');
      var basisField = GT.field('What you paid for the stock', ctl.basis);
      function toggle() {
        payoutField.style.display = s.kind === 'cga' ? 'none' : '';
        termField.style.display = s.kind === 'cga' ? 'none' : '';
        yearsField.style.display = s.kind !== 'cga' && s.termType === 'years' ? '' : 'none';
        basisField.style.display = s.asset === 'stock' ? '' : 'none';
      }
      GT.append(root, [
        GT.field('Which kind of gift?', ctl.kind),
        h('div.grid', [
          GT.field('Your age', ctl.age, 'Single-life illustrations. Two-life arrangements pay a little less each year.'),
          GT.field('Amount of the gift', ctl.gift),
          GT.field('Funded with', ctl.asset), basisField,
          payoutField, termField, yearsField,
          GT.field('IRS §7520 rate', ctl.r7520, 'The rate for ' + t.sec7520.month + ' is ' + pct(t.sec7520.rate, 1) + '. You may use the rate for the month of the gift or either of the two prior months. <a href="' + t.sec7520.url + '" target="_blank" rel="noopener">Current rates</a>.'),
          GT.field('Your federal tax bracket', ctl.rate, 'To estimate what the deduction is worth.')
        ]),
        out
      ]);

      function calc() {
        GT.clear(out);
        var gift = s.gift, r = s.r7520, br = parseFloat(s.rate), dr = GT.deductionRate(br);
        var le = GT.lifeExpectancy(s.age);
        var n = (s.kind !== 'cga' && s.termType === 'years') ? s.years : le;
        var gain = s.asset === 'stock' ? Math.max(0, gift - s.basis) : 0;
        var res = {};

        if (s.kind === 'cga') {
          var ageKey = GT.clamp(Math.round(s.age), 60, 90);
          var arate = t.acga.singleLife[ageKey];
          res.payment = gift * arate;
          res.pv = GT.pvAnnuity(res.payment, r, le);
          res.deduction = Math.max(0, gift - res.pv);
          res.exclusion = Math.min(1, res.pv / (res.payment * le)); // simplified exclusion ratio
          res.taxFree = res.payment * res.exclusion;
          res.label = 'Fixed payment every year for life';
          res.rateNote = 'ACGA suggested rate at age ' + ageKey + ': ' + pct(arate, 1) + (s.age < 60 ? ' (rates for younger ages are lower; shown at the age-60 rate)' : '') + '.';
        } else if (s.kind === 'crut') {
          res.payment = gift * s.payout;
          var factor = Math.pow(1 - s.payout, n);
          res.deduction = gift * factor;
          res.label = 'First-year payment (' + pct(s.payout, 1) + ' of trust value; changes yearly)';
          res.rateNote = 'Remainder factor ≈ (1 − payout)<sup>years</sup> = ' + factor.toFixed(3) + ' over ' + n.toFixed(1) + ' years.';
        } else {
          res.payment = gift * s.payout;
          res.pv = GT.pvAnnuity(res.payment, r, n);
          res.deduction = Math.max(0, gift - res.pv);
          res.label = 'Fixed payment every year';
          res.rateNote = 'Present value of the payments at ' + pct(r, 1) + ' over ' + n.toFixed(1) + ' years ≈ ' + money(res.pv) + '.';
        }
        var passes = res.deduction >= 0.10 * gift;
        var dedLimit = s.asset === 'stock' ? t.charitable.agiLimitAppreciated : t.charitable.agiLimitCash;

        GT.append(out, [
          s.kind === 'cga' && !o.offersGiftAnnuities ? GT.callout('warn', '<p><b>Please note:</b> ' + o.name + ' does not currently issue charitable gift annuities. This illustration shows how one works so you can discuss it with your advisor or a community foundation that issues annuities for the benefit of charities you choose. We are glad to talk through it with you.</p>') : null,
          h('div.stats', [
            GT.stat(res.label, money(res.payment), res.rateNote, 'good'),
            GT.stat('Estimated income-tax deduction', money(res.deduction), 'About ' + pct(res.deduction / gift, 0) + ' of the gift; worth roughly ' + money(res.deduction * dr) + ' at your bracket if you itemize.', 'highlight'),
            s.kind === 'cga' ? GT.stat('Portion of each payment that is tax-free', money(res.taxFree), 'For about ' + le.toFixed(1) + ' years (your life expectancy), assuming a cash gift. After that, payments are fully taxable.', 'muted') : GT.stat('Estimated years of payments', n.toFixed(1), s.termType === 'years' && s.kind !== 'cga' ? 'Fixed term.' : 'Life expectancy at age ' + s.age + ' — actual payments continue for your lifetime.', 'muted')
          ]),
          GT.bars([{ label: 'Your payments (est. total)', value: res.payment * n, tone: 'muted' }, { label: 'Deduction now', value: res.deduction, tone: 'highlight' }, { label: 'Gift amount', value: gift, tone: 'good' }]),
          !passes ? GT.callout('warn', 'The charitable portion must be at least <b>10% of the gift</b> for the arrangement to qualify. At these inputs it is about ' + pct(res.deduction / gift, 0) + '. A lower payout, a shorter term, or an older annuitant would fix that.') : null,
          gain > 0 ? GT.callout('info', '<p><b>Funding with appreciated stock:</b> no capital gains tax is due when you transfer the shares. ' + (s.kind === 'cga' ? 'The gain attributable to the annuity portion is reported gradually as part of your payments over your life expectancy rather than all at once.' : 'The trust sells the shares tax-free; gain is passed out to you over time as part of your payments under the trust’s tiered accounting rules.') + ' The deduction is generally limited to ' + pct(dedLimit, 0) + ' of AGI per year with a five-year carryover.</p>') : GT.callout('info', 'Deductions for cash-funded life-income gifts are limited to ' + pct(dedLimit, 0) + ' of adjusted gross income per year, with a five-year carryover.'),
          s.kind === 'cga' ? GT.callout('info', '<p><b>One-time IRA option:</b> people 70½ and older may make a once-in-a-lifetime qualified charitable distribution of up to ' + money(t.qcd.splitInterestLimit) + ' (' + t.taxYear + ') from an IRA to fund a gift annuity or remainder trust. Payments from an IRA-funded annuity are fully taxable, but the transfer itself is excluded from income and can count toward your RMD.</p>') : null,
          GT.section('What to expect', GT.list(s.kind === 'cga' ? [
            'A gift annuity is a contract, not a trust — simple paperwork, usually a ' + money(10000) + ' to ' + money(25000) + ' minimum, and the payments are a general obligation of the issuing charity.',
            'Payments are fixed for life and never change. Two-life annuities can continue to a spouse.',
            'A “deferred” gift annuity starts payments at a later date you choose, with a higher rate and larger deduction.'
          ] : s.kind === 'crut' ? [
            'The trust is a separate legal entity with its own trustee, tax return, and annual valuation; most advisors suggest ' + money(250000) + ' or more to justify the cost.',
            'Payments are recalculated each year, so they can grow (or shrink) with the trust’s investments — a built-in inflation hedge.',
            'Additional contributions can be made to a unitrust later; a “flip” unitrust can hold real estate until it sells.'
          ] : [
            'The trust pays a fixed dollar amount every year regardless of performance, which is attractive if you want predictability.',
            'No additional contributions are permitted after funding, and the IRS applies an extra test to be sure the trust is unlikely to run out of money.',
            'Like a unitrust, it requires a trustee, a tax return, and professional setup.'
          ])),
          h('div.actions', [GT.linkBtn('Email the giving team', 'mailto:' + o.contactEmail, 'primary'), GT.linkBtn('Give from your IRA instead', GT.toolUrl('qcd'), 'secondary')]),
          GT.advisorQuestions([
            'Given my income needs and my heirs, is a gift annuity or a remainder trust the better fit — or neither?',
            'Which assets should fund it, and how would the capital gain be handled?',
            'Which month’s §7520 rate gives me the best deduction, and should I time the gift?',
            'Who would issue the annuity or serve as trustee, and what would it cost?',
            'How would the payments be taxed to me each year, and how does that change if I fund it from my IRA?'
          ]),
          GT.contactLine()
        ]);
      }
      toggle(); calc();
    }
  });
})(window.TRPLGivingTools);
