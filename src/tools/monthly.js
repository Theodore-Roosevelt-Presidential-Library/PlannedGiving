/* @tool Monthly Giving Calculator
 * A friendly slider that shows what a monthly gift adds up to and links to
 * the monthly giving form with the amount pre-selected where supported. */
(function (GT) {
  var h = GT.h, ORG = GT.ORG, T = GT.T, money = GT.money;

  GT.register('monthly', {
    title: 'Small monthly gifts, big yearly impact',
    intro: 'Monthly giving spreads your support across the year and gives {{org}} a steady base to plan on. Slide to see what your gift adds up to.',
    disclaimerExtra: 'Monthly gifts are charged to your card or bank account on the same day each month and can be changed or cancelled at any time. Cash gifts to {{org}} qualify for the ' + money(T().charitable.nonItemizer.single) + ' / ' + money(T().charitable.nonItemizer.mfj) + ' non-itemizer deduction in ' + T().taxYear + '.',
    render: function (root) {
      var o = ORG(), t = T();
      var s = GT.state('monthly', { amt: 25 }); this.getState = function () { return s; };
      var out = h('div.section');
      var presets = [10, 25, 50, 100, 250];
      var slider = h('input.range', { type: 'range', min: 5, max: 500, step: 5, value: GT.clamp(s.amt, 5, 500), 'aria-label': 'Monthly gift amount' });
      var custom = GT.moneyInput({ value: s.amt, onChange: function (v) { s.amt = Math.max(1, v); slider.value = GT.clamp(s.amt, 5, 500); calc(); } });
      slider.addEventListener('input', function () { s.amt = +slider.value; custom.set(s.amt); calc(); });
      var chips = h('div.radios', presets.map(function (p) { return GT.button(money(p) + '/mo', function () { s.amt = p; slider.value = p; custom.set(p); calc(); }, 'secondary'); }));
      GT.append(root, [
        h('div.grid.two', [GT.field('Monthly gift', custom), h('div.field', [h('label.label', 'Or slide'), slider, chips])]),
        out
      ]);
      function calc() {
        GT.clear(out);
        var a = s.amt, yr = a * 12;
        var perDay = a / 30.4;
        GT.append(out, [
          h('div.stats', [
            GT.stat('Per year', money(yr), 'That’s about ' + money(perDay, { cents: true }) + ' a day.', 'good'),
            GT.stat('Over three years', money(yr * 3), null, 'muted'),
            GT.stat('Over five years', money(yr * 5), null, 'highlight')
          ]),
          GT.bars([{ label: 'Year 1', value: yr, tone: 'good' }, { label: 'Year 3', value: yr * 3, tone: 'good' }, { label: 'Year 5', value: yr * 5, tone: 'highlight' }]),
          GT.callout('info', '<p>A monthly gift of ' + money(a) + ' gives {{org}} the same support as a ' + money(yr) + ' annual gift — spread out so it fits your budget. You’ll receive one year-end summary for your taxes.</p>'),
          h('div.actions', [GT.linkBtn('Start a ' + money(a) + ' monthly gift', o.urls.donateMonthly + (o.urls.donateMonthly.indexOf('?') >= 0 ? '&' : '?') + 'amount=' + a, 'primary'), GT.linkBtn('Give once instead', o.urls.donate, 'secondary'), GT.linkBtn('Become a member', o.urls.membership, 'secondary')]),
          GT.contactLine()
        ]);
      }
      calc();
    }
  });
})(window.TRPLGivingTools);
