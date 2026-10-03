---
name: MerchantBoard
description: An open storefront cockpit with calculated sample sales and brushed-metal data bars.
colors:
  accent: "#2456f5"
  accent-dark: "#86a7ff"
  tint: "#dce7ff"
  tint-dark: "#243b64"
  bg: "#eaeff4"
  bg-dark: "#101c31"
  ink: "#111d35"
  ink-dark: "#eef3ff"
  muted: "#52617a"
  muted-dark: "#a6b6d0"
  line: "#ccd5e2"
  line-dark: "#32425d"
  surface: "#f5f7fa"
  surface-dark: "#17253d"
  button-text: "#fff"
  button-text-dark: "#111d35"
  metal-silver: "#cbd2da"
  metal-cobalt: "#0640ff"
  hoodie-contrast-ground: "#dce3eb"
typography:
  display:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "clamp(44px, 4.15vw, 64px)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-.04em"
  revenue:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "64px"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-.04em"
  headline:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "34px"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-.035em"
  title:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    letterSpacing: "-.035em"
  body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "14px"
    fontWeight: 400
  control:
    fontFamily: "Manrope, sans-serif"
    fontSize: "14px"
    fontWeight: 600
  label:
    fontFamily: "Manrope, sans-serif"
    fontSize: "13px"
    lineHeight: 1.35
  chart-title:
    fontFamily: "Manrope, sans-serif"
    fontSize: "16px"
    fontWeight: 800
    lineHeight: 1.5
    letterSpacing: "-.015em"
rounded:
  control: "7px"
  toast: "9px"
  dialog: "12px"
  status: "20px"
  image-ground: "5px"
spacing:
  compact: "8px"
  control-gap: "9px"
  small: "12px"
  medium: "16px"
  large: "24px"
  dialog: "28px"
  gutter: "clamp(24px, 3.65vw, 72px)"
  gutter-mobile: "24px"
  gutter-narrow: "18px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.button-text}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "10px 16px"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bg}"
  button-secondary:
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "10px 16px"
  button-text:
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "7px 9px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "10px 13px"
  status-paid:
    backgroundColor: "{colors.tint}"
    textColor: "{colors.accent}"
    typography: "{typography.label}"
    rounded: "{rounded.status}"
    padding: "5px 12px"
  status-pending:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.status}"
    padding: "5px 12px"
  status-refunded:
    backgroundColor: "{colors.line}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.status}"
    padding: "5px 12px"
  dialog:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.dialog}"
    padding: "28px"
    width: "520px"
---

# Design System: MerchantBoard

## Overview

**Creative North Star: "Storefront cockpit"**

The Storefront cockpit uses a cool silver field, deep navy type and cobalt actions to make a sample store feel precise and tangible. An open sales overview leads into a ruled order ledger; visual density comes from alignment and typography, while the dimensional weekly chart provides the focal material.

Space Grotesk gives headings and financial figures their geometric character. Manrope keeps controls and transaction details compact. Light and dark themes share the same hierarchy, with a quieter surface treatment around the live brushed-metal bars. The chart and ledger express the same editable order data.

**Key Characteristics:**

- Open overview and ledger, separated by thin rules.
- One cobalt family for actions, chart marks and paid status.
- Brushed silver data bars with a cobalt fourth bar and a fading reflection.
- Geometric display type, compact utility text and tabular financial figures.
- An equivalent dark theme, mobile order summaries and optional mobile 3D.

This is a scan of `dev.css`, `MerchantBoard.jsx`, `Bars.jsx` and the data relationships in `orders.js`, reconciled with the approved surface contract and `PRODUCT.md`. The frontmatter records implemented primitives; the sidecar holds motion, breakpoint, depth and component-preview extensions. It records the current implementation and does not constitute a shipping verdict.

## Colors

The light palette is cool silver with navy text; dark mode deepens the field and lifts the cobalt accent for legibility.

### Primary

