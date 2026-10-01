# Contributing to CHTH Gym

Thank you for your interest in contributing to CHTH Gym! We welcome contributions from the community.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/chethober/chth.gym.git`
3. Install dependencies: `npm install`
4. Create a new branch: `git checkout -b feature/your-feature-name`

## Development

### Prerequisites

- Node.js 18+
- npm or yarn
- A Cloudflare account (for D1 and KV bindings)

### Local Development

```bash
# Start the dev server
npm run dev

# Run type checking
npm run build

# Deploy to Cloudflare Workers
npm run deploy
```

### Database Setup

```bash
# Apply migrations locally
npm run d1:migrate:local

# Apply migrations remotely
npm run d1:migrate:remote
```

## Project Structure

```
├── migrations/          # D1 database migrations
│   ├── 0001_initial_schema.sql
│   ├── 0002_seed_exercises.sql
│   └── 0003_user_profile_and_daily_logs.sql
├── src/
│   ├── auth/           # Google OAuth & session management
│   ├── db/             # D1 database queries
│   ├── frontend/       # SPA frontend (HTML, Tailwind, JS)
│   ├── routes/         # API route handlers
│   ├── types.ts        # TypeScript interfaces
│   └── index.ts        # Main Hono worker entry point
├── scripts/            # Build and utility scripts
├── public/             # Static assets (GIFs, etc.)
└── wrangler.jsonc      # Cloudflare Workers configuration
```

## Code Style

- TypeScript strict mode
- Tailwind CSS for styling
- Functional components with hooks
- Follow the existing code patterns

## Pull Requests

1. Ensure your code passes type checking (`npm run build`)
2. Write clear commit messages
3. Update documentation if needed
4. Keep PRs focused on a single feature or fix
5. Describe the motivation for the change in the PR description

## Reporting Issues

Please use the [issue tracker](https://github.com/chethober/chth.gym/issues) to report bugs or request features. Include:

- A clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Your environment (Node version, OS, browser)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
