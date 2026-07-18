import {
    ReservationStatus,
} from "../types";
import type {
    ApiResponse,
    Book,
    BookSummary,
    Course,
    Reservation,
    ReservationDraft,
    ReservationLookup,
    Review,
    Submission,
    User,
    UserUpdate,
} from "../types";

function getUser(id: number): User {
    return {
        id,
        name: "Mikaela Lantafe",
        email: "mikaela@example.com",
        role: "student",
        isActive: true,
        score: 98,
    };
}

function getBook(id: number): Book {
    return {
        id,
        title: "Harry Potter and the Goblet of Fire",
        author: "J.K Rowling",
        genre: "Fantasy",
        availableCopies: 2,
        description: "A parody adventure set around a wizarding tournament.",
    };
}

function createReservationDraft(userId: number, bookId: number): ReservationDraft {
    return {
        userId,
        bookId,
        reservedAt: new Date().toISOString(),
        pickupDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    };
}

function getFirst<T>(items: T[]): T | undefined {
    return items[0];
}

function getById<T extends { id: number }>(items: T[], id: number): T | undefined {
    return items.find((item) => item.id === id);
}

function buildApiResponse<T>(data: T, message: string): ApiResponse<T> {
    return {
        success: true,
        data,
        message,
    };
}

function summarizeBook(book: Book): BookSummary {
    return {
        id: book.id,
        title: book.title,
        author: book.author,
    };
}

function createReview(reservationId: number, authorId: number, note: string, rating: 1 | 2 | 3 | 4 | 5): Review {
    return {
        id: reservationId + 100,
        reservationId,
        authorId,
        note,
        rating,
    };
}

function getStatusLabel(status: ReservationStatus): string {
    switch (status) {
        case ReservationStatus.Pending:
            return "Awaiting librarian approval";
        case ReservationStatus.Approved:
            return "Reservation approved";
        case ReservationStatus.Completed:
            return "Book picked up successfully";
        case ReservationStatus.Cancelled:
            return "Reservation cancelled";
        default:
            return "Unknown reservation status";
    }
}

const user: User = getUser(1);
const book: Book = getBook(7);
const course: Course = {
    id: 1,
    title: "Information Technology Elective 4",
    code: "IT-ELEC4",
    semester: "1st Semester",
};
const submission: Submission = {
    id: 1,
    studentId: user.id,
    courseId: course.id,
    status: "submitted",
    submittedAt: new Date().toISOString(),
};
const reservationDraft: ReservationDraft = createReservationDraft(user.id, book.id);
const reservation: Reservation = {
    id: 11,
    userId: user.id,
    bookId: book.id,
    status: ReservationStatus.Pending,
    reservedAt: reservationDraft.reservedAt,
    pickupDeadline: reservationDraft.pickupDeadline,
};
const review: Review = createReview(reservation.id, user.id, "Excellent availability.", 5);
const userUpdate: UserUpdate = { isActive: true, role: "student" };
const reservationLookup: ReservationLookup = { [reservation.id]: reservation };

const firstBook = getFirst<Book>([book]);
const foundReservation = getById<Reservation>([reservation], reservation.id);
const apiResponse = buildApiResponse<Book>(book, "Book ready for reservation.");
const summary = summarizeBook(book);
const liveStatus = getStatusLabel(reservation.status);

console.log("User:", user);
console.log("Course:", course);
console.log("Submission:", submission);
console.log("Reservation draft:", reservationDraft);
console.log("Reservation:", reservation);
console.log("Review:", review);
console.log("User update:", userUpdate);
console.log("Reservation lookup:", reservationLookup);
console.log("First book:", firstBook?.title);
console.log("Found reservation:", foundReservation?.status);
console.log("API response:", apiResponse);
console.log("Book summary:", summary);
console.log("Live status:", liveStatus);