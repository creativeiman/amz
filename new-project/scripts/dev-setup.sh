#!/bin/bash

# Fresh Development Setup Script
# This script destroys existing database and creates a fresh environment

set -e  # Exit on error

echo "🗑️  Stopping and removing existing containers..."
docker-compose down -v

echo "🚀 Starting fresh PostgreSQL container..."
docker-compose up -d

echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found, creating from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env.local
    else
        echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5433/product_label_checker" > .env.local
        echo "NEXTAUTH_URL=http://localhost:3001" >> .env.local
        echo "NEXTAUTH_SECRET=your-secret-key-change-this-in-production" >> .env.local
        echo "NODE_ENV=development" >> .env.local
    fi
fi

# Load environment variables
export $(grep -v '^#' .env.local | xargs)

echo "🗑️  Removing old migrations..."
rm -rf prisma/migrations

echo "🔧 Generating Prisma Client..."
pnpm prisma generate

echo "📦 Creating fresh migration..."
pnpm prisma migrate dev --name init --skip-seed

echo "🌱 Seeding database..."
pnpm db:seed

echo ""
echo "✅ Fresh development environment ready!"
echo ""
echo "📝 Test Credentials:"
echo "   Admin:       admin@plabiq.com / admin123"
echo "   Free User:   free@test.com / test123"
echo "   Deluxe User: deluxe@test.com / test123"
echo ""
echo "🚀 Run 'make dev' or 'pnpm dev' to start the application"

