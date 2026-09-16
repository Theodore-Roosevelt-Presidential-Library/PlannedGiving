/* @tool Appreciated Stock Gift Calculator
 * Compares giving shares directly with selling the shares and giving the
 * after-tax cash. */
(function (GT) {
  var h = GT.h, T = GT.T, ORG = GT.ORG, money = GT.money, pct = GT.pct;

  GT.register('stock', {
    title: 'Give stock instead of cash',
    intro: 'Giving shares you have held more than a year lets you skip the capital gains tax and, if you itemize, deduct the full market value. Compare the two paths with your own numbers.',
    disclaimerExtra: 'Assumes publicly traded securities held more than one year and given to a public charity. Deductions for appreciated property are limited to 30% of adjusted gross income per year, with a five-year carryover. Mutual-fund cost basis and wash-sale rules can complicate the picture — ask your advisor.',
    render: function (root) {
      var t = T(), o = ORG();
      var s = { fmv: 25000, basis: 8000, held: 'long', status: 'mfj', rate: '0.24', cg: '0.15', niit: false, state: 0, itemize: 'yes', agi: 200000 };
      var out = h('div.section');
      var ctl = {
        fmv: GT.moneyInput({ value: s.fmv, onChange: function (v) { s.fmv = v; calc(); } }),
        basis: GT.moneyInput({ value: s.basis, onChange: function (v) { s.basis = v; calc(); } }),
        held: GT.radios({ options: [['long', 'More than one year'], ['short', 'One year or less']], value: s.held, onChange: function (v) { s.held = v; calc(); } }),
        status: GT.select({ options: GT.FILING, value: s.status, onChange: function (v) { s.status = v; calc(); } }),
        rate: GT.select({ options: GT.BRACKETS(), value: s.rate, onChange: function (v) { s.rate = v; calc(); } }),
        cg: GT.select({ options: [['0', '0%'], ['0.15', '15%'], ['0.20', '20%']], value: s.cg, onChange: function (v) { s.cg = v; calc(); } }),
        niit: GT.checkbox('Add the 3.8% net investment income tax (applies above ' + money(t.niit.threshold.mfj) + ' MAGI for joint filers, ' + money(t.niit.threshold.single) + ' single)', { value: s.niit, onChange: function (v) { s.niit = v; calc(); } }),
        state: GT.percentInput({ value: s.state, max: 20, onChange: function (v) { s.state = v; calc(); } }),
        itemize: GT.radios({ options: [['yes', 'Yes'], ['no', 'No'], ['unsure', 'Not sure']], value: s.itemize, onChange: function (v) { s.itemize = v; calc(); } }),
        agi: GT.moneyInput({ value: s.agi, onChange: function (v) { s.agi = v; calc(); } })
      };
      GT.append(root, [
        h('div.grid', [
          GT.field('Current market value of the shares', ctl.fmv),
          GT.field('What you paid for them (cost basis)', ctl.basis, 'Your brokerage statement lists this. If you don’t know, a rough guess still shows the pattern.'),
          GT.field('How long have you held them?', ctl.held),
          GT.field('Filing status', ctl.status),
          GT.field('Your federal income tax bracket', ctl.rate),
          GT.field('Your long-term capital gains rate', ctl.cg, 'In ' + t.taxYear + ' the 15% rate begins at ' + money(t.ltcg[s.status][0]) + ' of taxable income and 20% at ' + money(t.ltcg[s.status][1]) + ' (joint filers: ' + money(t.ltcg.mfj[0]) + ' / ' + money(t.ltcg.mfj[1]) + ').'),
          GT.field('State capital gains / income tax rate (optional)', ctl.state, 'North Dakota residents: leave at 0 — the state has no separate capital gains tax beyond its low income tax; enter your state’s rate if you live elsewhere.'),
          GT.field('Approximate adjusted gross income', ctl.agi, 'For the ½%-of-AGI floor and the 30%-of-AGI limit.'),
          GT.field('Do you itemize deductions?', ctl.itemize)
        ]),
        h('div', [ctl.niit.el]),
        out
      ]);

      function calc() {
        GT.clear(out);
        var fmv = s.fmv, basis = Math.min(s.basis, s.fmv), gain = Math.max(0, fmv - basis), r = parseFloat(s.rate), cg = parseFloat(s.cg);
        var gainRate = (s.held === 'long' ? cg : r) + (s.niit ? t.niit.rate : 0) + s.state;
        var taxOnSale = gain * gainRate;
        var cashGift = fmv - taxOnSale;
        var dedRate = GT.deductionRate(r);
        var itemizing = s.itemize === 'yes';
        // deduction for shares: FMV if long-term, basis if short-term
        var dedShares = s.held === 'long' ? fmv : basis;
        var dedSharesUsable = Math.min(dedShares, t.charitable.agiLimitAppreciated * s.agi);
        var dedCashUsable = Math.min(cashGift, t.charitable.agiLimitCash * s.agi);
        var valShares = itemizing ? GT.charitableAfterFloor(dedSharesUsable, s.agi) * dedRate : GT.nonItemizerDeduction(0, s.status) * r; // stock gifts don't qualify for the non-itemizer cash deduction
        var valCash = itemizing ? GT.charitableAfterFloor(dedCashUsable, s.agi) * dedRate : GT.nonItemizerDeduction(cashGift, s.status) * r;
        var costShares = fmv - valShares;               // what the gift really costs you
        var costCash = fmv - valCash;                    // you gave up the whole position either way; tax already paid out of proceeds
        var carry = dedShares - dedSharesUsable;

        GT.append(out, [
          s.held === 'short' ? GT.callout('warn', '<b>Held one year or less:</b> the deduction for short-term shares is limited to what you paid (' + money(basis) + '), not market value, and the gain would be taxed at ordinary rates if sold. If you can, wait until you have held the shares more than a year.') : null,
          h('div.stats', [
            GT.stat('Capital gains tax you avoid', money(taxOnSale), 'On ' + money(gain) + ' of gain at ' + pct(gainRate, 1) + ' combined.', 'good'),
            GT.stat('Library receives if you give shares', money(fmv), 'Full market value, no tax taken out first.', 'good'),
            GT.stat('Library receives if you sell, then give', money(cashGift), 'After ' + money(taxOnSale) + ' in tax on the sale.', 'muted'),
            GT.stat('Your deduction for the share gift', itemizing ? money(GT.charitableAfterFloor(dedSharesUsable, s.agi)) : '—', itemizing ? 'Worth about ' + money(valShares) + ' at ' + pct(dedRate, 0) + '.' : 'Non-itemizers can’t deduct stock gifts (the ' + money(t.charitable.nonItemizer[s.status]) + ' non-itemizer deduction is for cash only) — the avoided capital gains tax is still yours to keep.', 'highlight')
          ]),
          GT.section('Side by side', h('table.table', [
            h('thead', h('tr', [h('th', ''), h('th.num', 'Give the shares'), h('th.num', 'Sell, then give cash')])),
            h('tbody', [
              h('tr', [h('td', 'You part with'), h('td.num', money(fmv)), h('td.num', money(fmv))]),
              h('tr', [h('td', 'Capital gains tax paid'), h('td.num', money(0)), h('td.num', money(taxOnSale))]),
              h('tr', [h('td', 'Library receives'), h('td.num', money(fmv)), h('td.num', money(cashGift))]),
              h('tr', [h('td', 'Value of your deduction'), h('td.num', money(valShares)), h('td.num', money(valCash))]),
              h('tr', [h('td', { html: '<b>Net cost to you</b>' }), h('td.num', { html: '<b>' + money(costShares) + '</b>' }), h('td.num', { html: '<b>' + money(costCash) + '</b>' })])
            ])
          ])),
          h('p.help', { html: 'Same position either way. Giving the shares delivers <b>' + money(fmv - cashGift) + ' more</b> to the Library' + (valShares > valCash ? ' and saves you about ' + money(valShares - valCash) + ' more in income tax' : '') + '.' }),
          carry > 0 ? GT.callout('info', 'Deductions for appreciated securities are limited to <b>30% of AGI</b> in a single year. About ' + money(carry) + ' of this deduction would carry forward (up to five years).') : null,
          GT.callout('info', '<p><b>A favorite move:</b> give the shares to the Library, then use the cash you would have given to buy the same stock back. You keep the position with a fresh, higher cost basis — and no wash-sale problem, because you didn’t sell at a loss.</p>'),
          GT.section('How to transfer shares', h('ol.steps', [
            h('li', { html: 'Tell your broker you want to transfer shares to <b>' + o.name + '</b>. The Library’s brokerage (DTC) instructions are on the <a href="' + o.urls.stock + '" target="_blank" rel="noopener">stock gift page</a>.' }),
            GT.li('Transfer the shares — do not sell them. The gift date is the date the shares arrive in the Library’s account, which can take several days; plan ahead near year-end.'),
            h('li', { html: 'Email <a href="mailto:' + o.contactEmail + '">' + o.contactEmail + '</a> with the security, share count, and expected date so we can identify your gift and send a receipt.' }),
            GT.li('For gifts over $500 you will file IRS Form 8283 with your return; publicly traded stock does not require an appraisal.')
          ])),
          h('div.actions', [GT.linkBtn('Stock transfer instructions', o.urls.stock, 'primary'), GT.linkBtn('Email the giving team', 'mailto:' + o.contactEmail, 'secondary')]),
          GT.advisorQuestions([
            'Which lot of my shares has the highest gain and longest holding period? (Give those first.)',
            'Will the 30%-of-AGI limit apply to me this year, and would a carryover be usable?',
            'Should I repurchase the same stock after giving, to reset my basis?',
            'Would giving mutual fund shares or ETF shares work the same way with my custodian?',
            'How does my state treat the deduction and the avoided gain?'
          ]),
          GT.contactLine()
        ]);
      }
      calc();
    }
  });
})(window.TRPLGivingTools);
