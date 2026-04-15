# Stage 1: Build the Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY venueflow-frontend/package*.json ./
RUN npm install
COPY venueflow-frontend/ .
RUN npm run build

# Stage 2: Build the Final Image
FROM python:3.11-slim
WORKDIR /app

# Install dependencies
COPY venueflow-backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY venueflow-backend/ .

# Copy built frontend assets to the backend's static directory
COPY --from=frontend-builder /app/frontend/out ./static

# Expose port (Cloud Run defaults to 8080)
EXPOSE 8080

# Start unified application
CMD ["python", "main.py"]
