/* TRPL Giving Tools v1.2.0 — https://givingtools.labs.trlibrary.com — built 2026-09-16 */
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
    plannedGiftTypes: ['charitable gift annuity', 'deferred charitable gift annuity', 'charitable remainder unitrust', 'charitable remainder annuity trust', 'charitable lead unitrust', 'charitable lead annuity trust', 'pooled income fund', 'charitable life estate', 'paid-up life insurance policy']
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
  city: 'Bismarck', state: 'ND',
  taxStatus: '501(c)(3) nonprofit',
  legacySociety: 'Heritage Society',
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

  /* Brand palette (2020 Brand Identity System). Embeds inherit the host
   * page's fonts; override with CSS variables on the wrapper. */
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
  if (window.TRPLGivingTools && window.TRPLGivingTools.version === '1.2.0') return;

  var GT = window.TRPLGivingTools = window.TRPLGivingTools || {};
  GT.version = '1.2.0';
  GT.registry = GT.registry || {};
  GT.mounted = GT.mounted || [];

  /* ---------------------------------------------------------------------- */
  /* Styles — injected once. Everything is scoped under .trpl-gt so the host */
  /* page's CSS and ours stay out of each other's way.                       */
  /* ---------------------------------------------------------------------- */
  var CSS = "/* TRPL Giving Tools — scoped styles. Tokens mirror the trlibrary.com theme (Tailwind): Dharma Gothic E for display, Clearface for body, Frutiger for UI text; Deep Orange primary buttons with Dark Gray text; squared 2px corners; cream panels. Everything lives under .trpl-gt so nothing leaks either way. */ .trpl-gt { /* brand palette (trlibrary.com theme values) */ --trpl-dark-gray: #25282A; --trpl-night-sky: #092A4D; --trpl-dark-forest: #1B4633; --trpl-darker-forest: #163728; --trpl-bright-forest: #8FC895; --trpl-spring-green: #87BB41; --trpl-sand: #D1CCBD; --trpl-deep-orange: #E7805D; --trpl-deep-orange-dark: #D07556; --trpl-gray-sky: #99ADC5; --trpl-sunset-yellow: #F9D635; --trpl-disabled-gray: #BCBDBE; --trpl-cream: #F0ECE3; --trpl-cream-light: #FAF8F4; /* semantic */ --trpl-accent: var(--trpl-dark-forest); --trpl-ink: var(--trpl-dark-gray); --trpl-muted: #4F5052; --trpl-bg: #ffffff; --trpl-panel: var(--trpl-cream-light); --trpl-panel-strong: var(--trpl-cream); --trpl-line: #D9D4C8; --trpl-radius: 2px; --trpl-radius-lg: 4px; --trpl-font: \"Clearface\", \"Clearface Fallback\", Georgia, \"Times New Roman\", serif; --trpl-font-display: \"Dharma Gothic E\", \"Dharma Gothic E Fallback\", \"Oswald\", \"Arial Narrow\", Impact, sans-serif; --trpl-font-ui: \"Frutiger\", \"Frutiger Fallback\", \"Helvetica Neue\", Arial, sans-serif; font-family: var(--trpl-font); color: var(--trpl-ink); background: var(--trpl-bg); border: 1px solid var(--trpl-line); border-radius: var(--trpl-radius-lg); padding: 28px; max-width: 880px; margin: 0 auto; box-sizing: border-box; line-height: 1.55; font-size: 17px; -webkit-font-smoothing: antialiased; } .trpl-gt[data-theme=\"dark\"] { --trpl-bg: var(--trpl-night-sky); --trpl-panel: #12365f; --trpl-panel-strong: #0d2c50; --trpl-line: #2f5079; --trpl-ink: #F3F1EA; --trpl-muted: #C9D3DF; --trpl-accent: var(--trpl-bright-forest); } .trpl-gt *, .trpl-gt *::before, .trpl-gt *::after { box-sizing: border-box; } .trpl-gt p { margin: 0; } .trpl-gt a { color: var(--trpl-dark-forest); text-decoration: underline; text-underline-offset: 2px; } .trpl-gt[data-theme=\"dark\"] a { color: var(--trpl-bright-forest); } /* ---- header ---------------------------------------------------------- */ .trpl-gt .trpl-head { border-bottom: 3px solid var(--trpl-ink); padding-bottom: 14px; margin-bottom: 22px; } .trpl-gt .trpl-eyebrow { font-family: var(--trpl-font-ui); text-transform: uppercase; letter-spacing: .14em; font-size: 12px; font-weight: 700; color: var(--trpl-deep-orange); margin: 0 0 6px; } .trpl-gt .trpl-h2 { font-family: var(--trpl-font-display); font-size: 40px; line-height: .95; margin: 0 0 10px; color: var(--trpl-ink); font-weight: 700; text-transform: uppercase; letter-spacing: .005em; } .trpl-gt .trpl-h3 { font-family: var(--trpl-font-display); font-size: 24px; line-height: 1; margin: 0 0 10px; color: var(--trpl-ink); font-weight: 700; text-transform: uppercase; } .trpl-gt .trpl-intro { margin: 0; color: var(--trpl-muted); font-size: 17px; max-width: 64ch; } /* ---- layout ---------------------------------------------------------- */ .trpl-gt .trpl-body { display: grid; gap: 22px; } .trpl-gt .trpl-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 16px 20px; align-items: start; } .trpl-gt .trpl-grid.trpl-two { grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); } .trpl-gt .trpl-section { display: grid; gap: 12px; align-content: start; } .trpl-gt .trpl-panel { background: var(--trpl-panel); border-radius: var(--trpl-radius-lg); padding: 18px; } /* ---- form controls --------------------------------------------------- */ .trpl-gt .trpl-field { display: grid; gap: 6px; align-content: start; } /* align-content:start stops rows drifting when grid cells stretch */ .trpl-gt .trpl-label { font-family: var(--trpl-font-ui); font-weight: 700; font-size: 14px; letter-spacing: .01em; color: var(--trpl-ink); } .trpl-gt .trpl-help { font-family: var(--trpl-font-ui); font-size: 13px; line-height: 1.45; color: var(--trpl-muted); } .trpl-gt .trpl-help a { color: inherit; } .trpl-gt .trpl-input { width: 100%; font-family: var(--trpl-font-ui); font-size: 16px; padding: 10px 12px; border: 1px solid var(--trpl-disabled-gray); border-radius: var(--trpl-radius); background: var(--trpl-bg); color: var(--trpl-ink); min-height: 44px; line-height: 1.3; margin: 0; } .trpl-gt .trpl-input:focus { outline: 3px solid rgba(231,128,93,.45); outline-offset: 1px; border-color: var(--trpl-deep-orange-dark); } .trpl-gt select.trpl-input { appearance: auto; -webkit-appearance: menulist; } .trpl-gt .trpl-money { display: flex; align-items: stretch; } .trpl-gt .trpl-money .trpl-input { flex: 1; min-width: 0; border-radius: 0 var(--trpl-radius) var(--trpl-radius) 0; } .trpl-gt .trpl-money .trpl-input:first-child { border-radius: var(--trpl-radius) 0 0 var(--trpl-radius); } .trpl-gt .trpl-prefix, .trpl-gt .trpl-suffix { display: flex; align-items: center; padding: 0 12px; border: 1px solid var(--trpl-disabled-gray); background: var(--trpl-panel-strong); color: var(--trpl-muted); font-family: var(--trpl-font-ui); font-weight: 700; font-size: 15px; } .trpl-gt .trpl-prefix { border-right: 0; border-radius: var(--trpl-radius) 0 0 var(--trpl-radius); } .trpl-gt .trpl-suffix { border-left: 0; border-radius: 0 var(--trpl-radius) var(--trpl-radius) 0; } .trpl-gt .trpl-radios { display: flex; flex-wrap: wrap; gap: 8px; } .trpl-gt .trpl-radios.trpl-stacked { flex-direction: column; } .trpl-gt .trpl-radio { display: flex; gap: 10px; align-items: flex-start; padding: 10px 14px; border: 1px solid var(--trpl-disabled-gray); border-radius: var(--trpl-radius); cursor: pointer; background: var(--trpl-bg); font-family: var(--trpl-font-ui); font-size: 15px; line-height: 1.4; min-height: 44px; margin: 0; color: var(--trpl-ink); } .trpl-gt .trpl-radio:hover { border-color: var(--trpl-muted); } .trpl-gt .trpl-radio:has(input:checked) { border-color: var(--trpl-deep-orange-dark); background: #FBEFE9; box-shadow: inset 0 0 0 1px var(--trpl-deep-orange-dark); } .trpl-gt[data-theme=\"dark\"] .trpl-radio:has(input:checked) { background: #1f3f66; } .trpl-gt .trpl-radio input { margin: 3px 0 0; accent-color: var(--trpl-deep-orange-dark); flex: none; width: 16px; height: 16px; } .trpl-gt .trpl-radio.trpl-single { border: 0; padding: 4px 0; background: transparent; box-shadow: none; } .trpl-gt .trpl-range { width: 100%; accent-color: var(--trpl-deep-orange-dark); margin: 10px 0; } .trpl-gt .trpl-textout { width: 100%; min-height: 150px; font-family: var(--trpl-font); font-size: 16px; padding: 16px 18px; border: 1px solid var(--trpl-disabled-gray); border-left: 4px solid var(--trpl-deep-orange); border-radius: var(--trpl-radius); background: var(--trpl-panel); color: var(--trpl-ink); white-space: pre-wrap; line-height: 1.6; margin: 0; } /* ---- results --------------------------------------------------------- */ .trpl-gt .trpl-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 12px; } .trpl-gt .trpl-stat { background: var(--trpl-panel); border-radius: var(--trpl-radius-lg); padding: 16px 18px 14px; border-top: 5px solid var(--trpl-dark-forest); min-width: 0; } .trpl-gt .trpl-stat.trpl-good { border-top-color: var(--trpl-spring-green); } .trpl-gt .trpl-stat.trpl-highlight { border-top-color: var(--trpl-deep-orange); } .trpl-gt .trpl-stat.trpl-muted { border-top-color: var(--trpl-sand); } .trpl-gt .trpl-stat-label { font-family: var(--trpl-font-ui); font-size: 12px; line-height: 1.35; color: var(--trpl-muted); text-transform: uppercase; letter-spacing: .08em; font-weight: 700; } .trpl-gt .trpl-stat-value { font-family: var(--trpl-font-display); font-size: 36px; font-weight: 700; color: var(--trpl-ink); margin: 6px 0 4px; line-height: .95; letter-spacing: .01em; overflow-wrap: anywhere; } .trpl-gt .trpl-stat-sub { font-family: var(--trpl-font-ui); font-size: 13px; line-height: 1.45; color: var(--trpl-muted); } .trpl-gt .trpl-bars { display: grid; gap: 10px; padding: 4px 0; } .trpl-gt .trpl-bar-row { display: grid; grid-template-columns: minmax(130px, 1.2fr) 3fr auto; gap: 12px; align-items: center; font-family: var(--trpl-font-ui); font-size: 14px; } .trpl-gt .trpl-bar-track { background: var(--trpl-panel-strong); height: 14px; overflow: hidden; border-radius: var(--trpl-radius); } .trpl-gt .trpl-bar-fill { height: 100%; background: var(--trpl-dark-forest); transition: width .3s ease; } .trpl-gt .trpl-bar-fill.trpl-good { background: var(--trpl-spring-green); } .trpl-gt .trpl-bar-fill.trpl-highlight { background: var(--trpl-deep-orange); } .trpl-gt .trpl-bar-fill.trpl-muted { background: var(--trpl-sand); } .trpl-gt .trpl-bar-value { font-weight: 700; white-space: nowrap; font-variant-numeric: tabular-nums; } .trpl-gt .trpl-callout { border-left: 4px solid var(--trpl-dark-forest); background: var(--trpl-panel); padding: 14px 18px; border-radius: 0 var(--trpl-radius-lg) var(--trpl-radius-lg) 0; font-size: 16px; } .trpl-gt .trpl-callout.trpl-warn { border-left-color: var(--trpl-deep-orange); background: #FBEFE9; } .trpl-gt[data-theme=\"dark\"] .trpl-callout.trpl-warn { background: #3a2a2a; } .trpl-gt .trpl-callout.trpl-good { border-left-color: var(--trpl-spring-green); } .trpl-gt .trpl-callout.trpl-info { border-left-color: var(--trpl-gray-sky); } .trpl-gt .trpl-callout p { margin: 0 0 8px; } .trpl-gt .trpl-callout p:last-child { margin: 0; } .trpl-gt .trpl-list { margin: 0; padding-left: 22px; display: grid; gap: 6px; font-size: 16px; } .trpl-gt .trpl-list.trpl-checks { list-style: none; padding-left: 0; } .trpl-gt .trpl-list.trpl-checks li { padding-left: 26px; position: relative; } .trpl-gt .trpl-list.trpl-checks li::before { content: \"✓\"; position: absolute; left: 0; color: var(--trpl-spring-green); font-weight: 800; } .trpl-gt table.trpl-table { width: 100%; border-collapse: collapse; font-family: var(--trpl-font-ui); font-size: 14px; } .trpl-gt table.trpl-table th, .trpl-gt table.trpl-table td { text-align: left; padding: 9px 10px; border-bottom: 1px solid var(--trpl-line); vertical-align: top; } .trpl-gt table.trpl-table th { font-weight: 700; color: var(--trpl-muted); font-size: 12px; text-transform: uppercase; letter-spacing: .06em; } .trpl-gt table.trpl-table td.trpl-num, .trpl-gt table.trpl-table th.trpl-num { text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; } .trpl-gt .trpl-steps { counter-reset: step; list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; } .trpl-gt .trpl-steps li { position: relative; padding-left: 42px; font-size: 16px; min-height: 30px; } .trpl-gt .trpl-steps li::before { counter-increment: step; content: counter(step); position: absolute; left: 0; top: 0; width: 30px; height: 30px; border-radius: 50%; background: var(--trpl-ink); color: #fff; font-family: var(--trpl-font-display); font-weight: 700; font-size: 17px; display: flex; align-items: center; justify-content: center; } .trpl-gt[data-theme=\"dark\"] .trpl-steps li::before { background: var(--trpl-deep-orange); color: var(--trpl-dark-gray); } .trpl-gt .trpl-infocard { display: grid; gap: 4px; background: var(--trpl-panel-strong); border-radius: var(--trpl-radius-lg); padding: 16px 18px; font-family: var(--trpl-font-ui); font-size: 15px; } .trpl-gt .trpl-infocard b { font-family: var(--trpl-font-display); text-transform: uppercase; font-size: 19px; letter-spacing: .02em; margin-bottom: 4px; } /* ---- buttons --------------------------------------------------------- */ .trpl-gt .trpl-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-family: var(--trpl-font-ui); font-weight: 700; font-size: 14px; letter-spacing: .01em; padding: 11px 20px; border-radius: var(--trpl-radius); border: 1px solid var(--trpl-deep-orange-dark); background: var(--trpl-bg); color: var(--trpl-ink); cursor: pointer; text-decoration: none; min-height: 44px; line-height: 1.2; transition: background .15s, border-color .15s; } .trpl-gt .trpl-btn:hover { background: var(--trpl-deep-orange-dark); color: var(--trpl-dark-gray); border-color: var(--trpl-deep-orange-dark); } .trpl-gt .trpl-btn.trpl-primary { background: var(--trpl-deep-orange); border-color: var(--trpl-deep-orange); color: var(--trpl-dark-gray); } .trpl-gt .trpl-btn.trpl-primary:hover { background: var(--trpl-deep-orange-dark); border-color: var(--trpl-deep-orange-dark); } .trpl-gt .trpl-btn.trpl-secondary { border-color: var(--trpl-disabled-gray); color: var(--trpl-ink); background: var(--trpl-bg); } .trpl-gt .trpl-btn.trpl-secondary:hover { background: var(--trpl-panel-strong); border-color: var(--trpl-muted); color: var(--trpl-ink); } .trpl-gt .trpl-btn.trpl-highlight { background: var(--trpl-dark-forest); border-color: var(--trpl-dark-forest); color: #fff; } .trpl-gt .trpl-btn:focus-visible { outline: 3px solid rgba(231,128,93,.55); outline-offset: 2px; } .trpl-gt[data-theme=\"dark\"] .trpl-btn.trpl-secondary { color: #fff; border-color: var(--trpl-gray-sky); } .trpl-gt .trpl-actions { display: flex; flex-wrap: wrap; gap: 10px; } .trpl-gt .trpl-cta { background: var(--trpl-dark-forest); color: #fff; border-radius: var(--trpl-radius-lg); padding: 22px; display: grid; gap: 14px; } .trpl-gt .trpl-cta p { margin: 0; font-size: 17px; } .trpl-gt .trpl-cta .trpl-btn { justify-self: start; background: var(--trpl-deep-orange); color: var(--trpl-dark-gray); border-color: var(--trpl-deep-orange); } .trpl-gt .trpl-cta .trpl-btn:hover { background: var(--trpl-sand); border-color: var(--trpl-sand); } /* ---- misc ------------------------------------------------------------ */ .trpl-gt .trpl-advisor { background: var(--trpl-panel-strong); border-radius: var(--trpl-radius-lg); padding: 14px 18px; } .trpl-gt .trpl-advisor summary { cursor: pointer; font-family: var(--trpl-font-display); text-transform: uppercase; font-size: 20px; letter-spacing: .02em; color: var(--trpl-ink); list-style-position: outside; } .trpl-gt .trpl-advisor .trpl-list { margin-top: 12px; } .trpl-gt .trpl-disclaimer { margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--trpl-line); font-family: var(--trpl-font-ui); font-size: 13px; line-height: 1.5; color: var(--trpl-muted); } .trpl-gt .trpl-disclaimer p { margin: 0 0 8px; } .trpl-gt .trpl-fine { font-size: 12px; } .trpl-gt .trpl-contact { font-family: var(--trpl-font-ui); font-size: 14px; color: var(--trpl-muted); margin: 0; } .trpl-gt .trpl-progress { display: flex; gap: 6px; } .trpl-gt .trpl-progress span { flex: 1; height: 5px; background: var(--trpl-line); } .trpl-gt .trpl-progress span.trpl-on { background: var(--trpl-deep-orange); } .trpl-gt .trpl-question { font-family: var(--trpl-font-display); font-size: 30px; line-height: .98; font-weight: 700; text-transform: uppercase; color: var(--trpl-ink); margin: 4px 0 4px; } .trpl-gt .trpl-rec { border: 1px solid var(--trpl-line); border-radius: var(--trpl-radius-lg); padding: 18px 20px; display: grid; gap: 8px; background: var(--trpl-bg); } .trpl-gt .trpl-rec.trpl-top { border-color: var(--trpl-deep-orange); background: var(--trpl-panel); box-shadow: inset 0 0 0 1px var(--trpl-deep-orange); } .trpl-gt .trpl-rec h4 { margin: 0; font-family: var(--trpl-font-display); text-transform: uppercase; font-size: 24px; line-height: 1; color: var(--trpl-ink); font-weight: 700; } .trpl-gt .trpl-rec .trpl-tag { display: inline-block; font-family: var(--trpl-font-ui); font-size: 12px; text-transform: uppercase; letter-spacing: .1em; font-weight: 700; color: var(--trpl-deep-orange-dark); } .trpl-gt .trpl-rec p { margin: 0; font-size: 16px; } .trpl-gt .trpl-compact { padding: 18px; } .trpl-gt iframe { max-width: 100%; } @media (max-width: 600px) { .trpl-gt { padding: 18px 16px; border-radius: 0; border-left: 0; border-right: 0; } .trpl-gt .trpl-h2 { font-size: 32px; } .trpl-gt .trpl-question { font-size: 26px; } .trpl-gt .trpl-bar-row { grid-template-columns: 1fr auto; } .trpl-gt .trpl-bar-row .trpl-bar-track { grid-column: 1 / -1; } .trpl-gt .trpl-stat-value { font-size: 30px; } .trpl-gt .trpl-grid, .trpl-gt .trpl-grid.trpl-two { grid-template-columns: 1fr; } .trpl-gt .trpl-actions .trpl-btn { flex: 1 1 auto; } } @media print { .trpl-gt .trpl-btn, .trpl-gt .trpl-actions { display: none; } .trpl-gt { border: 0; } }";
  /* Where this bundle was loaded from, so fonts resolve on the tools site,
   * on trlibrary.com, and in local development alike. */
  var SCRIPT_BASE = (function () {
    var src = document.currentScript && document.currentScript.src;
    return src ? src.replace(/dist\/[^\/]*$/, '') : 'https://givingtools.labs.trlibrary.com/';
  })();
  GT.base = GT.base || SCRIPT_BASE;
  var FONTS = [
    ['Dharma Gothic E', 700, 'normal', 'dharma_type-dharmagothice-bold'], ['Dharma Gothic E', 800, 'normal', 'dharma_type-dharmagothice-exbold'],
    ['Clearface', 400, 'normal', 'clearfacestd-regular'], ['Clearface', 400, 'italic', 'clearfacestd-italic'], ['Clearface', 500, 'normal', 'clearfacestd-bold'], ['Clearface', 500, 'italic', 'clearfacestd-bolditalic'], ['Clearface', 700, 'normal', 'clearfacestd-heavy'],
    ['Frutiger', 300, 'normal', 'frutigerltstd-light'], ['Frutiger', 400, 'normal', 'frutigerltstd-regular'], ['Frutiger', 400, 'italic', 'frutigerltstd-regularitalic'], ['Frutiger', 700, 'normal', 'frutigerltstd-bold']
  ];
  function injectCSS(loadFonts) {
    if (loadFonts !== false && !document.getElementById('trpl-gt-fonts')) {
      var f = document.createElement('style');
      f.id = 'trpl-gt-fonts';
      f.textContent = FONTS.map(function (x) { return '@font-face{font-family:"' + x[0] + '";font-weight:' + x[1] + ';font-style:' + x[2] + ';font-display:swap;src:url("' + GT.base + 'fonts/' + x[3] + '.woff2") format("woff2")}'; }).join('') +
        '@font-face{font-family:"Clearface Fallback";src:local(Georgia);size-adjust:93.1%;ascent-override:101.28%;descent-override:28.95%;line-gap-override:0%}' +
        '@font-face{font-family:"Dharma Gothic E Fallback";src:local(Arial);size-adjust:60.46%;ascent-override:141.09%;descent-override:37.31%;line-gap-override:0%}' +
        '@font-face{font-family:"Frutiger Fallback";src:local(Arial);size-adjust:105.7%;ascent-override:88.47%;descent-override:25.5%;line-gap-override:0%}';
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
    return { el: wrap, input: inp, get: get, set: function (v) { inp.value = money(v).slice(1); } };
  }
  function numberInput(opts) {
    opts = opts || {};
    var inp = h('input.input', { type: 'number', min: opts.min, max: opts.max, step: opts.step || 1, value: opts.value, placeholder: opts.placeholder || '' });
    var wrap = opts.suffix ? h('div.money', [inp, h('span.suffix', opts.suffix)]) : inp;
    function get() { var v = num(inp.value, opts.value || 0); return opts.min != null ? clamp(v, opts.min, opts.max == null ? Infinity : opts.max) : v; }
    inp.addEventListener('input', function () { opts.onChange && opts.onChange(get()); });
    return { el: wrap, input: inp, get: get, set: function (v) { inp.value = v; } };
  }
  function percentInput(opts) {
    opts = opts || {};
    var inp = h('input.input', { type: 'number', min: opts.min == null ? 0 : opts.min, max: opts.max == null ? 100 : opts.max, step: opts.step || 0.1, value: opts.value != null ? +(opts.value * 100).toFixed(2) : '' });
    var wrap = h('div.money', [inp, h('span.suffix', '%')]);
    function get() { return num(inp.value) / 100; }
    inp.addEventListener('input', function () { opts.onChange && opts.onChange(get()); });
    return { el: wrap, input: inp, get: get, set: function (v) { inp.value = +(v * 100).toFixed(2); } };
  }
  function select(opts) {
    var sel = h('select.input', opts.options.map(function (o) { return h('option', { value: o[0], selected: o[0] === opts.value }, o[1]); }));
    sel.addEventListener('change', function () { opts.onChange && opts.onChange(sel.value); });
    return { el: sel, input: sel, get: function () { return sel.value; }, set: function (v) { sel.value = v; } };
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
    return { el: wrap, input: inputs[0] || wrap, get: function () { return value; }, set: function (v) { value = v; inputs.forEach(function (r) { r.checked = r.value === v; }); } };
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
    return { el: el, input: c, get: function () { return c.checked; }, set: function (v) { c.checked = !!v; } };
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
    try { def.render(body, GT, opts); }
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
      var s = { kind: 'pct', pct: 10, amount: 25000, asset: '', purpose: 'unrestricted', program: '', contingent: false, vehicle: 'will' };
      var textOut = h('div.textout', { 'aria-live': 'polite' });
      var pctCtl = GT.numberInput({ min: 1, max: 100, value: s.pct, suffix: '%', onChange: function (v) { s.pct = v; gen(); } });
      var amtCtl = GT.moneyInput({ value: s.amount, onChange: function (v) { s.amount = v; gen(); } });
      var assetCtl = GT.numberInput({ value: '', placeholder: 'e.g. 200 shares of XYZ stock; my cabin at …' }); assetCtl.input.type = 'text'; assetCtl.input.addEventListener('input', function () { s.asset = assetCtl.input.value; gen(); });
      var programCtl = GT.numberInput({ value: '', placeholder: 'e.g. education programs for students and teachers' }); programCtl.input.type = 'text'; programCtl.input.addEventListener('input', function () { s.program = programCtl.input.value; gen(); });
      var pctField = GT.field('Percentage', pctCtl, 'Percentages keep pace with your estate and are easy for family to understand. Many donors choose 5% or 10%.');
      var amtField = GT.field('Dollar amount', amtCtl);
      var assetField = GT.field('Describe the asset', assetCtl);
      var programField = GT.field('Which program or purpose?', programCtl, 'We add a clause that lets the Library redirect the gift if that purpose no longer exists — a small line that prevents big problems decades from now.');

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
        contingent: GT.checkbox('Make this a <b>contingent</b> gift — the Library receives it only if my named beneficiaries do not survive me', { value: false, onChange: function (v) { s.contingent = v; gen(); } })
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
      function gen() { textOut.textContent = text(); }

      GT.append(root, [
        h('div.grid.two', [
          GT.field('Where will the gift appear?', ctl.vehicle),
          GT.field('What kind of gift?', ctl.kind),
          pctField, amtField, assetField,
          GT.field('How should the Library use it?', ctl.purpose),
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
        GT.advisorQuestions([
          'Should this be a percentage, a fixed amount, or a share of the residue, given the rest of my plan?',
          'Would leaving retirement-account assets to the Library and other assets to family reduce the taxes my heirs pay?',
          'Do I need a new will, or can we add this with a codicil or trust amendment?',
          'Is my estate likely to owe state estate or inheritance tax where I live?'
        ]),
        GT.contactLine()
      ]);
      show(); gen();
    }
  });
})(window.TRPLGivingTools);

