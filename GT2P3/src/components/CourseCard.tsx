import { GraduationCap, BookOpenCheck } from 'lucide-react';
import type { Course } from '../types';

interface CourseCardProps {
  course: Course;
  variant?: 'default' | 'compact';
}

function CourseCard({ course, variant = 'default' }: CourseCardProps) {
  const compact = variant === 'compact';

  return (
    <article className={`group rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-4 sm:p-5 shadow-xs hover:border-[var(--accent-emerald)]/40 hover:shadow-md transition-all duration-200 ${compact ? 'p-3.5' : ''}`}>
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent-emerald)]/10 text-[var(--accent-emerald)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5" strokeWidth={2} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-emerald)] font-mono">
              Academic Track
            </span>
            <h4 className="text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-emerald)] transition-colors leading-snug">
              {course.title}
            </h4>
          </div>
        </div>

        <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-lg bg-[var(--bg-secondary)] text-[var(--accent-emerald)] border border-[var(--border-card)] font-mono shrink-0">
          {course.code}
        </span>
      </div>

      <div className="flex items-center justify-between pt-3 mt-2 border-t border-[var(--border-card)] text-xs text-[var(--text-secondary)]">
        <span className="font-medium">{course.semester}</span>
        <span className="inline-flex items-center gap-1 text-[var(--text-muted)]">
          <BookOpenCheck className="w-3.5 h-3.5 text-[var(--accent-emerald)]" />
          <span>Curriculum Active</span>
        </span>
      </div>
    </article>
  );
}

export default CourseCard;
