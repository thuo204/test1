import { Metadata } from 'next';
import { CourseForm } from '@/components/admin/course-form';

export const metadata: Metadata = { title: 'New Course' };

export default function NewCoursePage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">New Course</h1>
        <p className="text-muted-foreground">Create a new course for your students</p>
      </div>
      <CourseForm />
    </div>
  );
}
