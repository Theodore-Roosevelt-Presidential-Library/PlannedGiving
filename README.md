# TRPL Giving Tools

Self-contained JavaScript embeds for planned giving and tax-smart giving, built by and for the **Theodore Roosevelt Presidential Library Foundation**. Live at **https://givingtools.labs.trlibrary.com** (GitHub Pages).

Every tool is one `<script>` tag. No framework, no build step on the host page, no vendor subscription, no donor data leaves the page.

## The tools

| Tool | Embed file | What it does |
|---|---|---|
| Giving Navigator | `dist/navigator.js` | Six questions → ranked giving options with reasons, links, and advisor questions. Built for the top of `/support`. |
| ND tax credit calculator | `dist/ndcredit.js` | North Dakota's 40% credit for endowment and planned gifts (N.D.C.C. § 57-38-01.21): credit, usable amount, carryforward, federal interplay, net cost. |
| IRA / QCD calculator | `dist/qcd.js` | Eligibility, RMD estimate, QCD vs. withdraw-and-give comparison. |
| Stock gift calculator | `dist/stock.js` | Give shares vs. sell-then-give: gains avoided, deduction value, net cost. |
| Bunching comparison | `dist/bunching.js` | Every-year giving vs. bunching 2–3 years, with the 2026 ½%-of-AGI floor. |
| DAF grant guide | `dist/daf.js` | Sponsor-specific steps, copyable grant recommendation, DAF-or-direct helper. |
| Bequest language builder | `dist/bequest.js` | Sample will/trust language with the Foundation's legal details. |
| Beneficiary designation guide | `dist/beneficiary.js` | Account-by-account instructions; which assets to leave to charity. |
| Letter of intent | `dist/intent.js` | "I've included the Library" — embeds a DonorPerfect form, or a pre-filled email. |
| Estate tax estimator | `dist/estate.js` | Federal exposure, effect of a charitable bequest, state death-tax flags. |
| Life-income illustrator | `dist/lifeincome.js` | Educational CGA / CRUT / CRAT illustrations (ACGA rates, §7520 rate). |
| Matching gift impact | `dist/matching.js` | Gift × match ratio, how to claim. |
| Monthly giving calculator | `dist/monthly.js` | Monthly → yearly / multi-year impact, links to the monthly form. |
| Year-end deadlines | `dist/deadlines.js` | When each gift type counts, start-by dates, what to do. |
| Gift acknowledgment letters (staff) | `dist/acknowledgments.js` | IRS-compliant acknowledgment letters by gift type; ND endowment qualification letter. |

Every donor-facing tool also offers **Download advisor summary (PDF)**, **Print**, and **Copy link to this scenario** (inputs encoded in the URL, e.g. `?qcd.age=75&qcd.gift=20000`). Paperwork generators: QCD custodian letter (qcd), broker transfer letter and IRS Form 8283 draft (stock), pre-filled Schedule ND-1QEC (ndcredit), signable Heritage Society statement of intent (bequest, beneficiary, intent). All PDFs are built client-side with pdf-lib; nothing is uploaded.

`dist/all.js` bundles everything for pages that use several tools.

## Embed

```html
<div data-trpl-tool="navigator"></div>
<script src="https://givingtools.labs.trlibrary.com/dist/navigator.js" async></script>
```

Options are data attributes on the `div` — see [docs/EMBED.md](docs/EMBED.md).

## URL structure (mirrors trlibrary.com)

Tools cross-link to one another (the Navigator points to calculators, the ND credit tool points to the life-income illustrator, and so on). Those links are built from one base URL, `urls.toolBase` in `src/config.js`, which defaults to **`https://www.trlibrary.com/support/tools/`**. Each tool lives at `<toolBase><name>`:

