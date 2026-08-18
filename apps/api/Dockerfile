FROM node:24-alpine AS builder
RUN corepack enable && corepack prepare pnpm@11.20.0 --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/api ./apps/api
COPY apps/worker ./apps/worker
COPY scripts/start-render.mjs scripts/deploy-migrations.mjs ./scripts/

RUN pnpm install --frozen-lockfile
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" pnpm --filter @nauterio/database generate
RUN pnpm -r build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable && corepack prepare pnpm@11.20.0 --activate

COPY --from=builder /app ./

EXPOSE 4000
CMD ["node", "scripts/start-render.mjs"]
