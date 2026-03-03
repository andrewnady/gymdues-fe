import { cookies } from 'next/headers'
import type { BuyDatasetFormData } from '@/components/buy-dataset-modal'
import { CheckoutClient } from './checkout-client'

const ORDER_COOKIE = 'gymdues_order'

export default async function GymsdataCheckoutPage() {
  const cookieStore = await cookies()
  const orderCookie = cookieStore.get(ORDER_COOKIE)
  let initialOrderFromCookie: BuyDatasetFormData | null = null
  if (orderCookie?.value) {
    try {
      const parsed = JSON.parse(orderCookie.value) as BuyDatasetFormData
      if (parsed?.name && parsed?.email && parsed?.company) {
        initialOrderFromCookie = parsed
      }
    } catch {
      // ignore invalid cookie
    }
  }

  return <CheckoutClient initialOrderFromCookie={initialOrderFromCookie} />
}
