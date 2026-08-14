import { useNavigate } from 'react-router-dom';
import { mockBooks, mockCourses, mockReservations, mockReviews, mockUsers } from '../data/libraryData';

export default function HomePage() {
  const navigate = useNavigate();

  const overviewCards = [
    { label: 'Total Books', value: mockBooks.length, note: 'Curated titles across every genre', accent: 'indigo' },
    { label: 'Active Reservations', value: mockReservations.length, note: 'Pending pickups and approvals', accent: 'emerald' },
    { label: 'Review Notes', value: mockReviews.length, note: 'Shared feedback from readers', accent: 'amber' },
  ];

  return (
    <div className="overview-shell w-full">
      <div className="overview-hero">
        <div className="overview-hero-copy">
          <span className="overview-hero-badge">Library snapshot</span>
          <h2 className="overview-hero-title">A calm, complete view of your library activity.</h2>
          <p className="overview-hero-text">Monitor catalog health, reservations, and reader feedback from one polished overview.</p>
          <button
            type="button"
            onClick={() => navigate('/catalog')}
            className="mt-4 rounded-full bg-[var(--accent-indigo)] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
          >
            Browse catalog
          </button>
        </div>
        <div className="overview-hero-accent" />
      </div>

      <div className="overview-stats-grid">
        {overviewCards.map((card) => (
          <div key={card.label} className={`overview-stat-card accent-${card.accent}`}>
            <div className="overview-stat-icon">
              {card.accent === 'emerald' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              ) : card.accent === 'amber' ? (
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
              <div className="overview-stat-label">{card.label}</div>
              <div className="overview-stat-value">{card.value}</div>
              <div className="overview-stat-note">{card.note}</div>
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
            <span className="overview-section-pill">{mockUsers.length} active</span>
          </div>
          <div className="overview-card-stack">
            {mockUsers.map((user) => (
              <article key={user.id} className="user-card p-4 transition-all duration-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full font-bold text-xs bg-[var(--bg-secondary)] text-[var(--accent-indigo)] border border-[var(--border-card)] shrink-0">
                    {user.name
                      .split(' ')
                      .map((part) => part[0])
                      .join('')
                      .toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Account Holder</p>
                    <h3 className="text-base font-bold text-[var(--text-primary)] truncate">{user.name}</h3>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-sm text-[var(--text-secondary)] truncate pl-[3.25rem]">{user.email}</p>
                  <div className="flex items-center justify-between bg-[var(--bg-secondary)] p-2 rounded-md ml-[3.25rem]">
                    <span className="text-xs font-medium text-[var(--text-muted)]">Performance Score</span>
                    <span className="text-xs font-bold text-[var(--text-primary)]">{user.score}/100</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="overview-section-card">
          <div className="overview-section-header">
            <div>
              <h2 className="overview-section-title">Affiliated Tracks</h2>
              <p className="overview-section-subtitle">Programs linked to the library</p>
            </div>
            <span className="overview-section-pill">{mockCourses.length} tracks</span>
          </div>
          <div className="overview-card-stack">
            {mockCourses.map((course) => (
              <article key={course.id} className="course-card p-4 transition-all duration-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--bg-secondary)] text-[var(--accent-amber)] border border-[var(--border-card)] shrink-0">
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Course</p>
                    <h3 className="text-base font-bold text-[var(--text-primary)] truncate">{course.title}</h3>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[rgba(184,134,11,0.12)] text-[var(--accent-amber)] font-mono">
                    {course.code}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-sm font-semibold text-[var(--text-secondary)] pl-[3.25rem]">{course.semester}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
