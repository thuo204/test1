'use client';

interface DataPoint {
  createdAt: Date;
  _count: { id: number };
}

interface AnalyticsChartProps {
  data: DataPoint[];
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  const maxCount = Math.max(...data.map((d) => d._count.id), 1);

  return (
    <div className="rounded-xl border bg-card p-6">
      <h3 className="font-semibold mb-4">Page Views (Last 30 days)</h3>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
          No analytics data yet
        </div>
      ) : (
        <div className="flex items-end gap-1 h-40">
          {data.slice(-30).map((d, i) => (
            <div
              key={i}
              className="flex-1 bg-primary/80 rounded-t hover:bg-primary transition-colors"
              style={{ height: `${(d._count.id / maxCount) * 100}%`, minHeight: 2 }}
              title={`${d._count.id} events`}
            />
          ))}
        </div>
      )}
      <div className="flex justify-between text-xs text-muted-foreground mt-2">
        <span>30 days ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}
