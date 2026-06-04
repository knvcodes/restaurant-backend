# Restaurant Listing App — Production Roadmap

> **Stack:** SolidJS + TypeScript | Express.js + TypeScript | MongoDB | Redis | Socket.io
> **Goal:** Transform a basic CRUD app into a portfolio piece that demonstrates production-grade engineering.

---

## Backend (Express + MongoDB + TypeScript)

### 1. Architecture & Patterns

- [ ] **Layered architecture**
  - `controllers` → `services` → `repositories` → `models`
  - No business logic in route handlers
- [ ] **Dependency injection**
  - Manual DI or TSyringe / InversifyJS
- [ ] **DTOs & Mappers**
  - Never return raw MongoDB documents
  - Use class-transformer or manual mapping layer
- [ ] **Shared Zod schemas**
  - Share validation schemas between frontend and backend (monorepo or shared package)

### 2. Authentication & Authorization

- [ ] **JWT access + refresh tokens**
  - httpOnly, Secure, SameSite cookies
  - Token rotation on refresh
- [ ] **Role-based access control**
  - `Customer`, `RestaurantOwner`, `Admin`
  - Route guards as reusable middleware
- [ ] **OAuth 2.0**
  - Google / Apple sign-in
- [ ] **Password reset flow**
  - Secure token with expiry (stored in Redis or MongoDB)

### 3. MongoDB Power Moves

- [ ] **Geospatial queries**
  - `2dsphere` index on `location` field
  - `$near` + `$geoWithin` for "restaurants near me"
  - Distance calculation in aggregation
- [ ] **Aggregation pipelines**
  - Average rating, review count, trending score
  - Complex filters (cuisine, price range, open-now, distance)
- [ ] **Text search**
  - MongoDB text index for restaurant name/cuisine search
  - Autocomplete suggestions
- [ ] **Compound indexes**
  - `{ location: "2dsphere", cuisine: 1, priceRange: 1 }`
  - Index strategy documentation

### 4. File Handling

- [ ] **Image upload pipeline**
  - Multer for multipart handling
  - Sharp for compression / resizing (multiple sizes: thumbnail, medium, full)
  - Upload to AWS S3 or Cloudinary
- [ ] **Gallery system**
  - Multiple images per restaurant
  - Reorder / delete / primary image selection
- [ ] **Signed URLs**
  - For private or time-limited asset access

### 5. Real-time & Background Jobs

- [ ] **Socket.io**
  - Live restaurant status (open/closed toggle)
  - Real-time reservation confirmations
  - Order status updates (if ordering feature added)
- [ ] **BullMQ (Redis-backed)**
  - Welcome email queue
  - Daily analytics digest for restaurant owners
  - Image processing queue (resize after upload)
  - Scheduled jobs with cron patterns

### 6. Observability & Tooling

- [ ] **Structured logging**
  - Pino or Winston with request correlation IDs
  - Separate log levels (debug, info, warn, error)
- [ ] **Global error handling**
  - Custom error classes: `AppError`, `ValidationError`, `NotFoundError`, `UnauthorizedError`
  - Centralized error middleware
  - Consistent error response shape
- [ ] **Request validation**
  - Zod schemas (shared with frontend)
  - Middleware to validate body, query, params
- [ ] **API documentation**
  - Swagger / OpenAPI auto-generated from Zod schemas
  - Hosted docs endpoint (`/api/docs`)

### 7. Security

- [ ] **Helmet.js** — secure HTTP headers
- [ ] **CORS** — whitelist origins, credentials enabled
- [ ] **Rate limiting**
  - `express-rate-limit` with Redis store
  - Stricter limits on auth endpoints
- [ ] **Input sanitization**
  - `mongo-sanitize` to prevent NoSQL injection
  - XSS prevention
- [ ] **Environment management**
  - `dotenv` with separate `.env.dev`, `.env.staging`, `.env.prod`
  - Validate env vars on startup (Zod schema)

### 8. Testing & DevOps

- [ ] **Unit tests**
  - Vitest or Jest
  - Test services, utilities, pure functions
  - Target: >70% coverage