| Tool | trlibrary.com page | Pages mirror |
|---|---|---|
| navigator | `/support/tools/navigator` | `support/tools/navigator/` |
| deadlines | `/support/tools/deadlines` | `support/tools/deadlines/` |
| acknowledgments (staff) | not published on trlibrary.com | `support/tools/acknowledgments/` |
| ndcredit | `/support/tools/ndcredit` | `support/tools/ndcredit/` |
| qcd, stock, bunching, daf, bequest, beneficiary, intent, estate, lifeincome, matching, monthly | `/support/tools/<name>` | `support/tools/<name>/` |

This repo publishes the same structure, so `givingtools.labs.trlibrary.com/support/tools/qcd` and `www.trlibrary.com/support/tools/qcd` are the same page on two hosts. Pages on this site pass `data-tool-base="../"` so links stay local; embeds on trlibrary.com use the config default and never leave the main site. Each tool also has a chrome-free page for iframes at `support/tools/<name>/embed`. See [docs/DRUPAL.md](docs/DRUPAL.md) for the Drupal recipe.

## Repo layout

```
src/tax-data.js     ← every tax figure, one file, stamped with taxYear + lastReviewed
src/config.js       ← EIN, address, URLs, contact, brand palette, offersGiftAnnuities
src/core.js         ← shared runtime (DOM helpers, form controls, tax helpers, mounting)
src/styles.css      ← scoped styles, inlined into every bundle at build time
src/tools/*.js      ← one file per tool
build.js            ← concatenates → dist/<tool>.js (+ all.js, manifest.json)
gen-pages.js        ← writes index.html and support/tools/<name>/{index,embed}.html
test/render.js      ← headless render of every tool, fails on console errors, screenshots
test/run.js         ← unit checks on the calculator math
docs/               ← EMBED.md, DRUPAL.md, TAX-REVIEW.md, FORKING.md
CLAUDE.md           ← maintainer playbook: annual tax-year rollover, repo rules
fonts/              ← the Library's licensed webfonts (Dharma Gothic E, Clearface, Frutiger)
forms/              ← fillable ND-1QEC, ND-1PG and IRS Form 8283 that the tools pre-fill in the browser
vendor/pdf-lib.min.js ← MIT-licensed PDF library, loaded on demand only when a donor asks for the worksheet
```

## Develop

```bash
node build.js && node gen-pages.js     # rebuild bundles and pages
node test/run.js                       # math checks
node test/render.js                    # headless render (needs Playwright + Chromium)
npx serve .                            # preview locally
```

Commit the `dist/` output — GitHub Pages serves it directly. Pages is configured to serve from the `main` branch root; `CNAME` holds the custom domain.

## Keeping the tax figures current

All figures live in `src/tax-data.js`. The IRS publishes next year's inflation adjustments each October/November; the ACGA reviews annuity rates as needed; the §7520 rate changes monthly. A GitHub Action opens a review issue on **November 1** and **January 5** every year. Follow [docs/TAX-REVIEW.md](docs/TAX-REVIEW.md). Every tool prints the tax year and review date in its footer so a stale figure is visible to donors and staff alike.

## Principles

- **Not advice.** Every tool says so, plainly, and ends with questions to bring to the donor's own advisor.
- **Bequests first.** More than nine in ten realized planned gifts are bequests and beneficiary designations; those tools get the most care.
- **National audience.** Federal rules first; state estate and inheritance taxes flagged by state; no assumption the donor lives in North Dakota.
- **Nothing tracked.** The tools make no network requests beyond loading their own fonts and, on demand, the PDF library and blank state form from the same host. Pre-filled forms are generated in the browser; nothing a donor types is sent anywhere. Analytics belong to the host page.
- **Accessible.** Real form controls, labels, 44px targets, keyboard-navigable, works at phone width, respects the host's fonts.

## Forking

Any nonprofit can use this. Everything organization-specific is in `src/config.js` (plus your own fonts and palette); `features.ndCredit: false` removes the North Dakota-specific pieces. Step-by-step in [docs/FORKING.md](docs/FORKING.md). `CLAUDE.md` is the playbook for the annual tax-year rollover, written for an AI assistant or a human maintainer.

## License

MIT. The Library's licensed webfonts in `fonts/` are **not** covered by the license — replace them in a fork.