/* @tool Bunching & Standard Deduction Comparison
 * Compares giving the same amount every year with "bunching" several years
 * of gifts into one (usually through a donor-advised fund). */
(function (GT) {
  var h = GT.h, T = GT.T, ORG = GT.ORG, money = GT.money, pct = GT.pct;

  GT.register('bunching', {
    title: 'Should you bunch your gifts?',
    intro: 'Most households take the standard deduction, so their charitable gifts earn no federal deduction at all. Combining two or three years of giving into one year — often through a donor-advised fund — can change that. Compare both approaches.',
    disclaimerExtra: 'Federal income tax only. Assumes cash gifts to public charities and that your other deductions stay flat. The non-itemizer deduction does not apply to gifts to donor-advised funds.',
    render: function (root) {
      var t = T(), o = ORG();
      var s = { status: 'mfj', over65: 0, agi: 180000, rate: '0.24', giving: 12000, salt: 14000, mortgage: 9000, other: 0, years: 3 };
      var out = h('div.section');
      var ctl = {
        status: GT.select({ options: GT.FILING, value: s.status, onChange: function (v) { s.status = v; calc(); } }),
        over65: GT.select({ options: [['0', 'None'], ['1', 'One'], ['2', 'Both spouses']], value: '0', onChange: function (v) { s.over65 = +v; calc(); } }),
        agi: GT.moneyInput({ value: s.agi, onChange: function (v) { s.agi = v; calc(); } }),
        rate: GT.select({ options: GT.BRACKETS(), value: s.rate, onChange: function (v) { s.rate = v; calc(); } }),
        giving: GT.moneyInput({ value: s.giving, onChange: function (v) { s.giving = v; calc(); } }),
        salt: GT.moneyInput({ value: s.salt, onChange: function (v) { s.salt = v; calc(); } }),
        mortgage: GT.moneyInput({ value: s.mortgage, onChange: function (v) { s.mortgage = v; calc(); } }),
        other: GT.moneyInput({ value: s.other, onChange: function (v) { s.other = v; calc(); } }),
        years: GT.radios({ options: [['2', 'Two years'], ['3', 'Three years']], value: '3', onChange: function (v) { s.years = +v; calc(); } })
      };
      GT.append(root, [
        h('div.grid', [
          GT.field('Filing status', ctl.status),
          GT.field('Household members age 65 or older', ctl.over65, 'Adds to the standard deduction.'),
          GT.field('Approximate adjusted gross income', ctl.agi),
          GT.field('Your federal tax bracket', ctl.rate),
          GT.field('Charitable gifts you make in a typical year', ctl.giving),
          GT.field('State and local taxes you pay per year', ctl.salt, 'Income or sales tax plus property tax. Capped at ' + money(t.salt.cap[s.status]) + ' in ' + t.taxYear + ' (phasing down above ' + money(t.salt.phaseStart.mfj) + ' of income).'),
          GT.field('Mortgage interest per year', ctl.mortgage),
          GT.field('Other itemized deductions per year', ctl.other, 'Medical expenses above 7.5% of AGI, etc. Usually zero.'),
          GT.field('Bunch how many years of giving into one?', ctl.years)
        ]),
        out
      ]);

      function calc() {
        GT.clear(out);
        var r = parseFloat(s.rate), dr = GT.deductionRate(r), N = s.years;
        var std = GT.stdDeduction(s.status, s.over65);
        var salt = GT.saltAllowed(s.salt, s.status, s.agi);
        var base = salt + s.mortgage + s.other;              // non-charitable itemized
        var floor = t.charitable.itemizerFloorPct * s.agi;
        var ni = GT.nonItemizerDeduction(s.giving, s.status);

        // Every-year plan
        var itemEach = base + Math.max(0, s.giving - floor);
        var eachYear = Math.max(std + ni, itemEach);        // if standard, add the non-itemizer charitable deduction
        var eachItemizes = itemEach > std + ni;
        var totalEach = eachYear * N;

        // Bunched plan: year 1 gets N years of gifts; other years nothing charitable
        var itemBunch = base + Math.max(0, s.giving * N - floor);
        var niBunch = GT.nonItemizerDeduction(s.giving * N, s.status);
        var year1 = Math.max(std + niBunch, itemBunch), bunchItemizes = itemBunch > std + niBunch;
        var otherYears = Math.max(std, base);
        var totalBunch = year1 + otherYears * (N - 1);
        var extraDed = totalBunch - totalEach;
        var savings = extraDed * (eachItemizes || bunchItemizes ? dr : r);

        GT.append(out, [
          h('div.stats', [
            GT.stat('Deductions over ' + N + ' years — give every year', money(totalEach), eachItemizes ? 'You itemize each year.' : 'You take the standard deduction (' + money(std) + ') plus the ' + money(ni) + ' non-itemizer charitable deduction.', 'muted'),
            GT.stat('Deductions over ' + N + ' years — bunched', money(totalBunch), bunchItemizes ? 'Itemize in year one (' + money(year1) + '), standard deduction after.' : 'Even bunched, your itemized total stays below the standard deduction.', bunchItemizes ? 'good' : 'muted'),
            GT.stat('Estimated federal tax saved by bunching', money(Math.max(0, savings)), savings > 0 ? 'About ' + pct(savings / (s.giving * N), 1) + ' of the ' + money(s.giving * N) + ' you give either way.' : 'Bunching doesn’t help at these numbers.', savings > 0 ? 'highlight' : 'muted')
          ]),
          GT.bars([{ label: 'Give every year', value: totalEach, tone: 'muted' }, { label: 'Bunch ' + N + ' years', value: totalBunch, tone: 'good' }]),
          h('table.table', [
            h('thead', h('tr', [h('th', 'Year'), h('th.num', 'Give every year'), h('th.num', 'Bunched')])),
            h('tbody', Array.apply(null, Array(N)).map(function (_, i) {
              return h('tr', [h('td', 'Year ' + (i + 1)), h('td.num', money(eachYear) + (eachItemizes ? ' (itemized)' : ' (standard)')), h('td.num', money(i === 0 ? year1 : otherYears) + (i === 0 && bunchItemizes ? ' (itemized)' : ' (standard)'))]);
            }))
          ]),
          savings > 0 ? GT.callout('good', '<p><b>How people do this:</b> open a donor-advised fund, contribute ' + money(s.giving * N) + ' in one year (appreciated stock works especially well), take the deduction that year, and then recommend grants to the Library every year as usual. Your giving stays steady; only the tax timing changes.</p>') : GT.callout('info', '<p>With these numbers the standard deduction is already the better deal. You still receive the ' + money(t.charitable.nonItemizer[s.status]) + ' non-itemizer deduction for cash gifts each year — and gifts of appreciated stock or a QCD from an IRA can deliver tax benefits that don’t depend on itemizing.</p>'),
          GT.callout('info', 'New for ' + t.taxYear + ': itemizers may deduct only the portion of charitable gifts above <b>½% of AGI</b> (' + money(floor) + ' for you), and for those in the 37% bracket each deductible dollar is worth at most 35¢. Bunching also helps by paying that floor once instead of every year.'),
          h('div.actions', [GT.linkBtn('Donor-advised fund giving', o.urls.daf, 'primary'), GT.linkBtn('Stock gift calculator', GT.toolUrl('stock'), 'secondary'), GT.linkBtn('Give now', o.urls.donate, 'secondary')]),
          GT.advisorQuestions([
            'Given my other deductions, in which year should I concentrate my charitable gifts?',
            'Would funding a donor-advised fund with appreciated stock make the bunched year even more efficient?',
            'How does the ½%-of-AGI floor and the 35% cap change the math for me?',
            'Does my state follow the federal standard deduction, or would bunching affect my state return differently?'
          ]),
          GT.contactLine()
        ]);
      }
      calc();
    }
  });
})(window.TRPLGivingTools);

