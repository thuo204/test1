'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

interface AdSlot {
  id: string;
  name: string;
  placement: string;
  imageUrl: string | null;
  linkUrl: string | null;
  active: boolean;
}

interface AdSlotManagerProps {
  ads: AdSlot[];
}

export function AdSlotManager({ ads }: AdSlotManagerProps) {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    placement: 'hero',
    imageUrl: '',
    linkUrl: '',
  });

  const handleCreate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast({ title: 'Ad slot created!' } as any);
        setShowForm(false);
        setForm({ name: '', placement: 'hero', imageUrl: '', linkUrl: '' });
      }
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Create New Ad Slot</h3>
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Ad Slot
        </Button>
      </div>

      {showForm && (
        <div className="rounded-xl border bg-card p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Hero Banner"
              />
            </div>
            <div className="space-y-2">
              <Label>Placement</Label>
              <Input
                value={form.placement}
                onChange={(e) => setForm({ ...form, placement: e.target.value })}
                placeholder="hero, sidebar, footer"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label>Link URL</Label>
            <Input
              value={form.linkUrl}
              onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div className="flex gap-3">
            <Button onClick={handleCreate} loading={loading}>Create</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
}
