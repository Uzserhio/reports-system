FROM node:20-alpine AS base

FROM base AS builder
WORKDIR /app
COPY package*.json ./
COPY apps/server/package*.json ./apps/server/
COPY packages/shared/package*.json ./packages/shared/
RUN npm install
COPY . .
RUN npm run build --workspace=@sroy/shared
RUN npm run build --workspace=@sroy/server

FROM base AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/apps/server/package.json ./apps/server/package.json
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/package.json

EXPOSE 3000
CMD ["node", "apps/server/dist/index.js"]
