# Book Reservation System - Frontend (ITELECT4)

Frontend application for the DLSL Book Reservation & Academic Catalog System. Built with React 19, TypeScript, Vite, Tailwind CSS, TanStack Query, and React Hook Form with Zod validation.

## Live Deployment
- **Frontend App Live URL**: `https://itelect4-project-it4b-gt1.vercel.app/`
- **Backend API Live URL**: `https://itelect4-backend-eosin.vercel.app/`

## Environment Variables
Configured in `.env` (local) and Vercel Project Settings (production):
- `VITE_API_URL`: Base URL of the backend API (e.g. `https://<your-backend-app>.vercel.app` without trailing slash)

*Note: Never commit `.env`. See `.env.example` for reference.*

## Features
- Real authentication flow with Register and Login pages connected to JWT backend
- Protected routes and persistent session management via Zustand
- Live book catalog browsing, searching, and filtering by genre
- Book reservation request modal with form validation
- Student personal dashboard with active holds, status tracking, and cancellation
- Integration with live MongoDB backend API via unified `request()` client helper

## How to Run Locally
1. Install dependencies: `npm install`, `npm install --prefix GT2P3`, and `npm install --prefix ..\it-elect-backend`
2. Copy `GT2P3/.env.example` to `GT2P3/.env` and set `VITE_API_URL=http://localhost:4000`
3. Copy `..\it-elect-backend\.env.example` to `..\it-elect-backend\.env`; set `MONGODB_URI` and `JWT_SECRET`. The example allows `http://localhost:5173` through CORS.
4. Run `npm run dev` to start both the frontend (`http://localhost:5173`) and backend API (`http://localhost:4000`).
5. Build check: `npm run build` (runs `tsc -b && vite build` with zero TypeScript errors)

## Author
Mikaela Ysabel L. Lantafe | IT4B