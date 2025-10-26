# Wellness API

## Development

```bash
pnpm install
pnpm dev
```

```bash
open http://localhost:3050
```

### Database typings

Run the following after applying migrations so that `src/db/db.d.ts` stays in sync with the database schema:

```bash
pnpm --filter wellness-api gen:db-type
```

The command expects `DATABASE_URL` to point at the target PostgreSQL instance. When running via Docker Compose, the value `postgres://wellness:wellness_dev_pass@localhost:5432/wellness_database_local` works for the local database.

## Docker Compose

```bash
# Start services (API + PostgreSQL)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```
