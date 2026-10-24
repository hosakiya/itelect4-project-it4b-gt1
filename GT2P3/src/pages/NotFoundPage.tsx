import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center py-6 sm:py-12">
      <div className="flex w-full max-w-lg mx-auto flex-col items-center justify-center rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] px-8 py-16 text-center shadow-sm space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[var(--accent-emerald)]/10 text-[var(--accent-emerald)] flex items-center justify-center mb-2">
          <Compass className="w-8 h-8" strokeWidth={1.75} />
        </div>
        <span className="text-6xl font-bold font-mono tracking-tight text-[var(--accent-emerald)] opacity-20">
          404
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-[var(--text-primary)]">
          Page Not Found
        </h2>
        <p className="max-w-sm text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
          The requested library page does not exist or may have been moved. Return to the homepage to navigate the catalog.
        </p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--accent-indigo)] hover:bg-[var(--accent-indigo-hover)] px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Home</span>
        </Link>
      </div>
    </div>
  );
}
