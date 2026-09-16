# CLAUDE.md — working in this repo

You are looking at **TRPL Giving Tools**: self-contained JavaScript embeds (planned-giving and tax-smart-giving calculators, guides, and paperwork generators) for the Theodore Roosevelt Presidential Library Foundation, published with GitHub Pages at https://givingtools.labs.trlibrary.com and embedded on trlibrary.com at `/support/tools/<name>`. Any nonprofit may fork it (see `docs/FORKING.md`).

Read this whole file before changing anything. The most common reason a session opens this repo is the **annual tax-year rollover**, covered in detail below.

## Ground rules

1. **Every tax number lives in `src/tax-data.js`.** Never hard-code a figure in a tool. If a tool needs a new number, add it to tax-data with a comment naming the source.
2. **Every organization fact lives in `src/config.js`.** Never hard-code a name, EIN, URL, or email in a tool. Refer to the organization in copy as `{{org}}` ("the Library"), `{{Org}}` (sentence start) or `{{OrgBare}}` ("Library"); `GT.h()` and the PDF/copy helpers substitute `config.shortName` at render time. Use `o.legacySociety` for the recognition society.
3. **These tools are not tax advice and must never read as if they were.** Every tool prints the disclaimer, the tax year, and the review date. Keep estimates labeled as estimates. When a rule is uncertain, say so in the tool copy and add an advisor question rather than guessing.
4. **Nothing a donor types may leave the browser.** No analytics, no fetches except the tool's own fonts, PDF library, and blank forms from the same host.
5. **Voice:** warm, plain-language, friendly park ranger — not a professor and not a bank. Say "gift in your will," not "bequest," on first use. No exclamation points.
6. **Historical claims about Theodore Roosevelt** are outside this repo's scope; the tools should not make any.

## Repo map

```
src/tax-data.js         all figures; taxYear, lastReviewed, reviewDue, lawNote
src/config.js           organization, URLs, features, fonts, brokerage, ND endowment
src/core.js             runtime: DOM helpers, form controls, tax helper functions, mounting
src/share.js            shareable state (URL params), pdf-lib loader, PDF builder, form filler, advisor summary, statement of intent
src/glossary.js         plain-language definitions; auto-wraps the first mention of each term in a tooltip (add terms here; some definitions cite figures — update them in the rollover)
src/styles.css          scoped styles, inlined into every bundle
src/tools/<name>.js     one tool each (16 today; see README table)
build.js                concatenates tax-data + config + core + share + tool -> dist/<name>.js and dist/all.js
gen-pages.js            writes index.html, support/tools/index.html, support/tools/<name>/{index,embed}.html
forms/                  fillable PDFs the tools pre-fill (IRS 8283, ND-1QEC, ND-1PG)
fonts/, vendor/         licensed webfonts; pdf-lib
test/run.js             math checks against hand-computed expectations
test/render.js          headless render of every tool (Playwright + Chromium), fails on console errors, screenshots to test/screenshots/
docs/                   EMBED.md, DRUPAL.md, TAX-REVIEW.md, FORKING.md
.github/workflows/      tax-review.yml opens a review issue Nov 1 and Jan 5
```

Build and test:

```bash
node build.js && node gen-pages.js
node test/run.js
node test/render.js        # needs Playwright; in Anthropic's sandbox: /home/claude/.npm-global/lib/node_modules/playwright
```

Commit `dist/` and the generated pages — GitHub Pages serves them as-is.

---

## The annual tax-year rollover (do this every November–January)

**Goal:** by mid-January the tools reflect the new tax year's federal figures, the ND figures, current forms, and any law changes; `taxYear`, `lastReviewed`, and `reviewDue` are bumped; tests pass; version bumped; the review issue closed.

### Step 1 — Establish what changed

Search, in this order, and read the primary source rather than a summary whenever possible:

