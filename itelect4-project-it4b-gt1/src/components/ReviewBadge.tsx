// Mikaela Ysabel L. Lantafe | IT4B
import type { Review } from '../types';

interface ReviewBadgeProps {
  review: Review;
  onClick: (reviewId: number) => void;
}

function ReviewBadge({ review, onClick }: ReviewBadgeProps) {
  const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

  const ratingLabel = (rating: number): string => {
    if (rating >= 5) return 'Excellent';
    if (rating >= 4) return 'Great';
    if (rating >= 3) return 'Good';
    if (rating >= 2) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="card review-badge" onClick={() => onClick(review.id)}>
      <div className="card-header">
        <span className="review-id">Review #{review.id}</span>
        <span className="rating-label">{ratingLabel(review.rating)}</span>
      </div>
      <div className="card-body">
        <div className="stars-display">{stars}</div>
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
