/* @tool Bunching & Standard Deduction Comparison
 * Compares giving the same amount every year with "bunching" several years
 * of gifts into one (usually through a donor-advised fund). */
(function (GT) {
  var h = GT.h, T = GT.T, ORG = GT.ORG, money = GT.money, pct = GT.pct;

  GT.register('bunching', {
    title: 'Should you bunch your gifts?',
    intro: 'Most households take the standard deduction, so their charitable gifts earn no federal deduction at all. Combining two or three years of giving into one year — often through a donor-advised fund — can change that. Compare both approaches.',
    disclaimerExtra: 'Federal income tax only. Assumes cash gifts to public charities and that your other deductions stay flat. The non-itemizer deduction does not apply to gifts to donor-advised funds.',
    render: function (root) {
      var t = T(), o = ORG();
      var s = { status: 'mfj', over65: 0, agi: 180000, rate: '0.24', giving: 12000, salt: 14000, mortgage: 9000, other: 0, years: 3 };
      var out = h('div.section');
      var ctl = {
        status: GT.select({ options: GT.FILING, value: s.status, onChange: function (v) { s.status = v; calc(); } }),
        over65: GT.select({ options: [['0', 'None'], ['1', 'One'], ['2', 'Both spouses']], value: '0', onChange: function (v) { s.over65 = +v; calc(); } }),
        agi: GT.moneyInput({ value: s.agi, onChange: function (v) { s.agi = v; calc(); } }),
        rate: GT.select({ options: GT.BRACKETS(), value: s.rate, onChange: function (v) { s.rate = v; calc(); } }),
        giving: GT.moneyInput({ value: s.giving, onChange: function (v) { s.giving = v; calc(); } }),
        salt: GT.moneyInput({ value: s.salt, onChange: function (v) { s.salt = v; calc(); } }),
        mortgage: GT.moneyInput({ value: s.mortgage, onChange: function (v) { s.mortgage = v; calc(); } }),
        other: GT.moneyInput({ value: s.other, onChange: function (v) { s.other = v; calc(); } }),
        years: GT.radios({ options: [['2', 'Two years'], ['3', 'Three years']], value: '3', onChange: function (v) { s.years = +v; calc(); } })
      };
      GT.append(root, [
        h('div.grid', [
          GT.field('Filing status', ctl.status),
          GT.field('Household members age 65 or older', ctl.over65, 'Adds to the standard deduction.'),
          GT.field('Approximate adjusted gross income', ctl.agi),
          GT.field('Your federal tax bracket', ctl.rate),
          GT.field('Charitable gifts you make in a typical year', ctl.giving),
          GT.field('State and local taxes you pay per year', ctl.salt, 'Income or sales tax plus property tax. Capped at ' + money(t.salt.cap[s.status]) + ' in ' + t.taxYear + ' (phasing down above ' + money(t.salt.phaseStart.mfj) + ' of income).'),
          GT.field('Mortgage interest per year', ctl.mortgage),
          GT.field('Other itemized deductions per year', ctl.other, 'Medical expenses above 7.5% of AGI, etc. Usually zero.'),
          GT.field('Bunch how many years of giving into one?', ctl.years)
        ]),
        out
      ]);

      function calc() {
        GT.clear(out);
        var r = parseFloat(s.rate), dr = GT.deductionRate(r), N = s.years;
        var std = GT.stdDeduction(s.status, s.over65);
        var salt = GT.saltAllowed(s.salt, s.status, s.agi);
        var base = salt + s.mortgage + s.other;              // non-charitable itemized
        var floor = t.charitable.itemizerFloorPct * s.agi;
        var ni = GT.nonItemizerDeduction(s.giving, s.status);

        // Every-year plan
        var itemEach = base + Math.max(0, s.giving - floor);
        var eachYear = Math.max(std + ni, itemEach);        // if standard, add the non-itemizer charitable deduction
        var eachItemizes = itemEach > std + ni;
        var totalEach = eachYear * N;

        // Bunched plan: year 1 gets N years of gifts; other years nothing charitable
        var itemBunch = base + Math.max(0, s.giving * N - floor);
        var niBunch = GT.nonItemizerDeduction(s.giving * N, s.status);
        var year1 = Math.max(std + niBunch, itemBunch), bunchItemizes = itemBunch > std + niBunch;
        var otherYears = Math.max(std, base);
        var totalBunch = year1 + otherYears * (N - 1);
        var extraDed = totalBunch - totalEach;
        var savings = extraDed * (eachItemizes || bunchItemizes ? dr : r);

        GT.append(out, [
          h('div.stats', [
            GT.stat('Deductions over ' + N + ' years — give every year', money(totalEach), eachItemizes ? 'You itemize each year.' : 'You take the standard deduction (' + money(std) + ') plus the ' + money(ni) + ' non-itemizer charitable deduction.', 'muted'),
            GT.stat('Deductions over ' + N + ' years — bunched', money(totalBunch), bunchItemizes ? 'Itemize in year one (' + money(year1) + '), standard deduction after.' : 'Even bunched, your itemized total stays below the standard deduction.', bunchItemizes ? 'good' : 'muted'),
            GT.stat('Estimated federal tax saved by bunching', money(Math.max(0, savings)), savings > 0 ? 'About ' + pct(savings / (s.giving * N), 1) + ' of the ' + money(s.giving * N) + ' you give either way.' : 'Bunching doesn’t help at these numbers.', savings > 0 ? 'highlight' : 'muted')
          ]),
          GT.bars([{ label: 'Give every year', value: totalEach, tone: 'muted' }, { label: 'Bunch ' + N + ' years', value: totalBunch, tone: 'good' }]),
          h('table.table', [
            h('thead', h('tr', [h('th', 'Year'), h('th.num', 'Give every year'), h('th.num', 'Bunched')])),
            h('tbody', Array.apply(null, Array(N)).map(function (_, i) {
              return h('tr', [h('td', 'Year ' + (i + 1)), h('td.num', money(eachYear) + (eachItemizes ? ' (itemized)' : ' (standard)')), h('td.num', money(i === 0 ? year1 : otherYears) + (i === 0 && bunchItemizes ? ' (itemized)' : ' (standard)'))]);
            }))
          ]),
          savings > 0 ? GT.callout('good', '<p><b>How people do this:</b> open a donor-advised fund, contribute ' + money(s.giving * N) + ' in one year (appreciated stock works especially well), take the deduction that year, and then recommend grants to the Library every year as usual. Your giving stays steady; only the tax timing changes.</p>') : GT.callout('info', '<p>With these numbers the standard deduction is already the better deal. You still receive the ' + money(t.charitable.nonItemizer[s.status]) + ' non-itemizer deduction for cash gifts each year — and gifts of appreciated stock or a QCD from an IRA can deliver tax benefits that don’t depend on itemizing.</p>'),
          GT.callout('info', 'New for ' + t.taxYear + ': itemizers may deduct only the portion of charitable gifts above <b>½% of AGI</b> (' + money(floor) + ' for you), and for those in the 37% bracket each deductible dollar is worth at most 35¢. Bunching also helps by paying that floor once instead of every year.'),
          h('div.actions', [GT.linkBtn('Donor-advised fund giving', o.urls.daf, 'primary'), GT.linkBtn('Stock gift calculator', o.urls.tools + 'tools/stock.html', 'secondary'), GT.linkBtn('Give now', o.urls.donate, 'secondary')]),
          GT.advisorQuestions([
            'Given my other deductions, in which year should I concentrate my charitable gifts?',
            'Would funding a donor-advised fund with appreciated stock make the bunched year even more efficient?',
            'How does the ½%-of-AGI floor and the 35% cap change the math for me?',
            'Does my state follow the federal standard deduction, or would bunching affect my state return differently?'
          ]),
          GT.contactLine()
        ]);
      }
      calc();
    }
  });
})(window.TRPLGivingTools);