/* @tool Donor-Advised Fund Grant Guide
 * Sponsor-specific steps for recommending a grant, a copyable grant
 * recommendation, and a DAF vs. direct-gift decision helper. */
(function (GT) {
  var h = GT.h, T = GT.T, ORG = GT.ORG, money = GT.money;

  GT.register('daf', {
    title: 'Give from your donor-advised fund',
    intro: 'Already have a donor-advised fund? A grant to the Library takes a few minutes. Pick your sponsor for steps, or use the helper to decide whether a DAF makes sense for you.',
    disclaimerExtra: 'Grants from a donor-advised fund cannot be used to pay for membership benefits, event tickets, or anything of value to you. You already received your deduction when you funded the DAF, so a grant is not deductible again.',
    render: function (root) {
      var o = ORG(), t = T();
      var SPONSORS = [
        ['fidelity', 'Fidelity Charitable', 'https://www.fidelitycharitable.org/'],
        ['schwab', 'DAFgiving360 (formerly Schwab Charitable)', 'https://www.dafgiving360.org/'],
        ['vanguard', 'Vanguard Charitable', 'https://www.vanguardcharitable.org/'],
        ['npt', 'National Philanthropic Trust', 'https://www.nptrust.org/'],
        ['ndcf', 'North Dakota Community Foundation', 'https://www.ndcf.net/'],
        ['community', 'Another community foundation'],
        ['other', 'Another sponsor']
      ];
      var s = { sponsor: 'fidelity', amount: 1000, purpose: 'general', recurring: false };
      var steps = h('div.section'), rec = h('div.textout');
      var sp = GT.select({ options: SPONSORS.map(function (x) { return [x[0], x[1]]; }), value: s.sponsor, onChange: function (v) { s.sponsor = v; show(); } });
      var amt = GT.moneyInput({ value: s.amount, onChange: function (v) { s.amount = v; gen(); } });
      var purpose = GT.radios({ options: [['general', 'Where needed most'], ['heritage', 'In honor / memory of someone'], ['program', 'A specific program']], value: 'general', onChange: function (v) { s.purpose = v; gen(); } });
      var recurring = GT.checkbox('Make this a recurring grant (annual or monthly)', { onChange: function (v) { s.recurring = v; gen(); } });
      var honoree = GT.numberInput({ value: '', placeholder: 'Name of honoree or program' }); honoree.input.type = 'text'; honoree.input.addEventListener('input', gen);

      function show() {
        GT.clear(steps);
        var spn = SPONSORS.filter(function (x) { return x[0] === s.sponsor; })[0];
        GT.append(steps, [
          h('ol.steps', [
            h('li', { html: spn[2] ? 'Log in at <a href="' + spn[2] + '" target="_blank" rel="noopener">' + spn[1] + '</a> and choose “Grant” or “Recommend a grant.”' : 'Log in to your sponsor’s donor portal and choose “Recommend a grant.”' }),
            h('li', { html: 'Search for <b>' + o.name + '</b>. If several results appear, match the EIN <b>' + o.ein + '</b> and the ' + o.city + ', ' + o.state + ' address.' }),
            GT.li('Enter the amount and any purpose or honoree in the memo (copy the text below). Choose whether to share your name and address — please do, so we can thank you.'),
            h('li', { html: 'Submit. Most sponsors send the check or ACH within one to two weeks. Email <a href="mailto:' + o.contactEmail + '">' + o.contactEmail + '</a> if you would like us to confirm receipt.' })
          ])
        ]);
      }
      function recText() {
        var memo = s.purpose === 'general' ? 'For the Library’s general charitable purposes.' : s.purpose === 'heritage' ? 'In honor of ' + (honoree.input.value || '[name]') + '.' : 'For ' + (honoree.input.value || '[program]') + ', or where the need is greatest if that program is fully funded.';
        return 'Grant recommendation\nRecipient: ' + o.name + '\nEIN: ' + o.ein + '\nAddress: ' + o.address + '\nAmount: ' + money(s.amount) + (s.recurring ? ' (recurring)' : '') + '\nPurpose: ' + memo + '\nDonor acknowledgment: please share my name and address with the recipient.';
      }
      function gen() { rec.textContent = recText(); }

      // DAF vs direct helper
      var helperOut = h('div.section');
      var hs = { itemize: 'no', asset: 'stock', horizon: 'multi' };
      var hi = GT.radios({ options: [['yes', 'Yes'], ['no', 'No'], ['unsure', 'Not sure']], value: 'no', onChange: function (v) { hs.itemize = v; helper(); } });
      var ha = GT.radios({ options: [['cash', 'Cash'], ['stock', 'Appreciated stock'], ['ira', 'IRA (age 70½+)']], value: 'stock', onChange: function (v) { hs.asset = v; helper(); } });
      var hh = GT.radios({ options: [['once', 'Give once, now'], ['multi', 'Give over several years']], value: 'multi', onChange: function (v) { hs.horizon = v; helper(); } });
      function helper() {
        GT.clear(helperOut);
        var msg, tone = 'info';
        if (hs.asset === 'ira') { msg = '<b>Skip the DAF.</b> Qualified charitable distributions from an IRA cannot go to a donor-advised fund — send the QCD straight to the Library instead. It keeps the amount out of your income entirely.'; tone = 'warn'; }
        else if (hs.horizon === 'once' && hs.itemize !== 'no') { msg = '<b>Give directly.</b> For a one-time gift while itemizing, a direct gift to the Library is simplest and equally deductible' + (hs.asset === 'stock' ? ' — transfer the shares to the Library and skip the middle step.' : '.'); }
        else if (hs.horizon === 'once' && hs.itemize === 'no') { msg = '<b>Give directly</b> — and note that in ' + t.taxYear + ' non-itemizers may deduct up to ' + money(t.charitable.nonItemizer.single) + ' (' + money(t.charitable.nonItemizer.mfj) + ' joint) of <i>cash</i> gifts made directly to charities. That deduction does not apply to DAF contributions.'; }
        else if (hs.itemize === 'no' || hs.itemize === 'unsure') { msg = '<b>A DAF may help.</b> Fund it with several years of giving' + (hs.asset === 'stock' ? ' in appreciated stock' : '') + ' in one year so you can itemize that year (“bunching”), then grant to the Library annually. Compare the numbers with the bunching calculator.'; tone = 'good'; }
        else { msg = '<b>Either works.</b> You itemize and plan to give over time. A DAF adds convenience (one tax receipt, easy stock gifts, grants on your schedule) at the cost of sponsor fees and a step between you and the Library. Direct gifts each year are just as deductible and let the Library put your gift to work immediately.'; }
        GT.append(helperOut, [GT.callout(tone, '<p>' + msg + '</p>'), h('div.actions', [hs.asset === 'ira' ? GT.linkBtn('IRA giving calculator', GT.toolUrl('qcd'), 'primary') : (hs.itemize === 'no' && hs.horizon === 'multi') ? GT.linkBtn('Bunching calculator', GT.toolUrl('bunching'), 'primary') : GT.linkBtn('Give now', o.urls.donate, 'primary'), hs.asset === 'stock' ? GT.linkBtn('Stock gift calculator', GT.toolUrl('stock'), 'secondary') : null])]);
      }

      GT.append(root, [
        GT.section('Recommend a grant', [
          h('div.grid', [GT.field('Your fund sponsor', sp), GT.field('Grant amount', amt), GT.field('Purpose', purpose), GT.field('Honoree or program (optional)', honoree)]),
          h('div', [recurring.el]),
          steps,
          rec,
          h('div.actions', [GT.copyButton(recText, 'Copy grant details'), GT.linkBtn('Donor-advised fund page', o.urls.daf, 'secondary')])
        ]),
        GT.section('Should you use a DAF at all?', [
          h('div.grid', [GT.field('Do you itemize?', hi), GT.field('What would you give?', ha), GT.field('Timing', hh)]),
          helperOut
        ]),
        GT.callout('info', '<p><b>Two more DAF ideas.</b> Name the Library as a <b>successor beneficiary</b> of your fund so your giving continues. And if you keep a DAF at a community foundation such as the North Dakota Community Foundation, ask about recurring grants — set once, delivered every year.</p>'),
        GT.advisorQuestions([
          'Should I fund my DAF with appreciated securities rather than cash?',
          'How much should I contribute this year to make itemizing worthwhile?',
          'What are my sponsor’s fees and minimum grant size, and are there better options?',
          'Should the Library be named as a successor beneficiary of my fund?'
        ]),
        GT.contactLine()
      ]);
      show(); gen(); helper();
    }
  });
})(window.TRPLGivingTools);

