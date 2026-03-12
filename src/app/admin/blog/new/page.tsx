import { Metadata } from 'next';
import { getCurrentUser } from '@/lib/auth';
import { BlogPostForm } from '@/components/admin/blog-post-form';

export const metadata: Metadata = { title: 'New Blog Post' };

export default async function NewBlogPostPage() {
  const user = await getCurrentUser();
  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">New Blog Post</h1>
        <p className="text-muted-foreground">Write and publish a new blog post</p>
      </div>
      <BlogPostForm authorId={user!.id} />
    </div>
  );
}
