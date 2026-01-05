'use client'

import { useEffect, useState } from 'react'
import { getPostComments, type BlogComment } from '@/lib/comments-api'
import { MessageSquare, User } from 'lucide-react'

interface CommentsListProps {
  postSlug: string
  refreshKey?: number
}

export function CommentsList({ postSlug, refreshKey }: CommentsListProps) {
  const [comments, setComments] = useState<BlogComment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadComments = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getPostComments(postSlug)
      setComments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load comments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadComments()
  }, [postSlug, refreshKey])

  if (loading) {
    return <div className='text-center py-8 text-muted-foreground'>Loading comments...</div>
  }

  if (error) {
    return <div className='text-center py-8 text-destructive'>{error}</div>
  }

  if (comments.length === 0) {
    return (
      <div className='space-y-6'>
        <h2 className='text-2xl font-bold mb-6'>Comments</h2>
        <div className='text-center py-8 text-muted-foreground'>
          <MessageSquare className='h-12 w-12 mx-auto mb-4 opacity-50' />
          <p>No comments yet. Be the first to comment!</p>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold mb-6'>
        Comments {comments.length > 0 ? `(${comments.length})` : ''}
      </h2>
      {comments.map((comment) => (
        <div key={comment.id} className='border-b pb-6 last:border-0'>
          <div className='flex items-start gap-4'>
            <div className='rounded-full bg-primary/10 p-2 flex-shrink-0'>
              <User className='h-5 w-5 text-primary' />
            </div>
            <div className='flex-1'>
              <div className='flex items-center gap-2 mb-2'>
                <h4 className='font-semibold'>{comment.name}</h4>
                <span className='text-xs text-muted-foreground'>
                  {new Date(comment.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className='text-muted-foreground leading-relaxed whitespace-pre-wrap'>
                {comment.comment}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
