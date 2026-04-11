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
| 15.1 | Blog — 11 artículos (CRO, edge testing, flicker, stats, WordPress, BoostifyJS, etc.) |

## Pendiente

### Bugs & fixes

| Fase | Descripción | Notas |
|------|-------------|-------|
| 17.5 | **Revisión de docs** | `how-it-works.md` Cloudflare-only — hacer agnóstico a la plataforma |
| 17.6 | **Fix Google OAuth** | Muestra "supabase.co" en el selector de cuenta — cambiar en Google Cloud Console: nombre de app → "Koryla", dominio autorizado → `koryla.com` |
| 17.7 | **Fix conversion rate 0.0%** | Verificar que los experimentos tienen `conversion_url` configurada y que esa URL se está visitando. Revisar datos en Supabase tabla `events` |
| 17.8 | **Emails Resend** | FROM hardcodeado a `onboarding@resend.dev`. Pendiente: dominio propio, verificación de email, reset de contraseña |
| 17.9 | **Blog analytics en admin** | El admin dashboard no muestra datos de blog. Integrar GA4 Reporting API o pageviews en `/admin` |
| 17.10 | **SDK demo — anotaciones visuales** | Añadir etiquetas "Style variation" / "Text variation" sobre el contenido de `/sdk-demo` |
| 17.15 | **SDK reporting al dashboard** | `<Experiment>` dispara `POST /api/events` (impression + conversion) al mismo backend que el Worker. Dashboard muestra experimentos edge y component en la misma lista con badge de tipo. Incluye `onAssigned` callback para dual reporting a PostHog/GA4. |
| 17.20 | **Integrations page — copy fixes** | (1) Subtítulo "Two ways to run A/B tests" — expandir con más contexto. (2) Sección "Why no flicker?" — reemplazar menciones a VWO/Optimizely por "traditional tools" o similar. |

### SEO & visibilidad

| Fase | Descripción | Notas |
|------|-------------|-------|
| 17.11 | **llms.txt** | Archivo `/public/llms.txt` con descripción del producto, casos de uso, links a docs y blog — para que LLMs entiendan qué es Koryla |
| 17.12 | **SEO técnico** | `<meta>` tags en todas las páginas (title, description, OG, Twitter card), sitemap.xml, robots.txt, canonical URLs |
| 17.13 | **Blog SEO** | Añadir `og:image` por post, structured data (Article schema), reading time estimado |
| 17.14 | **Landing page SEO** | H1/H2 con keywords target, alt text en imágenes, Core Web Vitals limpios |

### Infra & calidad

| Fase | Descripción | Notas |
|------|-------------|-------|
| 17 | **QA & CI/CD** | Tests unitarios, integración, GitHub Actions pipeline |
| 16 | **Proxy gestionado** (`proxy.koryla.com`) | Cloudflare for SaaS — post-launch |
| 17.16 | **Email forwarding** | Configurar `hello@koryla.com` → `andresclua@gmail.com`. Opciones: Cloudflare Email Routing (si DNS en Cloudflare) o ImprovMX (si DNS en GoDaddy). Verificar conflicto con MX records de Resend. |
| 17.18 | **Integrations page — mejoras UX** | (1) **Generador de código personalizado**: dropdown para elegir experimento real → snippets con IDs reales del workspace, sin `YOUR_EXPERIMENT_ID`. (2) **"For devs" section**: explica el protocolo HTTP subyacente (cookies, API endpoints, flujo de asignación) para frameworks sin SDK oficial (SvelteKit, Angular, Laravel, etc.) — cualquier dev puede implementarlo en ~50 líneas entendiendo el protocolo. (3) **17.5 docs fix** una vez que Integrations esté completo. |
| 17.19 | **Dashboard UI refresh** | Mejorar la estética general del dashboard — inspiración: diseño limpio, respirado, tipografía clara, mejor jerarquía visual (ref: Agent Protocol Stack style). Scope: (1) form "New experiment" más agradable de completar, (2) lista de experimentos, (3) detalle de experimento, (4) sidebar. No es un rediseño completo — es pulir lo que existe: spacing, bordes, sombras, estados vacíos, microinteracciones. |
| 17.17 | **Tooltips de ayuda contextual** | Icono ⓘ con tooltip on-hover en todos los términos técnicos del dashboard: Impressions, Conv. rate, Edge/SDK badge, Visual changes, status badges (Active/Paused/etc), botones Pause/Complete. Textos propuestos: Impressions="Cantidad de veces que un visitante vio una variante — cada visitante cuenta una sola vez"; Conv. rate="% de visitantes que llegaron a la URL de conversión tras ver una variante"; Edge="Corre en el servidor antes de que la página cargue, sin JS en el browser"; SDK="Corre dentro de un componente React/Vue/Astro usando la librería @koryla". |
| 17.21 | **Filtros en lista de experimentos** | Filtrar por status (All / Active / Paused / Draft / Completed), por tipo (Edge / SDK), búsqueda por nombre. |
| 17.22 | **Edición de experimentos** | Poder editar nombre, conversion URL y descripciones de variantes. No cambiar URLs de variantes en experimentos activos (rompería el experimento en curso). |
| 17.23 | **Notificaciones por email** | Sección en Settings para configurar alertas: experimento llegó a X impresiones, lleva N días activo sin conversiones, variante ganando con significancia estadística, experimento completado. Post-launch. |
| 17.24 | **Demo workspace** | `acme-inc` → workspace demo read-only visible para todos los usuarios registrados. Badge "Demo" en sidebar. No cuenta para límites del plan. Métricas reales de `astro-demo.koryla.com`. Aparece primero en el sidebar. Toggle en Settings para mostrarlo u ocultarlo (para usuarios avanzados). |
| 17.25 | **next-demo-internal + `next-demo.koryla.com`** | Demo en Next.js con 3 experimentos Edge (middleware `@koryla/next`): `/pricing` → cambio de URL, `/hero` → cambio de diseño, `/headline` → cambio de texto. Homepage interna con cards explicativas que llevan a cada demo. Dominio propio `next-demo.koryla.com`. |
| 17.26 | **Blog — 15 artículos** | Actualizar los 6 existentes: author → "Koryla Team", revisar contenido para reflejar cambios del producto (SDK, Edge/SDK types, nuevo dashboard). Escribir 9 nuevos sobre temas variados: A/B testing, performance web, IA, costos de stack, métricas, conversión, etc. Fechas distribuidas en los últimos 6 meses (más viejo ≈ oct 2025, más nuevo ≈ días antes del launch). |

### Launch

| Fase | Descripción | Notas |
|------|-------------|-------|
| 18 | **Launch** | Meta: 2026-05-10 — checklist: SEO ✓, emails ✓, OAuth ✓, conversion rate ✓, docs ✓ |
