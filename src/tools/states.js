/* @tool State-by-State Charitable Tax Benefits
 * An embeddable chart of how every state treats a charitable gift on its
 * income tax — with a dropdown to show just one state and what it means for
 * a gift to the organization. Data: TRPL_TAX.stateCharitable. */
(function (GT) {
  var h = GT.h, T = GT.T, ORG = GT.ORG, money = GT.money, pct = GT.pct;

  var KINDS = {
    all: { label: 'All states' },
    none: { label: 'No income tax', short: 'No income tax', tone: 'muted', desc: 'No state income tax, so the federal rules are the whole story.' },
    nodeduct: { label: 'No charitable deduction', short: 'No deduction', tone: 'warn', desc: 'Has an income tax but gives no deduction or credit for charitable gifts.' },
    federal: { label: 'Follows the federal deduction', short: 'Itemizers deduct', tone: 'good', desc: 'Charitable gifts reduce state tax if you itemize, generally following the federal rules.' },
    nonitemizer: { label: 'Benefit without itemizing', short: 'Non-itemizers too', tone: 'highlight', desc: 'Gives a state benefit for charitable gifts even if you take the federal standard deduction.' },
    credit: { label: 'Credit instead of deduction', short: 'State credit', tone: 'highlight', desc: 'Turns charitable gifts into a state tax credit rather than a deduction.' }
  };

  function count(kind) { var S = window.TRPL_TAX.stateCharitable; return Object.keys(S).filter(function (c) { return S[c].benefit === kind; }).length; }
  var WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  function words(n) { return WORDS[n] || String(n); }

  GT.register('states', {
    title: 'What your state does with your gift',
    intro: 'Federal tax rules are the same everywhere; state rules are not. ' + words(count('none')).replace(/^./, function (c) { return c.toUpperCase(); }) + ' states have no income tax, ' + words(count('nodeduct')) + ' tax income but give nothing for charitable gifts, and a handful reward you even if you never itemize. Pick your state to see how a gift to {{org}} is treated where you live — and which giving method makes the most of it.',
    disclaimerExtra: 'State rules summarized from published guidance as of ' + window.TRPL_TAX.stateCharitableAsOf + '; rates shown are the maximum state (or state plus city) benefit as a share of the gift, before federal effects. Legislatures change these every year. Your preparer has the final word on your state return.',
    render: function (root, GT, opts) {
      var t = T(), o = ORG(), S = t.stateCharitable;
      var codes = Object.keys(S).sort(function (a, b) { return S[a].name < S[b].name ? -1 : 1; });
      var s = GT.state('states', { st: '', kind: 'all' });
      var out = h('div.section');
      var ctl = {
        st: GT.select({ options: [['', 'Show all states']].concat(codes.map(function (c) { return [c, S[c].name]; })), value: '', onChange: function (v) { s.st = v; s.kind = 'all'; draw(); } })
      };
      GT.applyState(ctl, s); this.getState = function () { return s; };
      var chips = h('div.chips');
      GT.append(root, [
        h('div.grid', [GT.field('Your state', ctl.st, 'Where you file your state income tax return.')]),
        chips, out
      ]);

      function deathTax(c) {
        var e = t.stateEstateTax[c], i = t.stateInheritanceTax.indexOf(c) >= 0;
        if (e && i) return 'Estate tax (exemption ' + money(e) + ') and inheritance tax';
        if (e) return 'Estate tax above ' + money(e);
        if (i) return 'Inheritance tax';
        return 'None';
      }
      function tag(kind) { return h('span.tag.' + (KINDS[kind].tone || 'muted'), KINDS[kind].short); }

      function drawChips() {
        GT.clear(chips);
        if (s.st) return;
        Object.keys(KINDS).forEach(function (k) {
          var n = k === 'all' ? codes.length : codes.filter(function (c) { return S[c].benefit === k; }).length;
          chips.appendChild(h('button.chip' + (s.kind === k ? '.on' : ''), { type: 'button', on: { click: function () { s.kind = k; draw(); } } }, KINDS[k].label + ' (' + n + ')'));
        });
      }

      function table(list) {
        return h('div.tablewrap', [h('table.trpl-table', [
          h('thead', [h('tr', [h('th', 'State'), h('th', 'Income tax'), h('th', 'Charitable gifts'), h('th.num', 'Top state benefit'), h('th', 'Estate or inheritance tax')])]),
          h('tbody', list.map(function (c) {
            var r = S[c];
            return h('tr', { on: { click: function () { s.st = c; ctl.st.input.value = c; draw(); } }, style: { cursor: 'pointer' } }, [
              h('td', [h('b', r.name)]),
              h('td', r.benefit === 'none' ? 'No' : 'Yes'),
              h('td', [tag(r.benefit)]),
              h('td.num', r.rate ? pct(r.rate, 2) : '—'),
              h('td', deathTax(c))
            ]);
          }))
        ])]);
      }

      function advice(c) {
        var r = S[c], items = [], links = [];
        var nd = c === 'ND' && o.features && o.features.ndCredit;
        if (r.benefit === 'none') {
          items.push('There is no state income tax to reduce, so your gift’s tax value is entirely federal: the non-itemizer deduction (' + money(t.charitable.nonItemizer.single) + ' single / ' + money(t.charitable.nonItemizer.mfj) + ' joint for cash gifts), itemized deductions above the ½%-of-AGI floor, or a QCD from your IRA.');
          items.push('Gifts of appreciated stock still avoid federal capital gains tax — and ' + r.name + ' has no capital gains tax to avoid, so the federal saving is the whole benefit.');
        } else if (r.benefit === 'nodeduct') {
          items.push(r.name + ' taxes your income but gives no deduction for gifts. ' + (r.retirementExempt ? (r.note || '') + ' Your gift’s tax value is federal: the non-itemizer deduction, itemized deductions, or a QCD.' : 'The one gift that <i>does</i> lower your state tax is a qualified charitable distribution from an IRA (age 70½+): the withdrawal never enters your income, so it is never taxed by the state either.' + (r.note ? ' ' + r.note : '')));
          items.push('Gifts of appreciated stock avoid capital gains tax at both levels, since ' + r.name + ' taxes gains as ordinary income.');
          links.push(['Give from your IRA', GT.toolUrl('qcd')], ['Stock gift calculator', GT.toolUrl('stock')]);
        } else if (r.benefit === 'nonitemizer') {
          items.push('You get a state benefit for giving even if you take the federal standard deduction — which most donors now do. ' + (r.note || ''));
          items.push('If you are close to itemizing, bunching two years of gifts into one can clear the federal threshold while ' + r.name + ' rewards you either way.');
          links.push(['Bunching comparison', GT.toolUrl('bunching')], ['Give from your IRA', GT.toolUrl('qcd')]);
        } else if (r.benefit === 'credit') {
          items.push(r.note || (r.name + ' uses a credit rather than a deduction.'));
          items.push('Credits are worth the same to every taxpayer regardless of bracket, so smaller, steady gifts capture the benefit as well as large ones. A monthly gift is a good fit.');
          links.push(['Monthly giving', GT.toolUrl('monthly')]);
        } else {
          items.push('Your gift reduces ' + r.name + ' tax when you itemize on the state return, worth up to about ' + pct(r.rate, 1) + ' of the gift on top of the federal saving.' + (r.note ? ' ' + r.note : ''));
          if (r.rate >= 0.07) { items.push('At ' + r.name + '’s rates, a gift of appreciated stock is worth noticeably more than the federal-only estimate: you avoid state capital gains tax too. Bunching gifts to itemize in alternate years also pays off more here than in low-rate states.'); links.push(['Stock gift calculator', GT.toolUrl('stock')], ['Bunching comparison', GT.toolUrl('bunching')]); }
          else if (!nd) { items.push('If you take the standard deduction, a QCD from your IRA (age 70½+) is the simplest way to get a state benefit, because the distribution is excluded from the income ' + r.name + ' starts from.'); links.push(['Give from your IRA', GT.toolUrl('qcd')]); }
        }
        if (nd) { items.push('<b>The big one:</b> North Dakota’s 40% credit for gifts to {{org}}’s endowment and for planned gifts — worth up to ' + money(t.ndCredit.maxIndividual) + ' per person or ' + money(t.ndCredit.maxJoint) + ' filing jointly, roughly twenty times what the deduction alone saves at North Dakota’s rates.'); links.unshift(['ND tax credit calculator', GT.toolUrl('ndcredit')]); }
        var dt = deathTax(c);
        if (dt !== 'None') { items.push(r.name + ' has ' + (dt.charAt(0).toLowerCase() + dt.slice(1)) + '. A gift in your will or a beneficiary designation to {{org}} reduces the taxable estate at the state level as well as the federal.'); links.push(['Estate tax estimator', GT.toolUrl('estate')]); }
        else items.push(r.name + ' has no estate or inheritance tax; only the federal estate tax (above ' + money(t.estate.exemption) + ') applies.');
        links.push(['Giving Navigator', GT.toolUrl('navigator')]);
        return { items: items, links: links };
      }

      function draw() {
        GT.clear(out); drawChips();
        if (s.st && S[s.st]) {
          var c = s.st, r = S[c], a = advice(c);
          GT.append(out, [
            h('div.stats', [
              GT.stat('State income tax', r.benefit === 'none' ? 'None' : 'Yes', r.benefit === 'none' ? 'Federal rules only.' : '', 'muted'),
              GT.stat('Charitable gifts', KINDS[r.benefit].short, KINDS[r.benefit].desc, KINDS[r.benefit].tone),
              GT.stat('Top state benefit', r.rate ? pct(r.rate, 2) : '—', r.rate ? 'Of each dollar given, at the highest rate.' : 'No state income-tax saving.', r.rate ? 'good' : 'muted'),
              GT.stat('Estate or inheritance tax', deathTax(c) === 'None' ? 'None' : 'Yes', deathTax(c) === 'None' ? '' : deathTax(c), deathTax(c) === 'None' ? 'muted' : 'warn')
            ]),
            GT.section('What it means for a gift to {{org}}', GT.list(a.items)),
            h('div.actions', a.links.map(function (l, i) { return GT.linkBtn(l[0], l[1], i === 0 ? 'primary' : 'secondary'); })),
            GT.button('Show all states', function () { s.st = ''; ctl.st.input.value = ''; draw(); }, 'link'),
            GT.advisorQuestions([
              'How does ' + r.name + ' treat my charitable gifts this year — deduction, subtraction, credit, or nothing — and does it matter whether I itemize federally?',
              'Would a qualified charitable distribution from my IRA lower my state tax as well as my federal tax?',
              'Does ' + r.name + ' tax capital gains as ordinary income, and how much would a gift of appreciated stock save me at the state level?',
              dt(c) ? 'Is my estate likely to owe ' + r.name + ' estate or inheritance tax, and how would a charitable bequest change that?' : 'Are there any ' + r.name + ' credits or incentives for gifts to out-of-state charities that I should know about?'
            ]),
            GT.contactLine()
          ]);
        } else {
          var list = s.kind === 'all' ? codes : codes.filter(function (x) { return S[x].benefit === s.kind; });
          GT.append(out, [
            s.kind !== 'all' ? GT.callout('info', '<b>' + KINDS[s.kind].label + '.</b> ' + KINDS[s.kind].desc) : null,
            table(list),
            h('p.help', { html: 'Tap a state for what it means for your gift. Rates are the top state (and city) benefit per dollar given, as of ' + t.stateCharitableAsOf + '. No state outside North Dakota offers a credit for gifts to {{org}}; the endowment credits in Montana, Iowa, Kentucky, Maryland, and Mississippi apply only to in-state organizations.' }),
            GT.contactLine()
          ]);
        }
        function dt(c) { return deathTax(c) !== 'None'; }
      }
      draw();
    }
  });
})(window.TRPLGivingTools);
