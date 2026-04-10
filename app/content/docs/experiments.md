---
title: Experiments
description: How to create, manage and analyze A/B experiments in Splitr.
order: 2
section: Core concepts
---

# Experiments

An experiment is a controlled test where you compare two or more variants of a page to see which performs better.

## Creating an experiment

From your dashboard, click **New Experiment** and fill in:

| Field | Description |
|---|---|
| Name | Internal name for the experiment |
| Base URL | The URL pattern to intercept (e.g. `/pricing`) |

## Variants

Each experiment needs at least two variants:

- **Control** — the original page (traffic weight defines what % sees this)
- **Variant** — alternative version pointing to a different URL

Splitr rewrites the request URL at the edge, so `/pricing` can silently serve `/pricing-v2` to 50% of visitors.

## Traffic weights

Weights are relative numbers — Splitr normalizes them automatically. So `50/50` and `1/1` are equivalent.

## Experiment status

| Status | Description |
|---|---|
| `draft` | Not yet running, no traffic assigned |
| `active` | Running, variants being served |
| `paused` | Temporarily stopped, assignments preserved |
| `completed` | Finished, winner declared |

## Sticky assignments

Once a visitor is assigned to a variant, they always see the same one. Splitr stores the assignment in a cookie (`sp_{experimentId}`) with a 30-day expiry.

## Stopping an experiment

Set the experiment to **completed** in your dashboard. The Worker will stop intercepting traffic for that experiment on the next config refresh (up to 60 seconds).
