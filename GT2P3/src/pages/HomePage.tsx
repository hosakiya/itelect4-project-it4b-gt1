import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  BookOpen,
  Bookmark,
  Landmark,
  ArrowRight,
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Sparkles,
  Layers
} from 'lucide-react';
import { getBooks, getCourses, getReservations } from '../api/client';
import CourseCard from '../components/CourseCard';
import { useUiStore } from '../store/uiStore';

export default function HomePage() {
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState('');
  const setSelectedGenre = useUiStore((state) => state.setSelectedGenre);

  const { data: books = [], isLoading: booksLoading } = useQuery({
    queryKey: ['books'],
    queryFn: getBooks,
  });

  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  });

  const { data: reservations = [], isLoading: reservationsLoading } = useQuery({
    queryKey: ['reservations'],
    queryFn: getReservations,
  });

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/catalog');
    }
  };

  const handleGenreQuickFilter = (genre: string) => {
    setSelectedGenre(genre);
    navigate('/catalog');
  };

  if (booksLoading || coursesLoading || reservationsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 gap-4">
        <div className="w-12 h-12 border-3 border-[var(--border-card)] border-t-[var(--accent-emerald)] rounded-full animate-spin" />
        <p className="text-sm font-medium text-[var(--text-muted)] tracking-wide">
          Connecting to campus library repository...
        </p>
      </div>
    );
  }

  // Pick top 3 available books for the featured showcase
  const featuredBooks = books.slice(0, 3);

  const overviewCards = [
    {
      label: 'Catalog Volumes',
      value: books.length || 50,
      note: 'Available for reservation & checkout',
      icon: BookOpen,
      iconColor: 'text-[var(--accent-emerald)] bg-[var(--accent-emerald)]/10',
    },
    {
      label: 'Active Reservations',
      value: reservations.length,
      note: 'Queued & scheduled pickups',
      icon: Bookmark,
      iconColor: 'text-[var(--accent-amber)] bg-[var(--accent-amber)]/10',
    },
    {
      label: 'Degree Programs',
      value: courses.length || 3,
      note: 'Affiliated academic tracks',
      icon: Layers,
      iconColor: 'text-[var(--accent-sky)] bg-[var(--accent-sky)]/10',
    },
  ];

  return (
    <div className="w-full space-y-12">
      {/* ── Institutional Hero Section ── */}
      <section className="relative overflow-hidden rounded-3xl border border-[var(--border-card)] bg-gradient-to-br from-[var(--bg-card)] via-[var(--bg-secondary)]/60 to-[var(--bg-card)] p-8 sm:p-12 lg:p-16 shadow-sm transition-all">
        <div className="relative z-10 max-w-3xl space-y-6">
          {/* Institution Header Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--accent-emerald)]/10 text-[var(--accent-emerald)] border border-[var(--accent-emerald)]/20 text-xs font-bold uppercase tracking-widest font-mono">
            <Landmark className="w-3.5 h-3.5 shrink-0" />
            <span>De La Salle Lipa • Resource Repository</span>
          </div>

          {/* Hero Headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[var(--text-primary)] leading-[1.15] tracking-tight">
            Knowledge Within Reach. <br className="hidden sm:inline" />
            <span className="text-[var(--accent-emerald)]">Reserve, Borrow & Learn.</span>
          </h2>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-2xl">
            Welcome to the official DLSL Library Portal. Browse physical holdings, reference textbooks, and seminar volumes. Reserve titles online with real-time pickup confirmations.
          </p>

          {/* Quick Search Bar within Hero */}
          <form onSubmit={handleHeroSearch} className="w-full max-w-xl pt-2">
            <div className="relative flex items-center shadow-md rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] focus-within:border-[var(--accent-emerald)] focus-within:ring-2 focus-within:ring-[var(--accent-emerald)]/20 transition-all p-1.5">
              <span className="pl-3.5 text-[var(--text-muted)] pointer-events-none">
                <Search className="w-5 h-5" />
              </span>
              <input
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Search by book title, author, or keyword..."
                className="w-full bg-transparent px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[var(--accent-indigo)] hover:bg-[var(--accent-indigo-hover)] text-white text-xs font-semibold shrink-0 transition-all shadow-xs cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Categories Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[var(--text-muted)]">
            <span className="font-semibold text-[var(--text-secondary)]">Popular categories:</span>
            {['Science Fiction', 'Classic Literature', 'Computer Science', 'Dystopian'].map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => handleGenreQuickFilter(genre)}
                className="px-3 py-1 rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--accent-emerald)]/10 hover:text-[var(--accent-emerald)] border border-[var(--border-card)] transition font-medium cursor-pointer"
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Ambient Decorative Lighting */}
        <div className="absolute -right-10 -bottom-10 w-96 h-96 rounded-full bg-[var(--accent-emerald)]/10 blur-3xl pointer-events-none" />
      </section>

      {/* ── Key Metrics Overview ── */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {overviewCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div
              key={card.label}
              className="group rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 sm:p-7 shadow-xs hover:border-[var(--accent-emerald)]/40 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono">
                  {card.label}
                </span>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${card.iconColor}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
              </div>
              <div className="text-4xl font-serif font-bold text-[var(--text-primary)] tracking-tight">
                {card.value}
              </div>
              <p className="mt-2 text-xs font-medium text-[var(--text-secondary)]">
                {card.note}
              </p>
            </div>
          );
        })}
      </section>

      {/* ── Featured Books Section ── */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-card)] pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--accent-emerald)] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recommended Reading</span>
            </div>
            <h3 className="text-2xl font-serif font-bold text-[var(--text-primary)]">
              Featured Library Volumes
            </h3>
          </div>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-emerald)] hover:underline self-start sm:self-auto"
          >
            <span>Explore All 50 Titles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredBooks.map((book) => {
            const isAvailable = book.availableCopies > 0;
            return (
              <article
                key={book.id}
                className="group rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 shadow-xs hover:border-[var(--accent-emerald)]/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
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
                      <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      {isAvailable ? `${book.availableCopies} available` : 'Out of stock'}
                    </span>
                  </div>

                  <h4 className="text-lg font-serif font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-emerald)] transition-colors line-clamp-1">
                    {book.title}
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] font-medium mt-0.5 mb-3">
                    by {book.author}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                    {book.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[var(--border-card)] flex items-center justify-between gap-3">
                  <Link
                    to={`/books/${book.id}`}
                    className="flex-1 py-2 px-3 rounded-xl bg-[var(--accent-indigo)] hover:bg-[var(--accent-indigo-hover)] text-white text-xs font-semibold text-center transition shadow-xs"
                  >
                    View & Reserve
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── Academic Tracks & Library Guidelines Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Affiliated Academic Tracks */}
        <section className="rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-[var(--border-card)] pb-4">
            <div>
              <h3 className="text-xl font-serif font-bold text-[var(--text-primary)]">
                Affiliated Academic Tracks
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Degree programs supported by library collections
              </p>
            </div>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[var(--bg-secondary)] text-[var(--accent-emerald)] border border-[var(--border-card)] font-mono">
              {courses.length} Courses
            </span>
          </div>

          <div className="space-y-3.5">
            {courses.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] italic text-center py-6">
                No academic courses listed.
              </p>
            ) : (
              courses.map((course) => (
                <CourseCard key={course.code || course.id} course={course} />
              ))
            )}
          </div>
        </section>

        {/* Library Guidelines & Resource Policies */}
        <section className="rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 sm:p-8 shadow-xs space-y-5">
          <div className="border-b border-[var(--border-card)] pb-4">
            <h3 className="text-xl font-serif font-bold text-[var(--text-primary)]">
              Borrowing & Reservation Policies
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              General guidelines for DLSL students and faculty
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-card)]">
              <div className="w-8 h-8 rounded-xl bg-[var(--accent-emerald)]/10 text-[var(--accent-emerald)] flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[var(--text-primary)]">
                  7-Day Loan Period
                </h4>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  General reference books can be checked out for up to 7 consecutive academic days. Renewals can be made once if no pending hold is active.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-card)]">
              <div className="w-8 h-8 rounded-xl bg-[var(--accent-amber)]/10 text-[var(--accent-amber)] flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[var(--text-primary)]">
                  Scheduled Pickup Deadlines
                </h4>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Reserved copies are held at the circulation desk until the confirmed pickup deadline date. Holds that lapse will be returned to circulation.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-card)]">
              <div className="w-8 h-8 rounded-xl bg-[var(--accent-sky)]/10 text-[var(--accent-sky)] flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[var(--text-primary)]">
                  Verified Student ID Verification
                </h4>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Please present your valid DLSL Student ID or Faculty Card upon claiming physical titles at the Main Library front desk.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
