---
title: Getting Started
description: Set up Splitr on your site in under 5 minutes.
order: 1
section: Introduction
---

# Getting Started

Splitr runs A/B experiments at the edge — no JavaScript flicker, no performance hit. This guide walks you through your first experiment.

## Prerequisites

- A Splitr account ([sign up free](/signup))
- A website you control (any stack)

## Step 1 — Create a workspace

After signing up, you'll be prompted to create a workspace. Give it your company or project name.

## Step 2 — Get your API key

Go to **Settings → API Keys** in your dashboard and create a new key. Copy it — you'll need it in the next step.

## Step 3 — Deploy the Worker

Splitr uses a Cloudflare Worker to intercept requests and assign variants. You can deploy it in two ways:

### Option A — Cloudflare Dashboard (easiest)

1. Log in to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Go to **Workers & Pages → Create**
3. Paste the worker script (available in your dashboard under Settings → Worker)
4. Set the following environment variables:
   - `SPLITR_API_URL` — your Splitr app URL
   - `SPLITR_API_KEY` — the API key from Step 2

### Option B — Wrangler CLI

```bash
npx wrangler deploy
```

## Step 4 — Create your first experiment

1. In your dashboard, go to **Experiments → New**
2. Enter a name and the base URL of the page you want to test
3. Add variants — each variant points to a different URL
4. Set traffic weights (e.g., 50/50)
5. Click **Start**

## Step 5 — Verify it's working

Visit your site in an incognito window. Check the cookies — you should see a `sp_` cookie with your experiment ID. That's Splitr assigning you to a variant.
