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
          {isAvailable ? '📖 Reserve Now' : 'Not Available'}
        </button>
      </div>
    </div>
  );
}

export default BookCard;
