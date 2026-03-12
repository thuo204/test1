import { Metadata } from 'next';
import { db } from '@/lib/db';
import { AnalyticsChart } from '@/components/analytics/analytics-chart';

export const metadata: Metadata = { title: 'Analytics' };

export default async function AdminAnalyticsPage() {
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const [totalEvents, topPaths, eventsByDay] = await Promise.all([
    db.analytics.count({ where: { createdAt: { gte: since } } }),
    db.analytics.groupBy({
      by: ['path'],
      _count: { id: true },
      where: { createdAt: { gte: since } },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    }),
    db.analytics.groupBy({
      by: ['createdAt'],
      _count: { id: true },
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: 'asc' },
      take: 30,
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Platform usage over the last 30 days</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">Total Events</p>
          <p className="font-display text-3xl font-bold mt-1">{totalEvents.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">Unique Pages</p>
          <p className="font-display text-3xl font-bold mt-1">{topPaths.length}</p>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">Avg / Day</p>
          <p className="font-display text-3xl font-bold mt-1">{Math.round(totalEvents / 30)}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <AnalyticsChart data={eventsByDay} />

        <div className="rounded-xl border bg-card p-6">
          <h3 className="font-semibold mb-4">Top Pages</h3>
          <div className="space-y-3">
            {topPaths.map((p) => (
              <div key={p.path} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-mono truncate">{p.path}</p>
                </div>
                <div className="text-sm font-semibold">{p._count.id}</div>
                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(p._count.id / (topPaths[0]?._count.id ?? 1)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {topPaths.length === 0 && (
              <p className="text-sm text-muted-foreground">No data yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
