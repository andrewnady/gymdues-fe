'use client'

import { useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { CommentForm } from '@/components/comment-form'
import { CommentsList } from '@/components/comments-list'

interface BlogCommentsSectionProps {
  postSlug: string
}

export function BlogCommentsSection({ postSlug }: BlogCommentsSectionProps) {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleCommentSubmitted = () => {
    // Refresh comments list after successful submission
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <>
      <Separator />

      {/* Comments Section */}
      <div>
        <CommentsList postSlug={postSlug} refreshKey={refreshKey} />
      </div>

      <Separator />

      {/* Comment Form */}
      <div>
        <h2 className='text-2xl font-bold mb-6'>Leave a Comment</h2>
        <CommentForm onSuccess={handleCommentSubmitted} />
      </div>
    </>
  )
}
