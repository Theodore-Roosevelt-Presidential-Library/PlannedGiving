/* TRPL Giving Tools v1.1.0 — https://givingtools.labs.trlibrary.com — built 2026-09-16 */
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
  if (window.TRPLGivingTools && window.TRPLGivingTools.version === '1.1.0') return;

  var GT = window.TRPLGivingTools = window.TRPLGivingTools || {};
  GT.version = '1.1.0';
  GT.registry = GT.registry || {};
  GT.mounted = GT.mounted || [];

  /* ---------------------------------------------------------------------- */
  /* Styles — injected once. Everything is scoped under .trpl-gt so the host */
  /* page's CSS and ours stay out of each other's way.                       */
  /* ---------------------------------------------------------------------- */
  var CSS = "/* TRPL Giving Tools — scoped styles. Everything lives under .trpl-gt. Host pages can override via CSS variables on the wrapper element. */ .trpl-gt { --trpl-accent: #1B4532; /* Dark Forest */ --trpl-accent-2: #092A4D; /* Night Sky */ --trpl-highlight: #E7805D; /* Deep Orange */ --trpl-good: #87BB41; /* Spring Green */ --trpl-warn: #F9D635; /* Sunset Yellow */ --trpl-sand: #D1CCBD; --trpl-ink: #25282A; --trpl-muted: #5b6166; --trpl-bg: #ffffff; --trpl-panel: #f6f4ef; --trpl-line: #e2ded4; --trpl-radius: 10px; --trpl-font: inherit; --trpl-font-display: inherit; font-family: var(--trpl-font); color: var(--trpl-ink); background: var(--trpl-bg); border: 1px solid var(--trpl-line); border-radius: var(--trpl-radius); padding: 24px; max-width: 860px; margin: 0 auto; box-sizing: border-box; line-height: 1.5; font-size: 16px; } .trpl-gt[data-theme=\"dark\"] { --trpl-bg: #0f1d2c; --trpl-panel: #16273a; --trpl-line: #2a3e55; --trpl-ink: #f3f1ea; --trpl-muted: #b9c3cf; --trpl-accent: #8FC895; --trpl-accent-2: #99ADC5; } .trpl-gt *, .trpl-gt *::before, .trpl-gt *::after { box-sizing: border-box; } .trpl-gt .trpl-eyebrow { font-family: var(--trpl-font-display); text-transform: uppercase; letter-spacing: .12em; font-size: 12px; font-weight: 700; color: var(--trpl-highlight); margin: 0 0 4px; } .trpl-gt .trpl-h2 { font-family: var(--trpl-font-display); font-size: 26px; line-height: 1.15; margin: 0 0 8px; color: var(--trpl-accent-2); font-weight: 800; text-transform: uppercase; letter-spacing: .01em; } .trpl-gt[data-theme=\"dark\"] .trpl-h2 { color: #fff; } .trpl-gt .trpl-h3 { font-size: 17px; margin: 0 0 10px; color: var(--trpl-accent-2); font-weight: 700; } .trpl-gt[data-theme=\"dark\"] .trpl-h3 { color: #fff; } .trpl-gt .trpl-intro { margin: 0 0 18px; color: var(--trpl-muted); font-size: 16px; } .trpl-gt .trpl-head { border-bottom: 2px solid var(--trpl-accent); padding-bottom: 12px; margin-bottom: 18px; } .trpl-gt .trpl-body { display: grid; gap: 18px; } .trpl-gt .trpl-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px 18px; } .trpl-gt .trpl-grid.trpl-two { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); } .trpl-gt .trpl-panel { background: var(--trpl-panel); border-radius: var(--trpl-radius); padding: 18px; } .trpl-gt .trpl-section { display: grid; gap: 10px; } .trpl-gt .trpl-field { display: grid; gap: 6px; } .trpl-gt .trpl-label { font-weight: 600; font-size: 15px; } .trpl-gt .trpl-help { font-size: 13px; color: var(--trpl-muted); } .trpl-gt .trpl-input { width: 100%; font: inherit; font-size: 16px; padding: 10px 12px; border: 1px solid var(--trpl-line); border-radius: 8px; background: var(--trpl-bg); color: var(--trpl-ink); min-height: 44px; } .trpl-gt .trpl-input:focus { outline: 3px solid rgba(143,200,149,.55); border-color: var(--trpl-accent); } .trpl-gt select.trpl-input { appearance: auto; } .trpl-gt .trpl-money { display: flex; align-items: stretch; } .trpl-gt .trpl-money .trpl-input { flex: 1; border-radius: 0 8px 8px 0; } .trpl-gt .trpl-money .trpl-input:first-child { border-radius: 8px 0 0 8px; } .trpl-gt .trpl-prefix, .trpl-gt .trpl-suffix { display: flex; align-items: center; padding: 0 12px; border: 1px solid var(--trpl-line); background: var(--trpl-panel); color: var(--trpl-muted); font-weight: 600; } .trpl-gt .trpl-prefix { border-right: 0; border-radius: 8px 0 0 8px; } .trpl-gt .trpl-suffix { border-left: 0; border-radius: 0 8px 8px 0; } .trpl-gt .trpl-radios { display: flex; flex-wrap: wrap; gap: 8px; } .trpl-gt .trpl-radios.trpl-stacked { flex-direction: column; } .trpl-gt .trpl-radio { display: flex; gap: 10px; align-items: flex-start; padding: 10px 14px; border: 1px solid var(--trpl-line); border-radius: 8px; cursor: pointer; background: var(--trpl-bg); font-size: 15px; min-height: 44px; } .trpl-gt .trpl-radio:has(input:checked) { border-color: var(--trpl-accent); background: rgba(143,200,149,.16); } .trpl-gt .trpl-radio input { margin: 4px 0 0; accent-color: var(--trpl-accent); flex: none; } .trpl-gt .trpl-radio.trpl-single { border: 0; padding: 4px 0; } .trpl-gt .trpl-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 12px; } .trpl-gt .trpl-stat { background: var(--trpl-panel); border-radius: var(--trpl-radius); padding: 14px 16px; border-top: 4px solid var(--trpl-accent); } .trpl-gt .trpl-stat.trpl-good { border-top-color: var(--trpl-good); } .trpl-gt .trpl-stat.trpl-highlight { border-top-color: var(--trpl-highlight); } .trpl-gt .trpl-stat.trpl-muted { border-top-color: var(--trpl-sand); } .trpl-gt .trpl-stat-label { font-size: 13px; color: var(--trpl-muted); text-transform: uppercase; letter-spacing: .06em; font-weight: 600; } .trpl-gt .trpl-stat-value { font-family: var(--trpl-font-display); font-size: 28px; font-weight: 800; color: var(--trpl-accent-2); margin: 4px 0 2px; line-height: 1.1; } .trpl-gt[data-theme=\"dark\"] .trpl-stat-value { color: #fff; } .trpl-gt .trpl-stat-sub { font-size: 13px; color: var(--trpl-muted); } .trpl-gt .trpl-bars { display: grid; gap: 10px; } .trpl-gt .trpl-bar-row { display: grid; grid-template-columns: minmax(120px, 1.2fr) 3fr auto; gap: 10px; align-items: center; font-size: 14px; } .trpl-gt .trpl-bar-track { background: var(--trpl-panel); border-radius: 999px; height: 16px; overflow: hidden; } .trpl-gt .trpl-bar-fill { height: 100%; background: var(--trpl-accent); border-radius: 999px; transition: width .3s ease; } .trpl-gt .trpl-bar-fill.trpl-good { background: var(--trpl-good); } .trpl-gt .trpl-bar-fill.trpl-highlight { background: var(--trpl-highlight); } .trpl-gt .trpl-bar-fill.trpl-muted { background: var(--trpl-sand); } .trpl-gt .trpl-bar-value { font-weight: 700; white-space: nowrap; } .trpl-gt .trpl-callout { border-left: 4px solid var(--trpl-accent); background: var(--trpl-panel); padding: 12px 16px; border-radius: 0 8px 8px 0; font-size: 15px; } .trpl-gt .trpl-callout.trpl-warn { border-left-color: var(--trpl-highlight); } .trpl-gt .trpl-callout.trpl-good { border-left-color: var(--trpl-good); } .trpl-gt .trpl-callout.trpl-info { border-left-color: var(--trpl-accent-2); } .trpl-gt .trpl-callout p { margin: 0 0 8px; } .trpl-gt .trpl-callout p:last-child { margin: 0; } .trpl-gt .trpl-list { margin: 0; padding-left: 20px; display: grid; gap: 6px; font-size: 15px; } .trpl-gt .trpl-list.trpl-checks { list-style: none; padding-left: 0; } .trpl-gt .trpl-list.trpl-checks li { padding-left: 26px; position: relative; } .trpl-gt .trpl-list.trpl-checks li::before { content: \"✓\"; position: absolute; left: 0; color: var(--trpl-good); font-weight: 800; } .trpl-gt .trpl-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; font: inherit; font-weight: 700; font-size: 15px; padding: 11px 18px; border-radius: 8px; border: 2px solid var(--trpl-accent); background: var(--trpl-bg); color: var(--trpl-accent); cursor: pointer; text-decoration: none; min-height: 44px; } .trpl-gt .trpl-btn.trpl-primary { background: var(--trpl-accent); color: #fff; } .trpl-gt .trpl-btn.trpl-highlight { background: var(--trpl-highlight); border-color: var(--trpl-highlight); color: #fff; } .trpl-gt .trpl-btn.trpl-secondary { border-color: var(--trpl-line); color: var(--trpl-ink); } .trpl-gt .trpl-btn:hover { filter: brightness(1.05); } .trpl-gt .trpl-btn:focus-visible { outline: 3px solid rgba(143,200,149,.7); } .trpl-gt .trpl-actions { display: flex; flex-wrap: wrap; gap: 10px; } .trpl-gt .trpl-cta { background: var(--trpl-accent-2); color: #fff; border-radius: var(--trpl-radius); padding: 18px; display: grid; gap: 12px; } .trpl-gt .trpl-cta p { margin: 0; } .trpl-gt .trpl-cta .trpl-btn { justify-self: start; background: #fff; color: var(--trpl-accent-2); border-color: #fff; } .trpl-gt .trpl-advisor { background: var(--trpl-panel); border-radius: var(--trpl-radius); padding: 12px 16px; } .trpl-gt .trpl-advisor summary { cursor: pointer; font-weight: 700; color: var(--trpl-accent-2); } .trpl-gt[data-theme=\"dark\"] .trpl-advisor summary { color: #fff; } .trpl-gt .trpl-advisor .trpl-list { margin-top: 10px; } .trpl-gt .trpl-disclaimer { margin-top: 20px; padding-top: 14px; border-top: 1px solid var(--trpl-line); font-size: 13px; color: var(--trpl-muted); } .trpl-gt .trpl-disclaimer p { margin: 0 0 8px; } .trpl-gt .trpl-fine { font-size: 12px; } .trpl-gt .trpl-contact { font-size: 14px; color: var(--trpl-muted); margin: 0; } .trpl-gt a { color: var(--trpl-accent); } .trpl-gt .trpl-textout { width: 100%; min-height: 150px; font: inherit; font-size: 15px; padding: 14px; border: 1px solid var(--trpl-line); border-radius: 8px; background: var(--trpl-panel); color: var(--trpl-ink); white-space: pre-wrap; line-height: 1.55; } .trpl-gt .trpl-steps { counter-reset: step; list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; } .trpl-gt .trpl-steps li { position: relative; padding-left: 40px; font-size: 15px; } .trpl-gt .trpl-steps li::before { counter-increment: step; content: counter(step); position: absolute; left: 0; top: 0; width: 28px; height: 28px; border-radius: 50%; background: var(--trpl-accent); color: #fff; font-weight: 800; display: flex; align-items: center; justify-content: center; font-size: 14px; } .trpl-gt .trpl-progress { display: flex; gap: 6px; } .trpl-gt .trpl-progress span { flex: 1; height: 6px; border-radius: 999px; background: var(--trpl-line); } .trpl-gt .trpl-progress span.trpl-on { background: var(--trpl-accent); } .trpl-gt .trpl-question { font-family: var(--trpl-font-display); font-size: 21px; font-weight: 800; color: var(--trpl-accent-2); margin: 0 0 6px; } .trpl-gt[data-theme=\"dark\"] .trpl-question { color: #fff; } .trpl-gt .trpl-rec { border: 1px solid var(--trpl-line); border-radius: var(--trpl-radius); padding: 16px; display: grid; gap: 8px; } .trpl-gt .trpl-rec.trpl-top { border-color: var(--trpl-accent); background: rgba(143,200,149,.12); } .trpl-gt .trpl-rec h4 { margin: 0; font-size: 17px; color: var(--trpl-accent-2); } .trpl-gt[data-theme=\"dark\"] .trpl-rec h4 { color: #fff; } .trpl-gt .trpl-rec .trpl-tag { display: inline-block; font-size: 12px; text-transform: uppercase; letter-spacing: .08em; font-weight: 700; color: var(--trpl-highlight); } .trpl-gt .trpl-rec p { margin: 0; font-size: 15px; } .trpl-gt table.trpl-table { width: 100%; border-collapse: collapse; font-size: 14px; } .trpl-gt table.trpl-table th, .trpl-gt table.trpl-table td { text-align: left; padding: 8px 10px; border-bottom: 1px solid var(--trpl-line); vertical-align: top; } .trpl-gt table.trpl-table th { font-weight: 700; color: var(--trpl-muted); font-size: 13px; text-transform: uppercase; letter-spacing: .05em; } .trpl-gt table.trpl-table td.trpl-num, .trpl-gt table.trpl-table th.trpl-num { text-align: right; white-space: nowrap; } .trpl-gt .trpl-range { width: 100%; accent-color: var(--trpl-accent); } .trpl-gt .trpl-compact { padding: 16px; } .trpl-gt .trpl-infocard { display: grid; gap: 4px; background: var(--trpl-panel); border-radius: var(--trpl-radius); padding: 14px 16px; font-size: 15px; } .trpl-gt .trpl-infocard b { color: var(--trpl-accent-2); } .trpl-gt[data-theme=\"dark\"] .trpl-infocard b { color: #fff; } @media (max-width: 560px) { .trpl-gt { padding: 16px; border-radius: 0; border-left: 0; border-right: 0; } .trpl-gt .trpl-h2 { font-size: 22px; } .trpl-gt .trpl-bar-row { grid-template-columns: 1fr; gap: 4px; } .trpl-gt .trpl-stat-value { font-size: 24px; } } @media print { .trpl-gt .trpl-btn { display: none; } }";
  function injectCSS() {
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
    injectCSS();
    var opts = readOptions(el);
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
    advisorQuestions: advisorQuestions, disclaimer: disclaimer, contactLine: contactLine, intentCTA: intentCTA
  });
})();

/* @tool Employer Matching Gift Impact
 * Shows what a gift becomes with an employer match and how to claim it. */
(function (GT) {
  var h = GT.h, ORG = GT.ORG, money = GT.money;

  GT.register('matching', {
    title: 'Double your gift with an employer match',
    intro: 'Thousands of employers match their employees’ charitable gifts — some 2:1 or more, and many include retirees and spouses. See what your gift could become and how to claim the match.',
    disclaimer: true,
    disclaimerExtra: 'Matching programs are set by each employer and change often; the impact shown is an estimate. Membership dues and event tickets are usually not matched.',
    render: function (root) {
      var o = ORG();
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
        out
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
