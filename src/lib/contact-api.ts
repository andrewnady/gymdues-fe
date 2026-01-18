const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export interface ContactSubmission {
  name: string
  email: string
  subject: string
  message: string
}

/**
 * Submits a contact form submission
 */
export async function submitContactForm(
  submissionData: ContactSubmission
): Promise<{ message: string; id?: number }> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GYM_API_KEY || ''
    
    const response = await fetch(`${API_BASE_URL}/api/v1/contact-submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey,
      },
      body: JSON.stringify(submissionData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.message || `Failed to submit contact form: ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error submitting contact form:', error)
    throw error
  }
}

