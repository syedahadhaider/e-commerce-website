# FORM / AFTER

A fictional premium streetwear storefront with an editorial black-and-white design, orange accents, responsive layouts, and eight sample products.

## What the website includes

- Product browsing with categories, text search, price filters, and sorting.
- Product details, material and care information, and a size guide.
- Size selection and an editable shopping bag, saved in this browser between visits.
- Quantity controls, removal, and a maximum of five items per product/size combination.
- A two-step demo checkout: delivery information, then order review and simulated payment.
- Shipping calculations: standard US shipping is $8, free for orders of $180 or more; express shipping is $18.
- Order confirmation, empty states, keyboard-accessible controls, and mobile navigation.

**This is a demonstration store.** It does not process real payments, store orders in a database, send emails, or arrange shipping. Checkout contact/address information stays in page memory and is lost on refresh. Bag contents are stored locally in the browser. Taxes are a sample $0.00.

## Requirements

- Node.js 22.13.0 or newer, with npm. This copy was verified with Node.js 24.15.0 and npm 11.12.1.
- A modern browser such as Chrome, Edge, or Firefox.
- Internet access when installing dependencies.

The website does not require payment credentials, a database, or an `.env` file for the local demo. Keep the included `.openai/hosting.json` file: the build configuration imports it.

## Run the website locally — step by step

### 1. Open the project folder in PowerShell

Open Windows Terminal or PowerShell and run:

```powershell
Set-Location -LiteralPath 'C:\Users\pc\Desktop\Projects\ChatGPT\form-after'
```

Run all following commands from this folder, which contains `package.json`.

### 2. Check Node.js and npm

```powershell
node --version
npm --version
```

If either command is missing, install a supported Node.js version from https://nodejs.org/ and reopen the terminal.

### 3. Install dependencies if needed

The moved folder already includes `node_modules`, so you can skip this step on the current computer if dependencies are intact. On a fresh copy or another computer, run:

```powershell
npm ci
```

This installs the dependency versions recorded in `package-lock.json`. It replaces an existing `node_modules` folder, so stop any running website server first.

### 4. Start the development server

```powershell
npm run dev
```

Leave the terminal open while using the website. Wait for the `Local` address to appear.

### 5. Open the website

Open the address printed in the terminal, normally:

http://localhost:3000/

If port 3000 is occupied, use the actual address printed by the server. Saving source changes normally refreshes the development page automatically.

### 6. Stop the website

Press **Ctrl+C** in the terminal running the server. Confirm termination if Windows asks.

## Build and preview the production output locally

Stop the development server first, then run:

```powershell
npm run build
```

After a successful build, run:

```powershell
npm start
```

Open the address printed by Wrangler, normally:

http://127.0.0.1:8787/

`npm start` uses the generated `dist/server/wrangler.json` to preview the built Cloudflare Worker locally. It does **not** publish the website. Re-run `npm run build` after source changes before previewing with `npm start`. Press **Ctrl+C** to stop this preview.

Do not double-click a source file or try to open an `index.html` directly. This project needs its local server.

## Try the demo checkout

1. Browse the collection, or search for `hoodie`.
2. Open a product, select a size, and choose **Add to bag**.
3. Adjust the quantity or add another product, then choose **Checkout**.
4. Enter sample details, for example:
   - Email: `alex@example.com`
   - Name: `Alex Morgan`
   - Street: `123 Sample Street`
   - City: `Brooklyn`
   - State: `New York`
   - ZIP: `11201`
5. Select standard or express shipping and choose **Continue to review**.
6. Review the total and select **Place demo order**.
7. The confirmation screen shows a sample order reference and clears the bag. No card details or real payment are required.

## Main files and folders

| Path | Purpose |
| --- | --- |
| `app/page.tsx` | Storefront, product views, shopping bag, checkout, and interactions |
| `app/products.ts` | Eight sample products, prices, sizes, descriptions, and image paths |
| `app/globals.css` | Brand styling and responsive layouts |
| `app/layout.tsx` | Shared page structure, title, and description |
| `public/images/` | Locally stored campaign and product photographs |
| `public/image-sources.json` | Image source records |
| `public/favicon.svg` | Brand browser icon |
| `components/ui/` | Reusable interface components |
| `vite.config.ts` | Vinext, Sites, Tailwind, and Cloudflare development/build setup |
| `.openai/hosting.json` | Existing Sites project configuration |
| `package.json` / `package-lock.json` | Commands and dependency versions |
| `dist/` | Generated build output; regenerate with `npm run build` |

To edit the collection, start with `app/products.ts`. To change the design, edit `app/globals.css`. Product detail views use URLs such as `?product=heavyweight-hoodie`; checkout uses `?view=checkout`.

## Technology

React 19, TypeScript, Vinext with Vite, Tailwind CSS, shadcn/Base UI components, Lucide icons, and Cloudflare Worker-compatible output. Although it uses Next.js-style conventions, its development command is `npm run dev` as defined in this project's package file.

## Troubleshooting

- **`npm` is not recognized:** Install Node.js and reopen the terminal.
- **PowerShell blocks `npm.ps1`:** Use `npm.cmd` instead of `npm`, for example `npm.cmd run dev`. Use `npx.cmd` instead of `npx` if necessary. You do not need to change the computer's execution policy.
- **Missing packages:** Stop the server and run `npm ci` in the project folder.
- **Port already in use:** Use the available address printed by the development server, or stop the other process if you recognize it.
- **Missing `dist/server/wrangler.json`:** Run `npm run build` successfully before `npm start`.
- **Stale page after moving the folder or rebuilding:** Stop the server, start it again from this folder, and refresh the browser.
- **Bag contents disappear:** Browser private mode, disabled storage, clearing site data, or switching between `localhost`, `127.0.0.1`, and the hosted domain can create separate or temporary bags.
- **Hosted link asks for ChatGPT sign-in:** The hosted copy is private to its owner. Local development does not require the hosted site's sign-in.

## Verification

Original browser testing covered desktop (1440×1000), tablet (768×1024), mobile (390×844), and narrow mobile (320×740), including search, filtering, sorting, size selection, bag persistence, quantity limits, form validation, shipping totals, and completed desktop/mobile sample orders.

When this README was created in the moved folder, these checks were repeated on 6 September 2026:

- `npm run dev` started successfully; `http://localhost:3000/` returned HTTP 200 with the storefront content.
- `npm run build` completed successfully.
- `npm start` started successfully; `http://127.0.0.1:8787/` returned HTTP 200 with the storefront content.
- `npx tsc --noEmit` passed.

These checks verify the documented commands in the moved folder; they are not a claim of a new full browser regression test.

## Hosted copy and commercial use

The existing Sites project identity is retained in `.openai/hosting.json`.

The brand, prices, specifications, shipping policy, and checkout are fictional. Product photos are illustrative sample assets; source records are included, but catalog photo reuse rights were not verified. Before a real commercial launch, replace or license those images and implement server-side orders, inventory validation, payments, tax calculations, fulfillment, and appropriate customer policies.
