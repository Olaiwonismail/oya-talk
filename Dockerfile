# syntax=docker/dockerfile:1

# Multi-stage build that produces two runnable targets:
#   - frontend: Next.js app at port 3000
#   - backend: FastAPI app at port 8000

ARG PNPM_VERSION=9.12.3

###############################
# Frontend dependencies + build
FROM node:20-alpine AS frontend-deps
ARG PNPM_VERSION
WORKDIR /app/client
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
COPY client/package.json client/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM frontend-deps AS frontend-build
COPY client .
RUN pnpm build

###############################
# Backend base (deps + code)
FROM python:3.11-slim AS backend-base
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1
WORKDIR /app/backend
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend .
RUN mkdir -p /data
ENV PORT=8000
EXPOSE 8000

###############################
# Backend runtime image
FROM backend-base AS backend
VOLUME ["/data"]
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

###############################
# Frontend runtime image
FROM node:20-alpine AS frontend
ARG PNPM_VERSION
WORKDIR /app/client
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
COPY --from=frontend-build /app/client/.next ./.next
COPY --from=frontend-build /app/client/public ./public
COPY --from=frontend-build /app/client/package.json ./package.json
COPY --from=frontend-build /app/client/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=frontend-build /app/client/node_modules ./node_modules
EXPOSE 3000
CMD ["pnpm", "start", "--hostname", "0.0.0.0", "--port", "3000"]
