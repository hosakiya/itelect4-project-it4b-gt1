# Book Reservation System

This project models a simple book reservation app for a campus library. It includes users, books, reservations, and review notes, with a multi-step reservation lifecycle that fits a semester-long TypeScript assignment.

## Features
- Three core entities: User, Book, and Reservation
- Role-based user types: student, librarian, and admin
- Reservation lifecycle: pending -> approved -> completed/cancelled
- List-to-detail flow through books and their reservations
- Live status feedback for reservation updates
- Simple generative-style text support for book descriptions and review notes

## How to run
1. Install dependencies: npm install
2. Compile the project: npx tsc --noEmit
3. Run the sample demo: npx ts-node src/sample.ts

Mikaela Ysabel L. Lantafe