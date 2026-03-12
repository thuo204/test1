'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CheckCircle, Circle, ChevronLeft, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { calculateProgress, cn } from '@/lib/utils';

interface LessonSidebarProps {
  course: { slug: string; title: string };
  lessons: Array<{ id: string; slug: string; title: string; order: number }>;
  currentLessonSlug: string;
  completedLessonIds: Set<string>;
}

export function LessonSidebar({
  course,
  lessons,
  currentLessonSlug,
  completedLessonIds,
}: LessonSidebarProps) {
  const [open, setOpen] = useState(true);
  const progress = calculateProgress(completedLessonIds.size, lessons.length);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-background border rounded-lg p-2 shadow-md"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <aside
        className={cn(
          'flex flex-col w-72 border-r bg-background overflow-hidden transition-all duration-300',
          !open && 'w-0 lg:w-72'
        )}
      >
        {/* Course header */}
        <div className="p-4 border-b flex-shrink-0">
          <Link href={`/courses/${course.slug}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-3">
            <ChevronLeft className="h-4 w-4" />
            Back to course
          </Link>
          <h2 className="font-semibold text-sm line-clamp-2">{course.title}</h2>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>{completedLessonIds.size}/{lessons.length} completed</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        </div>

        {/* Lessons */}
        <nav className="flex-1 overflow-y-auto p-2 scrollbar-thin">
          {lessons.map((lesson, i) => {
            const isCompleted = completedLessonIds.has(lesson.id);
            const isCurrent = lesson.slug === currentLessonSlug;

            return (
              <Link
                key={lesson.id}
                href={`/learn/${course.slug}/${lesson.slug}`}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors mb-1',
                  isCurrent
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent text-foreground'
                )}
              >
                {isCompleted ? (
                  <CheckCircle className={cn('h-4 w-4 flex-shrink-0', isCurrent ? 'text-primary-foreground' : 'text-green-500')} />
                ) : (
                  <Circle className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                )}
                <span className="flex-1 line-clamp-2 leading-tight">{lesson.title}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
