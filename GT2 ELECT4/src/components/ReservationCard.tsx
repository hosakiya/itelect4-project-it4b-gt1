// Mikaela Ysabel L. Lantafe | IT4B
import { ReservationStatus } from '../types';
import type { Reservation } from '../types';

interface ReservationCardProps {
  reservation: Reservation;
  onClick: (reservationId: number) => void;
}

function ReservationCard({ reservation, onClick }: ReservationCardProps) {
  const statusConfig: Record<ReservationStatus, { label: string; className: string; icon: string }> = {
    [ReservationStatus.Pending]: { label: 'Pending', className: 'status-pending', icon: '⏳' },
    [ReservationStatus.Approved]: { label: 'Approved', className: 'status-approved', icon: '✅' },
    [ReservationStatus.Completed]: { label: 'Completed', className: 'status-completed', icon: '📚' },
    [ReservationStatus.Cancelled]: { label: 'Cancelled', className: 'status-cancelled', icon: '❌' },
  };

  const { label, className, icon } = statusConfig[reservation.status];

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="card reservation-card" onClick={() => onClick(reservation.id)}>
      <div className="card-header">
        <span className="reservation-id">#{reservation.id}</span>
        <span className={`status-badge ${className}`}>
          {icon} {label}
        </span>
      </div>
      <div className="card-body">
        <div className="reservation-detail">
          <span className="detail-label">User ID</span>
          <span className="detail-value">{reservation.userId}</span>
        </div>
        <div className="reservation-detail">
          <span className="detail-label">Book ID</span>
          <span className="detail-value">{reservation.bookId}</span>
        </div>
        <div className="reservation-detail">
          <span className="detail-label">Reserved</span>
          <span className="detail-value">{formatDate(reservation.reservedAt)}</span>
        </div>
        {reservation.pickupDeadline && (
          <div className="reservation-detail">
            <span className="detail-label">Pickup by</span>
            <span className="detail-value deadline">{formatDate(reservation.pickupDeadline)}</span>
          </div>
        )}
      </div>
      <div className="card-footer">
        <span className="click-hint">Click to view details →</span>
      </div>
    </div>
  );
}

export default ReservationCard;
