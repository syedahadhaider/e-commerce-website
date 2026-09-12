# FORM / AFTER

FORM / AFTER is a fictional premium streetwear storefront with an editorial black-and-white aesthetic and a complete demo shopping flow.

[View the live site](https://form-after.vercel.app/)

> This is a demonstration project. It does not process payments or persist customer and order data on a server.

## Features

- Responsive product catalogue with category, search, price, and sort controls
- Product details, size selection, material information, and size guidance
- Browser-persisted shopping bag with quantity controls
- Two-step demo checkout with delivery, shipping, review, and confirmation states
- Accessible controls, mobile navigation, empty states, and validation feedback

## Tech stack

- React 19 and TypeScript
- Vinext and Vite
- Tailwind CSS
- Base UI and shadcn components
- Nitro for Vercel deployment

## Local setup

Requires Node.js 22.13 or newer and npm.

```bash
git clone https://github.com/syedahadhaider/e-commerce-website.git
cd e-commerce-website
npm ci
npm run dev
```

Open the local URL printed by the development server (normally `http://localhost:3000`). No environment variables, database, or payment credentials are required.

## Build commands

```bash
npm run build       # Create the production build
npm start           # Preview the Cloudflare Worker build locally
npm run lint        # Run Oxlint
npx tsc --noEmit    # Run TypeScript checks
```

Vercel deployments use the Nitro adapter configured in `vite.config.ts` and `vercel.json`.

## Contributing

Contributions are welcome. Create a focused branch, keep changes scoped, and open a pull request describing the behavior and verification performed.
