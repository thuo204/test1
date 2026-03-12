import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { CourseForm } from '@/components/admin/course-form';

export const metadata: Metadata = { title: 'Edit Course' };

export default async function EditCoursePage({ params }: { params: { id: string } }) {
  const course = await db.course.findUnique({ where: { id: params.id } });
  if (!course) notFound();

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">Edit Course</h1>
        <p className="text-muted-foreground">Update course details</p>
      </div>
      <CourseForm course={course} />
    </div>
  );
}