- [ ] **Integration tests**
  - Supertest for HTTP route testing
  - Test database with `mongodb-memory-server`
- [ ] **Docker**
  - Dockerfile for Node.js app
  - `docker-compose.yml` with MongoDB + Redis
  - Multi-stage build for production
- [ ] **CI/CD (GitHub Actions)**
  - Lint → Test → Build → Deploy
  - Automated on push to `main`
- [ ] **Deployment**
  - Backend: Railway, Render, or AWS ECS
  - Frontend: Vercel or Netlify
  - MongoDB: MongoDB Atlas
  - Redis: Upstash or Redis Cloud

---

## Frontend (SolidJS + TypeScript)

### 1. State Management

- [ ] **SolidJS Stores**
  - Global state: auth, theme, UI preferences
  - Atomic updates with `produce`
- [ ] **TanStack Query (Solid Query)**
  - Server state caching
  - Background refetching
  - Optimistic updates
  - Infinite scroll pagination
- [ ] **Zustand (optional)**
  - If complex cross-component state beyond stores

### 2. Routing & Architecture

- [ ] **Solid Router**
  - Nested routes with route guards
  - Protected routes (redirect unauthenticated)
  - Role-based redirects (owner → dashboard, customer → home)
- [ ] **Lazy loading**
  - `lazy(() => import('./pages/Restaurant'))` for code splitting
- [ ] **Layout system**
  - `AuthLayout` — minimal (login/register)
  - `MainLayout` — header, footer, navigation
  - `OwnerLayout` — sidebar, analytics navigation
  - `AdminLayout` — admin-specific navigation

### 3. Forms & Validation

- [ ] **Form library**
  - Felte or Modular Forms (Solid-native)
  - Zod resolver for validation
- [ ] **Shared Zod schemas**
  - Import from shared package / monorepo
  - Single source of truth for validation
- [ ] **Multi-step wizard**
  - Restaurant onboarding: Basic info → Location → Hours → Menu → Photos
  - Step validation before progression
  - Progress indicator
- [ ] **Image upload**
  - Drag-and-drop zone
  - Preview before upload
  - Upload progress indicator

### 4. Maps & Location

- [ ] **Map integration**
  - Mapbox GL JS or Google Maps
  - Restaurant pins with custom markers
  - Clustering for dense areas
  - Popup cards with restaurant preview
- [ ] **Geolocation**
  - `useGeolocation` custom hook
  - Permission handling + fallback (default city)
  - Error states (denied, unavailable, timeout)
- [ ] **"Near me" feature**
  - Debounced radius slider
  - Loading skeletons during fetch
  - Distance display per restaurant card

### 5. Reviews & Ratings

- [ ] **Multi-criteria rating**
  - Food, Service, Ambiance, Value for Money
  - Overall average from breakdown
- [ ] **Review content**
  - Text review with character limit
  - Photo uploads (multiple, gallery view)
  - Visit date / occasion tags
- [ ] **Voting system**
  - Helpful / Not helpful with optimistic UI
  - Sort by: Most helpful, Newest, Highest rated
- [ ] **Infinite scroll**
  - Solid Query `useInfiniteQuery`
  - Virtual list for performance (`@tanstack/solid-virtual`)

### 6. Owner Dashboard

- [ ] **Analytics charts**
  - Recharts or Chart.js
  - Daily visitors (line chart)
  - Reservation trends (bar chart)
  - Rating distribution (pie/donut chart)
  - Peak hours heatmap
- [ ] **Booking calendar**
  - Month/week/day views
  - Time slot management
  - Booking status (confirmed, pending, cancelled, completed)
- [ ] **Menu management**
  - Drag-drop category reordering
  - Item CRUD with image upload
  - Price history (optional)
- [ ] **Performance metrics**
  - Response rate, average response time
  - Profile completion score

### 7. Performance & UX

- [ ] **SolidJS reactivity patterns**
  - Proper use of `createResource`, `createMemo`, `Show`, `Switch`, `For`
  - Avoid unnecessary re-renders (fine-grained reactivity)
