// Mikaela Ysabel L. Lantafe | IT4B
import React, { useState, useEffect, useRef } from 'react';
import { ReservationStatus } from './types';
import type { Book, Reservation, Review } from './types';
import BookCard from './components/BookCard';
import ReservationCard from './components/ReservationCard';
import ReviewBadge from './components/ReviewBadge';
import { useToggle, usePrevious } from './hooks/useCustomHooks';
import './App.css';

// ── Icons (SVGs replacing Emojis) ──────────────────────────

const BookIcon = () => (
  <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
    <path d="M6 6h10" />
    <path d="M6 10h10" />
  </svg>
);

const BoltIcon = () => (
  <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const ClipboardIcon = () => (
  <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
  </svg>
);

const StarIcon = () => (
  <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const SearchIcon = () => (
  <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const FolderIcon = () => (
  <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: 0 }}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ── Mock Data ──────────────────────────────────────────────

const mockBooks: Book[] = [
  {
    id: 1,
    title: 'A Tale of Two Cities',
    author: 'Charles Dickens',
    genre: 'Classic',
    availableCopies: 3,
    description: 'A story of conflict and redemption set in London and Paris.',
  },
  {
    id: 2,
    title: "Alice's Adventures in Wonderland",
    author: 'Lewis Carroll',
    genre: 'Fantasy',
    availableCopies: 5,
    description: 'A surreal journey down the rabbit hole into a logical nonsense world.',
  },
  {
    id: 3,
    title: 'Animal Farm',
    author: 'George Orwell',
    genre: 'Fiction',
    availableCopies: 4,
    description: 'A satirical allegorical novella reflecting on democratic socialism.',
  },
  {
    id: 4,
    title: 'Brave New World',
    author: 'Aldous Huxley',
    genre: 'Science Fiction',
    availableCopies: 2,
    description: 'A dystopian view of a highly conformist and controlled future society.',
  },
  {
    id: 5,
    title: 'Crime and Punishment',
    author: 'Fyodor Dostoevsky',
    genre: 'Classic',
    availableCopies: 3,
    description: 'A psychological examination of guilt, morality, and redemption.',
  },
  {
    id: 6,
    title: 'Don Quixote',
    author: 'Miguel de Cervantes',
    genre: 'Classic',
    availableCopies: 2,
    description: 'The comedic adventures of a noble knight and his squire.',
  },
  {
    id: 7,
    title: 'Dracula',
    author: 'Bram Stoker',
    genre: 'Horror',
    availableCopies: 6,
    description: 'The classic gothic horror tale of Count Dracula.',
  },
  {
    id: 8,
    title: 'Frankenstein',
    author: 'Mary Shelley',
    genre: 'Science Fiction',
    availableCopies: 3,
    description: 'A cautionary tale of science, ambition, and the creation of life.',
  },
  {
    id: 9,
    title: 'Great Expectations',
    author: 'Charles Dickens',
    genre: 'Classic',
    availableCopies: 4,
    description: 'The coming-of-age story of an orphan named Pip.',
  },
  {
    id: 10,
    title: 'Jane Eyre',
    author: 'Charlotte Brontë',
    genre: 'Romance',
    availableCopies: 3,
    description: 'The emotional growth and struggles of a strong-willed governess.',
  },
  {
    id: 11,
    title: 'Les Misérables',
    author: 'Victor Hugo',
    genre: 'Classic',
    availableCopies: 2,
    description: 'An epic tale of law, grace, and revolution in France.',
  },
  {
    id: 12,
    title: 'Little Women',
    author: 'Louisa May Alcott',
    genre: 'Classic',
    availableCopies: 5,
    description: 'The lives and trials of the four March sisters growing up.',
  },
  {
    id: 13,
    title: 'Moby-Dick',
    author: 'Herman Melville',
    genre: 'Adventure',
    availableCopies: 1,
    description: "Captain Ahab's obsessive quest to destroy the white whale.",
  },
  {
    id: 14,
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Romance',
    availableCopies: 4,
    description: 'The turbulent relationship between Elizabeth Bennet and Mr. Darcy.',
  },
  {
    id: 15,
    title: 'The Catcher in the Rye',
    author: 'J. D. Salinger',
    genre: 'Fiction',
    availableCopies: 3,
    description: 'The rebellious teenage journey of Holden Caulfield in New York.',
  },
  {
    id: 16,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Classic',
    availableCopies: 0,
    description: 'A story of the mysteriously wealthy Jay Gatsby.',
  },
  {
    id: 17,
    title: 'The Hobbit',
    author: 'J. R. R. Tolkien',
    genre: 'Fantasy',
    availableCopies: 5,
    description: "Bilbo Baggins' unexpected journey to reclaim the Lonely Mountain.",
  },
  {
    id: 18,
    title: 'The Odyssey',
    author: 'Homer',
    genre: 'Classic',
    availableCopies: 3,
    description: 'The epic ten-year journey of Odysseus returning home from Troy.',
  },
  {
    id: 19,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Classic',
    availableCopies: 4,
    description: 'A profound exploration of racial injustice and loss of innocence.',
  },
  {
    id: 20,
    title: 'War and Peace',
    author: 'Leo Tolstoy',
    genre: 'Classic',
    availableCopies: 2,
    description: 'The lives of five aristocratic families during the Napoleonic wars.',
  },
];

const mockReservations: Reservation[] = [
  {
    id: 101,
    userId: 1,
    bookId: 1,
    status: ReservationStatus.Approved,
    reservedAt: '2026-07-15T08:30:00Z',
    pickupDeadline: '2026-07-18T08:30:00Z',
  },
  {
    id: 102,
    userId: 2,
    bookId: 3,
    status: ReservationStatus.Pending,
    reservedAt: '2026-07-17T14:00:00Z',
    pickupDeadline: '2026-07-20T14:00:00Z',
  },
  {
    id: 103,
    userId: 1,
    bookId: 2,
    status: ReservationStatus.Completed,
    reservedAt: '2026-06-01T09:00:00Z',
  },
];

const mockReviews: Review[] = [
  {
    id: 201,
    reservationId: 103,
    authorId: 1,
    note: 'Excellent availability and quick pickup process!',
    rating: 5,
  },
  {
    id: 202,
    reservationId: 101,
    authorId: 1,
    note: 'Great condition, enjoyed reading this again.',
    rating: 4,
  },
  {
    id: 203,
    reservationId: 102,
    authorId: 2,
    note: 'Good reference book for class projects.',
    rating: 3,
  },
];

// ── App Component ──────────────────────────────────────────

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lastAction, setLastAction] = useState<string>('No actions yet.');
  const [activeTab, setActiveTab] = useState<'books' | 'reservations' | 'reviews'>('books');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const [showDebug, toggleDebug] = useToggle(false);
  const [isGenreDrawerOpen, toggleGenreDrawer] = useToggle(false);
  const previousAction = usePrevious<string>(lastAction);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBooks(mockBooks);
      setReservations(mockReservations);
      setReviews(mockReviews);
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  const handleReserve = (bookId: number): void => {
    const updatedBooks = books.map((book) => {
      if (book.id === bookId && book.availableCopies > 0) {
        setLastAction(`Reserved "${book.title}" (Book #${bookId})`);
        return { ...book, availableCopies: book.availableCopies - 1 };
      }
      return book;
    });
    setBooks(updatedBooks);
  };

  const handleReservationClick = (reservationId: number): void => {
    setLastAction(`Viewing Reservation #${reservationId}`);
  };

  const handleReviewClick = (reviewId: number): void => {
    setLastAction(`Viewing Review #${reviewId}`);
  };

  const focusSearchInput = (): void => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Extract all unique genres from total list
  const allGenres = Array.from(new Set(books.map((book) => book.genre))).sort();

  // Filter books dynamically based on search query state
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Apply selected genre filter
  const displayedBooks = selectedGenre
    ? filteredBooks.filter((book) => book.genre === selectedGenre)
    : filteredBooks;

  // Group displayed books by genre
  const booksByGenre = displayedBooks.reduce<Record<string, Book[]>>((acc, book) => {
    const genre = book.genre;
    if (!acc[genre]) {
      acc[genre] = [];
    }
    acc[genre].push(book);
    return acc;
  }, {});

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>BOOK RESERVATION SYSTEM</h1>
          <p className="subtitle">Book Reservation System — Mikaela Ysabel L. Lantafe | IT4B</p>
        </div>
      </header>

      <div className="toast-bar">
        <div className="toast-info">
          <BoltIcon />
          <span><strong>Action:</strong> {lastAction}</span>
        </div>
        {previousAction && (
          <div className="toast-prev">
            <span><strong>Previous:</strong> {previousAction}</span>
          </div>
        )}
      </div>

      <main className="app-main">
        {/* Navigation Tabs */}
        <div className="tab-navigation">
          <button
            className={`tab-btn genre-tab ${isGenreDrawerOpen ? 'active' : ''}`}
            onClick={toggleGenreDrawer}
            style={{ borderBottomColor: isGenreDrawerOpen ? 'var(--accent-amber)' : 'transparent' }}
          >
            <FolderIcon /> Filter by Genre {selectedGenre ? `(${selectedGenre})` : ''}
          </button>
          <button
            className={`tab-btn ${activeTab === 'books' ? 'active' : ''}`}
            onClick={() => setActiveTab('books')}
          >
            <BookIcon /> Browse Books ({books.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'reservations' ? 'active' : ''}`}
            onClick={() => setActiveTab('reservations')}
          >
            <ClipboardIcon /> Reservations ({reservations.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            <StarIcon /> Reader Reviews ({reviews.length})
          </button>
        </div>

        {/* Controls Section */}
        <section className="controls-section">
          {activeTab === 'books' ? (
            <div className="search-container">
              <input
                ref={searchInputRef}
                type="text"
                className="search-input"
                placeholder="Search books by title, author, or genre..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button className="btn-focus" onClick={focusSearchInput}>
                <SearchIcon /> Focus Search
              </button>
            </div>
          ) : (
            <div className="tab-header-placeholder">
              <h2 className="tab-title">
                {activeTab === 'reservations' ? 'Current Reservations' : 'Reader Reviews'}
              </h2>
            </div>
          )}

          <div className="debug-toggle-container">
            <button className="btn-debug" onClick={toggleDebug}>
              <SettingsIcon /> {showDebug ? 'Hide Technical Info' : 'Show Technical Info'}
            </button>
          </div>
        </section>

        {showDebug && (
          <section className="debug-section">
            <h3><SettingsIcon /> Technical Details (Custom Hooks Demo)</h3>
            <ul>
              <li><strong>Current Action:</strong> {lastAction}</li>
              <li><strong>Previous Action:</strong> {previousAction || 'None'}</li>
              <li><strong>Search Query State:</strong> "{searchQuery}"</li>
              <li><strong>Active Tab State:</strong> "{activeTab}"</li>
              <li><strong>Selected Genre:</strong> {selectedGenre || 'All'}</li>
              <li><strong>Loaded books:</strong> {books.length}</li>
              <li><strong>Loaded reservations:</strong> {reservations.length}</li>
              <li><strong>Loaded reviews:</strong> {reviews.length}</li>
            </ul>
          </section>
        )}

        {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
            <p>Loading database records...</p>
          </div>
        ) : (
          <div className="tab-content">
            {/* ── Books Tab ── */}
            {activeTab === 'books' && (
              <div className="catalog-layout">
                {/* Drawer Overlay for Mobile */}
                {isGenreDrawerOpen && (
                  <div className="drawer-overlay" onClick={toggleGenreDrawer}></div>
                )}

                {/* Left Side Sliding Drawer / Sidebar */}
                <aside className={`genre-sidebar ${isGenreDrawerOpen ? 'open' : ''} always-visible`}>
                  <div className="genre-sidebar-header">
                    <h4>Filter by Genre</h4>
                    <button className="btn-close-drawer" onClick={toggleGenreDrawer}>
                      <CloseIcon />
                    </button>
                  </div>
                  <ul className="genre-list">
                    <li>
                      <button
                        className={`genre-item-btn ${selectedGenre === null ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedGenre(null);
                          if (window.innerWidth < 768) toggleGenreDrawer();
                        }}
                      >
                        <span className="genre-item-title">All Genres</span>
                        <span className="genre-item-count">{books.length}</span>
                      </button>
                    </li>
                    {allGenres.map((genre) => {
                      const count = books.filter((b) => b.genre === genre).length;
                      return (
                        <li key={genre}>
                          <button
                            className={`genre-item-btn ${selectedGenre === genre ? 'active' : ''}`}
                            onClick={() => {
                              setSelectedGenre(genre);
                              if (window.innerWidth < 768) toggleGenreDrawer();
                            }}
                          >
                            <span className="genre-item-title">{genre}</span>
                            <span className="genre-item-count">{count}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </aside>

                {/* Main Grid Section */}
                <div className="catalog-main">
                  <section className="section">
                    <div className="section-header">
                      <h2>
                        <BookIcon /> {selectedGenre ? `${selectedGenre} Catalog` : 'All Books'}
                      </h2>
                      <span className="section-count">{displayedBooks.length} found</span>
                    </div>
                    {displayedBooks.length === 0 ? (
                      <div className="empty-state">
                        <p>No books match your search query or selected genre.</p>
                      </div>
                    ) : (
                      Object.keys(booksByGenre).sort().map((genre) => (
                        <div key={genre} className="genre-group">
                          <h3 className="genre-title">
                            <FolderIcon /> {genre} ({booksByGenre[genre].length})
                          </h3>
                          <div className="card-grid">
                            {booksByGenre[genre].map((book) => (
                              <BookCard key={book.id} book={book} onReserve={handleReserve} />
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </section>
                </div>
              </div>
            )}

            {/* ── Reservations Tab ── */}
            {activeTab === 'reservations' && (
              <section className="section">
                <div className="card-grid">
                  {reservations.map((reservation) => (
                    <ReservationCard
                      key={reservation.id}
                      reservation={reservation}
                      onClick={handleReservationClick}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ── Reviews Tab ── */}
            {activeTab === 'reviews' && (
              <section className="section">
                <div className="card-grid">
                  {reviews.map((review) => (
                    <ReviewBadge key={review.id} review={review} onClick={handleReviewClick} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>IT-ELEC4 • Vite + React + TypeScript • GT1 Graded Task</p>
      </footer>
    </div>
  );
}

export default App;
