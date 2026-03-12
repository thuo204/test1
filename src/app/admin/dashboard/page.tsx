import { Metadata } from 'next';
import { db } from '@/lib/db';
import { StatsCards } from '@/components/admin/stats-cards';
import { RecentActivity } from '@/components/admin/recent-activity';
import { AnalyticsChart } from '@/components/analytics/analytics-chart';

export const metadata: Metadata = { title: 'Admin Dashboard' };

async function getDashboardStats() {
  const [
    totalUsers,
    totalCourses,
    totalEnrollments,
    totalPosts,
    recentUsers,
    recentEnrollments,
    analyticsData,
  ] = await Promise.all([
    db.user.count(),
    db.course.count({ where: { published: true } }),
    db.enrollment.count(),
    db.blogPost.count({ where: { published: true } }),
    db.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    }),
    db.enrollment.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true } },
      },
    }),
    db.analytics.groupBy({
      by: ['createdAt'],
      _count: { id: true },
      orderBy: { createdAt: 'asc' },
      take: 30,
    }),
  ]);

  return {
    totalUsers,
    totalCourses,
    totalEnrollments,
    totalPosts,
    recentUsers,
    recentEnrollments,
    analyticsData,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your platform</p>
      </div>

      <StatsCards
        totalUsers={stats.totalUsers}
        totalCourses={stats.totalCourses}
        totalEnrollments={stats.totalEnrollments}
        totalPosts={stats.totalPosts}
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <AnalyticsChart data={stats.analyticsData} />
        <RecentActivity
          recentUsers={stats.recentUsers}
          recentEnrollments={stats.recentEnrollments}
        />
      </div>
    </div>
  );
}
