# MerchantBoard

Your store, in view. A sales-dashboard portfolio concept by Thomas Ginting, with a dimensional live chart and editable sample orders.

[Live website](https://jokojoyo.github.io/merchantboard/)

## Try it

- Explore 104 illustrative orders for September 2026.
- Add, edit or delete orders, change their date and status, and undo deletion or data replacement.
- Watch net sales, daily sales, weekly 3D bars and product totals recalculate.
- Search by product or order number and filter by status; browse the complete ledger with pagination.
- Export a month's orders as CSV or back up all orders as JSON. Import a validated JSON backup or restore the original sample store.
- Switch between light and dark themes. Pause or rotate the chart; mobile visitors can opt into 3D.

Orders are saved in localStorage in the current browser. There is no account, server, real store connection, payment service or transmission of order data. Export a backup before clearing browser data or switching devices. Browser storage may be unavailable or full; the app reports this and keeps the current session usable.

## How the numbers work

All money is stored as integer USD cents. Net sales include only orders whose current status is Paid. Pending and fully Refunded orders contribute zero. Average paid order is net sales divided by the number of paid orders. Order count includes all statuses. Weekly buckets are days 1–7, 8–14, 15–21, 22–28 and the remaining days of the selected month. No tax, fees, shipping, partial refunds or currency conversion is modeled.

The initial dataset has 104 orders, including 102 paid orders totaling $24,680. Average paid order is $241.96. Every value is illustrative sample data.

## Development

Requires Node.js 22+ and npm.

```sh
npm install
npm run dev
npm run build
npm test
```

React, Vite, native CSS, Three.js and Phosphor icons. Fonts are self-hosted Space Grotesk and Manrope. Generated product thumbnails have prompt provenance in the neighboring `.webp.json` files.

The repository keeps editable source and compiled files at its root for simple free GitHub Pages hosting. `dev.html` is the Vite input. `index.html`, `app.js`, `Bars-bundle.js` and `style.css` are the compiled output. After a build, commit the updated output together with source changes. Enable Pages from `main` / root.

## Accessibility and performance

Semantic controls, visible keyboard focus, native focus-trapped dialogs, labeled sample data, reduced-motion support and a static chart fallback. The 3D scene caps pixel ratio, renders at up to 30 fps, and stops rendering while offscreen or in a background tab. On narrow screens, 3D is loaded only on request.

See `THIRD-PARTY-NOTICES.md` for dependency and font licenses.
