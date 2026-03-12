import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const session = await getSession();
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
    const userAgent = request.headers.get('user-agent') ?? '';

    await db.analytics.create({
      data: {
        userId: session?.userId ?? null,
        event: body.event ?? 'pageview',
        path: body.path ?? '/',
        metadata: body.metadata ?? null,
        ip,
        userAgent,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false });
  }
}

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get('days') ?? '30');
  const since = new Date();
  since.setDate(since.getDate() - days);

  const [totalEvents, eventsByDay, topPaths] = await Promise.all([
    db.analytics.count({ where: { createdAt: { gte: since } } }),
    db.analytics.groupBy({
      by: ['createdAt'],
      _count: { id: true },
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: 'asc' },
    }),
    db.analytics.groupBy({
      by: ['path'],
      _count: { id: true },
      where: { createdAt: { gte: since } },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    }),
  ]);

  return NextResponse.json({ totalEvents, eventsByDay, topPaths });
}
