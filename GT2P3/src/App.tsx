// Mikaela Ysabel L. Lantafe | IT4B
import { useEffect, useMemo, useState } from 'react';
import type { Book, Course, Reservation, User, Review } from './types';
import UserCard from './components/UserCard';
import CourseCard from './components/CourseCard';
import BookCard from './components/BookCard';
import ReservationCard from './components/ReservationCard';
import ReviewBadge from './components/ReviewBadge';
import './App.css';

const Icon = ({ children }: { children: any }) => (
  <span className="inline-block align-middle">{children}</span>
);

const SparkIcon = () => (
  <Icon>
    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  </Icon>
);

const MoonIcon = () => (
  <Icon>
    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  </Icon>
);

const SunIcon = () => (
  <Icon>
    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="12" cy="12" r="4" />
    </svg>
  </Icon>
);

const mockUsers: User[] = [
  { id: 1, name: 'Mikaela Lantafe', email: 'mikaela@example.com', role: 'student', isActive: true, score: 92 },
  { id: 2, name: 'Carlos Reyes', email: 'carlos@example.com', role: 'librarian', isActive: true, score: 88 },
];

const mockCourses: Course[] = [
  { id: 1, title: 'Interactive Design', code: 'INTD101', semester: '1st Semester' },
  { id: 2, title: 'Frontend Systems', code: 'FRS201', semester: '2nd Semester' },
];

