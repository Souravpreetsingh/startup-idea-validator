# Contributing to AI Startup Idea Validator

Thank you for considering contributing! Here's how to get started.

## Development Setup

1. Fork and clone the repository
2. Install dependencies for both frontend and backend:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
3. Set up environment variables (see `.env.example`)
4. Start development servers:
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev

   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

## Code Standards

- **TypeScript** — Strict mode enabled for both projects
- **ESLint** — Run `npm run lint` before committing
- **Formatting** — Use Prettier defaults (or the project's config)
- **Imports** — Keep imports organized, no unused imports

## Testing

- **Backend:** `cd backend && npm test` (Jest + Supertest + MongoMemoryServer)
- **Frontend:** `cd frontend && npm test` (Jest + React Testing Library)
- Write tests for all new features
- Ensure existing tests pass before submitting PRs

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes with clear commits
3. Update documentation if needed
4. Run tests and ensure they pass
5. Submit a PR with a clear description of changes

## Commit Convention

Use conventional commits:
- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation
- `test:` — Tests
- `refactor:` — Code restructuring
- `chore:` — Build/config changes

## Questions?

Open an issue for bugs or feature requests.
