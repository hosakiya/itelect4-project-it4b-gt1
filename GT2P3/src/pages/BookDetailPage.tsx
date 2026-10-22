import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, BookX, LogIn, BookOpen, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';
import { getBook, createReservation } from '../api/client';
import useAuthStore from '../store/authStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reservationSchema, type ReservationFormValues } from '../schemas/reservationSchema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function BookDetailPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  const userName = useAuthStore((state) => state.userName);

  const { data: book, isLoading, isError } = useQuery({
    queryKey: ['book', bookId],
    queryFn: () => getBook(bookId!),
    enabled: Boolean(bookId),
  });

  const reservationMutation = useMutation({
    mutationFn: (data: { pickupDeadline: string }) => {
      let deadlineIso: string | undefined = undefined;
      if (data.pickupDeadline) {
        const d = new Date(data.pickupDeadline);
        if (!isNaN(d.getTime())) {
          deadlineIso = d.toISOString();
        }
      }
      return createReservation({
        bookId: String(bookId),
        pickupDeadline: deadlineIso,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      reset();
      alert("Reservation request submitted successfully! Check your Dashboard to track status.");
      navigate('/dashboard');
    },
    onError: (err: any) => {
      alert(err?.message || "Failed to submit reservation.");
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      pickupDeadline: '',
      agreeToTerms: false,
    },
  });

  const onSubmit = (data: ReservationFormValues) => {
    reservationMutation.mutate({
      pickupDeadline: data.pickupDeadline,
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 gap-4">
        <div className="w-12 h-12 border-3 border-[var(--border-card)] border-t-[var(--accent-emerald)] rounded-full animate-spin" />
        <p className="text-sm font-medium text-[var(--text-muted)]">Loading volume details...</p>
      </div>
    );
  }

  if (isError || !book) {
    return (
      <div className="w-full max-w-lg mx-auto rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] p-10 text-center shadow-sm space-y-4">
        <BookX className="w-12 h-12 text-[var(--accent-emerald)] mx-auto opacity-70" strokeWidth={1.5} />
        <h2 className="text-2xl font-serif font-bold text-[var(--text-primary)]">Volume Not Found</h2>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          The catalog volume you requested does not exist or may have been unlisted.
        </p>
        <Link
          to="/catalog"
          className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[var(--accent-indigo)] text-white text-xs font-semibold hover:bg-[var(--accent-indigo-hover)] transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  const isAvailable = book.availableCopies > 0;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Back Button Breadcrumb */}
      <Link
        to="/catalog"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--accent-emerald)] transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Catalog</span>
      </Link>

      {/* 2-Column Responsive Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Book Profile (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-card)] pb-4">
              <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-[var(--bg-secondary)] text-[var(--accent-emerald)] border border-[var(--border-card)] font-mono">
                {book.genre}
              </span>
              <span className="text-xs font-mono text-[var(--text-muted)]">
                Catalog Ref #{String(book.id).slice(-8)}
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[var(--text-primary)] tracking-tight leading-tight">
                {book.title}
              </h1>
              <p className="mt-1.5 text-sm sm:text-base font-medium text-[var(--text-muted)]">
                Authored by <span className="text-[var(--text-primary)] font-semibold">{book.author}</span>
              </p>
            </div>

            {/* Synopsis Container */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono">
                Volume Description & Synopsis
              </h3>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                {book.description}
              </p>
            </div>

            {/* Availability Indicator Card */}
            <div className="flex items-center justify-between rounded-2xl bg-[var(--bg-secondary)] p-4 sm:p-5 border border-[var(--border-card)]">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isAvailable ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">
                    {isAvailable ? 'Available for Checkout' : 'Temporarily Unavailable'}
                  </h4>
                  <p className="text-xs text-[var(--text-muted)]">
                    DLSL Main Library • Circulation Shelf
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-serif font-bold text-[var(--text-primary)]">
                  {book.availableCopies}
                </span>
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Copies in Stock</p>
              </div>
            </div>
          </div>

          {/* Academic Policies Card */}
          <div className="rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-serif font-bold text-[var(--text-primary)]">
              Circulation Rules for this Item
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[var(--text-secondary)]">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-card)]">
                <Clock className="w-4 h-4 text-[var(--accent-emerald)] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[var(--text-primary)]">7-Day Maximum Loan</p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Renewable once online via Dashboard.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-card)]">
                <ShieldCheck className="w-4 h-4 text-[var(--accent-emerald)] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[var(--text-primary)]">Student ID Required</p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Present DLSL ID upon physical claim.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Reservation Request Card (Span 1) */}
        <div className="lg:col-span-1 sticky top-28">
          <div className="rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 sm:p-7 shadow-md space-y-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-emerald)] font-mono">
                Reservation Desk
              </span>
              <h2 className="text-xl font-serif font-bold text-[var(--text-primary)] mt-0.5">
                Reserve Physical Copy
              </h2>
            </div>

            {!isAvailable ? (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center space-y-2">
                <AlertTriangle className="w-6 h-6 text-rose-500 mx-auto" />
                <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400">Currently Out of Stock</h4>
                <p className="text-[11px] text-rose-600/80 dark:text-rose-400/80">
                  All copies of this volume are currently on loan. Please check back later.
                </p>
              </div>
            ) : !token ? (
              <div className="rounded-2xl border border-dashed border-[var(--border-card)] bg-[var(--bg-secondary)] p-6 text-center space-y-3">
                <LogIn className="w-8 h-8 text-[var(--accent-emerald)] mx-auto opacity-70" />
                <h4 className="text-sm font-bold text-[var(--text-primary)]">Sign In Required</h4>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  You must be authenticated with your DLSL student or faculty account to reserve this volume.
                </p>
                <Link
                  to="/login"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-[var(--accent-indigo)] text-white text-xs font-semibold hover:bg-[var(--accent-indigo-hover)] transition shadow-xs"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Log In to Reserve</span>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="rounded-2xl bg-[var(--bg-secondary)] p-3.5 text-xs text-[var(--text-secondary)] border border-[var(--border-card)] flex items-center justify-between">
                  <span>Reserving as:</span>
                  <span className="font-bold text-[var(--accent-emerald)]">{userName || 'Member'}</span>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="pickupDeadline" className="text-xs font-semibold text-[var(--text-primary)]">
                    Scheduled Pickup Deadline
                  </Label>
                  <Input
                    id="pickupDeadline"
                    type="date"
                    className="w-full bg-[var(--bg-secondary)] text-sm rounded-xl"
                    {...register('pickupDeadline')}
                  />
                  {errors.pickupDeadline && (
                    <p className="text-xs text-rose-500 font-medium">{errors.pickupDeadline.message}</p>
                  )}
                  <p className="text-[10px] text-[var(--text-muted)]">
                    Pick a date when you will claim this book at the circulation desk.
                  </p>
                </div>

                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    id="agreeToTerms"
                    type="checkbox"
                    className="mt-1 rounded accent-[var(--accent-indigo)]"
                    {...register('agreeToTerms')}
                  />
                  <Label htmlFor="agreeToTerms" className="text-xs text-[var(--text-secondary)] leading-snug cursor-pointer select-none">
                    I agree to DLSL library reservation rules, return deadlines, and policies.
                  </Label>
                </div>
                {errors.agreeToTerms && (
                  <p className="text-xs text-rose-500 font-medium">{errors.agreeToTerms.message}</p>
                )}

                <Button
                  type="submit"
                  disabled={reservationMutation.isPending}
                  className="w-full h-11 rounded-2xl bg-[var(--accent-indigo)] hover:bg-[var(--accent-indigo-hover)] text-white text-xs font-semibold shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {reservationMutation.isPending ? 'Confirming hold...' : 'Confirm Book Hold'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
