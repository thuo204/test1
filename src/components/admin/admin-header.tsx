import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { getInitials } from '@/lib/utils';

interface AdminHeaderProps {
  user: { name: string | null; email: string; avatar: string | null };
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="h-14 border-b bg-background flex items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar ?? ''} />
            <AvatarFallback className="text-xs">{getInitials(user.name ?? user.email)}</AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
