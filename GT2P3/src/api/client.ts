import type {
  ApiBook,
  ApiCourse,
  ApiReservation,
  ApiReview,
  ApiUser,
  CreateReservation,
  Book,
  Course,
  Reservation,
  Review,
  User,
} from '../types';

const API_URL = 'http://localhost:3001';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function toReservation(value: ApiReservation): Reservation {
  return {
    ...value,
    reservedAt: new Date(value.reservedAt),
    pickupDeadline: value.pickupDeadline ? new Date(value.pickupDeadline) : undefined,
  };
}

export async function getBooks(): Promise<Book[]> {
  return request<ApiBook[]>('/books');
}

export async function getBook(bookId: number): Promise<Book> {
  return request<ApiBook>(`/books/${bookId}`);
}

export async function getUsers(): Promise<User[]> {
  return request<ApiUser[]>('/users');
}

export async function getCourses(): Promise<Course[]> {
  return request<ApiCourse[]>('/courses');
}

export async function getReservations(): Promise<Reservation[]> {
  const reservations = await request<ApiReservation[]>('/reservations');
  return reservations.map(toReservation);
}

export async function getReviews(): Promise<Review[]> {
  return request<ApiReview[]>('/reviews');
}

export async function createReservation(reservation: CreateReservation): Promise<Reservation> {
  const created = await request<ApiReservation>('/reservations', {
    method: 'POST',
    body: JSON.stringify(reservation),
  });
  return toReservation(created);
}

export type LibraryCollection = User | Course | Book | Reservation | Review;
