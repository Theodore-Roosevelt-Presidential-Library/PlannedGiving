# Annual tax-figure review

Every number the calculators use lives in **`src/tax-data.js`**. This checklist keeps it current. Budget about an hour once a year, plus five minutes a month for the §7520 rate if you want the life-income illustrator to be exact.

A GitHub Action (`.github/workflows/tax-review.yml`) opens an issue with this checklist on **November 1** (the IRS usually publishes next year's figures in late October) and again on **January 5** as a backstop.

## When

- **Late October / November:** IRS Revenue Procedure with next year's inflation adjustments (standard deduction, brackets, capital-gains thresholds, AMT, estate exemption, annual exclusion, QCD limit).
- **Any time Congress passes a tax bill:** re-read the charitable, estate, SALT and senior-deduction sections.
- **Monthly (optional):** §7520 rate. The illustrator lets donors type in the current rate, so a stale default is a nuisance, not an error.
- **When the ACGA changes suggested annuity rates** (announced at acga.org; historically every one to three years).

## Checklist

Update each value in `src/tax-data.js`, then bump `taxYear`, `lastReviewed`, and `reviewDue`.

- [ ] `standardDeduction` — single, MFJ, HOH, MFS
- [ ] `additional65` — extra standard deduction for 65+/blind
- [ ] `seniorBonus` — OBBBA $6,000 senior deduction: amount, phase-out thresholds, and **whether it still exists** (scheduled to expire after 2028)
- [ ] `brackets` — all four filing statuses; `marginalRates` if rates change
- [ ] `ltcg` — taxable-income thresholds where 15% and 20% begin
- [ ] `niit` — rate and thresholds (not indexed; rarely change)
- [ ] `charitable` — non-itemizer deduction amounts, 0.5% floor, 35% cap, 60%/30% AGI limits
- [ ] `salt` — cap, phase-down threshold (rises 1%/yr through 2029; reverts to $10,000 in 2030)
- [ ] `qcd` — annual limit and one-time split-interest limit (both indexed)
- [ ] `estate` — exemption (indexed), top rate, annual gift exclusion
- [ ] `sec7520` — rate and month
- [ ] `acga.singleLife` — only if ACGA announces new rates; update `effective`/`reconfirmed`
- [ ] `uniformLifetime` — only if the IRS issues new tables (last: 2022)
- [ ] `ndCredit` — North Dakota Charitable Giving Tax Credit: rate, $5,000 minimum, $10,000/$20,000 caps, carryforward, qualifying planned-gift list (watch each ND legislative session, odd years)
- [ ] `ndBrackets` — North Dakota income tax brackets (indexed annually; tax.nd.gov)
- [ ] `stateCreditRule` — federal 15% de minimis rule for state credits (Treas. Reg. § 1.170A-1(h)(3)); rarely changes
- [ ] `stateEstateTax` / `stateInheritanceTax` — states add, repeal, and index these every year
- [ ] `lawNote` — the sentence printed in every tool's footer
- [ ] `sources` — list what you used

Then:

- [ ] `node test/run.js` — math checks pass
- [ ] `node build.js && node gen-pages.js`
- [ ] `node test/render.js` — every tool renders with no console errors
- [ ] Open two tools in a browser and confirm the footer shows the new tax year and review date
- [ ] Bump `version` in `package.json`, commit, push — GitHub Pages redeploys automatically
- [ ] Note the review in `TRPL / Planned Giving Web Tools — Research` (Outline) and close the issue

## Primary sources

- IRS newsroom, "IRS releases tax inflation adjustments for tax year YYYY" and the associated Revenue Procedure
- IRS §7520 rates: https://www.irs.gov/businesses/small-businesses-self-employed/section-7520-interest-rates
- IRS Publication 590-B (Uniform Lifetime Table); Publication 526 (charitable contributions)
- American Council on Gift Annuities: https://www.acga.org/current-gift-annuity-rates
- North Dakota Office of State Tax Commissioner: https://www.tax.nd.gov/income-tax-incentives/endowment-fund-contribution-tax-credit and /planned-gift-contribution-tax-credit
- Tax Foundation annual bracket summary (handy cross-check)
- State estate/inheritance tax: each state's department of revenue; law-firm roundups as a starting point

## Things that are deliberately *not* in tax-data.js

- Actual IRS actuarial factors (Table 2010CM / Table S). The life-income illustrator uses approximate life expectancies and says so. If the Foundation ever issues gift annuities, use PG Calc or Crescendo software for real deduction calculations.
- State income-tax rates. Donors enter their own where relevant.
- Anything about specific donors.
