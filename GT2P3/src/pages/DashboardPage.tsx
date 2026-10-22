import { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  BookOpen,
  Compass,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Trash2,
  Sparkles
} from 'lucide-react';
import { getBooks, getReservations, cancelReservation } from '../api/client';
import { useAuthStore } from '../store/authStore';

export default function DashboardPage() {
  const token = useAuthStore((state) => state.token);
  const userName = useAuthStore((state) => state.userName);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'cancelled'>('all');

  const { data: books = [], isLoading: booksLoading } = useQuery({
    queryKey: ['books'],
    queryFn: getBooks,
  });

  const { data: reservations = [], isLoading: reservationsLoading } = useQuery({
    queryKey: ['reservations'],
    queryFn: getReservations,
    enabled: Boolean(token),
  });

  const cancelMutation = useMutation({
    mutationFn: ({ reservationId }: { reservationId: number | string }) =>
      cancelReservation(reservationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      alert('Reservation successfully cancelled.');
    },
    onError: (err: any) => {
      alert(err?.message || 'Failed to cancel reservation.');
    },
  });

  const booksMap = useMemo(() => {
    const map = new Map<string, (typeof books)[0]>();
    books.forEach((b) => {
      map.set(String(b.id), b);
      if ((b as any).legacyId) {
        map.set(String((b as any).legacyId), b);
      }
    });
    return map;
  }, [books]);

  // Sort user reservations by date descending
  const userReservations = useMemo(() => {
    return [...reservations].sort(
      (a, b) =>
        (new Date(b.reservedAt).getTime() || 0) -
        (new Date(a.reservedAt).getTime() || 0)
    );
  }, [reservations]);

  const activeReservations = useMemo(
    () => userReservations.filter((r) => r.status !== 'cancelled'),
    [userReservations]
  );
  const pendingCount = useMemo(
    () => userReservations.filter((r) => r.status === 'pending').length,
    [userReservations]
  );
  const approvedCount = useMemo(
    () => userReservations.filter((r) => r.status === 'approved').length,
    [userReservations]
  );

  const displayedReservations = useMemo(() => {
    if (filterStatus === 'active') {
      return userReservations.filter((r) => r.status !== 'cancelled');
    }
    if (filterStatus === 'cancelled') {
      return userReservations.filter((r) => r.status === 'cancelled');
    }
    return userReservations;
  }, [userReservations, filterStatus]);

  const handleCancelClick = (resId: number | string, bookTitle?: string) => {
    if (window.confirm(`Are you sure you want to cancel the hold for "${bookTitle || 'this book'}"?`)) {
      cancelMutation.mutate({ reservationId: resId });
    }
  };

  if (booksLoading || reservationsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 gap-4">
        <div className="w-12 h-12 border-3 border-[var(--border-card)] border-t-[var(--accent-emerald)] rounded-full animate-spin" />
        <p className="text-sm font-medium text-[var(--text-muted)]">
          Loading your personal library dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* ── Welcome Header Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-card)] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--accent-emerald)] mb-1 font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Student Registry Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)] tracking-tight">
            Personal Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
            Welcome back, <span className="font-semibold text-[var(--accent-emerald)]">{userName || 'Student'}</span> • Track and manage your active library holds
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/catalog')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--accent-indigo)] hover:bg-[var(--accent-indigo-hover)] text-white text-xs font-semibold shadow-xs transition-all self-start sm:self-auto cursor-pointer"
        >
          <Compass className="w-4 h-4" />
          <span>Browse 50 Catalog Books</span>
        </button>
      </div>

      {/* ── Live Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Active Holds */}
        <div className="rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono">
                Active Holds
              </span>
              <div className="w-9 h-9 rounded-xl bg-[var(--accent-emerald)]/10 text-[var(--accent-emerald)] flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[var(--text-primary)] tracking-tight">
              {activeReservations.length}
            </div>
          </div>
          <div className="mt-3 text-xs text-[var(--text-secondary)] pt-3 border-t border-[var(--border-card)] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-emerald)]" />
            <span>{approvedCount} ready for pickup • {pendingCount} queued</span>
          </div>
        </div>

        {/* Total Reservations */}
        <div className="rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono">
                Total Requests
              </span>
              <div className="w-9 h-9 rounded-xl bg-[var(--accent-amber)]/10 text-[var(--accent-amber)] flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[var(--text-primary)] tracking-tight">
              {userReservations.length}
            </div>
          </div>
          <div className="mt-3 text-xs text-[var(--text-secondary)] pt-3 border-t border-[var(--border-card)]">
            Lifetime reservation history
          </div>
        </div>

        {/* Account Standing */}
        <div className="rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono">
                Account Status
              </span>
              <div className="w-9 h-9 rounded-xl bg-[var(--accent-emerald)]/10 text-[var(--accent-emerald)] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-serif font-bold text-[var(--text-primary)] tracking-tight mt-1">
              Active Learner
            </div>
          </div>
          <div className="mt-3 text-xs text-[var(--text-secondary)] pt-3 border-t border-[var(--border-card)] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-emerald)]" />
            <span>Good standing • DLSL Verified</span>
          </div>
        </div>
      </div>

      {/* ── Main Reservations Section Container ── */}
      <section className="rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-card)] pb-4">
          <div>
            <h3 className="text-xl font-serif font-bold text-[var(--text-primary)]">
              Your Book Holds & Requests
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Live status updates for reserved physical library volumes
            </p>
          </div>

          {/* Filter Pills Container */}
          <div className="flex items-center gap-1.5 bg-[var(--bg-secondary)] p-1 rounded-full border border-[var(--border-card)] self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setFilterStatus('all')}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                filterStatus === 'all'
                  ? 'bg-[var(--accent-indigo)] text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              All ({userReservations.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('active')}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                filterStatus === 'active'
                  ? 'bg-[var(--accent-indigo)] text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Active ({activeReservations.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('cancelled')}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                filterStatus === 'cancelled'
                  ? 'bg-[var(--accent-indigo)] text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Cancelled
            </button>
          </div>
        </div>

        {/* Reservations List */}
        {!token ? (
          <div className="rounded-2xl border border-dashed border-[var(--border-card)] bg-[var(--bg-secondary)]/50 p-12 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-[var(--text-muted)] mx-auto opacity-50" strokeWidth={1.5} />
            <h4 className="text-base font-serif font-bold text-[var(--text-primary)]">
              Authentication Required
            </h4>
            <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
              Please sign in to your library account to view your reservations and checkout activity.
            </p>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--accent-indigo)] text-white text-xs font-semibold hover:opacity-90 transition cursor-pointer"
            >
              <span>Sign In Now</span>
            </button>
          </div>
        ) : displayedReservations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border-card)] bg-[var(--bg-secondary)]/50 p-12 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-[var(--text-muted)] mx-auto opacity-50" strokeWidth={1.5} />
            <h4 className="text-base font-serif font-bold text-[var(--text-primary)]">
              No reservations in this filter
            </h4>
            <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
              You do not have any holds under this status. Browse the catalog to find and reserve academic titles.
            </p>
            <button
              type="button"
              onClick={() => navigate('/catalog')}
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--accent-indigo)] text-white text-xs font-semibold hover:opacity-90 transition cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Browse Catalog Titles</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedReservations.map((res) => {
              const book = booksMap.get(String(res.bookId));
              const isCancelled = res.status === 'cancelled';
              const isApproved = res.status === 'approved';
              const isPending = res.status === 'pending';

              const reservedDate = res.reservedAt
                ? new Date(res.reservedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Recent';

              const deadlineDate = res.pickupDeadline
                ? new Date(res.pickupDeadline).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : undefined;

              return (
                <div
                  key={res.id}
                  className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-5 shadow-xs hover:border-[var(--accent-emerald)]/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Book & Hold Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--accent-emerald)]/10 text-[var(--accent-emerald)] flex items-center justify-center shrink-0 mt-0.5">
                      <BookOpen className="w-6 h-6" strokeWidth={2} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold font-mono text-[var(--text-muted)]">
                          Hold #{String(res.id).slice(-6)}
                        </span>
                        {book?.genre && (
                          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[var(--bg-secondary)] text-[var(--accent-emerald)] font-mono">
                            {book.genre}
                          </span>
                        )}
                        {/* Status Badge */}
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            isApproved
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : isPending
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {isApproved && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {isPending && <Clock className="w-3.5 h-3.5" />}
                          {isCancelled && <XCircle className="w-3.5 h-3.5" />}
                          <span className="capitalize">{res.status}</span>
                        </span>
                      </div>

                      <h4 className="text-base font-serif font-bold text-[var(--text-primary)]">
                        {book?.title ?? `Book #${res.bookId}`}
                      </h4>
                      <p className="text-xs text-[var(--text-muted)]">
                        {book?.author ? `by ${book.author}` : 'DLSL Library Catalog'}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-secondary)] pt-1">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                          <span>Reserved: {reservedDate}</span>
                        </span>
                        {deadlineDate && (
                          <span className="inline-flex items-center gap-1.5 font-medium text-[var(--accent-amber)]">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Pickup deadline: {deadlineDate}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2.5 self-end md:self-center shrink-0 pt-2 md:pt-0">
                    <Link
                      to={`/books/${res.bookId}`}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-[var(--border-card)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--border-card)] transition flex items-center gap-1.5"
                    >
                      <span>Book Info</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {!isCancelled && (
                      <button
                        type="button"
                        disabled={cancelMutation.isPending}
                        onClick={() => handleCancelClick(res.id, book?.title)}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        title="Cancel this hold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Cancel Hold</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
