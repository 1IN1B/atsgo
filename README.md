# ATSGO — Applicant Tracking System

A modern, full-stack Applicant Tracking System built with **Nuxt 4**, featuring AI-powered resume parsing, drag-and-drop pipeline management, multi-tenant organization support, and workflow automation via n8n.

## Features

- **AI-Powered Resume Parsing & Scoring** — Alibaba Qwen models automatically extract structured data from resumes and score candidate-job fit (0–100) with skill/experience match analysis
- **Kanban Pipeline Board** — Drag-and-drop candidates across hiring stages (Applied → Screening → Interview → Offer → Hired → Rejected)
- **Multi-Tenant Organizations** — Full organization isolation with role-based membership (owner/member) and org switching
- **n8n Workflow Automation** — Outbound webhooks for `new_application`, `stage_changed`, and `job_published` events; inbound callback processing for resume parsing, stage updates, and email notifications
- **Public Application Portal** — Auth-free job application flow for candidates at `/apply?jobId=X&orgId=Y`
- **Google OAuth & Email Auth** — Sign in with Google or email/password via Better Auth
- **Dashboard & Activity Tracking** — Real-time stats (active jobs, applications, interviews, hired) with activity audit logs and automation status monitoring
- **Zinc-Only Design System** — Consistent monochrome palette with custom animation utilities (fade, slide, scale, shimmer, stagger, float)

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Nuxt 4 (Vue 3 + Nitro server) |
| UI | @nuxt/ui (Reka UI + Tailwind CSS) |
| Database | Turso (libSQL/SQLite edge) + Drizzle ORM |
| Authentication | Better Auth (email/password + Google OAuth) |
| AI Models | Alibaba Qwen (qwen-turbo, qwen-plus, qwen-max) via Vercel AI SDK |
| Automation | n8n Cloud (webhook-based integration) |
| Validation | Zod v4 |
| Styling | Tailwind CSS — Zinc color palette |

## Project Structure

```
atsgo/
├── assets/css/main.css          # Zinc theme, animations, keyframes
├── composables/useAuth.ts       # Better Auth client wrapper
├── layouts/
│   ├── default.vue              # Centered layout (landing, auth, apply)
│   └── app.vue                  # Sidebar shell (dashboard, jobs, pipeline)
├── middleware/
│   └── auth.global.ts           # Client-side auth guard
├── pages/
│   ├── index.vue                # Landing page
│   ├── login.vue                # Sign in
│   ├── register.vue             # Sign up
│   ├── dashboard/index.vue      # Stats + activity + automation status
│   ├── jobs/index.vue           # Job CRUD with status management
│   ├── pipeline/index.vue       # Kanban board with drag-and-drop
│   ├── candidates/index.vue     # Candidate list with search
│   ├── automations/index.vue    # Automation cards + logs
│   ├── settings/index.vue       # Organization + integrations
│   ├── apply/index.vue          # Public application form
│   └── apply/success.vue        # Application confirmation
├── server/
│   ├── api/                     # All API routes (see below)
│   ├── db/
│   │   ├── schema/index.ts      # Drizzle schema (12 tables)
│   │   └ migrations/            # SQL migration files
│   │   └ index.ts               # Database connection
│   ├── lib/auth/index.ts        # Better Auth configuration
│   ├── middleware/auth.ts        # Server-side auth middleware
│   └── utils/
│       ├── ai.ts                # Qwen AI: parse, score, generate
│       ├── n8n.ts               # n8n webhook sender + logging
│       └── validation.ts        # Zod schemas + validator
├── scripts/                     # Database bootstrap/utility scripts
├── drizzle.config.ts            # Drizzle Kit configuration
└── nuxt.config.ts               # Nuxt runtime config + modules
```

## API Routes

### Auth

| Route | Method | Description |
|---|---|---|
| `/api/auth/*` | ALL | Better Auth catch-all (sign-in, sign-up, session, OAuth) |

