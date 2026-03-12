import { Metadata } from 'next';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice, formatDate } from '@/lib/utils';
import { Plus, Pencil } from 'lucide-react';

export const metadata: Metadata = { title: 'Manage Courses' };

export default async function AdminCoursesPage() {
  const courses = await db.course.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { lessons: true, enrollments: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Courses</h1>
          <p className="text-muted-foreground">{courses.length} courses total</p>
        </div>
        <Link href="/admin/courses/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Course
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Course</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Level</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Price</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Students</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Lessons</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <div>
                    <p className="font-medium">{course.title}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(course.createdAt)}</p>
                  </div>
                </td>
                <td className="p-4">
                  <Badge variant="outline">{course.level}</Badge>
                </td>
                <td className="p-4 font-medium">{formatPrice(course.price)}</td>
                <td className="p-4">{course._count.enrollments}</td>
                <td className="p-4">{course._count.lessons}</td>
                <td className="p-4">
                  <Badge variant={course.published ? 'default' : 'secondary'}>
                    {course.published ? 'Published' : 'Draft'}
                  </Badge>
                </td>
                <td className="p-4">
                  <Link href={`/admin/courses/${course.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {courses.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No courses yet. Create your first course!
          </div>
        )}
      </div>
    </div>
  );
}
