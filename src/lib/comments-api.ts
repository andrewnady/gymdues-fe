const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export interface BlogComment {
  id: number
  name: string
  email?: string
  comment: string
  created_at: string
}

/**
 * Fetches all approved comments for a blog post
 */
export async function getPostComments(postSlug: string): Promise<BlogComment[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/posts/${postSlug}/comments`, {
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch comments: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching comments:', error)
    return []
  }
}

/**
 * Submits a new comment for a blog post
 */
export async function submitComment(
  postSlug: string,
  commentData: {
    name: string
    email: string
    comment: string
  }
): Promise<{ message: string; comment?: BlogComment }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/posts/${postSlug}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.message || `Failed to submit comment: ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error submitting comment:', error)
    throw error
  }
}

