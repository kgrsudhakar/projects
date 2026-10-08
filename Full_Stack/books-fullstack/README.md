# Bookshelf: Spring Boot API + React frontend

```
books-fullstack/
 ├── books-app/        Spring Boot 3 backend (REST API, JWT, JPA, uploads)
 ├── books-frontend/   React 18 + Vite + React Router
 └── docker-compose.yml
```

## Run locally (two terminals)

Requirements: JDK 17+, Maven 3.9+, Node 18+.

```bash
# terminal 1: API on http://localhost:8080
cd books-app
mvn spring-boot:run

# terminal 2: web app on http://localhost:5173
cd books-frontend
npm install
npm run dev
```

Open **http://localhost:5173**. Logins: `admin / admin123` and `user / user123`.

> **Upgrading from the previous zip?** Stop the API and delete `books-app/data/` once. The database gained new
> columns and the old demo data has no covers or descriptions. It is recreated on the next start.

Run the backend tests: `cd books-app && mvn test`

## Run everything with Docker
```bash
docker compose up --build     # web app on http://localhost:3000
```
Uploaded covers are kept in the `uploads` volume, the database in `pgdata`.

## What's new in this version

### 1. Book cover upload
- `POST /api/books/{id}/cover` (multipart field `file`), `DELETE /api/books/{id}/cover` (logged in), `GET /api/books/{id}/cover` (public).
- JPEG, PNG or WebP up to 2 MB. The type is checked from the file's first bytes, not from the name or the browser's claim.
- Files are saved in `books-app/uploads/` under a random name (`app.upload-dir` to change).
- In the app: **Edit** (or **Add book**) has a cover picker and a "Remove current cover" checkbox. Covers show on cards and the detail page.

### 2. Refresh tokens and user management
- Access token (JWT) lasts **15 minutes**; a refresh token lasts **7 days**.
- `POST /api/auth/refresh` swaps a refresh token for a new pair (rotation). Using an old token again revokes all of that user's tokens.
- Refresh tokens are random strings stored only as SHA-256 hashes. `POST /api/auth/logout` revokes one.
- The React `api()` helper refreshes silently on a 401 and retries the request, so users are not logged out every 15 minutes.
- Admin only: `GET /api/admin/users`, `PUT /api/admin/users/{id}/role`, `PUT /api/admin/users/{id}/enabled`, `DELETE /api/admin/users/{id}`. An admin cannot change, disable or delete their own account.
- Any user: `GET /api/users/me`, `POST /api/users/me/password` (signs the user out everywhere).
- Disabled users cannot log in or refresh. Their current access token works until it expires (at most 15 minutes).
- A nightly `@Scheduled` job deletes expired refresh tokens.

### 3. React Router and book detail page
| Route | Page | Access |
|---|---|---|
| `/` | Book list. Search, sort and page are kept in the URL. | public |
| `/books/:id` | Book details with cover, description, edit and delete | public (edit needs login, delete needs admin) |
| `/login` | Log in or register; returns you to the page you came from | public |
| `/account` | Change password | logged in |
| `/admin/users` | Manage users | admin |

## Code map

Backend (`books-app/src/main/java/com/example/books/`)
- `service/CoverStorageService.java`: saves and serves images safely
- `security/RefreshTokenService.java`, `service/AuthService.java`: token rotation and reuse detection
- `service/UserService.java`, `controller/UserController.java`: user management and password change
- `entity/RefreshToken.java`, `repository/RefreshTokenRepository.java`

Frontend (`books-frontend/src/`)
- `api.js`: fetch wrapper, session store, silent refresh
- `App.jsx`: header and routes; `components/RequireAuth.jsx`: route guard
- `pages/`: `BooksPage`, `BookDetailPage`, `LoginPage`, `UsersPage`, `AccountPage`
- `components/`: `BookCard`, `BookDialog` (add/edit with cover), `Cover`, `Dialog`, `Toast`

## Different origins in production
- Frontend: `VITE_API_URL=https://api.example.com/api npm run build`
- Backend: `APP_CORS_ORIGINS=https://books.example.com`
- If the frontend is not behind nginx, make sure its host rewrites unknown paths to `index.html` (needed for `/books/5`).

## Notes
- Set `JWT_SECRET` (32+ characters) before deploying anywhere real.
- Tokens are kept in `localStorage`, which is fine for a learning project. For production, consider httpOnly cookies.
- Deleting an author also deletes their books; cover files of those books stay on disk until removed by hand.
