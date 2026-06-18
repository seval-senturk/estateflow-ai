# EstateFlow AI

Modern Real Estate Management Platform — a production-oriented portfolio project built with scalable architecture, strict TypeScript, and feature-based modularity.

## Project Overview

EstateFlow AI is a production-oriented real estate operations platform for agents, administrators, and property teams. It includes property management, blog CMS, media library, CRM lead pipeline, advanced search, activity/audit logging, and analytics — built as a maintainable product foundation rather than a demo site.

**Current status:** Phases 1–12 complete. Phase 12 focused on performance optimization and production hardening.

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
| Server State | Session via NextAuth (client refetch) |
| Media CDN | Cloudinary (WebP/AVIF via Next Image) |
| Caching | `unstable_cache` + ISR (`revalidate`) on public routes |
| Deployment | Vercel (target) |

## Development Roadmap

| Phase | Scope | Status |
|-------|-------|--------|
| **Phase 1** | Architecture & foundation | ✅ |
| **Phase 2** | Database model & Prisma | ✅ |
| **Phase 3** | Authentication & RBAC | ✅ |
| **Phase 4** | Dashboard foundation | ✅ |
| **Phase 5** | Property management | ✅ |
| **Phase 6** | Media management (Cloudinary) | ✅ |
| **Phase 7** | Public website | ✅ |
| **Phase 8** | Search experience | ✅ |
| **Phase 9** | Blog CMS & SEO | ✅ |
| **Phase 10** | CRM & lead management | ✅ |
| **Phase 11** | Activity logs, audit & analytics | ✅ |
| **Phase 12** | Performance & production hardening | ✅ |
| **Phase 13** | AI features & intelligent automation | ✅ |

## AI Features (Phase 13)

- **Provider abstraction:** OpenAI + Azure OpenAI via `src/features/ai/providers/`
- **Property:** AI description generator, SEO assistant, content improvement, public summary
- **Blog:** Content assistant (titles, meta, draft, category), SEO assistant
- **CRM:** Lead summary on detail page
- **Search:** Natural language smart search foundation on `/properties`
- **Logging:** `AiUsageLog` model with token tracking and dashboard widget
- **Config:** `AI_PROVIDER`, `OPENAI_API_KEY`, `AZURE_OPENAI_*` in `.env.example`

## Performance & Production (Phase 12)

- **Server rendering:** Root layout no longer forces global `auth()` — public routes can use ISR/cache
- **Public data cache:** `src/lib/cache/public-data.ts` with 60s revalidation for properties/blog
- **Dynamic imports:** TipTap editor, property gallery, media library, Leaflet map, kanban board
- **Dashboard:** Consolidated `getAdminDashboardData()` — single optimized query batch (~25 → ~12 queries)
- **Database:** Composite indexes on `Property`, `BlogPost`, `Lead`; blog list excludes `content` field
- **Security headers:** `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` via `next.config.ts`
- **Images:** AVIF/WebP formats, tuned `deviceSizes`, 24h `minimumCacheTTL`
- **Observability:** Hook points in `src/lib/logging/observability.ts` for Sentry/PostHog/GA/OpenTelemetry

## Current Progress

Delivered modules:

- [x] Property CRUD, publish workflow, public listings & detail
- [x] Blog CMS with TipTap, categories, tags, SEO metadata
- [x] Media library with Cloudinary upload
- [x] CRM lead pipeline, notes, activities, kanban foundation
- [x] Advanced property search with map view
- [x] Activity logs, audit trail, login history
- [x] Analytics dashboard widgets
- [x] RBAC with role-permission middleware
- [x] Production build verified

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
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — media uploads

### Database

```bash
npm run db:push    # or npm run db:migrate:deploy in production
npm run db:seed    # optional demo data
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
| `npm run db:migrate:deploy` | Deploy migrations (production) |
| `npm run db:seed` | Seed reference data |
| `npm run db:studio` | Open Prisma Studio |

## License

Private portfolio project.
