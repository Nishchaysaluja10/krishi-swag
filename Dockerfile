# Stage 1: Build the frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install
COPY . .
RUN bun run build

# Stage 2: Setup the backend
FROM python:3.9-slim AS backend-builder
WORKDIR /app
COPY --from=frontend-builder /app/dist /app/dist
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend .
COPY models /app/models

# Stage 3: Final image
FROM python:3.9-slim
WORKDIR /app
COPY --from=backend-builder /app .
EXPOSE 8000
CMD ["uvicorn", "main1:app", "--host", "0.0.0.0", "--port", "8000"]
