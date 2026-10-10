import { Link, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, BookX } from 'lucide-react';
import { getBook, createReservation } from '../api/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reservationSchema, type ReservationFormValues } from '../schemas/reservationSchema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function BookDetailPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const parsedId = Number(bookId ?? '0');
  const queryClient = useQueryClient();

  const { data: book, isLoading, isError } = useQuery({
    queryKey: ['book', parsedId],
    queryFn: () => getBook(parsedId),
    enabled: Number.isInteger(parsedId) && parsedId > 0,
  });

  const reservationMutation = useMutation({
    mutationFn: (data: { userId: number; pickupDeadline: string }) =>
      createReservation({
        userId: data.userId,
        bookId: parsedId,
        status: 'pending',
        reservedAt: new Date().toISOString(),
        pickupDeadline: new Date(data.pickupDeadline).toISOString(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      reset();
      alert("Reservation request submitted successfully!");
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
      userId: undefined,
      pickupDeadline: '',
      agreeToTerms: false,
    },
  });

  const onSubmit = (data: ReservationFormValues) => {
    reservationMutation.mutate({
      userId: data.userId,
      pickupDeadline: data.pickupDeadline,
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-10 h-10 border-3 border-[var(--border-card)] border-t-[var(--accent-indigo)] rounded-full animate-spin" />
        <p className="text-sm font-medium text-[var(--text-muted)]">Loading book details...</p>
      </div>
    );
  }

  if (isError || !book) {
    return (
      <div className="w-full max-w-xl mx-auto rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-8 text-center shadow-xs">
        <BookX className="w-10 h-10 text-[var(--accent-indigo)] mx-auto mb-3" strokeWidth={1.5} />
        <h2 className="text-2xl font-serif font-bold text-[var(--text-primary)]">Book not found</h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">No volume matches the selected catalog identifier.</p>
        <Link
          to="/catalog"
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--accent-indigo)] text-white text-xs font-semibold hover:opacity-90 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Link
        to="/catalog"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--accent-indigo)] transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Catalog</span>
      </Link>

      <div className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 sm:p-8 shadow-xs">
        <span className="inline-flex rounded-full bg-[var(--accent-indigo)]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--accent-indigo)]">
          {book.genre}
        </span>
        <h2 className="mt-4 text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)]">{book.title}</h2>
        <p className="mt-1 text-sm font-medium text-[var(--text-muted)]">by {book.author}</p>
        <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">{book.description}</p>
        <div className="mt-6 flex items-center justify-between rounded-xl bg-[var(--bg-secondary)] p-4 text-sm border border-[var(--border-card)]">
          <span className="font-medium text-[var(--text-secondary)]">Available copies in library</span>
          <strong className="text-base font-bold text-[var(--text-primary)]">{book.availableCopies}</strong>
        </div>
      </div>

      {book.availableCopies > 0 ? (
        <div className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 shadow-sm">
          <h3 className="text-xl font-serif italic text-[var(--text-primary)] mb-4">Request a Reservation</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="userId">Student/User ID</Label>
              <Input
                id="userId"
                type="number"
                placeholder="Enter your numeric User ID"
                className="mt-1"
                {...register('userId', { valueAsNumber: true })}
              />
              {errors.userId && (
                <p className="mt-1 text-xs text-red-500 font-medium">{errors.userId.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="pickupDeadline">Pickup Deadline</Label>
              <Input
                id="pickupDeadline"
                type="date"
                className="mt-1"
                {...register('pickupDeadline')}
              />
              {errors.pickupDeadline && (
                <p className="mt-1 text-xs text-red-500 font-medium">{errors.pickupDeadline.message}</p>
              )}
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input
                id="agreeToTerms"
                type="checkbox"
                className="mt-1 rounded border-gray-300 text-[var(--accent-indigo)] focus:ring-[var(--accent-indigo)]"
                {...register('agreeToTerms')}
              />
              <div>
                <Label htmlFor="agreeToTerms" className="text-sm select-none">
                  I agree to DLSL library reservation rules and policies.
                </Label>
                {errors.agreeToTerms && (
                  <p className="mt-1 text-xs text-red-500 font-medium">{errors.agreeToTerms.message}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={reservationMutation.isPending}
              className="w-full mt-4 bg-[var(--accent-indigo)] hover:bg-[var(--accent-indigo-hover)] text-white font-semibold py-2.5 rounded-full shadow transition-all duration-200 cursor-pointer"
            >
              {reservationMutation.isPending ? 'Submitting request...' : 'Confirm Reservation'}
            </Button>
          </form>
        </div>
      ) : (
        <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6 text-center text-sm text-red-800 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400">
          This book is currently out of stock and cannot be reserved.
        </div>
      )}
    </div>
  );
}

