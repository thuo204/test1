import { CourseCard } from './course-card';

interface CourseGridProps {
  courses: any[];
}

export function CourseGrid({ courses }: CourseGridProps) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-lg">No courses found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
