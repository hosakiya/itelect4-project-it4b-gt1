export default function NotFoundPage() {
  return (
    <div className="w-full max-w-xl rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 text-center shadow-sm">
      <h2 className="text-3xl font-serif italic text-[var(--text-primary)]">Page not found</h2>
      <p className="mt-3 text-[var(--text-secondary)]">The URL you tried does not exist. Please return to a valid page.</p>
    </div>
  );
}
