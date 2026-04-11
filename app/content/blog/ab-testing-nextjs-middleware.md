---
title: How to A/B Test a Next.js App Without Touching a Single Component
description: Next.js middleware runs at the edge before your pages render. Here's how to use it to split-test any route with zero component changes and zero flicker.
date: 2026-02-05
author: Koryla Team
slug: ab-testing-nextjs-middleware
---

If you've tried A/B testing in a Next.js app before, you've probably done it one of two ways: a client-side JavaScript snippet bolted onto the page, or a complex setup with `getServerSideProps` that couples your experiment logic to your component tree.

Both approaches work — but both have costs. The JavaScript approach flickers. The `getServerSideProps` approach means touching every component you want to test, and redeploying when experiments change.

There's a third way: **Next.js middleware**.

## What middleware makes possible

Next.js middleware runs at the Vercel Edge Network — before your pages render, before React touches anything, before the browser receives a single byte. It's the ideal place to run experiment logic.

The pattern is simple:

1. Visitor requests `/pricing`
2. Middleware runs, reads (or sets) a variant cookie
3. Middleware rewrites the request to `/pricing` or `/pricing-b` depending on variant
4. Next.js renders the correct page
5. Browser receives the final HTML — no flicker, no JavaScript, no trace of the rewrite

Your component files don't change. Your routing doesn't change. The URL stays `/pricing` for both variants.

## Setting it up with Koryla

Install the package:

```bash
npm install @koryla/next
```

Add a `middleware.ts` to your project root:

```ts
import { korylaMiddleware } from '@koryla/next'

export default korylaMiddleware({
  apiKey: process.env.KORYLA_API_KEY!,
  apiUrl: process.env.KORYLA_API_URL!,
})

export const config = {
  matcher: ['/pricing', '/landing', '/'],
}
```

Add your environment variables to Vercel (or `.env.local` for dev):

```
KORYLA_API_KEY=sk_live_...
KORYLA_API_URL=https://koryla.com
```

That's it. You now have a split-testing layer that runs before your app.

## How experiments are configured

You don't touch your codebase to create or change experiments. You do it in the Koryla dashboard:

1. Create an experiment with a base URL (e.g. `/pricing`)
2. Add a variant pointing to the alternate URL (e.g. `/pricing-b`)
3. Set traffic weights (e.g. 50/50)
4. Click Start

Within 60 seconds (the config cache TTL), traffic starts splitting. When you're done, pause the experiment from the dashboard. No deploy needed.

## What happens to returning visitors

The middleware reads a `ky_{experimentId}` cookie on every request. If the cookie is present, the visitor is sent to the same variant they saw before. If not, they're assigned randomly based on the traffic weights and the cookie is set.

This is sticky assignment — a visitor who saw Variant B on Monday will see Variant B on Friday. Your conversion tracking is accurate because each visitor stays in one bucket.

## What you need to build

The only thing you need to provide is the alternate page. If you're testing `/pricing` against `/pricing-b`, you need a `/pricing-b` page in your `app/` folder. It can be a full duplicate with a different layout, a different component file, anything — Next.js treats it as a normal route.

The middleware just decides which one to serve.

## Testing it locally

Run `next dev` normally. The middleware executes in development too. Open your browser's developer tools → Application → Cookies and look for a `ky_` cookie after visiting a route with an active experiment.

Clear the cookie and reload to get re-assigned. You should end up in both variants within a few reloads.

## The practical upside

The most significant benefit isn't the lack of flicker — it's the decoupling. Your experiment configuration lives in a dashboard, not in your code. Non-engineers can create, modify, and end experiments without a pull request. Engineers don't need to audit experiment code before every release.

For teams where engineering bandwidth is the bottleneck for experimentation, this matters more than any performance metric.
