// Mikaela Ysabel L. Lantafe | IT4B
import { useState } from 'react';
import { ReservationStatus } from './types';
import type { Book, Reservation, Review } from './types';
import BookCard from './components/BookCard';
import ReservationCard from './components/ReservationCard';
import ReviewBadge from './components/ReviewBadge';
import './App.css';

// ── Mock Data ──────────────────────────────────────────────

const mockBooks: Book[] = [
  {
    id: 1,
    title: 'Harry Potter and the Goblet of Fire',
    author: 'J.K. Rowling',
    genre: 'Fantasy',
    availableCopies: 2,
    description: 'A parody adventure set around a wizarding tournament.',
  },
  {
    id: 2,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Classic',
    availableCopies: 0,
    description: 'A story of the mysteriously wealthy Jay Gatsby.',
  },
  {
    id: 3,
    title: 'Clean Code',
    author: 'Robert C. Martin',
    genre: 'Technology',
    availableCopies: 5,
    description: 'A handbook of agile software craftsmanship.',
  },
];

const mockReservations: Reservation[] = [
  {
    id: 101,
    userId: 1,
    bookId: 1,
    status: ReservationStatus.Approved,
    reservedAt: '2026-07-15T08:30:00Z',
    pickupDeadline: '2026-07-18T08:30:00Z',
  },
  {
    id: 102,
    userId: 2,
    bookId: 3,
    status: ReservationStatus.Pending,
    reservedAt: '2026-07-17T14:00:00Z',
    pickupDeadline: '2026-07-20T14:00:00Z',
  },
  {
    id: 103,
    userId: 1,
    bookId: 2,
    status: ReservationStatus.Completed,
    reservedAt: '2026-06-01T09:00:00Z',
  },
];

const mockReviews: Review[] = [
  {
    id: 201,
    reservationId: 103,
    authorId: 1,
    note: 'Excellent availability and quick pickup process!',
    rating: 5,
  },
  {
    id: 202,
    reservationId: 101,
    authorId: 1,
    note: 'Great condition, enjoyed reading this again.',
    rating: 4,
  },
  {
    id: 203,
    reservationId: 102,
    authorId: 2,
    note: 'Good reference book for class projects.',
    rating: 3,
  },
];

// ── App Component ──────────────────────────────────────────

function App() {
  const [lastAction, setLastAction] = useState<string>('No actions yet.');

  const handleReserve = (bookId: number): void => {
    const book = mockBooks.find((b) => b.id === bookId);
    setLastAction(`📖 Reserved "${book?.title}" (Book #${bookId})`);
  };

  const handleReservationClick = (reservationId: number): void => {
    setLastAction(`📋 Viewing Reservation #${reservationId}`);
  };

  const handleReviewClick = (reviewId: number): void => {
    setLastAction(`⭐ Viewing Review #${reviewId}`);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>BOOK RESERVATION SYSTEM</h1>
          <p className="subtitle">Book Reservation System — Mikaela Ysabel L. Lantafe | IT4B</p>
        </div>
      </header>

      <div className="toast-bar">
        <span className="toast-icon">⚡</span>
        <span>{lastAction}</span>
      </div>

      <main className="app-main">
        {/* ── Books Section ── */}
        <section className="section">
          <div className="section-header">
            <h2>📖 Available Books</h2>
            <span className="section-count">{mockBooks.length} books</span>
          </div>
          <div className="card-grid">
            {mockBooks.map((book) => (
              <BookCard key={book.id} book={book} onReserve={handleReserve} />
            ))}
          </div>
        </section>

        {/* ── Reservations Section ── */}
        <section className="section">
          <div className="section-header">
            <h2>📋 Reservations</h2>
            <span className="section-count">{mockReservations.length} reservations</span>
          </div>
          <div className="card-grid">
            {mockReservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                onClick={handleReservationClick}
              />
            ))}
          </div>
        </section>

        {/* ── Reviews Section ── */}
        <section className="section">
          <div className="section-header">
            <h2>⭐ Reviews</h2>
            <span className="section-count">{mockReviews.length} reviews</span>
          </div>
          <div className="card-grid">
            {mockReviews.map((review) => (
              <ReviewBadge key={review.id} review={review} onClick={handleReviewClick} />
            ))}
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>IT-ELEC4 • Vite + React + TypeScript • GT1 Graded Task</p>
      </footer>
    </div>
  );
}

export default App;