- **Cobalt action** (`accent`): primary buttons, active navigation underline, focus outlines, daily chart marks and paid-status dots.
- **Lifted cobalt** (`accent-dark`): the equivalent UI accent in dark mode.
- **Cobalt wash** (`tint`, `tint-dark`): restrained hover and paid-status grounds.
- **Physical cobalt** (`metal-cobalt`): the fourth weekly bar uses its own Three.js material, separate from the theme-aware UI accent.

### Neutral

- **Silver ground / midnight ground** (`bg`, `bg-dark`): the document and body field, including the viewport below short content.
- **Navy ink / pale ink** (`ink`, `ink-dark`): main type and inverse-action hover.
- **Slate detail** (`muted`, `muted-dark`): supporting sentences, dates, labels and chart axes.
- **Cool rules** (`line`, `line-dark`): table dividers, field outlines, metric separators and the refunded-status ground.
- **Raised input ground** (`surface`, `surface-dark`): fields and the mobile chart-load control.
- **Action lettering** (`button-text`, `button-text-dark`): the foreground paired with the active theme's accent.
- **Brushed silver** (`metal-silver`): the four neutral physical chart bars.
- **Hoodie contrast ground** (`hoodie-contrast-ground`): a small neutral backing behind the navy hoodie cutout in dark mode.

The CSS custom properties use the unqualified semantic names; `data-theme="dark"` replaces their values. The frontmatter's `-dark` entries record those replacements, not extra simultaneous accents. The 3D materials keep their base colors across themes and change renderer exposure.

**The Cobalt Carries Action Rule.** Use the theme accent for primary actions, selected navigation, paid status and plotted sales. The fourth 3D bar is a fixed visual accent, not a highest-value indicator.

## Typography

**Display Font:** Space Grotesk, sans-serif fallback.  
**Body Font:** Manrope, sans-serif fallback.

Both are self-hosted variable WOFF2 files with `font-display: swap`: `space-grotesk.woff2` (300–700) and `manrope.woff2` (200–800). The broad geometric display face carries headings, brand and key monetary values; the body face carries interface language.

### Hierarchy

- **Display:** the introductory headline uses the frontmatter display role. At widths up to 1200px it becomes 46px, up to 900px 38px, and up to 800px `clamp(32px, 6.9vw, 54px)`; mobile permits wrapping.
- **Revenue:** the largest numeric role drops to 58px at 1200px and 56px at 800px.
- **Headline:** the ledger heading becomes 30px at 1200px. Standalone Orders/Products headings are 48px above that range, 30px through the intermediate overrides, and 38px at 800px and below.
- **Title:** product names and empty-state headings use the 24px display role. Dialog titles use 28px, then 26px on mobile.
- **Body / controls:** 14px for table content, fields and buttons; the introductory sentence uses `clamp(20px, 1.73vw, 26px)` and a 1.4 line height, with smaller responsive overrides.
- **Labels:** 13px status and metric labels; desktop table headings and weekly dates use 12px. Some compact responsive labels and footer details use 10–11px; these are local density decisions, not a new body-text standard.
- **Chart title:** the heavier Manrope role distinguishes the chart caption from display headings.

**The Numbers Stay Aligned Rule.** Use tabular numerals for revenue, metrics, monetary table cells, weekly values and product sales; keep monetary ledger values right-aligned.

## Layout

Desktop uses a slim header (57px), then two equal overview columns with a fluid gap (6.1vw), followed by a full-width ledger. The overview has a 1740px maximum width and a 569px minimum height. Its padding uses the gutter token horizontally and 25px vertically. Above 1750px, the overview gap is 100px and the ledger is capped at 1596px. The gap reduces to 42px at 1200px and 24px at 900px.

The ledger is separated by a top rule, with a heading and aligned search, status selector and Add order action. Desktop rows are 50px tall. Four rows appear in Overview and ten in Orders. The later desktop overrides set the product heading's inset to 98px, order-column width to 11.8%, product width to 35.5%, and final action column to 160px. These are ledger-specific alignment choices.

