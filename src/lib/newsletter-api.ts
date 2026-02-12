import { getApiBaseUrl } from './api-config'

const API_BASE_URL = getApiBaseUrl()

export interface NewsletterSubscription {
  email: string
}

/**
 * Submits a newsletter subscription
 */
export async function subscribeNewsletter(
  subscriptionData: NewsletterSubscription
): Promise<{ message: string; id?: number }> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GYM_API_KEY || ''
    
    const response = await fetch(`${API_BASE_URL}/api/v1/newsletter-subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey,
      },
      body: JSON.stringify(subscriptionData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.message || `Failed to subscribe: ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error subscribing to newsletter:', error)
    throw error
  }
}

