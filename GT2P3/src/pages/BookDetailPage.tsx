import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
    return <div className="empty-state py-12">Loading book details...</div>;
  }

  if (isError || !book) {
    return (
      <div className="w-full max-w-xl rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 shadow-sm">
        <h2 className="text-2xl font-serif italic text-[var(--text-primary)]">Book not found</h2>
        <p className="mt-2 text-[var(--text-secondary)]">No book matches the selected URL parameter.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 shadow-sm">
        <span className="inline-flex rounded-full bg-[var(--bg-secondary)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--accent-indigo)]">
          {book.genre}
        </span>
        <h2 className="mt-4 text-3xl font-serif italic text-[var(--text-primary)]">{book.title}</h2>
        <p className="mt-2 text-[var(--text-secondary)]">By {book.author}</p>
        <p className="mt-6 text-[var(--text-secondary)]">{book.description}</p>
        <div className="mt-6 flex items-center justify-between rounded-xl bg-[var(--bg-secondary)] p-4 text-sm text-[var(--text-secondary)]">
          <span>Available copies</span>
          <strong className="text-[var(--text-primary)]">{book.availableCopies}</strong>
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

