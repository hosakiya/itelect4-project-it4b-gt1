import { useAuthStore } from '../store/authStore';

export default function DashboardPage() {
  const token = useAuthStore((state) => state.token);

  return (
    <div className="w-full max-w-3xl rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 shadow-sm">
      <h2 className="text-2xl font-serif italic text-[var(--text-primary)]">Dashboard</h2>
      <p className="mt-3 text-[var(--text-secondary)]">
        Protected area. Token status: <span className="font-semibold text-[var(--accent-indigo)]">{token ?? 'No active session'}</span>
      </p>
      <div className="mt-6 rounded-xl bg-[var(--bg-secondary)] p-4 text-sm text-[var(--text-secondary)]">
        This page is only available when a valid auth token exists.
      </div>
    </div>
  );
}
