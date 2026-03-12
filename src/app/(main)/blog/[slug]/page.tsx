import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';

interface BlogPostPageProps {
  params: { slug: string };
}

async function getPost(slug: string) {
  const post = await db.blogPost.findUnique({
    where: { slug, published: true },
    include: { author: { select: { name: true, avatar: true, bio: true } } },
  });
  if (post) {
    await db.blogPost.update({ where: { id: post.id }, data: { views: { increment: 1 } } });
  }
  return post;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.thumbnail ? [post.thumbnail] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <article className="container mx-auto px-4 py-16 max-w-4xl">
      <header className="mb-12">
        <div className="flex gap-2 mb-4">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-6 leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-muted-foreground">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.author.avatar ?? ''} />
            <AvatarFallback>{getInitials(post.author.name ?? 'A')}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-foreground">{post.author.name}</p>
            <p className="text-sm">{formatDate(post.createdAt)} · {post.views} views</p>
          </div>
        </div>
      </header>

      {post.thumbnail && (
        <div className="relative aspect-video rounded-2xl overflow-hidden mb-12">
          <Image src={post.thumbnail} alt={post.title} fill className="object-cover" priority />
        </div>
      )}

      <div className="prose prose-slate dark:prose-invert max-w-none">
        {post.content.split('\n').map((paragraph, i) => {
          if (paragraph.startsWith('# ')) {
            return <h1 key={i}>{paragraph.slice(2)}</h1>;
          }
          if (paragraph.startsWith('## ')) {
            return <h2 key={i}>{paragraph.slice(3)}</h2>;
          }
          if (paragraph.startsWith('### ')) {
            return <h3 key={i}>{paragraph.slice(4)}</h3>;
          }
          if (paragraph.trim() === '') return <br key={i} />;
          return <p key={i}>{paragraph}</p>;
        })}
      </div>

      {post.author.bio && (
        <div className="mt-16 p-8 rounded-2xl bg-muted/50 border">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={post.author.avatar ?? ''} />
              <AvatarFallback>{getInitials(post.author.name ?? 'A')}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-lg mb-1">{post.author.name}</p>
              <p className="text-muted-foreground">{post.author.bio}</p>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
