# CHTH Gym

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive cloud-based workout tracker, smart routine planner, and fitness analytics platform built for **Cloudflare Workers** with **Hono**, **Cloudflare D1 (SQLite)**, **Cloudflare KV**, **Google OAuth 2.0**, and a modern dark-mode-first RTL interface.

---

## Features

- **Exercise Library & Animated Guides** — 68 curated exercises with animated GIFs and Persian instructions, plus 1,200+ library movements with muscle maps and English instructions
- **Routine Builder** — Create and customize workout splits (Push/Pull/Legs, Upper/Lower) with target sets, reps, and rest periods
- **Active Workout Tracker** — Live stopwatch, rest interval countdown with audio alerts, PR and estimated-1RM detection, plate calculator and warm-up ramp for barbell lifts
- **Analytics Dashboard** — Training volume charts, consistency streak tracker, PR hall of fame with estimated 1RM, and a muscle recovery body map
- **First Workout Setup** — Preview a starter routine, save experience level and weekly session goals, and start as a guest or signed-in user
- **Repeat & Share** — Repeat the last workout, see previous weights and reps, and share a workout result image
- **Public Program Pages** — Rendered Persian program guides at `/programs`, with canonical URLs, social metadata, sitemap, and links into the app
- **Trainer Program Links** — Save and start a shared routine directly from its preview
- **Google OAuth** — Secure authentication via Google OpenID Connect
- **Five languages** — Persian (RTL, Persian numerals, Solar Hijri calendar), English, Arabic, Russian and Spanish, picked from `?lang=`, the shared `chth_lang` cookie or the browser; see [Languages](#languages)
- **Part of CHTH** — the shared CHTH brand kit and footer, linking the other CHTH sites and Telegram bots

---

## Screenshots

![Dashboard on desktop](docs/screenshots/desktop-dashboard.png)

![Exercise library on desktop](docs/screenshots/desktop-library.png)

| Dashboard | Exercise library | Suggestions | Profile |
|---|---|---|---|
| ![Dashboard](docs/screenshots/mobile-dashboard.png) | ![Exercise library](docs/screenshots/mobile-library.png) | ![Suggested programs](docs/screenshots/mobile-presets.png) | ![Profile](docs/screenshots/mobile-profile.png) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Hono (Cloudflare Workers) |
| Database | Cloudflare D1 (SQLite) |
| Cache | Cloudflare KV |
| Auth | Google OAuth 2.0 (OpenID Connect) |
| Frontend | HTML5, Tailwind CSS, Chart.js, Vazirmatn |

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [npm](https://www.npmjs.com/) (the repo ships a `package-lock.json`)
- A [Cloudflare](https://www.cloudflare.com/) account (for D1 and KV)

### Installation

```bash
# Clone the repository
git clone https://github.com/chethober/chth.gym.git
cd chth.gym

# Install dependencies
npm install

# Start the dev server
npm run dev
```

### Validation

```bash
npm run build
npm test
```

The checks cover setup preview and persistence, repeat-workout reconstruction, active-session protection, generated script syntax, and public program routes. Image sharing and Google sign-in still need browser/device verification before release.

### Database Setup

```bash
# Apply migrations locally
npm run d1:migrate:local

# Apply migrations remotely
npm run d1:migrate:remote
```

### Google OAuth Setup

1. Create an OAuth 2.0 project in the [Google Cloud Console](https://console.cloud.google.com/)
2. Configure the following variables in `wrangler.jsonc` or via `wrangler secret put`:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `REDIRECT_URI` (e.g., `https://chth.gym/api/auth/google/callback`)

> **Note:** For quick local testing without Google credentials, a Demo Mode authentication bypass is enabled by default.

### Deploy

```bash
npm run deploy
```

---

## Project Structure

```
├── migrations/          # D1 migrations (schema, seed data, exercise library, weekly plan)
├── src/
│   ├── auth/           # Google OAuth & session management
│   ├── data/           # Preloaded workout programs
│   ├── db/             # D1 database queries
│   ├── frontend/       # SPA frontend (HTML, Tailwind, JS) rendered by the worker
│   ├── lib/            # Domain logic (strength/e1RM, muscle recovery)
│   ├── routes/         # API route handlers
│   ├── types.ts        # TypeScript interfaces
│   └── index.ts        # Main Hono worker entry point
├── scripts/            # Dataset build scripts and Persian translations
├── public/             # Static assets (exercise GIFs, icons)
├── docs/screenshots/   # README screenshots
└── wrangler.jsonc      # Cloudflare Workers configuration
```

---

## Languages

The app is written in Persian, and `src/i18n/catalog.json` maps every Persian UI string to
English, Arabic, Russian and Spanish. Pages are translated on the server before they're sent;
a small browser script translates what the app renders later (lists, toasts, dialogs), switches
`fa-IR` number and date formatting to the chosen language, and shows exercise names in English
where the library has them. `npm test` fails when a Persian string has no translation; add it to
the catalog. Visitors pick a language with `?lang=` (kept in the `chth_lang` cookie, shared by
every CHTH site); otherwise the browser's languages decide, with Persian as the fallback.

## CHTH kit and hub

`src/chth-kit/` is generated from the shared CHTH kit (brand tokens, logo, languages, product
links, footer): don't edit it here. The optional CHTH hub integration (`src/hub.ts`) reports
sign-ups, finished workouts, tagged visits and server errors, and answers the hub's signed calls:
`GET /internal/stats` (including growth, activation and retention counts for its 📣 Marketing
screen) and `POST /internal/announcement` (the site banner, kept in KV and shown at the top of
every page). Visits tagged `?ref=` are remembered for 30 days, so a later sign-up counts for that
campaign.

Set `HUB_SECRET` (`wrangler secret put HUB_SECRET`, the same value as `gym` in the hub's
`SOURCE_SECRETS`) to switch it on; without it nothing is sent and the internal routes refuse
every call. Reports go through the `HUB` service binding to the `chth-hub` Worker, or to
`HUB_URL` when that var is set. Deploying a fork to another Cloudflare account: remove the
`services` entry from `wrangler.jsonc`.

## Configuration

### Environment Variables

| Variable | Description |
|---|---|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `REDIRECT_URI` | OAuth callback URL |
| `HUB_SECRET` | CHTH hub reporting, stats and banner (optional, secret) |
| `HUB_URL` | The hub's URL, only when not using the `HUB` service binding (optional) |

### Cloudflare Wrangler Configuration

Update `wrangler.jsonc` with your Cloudflare resource IDs:

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "chth-gym-db",
      "database_id": "<YOUR_D1_DATABASE_ID>",
      "migrations_dir": "migrations"
    }
  ],
  "kv_namespaces": [
    {
      "binding": "KV_SESSIONS",
      "id": "<YOUR_KV_NAMESPACE_ID>"
    }
  ],
  "routes": [
    { "pattern": "chth.gym", "custom_domain": true }
  ]
}
```

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Code of Conduct

This project adheres to the [Contributor Covenant](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Security

Please report security vulnerabilities by opening a [private security advisory](https://github.com/chethober/chth.gym/security/advisories/new). See [SECURITY.md](SECURITY.md) for more details.

---

## License

Distributed under the [MIT License](LICENSE).

---

Third-party data (muscle outlines, exercise library) is credited in [NOTICE.md](NOTICE.md).
