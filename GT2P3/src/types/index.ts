// Mikaela Ysabel L. Lantafe | IT4B
export interface User {
    id: number;
    name: string;
    email: string;
    role: "student" | "librarian" | "admin";
    isActive: boolean;
    score: number;
}

export interface Course {
    id?: number | string;
    title: string;
    code: string;
    semester: string;
    units?: number;
}

export interface Submission {
    id: number | string;
    studentId: number | string;
    courseId?: number;
    courseCode?: string;
    repoUrl?: string;
    status: "draft" | "submitted" | "reviewed";
    submittedAt?: string;
}

export interface Book {
    id: string | number;
    title: string;
    author: string;
    genre: string;
    availableCopies: number;
    description: string;
}

export interface Reservation {
    id: string | number;
    userId: string | number;
    bookId: string | number;
    status: ReservationStatus;
    reservedAt: Date | string;
    pickupDeadline?: Date | string | undefined;
    quantity: number;
    purpose: string;
    borrowingPeriod: string;
    inventoryClaimed?: boolean;
}

export interface Review {
    id: number | string;
    reservationId: number | string;
    authorId: number | string;
    note: string;
    rating: 1 | 2 | 3 | 4 | 5;
}

export const ReservationStatus = {
    Pending: "pending",
    Approved: "approved",
    Completed: "completed",
    Cancelled: "cancelled"
} as const;

export type ReservationStatus = typeof ReservationStatus[keyof typeof ReservationStatus];

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message: string;
}

// ===== SESSION 10: Derived types corrected for real MongoDB backend =====

export type ApiBook = Omit<Book, "id"> & { id: string };

export type ApiUser = Omit<User, "id"> & { id: string };

export type ApiCourse = Omit<Course, "id"> & { id: string };

export type ApiReview = Omit<Review, "id"> & { id: string };

export type ApiSubmission = Omit<
  Submission,
  "id" | "studentId" | "submittedAt"
> & {
  id: string;
  studentId: string;
  submittedAt: string;
};

export type NewSubmission = {
  courseCode?: string;
  repoUrl?: string;
};

export type ApiReservation = Omit<
  Reservation,
  "id" | "userId" | "bookId" | "reservedAt" | "pickupDeadline"
> & {
  id: string;
  userId: string;
  bookId: string;
  status: ReservationStatus;
  reservedAt: string;
  pickupDeadline?: string;
};

// What we SEND when creating one. No invented userId, no invented reservedAt, no invented status.
export type CreateReservation = {
  bookId: string;
  pickupDeadline?: string;
  quantity: number;
  purpose: string;
};

export interface AuthReply {
  token: string;
  user: ApiUser;
}

// Utility types
export type BookSummary = Pick<Book, "id" | "title" | "author">;
export type ReservationDraft = Omit<Reservation, "id" | "status">;
export type UserUpdate = Partial<User>;
export type ReservationLookup = Record<string | number, Reservation>;


// ===== SESSION 11: what POST /api/ai sends back =======================
export interface AiReview {
  summary: string;
  recommendations: string[];
  guidance: string[];
  readiness: "ready" | "almost" | "not-yet";
}
