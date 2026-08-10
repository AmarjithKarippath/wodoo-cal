# Wodoo Waitlist

Simple waitlist landing page for **Wodoo** — an AI calorie tracker in the Cal AI style.

## Features

- Public waitlist with email collection
- FOMO social proof with real face avatars
- Username/password-protected admin dashboard at `/admin`
- View requester details (email, name, join time, referrer, user agent)
- CSV export

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

## Production (Docker Compose)

Runs on **port 3015** with a persistent SQLite volume.

1. Create a `.env` file in the project root:

```bash
cp .env.example .env
```

2. Set strong values for:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `NEXT_PUBLIC_SITE_URL` (production: `https://www.wodoo.live`)

3. Build and start:

```bash
docker compose up -d --build
```

App: [http://localhost:3015](http://localhost:3015)  
Admin: [http://localhost:3015/admin](http://localhost:3015/admin)

Useful commands:

```bash
docker compose logs -f wodoo
docker compose ps
docker compose down
```

Waitlist data persists in the Docker volume `wodoo_waitlist_data` mounted at `/app/data`.

## Environment

| Variable | Purpose |
| --- | --- |
| `ADMIN_USERNAME` | Username for `/admin` |
| `ADMIN_PASSWORD` | Password for `/admin` |
| `ADMIN_SESSION_SECRET` | Signs the admin session cookie |
| `WAITLIST_BASE_COUNT` | FOMO baseline added to real signups (default `2400`) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for Open Graph / metadata |

## Data

Signups are stored in SQLite at `data/waitlist.db` (local) or `/app/data/waitlist.db` (Docker).
