import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { formatDate, calculateProgress } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = { title: 'My Profile' };

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const enrollments = await db.enrollment.findMany({
    where: { userId: user.id },
    include: {
      course: {
        include: {
          lessons: { where: { published: true }, select: { id: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const progressData = await db.lessonProgress.findMany({
    where: { userId: user.id, completed: true },
    select: { lessonId: true },
  });
  const completedIds = new Set(progressData.map((p) => p.lessonId));

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="flex items-start gap-6 mb-12">
        <Avatar className="h-20 w-20 text-2xl">
          <AvatarFallback>{getInitials(user.name ?? user.email)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-display text-3xl font-bold">{user.name ?? 'Learner'}</h1>
          <p className="text-muted-foreground">{user.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary">{user.role}</Badge>
            <span className="text-sm text-muted-foreground">Joined {formatDate(user.createdAt)}</span>
          </div>
        </div>
      </div>

      <h2 className="font-display text-2xl font-bold mb-6">My Courses ({enrollments.length})</h2>

      {enrollments.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>You haven&apos;t enrolled in any courses yet.</p>
          <Link href="/courses" className="text-primary hover:underline mt-2 inline-block">Browse courses</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {enrollments.map((enrollment) => {
            const totalLessons = enrollment.course.lessons.length;
            const completedLessons = enrollment.course.lessons.filter((l) => completedIds.has(l.id)).length;
            const progress = calculateProgress(completedLessons, totalLessons);

            return (
              <Link key={enrollment.id} href={`/courses/${enrollment.course.slug}`} className="block rounded-2xl border bg-card p-6 hover:shadow-md transition-shadow">
                <h3 className="font-semibold mb-1">{enrollment.course.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {completedLessons}/{totalLessons} lessons completed
                </p>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">{progress}% complete</p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
