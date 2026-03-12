'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { blogPostSchema, type BlogPostInput } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface BlogPostFormProps {
  authorId: string;
  post?: {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    thumbnail: string | null;
    published: boolean;
    featured: boolean;
    tags: string[];
  };
}

export function BlogPostForm({ authorId, post }: BlogPostFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [tagsInput, setTagsInput] = useState(post?.tags.join(', ') ?? '');

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<BlogPostInput>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: post?.title ?? '',
      excerpt: post?.excerpt ?? '',
      content: post?.content ?? '',
      thumbnail: post?.thumbnail ?? '',
      published: post?.published ?? false,
      featured: post?.featured ?? false,
      tags: post?.tags ?? [],
    },
  });

  const published = watch('published');
  const featured = watch('featured');

  const onSubmit = async (data: BlogPostInput) => {
    setLoading(true);
    const payload = {
      ...data,
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      thumbnail: data.thumbnail || undefined,
    };

    try {
      const url = post ? `/api/blog/${post.id}` : '/api/blog';
      const method = post ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast({ title: post ? 'Post updated!' : 'Post created!' } as any);
        router.push('/admin/blog');
        router.refresh();
      } else {
        const result = await res.json();
        toast({ title: 'Error', description: result.error, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Something went wrong.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="rounded-xl border bg-card p-6 space-y-5">
        <div className="space-y-2">
          <Label>Title *</Label>
          <Input placeholder="Post title" {...register('title')} />
          {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Excerpt *</Label>
          <Textarea placeholder="Brief summary..." rows={3} {...register('excerpt')} />
          {errors.excerpt && <p className="text-sm text-destructive">{errors.excerpt.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Content *</Label>
          <Textarea placeholder="Write your post content here... (Markdown supported)" rows={12} {...register('content')} />
          {errors.content && <p className="text-sm text-destructive">{errors.content.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Thumbnail URL</Label>
          <Input placeholder="https://..." {...register('thumbnail')} />
        </div>

        <div className="space-y-2">
          <Label>Tags (comma-separated)</Label>
          <Input
            placeholder="nextjs, tutorial, typescript"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <Switch checked={published} onCheckedChange={(v) => setValue('published', v)} />
            <Label>Published</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={featured} onCheckedChange={(v) => setValue('featured', v)} />
            <Label>Featured</Label>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" loading={loading}>
          {post ? 'Update Post' : 'Create Post'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
