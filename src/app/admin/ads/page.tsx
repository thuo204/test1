import { Metadata } from 'next';
import { db } from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { AdSlotManager } from '@/components/admin/ad-slot-manager';

export const metadata: Metadata = { title: 'Ad Slots' };

export default async function AdminAdsPage() {
  const ads = await db.adSlot.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Ad Slots</h1>
        <p className="text-muted-foreground">Manage advertising placements</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ads.map((ad) => (
          <div key={ad.id} className="rounded-xl border bg-card p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold">{ad.name}</h3>
                <p className="text-sm text-muted-foreground">Placement: {ad.placement}</p>
              </div>
              <Badge variant={ad.active ? 'default' : 'secondary'}>
                {ad.active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm mt-4">
              <div>
                <p className="text-muted-foreground">Impressions</p>
                <p className="font-semibold text-lg">{ad.impressions.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Clicks</p>
                <p className="font-semibold text-lg">{ad.clicks.toLocaleString()}</p>
              </div>
            </div>
            {ad.impressions > 0 && (
              <div className="mt-2 text-sm text-muted-foreground">
                CTR: {((ad.clicks / ad.impressions) * 100).toFixed(2)}%
              </div>
            )}
          </div>
        ))}
      </div>

      <AdSlotManager ads={ads} />
    </div>
  );
}
