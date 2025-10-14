# Wellness API

## Development

```bash
pnpm install
pnpm dev
```

```bash
open http://localhost:3050
```

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

## Database Access

```bash
# Access PostgreSQL CLI
docker exec -it wellness-postgres psql -U wellness -d wellness_database_local

# Execute SQL from command line
docker exec -it wellness-postgres psql -U wellness -d wellness_database_local -c "SELECT version();"

# Dump database
docker exec wellness-postgres pg_dump -U wellness wellness_database_local > backup.sql

# Restore database
docker exec -i wellness-postgres psql -U wellness -d wellness_database_local < backup.sql
```
