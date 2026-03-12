import { Metadata } from 'next';
import { db } from '@/lib/db';
import { BlogPostCard } from '@/components/blog/blog-post-card';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Articles, tutorials, and insights on modern web development.',
};

export default async function BlogPage() {
  const posts = await db.blogPost.findMany({
    where: { published: true },
    include: { author: { select: { name: true, avatar: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="font-display text-5xl font-bold mb-4">Blog</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Articles, tutorials, and insights from our team of experts.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          No posts published yet.
        </div>
      )}
    </div>
  );
}
