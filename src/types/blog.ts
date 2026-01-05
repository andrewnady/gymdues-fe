export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  summary: string
  content: string
  author: {
    id: number
    name: string
    avatar?: string
  }
  published_at: string
  updated_at?: string
  featured_images: {
    id: number
    path: string
    alt: string
  }[]
  categories: {
    id: number
    name: string
    slug: string
  }[]
}
