# EstateFlow AI

Modern Real Estate Management Platform — a production-oriented portfolio project built with scalable architecture, strict TypeScript, and feature-based modularity.

## Project Overview

EstateFlow AI is designed as a professional real estate operations platform for agents, administrators, and property teams. The goal is not a demo site, but a maintainable product foundation that can grow into a full CRM with listings, content, media, and client workflows.

**Phase 1 (completed)** established the application foundation: folder architecture, layout system, shared components, configuration layer, authentication skeleton, database schema, and feature module scaffolding — without business feature implementation.

## Architecture

The project follows a **feature-based architecture** with clear separation of concerns:

```
UI (App Router + Client Components)
        ↓
Server Actions / Route Handlers
        ↓
Services (business logic, ActionResult pattern)
        ↓
Repositories (Prisma data access)
        ↓
PostgreSQL
```

**Key architectural decisions:**

- **Route groups** — `(public)`, `(admin)`, `(auth)` for distinct layout experiences
- **Two-layer components** — `components/ui` (Shadcn primitives) + `components/shared` (domain-aware wrappers)
- **Centralized config** — routes, navigation, roles, permissions, SEO, and environment in `src/config`
- **Typed error hierarchy** — `AppError`, `ValidationError`, `NotFoundError`, `AuthorizationError`
- **RBAC foundation** — role-permission mapping ready for admin modules
- **Audit logging types** — `LoggableEntity`, `LogActionType`, `AuditLogEntry` prepared for Phase 2+

## Folder Structure

```
src/
├── app/                    # Next.js App Router (route groups, API, error pages)
├── components/
│   ├── ui/                 # Shadcn UI primitives
│   ├── shared/             # Reusable domain components
│   └── layouts/            # Public, admin, auth layout parts
├── features/               # Feature modules (auth, properties, blog, …)
│   └── {feature}/
│       ├── components/
│       ├── actions/
│       ├── services/
│       ├── schemas/
│       ├── types/
│       ├── constants/
│       └── hooks/
├── config/                 # Routes, navigation, permissions, roles, SEO
├── lib/                    # Auth, Prisma, errors, utilities
├── providers/              # Theme, session, query, notification
├── repositories/           # Data access layer
├── services/               # Business logic layer
├── schemas/                # Shared Zod schemas
├── types/                  # Global TypeScript types
├── utils/                  # Formatters, validators, helpers
├── hooks/
├── constants/
├── actions/
├── store/
├── emails/
└── middleware.ts
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| UI | React 19, Tailwind CSS v4, Shadcn UI |
| Language | TypeScript (strict) |
| ORM | Prisma 6 |
| Database | PostgreSQL |
| Auth | NextAuth (Auth.js v5) |
| Validation | Zod |
| Forms | React Hook Form |
| Server State | TanStack Query |
| Deployment | Vercel (target) |

## Development Roadmap

| Phase | Scope | Status |
|-------|-------|--------|
| **Phase 1** | Architecture & foundation | ✅ Complete |
| **Phase 2** | Authentication & user management | Planned |
| **Phase 3** | Property CRUD & listings | Planned |
| **Phase 4** | Blog & content management | Planned |
| **Phase 5** | Media library (Cloudinary) | Planned |
| **Phase 6** | Favorites, contact, search | Planned |
| **Phase 7** | Dashboard analytics & polish | Planned |

## Current Progress

Phase 1 deliverables:

- [x] Feature-based folder structure (10 modules scaffolded)
- [x] Public, Admin, and Auth layouts
- [x] Shared component layer (Button, Input, DataTable, Search, PageHeader, …)
- [x] Provider stack (Theme, Session, Query, Notification)
- [x] Configuration system (routes, navigation, permissions, roles)
- [x] Global error handling and logging type foundations
- [x] Prisma schema (User, Account, Session)
- [x] NextAuth skeleton with middleware route protection
- [x] Utility helpers (formatters, validators, slug)
- [x] Production build verified

## Phase Status

**Phase 1 — Foundation:** Complete  
**Phase 2 — Next:** Authentication integration, user repository, protected admin workflows

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL

### Installation

```bash
git clone https://github.com/seval-senturk/estateflow-ai.git
cd estateflow-ai
npm install
```

### Environment

Copy the example environment file and configure your values:

```bash
cp .env.example .env
```

Required variables:

- `DATABASE_URL` — PostgreSQL connection string
- `AUTH_SECRET` — generate with `openssl rand -base64 32`
- `AUTH_URL` — application URL (e.g. `http://localhost:3000`)

### Database

```bash
npm run db:push
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run migrations |
| `npm run db:studio` | Open Prisma Studio |

## License

Private portfolio project.
