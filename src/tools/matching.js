/* @tool Employer Matching Gift Impact
 * Shows what a gift becomes with an employer match and how to claim it. */
(function (GT) {
  var h = GT.h, ORG = GT.ORG, money = GT.money;

  GT.register('matching', {
    title: 'Double your gift with an employer match',
    intro: 'Thousands of employers match their employees’ charitable gifts — some 2:1 or more, and many include retirees and spouses. See what your gift could become and how to claim the match.',
    disclaimer: true,
    disclaimerExtra: 'Matching programs are set by each employer and change often; the impact shown is an estimate. Membership dues and event tickets are usually not matched.',
    render: function (root) {
      var o = ORG();
      var s = { gift: 250, ratio: '1', cap: 0, monthly: false };
      var out = h('div.section');
      var ctl = {
        gift: GT.moneyInput({ value: s.gift, onChange: function (v) { s.gift = v; calc(); } }),
        ratio: GT.radios({ options: [['0.5', '0.5 : 1'], ['1', '1 : 1'], ['2', '2 : 1'], ['3', '3 : 1']], value: '1', onChange: function (v) { s.ratio = v; calc(); } }),
        cap: GT.moneyInput({ value: '', placeholder: 'Optional', onChange: function (v) { s.cap = v; calc(); } }),
        monthly: GT.checkbox('This is a monthly gift — show the annual total', { onChange: function (v) { s.monthly = v; calc(); } })
      };
      ctl.cap.input.value = '';
      GT.append(root, [
        h('div.grid', [
          GT.field('Your gift', ctl.gift),
          GT.field('Your employer’s match ratio', ctl.ratio, 'Check your HR portal or ask your benefits team. 1:1 is most common.'),
          GT.field('Annual match limit per employee, if you know it', ctl.cap)
        ]),
        h('div', [ctl.monthly.el]),
        out
      ]);
      function calc() {
        GT.clear(out);
        var base = s.monthly ? s.gift * 12 : s.gift;
        var match = base * parseFloat(s.ratio);
        if (s.cap > 0) match = Math.min(match, s.cap);
        GT.append(out, [
          h('div.stats', [
            GT.stat(s.monthly ? 'Your gifts this year' : 'Your gift', money(base), null, 'muted'),
            GT.stat('Employer match', money(match), s.cap > 0 && base * parseFloat(s.ratio) > s.cap ? 'Limited by your employer’s ' + money(s.cap) + ' cap.' : null, 'good'),
            GT.stat('Total impact for the Library', money(base + match), null, 'highlight')
          ]),
          GT.bars([{ label: 'Your gift', value: base, tone: 'muted' }, { label: 'With match', value: base + match, tone: 'good' }]),
          GT.section('How to claim your match', h('ol.steps', [
            h('li', { html: 'Make your gift to the Library first (<a href="' + o.urls.donate + '" target="_blank" rel="noopener">give online</a>) and keep the receipt.' }),
            GT.li('Find your employer’s matching gift form or portal — usually under “Giving,” “Community,” or “Benefits” in HR — or ask your HR team. Many companies use Benevity, YourCause, CyberGrants, or Bright Funds.'),
            h('li', { html: 'Submit the request with the Library’s details: <b>' + o.name + '</b>, EIN <b>' + o.ein + '</b>, ' + o.address + '.' }),
            h('li', { html: 'The employer verifies the gift with the Library and sends the match — typically within a few weeks to a few months. Questions: <a href="mailto:' + o.contactEmail + '">' + o.contactEmail + '</a>.' })
          ])),
          GT.callout('info', '<p><b>Don’t assume you’re not eligible.</b> Many programs cover part-time employees, retirees, spouses, and board members, and some match volunteer hours with grants. Deadlines are often the end of the calendar year or a set number of months after the gift.</p>'),
          h('div.actions', [GT.linkBtn('Matching gifts page', o.urls.matching, 'primary'), GT.linkBtn('Give now', o.urls.donate, 'secondary')]),
          GT.contactLine()
        ]);
      }
      calc();
    }
  });
})(window.TRPLGivingTools);
