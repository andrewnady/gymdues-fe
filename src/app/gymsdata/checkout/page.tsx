import { getListPage, getStatePage, getCityPage } from '@/lib/gymsdata-api'
import { buildWebPageSchema } from '@/lib/schema-builder'
import { JsonLdSchema } from '@/components/json-ld-schema'
import type { PriceFromServer } from '../_components/buy-data-price'
import { CheckoutClient } from './checkout-client'
import { getGymsdataBasePath } from '../_lib/get-gymsdata-base-path'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gymdues.com'

export interface CheckoutScope {
  state?: string
  city?: string
  type?: string
}

export interface CheckoutScopeDetails {
  /** Human-readable label, e.g. "Full US dataset", "California", "Los Angeles, California", "Gym" */
  scopeLabel: string
  /** Short description of what's included */
  scopeDescription: string
}

async function getCheckoutData(scope: CheckoutScope): Promise<{
  priceFromServer: PriceFromServer | null
  scopeDetails: CheckoutScopeDetails
}> {
  const { state, city, type } = scope
  const defaultScopeDetails: CheckoutScopeDetails = {
    scopeLabel: 'Full US dataset',
    scopeDescription: 'Complete list of Fitness, Gym, and Health Services in the United States',
  }

  if (state && city) {
    const cityPage = await getCityPage(state, city)
    if (cityPage) {
      const cityName = cityPage.city || city
      const stateName = cityPage.stateName || state
      return {
        priceFromServer: cityPage.formattedPrice
          ? { formattedPrice: cityPage.formattedPrice, price: cityPage.price, rowCount: cityPage.totalGyms }
          : null,
        scopeDetails: {
          scopeLabel: `${cityName}, ${stateName}`,
          scopeDescription: `Fitness, Gym, and Health Services in ${cityName}, ${stateName}`,
        },
      }
    }
  }
  if (state) {
    const statePage = await getStatePage(state, { include_cities: false })
    if (statePage) {
      const stateName = statePage.stateName || state
      return {
        priceFromServer: statePage.formattedPrice
          ? { formattedPrice: statePage.formattedPrice, price: statePage.price, rowCount: statePage.totalGyms }
          : null,
        scopeDetails: {
          scopeLabel: stateName,
          scopeDescription: `All Fitness, Gym, and Health Services in ${stateName}`,
        },
      }
    }
  }
  const listPage = await getListPage()
  if (type) {
    const types = listPage?.types ?? []
    const typeItem = types.find((t) => (t.type ?? '').trim() === (type ?? '').trim())
    if (typeItem) {
      return {
        priceFromServer: typeItem.formattedPrice
          ? { formattedPrice: typeItem.formattedPrice, price: typeItem.price, rowCount: typeItem.count }
          : null,
        scopeDetails: {
          scopeLabel: type,
          scopeDescription: `${type} — business type listings across the US`,
        },
      }
    }
  }
  return {
    priceFromServer: listPage?.formattedPrice
      ? { formattedPrice: listPage.formattedPrice, price: listPage.price, rowCount: listPage.totalGyms }
      : null,
    scopeDetails: defaultScopeDetails,
  }
}

type PageProps = { searchParams: Promise<{ state?: string; city?: string; type?: string }> }

export default async function GymsdataCheckoutPage({ searchParams }: PageProps) {
  const params = await searchParams
  const state = typeof params.state === 'string' ? params.state.trim() || undefined : undefined
  const city = typeof params.city === 'string' ? params.city.trim() || undefined : undefined
  const type = typeof params.type === 'string' ? params.type.trim() || undefined : undefined
  const scope: CheckoutScope = { state, city, type }
  const [base, { priceFromServer, scopeDetails }] = await Promise.all([
    getGymsdataBasePath(),
    getCheckoutData(scope),
  ])

  const checkoutSchema = buildWebPageSchema({
    baseUrl: siteUrl,
    name: 'Checkout – US Gym Leads Dataset | Gymdues',
    description: 'Complete your gym dataset purchase. Enter your details and proceed to secure payment.',
    path: '/gymsdata/checkout',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Gym database', url: '/gymsdata' },
      { name: 'Checkout', url: '/gymsdata/checkout' },
    ],
  })

  return (
    <>
      <JsonLdSchema data={checkoutSchema} />
      <CheckoutClient
        scope={scope}
        priceFromServer={priceFromServer}
        scopeDetails={scopeDetails}
        base={base}
      />
    </>
  )
}