/* @tool Estate Tax & Charitable Bequest Estimator
 * Rough federal estate-tax exposure, how a charitable bequest changes it,
 * and a flag for states with their own estate or inheritance tax. */
(function (GT) {
  var h = GT.h, T = GT.T, ORG = GT.ORG, money = GT.money, pct = GT.pct;
  var STATES = 'AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY'.split(' ');

  GT.register('estate', {
    title: 'Will your estate owe tax?',
    intro: 'Most families will never pay federal estate tax — but a dozen states tax much smaller estates, and a charitable bequest reduces both. Get a rough picture in a minute.',
    disclaimerExtra: 'A simplified estimate. It ignores lifetime taxable gifts beyond the amount you enter, generation-skipping tax, state tax rates and brackets, and valuation discounts. Your estate attorney can model this precisely.',
    render: function (root) {
      var t = T(), o = ORG();
      var s = { married: 'yes', gross: 8000000, debts: 250000, toSpouse: 0, charity: 500000, gifts: 0, dsue: 0, state: 'ND' };
      var out = h('div.section');
      var ctl = {
        married: GT.radios({ options: [['yes', 'Married'], ['no', 'Single / widowed']], value: 'yes', onChange: function (v) { s.married = v; toggle(); calc(); } }),
        gross: GT.moneyInput({ value: s.gross, onChange: function (v) { s.gross = v; calc(); } }),
        debts: GT.moneyInput({ value: s.debts, onChange: function (v) { s.debts = v; calc(); } }),
        toSpouse: GT.moneyInput({ value: s.toSpouse, onChange: function (v) { s.toSpouse = v; calc(); } }),
        charity: GT.moneyInput({ value: s.charity, onChange: function (v) { s.charity = v; calc(); } }),
        gifts: GT.moneyInput({ value: s.gifts, onChange: function (v) { s.gifts = v; calc(); } }),
        dsue: GT.moneyInput({ value: s.dsue, onChange: function (v) { s.dsue = v; calc(); } }),
        state: GT.select({ options: STATES.map(function (x) { return [x, x]; }), value: 'ND', onChange: function (v) { s.state = v; calc(); } })
      };
      var spouseField = GT.field('Amount passing to your spouse', ctl.toSpouse, 'Gifts to a U.S.-citizen spouse are fully deductible (the “marital deduction”).');
      var dsueField = GT.field('Unused exemption from a deceased spouse (“portability”)', ctl.dsue, 'If your spouse died and the estate elected portability, their unused exemption adds to yours.');
      function toggle() { spouseField.style.display = s.married === 'yes' ? '' : 'none'; }
      GT.append(root, [
        h('div.grid', [
          GT.field('Marital status', ctl.married),
          GT.field('Total value of everything you own', ctl.gross, 'Home, investments, retirement accounts, business interests, and life insurance you own — before debts.'),
          GT.field('Debts, mortgage, and expected final expenses', ctl.debts),
          spouseField,
          GT.field('Charitable bequests (to the Library and others)', ctl.charity),
          GT.field('Taxable gifts you have already made in life', ctl.gifts, 'Gifts above the annual exclusion (' + money(t.estate.annualExclusion) + ' per person per year in ' + t.taxYear + ') that you reported on Form 709.'),
          dsueField,
          GT.field('State of residence', ctl.state)
        ]),
        out
      ]);

      function fed(charity) {
        var taxable = Math.max(0, s.gross - s.debts - (s.married === 'yes' ? s.toSpouse : 0) - charity);
        var exemption = Math.max(0, t.estate.exemption - s.gifts) + s.dsue;
        var exposed = Math.max(0, taxable - exemption);
        return { taxable: taxable, exemption: exemption, exposed: exposed, tax: exposed * t.estate.topRate };
      }
      function calc() {
        GT.clear(out);
        var withC = fed(s.charity), without = fed(0);
        var saved = without.tax - withC.tax;
        var st = t.stateEstateTax[s.state], inh = t.stateInheritanceTax.indexOf(s.state) >= 0;
        var stateTaxable = Math.max(0, s.gross - s.debts - (s.married === 'yes' ? s.toSpouse : 0) - s.charity);
        GT.append(out, [
          h('div.stats', [
            GT.stat('Estimated federal estate tax', money(withC.tax), withC.exposed > 0 ? money(withC.exposed) + ' above your ' + money(withC.exemption) + ' exemption, taxed at ' + pct(t.estate.topRate, 0) + '.' : 'Your taxable estate (' + money(withC.taxable) + ') is under the ' + money(withC.exemption) + ' exemption.', withC.tax > 0 ? 'highlight' : 'good'),
            GT.stat('Without the charitable bequest', money(without.tax), 'Every charitable dollar comes off the taxable estate.', 'muted'),
            GT.stat('Federal tax saved by the bequest', money(saved), saved > 0 ? 'Effectively, ' + pct(saved / s.charity, 0) + ' of the gift is paid for by tax savings.' : 'No federal tax either way at this size — the gift still passes 100% to the causes you choose.', saved > 0 ? 'good' : 'muted')
          ]),
          GT.bars([{ label: 'Tax without bequest', value: without.tax, tone: 'muted' }, { label: 'Tax with bequest', value: withC.tax, tone: 'good' }]),
          st ? GT.callout('warn', '<p><b>' + s.state + ' has its own estate tax</b> with a ' + t.taxYear + ' exemption of about ' + money(st) + (stateTaxable > st ? ' — your estimated taxable estate of ' + money(stateTaxable) + ' would be above it. Charitable bequests are generally deductible for state purposes too.' : '; your estimated taxable estate is below it.') + ' State rates and rules vary; check with a local estate attorney.</p>') : null,
          inh ? GT.callout('warn', '<p><b>' + s.state + ' has an inheritance tax</b> paid by certain heirs based on their relationship to you. Bequests to charities are exempt.</p>') : null,
          (!st && !inh) ? GT.callout('good', s.state + ' has no state estate or inheritance tax. Only the federal exemption matters, and it is ' + money(t.estate.exemption) + ' per person in ' + t.taxYear + ' (' + money(t.estate.exemption * 2) + ' for a married couple using portability).') : null,
          GT.callout('info', '<p><b>Even when there is no estate tax</b>, how you give matters: leaving retirement accounts to the Library and other assets to family avoids the income tax heirs would owe on the retirement money. See the beneficiary designation guide.</p>'),
          h('div.actions', [GT.linkBtn('Write your bequest', GT.toolUrl('bequest'), 'primary'), GT.linkBtn('Beneficiary designation guide', GT.toolUrl('beneficiary'), 'secondary'), GT.linkBtn('Heritage Society', o.urls.heritage, 'secondary')]),
          GT.advisorQuestions([
            'Is my estate likely to exceed the federal or my state’s exemption, now or as it grows?',
            'Have we elected portability so my spouse’s unused exemption is preserved?',
            'Should charitable gifts come from my retirement accounts rather than my will, to also avoid income tax for heirs?',
            'Would lifetime gifts — to family within the annual exclusion, or to charity — reduce the estate more efficiently?',
            'Do I own life insurance that is counted in my estate, and should it be held in a trust?'
          ]),
          GT.contactLine()
        ]);
      }
      toggle(); calc();
    }
  });
})(window.TRPLGivingTools);

