// Mikaela Ysabel L. Lantafe | IT4B
import { useEffect, useMemo, useState } from 'react';
import type { Book, Course, Reservation, User, Review } from './types';
import UserCard from './components/UserCard';
import CourseCard from './components/CourseCard';
import BookCard from './components/BookCard';
import ReservationCard from './components/ReservationCard';
import ReviewBadge from './components/ReviewBadge';
import { useToggle, usePrevious } from './hooks/useCustomHooks';
import './App.css';

const Icon = ({ children }: { children: any }) => (
  <span className="inline-block align-middle">{children}</span>
);

const BookIcon = () => (
  <Icon>
    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
    </svg>
  </Icon>
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
  const [showDebug, toggleDebug] = useToggle(false);
  const previousTab = usePrevious<'overview' | 'books'>(activeTab);

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
    return books.filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.genre.toLowerCase().includes(q));
  }, [books, searchQuery]);

  const overviewCards = [
    { label: 'Total Books', value: books.length },
    { label: 'Active Reservations', value: reservations.length },
  ];

  return (
    <div className="app min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      <header className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--accent-indigo)] font-bold">De La Salle Lipa Registry</p>
            <h1 className="text-4xl font-serif italic text-[var(--accent-indigo)]">mika's library</h1>
            <p className="text-sm text-[var(--text-muted)]">A designated Book Reservation System for Students in De La Salle Lipa</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsDarkMode((v) => !v)} className="rounded-full border border-[var(--border-card)] px-3 py-2 flex items-center gap-2 hover:bg-[var(--bg-card-hover)] transition-all">
              {isDarkMode ? <SunIcon /> : <MoonIcon />} <span className="text-sm">{isDarkMode ? 'Light' : 'Dark'}</span>
            </button>
          </div>
        </div>

        <div className="mt-6 flex gap-2 items-center">
          <div className="flex gap-2">
            {(['overview', 'books'] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-full font-semibold transition ${activeTab === tab ? 'bg-[var(--accent-indigo)] text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'}`}> 
                {tab === 'overview' ? 'Overview' : 'Book Catalog'}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center">
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search catalog..." className="px-3 py-2 rounded border border-[var(--border-card)] bg-[var(--bg-card)] text-[var(--text-primary)] outline-none focus:border-[var(--accent-indigo)]" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <section className="mb-6">
          {loading ? (
            <div className="flex flex-col items-center py-12">
              <svg className="animate-spin h-10 w-10 text-[var(--accent-indigo)]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <p className="mt-4 font-semibold text-[var(--text-secondary)]">Hydrating library catalog...</p>
            </div>
          ) : errorState ? (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-6 rounded">{errorState}</div>
          ) : activeTab === 'overview' ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {overviewCards.map((c) => (
                  <div key={c.label} className="p-4 rounded border border-[var(--border-card)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] transition-all">
                    <div className="text-xs font-bold uppercase text-[var(--text-muted)]">{c.label}</div>
                    <div className="mt-2 text-3xl font-extrabold text-[var(--text-primary)]">{c.value}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-serif italic text-[var(--text-primary)]">Members Directory</h2>
                    <span className="text-sm text-[var(--text-muted)]">{users.length} active</span>
                  </div>
                  <div className="grid gap-4">
                    {users.map((u) => (
                      <UserCard key={u.id} user={u} variant={u.role === 'student' ? 'default' : 'compact'} />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-serif italic text-[var(--text-primary)]">Affiliated Tracks</h2>
                    <span className="text-sm text-[var(--text-muted)]">{courses.length} courses</span>
                  </div>
                  <div className="grid gap-4">
                    {courses.map((c) => (
                      <CourseCard key={c.id} course={c} variant={c.id === 1 ? 'default' : 'compact'} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-serif italic text-[var(--text-primary)]">Archived Catalog</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBooks.map((b) => (
                  <BookCard key={b.id} book={b} onReserve={() => {}} />
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="max-w-7xl mx-auto p-6 text-sm text-[var(--text-muted)] border-t border-[var(--border-card)]">
        De La Salle Lipa Library Registry • Built for IT-ELEC4 — Mikaela Ysabel L. Lantafe
      </footer>
    </div>
  );
}

export default App;