const mockBooks: Book[] = [
  { id: 1, title: 'Animal Farm', author: 'George Orwell', genre: 'Fiction', availableCopies: 4, description: 'A satirical allegorical novella.' },
  { id: 2, title: 'Brave New World', author: 'Aldous Huxley', genre: 'Science Fiction', availableCopies: 2, description: 'A dystopian novel.' },
  { id: 3, title: '1984', author: 'George Orwell', genre: 'Science Fiction', availableCopies: 3, description: 'A dystopian social science fiction novel.' },
  { id: 4, title: "Alice's Adventures in Wonderland", author: 'Lewis Carroll', genre: 'Fantasy', availableCopies: 5, description: 'An 1865 English novel about a girl named Alice.' },
  { id: 5, title: 'Don Quixote', author: 'Miguel de Cervantes', genre: 'Classic', availableCopies: 1, description: 'A Spanish novel about the adventures of a noble.' },
  { id: 6, title: "Harry Potter and the Philosopher's Stone", author: 'J.K. Rowling', genre: 'Fantasy', availableCopies: 6, description: 'The first novel in the Harry Potter series.' },
  { id: 7, title: 'Little Women', author: 'Louisa May Alcott', genre: 'Fiction', availableCopies: 3, description: 'A coming-of-age novel following four sisters.' },
  { id: 8, title: 'Pride and Prejudice', author: 'Jane Austen', genre: 'Romance', availableCopies: 4, description: 'A romantic novel of manners.' },
  { id: 9, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic', availableCopies: 2, description: 'A novel set in the Jazz Age on Long Island.' },
  { id: 10, title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', genre: 'Fantasy', availableCopies: 4, description: 'An epic high-fantasy novel.' },
];

const mockReservations: Reservation[] = [
  { id: 101, userId: 1, bookId: 1, status: 'approved', reservedAt: '2026-07-15T08:30:00Z' },
];

const mockReviews: Review[] = [
  { id: 201, reservationId: 101, authorId: 1, note: 'Great translation.', rating: 5 },
];

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'books'>('overview');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Custom states
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<{ type: 'reservation' | 'review'; id: number } | null>(null);
  const [mobileGenreOpen, setMobileGenreOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        setUsers(mockUsers);
        setCourses(mockCourses);
        setBooks(mockBooks);
        setReservations(mockReservations);
        setReviews(mockReviews);
        setLoading(false);
      } catch (e) {
        setErrorState('Failed to load mock data');
        setLoading(false);
      }
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const genres = useMemo(() => ['All', ...Array.from(new Set(books.map((b) => b.genre)))], [books]);

  const filteredBooks = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return books.filter((b) => {
      const matchesSearch = b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.genre.toLowerCase().includes(q);
      const matchesGenre = selectedGenre === 'All' || b.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    });
  }, [books, searchQuery, selectedGenre]);

  const overviewCards = [
    { label: 'Total Books', value: books.length, note: 'Curated titles across every genre', accent: 'indigo' },
    { label: 'Active Reservations', value: reservations.length, note: 'Pending pickups and approvals', accent: 'emerald' },
    { label: 'Review Notes', value: reviews.length, note: 'Shared feedback from readers', accent: 'amber' },
  ];

  const handleReserveBook = (bookId: number) => {
    const targetBook = books.find((b) => b.id === bookId);
    if (!targetBook || targetBook.availableCopies <= 0) return;

    setBooks((prevBooks) =>
      prevBooks.map((b) =>
        b.id === bookId ? { ...b, availableCopies: b.availableCopies - 1 } : b
      )
    );

    const newRes: Reservation = {
      id: Math.max(100, ...reservations.map((r) => r.id)) + 1,
      userId: 1, // Mikaela
      bookId,
      status: 'approved',
      reservedAt: new Date().toISOString(),
      pickupDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    setReservations((prev) => [newRes, ...prev]);
    setToastMessage(`Successfully reserved "${targetBook.title}"!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCardClick = (type: 'reservation' | 'review', id: number) => {
    setSelectedItem({ type, id });
  };

  return (
    <div className="app min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      <div className="app-wrapper w-full flex justify-center">
        <div className="app-container w-full max-w-6xl">
          <header className="max-w-5xl mx-auto p-6 text-center flex flex-col items-center">
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--accent-indigo)] font-bold">De La Salle Lipa Registry</p>
          <h1 className="text-4xl font-serif italic text-[var(--accent-indigo)] mt-2">mika's library</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1.5 max-w-md mx-auto">A designated Book Reservation System for Students in De La Salle Lipa</p>
        </div>
        <div className="mt-4 flex items-center justify-end w-full">
          <button onClick={() => setIsDarkMode((v) => !v)} className="rounded-full border border-[var(--border-card)] px-4 py-1.5 flex items-center gap-2 hover:bg-[var(--bg-card-hover)] transition-all cursor-pointer font-medium text-xs">
            {isDarkMode ? <SunIcon /> : <MoonIcon />} <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>

        <div className="mt-8 flex gap-4 items-center justify-between flex-wrap border-b border-[var(--border-card)] pb-4 w-full">
          <div className="flex gap-2 mx-auto sm:mx-0">
            {(['overview', 'books'] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2.5 rounded-full font-semibold transition cursor-pointer text-sm ${activeTab === tab ? 'bg-[var(--accent-indigo)] text-white shadow-md' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'}`}> 
                {tab === 'overview' ? 'Library Overview' : 'Book Catalog'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
            {activeTab === 'books' && (
              <button onClick={() => setMobileGenreOpen(true)} className="md:hidden px-4 py-2 rounded border border-[var(--border-card)] bg-[var(--bg-card)] text-sm font-semibold hover:bg-[var(--bg-card-hover)] cursor-pointer">
                Genres
              </button>
            )}
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search catalog..." className="px-4 py-2 rounded border border-[var(--border-card)] bg-[var(--bg-card)] text-[var(--text-primary)] outline-none focus:border-[var(--accent-indigo)] text-sm w-full sm:w-64" />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 flex-1 w-full flex items-center justify-center">
        <section className="mb-6 w-full">
          {loading ? (
            <div className="flex flex-col items-center py-24">
              <svg className="animate-spin h-10 w-10 text-[var(--accent-indigo)]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <p className="mt-4 font-semibold text-[var(--text-secondary)]">Hydrating library catalog...</p>
            </div>
          ) : errorState ? (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-6 rounded-xl">{errorState}</div>
          ) : activeTab === 'overview' ? (
            <div className="overview-shell">
              <div className="overview-hero">
                <div className="overview-hero-copy">
                  <span className="overview-hero-badge">Library snapshot</span>
                  <h2 className="overview-hero-title">A calm, complete view of your library activity.</h2>
                  <p className="overview-hero-text">Monitor catalog health, reservations, and reader feedback from one polished overview.</p>
                </div>
                <div className="overview-hero-accent" />
              </div>

              <div className="overview-stats-grid">
                {overviewCards.map((c) => (
                  <div key={c.label} className={`overview-stat-card accent-${c.accent}`}>
                    <div className="overview-stat-icon">
                      {c.accent === 'emerald' ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14" />
                          <path d="M12 5l7 7-7 7" />
                        </svg>
                      ) : c.accent === 'amber' ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 18.8 6.2 21l1.1-6.5L2.6 9.8l6.5-.9L12 3z" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19V9" />
                          <path d="M20 19V5" />
                          <path d="M12 19V13" />
                        </svg>
                      )}
                    </div>
                    <div className="overview-stat-content">
                      <div className="overview-stat-label">{c.label}</div>
                      <div className="overview-stat-value">{c.value}</div>
                      <div className="overview-stat-note">{c.note}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="overview-grid">
                <div className="overview-section-card">
                  <div className="overview-section-header">
                    <div>
                      <h2 className="overview-section-title">Members Directory</h2>
                      <p className="overview-section-subtitle">Active accounts and their standing</p>
                    </div>
                    <span className="overview-section-pill">{users.length} active</span>
                  </div>
                  <div className="overview-card-stack">
                    {users.map((u) => (
                      <UserCard key={u.id} user={u} />
                    ))}
                  </div>
                </div>

                <div className="overview-section-card">
                  <div className="overview-section-header">
                    <div>
                      <h2 className="overview-section-title">Affiliated Tracks</h2>
                      <p className="overview-section-subtitle">Programs linked to the library</p>
                    </div>
                    <span className="overview-section-pill">{courses.length} tracks</span>
                  </div>
                  <div className="overview-card-stack">
                    {courses.map((c) => (
                      <CourseCard key={c.id} course={c} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="overview-grid">
                <div className="overview-section-card">
                  <div className="overview-section-header">
                    <div>
                      <h2 className="overview-section-title">Active Reservations</h2>
                      <p className="overview-section-subtitle">Current requests and pickup flow</p>
                    </div>
                    <span className="overview-section-pill">{reservations.length} items</span>
                  </div>
                  {reservations.length === 0 ? (
                    <div className="empty-state">No reservations currently active.</div>
                  ) : (
                    <div className="overview-card-stack overview-card-stack--compact">
                      {reservations.map((r) => (
                        <ReservationCard key={r.id} reservation={r} onClick={(id) => handleCardClick('reservation', id)} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="overview-section-card">
                  <div className="overview-section-header">
                    <div>
                      <h2 className="overview-section-title">Review & Feedback</h2>
                      <p className="overview-section-subtitle">Recent impressions from readers</p>
                    </div>
                    <span className="overview-section-pill">{reviews.length} reviews</span>
                  </div>
                  {reviews.length === 0 ? (
                    <div className="empty-state">No reviews posted yet.</div>
                  ) : (
                    <div className="overview-card-stack overview-card-stack--compact">
                      {reviews.map((rv) => (
                        <ReviewBadge key={rv.id} review={rv} onClick={(id) => handleCardClick('review', id)} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif italic text-[var(--text-primary)]">Archived Catalog</h2>
                <span className="text-sm text-[var(--text-muted)]">{filteredBooks.length} books found</span>
              </div>

              <div className="catalog-layout">
                {/* Desktop Sidebar */}
                <aside className="genre-sidebar hidden md:block">
                  <div className="genre-sidebar-header">
                    <h4>Genres</h4>
                  </div>
                  <ul className="genre-list">
                    {genres.map((genre) => {
                      const count = genre === 'All' ? books.length : books.filter((b) => b.genre === genre).length;
                      return (
                        <li key={genre}>
                          <button
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

                {/* Mobile Drawer (Side Menu overlay) */}
                {mobileGenreOpen && (
                  <>
                    <div className="drawer-overlay" onClick={() => setMobileGenreOpen(false)} />
                    <aside className="genre-sidebar open">
                      <div className="genre-sidebar-header">
                        <h4>Genres</h4>
                        <button className="btn-close-drawer font-bold text-xl" onClick={() => setMobileGenreOpen(false)}>×</button>
                      </div>
                      <ul className="genre-list">
                        {genres.map((genre) => {
                          const count = genre === 'All' ? books.length : books.filter((b) => b.genre === genre).length;
                          return (
                            <li key={genre}>
                              <button
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
                      {filteredBooks.map((b) => (
                        <BookCard key={b.id} book={b} onReserve={handleReserveBook} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
        </div>
      </div>

      <footer className="max-w-5xl mx-auto p-6 text-sm text-[var(--text-muted)] border-t border-[var(--border-card)] text-center">
        De La Salle Lipa Library Registry • Built for IT-ELEC4 — Mikaela Ysabel L. Lantafe
      </footer>

      {/* Details Dialog */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(18,12,8,0.5)] backdrop-blur-md p-4 animate-fade-in" onClick={() => setSelectedItem(null)}>
          <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl max-w-md w-full p-6 shadow-2xl relative transition-all duration-300 transform scale-100" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 text-2xl text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer">×</button>
            {selectedItem.type === 'reservation' ? (
              (() => {
                const res = reservations.find((r) => r.id === selectedItem.id);
                const bk = books.find((b) => b.id === res?.bookId);
                const usr = users.find((u) => u.id === res?.userId);
                if (!res) return <p>Reservation not found</p>;
                return (
                  <div>
                    <h3 className="text-xl font-serif italic text-[var(--accent-indigo)] mb-4 pb-2 border-b border-[var(--border-card)]">Reservation Details</h3>
                    <div className="space-y-3.5 text-sm">
                      <div className="flex justify-between border-b border-[rgba(140,98,57,0.08)] pb-2">
                        <span className="text-[var(--text-muted)]">Reservation ID</span>
                        <span className="font-bold">#{res.id}</span>
                      </div>
                      <div className="flex justify-between border-b border-[rgba(140,98,57,0.08)] pb-2">
                        <span className="text-[var(--text-muted)]">Book Title</span>
                        <span className="font-semibold text-right max-w-[200px] truncate">{bk?.title || `Book #${res.bookId}`}</span>
                      </div>
                      <div className="flex justify-between border-b border-[rgba(140,98,57,0.08)] pb-2">
                        <span className="text-[var(--text-muted)]">Reserved By</span>
                        <span className="font-semibold">{usr?.name || `User #${res.userId}`}</span>
                      </div>
                      <div className="flex justify-between border-b border-[rgba(140,98,57,0.08)] pb-2">
                        <span className="text-[var(--text-muted)]">Status</span>
                        <span className="font-semibold capitalize text-[var(--accent-emerald)] bg-[rgba(78,112,85,0.12)] px-2.5 py-0.5 rounded-full text-xs">{res.status}</span>
                      </div>
                      <div className="flex justify-between border-b border-[rgba(140,98,57,0.08)] pb-2">
                        <span className="text-[var(--text-muted)]">Reserved At</span>
                        <span>{new Date(res.reservedAt).toLocaleDateString()}</span>
                      </div>
                      {res.pickupDeadline && (
                        <div className="flex justify-between">
                          <span className="text-[var(--text-muted)]">Pickup Deadline</span>
                          <span className="text-[var(--accent-amber)] font-bold">{new Date(res.pickupDeadline).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()
            ) : (
              (() => {
                const rev = reviews.find((r) => r.id === selectedItem.id);
                const bk = reservations.find((res) => res.id === rev?.reservationId)?.bookId;
                const bookTitle = books.find((b) => b.id === bk)?.title;
                const authorName = users.find((u) => u.id === rev?.authorId)?.name;
                if (!rev) return <p>Review not found</p>;
                return (
                  <div>
                    <h3 className="text-xl font-serif italic text-[var(--accent-indigo)] mb-4 pb-2 border-b border-[var(--border-card)]">Review Note</h3>
                    <div className="space-y-4">
                      <div className="text-amber-500 text-2xl font-bold">
                        {'★'.repeat(rev.rating) + '☆'.repeat(5 - rev.rating)}
                      </div>
                      <p className="text-lg italic text-[var(--text-primary)] font-serif leading-relaxed">"{rev.note}"</p>
                      <div className="text-xs text-[var(--text-muted)] space-y-1.5 pt-2 border-t border-[rgba(140,98,57,0.08)]">
                        <p>Reviewed Book: <span className="font-semibold text-[var(--text-secondary)]">{bookTitle || `Book #${bk}`}</span></p>
                        <p>Written by: <span className="font-semibold text-[var(--text-secondary)]">{authorName || `User #${rev.authorId}`}</span></p>
                      </div>
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        </div>
      )}

      {/* Interactive Toast Notifications */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[var(--accent-indigo)] text-white px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3 animate-slide-in border border-[var(--border-card)]">
          <SparkIcon />
          <span className="text-sm font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 font-bold hover:text-amber-200 cursor-pointer text-base">×</button>
        </div>
      )}
    </div>
  );
}

export default App;
