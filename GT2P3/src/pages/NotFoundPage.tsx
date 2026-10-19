import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex w-full max-w-xl mx-auto flex-col items-center justify-center rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] px-6 py-16 text-center shadow-xs">
      <Compass className="w-12 h-12 text-[var(--accent-indigo)] mb-4" strokeWidth={1.5} />
      <h1 className="mb-2 text-7xl font-bold tracking-tight text-[var(--text-primary)] opacity-10">404</h1>
      <h2 className="text-3xl font-serif italic text-[var(--text-primary)]">Page not found</h2>
      <p className="mt-4 mb-8 max-w-md text-[var(--text-secondary)]">
        The URL you tried does not exist. Please return to a valid page.
      </p>
      <Link
        to="/"
        className="rounded-full bg-[var(--text-primary)] px-8 py-3 text-sm font-medium text-[var(--bg-card)] transition-transform hover:scale-105 active:scale-95"
      >
        Go Home
      </Link>
    </div>
  );
}
