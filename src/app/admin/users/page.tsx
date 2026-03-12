import { Metadata } from 'next';
import { db } from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';

export const metadata: Metadata = { title: 'Manage Users' };

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { enrollments: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground">{users.length} registered users</p>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">User</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Role</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Enrollments</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-xs">
                        {getInitials(user.name ?? user.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name ?? 'No name'}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <Badge
                    variant={user.role === 'ADMIN' ? 'destructive' : user.role === 'INSTRUCTOR' ? 'default' : 'secondary'}
                  >
                    {user.role}
                  </Badge>
                </td>
                <td className="p-4">{user._count.enrollments}</td>
                <td className="p-4 text-muted-foreground text-sm">{formatDate(user.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