/* @tool Letter of Intent (Heritage Society)
 * "I've included the Library in my plans." Embeds the DonorPerfect intent
 * form when a URL is configured; otherwise builds a pre-filled email. */
(function (GT) {
  var h = GT.h, ORG = GT.ORG;

  GT.register('intent', {
    title: 'Tell us about your legacy gift',
    intro: 'Have you included the Library in your will, trust, or as a beneficiary of an account? Letting us know lets us thank you, make sure we understand your wishes, and welcome you to the Heritage Society. Any details you share stay confidential and are never binding.',
    disclaimerExtra: 'Sharing your intentions does not create a legal obligation and can be revised at any time.',
    render: function (root, GT, opts) {
      var o = ORG();
      var url = o.urls.intentForm;
      if (url && opts.embedForm !== 'false') {
        GT.append(root, [
          h('iframe', { src: url, title: 'Legacy gift intention form', style: { width: '100%', minHeight: (opts.formHeight || 900) + 'px', border: 0, borderRadius: '10px', background: '#fff' }, loading: 'lazy' }),
          h('p.help', { html: 'Prefer email? Write to <a href="mailto:' + o.contactEmail + '">' + o.contactEmail + '</a>.' })
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
      var send = h('a.btn.primary', { href: '#', on: { click: function (e) { e.preventDefault(); location.href = 'mailto:' + o.contactEmail + '?subject=' + encodeURIComponent('Legacy gift intention — ' + (name.input.value || 'Heritage Society')) + '&body=' + encodeURIComponent(body()); } } }, 'Send by email');
      GT.append(root, [
        h('div.grid', [GT.field('Name', name), GT.field('Email', email), GT.field('Phone', phone)]),
        GT.field('What would you like to tell us about?', type),
        h('div', [anon.el]),
        GT.field('Notes (optional)', { el: share, input: share }),
        h('div.actions', [send, GT.copyButton(body, 'Copy message instead')]),
        GT.callout('info', 'This opens a message in your own email program addressed to <b>' + o.contactEmail + '</b>. Nothing is sent until you press send.'),
        GT.contactLine()
      ]);
    }
  });
})(window.TRPLGivingTools);

/* @tool Life-Income Gift Illustrator
 * Educational ballpark figures for a charitable gift annuity, a charitable
 * remainder unitrust, and a charitable remainder annuity trust. Uses ACGA
 * suggested rates, the current §7520 rate, and simplified life-expectancy
 * math — clearly labeled as estimates. */
(function (GT) {
  var h = GT.h, T = GT.T, ORG = GT.ORG, money = GT.money, pct = GT.pct;

  GT.register('lifeincome', {
    title: 'Gifts that pay you income',
    intro: 'Some gifts give something back: fixed or variable payments for life or a term of years, a partial income-tax deduction now, and a gift to the Library later. These illustrations show the shape of each option so you can have an informed conversation with your advisor.',
    disclaimerExtra: 'Illustrations only. Actual deductions are calculated with IRS actuarial tables (Table 2010CM) and the §7520 rate for the month of the gift; the simplified life-expectancy math here can differ by several percentage points. Charitable gift annuities are regulated by state insurance departments and are issued only by charities licensed to do so.',
    render: function (root) {
      var t = T(), o = ORG();
      var s = { kind: 'cga', age: 75, gift: 100000, r7520: t.sec7520.rate, payout: 0.05, termType: 'life', years: 20, rate: '0.24', asset: 'cash', basis: 40000 };
      var out = h('div.section');
      var ctl = {
        kind: GT.radios({ stacked: true, options: [
          ['cga', '<b>Charitable gift annuity</b> — a simple contract: fixed payments for life, backed by the charity'],
          ['crut', '<b>Charitable remainder unitrust</b> — a trust paying a fixed <i>percentage</i> of its value each year (payments rise and fall with the trust)'],
          ['crat', '<b>Charitable remainder annuity trust</b> — a trust paying a fixed <i>dollar amount</i> each year']], value: 'cga', onChange: function (v) { s.kind = v; toggle(); calc(); } }),
        age: GT.numberInput({ min: 18, max: 105, value: s.age, onChange: function (v) { s.age = v; calc(); } }),
        gift: GT.moneyInput({ value: s.gift, onChange: function (v) { s.gift = v; calc(); } }),
        r7520: GT.percentInput({ value: s.r7520, max: 15, step: 0.2, onChange: function (v) { s.r7520 = v; calc(); } }),
        payout: GT.percentInput({ value: s.payout, min: 5, max: 50, step: 0.5, onChange: function (v) { s.payout = GT.clamp(v, .05, .5); calc(); } }),
        termType: GT.radios({ options: [['life', 'For my lifetime'], ['years', 'For a fixed number of years']], value: 'life', onChange: function (v) { s.termType = v; toggle(); calc(); } }),
        years: GT.numberInput({ min: 1, max: 20, value: s.years, onChange: function (v) { s.years = v; calc(); } }),
        rate: GT.select({ options: GT.BRACKETS(), value: s.rate, onChange: function (v) { s.rate = v; calc(); } }),
        asset: GT.radios({ options: [['cash', 'Cash'], ['stock', 'Appreciated stock']], value: 'cash', onChange: function (v) { s.asset = v; toggle(); calc(); } }),
        basis: GT.moneyInput({ value: s.basis, onChange: function (v) { s.basis = v; calc(); } })
      };
      var payoutField = GT.field('Annual payout rate', ctl.payout, 'Trusts must pay at least 5% and no more than 50% per year. Lower payout rates leave more for the Library and a larger deduction.');
      var termField = GT.field('Payment period', ctl.termType);
      var yearsField = GT.field('Number of years', ctl.years, 'Term trusts can run up to 20 years.');
      var basisField = GT.field('What you paid for the stock', ctl.basis);
      function toggle() {
        payoutField.style.display = s.kind === 'cga' ? 'none' : '';
        termField.style.display = s.kind === 'cga' ? 'none' : '';
        yearsField.style.display = s.kind !== 'cga' && s.termType === 'years' ? '' : 'none';
        basisField.style.display = s.asset === 'stock' ? '' : 'none';
      }
      GT.append(root, [
        GT.field('Which kind of gift?', ctl.kind),
        h('div.grid', [
          GT.field('Your age', ctl.age, 'Single-life illustrations. Two-life arrangements pay a little less each year.'),
          GT.field('Amount of the gift', ctl.gift),
          GT.field('Funded with', ctl.asset), basisField,
          payoutField, termField, yearsField,
          GT.field('IRS §7520 rate', ctl.r7520, 'The rate for ' + t.sec7520.month + ' is ' + pct(t.sec7520.rate, 1) + '. You may use the rate for the month of the gift or either of the two prior months. <a href="' + t.sec7520.url + '" target="_blank" rel="noopener">Current rates</a>.'),
          GT.field('Your federal tax bracket', ctl.rate, 'To estimate what the deduction is worth.')
        ]),
        out
      ]);

      function calc() {
        GT.clear(out);
        var gift = s.gift, r = s.r7520, br = parseFloat(s.rate), dr = GT.deductionRate(br);
        var le = GT.lifeExpectancy(s.age);
        var n = (s.kind !== 'cga' && s.termType === 'years') ? s.years : le;
        var gain = s.asset === 'stock' ? Math.max(0, gift - s.basis) : 0;
        var res = {};

        if (s.kind === 'cga') {
          var ageKey = GT.clamp(Math.round(s.age), 60, 90);
          var arate = t.acga.singleLife[ageKey];
          res.payment = gift * arate;
          res.pv = GT.pvAnnuity(res.payment, r, le);
          res.deduction = Math.max(0, gift - res.pv);
          res.exclusion = Math.min(1, res.pv / (res.payment * le)); // simplified exclusion ratio
          res.taxFree = res.payment * res.exclusion;
          res.label = 'Fixed payment every year for life';
          res.rateNote = 'ACGA suggested rate at age ' + ageKey + ': ' + pct(arate, 1) + (s.age < 60 ? ' (rates for younger ages are lower; shown at the age-60 rate)' : '') + '.';
        } else if (s.kind === 'crut') {
          res.payment = gift * s.payout;
          var factor = Math.pow(1 - s.payout, n);
          res.deduction = gift * factor;
          res.label = 'First-year payment (' + pct(s.payout, 1) + ' of trust value; changes yearly)';
          res.rateNote = 'Remainder factor ≈ (1 − payout)<sup>years</sup> = ' + factor.toFixed(3) + ' over ' + n.toFixed(1) + ' years.';
        } else {
          res.payment = gift * s.payout;
          res.pv = GT.pvAnnuity(res.payment, r, n);
          res.deduction = Math.max(0, gift - res.pv);
          res.label = 'Fixed payment every year';
          res.rateNote = 'Present value of the payments at ' + pct(r, 1) + ' over ' + n.toFixed(1) + ' years ≈ ' + money(res.pv) + '.';
        }
        var passes = res.deduction >= 0.10 * gift;
        var dedLimit = s.asset === 'stock' ? t.charitable.agiLimitAppreciated : t.charitable.agiLimitCash;

        GT.append(out, [
          s.kind === 'cga' && !o.offersGiftAnnuities ? GT.callout('warn', '<p><b>Please note:</b> ' + o.name + ' does not currently issue charitable gift annuities. This illustration shows how one works so you can discuss it with your advisor or a community foundation that issues annuities for the benefit of charities you choose. We are glad to talk through it with you.</p>') : null,
          h('div.stats', [
            GT.stat(res.label, money(res.payment), res.rateNote, 'good'),
            GT.stat('Estimated income-tax deduction', money(res.deduction), 'About ' + pct(res.deduction / gift, 0) + ' of the gift; worth roughly ' + money(res.deduction * dr) + ' at your bracket if you itemize.', 'highlight'),
            s.kind === 'cga' ? GT.stat('Portion of each payment that is tax-free', money(res.taxFree), 'For about ' + le.toFixed(1) + ' years (your life expectancy), assuming a cash gift. After that, payments are fully taxable.', 'muted') : GT.stat('Estimated years of payments', n.toFixed(1), s.termType === 'years' && s.kind !== 'cga' ? 'Fixed term.' : 'Life expectancy at age ' + s.age + ' — actual payments continue for your lifetime.', 'muted')
          ]),
          GT.bars([{ label: 'Your payments (est. total)', value: res.payment * n, tone: 'muted' }, { label: 'Deduction now', value: res.deduction, tone: 'highlight' }, { label: 'Gift amount', value: gift, tone: 'good' }]),
          !passes ? GT.callout('warn', 'The charitable portion must be at least <b>10% of the gift</b> for the arrangement to qualify. At these inputs it is about ' + pct(res.deduction / gift, 0) + '. A lower payout, a shorter term, or an older annuitant would fix that.') : null,
          gain > 0 ? GT.callout('info', '<p><b>Funding with appreciated stock:</b> no capital gains tax is due when you transfer the shares. ' + (s.kind === 'cga' ? 'The gain attributable to the annuity portion is reported gradually as part of your payments over your life expectancy rather than all at once.' : 'The trust sells the shares tax-free; gain is passed out to you over time as part of your payments under the trust’s tiered accounting rules.') + ' The deduction is generally limited to ' + pct(dedLimit, 0) + ' of AGI per year with a five-year carryover.</p>') : GT.callout('info', 'Deductions for cash-funded life-income gifts are limited to ' + pct(dedLimit, 0) + ' of adjusted gross income per year, with a five-year carryover.'),
          s.kind === 'cga' ? GT.callout('info', '<p><b>One-time IRA option:</b> people 70½ and older may make a once-in-a-lifetime qualified charitable distribution of up to ' + money(t.qcd.splitInterestLimit) + ' (' + t.taxYear + ') from an IRA to fund a gift annuity or remainder trust. Payments from an IRA-funded annuity are fully taxable, but the transfer itself is excluded from income and can count toward your RMD.</p>') : null,
          GT.section('What to expect', GT.list(s.kind === 'cga' ? [
            'A gift annuity is a contract, not a trust — simple paperwork, usually a ' + money(10000) + ' to ' + money(25000) + ' minimum, and the payments are a general obligation of the issuing charity.',
            'Payments are fixed for life and never change. Two-life annuities can continue to a spouse.',
            'A “deferred” gift annuity starts payments at a later date you choose, with a higher rate and larger deduction.'
          ] : s.kind === 'crut' ? [
            'The trust is a separate legal entity with its own trustee, tax return, and annual valuation; most advisors suggest ' + money(250000) + ' or more to justify the cost.',
            'Payments are recalculated each year, so they can grow (or shrink) with the trust’s investments — a built-in inflation hedge.',
            'Additional contributions can be made to a unitrust later; a “flip” unitrust can hold real estate until it sells.'
          ] : [
            'The trust pays a fixed dollar amount every year regardless of performance, which is attractive if you want predictability.',
            'No additional contributions are permitted after funding, and the IRS applies an extra test to be sure the trust is unlikely to run out of money.',
            'Like a unitrust, it requires a trustee, a tax return, and professional setup.'
          ])),
          h('div.actions', [GT.linkBtn('Email the giving team', 'mailto:' + o.contactEmail, 'primary'), GT.linkBtn('Give from your IRA instead', GT.toolUrl('qcd'), 'secondary')]),
          GT.advisorQuestions([
            'Given my income needs and my heirs, is a gift annuity or a remainder trust the better fit — or neither?',
            'Which assets should fund it, and how would the capital gain be handled?',
            'Which month’s §7520 rate gives me the best deduction, and should I time the gift?',
            'Who would issue the annuity or serve as trustee, and what would it cost?',
            'How would the payments be taxed to me each year, and how does that change if I fund it from my IRA?'
          ]),
          GT.contactLine()
        ]);
      }
      toggle(); calc();
    }
  });
})(window.TRPLGivingTools);

/* @tool Employer Matching Gift Impact
 * Shows what a gift becomes with an employer match and how to claim it. */
(function (GT) {
  var h = GT.h, ORG = GT.ORG, money = GT.money;

  GT.register('matching', {
    title: 'Double your gift with an employer match',
    intro: 'Thousands of employers match their employees’ charitable gifts — some 2:1 or more, and many include retirees and spouses. See what your gift could become and how to claim the match.',
    disclaimer: true,
    disclaimerExtra: 'Matching programs are set by each employer and change often; the impact shown is an estimate. Membership dues and event tickets are usually not matched.',
    render: function (root, GT, opts) {
      var o = ORG();
      /* Optional: embed the Library's Double the Donation employer search.
       * Pass data-dtd-key="<public API key>" on the placeholder (the same key
       * the plugin on trlibrary.com/matching-gifts uses). Nothing loads unless
       * a key is provided. */
      var dtdKey = opts.dtdKey || o.doubleTheDonationKey || '';
      var lookup = null;
      if (dtdKey) {
        lookup = GT.section('Search for your employer', [
          h('p.help', 'Type your company name to see whether it matches gifts, the ratio and limits, and how to submit. Powered by Double the Donation.'),
          h('div', { id: 'dd-container' })
        ]);
        window.DDCONF = window.DDCONF || { API_KEY: dtdKey };
        if (!document.getElementById('trpl-dtd-plugin')) {
          var sc = document.createElement('script'); sc.id = 'trpl-dtd-plugin'; sc.async = true; sc.src = 'https://doublethedonation.com/api/js/ddplugin.js';
          document.head.appendChild(sc);
        }
      }
      var s = { gift: 250, ratio: '1', cap: 0, monthly: false };
      var out = h('div.section');
      var ctl = {
        gift: GT.moneyInput({ value: s.gift, onChange: function (v) { s.gift = v; calc(); } }),
        ratio: GT.radios({ options: [['0.5', '0.5 : 1'], ['1', '1 : 1'], ['2', '2 : 1'], ['3', '3 : 1']], value: '1', onChange: function (v) { s.ratio = v; calc(); } }),
        cap: GT.moneyInput({ value: '', placeholder: 'Optional', onChange: function (v) { s.cap = v; calc(); } }),
        monthly: GT.checkbox('This is a monthly gift — show the annual total', { onChange: function (v) { s.monthly = v; calc(); } })
      };
      ctl.cap.input.value = '';
      GT.append(root, [
        h('div.grid', [
          GT.field('Your gift', ctl.gift),
          GT.field('Your employer’s match ratio', ctl.ratio, 'Check your HR portal or ask your benefits team. 1:1 is most common.'),
          GT.field('Annual match limit per employee, if you know it', ctl.cap)
        ]),
        h('div', [ctl.monthly.el]),
        out,
        lookup
      ]);
      function calc() {
        GT.clear(out);
        var base = s.monthly ? s.gift * 12 : s.gift;
        var match = base * parseFloat(s.ratio);
        if (s.cap > 0) match = Math.min(match, s.cap);
        GT.append(out, [
          h('div.stats', [
            GT.stat(s.monthly ? 'Your gifts this year' : 'Your gift', money(base), null, 'muted'),
            GT.stat('Employer match', money(match), s.cap > 0 && base * parseFloat(s.ratio) > s.cap ? 'Limited by your employer’s ' + money(s.cap) + ' cap.' : null, 'good'),
            GT.stat('Total impact for the Library', money(base + match), null, 'highlight')
          ]),
          GT.bars([{ label: 'Your gift', value: base, tone: 'muted' }, { label: 'With match', value: base + match, tone: 'good' }]),
          GT.section('How to claim your match', h('ol.steps', [
            h('li', { html: 'Make your gift to the Library first (<a href="' + o.urls.donate + '" target="_blank" rel="noopener">give online</a>) and keep the receipt.' }),
            GT.li('Find your employer’s matching gift form or portal — usually under “Giving,” “Community,” or “Benefits” in HR — or ask your HR team. Many companies use Benevity, YourCause, CyberGrants, or Bright Funds.'),
            h('li', { html: 'Submit the request with the Library’s details: <b>' + o.name + '</b>, EIN <b>' + o.ein + '</b>, ' + o.address + '.' }),
            h('li', { html: 'The employer verifies the gift with the Library and sends the match — typically within a few weeks to a few months. Questions: <a href="mailto:' + o.contactEmail + '">' + o.contactEmail + '</a>.' })
          ])),
          GT.callout('info', '<p><b>Don’t assume you’re not eligible.</b> Many programs cover part-time employees, retirees, spouses, and board members, and some match volunteer hours with grants. Deadlines are often the end of the calendar year or a set number of months after the gift.</p>'),
          h('div.actions', [GT.linkBtn('Matching gifts page', o.urls.matching, 'primary'), GT.linkBtn('Give now', o.urls.donate, 'secondary')]),
          GT.contactLine()
        ]);
      }
      calc();
    }
  });
})(window.TRPLGivingTools);

/* @tool Monthly Giving Calculator
 * A friendly slider that shows what a monthly gift adds up to and links to
 * the monthly giving form with the amount pre-selected where supported. */
(function (GT) {
  var h = GT.h, ORG = GT.ORG, T = GT.T, money = GT.money;

  GT.register('monthly', {
    title: 'Small monthly gifts, big yearly impact',
    intro: 'Monthly giving spreads your support across the year and gives the Library a steady base to plan on. Slide to see what your gift adds up to.',
    disclaimerExtra: 'Monthly gifts are charged to your card or bank account on the same day each month and can be changed or cancelled at any time. Cash gifts to the Library qualify for the ' + money(T().charitable.nonItemizer.single) + ' / ' + money(T().charitable.nonItemizer.mfj) + ' non-itemizer deduction in ' + T().taxYear + '.',
    render: function (root) {
      var o = ORG(), t = T();
      var s = { amt: 25 };
      var out = h('div.section');
      var presets = [10, 25, 50, 100, 250];
      var slider = h('input.range', { type: 'range', min: 5, max: 500, step: 5, value: s.amt, 'aria-label': 'Monthly gift amount' });
      var custom = GT.moneyInput({ value: s.amt, onChange: function (v) { s.amt = Math.max(1, v); slider.value = GT.clamp(s.amt, 5, 500); calc(); } });
      slider.addEventListener('input', function () { s.amt = +slider.value; custom.set(s.amt); calc(); });
      var chips = h('div.radios', presets.map(function (p) { return GT.button(money(p) + '/mo', function () { s.amt = p; slider.value = p; custom.set(p); calc(); }, 'secondary'); }));
      GT.append(root, [
        h('div.grid.two', [GT.field('Monthly gift', custom), h('div.field', [h('label.label', 'Or slide'), slider, chips])]),
        out
      ]);
      function calc() {
        GT.clear(out);
        var a = s.amt, yr = a * 12;
        var perDay = a / 30.4;
        GT.append(out, [
          h('div.stats', [
            GT.stat('Per year', money(yr), 'That’s about ' + money(perDay, { cents: true }) + ' a day.', 'good'),
            GT.stat('Over three years', money(yr * 3), null, 'muted'),
            GT.stat('Over five years', money(yr * 5), null, 'highlight')
          ]),
          GT.bars([{ label: 'Year 1', value: yr, tone: 'good' }, { label: 'Year 3', value: yr * 3, tone: 'good' }, { label: 'Year 5', value: yr * 5, tone: 'highlight' }]),
          GT.callout('info', '<p>A monthly gift of ' + money(a) + ' gives the Library the same support as a ' + money(yr) + ' annual gift — spread out so it fits your budget. You’ll receive one year-end summary for your taxes.</p>'),
          h('div.actions', [GT.linkBtn('Start a ' + money(a) + ' monthly gift', o.urls.donateMonthly + (o.urls.donateMonthly.indexOf('?') >= 0 ? '&' : '?') + 'amount=' + a, 'primary'), GT.linkBtn('Give once instead', o.urls.donate, 'secondary'), GT.linkBtn('Become a member', o.urls.membership, 'secondary')]),
          GT.contactLine()
        ]);
      }
      calc();
    }
  });
})(window.TRPLGivingTools);

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
        links: [['How to give from your IRA', u.ira], ['Estimate your QCD savings', GT.toolUrl('qcd')]] });
      qs.push('Should part or all of my required minimum distribution go to charity as a QCD this year?');
      qs.push('Would keeping this out of my adjusted gross income help with Medicare premiums or the taxation of my Social Security?');
    } else if (has('ira') && a.age !== '70') {
      recs.push({ score: 55, title: 'Name the Library as a beneficiary of your retirement account', tag: 'Tax-smart for later',
        why: 'Retirement accounts are often the most heavily taxed asset heirs can inherit. Leaving a percentage to the Library costs your family less than leaving them the same dollars in other assets — and it takes minutes on a beneficiary form, no attorney needed.',
        next: 'Log in to your plan or IRA account and add ' + o.name + ' (EIN ' + o.ein + ') as a primary or contingent beneficiary for a percentage of your choice.',
        links: [['Beneficiary designation guide', GT.toolUrl('beneficiary')], ['Heritage Society', u.heritage]] });
      if (a.age === 'u59' && a.goal === 'now') qs.push('Withdrawing from a retirement account before 59½ usually triggers a 10% penalty. Is there a better asset to give from now?');
      qs.push('Which of my assets are best left to charity and which to family, given how each is taxed when inherited?');
    }

    if (has('stock')) {
      recs.push({ score: 90, title: 'Give appreciated stock or fund shares', tag: 'Strong fit',
        why: 'When you give shares held more than a year, you generally avoid capital gains tax on the growth and may deduct the full market value if you itemize. The Library receives more, and it costs you less than selling and giving cash.',
        next: 'Ask your broker to transfer shares to the Library’s brokerage account — the transfer instructions are on the stock gift page.',
        links: [['Stock gift instructions', u.stock], ['Compare giving shares vs. cash', GT.toolUrl('stock')]] });
      qs.push('Which of my holdings has the largest unrealized gain and has been held longer than a year?');
    }

    if (has('daf')) {
      recs.push({ score: 85, title: 'Recommend a grant from your donor-advised fund', tag: 'Easy today',
        why: 'You already took the deduction when you funded the DAF, so a grant to the Library is the simplest way to give. Most sponsors let you set it up online in a few minutes.',
        next: 'Log in to your fund sponsor and recommend a grant to ' + o.name + ' (EIN ' + o.ein + ').',
        links: [['DAF grant guide', GT.toolUrl('daf')], ['Donor-advised funds', u.daf]] });
      qs.push('Should I name the Library as a successor or beneficiary of my donor-advised fund?');
    }

    if (a.goal === 'later' || has('estate') || a.goal === 'explore') {
      recs.push({ score: a.goal === 'later' ? 95 : 60, title: 'Include the Library in your will or trust', tag: a.goal === 'later' ? 'Strong fit' : 'Worth considering',
        why: 'A gift in your will costs nothing today, can be a fixed amount or a percentage, and can be changed at any time. It is how most legacy gifts are made, and it qualifies you for the ' + o.legacySociety + '.',
        next: 'Share the sample language with your attorney, or add it when you next update your plan. Then let us know so we can thank you.',
        links: [['Write your bequest language', GT.toolUrl('bequest')], ['Heritage Society', u.heritage]] });
      qs.push('Would a percentage of my estate or a specific dollar amount make more sense for my family?');
      qs.push('Does my current will or trust reflect the charities I care about today?');
      if (has('estate') || a.size === 'xl') {
        recs.push({ score: 50, title: 'See how a charitable bequest affects estate tax', tag: 'Planning aid',
          why: 'Federal estate tax applies only above ' + money(t.estate.exemption) + ' per person in ' + t.taxYear + ', but a dozen states tax much smaller estates. Charitable bequests are fully deductible from the taxable estate.',
          next: 'Run a rough estimate, then bring it to your estate attorney.',
          links: [['Estate tax estimator', GT.toolUrl('estate')]] });
      }
    }

    if (a.goal === 'income') {
      recs.push({ score: 92, title: 'Explore a gift that pays you income', tag: 'Talk with an advisor',
        why: 'Charitable gift annuities and charitable remainder trusts let you make a gift now, receive payments for life or a term of years, and take a partial deduction. ' + (o.offersGiftAnnuities ? 'The Library can issue gift annuities directly.' : 'The Library does not currently issue gift annuities itself, but a community foundation or your advisor can set one up that ultimately benefits the Library.'),
        next: 'Use the illustrator to see ballpark numbers, then ask your advisor which vehicle fits.',
        links: [['Life-income gift illustrator', GT.toolUrl('lifeincome')]] });
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
        links: [['Give now', u.donate], ['Monthly giving calculator', GT.toolUrl('monthly')]] });
      if (big && a.itemize !== 'yes') {
        recs.push({ score: 70, title: 'Consider “bunching” several years of giving', tag: 'Tax idea',
          why: 'If you normally take the standard deduction, combining two or three years of gifts into one year — often through a donor-advised fund — can lift you over the itemizing threshold and save real money, while you keep supporting the Library every year.',
          next: 'Compare an every-year plan with a bunched plan.',
          links: [['Bunching comparison', GT.toolUrl('bunching')]] });
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
        links: [['ND tax credit calculator', GT.toolUrl('ndcredit')], ['Email the giving team', 'mailto:' + o.contactEmail]] });
      qs.push('Do I have enough North Dakota tax liability over the next four years to use the full 40% credit, and how does the credit affect my federal deduction?');
    }

    if (a.match === 'yes' || a.match === 'unsure') {
      recs.push({ score: 40, title: 'Double your gift with an employer match', tag: 'Free money',
        why: 'Many employers match gifts to nonprofits like the Library — sometimes 2:1 — and some match retirees’ gifts too.',
        next: 'Check your HR portal or the matching gifts page and submit the request after you give.',
        links: [['Matching gifts', u.matching], ['Matching gift impact', GT.toolUrl('matching')]] });
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
      var s = { who: 'individual', kind: 'endowment', status: 'mfj', gift: 25000, deduction: 40000, ndIncome: 150000, rate: '0.24', itemize: 'no', saltRoom: false };
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
          GT.callout('good', '<p><b>Stack the benefits.</b> Give appreciated stock to the endowment and you avoid capital gains tax, may deduct it federally (net of the credit), and claim the 40% state credit. Or, if you are 70½ or older, a qualified charitable distribution from an IRA to the endowment keeps the amount out of your income entirely <i>and</i> earns the credit — ask your preparer to confirm both apply together.</p>'),
          o.ndEndowment.confirmed && o.ndEndowment.fundName
            ? GT.callout('info', '<p>Gifts designated to the <b>' + o.ndEndowment.fundName + '</b> qualify. Please note “endowment” on your gift so it is recorded correctly, and keep the Library’s acknowledgment for your ' + (kind === 'endowment' ? c.formEndowment : c.formPlanned) + '.</p>')
            : GT.callout('warn', '<p><b>Before you count on the credit:</b> it applies only to gifts directed to a qualified endowment fund — a permanent, irrevocable fund that spends only its earnings. Please email <a href="mailto:' + o.contactEmail + '">' + o.contactEmail + '</a> and we will confirm how to designate your gift to the Library’s endowment so it qualifies.</p>'),
          GT.section('How to claim it', h('ol.steps', [
            GT.li('Make your gift to the ' + o.name + ' and designate it for the <b>endowment</b>' + (kind === 'planned' ? ', or complete the planned gift with your advisor' : '') + '. Keep the acknowledgment letter.'),
            GT.li('File <b>' + (kind === 'endowment' ? c.formEndowment : c.formPlanned) + '</b> with your North Dakota return' + (biz ? ' (Schedule QEC for entities)' : '') + '. The statute is ' + c.statute + '.'),
            GT.li('If the credit exceeds your North Dakota tax, carry the balance forward — up to ' + c.carryforwardYears + ' more years.'),
            GT.li('On your federal return, reduce the charitable deduction by the credit (your preparer will know the rule) — or use the SALT safe harbor if you have room under the cap.')
          ])),
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
      toggle(); calc();
    }
  });
})(window.TRPLGivingTools);

