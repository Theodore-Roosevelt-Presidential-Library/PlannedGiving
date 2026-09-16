/* TRPL Giving Tools v1.5.0 — https://givingtools.labs.trlibrary.com — built 2026-09-16 */
/* ============================================================================
 * TRPL Giving Tools — TAX DATA (single source of truth)
 * ----------------------------------------------------------------------------
 * EVERY dollar figure, rate, threshold and table that the calculators use
 * lives in this one file. Nothing else in the codebase hard-codes a tax number.
 *
 * ANNUAL REVIEW: see docs/TAX-REVIEW.md. The IRS publishes next year's
 * inflation adjustments in a Revenue Procedure each October/November.
 * Update the figures, bump `taxYear` and `lastReviewed`, rebuild, commit.
 *
 * Sources used for the 2026 figures are listed next to each block.
 * ========================================================================== */
window.TRPL_TAX = {
  taxYear: 2026,
  lastReviewed: '2026-09-16',
  reviewDue: '2026-12-01',           // when the next-year figures should be in
  lawNote: 'Reflects federal law after the July 2025 One Big Beautiful Bill Act (OBBBA), as adjusted by IRS Rev. Proc. 2025-32 for tax year 2026.',

  /* --- Standard deduction (Rev. Proc. 2025-32) ---------------------------- */
  standardDeduction: { single: 16100, mfj: 32200, hoh: 24150, mfs: 16100 },
  // additional standard deduction, per qualifying person, age 65+ (or blind)
  additional65: { single: 2050, hoh: 2050, mfj: 1650, mfs: 1650 },
  // OBBBA temporary "senior bonus" deduction, 2025–2028, available whether or
  // not you itemize; reduced by 6% of MAGI above the threshold.
  seniorBonus: { amount: 6000, phaseStart: { single: 75000, hoh: 75000, mfj: 150000, mfs: 75000 }, phaseRate: 0.06, firstYear: 2025, lastYear: 2028 },

  /* --- Ordinary income brackets (upper bound of each bracket) ------------- */
  brackets: {
    single: [[12400, .10], [50400, .12], [105700, .22], [201775, .24], [256225, .32], [640600, .35], [Infinity, .37]],
    mfj:    [[24800, .10], [100800, .12], [211400, .22], [403550, .24], [512450, .32], [768700, .35], [Infinity, .37]],
    hoh:    [[17700, .10], [67450, .12], [105700, .22], [201775, .24], [256200, .32], [640600, .35], [Infinity, .37]],
    mfs:    [[12400, .10], [50400, .12], [105700, .22], [201775, .24], [256225, .32], [384350, .35], [Infinity, .37]]
  },
  marginalRates: [0.10, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37],

  /* --- Long-term capital gains: taxable income where 15% / 20% begin ------ */
  ltcg: { single: [49450, 545500], mfj: [98900, 613700], hoh: [66200, 579600], mfs: [49450, 306850] },
  niit: { rate: 0.038, threshold: { single: 200000, mfj: 250000, hoh: 200000, mfs: 125000 } },

  /* --- Charitable deduction rules (OBBBA, effective tax year 2026) -------- */
  charitable: {
    nonItemizer: { single: 1000, hoh: 1000, mfs: 1000, mfj: 2000 }, // cash gifts to public charities only; no DAFs
    itemizerFloorPct: 0.005,   // only gifts above 0.5% of AGI are deductible
    topBracketCap: 0.35,       // deduction value capped at 35¢ per $1 for 37%-bracket filers
    agiLimitCash: 0.60,
    agiLimitAppreciated: 0.30,
    carryoverYears: 5
  },

  /* --- SALT cap (OBBBA) --------------------------------------------------- */
  salt: { cap: { single: 40400, mfj: 40400, hoh: 40400, mfs: 20200 }, phaseStart: { single: 505000, mfj: 505000, hoh: 505000, mfs: 252500 }, phaseRate: 0.30, floor: { single: 10000, mfj: 10000, hoh: 10000, mfs: 5000 } },

  /* --- IRA qualified charitable distributions (SECURE 2.0, indexed) ------- */
  qcd: { annualLimit: 111000, splitInterestLimit: 55000, minAge: 70.5, rmdAge: 73, rmdAgeBornAfter1959: 75 },

  /* --- Estate & gift (OBBBA made the higher exemption permanent) ---------- */
  estate: { exemption: 15000000, topRate: 0.40, annualExclusion: 19000 },

  /* --- IRS §7520 rate (changes monthly; Rev. Rul. 2026-17) ---------------- */
  sec7520: { rate: 0.054, month: 'September 2026', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/section-7520-interest-rates' },

  /* --- ACGA suggested maximum single-life gift annuity rates -------------- */
  // Effective 2024-01-01, reconfirmed by ACGA 2025-11-07 for 2026.
  acga: {
    effective: '2024-01-01', reconfirmed: '2025-11-07',
    singleLife: { 60: .052, 61: .053, 62: .054, 63: .055, 64: .056, 65: .057, 66: .058, 67: .059, 68: .061, 69: .062, 70: .063, 71: .064, 72: .066, 73: .067, 74: .068, 75: .070, 76: .072, 77: .074, 78: .076, 79: .078, 80: .081, 81: .083, 82: .085, 83: .087, 84: .089, 85: .091, 86: .093, 87: .095, 88: .097, 89: .099, 90: .101 }
  },

  /* --- IRS Uniform Lifetime Table (for RMD estimates) --------------------- */
  uniformLifetime: { 72: 27.4, 73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9, 78: 22.0, 79: 21.1, 80: 20.2, 81: 19.4, 82: 18.5, 83: 17.7, 84: 16.8, 85: 16.0, 86: 15.2, 87: 14.4, 88: 13.7, 89: 12.9, 90: 12.2, 91: 11.5, 92: 10.8, 93: 10.1, 94: 9.5, 95: 8.9, 96: 8.4, 97: 7.8, 98: 7.3, 99: 6.8, 100: 6.4 },

  /* --- Approximate life expectancy (years) used ONLY for illustrations ---- */
  // Rounded from IRS Table 2010CM. Real deduction math uses IRS actuarial
  // tables; these approximations exist so the illustrators can show ballpark
  // numbers with a clear "estimate" label.
  lifeExpectancy: { 50: 32.0, 55: 27.6, 60: 23.4, 65: 19.3, 70: 15.5, 75: 12.0, 80: 8.9, 85: 6.4, 90: 4.5, 95: 3.2, 100: 2.3 },

  /* --- North Dakota Charitable Giving Tax Credit (N.D.C.C. § 57-38-01.21) -- */
  // Endowment credit: 40% of gifts to a qualified ND endowment fund; individuals
  // need $5,000+ in a year; max credit $10,000 per taxpayer ($20,000 MFJ);
  // businesses/trusts 40% up to $10,000; unused credit carries forward 3 years.
  // Planned-gift credit: 40% of the federal charitable-deduction portion of a
  // CGA, deferred CGA, CRUT/CRAT, CLT, pooled income fund, life estate, or
  // paid-up life insurance policy given to a qualified ND nonprofit; same caps;
  // individuals only. Source: tax.nd.gov and NDANO, verified 2026-09-16.
  ndCredit: {
    rate: 0.40, minGift: 5000, maxIndividual: 10000, maxJoint: 20000, maxBusiness: 10000, carryforwardYears: 3,
    statute: 'N.D.C.C. § 57-38-01.21', formEndowment: 'Schedule ND-1QEC', formPlanned: 'Schedule ND-1PG',
    // ND requires the nonprofit's letter confirming the fund qualifies (Schedule line 1), and
    // adds the federally deducted (or QCD-excluded) portion back to ND taxable income (Form ND-1, line 2).
    requiresQualificationLetter: true, ndAddBack: true,
    eligibleContributionCap: { single: 25000, mfj: 50000, hoh: 25000, mfs: 25000 },
    plannedGiftTypes: ['charitable gift annuity', 'deferred charitable gift annuity', 'charitable remainder unitrust', 'charitable remainder annuity trust', 'charitable lead unitrust', 'charitable lead annuity trust', 'pooled income fund', 'charitable life estate', 'paid-up life insurance policy']
  },
  // Fillable state forms bundled in /forms (public documents from tax.nd.gov).
  // The form year follows the tax year of the gift; replace with the new
  // year's PDF and re-check field names during the annual review.
  ndForms: {
    qec: { formYear: 2025, file: 'forms/schedule-nd-1qec-2025.pdf', title: 'Schedule ND-1QEC', source: 'https://www.tax.nd.gov/sites/www/files/documents/forms/individual/2025-iit/28708-schedule-nd-1qec-2025.pdf',
      fields: { name: 'Taxpayers name', fundName: 'Name 1', fundAddress: 'Address 1', amount: 'Amount 1', l2: 'Line 2', l3: 'Line 3', l4: 'Line 4', l5: 'Line 5', l6: 'Line 6', l7: 'Line 7', l8: 'Line 8', l9: 'Line 9' } },
    pg: { formYear: 2025, file: 'forms/schedule-nd-1pg-2025.pdf', title: 'Schedule ND-1PG', source: 'https://www.tax.nd.gov/sites/www/files/documents/forms/individual/2025-iit/28705-schedule-nd-1pg-2025.pdf' }
  },
  // IRS Form 8283 (Rev. Dec 2025), Section A row A field names (XFA-style AcroForm)
  irsForms: {
    f8283: { rev: '2025-12', file: 'forms/irs-f8283-2025-12.pdf', source: 'https://www.irs.gov/pub/irs-pdf/f8283.pdf',
      fields: { name: 'Form8283[0].Page1[0].f1_1[0]', doneeA: 'Form8283[0].Page1[0].Table_Line1_ColsA-C[0].Row1A[0].f1_5[0]', descA: 'Form8283[0].Page1[0].Table_Line1_ColsA-C[0].Row1A[0].f1_7[0]',
        dateA: 'Form8283[0].Page1[0].Table_Line1_ColsD-I[0].Row1A[0].f1_17[0]', acquiredA: 'Form8283[0].Page1[0].Table_Line1_ColsD-I[0].Row1A[0].f1_18[0]', howA: 'Form8283[0].Page1[0].Table_Line1_ColsD-I[0].Row1A[0].f1_19[0]',
        costA: 'Form8283[0].Page1[0].Table_Line1_ColsD-I[0].Row1A[0].f1_20[0]', fmvA: 'Form8283[0].Page1[0].Table_Line1_ColsD-I[0].Row1A[0].f1_21[0]', methodA: 'Form8283[0].Page1[0].Table_Line1_ColsD-I[0].Row1A[0].f1_22[0]' } }
  },
  // ND individual income tax, 2026 (starts from federal taxable income). HOH and
  // MFS use the single / half-joint thresholds here as an approximation.
  ndBrackets: {
    single: [[49575, 0], [250400, .0195], [Infinity, .025]],
    mfj:    [[82800, 0], [304850, .0195], [Infinity, .025]],
    hoh:    [[49575, 0], [250400, .0195], [Infinity, .025]],
    mfs:    [[41400, 0], [152425, .0195], [Infinity, .025]]
  },
  // Federal rule: a charitable deduction is reduced by any state tax credit
  // received for the gift, unless the credit is 15% or less of the gift
  // (Treas. Reg. § 1.170A-1(h)(3)). Notice 2019-12 safe harbor lets itemizers
  // treat the disallowed amount as a state tax payment, within the SALT cap.
  stateCreditRule: { deMinimis: 0.15 },

  /* --- State-level death taxes (2026) ------------------------------------- */
  stateEstateTax: {
    CT: 13600000, DC: 4988400, HI: 5490000, IL: 4000000, ME: 7160000, MD: 5000000, MA: 2000000,
    MN: 3000000, NY: 7350000, OR: 1000000, RI: 1838000, VT: 5000000, WA: 3000000
  },
  stateInheritanceTax: ['KY', 'MD', 'NE', 'NJ', 'PA'],

  sources: [
    'IRS Rev. Proc. 2025-32 (2026 inflation adjustments)',
    'Tax Foundation, 2026 Tax Brackets',
    'IRS §7520 rate table; Rev. Rul. 2026-17',
    'American Council on Gift Annuities, suggested maximum rates (reconfirmed 2025-11-07)',
    'IRS Publication 590-B, Uniform Lifetime Table',
    'Kiplinger / TurboTax summaries of OBBBA charitable-deduction changes'
  ]
};

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

/* ============================================================================
 * TRPL Giving Tools — CORE RUNTIME
 * Shared by every embed. Guarded so that several tools on one page share one
 * copy. No dependencies, no build-time framework, ES2017.
 * ========================================================================== */
(function () {
  if (window.TRPLGivingTools && window.TRPLGivingTools.version === '1.5.0') return;

  var GT = window.TRPLGivingTools = window.TRPLGivingTools || {};
  GT.version = '1.5.0';
  GT.registry = GT.registry || {};
  GT.mounted = GT.mounted || [];

  /* ---------------------------------------------------------------------- */
  /* Styles — injected once. Everything is scoped under .trpl-gt so the host */
  /* page's CSS and ours stay out of each other's way.                       */
  /* ---------------------------------------------------------------------- */
  var CSS = "/* TRPL Giving Tools — scoped styles. Tokens mirror the trlibrary.com theme (Tailwind): Dharma Gothic E for display, Clearface for body, Frutiger for UI text; Deep Orange primary buttons with Dark Gray text; squared 2px corners; cream panels. Everything lives under .trpl-gt so nothing leaks either way. */ .trpl-gt { /* brand palette (trlibrary.com theme values) */ --trpl-dark-gray: #25282A; --trpl-night-sky: #092A4D; --trpl-dark-forest: #1B4633; --trpl-darker-forest: #163728; --trpl-bright-forest: #8FC895; --trpl-spring-green: #87BB41; --trpl-sand: #D1CCBD; --trpl-deep-orange: #E7805D; --trpl-deep-orange-dark: #D07556; --trpl-gray-sky: #99ADC5; --trpl-sunset-yellow: #F9D635; --trpl-disabled-gray: #BCBDBE; --trpl-cream: #F0ECE3; --trpl-cream-light: #FAF8F4; /* semantic */ --trpl-accent: var(--trpl-dark-forest); --trpl-ink: var(--trpl-dark-gray); --trpl-muted: #4F5052; --trpl-bg: #ffffff; --trpl-panel: var(--trpl-cream-light); --trpl-panel-strong: var(--trpl-cream); --trpl-line: #D9D4C8; --trpl-radius: 2px; --trpl-radius-lg: 4px; --trpl-font: \"Clearface\", \"Clearface Fallback\", Georgia, \"Times New Roman\", serif; --trpl-font-display: \"Dharma Gothic E\", \"Dharma Gothic E Fallback\", \"Oswald\", \"Arial Narrow\", Impact, sans-serif; --trpl-font-ui: \"Frutiger\", \"Frutiger Fallback\", \"Helvetica Neue\", Arial, sans-serif; font-family: var(--trpl-font); color: var(--trpl-ink); background: var(--trpl-bg); border: 1px solid var(--trpl-line); border-radius: var(--trpl-radius-lg); padding: 28px; max-width: 880px; margin: 0 auto; box-sizing: border-box; line-height: 1.55; font-size: 17px; -webkit-font-smoothing: antialiased; } .trpl-gt[data-theme=\"dark\"] { --trpl-bg: var(--trpl-night-sky); --trpl-panel: #12365f; --trpl-panel-strong: #0d2c50; --trpl-line: #2f5079; --trpl-ink: #F3F1EA; --trpl-muted: #C9D3DF; --trpl-accent: var(--trpl-bright-forest); } .trpl-gt *, .trpl-gt *::before, .trpl-gt *::after { box-sizing: border-box; } .trpl-gt p { margin: 0; } .trpl-gt a { color: var(--trpl-dark-forest); text-decoration: underline; text-underline-offset: 2px; } .trpl-gt[data-theme=\"dark\"] a { color: var(--trpl-bright-forest); } /* ---- header ---------------------------------------------------------- */ .trpl-gt .trpl-head { border-bottom: 3px solid var(--trpl-ink); padding-bottom: 14px; margin-bottom: 22px; } .trpl-gt .trpl-eyebrow { font-family: var(--trpl-font-ui); text-transform: uppercase; letter-spacing: .14em; font-size: 12px; font-weight: 700; color: var(--trpl-deep-orange); margin: 0 0 6px; } .trpl-gt .trpl-h2 { font-family: var(--trpl-font-display); font-size: 40px; line-height: .95; margin: 0 0 10px; color: var(--trpl-ink); font-weight: 700; text-transform: uppercase; letter-spacing: .005em; } .trpl-gt .trpl-h3 { font-family: var(--trpl-font-display); font-size: 24px; line-height: 1; margin: 0 0 10px; color: var(--trpl-ink); font-weight: 700; text-transform: uppercase; } .trpl-gt .trpl-intro { margin: 0; color: var(--trpl-muted); font-size: 17px; max-width: 64ch; } /* ---- layout ---------------------------------------------------------- */ .trpl-gt .trpl-body { display: grid; gap: 22px; } .trpl-gt .trpl-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 16px 20px; align-items: start; } .trpl-gt .trpl-grid.trpl-two { grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); } .trpl-gt .trpl-section { display: grid; gap: 12px; align-content: start; } .trpl-gt .trpl-panel { background: var(--trpl-panel); border-radius: var(--trpl-radius-lg); padding: 18px; } /* ---- form controls --------------------------------------------------- */ .trpl-gt .trpl-field { display: grid; gap: 6px; align-content: start; } /* align-content:start stops rows drifting when grid cells stretch */ .trpl-gt .trpl-label { font-family: var(--trpl-font-ui); font-weight: 700; font-size: 14px; letter-spacing: .01em; color: var(--trpl-ink); } .trpl-gt .trpl-help { font-family: var(--trpl-font-ui); font-size: 13px; line-height: 1.45; color: var(--trpl-muted); } .trpl-gt .trpl-help a { color: inherit; } .trpl-gt .trpl-input { width: 100%; font-family: var(--trpl-font-ui); font-size: 16px; padding: 10px 12px; border: 1px solid var(--trpl-disabled-gray); border-radius: var(--trpl-radius); background: var(--trpl-bg); color: var(--trpl-ink); min-height: 44px; line-height: 1.3; margin: 0; } .trpl-gt .trpl-input:focus { outline: 3px solid rgba(231,128,93,.45); outline-offset: 1px; border-color: var(--trpl-deep-orange-dark); } .trpl-gt select.trpl-input { appearance: auto; -webkit-appearance: menulist; } .trpl-gt .trpl-money { display: flex; align-items: stretch; } .trpl-gt .trpl-money .trpl-input { flex: 1; min-width: 0; border-radius: 0 var(--trpl-radius) var(--trpl-radius) 0; } .trpl-gt .trpl-money .trpl-input:first-child { border-radius: var(--trpl-radius) 0 0 var(--trpl-radius); } .trpl-gt .trpl-prefix, .trpl-gt .trpl-suffix { display: flex; align-items: center; padding: 0 12px; border: 1px solid var(--trpl-disabled-gray); background: var(--trpl-panel-strong); color: var(--trpl-muted); font-family: var(--trpl-font-ui); font-weight: 700; font-size: 15px; } .trpl-gt .trpl-prefix { border-right: 0; border-radius: var(--trpl-radius) 0 0 var(--trpl-radius); } .trpl-gt .trpl-suffix { border-left: 0; border-radius: 0 var(--trpl-radius) var(--trpl-radius) 0; } .trpl-gt .trpl-radios { display: flex; flex-wrap: wrap; gap: 8px; } .trpl-gt .trpl-radios.trpl-stacked { flex-direction: column; } .trpl-gt .trpl-radio { display: flex; gap: 10px; align-items: flex-start; padding: 10px 14px; border: 1px solid var(--trpl-disabled-gray); border-radius: var(--trpl-radius); cursor: pointer; background: var(--trpl-bg); font-family: var(--trpl-font-ui); font-size: 15px; line-height: 1.4; min-height: 44px; margin: 0; color: var(--trpl-ink); } .trpl-gt .trpl-radio:hover { border-color: var(--trpl-muted); } .trpl-gt .trpl-radio:has(input:checked) { border-color: var(--trpl-deep-orange-dark); background: #FBEFE9; box-shadow: inset 0 0 0 1px var(--trpl-deep-orange-dark); } .trpl-gt[data-theme=\"dark\"] .trpl-radio:has(input:checked) { background: #1f3f66; } .trpl-gt .trpl-radio input { margin: 3px 0 0; accent-color: var(--trpl-deep-orange-dark); flex: none; width: 16px; height: 16px; } .trpl-gt .trpl-radio.trpl-single { border: 0; padding: 4px 0; background: transparent; box-shadow: none; } .trpl-gt .trpl-range { width: 100%; accent-color: var(--trpl-deep-orange-dark); margin: 10px 0; } .trpl-gt .trpl-textout { width: 100%; min-height: 150px; font-family: var(--trpl-font); font-size: 16px; padding: 16px 18px; border: 1px solid var(--trpl-disabled-gray); border-left: 4px solid var(--trpl-deep-orange); border-radius: var(--trpl-radius); background: var(--trpl-panel); color: var(--trpl-ink); white-space: pre-wrap; line-height: 1.6; margin: 0; } /* ---- results --------------------------------------------------------- */ .trpl-gt .trpl-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 12px; } .trpl-gt .trpl-stat { background: var(--trpl-panel); border-radius: var(--trpl-radius-lg); padding: 16px 18px 14px; border-top: 5px solid var(--trpl-dark-forest); min-width: 0; } .trpl-gt .trpl-stat.trpl-good { border-top-color: var(--trpl-spring-green); } .trpl-gt .trpl-stat.trpl-highlight { border-top-color: var(--trpl-deep-orange); } .trpl-gt .trpl-stat.trpl-muted { border-top-color: var(--trpl-sand); } .trpl-gt .trpl-stat-label { font-family: var(--trpl-font-ui); font-size: 12px; line-height: 1.35; color: var(--trpl-muted); text-transform: uppercase; letter-spacing: .08em; font-weight: 700; } .trpl-gt .trpl-stat-value { font-family: var(--trpl-font-display); font-size: 36px; font-weight: 700; color: var(--trpl-ink); margin: 6px 0 4px; line-height: .95; letter-spacing: .01em; overflow-wrap: anywhere; } .trpl-gt .trpl-stat-sub { font-family: var(--trpl-font-ui); font-size: 13px; line-height: 1.45; color: var(--trpl-muted); } .trpl-gt .trpl-bars { display: grid; gap: 10px; padding: 4px 0; } .trpl-gt .trpl-bar-row { display: grid; grid-template-columns: minmax(130px, 1.2fr) 3fr auto; gap: 12px; align-items: center; font-family: var(--trpl-font-ui); font-size: 14px; } .trpl-gt .trpl-bar-track { background: var(--trpl-panel-strong); height: 14px; overflow: hidden; border-radius: var(--trpl-radius); } .trpl-gt .trpl-bar-fill { height: 100%; background: var(--trpl-dark-forest); transition: width .3s ease; } .trpl-gt .trpl-bar-fill.trpl-good { background: var(--trpl-spring-green); } .trpl-gt .trpl-bar-fill.trpl-highlight { background: var(--trpl-deep-orange); } .trpl-gt .trpl-bar-fill.trpl-muted { background: var(--trpl-sand); } .trpl-gt .trpl-bar-value { font-weight: 700; white-space: nowrap; font-variant-numeric: tabular-nums; } .trpl-gt .trpl-callout { border-left: 4px solid var(--trpl-dark-forest); background: var(--trpl-panel); padding: 14px 18px; border-radius: 0 var(--trpl-radius-lg) var(--trpl-radius-lg) 0; font-size: 16px; } .trpl-gt .trpl-callout.trpl-warn { border-left-color: var(--trpl-deep-orange); background: #FBEFE9; } .trpl-gt[data-theme=\"dark\"] .trpl-callout.trpl-warn { background: #3a2a2a; } .trpl-gt .trpl-callout.trpl-good { border-left-color: var(--trpl-spring-green); } .trpl-gt .trpl-callout.trpl-info { border-left-color: var(--trpl-gray-sky); } .trpl-gt .trpl-callout p { margin: 0 0 8px; } .trpl-gt .trpl-callout p:last-child { margin: 0; } .trpl-gt .trpl-list { margin: 0; padding-left: 22px; display: grid; gap: 6px; font-size: 16px; } .trpl-gt .trpl-list.trpl-checks { list-style: none; padding-left: 0; } .trpl-gt .trpl-list.trpl-checks li { padding-left: 26px; position: relative; } .trpl-gt .trpl-list.trpl-checks li::before { content: \"✓\"; position: absolute; left: 0; color: var(--trpl-spring-green); font-weight: 800; } .trpl-gt table.trpl-table { width: 100%; border-collapse: collapse; font-family: var(--trpl-font-ui); font-size: 14px; } .trpl-gt table.trpl-table th, .trpl-gt table.trpl-table td { text-align: left; padding: 9px 10px; border-bottom: 1px solid var(--trpl-line); vertical-align: top; } .trpl-gt table.trpl-table th { font-weight: 700; color: var(--trpl-muted); font-size: 12px; text-transform: uppercase; letter-spacing: .06em; } .trpl-gt table.trpl-table td.trpl-num, .trpl-gt table.trpl-table th.trpl-num { text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; } .trpl-gt .trpl-steps { counter-reset: step; list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; } .trpl-gt .trpl-steps li { position: relative; padding-left: 42px; font-size: 16px; min-height: 30px; } .trpl-gt .trpl-steps li::before { counter-increment: step; content: counter(step); position: absolute; left: 0; top: 0; width: 30px; height: 30px; border-radius: 50%; background: var(--trpl-ink); color: #fff; font-family: var(--trpl-font-display); font-weight: 700; font-size: 17px; display: flex; align-items: center; justify-content: center; } .trpl-gt[data-theme=\"dark\"] .trpl-steps li::before { background: var(--trpl-deep-orange); color: var(--trpl-dark-gray); } .trpl-gt .trpl-infocard { display: grid; gap: 4px; background: var(--trpl-panel-strong); border-radius: var(--trpl-radius-lg); padding: 16px 18px; font-family: var(--trpl-font-ui); font-size: 15px; } .trpl-gt .trpl-infocard b { font-family: var(--trpl-font-display); text-transform: uppercase; font-size: 19px; letter-spacing: .02em; margin-bottom: 4px; } /* ---- buttons --------------------------------------------------------- */ .trpl-gt .trpl-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-family: var(--trpl-font-ui); font-weight: 700; font-size: 14px; letter-spacing: .01em; padding: 11px 20px; border-radius: var(--trpl-radius); border: 1px solid var(--trpl-deep-orange-dark); background: var(--trpl-bg); color: var(--trpl-ink); cursor: pointer; text-decoration: none; min-height: 44px; line-height: 1.2; transition: background .15s, border-color .15s; } .trpl-gt .trpl-btn:hover { background: var(--trpl-deep-orange-dark); color: var(--trpl-dark-gray); border-color: var(--trpl-deep-orange-dark); } .trpl-gt .trpl-btn.trpl-primary { background: var(--trpl-deep-orange); border-color: var(--trpl-deep-orange); color: var(--trpl-dark-gray); } .trpl-gt .trpl-btn.trpl-primary:hover { background: var(--trpl-deep-orange-dark); border-color: var(--trpl-deep-orange-dark); } .trpl-gt .trpl-btn.trpl-secondary { border-color: var(--trpl-disabled-gray); color: var(--trpl-ink); background: var(--trpl-bg); } .trpl-gt .trpl-btn.trpl-secondary:hover { background: var(--trpl-panel-strong); border-color: var(--trpl-muted); color: var(--trpl-ink); } .trpl-gt .trpl-btn.trpl-highlight { background: var(--trpl-dark-forest); border-color: var(--trpl-dark-forest); color: #fff; } .trpl-gt .trpl-btn:focus-visible { outline: 3px solid rgba(231,128,93,.55); outline-offset: 2px; } .trpl-gt[data-theme=\"dark\"] .trpl-btn.trpl-secondary { color: #fff; border-color: var(--trpl-gray-sky); } .trpl-gt .trpl-actions { display: flex; flex-wrap: wrap; gap: 10px; } .trpl-gt .trpl-cta { background: var(--trpl-dark-forest); color: #fff; border-radius: var(--trpl-radius-lg); padding: 22px; display: grid; gap: 14px; } .trpl-gt .trpl-cta p { margin: 0; font-size: 17px; } .trpl-gt .trpl-cta .trpl-btn { justify-self: start; background: var(--trpl-deep-orange); color: var(--trpl-dark-gray); border-color: var(--trpl-deep-orange); } .trpl-gt .trpl-cta .trpl-btn:hover { background: var(--trpl-sand); border-color: var(--trpl-sand); } /* ---- misc ------------------------------------------------------------ */ .trpl-gt .trpl-advisor { background: var(--trpl-panel-strong); border-radius: var(--trpl-radius-lg); padding: 14px 18px; } .trpl-gt .trpl-advisor summary { cursor: pointer; font-family: var(--trpl-font-display); text-transform: uppercase; font-size: 20px; letter-spacing: .02em; color: var(--trpl-ink); list-style-position: outside; } .trpl-gt .trpl-advisor .trpl-list { margin-top: 12px; } .trpl-gt .trpl-disclaimer { margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--trpl-line); font-family: var(--trpl-font-ui); font-size: 13px; line-height: 1.5; color: var(--trpl-muted); } .trpl-gt .trpl-disclaimer p { margin: 0 0 8px; } .trpl-gt .trpl-fine { font-size: 12px; } .trpl-gt .trpl-contact { font-family: var(--trpl-font-ui); font-size: 14px; color: var(--trpl-muted); margin: 0; } .trpl-gt .trpl-progress { display: flex; gap: 6px; } .trpl-gt .trpl-progress span { flex: 1; height: 5px; background: var(--trpl-line); } .trpl-gt .trpl-progress span.trpl-on { background: var(--trpl-deep-orange); } .trpl-gt .trpl-question { font-family: var(--trpl-font-display); font-size: 30px; line-height: .98; font-weight: 700; text-transform: uppercase; color: var(--trpl-ink); margin: 4px 0 4px; } .trpl-gt .trpl-rec { border: 1px solid var(--trpl-line); border-radius: var(--trpl-radius-lg); padding: 18px 20px; display: grid; gap: 8px; background: var(--trpl-bg); } .trpl-gt .trpl-rec.trpl-top { border-color: var(--trpl-deep-orange); background: var(--trpl-panel); box-shadow: inset 0 0 0 1px var(--trpl-deep-orange); } .trpl-gt .trpl-rec h4 { margin: 0; font-family: var(--trpl-font-display); text-transform: uppercase; font-size: 24px; line-height: 1; color: var(--trpl-ink); font-weight: 700; } .trpl-gt .trpl-rec .trpl-tag { display: inline-block; font-family: var(--trpl-font-ui); font-size: 12px; text-transform: uppercase; letter-spacing: .1em; font-weight: 700; color: var(--trpl-deep-orange-dark); } .trpl-gt .trpl-rec p { margin: 0; font-size: 16px; } .trpl-gt .trpl-compact { padding: 18px; } .trpl-gt iframe { max-width: 100%; } @media (max-width: 600px) { .trpl-gt { padding: 18px 16px; border-radius: 0; border-left: 0; border-right: 0; } .trpl-gt .trpl-h2 { font-size: 32px; } .trpl-gt .trpl-question { font-size: 26px; } .trpl-gt .trpl-bar-row { grid-template-columns: 1fr auto; } .trpl-gt .trpl-bar-row .trpl-bar-track { grid-column: 1 / -1; } .trpl-gt .trpl-stat-value { font-size: 30px; } .trpl-gt .trpl-grid, .trpl-gt .trpl-grid.trpl-two { grid-template-columns: 1fr; } .trpl-gt .trpl-actions .trpl-btn { flex: 1 1 auto; } } @media print { .trpl-gt .trpl-btn, .trpl-gt .trpl-actions { display: none; } .trpl-gt { border: 0; } } .trpl-gt .trpl-sharebar { border-top: 1px dashed var(--trpl-line); padding-top: 16px; display: grid; gap: 10px; } .trpl-gt .trpl-sharebar .trpl-eyebrow { color: var(--trpl-muted); }";
  /* Where this bundle was loaded from, so fonts resolve on the tools site,
   * on trlibrary.com, and in local development alike. */
  var SCRIPT_BASE = (function () {
    var src = document.currentScript && document.currentScript.src;
    return src ? src.replace(/dist\/[^\/]*$/, '') : ((window.TRPL_ORG && window.TRPL_ORG.urls.tools) || '/');
  })();
  GT.base = GT.base || SCRIPT_BASE;
  var FONTS = (window.TRPL_ORG && window.TRPL_ORG.fonts) || [];
  function injectCSS(loadFonts) {
    if (loadFonts !== false && FONTS.length && !document.getElementById('trpl-gt-fonts')) {
      var f = document.createElement('style');
      f.id = 'trpl-gt-fonts';
      f.textContent = FONTS.map(function (x) { return '@font-face{font-family:"' + x[0] + '";font-weight:' + x[1] + ';font-style:' + x[2] + ';font-display:swap;src:url("' + GT.base + 'fonts/' + x[3] + '.woff2") format("woff2")}'; }).join('') + ((window.TRPL_ORG && window.TRPL_ORG.fontFallbackCss) || '');
      document.head.appendChild(f);
    }
    if (document.getElementById('trpl-gt-css')) return;
    var s = document.createElement('style');
    s.id = 'trpl-gt-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ---------------------------------------------------------------------- */
  /* Tiny DOM helper: h('div.cls', {attr}, [children])                       */
  /* ---------------------------------------------------------------------- */
  function h(tag, attrs, children) {
    if (Array.isArray(attrs) || typeof attrs === 'string' || attrs instanceof Node) { children = attrs; attrs = null; }
    var parts = tag.split('.'), el = document.createElement(parts[0] || 'div');
    if (parts.length > 1) el.className = parts.slice(1).map(function (c) { return 'trpl-' + c; }).join(' ');
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (k === 'html') el.innerHTML = v;
      else if (k === 'text') el.textContent = v;
      else if (k === 'on') Object.keys(v).forEach(function (ev) { el.addEventListener(ev, v[ev]); });
      else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else if (v === false || v == null) { /* skip */ }
      else if (v === true) el.setAttribute(k, '');
      else el.setAttribute(k, v);
    });
    append(el, children);
    return el;
  }
  function append(el, children) {
    if (children == null) return el;
    if (!Array.isArray(children)) children = [children];
    children.forEach(function (c) {
      if (c == null || c === false) return;
      if (Array.isArray(c)) return append(el, c);
      el.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
    });
    return el;
  }
  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); return el; }

  /* ---------------------------------------------------------------------- */
  /* Numbers                                                                 */
  /* ---------------------------------------------------------------------- */
  function num(v, fallback) { var n = parseFloat(String(v == null ? '' : v).replace(/[^0-9.\-]/g, '')); return isNaN(n) ? (fallback || 0) : n; }
  function money(n, opts) {
    opts = opts || {};
    var neg = n < 0; n = Math.abs(n);
    var s = (opts.cents ? n.toFixed(2) : Math.round(n).toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (neg ? '−$' : '$') + s;
  }
  function pct(r, d) { return (r * 100).toFixed(d == null ? 1 : d).replace(/\.0+$/, '') + '%'; }
  function clamp(n, lo, hi) { return Math.min(hi, Math.max(lo, n)); }
  function interp(table, x) {
    var keys = Object.keys(table).map(Number).sort(function (a, b) { return a - b; });
    if (x <= keys[0]) return table[keys[0]];
    if (x >= keys[keys.length - 1]) return table[keys[keys.length - 1]];
    for (var i = 0; i < keys.length - 1; i++) {
      if (x >= keys[i] && x <= keys[i + 1]) {
        var t = (x - keys[i]) / (keys[i + 1] - keys[i]);
        return table[keys[i]] + t * (table[keys[i + 1]] - table[keys[i]]);
      }
    }
    return table[keys[0]];
  }

  /* ---------------------------------------------------------------------- */
  /* Tax helpers (all figures come from window.TRPL_TAX)                     */
  /* ---------------------------------------------------------------------- */
  var T = function () { return window.TRPL_TAX; };
  var ORG = function () { return window.TRPL_ORG; };

  function marginalRate(taxable, status) {
    var b = T().brackets[status] || T().brackets.single;
    for (var i = 0; i < b.length; i++) if (taxable <= b[i][0]) return b[i][1];
    return b[b.length - 1][1];
  }
  function ltcgRate(taxable, status) {
    var t = T().ltcg[status] || T().ltcg.single;
    return taxable <= t[0] ? 0 : taxable <= t[1] ? 0.15 : 0.20;
  }
  /* Value of $1 of itemized deduction at a marginal rate, honoring the
   * OBBBA 35% cap for 37%-bracket filers. */
  function deductionRate(marginal) { return Math.min(marginal, T().charitable.topBracketCap); }
  function stdDeduction(status, count65) {
    return (T().standardDeduction[status] || 0) + (count65 || 0) * (T().additional65[status] || 0);
  }
  function seniorBonus(status, count65, magi) {
    var s = T().seniorBonus, yr = T().taxYear;
    if (!count65 || yr < s.firstYear || yr > s.lastYear) return 0;
    var full = s.amount * count65, over = Math.max(0, (magi || 0) - s.phaseStart[status]);
    return Math.max(0, full - s.phaseRate * over);
  }
  function saltAllowed(paid, status, magi) {
    var s = T().salt, cap = s.cap[status], over = Math.max(0, (magi || 0) - s.phaseStart[status]);
    cap = Math.max(s.floor[status], cap - s.phaseRate * over);
    return Math.min(paid || 0, cap);
  }
  /* Deductible charitable amount for an itemizer after the 0.5%-of-AGI floor */
  function charitableAfterFloor(gifts, agi) { return Math.max(0, gifts - T().charitable.itemizerFloorPct * (agi || 0)); }
  function nonItemizerDeduction(cashGifts, status) { return Math.min(cashGifts || 0, T().charitable.nonItemizer[status] || 0); }
  function lifeExpectancy(age) { return interp(T().lifeExpectancy, age); }
  function pvAnnuity(payment, rate, years) { if (rate === 0) return payment * years; return payment * (1 - Math.pow(1 + rate, -years)) / rate; }

  /* ---------------------------------------------------------------------- */
  /* Form controls. Each returns {el, get(), set()} and calls onChange.      */
  /* ---------------------------------------------------------------------- */
  var uid = 0;
  function field(label, control, help) {
    var id = 'trpl-f' + (++uid);
    control.input.id = id;
    return h('div.field', [h('label.label', { 'for': id }, label), control.el, help ? h('div.help', { html: help }) : null]);
  }
  function moneyInput(opts) {
    opts = opts || {};
    var inp = h('input.input', { type: 'text', inputmode: 'decimal', value: opts.value != null ? money(opts.value).slice(1) : '', placeholder: opts.placeholder || '0', 'aria-label': opts.aria || '' });
    var wrap = h('div.money', [h('span.prefix', '$'), inp]);
    function get() { return num(inp.value); }
    inp.addEventListener('input', function () { opts.onChange && opts.onChange(get()); });
    inp.addEventListener('blur', function () { if (inp.value !== '') inp.value = money(get()).slice(1); });
    return { el: wrap, input: inp, type: 'number', get: get, set: function (v) { inp.value = money(v).slice(1); } };
  }
  function numberInput(opts) {
    opts = opts || {};
    var inp = h('input.input', { type: 'number', min: opts.min, max: opts.max, step: opts.step || 1, value: opts.value, placeholder: opts.placeholder || '' });
    var wrap = opts.suffix ? h('div.money', [inp, h('span.suffix', opts.suffix)]) : inp;
    function get() { var v = num(inp.value, opts.value || 0); return opts.min != null ? clamp(v, opts.min, opts.max == null ? Infinity : opts.max) : v; }
    inp.addEventListener('input', function () { opts.onChange && opts.onChange(get()); });
    return { el: wrap, input: inp, type: inp.type === 'text' ? 'text' : 'number', get: get, set: function (v) { inp.value = v; } };
  }
  function percentInput(opts) {
    opts = opts || {};
    var inp = h('input.input', { type: 'number', min: opts.min == null ? 0 : opts.min, max: opts.max == null ? 100 : opts.max, step: opts.step || 0.1, value: opts.value != null ? +(opts.value * 100).toFixed(2) : '' });
    var wrap = h('div.money', [inp, h('span.suffix', '%')]);
    function get() { return num(inp.value) / 100; }
    inp.addEventListener('input', function () { opts.onChange && opts.onChange(get()); });
    return { el: wrap, input: inp, type: 'number', get: get, set: function (v) { inp.value = +(v * 100).toFixed(2); } };
  }
  function select(opts) {
    var sel = h('select.input', opts.options.map(function (o) { return h('option', { value: o[0], selected: o[0] === opts.value }, o[1]); }));
    sel.addEventListener('change', function () { opts.onChange && opts.onChange(sel.value); });
    return { el: sel, input: sel, type: 'string', get: function () { return sel.value; }, set: function (v) { sel.value = v; } };
  }
  function radios(opts) {
    var name = 'trpl-r' + (++uid), value = opts.value;
    var wrap = h('div.radios' + (opts.stacked ? '.stacked' : ''), { role: 'radiogroup', 'aria-label': opts.aria || '' });
    var inputs = opts.options.map(function (o) {
      var r = h('input', { type: 'radio', name: name, value: o[0], checked: o[0] === value });
      r.addEventListener('change', function () { value = o[0]; opts.onChange && opts.onChange(value); });
      wrap.appendChild(h('label.radio', [r, h('span', { html: o[1] })]));
      return r;
    });
    return { el: wrap, input: inputs[0] || wrap, type: 'string', get: function () { return value; }, set: function (v) { value = v; inputs.forEach(function (r) { r.checked = r.value === v; }); } };
  }
  function checks(opts) {
    var value = opts.value || [];
    var wrap = h('div.radios.stacked');
    opts.options.forEach(function (o) {
      var c = h('input', { type: 'checkbox', value: o[0], checked: value.indexOf(o[0]) >= 0 });
      c.addEventListener('change', function () {
        value = value.filter(function (v) { return v !== o[0]; });
        if (c.checked) value.push(o[0]);
        opts.onChange && opts.onChange(value);
      });
      wrap.appendChild(h('label.radio', [c, h('span', { html: o[1] })]));
    });
    return { el: wrap, input: wrap, get: function () { return value; } };
  }
  function checkbox(labelText, opts) {
    opts = opts || {};
    var c = h('input', { type: 'checkbox', checked: !!opts.value });
    c.addEventListener('change', function () { opts.onChange && opts.onChange(c.checked); });
    var el = h('label.radio.single', [c, h('span', { html: labelText })]);
    return { el: el, input: c, type: 'bool', get: function () { return c.checked; }, set: function (v) { c.checked = !!v; } };
  }
  var FILING = [['single', 'Single'], ['mfj', 'Married filing jointly'], ['hoh', 'Head of household'], ['mfs', 'Married filing separately']];
  var BRACKETS = function () { return T().marginalRates.map(function (r) { return [String(r), pct(r, 0) + ' bracket']; }); };

  /* ---------------------------------------------------------------------- */
  /* Result / layout components                                              */
  /* ---------------------------------------------------------------------- */
  function stat(label, value, sub, tone) {
    return h('div.stat' + (tone ? '.' + tone : ''), [h('div.stat-label', label), h('div.stat-value', value), sub ? h('div.stat-sub', { html: sub }) : null]);
  }
  function bars(rows, opts) {
    // rows: [{label, value, tone}] — horizontal comparison bars
    opts = opts || {};
    var max = Math.max.apply(null, rows.map(function (r) { return Math.abs(r.value); }).concat([1]));
    return h('div.bars', rows.map(function (r) {
      var w = Math.max(2, Math.abs(r.value) / max * 100);
      return h('div.bar-row', [
        h('div.bar-label', r.label),
        h('div.bar-track', [h('div.bar-fill' + (r.tone ? '.' + r.tone : ''), { style: { width: w + '%' } })]),
        h('div.bar-value', opts.format ? opts.format(r.value) : money(r.value))
      ]);
    }));
  }
  function callout(kind, html) { return h('div.callout.' + kind, { html: html }); }
  function section(title, children) { return h('div.section', [title ? h('h3.h3', title) : null, children]); }
  function li(html) { return h('li', { html: html }); }
  function list(items, cls) { return h('ul.list' + (cls ? '.' + cls : ''), items.filter(Boolean).map(function (i) { return h('li', { html: i }); })); }
  function button(label, onClick, kind) { return h('button.btn' + (kind ? '.' + kind : ''), { type: 'button', on: { click: onClick } }, label); }
  function linkBtn(label, href, kind) { return h('a.btn' + (kind ? '.' + kind : ''), { href: href, target: '_blank', rel: 'noopener' }, label); }
  function copyButton(getText, label) {
    var b = button(label || 'Copy text', function () {
      var t = getText();
      var done = function () { b.textContent = 'Copied ✓'; setTimeout(function () { b.textContent = label || 'Copy text'; }, 1800); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, function () { fallback(t); done(); });
      else { fallback(t); done(); }
    }, 'secondary');
    function fallback(t) { var ta = h('textarea', { style: { position: 'fixed', opacity: 0 } }); ta.value = t; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) { } document.body.removeChild(ta); }
    return b;
  }
  function advisorQuestions(items) {
    return h('details.advisor', [h('summary', 'Questions to bring to your advisor'), list(items)]);
  }
  function disclaimer(extra) {
    var o = ORG(), t = T();
    return h('div.disclaimer', [
      h('p', { html: '<strong>' + o.name + ' is not a tax, legal, or financial advisor.</strong> This tool offers general education and rough estimates to help you ask better questions. It is not advice. Results depend on details this tool cannot know. Please consult your own attorney, accountant, or financial advisor before making a gift.' }),
      extra ? h('p', { html: extra }) : null,
      h('p.fine', { html: 'Federal figures reflect tax year <strong>' + t.taxYear + '</strong> (last reviewed ' + t.lastReviewed + '). ' + t.lawNote + ' State and local taxes vary and are only partly reflected. ' + o.name + ' · ' + o.taxStatus + ' · EIN ' + o.ein + ' · <a href="' + o.urls.tools + '" target="_blank" rel="noopener">About these tools</a>' })
    ]);
  }
  function toolUrl(name) { var b = ORG().urls.toolBase || ORG().urls.tools; return b.replace(/\/?$/, '/') + name; }
  function contactLine() {
    var o = ORG();
    var who = o.contactName ? o.contactName + ' · ' : '';
    return h('p.contact', { html: 'Questions? ' + who + '<a href="mailto:' + o.contactEmail + '">' + o.contactEmail + '</a>' + (o.contactPhone ? ' · ' + o.contactPhone : '') });
  }
  function intentCTA(text) {
    var o = ORG();
    var href = o.urls.intentForm || ('mailto:' + o.contactEmail + '?subject=' + encodeURIComponent('I have included the Library in my plans') + '&body=' + encodeURIComponent('Hello,\n\nI would like to let you know that I have included the ' + o.name + ' in my estate plans.\n\nName:\nPhone:\nBest way to reach me:\n\nThank you.'));
    return h('div.cta', [h('p', text || 'If you have already included the Library in your plans, please let us know so we can thank you and welcome you to the ' + o.legacySociety + '.'), linkBtn('Tell us about your gift', href, 'primary')]);
  }

  /* ---------------------------------------------------------------------- */
  /* Mounting                                                                */
  /* ---------------------------------------------------------------------- */
  function readOptions(el) {
    var o = {};
    Array.prototype.forEach.call(el.attributes, function (a) {
      if (a.name.indexOf('data-') === 0) o[a.name.slice(5).replace(/-([a-z])/g, function (_, c) { return c.toUpperCase(); })] = a.value;
    });
    return o;
  }
  function applyOverrides(opts) {
    var o = ORG();
    if (opts.intentFormUrl) o.urls.intentForm = opts.intentFormUrl;
    if (opts.toolBase) o.urls.toolBase = opts.toolBase;
    if (opts.contactEmail) o.contactEmail = opts.contactEmail;
    if (opts.contactName) o.contactName = opts.contactName;
    if (opts.contactPhone) o.contactPhone = opts.contactPhone;
    if (opts.offersGiftAnnuities) o.offersGiftAnnuities = opts.offersGiftAnnuities === 'true';
    if (opts.ndFundName) o.ndEndowment.fundName = opts.ndFundName;
    if (opts.ndConfirmed) o.ndEndowment.confirmed = opts.ndConfirmed === 'true';
    if (opts.ndGiveUrl) o.ndEndowment.giveUrl = opts.ndGiveUrl;
  }
  function mount(name, el) {
    var def = GT.registry[name];
    if (!def || el.getAttribute('data-trpl-mounted')) return;
    el.setAttribute('data-trpl-mounted', '1');
    var opts = readOptions(el);
    injectCSS(opts.loadFonts !== 'false');
    applyOverrides(opts);
    var root = h('div.gt', { 'data-tool': name, 'data-theme': opts.theme || 'light' });
    if (opts.accent) root.style.setProperty('--trpl-accent', opts.accent);
    if (opts.compact === 'true') root.classList.add('trpl-compact');
    clear(el).appendChild(root);
    var head = h('div.head', [h('div.eyebrow', ORG().shortName === 'the Library' ? 'Giving Tools' : ORG().shortName), h('h2.h2', def.title), def.intro ? h('p.intro', { html: def.intro }) : null]);
    if (opts.hideHeader === 'true') head.style.display = 'none';
    root.appendChild(head);
    var body = h('div.body');
    root.appendChild(body);
    try {
      def.render(body, GT, opts);
      if (def.share !== false && GT.shareBar) body.appendChild(GT.shareBar(name, root, def.title, def.getState));
    }
    catch (e) { body.appendChild(callout('warn', 'This tool could not load. Please refresh the page or contact ' + ORG().contactEmail + '.')); if (window.console) console.error('[TRPL Giving Tools]', name, e); }
    if (def.disclaimer !== false) root.appendChild(disclaimer(def.disclaimerExtra));
    GT.mounted.push({ name: name, el: el });
  }
  function mountAll(name) {
    var sel = name ? '[data-trpl-tool="' + name + '"]' : '[data-trpl-tool]';
    var els = document.querySelectorAll(sel);
    if (!els.length && name && document.currentScript) {
      var ph = h('div', { 'data-trpl-tool': name });
      document.currentScript.parentNode.insertBefore(ph, document.currentScript.nextSibling);
      els = [ph];
    }
    Array.prototype.forEach.call(els, function (el) { mount(el.getAttribute('data-trpl-tool'), el); });
  }
  GT.register = function (name, def) {
    GT.registry[name] = def;
    var run = function () { mountAll(name); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  };
  GT.mount = mount; GT.mountAll = mountAll;

  /* Public helper surface used by the tools */
  Object.assign(GT, {
    h: h, append: append, clear: clear, num: num, money: money, pct: pct, clamp: clamp, interp: interp,
    T: T, ORG: ORG, marginalRate: marginalRate, ltcgRate: ltcgRate, deductionRate: deductionRate, stdDeduction: stdDeduction,
    seniorBonus: seniorBonus, saltAllowed: saltAllowed, charitableAfterFloor: charitableAfterFloor, nonItemizerDeduction: nonItemizerDeduction,
    lifeExpectancy: lifeExpectancy, pvAnnuity: pvAnnuity,
    field: field, moneyInput: moneyInput, numberInput: numberInput, percentInput: percentInput, select: select, radios: radios, checks: checks, checkbox: checkbox,
    FILING: FILING, BRACKETS: BRACKETS,
    stat: stat, bars: bars, callout: callout, section: section, list: list, li: li, button: button, linkBtn: linkBtn, copyButton: copyButton,
    advisorQuestions: advisorQuestions, disclaimer: disclaimer, toolUrl: toolUrl, contactLine: contactLine, intentCTA: intentCTA
  });
})();

