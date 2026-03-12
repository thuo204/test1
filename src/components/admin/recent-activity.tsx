import { formatDate } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';

interface RecentActivityProps {
  recentUsers: Array<{ id: string; name: string | null; email: string; createdAt: Date; role: string }>;
  recentEnrollments: Array<{
    id: string;
    createdAt: Date;
    user: { name: string | null; email: string };
    course: { title: string };
  }>;
}

export function RecentActivity({ recentUsers, recentEnrollments }: RecentActivityProps) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <h3 className="font-semibold mb-4">Recent Enrollments</h3>
      <div className="space-y-4">
        {recentEnrollments.map((enrollment) => (
          <div key={enrollment.id} className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {getInitials(enrollment.user.name ?? enrollment.user.email)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{enrollment.user.name ?? enrollment.user.email}</p>
              <p className="text-xs text-muted-foreground truncate">enrolled in {enrollment.course.title}</p>
            </div>
            <div className="text-xs text-muted-foreground flex-shrink-0">
              {formatDate(enrollment.createdAt)}
            </div>
          </div>
        ))}
        {recentEnrollments.length === 0 && (
          <p className="text-sm text-muted-foreground">No recent enrollments</p>
        )}
      </div>
    </div>
  );
}
