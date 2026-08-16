# JASBuilt

A portfolio showcase platform for Ghanaian student developers — discover, upvote, and give feedback on software built across local university campuses. Built around one core idea: students who ship projects often can't find reviewers, so JASBuilt lets a builder flag "I want feedback on this" and say exactly what to look at.

**Live:** [jasbuilt.vercel.app](https://jasbuilt.vercel.app)

<p>
  <img alt="React" src="https://img.shields.io/badge/React-18.3-61dafb?logo=react&logoColor=black" />
  <img alt="Express" src="https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-Prisma_5-4169e1?logo=postgresql&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-6-646cff?logo=vite&logoColor=white" />
  <img alt="pnpm" src="https://img.shields.io/badge/pnpm_workspaces-monorepo-f69220?logo=pnpm&logoColor=white" />
  <img alt="Vitest" src="https://img.shields.io/badge/tested_with-Vitest-6e9f18?logo=vitest&logoColor=white" />
</p>

## Screenshots

| Feed | Leaderboard |
|---|---|
| ![Feed](docs/screenshots/feed.png) | ![Leaderboard](docs/screenshots/leaderboard.png) |

| Project detail |
|---|
| ![Project detail](docs/screenshots/project-detail.png) |

## Features

- **Feedback-request flow** — authors can flag a project as seeking feedback and describe specifically what they want reviewed; a dedicated feed filter surfaces those projects, and the ask is shown prominently on the project's page.
- **Discovery feed** — filter by institution, tech stack, or "seeking feedback," with instant client-side search.
- **Optimistic upvotes** — counts update immediately in the UI while the request confirms in the background, with rollback on failure.
- **Comment threads** — feedback discussion attached to each project.
- **Leaderboard** — projects ranked by upvotes, with podium styling for the top 3.
- **Shareable project pages** — every project has its own `/projects/:id` route with a copy-link button, instead of being locked behind a modal.
- **Responsive navigation** — collapses into a mobile menu below 768px.
- **JWT authentication** — registration and login with bcrypt-hashed passwords.

## Tech stack

| Layer | Stack |
|---|---|
| `apps/web` | React 18, Vite, React Router 6, SCSS, [lucide-react](https://lucide.dev) icons |
| `apps/api` | Node.js, Express 5, Prisma ORM, PostgreSQL, JWT auth, Cloudinary (image uploads) |
| `packages/shared` | Cross-workspace constants shared between web and api (`GH_SCHOOLS`, `TECH_TAGS`, formatters) |
| Testing | Vitest + Supertest (API, against an isolated test database) · Vitest + React Testing Library (web) |

## Deployment

| Service | Host | Notes |
|---|---|---|
| Frontend | [Vercel](https://vercel.com) | Auto-deploys on push to `main` |
| API | [Render](https://render.com) | Auto-deploys on push to `main`; free tier spins down after 15 min idle (first request after that takes ~30-50s) |
| Database | [Neon](https://neon.tech) | Serverless Postgres; migrations run automatically as part of the Render build step via `prisma migrate deploy` |

## Getting started

### Prerequisites
[Node.js](https://nodejs.org) ≥18, [pnpm](https://pnpm.io) ≥8, and a local PostgreSQL instance.

### 1. Clone and install
```bash
git clone https://github.com/Jeffrey3-git/jasbuilt.git
cd jasbuilt
pnpm install
```

### 2. Configure environment variables
Copy `.env.example` into `apps/api/.env` and `apps/web/.env`, then fill in real values:

```env
# apps/api/.env
PORT=5000
DATABASE_URL="postgresql://username:password@localhost:5432/jasbuilt_db?schema=public"
JWT_SECRET="a-long-random-string"
CLIENT_URL="http://localhost:5173"          # used for CORS
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

```env
# apps/web/.env
VITE_API_URL="http://localhost:5000"
```

### 3. Set up the database
```bash
pnpm --filter @jasbuilt/api exec prisma migrate dev
```

### 4. Run it
```bash
pnpm dev
```
Frontend at [http://localhost:5173](http://localhost:5173), API at `http://localhost:5000`.

## Testing

```bash
pnpm --filter @jasbuilt/api test    # API tests, run against a dedicated jasbuiltdb_test database
pnpm --filter @jasbuilt/web test    # Component/unit tests
```

## Project structure

```
apps/
  api/       Express + Prisma backend
  web/       React + Vite frontend
packages/
  shared/    Constants shared across both apps
```

## Author

Built by **Jeff Akubea Selasi (JAS)** — [GitHub](https://github.com/Jeffrey3-git) · [LinkedIn](https://www.linkedin.com/in/jeff-akubea-51257a405/)