/* ============================================================================
 * TRPL Giving Tools — SHARE, PDF & PAPERWORK HELPERS
 * Shareable scenarios (state <-> URL), the on-demand pdf-lib loader, a small
 * flowing-document builder, AcroForm filling, the advisor one-pager, and the
 * Heritage Society statement of intent. Loaded after core.js; guarded.
 * ========================================================================== */
(function (GT) {
  if (GT.shareBar) return;
  var h = GT.h, ORG = GT.ORG, T = GT.T, button = GT.button, copyButton = GT.copyButton, field = GT.field, section = GT.section, numberInput = GT.numberInput, checkbox = GT.checkbox;

  /* ---- Shareable scenarios: ?tool.key=value ------------------------------ */
  function state(name, defaults) {
    var out = {}; Object.keys(defaults).forEach(function (k) { out[k] = Array.isArray(defaults[k]) ? defaults[k].slice() : defaults[k]; });
    try {
      var q = new URLSearchParams(location.search), pre = name + '.';
      q.forEach(function (v, k) {
        if (k.indexOf(pre) !== 0) return; var key = k.slice(pre.length); if (!(key in defaults)) return;
        var d = defaults[key];
        if (Array.isArray(d)) out[key] = v ? v.split(',') : [];
        else if (typeof d === 'boolean') out[key] = v === '1' || v === 'true';
        else if (typeof d === 'number') { var n = parseFloat(v); if (!isNaN(n)) out[key] = n; }
        else out[key] = v;
      });
    } catch (e) { }
    return out;
  }
  function applyState(ctl, s) {
    Object.keys(ctl).forEach(function (k) {
      var c = ctl[k]; if (!c || !c.set || s[k] == null) return;
      try { c.set(c.type === 'bool' ? !!s[k] : c.type === 'number' ? Number(s[k]) : String(s[k])); } catch (e) { }
    });
  }
  function shareUrl(name, s) {
    var q = new URLSearchParams();
    Object.keys(s).forEach(function (k) { var v = s[k]; if (v == null || v === '' || typeof v === 'function') return; q.set(name + '.' + k, Array.isArray(v) ? v.join(',') : typeof v === 'boolean' ? (v ? '1' : '0') : String(v)); });
    return location.origin + location.pathname + '?' + q.toString();
  }
  function shareButton(name, getState) { return copyButton(function () { return shareUrl(name, getState()); }, 'Copy link to this scenario'); }

  /* ---- PDF plumbing ------------------------------------------------------ */
  function loadPdfLib() {
    return new Promise(function (res, rej) {
      if (window.PDFLib) return res(window.PDFLib);
      var sc = document.createElement('script'); sc.src = GT.base + 'vendor/pdf-lib.min.js'; sc.async = true;
      sc.onload = function () { res(window.PDFLib); }; sc.onerror = function () { rej(new Error('PDF library failed to load')); };
      document.head.appendChild(sc);
    });
  }
  function downloadBytes(bytes, filename) {
    var blob = new Blob([bytes], { type: 'application/pdf' }), url = URL.createObjectURL(blob);
    var a = h('a', { href: url, download: filename }); document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
  }
  function stripHtml(x) { var d = document.createElement('div'); d.innerHTML = x; return (d.textContent || '').replace(/\s+/g, ' ').trim(); }
  /* The built-in PDF fonts speak WinAnsi only; map the symbols we use and drop the rest. */
  var GLYPH_MAP = { '\u2605': '*', '\u2713': '-', '\u2714': '-', '\u2248': '~', '\u2192': '->', '\u2190': '<-', '\u2264': '<=', '\u2265': '>=', '\u2212': '-', '\u2153': '1/3', '\u2154': '2/3', '\u00bd': '1/2', '\u00bc': '1/4', '\u00be': '3/4', '\u2009': ' ', '\u202f': ' ', '\u00a0': ' ' };
  var WINANSI_EXTRA = '\u2018\u2019\u201a\u201c\u201d\u201e\u2020\u2021\u2022\u2026\u2030\u2039\u203a\u20ac\u2122\u2013\u2014\u02dc\u02c6\u0152\u0153\u0160\u0161\u0178\u017d\u017e\u0192';
  function pdfSafe(text) {
    return String(text).split('').map(function (ch) {
      if (GLYPH_MAP[ch] != null) return GLYPH_MAP[ch];
      var c = ch.charCodeAt(0); return (c < 0x100 || WINANSI_EXTRA.indexOf(ch) >= 0) ? ch : '';
    }).join('');
  }
  function today() { return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }); }

  /* Simple flowing document. blocks: {h}, {p}, {small}, {kv:[[k,v]]}, {ul:[]}, {sig:[labels]}, {gap:n} */
  function makePDF(opts) {
    return loadPdfLib().then(function (P) {
      return P.PDFDocument.create().then(function (doc) {
        return Promise.all([doc.embedFont(P.StandardFonts.Helvetica), doc.embedFont(P.StandardFonts.HelveticaBold)]).then(function (fonts) {
          var F = fonts[0], B = fonts[1], W = 612, H = 792, M = 54, y, page, o = ORG(), t = T();
          var ink = P.rgb(0.145, 0.157, 0.165), orange = P.rgb(0.906, 0.502, 0.365), gray = P.rgb(0.31, 0.314, 0.32), line = P.rgb(0.85, 0.83, 0.78);
          function wrap(text, font, size, width) {
            var words = pdfSafe(text).split(/\s+/), lines = [], cur = '';
            words.forEach(function (w) { var tryLine = cur ? cur + ' ' + w : w; if (font.widthOfTextAtSize(tryLine, size) > width && cur) { lines.push(cur); cur = w; } else cur = tryLine; });
            if (cur) lines.push(cur); return lines;
          }
          function footer() {
            var fy = M - 14;
            page.drawLine({ start: { x: M, y: fy + 18 }, end: { x: W - M, y: fy + 18 }, thickness: 0.5, color: line });
            var ft = opts.footer || (o.name + ' · ' + o.taxStatus + ' · EIN ' + o.ein + ' · ' + o.address + ' · ' + o.contactEmail);
            wrap(ft, F, 7.5, W - 2 * M - 60).slice(0, 2).forEach(function (ln, i) { page.drawText(ln, { x: M, y: fy + 6 - i * 9, size: 7.5, font: F, color: gray }); });
            page.drawText('Page ' + doc.getPageCount(), { x: W - M - 40, y: fy + 6, size: 7.5, font: F, color: gray });
          }
          function header() {
            page.drawText(pdfSafe(o.name).toUpperCase(), { x: M, y: y, size: 9, font: B, color: orange }); y -= 16;
            wrap(opts.title, B, 18, W - 2 * M).forEach(function (ln) { page.drawText(ln, { x: M, y: y - 6, size: 18, font: B, color: ink }); y -= 22; });
            y -= 6;
            if (opts.subtitle) { page.drawText(pdfSafe(opts.subtitle), { x: M, y: y, size: 9.5, font: F, color: gray }); y -= 12; }
            page.drawLine({ start: { x: M, y: y - 4 }, end: { x: W - M, y: y - 4 }, thickness: 1.5, color: ink }); y -= 22;
          }
          function newPage() { page = doc.addPage([W, H]); y = H - M; if (doc.getPageCount() === 1) header(); else y -= 10; }
          function ensure(n) { if (y - n < M + 30) { footer(); newPage(); } }
          function para(text, size, font, color, x, width) {
            size = size || 10.5; font = font || F; x = x || M; width = width || (W - 2 * M);
            wrap(stripHtml(text), font, size, width).forEach(function (ln) { ensure(size + 4); page.drawText(ln, { x: x, y: y, size: size, font: font, color: color || ink }); y -= size * 1.42; });
          }
          newPage();
          (opts.blocks || []).forEach(function (b) {
            if (!b) return;
            if (b.h) { ensure(30); y -= 6; page.drawText(pdfSafe(String(b.h)).toUpperCase(), { x: M, y: y, size: 10, font: B, color: orange }); y -= 16; }
            else if (b.p) { para(b.p); y -= 6; }
            else if (b.small) { para(b.small, 8.5, F, gray); y -= 4; }
            else if (b.kv) {
              b.kv.forEach(function (row) {
                ensure(16); var k = stripHtml(row[0]), v = stripHtml(row[1] == null ? '' : row[1]);
                var kl = wrap(k, F, 10, 250), vl = wrap(v || '—', B, 10, W - 2 * M - 270);
                var start = y;
                kl.forEach(function (ln, i) { page.drawText(ln, { x: M, y: start - i * 13, size: 10, font: F, color: gray }); });
                vl.forEach(function (ln, i) { page.drawText(ln, { x: M + 270, y: start - i * 13, size: 10, font: B, color: ink }); });
                y = start - Math.max(kl.length, vl.length) * 13 - 3;
              }); y -= 6;
            }
            else if (b.ul) { b.ul.forEach(function (it) { ensure(16); page.drawText('•', { x: M + 4, y: y, size: 10.5, font: F, color: orange }); wrap(stripHtml(it), F, 10.5, W - 2 * M - 18).forEach(function (ln) { ensure(15); page.drawText(ln, { x: M + 18, y: y, size: 10.5, font: F, color: ink }); y -= 15; }); y -= 2; }); y -= 6; }
            else if (b.sig) { ensure(60); y -= 24; b.sig.forEach(function (lab, i) { var x = M + i * 260; page.drawLine({ start: { x: x, y: y }, end: { x: x + 230, y: y }, thickness: 0.8, color: ink }); page.drawText(pdfSafe(lab), { x: x, y: y - 12, size: 8.5, font: F, color: gray }); }); y -= 36; }
            else if (b.gap) { y -= b.gap; }
          });
          if (opts.disclaimer !== false) {
            ensure(80); y -= 8; page.drawLine({ start: { x: M, y: y }, end: { x: W - M, y: y }, thickness: 0.5, color: line }); y -= 14;
            para(o.name + ' is not a tax, legal, or financial advisor. This document contains general information and estimates prepared from figures you entered; it is not advice. Please review it with your own attorney, accountant, or financial advisor. Federal figures reflect tax year ' + t.taxYear + ' (reviewed ' + t.lastReviewed + '). Prepared ' + today() + ' with the Library’s giving tools at ' + o.urls.tools + '.', 8, F, gray);
          }
          footer();
          return doc.save();
        });
      });
    });
  }
  /* Fill a bundled AcroForm. fields: { 'Field name': 'text' | true }. opts.stamp draws a draft notice on page 1. */
  function fillForm(file, fields, opts) {
    opts = opts || {};
    return Promise.all([loadPdfLib(), fetch(GT.base + file).then(function (r) { if (!r.ok) throw new Error('form not found'); return r.arrayBuffer(); })]).then(function (rs) {
      var P = rs[0];
      return P.PDFDocument.load(rs[1]).then(function (doc) {
        var form = doc.getForm();
        Object.keys(fields).forEach(function (k) {
          var v = fields[k]; if (v == null || v === '') return;
          try { if (v === true) form.getCheckBox(k).check(); else { var f = form.getTextField(k); f.setText(pdfSafe(v)); if (opts.fontSize) f.setFontSize(opts.fontSize); } }
          catch (e) { if (window.console) console.warn('[TRPL Giving Tools] form field not found:', k); }
        });
        return doc.embedFont(P.StandardFonts.HelveticaBold).then(function (fnt) {
          if (opts.stamp) { var pg = doc.getPages()[0]; pg.drawText(pdfSafe(opts.stamp), { x: 36, y: pg.getHeight() - 22, size: 8, font: fnt, color: P.rgb(0.82, 0.46, 0.34) }); }
          return doc.save();
        });
      });
    });
  }
  /* Turn multi-line letter text into document blocks (one block per line, gaps for blank lines) */
  function letterBlocks(text) { return String(text).split('\n').map(function (ln) { return ln.trim() ? { p: ln } : { gap: 8 }; }); }
  function draftStamp() { return 'DRAFT — prepared with the Library’s giving tools on ' + new Date().toLocaleDateString('en-US') + '. Estimates only; review with your tax preparer before filing.'; }

  /* ---- Advisor one-pager, read from what the tool is showing ------------- */
  function visible(el) { return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length); }
  function summaryFromDOM(root) {
    var inputs = [], results = [], notes = [], questions = [];
    Array.prototype.forEach.call(root.querySelectorAll('.trpl-field'), function (f) {
      if (!visible(f) || f.closest('.trpl-sharebar')) return;
      var lab = f.querySelector('.trpl-label'); if (!lab) return;
      var val = '', sel = f.querySelector('select'), inp = f.querySelector('input:not([type=radio]):not([type=checkbox]), textarea');
      if (sel) val = sel.options[sel.selectedIndex] ? sel.options[sel.selectedIndex].text : '';
      else if (f.querySelector('input[type=radio], input[type=checkbox]')) val = Array.prototype.map.call(f.querySelectorAll('input:checked'), function (c) { var sp = c.parentNode.querySelector('span'); return sp ? stripHtml(sp.innerHTML) : ''; }).join('; ') || '—';
      else if (inp) { var pre = f.querySelector('.trpl-prefix'), suf = f.querySelector('.trpl-suffix'); val = inp.value ? (pre ? pre.textContent : '') + inp.value + (suf ? suf.textContent : '') : ''; }
      if (val !== '') inputs.push([lab.textContent, val]);
    });
    Array.prototype.forEach.call(root.querySelectorAll('.trpl-stat'), function (st) {
      if (!visible(st)) return; var sub = st.querySelector('.trpl-stat-sub');
      results.push([st.querySelector('.trpl-stat-label').textContent, st.querySelector('.trpl-stat-value').textContent + (sub ? ' — ' + stripHtml(sub.innerHTML) : '')]);
    });
    Array.prototype.forEach.call(root.querySelectorAll('.trpl-textout'), function (x) { if (visible(x) && x.textContent.trim()) notes.push(x.textContent.trim()); });
    function textOf(el) { var c = el.cloneNode(true); Array.prototype.forEach.call(c.querySelectorAll('.trpl-actions, .trpl-btn, .trpl-tag'), function (x) { x.parentNode.removeChild(x); }); return Array.prototype.map.call(c.querySelectorAll('h4, p, li'), function (x) { return stripHtml(x.innerHTML); }).filter(Boolean).join(' ') || stripHtml(c.innerHTML); }
    Array.prototype.forEach.call(root.querySelectorAll('.trpl-callout, .trpl-rec'), function (c) { if (visible(c)) notes.push(textOf(c)); });
    Array.prototype.forEach.call(root.querySelectorAll('.trpl-advisor li'), function (li) { questions.push(stripHtml(li.innerHTML)); });
    return { inputs: inputs, results: results, notes: notes, questions: questions };
  }
  function advisorPDF(root, title) {
    var o = ORG(), sm = summaryFromDOM(root), blocks = [];
    blocks.push({ p: 'A summary of the scenario explored with the Library’s “' + title + '” tool, prepared to share with a financial, tax, or legal advisor.' });
    if (sm.inputs.length) { blocks.push({ h: 'What was entered' }); blocks.push({ kv: sm.inputs }); }
    if (sm.results.length) { blocks.push({ h: 'What the tool showed' }); blocks.push({ kv: sm.results }); }
    if (sm.notes.length) { blocks.push({ h: 'Notes' }); blocks.push({ ul: sm.notes.slice(0, 8) }); }
    if (sm.questions.length) { blocks.push({ h: 'Questions to discuss with your advisor' }); blocks.push({ ul: sm.questions }); }
    blocks.push({ h: 'About the Library' }); blocks.push({ kv: [['Legal name', o.name], ['Tax ID (EIN)', o.ein], ['Address', o.address], ['Gift planning contact', (o.contactName ? o.contactName + ', ' : '') + o.contactEmail]] });
    return makePDF({ title: title, subtitle: 'Advisor summary · prepared ' + today(), blocks: blocks });
  }
  function shareBar(name, root, title, getState) {
    var status = h('p.help');
    var pdfBtn = button('Download advisor summary (PDF)', function () {
      pdfBtn.disabled = true; status.textContent = 'Preparing your summary…';
      advisorPDF(root, title).then(function (bytes) { downloadBytes(bytes, (title.replace(/[^a-z0-9]+/gi, '-') + '-summary.pdf').toLowerCase()); status.textContent = 'Downloaded. Print it or attach it to an email to your advisor.'; })
        .catch(function (e) { status.textContent = 'Sorry — the PDF could not be prepared (' + e.message + '). Use Print instead.'; })
        .then(function () { pdfBtn.disabled = false; });
    }, 'highlight');
    return h('div.sharebar', [
      h('div.eyebrow', 'Save or share this'),
      h('div.actions', [pdfBtn, button('Print', function () { window.print(); }, 'secondary'), getState ? shareButton(name, getState) : null]),
      status
    ]);
  }

  /* ---- Heritage Society statement of intent ------------------------------ */
  function intentStatement(opts) {
    var o = ORG(); opts = opts || {};
    var blocks = [
      { p: 'I/we are pleased to share that the ' + o.name + ' has been included in my/our estate plans through ' + (opts.kind || 'a gift in my/our will or trust') + '. This statement is provided so the Library can plan for the future and recognize my/our commitment through the ' + o.legacySociety + '. It is an expression of intent, not a legal obligation, and may be changed at any time.' },
      { h: 'Donor' }, { kv: [['Name(s)', opts.name], ['Address', opts.address], ['Email / phone', opts.contact]] },
      { h: 'Gift' }, { kv: [['Type of gift', opts.kind], ['Description (optional)', opts.description], ['Estimated value (optional)', opts.value || 'Prefer not to say'], ['Purpose', opts.purpose || 'General charitable purposes'], ['Recognition', opts.anonymous ? 'Please keep my/our gift anonymous' : 'You may list my/our name(s) in ' + o.legacySociety + ' recognition']] },
      { h: 'Documents' }, { p: 'Where possible, a copy of the relevant page of the will, trust, or beneficiary designation is attached or will be provided. The Library keeps this information confidential.' },
      { sig: ['Donor signature', 'Date'] }, { sig: ['Second donor signature (if joint)', 'Date'] },
      { small: 'Return to: ' + o.name + ', ' + o.address + ' · ' + o.contactEmail + (o.urls.intentForm ? ' · or complete the online form at ' + o.urls.intentForm : '') }
    ];
    return makePDF({ title: o.legacySociety + ' statement of intent', subtitle: 'Confidential · ' + o.name, blocks: blocks, disclaimer: false });
  }
  function intentStatementSection(getKind, getDescription) {
    var o = ORG(), st = h('p.help');
    function txt(ph) { var i = numberInput({ value: '', placeholder: ph }); i.input.type = 'text'; return i; }
    var name = txt('Name(s)'), addr = txt('Street, city, state, ZIP'), contact = txt('Email or phone'), value = txt('Optional'), anon = checkbox('Keep my gift anonymous in any recognition');
    var btn = button('Download statement of intent (PDF)', function () {
      btn.disabled = true; st.textContent = 'Preparing…';
      intentStatement({ name: name.input.value, address: addr.input.value, contact: contact.input.value, value: value.input.value, anonymous: anon.get(), kind: getKind ? getKind() : '', description: getDescription ? getDescription() : '' })
        .then(function (b) { downloadBytes(b, 'heritage-society-statement-of-intent.pdf'); st.innerHTML = 'Downloaded. Sign it and return it to <a href="mailto:' + o.contactEmail + '">' + o.contactEmail + '</a>' + (o.urls.intentForm ? ', or use the <a href="' + o.urls.intentForm + '" target="_blank" rel="noopener">online form</a>' : '') + '.'; })
        .catch(function (e) { st.textContent = 'Could not build the PDF (' + e.message + ').'; }).then(function () { btn.disabled = false; });
    }, 'primary');
    return section('Printable statement of intent', [
      h('p.help', 'Prefer paper? Download a signable ' + o.legacySociety + ' statement to keep with your estate documents and mail or email to the Library.'),
      h('div.grid', [field('Name(s)', name), field('Mailing address', addr), field('Email or phone', contact), field('Estimated value', value, 'Entirely optional — it helps the Library plan.')]),
      h('div', [anon.el]), h('div.actions', [btn]), st
    ]);
  }

  Object.assign(GT, { pdfSafe: pdfSafe, letterBlocks: letterBlocks, state: state, applyState: applyState, shareUrl: shareUrl, shareButton: shareButton, loadPdfLib: loadPdfLib, downloadBytes: downloadBytes, stripHtml: stripHtml, makePDF: makePDF, fillForm: fillForm, draftStamp: draftStamp, summaryFromDOM: summaryFromDOM, advisorPDF: advisorPDF, shareBar: shareBar, intentStatement: intentStatement, intentStatementSection: intentStatementSection });
})(window.TRPLGivingTools);