1. **IRS inflation adjustments.** Search `"IRS provides tax inflation adjustments for tax year <YEAR>"` and `"Rev. Proc. 20xx-xx" <YEAR> inflation adjustments`. The Revenue Procedure (usually published in late October) is the source of truth for: standard deduction, additional deduction for 65+/blind, income-tax brackets for all four filing statuses, long-term capital-gains thresholds, AMT exemption, estate-tax basic exclusion, annual gift exclusion, and the QCD limit and one-time split-interest QCD limit (indexed since 2024).
2. **Legislation.** Search `charitable deduction changes <YEAR>` and `tax law changes <YEAR> individuals`. In particular confirm the status of every OBBBA provision the tools depend on: the non-itemizer charitable deduction ($1,000/$2,000), the 0.5%-of-AGI floor for itemizers, the 35% cap on deduction value for the top bracket, the SALT cap schedule (rises 1%/yr through 2029, reverts to $10,000 in 2030), and the $6,000 senior bonus deduction (**expires after 2028** — when it does, `seniorBonus.lastYear` already handles it, but confirm nothing extended it). Also confirm the estate exemption remains permanent and indexed.
3. **§7520 rate.** Search `section 7520 rate <Month> <YEAR>` or read https://www.irs.gov/businesses/small-businesses-self-employed/section-7520-interest-rates. Update `sec7520.rate` and `sec7520.month` to the latest month. (It changes monthly; the tool lets donors override it, so being a month stale is acceptable but not a year stale.)
4. **ACGA gift annuity rates.** Search `ACGA suggested maximum gift annuity rates <YEAR>` and read https://www.acga.org/current-gift-annuity-rates. Update `acga.singleLife` only if the schedule changed; always update `acga.reconfirmed`.
5. **North Dakota.** (a) Brackets: search `North Dakota income tax brackets <YEAR>` and confirm at tax.nd.gov; update `ndBrackets`. (b) Credit rules: search `North Dakota charitable giving tax credit <YEAR>` and read https://www.tax.nd.gov/income-tax-incentives/endowment-fund-contribution-tax-credit and `/planned-gift-contribution-tax-credit`; the legislature meets in odd years, so check for bill changes to N.D.C.C. § 57-38-01.21 (rate, $5,000 minimum, $10,000/$20,000 caps, the $10,000 entity cap and which entities qualify, carryforward, qualifying gift types). Also check whether the Tax Department has clarified if the endowment and planned-gift caps are separate when both are claimed in one year — `ndCredit.capsStackingUnresolved` should become `false` and the advisor question in `ndcredit.js` can then state the rule. (c) Forms: download the new year's **Schedule ND-1QEC** and **ND-1PG** from https://www.tax.nd.gov/forms into `forms/`, update `ndForms.*.formYear/file/source`, and **re-verify field names** (see Step 3).
6. **IRS Form 8283.** Check https://www.irs.gov/forms-pubs/about-form-8283 for a newer revision. If revised, download to `forms/irs-f8283-<rev>.pdf`, update `irsForms.f8283`, and re-verify field names.
7. **State charitable treatment** (`stateCharitable`, `stateCharitableAsOf`). Re-read the U.S. Charitable Gift Trust “State and Local Tax Treatment of Charitable Contributions” table (published each January) and each state DOR page cited in `sources`; update `benefit`, `rate`, `note`, and `retirementExempt` where a legislature changed the rule (watch for new non-itemizer deductions — several states have bills pending — and for repeal of the Louisiana/Rhode Island/West Virginia treatment). Update `stateCharitableAsOf`.
8. **State death taxes.** Search `states with estate tax <YEAR> exemption` and `states with inheritance tax <YEAR>`; states add, repeal, and index these annually. Update `stateEstateTax` and `stateInheritanceTax`.
9. **IRS Uniform Lifetime Table** changes rarely (last 2022) — check only if you see news of new mortality tables.
10. **Glossary definitions** in `src/glossary.js` quote a few figures (non-itemizer amounts, estate exemption, annual exclusion, SALT cap, RMD age). Update them to match tax-data.
11. **Anything else the tools assert.** Grep the tools for numbers that might drift even though they are not in tax-data (they should be — move them if found): `grep -nE "\\$[0-9]|[0-9]+%" src/tools/*.js | grep -v "money(\\|pct("`.

Record each source you used in `tax-data.sources`.

### Step 2 — Update `src/tax-data.js`

Work through `docs/TAX-REVIEW.md`'s checklist field by field. Then set:

- `taxYear` to the new year
- `lastReviewed` to today (ISO)
- `reviewDue` to December 1 of the new year
- `lawNote` to a one-sentence description of the governing law for the footer

Do not silently remove a field a tool reads; grep for its name first (`grep -rn "fieldName" src/`).

