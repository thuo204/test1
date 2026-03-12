'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CourseCard } from './course-card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface FeaturedCoursesProps {
  courses: any[];
}

export function FeaturedCourses({ courses }: FeaturedCoursesProps) {
  if (courses.length === 0) return null;

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-display text-4xl font-bold mb-2">Featured Courses</h2>
            <p className="text-muted-foreground">Hand-picked courses to kickstart your journey</p>
          </div>
          <Link href="/courses">
            <Button variant="outline">
              View all <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
