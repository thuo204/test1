'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Lock } from 'lucide-react';

interface CourseEnrollButtonProps {
  courseId: string;
  courseSlug: string;
  price: number;
  enrolled: boolean;
  userId?: string;
}

export function CourseEnrollButton({
  courseId,
  courseSlug,
  price,
  enrolled,
  userId,
}: CourseEnrollButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  if (enrolled) {
    return (
      <Button size="lg" onClick={() => router.push(`/learn/${courseSlug}`)}>
        <BookOpen className="h-5 w-5 mr-2" />
        Continue Learning
      </Button>
    );
  }

  const handleEnroll = async () => {
    if (!userId) {
      router.push('/auth/login');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${courseId}/enroll`, { method: 'POST' });
      const data = await res.json();

      if (res.ok) {
        toast({ title: 'Enrolled!', description: 'You can now start learning.', variant: 'default' });
        router.refresh();
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Something went wrong.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button size="lg" onClick={handleEnroll} loading={loading}>
      {price === 0 ? (
        <>
          <BookOpen className="h-5 w-5 mr-2" />
          Enroll for Free
        </>
      ) : (
        <>
          <Lock className="h-5 w-5 mr-2" />
          Enroll Now
        </>
      )}
    </Button>
  );
}
