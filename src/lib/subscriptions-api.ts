import { getApiBaseUrl } from './api-config'

const API_BASE_URL = getApiBaseUrl()

export interface SubscriptionRequest {
  pricing_id: number
  name: string
  phone: string
  notes?: string
}

/**
 * Submits a subscription request for a gym address plan.
 * Uses pricing_id to associate the lead with the specific plan at a location.
 */
export async function submitSubscriptionRequest(
  data: SubscriptionRequest
): Promise<{ message: string; id?: number }> {
  const apiKey = process.env.NEXT_PUBLIC_GYM_API_KEY || ''

  const response = await fetch(`${API_BASE_URL}/api/v1/gym-address-plan-subscriptions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': apiKey,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      (errorData as { message?: string }).message ||
        `Failed to submit subscription: ${response.status} ${response.statusText}`
    )
  }

  return response.json()
}
