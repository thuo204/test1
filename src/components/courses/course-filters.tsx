'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { useState } from 'react';

export function CourseFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') ?? '');

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/courses?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch('');
    router.push('/courses');
  };

  const hasFilters = searchParams.toString().length > 0;

  return (
    <div className="flex flex-wrap items-center gap-4 mb-8">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') updateFilters('search', search);
          }}
          className="pl-9"
        />
      </div>

      <Select
        value={searchParams.get('level') ?? 'all'}
        onValueChange={(v) => updateFilters('level', v)}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="All levels" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All levels</SelectItem>
          <SelectItem value="BEGINNER">Beginner</SelectItem>
          <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
          <SelectItem value="ADVANCED">Advanced</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