/* @tool North Dakota Charitable Giving Tax Credit
 * Estimates the 40% ND income-tax credit for gifts to a qualified endowment
 * fund (or the deduction portion of a planned gift), how much of it a donor
 * can use given their ND tax, the federal deduction interplay, and the net
 * cost of the gift. N.D.C.C. § 57-38-01.21. */
(function (GT) {
  var h = GT.h, T = GT.T, ORG = GT.ORG, money = GT.money, pct = GT.pct;

  function ndTax(taxable, status) {
    var b = T().ndBrackets[status] || T().ndBrackets.single, tax = 0, lo = 0;
    for (var i = 0; i < b.length; i++) { var hi = b[i][0]; if (taxable > lo) tax += (Math.min(taxable, hi) - lo) * b[i][1]; lo = hi; if (taxable <= hi) break; }
    return tax;
  }

  GT.register('ndcredit', {
    title: 'North Dakota’s 40% tax credit for endowment gifts',
    intro: 'North Dakota taxpayers who give $5,000 or more to a qualified endowment fund — or make a planned gift such as a gift annuity or remainder trust — can claim a state income tax credit worth 40% of the gift, up to $10,000 per person ($20,000 for couples filing jointly). See what your gift could really cost.',
    disclaimerExtra: 'The credit is nonrefundable: it offsets North Dakota income tax you would otherwise owe, with unused amounts carried forward up to three years. It generally requires North Dakota tax liability; nonresidents with North Dakota-source income should ask their preparer how credits apply to them. Federal figures assume the IRS rule that reduces a charitable deduction by state credits received (Treas. Reg. § 1.170A-1(h)(3)).',
    render: function (root) {
      var t = T(), o = ORG(), c = t.ndCredit;
      var s = GT.state('ndcredit', { who: 'individual', kind: 'endowment', status: 'mfj', gift: 25000, deduction: 40000, ndIncome: 150000, rate: '0.24', itemize: 'no', saltRoom: false });
      var out = h('div.section');
      var ctl = {
        who: GT.radios({ options: [['individual', 'An individual or couple'], ['business', 'A business, trust, or estate']], value: 'individual', onChange: function (v) { s.who = v; toggle(); calc(); } }),
        kind: GT.radios({ stacked: true, options: [
          ['endowment', '<b>An outright gift to the endowment</b> — cash, stock, or other assets given now to the Library’s permanent endowment fund'],
          ['planned', '<b>A planned gift</b> — a charitable gift annuity, remainder trust, lead trust, life estate, or paid-up life insurance policy']], value: 'endowment', onChange: function (v) { s.kind = v; toggle(); calc(); } }),
        status: GT.select({ options: GT.FILING, value: 'mfj', onChange: function (v) { s.status = v; calc(); } }),
        gift: GT.moneyInput({ value: s.gift, onChange: function (v) { s.gift = v; calc(); } }),
        deduction: GT.moneyInput({ value: s.deduction, onChange: function (v) { s.deduction = v; calc(); } }),
        ndIncome: GT.moneyInput({ value: s.ndIncome, onChange: function (v) { s.ndIncome = v; calc(); } }),
        rate: GT.select({ options: GT.BRACKETS(), value: '0.24', onChange: function (v) { s.rate = v; calc(); } }),
        itemize: GT.radios({ options: [['no', 'No'], ['yes', 'Yes'], ['unsure', 'Not sure']], value: 'no', onChange: function (v) { s.itemize = v; calc(); } }),
        saltRoom: GT.checkbox('I itemize and my state and local taxes are <b>below</b> the federal SALT cap (' + money(t.salt.cap.mfj) + ')', { onChange: function (v) { s.saltRoom = v; calc(); } })
      };
      GT.applyState(ctl, s); this.getState = function () { return s; };
      var statusField = GT.field('Filing status', ctl.status);
      var giftField = GT.field('Gift to the endowment', ctl.gift, 'Individuals must give at least ' + money(c.minGift) + ' in a year (one gift or several) to qualify. A gift of ' + money(c.maxIndividual / c.rate) + ' earns the full ' + money(c.maxIndividual) + ' credit for one person; ' + money(c.maxJoint / c.rate) + ' earns ' + money(c.maxJoint) + ' for a couple filing jointly.');
      var dedField = GT.field('Federal charitable deduction for the planned gift', ctl.deduction, 'The credit is 40% of the <i>deductible portion</i> of a planned gift — the present value of what the Library will eventually receive — not the whole amount you transfer. The <a href="' + GT.toolUrl('lifeincome') + '" target="_blank" rel="noopener">life-income illustrator</a> estimates it.');
      var ndField = GT.field('Your North Dakota taxable income', ctl.ndIncome, 'North Dakota starts from federal taxable income. Used only to estimate how much of the credit you can use this year versus carry forward.');
      var rateField = GT.field('Your federal tax bracket', ctl.rate);
      var itemField = GT.field('Do you itemize federal deductions?', ctl.itemize);
      var saltField = h('div', [ctl.saltRoom.el]);
      function toggle() {
        var biz = s.who === 'business';
        giftField.style.display = s.kind === 'endowment' || biz ? '' : 'none';
        dedField.style.display = s.kind === 'planned' && !biz ? '' : 'none';
        statusField.style.display = biz ? 'none' : '';
        rateField.style.display = biz ? 'none' : '';
        itemField.style.display = biz ? 'none' : '';
        saltField.style.display = biz ? 'none' : '';
        ndField.style.display = biz ? 'none' : '';
      }
      GT.append(root, [
        GT.field('Who is making the gift?', ctl.who),
        h('div', { id: 'trpl-nd-kind' }, [GT.field('What kind of gift?', ctl.kind)]),
        h('div.grid', [statusField, giftField, dedField, ndField, rateField, itemField]),
        saltField,
        out
      ]);

      function calc() {
        GT.clear(out);
        var biz = s.who === 'business';
        var kind = biz ? 'endowment' : s.kind;
        var base = kind === 'endowment' ? s.gift : s.deduction;        // amount the 40% applies to
        var cap = biz ? c.maxBusiness : (s.status === 'mfj' ? c.maxJoint : c.maxIndividual);
        var tooSmall = !biz && kind === 'endowment' && s.gift < c.minGift;
        var credit = tooSmall ? 0 : Math.min(base * c.rate, cap);
        // Entity tax varies (C-corp rates, pass-through to owners), so for a business we show the credit without estimating liability.
        var ndLiab = biz ? credit : ndTax(s.ndIncome, s.status);
        var useNow = Math.min(credit, ndLiab), carry = credit - useNow;
        var yearsToUse = ndLiab > 0 ? Math.ceil(credit / ndLiab) : Infinity;
        var usable = ndLiab > 0 ? Math.min(credit, ndLiab * (1 + c.carryforwardYears)) : 0;
        var lost = credit - usable;

        // Federal interplay (individuals): deduction reduced by the credit; SALT safe harbor may recover it
        var r = parseFloat(s.rate), dr = GT.deductionRate(r);
        var fedDed = 0, fedNote = '';
        if (!biz) {
          var reduced = Math.max(0, base - credit);
          if (s.itemize === 'yes') {
            var floorHit = Math.max(0, reduced - t.charitable.itemizerFloorPct * s.ndIncome * 1.1); // rough AGI proxy
            fedDed = (Math.min(reduced, floorHit) + (s.saltRoom ? credit : 0)) * dr;
            fedNote = 'Deduction reduced from ' + money(base) + ' to ' + money(reduced) + ' because of the state credit' + (s.saltRoom ? '; the ' + money(credit) + ' difference is treated as state tax paid under the IRS safe harbor.' : '. If your SALT deduction is under the cap, the safe harbor may let you deduct the difference as state tax instead.');
          } else {
            fedDed = GT.nonItemizerDeduction(kind === 'endowment' ? reduced : 0, s.status) * r;
            fedNote = 'Taking the standard deduction: only the ' + money(t.charitable.nonItemizer[s.status]) + ' non-itemizer deduction applies' + (kind === 'planned' ? ' (cash gifts only, so not to a planned gift)' : '') + '.';
          }
        }
        var gross = kind === 'endowment' ? s.gift : s.deduction;
        var netCost = gross - usable - fedDed;

        GT.append(out, [
          tooSmall ? GT.callout('warn', '<p><b>Below the minimum.</b> Individuals must give at least ' + money(c.minGift) + ' to a qualified endowment in a tax year to claim the credit. Several gifts during the year can be combined to reach it — or a gift of appreciated stock can get you there tax-efficiently.</p>') : null,
          h('div.stats', [
            GT.stat('North Dakota tax credit', money(credit), credit >= cap ? 'The maximum — ' + money(cap) + (biz ? ' per entity' : s.status === 'mfj' ? ' for a couple filing jointly' : ' per taxpayer') + '.' : pct(c.rate, 0) + ' of ' + money(base) + '.', 'good'),
            !biz ? GT.stat('Usable this year', money(useNow), ndLiab > 0 ? 'Against an estimated ' + money(ndLiab) + ' of North Dakota tax.' : 'No North Dakota tax estimated at this income.', useNow > 0 ? 'good' : 'muted') : GT.stat('Who uses it', 'Entity or owners', 'C corporations claim it on Form 40; S corporations, partnerships, and trusts pass it through to owners or beneficiaries on Schedule QEC.', 'muted'),
            !biz ? GT.stat('Carried forward', money(carry), carry > 0 ? (isFinite(yearsToUse) ? 'Used over about ' + Math.min(yearsToUse, 4) + ' years; up to ' + c.carryforwardYears + ' carryforward years allowed.' : 'Needs North Dakota tax to use.') : 'Nothing to carry forward.', carry > 0 ? 'highlight' : 'muted') : null,
            !biz ? GT.stat('Federal tax saved (est.)', money(fedDed), fedNote, 'muted') : null,
            GT.stat('Net cost of your ' + money(gross) + ' gift', money(Math.max(0, netCost)), 'After the ' + money(usable) + ' of credit you can realistically use' + (!biz && fedDed > 0 ? ' and ' + money(fedDed) + ' in federal savings' : '') + '.', 'highlight')
          ]),
          GT.bars([{ label: 'Your gift', value: gross, tone: 'muted' }, { label: 'ND credit (usable)', value: usable, tone: 'good' }, !biz ? { label: 'Federal savings', value: fedDed, tone: 'good' } : null, { label: 'Net cost to you', value: Math.max(0, netCost), tone: 'highlight' }].filter(Boolean)),
          lost > 0 ? GT.callout('warn', '<p>About <b>' + money(lost) + '</b> of the credit would expire unused after the three carryforward years at this level of North Dakota income. Splitting the gift across two tax years, or giving as a couple filing jointly, can capture more of it.</p>') : null,
          !biz && ndLiab === 0 ? GT.callout('warn', '<p><b>This credit only helps if you owe North Dakota income tax.</b> At the income entered, North Dakota tax is zero — the credit would have no value. If you live elsewhere, your own state may have similar incentives; the federal benefits of endowment and planned gifts still apply.</p>') : null,
          kind === 'endowment' && !tooSmall && credit < cap && !biz ? GT.callout('info', 'A gift of <b>' + money(cap / c.rate) + '</b> would earn the full ' + money(cap) + ' credit' + (s.status !== 'mfj' ? '; couples filing jointly can claim up to ' + money(c.maxJoint) + ' on ' + money(c.maxJoint / c.rate) : '') + '.') : null,
          GT.callout('good', '<p><b>Stack the benefits.</b> Give appreciated stock to the endowment and you avoid capital gains tax, may deduct it federally (net of the credit), and claim the 40% state credit. A qualified charitable distribution from an IRA (age 70½+) can also fund the endowment and earn the credit; it stays out of your <i>federal</i> income.</p><p><b>No double-dip on the state return:</b> North Dakota adds the federally deducted portion of the gift — or the IRA amount excluded federally — back to state taxable income (Form ND-1, line 2). At North Dakota’s 1.95–2.5% rates that costs a few hundred dollars at most against a credit worth thousands.</p>'),
          o.ndEndowment.confirmed && o.ndEndowment.fundName
            ? GT.callout('info', '<p>Gifts designated to the <b>' + o.ndEndowment.fundName + '</b> qualify. Please note “endowment” on your gift so it is recorded correctly, and keep the Library’s acknowledgment for your ' + (kind === 'endowment' ? c.formEndowment : c.formPlanned) + '.</p>')
            : GT.callout('warn', '<p><b>Before you count on the credit:</b> it applies only to gifts directed to a qualified endowment fund — a permanent, irrevocable fund that spends only its earnings. Please email <a href="mailto:' + o.contactEmail + '">' + o.contactEmail + '</a> and we will confirm how to designate your gift to the Library’s endowment so it qualifies.</p>'),
          GT.section('How to claim it', h('ol.steps', [
            GT.li('Make your gift to the ' + o.name + ' and designate it for the <b>endowment</b>' + (kind === 'planned' ? ', or complete the planned gift with your advisor' : '') + '. Ask us for the <b>qualification letter</b> — the schedule requires a statement from the nonprofit that it and the fund meet N.D.C.C. § 57-38-01.21 — and keep it with your acknowledgment.'),
            GT.li('File <b>' + (kind === 'endowment' ? c.formEndowment : c.formPlanned) + '</b> with your North Dakota return' + (biz ? ' (Schedule QEC for entities)' : '') + '. The statute is ' + c.statute + '.'),
            GT.li('If the credit exceeds your North Dakota tax, carry the balance forward — up to ' + c.carryforwardYears + ' more years.'),
            GT.li('On your federal return, reduce the charitable deduction by the credit (your preparer will know the rule) — or use the SALT safe harbor if you have room under the cap.')
          ])),
          (!biz && kind === 'endowment' && !tooSmall) ? worksheet(credit, base, cap, ndLiab) : null,
          h('div.actions', [GT.linkBtn('Give to the endowment', o.ndEndowment.giveUrl || o.urls.donate, 'primary'), GT.linkBtn('Stock gift calculator', GT.toolUrl('stock'), 'secondary'), GT.linkBtn('ND Tax Commissioner: endowment credit', 'https://www.tax.nd.gov/income-tax-incentives/endowment-fund-contribution-tax-credit', 'secondary')]),
          GT.advisorQuestions([
            'Does my gift qualify — is the fund a “qualified endowment” under N.D.C.C. § 57-38-01.21, and have I met the ' + money(c.minGift) + ' minimum this year?',
            'How much North Dakota tax will I owe this year and the next three, and should I size or split the gift to use the whole credit?',
            'How does the credit reduce my federal charitable deduction, and can I use the SALT safe harbor for the difference?',
            'Would a QCD from my IRA or a gift of appreciated stock to the endowment be better than cash?',
            'For a planned gift, what is the deductible portion the 40% applies to, and which year do I claim it?',
            biz ? 'Which of my entities should make the gift, and how does the credit flow through to owners?' : 'If I file jointly, can we claim up to ' + money(c.maxJoint) + '?'
          ]),
          GT.contactLine()
        ]);
      }
      /* ---- Pre-filled Schedule ND-1QEC worksheet (client-side, nothing uploaded) ---- */
      var ws = { name: '', carry: 0 };
      var wsName = GT.numberInput({ value: '', placeholder: 'As shown on your return (optional)' }); wsName.input.type = 'text'; wsName.input.autocomplete = 'name'; wsName.input.addEventListener('input', function () { ws.name = wsName.input.value; });
      var wsCarry = GT.moneyInput({ value: 0, onChange: function (v) { ws.carry = v; } });
      var wsStatus = h('p.help');
      function worksheet(credit, base, cap, ndLiab) {
        var f = t.ndForms.qec;
        var btn = GT.button('Download pre-filled ' + f.title + ' (' + f.formYear + ')', function () { fillQEC(credit, base, cap, ndLiab, btn); }, 'primary');
        return GT.section('Draft your ' + f.title, [
          h('p.help', { html: 'We can pre-fill the state’s own fillable ' + f.title + ' with the numbers above so you or your preparer can finish it. The PDF is built in your browser — nothing you type is sent anywhere. Lines 10–16 (the North Dakota add-back) depend on your federal Schedule A, so those are left for your preparer.' }),
          h('div.grid', [GT.field('Your name', wsName), GT.field('Unused credit carried over from earlier years', wsCarry, 'From line 9 of last year’s schedule, if any.')]),
          h('div.actions', [btn, GT.linkBtn('Blank form at tax.nd.gov', f.source, 'secondary')]),
          wsStatus
        ]);
      }
      function loadPdfLib() {
        return new Promise(function (res, rej) {
          if (window.PDFLib) return res(window.PDFLib);
          var sc = document.createElement('script'); sc.src = GT.base + 'vendor/pdf-lib.min.js'; sc.async = true;
          sc.onload = function () { res(window.PDFLib); }; sc.onerror = function () { rej(new Error('pdf-lib failed to load')); };
          document.head.appendChild(sc);
        });
      }
      function money0(n) { return Math.round(n).toLocaleString('en-US'); }
      function fillQEC(credit, base, cap, ndLiab, btn) {
        var f = t.ndForms.qec, F = f.fields;
        btn.disabled = true; wsStatus.textContent = 'Preparing your worksheet…';
        var eligible = Math.min(base, t.ndCredit.eligibleContributionCap[s.status]);
        var l5 = eligible * t.ndCredit.rate, l6 = ws.carry, l7 = l5 + l6, l8 = Math.min(l7, ndLiab), l9 = l7 - l8;
        Promise.all([loadPdfLib(), fetch(GT.base + f.file).then(function (r) { if (!r.ok) throw new Error('form not found'); return r.arrayBuffer(); })])
          .then(function (rs) {
            var PDFLib = rs[0];
            return PDFLib.PDFDocument.load(rs[1]).then(function (doc) {
              var form = doc.getForm();
              function set(k, v, size) { try { var fld = form.getTextField(F[k]); fld.setText(String(v)); if (size) fld.setFontSize(size); } catch (e) { /* field missing on this form year */ } }
              set('name', ws.name); set('fundName', (o.ndEndowment.fundName || o.name + ' Endowment Fund'), 7); set('fundAddress', o.address, 7); set('amount', money0(base));
              set('l2', money0(base)); set('l3', money0(t.ndCredit.eligibleContributionCap[s.status])); set('l4', money0(eligible)); set('l5', money0(l5));
              set('l6', money0(l6)); set('l7', money0(l7)); set('l8', money0(l8)); set('l9', money0(l9));
              var page = doc.getPages()[0], font = null;
              return doc.embedFont(PDFLib.StandardFonts.HelveticaBold).then(function (fnt) {
                page.drawText(GT.pdfSafe('DRAFT WORKSHEET — prepared with the Library’s giving tools on ' + new Date().toLocaleDateString('en-US') + '. Estimates only; review with your tax preparer before filing.'), { x: 36, y: page.getHeight() - 24, size: 8, font: fnt, color: PDFLib.rgb(0.82, 0.46, 0.34) });
                return doc.save();
              });
            });
          })
          .then(function (bytes) {
            var blob = new Blob([bytes], { type: 'application/pdf' }), url = URL.createObjectURL(blob);
            var a = h('a', { href: url, download: 'Schedule-ND-1QEC-' + f.formYear + '-draft.pdf' }); document.body.appendChild(a); a.click(); document.body.removeChild(a);
            setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
            wsStatus.innerHTML = 'Downloaded. Line 8 uses your <b>estimated</b> North Dakota tax (' + money(ndLiab) + '); your preparer will replace it with the actual figure and complete lines 10–16. Also attach the Library’s qualification letter.';
          })
          .catch(function (e) { wsStatus.textContent = 'Sorry — the worksheet could not be prepared (' + e.message + '). Use the blank form link instead.'; })
          .then(function () { btn.disabled = false; });
      }
      toggle(); calc();
    }
  });
})(window.TRPLGivingTools);
