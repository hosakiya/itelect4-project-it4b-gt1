import type { User } from '../types';

interface UserCardProps {
  user: User;
  variant?: 'default' | 'compact';
}

function UserCard({ user, variant = 'default' }: UserCardProps) {
  const compact = variant === 'compact';

  const roleColors =
    user.role === 'student'
      ? 'bg-[var(--accent-emerald)]/10 text-[var(--accent-emerald)] border-[var(--accent-emerald)]/20'
      : user.role === 'librarian'
      ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20'
      : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';

  const initials = (user.name || 'User')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  return (
    <article className={`group rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-4 sm:p-5 shadow-xs hover:border-[var(--accent-emerald)]/40 hover:shadow-md transition-all duration-200 ${compact ? 'p-3.5' : ''}`}>
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-2xl font-bold text-sm bg-gradient-to-br from-[var(--accent-emerald)]/15 to-[var(--accent-indigo)]/10 text-[var(--accent-emerald)] border border-[var(--accent-emerald)]/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm sm:text-base font-bold text-[var(--text-primary)] truncate group-hover:text-[var(--accent-emerald)] transition-colors">
              {user.name}
            </h4>
            <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full border ${roleColors} capitalize shrink-0`}>
              {user.role}
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">{user.email}</p>
        </div>
      </div>

      {!compact && user.score !== undefined && (
        <div className="flex items-center justify-between bg-[var(--bg-secondary)] px-3 py-2 rounded-xl mt-3 text-xs border border-[var(--border-card)]">
          <span className="text-[var(--text-muted)] font-medium">Borrower Rating</span>
          <span className="font-bold text-[var(--accent-emerald)]">{user.score}/100</span>
        </div>
      )}
    </article>
  );
}

export default UserCard;
