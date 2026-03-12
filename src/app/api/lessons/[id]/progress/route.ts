import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const body = await request.json();
  const completed = Boolean(body.completed);

  const progress = await db.lessonProgress.upsert({
    where: { userId_lessonId: { userId: session.userId, lessonId: params.id } },
    create: {
      userId: session.userId,
      lessonId: params.id,
      completed,
      completedAt: completed ? new Date() : null,
    },
    update: {
      completed,
      completedAt: completed ? new Date() : null,
    },
  });

  return NextResponse.json({ progress });
}
