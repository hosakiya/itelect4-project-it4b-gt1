import type {
  Course,
  Book,
  Reservation,
  ApiReservation,
  CreateReservation,
  AuthReply,
  ApiUser,
  Review,
  User,
} from "../types/index";
import useAuthStore from "../store/authStore";

// Vite only exposes variables whose name starts with VITE_, and it
// replaces this at BUILD time -- the value that was in .env when
// `npm run build` ran is baked into the bundle.
export const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error(
    "VITE_API_URL is missing. Copy .env.example to .env, fill it in, " +
      "and restart npm run dev.",
  );
}

// Every call goes through here: the host, the JSON header, the token
// when there is one, and the API's own message when it refuses.
async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = useAuthStore.getState().token;

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `Request failed (${res.status})`);
  }

  // Handle 204 No Content
  if (res.status === 204) {
    return {} as T;
  }

  return res.json();
}

function toReservation(value: ApiReservation): Reservation {
  return {
    id: value.id,
    userId: value.userId,
    bookId: value.bookId,
    status: value.status,
    reservedAt: new Date(value.reservedAt),
    pickupDeadline: value.pickupDeadline ? new Date(value.pickupDeadline) : undefined,
  };
}

// ---- Books: public
export function getBooks(): Promise<Book[]> {
  return request<Book[]>("/api/books");
}

export function fetchBooks(): Promise<Book[]> {
  return getBooks();
}

export function getBook(bookId: string | number): Promise<Book> {
  return request<Book>(`/api/books/${bookId}`);
}

export function fetchBookById(bookId: string | number): Promise<Book> {
  return getBook(bookId);
}

// ---- Courses: public
export function getCourses(): Promise<Course[]> {
  return request<Course[]>("/api/courses");
}

export function fetchCourses(): Promise<Course[]> {
  return getCourses();
}

export function getCourseByCode(code: string): Promise<Course> {
  return request<Course>(`/api/courses/${code}`);
}

export function fetchCourseByCode(code: string): Promise<Course> {
  return getCourseByCode(code);
}

// ---- Reservations: private. Token attached automatically by request()
export async function getReservations(): Promise<Reservation[]> {
  const reservations = await request<ApiReservation[]>("/api/reservations");
  return reservations.map(toReservation);
}

export async function fetchReservations(): Promise<Reservation[]> {
  return getReservations();
}

export async function createReservation(
  data: CreateReservation,
): Promise<Reservation> {
  const created = await request<ApiReservation>("/api/reservations", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return toReservation(created);
}

export async function cancelReservation(
  reservationId: string | number,
  _bookId?: number | string,
): Promise<void> {
  await request(`/api/reservations/${reservationId}`, {
    method: "PATCH",
    body: JSON.stringify({ status: "cancelled" }),
  });
}

export async function deleteReservation(
  reservationId: string | number,
): Promise<void> {
  await request(`/api/reservations/${reservationId}`, {
    method: "DELETE",
  });
}

// ---- Users and Reviews
export async function getUsers(): Promise<User[]> {
  return [];
}

export async function getReviews(): Promise<Review[]> {
  return [];
}

// ---- Auth: the two routes that make a session exist
export function registerUser(body: {
  name: string;
  email: string;
  password: string;
}): Promise<ApiUser> {
  return request<ApiUser>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function loginUser(body: {
  email: string;
  password: string;
}): Promise<AuthReply> {
  return request<AuthReply>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export { request };
