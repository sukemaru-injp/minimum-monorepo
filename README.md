# minimum-monorepo

## Start

```
$ pnpm install
$ pnpm dev
```

## Database Schema Management

This project uses [sqldef](https://github.com/sqldef/sqldef) for idempotent schema management. The complete schema is defined in `shared/schema.sql`.

### Install sqldef

```bash
# macOS
brew install sqldef/sqldef/psqldef

# Linux
wget https://github.com/sqldef/sqldef/releases/latest/download/psqldef_linux_amd64.tar.gz
tar xf psqldef_linux_amd64.tar.gz
sudo mv psqldef /usr/local/bin/

# Other platforms: https://github.com/sqldef/sqldef#installation
```

### Apply Schema to Local Database

```bash
# Apply schema changes (from repository root)
psqldef -U wellness -p 5432 -h localhost --password=wellness_dev_pass wellness_database_local < shared/schema.sql

# Dry-run to preview changes without applying
psqldef -U wellness -p 5432 -h localhost --password=wellness_dev_pass wellness_database_local --dry-run < shared/schema.sql

# Export current database schema
psqldef -U wellness -p 5432 -h localhost --password=wellness_dev_pass wellness_database_local --export > current_schema.sql
```

### Using Environment Variables

```bash
# Set environment variables to avoid typing credentials
export PGUSER=wellness
export PGPASSWORD=wellness_dev_pass
export PGHOST=localhost
export PGPORT=5432

# Then simply run
psqldef wellness_database_local < shared/schema.sql
```

## Local Database Access

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
