/* @tool IRA Qualified Charitable Distribution Calculator
 * Shows whether a visitor is eligible for a QCD, estimates their RMD, and
 * compares giving straight from the IRA with withdrawing and giving cash. */
(function (GT) {
  var h = GT.h, T = GT.T, ORG = GT.ORG, money = GT.money, pct = GT.pct;

  GT.register('qcd', {
    title: 'Give from your IRA',
    intro: 'If you are 70½ or older, a Qualified Charitable Distribution (QCD) sends money from your IRA directly to {{org}} — and it never counts as taxable income. See what that could mean for you.',
    disclaimerExtra: 'RMD estimates use the IRS Uniform Lifetime Table and your age this year; your custodian’s figure governs. QCDs must go directly from the custodian to the charity and cannot fund a donor-advised fund.',
    render: function (root) {
      var t = T(), o = ORG();
      var s = GT.state('qcd', { age: 73, status: 'mfj', rate: '0.22', balance: 500000, gift: 10000, itemize: 'no', agi: 120000 });
      var out = h('div.section');
      var ctl = {
        age: GT.numberInput({ min: 18, max: 110, value: s.age, onChange: function (v) { s.age = v; calc(); } }),
        status: GT.select({ options: GT.FILING, value: s.status, onChange: function (v) { s.status = v; calc(); } }),
        rate: GT.select({ options: GT.BRACKETS(), value: s.rate, onChange: function (v) { s.rate = v; calc(); } }),
        balance: GT.moneyInput({ value: s.balance, onChange: function (v) { s.balance = v; calc(); } }),
        gift: GT.moneyInput({ value: s.gift, onChange: function (v) { s.gift = v; calc(); } }),
        itemize: GT.radios({ options: [['no', 'No'], ['yes', 'Yes'], ['unsure', 'Not sure']], value: s.itemize, onChange: function (v) { s.itemize = v; calc(); } }),
        agi: GT.moneyInput({ value: s.agi, onChange: function (v) { s.agi = v; calc(); } })
      };
      GT.applyState(ctl, s); this.getState = function () { return s; };
      GT.append(root, [
        h('div.grid', [
          GT.field('Your age this year', ctl.age, 'QCDs begin at 70½. Required minimum distributions begin at ' + t.qcd.rmdAge + ' (' + t.qcd.rmdAgeBornAfter1959 + ' if you were born in 1960 or later).'),
          GT.field('Filing status', ctl.status),
          GT.field('Your federal tax bracket', ctl.rate, 'Your best guess is fine.'),
          GT.field('IRA balance (traditional, rollover, SEP or SIMPLE)', ctl.balance, 'Optional — used only to estimate your required minimum distribution. Employer plans such as 401(k)s cannot make QCDs directly.'),
          GT.field('Gift you are considering', ctl.gift),
          GT.field('Approximate adjusted gross income', ctl.agi, 'Used for the ½%-of-AGI floor that applies to itemized charitable deductions.'),
          GT.field('Do you itemize deductions?', ctl.itemize)
        ]),
        out
      ]);

      function calc() {
        GT.clear(out);
        var age = s.age, gift = s.gift, r = parseFloat(s.rate);
        if (age < t.qcd.minAge) {
          var wait = Math.ceil(t.qcd.minAge - age);
          GT.append(out, [
            GT.callout('warn', '<p><b>Not eligible yet.</b> QCDs are available once you reach 70½ — about ' + wait + ' year' + (wait === 1 ? '' : 's') + ' from now.</p><p>In the meantime, two ideas: naming {{org}} as a <b>beneficiary of the IRA</b> is one of the most tax-efficient legacy gifts available, and if you own <b>appreciated stock</b>, giving shares is usually better than giving cash.</p>'),
            h('div.actions', [GT.linkBtn('Beneficiary designation guide', GT.toolUrl('beneficiary'), 'primary'), GT.linkBtn('Stock gift calculator', GT.toolUrl('stock'), 'secondary')]),
            GT.advisorQuestions(['Which of my accounts should name a charity as beneficiary, and which should go to family?', 'When I reach 70½, how should QCDs fit into my withdrawal plan?'])
          ]);
          return;
        }
        var limit = t.qcd.annualLimit, capped = Math.min(gift, limit), over = gift > limit;
        var rmd = 0, factor = null;
        if (age >= t.qcd.rmdAge && s.balance > 0) { factor = t.uniformLifetime[Math.min(100, Math.max(72, Math.round(age)))]; rmd = s.balance / factor; }

        // Scenario A: QCD — excluded from income entirely
        var saveQCD = capped * r;
        // Scenario B: withdraw, give cash, deduct (if itemizing) or take the non-itemizer deduction
        var dedRate = GT.deductionRate(r);
        var saveCash, cashNote;
        if (s.itemize === 'yes') {
          var dedAmt = GT.charitableAfterFloor(capped, s.agi);
          saveCash = dedAmt * dedRate;
          cashNote = 'Itemizing: after the ½%-of-AGI floor, ' + money(dedAmt) + ' is deductible' + (dedRate < r ? ', and the deduction is worth at most 35¢ per dollar' : '') + '.';
        } else {
          var ni = GT.nonItemizerDeduction(capped, s.status);
          saveCash = ni * r;
          cashNote = (s.itemize === 'unsure' ? 'Assuming the standard deduction: ' : 'Taking the standard deduction: ') + 'only the ' + money(t.charitable.nonItemizer[s.status]) + ' non-itemizer deduction applies.';
        }
        var advantage = saveQCD - saveCash;
        var rows = [{ label: 'Give from IRA (QCD)', value: saveQCD, tone: 'good' }, { label: 'Withdraw, then give cash', value: saveCash, tone: 'muted' }];

        GT.append(out, [
          h('div.stats', [
            GT.stat('Estimated federal tax saved with a QCD', money(saveQCD), 'The ' + money(capped) + ' never enters your taxable income.', 'good'),
            GT.stat('Versus withdrawing and giving cash', money(saveCash), cashNote, 'muted'),
            GT.stat('QCD advantage', money(Math.max(0, advantage)), advantage > 0 ? 'Roughly ' + pct(advantage / capped, 1) + ' of the gift.' : 'About the same either way for this gift size.', 'highlight')
          ]),
          GT.bars(rows),
          rmd > 0 ? GT.callout('info', '<p><b>Your estimated ' + t.taxYear + ' required minimum distribution is about ' + money(rmd) + '</b> (balance ÷ ' + factor + ', the IRS Uniform Lifetime Table factor at age ' + Math.round(age) + '). ' + (capped >= rmd ? 'A QCD of ' + money(capped) + ' would satisfy the entire RMD' : 'A QCD of ' + money(capped) + ' would satisfy about ' + pct(capped / rmd, 0) + ' of it') + ' — without adding to your income.</p>') : (age >= t.qcd.rmdAge ? GT.callout('info', 'Enter your IRA balance above to estimate your required minimum distribution.') : GT.callout('info', 'You are eligible for QCDs now, though required minimum distributions do not begin until ' + t.qcd.rmdAge + '. Giving from the IRA today still keeps the amount out of your income and shrinks future RMDs.')),
          over ? GT.callout('warn', 'QCDs are capped at <b>' + money(limit) + ' per person</b> in ' + t.taxYear + ' (spouses with their own IRAs each have their own limit). The estimate above uses ' + money(limit) + '; the remainder could be given another way — appreciated stock is often the next-best choice.') : null,
          GT.callout('good', '<p><b>Why the QCD usually wins:</b> a deduction only helps if you itemize and only to the extent it clears the floor, while a QCD reduces income dollar-for-dollar. Lower adjusted gross income can also mean lower Medicare Part B and D premiums (IRMAA) and less of your Social Security being taxed — benefits this calculator does not count.</p>'),
          GT.section('How to make a QCD', h('ol.steps', [
            GT.li('Contact your IRA custodian and ask for a qualified charitable distribution payable to <b>' + o.name + '</b>, EIN <b>' + o.ein + '</b>, ' + o.address + '.'),
            GT.li('Ask that the check be sent directly to {{org}} (or to you, made out to {{org}} — you can forward it, but it must not be payable to you).'),
            h('li', { html: 'Email <a href="mailto:' + o.contactEmail + '">' + o.contactEmail + '</a> so we can watch for it — custodians often omit the donor’s name.' }),
            GT.li('Keep {{org}}’s acknowledgment letter for your tax records. Your custodian will report the distribution on Form 1099-R; you or your preparer mark it as a QCD on your return.')
          ])),
          h('div.actions', [GT.linkBtn('IRA giving instructions', o.urls.ira, 'primary'), GT.linkBtn('Email the giving team', 'mailto:' + o.contactEmail, 'secondary')]),
          letterSection(capped),
          GT.advisorQuestions([
            'How much of my ' + t.taxYear + ' RMD should I direct to charity as a QCD?',
            'Would lowering my AGI with a QCD reduce my Medicare IRMAA surcharge or the taxable share of my Social Security?',
            'I made deductible IRA contributions after age 70½ — does that reduce the amount I can treat as a QCD?',
            'Should I consider the one-time ' + money(t.qcd.splitInterestLimit) + ' QCD into a charitable gift annuity or remainder trust?',
            'Is my state’s treatment of QCDs the same as the federal treatment?'
          ]),
          GT.contactLine()
        ]);
      }
      /* ---- QCD request letter to the custodian ---- */
      var L = { donor: '', address: '', custodian: '', account: '' };
      function txt(ph, ac) { var i = GT.numberInput({ value: '', placeholder: ph }); i.input.type = 'text'; if (ac) i.input.autocomplete = ac; return i; }
      var lDonor = txt('Your full name', 'name'), lAddr = txt('Street, city, state, ZIP', 'street-address'), lCust = txt('e.g. Fidelity, Schwab, Vanguard, Edward Jones'), lAcct = txt('Last four digits are enough');
      var lStatus = h('p.help');
      function letterText(amount) {
        var d = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        return [d, '', (lCust.input.value || '[IRA custodian]') + '\nAttn: Retirement Distributions', '', 'Re: Qualified charitable distribution from IRA ending in ' + (lAcct.input.value || '[account]'),
          '', 'To whom it may concern:', '',
          'Please make a qualified charitable distribution under Internal Revenue Code § 408(d)(8) from my IRA in the amount of ' + money(amount) + ', payable to:', '',
          o.name + '\nTax ID (EIN) ' + o.ein + '\n' + o.address, '',
          'Please send the check directly to the address above (or to me, made payable to the ' + o.name + ', for forwarding). Do not withhold federal or state income tax from this distribution. Please include my name on the check or in the accompanying correspondence so {{org}} can identify the gift, and confirm the date the distribution is made so it can be applied to the ' + t.taxYear + ' tax year.', '',
          'Thank you.', '', '', (lDonor.input.value || '[Your name]') + '\n' + (lAddr.input.value || '[Your address]')].join('\n');
      }
      function letterSection(amount) {
        var btn = GT.button('Download letter (PDF)', function () {
          btn.disabled = true; lStatus.textContent = 'Preparing…';
          GT.makePDF({ title: 'Qualified charitable distribution request', subtitle: 'Letter to IRA custodian', blocks: GT.letterBlocks(letterText(amount)).concat([{ gap: 10 }, { sig: ['Signature', 'Date'] }]), disclaimer: false })
            .then(function (b) { GT.downloadBytes(b, 'qcd-request-letter.pdf'); lStatus.textContent = 'Downloaded. Many custodians also have their own QCD form — this letter works alongside it.'; })
            .catch(function (e) { lStatus.textContent = 'Could not build the PDF (' + e.message + '); use Copy text instead.'; })
            .then(function () { btn.disabled = false; });
        }, 'primary');
        return GT.section('Letter to your IRA custodian', [
          h('p.help', 'Fill in the blanks and download a ready-to-sign request for a ' + money(amount) + ' QCD payable to {{org}}. Nothing you type leaves your browser.'),
          h('div.grid', [GT.field('Your name', lDonor), GT.field('Your mailing address', lAddr), GT.field('IRA custodian', lCust), GT.field('Account number', lAcct)]),
          h('div.actions', [btn, GT.copyButton(function () { return letterText(amount); }, 'Copy letter text')]),
          lStatus
        ]);
      }
      calc();
    }
  });
})(window.TRPLGivingTools);
