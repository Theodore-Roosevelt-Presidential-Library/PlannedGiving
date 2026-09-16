# Putting the tools on trlibrary.com

The tools are designed to live on the main site at **`/support/tools/<name>`**, one Drupal page per tool. Every cross-link between tools is built from that base, so once the pages exist the whole set links to itself on trlibrary.com and never sends a visitor to the GitHub Pages site (which remains the source, the gallery, and the iframe fallback).

## Pages to create

| Path alias | Title | Embed |
|---|---|---|
| `/support/tools/navigator` | Find the right way to give | `navigator` |
| `/support/tools/ndcredit` | North Dakota's 40% tax credit | `ndcredit` |
| `/support/tools/qcd` | Give from your IRA | `qcd` |
| `/support/tools/stock` | Give stock instead of cash | `stock` |
| `/support/tools/bunching` | Should you bunch your gifts? | `bunching` |
| `/support/tools/daf` | Give from your donor-advised fund | `daf` |
| `/support/tools/bequest` | Write your gift into your will | `bequest` |
| `/support/tools/beneficiary` | Name the Library as a beneficiary | `beneficiary` |
| `/support/tools/intent` | Tell us about your legacy gift | `intent` |
| `/support/tools/estate` | Will your estate owe tax? | `estate` |
| `/support/tools/lifeincome` | Gifts that pay you income | `lifeincome` |
| `/support/tools/matching` | Double your gift with an employer match | `matching` |
| `/support/tools/monthly` | Small monthly gifts, big yearly impact | `monthly` |

Optionally a `/support/tools` landing page listing them (the Pages gallery at `support/tools/index.html` is a ready-made model).

## Each page's body (Full HTML text format)

```html
<div data-trpl-tool="qcd" data-hide-header="true"></div>
<script src="https://givingtools.labs.trlibrary.com/dist/qcd.js" async></script>
```

Use `data-hide-header="true"` when the Drupal page already carries the H1 and intro; leave it off to let the tool render its own title. Because the site already loads Dharma Gothic E, Clearface, and Frutiger, the tool's own font loading is redundant but harmless; add `data-load-fonts="false"` to skip it.

If the text format strips `<script>`, attach the script through the theme's library system (or a site-wide "Giving Tools" library that loads `dist/all.js` once) and keep only the `<div>` in the body. `all.js` is ~110 KB and renders any tool whose placeholder it finds.

## Per-page settings worth passing

- Intent form: `data-intent-form-url="https://…donorperfect…"` on the **intent** page (or set it once in `src/config.js` and rebuild).
- Matching: `data-dtd-key="…"` on the **matching** page to include the Double the Donation search already used on `/matching-gifts`.
- ND credit: `data-nd-fund-name="…" data-nd-confirmed="true"` once the qualified endowment fund is confirmed.

## The Support page

At the top of `/support`, the Navigator:

```html
<div data-trpl-tool="navigator"></div>
<script src="https://givingtools.labs.trlibrary.com/dist/navigator.js" async></script>
```

Its results link to the `/support/tools/<name>` pages above and to the existing giving pages (`/support/give-through-your-ira`, `/support/donor-advised-fund`, `/support/give-stocks-and-securities`, `/heritage-society`, `/matching-gifts`, `/membership`). If any of those aliases change, update `urls.*` in `src/config.js` and rebuild.

## Retire trgiving.org

Remove the "Gift Planning → https://trgiving.org/" link from `/support` (the domain no longer resolves) and point the Heritage Society page at `/support/tools/bequest`, `/support/tools/beneficiary`, and `/support/tools/intent`.

## Caching

GitHub Pages serves `dist/*.js` with short cache headers; a rebuild is live within minutes and Drupal pages pick it up on the next load. To pin a version for a release, reference a tag through jsDelivr (see EMBED.md) — remembering that also pins the tax figures.
