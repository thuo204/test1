import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { formatPrice } from '@/lib/utils';
import { CourseEnrollButton } from '@/components/courses/course-enroll-button';
import { LessonList } from '@/components/courses/lesson-list';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Users, Star, BarChart } from 'lucide-react';

interface CoursePageProps {
  params: { slug: string };
}

async function getCourse(slug: string) {
  return db.course.findUnique({
    where: { slug, published: true },
    include: {
      lessons: {
        where: { published: true },
        orderBy: { order: 'asc' },
      },
      _count: { select: { enrollments: true } },
    },
  });
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const course = await getCourse(params.slug);
  if (!course) return { title: 'Course Not Found' };
  return {
    title: course.title,
    description: course.description,
    openGraph: {
      title: course.title,
      description: course.description,
      images: course.thumbnail ? [course.thumbnail] : [],
    },
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const course = await getCourse(params.slug);
  if (!course) notFound();

  const user = await getCurrentUser();
  const enrollment = user
    ? await db.enrollment.findUnique({
        where: { userId_courseId: { userId: user.id, courseId: course.id } },
      })
    : null;

  const totalDuration = course.lessons.reduce((acc, l) => acc + l.duration, 0);
  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-foreground text-background py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-primary/20 text-primary-foreground">
                  {course.level}
                </Badge>
                {course.featured && (
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                    Featured
                  </Badge>
                )}
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-background">
                {course.title}
              </h1>
              <p className="text-background/70 text-lg mb-8">{course.description}</p>

              <div className="flex flex-wrap gap-6 mb-8 text-sm text-background/60">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{course.lessons.length} lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{hours}h {minutes}m</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{course._count.enrollments} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart className="h-4 w-4" />
                  <span>{course.level}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-background">
                  {formatPrice(course.price)}
                </div>
                <CourseEnrollButton
                  courseId={course.id}
                  courseSlug={course.slug}
                  price={course.price}
                  enrolled={!!enrollment}
                  userId={user?.id}
                />
              </div>
            </div>

            {course.thumbnail && (
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="font-display text-3xl font-bold mb-6">Course Content</h2>
            <LessonList
              lessons={course.lessons}
              courseSlug={course.slug}
              enrolled={!!enrollment}
            />
          </div>
          <div>
            <div className="sticky top-8 rounded-2xl border bg-card p-6">
              <h3 className="font-semibold text-lg mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
