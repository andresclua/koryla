---
title: Edge Testing, Client Testing, and Component Testing — Which One Do You Need?
description: Most A/B testing tools run in the browser. Koryla runs at the edge and inside your components. Here's when to use each approach and how they can work together.
date: 2026-02-03
author: Andrés Clúa
slug: edge-testing-vs-client-testing
---

If you've used tools like Optimizely or Google Optimize, you've used client-side A/B testing. It works — but it comes with tradeoffs that most teams don't fully understand until they've already shipped a flicker to production.

Koryla supports three approaches to A/B testing. Knowing which one to reach for — and when to combine them — will save you a lot of pain.

## The problem with client-side testing

Client-side tools work by loading a JavaScript snippet that:

1. Waits for the DOM to load
2. Hides the page with `opacity: 0` or `visibility: hidden`
3. Modifies elements on the page
4. Reveals the page once swapping is done

This creates the infamous **flicker effect** — users briefly see the original page before the variant is applied. It's bad for UX, it hurts conversion rates, and it skews your results by creating inconsistent experiences.

Beyond the flicker: you're adding 80–150KB of blocking JavaScript to every page load, every experiment, regardless of whether the user is even in a test group.

## Approach 1 — Edge testing (URL-based)

With Koryla's edge approach, variant assignment happens at the **Cloudflare Worker** level — before any HTML is sent to the browser. The user receives the correct variant instantly, with zero flicker.

```
User request → Cloudflare Worker → Assigns variant → Serves correct page
```

The Worker reads a cookie (or sets one if it's a new visitor), decides which variant to serve, and rewrites the request to the correct URL. The browser never knows an experiment is running.

This is best for testing **whole pages or layouts**:

- Different landing page copy
- Alternative pricing page structures
- New onboarding flows
- Different navigation layouts

| | Client-side | Edge (Koryla) |
|---|---|---|
| Flicker | Yes | No |
| Performance impact | ~150ms + 80–150KB JS | ~0ms, 0KB |
| Works with SSR | Sometimes | Always |
| Requires JS on visitor side | Yes | No |
| Blockable by ad blockers | Yes | No |

## Approach 2 — Component testing (SDK)

Edge testing handles full-page swaps. But what if you want to test something smaller — a button color, a headline variant, or a CTA inside a page that otherwise stays the same?

That's where **Koryla's SDK** comes in. Instead of swapping entire pages, you write conditional logic directly in your components:

```tsx
// React / Next.js
import { Experiment, Variant } from '@koryla/react'

export default function PricingPage() {
  return (
    <Experiment id="pricing-cta-test">
      <Variant name="control">
        <button className="bg-gray-900 text-white">
          Start free trial
        </button>
      </Variant>
      <Variant name="variant-b">
        <button className="bg-orange-500 text-white">
          Get started — it's free
        </button>
      </Variant>
    </Experiment>
  )
}
```

```astro
---
// Astro
import { getVariant } from '@koryla/core'
const variant = await getVariant(Astro.request, 'hero-test')
---

{variant === 'control' ? (
  <h1>Know what your users actually do</h1>
) : (
  <h1>Stop guessing. Start knowing.</h1>
)}
```

The SDK reads the same `ky_` cookie as the Worker — so if a visitor was already assigned by the edge, the component respects that assignment. No conflicts, no double-assignment.

This is best for:

- Button colors or copy
- Headline variants within a page
- Form layouts or field ordering
- Feature flags (show feature to 20% of users)
- Any UI element too small to justify a full page swap

## Approach 3 — Combining both

The real power comes from using both together. The Worker handles the macro split (which page template), the SDK handles the micro split (which components inside that page).

```
Visitor arrives
  ↓
Cloudflare Worker
  → Assigns to "Variant B" landing page
  → Sets cookie: ky_exp-1=variant-b
  ↓
Variant B page loads
  → <Experiment> component reads cookie
  → Renders orange CTA button (another test running inside)
```

Both layers share the same cookie namespace. One experiment per cookie key. No interference.

## How Koryla tracks actions

Whether you're using edge testing or component testing, Koryla tracks the same events:

- **Impression** — visitor was assigned to a variant and saw the page/component
- **Conversion** — visitor reached the conversion URL you defined

For component tests, you can fire conversions manually:

```ts
import { trackConversion } from '@koryla/core'

// When the user clicks buy, completes signup, etc.
trackConversion('pricing-cta-test')
```

## Choosing the right approach

| Situation | Approach |
|---|---|
| Testing a different landing page | Edge (URL rewrite) |
| Testing a button color | SDK component |
| Testing a headline | SDK component |
| Testing a whole new onboarding flow | Edge (URL rewrite) |
| Feature flag for 10% of users | SDK component |
| Testing layout vs. layout | Edge (URL rewrite) |
| Testing copy inside a shared layout | SDK component |
| Both at once | Combine both |

The rule of thumb: if the variant lives at a different URL, use the edge. If the variant lives inside a component, use the SDK.

## Experiment data goes to your analytics tools

Most A/B testing platforms keep your experiment data locked inside their own dashboard. Koryla sends every impression and conversion event to **whichever analytics tools you already use** — simultaneously.

Out of the box, Koryla supports:

- **Google Analytics 4** — events appear as `experiment_assigned` with `experiment_id` and `variant_name` parameters, ready to use in GA4 audiences and reports
- **PostHog** — full event with properties, compatible with PostHog's A/B testing analysis
- **Mixpanel, Amplitude, Segment, RudderStack** — same event, routed to each destination
- **Custom webhook** — signed with HMAC-SHA256 so you can verify the payload came from Koryla and pipe it anywhere

This means your experiment data lives alongside the rest of your product analytics. You can slice by variant in the same dashboards you already use, build funnels across experiment groups, and not have to stitch together data from two separate tools.

Almost no A/B testing tool does this. Most treat analytics as a separate product. Koryla routes to all your destinations from the edge — before the page even reaches the browser.

Configure your destinations in **Dashboard → Integrations → Analytics**.

## Getting started

Both approaches are available on all Koryla plans. Head to the [Integrations](/docs/integrations) page to install the adapter for your stack, or check the [Getting Started](/docs/getting-started) guide to deploy your first Cloudflare Worker.
