import type { Book, Course, Reservation, Review, User } from '../types';

export const mockUsers: User[] = [
  { id: 1, name: 'Mikaela Lantafe', email: 'mikaela@example.com', role: 'student', isActive: true, score: 92 },
  { id: 2, name: 'Carlos Reyes', email: 'carlos@example.com', role: 'librarian', isActive: true, score: 88 },
  { id: 3, name: 'Ariana Gomez', email: 'ariana@example.com', role: 'admin', isActive: true, score: 96 },
];

export const mockCourses: Course[] = [
  { id: 1, title: 'Interactive Design', code: 'INTD101', semester: '1st Semester' },
  { id: 2, title: 'Frontend Systems', code: 'FRS201', semester: '2nd Semester' },
  { id: 3, title: 'Digital Media', code: 'DME301', semester: '3rd Semester' },
];

export const mockBooks: Book[] = [
  { id: 1, title: 'Animal Farm', author: 'George Orwell', genre: 'Fiction', availableCopies: 4, description: 'A satirical allegorical novella.' },
  { id: 2, title: 'Brave New World', author: 'Aldous Huxley', genre: 'Science Fiction', availableCopies: 2, description: 'A dystopian novel.' },
  { id: 3, title: '1984', author: 'George Orwell', genre: 'Science Fiction', availableCopies: 3, description: 'A dystopian social science fiction novel.' },
  { id: 4, title: "Alice's Adventures in Wonderland", author: 'Lewis Carroll', genre: 'Fantasy', availableCopies: 5, description: 'An 1865 English novel about a girl named Alice.' },
  { id: 5, title: 'Don Quixote', author: 'Miguel de Cervantes', genre: 'Classic', availableCopies: 1, description: 'A Spanish novel about the adventures of a noble.' },
  { id: 6, title: "Harry Potter and the Philosopher's Stone", author: 'J.K. Rowling', genre: 'Fantasy', availableCopies: 6, description: 'The first novel in the Harry Potter series.' },
  { id: 7, title: 'Little Women', author: 'Louisa May Alcott', genre: 'Fiction', availableCopies: 3, description: 'A coming-of-age novel following four sisters.' },
  { id: 8, title: 'Pride and Prejudice', author: 'Jane Austen', genre: 'Romance', availableCopies: 4, description: 'A romantic novel of manners.' },
  { id: 9, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic', availableCopies: 2, description: 'A novel set in the Jazz Age on Long Island.' },
  { id: 10, title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', genre: 'Fantasy', availableCopies: 4, description: 'An epic high-fantasy novel.' },
  { id: 11, title: 'The Duke and I', author: 'Daphne Bridgerton & Simon Basset, Duke of Hastings', genre: 'Romance', availableCopies: 3, description: 'A witty and passionate Regency romance about a fake engagement and a real connection.' },
  { id: 12, title: 'The Viscount Who Loved Me', author: 'Anthony Bridgerton & Kate Sharma (Sheffield)', genre: 'Romance', availableCopies: 2, description: 'A romantic story of rivalry, attraction, and second chances within the Bridgerton family world.' },
  { id: 13, title: 'An Offer From a Gentleman', author: 'Benedict Bridgerton & Sophie Beckett', genre: 'Romance', availableCopies: 4, description: 'A Cinderella-inspired love story blending class, longing, and destiny.' },
  { id: 14, title: 'Romancing Mister Bridgerton', author: 'Colin Bridgerton & Penelope Featherington', genre: 'Romance', availableCopies: 3, description: 'A beloved Bridgerton romance rooted in friendship, growth, and heartfelt affection.' },
  { id: 15, title: 'To Sir Phillip, With Love', author: 'Eloise Bridgerton & Sir Phillip Crane', genre: 'Romance', availableCopies: 2, description: 'A charming and emotional romance with humor, tension, and tender reconciliation.' },
  { id: 16, title: 'Make It Stick: The Science of Successful Learning', author: 'Peter C. Brown, Henry L. Roediger III, Mark A. McDaniel', genre: 'Education', availableCopies: 5, description: 'Explores evidence-based techniques that improve memory, retention, and learning efficiency.' },
  { id: 17, title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', genre: 'Education', availableCopies: 6, description: 'A sweeping overview of human history from prehistory to modern civilization.' },
  { id: 18, title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', genre: 'Psychology', availableCopies: 4, description: 'A landmark exploration of decision-making, intuition, and cognitive bias.' },
  { id: 19, title: 'Mindset: The New Psychology of Success', author: 'Carol S. Dweck', genre: 'Education', availableCopies: 5, description: 'Examines how belief systems shape resilience, motivation, and achievement.' },
  { id: 20, title: 'Educated', author: 'Tara Westover', genre: 'Memoir', availableCopies: 3, description: 'A powerful memoir about self-invention, education, and the cost of breaking away from one’s past.' },
  { id: 21, title: "Why Don't Students Like School?", author: 'Daniel T. Willingham', genre: 'Education', availableCopies: 4, description: 'A practical and engaging look at how students learn and why school can feel difficult.' },
  { id: 22, title: 'A Mind for Numbers: How to Excel at Math and Science', author: 'Barbara Oakley', genre: 'Education', availableCopies: 5, description: 'Provides science-backed study strategies for learning math and science.' },
  { id: 23, title: 'Outliers: The Story of Success', author: 'Malcolm Gladwell', genre: 'Psychology', availableCopies: 3, description: 'Analyzes the hidden factors behind exceptional performance and achievement.' },
  { id: 24, title: 'Pedagogy of the Oppressed', author: 'Paulo Freire', genre: 'Education', availableCopies: 2, description: 'A foundational work on critical pedagogy and education as liberation.' },
  { id: 25, title: 'The Anxious Generation', author: 'Jonathan Haidt', genre: 'Psychology', availableCopies: 4, description: 'Investigates the mental health effects of social media and modern childhood experiences.' },
  { id: 26, title: 'The Guest List', author: 'Lucy Foley', genre: 'Thriller', availableCopies: 5, description: 'A glamorous wedding on a remote island turns deadly as dark secrets begin to surface.' },
  { id: 27, title: 'And Then There Were None', author: 'Agatha Christie', genre: 'Thriller', availableCopies: 4, description: 'Ten strangers are invited to a secluded estate where a deadly game begins.' },
  { id: 28, title: 'The Maidens', author: 'Alex Michaelides', genre: 'Thriller', availableCopies: 3, description: 'A group of young women, a secret society, and an unsolved crime collide in a tense psychological thriller.' },
  { id: 29, title: 'Sharp Objects', author: 'Gillian Flynn', genre: 'Thriller', availableCopies: 2, description: 'A journalist returns home and uncovers disturbing truths buried in her family history.' },
  { id: 30, title: 'Behind Closed Doors', author: 'B.A. Paris', genre: 'Thriller', availableCopies: 3, description: 'A marriage that appears perfect hides a terrifying reality behind closed doors.' },
  { id: 31, title: 'The Woman in the Window', author: 'A.J. Finn', genre: 'Thriller', availableCopies: 4, description: 'An agoraphobic woman thinks she witnesses a crime and becomes trapped by her own fear.' },
  { id: 32, title: 'Verity', author: 'Colleen Hoover', genre: 'Thriller', availableCopies: 6, description: 'A gripping story of obsession, truth, and the dangerous power of words.' },
  { id: 33, title: 'The Couple Next Door', author: 'Shari Lapena', genre: 'Thriller', availableCopies: 4, description: 'A neighborly facade hides a chilling disappearance and a web of suspicion.' },
  { id: 34, title: 'Rock Paper Scissors', author: 'Alice Feeney', genre: 'Thriller', availableCopies: 3, description: 'A tense, layered mystery about marriage, secrets, and a weekend gone wrong.' },
  { id: 35, title: 'The Push', author: 'Ashley Audrain', genre: 'Thriller', availableCopies: 5, description: 'A psychological thriller about motherhood, dread, and the fear that something is deeply wrong.' },
];

export const mockReservations: Reservation[] = [
  { id: 101, userId: 1, bookId: 1, status: 'approved', reservedAt: '2026-07-15T08:30:00Z', pickupDeadline: '2026-07-22T08:30:00Z' },
  { id: 102, userId: 2, bookId: 3, status: 'pending', reservedAt: '2026-07-16T09:00:00Z' },
];

export const mockReviews: Review[] = [
  { id: 201, reservationId: 101, authorId: 1, note: 'Great translation and smooth reading experience.', rating: 5 },
  { id: 202, reservationId: 102, authorId: 2, note: 'A thoughtful recommendation for class reading.', rating: 4 },
];
