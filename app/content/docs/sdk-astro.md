---
title: Astro
description: A/B test Astro pages with @koryla/astro. Resolve variants in frontmatter, zero client JS.
order: 11
section: SDK
slug: sdk-astro
---

# Astro

Two approaches for Astro — pick the one that fits your use case:

| Approach | Use for |
|---|---|
| **Netlify Edge Function** | Full-page routing — intercepts the request before Astro renders anything. No changes to your `.astro` files. |
| **`@koryla/astro`** | Component-level testing — resolve a variant in the page frontmatter and conditionally render different content. |

The [live demo](https://astro-demo.koryla.com) uses the edge function approach. The `/sdk-demo` page on the same site shows the component approach using the same underlying logic.

---

## Option A — Netlify Edge Function (full-page, recommended)

Drop a single file into your project and add it to `netlify.toml`. No changes to your `.astro` files.

### netlify/edge-functions/koryla.ts

Copy the self-contained edge function from the [Koryla Worker repo](https://github.com/andresclua/koryla) or use the `@koryla/netlify` package:

```ts
import { korylaMiddleware } from '@koryla/netlify'

export default korylaMiddleware({
  apiKey: Deno.env.get('KORYLA_API_KEY')!,
  apiUrl: Deno.env.get('KORYLA_API_URL')!,
})

export const config = { path: ['/', '/pricing'] }
```

### netlify.toml

```toml
[[edge_functions]]
  function = "koryla"
  path = "/"

[[edge_functions]]
  function = "koryla"
  path = "/pricing"
```

### Netlify environment variables

| Variable | Value |
|---|---|
| `KORYLA_API_KEY` | `sk_live_...` |
| `KORYLA_API_URL` | `https://koryla.com` |

---

## Option B — @koryla/astro (component-level)

Test a specific section within a page without routing to a different URL.

### Install

```bash
npm install @koryla/astro
```

### Usage

```astro
---
import { getVariant } from '@koryla/astro'

const result = await getVariant(Astro.request, 'your-experiment-id', {
  apiKey: import.meta.env.KORYLA_API_KEY,
  apiUrl: import.meta.env.KORYLA_API_URL,
})

// Persist the variant cookie on new assignments
if (result?.isNewAssignment) {
  Astro.cookies.set(result.cookieName, result.variantId, {
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
    path: '/',
  })
}

const isControl = !result || result.variant.is_control
---

{isControl ? (
  <section>
    <h1>Original headline</h1>
    <a href="/signup">Get started free</a>
  </section>
) : (
  <section>
    <h1>New headline — does it convert?</h1>
    <a href="/signup">Start your free trial</a>
  </section>
)}
```

### .env

```bash
KORYLA_API_KEY=sk_live_...
KORYLA_API_URL=https://koryla.com
```