### Jobs

| Route | Method | Description |
|---|---|---|
| `/api/jobs` | GET | List jobs for active org |
| `/api/jobs` | POST | Create job (fires n8n `job_published` if published) |
| `/api/jobs/:id` | PATCH | Update job (fires n8n if status → published) |
| `/api/jobs/:id` | DELETE | Delete job |
| `/api/jobs/:id/public` | GET | **Public** — published job details for applicants |

### Candidates

| Route | Method | Description |
|---|---|---|
| `/api/candidates` | GET | List candidates (supports search, limit, offset) |
| `/api/candidates/:id` | GET | Get candidate details |
| `/api/candidates/:id` | PATCH | Update candidate profile |

### Applications

| Route | Method | Description |
|---|---|---|
| `/api/applications/apply` | POST | **Public** — submit application, create candidate, auto-score |

### Pipeline

| Route | Method | Description |
|---|---|---|
| `/api/pipeline/stages` | GET | List stages (seeds defaults if empty) |
| `/api/pipeline/board` | GET | Kanban board data for a job |
| `/api/pipeline/move` | POST | Move candidate between stages (fires n8n `stage_changed`) |

### Dashboard

| Route | Method | Description |
|---|---|---|
| `/api/dashboard/stats` | GET | Aggregate stats (jobs, apps, interviews, hired) |
| `/api/dashboard/activity` | GET | Recent activity log |

### Organizations

| Route | Method | Description |
|---|---|---|
| `/api/organizations` | GET | List user's organizations |
| `/api/organizations` | POST | Create organization (sets as active) |
| `/api/organizations/switch` | POST | Switch active organization |
| `/api/organizations/current` | GET | Get active org details |
| `/api/organizations/current` | PATCH | Update org name/slug |

### Automation

| Route | Method | Description |
|---|---|---|
| `/api/automation/logs` | GET | Automation log entries |
| `/api/automation/callback` | POST | **Public (webhook secret)** — n8n callback processor |

## Database Schema

12 tables with full multi-tenant isolation via `orgId` on every data table:

- **organizations** — name, slug, plan (free/pro)
- **jobs** — title, department, location, type, status, description, requirements, salary range
- **candidates** — name, email, phone, skills, experience, education, source, summary, aiScore
- **applications** — links candidate to job with resume, cover letter, source, status
- **pipeline_stages** — name, order, color; seeded as: Applied, Screening, Interview, Offer, Hired, Rejected
- **pipeline_entries** — candidate placement in a stage for a specific job
- **activities** — audit log (action, entity, details)
- **automation_logs** — n8n webhook communication log (event, direction, status, payload)
- **users, sessions, accounts, verifications** — Better Auth tables (with custom `activeOrganizationId` on sessions)
- **user_organizations** — membership with role (owner/member)

## AI Functions

| Function | Model | Purpose |
|---|---|---|
| `parseResume(text)` | qwen-turbo | Extract name, email, phone, skills, experience, education, summary |
| `scoreCandidate(profile, job)` | qwen-plus | Score 0–100 with skill/experience match, strengths, gaps, recommendation |
| `generateJobDescription(brief)` | qwen-plus | Generate full job description from brief |
| `draftEmail(context, tone)` | qwen-turbo | Draft professional/friendly email |
| `generateInterviewQuestions(title, skills)` | qwen-plus | Generate technical + behavioral questions |

All use Zod schemas for structured output via `generateObject()`.

## n8n Integration

**Outbound events** (sent as webhooks):
- `new_application` — on application submission
- `stage_changed` — on pipeline move (includes previous/new stage)
- `job_published` — on job creation or status change to published

**Inbound callbacks** (received at `/api/automation/callback`):
- `resume_parsed` — update candidate skills, experience, education, summary, aiScore
- `stage_update` — move pipeline entry
- `email_sent` — log notification
- `job_board_posted` — log external posting

## Getting Started

### Prerequisites

