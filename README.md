# Crystal Tech

React + Vite frontend, PHP + MySQL backend, deployed to shared cPanel hosting via GitHub Actions.

## Stack

- **Frontend** — React 18 + Vite + React Router (in [`frontend/`](frontend/))
- **Backend** — Vanilla PHP 8 + PDO (no Composer required) in [`backend/`](backend/)
- **Database** — MySQL (your cPanel MySQL instance)
- **Deploy** — GitHub Actions builds the frontend, then FTPs the bundle to `public_html/` on every push to `main`

## Local development

### 1. Run the backend

You need PHP 8.1+ and a local MySQL (or use your cPanel DB credentials directly during dev).

```bash
cp backend/config/config.example.php backend/config/config.php
# edit backend/config/config.php with your DB credentials + a long random jwt_secret

# import the schema (locally)
mysql -u USER -p DATABASE < backend/migrations/001_init.sql

# start the PHP dev server (port 8080 matches vite.config.js)
php -S localhost:8080 -t backend/public
```

### 2. Run the frontend

```bash
cd frontend
npm install
npm run dev
# Vite serves on http://localhost:5173 and proxies /api/* to localhost:8080
```

Open http://localhost:5173. The reviews + contact + login flows all hit the real PHP API.

## Production deploy (cPanel via GitHub)

### One-time cPanel setup

1. **Database**
   - cPanel → *MySQL Databases* → create a DB + user + grant the user all privileges on the DB.
   - cPanel → *phpMyAdmin* → select the DB → *Import* → upload [`backend/migrations/001_init.sql`](backend/migrations/001_init.sql).
   - Make yourself admin: generate a bcrypt hash locally with
     `php -r 'echo password_hash("YOUR_PASSWORD", PASSWORD_BCRYPT);'`
     then run the INSERT at the bottom of `001_init.sql` with that hash.

2. **Backend config**
   - After the first deploy, cPanel → *File Manager* → `public_html/api/config/`.
   - Copy `config.example.php` to `config.php` and edit it:
     - DB credentials from step 1
     - `jwt_secret` — generate with `php -r 'echo bin2hex(random_bytes(48));'`
     - `cors_origins` — your real domain(s)
   - This file is **never overwritten** by future deploys (it's in `.gitignore` and excluded by the workflow).

3. **GitHub secrets**

   In your GitHub repo → *Settings → Secrets and variables → Actions*, add:

   | Secret | Value |
   |---|---|
   | `FTP_HOST` | `ftp.crystaltechnologys.com` (or your cPanel host) |
   | `FTP_USERNAME` | your cPanel/FTP user |
   | `FTP_PASSWORD` | your cPanel/FTP password |
   | `FTP_SERVER_DIR` | `/public_html/` |

4. **Push to `main`**

   ```bash
   git push origin main
   ```

   GitHub Actions will build the React app and FTP it to your cPanel. Check the *Actions* tab for progress.

### Final layout on the server

```
public_html/
├── index.html              ← React app shell (Vite build)
├── assets/                 ← hashed JS/CSS bundles + your /assets images
├── manifest.json
├── robots.txt
├── .htaccess               ← SPA fallback + HTTPS + cache headers
└── api/
    ├── index.php           ← PHP front controller
    ├── .htaccess           ← routes everything to index.php
    ├── src/                ← Controllers + Lib
    ├── config/
    │   ├── config.php      ← your real credentials (DO NOT commit)
    │   └── config.example.php
    └── storage/            ← PHP error log (auto-created)
```

## API surface

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET    | `/api/health`             | — | Liveness check |
| POST   | `/api/auth/register`      | — | Create client account |
| POST   | `/api/auth/login`         | — | Get JWT |
| GET    | `/api/auth/me`            | Bearer | Current user |
| POST   | `/api/contact`            | — | Public contact form |
| GET    | `/api/admin/contact`      | Admin | List inquiries |
| PATCH  | `/api/admin/contact/:id`  | Admin | Update status |
| GET    | `/api/reviews`            | — | Approved reviews |
| POST   | `/api/reviews`            | — | Submit review (pending mod.) |
| GET    | `/api/admin/reviews`      | Admin | All reviews |
| PATCH  | `/api/admin/reviews/:id`  | Admin | Approve / unapprove |
| DELETE | `/api/admin/reviews/:id`  | Admin | Delete review |
| GET    | `/api/projects`           | Client | Logged-in user's projects |
| POST   | `/api/projects`           | Client | Create project request |
| GET    | `/api/admin/projects`     | Admin | All projects |
| PATCH  | `/api/admin/projects/:id` | Admin | Update status / progress / post update |

## Migrating from the old static site

The old HTML pages, `js/`, and `css/` at the repo root are no longer wired up by the deploy workflow. Keep them around as reference until you're happy with the React build, then delete them in a follow-up PR.

Your old `js/firebase-config.js` / `js/reviews.js` / `js/request-project.js` are replaced by:
- Reviews → `frontend/src/components/Reviews.jsx` + `/api/reviews`
- Contact form → `frontend/src/pages/Contact.jsx` + `/api/contact`
- Project request → `frontend/src/pages/Dashboard.jsx` (logged-in client portal) + `/api/projects`
