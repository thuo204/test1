import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json();
  const type = body.type as 'click' | 'impression';

  if (type === 'click') {
    await db.adSlot.update({
      where: { id: params.id },
      data: { clicks: { increment: 1 } },
    });
  } else if (type === 'impression') {
    await db.adSlot.update({
      where: { id: params.id },
      data: { impressions: { increment: 1 } },
    });
  }

  return NextResponse.json({ success: true });
}