/* @tool IRA Qualified Charitable Distribution Calculator
 * Shows whether a visitor is eligible for a QCD, estimates their RMD, and
 * compares giving straight from the IRA with withdrawing and giving cash. */
(function (GT) {
  var h = GT.h, T = GT.T, ORG = GT.ORG, money = GT.money, pct = GT.pct;

  GT.register('qcd', {
    title: 'Give from your IRA',
    intro: 'If you are 70½ or older, a Qualified Charitable Distribution (QCD) sends money from your IRA directly to the Library — and it never counts as taxable income. See what that could mean for you.',
    disclaimerExtra: 'RMD estimates use the IRS Uniform Lifetime Table and your age this year; your custodian’s figure governs. QCDs must go directly from the custodian to the charity and cannot fund a donor-advised fund.',
    render: function (root) {
      var t = T(), o = ORG();
      var s = { age: 73, status: 'mfj', rate: '0.22', balance: 500000, gift: 10000, itemize: 'no', agi: 120000 };
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
            GT.callout('warn', '<p><b>Not eligible yet.</b> QCDs are available once you reach 70½ — about ' + wait + ' year' + (wait === 1 ? '' : 's') + ' from now.</p><p>In the meantime, two ideas: naming the Library as a <b>beneficiary of the IRA</b> is one of the most tax-efficient legacy gifts available, and if you own <b>appreciated stock</b>, giving shares is usually better than giving cash.</p>'),
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
            GT.li('Ask that the check be sent directly to the Library (or to you, made out to the Library — you can forward it, but it must not be payable to you).'),
            h('li', { html: 'Email <a href="mailto:' + o.contactEmail + '">' + o.contactEmail + '</a> so we can watch for it — custodians often omit the donor’s name.' }),
            GT.li('Keep the Library’s acknowledgment letter for your tax records. Your custodian will report the distribution on Form 1099-R; you or your preparer mark it as a QCD on your return.')
          ])),
          h('div.actions', [GT.linkBtn('IRA giving instructions', o.urls.ira, 'primary'), GT.linkBtn('Email the giving team', 'mailto:' + o.contactEmail, 'secondary')]),
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
      calc();
    }
  });
})(window.TRPLGivingTools);

