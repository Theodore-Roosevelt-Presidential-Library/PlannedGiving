# Making these tools your own

This toolkit was built by the Theodore Roosevelt Presidential Library Foundation and released under the MIT license so any nonprofit can use it. Everything organization-specific lives in **one file, `src/config.js`**, plus a fonts folder and a stylesheet you may want to adjust. Budget an afternoon.

## 1. Fork and install

```bash
git clone https://github.com/<your-org>/PlannedGiving   # your fork
cd PlannedGiving
node build.js && node gen-pages.js                          # no npm install needed
npx serve .                                                 # preview at http://localhost:3000
```

Node 18+ is the only requirement. There are no dependencies to install; `vendor/pdf-lib.min.js` is committed.

## 2. Edit `src/config.js`

| Setting | What it drives |
|---|---|
| `name`, `shortName`, `ein`, `address`, `city`, `state`, `stateName`, `taxStatus` | Every legal-details card, bequest language, letters, PDFs, form pre-fills |
| `legacySociety` | Name of your planned-giving recognition society (used in copy, CTAs, the statement of intent) |
| `missionLine` | One sentence in thank-you letters |
| `communityFoundation` | Community foundation mentioned in the DAF tool (or `''`) |
| `contactEmail`, `contactName`, `contactPhone` | Contact lines, mailto fallbacks, advisor summaries |
| `offersGiftAnnuities` | Whether the life-income illustrator says you issue CGAs |
| `doubleTheDonationKey` | Employer-match search in the matching tool (leave blank if you have no subscription) |
| `brokerage` | DTC instructions in the broker letter and Form 8283 draft |
| `ndEndowment` | North Dakota only — see `features` |
| `features.ndCredit` | **Set to `false` outside North Dakota.** Removes the ND credit tool, the Navigator's ND question, the endowment-credit deadline entry, and the ND letter in the staff tool. (Other states have their own endowment/planned-gift credits — Montana, Iowa, Kentucky among them. Copy `src/tools/ndcredit.js` as a starting point.) |
| `features.staffTools` | Whether the staff acknowledgment tool appears in the gallery |
| `urls.*` | Your donate form, membership page, giving pages, and `toolBase` (where the tools live on your main site) and `tools` (where this repo is published) |
| `site` | Gallery title, tagline, nav links, repo URL, heading and lede |
| `fonts`, `fontFallbackCss` | Webfonts loaded from `/fonts` (see below) |

Then rebuild: `node build.js && node gen-pages.js`.

## 3. Copy

The tools refer to the organization as **"the Library"** in about a hundred places — a deliberate choice to keep the copy warm rather than templated. If you are a museum, foundation, or school, replace it once:

```bash
grep -rl "the Library" src/tools src/share.js | xargs sed -i 's/the Library’s/the Museum’s/g; s/the Library/the Museum/g; s/Library receives/Museum receives/g'
```

Review `src/tools/*.js` afterwards for a handful of "Library" uses without "the" (stat labels such as "Library receives if you give shares"). Also read through `src/tools/navigator.js` and `src/tools/acknowledgments.js`, which carry the most narrative copy.

## 4. Fonts and colors

`fonts/` holds the Library's licensed typefaces (Dharma Gothic E, Clearface, Frutiger). **You may not reuse those files without your own license.** Delete them and either:

- set `fonts: []` in the config and change the three font stacks at the top of `src/styles.css` to system or Google fonts, or
- drop your own `.woff2` files into `fonts/` and list them in `fonts`.

Colors are CSS custom properties at the top of `src/styles.css` (`--trpl-*`). Change the palette block; the `trpl-` prefix on class names is just a namespace and can stay. The PDF header color is set in `src/share.js` (`orange`).

## 5. Fixed-figure content to check

- `src/tax-data.js` holds federal figures (keep) plus **state-specific** blocks: `ndCredit`, `ndBrackets`, `ndForms`, and the `stateEstateTax` / `stateInheritanceTax` lists (keep — they cover all states). If your state has its own credit, add a block and a tool.
- `forms/` holds the fillable IRS Form 8283 (keep) and North Dakota schedules (delete if `ndCredit` is off).
- `src/tools/deadlines.js` mentions no state specifics beyond the endowment entry.
- `docs/DRUPAL.md` describes the Library's CMS rollout; adapt to yours.

## 6. Publish

GitHub Pages, from the `main` branch root. Put your custom domain in `CNAME`, set `urls.tools` to match, and enable "Enforce HTTPS". The annual tax-review workflow in `.github/workflows/tax-review.yml` needs no changes.

## 7. Please keep

The disclaimer that the organization is not a tax, legal, or financial advisor; the tax-year and review-date stamp in every footer; and the annual review process in `docs/TAX-REVIEW.md` and `CLAUDE.md`. They are what makes it responsible to put calculators in front of donors.
