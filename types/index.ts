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
    id: number;
    title: string;
    code: string;
    semester: string;
}

export interface Submission {
    id: number;
    studentId: number;
    courseId: number;
    status: "draft" | "submitted" | "reviewed";
    submittedAt?: string;
}

export interface Book {
    id: number;
    title: string;
    author: string;
    genre: string;
    availableCopies: number;
    description: string;
}

export interface Reservation {
    id: number;
    userId: number;
    bookId: number;
    status: ReservationStatus;
    reservedAt: string;
    pickupDeadline?: string | undefined;
}

export interface Review {
    id: number;
    reservationId: number;
    authorId: number;
    note: string;
    rating: 1 | 2 | 3 | 4 | 5;
}

export enum ReservationStatus {
    Pending = "pending",
    Approved = "approved",
    Completed = "completed",
    Cancelled = "cancelled"
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message: string;
}
// yung mga utility types
export type BookSummary = Pick<Book, "id" | "title" | "author">; //Pick <T, K> 
export type ReservationDraft = Omit<Reservation, "id" | "status">;
export type UserUpdate = Partial<User>;
export type ReservationLookup = Record<number, Reservation>;