/* @tool Appreciated Stock Gift Calculator
 * Compares giving shares directly with selling the shares and giving the
 * after-tax cash. */
(function (GT) {
  var h = GT.h, T = GT.T, ORG = GT.ORG, money = GT.money, pct = GT.pct;

  GT.register('stock', {
    title: 'Give stock instead of cash',
    intro: 'Giving shares you have held more than a year lets you skip the capital gains tax and, if you itemize, deduct the full market value. Compare the two paths with your own numbers.',
    disclaimerExtra: 'Assumes publicly traded securities held more than one year and given to a public charity. Deductions for appreciated property are limited to 30% of adjusted gross income per year, with a five-year carryover. Mutual-fund cost basis and wash-sale rules can complicate the picture — ask your advisor.',
    render: function (root) {
      var t = T(), o = ORG();
      var s = { fmv: 25000, basis: 8000, held: 'long', status: 'mfj', rate: '0.24', cg: '0.15', niit: false, state: 0, itemize: 'yes', agi: 200000 };
      var out = h('div.section');
      var ctl = {
        fmv: GT.moneyInput({ value: s.fmv, onChange: function (v) { s.fmv = v; calc(); } }),
        basis: GT.moneyInput({ value: s.basis, onChange: function (v) { s.basis = v; calc(); } }),
        held: GT.radios({ options: [['long', 'More than one year'], ['short', 'One year or less']], value: s.held, onChange: function (v) { s.held = v; calc(); } }),
        status: GT.select({ options: GT.FILING, value: s.status, onChange: function (v) { s.status = v; calc(); } }),
        rate: GT.select({ options: GT.BRACKETS(), value: s.rate, onChange: function (v) { s.rate = v; calc(); } }),
        cg: GT.select({ options: [['0', '0%'], ['0.15', '15%'], ['0.20', '20%']], value: s.cg, onChange: function (v) { s.cg = v; calc(); } }),
        niit: GT.checkbox('Add the 3.8% net investment income tax (applies above ' + money(t.niit.threshold.mfj) + ' MAGI for joint filers, ' + money(t.niit.threshold.single) + ' single)', { value: s.niit, onChange: function (v) { s.niit = v; calc(); } }),
        state: GT.percentInput({ value: s.state, max: 20, onChange: function (v) { s.state = v; calc(); } }),
        itemize: GT.radios({ options: [['yes', 'Yes'], ['no', 'No'], ['unsure', 'Not sure']], value: s.itemize, onChange: function (v) { s.itemize = v; calc(); } }),
        agi: GT.moneyInput({ value: s.agi, onChange: function (v) { s.agi = v; calc(); } })
      };
      GT.append(root, [
        h('div.grid', [
          GT.field('Current market value of the shares', ctl.fmv),
          GT.field('What you paid for them (cost basis)', ctl.basis, 'Your brokerage statement lists this. If you don’t know, a rough guess still shows the pattern.'),
          GT.field('How long have you held them?', ctl.held),
          GT.field('Filing status', ctl.status),
          GT.field('Your federal income tax bracket', ctl.rate),
          GT.field('Your long-term capital gains rate', ctl.cg, 'In ' + t.taxYear + ' the 15% rate begins at ' + money(t.ltcg[s.status][0]) + ' of taxable income and 20% at ' + money(t.ltcg[s.status][1]) + ' (joint filers: ' + money(t.ltcg.mfj[0]) + ' / ' + money(t.ltcg.mfj[1]) + ').'),
          GT.field('State capital gains / income tax rate (optional)', ctl.state, 'North Dakota residents: leave at 0 — the state has no separate capital gains tax beyond its low income tax; enter your state’s rate if you live elsewhere.'),
          GT.field('Approximate adjusted gross income', ctl.agi, 'For the ½%-of-AGI floor and the 30%-of-AGI limit.'),
          GT.field('Do you itemize deductions?', ctl.itemize)
        ]),
        h('div', [ctl.niit.el]),
        out
      ]);

      function calc() {
        GT.clear(out);
        var fmv = s.fmv, basis = Math.min(s.basis, s.fmv), gain = Math.max(0, fmv - basis), r = parseFloat(s.rate), cg = parseFloat(s.cg);
        var gainRate = (s.held === 'long' ? cg : r) + (s.niit ? t.niit.rate : 0) + s.state;
        var taxOnSale = gain * gainRate;
        var cashGift = fmv - taxOnSale;
        var dedRate = GT.deductionRate(r);
        var itemizing = s.itemize === 'yes';
        // deduction for shares: FMV if long-term, basis if short-term
        var dedShares = s.held === 'long' ? fmv : basis;
        var dedSharesUsable = Math.min(dedShares, t.charitable.agiLimitAppreciated * s.agi);
        var dedCashUsable = Math.min(cashGift, t.charitable.agiLimitCash * s.agi);
        var valShares = itemizing ? GT.charitableAfterFloor(dedSharesUsable, s.agi) * dedRate : GT.nonItemizerDeduction(0, s.status) * r; // stock gifts don't qualify for the non-itemizer cash deduction
        var valCash = itemizing ? GT.charitableAfterFloor(dedCashUsable, s.agi) * dedRate : GT.nonItemizerDeduction(cashGift, s.status) * r;
        var costShares = fmv - valShares;               // what the gift really costs you
        var costCash = fmv - valCash;                    // you gave up the whole position either way; tax already paid out of proceeds
        var carry = dedShares - dedSharesUsable;

        GT.append(out, [
          s.held === 'short' ? GT.callout('warn', '<b>Held one year or less:</b> the deduction for short-term shares is limited to what you paid (' + money(basis) + '), not market value, and the gain would be taxed at ordinary rates if sold. If you can, wait until you have held the shares more than a year.') : null,
          h('div.stats', [
            GT.stat('Capital gains tax you avoid', money(taxOnSale), 'On ' + money(gain) + ' of gain at ' + pct(gainRate, 1) + ' combined.', 'good'),
            GT.stat('Library receives if you give shares', money(fmv), 'Full market value, no tax taken out first.', 'good'),
            GT.stat('Library receives if you sell, then give', money(cashGift), 'After ' + money(taxOnSale) + ' in tax on the sale.', 'muted'),
            GT.stat('Your deduction for the share gift', itemizing ? money(GT.charitableAfterFloor(dedSharesUsable, s.agi)) : '—', itemizing ? 'Worth about ' + money(valShares) + ' at ' + pct(dedRate, 0) + '.' : 'Non-itemizers can’t deduct stock gifts (the ' + money(t.charitable.nonItemizer[s.status]) + ' non-itemizer deduction is for cash only) — the avoided capital gains tax is still yours to keep.', 'highlight')
          ]),
          GT.section('Side by side', h('table.table', [
            h('thead', h('tr', [h('th', ''), h('th.num', 'Give the shares'), h('th.num', 'Sell, then give cash')])),
            h('tbody', [
              h('tr', [h('td', 'You part with'), h('td.num', money(fmv)), h('td.num', money(fmv))]),
              h('tr', [h('td', 'Capital gains tax paid'), h('td.num', money(0)), h('td.num', money(taxOnSale))]),
              h('tr', [h('td', 'Library receives'), h('td.num', money(fmv)), h('td.num', money(cashGift))]),
              h('tr', [h('td', 'Value of your deduction'), h('td.num', money(valShares)), h('td.num', money(valCash))]),
              h('tr', [h('td', { html: '<b>Net cost to you</b>' }), h('td.num', { html: '<b>' + money(costShares) + '</b>' }), h('td.num', { html: '<b>' + money(costCash) + '</b>' })])
            ])
          ])),
          h('p.help', { html: 'Same position either way. Giving the shares delivers <b>' + money(fmv - cashGift) + ' more</b> to the Library' + (valShares > valCash ? ' and saves you about ' + money(valShares - valCash) + ' more in income tax' : '') + '.' }),
          carry > 0 ? GT.callout('info', 'Deductions for appreciated securities are limited to <b>30% of AGI</b> in a single year. About ' + money(carry) + ' of this deduction would carry forward (up to five years).') : null,
          GT.callout('info', '<p><b>A favorite move:</b> give the shares to the Library, then use the cash you would have given to buy the same stock back. You keep the position with a fresh, higher cost basis — and no wash-sale problem, because you didn’t sell at a loss.</p>'),
          GT.section('How to transfer shares', h('ol.steps', [
            h('li', { html: 'Tell your broker you want to transfer shares to <b>' + o.name + '</b>. The Library’s brokerage (DTC) instructions are on the <a href="' + o.urls.stock + '" target="_blank" rel="noopener">stock gift page</a>.' }),
            GT.li('Transfer the shares — do not sell them. The gift date is the date the shares arrive in the Library’s account, which can take several days; plan ahead near year-end.'),
            h('li', { html: 'Email <a href="mailto:' + o.contactEmail + '">' + o.contactEmail + '</a> with the security, share count, and expected date so we can identify your gift and send a receipt.' }),
            GT.li('For gifts over $500 you will file IRS Form 8283 with your return; publicly traded stock does not require an appraisal.')
          ])),
          h('div.actions', [GT.linkBtn('Stock transfer instructions', o.urls.stock, 'primary'), GT.linkBtn('Email the giving team', 'mailto:' + o.contactEmail, 'secondary')]),
          GT.advisorQuestions([
            'Which lot of my shares has the highest gain and longest holding period? (Give those first.)',
            'Will the 30%-of-AGI limit apply to me this year, and would a carryover be usable?',
            'Should I repurchase the same stock after giving, to reset my basis?',
            'Would giving mutual fund shares or ETF shares work the same way with my custodian?',
            'How does my state treat the deduction and the avoided gain?'
          ]),
          GT.contactLine()
        ]);
      }
      calc();
    }
  });
})(window.TRPLGivingTools);
