/* @tool Gift Acknowledgment Letters (staff)
 * Internal tool for the development team: produces IRS-compliant
 * acknowledgment letters for each gift type (cash, quid pro quo, stock, QCD,
 * DAF grant, estate distribution, matching gift) and the North Dakota
 * endowment qualification letter donors need for Schedule ND-1QEC. */
(function (GT) {
  var h = GT.h, T = GT.T, ORG = GT.ORG, money = GT.money;

  GT.register('acknowledgments', {
    staff: true,
    title: 'Gift acknowledgment letters',
    intro: 'For {{OrgBare}} staff. Choose the gift type, fill in the details, and download a letter that says what the IRS requires — and nothing it forbids. Publication 1771 rules are built in.',
    disclaimerExtra: 'Internal drafting aid. Letters should go out on letterhead under the signer’s review; the development office remains responsible for substantiation and for the accuracy of dates, amounts, and fund names.',
    render: function (root) {
      var o = ORG(), t = T();
      var s = GT.state('acknowledgments', { kind: 'cash', amount: 1000, benefits: 0, purpose: '' }); this.getState = function () { return s; };
      var KINDS = [
        ['cash', 'Cash, check, or card — no benefits received'],
        ['quid', 'Gift with benefits (event tickets, membership perks, auction)'],
        ['stock', 'Securities (stock, mutual fund shares)'],
        ['qcd', 'IRA qualified charitable distribution'],
        ['daf', 'Donor-advised fund grant'],
        ['estate', 'Estate or trust distribution'],
        ['match', 'Employer matching gift'],
        (o.features && o.features.ndCredit) ? ['ndletter', 'North Dakota endowment qualification letter (for Schedule ND-1QEC)'] : null
      ].filter(Boolean);
      function txt(ph, type) { var i = GT.numberInput({ value: '', placeholder: ph }); i.input.type = type || 'text'; return i; }
      var ctl = {
        kind: GT.radios({ stacked: true, options: KINDS, value: s.kind, onChange: function (v) { s.kind = v; toggle(); } }),
        amount: GT.moneyInput({ value: s.amount, onChange: function (v) { s.amount = v; } }),
        benefits: GT.moneyInput({ value: s.benefits, onChange: function (v) { s.benefits = v; } })
      };
      var donor = txt('Full legal name(s) of donor'), addr = txt('Street, city, state, ZIP'), salutation = txt('e.g. Dear Mr. and Mrs. Roosevelt'), date = txt('', 'date'),
          desc = txt('e.g. 100 shares of Apple Inc. common stock'), benefitsDesc = txt('e.g. two tickets to the Founders’ Dinner'), purpose = txt('e.g. {{org}}’s endowment; education programs'),
          signer = txt('e.g. Jane Doe'), signerTitle = txt('e.g. Chief Development Officer'), extra = txt('e.g. the ' + o.name + ' Endowment Fund'), thirdParty = txt('e.g. Fidelity Charitable; the Estate of John Doe; Acme Corp.');
      GT.applyState(ctl, s);
      var amountF = GT.field('Gift amount', ctl.amount), benefitsF = GT.field('Fair market value of benefits provided', ctl.benefits, 'Required when the donor received something in return. The deductible amount is the gift minus this value.'),
          descF = GT.field('Description of securities', desc, 'Number of shares and issuer. Do <b>not</b> state a dollar value — the donor’s appraisal or broker sets that.'),
          benefitsDescF = GT.field('Describe the benefits', benefitsDesc), fundF = GT.field('Name of the qualified endowment fund', extra), thirdF = GT.field('Sponsor / estate / employer name', thirdParty);
      function toggle() {
        var k = s.kind;
        amountF.style.display = (k === 'stock' || k === 'ndletter') ? 'none' : '';
        benefitsF.style.display = k === 'quid' ? '' : 'none'; benefitsDescF.style.display = k === 'quid' ? '' : 'none';
        descF.style.display = k === 'stock' ? '' : 'none';
        fundF.style.display = k === 'ndletter' ? '' : 'none';
        thirdF.style.display = (k === 'daf' || k === 'estate' || k === 'match') ? '' : 'none';
      }
      var status = h('p.help'), preview = h('div.textout');

      function fmtDate(v) { return v ? new Date(v + 'T12:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '[date]'; }
      function body() {
        var k = s.kind, name = donor.input.value || '[Donor name]', d = fmtDate(date.input.value), amt = money(s.amount), sal = salutation.input.value || ('Dear ' + name + ','), p = purpose.input.value;
        var noGoods = 'No goods or services were provided in exchange for this contribution.';
        var forP = p ? ' designated for ' + p : '';
        var paras = [];
        if (k === 'cash') paras = ['Thank you for your generous gift of ' + amt + forP + ', received on ' + d + '. ' + o.missionLine, noGoods, 'Please keep this letter as your receipt for tax purposes.'];
        else if (k === 'quid') { var ded = Math.max(0, s.amount - s.benefits); paras = ['Thank you for your payment of ' + amt + forP + ', received on ' + d + '.', 'In return for your contribution, you received ' + (benefitsDesc.input.value || '[description of benefits]') + ', which {{org}} values at ' + money(s.benefits) + '. Under federal tax law, the amount of your contribution that is deductible is limited to the excess of your payment over the value of the goods and services provided: ' + money(ded) + '.', 'Please keep this letter as your receipt.']; }
        else if (k === 'stock') paras = ['Thank you for your generous gift of ' + (desc.input.value || '[number of shares and issuer]') + forP + ', received in {{org}}’s brokerage account on ' + d + '.', noGoods, 'As required by the IRS, this letter describes the securities but does not state their value; your deduction is based on the fair market value on the date of the gift, and gifts over $500 are reported on Form 8283. Please keep this letter with your records.'];
        else if (k === 'qcd') paras = ['Thank you for your gift of ' + amt + forP + ', received on ' + d + ' as a distribution from your IRA. We understand you intend this to be a qualified charitable distribution under Internal Revenue Code § 408(d)(8).', 'The ' + o.name + ' is a public charity described in § 170(b)(1)(A) and is eligible to receive qualified charitable distributions. ' + noGoods, 'Please keep this letter with your records; your IRA custodian will report the distribution on Form 1099-R.'];
        else if (k === 'daf') paras = ['Thank you for recommending a grant of ' + amt + forP + ' from your donor-advised fund at ' + (thirdParty.input.value || '[sponsor]') + ', received on ' + d + '. Your continued support means a great deal to {{org}}.', 'Because this grant came from a donor-advised fund, no additional tax deduction is available to you and this letter is not a tax receipt; your deduction was taken when you contributed to the fund. No goods or services were provided to you in connection with this grant, and {{org}} has not used it to satisfy any pledge or provide any benefit to you.'];
        else if (k === 'estate') paras = ['On behalf of the ' + o.name + ', thank you for the distribution of ' + amt + forP + ' from ' + (thirdParty.input.value || '[the Estate or Trust]') + ', received on ' + d + '. We are honored that ' + name + ' chose to leave a lasting legacy at {{org}}.', noGoods + ' {{Org}} is a public charity described in Internal Revenue Code § 170(b)(1)(A); this letter may serve as the receipt for the estate’s or trust’s charitable deduction under § 2055 or § 642(c).'];
        else if (k === 'match') paras = ['Thank you for the matching gift of ' + amt + ' from ' + (thirdParty.input.value || '[employer]') + ', received on ' + d + ', in recognition of the generosity of ' + name + '. ' + noGoods, 'The employee’s own gift has been acknowledged separately; this letter serves as the receipt for the corporate match.'];
        else if (k === 'ndletter') paras = ['This letter confirms that the ' + o.name + ' is a nonprofit corporation incorporated in and with a physical presence in ' + o.stateName + ', exempt from federal income tax under Internal Revenue Code § 501(c)(3) and eligible to receive contributions deductible under § 170(c).', 'It further confirms that the ' + (extra.input.value || '[name of endowment fund]') + ', to which your contribution of ' + amt + ' was made on ' + d + ', is a qualified endowment fund within the meaning of N.D.C.C. § 57-38-01.21: a permanent, irrevocable fund held by the Foundation, comprised of cash, securities, mutual funds, or other investment assets, established for a charitable purpose, and from which only the income generated by, or the increase in value of, the contributed assets may be expended.', 'This letter is provided to support your claim of the North Dakota charitable giving tax credit on Schedule ND-1QEC. Please attach it to your return as the schedule requires. ' + noGoods];
        var sign = (signer.input.value || '[Signer]') + '\n' + (signerTitle.input.value || '[Title]') + '\n' + o.name;
        return { salutation: sal, paras: paras, sign: sign, name: name, address: addr.input.value };
      }
      function asText() { var b = body(); return [new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), '', b.name + (b.address ? '\n' + b.address : ''), '', b.salutation, '', b.paras.join('\n\n'), '', 'With gratitude,', '', '', b.sign].join('\n'); }
      function refresh() { preview.textContent = GT.brandify(asText()); }
      [donor, addr, salutation, date, desc, benefitsDesc, purpose, signer, signerTitle, extra, thirdParty].forEach(function (i) { i.input.addEventListener('input', refresh); });
      ctl.amount.input.addEventListener('input', refresh); ctl.benefits.input.addEventListener('input', refresh);
      ctl.kind.el.addEventListener('change', refresh);
      var pdfBtn = GT.button('Download letter (PDF)', function () {
        var b = body(); pdfBtn.disabled = true; status.textContent = 'Preparing…';
        GT.makePDF({ title: s.kind === 'ndletter' ? 'Qualified endowment fund confirmation' : 'Thank you for your gift', subtitle: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          blocks: GT.letterBlocks(b.name + (b.address ? '\n' + b.address : '') + '\n\n' + b.salutation + '\n\n' + b.paras.join('\n\n') + '\n\nWith gratitude,\n\n\n' + b.sign), disclaimer: false })
          .then(function (bytes) { GT.downloadBytes(bytes, 'acknowledgment-' + s.kind + '.pdf'); status.textContent = 'Downloaded. Print on letterhead or attach to email.'; })
          .catch(function (e) { status.textContent = 'Could not build the PDF (' + e.message + ').'; }).then(function () { pdfBtn.disabled = false; });
      }, 'primary');

      GT.append(root, [
        GT.callout('warn', '<b>Staff tool.</b> Not intended for donors. The rules baked in: acknowledgments for gifts of $250+ must state whether goods or services were provided; “quid pro quo” letters are required for payments over $75 and must give a good-faith value of the benefits; stock letters describe but never value the shares; DAF letters must not offer a deduction; QCD letters confirm no benefits were provided.'),
        GT.field('Gift type', ctl.kind),
        h('div.grid', [GT.field('Donor name(s)', donor), GT.field('Address', addr), GT.field('Salutation', salutation), GT.field('Date received', date), amountF, benefitsF, benefitsDescF, descF, thirdF, fundF, GT.field('Purpose or designation (optional)', purpose), GT.field('Signer', signer), GT.field('Signer title', signerTitle)]),
        GT.section('Letter', [preview, h('div.actions', [pdfBtn, GT.copyButton(asText, 'Copy letter text')]), status]),
        GT.callout('info', 'Reference: IRS Publication 1771, <i>Charitable Contributions — Substantiation and Disclosure Requirements</i>; N.D.C.C. § 57-38-01.21 for the endowment letter. Confirm the endowment fund’s qualified status with counsel before issuing the North Dakota letter.')
      ]);
      toggle(); refresh();
    }
  });
})(window.TRPLGivingTools);
