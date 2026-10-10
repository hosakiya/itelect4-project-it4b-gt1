import { NavLink, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

export default function Layout() {
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const isDark = useThemeStore((state) => state.isDark);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 transform hover:-translate-y-0.5 ${
      isActive
        ? 'bg-[var(--accent-indigo)] text-white shadow-md shadow-[var(--accent-indigo)]/20'
        : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-card)]'
    }`;

  const actionBtnClass =
    'inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 transform hover:-translate-y-0.5 bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-card)] cursor-pointer';

  return (
    <div className="min-h-screen flex flex-col items-center bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 w-full overflow-x-hidden">
      {/* ── Top Header Bar ── */}
      <header className="w-full border-b border-[var(--border-card)] bg-[var(--bg-card)]/80 backdrop-blur-md sticky top-0 z-40 shadow-xs flex justify-center">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col items-center justify-center text-center">
          
          {/* Institutional Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-card)] mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-indigo)]" />
            <span className="text-[11px] font-bold tracking-widest uppercase text-[var(--accent-indigo)]">
              De La Salle Lipa • Library Registry
            </span>
          </div>

          {/* Centered Main Title */}
          <div className="flex items-center justify-center gap-3 my-1">
            <span className="text-3xl sm:text-4xl select-none" role="img" aria-label="Library Books">
              📚
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif italic font-bold tracking-tight text-[var(--accent-indigo)] text-center">
              mika's library
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-lg mx-auto text-center mt-1">
            Official Book Reservation & Learning Resource System for DLSL Students & Faculty
          </p>

          {/* Navigation Bar */}
          <nav className="mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            <NavLink to="/" className={getNavLinkClass}>
              <span>Home</span>
            </NavLink>
            <NavLink to="/catalog" className={getNavLinkClass}>
              <span>Catalog</span>
            </NavLink>
            <NavLink to="/dashboard" className={getNavLinkClass}>
              <span>Dashboard</span>
            </NavLink>
            {!token ? (
              <NavLink to="/login" className={getNavLinkClass}>
                <span>Login</span>
              </NavLink>
            ) : (
              <button type="button" onClick={logout} className={actionBtnClass}>
                <span>Logout</span>
              </button>
            )}
            <button
              type="button"
              onClick={toggleTheme}
              className={actionBtnClass}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <span>{isDark ? '☀️ Light' : '🌙 Dark'}</span>
            </button>
          </nav>
        </div>
      </header>

      {/* ── Main Content Area ── */}
      <div className="w-full flex-1 flex justify-center py-8 px-4 sm:px-6">
        <main className="w-full max-w-5xl flex flex-col items-center">
          <Outlet />
        </main>
      </div>

      {/* ── Footer ── */}
      <footer className="w-full bg-[var(--bg-secondary)] border-t border-[var(--border-card)] mt-auto py-8 flex justify-center text-center">
        <div className="w-full max-w-5xl mx-auto px-6 flex flex-col items-center justify-center gap-2">
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium">
            De La Salle Lipa Library Registry • IT-ELEC4
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Developed by <span className="font-semibold text-[var(--text-primary)]">Mikaela Ysabel L. Lantafe</span> (IT4B)
          </p>
        </div>
      </footer>
    </div>
  );
}

