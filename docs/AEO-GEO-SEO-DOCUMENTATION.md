# AEO/GEO/SEO Documentation — Artbrush (MysticArtStudio)

This document describes the schema, JSON-LD, and other changes implemented to improve the **Answer Engine Optimization (AEO)**, **Generative Engine Optimization (GEO)**, and **Search Engine Optimization (SEO)** scores for the Artbrush website.

---

## Table of Contents

1. [Overview](#overview)
2. [Design Principles](#design-principles)
3. [Structured Data (JSON-LD)](#structured-data-json-ld)
4. [Meta Tags & Open Graph](#meta-tags--open-graph)
5. [Sitemap & Crawlability](#sitemap--crawlability)
6. [Performance & Core Web Vitals](#performance--core-web-vitals)
7. [Page-Specific Schema Mapping](#page-specific-schema-mapping)
8. [Automation Strategy](#automation-strategy)

---

## Overview

The website was optimized to address common AEO/GEO audit findings:

- **Missing publication dates** — AI systems use dates to assess content freshness and relevance.
- **Weak or incomplete structured data** — Limits machine readability and extraction.

All changes were designed to be **page-centric**, **explicit**, and **easily detectable** by rule-based AEO auditors.

---

## Design Principles

The following constraints guided the implementation:

| Principle | Rationale |
|-----------|-----------|
| **No `@graph` usage** | Rule-based auditors often scan for top-level `@type` directly. Nested graphs add indirection and can be missed. |
| **One dominant schema type per page** | Each page has a single primary entity that clearly describes its purpose. |
| **No `@id` cross-references** | Cross-references require auditors to resolve IDs; inline entities are immediately readable. |
| **Prefer redundancy over elegance** | Repeating `Person` and `Organization` blocks avoids reference resolution and ensures completeness. |
| **Literal objects only** | All `author`, `publisher`, and nested entities are fully inlined—no `{"@id": "..."}` references. |

---

## Structured Data (JSON-LD)

### Global Requirements (Every Page)

Every page includes a **single** JSON-LD block with:

| Property | Purpose |
|----------|---------|
| `@context` | `https://schema.org` — Standard schema.org context. |
| `@type` | Page-specific type (e.g., `WebPage`, `Service`, `FAQPage`). |
| `name` | Page title. |
| `description` | Page meta description. |
| `url` | Canonical page URL. |
| `mainEntityOfPage` | Same as `url` — reinforces that this page is the primary entity. |
| `datePublished` | ISO date string (e.g., `2026-01-30`). |
| `dateModified` | ISO date string — helps AI assess freshness. |
| `author` | Inlined `Person` object. |
| `publisher` | Inlined `Organization` object. |

### Entity Definitions (Inlined on Every Page)

#### Person (Author)

```json
{
  "@type": "Person",
  "name": "Yamuna Padmanaban",
  "jobTitle": ["Artist", "Art Therapist", "Brand Designer"],
  "knowsAbout": ["Art Therapy", "Illustration", "Branding", "Painting"]
}
```

**Rationale:** AI systems use `author` and `knowsAbout` for credibility and topical relevance. Fully inlining avoids broken references.

#### Organization (Publisher)

```json
{
  "@type": "Organization",
  "name": "Artbrush",
  "url": "https://artbrush.co",
  "logo": "https://artbrush.co/assets/images/logo.png"
}
```

**Rationale:** Establishes brand identity and provides a consistent logo for rich results.

---

## Page-Specific Schema Mapping

| Page | Schema Type | Page-Specific Elements |
|------|-------------|-------------------------|
| `/` (index.html) | `WebPage` | Core page description. |
| `/brand.html` | `Service` | `serviceType`, `provider` (Organization). |
| `/merchandise.html` | `CollectionPage` | `hasPart` with `Product[]` — each includes `offers`, `brand`, `image`. |
| `/affordable.html` | `OfferCatalog` | `itemListElement` with `Offer[]` — each contains `itemOffered` (Product), `price`, `priceCurrency`. |
| `/about.html` | `ProfilePage` | `mainEntity` — inlined `Person` for the artist profile. |
| `/blog.html` | `Blog` | `blogPost` array of `BlogPosting` — each with `headline`, `datePublished`, `dateModified`, `author`, `publisher`, `image`. |
| `/faq.html` | `FAQPage` | `mainEntity` — array of `Question` with `acceptedAnswer` (`Answer`). |
| `/contact.html` | `ContactPage` | `contactPoint` — `ContactPoint` with `email`, `contactType`. |
| `/art-therapy.html` | `Service` | `serviceType`, `provider` (Organization). |
| `/art-therapy-practice.html` | `HowTo` | `step` — array of instruction strings; `supply` — materials list. |

### Why These Types?

- **WebPage:** Generic but valid; homepage does not fit a more specific subtype.
- **Service:** Brand storytelling and art therapy are offered as services.
- **CollectionPage + Product:** Merchandise page lists products with offers.
- **OfferCatalog:** Gift Art page is a catalog of offers (artworks for sale).
- **ProfilePage:** About page centers on a person; `mainEntity` points to that person.
- **Blog + BlogPosting:** Standard schema for blog content; supports rich results.
- **FAQPage:** Enables FAQ rich results in search.
- **ContactPage:** Signals contact info for AI extraction.
- **HowTo:** Practice worksheet is procedural content; `step` and `supply` are explicit.

---

## Meta Tags & Open Graph

### Standard Meta Tags (Every Page)

| Tag | Purpose |
|-----|---------|
| `meta name="description"` | Primary search snippet. |
| `link rel="canonical"` | Prevents duplicate content; uses full URL `https://artbrush.co/...`. |
| `meta name="author"` | `Yamuna Padmanaban` — human-readable author. |
| `meta name="date"` | Publication date for crawlers. |
| `meta name="last-modified"` | Last modification date. |
| `meta property="article:published_time"` | For article-like pages. |
| `meta property="article:modified_time"` | Freshness signal. |

### Open Graph (Social Sharing)

| Tag | Purpose |
|-----|---------|
| `og:site_name` | MysticArtStudio |
| `og:title` | Page title |
| `og:description` | Page description |
| `og:url` | Canonical URL |
| `og:type` | `website` |
| `og:image` | Shared image (logo) |

### Twitter Card

| Tag | Purpose |
|-----|---------|
| `twitter:card` | `summary_large_image` |
| `twitter:title` | Page title |
| `twitter:description` | Page description |
| `twitter:image` | Shared image |

**Rationale:** Dates help AI systems assess temporal relevance; Open Graph and Twitter tags improve sharing and consistency across platforms.

---

## Sitemap & Crawlability

### sitemap.xml

- Lists all public pages with full URLs.
- Each URL includes `<lastmod>` for content freshness.
- **Automated:** `lastmod` is derived from Git commit history (see [Automation Strategy](#automation-strategy)).

### robots.txt

```
User-agent: *
Allow: /

Sitemap: https://artbrush.co/sitemap.xml
```

**Rationale:** Allows all crawlers and points to the sitemap for efficient discovery.

---

## Performance & Core Web Vitals

These optimizations support Core Web Vitals and reduce layout shift:

| Technique | Implementation | Rationale |
|-----------|----------------|------------|
| **Lazy loading** | `loading="lazy"` on images below the fold | Reduces initial load and improves LCP. |
| **Eager + high priority** | First above-the-fold image: `loading="eager"` and `fetchpriority="high"` | Ensures LCP image loads quickly. |
| **Async decoding** | `decoding="async"` on all images | Keeps main thread free during decode. |
| **Deferred scripts** | `defer` on `main.js` | Non-blocking; improves FCP and TTI. |

**Rationale:** Performance affects both SEO (Core Web Vitals) and user experience; AEO tools may factor in page quality signals.

---

## Automation Strategy

### Sitemap lastmod Updates

**Problem:** AEO auditors flag missing or stale publication dates. Manual updates are error-prone.

**Solution:** Node.js script (`scripts/update-sitemap.js`) plus GitHub Actions.

1. **Script** (`scripts/update-sitemap.js`):
   - Uses `git log -1 --format=%cs -- <file>` to get the last commit date for each HTML file.
   - Regenerates `sitemap.xml` with fresh `lastmod` values.
   - Runs on every push to `main`.

2. **Workflow** (`.github/workflows/update-sitemap.yml`):
   - Triggers on push to `main`.
   - Runs `node scripts/update-sitemap.js`.
   - Commits and pushes changes to `sitemap.xml` if modified.

**Rationale:** Keeps publication/last-modified dates aligned with actual content changes without manual updates.

---

## URL and Domain Configuration

- **Canonical base URL:** `https://artbrush.co`
- All canonical links, JSON-LD URLs, sitemap, and Open Graph URLs use this domain.
- Logo path: `https://artbrush.co/assets/images/logo.png`

---

## Validation

- JSON-LD is valid against [schema.org](https://schema.org) and [Google Rich Results Test](https://search.google.com/test/rich-results).
- No `@graph`, no `@id` references.
- Each page has one primary JSON-LD block.
- All required properties (`datePublished`, `dateModified`, `author`, `publisher`, `mainEntityOfPage`) are present on every page.

---

## Summary Checklist

| Area | Status |
|------|--------|
| Structured data (JSON-LD) on all pages | ✓ |
| One dominant schema type per page | ✓ |
| No `@graph` or `@id` references | ✓ |
| Inlined author and publisher | ✓ |
| Publication and modification dates | ✓ |
| Canonical URLs | ✓ |
| Meta description, author, dates | ✓ |
| Open Graph and Twitter tags | ✓ |
| Sitemap with lastmod | ✓ |
| robots.txt with Sitemap reference | ✓ |
| Lazy loading and defer for performance | ✓ |
| Automated sitemap lastmod updates | ✓ |
