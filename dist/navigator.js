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
