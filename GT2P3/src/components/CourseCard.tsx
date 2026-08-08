import type { Course } from '../types';

interface CourseCardProps {
  course: Course;
  variant?: 'default' | 'compact';
}

function CourseCard({ course, variant = 'default' }: CourseCardProps) {
  const compact = variant === 'compact';

  return (
    <article className={`course-card p-4 transition-all duration-200 ${compact ? 'sm:p-3' : ''}`}>
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
        {!compact && (
          <div className="border-dashed border rounded-md border-[var(--border-card)] bg-[var(--bg-secondary)] p-2.5 text-xs text-[var(--text-muted)] ml-[3.25rem]">
            Enrolled learners can review progress in one place.
          </div>
        )}
      </div>
    </article>
  );
}

export default CourseCard;
