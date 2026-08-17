FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@11.20.0 --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/api ./apps/api

RUN pnpm install --frozen-lockfile
RUN pnpm -r build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable && corepack prepare pnpm@11.20.0 --activate

COPY --from=builder /app ./

EXPOSE 4000
CMD ["pnpm", "--filter", "@nauterio/api", "start:prod"]
