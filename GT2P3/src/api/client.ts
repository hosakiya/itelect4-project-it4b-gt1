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

// Vite exposes variables whose name starts with VITE_.
// We provide a fallback to the live production backend so the deployed app
// never crashes with a blank screen if environment variables are not injected.
export const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ||
  "https://itelect4-backend-eosin.vercel.app";

if (!import.meta.env.VITE_API_URL && import.meta.env.DEV) {
  console.warn(
    "VITE_API_URL is missing. Using fallback: " + API_URL,
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
  const resId = value.id ?? (value as any)._id ?? String(Math.random());
  return {
    id: resId,
    userId: value.userId,
    bookId: value.bookId,
    status: value.status,
    reservedAt: value.reservedAt ? new Date(value.reservedAt) : new Date(),
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
  const token = useAuthStore.getState().token;
  if (!token) {
    return [];
  }
  try {
    const reservations = await request<ApiReservation[]>("/api/reservations");
    return Array.isArray(reservations) ? reservations.map(toReservation) : [];
  } catch (err) {
    console.error("Failed to load reservations:", err);
    return [];
  }
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
