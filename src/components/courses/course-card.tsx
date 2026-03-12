import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { BookOpen, Users } from 'lucide-react';

interface CourseCardProps {
  course: {
    id: string;
    slug: string;
    title: string;
    description: string;
    thumbnail: string | null;
    price: number;
    level: string;
    tags: string[];
    _count?: { lessons: number; enrollments: number };
  };
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.slug}`} className="group block">
      <div className="rounded-2xl border bg-card overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="relative aspect-video bg-muted overflow-hidden">
          {course.thumbnail ? (
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/20 to-purple-500/20">
              <BookOpen className="h-12 w-12 text-primary/40" />
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
              {course.level}
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            <div className="bg-background/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold">
              {formatPrice(course.price)}
            </div>
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-display text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {course.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{course.description}</p>

          {course._count && (
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" />
                {course._count.lessons} lessons
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {course._count.enrollments} students
              </div>
            </div>
          )}

          {course.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {course.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-primary/10 text-primary rounded-full px-2.5 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
