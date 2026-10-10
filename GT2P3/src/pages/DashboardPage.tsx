import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Star, UserCheck, Compass, Home } from 'lucide-react';

export default function DashboardPage() {
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      {/* Welcome Header */}
      <div className="flex flex-col gap-1 border-b border-[var(--border-card)] pb-4">
        <h2 className="text-3xl font-serif font-bold text-[var(--text-primary)]">Personal Dashboard</h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
          Manage your library reservations, reading records, and account credentials.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 shadow-sm flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--text-muted)]">Books Reserved</span>
            <BookOpen className="w-4 h-4 text-[var(--accent-indigo)]" />
          </div>
          <div className="text-3xl font-serif text-[var(--accent-indigo)]">12</div>
          <div className="text-xs text-[var(--text-secondary)]">3 ready for pickup</div>
        </div>
        <div className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 shadow-sm flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--text-muted)]">Reviews Written</span>
            <Star className="w-4 h-4 text-[var(--accent-emerald)]" />
          </div>
          <div className="text-3xl font-serif text-[var(--accent-emerald)]">5</div>
          <div className="text-xs text-[var(--text-secondary)]">2 pending moderation</div>
        </div>
        <div className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 shadow-sm flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--text-muted)]">Account Status</span>
            <UserCheck className="w-4 h-4 text-[var(--accent-emerald)]" />
          </div>
          <div className="text-xl font-medium text-[var(--text-primary)] mt-1">Active Member</div>
          <div className="text-xs text-[var(--text-secondary)] mt-1">
            <span className="inline-block w-2 h-2 rounded-full bg-[var(--accent-emerald)] mr-2"></span>
            Good standing
          </div>
        </div>
      </div>

      {/* Quick Actions & Session Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 shadow-sm">
          <h3 className="text-xl font-serif text-[var(--text-primary)] mb-4">Quick Actions</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => navigate('/catalog')}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent-indigo)] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-opacity-90 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Browse Catalog</span>
            </button>
            <button 
              onClick={() => navigate('/')}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border-card)] bg-[var(--bg-secondary)] px-4 py-3 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-primary)] cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>

        {/* Session Info */}
        <div className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 shadow-sm">
          <h3 className="text-xl font-serif text-[var(--text-primary)] mb-4">Session Info</h3>
          <div className="rounded-xl bg-[var(--bg-secondary)] p-4 text-sm text-[var(--text-secondary)] flex flex-col gap-3">
            <div>
              <span className="font-medium text-[var(--text-primary)] block mb-1">Status</span>
              <div className="flex items-center gap-2">
                <span className={`inline-block w-2.5 h-2.5 rounded-full ${token ? 'bg-[var(--accent-emerald)]' : 'bg-[var(--accent-amber)]'}`}></span>
                <span>{token ? 'Authenticated' : 'No active session'}</span>
              </div>
            </div>
            {token && (
              <div>
                <span className="font-medium text-[var(--text-primary)] block mb-1">Token ID</span>
                <span className="font-mono text-xs text-[var(--text-muted)] break-all bg-[var(--bg-primary)] px-2 py-1 rounded border border-[var(--border-card)] inline-block">
                  {token}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
