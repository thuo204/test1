import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDate, getInitials } from '@/lib/utils';
import { Eye } from 'lucide-react';

interface BlogPostCardProps {
  post: {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    thumbnail: string | null;
    tags: string[];
    views: number;
    createdAt: Date;
    author: { name: string | null; avatar: string | null };
  };
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="rounded-2xl border bg-card overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
        {post.thumbnail && (
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}

        <div className="p-6 flex flex-col flex-1">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
            ))}
          </div>

          <h3 className="font-display text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2 flex-1">
            {post.title}
          </h3>

          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{post.excerpt}</p>

          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarImage src={post.author.avatar ?? ''} />
                <AvatarFallback className="text-xs">{getInitials(post.author.name ?? 'A')}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs font-medium">{post.author.name}</p>
                <p className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="h-3 w-3" />
              {post.views}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
