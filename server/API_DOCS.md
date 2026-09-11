# NEXBYTEES REST API Documentation (`/api/v1`)

## Standard Response Envelopes

### Success Envelope
```json
{
  "success": true,
  "data": {},
  "message": "Optional feedback message",
  "pagination": {
    "currentPage": 1,
    "pageSize": 20,
    "totalItems": 150,
    "totalPages": 8
  }
}
```

### Error Envelope
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE_ENUM",
    "message": "Human readable explanation",
    "details": {}
  }
}
```

---

## 1. System & Health

### `GET /api/v1/health`
Returns operational status and database connectivity.
- **Access**: Public
- **Response**: `200 OK`

---

## 2. Authentication (`/api/v1/auth`)

### `POST /api/v1/auth/register`
Create a new user account. Rate-limited to 10 requests / 15m.
- **Body**:
  ```json
  {
    "name": "Alex Rivera",
    "username": "alexrivera",
    "email": "alex@example.com",
    "password": "securePassword123"
  }
  ```
- **Responses**:
  - `201 Created`: Returns `{ user, accessToken, refreshToken }`
  - `409 Conflict`: `EMAIL_EXISTS` or `USERNAME_EXISTS`
  - `422 Unprocessable Entity`: Zod validation errors

### `POST /api/v1/auth/login`
Authenticate with email and password. Rate-limited to 10 requests / 15m.
- **Body**:
  ```json
  {
    "email": "alex@example.com",
    "password": "securePassword123"
  }
  ```
- **Responses**:
  - `200 OK`: Returns `{ user, accessToken, refreshToken }`
  - `401 Unauthorized`: `INVALID_CREDENTIALS`

### `POST /api/v1/auth/refresh`
Rotate refresh token and issue a fresh access token.
- **Body**:
  ```json
  {
    "refreshToken": "<jwt-refresh-token>"
  }
  ```
- **Responses**:
  - `200 OK`: Returns `{ accessToken, refreshToken }`
  - `401 Unauthorized`: `SESSION_EXPIRED` or `INVALID_REFRESH_TOKEN`

### `POST /api/v1/auth/logout`
Revoke active session token.
- **Body**:
  ```json
  {
    "refreshToken": "<jwt-refresh-token>"
  }
  ```
- **Responses**:
  - `200 OK`: `{ loggedOut: true }`

### `POST /api/v1/auth/forgot-password`
Request password reset link.
- **Body**:
  ```json
  {
    "email": "alex@example.com"
  }
  ```

### `POST /api/v1/auth/reset-password`
Set new password for account. Revokes all existing user sessions.
- **Body**:
  ```json
  {
    "email": "alex@example.com",
    "newPassword": "newSecurePassword123"
  }
  ```

### `GET /api/v1/auth/me`
Retrieve currently authenticated user profile and counts.
- **Headers**: `Authorization: Bearer <access_token>`
- **Responses**:
  - `200 OK`: Returns sanitized user object
  - `401 Unauthorized`: `UNAUTHORIZED`

---

## 3. Technology News (`/api/v1/news`)

### `GET /api/v1/news`
List and filter published technology articles.
- **Access**: Public (Attaches `isSaved` and `isLiked` if authenticated)
- **Query Parameters**:
  - `domain`: `AI`, `CYBERSECURITY`, `ROBOTICS`, `QUANTUM`, `SPACE`, `GADGETS`, `SOFTWARE`, `CLOUD`, `SEMICONDUCTORS`, `STARTUPS`, `OTHER`
  - `tag`: Filter by specific topic tag
  - `search`: Search title, description, content, or source name
  - `sort`: `latest` (default), `trending`, `views`
  - `page`: Page index (default: `1`)
  - `limit`: Items per page (default: `20`, max: `50`)

### `GET /api/v1/news/:slug`
Retrieve single article by URL slug. Automatically increments view count and updates decaying trending score.
- **Access**: Public (Attaches user context if authenticated)

### `POST /api/v1/news/:id/share`
Increment share count and update trending score.
- **Access**: Public

### `POST /api/v1/news/:id/save` & `DELETE /api/v1/news/:id/save`
Bookmark or remove story from user's saved archive.
- **Access**: Protected (Bearer token)

### `POST /api/v1/news/:id/like` & `DELETE /api/v1/news/:id/like`
Like or unlike an article.
- **Access**: Protected (Bearer token)

### `GET /api/v1/news/:id/comments`
Get nested comment tree for an article.
- **Access**: Public

### `POST /api/v1/news/:id/comments`
Post a commentary or reply to an existing comment.
- **Access**: Protected (Bearer token)
- **Body**:
  ```json
  {
    "content": "Impressive quantum coherence milestone.",
    "parentCommentId": "optional-parent-comment-uuid"
  }
  ```

### `DELETE /api/v1/news/comments/:id`
Soft-delete comment.
- **Access**: Protected (Author or Admin)

---

## 4. Community Uploads (`/api/v1/uploads`)

### `POST /api/v1/uploads`
Submit a technology article for editorial review. Status starts as `PENDING`.
- **Access**: Protected (Bearer token)
- **Body**:
  ```json
  {
    "title": "Open Source RISC-V Neural Core",
    "description": "Short summary of the breakthrough",
    "content": "Full long-form technical explanation",
    "imageUrl": "https://example.com/image.jpg",
    "sourceName": "Research Lab",
    "sourceUrl": "https://example.com/source",
    "domain": "SEMICONDUCTORS",
    "tags": ["RISC-V", "Silicon"]
  }
  ```

### `GET /api/v1/uploads/me`
List user's own submissions with current statuses (`PENDING`, `APPROVED`, `REJECTED`).
- **Access**: Protected (Bearer token)

### `PATCH /api/v1/uploads/:id`
Update a pending submission.
- **Access**: Protected (Author only)

### `DELETE /api/v1/uploads/:id`
Delete a submission.
- **Access**: Protected (Author or Admin)

---

## 5. User Profiles (`/api/v1/users`)

### `GET /api/v1/users/:username`
View public profile, stats, and follow status.
- **Access**: Public (Optional auth)

### `PATCH /api/v1/users/me`
Update profile details (name, bio, tech interests).
- **Access**: Protected

### `POST /api/v1/users/me/profile-image`
Upload profile image (`multipart/form-data`, max 5MB, JPEG/PNG/WEBP/AVIF/GIF).
- **Access**: Protected

### `GET /api/v1/users/me/saved`
Retrieve user's bookmarked stories.
- **Access**: Protected

### `POST /api/v1/users/:id/follow` & `DELETE /api/v1/users/:id/follow`
Follow or unfollow another user/creator.
- **Access**: Protected

---

## 6. Editorial & Admin (`/api/v1/admin`)

- `GET /api/v1/admin/users`: View all registered users (Admin only)
- `PATCH /api/v1/admin/users/:id/role`: Change user role to `USER`, `EDITOR`, or `ADMIN`
- `DELETE /api/v1/admin/users/:id`: Remove user
- `GET /api/v1/admin/uploads/pending`: View submissions queue (Admin & Editor)
- `PATCH /api/v1/admin/uploads/:id/approve`: Approve submission -> converts directly into a published `NewsArticle` and notifies author
- `PATCH /api/v1/admin/uploads/:id/reject`: Reject submission with feedback reason
- `PATCH /api/v1/admin/news/:id/status`: Change article status (`PUBLISHED`, `DRAFT`, `ARCHIVED`, `REJECTED`)
- `DELETE /api/v1/admin/news/:id`: Remove article
