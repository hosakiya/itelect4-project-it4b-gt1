import { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, Search, X, ArrowRight, SlidersHorizontal } from 'lucide-react';
import { createReservation, getBooks } from '../api/client';
import { useUiStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';

export default function CatalogPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const token = useAuthStore((state) => state.token);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [mobileGenreOpen, setMobileGenreOpen] = useState(false);
  const selectedGenre = useUiStore((state) => state.selectedGenre);
  const setSelectedGenre = useUiStore((state) => state.setSelectedGenre);
  const queryClient = useQueryClient();

  // Sync if URL query param changes
  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  const { data: books = [], isLoading, isError } = useQuery({
    queryKey: ['books'],
    queryFn: getBooks,
  });

  const reservationMutation = useMutation({
    mutationFn: (bookId: number | string) =>
      createReservation({
        bookId: String(bookId),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      alert('Reservation requested successfully! You can track it in your Dashboard.');
    },
    onError: (err: any) => {
      alert(err?.message || 'Failed to submit reservation.');
    },
  });

  const handleReserve = (bookId: number | string) => {
    if (!token) {
      alert('Please log in first to reserve this volume.');
      navigate('/login');
      return;
    }
    reservationMutation.mutate(bookId);
  };

  const genres = useMemo(
    () => ['All', ...Array.from(new Set(books.map((book) => book.genre))).sort()],
    [books]
  );

  const filteredBooks = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return books.filter((book) => {
      const matchesSearch =
        !query ||
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.genre.toLowerCase().includes(query);
      const matchesGenre = selectedGenre === 'All' || book.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    });
  }, [books, searchQuery, selectedGenre]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 gap-4">
        <div className="w-12 h-12 border-3 border-[var(--border-card)] border-t-[var(--accent-emerald)] rounded-full animate-spin" />
        <p className="text-sm font-medium text-[var(--text-muted)]">Loading library catalog...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] p-12 text-center max-w-lg mx-auto shadow-sm">
        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
        <h3 className="text-xl font-serif font-bold text-[var(--text-primary)]">Unable to Load Catalog</h3>
        <p className="text-sm text-[var(--text-muted)] mt-1.5 leading-relaxed">
          Please check your internet connection or verify the backend service status.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2.5 rounded-full bg-[var(--accent-indigo)] text-white text-xs font-semibold hover:opacity-90 transition cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* ── Catalog Top Toolbar & Search ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-[var(--border-card)] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--accent-emerald)] mb-1 font-mono">
            <span>Official Repository</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)] tracking-tight">
            Library Catalog
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5">
            Showing <span className="font-semibold text-[var(--text-primary)]">{filteredBooks.length}</span> titles
            {selectedGenre !== 'All' ? ` in ${selectedGenre}` : ''}
          </p>
        </div>

        {/* Search Input & Mobile Filter Toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, author, genre..."
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent-emerald)] focus:ring-2 focus:ring-[var(--accent-emerald)]/20 transition shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileGenreOpen(true)}
            className="md:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] cursor-pointer shadow-xs shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--accent-emerald)]" />
            <span>Categories</span>
          </button>
        </div>
      </div>

      {/* ── Side-by-Side Proper Flex Container Layout ── */}
      <div className="flex flex-col md:flex-row items-start gap-8 w-full">
        {/* Desktop Sidebar Container */}
        <aside className="hidden md:block w-64 shrink-0 rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] p-5 shadow-xs sticky top-28">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border-card)]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono">
              Categories
            </h3>
            {selectedGenre !== 'All' && (
              <button
                type="button"
                onClick={() => setSelectedGenre('All')}
                className="text-[11px] font-semibold text-[var(--accent-emerald)] hover:underline cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

          <ul className="space-y-1">
            {genres.map((genre) => {
              const count = genre === 'All' ? books.length : books.filter((b) => b.genre === genre).length;
              const isActive = selectedGenre === genre;
              return (
                <li key={genre}>
                  <button
                    type="button"
                    onClick={() => setSelectedGenre(genre)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-[var(--accent-indigo)] text-white shadow-xs font-bold'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <span className="truncate">{genre}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                        isActive
                          ? 'bg-white/20 text-white font-bold'
                          : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Mobile Slide-Over Drawer */}
        {mobileGenreOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 md:hidden animate-in fade-in duration-200"
              onClick={() => setMobileGenreOpen(false)}
            />
            <aside className="fixed left-0 top-0 bottom-0 w-72 bg-[var(--bg-card)] border-r border-[var(--border-card)] p-6 z-50 overflow-y-auto md:hidden shadow-2xl animate-in slide-in-from-left duration-250">
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border-card)] mb-4">
                <div>
                  <h3 className="text-sm font-serif font-bold text-[var(--text-primary)]">
                    Filter by Genre
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)]">Select catalog category</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileGenreOpen(false)}
                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <ul className="space-y-1.5">
                {genres.map((genre) => {
                  const count = genre === 'All' ? books.length : books.filter((b) => b.genre === genre).length;
                  const isActive = selectedGenre === genre;
                  return (
                    <li key={genre}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedGenre(genre);
                          setMobileGenreOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition cursor-pointer ${
                          isActive
                            ? 'bg-[var(--accent-indigo)] text-white'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                        }`}
                      >
                        <span>{genre}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                            isActive ? 'bg-white/20 text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </aside>
          </>
        )}

        {/* Books Grid Main Container */}
        <div className="flex-1 w-full">
          {filteredBooks.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[var(--border-card)] bg-[var(--bg-card)] p-12 text-center space-y-3">
              <Search className="w-12 h-12 text-[var(--text-muted)] mx-auto opacity-50" strokeWidth={1.5} />
              <h3 className="text-lg font-serif font-bold text-[var(--text-primary)]">
                No matching books found
              </h3>
              <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
                No catalog titles match your search criteria. Try a different search keyword or select another genre.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedGenre('All');
                }}
                className="mt-3 px-5 py-2.5 rounded-full bg-[var(--bg-secondary)] text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--border-card)] border border-[var(--border-card)] transition cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredBooks.map((book) => {
                const isAvailable = book.availableCopies > 0;
                return (
                  <article
                    key={book.id}
                    className="group rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 shadow-xs hover:border-[var(--accent-emerald)]/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Genre Tag & Stock Availability Pill */}
                      <div className="flex items-center justify-between gap-2 mb-3.5">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[var(--bg-secondary)] text-[var(--accent-emerald)] border border-[var(--border-card)] font-mono">
                          {book.genre}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            isAvailable
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isAvailable ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                          {isAvailable ? `${book.availableCopies} available` : 'Out of stock'}
                        </span>
                      </div>

                      {/* Book Title & Author */}
                      <h3 className="text-lg font-serif font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-emerald)] transition-colors line-clamp-1">
                        {book.title}
                      </h3>
                      <p className="text-xs text-[var(--text-muted)] font-medium mt-0.5 mb-3">
                        by {book.author}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                        {book.description}
                      </p>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="pt-5 mt-5 border-t border-[var(--border-card)] flex items-center justify-between gap-3">
                      <button
                        type="button"
                        disabled={!isAvailable || reservationMutation.isPending}
                        onClick={() => handleReserve(book.id)}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer shadow-xs ${
                          isAvailable
                            ? 'bg-[var(--accent-indigo)] text-white hover:bg-[var(--accent-indigo-hover)]'
                            : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] cursor-not-allowed opacity-60'
                        }`}
                      >
                        {reservationMutation.isPending ? 'Reserving...' : isAvailable ? 'Reserve' : 'Unavailable'}
                      </button>
                      <Link
                        to={`/books/${book.id}`}
                        className="py-2.5 px-3.5 rounded-xl text-xs font-semibold text-[var(--text-primary)] hover:text-[var(--accent-emerald)] hover:bg-[var(--bg-secondary)] border border-[var(--border-card)] transition text-center flex items-center gap-1"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
