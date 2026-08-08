import type { Course } from '../types';

interface CourseCardProps {
  course: Course;
  variant?: 'default' | 'compact';
}

function CourseCard({ course, variant = 'default' }: CourseCardProps) {
  const compact = variant === 'compact';

  return (
    <article className={`course-card rounded-lg border p-4 bg-[var(--bg-card)] border-[var(--border-card)] text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-card-hover)] shadow-sm hover:shadow-md transition-all duration-200 ${compact ? 'sm:p-3' : ''}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-muted)]">Course</p>
          <h3 className="mt-1 text-lg font-bold text-[var(--text-primary)] truncate">{course.title}</h3>
        </div>
        <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-700">{course.code}</span>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-[var(--text-secondary)]">{course.semester}</p>
        {!compact && (
          <div className="border-dashed border rounded-md border-[var(--border-card)] bg-[var(--bg-secondary)] p-3 text-sm text-[var(--text-secondary)]">
            Enrolled learners can review progress in one place.
          </div>
        )}
      </div>
    </article>
  );
}

export default CourseCard;
