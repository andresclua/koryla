# Koryla — Roadmap

## Completado ✅

| Fase | Descripción |
|------|-------------|
| 01 | Monorepo & stack inicial |
| 02 | Auth & registro con domain matching |
| 03 | Workspaces & API keys |
| 04 | Cloudflare Worker — core engine |
| 05 | Analytics router multi-destino (GA4, PostHog, webhooks) |
| 06 | Dashboard — experimentos |
| 07 | Instalación — WordPress + Next.js |
| 08 | Página de integraciones |
| 09 | Billing con Stripe (free / starter / growth) |
| 10 | Onboarding & emails (Resend) |
| 11 | Blog & Docs (@nuxt/content) |
| 12 | Renombrado Splitr → Koryla |
| 13 | Landing page (koryla.com) |
| 14 | Demo interactiva (astro-demo.koryla.com) + eventos reales en Supabase |
| 15 | SDK components (@koryla/react, @koryla/vue, @koryla/astro, @koryla/next, @koryla/node) |

## Pendiente

| Fase | Descripción | Notas |
|------|-------------|-------|
| 16 | **Proxy gestionado** (`proxy.koryla.com`) | Cloudflare for SaaS — opción sin-código para no-técnicos. Post-launch. |
| 17 | **QA & CI/CD** | Tests unitarios, integración, GitHub Actions pipeline |
| 17.5 | **Revisión de docs** | `how-it-works.md` Cloudflare-only — hacer agnóstico a la plataforma |
| 17.6 | **Fix Google OAuth** | Muestra "supabase.co" en el selector de cuenta — cambiar nombre de app y dominio en Google Cloud Console |
| 17.7 | **Fix conversion rate 0.0%** | Los experimentos no tienen `conversion_url` configurada o la URL no se está visitando — verificar datos en Supabase y flujo en edge function |
| 17.8 | **Emails Resend** | FROM hardcodeado a `onboarding@resend.dev` — usar dominio propio. Faltan: verificación de email, reset de contraseña |
| 17.9 | **Blog analytics para admin** | El admin dashboard no muestra datos de blog. Integrar GA4 o pageviews en `/admin` |
| 17.10 | **SDK demo — anotaciones visuales** | Añadir etiquetas "Style variation" / "Text variation" en `/sdk-demo` para que se entienda qué se está testeando |
| 18 | **Launch** | Meta: 2026-05-10 |