- Node.js 18+
- A Turso database account
- Alibaba AI API key (optional, for resume parsing/scoring)
- n8n Cloud account (optional, for automation)
- Google OAuth credentials (optional, for social sign-in)

### Installation

```bash
# Clone the repo
git clone https://github.com/1IN1B/atsgo.git
cd atsgo

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials
```

### Environment Variables

```env
# Required
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-turso-token
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000

# Optional — AI
ALIBABA_API_KEY=your-alibaba-api-key

# Optional — n8n Automation
N8N_BASE_URL=https://your-n8n-instance.com
N8N_API_KEY=your-n8n-api-key
N8N_WEBHOOK_SECRET=your-webhook-secret

# Optional — Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Database Setup

```bash
# Push schema to Turso (recommended for initial setup)
npm run db:push

# Or generate and run migrations
npm run db:generate
npm run db:migrate

# Inspect database with Drizzle Studio
npm run db:studio
```

### Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Utility Scripts

```bash
# Check existing tables in Turso
npx tsx scripts/check-tables.ts

# Bootstrap all tables from scratch
npx tsx scripts/create-tables.ts

# Reset ATS data tables (keeps auth/org intact)
npx tsx scripts/recreate-tables.ts
```

## Authentication Flow

- **Public routes**: `/`, `/login`, `/register`, `/apply`, `/apply/success` — no auth required
- **Protected routes**: `/dashboard`, `/jobs`, `/pipeline`, `/candidates`, `/automations`, `/settings` — requires session
- **Public API endpoints**: `/api/auth/*`, `/api/applications/apply`, `/api/jobs/:id/public`, `/api/automation/callback` — no auth middleware
- **Organization scoping**: All data queries use `activeOrganizationId` from the session; switch orgs via sidebar dropdown or `/api/organizations/switch`

## Application Flow (Candidate Perspective)

1. Organization shares link: `/apply?jobId=X&orgId=Y`
2. Candidate sees job details (department, location, type)
3. Candidate fills form (name, email, phone, resume URL, cover letter, source)
4. On submit: candidate record created/reused → application created → placed in first pipeline stage → n8n webhook fired → AI scoring attempted (non-blocking)
5. Success page shown

## Design System

### Color Palette

All colors use the **Zinc** scale — a cool gray with slight blue undertone:

| Shade | Hex | Usage |
|---|---|---|
| zinc-50 | `#fafafa` | Light backgrounds |
| zinc-100 | `#f4f4f5` | Cards, containers |
| zinc-200 | `#e4e4e7` | Borders, dividers |
| zinc-300 | `#d4d4d8` | Placeholder, muted |
| zinc-400 | `#a1a1aa` | Icons, secondary text |
| zinc-500 | `#71717a` | Body text |
| zinc-600 | `#52525b` | Navigation, labels |
| zinc-700 | `#3f3f46` | Gradient endpoints |
| zinc-800 | `#27272a` | Dark borders |
| zinc-900 | `#18181b` | Headings, dark gradient |
| zinc-950 | `#09090b` | Dark mode backgrounds |

### Animation Utilities

| Class | Effect |
|---|---|
| `.animate-fade-in` | Opacity 0 → 1 (300ms ease-out) |
| `.animate-slide-up` | translateY(20px) → 0 + fade (300ms) |
| `.animate-scale-in` | scale(0.95) → 1 + fade (300ms) |
| `.animate-pulse-soft` | Gentle opacity pulse (2s infinite) |
| `.animate-shimmer` | Gradient sweep loading (1.5s infinite) |
| `.animate-stagger > *` | Sequential fade-in children (50ms incremental) |
| `.animate-float` | 10px vertical float (3s infinite) |
| `.hover:animate-lift` | translateY(-2px) on hover |
| `.hover:animate-scale` | scale(1.05) on hover |
| `.hover:animate-shadow` | Elevated shadow on hover |

## License

Private — All rights reserved.
