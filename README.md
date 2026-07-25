# Job Application Tracker

A full-stack web application to track job applications, manage statuses, and stay organised during a job search.

**Live demo:** [your-app.onrender.com](#) ← add after deploying

![Job Tracker Screenshot](./screenshot.png) ← add after taking a screenshot

---

## Tech Stack

**Frontend**
- React 18 with TypeScript
- Axios for API requests
- Custom CSS (no UI library dependency)

**Backend**
- Node.js + Express.js
- PostgreSQL (via `pg`)
- RESTful API design

**Deployment**
- Render (backend + PostgreSQL)
- Render Static Sites (frontend)

---

## Features

- ✅ Add, edit, and delete job applications
- ✅ Track status: Applied → Interview → Offer / Rejected
- ✅ Filter by status and search by company or role
- ✅ Dashboard stats (total, interviews, offers, rejections)
- ✅ Store salary range, location, job URL, and notes per application
- ✅ Fully responsive — works on mobile

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in your DATABASE_URL in .env
```

Create the database:
```bash
psql -U postgres -c "CREATE DATABASE job_tracker;"
psql -U postgres -d job_tracker -f src/db/schema.sql
```

Start the server:
```bash
npm run dev
# Runs on http://localhost:5000
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/applications` | Get all applications |
| GET | `/api/applications/:id` | Get one application |
| POST | `/api/applications` | Create application |
| PUT | `/api/applications/:id` | Update application |
| DELETE | `/api/applications/:id` | Delete application |

---

## Deployment (Render)

1. Push this repo to GitHub
2. Create a new **PostgreSQL** database on Render
3. Create a new **Web Service** for the backend — set `DATABASE_URL` from step 2
4. Run the schema: connect to your Render DB and run `schema.sql`
5. Create a new **Static Site** for the frontend — set build command to `npm run build`, publish directory to `build`

---

## Author

**Fouad Zouaidi** — [linkedin.com/in/fouad-zouaidi](https://linkedin.com/in/fouad-zouaidi) · [github.com/fouedzouaidi94](https://github.com/fouedzouaidi94)
