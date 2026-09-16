/* ============================================================================
 * TRPL Giving Tools — ORGANIZATION CONFIG
 * ----------------------------------------------------------------------------
 * Institutional facts and URLs. Any embed can override a value with a
 * data-attribute (e.g. data-intent-form-url="...") — see docs/EMBED.md.
 * ========================================================================== */
window.TRPL_ORG = {
  name: 'Theodore Roosevelt Presidential Library Foundation',
  shortName: 'the Library',
  ein: '47-1324043',
  address: '1401 East Calgary Ave, Suite 210, Bismarck, ND 58503',
  city: 'Bismarck', state: 'ND', stateName: 'North Dakota',
  taxStatus: '501(c)(3) nonprofit',
  legacySociety: 'Heritage Society',
  /* One sentence used in thank-you letters; keep it short. */
  missionLine: 'Your support helps the Library carry Theodore Roosevelt’s example of citizenship, conservation, and leadership to new generations.',
  /* Name of a community foundation donors in your region may use for DAFs (or '' to omit). */
  communityFoundation: 'North Dakota Community Foundation',

  /* Feature switches. A fork outside North Dakota sets ndCredit: false, which
   * drops the ND credit tool, the Navigator's ND question, the endowment-credit
   * deadline entry, and the ND qualification letter in the staff tool. */
  features: { ndCredit: true, staffTools: true },
  contactEmail: 'giving@trlibrary.com',
  contactPhone: '',                       // optional; shown when set
  contactName: '',                        // optional gift-planning contact, e.g. "Jane Doe, Chief Development Officer"

  /* Does the Foundation currently issue charitable gift annuities?
   * Issuing CGAs requires a Certificate of Exemption from the ND Insurance
   * Department (N.D.C.C. § 26.1-34.1) plus registration in donors' states.
   * Leave false until that is in place; the life-income illustrator will
   * label CGAs as "not currently offered by the Foundation". */
  offersGiftAnnuities: false,

  /* Double the Donation public plugin key (the trlibrary.com/matching-gifts
   * page already runs this plugin). Set it here or pass data-dtd-key on the
   * matching tool's placeholder to embed the employer search. */
  doubleTheDonationKey: '',

  /* Brokerage (DTC) instructions for stock gifts. When filled in, the stock
   * tool's broker letter and Form 8283 draft include them; when blank, the
   * letter points the donor to the stock gift page for instructions. */
  brokerage: { firm: '', dtcNumber: '', accountName: '', accountNumber: '', contact: '' },

  /* North Dakota Charitable Giving Tax Credit. Gifts qualify only when they go
   * to a "qualified endowment fund" — permanent, irrevocable, spending only
   * income/appreciation — held by an ND-incorporated 501(c)(3). Fill in the
   * name of the Foundation's qualified endowment fund once development and
   * finance confirm it; leave blank and the tool tells donors to confirm with
   * the giving team before assuming the credit applies. */
  ndEndowment: {
    fundName: '',                 // e.g. 'Theodore Roosevelt Presidential Library Foundation Endowment Fund'
    confirmed: false,             // true once the fund's qualified status is verified with counsel / the Tax Commissioner
    giveUrl: ''                   // optional dedicated giving page for endowment gifts
  },

  urls: {
    home: 'https://www.trlibrary.com/',
    support: 'https://www.trlibrary.com/support',
    donate: 'https://form-renderer-app.donorperfect.io/give/theodore-roosevelt-presidential-library-foundation/donate-page',
    donateMonthly: 'https://form-renderer-app.donorperfect.io/give/theodore-roosevelt-presidential-library-foundation/donate-page?frequency=monthly',
    membership: 'https://www.trlibrary.com/membership',
    daf: 'https://www.trlibrary.com/support/donor-advised-fund',
    ira: 'https://www.trlibrary.com/support/give-through-your-ira',
    stock: 'https://www.trlibrary.com/support/give-stocks-and-securities',
    heritage: 'https://www.trlibrary.com/heritage-society',
    benefactor: 'https://www.trlibrary.com/benefactor-societies',
    matching: 'https://www.trlibrary.com/matching-gifts',
    tools: 'https://givingtools.labs.trlibrary.com/',
    /* Where the individual tool pages live. Cross-links between tools use
     * toolBase + <tool name>, so when the tools are placed on trlibrary.com at
     * /support/tools/<name> every link stays on the main site. The GitHub
     * Pages site mirrors the same path structure. Override per embed with
     * data-tool-base. */
    toolBase: 'https://www.trlibrary.com/support/tools/',
    /* DonorPerfect online form for "I've included the Library in my plans".
     * Leave blank to fall back to a pre-filled email to contactEmail. */
    intentForm: ''
  },

  /* Gallery site chrome (index.html and support/tools/*). */
  site: {
    title: 'Giving Tools', tagline: 'Theodore Roosevelt Presidential Library',
    repoUrl: 'https://github.com/Theodore-Roosevelt-Presidential-Library/PlannedGiving',
    nav: [['Ways to give', 'https://www.trlibrary.com/support'], ['Heritage Society', 'https://www.trlibrary.com/heritage-society']],
    heading: 'Tools for tax-smart giving',
    lede: 'Free, open-source calculators and guides that help supporters of the Theodore Roosevelt Presidential Library — and their advisors — find the smartest way to give. Every tool drops onto any web page with one line of JavaScript.'
  },

  /* Webfonts the embeds load from /fonts on their own host. The Library's
   * licensed faces are listed here; a fork replaces this list with its own
   * files (or sets fonts: [] and adjusts the font stacks in src/styles.css). */
  fonts: [
    ['Dharma Gothic E', 700, 'normal', 'dharma_type-dharmagothice-bold'], ['Dharma Gothic E', 800, 'normal', 'dharma_type-dharmagothice-exbold'],
    ['Clearface', 400, 'normal', 'clearfacestd-regular'], ['Clearface', 400, 'italic', 'clearfacestd-italic'], ['Clearface', 500, 'normal', 'clearfacestd-bold'], ['Clearface', 500, 'italic', 'clearfacestd-bolditalic'], ['Clearface', 700, 'normal', 'clearfacestd-heavy'],
    ['Frutiger', 300, 'normal', 'frutigerltstd-light'], ['Frutiger', 400, 'normal', 'frutigerltstd-regular'], ['Frutiger', 400, 'italic', 'frutigerltstd-regularitalic'], ['Frutiger', 700, 'normal', 'frutigerltstd-bold']
  ],

  /* Metric-matched local fallbacks so text doesn't jump while webfonts load. */
  fontFallbackCss: '@font-face{font-family:"Clearface Fallback";src:local(Georgia);size-adjust:93.1%;ascent-override:101.28%;descent-override:28.95%;line-gap-override:0%}' +
    '@font-face{font-family:"Dharma Gothic E Fallback";src:local(Arial);size-adjust:60.46%;ascent-override:141.09%;descent-override:37.31%;line-gap-override:0%}' +
    '@font-face{font-family:"Frutiger Fallback";src:local(Arial);size-adjust:105.7%;ascent-override:88.47%;descent-override:25.5%;line-gap-override:0%}',

  /* Brand palette (2020 Brand Identity System). The CSS tokens live in
   * src/styles.css; these values are kept here for reference and for the PDFs. */
  brand: {
    nightSky: '#092A4D', darkForest: '#1B4532', brightForest: '#8FC895', sand: '#D1CCBD',
    deepOrange: '#E7805D', darkGray: '#25282A', sunsetYellow: '#F9D635', springGreen: '#87BB41',
    graySky: '#99ADC5', sunsetOrange: '#FC924E', sunsetPink: '#F36079'
  }
};
