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
    // Entities eligible for the endowment credit (40%, $10,000 cap): C corps, S corps, partnerships,
    // LLCs, estates, trusts, and financial institutions (NDANO; tax.nd.gov endowment credit page).
    // No statutory $5,000 minimum for entities — the minimum was added for individuals by SB 2160 (2011).
    entityTypes: [['ccorp', 'A C corporation'], ['passthrough', 'An S corporation, partnership, or LLC'], ['trust', 'A trust'], ['estate', 'An estate'], ['bank', 'A bank or other financial institution']],
    businessMinGift: 0,
    // The planned-gift credit (Schedule ND-1PG) is claimed by individuals; entities use the endowment credit.
    plannedGiftIndividualsOnly: true,
    // tax.nd.gov does not say whether a taxpayer who makes BOTH an endowment gift and a planned gift in one
    // year gets two caps or one. Tools must not imply stacking; they raise it as an advisor question.
    capsStackingUnresolved: true,
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

  /* --- How each state treats a charitable gift on its income tax --------- */
  // Source: U.S. Charitable Gift Trust, "State and Local Tax Treatment of Charitable
  // Contributions" (Jan 2026) for tax/benefit/rate; state DOR pages for the non-itemizer
  // and credit rules (AZ, CO, MN, MA, UT, VT, WI). `rate` is the maximum state (or state+city)
  // benefit as a share of the gift. `benefit`: none = no income tax; nodeduct = income tax but
  // no charitable deduction; federal = follows the federal itemized deduction; nonitemizer =
  // a benefit that does not require itemizing; credit = credit-based system. retirementExempt marks
  // states that already exclude IRA distributions, where a QCD adds no state saving.
  stateCharitableAsOf: 'January 2026',
  stateCharitable: {
    AL: { name: 'Alabama', benefit: 'federal', rate: .0315 },
    AK: { name: 'Alaska', benefit: 'none', rate: 0 },
    AZ: { name: 'Arizona', benefit: 'nonitemizer', rate: .025, note: 'Standard-deduction filers add 34% of their charitable gifts (2025) to the Arizona standard deduction; itemizers deduct in full, whether or not they itemize federally. Arizona’s own charitable credits apply only to Arizona organizations.' },
    AR: { name: 'Arkansas', benefit: 'federal', rate: .037 },
    CA: { name: 'California', benefit: 'federal', rate: .133, note: 'You can itemize on the California return even if you take the federal standard deduction. Itemized deductions phase down by 6% of AGI above about $252,000 (single), up to 80%.' },
    CO: { name: 'Colorado', benefit: 'nonitemizer', rate: .044, note: 'Filers who take the federal standard deduction subtract their charitable gifts over $500 on the Colorado return. Itemized deductions are capped for taxpayers with AGI of $300,000 or more.' },
    CT: { name: 'Connecticut', benefit: 'nodeduct', rate: 0 },
    DE: { name: 'Delaware', benefit: 'federal', rate: .066 },
    DC: { name: 'District of Columbia', benefit: 'federal', rate: .1075, note: 'Itemized deductions are reduced by 5% of AGI above $200,000.' },
    FL: { name: 'Florida', benefit: 'none', rate: 0 },
    GA: { name: 'Georgia', benefit: 'federal', rate: .0499 },
    HI: { name: 'Hawaii', benefit: 'federal', rate: .11, note: 'Itemized deductions are reduced by 3% of AGI above about $167,000, up to 80%.' },
    ID: { name: 'Idaho', benefit: 'federal', rate: .053 },
    IL: { name: 'Illinois', benefit: 'nodeduct', rate: 0, retirementExempt: true, note: 'Illinois does not tax retirement-plan distributions, so an IRA gift has no extra state benefit here.' },
    IN: { name: 'Indiana', benefit: 'nodeduct', rate: 0 },
    IA: { name: 'Iowa', benefit: 'federal', rate: .038, note: 'Iowa’s Endow Iowa credit applies only to endowed funds at Iowa community foundations.' },
    KS: { name: 'Kansas', benefit: 'federal', rate: .0558 },
    KY: { name: 'Kentucky', benefit: 'federal', rate: .035, note: 'Kentucky’s Endow Kentucky credit applies only to Kentucky community-foundation endowments.' },
    LA: { name: 'Louisiana', benefit: 'nodeduct', rate: 0, note: 'Since 2022 Louisiana allows excess federal itemized deductions only for medical expenses, so charitable gifts no longer reduce Louisiana tax.' },
    ME: { name: 'Maine', benefit: 'federal', rate: .0715, note: 'Itemized deductions are capped (about $37,000) and phase out between roughly $102,000 and $333,000 of AGI.' },
    MD: { name: 'Maryland', benefit: 'federal', rate: .0575, note: 'County income taxes add up to about 3.2%. Maryland’s Endow Maryland credit applies only to Maryland community foundations.' },
    MA: { name: 'Massachusetts', benefit: 'nonitemizer', rate: .09, note: 'A charitable deduction is available to all filers (Massachusetts has no itemizing requirement), limited to 50% of Part B income since 2024.' },
    MI: { name: 'Michigan', benefit: 'nodeduct', rate: 0 },
    MN: { name: 'Minnesota', benefit: 'nonitemizer', rate: .0985, note: 'Non-itemizers subtract 50% of charitable gifts over $500. Minnesota also has its own itemized deductions, usable whether or not you itemize federally, reduced by 3% of AGI above about $239,000.' },
    MS: { name: 'Mississippi', benefit: 'federal', rate: .04 },
    MO: { name: 'Missouri', benefit: 'federal', rate: .047 },
    MT: { name: 'Montana', benefit: 'federal', rate: .059, note: 'Montana’s endowment credit (40% of a planned gift, 20% of a business’s outright gift, $15,000 cap) applies only to endowments held by a Montana-formed 501(c)(3) or a Montana-based affiliate.' },
    NE: { name: 'Nebraska', benefit: 'federal', rate: .052 },
    NV: { name: 'Nevada', benefit: 'none', rate: 0 },
    NH: { name: 'New Hampshire', benefit: 'none', rate: 0 },
    NJ: { name: 'New Jersey', benefit: 'nodeduct', rate: 0 },
    NM: { name: 'New Mexico', benefit: 'federal', rate: .059 },
    NY: { name: 'New York', benefit: 'federal', rate: .1021, note: 'You can itemize on the New York return even if you take the federal standard deduction. New York City adds up to 3.9%. Itemized deductions are cut 50% above $1 million of AGI and 75% above $10 million.' },
    NC: { name: 'North Carolina', benefit: 'federal', rate: .0399 },
    ND: { name: 'North Dakota', benefit: 'federal', rate: .025, note: 'Low rates make the deduction small, but the 40% credit for endowment and planned gifts (N.D.C.C. § 57-38-01.21) is among the strongest giving incentives in the country.' },
    OH: { name: 'Ohio', benefit: 'nodeduct', rate: 0 },
    OK: { name: 'Oklahoma', benefit: 'federal', rate: .045 },
    OR: { name: 'Oregon', benefit: 'federal', rate: .099, note: 'Multnomah, Clackamas, and Washington county taxes can raise the benefit to about 11–14%.' },
    PA: { name: 'Pennsylvania', benefit: 'nodeduct', rate: 0, retirementExempt: true, note: 'Pennsylvania does not tax retirement-plan distributions after retirement age, so an IRA gift has no extra state benefit here.' },
    RI: { name: 'Rhode Island', benefit: 'nodeduct', rate: 0 },
    SC: { name: 'South Carolina', benefit: 'federal', rate: .0521 },
    SD: { name: 'South Dakota', benefit: 'none', rate: 0 },
    TN: { name: 'Tennessee', benefit: 'none', rate: 0 },
    TX: { name: 'Texas', benefit: 'none', rate: 0 },
    UT: { name: 'Utah', benefit: 'credit', rate: .045, note: 'Utah gives a 6% credit on federal itemized deductions, including gifts, that phases out at higher incomes.' },
    VT: { name: 'Vermont', benefit: 'credit', rate: .05, note: 'A 5% credit on charitable gifts, on the first $20,000 given each year (maximum $1,000), whether or not you itemize.' },
    VA: { name: 'Virginia', benefit: 'federal', rate: .0575, note: 'Itemized deductions are reduced by 3% of AGI above about $333,000, up to 80%.' },
    WA: { name: 'Washington', benefit: 'none', rate: 0, note: 'No income tax, but Washington has an estate tax with a low exemption — see the estate tool.' },
    WV: { name: 'West Virginia', benefit: 'nodeduct', rate: 0 },
    WI: { name: 'Wisconsin', benefit: 'credit', rate: .05, note: 'A 5% itemized-deduction credit on charitable gifts (with other itemized deductions) above the Wisconsin standard deduction.' },
    WY: { name: 'Wyoming', benefit: 'none', rate: 0 }
  },

  sources: [
    'IRS Rev. Proc. 2025-32 (2026 inflation adjustments)',
    'Tax Foundation, 2026 Tax Brackets',
    'IRS §7520 rate table; Rev. Rul. 2026-17',
    'American Council on Gift Annuities, suggested maximum rates (reconfirmed 2025-11-07)',
    'IRS Publication 590-B, Uniform Lifetime Table',
    'Kiplinger / TurboTax summaries of OBBBA charitable-deduction changes',
    'U.S. Charitable Gift Trust, State and Local Tax Treatment of Charitable Contributions (Jan 2026)',
    'Arizona DOR Individual Income Tax Highlights (2025); Minnesota Schedule M1M; Colorado DR 0104AD; Montana DOR Qualified Endowment Credit'
  ]
};
