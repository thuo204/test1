'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { courseSchema, type CourseInput } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface CourseFormProps {
  course?: {
    id: string;
    title: string;
    description: string;
    thumbnail: string | null;
    price: number;
    level: string;
    published: boolean;
    featured: boolean;
    tags: string[];
  };
}

export function CourseForm({ course }: CourseFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [tagsInput, setTagsInput] = useState(course?.tags.join(', ') ?? '');

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CourseInput>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: course?.title ?? '',
      description: course?.description ?? '',
      thumbnail: course?.thumbnail ?? '',
      price: course?.price ?? 0,
      level: (course?.level as any) ?? 'BEGINNER',
      published: course?.published ?? false,
      featured: course?.featured ?? false,
      tags: course?.tags ?? [],
    },
  });

  const published = watch('published');
  const featured = watch('featured');
  const level = watch('level');

  const onSubmit = async (data: CourseInput) => {
    setLoading(true);
    const payload = {
      ...data,
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      thumbnail: data.thumbnail || undefined,
    };

    try {
      const url = course ? `/api/courses/${course.id}` : '/api/courses';
      const method = course ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        toast({ title: course ? 'Course updated!' : 'Course created!', variant: 'default' } as any);
        router.push('/admin/courses');
        router.refresh();
      } else {
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
          <Input placeholder="Course title" {...register('title')} />
          {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Description *</Label>
          <Textarea placeholder="Course description" rows={4} {...register('description')} />
          {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Thumbnail URL</Label>
          <Input placeholder="https://..." {...register('thumbnail')} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Price (USD)</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="0 for free"
              {...register('price', { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-2">
            <Label>Level</Label>
            <Select value={level} onValueChange={(v) => setValue('level', v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BEGINNER">Beginner</SelectItem>
                <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                <SelectItem value="ADVANCED">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Tags (comma-separated)</Label>
          <Input
            placeholder="nextjs, react, typescript"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <Switch
              checked={published}
              onCheckedChange={(v) => setValue('published', v)}
            />
            <Label>Published</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={featured}
              onCheckedChange={(v) => setValue('featured', v)}
            />
            <Label>Featured</Label>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" loading={loading}>
          {course ? 'Update Course' : 'Create Course'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
