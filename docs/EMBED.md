# Embedding the tools

## Basic

Put a placeholder where the tool should appear, then load the tool's script. The script finds the placeholder by its `data-trpl-tool` value.

```html
<div data-trpl-tool="qcd"></div>
<script src="https://givingtools.labs.trlibrary.com/dist/qcd.js" async></script>
```

If no placeholder exists, the tool renders itself immediately after the `<script>` tag.

Several tools on one page: either load each tool's script (the shared runtime is loaded once) or load `dist/all.js` and place as many placeholders as you like.

## Options (data attributes on the placeholder)

| Attribute | Effect |
|---|---|
| `data-theme="dark"` | Dark palette for dark page sections. |
| `data-accent="#1B4532"` | Override the accent color. |
| `data-hide-header="true"` | Hide the tool's own title and intro (when the page already has a heading). |
| `data-compact="true"` | Tighter padding. |
| `data-intent-form-url="https://…"` | DonorPerfect (or any) online form for the letter of intent. Used by the **intent** tool (embedded in an iframe) and by every "Tell us about your gift" button. Leave unset for a pre-filled email fallback. |
| `data-form-height="1100"` | Iframe height for the intent form. |
| `data-embed-form="false"` | Force the email fallback even when a form URL is set. |
| `data-contact-email`, `data-contact-name`, `data-contact-phone` | Override the contact shown in the tool. |
| `data-nd-fund-name="…"` / `data-nd-confirmed="true"` | Name of the Foundation's qualified endowment fund for the ND credit tool, and whether its qualified status has been confirmed. Until confirmed, the tool tells donors to check with the giving team. |
| `data-offers-gift-annuities="true"` | Only once the Foundation holds an ND Certificate of Exemption; removes the "not currently offered" notice in the life-income illustrator. |

## Fonts and styling

Tools inherit the host page's body font. To use brand display type for headings, set CSS variables on the wrapper:

```css
[data-trpl-tool] .trpl-gt {
  --trpl-font-display: "Dharma Gothic E", "Oswald", "Arial Narrow", sans-serif;
  --trpl-font: "ITC Clearface", "Source Serif 4", Georgia, serif;
}
```

All styles are scoped under `.trpl-gt` and prefixed `trpl-`, so nothing leaks into the host page and the host's global styles rarely leak in. If a host stylesheet does interfere (very aggressive `input` or `button` resets), wrap the placeholder in an element with `all: revert`.

## Iframe alternative

For platforms that block third-party scripts:

```html
<iframe src="https://givingtools.labs.trlibrary.com/tools/qcd-embed.html"
        title="IRA giving calculator" style="width:100%;height:1400px;border:0" loading="lazy"></iframe>
```

## Squarespace / Drupal / WordPress notes

- **Drupal (trlibrary.com):** add a "Full HTML" block or a custom block with the two lines above. Make sure the text format allows `<script>` — or add the script via the theme's library and keep only the `div` in the block.
- **WordPress:** a Custom HTML block works; some security plugins strip `<script>` from posts but not from widgets.
- **Squarespace:** a Code block with "Display Source" off.

## Navigator at the top of /support

```html
<div data-trpl-tool="navigator" data-hide-header="false"></div>
<script src="https://givingtools.labs.trlibrary.com/dist/navigator.js" async></script>
```

The Navigator links to trlibrary.com pages defined in `src/config.js` (`urls.*`). If a page URL changes, update the config and rebuild.

## Versioning and caching

Files are served from GitHub Pages with its default cache headers. A rebuild is live within a few minutes. For a pinned version, tag a release and reference the tagged file via a CDN such as `https://cdn.jsdelivr.net/gh/Theodore-Roosevelt-Presidential-Library/PlannedGiving@v1.0.0/dist/qcd.js` — but note that pinning also freezes the tax figures.
