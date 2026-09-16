/* @tool Year-End Giving Deadlines
 * Tells a donor, for the gift type they choose, when to start so the gift
 * counts in the current tax year — and what "counts" means for each type. */
(function (GT) {
  var h = GT.h, T = GT.T, ORG = GT.ORG;

  var TYPES = {
    online: { label: 'Credit card or online gift', lead: 0, rule: 'A credit-card gift counts on the date the charge is made — even if you pay the card bill next year. Online gifts made before midnight on December 31 (your local time) count for this year.', steps: ['Give online any time through December 31.', 'Save the emailed receipt; {{org}}’s year-end summary follows in January.'] },
    check: { label: 'Check by mail', lead: 3, rule: 'A mailed check counts on the postmark date (the “mailbox rule”), as long as the check clears in the ordinary course. Hand-delivered checks count when delivered.', steps: ['Mail by December 31 with a clear postmark; consider sending it certified late in the month.', 'Write the purpose (e.g., “endowment”) in the memo line.', 'Keep a copy of the check and the postmark receipt.'] },
    stock: { label: 'Stock or mutual fund shares', lead: 14, rule: 'A gift of securities counts on the date the shares arrive in {{org}}’s brokerage account — not the date you ask for the transfer. Mutual fund transfers can take two to four weeks.', steps: ['Send your broker the transfer instructions at least two weeks before year-end (three to four for mutual funds).', 'Email {{org}} so it can watch for the shares and value them on arrival.', 'Your deduction is the average of the high and low price on the day the shares arrive.'] },
    qcd: { label: 'IRA qualified charitable distribution', lead: 21, rule: 'A QCD counts when the funds leave your IRA and reach the charity. If your custodian issues you a checkbook for the IRA, the check must clear by December 31 — so mail those by mid-December.', steps: ['Request the distribution from your custodian by early December; many have year-end cutoffs.', 'Ask that the check be payable to {{org}} and sent directly, or to you for forwarding.', 'Tell {{org}} it is coming — custodian checks often arrive with no donor name.'] },
    daf: { label: 'Donor-advised fund grant', lead: 0, rule: 'Your deduction happened when you funded the DAF, so a grant recommendation has no tax deadline for you. Sponsors do have year-end cutoffs for processing, and {{org}} appreciates receiving grants before year-end for budgeting.', steps: ['Recommend the grant by your sponsor’s published cutoff (often mid-December).', 'Contributions *to* your DAF follow the rules for the asset you contribute (cash, check, or stock above).'] },
    dafFund: { label: 'Contribution to your donor-advised fund', lead: 10, rule: 'Contributions to a DAF are deductible when the sponsor receives them. Cash and wire gifts are quick; securities and complex assets need lead time, and most sponsors publish December cutoffs for each asset type.', steps: ['Check your sponsor’s year-end deadline calendar.', 'Initiate securities transfers at least two weeks early.'] },
    wire: { label: 'Wire or ACH transfer', lead: 3, rule: 'A wire counts when received by {{org}}’s bank. Domestic wires usually settle the same business day; ACH can take two to three business days.', steps: ['Request {{org}}’s wire instructions from ' + ORG().contactEmail + '.', 'Send by December 29 to allow for bank processing.'] },
    property: { label: 'Real estate, business interests, or other property', lead: 60, rule: 'Property gifts count when title transfers. They require a qualified appraisal (for deductions over $5,000), {{org}}’s acceptance review, and often environmental or title work.', steps: ['Start the conversation with {{org}} at least two months before year-end.', 'Line up a qualified appraiser; the appraisal can be dated no earlier than 60 days before the gift.', 'Expect to file Form 8283 Section B with the appraiser’s and {{org}}’s signatures.'] },
    endowment: { label: 'Endowment gift for the North Dakota tax credit', lead: 14, rule: 'The gift must be completed in the tax year you claim the credit, by the rules above for whatever asset you give, and {{org}} must issue its qualification letter for your Schedule ND-1QEC.', steps: ['Designate the gift for the endowment when you give.', 'Request the qualification letter from {{org}}.', 'If giving stock or by QCD, follow those lead times.'] }
  };

  GT.register('deadlines', {
    title: 'When to give so it counts this year',
    intro: 'Year-end gifts count only if they are complete in time — and “complete” means something different for a check, a stock transfer, and an IRA distribution. Pick your gift type to see the rule and a start-by date.',
    disclaimerExtra: 'Lead times are practical estimates; custodians, brokers, and fund sponsors set their own cutoffs, which are usually published in early December.',
    render: function (root) {
      var o = ORG(), t = T();
      var s = GT.state('deadlines', { type: 'stock' }); this.getState = function () { return s; };
      var out = h('div.section');
      var ctl = { type: GT.radios({ stacked: true, options: Object.keys(TYPES).filter(function (k) { return k !== 'endowment' || (o.features && o.features.ndCredit); }).map(function (k) { return [k, TYPES[k].label]; }), value: s.type, onChange: function (v) { s.type = v; calc(); } }) };
      GT.applyState(ctl, s);
      GT.append(root, [GT.field('What are you giving?', ctl.type), out]);
      function fmt(d) { return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }); }
      function calc() {
        GT.clear(out);
        var ty = TYPES[s.type], now = new Date(), year = now.getFullYear();
        var yearEnd = new Date(year, 11, 31), startBy = new Date(yearEnd); startBy.setDate(startBy.getDate() - ty.lead);
        // Dec 31 falls on a weekend some years: brokers and banks are closed
        var dow = yearEnd.getDay(), lastBiz = new Date(yearEnd); if (dow === 6) lastBiz.setDate(30); if (dow === 0) lastBiz.setDate(29);
        var daysLeft = Math.ceil((startBy - now) / 864e5);
        var late = daysLeft < 0, tight = daysLeft >= 0 && daysLeft <= 7;
        GT.append(out, [
          h('div.stats', [
            GT.stat('Start by', ty.lead ? fmt(startBy) : 'December 31', ty.lead ? 'About ' + ty.lead + ' days before year-end.' : 'No lead time needed.', late ? 'highlight' : 'good'),
            GT.stat('Last business day of ' + year, fmt(lastBiz), 'Banks and brokers are closed on weekends and January 1.', 'muted'),
            GT.stat(late ? 'Days past the start-by date' : 'Days until the start-by date', String(Math.abs(daysLeft)), late ? 'It may still be possible — call your custodian or broker today and tell {{org}}.' : tight ? 'Act this week.' : 'Comfortable, if you start on time.', late ? 'highlight' : tight ? 'highlight' : 'muted')
          ]),
          GT.callout('info', '<p><b>When it counts:</b> ' + ty.rule + '</p>'),
          GT.section('What to do', h('ol.steps', ty.steps.map(function (x) { return GT.li(x.replace(/\*([^*]+)\*/g, '<i>$1</i>')); }))),
          late ? GT.callout('warn', 'If the gift cannot be completed by December 31, it will count for <b>' + (year + 1) + '</b> — still a wonderful gift, just a different tax year. A credit-card gift or DAF grant can be made instantly if timing matters.') : null,
          s.type === 'stock' ? GT.callout('good', 'Tip: most brokers process electronic (DTC) transfers of listed stocks in one to three business days when the instructions are complete. The two-week cushion is for mutual funds, paper certificates, and the December rush.') : null,
          h('div.actions', [GT.linkBtn('Give now', o.urls.donate, 'primary'), s.type === 'stock' ? GT.linkBtn('Stock gift calculator', GT.toolUrl('stock'), 'secondary') : null, s.type === 'qcd' ? GT.linkBtn('IRA giving calculator', GT.toolUrl('qcd'), 'secondary') : null, s.type === 'endowment' ? GT.linkBtn('ND tax credit calculator', GT.toolUrl('ndcredit'), 'secondary') : null, GT.linkBtn('Email the giving team', 'mailto:' + o.contactEmail, 'secondary')]),
          GT.advisorQuestions(['Which tax year do I want this gift to fall in, given my income this year and next?', 'Does my custodian, broker, or fund sponsor have a published year-end cutoff for this kind of transfer?', 'Should part of this gift wait until January to bunch with next year’s giving?']),
          GT.contactLine()
        ]);
      }
      calc();
    }
  });
})(window.TRPLGivingTools);
