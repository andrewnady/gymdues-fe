import { getAllBlogPosts } from '@/data/mock-blog';
import { BlogCard } from '@/components/blog-card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Fitness Blog</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
            Expert tips, guides, and insights to help you on your fitness journey
          </p>
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search blog posts..."
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No blog posts found. Try adjusting your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}

