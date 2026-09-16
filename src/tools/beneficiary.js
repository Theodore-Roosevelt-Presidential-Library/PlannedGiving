/* @tool Beneficiary Designation Guide
 * Step-by-step instructions for naming the Foundation as a beneficiary of
 * retirement accounts, life insurance, DAFs, and transfer-on-death accounts,
 * plus a plain-English explainer of which assets are best left to charity. */
(function (GT) {
  var h = GT.h, T = GT.T, ORG = GT.ORG, money = GT.money;

  GT.register('beneficiary', {
    title: 'Name the Library as a beneficiary',
    intro: 'No attorney, no new will. Most accounts let you name a charity as a beneficiary in a few minutes online — and for retirement accounts it is one of the most tax-efficient gifts a family can make.',
    render: function (root) {
      var o = ORG(), t = T();
      var ASSETS = {
        ira: { label: 'IRA, 401(k), 403(b), or other retirement plan', where: 'Log in to your plan or custodian’s website and look for “Beneficiaries.” Paper forms work too — ask your plan administrator or HR.', why: 'Money in traditional retirement accounts has never been taxed. Heirs pay ordinary income tax on it — often 22% to 37% — and most must empty the account within ten years. A charity pays nothing. Leaving the Library a share of a retirement account and leaving family other assets often means <b>more for everyone</b>.', notes: ['If you are married, some plans (especially 401(k)s) require your spouse’s written consent to name anyone else.', 'You can name the Library for any percentage — 5%, 10%, 100% — as primary or contingent.', 'Roth accounts are tax-free to heirs, so they are usually better left to family.'] },
        life: { label: 'Life insurance policy', where: 'Contact your insurer or agent for a change-of-beneficiary form; many carriers handle it online.', why: 'A policy you no longer need for its original purpose — a paid-off mortgage, grown children — can become a significant gift at little cost. Proceeds pass outside probate.', notes: ['You can name the Library for a percentage of the death benefit.', 'Alternatively, transferring ownership of a policy to the Library during life may generate a current deduction — ask your advisor.'] },
        daf: { label: 'Donor-advised fund', where: 'Log in to your fund sponsor and update “successor” or “beneficiary” instructions.', why: 'Whatever remains in your fund at death can go to the charities you choose. Naming the Library keeps your giving going.', notes: ['You may name the Library for a percentage alongside family successor advisors.', 'Some sponsors let you set up recurring grants to continue automatically.'] },
        tod: { label: 'Bank or brokerage account (payable- or transfer-on-death)', where: 'Ask your bank or brokerage for a POD/TOD designation form.', why: 'A simple way to leave a specific account without changing your will. The account passes directly to the Library.', notes: ['Appreciated securities left to individuals get a “step-up” in basis, so brokerage accounts are often better for family — retirement accounts are usually the better charitable asset.', 'Not all states allow TOD registration for every account type; your institution will know.'] },
        cd: { label: 'Certificate of deposit, savings bond, or annuity', where: 'Ask the issuer for its beneficiary form.', why: 'Commercial annuities and U.S. savings bonds carry untaxed gain that heirs would owe income tax on; a charity does not.', notes: ['Series EE and I bonds cannot be retitled to a charity during life without triggering tax, but can be left by beneficiary designation or will.'] }
      };
      var s = { asset: 'ira' };
      var detail = h('div.section');
      var pick = GT.radios({ stacked: true, value: s.asset, options: Object.keys(ASSETS).map(function (k) { return [k, ASSETS[k].label]; }), onChange: function (v) { s.asset = v; show(); } });

      function show() {
        GT.clear(detail);
        var a = ASSETS[s.asset];
        GT.append(detail, [
          GT.callout('good', '<p><b>Why this works:</b> ' + a.why + '</p>'),
          GT.section('How to do it', h('ol.steps', [
            h('li', a.where),
            h('li', { html: 'Add a new beneficiary and choose “charity” or “organization.” Enter the details exactly as shown in the card below.' }),
            GT.li('Choose the percentage and whether the Library is a primary or contingent beneficiary. Make sure all percentages add up to 100%.'),
            GT.li('Save a copy of the confirmation for your records and with your estate documents.'),
            h('li', { html: 'Let us know — email <a href="mailto:' + o.contactEmail + '">' + o.contactEmail + '</a> or use the button below — so we can thank you and welcome you to the ' + o.legacySociety + '.' })
          ])),
          GT.list(a.notes)
        ]);
      }
      var card = h('div.infocard', [h('b', 'Enter the beneficiary exactly like this'), h('span', 'Name: ' + o.name), h('span', 'Tax ID / EIN: ' + o.ein), h('span', 'Address: ' + o.address), h('span', 'Type: Charity / nonprofit organization (' + o.taxStatus + ')'), h('span', 'Relationship: None / Charity'), h('span', 'Contact: ' + o.contactEmail)]);
      GT.append(root, [
        GT.field('Which kind of account?', pick),
        card,
        h('div.actions', [GT.copyButton(function () { return o.name + '\nEIN: ' + o.ein + '\n' + o.address + '\n' + o.taxStatus; }, 'Copy beneficiary details')]),
        detail,
        GT.section('A tax-smart way to think about it', [
          h('table.table', [
            h('thead', h('tr', [h('th', 'Asset'), h('th', 'Tax if left to family'), h('th', 'Tax if left to the Library')])),
            h('tbody', [
              h('tr', [h('td', 'Traditional IRA / 401(k)'), h('td', 'Income tax on every dollar withdrawn, usually within 10 years'), h('td', 'None')]),
              h('tr', [h('td', 'Appreciated stock, real estate'), h('td', 'Usually none — basis “steps up” at death'), h('td', 'None')]),
              h('tr', [h('td', 'Cash, Roth accounts, life insurance'), h('td', 'None'), h('td', 'None')])
            ])
          ]),
          h('p.help', 'The pattern: leave the Library the assets family would pay income tax on, and leave family the assets that pass tax-free. Federal estate tax applies only above ' + money(t.estate.exemption) + ' per person in ' + t.taxYear + '; charitable bequests are fully deductible from it.')
        ]),
        GT.intentCTA(),
        GT.advisorQuestions([
          'Which of my accounts is the most heavily taxed if it goes to my children, and would that be the better one to leave to charity?',
          'Are my beneficiary designations consistent with my will and trust? (Designations override the will.)',
          'Does my spouse need to consent to a charitable beneficiary on my employer plan?',
          'Should the Library be a primary beneficiary for a percentage, or a contingent beneficiary?'
        ]),
        GT.contactLine()
      ]);
      show();
    }
  });
})(window.TRPLGivingTools);
