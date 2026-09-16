/* @tool Giving Navigator
 * A short, friendly set of questions that points a visitor to the giving
 * method(s) that best fit their situation, with reasons, next steps, links
 * to the right trlibrary.com page and companion tool, and a tailored list of
 * questions to bring to their advisor. Designed for the top of /support. */
(function (GT) {
  var h = GT.h, ORG = GT.ORG, T = GT.T, money = GT.money, pctFmt = GT.pct;

  var STEPS = [
    { key: 'goal', q: 'What would you like to do?', help: 'There is no wrong answer — this just helps us point you in the right direction.', type: 'radio', options: [
      ['now', '<b>Make a gift now</b> — support the Library this year'],
      ['later', '<b>Plan a gift for later</b> — through my will, trust, or accounts'],
      ['income', '<b>Give and receive income back</b> — a gift that pays me or a loved one'],
      ['explore', '<b>I’m not sure yet</b> — show me my options']] },
    { key: 'assets', q: 'What might you give from?', help: 'Choose everything that applies. Different assets have very different tax treatment — this is where most of the smart ideas come from.', type: 'checks', options: [
      ['cash', 'Cash, checking, or savings'],
      ['stock', 'Stocks, mutual funds, or ETFs I have held more than a year'],
      ['ira', 'An IRA or other retirement account'],
      ['daf', 'A donor-advised fund I already have'],
      ['estate', 'My estate, will, or a life insurance policy'],
      ['other', 'Real estate, a business interest, crypto, or other property']] },
    { key: 'age', q: 'Which age range are you in?', help: 'Some options open up at 59½ and again at 70½.', type: 'radio', options: [
      ['u59', 'Under 59½'], ['59', '59½ to 70'], ['70', '70½ or older']] },
    { key: 'itemize', q: 'Do you itemize deductions on your federal return?', help: 'Most households take the standard deduction. If you are not sure, that is a fine answer.', type: 'radio', options: [
      ['yes', 'Yes, I itemize'], ['no', 'No, I take the standard deduction'], ['unsure', 'Not sure']] },
    { key: 'size', q: 'Roughly how much are you thinking about?', help: 'A ballpark is plenty. It only changes which ideas rise to the top.', type: 'radio', options: [
      ['s', 'Under $1,000'], ['m', '$1,000 – $10,000'], ['l', '$10,000 – $100,000'], ['xl', 'More than $100,000']] },
    { key: 'nd', q: 'Do you pay North Dakota income tax?', help: 'North Dakota gives a 40% state tax credit for endowment and planned gifts to the Library — worth up to $10,000 per person. Residents and some nonresidents with North Dakota income can use it.', type: 'radio', options: [
      ['yes', 'Yes'], ['no', 'No'], ['unsure', 'Not sure']] },
    { key: 'match', q: 'Does your employer match charitable gifts?', help: 'Many companies match employee gifts 1:1 or better. Retirees are sometimes eligible too.', type: 'radio', options: [
      ['yes', 'Yes'], ['no', 'No'], ['unsure', 'Not sure']] }
  ];

  function recommend(a) {
    var o = ORG(), t = T(), u = o.urls, tools = u.tools;
    var recs = [], qs = [];
    var has = function (k) { return a.assets.indexOf(k) >= 0; };
    var big = a.size === 'l' || a.size === 'xl';
    var lim = money(t.qcd.annualLimit);

    if (has('ira') && a.age === '70') {
      recs.push({ score: 100, title: 'Give directly from your IRA (Qualified Charitable Distribution)', tag: 'Strong fit',
        why: 'At 70½ or older you can send up to ' + lim + ' a year from an IRA straight to the Library. The amount never shows up in your taxable income, which beats a deduction for most people — and if you are ' + t.qcd.rmdAge + ' or older it can count toward your required minimum distribution.',
        next: 'Ask your IRA custodian for a “qualified charitable distribution” payable to ' + o.name + ' (EIN ' + o.ein + ').',
        links: [['How to give from your IRA', u.ira], ['Estimate your QCD savings', tools + 'tools/qcd.html']] });
      qs.push('Should part or all of my required minimum distribution go to charity as a QCD this year?');
      qs.push('Would keeping this out of my adjusted gross income help with Medicare premiums or the taxation of my Social Security?');
    } else if (has('ira') && a.age !== '70') {
      recs.push({ score: 55, title: 'Name the Library as a beneficiary of your retirement account', tag: 'Tax-smart for later',
        why: 'Retirement accounts are often the most heavily taxed asset heirs can inherit. Leaving a percentage to the Library costs your family less than leaving them the same dollars in other assets — and it takes minutes on a beneficiary form, no attorney needed.',
        next: 'Log in to your plan or IRA account and add ' + o.name + ' (EIN ' + o.ein + ') as a primary or contingent beneficiary for a percentage of your choice.',
        links: [['Beneficiary designation guide', tools + 'tools/beneficiary.html'], ['Heritage Society', u.heritage]] });
      if (a.age === 'u59' && a.goal === 'now') qs.push('Withdrawing from a retirement account before 59½ usually triggers a 10% penalty. Is there a better asset to give from now?');
      qs.push('Which of my assets are best left to charity and which to family, given how each is taxed when inherited?');
    }

    if (has('stock')) {
      recs.push({ score: 90, title: 'Give appreciated stock or fund shares', tag: 'Strong fit',
        why: 'When you give shares held more than a year, you generally avoid capital gains tax on the growth and may deduct the full market value if you itemize. The Library receives more, and it costs you less than selling and giving cash.',
        next: 'Ask your broker to transfer shares to the Library’s brokerage account — the transfer instructions are on the stock gift page.',
        links: [['Stock gift instructions', u.stock], ['Compare giving shares vs. cash', tools + 'tools/stock.html']] });
      qs.push('Which of my holdings has the largest unrealized gain and has been held longer than a year?');
    }

    if (has('daf')) {
      recs.push({ score: 85, title: 'Recommend a grant from your donor-advised fund', tag: 'Easy today',
        why: 'You already took the deduction when you funded the DAF, so a grant to the Library is the simplest way to give. Most sponsors let you set it up online in a few minutes.',
        next: 'Log in to your fund sponsor and recommend a grant to ' + o.name + ' (EIN ' + o.ein + ').',
        links: [['DAF grant guide', tools + 'tools/daf.html'], ['Donor-advised funds', u.daf]] });
      qs.push('Should I name the Library as a successor or beneficiary of my donor-advised fund?');
    }

    if (a.goal === 'later' || has('estate') || a.goal === 'explore') {
      recs.push({ score: a.goal === 'later' ? 95 : 60, title: 'Include the Library in your will or trust', tag: a.goal === 'later' ? 'Strong fit' : 'Worth considering',
        why: 'A gift in your will costs nothing today, can be a fixed amount or a percentage, and can be changed at any time. It is how most legacy gifts are made, and it qualifies you for the ' + o.legacySociety + '.',
        next: 'Share the sample language with your attorney, or add it when you next update your plan. Then let us know so we can thank you.',
        links: [['Write your bequest language', tools + 'tools/bequest.html'], ['Heritage Society', u.heritage]] });
      qs.push('Would a percentage of my estate or a specific dollar amount make more sense for my family?');
      qs.push('Does my current will or trust reflect the charities I care about today?');
      if (has('estate') || a.size === 'xl') {
        recs.push({ score: 50, title: 'See how a charitable bequest affects estate tax', tag: 'Planning aid',
          why: 'Federal estate tax applies only above ' + money(t.estate.exemption) + ' per person in ' + t.taxYear + ', but a dozen states tax much smaller estates. Charitable bequests are fully deductible from the taxable estate.',
          next: 'Run a rough estimate, then bring it to your estate attorney.',
          links: [['Estate tax estimator', tools + 'tools/estate.html']] });
      }
    }

    if (a.goal === 'income') {
      recs.push({ score: 92, title: 'Explore a gift that pays you income', tag: 'Talk with an advisor',
        why: 'Charitable gift annuities and charitable remainder trusts let you make a gift now, receive payments for life or a term of years, and take a partial deduction. ' + (o.offersGiftAnnuities ? 'The Library can issue gift annuities directly.' : 'The Library does not currently issue gift annuities itself, but a community foundation or your advisor can set one up that ultimately benefits the Library.'),
        next: 'Use the illustrator to see ballpark numbers, then ask your advisor which vehicle fits.',
        links: [['Life-income gift illustrator', tools + 'tools/lifeincome.html']] });
      qs.push('Is a charitable gift annuity or a charitable remainder trust a better fit for my income needs and my heirs?');
      qs.push('If I funded a life-income gift with appreciated stock, how would the capital gains be treated?');
    }

    if (has('cash') && a.goal !== 'later') {
      var ni = t.charitable.nonItemizer;
      var cashWhy = a.itemize === 'no'
        ? 'Starting in ' + t.taxYear + ', you can deduct up to ' + money(ni.single) + ' (' + money(ni.mfj) + ' for joint filers) of cash gifts even without itemizing.'
        : 'A gift today is the fastest way to make an impact. If you itemize, gifts above ½% of your adjusted gross income are deductible.';
      recs.push({ score: a.size === 's' ? 80 : 45, title: 'Make a gift online today', tag: 'Simple',
        why: cashWhy + (a.size === 's' ? ' Monthly giving turns a modest amount into steady, year-round support.' : ''),
        next: 'Give once or set up a monthly gift in about a minute.',
        links: [['Give now', u.donate], ['Monthly giving calculator', tools + 'tools/monthly.html']] });
      if (big && a.itemize !== 'yes') {
        recs.push({ score: 70, title: 'Consider “bunching” several years of giving', tag: 'Tax idea',
          why: 'If you normally take the standard deduction, combining two or three years of gifts into one year — often through a donor-advised fund — can lift you over the itemizing threshold and save real money, while you keep supporting the Library every year.',
          next: 'Compare an every-year plan with a bunched plan.',
          links: [['Bunching comparison', tools + 'tools/bunching.html']] });
        qs.push('Would bunching my charitable gifts into one tax year let me itemize, and is a donor-advised fund the right way to do it?');
      }
      if (a.itemize === 'yes' || a.itemize === 'unsure') qs.push('Am I better off itemizing this year, and how does the ½%-of-AGI floor on charitable deductions affect me?');
    }

    if (has('other')) {
      recs.push({ score: 65, title: 'Talk with us about real estate, business interests, or other property', tag: 'Let’s talk',
        why: 'Gifts of property can be powerful and tax-efficient, but each one is different and needs an appraisal and a conversation before anything is transferred.',
        next: 'Email ' + o.contactEmail + ' and we will walk through it with you and your advisors.',
        links: [['Email the giving team', 'mailto:' + o.contactEmail]] });
      qs.push('What appraisal and paperwork does the IRS require for a gift of property, and what is the deduction based on?');
    }

    if ((a.nd === 'yes' || a.nd === 'unsure') && (big || a.size === 'm' || a.goal === 'income')) {
      var nd = t.ndCredit;
      recs.push({ score: a.nd === 'yes' ? 88 : 58, title: 'Claim North Dakota’s 40% charitable giving tax credit', tag: a.nd === 'yes' ? 'Strong fit' : 'If you pay ND tax',
        why: 'Gifts of ' + money(nd.minGift) + ' or more to the Library’s endowment — and planned gifts like gift annuities or remainder trusts — earn a North Dakota income tax credit of ' + pctFmt(nd.rate) + ' of the gift, up to ' + money(nd.maxIndividual) + ' per person or ' + money(nd.maxJoint) + ' for couples filing jointly, with a three-year carryforward. Combined with federal benefits, a large gift can cost less than half its face value.',
        next: 'Run the numbers, then ask us how to designate your gift to the endowment so it qualifies.',
        links: [['ND tax credit calculator', tools + 'tools/ndcredit.html'], ['Email the giving team', 'mailto:' + o.contactEmail]] });
      qs.push('Do I have enough North Dakota tax liability over the next four years to use the full 40% credit, and how does the credit affect my federal deduction?');
    }

    if (a.match === 'yes' || a.match === 'unsure') {
      recs.push({ score: 40, title: 'Double your gift with an employer match', tag: 'Free money',
        why: 'Many employers match gifts to nonprofits like the Library — sometimes 2:1 — and some match retirees’ gifts too.',
        next: 'Check your HR portal or the matching gifts page and submit the request after you give.',
        links: [['Matching gifts', u.matching], ['Matching gift impact', tools + 'tools/matching.html']] });
    }

    if (!recs.length) {
      recs.push({ score: 50, title: 'Start with a conversation', tag: 'Next step',
        why: 'Every situation is a little different. A short email is often the fastest way to find the right fit.',
        next: 'Email ' + o.contactEmail + '.', links: [['Email the giving team', 'mailto:' + o.contactEmail], ['Ways to give', u.support]] });
    }
    if (!qs.length) qs.push('Which of my assets would be most tax-efficient to give, now or later?');
    qs.push('How would this gift fit with the rest of my financial and estate plan?');
    recs.sort(function (x, y) { return y.score - x.score; });
    return { recs: recs, qs: qs };
  }

  GT.register('navigator', {
    title: 'Find the right way to give',
    intro: 'Answer seven quick questions and we’ll point you to the giving options that fit your situation — plus the questions worth asking your advisor.',
    disclaimerExtra: 'The Navigator suggests options to explore; it does not recommend a specific transaction.',
    render: function (root) {
      var a = { goal: null, assets: [], age: null, itemize: null, size: null, nd: null, match: null }, step = 0;
      var view = h('div.section'), first = true; root.appendChild(view);

      function progress() { return h('div.progress', STEPS.map(function (_, i) { return h('span' + (i <= step ? '.on' : '')); })); }
      function renderStep() {
        GT.clear(view);
        var s = STEPS[step];
        var ctrl = s.type === 'checks'
          ? GT.checks({ options: s.options, value: a.assets, onChange: function (v) { a.assets = v; } })
          : GT.radios({ options: s.options, value: a[s.key], stacked: true, onChange: function (v) { a[s.key] = v; setTimeout(next, 180); } });
        var nextBtn = GT.button(step === STEPS.length - 1 ? 'See my options' : 'Continue', next, 'primary');
        var back = step > 0 ? GT.button('Back', function () { step--; renderStep(); }, 'secondary') : null;
        GT.append(view, [progress(), h('p.eyebrow', 'Question ' + (step + 1) + ' of ' + STEPS.length), h('h3.question', s.q), h('p.help', s.help), ctrl.el, h('div.actions', [back, nextBtn])]);
        if (!first) view.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        first = false;
      }
      function next() {
        var s = STEPS[step];
        if (s.type === 'radio' && !a[s.key]) return;
        if (s.type === 'checks' && !a.assets.length) { a.assets = ['cash']; }
        if (step < STEPS.length - 1) { step++; renderStep(); } else renderResults();
      }
      function renderResults() {
        GT.clear(view);
        var r = recommend(a);
        GT.append(view, [
          h('p.eyebrow', 'Your options'),
          h('h3.question', 'Here’s where we’d start'),
          h('p.help', 'Ranked for your answers. Each card links to the Library page with instructions and, where useful, a calculator to test the idea with your own numbers.'),
          r.recs.map(function (rec, i) {
            return h('div.rec' + (i === 0 ? '.top' : ''), [
              h('span.tag', (i === 0 ? '★ ' : '') + rec.tag), h('h4', rec.title), h('p', rec.why), h('p', { html: '<b>Next step:</b> ' + rec.next }),
              h('div.actions', rec.links.map(function (l, j) { return GT.linkBtn(l[0], l[1], j === 0 ? 'primary' : 'secondary'); }))
            ]);
          }),
          GT.advisorQuestions(r.qs),
          GT.contactLine(),
          h('div.actions', [GT.button('Start over', function () { a = { goal: null, assets: [], age: null, itemize: null, size: null, nd: null, match: null }; step = 0; renderStep(); }, 'secondary')])
        ]);
        view.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
      renderStep();
    }
  });
})(window.TRPLGivingTools);
