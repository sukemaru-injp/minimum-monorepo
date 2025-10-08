# syntax=docker/dockerfile:1.7

FROM node:22-slim AS builder

ENV PNPM_HOME=/usr/local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH

RUN corepack enable

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY apps/wellness-api/package.json apps/wellness-api/
COPY packages/shared-lib/package.json packages/shared-lib/

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter @minimum-monorepo/shared-lib build \
  && pnpm --filter wellness-api build

FROM node:22-slim AS runner

ENV NODE_ENV=dev
ENV PNPM_HOME=/usr/local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH

WORKDIR /app

# Install only production dependencies for the service + its workspace deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/wellness-api/package.json apps/wellness-api/
COPY packages/shared-lib/package.json packages/shared-lib/
RUN corepack enable \
  && pnpm install --prod --frozen-lockfile --filter wellness-api...

COPY --from=builder /app/apps/wellness-api/dist apps/wellness-api/dist
COPY --from=builder /app/packages/shared-lib/dist packages/shared-lib/dist

EXPOSE 3050

CMD ["node", "apps/wellness-api/dist/index.js"]
