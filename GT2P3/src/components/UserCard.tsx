import type { User } from '../types';

interface UserCardProps {
  user: User;
  variant?: 'default' | 'compact';
}

function UserCard({ user, variant = 'default' }: UserCardProps) {
  const compact = variant === 'compact';

  const roleColors =
    user.role === 'student'
      ? 'bg-emerald-100 text-emerald-700'
      : user.role === 'librarian'
      ? 'bg-sky-100 text-sky-700'
      : 'bg-violet-100 text-violet-700';

  return (
    <article className={`user-card rounded-lg border p-4 bg-[var(--bg-card)] border-[var(--border-card)] text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-card-hover)] shadow-sm hover:shadow-md transition-all duration-200 ${compact ? 'sm:p-3' : ''}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-muted)]">Account Holder</p>
          <h3 className="mt-1 text-lg font-bold text-[var(--text-primary)] truncate">{user.name}</h3>
        </div>
        <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full ${roleColors} capitalize`}>{user.role}</span>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-sm text-[var(--text-secondary)] truncate">{user.email}</p>
        {!compact && (
          <div className="flex items-center justify-between bg-[var(--bg-secondary)] p-2 rounded-md">
            <span className="text-sm font-medium text-[var(--text-muted)]">Performance Score</span>
            <span className="text-sm font-bold text-[var(--text-primary)]">{user.score}/100</span>
          </div>
        )}
      </div>
    </article>
  );
}

export default UserCard;
