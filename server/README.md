# NEXBYTEES Backend Engine

Production-grade, scalable technology-news and community intelligence backend for **NEXBYTEES**.

---

## 1. Backend Architecture

The backend follows clean layered architecture principles with strict separation of concerns:

```
Clients (Web App, Android/iOS Native Mobile Apps)
                        ↓
                 REST API (/api/v1)
                        ↓
     Security Middleware (Helmet, CORS, RateLimiters)
                        ↓
            Controllers (Request/Response Mappers)
                        ↓
       Services (Business Logic, Decaying Trending Algorithm)
       ├── AIService Abstraction (Summary, Classification, Tagging)
       └── NewsProvider Abstraction (External Feed Normalization)
                        ↓
          Repositories (Data Access & Query Abstraction)
                        ↓
                     Prisma ORM
                        ↓
              PostgreSQL Relational Database
```

---

## 2. Installation & Prerequisites

- **Node.js**: v18+ or v20+ LTS
- **npm**: v9+ or v10+
- **PostgreSQL**: v14+ or Docker

Navigate to the `server/` workspace:
```bash
cd server
npm install
```

---

## 3. Environment Setup

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Key environment variables:
| Variable | Description | Example |
|---|---|---|
| `PORT` | Server listening port | `5000` |
| `API_PREFIX` | Versioned route prefix | `/api/v1` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@localhost:5432/nexbytees?schema=public` |
| `JWT_ACCESS_SECRET` | Secret key for 15-minute access JWT | High-entropy string |
| `JWT_REFRESH_SECRET` | Secret key for 7-day refresh JWT | High-entropy string |
| `CORS_ORIGIN` | Allowed origins (supports comma-separated list) | `http://localhost:3000` |
| `UPLOAD_STORAGE_PROVIDER`| Image storage strategy (`local`, `cloudinary`, `s3`) | `local` |
| `AI_PROVIDER` | Modular AI integration (`disabled`, `gemini`, `openai`) | `disabled` |
| `NEWS_PROVIDER` | Modular News feed provider (`disabled`, `newsapi`, `gnews`) | `disabled` |

---

## 4. PostgreSQL Setup

### Option A: Local Docker (Recommended)
A pre-configured `docker-compose.yml` is included. To start PostgreSQL:
```bash
docker compose up -d
```

### Option B: Cloud / Managed PostgreSQL
Use any hosted PostgreSQL service (e.g. Supabase, Neon, AWS RDS) and set `DATABASE_URL` in `.env`:
```bash
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
```

---

## 5. Prisma Migration & Client Generation

Generate Prisma Client:
```bash
npm run prisma:generate
```

Push schema to your database or run migrations:
```bash
# Push schema directly
npm run prisma:push

# Or run migration history
npm run prisma:migrate
```

---

## 6. Database Seed Command

Populate the database with realistic sample technology news articles, editorial staff, and community uploads:
```bash
npm run seed
```

Default credentials created by seed:
- **Admin**: `admin@nexbytees.com` / `nexbytees2026`
- **Editor**: `editor@nexbytees.com` / `nexbytees2026`
- **Reader**: `reader@nexbytees.com` / `nexbytees2026`

---

## 7. Development & Production Commands

| Command | Action |
|---|---|
| `npm run dev` | Start development server with live reload (`tsx watch`) on port 5000 |
| `npm run build` | Compile strict TypeScript to clean production build in `dist/` |
| `npm start` | Run compiled production build from `dist/server.js` |
| `npm run type-check` | Validate TypeScript types without emitting files |
| `npm test` | Run Jest & Supertest test suite |
| `npm run prisma:studio`| Launch Prisma Studio visual database browser |

---

## 8. Authentication & Session Strategy

- **Password Hashing**: Passwords hashed with bcrypt using cost factor 12.
- **Short-Lived Access Token**: Signed with `JWT_ACCESS_SECRET`, expires in 15 minutes.
- **Long-Lived Refresh Token**: Signed with `JWT_REFRESH_SECRET`, expires in 7 days.
- **Token Rotation & Revocation**:
  - Refresh tokens are hashed using SHA-256 and tracked in the `RefreshToken` database table.
  - Every refresh rotation revokes the previous token and generates a new pair.
  - Logging out immediately revokes the active session token in the database.
  - Password reset automatically revokes all existing sessions for the account.

---

## 9. Frontend Integration

The Next.js frontend connects through a centralized API service layer located at:
`src/lib/api/`
- `client.ts`: Base fetch client handling token attachment, automatic 401 refresh retry, and error recovery.
- `auth.ts`: Registration, login, logout, and password recovery.
- `news.ts`: Fetching news feeds, domain filtering, trending metrics, and bookmarking.
- `uploads.ts`: Community story submission, viewing, editing, and deleting.
- `comments.ts`: Article commentary.
- `users.ts`: Profile management and user follows.
- `notifications.ts`: Activity alerts.

Configure the frontend endpoint via `.env.local`:
```bash
NEXT_PUBLIC_API_URL="http://localhost:5000/api/v1"
```

---

## 10. Mobile App Integration Strategy (iOS & Android)

The backend is built from day one to power native mobile clients (React Native, Flutter, Swift, or Kotlin):
1. **Stateless Bearer Authentication**: Native apps store the refresh token in iOS Keychain or Android EncryptedSharedPreferences and send the access token in the `Authorization: Bearer <token>` header.
2. **CORS Agnostic**: Requests originating from mobile apps (without browser `Origin` headers) are explicitly permitted.
3. **Structured Pagination**: Standard `{ page, limit, totalPages, totalItems }` payload enables seamless infinite scrolling (e.g. `FlatList`).
4. **Push Notifications Ready**: The `Notification` model and service can easily hook into Firebase Cloud Messaging (FCM) or Apple Push Notification Service (APNs).
