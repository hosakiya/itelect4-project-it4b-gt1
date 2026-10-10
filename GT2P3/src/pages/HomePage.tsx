import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBooks, getCourses, getReservations, getReviews, getUsers } from '../api/client';
import UserCard from '../components/UserCard';
import CourseCard from '../components/CourseCard';

export default function HomePage() {
  const navigate = useNavigate();
  const { data: books = [], isLoading: booksLoading } = useQuery({ queryKey: ['books'], queryFn: getBooks });
  const { data: users = [], isLoading: usersLoading } = useQuery({ queryKey: ['users'], queryFn: getUsers });
  const { data: courses = [], isLoading: coursesLoading } = useQuery({ queryKey: ['courses'], queryFn: getCourses });
  const { data: reservations = [], isLoading: reservationsLoading } = useQuery({ queryKey: ['reservations'], queryFn: getReservations });
  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({ queryKey: ['reviews'], queryFn: getReviews });

  if (booksLoading || usersLoading || coursesLoading || reservationsLoading || reviewsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-10 h-10 border-3 border-[var(--border-card)] border-t-[var(--accent-indigo)] rounded-full animate-spin" />
        <p className="text-sm font-medium text-[var(--text-muted)]">Loading library registry...</p>
      </div>
    );
  }

  const overviewCards = [
    {
      label: 'Catalog Volumes',
      value: books.length,
      note: 'Available for reservation & checkout',
      accent: 'indigo',
      icon: '📚',
    },
    {
      label: 'Active Reservations',
      value: reservations.length,
      note: 'Queued & scheduled pickups',
      accent: 'emerald',
      icon: '🔖',
    },
    {
      label: 'Reader Reviews',
      value: reviews.length,
      note: 'Community feedback & ratings',
      accent: 'amber',
      icon: '⭐',
    },
  ];

  return (
    <div className="w-full space-y-8">
      {/* ── Institutional Hero Banner ── */}
      <section className="relative overflow-hidden rounded-3xl border border-[var(--border-card)] bg-gradient-to-br from-[var(--bg-card)] via-[var(--bg-secondary)]/50 to-[var(--bg-card)] p-8 sm:p-10 shadow-sm">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-indigo)]/10 text-[var(--accent-indigo)] text-xs font-bold uppercase tracking-wider">
            <span>🏛️</span> DLSL Academic Repository
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--text-primary)] leading-tight">
            Welcome to the Learning Resource Portal
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            Reserve reference books, track borrowing activity, and manage course catalog materials with ease.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/catalog')}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-indigo)] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[var(--accent-indigo)]/20 transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Explore Catalog</span>
              <span>→</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border-card)] bg-[var(--bg-card)] px-6 py-3 text-sm font-semibold text-[var(--text-primary)] transition-all duration-200 hover:bg-[var(--bg-card-hover)] hover:-translate-y-0.5 cursor-pointer"
            >
              <span>My Dashboard</span>
            </button>
          </div>
        </div>

        {/* Ambient Decorative Graphic */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 rounded-full bg-[var(--accent-indigo)]/5 blur-3xl pointer-events-none" />
      </section>

      {/* ── Key Metrics ── */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {overviewCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 shadow-xs hover:border-[var(--border-card-hover)] transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                {card.label}
              </span>
              <span className="text-2xl" role="img" aria-label={card.label}>
                {card.icon}
              </span>
            </div>
            <div className="text-4xl font-serif font-bold text-[var(--text-primary)] tracking-tight">
              {card.value}
            </div>
            <div className="mt-2 text-xs font-medium text-[var(--text-secondary)]">
              {card.note}
            </div>
          </div>
        ))}
      </section>

      {/* ── Directory Grids ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Members Directory */}
        <section className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-[var(--border-card)] pb-4">
            <div>
              <h3 className="text-lg font-serif font-bold text-[var(--text-primary)]">
                Members Directory
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Active accounts & verified students</p>
            </div>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-card)]">
              {users.length} Registered
            </span>
          </div>

          <div className="space-y-3">
            {users.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        </section>

        {/* Academic Programs */}
        <section className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-[var(--border-card)] pb-4">
            <div>
              <h3 className="text-lg font-serif font-bold text-[var(--text-primary)]">
                Affiliated Academic Tracks
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Degree programs supported</p>
            </div>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-card)]">
              {courses.length} Courses
            </span>
          </div>

          <div className="space-y-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
