import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { mockBooks } from '../data/libraryData';

const genres = ['All', ...Array.from(new Set(mockBooks.map((book) => book.genre)))];

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [mobileGenreOpen, setMobileGenreOpen] = useState(false);

  const filteredBooks = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return mockBooks.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.genre.toLowerCase().includes(query);
      const matchesGenre = selectedGenre === 'All' || book.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    });
  }, [searchQuery, selectedGenre]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif italic text-[var(--text-primary)]">Archived Catalog</h2>
        <span className="text-sm text-[var(--text-muted)]">{filteredBooks.length} books found</span>
      </div>

      <div className="flex items-center justify-end w-full mb-4">
        <input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search catalog..."
          className="px-4 py-2 rounded border border-[var(--border-card)] bg-[var(--bg-card)] text-[var(--text-primary)] outline-none focus:border-[var(--accent-indigo)] text-sm w-full sm:w-64"
        />
      </div>

      <div className="catalog-layout">
        <aside className="genre-sidebar hidden md:block">
          <div className="genre-sidebar-header">
            <h4>Genres</h4>
          </div>
          <ul className="genre-list">
            {genres.map((genre) => {
              const count = genre === 'All' ? mockBooks.length : mockBooks.filter((book) => book.genre === genre).length;
              return (
                <li key={genre}>
                  <button
                    type="button"
                    onClick={() => setSelectedGenre(genre)}
                    className={`genre-item-btn ${selectedGenre === genre ? 'active' : ''}`}
                  >
                    <span>{genre}</span>
                    <span className="genre-item-count">{count}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {mobileGenreOpen && (
          <>
            <div className="drawer-overlay" onClick={() => setMobileGenreOpen(false)} />
            <aside className="genre-sidebar open">
              <div className="genre-sidebar-header">
                <h4>Genres</h4>
                <button type="button" className="btn-close-drawer font-bold text-xl" onClick={() => setMobileGenreOpen(false)}>×</button>
              </div>
              <ul className="genre-list">
                {genres.map((genre) => {
                  const count = genre === 'All' ? mockBooks.length : mockBooks.filter((book) => book.genre === genre).length;
                  return (
                    <li key={genre}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedGenre(genre);
                          setMobileGenreOpen(false);
                        }}
                        className={`genre-item-btn ${selectedGenre === genre ? 'active' : ''}`}
                      >
                        <span>{genre}</span>
                        <span className="genre-item-count">{count}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </aside>
          </>
        )}

        <div className="catalog-main">
          {filteredBooks.length === 0 ? (
            <div className="empty-state py-12">No books match your criteria. Try widening your search.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
                <article key={book.id} className="card book-card">
                  <div className="card-header">
                    <span className="genre-tag">{book.genre}</span>
                    <span className={`availability ${book.availableCopies > 0 ? 'available' : 'unavailable'}`}>
                      {book.availableCopies > 0 ? `${book.availableCopies} left` : 'Unavailable'}
                    </span>
                  </div>
                  <div className="card-body">
                    <h3 className="card-title">{book.title}</h3>
                    <p className="card-author">by {book.author}</p>
                    <p className="card-description">{book.description}</p>
                  </div>
                  <div className="card-footer flex items-center justify-between gap-2">
                    <button type="button" className="btn btn-reserve" disabled={book.availableCopies <= 0}>
                      {book.availableCopies > 0 ? 'Reserve Now' : 'Not Available'}
                    </button>
                    <Link to={`/books/${book.id}`} className="text-sm font-semibold text-[var(--accent-indigo)] hover:underline">
                      Details
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
