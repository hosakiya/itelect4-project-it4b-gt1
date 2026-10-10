import { Star } from 'lucide-react';
import type { Review } from '../types';

interface ReviewBadgeProps {
  review: Review;
  onClick: (reviewId: number) => void;
}

function ReviewBadge({ review, onClick }: ReviewBadgeProps) {
  const ratingLabel = (rating: number): string => {
    if (rating >= 5) return 'Excellent';
    if (rating >= 4) return 'Great';
    if (rating >= 3) return 'Good';
    if (rating >= 2) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="card review-badge cursor-pointer" onClick={() => onClick(review.id)}>
      <div className="card-header">
        <span className="review-id">Review #{review.id}</span>
        <span className="rating-label">{ratingLabel(review.rating)}</span>
      </div>
      <div className="card-body">
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`w-4 h-4 ${s <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-[var(--text-muted)] opacity-30'}`}
            />
          ))}
        </div>
        <p className="review-note">"{review.note}"</p>
        <div className="review-meta">
          <span>Reservation #{review.reservationId}</span>
          <span>•</span>
          <span>Author #{review.authorId}</span>
        </div>
      </div>
    </div>
  );
}

export default ReviewBadge;
