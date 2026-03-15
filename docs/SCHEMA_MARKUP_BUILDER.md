# Schema Markup Builder

Central place for Schema.org JSON-LD in the app: **`src/lib/schema-builder.ts`** and **`src/components/json-ld-schema.tsx`**.

## Quick use

```tsx
import { buildBreadcrumbSchema, buildWebPageSchema } from '@/lib/schema-builder'
import { JsonLdSchema } from '@/components/json-ld-schema'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gymdues.com'

// One schema
const schema = buildWebPageSchema({
  baseUrl: siteUrl,
  name: 'Page Title | Gymdues',
  description: 'Page description.',
  path: '/checkout',
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Checkout', url: '/checkout' },
  ],
})
return <JsonLdSchema data={schema} />

// Multiple schemas
return <JsonLdSchema data={[schema1, schema2, schema3]} />
```

## Available builders

| Function | Schema type | Use for |
|----------|-------------|---------|
| `buildBreadcrumbSchema(items, baseUrl)` | BreadcrumbList | Any page with breadcrumb nav |
| `buildOrganizationSchema(baseUrl, options?)` | Organization | Footer, Dataset creator, WebSite publisher |
| `buildWebSiteSchema(options)` | WebSite | Homepage or main entry (optional SearchAction) |
| `buildDatasetSchema(options)` | Dataset | /, data catalog pages |
| `buildWebPageSchema(options)` | WebPage | Checkout, success, cancel, about, generic pages |
| `buildFAQPageSchema(faqs, options)` | FAQPage | Pages with Q&A (e.g. gymsdata FAQ) |
| `buildItemListSchema(items, options)` | ItemList | List/catalog pages (states, cities, best gyms) |
| `buildArticleSchema(options)` | Article | Blog posts |

## Helpers

- **`resolveUrl(baseUrl, path)`** – Turns a base URL and path into a full URL (path can be relative or absolute).

## Output

Use **`<JsonLdSchema data={...} />`** so each schema is rendered as a `<script type="application/ld+json">` tag. Pass a single object or an array of objects.

## Where it’s used

- **`/`** – Dataset, Organization, BreadcrumbList
- **`/checkout`** – WebPage + breadcrumb
- **`/checkout/success`** – WebPage + breadcrumb
- **`/checkout/cancel`** – WebPage + breadcrumb

To add WebSite (e.g. on homepage) or FAQPage (e.g. on gymsdata FAQ), call the matching builder and pass the result into `JsonLdSchema` on that page.
