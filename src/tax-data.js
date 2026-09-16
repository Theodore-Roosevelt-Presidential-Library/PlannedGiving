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
