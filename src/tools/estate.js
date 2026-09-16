/* @tool Estate Tax & Charitable Bequest Estimator
 * Rough federal estate-tax exposure, how a charitable bequest changes it,
 * and a flag for states with their own estate or inheritance tax. */
(function (GT) {
  var h = GT.h, T = GT.T, ORG = GT.ORG, money = GT.money, pct = GT.pct;
  var STATES = 'AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY'.split(' ');

  GT.register('estate', {
    title: 'Will your estate owe tax?',
    intro: 'Most families will never pay federal estate tax — but a dozen states tax much smaller estates, and a charitable bequest reduces both. Get a rough picture in a minute.',
    disclaimerExtra: 'A simplified estimate. It ignores lifetime taxable gifts beyond the amount you enter, generation-skipping tax, state tax rates and brackets, and valuation discounts. Your estate attorney can model this precisely.',
    render: function (root) {
      var t = T(), o = ORG();
      var s = { married: 'yes', gross: 8000000, debts: 250000, toSpouse: 0, charity: 500000, gifts: 0, dsue: 0, state: 'ND' };
      var out = h('div.section');
      var ctl = {
        married: GT.radios({ options: [['yes', 'Married'], ['no', 'Single / widowed']], value: 'yes', onChange: function (v) { s.married = v; toggle(); calc(); } }),
        gross: GT.moneyInput({ value: s.gross, onChange: function (v) { s.gross = v; calc(); } }),
        debts: GT.moneyInput({ value: s.debts, onChange: function (v) { s.debts = v; calc(); } }),
        toSpouse: GT.moneyInput({ value: s.toSpouse, onChange: function (v) { s.toSpouse = v; calc(); } }),
        charity: GT.moneyInput({ value: s.charity, onChange: function (v) { s.charity = v; calc(); } }),
        gifts: GT.moneyInput({ value: s.gifts, onChange: function (v) { s.gifts = v; calc(); } }),
        dsue: GT.moneyInput({ value: s.dsue, onChange: function (v) { s.dsue = v; calc(); } }),
        state: GT.select({ options: STATES.map(function (x) { return [x, x]; }), value: 'ND', onChange: function (v) { s.state = v; calc(); } })
      };
      var spouseField = GT.field('Amount passing to your spouse', ctl.toSpouse, 'Gifts to a U.S.-citizen spouse are fully deductible (the “marital deduction”).');
      var dsueField = GT.field('Unused exemption from a deceased spouse (“portability”)', ctl.dsue, 'If your spouse died and the estate elected portability, their unused exemption adds to yours.');
      function toggle() { spouseField.style.display = s.married === 'yes' ? '' : 'none'; }
      GT.append(root, [
        h('div.grid', [
          GT.field('Marital status', ctl.married),
          GT.field('Total value of everything you own', ctl.gross, 'Home, investments, retirement accounts, business interests, and life insurance you own — before debts.'),
          GT.field('Debts, mortgage, and expected final expenses', ctl.debts),
          spouseField,
          GT.field('Charitable bequests (to the Library and others)', ctl.charity),
          GT.field('Taxable gifts you have already made in life', ctl.gifts, 'Gifts above the annual exclusion (' + money(t.estate.annualExclusion) + ' per person per year in ' + t.taxYear + ') that you reported on Form 709.'),
          dsueField,
          GT.field('State of residence', ctl.state)
        ]),
        out
      ]);

      function fed(charity) {
        var taxable = Math.max(0, s.gross - s.debts - (s.married === 'yes' ? s.toSpouse : 0) - charity);
        var exemption = Math.max(0, t.estate.exemption - s.gifts) + s.dsue;
        var exposed = Math.max(0, taxable - exemption);
        return { taxable: taxable, exemption: exemption, exposed: exposed, tax: exposed * t.estate.topRate };
      }
      function calc() {
        GT.clear(out);
        var withC = fed(s.charity), without = fed(0);
        var saved = without.tax - withC.tax;
        var st = t.stateEstateTax[s.state], inh = t.stateInheritanceTax.indexOf(s.state) >= 0;
        var stateTaxable = Math.max(0, s.gross - s.debts - (s.married === 'yes' ? s.toSpouse : 0) - s.charity);
        GT.append(out, [
          h('div.stats', [
            GT.stat('Estimated federal estate tax', money(withC.tax), withC.exposed > 0 ? money(withC.exposed) + ' above your ' + money(withC.exemption) + ' exemption, taxed at ' + pct(t.estate.topRate, 0) + '.' : 'Your taxable estate (' + money(withC.taxable) + ') is under the ' + money(withC.exemption) + ' exemption.', withC.tax > 0 ? 'highlight' : 'good'),
            GT.stat('Without the charitable bequest', money(without.tax), 'Every charitable dollar comes off the taxable estate.', 'muted'),
            GT.stat('Federal tax saved by the bequest', money(saved), saved > 0 ? 'Effectively, ' + pct(saved / s.charity, 0) + ' of the gift is paid for by tax savings.' : 'No federal tax either way at this size — the gift still passes 100% to the causes you choose.', saved > 0 ? 'good' : 'muted')
          ]),
          GT.bars([{ label: 'Tax without bequest', value: without.tax, tone: 'muted' }, { label: 'Tax with bequest', value: withC.tax, tone: 'good' }]),
          st ? GT.callout('warn', '<p><b>' + s.state + ' has its own estate tax</b> with a ' + t.taxYear + ' exemption of about ' + money(st) + (stateTaxable > st ? ' — your estimated taxable estate of ' + money(stateTaxable) + ' would be above it. Charitable bequests are generally deductible for state purposes too.' : '; your estimated taxable estate is below it.') + ' State rates and rules vary; check with a local estate attorney.</p>') : null,
          inh ? GT.callout('warn', '<p><b>' + s.state + ' has an inheritance tax</b> paid by certain heirs based on their relationship to you. Bequests to charities are exempt.</p>') : null,
          (!st && !inh) ? GT.callout('good', s.state + ' has no state estate or inheritance tax. Only the federal exemption matters, and it is ' + money(t.estate.exemption) + ' per person in ' + t.taxYear + ' (' + money(t.estate.exemption * 2) + ' for a married couple using portability).') : null,
          GT.callout('info', '<p><b>Even when there is no estate tax</b>, how you give matters: leaving retirement accounts to the Library and other assets to family avoids the income tax heirs would owe on the retirement money. See the beneficiary designation guide.</p>'),
          h('div.actions', [GT.linkBtn('Write your bequest', o.urls.tools + 'tools/bequest.html', 'primary'), GT.linkBtn('Beneficiary designation guide', o.urls.tools + 'tools/beneficiary.html', 'secondary'), GT.linkBtn('Heritage Society', o.urls.heritage, 'secondary')]),
          GT.advisorQuestions([
            'Is my estate likely to exceed the federal or my state’s exemption, now or as it grows?',
            'Have we elected portability so my spouse’s unused exemption is preserved?',
            'Should charitable gifts come from my retirement accounts rather than my will, to also avoid income tax for heirs?',
            'Would lifetime gifts — to family within the annual exclusion, or to charity — reduce the estate more efficiently?',
            'Do I own life insurance that is counted in my estate, and should it be held in a trust?'
          ]),
          GT.contactLine()
        ]);
      }
      toggle(); calc();
    }
  });
})(window.TRPLGivingTools);
