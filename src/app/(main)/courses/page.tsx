import { Metadata } from 'next';
import { CourseGrid } from '@/components/courses/course-grid';
import { CourseFilters } from '@/components/courses/course-filters';
import { db } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Courses',
  description: 'Browse our complete catalog of premium web development courses.',
};

interface CoursesPageProps {
  searchParams: { level?: string; search?: string; tag?: string };
}

async function getCourses(filters: CoursesPageProps['searchParams']) {
  const where: Record<string, unknown> = { published: true };

  if (filters.level) where.level = filters.level;
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ];
  }
  if (filters.tag) {
    where.tags = { has: filters.tag };
  }

  return db.course.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { lessons: true, enrollments: true } },
    },
  });
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const courses = await getCourses(searchParams);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="font-display text-5xl font-bold mb-4">
          All Courses
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Explore our curated library of professional development courses.
        </p>
      </div>
      <CourseFilters />
      <CourseGrid courses={courses} />
    </div>
  );
}
