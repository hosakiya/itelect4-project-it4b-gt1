import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpenCheck, ExternalLink, ShieldCheck } from 'lucide-react';

const loanPolicies = [
  ['General collection', '1 week for students; 3 months for faculty', '3 for students; faculty limits vary'],
  ['Fiction collection', '1 week', '3 books'],
  ['Theses', '1 week', '2 books'],
  ['Bibles', 'Library and classroom use only', '1'],
  ['General references (encyclopedias, almanacs, atlases)', 'Library and photocopy use only', 'Library use'],
  ['Special collections', 'Library use only', 'Library use'],
  ['Reserve collection', 'Overnight use starts at 5:00 PM; return by 9:00 AM next day', 'Confirm with LRC'],
  ['JPIA collection', '1 week for BSA students only', 'Confirm with LRC'],
  ['Law collection', 'Room and photocopy use only', '6 for Law students; 3 for non-Law students'],
  ['Periodicals', '2 days for current issues; 1 week for back issues', 'Faculty and students'],
  ['Archival materials', 'Room use only', 'Faculty, students, and Lasallian Partners'],
  ['Electronic resources', '7 days', 'Confirm with LRC'],
];

const fines = [
  ['Overdue reserve books, storybooks, and Bibles', '₱2 per library hour'],
  ['Overdue general circulation books', '₱5 per item per school day'],
  ['Lost or damaged library materials', 'Replacement with the same, related, or updated title, plus ₱50 processing fee'],
  ['Lost or damaged date-due card', '₱50'],
  ['Late return of photocopy/classroom-use books (over 30 minutes)', '₱2 per hour'],
  ['Integrated School/LRC collection overdue items', '₱2 per book per day'],
];

export default function GuidelinesPage() {
  return (
    <article className="mx-auto w-full max-w-5xl space-y-8">
      <Link to="/catalog" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--accent-emerald)]">
        <ArrowLeft className="h-4 w-4" /> Back to catalog
      </Link>

      <header className="rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] p-7 sm:p-10">
        <div className="mb-4 flex items-center gap-3 text-[var(--accent-emerald)]">
          <ShieldCheck className="h-7 w-7" />
          <span className="text-xs font-bold uppercase tracking-widest">Student guide</span>
        </div>
        <h1 className="text-3xl font-serif font-bold sm:text-4xl">DLSL Learning Resource Center</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--text-secondary)]">
          Rules for borrowing books, using library resources, and keeping the LRC a quiet, clean place to study. Policies can vary by collection and patron type; confirm your loan period and eligibility with LRC staff.
        </p>
      </header>

      <section className="rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 sm:p-8">
        <h2 className="mb-5 flex items-center gap-2 text-xl font-serif font-bold"><BookOpenCheck className="h-5 w-5 text-[var(--accent-emerald)]" />General library rules</h2>
        <ol className="grid gap-3 sm:grid-cols-2">
          {[
            'Wear your valid school ID while inside the LRC and tap it at the Library Monitoring System when entering.',
            'Disinfect your hands with sanitizer or alcohol when entering and leaving.',
            'Keep the library quiet, clean, and orderly. Set phones to silent and take calls outside the reading area.',
            'Only water in a personal tumbler is allowed.',
            'Follow the school dress code.',
            'Allow your bag to be inspected when required.',
            'Get written approval from the LRC Head before taking photos or videos for coverage.',
            'Wipe the keyboard, mouse, and table after using an LRC computer.',
            'Borrow books for home use at the Users and Information Services Counter.',
          ].map((rule, index) => (
            <li key={rule} className="flex gap-3 rounded-2xl bg-[var(--bg-secondary)] p-4 text-sm leading-6 text-[var(--text-secondary)]">
              <span className="font-bold text-[var(--accent-emerald)]">{index + 1}.</span>{rule}
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 sm:p-8">
        <h2 className="mb-2 text-xl font-serif font-bold">Book borrowing rules</h2>
        <p className="mb-5 text-sm text-[var(--text-secondary)]">Loan duration and limits depend on the material type and your classification.</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead><tr className="border-b border-[var(--border-card)] text-[var(--text-primary)]"><th className="p-3">Collection</th><th className="p-3">Loan / use period</th><th className="p-3">Number allowed</th></tr></thead>
            <tbody>{loanPolicies.map(([type, period, count]) => <tr key={type} className="border-b border-[var(--border-card)] last:border-0"><th className="p-3 font-semibold text-[var(--text-primary)]">{type}</th><td className="p-3 text-[var(--text-secondary)]">{period}</td><td className="p-3 text-[var(--text-secondary)]">{count}</td></tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 sm:p-8">
        <h2 className="mb-5 text-xl font-serif font-bold">Fines and penalties</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead><tr className="border-b border-[var(--border-card)]"><th className="p-3">Violation or issue</th><th className="p-3">Published policy</th></tr></thead>
            <tbody>{fines.map(([issue, policy]) => <tr key={issue} className="border-b border-[var(--border-card)] last:border-0"><th className="p-3 font-semibold text-[var(--text-primary)]">{issue}</th><td className="p-3 text-[var(--text-secondary)]">{policy}</td></tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 sm:p-8">
        <h2 className="mb-3 text-xl font-serif font-bold">Handling library books</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--text-secondary)]">
          <li>Handle books carefully. Do not write in, highlight, tear, or otherwise damage library materials.</li>
          <li>Return borrowed items on or before their due date.</li>
          <li>Follow use restrictions for reference books, special collections, theses, and archival materials.</li>
          <li>Use the LRC counter's official borrowing and return procedures.</li>
        </ul>
        <p className="mt-5 text-xs leading-5 text-[var(--text-muted)]">This site records reservation requests. A reservation receipt does not confirm that a book has been issued; the LRC confirms the loan and due date at checkout. Charges and loan privileges should be verified with library staff.</p>
        <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold">
          <a className="inline-flex items-center gap-1.5 text-[var(--accent-emerald)] hover:underline" href="https://www.dlsl.edu.ph/page/campus-life/learning-resource-center/general-guidelines" target="_blank" rel="noreferrer">Official general guidelines <ExternalLink className="h-3.5 w-3.5" /></a>
          <a className="inline-flex items-center gap-1.5 text-[var(--accent-emerald)] hover:underline" href="https://www.dlsl.edu.ph/page/campus-life/learning-resource-center/lrc-areas" target="_blank" rel="noreferrer">Official loan policies and fines <ExternalLink className="h-3.5 w-3.5" /></a>
        </div>
      </section>
    </article>
  );
}
