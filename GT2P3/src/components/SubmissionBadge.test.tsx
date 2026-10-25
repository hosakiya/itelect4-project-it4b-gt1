import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SubmissionBadge from './SubmissionBadge';
import type { Submission } from '../types';

describe('SubmissionBadge', () => {
  it('shows the status supplied by its submission prop', () => {
    const submission: Submission = {
      id: 12,
      studentId: 34,
      courseId: 56,
      status: 'submitted',
    };

    const { rerender } = render(<SubmissionBadge submission={submission} />);
    expect(screen.getByText('submitted')).toBeInTheDocument();

    rerender(
      <SubmissionBadge submission={{ ...submission, status: 'reviewed' }} />,
    );
    expect(screen.getByText('reviewed')).toBeInTheDocument();
  });
});
