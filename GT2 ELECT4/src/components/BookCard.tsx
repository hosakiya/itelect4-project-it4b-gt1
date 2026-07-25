// Mikaela Ysabel L. Lantafe | IT4B
import type { Book } from '../types';

interface BookCardProps {
  book: Book;
  onReserve: (bookId: number) => void;
}

function BookCard({ book, onReserve }: BookCardProps) {
  const isAvailable = book.availableCopies > 0;

  return (
    <div className="card book-card">
      <div className="card-header">
        <span className="genre-tag">{book.genre}</span>
        <span className={`availability ${isAvailable ? 'available' : 'unavailable'}`}>
          {isAvailable ? `${book.availableCopies} left` : 'Unavailable'}
        </span>
      </div>
      <div className="card-body">
        <h3 className="card-title">{book.title}</h3>
        <p className="card-author">by {book.author}</p>
        <p className="card-description">{book.description}</p>
      </div>
      <div className="card-footer">
        <button
          className={`btn btn-reserve ${!isAvailable ? 'btn-disabled' : ''}`}
          onClick={() => onReserve(book.id)}
          disabled={!isAvailable}
        >
          {isAvailable ? (
            <>
              <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.4rem', verticalAlign: 'middle' }}>
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                <path d="M6 6h10" />
                <path d="M6 10h10" />
              </svg>
              Reserve Now
            </>
          ) : 'Not Available'}
        </button>
      </div>
    </div>
  );
}

export default BookCard;
