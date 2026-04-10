---
title: API Keys
description: How to create and manage API keys for the Splitr Worker.
order: 3
section: Core concepts
---

# API Keys

API keys authenticate the Cloudflare Worker when it fetches experiment config from Splitr.

## Creating a key

Go to **Settings → API Keys → New Key**. Give it a descriptive name (e.g. "Production Worker").

The key is shown once — copy it immediately. If you lose it, delete and create a new one.

## Key format

Keys follow the format `sk_live_...` and are hashed with SHA-256 before being stored. Splitr never stores the raw key.

## Using the key

Set it as the `SPLITR_API_KEY` environment variable in your Cloudflare Worker:

```bash
wrangler secret put SPLITR_API_KEY
```

Or in the Cloudflare Dashboard under **Worker → Settings → Variables**.

## Rotating a key

1. Create a new key in the dashboard
2. Update the Worker's `SPLITR_API_KEY` environment variable
3. Delete the old key

There is no downtime — the Worker will use the new key immediately.

## Security

- Keys are hashed on creation — Splitr cannot recover the original
- Each key is scoped to a single workspace
- Delete keys you no longer use