At 900px the ledger heading and controls can wrap. At 800px and below, the header becomes two rows, navigation occupies its second row, the overview stacks, and gutters become 24px. Search occupies its own row above status and Add order. Every order becomes a two-column summary with order ID, product, total, date, status and an edit action; the desktop header row is hidden. At 360px and below, gutters become 18px and the brand reduces to 18px. The body supports widths down to 320px.

The desktop chart stage is 390px tall after the final cascade; an earlier large-screen 425px rule is overridden. The mobile stage is 320px. Desktop weekly labels rise into the stage with a -35px top margin and stagger downward in 14px steps; mobile labels form a level five-column row. The canvas extends 80px below the stage, fading its last 70px to transparent, so reflections can end naturally. The final overflow rule is visible at every width.

The spacing vocabulary is compact: 8–12px gaps within controls, 16px paired form spacing, 24px between functional groups and 28px dialog padding. Mobile dialogs use 22px padding. The document body has a minimum height of one viewport.

## Elevation & Depth

The surrounding interface uses tonal fields and thin rules. Cast shadows are reserved for dialogs, notifications and dimensional chart fallback bars; the main overview and ledger have no enclosing card shadows. The live chart uses actual physical materials, soft contact shadows and a reflected floor.

### Shadow Vocabulary

- **Light overlay:** `0 18px 70px #091a3638` for dialogs and toasts.
- **Dark overlay:** `0 18px 70px #02081080` for the same roles in dark mode.
- **Fallback bar:** `8px 10px 16px #111d3521`, paired with a slight skew, gives the CSS data bars depth while WebGL loads or is unavailable.
- **Dialog backdrop:** translucent navy (`#08112570`) with a 4px blur.

The 3D bars use rounded box geometry (1.25 × 1 × 1.5 before data scaling, 0.04 edge radius) spaced 1.9 units apart. Silver uses metalness .94 and roughness .34; cobalt uses metalness .7 and roughness .24. A generated diagonal brushed-metal texture supplies silver color, bump and roughness maps and cobalt bump. A studio environment, key/fill lights and the fading reflector establish the material; renderer exposure is 1.12 in light mode and .9 in dark mode.

**The Material Belongs to Data Rule.** Concentrate physical depth in the data bars and their grounded reflections. Keep the surrounding overview and ledger open and ruled.

## Shapes

Controls and inputs have modest softened corners; status labels use capsules; dialogs and toasts use their own slightly larger radii. One-pixel borders and rules give structure without heavy enclosures. Status dots are circular (8px desktop, 6px mobile). Photographic product cutouts retain their silhouettes; only the dark-theme hoodie gains a small rounded contrast ground. The chart's slight physical edge rounding is separate from the CSS radius scale.

## Components

### Buttons

Primary actions are filled cobalt with the theme's action lettering. On hover they become ink with the page-ground foreground. Secondary buttons are transparent with a rule-colored border; hover introduces a tint and muted border. Text actions remove the visible resting border. Shared controls have a 42px minimum height, 9px icon gap and 180ms background/color/border transitions. Main mobile ledger controls become 44px tall. The focus-visible treatment is a 3px accent outline with a 4px offset. Disabled buttons use .38 opacity and a not-allowed cursor.

Icons are rendered SVGs from Phosphor, with explicit accessible names on icon-only controls. Small pagination and chart controls have local sizes; they do not redefine the general control height.

### Chips

Paid uses the accent on a tinted ground and a solid accent dot. Pending uses the normal foreground, a transparent ground and an outlined dot. Refunded uses ink on the rule-colored ground with a solid dot. Every state includes its text label, so meaning does not depend on color alone.

### Cards / Containers

The dashboard regions remain open. The native modal is the principal enclosed container: 520px width, a viewport-constrained maximum width and height, the page-ground fill, dialog radius and overlay shadow. The backdrop uses the depth treatment above. Product performance remains a ruled list with product imagery and a thin proportional sales track.

### Inputs / Fields

Inputs use the raised surface, a one-pixel rule border and the control radius. Their focus border and caret use the accent. Search reserves a 43px left inset for its magnifier; its desktop width is 264px, then 220px at 1200px and full available width at smaller breakpoints. Selects reserve right-side space for the native disclosure indicator. The compact month selector is borderless and transparent. Form labels remain visible, with 8px field gaps and 16px paired-column gaps; validation errors appear inline and use alert semantics.

