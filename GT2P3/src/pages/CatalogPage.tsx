import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, Search, Tag, X } from 'lucide-react';
import { createReservation, getBooks } from '../api/client';
import { useUiStore } from '../store/uiStore';

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileGenreOpen, setMobileGenreOpen] = useState(false);
  const selectedGenre = useUiStore((state) => state.selectedGenre);
  const setSelectedGenre = useUiStore((state) => state.setSelectedGenre);
  const queryClient = useQueryClient();
  const { data: books = [], isLoading, isError } = useQuery({ queryKey: ['books'], queryFn: getBooks });

  const reservationMutation = useMutation({
    mutationFn: (bookId: number) =>
      createReservation({
        userId: 1,
        bookId,
        status: 'pending',
        reservedAt: new Date().toISOString(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });

  const genres = useMemo(() => ['All', ...Array.from(new Set(books.map((book) => book.genre)))], [books]);

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
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-10 h-10 border-3 border-[var(--border-card)] border-t-[var(--accent-indigo)] rounded-full animate-spin" />
        <p className="text-sm font-medium text-[var(--text-muted)]">Loading catalog...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-12 text-center max-w-lg mx-auto">
        <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
        <h3 className="text-lg font-serif font-bold text-[var(--text-primary)]">Unable to load the catalog</h3>
        <p className="text-sm text-[var(--text-muted)] mt-1">Please ensure the json-server API is active on port 3001.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* ── Catalog Header & Toolbar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-card)] pb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)]">
            Library Catalog
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Showing <span className="font-semibold text-[var(--text-primary)]">{filteredBooks.length}</span> titles
            {selectedGenre !== 'All' ? ` in ${selectedGenre}` : ''}
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by title, author, genre..."
              className="w-full pl-9 pr-8 py-2.5 rounded-full border border-[var(--border-card)] bg-[var(--bg-card)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent-indigo)] focus:ring-2 focus:ring-[var(--accent-indigo)]/20 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileGenreOpen(true)}
            className="md:hidden inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-[var(--border-card)] bg-[var(--bg-secondary)] text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] cursor-pointer"
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Genres</span>
          </button>
        </div>
      </div>

      {/* ── Main Catalog Grid & Sidebar ── */}
      <div className="catalog-layout w-full">
        {/* Desktop Sidebar */}
        <aside className="genre-sidebar hidden md:block w-56 shrink-0">
          <div className="genre-sidebar-header">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Categories
            </h4>
          </div>
          <ul className="genre-list space-y-1 mt-3">
            {genres.map((genre) => {
              const count = genre === 'All' ? books.length : books.filter((book) => book.genre === genre).length;
              const isActive = selectedGenre === genre;
              return (
                <li key={genre}>
                  <button
                    type="button"
                    onClick={() => setSelectedGenre(genre)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
                      isActive
                        ? 'bg-[var(--accent-indigo)] text-white shadow-xs font-semibold'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <span>{genre}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
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

        {/* Mobile Drawer */}
        {mobileGenreOpen && (
          <>
            <div className="drawer-overlay" onClick={() => setMobileGenreOpen(false)} />
            <aside className="genre-sidebar open">
              <div className="genre-sidebar-header flex items-center justify-between">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Categories
                </h4>
                <button
                  type="button"
                  className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                  onClick={() => setMobileGenreOpen(false)}
                  title="Close categories"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <ul className="genre-list space-y-1 mt-4">
                {genres.map((genre) => {
                  const count = genre === 'All' ? books.length : books.filter((book) => book.genre === genre).length;
                  const isActive = selectedGenre === genre;
                  return (
                    <li key={genre}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedGenre(genre);
                          setMobileGenreOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                          isActive
                            ? 'bg-[var(--accent-indigo)] text-white font-semibold'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'
                        }`}
                      >
                        <span>{genre}</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
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

        {/* Books Grid */}
        <div className="catalog-main flex-1">
          {filteredBooks.length === 0 ? (
            <div className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-12 text-center">
              <Search className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" strokeWidth={1.5} />
              <h3 className="text-lg font-serif font-bold text-[var(--text-primary)]">No matching books found</h3>
              <p className="text-sm text-[var(--text-muted)] mt-1">Try adjusting your search terms or genre filter.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedGenre('All');
                }}
                className="mt-4 px-4 py-2 rounded-full bg-[var(--bg-secondary)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-card)]"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredBooks.map((book) => {
                const isAvailable = book.availableCopies > 0;
                return (
                  <article
                    key={book.id}
                    className="group rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-5 shadow-xs hover:shadow-md hover:border-[var(--border-card-hover)] transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Header Tag & Status */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[var(--accent-indigo)]/10 text-[var(--accent-indigo)]">
                          {book.genre}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            isAvailable
                              ? 'bg-[var(--accent-emerald)]/10 text-[var(--accent-emerald)]'
                              : 'bg-red-500/10 text-red-600 dark:text-red-400'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-[var(--accent-emerald)]' : 'bg-red-500'}`}
                          />
                          {isAvailable ? `${book.availableCopies} available` : 'Out of stock'}
                        </span>
                      </div>

                      {/* Card Body */}
                      <h3 className="text-base font-serif font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-indigo)] transition-colors line-clamp-1">
                        {book.title}
                      </h3>
                      <p className="text-xs text-[var(--text-muted)] font-medium mt-0.5 mb-2.5">
                        by {book.author}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                        {book.description}
                      </p>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="pt-5 mt-4 border-t border-[var(--border-card)] flex items-center justify-between gap-3">
                      <button
                        type="button"
                        disabled={!isAvailable || reservationMutation.isPending}
                        onClick={() => reservationMutation.mutate(book.id)}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                          isAvailable
                            ? 'bg-[var(--accent-indigo)] text-white hover:opacity-90 shadow-xs'
                            : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] cursor-not-allowed opacity-60'
                        }`}
                      >
                        {reservationMutation.isPending ? 'Reserving...' : isAvailable ? 'Reserve' : 'Unavailable'}
                      </button>
                      <Link
                        to={`/books/${book.id}`}
                        className="py-2 px-3 rounded-xl text-xs font-semibold text-[var(--accent-indigo)] hover:bg-[var(--bg-secondary)] border border-transparent hover:border-[var(--border-card)] transition text-center"
                      >
                        Details →
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