### Step 3 — Re-verify fillable-form field names

Whenever a PDF in `forms/` is replaced, its field names may have changed. List them:

```bash
python3 -c "import pypdf; r=pypdf.PdfReader('forms/<file>.pdf'); print(list((r.get_fields() or {}).keys()))"
# or: pdftk forms/<file>.pdf dump_data_fields
```

Compare with the mapping in `tax-data.js` (`ndForms.qec.fields`, `irsForms.f8283.fields`). The ND form uses plain names ("Line 2"); the IRS form uses XFA-style names ("Form8283[0].Page1[0]…f1_17[0]"). Render page one (`pdftoppm -r 70 -f 1 -l 1 -png`) to map columns to fields if the layout changed. Then fill a test copy and render it to confirm values land in the right boxes.

### Step 4 — Update test expectations

`test/run.js` contains hand-computed expectations tied to specific figures (for example, ND tax on $150,000 MFJ, the bunching scenario, RMD at 73). Recompute each with the new figures and update the expected values — do not loosen tolerances to make old numbers pass.

### Step 5 — Build, test, look

```bash
node build.js && node gen-pages.js && node test/run.js && node test/render.js
```

Open two tools (`support/tools/qcd/index.html` and `support/tools/ndcredit/index.html`) and confirm the footer shows the new tax year and review date and the numbers look sane. Exercise one PDF download (the ND-1QEC pre-fill is the most sensitive) and inspect the result.

### Step 6 — Ship and record

- Bump `version` in `package.json` (minor for a routine rollover, major if a law change altered tool logic).
- Commit with a message like `Tax year 2027 rollover: Rev. Proc. 2026-xx figures, ND-1QEC 2026 form, §7520 Jan 2027`.
- Close the "Tax-figure review" issue the workflow opened, noting what changed.
- If this session has access to the Library's Outline workspace, append a dated note to `TRPL / Planned Giving Web Tools — Research` and one Decision Log line tagged `[TRPL]`.

### What to watch for beyond numbers

- **A law change that alters logic, not just figures** (e.g., the non-itemizer deduction repealed, the AGI floor changed, QCDs extended to 401(k)s, a new state credit). Then the *helpers in `src/core.js`* and the *copy in the affected tools* must change too, and the change note in `lawNote` matters. Search the tools for the affected concept (`grep -rn "non-itemizer" src/`).
- **The senior bonus deduction sunset after 2028** and the **SALT cap reversion in 2030** are already parameterized; confirm they weren't extended.
- **Form year vs. tax year.** The ND schedule and the IRS 8283 revision lag: in January 2027 donors file *2026* returns, so the 2026 forms are the right ones to bundle until the 2027 forms exist. Bundle the form for the year donors are currently filing, and name it by year.
- **ACGA rates can change mid-year.** If they do, a mid-year update is fine; nothing else needs to move.
- **The Library's own facts** (EIN, address, URLs, DonorPerfect form, endowment fund status, gift-annuity licensing) are in `config.js`, not tax-data — a rollover is a good moment to ask whether any changed.

## Other common tasks

- **Add a tool:** create `src/tools/<name>.js` following an existing one (register with `GT.register`, keep state in `GT.state(name, defaults)`, call `GT.applyState`, set `this.getState`), add it to `ORDER` and `BLURB` in `gen-pages.js`, the README table, and `docs/DRUPAL.md`. Build, run both tests, check the screenshot.
- **Change copy:** tools are plain strings; keep the voice rules above; rebuild.
- **Change the org:** `src/config.js` only; see `docs/FORKING.md`.
- **A tool "looks wrong" on a host page:** styles are scoped under `.trpl-gt`; check whether the host's global CSS is leaking in (`all: revert` on a wrapper fixes most), and whether fonts loaded (`data-load-fonts`).

## Things not to do

- Don't add a build framework, bundler, or npm dependency. One `node build.js` with no install is the point.
- Don't add tracking, remote fonts from third parties, or calls to any API from the tools.
- Don't attempt actuarial deduction math for life-income gifts beyond the labeled approximation; real illustrations need PG Calc/Crescendo-class software.
- Don't fill the North Dakota add-back lines (10–16 of ND-1QEC) or Form 8283 Section B; those belong to the preparer.
- Don't remove the disclaimer, the tax-year stamp, or the advisor questions from any tool.
