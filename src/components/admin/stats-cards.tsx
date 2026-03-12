import { Users, BookOpen, GraduationCap, FileText } from 'lucide-react';

interface StatsCardsProps {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalPosts: number;
}

export function StatsCards({ totalUsers, totalCourses, totalEnrollments, totalPosts }: StatsCardsProps) {
  const stats = [
    { label: 'Total Users', value: totalUsers, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950' },
    { label: 'Published Courses', value: totalCourses, icon: GraduationCap, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950' },
    { label: 'Total Enrollments', value: totalEnrollments, icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950' },
    { label: 'Blog Posts', value: totalPosts, icon: FileText, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-xl border bg-card p-6">
          <div className={`inline-flex p-2 rounded-lg ${stat.bg} mb-4`}>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </div>
          <div className="font-display text-3xl font-bold">{stat.value.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
