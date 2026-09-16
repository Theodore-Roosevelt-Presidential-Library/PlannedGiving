/* @tool Letter of Intent (legacy society)
 * "I've included {{org}} in my plans." Embeds the DonorPerfect intent
 * form when a URL is configured; otherwise builds a pre-filled email. */
(function (GT) {
  var h = GT.h, ORG = GT.ORG;

  GT.register('intent', {
    share: false,
    title: 'Tell us about your legacy gift',
    intro: 'Have you included {{org}} in your will, trust, or as a beneficiary of an account? Letting us know lets us thank you, make sure we understand your wishes, and welcome you to the ' + window.TRPL_ORG.legacySociety + '. Any details you share stay confidential and are never binding.',
    disclaimerExtra: 'Sharing your intentions does not create a legal obligation and can be revised at any time.',
    render: function (root, GT, opts) {
      var o = ORG();
      var url = o.urls.intentForm;
      if (url && opts.embedForm !== 'false') {
        GT.append(root, [
          h('iframe', { src: url, title: 'Legacy gift intention form', style: { width: '100%', minHeight: (opts.formHeight || 900) + 'px', border: 0, borderRadius: '10px', background: '#fff' }, loading: 'lazy' }),
          h('p.help', { html: 'Prefer email? Write to <a href="mailto:' + o.contactEmail + '">' + o.contactEmail + '</a>.' }),
          GT.intentStatementSection()
        ]);
        return;
      }
      // Fallback: build a pre-filled email
      var s = { name: '', email: '', phone: '', type: 'will', anon: false, share: '' };
      function txt(placeholder) { var i = GT.numberInput({ value: '', placeholder: placeholder }); i.input.type = 'text'; return i; }
      var name = txt('Your name'), email = txt('you@example.com'), phone = txt('Optional');
      email.input.type = 'email'; phone.input.type = 'tel';
      var type = GT.radios({ stacked: true, options: [['will', 'A gift in my will or trust'], ['beneficiary', 'A beneficiary designation (retirement account, life insurance, DAF, or TOD account)'], ['other', 'Another kind of planned gift'], ['considering', 'I’m still considering and would like to talk']], value: 'will', onChange: function (v) { s.type = v; } });
      var anon = GT.checkbox('Please keep my gift anonymous in any public recognition', { onChange: function (v) { s.anon = v; } });
      var share = h('textarea.textout', { placeholder: 'Anything you would like us to know — the purpose you have in mind, who to thank, or questions for us.', style: { minHeight: '110px' } });
      function body() {
        var label = { will: 'a gift in my will or trust', beneficiary: 'a beneficiary designation', other: 'a planned gift', considering: 'that I am considering a planned gift and would like to talk' }[s.type];
        return 'Hello,\n\nI would like to let you know about ' + label + ' for the ' + o.name + '.\n\nName: ' + name.input.value + '\nEmail: ' + email.input.value + '\nPhone: ' + phone.input.value + '\nAnonymous recognition: ' + (s.anon ? 'Yes' : 'No') + '\n\n' + share.value + '\n\nThank you.';
      }
      var send = h('a.btn.primary', { href: '#', on: { click: function (e) { e.preventDefault(); location.href = 'mailto:' + o.contactEmail + '?subject=' + encodeURIComponent(GT.brandify('Legacy gift intention — ' + (name.input.value || o.legacySociety))) + '&body=' + encodeURIComponent(GT.brandify(body())); } } }, 'Send by email');
      GT.append(root, [
        h('div.grid', [GT.field('Name', name), GT.field('Email', email), GT.field('Phone', phone)]),
        GT.field('What would you like to tell us about?', type),
        h('div', [anon.el]),
        GT.field('Notes (optional)', { el: share, input: share }),
        h('div.actions', [send, GT.copyButton(body, 'Copy message instead')]),
        GT.callout('info', 'This opens a message in your own email program addressed to <b>' + o.contactEmail + '</b>. Nothing is sent until you press send.'),
        GT.intentStatementSection(function () { return { will: 'a gift in my/our will or trust', beneficiary: 'a beneficiary designation', other: 'a planned gift', considering: 'a planned gift under consideration' }[s.type]; }, function () { return share.value; }),
        GT.contactLine()
      ]);
    }
  });
})(window.TRPLGivingTools);
