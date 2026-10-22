import { useState } from 'react';
import { NavLink, Link, Outlet } from 'react-router-dom';
import { BookOpen, Moon, Sun, Menu, X, LogIn, UserPlus, LogOut, Compass, LayoutDashboard, BookmarkCheck } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const token = useAuthStore((state) => state.token);
  const userName = useAuthStore((state) => state.userName);
  const logout = useAuthStore((state) => state.logout);
  const isDark = useThemeStore((state) => state.isDark);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  // Close mobile menu on route change
  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
      isActive
        ? 'bg-[var(--accent-indigo)] text-white shadow-sm shadow-[var(--accent-indigo)]/25'
        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
    }`;

  const userInitials = userName
    ? userName
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 w-full overflow-x-hidden">
      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-50 w-full border-b border-[var(--border-card)] bg-[var(--bg-card)]/90 backdrop-blur-md shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Name */}
          <Link
            to="/"
            onClick={handleNavClick}
            className="flex items-center gap-3.5 group focus:outline-hidden"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[var(--accent-emerald)] to-[var(--accent-indigo)] text-white flex items-center justify-center shadow-md shadow-[var(--accent-emerald)]/20 transition-transform duration-200 group-hover:scale-105 shrink-0">
              <BookOpen className="w-6 h-6" strokeWidth={2.2} />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-emerald)]" />
                <span className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-[var(--accent-emerald)] font-mono">
                  De La Salle Lipa
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-[var(--text-primary)] leading-tight group-hover:text-[var(--accent-emerald)] transition-colors">
                Campus Library
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[var(--bg-secondary)] p-1.5 rounded-full border border-[var(--border-card)]">
            <NavLink to="/" className={getNavLinkClass}>
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>Home</span>
            </NavLink>
            <NavLink to="/catalog" className={getNavLinkClass}>
              <Compass className="w-3.5 h-3.5" />
              <span>Catalog</span>
            </NavLink>
            <NavLink to="/dashboard" className={getNavLinkClass}>
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </NavLink>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full border border-[var(--border-card)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-card-hover)] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle color theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" strokeWidth={2.2} />
              ) : (
                <Moon className="w-4 h-4 text-[var(--accent-indigo)]" strokeWidth={2.2} />
              )}
            </button>

            {/* Desktop Auth Controls */}
            {!token ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition border border-transparent hover:border-[var(--border-card)]"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Log In</span>
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white bg-[var(--accent-indigo)] hover:bg-[var(--accent-indigo-hover)] shadow-sm shadow-[var(--accent-indigo)]/25 transition transform hover:-translate-y-0.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </Link>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2.5 pl-1 border-l border-[var(--border-card)]">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-card)]">
                  <div className="w-6 h-6 rounded-full bg-[var(--accent-indigo)] text-white text-[11px] font-bold flex items-center justify-center">
                    {userInitials}
                  </div>
                  <span className="text-xs font-semibold text-[var(--text-primary)] max-w-28 truncate">
                    {userName || 'Student'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="p-2 rounded-full text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                  title="Log Out"
                  aria-label="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Mobile Menu Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-full border border-[var(--border-card)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center transition cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[var(--border-card)] bg-[var(--bg-card)]/95 backdrop-blur-lg px-4 pt-4 pb-6 space-y-3 shadow-lg transition-all animate-in slide-in-from-top-4 duration-200">
            <nav className="flex flex-col gap-1.5">
              <NavLink
                to="/"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? 'bg-[var(--accent-indigo)] text-white'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                  }`
                }
              >
                <BookmarkCheck className="w-4 h-4" />
                <span>Home</span>
              </NavLink>

              <NavLink
                to="/catalog"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? 'bg-[var(--accent-indigo)] text-white'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                  }`
                }
              >
                <Compass className="w-4 h-4" />
                <span>Catalog</span>
              </NavLink>

              <NavLink
                to="/dashboard"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? 'bg-[var(--accent-indigo)] text-white'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                  }`
                }
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </NavLink>
            </nav>

            {/* Mobile Auth Actions */}
            <div className="pt-3 border-t border-[var(--border-card)]">
              {!token ? (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={handleNavClick}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold border border-[var(--border-card)] bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Log In</span>
                  </Link>
                  <Link
                    to="/register"
                    onClick={handleNavClick}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold bg-[var(--accent-indigo)] text-white"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Register</span>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-card)]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[var(--accent-indigo)] text-white text-xs font-bold flex items-center justify-center">
                      {userInitials}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[var(--text-primary)]">{userName || 'Student'}</p>
                      <p className="text-[10px] text-[var(--text-muted)]">Signed In</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      handleNavClick();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ── Main Content Container ── */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* ── Professional Institutional Footer ── */}
      <footer className="w-full bg-[var(--bg-secondary)] border-t border-[var(--border-card)] mt-auto py-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent-indigo)]/10 text-[var(--accent-indigo)] flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-serif font-bold text-[var(--text-primary)]">
                De La Salle Lipa • Campus Library
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Academic Resource & Book Reservation Management System
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-[var(--text-secondary)]">
            <span className="font-mono text-[11px] px-2.5 py-1 rounded-md bg-[var(--bg-card)] border border-[var(--border-card)]">
              IT-ELEC4 • Term Project
            </span>
            <p>
              Designed & Developed by{' '}
              <span className="font-semibold text-[var(--text-primary)]">
                Mikaela Ysabel L. Lantafe
              </span>{' '}
              (IT4B)
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
