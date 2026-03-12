'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, ChevronLeft, ChevronRight, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LessonViewerProps {
  lesson: { id: string; title: string; content: string; videoUrl: string | null };
  courseSlug: string;
  userId: string;
  completed: boolean;
  nextLesson?: { slug: string; title: string } | null;
  prevLesson?: { slug: string; title: string } | null;
}

export function LessonViewer({
  lesson,
  courseSlug,
  userId,
  completed: initialCompleted,
  nextLesson,
  prevLesson,
}: LessonViewerProps) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const toggleComplete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/lessons/${lesson.id}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed }),
      });

      if (res.ok) {
        setCompleted(!completed);
        toast({
          title: !completed ? 'Lesson completed!' : 'Marked as incomplete',
          variant: !completed ? 'success' : 'default',
        } as any);
      }
    } catch {
      toast({ title: 'Error', description: 'Could not update progress.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b px-6 py-4 flex items-center justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-xl font-bold truncate">{lesson.title}</h1>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <Button
            variant={completed ? 'default' : 'outline'}
            size="sm"
            onClick={toggleComplete}
            disabled={loading}
          >
            {completed ? (
              <><CheckCircle className="h-4 w-4 mr-2" />Completed</>
            ) : (
              <><Circle className="h-4 w-4 mr-2" />Mark Complete</>
            )}
          </Button>
        </div>
      </div>

      {/* Video */}
      {lesson.videoUrl && (
        <div className="aspect-video bg-black">
          <iframe
            src={lesson.videoUrl}
            className="w-full h-full"
            allowFullScreen
          />
        </div>
      )}

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          {lesson.content.split('\n').map((line, i) => {
            if (line.startsWith('# ')) return <h1 key={i}>{line.slice(2)}</h1>;
            if (line.startsWith('## ')) return <h2 key={i}>{line.slice(3)}</h2>;
            if (line.startsWith('### ')) return <h3 key={i}>{line.slice(4)}</h3>;
            if (line.startsWith('```')) return <code key={i} className="block bg-muted p-4 rounded-lg my-2">{line.slice(3)}</code>;
            if (line.trim() === '') return <br key={i} />;
            return <p key={i}>{line}</p>;
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t">
          {prevLesson ? (
            <Link href={`/learn/${courseSlug}/${prevLesson.slug}`}>
              <Button variant="outline">
                <ChevronLeft className="h-4 w-4 mr-2" />
                {prevLesson.title}
              </Button>
            </Link>
          ) : <div />}

          {nextLesson && (
            <Link href={`/learn/${courseSlug}/${nextLesson.slug}`}>
              <Button>
                {nextLesson.title}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
