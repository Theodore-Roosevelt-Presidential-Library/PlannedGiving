/* @tool Bequest Language Builder
 * Generates sample will/trust language a donor can hand to their attorney,
 * with an intent CTA. Mirrors the Foundation's published sample language. */
(function (GT) {
  var h = GT.h, T = GT.T, ORG = GT.ORG, money = GT.money;

  GT.register('bequest', {
    title: 'Write your gift into your will',
    intro: 'A gift in your will or living trust costs nothing today, can be any size, and can be changed whenever life changes. Build sample language below and share it with your attorney.',
    disclaimerExtra: 'Sample language only. Your attorney should adapt it to your state’s law and your overall plan. The Foundation does not draft or review estate documents.',
    render: function (root) {
      var o = ORG(), t = T();
      var s = GT.state('bequest', { kind: 'pct', pct: 10, amount: 25000, asset: '', purpose: 'unrestricted', program: '', contingent: false, vehicle: 'will' }); this.getState = function () { return s; };
      var textOut = h('div.textout', { 'aria-live': 'polite' });
      var pctCtl = GT.numberInput({ min: 1, max: 100, value: s.pct, suffix: '%', onChange: function (v) { s.pct = v; gen(); } });
      var amtCtl = GT.moneyInput({ value: s.amount, onChange: function (v) { s.amount = v; gen(); } });
      var assetCtl = GT.numberInput({ value: s.asset, placeholder: 'e.g. 200 shares of XYZ stock; my cabin at …' }); assetCtl.input.type = 'text'; assetCtl.input.addEventListener('input', function () { s.asset = assetCtl.input.value; gen(); });
      var programCtl = GT.numberInput({ value: s.program, placeholder: 'e.g. education programs for students and teachers' }); programCtl.input.type = 'text'; programCtl.input.addEventListener('input', function () { s.program = programCtl.input.value; gen(); });
      var pctField = GT.field('Percentage', pctCtl, 'Percentages keep pace with your estate and are easy for family to understand. Many donors choose 5% or 10%.');
      var amtField = GT.field('Dollar amount', amtCtl);
      var assetField = GT.field('Describe the asset', assetCtl);
      var programField = GT.field('Which program or purpose?', programCtl, 'We add a clause that lets {{org}} redirect the gift if that purpose no longer exists — a small line that prevents big problems decades from now.');

      var ctl = {
        vehicle: GT.radios({ options: [['will', 'My will'], ['trust', 'My living trust']], value: s.vehicle, onChange: function (v) { s.vehicle = v; gen(); } }),
        kind: GT.radios({ stacked: true, options: [
          ['pct', '<b>A percentage of my estate</b> — scales with whatever I leave behind'],
          ['residue', '<b>All or part of what remains</b> after specific gifts and expenses (a “residuary” gift)'],
          ['amount', '<b>A specific dollar amount</b>'],
          ['asset', '<b>A specific asset</b> — securities, real estate, or other property']], value: s.kind, onChange: function (v) { s.kind = v; show(); gen(); } }),
        purpose: GT.radios({ stacked: true, options: [
          ['unrestricted', '<b>Wherever the need is greatest</b> — the most useful kind of gift (recommended)'],
          ['program', '<b>A specific program or purpose</b>']], value: s.purpose, onChange: function (v) { s.purpose = v; show(); gen(); } }),
        contingent: GT.checkbox('Make this a <b>contingent</b> gift — {{org}} receives it only if my named beneficiaries do not survive me', { value: s.contingent, onChange: function (v) { s.contingent = v; gen(); } })
      };
      function show() {
        pctField.style.display = s.kind === 'pct' || s.kind === 'residue' ? '' : 'none';
        amtField.style.display = s.kind === 'amount' ? '' : 'none';
        assetField.style.display = s.kind === 'asset' ? '' : 'none';
        programField.style.display = s.purpose === 'program' ? '' : 'none';
        pctField.querySelector('.trpl-label').textContent = s.kind === 'residue' ? 'Percentage of the residue' : 'Percentage of my estate';
      }
      function text() {
        var legal = o.name + ', a ' + o.taxStatus + ' organization, Federal Employer Identification Number ' + o.ein + ', located at ' + o.address + ', or its successor in interest,';
        var what;
        if (s.kind === 'pct') what = s.pct + ' percent (' + s.pct + '%) of my estate';
        else if (s.kind === 'residue') what = (s.pct >= 100 ? 'all' : s.pct + ' percent (' + s.pct + '%)') + ' of the rest, residue, and remainder of my estate';
        else if (s.kind === 'amount') what = 'the sum of ' + money(s.amount) + ' (' + words(s.amount) + ' dollars)';
        else what = (s.asset ? s.asset.trim() : '[describe the asset]');
        var verb = s.vehicle === 'trust' ? 'The Trustee shall distribute ' : 'I give, devise, and bequeath ';
        var opening = s.contingent ? 'If [name(s) of primary beneficiary] do(es) not survive me, ' + (s.vehicle === 'trust' ? 'the Trustee shall distribute ' : 'I give, devise, and bequeath ') : verb;
        var purpose = s.purpose === 'program' && s.program.trim()
          ? ' to be used for ' + s.program.trim() + '. If, in the judgment of the Board of Trustees of the Foundation, it becomes impossible or impractical to use this gift for that purpose, the Foundation may use it for a purpose that most closely reflects my intent.'
          : ' to be used for its general charitable purposes.';
        return opening + what + ' to ' + legal + purpose;
      }
      function words(n) { // small helper for the "(twenty-five thousand dollars)" convention
        n = Math.round(n); if (n <= 0) return 'zero';
        var ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
        var tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
        function sub(x) { var w = ''; if (x >= 100) { w += ones[Math.floor(x / 100)] + ' hundred'; x %= 100; if (x) w += ' '; } if (x >= 20) { w += tens[Math.floor(x / 10)]; if (x % 10) w += '-' + ones[x % 10]; } else if (x) w += ones[x]; return w; }
        var parts = [], scales = [['billion', 1e9], ['million', 1e6], ['thousand', 1e3]];
        scales.forEach(function (sc) { if (n >= sc[1]) { parts.push(sub(Math.floor(n / sc[1])) + ' ' + sc[0]); n %= sc[1]; } });
        if (n) parts.push(sub(n));
        return parts.join(' ');
      }
      function gen() { textOut.textContent = GT.brandify(text()); }

      GT.append(root, [
        h('div.grid.two', [
          GT.field('Where will the gift appear?', ctl.vehicle),
          GT.field('What kind of gift?', ctl.kind),
          pctField, amtField, assetField,
          GT.field('How should {{org}} use it?', ctl.purpose),
          programField
        ]),
        h('div', [ctl.contingent.el]),
        GT.section('Sample language for your attorney', [
          textOut,
          h('div.actions', [GT.copyButton(text, 'Copy language'), GT.button('Print', function () { window.print(); }, 'secondary')])
        ]),
        h('div.infocard', [h('b', 'The details your attorney will need'), h('span', 'Legal name: ' + o.name), h('span', 'Tax ID (EIN): ' + o.ein), h('span', 'Address: ' + o.address), h('span', 'Status: ' + o.taxStatus)]),
        GT.callout('info', '<p><b>Three things worth knowing.</b> A gift in your will is fully deductible from your taxable estate. It is revocable — you can change it at any time. And you don’t need a new will to add it: a short amendment (a “codicil”) usually does the job.</p>'),
        GT.intentCTA(),
        GT.intentStatementSection(function () { return s.vehicle === 'trust' ? 'a provision in my/our living trust' : 'a bequest in my/our will'; }, text),
        GT.advisorQuestions([
          'Should this be a percentage, a fixed amount, or a share of the residue, given the rest of my plan?',
          'Would leaving retirement-account assets to {{org}} and other assets to family reduce the taxes my heirs pay?',
          'Do I need a new will, or can we add this with a codicil or trust amendment?',
          'Is my estate likely to owe state estate or inheritance tax where I live?'
        ]),
        GT.contactLine()
      ]);
      show(); gen();
    }
  });
})(window.TRPLGivingTools);
