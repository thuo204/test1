import Link from 'next/link';
import { Lock, PlayCircle, CheckCircle } from 'lucide-react';
import { formatDuration } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface Lesson {
  id: string;
  slug: string;
  title: string;
  duration: number;
  free: boolean;
  order: number;
}

interface LessonListProps {
  lessons: Lesson[];
  courseSlug: string;
  enrolled: boolean;
}

export function LessonList({ lessons, courseSlug, enrolled }: LessonListProps) {
  return (
    <div className="space-y-2">
      {lessons.map((lesson, i) => {
        const accessible = enrolled || lesson.free;

        return (
          <div key={lesson.id} className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
              {i + 1}
            </div>

            <div className="flex-1 min-w-0">
              {accessible ? (
                <Link
                  href={`/learn/${courseSlug}/${lesson.slug}`}
                  className="font-medium hover:text-primary transition-colors"
                >
                  {lesson.title}
                </Link>
              ) : (
                <span className="font-medium text-muted-foreground">{lesson.title}</span>
              )}
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatDuration(lesson.duration)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {lesson.free && <Badge variant="outline" className="text-xs">Free</Badge>}
              {accessible ? (
                <PlayCircle className="h-5 w-5 text-primary" />
              ) : (
                <Lock className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