### Navigation

Overview, Orders and Products are borderless text controls with a 2px active underline. Hover changes text to accent. Current navigation exposes `aria-current="page"`. Navigation remains visible as a second header row on mobile. A keyboard skip link reaches the ledger. The theme button persists the selected theme locally.

### Sales charts

Daily sales render as an SVG line with accent point markers and a translucent area fill. The SVG has an accessible chart label and daily-value titles. Weekly totals remain ordinary text alongside the decorative, aria-hidden 3D canvas.

Desktop widths of at least 801px load the lazy 3D module after 600ms. Mobile starts with the CSS bars and an explicit **Explore in 3D** action; this width check occurs at initial mount. WebGL failure or context loss returns to the CSS view and displays an availability note. The fallback uses real weekly values, silver gradients, a cobalt fourth bar and a 5-degree skew.

Bars settle to changed totals with a .14 interpolation factor per eligible frame and a .004 settling threshold. The optional idle turn is a sine motion with .035-radian amplitude and .012 phase increments. Rotate advances the requested angle by 15 degrees modulo 60. Pause suppresses the idle turn; edits still settle. Reduced motion removes idle movement and snaps updated heights. Rendering is limited to roughly 30fps, skips offscreen/background-tab rendering and caps device pixel ratio at 1.5. CSS transitions and smooth scrolling are disabled for reduced motion.

The geometric bars normalize to the current largest week; the minimum visible height is .02 world units, while text totals report the actual value. The fourth bar stays cobalt independent of the values. Net sales, average paid order, daily sales, weekly sales and product performance derive from paid orders; the overall order count includes all statuses.

### Product imagery and feedback

The shipping cutouts are `hoodie.webp`, `sneaker.webp` and `tote.webp`. Desktop ledger images fit 56 × 44px; mobile uses 42 × 44px. Product-performance images use 100px squares on desktop and 60 × 72px on mobile. The material texture is `brushed-metal.webp`. Source plates and generation records live under `assets/plates/`; preparation scripts are `.impeccable/prepare-assets.mjs` and `.impeccable/prepare-rebuild-assets.mjs`. The final sneaker rule removes the earlier mirroring and contrast filter.

Toast feedback uses inverse ink/ground colors and the overlay shadow. Ordinary notices clear after seven seconds; an available undo remains accessible until dismissed or used. Empty results explain either missing month data or active filters and supply an appropriate action. Data dialogs disclose local storage and support CSV export, JSON backup/import and sample restoration.

## Do's and Don'ts

### Do:

- **Do** derive every sales mark, weekly height and product total from the current sample orders; paid orders drive sales, while the order count includes every status.
- **Do** preserve the silver, navy and cobalt relationship in both themes and use the self-hosted Space Grotesk and Manrope assets.
- **Do** retain the compact desktop ledger and reflow each order into a two-column summary at the mobile breakpoint.
- **Do** keep visible sample-data and device-only-storage disclosures beside the working experience.
- **Do** keep the CSS bar view, readable weekly totals, pause control, reduced-motion behavior and mobile 3D opt-in available.
- **Do** retain photographic product cutouts and the generated brushed-metal texture with their recorded provenance.

### Don't:

- **Don't** use the cobalt fourth bar to imply a winning week or a business status that the data does not establish.
- **Don't** replace calculated chart shapes with the approved mockup's illustrative values.
- **Don't** extend modal shadows to every dashboard region or enclose the open ledger in a repeated card grid.
- **Don't** require WebGL or motion to read sales values or edit orders.
- **Don't** turn a pending material-review finding into a reusable lighting rule.

Not canonized as a design rule: studio panel intensities remain implementation details. The final reviewer scored all four listed fixes resolved, including silver side/top separation. The failed automatic responsive comparison remains raw evidence with a separate manual assessment; it is not an automatic pass. This document records the implemented system rather than extending the scope of that verdict.
