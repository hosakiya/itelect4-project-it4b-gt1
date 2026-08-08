import type { Submission } from '../types';

interface SubmissionBadgeProps {
  submission: Submission;
  variant?: 'default' | 'compact';
}

function SubmissionBadge({ submission, variant = 'default' }: SubmissionBadgeProps) {
  const compact = variant === 'compact';

  const statusClasses =
    submission.status === 'draft'
      ? 'bg-slate-100 text-slate-700'
      : submission.status === 'submitted'
      ? 'bg-emerald-100 text-emerald-700'
      : 'bg-violet-100 text-violet-700';

  return (
    <article className={`submission-card rounded-lg border p-4 bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200 ${compact ? 'sm:p-3' : ''}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Submission</p>
          <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">#{submission.id}</h3>
        </div>
        <span className={`inline-flex items-center px-3 py-1 text-sm font-bold rounded-full ${statusClasses} capitalize`}>{submission.status}</span>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-700 p-2 rounded-md">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-300">Student</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white">#{submission.studentId}</span>
        </div>

        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-700 p-2 rounded-md">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-300">Course</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white">#{submission.courseId}</span>
        </div>

        {!compact && submission.submittedAt && (
          <div className="bg-slate-50 dark:bg-slate-700 p-3 rounded-md text-sm text-slate-600 dark:text-slate-300 text-center">
            Submitted {new Date(submission.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        )}
      </div>
    </article>
  );
}

export default SubmissionBadge;
