'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, LayoutDashboard, FileText, Users, BarChart, Megaphone, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/courses', label: 'Courses', icon: GraduationCap },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart },
  { href: '/admin/ads', label: 'Ad Slots', icon: Megaphone },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 border-r bg-background flex flex-col">
      <div className="p-4 border-b">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
            <BookOpen className="h-4 w-4 text-primary-foreground" />
          </div>
          LearnHub
        </Link>
        <p className="text-xs text-muted-foreground mt-1 pl-9">Admin Panel</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              pathname === item.href || pathname.startsWith(item.href + '/')
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          ← Back to site
        </Link>
      </div>
    </aside>
  );
}
