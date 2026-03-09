/**
 * Schema Markup Builder – Schema.org JSON-LD helpers for consistent structured data.
 * Use with the <JsonLdSchema> component or inject script tags manually.
 *
 * Supported types: BreadcrumbList, Organization, WebSite, Dataset, WebPage, FAQPage, ItemList.
 */

const CONTEXT = 'https://schema.org'

/** Resolve full URL from base and path (path can be relative or absolute). */
export function resolveUrl(baseUrl: string, path: string): string {
  const base = baseUrl.replace(/\/$/, '')
  if (path.startsWith('http')) return path
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}

export interface BreadcrumbItem {
  name: string
  url: string
}

/** Build BreadcrumbList schema. */
export function buildBreadcrumbSchema(
  items: BreadcrumbItem[],
  baseUrl: string
): object {
  return {
    '@context': CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: resolveUrl(baseUrl, item.url),
    })),
  }
}

export interface OrganizationSchemaOptions {
  baseUrl: string
  name?: string
  url?: string
  logo?: string
  /** Optional: full Organization props (address, contactPoint, etc.) merged in. */
  extra?: Record<string, unknown>
}

/** Build Organization schema. */
export function buildOrganizationSchema(
  baseUrl: string,
  options?: Partial<OrganizationSchemaOptions>
): object {
  const name = options?.name ?? 'Gymdues'
  const url = options?.url ?? baseUrl
  const logo = options?.logo ?? `${baseUrl.replace(/\/$/, '')}/images/logo.svg`
  return {
    '@context': CONTEXT,
    '@type': 'Organization',
    name,
    url,
    logo,
    ...options?.extra,
  }
}

export interface WebSiteSchemaOptions {
  baseUrl: string
  name?: string
  description?: string
  /** Optional: SearchAction for sitelinks search box. */
  searchAction?: {
    target: string
    queryInput: string
  }
}

/** Build WebSite schema (use on homepage or key entry pages). */
export function buildWebSiteSchema(options: WebSiteSchemaOptions): object {
  const { baseUrl, name = 'Gymdues', description, searchAction } = options
  const schema: Record<string, unknown> = {
    '@context': CONTEXT,
    '@type': 'WebSite',
    name,
    url: baseUrl,
    publisher: buildOrganizationSchema(baseUrl),
  }
  if (description) schema.description = description
  if (searchAction) {
    schema.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: searchAction.target,
      },
      'query-input': searchAction.queryInput,
    }
  }
  return schema
}

export interface DatasetSchemaOptions {
  baseUrl: string
  name: string
  description: string
  pagePath?: string
  totalGyms?: number
  totalStates?: number
  license?: string
}

/** Build Dataset schema for data listing pages. */
export function buildDatasetSchema(options: DatasetSchemaOptions): object {
  const url = options.pagePath
    ? resolveUrl(options.baseUrl, options.pagePath)
    : resolveUrl(options.baseUrl, '/gymsdata/')
  return {
    '@context': CONTEXT,
    '@type': 'Dataset',
    name: options.name,
    description: options.description,
    url,
    license: options.license ?? 'https://creativecommons.org/licenses/by/4.0/',
    creator: buildOrganizationSchema(options.baseUrl),
  }
}

export interface WebPageSchemaOptions {
  baseUrl: string
  name: string
  description: string
  path: string
  breadcrumbs?: BreadcrumbItem[]
}

/** Build WebPage schema (checkout, success, cancel, about, etc.). */
export function buildWebPageSchema(options: WebPageSchemaOptions): object {
  const url = resolveUrl(options.baseUrl, options.path)
  const schema: Record<string, unknown> = {
    '@context': CONTEXT,
    '@type': 'WebPage',
    name: options.name,
    description: options.description,
    url,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Gymdues',
      url: options.baseUrl,
    },
  }
  if (options.breadcrumbs && options.breadcrumbs.length > 0) {
    schema.breadcrumb = buildBreadcrumbSchema(options.breadcrumbs, options.baseUrl)
  }
  return schema
}

export interface FAQSchemaItem {
  question: string
  answer: string
}

/** Build FAQPage schema. */
export function buildFAQPageSchema(
  faqs: FAQSchemaItem[],
  options: { baseUrl: string; name?: string; path?: string }
): object {
  const schema: Record<string, unknown> = {
    '@context': CONTEXT,
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
  if (options.name) schema.name = options.name
  if (options.path) schema.url = resolveUrl(options.baseUrl, options.path)
  return schema
}

export interface ItemListItem {
  name: string
  url: string
}

/** Build ItemList schema (for list/catalog pages). */
export function buildItemListSchema(
  items: ItemListItem[],
  options: {
    baseUrl: string
    name?: string
    description?: string
    path?: string
  }
): object {
  const schema: Record<string, unknown> = {
    '@context': CONTEXT,
    '@type': 'ItemList',
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: resolveUrl(options.baseUrl, item.url),
    })),
  }
  if (options.name) schema.name = options.name
  if (options.description) schema.description = options.description
  if (options.path) schema.url = resolveUrl(options.baseUrl, options.path)
  return schema
}

/** Build Article schema (for blog posts). */
export function buildArticleSchema(options: {
  baseUrl: string
  path: string
  headline: string
  description?: string
  datePublished?: string
  dateModified?: string
  author?: string
  image?: string
}): object {
  const url = resolveUrl(options.baseUrl, options.path)
  return {
    '@context': CONTEXT,
    '@type': 'Article',
    headline: options.headline,
    url,
    ...(options.description && { description: options.description }),
    ...(options.datePublished && { datePublished: options.datePublished }),
    ...(options.dateModified && { dateModified: options.dateModified }),
    ...(options.author && {
      author: { '@type': 'Person', name: options.author },
    }),
    ...(options.image && { image: options.image }),
    publisher: buildOrganizationSchema(options.baseUrl),
  }
}
