/* @tool North Dakota Charitable Giving Tax Credit
 * Estimates the 40% ND income-tax credit for gifts to a qualified endowment
 * fund (or the deduction portion of a planned gift), how much of it a donor
 * can use given their ND tax, the federal deduction interplay, and the net
 * cost of the gift. N.D.C.C. § 57-38-01.21. */
(function (GT) {
  var h = GT.h, T = GT.T, ORG = GT.ORG, money = GT.money, pct = GT.pct;

  function ndTax(taxable, status) {
    var b = T().ndBrackets[status] || T().ndBrackets.single, tax = 0, lo = 0;
    for (var i = 0; i < b.length; i++) { var hi = b[i][0]; if (taxable > lo) tax += (Math.min(taxable, hi) - lo) * b[i][1]; lo = hi; if (taxable <= hi) break; }
    return tax;
  }

  GT.register('ndcredit', {
    title: 'North Dakota’s 40% tax credit for endowment gifts',
    intro: 'North Dakota taxpayers who give $5,000 or more to a qualified endowment fund — or make a planned gift such as a gift annuity or remainder trust — can claim a state income tax credit worth 40% of the gift, up to $10,000 per person ($20,000 for couples filing jointly). See what your gift could really cost.',
    disclaimerExtra: 'The credit is nonrefundable: it offsets North Dakota income tax you would otherwise owe, with unused amounts carried forward up to three years. It generally requires North Dakota tax liability; nonresidents with North Dakota-source income should ask their preparer how credits apply to them. Federal figures assume the IRS rule that reduces a charitable deduction by state credits received (Treas. Reg. § 1.170A-1(h)(3)).',
    render: function (root) {
      var t = T(), o = ORG(), c = t.ndCredit;
      var s = { who: 'individual', kind: 'endowment', status: 'mfj', gift: 25000, deduction: 40000, ndIncome: 150000, rate: '0.24', itemize: 'no', saltRoom: false };
      var out = h('div.section');
      var ctl = {
        who: GT.radios({ options: [['individual', 'An individual or couple'], ['business', 'A business, trust, or estate']], value: 'individual', onChange: function (v) { s.who = v; toggle(); calc(); } }),
        kind: GT.radios({ stacked: true, options: [
          ['endowment', '<b>An outright gift to the endowment</b> — cash, stock, or other assets given now to the Library’s permanent endowment fund'],
          ['planned', '<b>A planned gift</b> — a charitable gift annuity, remainder trust, lead trust, life estate, or paid-up life insurance policy']], value: 'endowment', onChange: function (v) { s.kind = v; toggle(); calc(); } }),
        status: GT.select({ options: GT.FILING, value: 'mfj', onChange: function (v) { s.status = v; calc(); } }),
        gift: GT.moneyInput({ value: s.gift, onChange: function (v) { s.gift = v; calc(); } }),
        deduction: GT.moneyInput({ value: s.deduction, onChange: function (v) { s.deduction = v; calc(); } }),
        ndIncome: GT.moneyInput({ value: s.ndIncome, onChange: function (v) { s.ndIncome = v; calc(); } }),
        rate: GT.select({ options: GT.BRACKETS(), value: '0.24', onChange: function (v) { s.rate = v; calc(); } }),
        itemize: GT.radios({ options: [['no', 'No'], ['yes', 'Yes'], ['unsure', 'Not sure']], value: 'no', onChange: function (v) { s.itemize = v; calc(); } }),
        saltRoom: GT.checkbox('I itemize and my state and local taxes are <b>below</b> the federal SALT cap (' + money(t.salt.cap.mfj) + ')', { onChange: function (v) { s.saltRoom = v; calc(); } })
      };
      var statusField = GT.field('Filing status', ctl.status);
      var giftField = GT.field('Gift to the endowment', ctl.gift, 'Individuals must give at least ' + money(c.minGift) + ' in a year (one gift or several) to qualify. A gift of ' + money(c.maxIndividual / c.rate) + ' earns the full ' + money(c.maxIndividual) + ' credit for one person; ' + money(c.maxJoint / c.rate) + ' earns ' + money(c.maxJoint) + ' for a couple filing jointly.');
      var dedField = GT.field('Federal charitable deduction for the planned gift', ctl.deduction, 'The credit is 40% of the <i>deductible portion</i> of a planned gift — the present value of what the Library will eventually receive — not the whole amount you transfer. The <a href="' + GT.toolUrl('lifeincome') + '" target="_blank" rel="noopener">life-income illustrator</a> estimates it.');
      var ndField = GT.field('Your North Dakota taxable income', ctl.ndIncome, 'North Dakota starts from federal taxable income. Used only to estimate how much of the credit you can use this year versus carry forward.');
      var rateField = GT.field('Your federal tax bracket', ctl.rate);
      var itemField = GT.field('Do you itemize federal deductions?', ctl.itemize);
      var saltField = h('div', [ctl.saltRoom.el]);
      function toggle() {
        var biz = s.who === 'business';
        giftField.style.display = s.kind === 'endowment' || biz ? '' : 'none';
        dedField.style.display = s.kind === 'planned' && !biz ? '' : 'none';
        statusField.style.display = biz ? 'none' : '';
        rateField.style.display = biz ? 'none' : '';
        itemField.style.display = biz ? 'none' : '';
        saltField.style.display = biz ? 'none' : '';
        ndField.style.display = biz ? 'none' : '';
      }
      GT.append(root, [
        GT.field('Who is making the gift?', ctl.who),
        h('div', { id: 'trpl-nd-kind' }, [GT.field('What kind of gift?', ctl.kind)]),
        h('div.grid', [statusField, giftField, dedField, ndField, rateField, itemField]),
        saltField,
        out
      ]);

      function calc() {
        GT.clear(out);
        var biz = s.who === 'business';
        var kind = biz ? 'endowment' : s.kind;
        var base = kind === 'endowment' ? s.gift : s.deduction;        // amount the 40% applies to
        var cap = biz ? c.maxBusiness : (s.status === 'mfj' ? c.maxJoint : c.maxIndividual);
        var tooSmall = !biz && kind === 'endowment' && s.gift < c.minGift;
        var credit = tooSmall ? 0 : Math.min(base * c.rate, cap);
        // Entity tax varies (C-corp rates, pass-through to owners), so for a business we show the credit without estimating liability.
        var ndLiab = biz ? credit : ndTax(s.ndIncome, s.status);
        var useNow = Math.min(credit, ndLiab), carry = credit - useNow;
        var yearsToUse = ndLiab > 0 ? Math.ceil(credit / ndLiab) : Infinity;
        var usable = ndLiab > 0 ? Math.min(credit, ndLiab * (1 + c.carryforwardYears)) : 0;
        var lost = credit - usable;

        // Federal interplay (individuals): deduction reduced by the credit; SALT safe harbor may recover it
        var r = parseFloat(s.rate), dr = GT.deductionRate(r);
        var fedDed = 0, fedNote = '';
        if (!biz) {
          var reduced = Math.max(0, base - credit);
          if (s.itemize === 'yes') {
            var floorHit = Math.max(0, reduced - t.charitable.itemizerFloorPct * s.ndIncome * 1.1); // rough AGI proxy
            fedDed = (Math.min(reduced, floorHit) + (s.saltRoom ? credit : 0)) * dr;
            fedNote = 'Deduction reduced from ' + money(base) + ' to ' + money(reduced) + ' because of the state credit' + (s.saltRoom ? '; the ' + money(credit) + ' difference is treated as state tax paid under the IRS safe harbor.' : '. If your SALT deduction is under the cap, the safe harbor may let you deduct the difference as state tax instead.');
          } else {
            fedDed = GT.nonItemizerDeduction(kind === 'endowment' ? reduced : 0, s.status) * r;
            fedNote = 'Taking the standard deduction: only the ' + money(t.charitable.nonItemizer[s.status]) + ' non-itemizer deduction applies' + (kind === 'planned' ? ' (cash gifts only, so not to a planned gift)' : '') + '.';
          }
        }
        var gross = kind === 'endowment' ? s.gift : s.deduction;
        var netCost = gross - usable - fedDed;

        GT.append(out, [
          tooSmall ? GT.callout('warn', '<p><b>Below the minimum.</b> Individuals must give at least ' + money(c.minGift) + ' to a qualified endowment in a tax year to claim the credit. Several gifts during the year can be combined to reach it — or a gift of appreciated stock can get you there tax-efficiently.</p>') : null,
          h('div.stats', [
            GT.stat('North Dakota tax credit', money(credit), credit >= cap ? 'The maximum — ' + money(cap) + (biz ? ' per entity' : s.status === 'mfj' ? ' for a couple filing jointly' : ' per taxpayer') + '.' : pct(c.rate, 0) + ' of ' + money(base) + '.', 'good'),
            !biz ? GT.stat('Usable this year', money(useNow), ndLiab > 0 ? 'Against an estimated ' + money(ndLiab) + ' of North Dakota tax.' : 'No North Dakota tax estimated at this income.', useNow > 0 ? 'good' : 'muted') : GT.stat('Who uses it', 'Entity or owners', 'C corporations claim it on Form 40; S corporations, partnerships, and trusts pass it through to owners or beneficiaries on Schedule QEC.', 'muted'),
            !biz ? GT.stat('Carried forward', money(carry), carry > 0 ? (isFinite(yearsToUse) ? 'Used over about ' + Math.min(yearsToUse, 4) + ' years; up to ' + c.carryforwardYears + ' carryforward years allowed.' : 'Needs North Dakota tax to use.') : 'Nothing to carry forward.', carry > 0 ? 'highlight' : 'muted') : null,
            !biz ? GT.stat('Federal tax saved (est.)', money(fedDed), fedNote, 'muted') : null,
            GT.stat('Net cost of your ' + money(gross) + ' gift', money(Math.max(0, netCost)), 'After the ' + money(usable) + ' of credit you can realistically use' + (!biz && fedDed > 0 ? ' and ' + money(fedDed) + ' in federal savings' : '') + '.', 'highlight')
          ]),
          GT.bars([{ label: 'Your gift', value: gross, tone: 'muted' }, { label: 'ND credit (usable)', value: usable, tone: 'good' }, !biz ? { label: 'Federal savings', value: fedDed, tone: 'good' } : null, { label: 'Net cost to you', value: Math.max(0, netCost), tone: 'highlight' }].filter(Boolean)),
          lost > 0 ? GT.callout('warn', '<p>About <b>' + money(lost) + '</b> of the credit would expire unused after the three carryforward years at this level of North Dakota income. Splitting the gift across two tax years, or giving as a couple filing jointly, can capture more of it.</p>') : null,
          !biz && ndLiab === 0 ? GT.callout('warn', '<p><b>This credit only helps if you owe North Dakota income tax.</b> At the income entered, North Dakota tax is zero — the credit would have no value. If you live elsewhere, your own state may have similar incentives; the federal benefits of endowment and planned gifts still apply.</p>') : null,
          kind === 'endowment' && !tooSmall && credit < cap && !biz ? GT.callout('info', 'A gift of <b>' + money(cap / c.rate) + '</b> would earn the full ' + money(cap) + ' credit' + (s.status !== 'mfj' ? '; couples filing jointly can claim up to ' + money(c.maxJoint) + ' on ' + money(c.maxJoint / c.rate) : '') + '.') : null,
          GT.callout('good', '<p><b>Stack the benefits.</b> Give appreciated stock to the endowment and you avoid capital gains tax, may deduct it federally (net of the credit), and claim the 40% state credit. Or, if you are 70½ or older, a qualified charitable distribution from an IRA to the endowment keeps the amount out of your income entirely <i>and</i> earns the credit — ask your preparer to confirm both apply together.</p>'),
          o.ndEndowment.confirmed && o.ndEndowment.fundName
            ? GT.callout('info', '<p>Gifts designated to the <b>' + o.ndEndowment.fundName + '</b> qualify. Please note “endowment” on your gift so it is recorded correctly, and keep the Library’s acknowledgment for your ' + (kind === 'endowment' ? c.formEndowment : c.formPlanned) + '.</p>')
            : GT.callout('warn', '<p><b>Before you count on the credit:</b> it applies only to gifts directed to a qualified endowment fund — a permanent, irrevocable fund that spends only its earnings. Please email <a href="mailto:' + o.contactEmail + '">' + o.contactEmail + '</a> and we will confirm how to designate your gift to the Library’s endowment so it qualifies.</p>'),
          GT.section('How to claim it', h('ol.steps', [
            GT.li('Make your gift to the ' + o.name + ' and designate it for the <b>endowment</b>' + (kind === 'planned' ? ', or complete the planned gift with your advisor' : '') + '. Keep the acknowledgment letter.'),
            GT.li('File <b>' + (kind === 'endowment' ? c.formEndowment : c.formPlanned) + '</b> with your North Dakota return' + (biz ? ' (Schedule QEC for entities)' : '') + '. The statute is ' + c.statute + '.'),
            GT.li('If the credit exceeds your North Dakota tax, carry the balance forward — up to ' + c.carryforwardYears + ' more years.'),
            GT.li('On your federal return, reduce the charitable deduction by the credit (your preparer will know the rule) — or use the SALT safe harbor if you have room under the cap.')
          ])),
          h('div.actions', [GT.linkBtn('Give to the endowment', o.ndEndowment.giveUrl || o.urls.donate, 'primary'), GT.linkBtn('Stock gift calculator', GT.toolUrl('stock'), 'secondary'), GT.linkBtn('ND Tax Commissioner: endowment credit', 'https://www.tax.nd.gov/income-tax-incentives/endowment-fund-contribution-tax-credit', 'secondary')]),
          GT.advisorQuestions([
            'Does my gift qualify — is the fund a “qualified endowment” under N.D.C.C. § 57-38-01.21, and have I met the ' + money(c.minGift) + ' minimum this year?',
            'How much North Dakota tax will I owe this year and the next three, and should I size or split the gift to use the whole credit?',
            'How does the credit reduce my federal charitable deduction, and can I use the SALT safe harbor for the difference?',
            'Would a QCD from my IRA or a gift of appreciated stock to the endowment be better than cash?',
            'For a planned gift, what is the deductible portion the 40% applies to, and which year do I claim it?',
            biz ? 'Which of my entities should make the gift, and how does the credit flow through to owners?' : 'If I file jointly, can we claim up to ' + money(c.maxJoint) + '?'
          ]),
          GT.contactLine()
        ]);
      }
      toggle(); calc();
    }
  });
})(window.TRPLGivingTools);
