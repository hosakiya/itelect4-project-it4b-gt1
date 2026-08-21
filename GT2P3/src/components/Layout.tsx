import { NavLink, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

export default function Layout() {
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const isDark = useThemeStore((state) => state.isDark);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

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

            <nav className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <NavLink to="/" className={({ isActive }) => `px-4 py-2 rounded-full text-sm font-semibold transition ${isActive ? 'bg-[var(--accent-indigo)] text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'}`}>
                Home
              </NavLink>
              <NavLink to="/catalog" className={({ isActive }) => `px-4 py-2 rounded-full text-sm font-semibold transition ${isActive ? 'bg-[var(--accent-indigo)] text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'}`}>
                Catalog
              </NavLink>
              <NavLink to="/dashboard" className={({ isActive }) => `px-4 py-2 rounded-full text-sm font-semibold transition ${isActive ? 'bg-[var(--accent-indigo)] text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'}`}>
                Dashboard
              </NavLink>
              {!token ? (
                <NavLink to="/login" className={({ isActive }) => `px-4 py-2 rounded-full text-sm font-semibold transition ${isActive ? 'bg-[var(--accent-indigo)] text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'}`}>
                  Login
                </NavLink>
              ) : (
                <button
                  type="button"
                  onClick={logout}
                  className="px-4 py-2 rounded-full text-sm font-semibold bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] transition"
                >
                  Logout
                </button>
              )}
              <button
                type="button"
                onClick={toggleTheme}
                className="px-4 py-2 rounded-full text-sm font-semibold bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] transition"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? '☀️ Light' : '🌙 Dark'}
              </button>
            </nav>
          </header>

          <main className="max-w-5xl mx-auto p-6 flex-1 w-full flex items-center justify-center">
            <Outlet />
          </main>
        </div>
      </div>

      <footer className="max-w-5xl mx-auto p-6 text-sm text-[var(--text-muted)] border-t border-[var(--border-card)] text-center">
        De La Salle Lipa Library Registry • Built for IT-ELEC4 — Mikaela Ysabel L. Lantafe
      </footer>
    </div>
  );
}
