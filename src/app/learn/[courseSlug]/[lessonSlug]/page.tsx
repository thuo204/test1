import { notFound, redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { LessonViewer } from '@/components/courses/lesson-viewer';
import { LessonSidebar } from '@/components/courses/lesson-sidebar';

interface LessonPageProps {
  params: { courseSlug: string; lessonSlug: string };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const course = await db.course.findUnique({
    where: { slug: params.courseSlug, published: true },
    include: {
      lessons: {
        where: { published: true },
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!course) notFound();

  const lesson = course.lessons.find((l) => l.slug === params.lessonSlug);
  if (!lesson) notFound();

  // Check enrollment unless lesson is free
  if (!lesson.free) {
    const enrollment = await db.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId: course.id } },
    });
    if (!enrollment) redirect(`/courses/${course.slug}`);
  }

  // Get progress
  const progress = await db.lessonProgress.findMany({
    where: { userId: user.id, lessonId: { in: course.lessons.map((l) => l.id) } },
  });

  const completedLessonIds = new Set(
    progress.filter((p) => p.completed).map((p) => p.lessonId)
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <LessonSidebar
        course={course}
        lessons={course.lessons}
        currentLessonSlug={params.lessonSlug}
        completedLessonIds={completedLessonIds}
      />
      <LessonViewer
        lesson={lesson}
        courseSlug={params.courseSlug}
        userId={user.id}
        completed={completedLessonIds.has(lesson.id)}
        nextLesson={course.lessons[course.lessons.findIndex((l) => l.id === lesson.id) + 1]}
        prevLesson={course.lessons[course.lessons.findIndex((l) => l.id === lesson.id) - 1]}
      />
    </div>
  );
}
