// Mikaela Ysabel L. Lantafe | IT4B
import React from 'react';
import { ReservationStatus } from '../types';
import type { Reservation } from '../types';

interface ReservationCardProps {
  reservation: Reservation;
  onClick: (reservationId: number) => void;
}

function ReservationCard({ reservation, onClick }: ReservationCardProps) {
  const statusConfig: Record<ReservationStatus, { label: string; className: string; icon: React.ReactNode }> = {
    [ReservationStatus.Pending]: {
      label: 'Pending',
      className: 'status-pending',
      icon: (
        <svg className="icon-status" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.35rem', verticalAlign: 'middle' }}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      )
    },
    [ReservationStatus.Approved]: {
      label: 'Approved',
      className: 'status-approved',
      icon: (
        <svg className="icon-status" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.35rem', verticalAlign: 'middle' }}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )
    },
    [ReservationStatus.Completed]: {
      label: 'Completed',
      className: 'status-completed',
      icon: (
        <svg className="icon-status" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.35rem', verticalAlign: 'middle' }}>
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
          <path d="M6 6h10" />
          <path d="M6 10h10" />
        </svg>
      )
    },
    [ReservationStatus.Cancelled]: {
      label: 'Cancelled',
      className: 'status-cancelled',
      icon: (
        <svg className="icon-status" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.35rem', verticalAlign: 'middle' }}>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      )
    },
  };

  const { label, className, icon } = statusConfig[reservation.status];

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
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
      <div className="card-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="click-hint">Click to view details</span>
        <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </div>
  );
}

export default ReservationCard;
