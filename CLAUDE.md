# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a pnpm + Turborepo monorepo for a wellness API application. The project uses TypeScript with strict ESM (type: "module") configuration and Biome for linting/formatting.

**Key Technologies:**
- **Package Manager:** pnpm (v10.11.0+)
- **Build System:** Turborepo for task orchestration
- **Runtime:** Node.js ≥22.0.0
- **API Framework:** Hono with OpenAPI/Zod validation
- **Linting/Formatting:** Biome (not ESLint/Prettier)
- **Logging:** Pino (via shared-lib)

## Project Structure

```
apps/
  wellness-api/          # Main Hono API server with OpenAPI support
packages/
  shared-lib/           # Shared utilities (logger, etc.)
  ctx-wellness/         # Empty package (placeholder)
shared/
  openapi.yml           # Generated OpenAPI specification
config/
  tsconfig.base.json    # Base TypeScript configuration
```

## Common Commands

### Development
```bash
pnpm install              # Install all dependencies
pnpm dev                  # Start all apps in dev mode (uses turbo --filter=./apps/*)
```

### Building
```bash
pnpm build                # Build all packages and apps
turbo run build --filter=wellness-api  # Build specific app
```

### Code Quality
```bash
pnpm lint                 # Run Biome linter on all workspaces
pnpm format               # Format code with Biome
pnpm check                # Run Biome check (lint + format)
```

**Note:** This project uses **Biome**, not ESLint or Prettier. All formatting rules are in `biome.json`.

### OpenAPI Generation
```bash
pnpm gen:openapi          # Generate OpenAPI spec to shared/openapi.yml
```

This runs `apps/wellness-api/scripts/generate-openapi.ts` which extracts the OpenAPI document from Hono routes and writes it to `shared/openapi.yml`.

## Code Architecture

### Wellness API (apps/wellness-api)

The wellness-api is built with **Hono** and uses **@hono/zod-openapi** for type-safe API definitions.

**Route Structure Pattern:**
Each route follows a modular structure in `src/routes/`:
```
routes/
  GetSample/
    index.ts      # Re-exports route and handler
    route.ts      # OpenAPI route definition (createRoute)
    handler.ts    # Route handler implementation
    schema.ts     # Zod schemas for validation
  PostSample/
    (same structure)
  index.ts        # Aggregates all routes into wellnessApi
```

**Key Files:**
- `src/index.ts` - Main server entry point, creates OpenAPIHono app and mounts routes at `/v1`
- `src/routes/index.ts` - Combines all route modules using `wellnessApi.openapi(route, handler)`
- `scripts/generate-openapi.ts` - Extracts OpenAPI spec from Hono app definition

**Adding New Routes:**
1. Create a new directory under `src/routes/` with the pattern above
2. Define schemas in `schema.ts` using `z.object().openapi()`
3. Create route definition in `route.ts` using `createRoute()`
4. Implement handler in `handler.ts` with `RouteHandler<typeof route>`
5. Re-export in `index.ts`
6. Register in `src/routes/index.ts` with `wellnessApi.openapi()`

### Shared Library (packages/shared-lib)

Provides common utilities across the monorepo.

**Current Exports:**
- `logger` - Pino-backed logger instance configured for JSON logging
- `createLogger()` - Factory function returning a Pino-backed logger

The shared-lib uses `tsgo` (TypeScript native compiler preview) for fast builds with the `dev` script.

### TypeScript Configuration

All packages extend from `config/tsconfig.base.json`:
- Target: ES2022
- Module: ESNext with bundler resolution
- Strict mode enabled
- ESM-only (`"type": "module"` in all package.json files)

## Code Style (Biome)

Key formatting rules from `biome.json`:
- **Indent:** Tabs (not spaces)
- **Line width:** 80 characters
- **Quotes:** Single quotes for JS/TS, double for JSX
- **Semicolons:** Always required
- **Trailing commas:** None

Strict linting rules include:
- No unused variables/imports (error level)
- No parameter reassignment
- Use `as const` assertions
- Enum initializers required
- Self-closing elements enforced

## Workspace Dependencies

The wellness-api depends on `@minimum-monorepo/shared-lib` via `workspace:^` protocol. When making changes to shared-lib, Turbo will automatically rebuild dependent packages due to `dependsOn: ["^build"]` configuration.

## Docker Support

The wellness-api includes Dockerfile and docker-compose.yml for containerized deployment (located in `apps/wellness-api/`).
