import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBook } from '../api/client';

export default function BookDetailPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const parsedId = Number(bookId ?? '0');
  const { data: book, isLoading, isError } = useQuery({
    queryKey: ['book', bookId],
    queryFn: () => getBook(parsedId),
    enabled: Number.isInteger(parsedId) && parsedId > 0,
  });

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
    <div className="w-full max-w-2xl rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 shadow-sm">
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
  );
}
