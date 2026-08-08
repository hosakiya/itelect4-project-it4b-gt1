import type { User } from '../types';

interface UserCardProps {
  user: User;
  variant?: 'default' | 'compact';
}

function UserCard({ user, variant = 'default' }: UserCardProps) {
  const compact = variant === 'compact';

  const roleColors =
    user.role === 'student'
      ? 'bg-[rgba(78,112,85,0.12)] text-[var(--accent-emerald)]'
      : user.role === 'librarian'
      ? 'bg-[rgba(109,140,156,0.12)] text-[var(--accent-sky)]'
      : 'bg-[rgba(140,98,57,0.12)] text-[var(--accent-violet)]';

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <article className={`user-card p-4 transition-all duration-200 ${compact ? 'sm:p-3' : ''}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full font-bold text-xs bg-[var(--bg-secondary)] text-[var(--accent-indigo)] border border-[var(--border-card)] shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Account Holder</p>
          <h3 className="text-base font-bold text-[var(--text-primary)] truncate">{user.name}</h3>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full ${roleColors} capitalize`}>
          {user.role}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-sm text-[var(--text-secondary)] truncate pl-[3.25rem]">{user.email}</p>
        {!compact && (
          <div className="flex items-center justify-between bg-[var(--bg-secondary)] p-2 rounded-md ml-[3.25rem]">
            <span className="text-xs font-medium text-[var(--text-muted)]">Performance Score</span>
            <span className="text-xs font-bold text-[var(--text-primary)]">{user.score}/100</span>
          </div>
        )}
      </div>
    </article>
  );
}

export default UserCard;
