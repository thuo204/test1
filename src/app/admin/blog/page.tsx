import { Metadata } from 'next';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { Plus, Pencil } from 'lucide-react';

export const metadata: Metadata = { title: 'Manage Blog' };

export default async function AdminBlogPage() {
  const posts = await db.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { name: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Blog Posts</h1>
          <p className="text-muted-foreground">{posts.length} posts total</p>
        </div>
        <Link href="/admin/blog/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Title</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Author</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Views</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Created</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <p className="font-medium">{post.title}</p>
                  <p className="text-sm text-muted-foreground truncate max-w-xs">{post.excerpt}</p>
                </td>
                <td className="p-4 text-sm">{post.author.name}</td>
                <td className="p-4">{post.views}</td>
                <td className="p-4">
                  <Badge variant={post.published ? 'default' : 'secondary'}>
                    {post.published ? 'Published' : 'Draft'}
                  </Badge>
                </td>
                <td className="p-4 text-muted-foreground text-sm">{formatDate(post.createdAt)}</td>
                <td className="p-4">
                  <Link href={`/admin/blog/${post.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
