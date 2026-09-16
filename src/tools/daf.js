/* @tool Donor-Advised Fund Grant Guide
 * Sponsor-specific steps for recommending a grant, a copyable grant
 * recommendation, and a DAF vs. direct-gift decision helper. */
(function (GT) {
  var h = GT.h, T = GT.T, ORG = GT.ORG, money = GT.money;

  GT.register('daf', {
    title: 'Give from your donor-advised fund',
    intro: 'Already have a donor-advised fund? A grant to the Library takes a few minutes. Pick your sponsor for steps, or use the helper to decide whether a DAF makes sense for you.',
    disclaimerExtra: 'Grants from a donor-advised fund cannot be used to pay for membership benefits, event tickets, or anything of value to you. You already received your deduction when you funded the DAF, so a grant is not deductible again.',
    render: function (root) {
      var o = ORG(), t = T();
      var SPONSORS = [
        ['fidelity', 'Fidelity Charitable', 'https://www.fidelitycharitable.org/'],
        ['schwab', 'DAFgiving360 (formerly Schwab Charitable)', 'https://www.dafgiving360.org/'],
        ['vanguard', 'Vanguard Charitable', 'https://www.vanguardcharitable.org/'],
        ['npt', 'National Philanthropic Trust', 'https://www.nptrust.org/'],
        ['ndcf', 'North Dakota Community Foundation', 'https://www.ndcf.net/'],
        ['community', 'Another community foundation'],
        ['other', 'Another sponsor']
      ];
      var s = { sponsor: 'fidelity', amount: 1000, purpose: 'general', recurring: false };
      var steps = h('div.section'), rec = h('div.textout');
      var sp = GT.select({ options: SPONSORS.map(function (x) { return [x[0], x[1]]; }), value: s.sponsor, onChange: function (v) { s.sponsor = v; show(); } });
      var amt = GT.moneyInput({ value: s.amount, onChange: function (v) { s.amount = v; gen(); } });
      var purpose = GT.radios({ options: [['general', 'Where needed most'], ['heritage', 'In honor / memory of someone'], ['program', 'A specific program']], value: 'general', onChange: function (v) { s.purpose = v; gen(); } });
      var recurring = GT.checkbox('Make this a recurring grant (annual or monthly)', { onChange: function (v) { s.recurring = v; gen(); } });
      var honoree = GT.numberInput({ value: '', placeholder: 'Name of honoree or program' }); honoree.input.type = 'text'; honoree.input.addEventListener('input', gen);

      function show() {
        GT.clear(steps);
        var spn = SPONSORS.filter(function (x) { return x[0] === s.sponsor; })[0];
        GT.append(steps, [
          h('ol.steps', [
            h('li', { html: spn[2] ? 'Log in at <a href="' + spn[2] + '" target="_blank" rel="noopener">' + spn[1] + '</a> and choose “Grant” or “Recommend a grant.”' : 'Log in to your sponsor’s donor portal and choose “Recommend a grant.”' }),
            h('li', { html: 'Search for <b>' + o.name + '</b>. If several results appear, match the EIN <b>' + o.ein + '</b> and the ' + o.city + ', ' + o.state + ' address.' }),
            GT.li('Enter the amount and any purpose or honoree in the memo (copy the text below). Choose whether to share your name and address — please do, so we can thank you.'),
            h('li', { html: 'Submit. Most sponsors send the check or ACH within one to two weeks. Email <a href="mailto:' + o.contactEmail + '">' + o.contactEmail + '</a> if you would like us to confirm receipt.' })
          ])
        ]);
      }
      function recText() {
        var memo = s.purpose === 'general' ? 'For the Library’s general charitable purposes.' : s.purpose === 'heritage' ? 'In honor of ' + (honoree.input.value || '[name]') + '.' : 'For ' + (honoree.input.value || '[program]') + ', or where the need is greatest if that program is fully funded.';
        return 'Grant recommendation\nRecipient: ' + o.name + '\nEIN: ' + o.ein + '\nAddress: ' + o.address + '\nAmount: ' + money(s.amount) + (s.recurring ? ' (recurring)' : '') + '\nPurpose: ' + memo + '\nDonor acknowledgment: please share my name and address with the recipient.';
      }
      function gen() { rec.textContent = recText(); }

      // DAF vs direct helper
      var helperOut = h('div.section');
      var hs = { itemize: 'no', asset: 'stock', horizon: 'multi' };
      var hi = GT.radios({ options: [['yes', 'Yes'], ['no', 'No'], ['unsure', 'Not sure']], value: 'no', onChange: function (v) { hs.itemize = v; helper(); } });
      var ha = GT.radios({ options: [['cash', 'Cash'], ['stock', 'Appreciated stock'], ['ira', 'IRA (age 70½+)']], value: 'stock', onChange: function (v) { hs.asset = v; helper(); } });
      var hh = GT.radios({ options: [['once', 'Give once, now'], ['multi', 'Give over several years']], value: 'multi', onChange: function (v) { hs.horizon = v; helper(); } });
      function helper() {
        GT.clear(helperOut);
        var msg, tone = 'info';
        if (hs.asset === 'ira') { msg = '<b>Skip the DAF.</b> Qualified charitable distributions from an IRA cannot go to a donor-advised fund — send the QCD straight to the Library instead. It keeps the amount out of your income entirely.'; tone = 'warn'; }
        else if (hs.horizon === 'once' && hs.itemize !== 'no') { msg = '<b>Give directly.</b> For a one-time gift while itemizing, a direct gift to the Library is simplest and equally deductible' + (hs.asset === 'stock' ? ' — transfer the shares to the Library and skip the middle step.' : '.'); }
        else if (hs.horizon === 'once' && hs.itemize === 'no') { msg = '<b>Give directly</b> — and note that in ' + t.taxYear + ' non-itemizers may deduct up to ' + money(t.charitable.nonItemizer.single) + ' (' + money(t.charitable.nonItemizer.mfj) + ' joint) of <i>cash</i> gifts made directly to charities. That deduction does not apply to DAF contributions.'; }
        else if (hs.itemize === 'no' || hs.itemize === 'unsure') { msg = '<b>A DAF may help.</b> Fund it with several years of giving' + (hs.asset === 'stock' ? ' in appreciated stock' : '') + ' in one year so you can itemize that year (“bunching”), then grant to the Library annually. Compare the numbers with the bunching calculator.'; tone = 'good'; }
        else { msg = '<b>Either works.</b> You itemize and plan to give over time. A DAF adds convenience (one tax receipt, easy stock gifts, grants on your schedule) at the cost of sponsor fees and a step between you and the Library. Direct gifts each year are just as deductible and let the Library put your gift to work immediately.'; }
        GT.append(helperOut, [GT.callout(tone, '<p>' + msg + '</p>'), h('div.actions', [hs.asset === 'ira' ? GT.linkBtn('IRA giving calculator', o.urls.tools + 'tools/qcd.html', 'primary') : (hs.itemize === 'no' && hs.horizon === 'multi') ? GT.linkBtn('Bunching calculator', o.urls.tools + 'tools/bunching.html', 'primary') : GT.linkBtn('Give now', o.urls.donate, 'primary'), hs.asset === 'stock' ? GT.linkBtn('Stock gift calculator', o.urls.tools + 'tools/stock.html', 'secondary') : null])]);
      }

      GT.append(root, [
        GT.section('Recommend a grant', [
          h('div.grid', [GT.field('Your fund sponsor', sp), GT.field('Grant amount', amt), GT.field('Purpose', purpose), GT.field('Honoree or program (optional)', honoree)]),
          h('div', [recurring.el]),
          steps,
          rec,
          h('div.actions', [GT.copyButton(recText, 'Copy grant details'), GT.linkBtn('Donor-advised fund page', o.urls.daf, 'secondary')])
        ]),
        GT.section('Should you use a DAF at all?', [
          h('div.grid', [GT.field('Do you itemize?', hi), GT.field('What would you give?', ha), GT.field('Timing', hh)]),
          helperOut
        ]),
        GT.callout('info', '<p><b>Two more DAF ideas.</b> Name the Library as a <b>successor beneficiary</b> of your fund so your giving continues. And if you keep a DAF at a community foundation such as the North Dakota Community Foundation, ask about recurring grants — set once, delivered every year.</p>'),
        GT.advisorQuestions([
          'Should I fund my DAF with appreciated securities rather than cash?',
          'How much should I contribute this year to make itemizing worthwhile?',
          'What are my sponsor’s fees and minimum grant size, and are there better options?',
          'Should the Library be named as a successor beneficiary of my fund?'
        ]),
        GT.contactLine()
      ]);
      show(); gen(); helper();
    }
  });
})(window.TRPLGivingTools);