- [ ] **Virtual lists**
  - `@tanstack/solid-virtual` for long lists
  - Windowing for restaurant lists, reviews
- [ ] **Image optimization**
  - Lazy loading with `loading="lazy"`
  - Blur-up placeholders
  - Responsive `srcset` for different screen sizes
- [ ] **Skeleton screens**
  - Match exact layout of content
  - Different skeletons for different components
  - No generic spinners for primary content
- [ ] **Error boundaries**
  - Catch runtime errors
  - Display fallback UI with retry action
  - Log to error tracking service

### 8. PWA & Polish

- [ ] **Vite PWA plugin**
  - Service worker generation
  - Offline fallback page
  - Installable app manifest
  - Cache strategies for assets and API calls
- [ ] **Dark mode**
  - System preference detection
  - Manual toggle with persistence
  - Tailwind `dark:` classes or CSS variables
- [ ] **Toast notifications**
  - Success / error / info toasts
  - Auto-dismiss with progress bar
  - Action toasts (undo, retry)
- [ ] **Keyboard shortcuts**
  - `/` to focus search
  - `Esc` to close modals/drawers
  - `?` to show shortcut help
- [ ] **Accessibility**
  - ARIA labels on interactive elements
  - Keyboard navigation for all flows
  - Focus management (trap focus in modals)
  - Color contrast compliance (WCAG AA)

---

## Feature Implementation Priority

### Phase 1: Foundation (Week 1-2)
1. [ ] Shared Zod schemas (monorepo setup or shared package)
2. [ ] JWT auth with httpOnly cookies + role guards
3. [ ] Layered backend architecture (controllers → services → repos)
4. [ ] Solid Query setup with basic CRUD

### Phase 2: Core Features (Week 3-4)
5. [ ] Geospatial "near me" (MongoDB + Mapbox)
6. [ ] Review system with photo upload + aggregation pipeline
7. [ ] Restaurant owner dashboard (basic analytics)
8. [ ] Real-time status with Socket.io

### Phase 3: Polish & Scale (Week 5-6)
9. [ ] BullMQ background jobs (emails, image processing)
10. [ ] Docker + docker-compose
11. [ ] Testing setup (unit + integration)
12. [ ] CI/CD pipeline (GitHub Actions)

### Phase 4: Deploy (Week 7)
13. [ ] Production deployment
14. [ ] README with architecture diagram
15. [ ] Demo data seeding script

---

## Portfolio Presentation Checklist

- [ ] **Live demo** deployed and accessible
- [ ] **GitHub repo** with clean commit history
- [ ] **README.md** including:
  - Architecture diagram (draw.io, Excalidraw, or ASCII)
  - Tech stack with versions
  - Setup instructions (local + Docker)
  - API documentation link
  - Screenshots / GIFs of key features
  - What I learned / challenges faced
- [ ] **Code quality signals**:
  - Consistent naming conventions
  - No `any` types (strict TypeScript)
  - Proper error handling (no silent catches)
  - Comments for complex business logic only
- [ ] **Feature highlights for resume**:
  - "Geospatial queries with MongoDB 2dsphere indexes"
  - "Real-time updates via Socket.io with Redis adapter"
  - "Background job processing with BullMQ and rate-limited queues"
  - "Full-stack type safety with shared Zod schemas"
  - "Virtualized lists handling 10k+ items with SolidJS"

---

## Quick Reference: What Employers Look For

| Signal | How You Show It |
|---|---|
| Scalability thinking | Compound indexes, pagination, caching, queues |
| Real-world problem solving | Error states, loading skeletons, offline handling, retries |
| Full-stack ownership | Type sharing, consistent patterns, deployed end-to-end |
| Code quality | DI, DTOs, custom errors, test coverage, no `any` |
| Modern tooling | Docker, CI/CD, PWA, structured logging |

---

> **Pro tip:** Pick 2-3 features and implement them deeply rather than 10 shallow features. One complex booking system with time-slot logic and real-time availability is more impressive than 10 basic CRUD screens.
