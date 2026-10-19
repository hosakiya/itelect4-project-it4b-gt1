import { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BookOpen, Star, UserCheck, Compass, Home, Clock, CheckCircle2, XCircle, Calendar, ArrowRight } from 'lucide-react';
import { getBooks, getReservations, getReviews, cancelReservation } from '../api/client';
import { useAuthStore } from '../store/authStore';

export default function DashboardPage() {
  const token = useAuthStore((state) => state.token);
  const userName = useAuthStore((state) => state.userName);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'cancelled'>('all');

  const { data: books = [], isLoading: booksLoading } = useQuery({ queryKey: ['books'], queryFn: getBooks });
  const { data: reservations = [], isLoading: reservationsLoading } = useQuery({
    queryKey: ['reservations'],
    queryFn: getReservations,
    enabled: Boolean(token),
  });
  const { data: reviews = [] } = useQuery({ queryKey: ['reviews'], queryFn: getReviews });

  const cancelMutation = useMutation({
    mutationFn: ({ reservationId }: { reservationId: number | string }) =>
      cancelReservation(reservationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
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

  // Backend already filters reservations for the authenticated user
  const userReservations = useMemo(() => {
    return [...reservations].sort(
      (a, b) => new Date(b.reservedAt).getTime() - new Date(a.reservedAt).getTime()
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

  if (booksLoading || reservationsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-10 h-10 border-3 border-[var(--border-card)] border-t-[var(--accent-indigo)] rounded-full animate-spin" />
        <p className="text-sm font-medium text-[var(--text-muted)]">Loading your personal dashboard...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      {/* ── Welcome Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-card)] pb-5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)]">
            Student Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Welcome back, <span className="font-semibold text-[var(--accent-indigo)]">{userName || 'Student'}</span> • Manage your active library reservations
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/catalog')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--accent-indigo)] text-white text-xs font-semibold hover:opacity-90 transition shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Compass className="w-4 h-4" />
          <span>Reserve Another Book</span>
        </button>
      </div>

      {/* ── Live Stats Section ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Books Reserved */}
        <div className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Active Holds</span>
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-indigo)]/10 text-[var(--accent-indigo)] flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <div className="text-4xl font-serif font-bold text-[var(--text-primary)] tracking-tight">
              {activeReservations.length}
            </div>
          </div>
          <div className="mt-3 text-xs text-[var(--text-secondary)] pt-3 border-t border-[var(--border-card)] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-emerald)]" />
            <span>{approvedCount} ready for pickup • {pendingCount} pending</span>
          </div>
        </div>

        {/* Reviews Written */}
        <div className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Reviews Given</span>
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-emerald)]/10 text-[var(--accent-emerald)] flex items-center justify-center">
                <Star className="w-4 h-4" />
              </div>
            </div>
            <div className="text-4xl font-serif font-bold text-[var(--text-primary)] tracking-tight">
              {reviews.length}
            </div>
          </div>
          <div className="mt-3 text-xs text-[var(--text-secondary)] pt-3 border-t border-[var(--border-card)]">
            Verified borrower feedback
          </div>
        </div>

        {/* Account Standing */}
        <div className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Account Standing</span>
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-emerald)]/10 text-[var(--accent-emerald)] flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-serif font-bold text-[var(--text-primary)] tracking-tight mt-1">
              Active Member
            </div>
          </div>
          <div className="mt-3 text-xs text-[var(--text-secondary)] pt-3 border-t border-[var(--border-card)] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-emerald)]" />
            <span>Good standing • DLSL Registry Verified</span>
          </div>
        </div>
      </div>

      {/* ── My Reserved Books Live Section ── */}
      <section className="rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-card)] pb-4">
          <div>
            <h3 className="text-xl font-serif font-bold text-[var(--text-primary)]">
              My Book Reservations
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Updates in real-time as you reserve titles from the library catalog
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 bg-[var(--bg-secondary)] p-1 rounded-full border border-[var(--border-card)]">
            <button
              type="button"
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
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
              className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
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
              className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                filterStatus === 'cancelled'
                  ? 'bg-[var(--accent-indigo)] text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Cancelled
            </button>
          </div>
        </div>

        {/* Reservations Cards List */}
        {!token ? (
          <div className="rounded-2xl border border-dashed border-[var(--border-card)] bg-[var(--bg-secondary)]/50 p-12 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-[var(--text-muted)] mx-auto" strokeWidth={1.5} />
            <h4 className="text-base font-serif font-bold text-[var(--text-primary)]">
              Authentication Required
            </h4>
            <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
              Please log in to your library account to view and manage your active reservations.
            </p>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--accent-indigo)] text-white text-xs font-semibold hover:opacity-90 transition cursor-pointer"
            >
              <span>Log In</span>
            </button>
          </div>
        ) : displayedReservations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border-card)] bg-[var(--bg-secondary)]/50 p-12 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-[var(--text-muted)] mx-auto" strokeWidth={1.5} />
            <h4 className="text-base font-serif font-bold text-[var(--text-primary)]">
              No reservations found
            </h4>
            <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
              You don't have any reservations in this filter. Explore the catalog to request titles for pickup.
            </p>
            <button
              type="button"
              onClick={() => navigate('/catalog')}
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--accent-indigo)] text-white text-xs font-semibold hover:opacity-90 transition cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Browse 50 Catalog Books</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedReservations.map((res) => {
              const book = booksMap.get(String(res.bookId));
              const isCancelled = res.status === 'cancelled';
              const isApproved = res.status === 'approved';
              const isPending = res.status === 'pending';

              const reservedDate = new Date(res.reservedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

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
                  className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-5 shadow-xs hover:border-[var(--border-card-hover)] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Book & Reservation Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--accent-indigo)]/10 text-[var(--accent-indigo)] flex items-center justify-center shrink-0 mt-0.5">
                      <BookOpen className="w-6 h-6" strokeWidth={2} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold font-mono text-[var(--text-muted)]">
                          Hold #{res.id}
                        </span>
                        {book?.genre && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--bg-secondary)] text-[var(--accent-indigo)]">
                            {book.genre}
                          </span>
                        )}
                        {/* Status Badge */}
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            isApproved
                              ? 'bg-[var(--accent-emerald)]/10 text-[var(--accent-emerald)]'
                              : isPending
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {isApproved && <CheckCircle2 className="w-3 h-3" />}
                          {isPending && <Clock className="w-3 h-3" />}
                          {isCancelled && <XCircle className="w-3 h-3" />}
                          <span className="capitalize">{res.status}</span>
                        </span>
                      </div>

                      <h4 className="text-base font-serif font-bold text-[var(--text-primary)]">
                        {book?.title ?? `Book ID #${res.bookId}`}
                      </h4>
                      <p className="text-xs text-[var(--text-muted)]">
                        {book?.author ? `by ${book.author}` : 'DLSL Library Catalog'}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-secondary)] pt-1">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[var(--text-muted)]" />
                          <span>Reserved on {reservedDate}</span>
                        </span>
                        {deadlineDate && (
                          <span className="inline-flex items-center gap-1 font-medium text-[var(--accent-amber)]">
                            <Clock className="w-3 h-3" />
                            <span>Pickup deadline: {deadlineDate}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2.5 self-end md:self-center shrink-0 pt-2 md:pt-0">
                    <Link
                      to={`/books/${res.bookId}`}
                      className="px-4 py-2 rounded-xl text-xs font-semibold border border-[var(--border-card)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition flex items-center gap-1.5"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {!isCancelled && (
                      <button
                        type="button"
                        disabled={cancelMutation.isPending}
                        onClick={() =>
                          cancelMutation.mutate({
                            reservationId: res.id,
                          })
                        }
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition cursor-pointer disabled:opacity-50"
                        title="Cancel this reservation hold"
                      >
                        {cancelMutation.isPending ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Quick Actions & Session Info ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 shadow-xs space-y-4">
          <h3 className="text-lg font-serif font-bold text-[var(--text-primary)]">Quick Actions</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/catalog')}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent-indigo)] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:opacity-90 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Browse Catalog</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border-card)] bg-[var(--bg-secondary)] px-4 py-2.5 text-xs font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-card-hover)] cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>

        {/* Session Info */}
        <div className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 shadow-xs space-y-4">
          <h3 className="text-lg font-serif font-bold text-[var(--text-primary)]">Session Credentials</h3>
          <div className="rounded-xl bg-[var(--bg-secondary)] p-3.5 text-xs text-[var(--text-secondary)] flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="font-medium text-[var(--text-primary)]">Auth Status</span>
              <div className="flex items-center gap-1.5">
                <span className={`inline-block w-2 h-2 rounded-full ${token ? 'bg-[var(--accent-emerald)]' : 'bg-[var(--accent-amber)]'}`} />
                <span className="font-semibold">{token ? 'Authenticated' : 'No active session'}</span>
              </div>
            </div>
            {token && (
              <div className="flex items-center justify-between pt-2 border-t border-[var(--border-card)]">
                <span className="font-medium text-[var(--text-primary)]">Token</span>
                <span className="font-mono text-[11px] text-[var(--text-muted)] bg-[var(--bg-card)] px-2 py-0.5 rounded border border-[var(--border-card)]">
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
