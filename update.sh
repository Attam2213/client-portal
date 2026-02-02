#!/bin/bash

# Exit on error
set -e

echo "=== Client Portal Update Script ==="

# 1. Pull latest changes
echo "Pulling latest changes from Git..."
git pull

# 2. Update dependencies
echo "Installing dependencies..."
npm install

# 3. Update Database Schema
echo "Running migrations..."
npx prisma generate
npx prisma migrate deploy

# 4. Rebuild App
echo "Rebuilding application..."
npm run build

# 5. Restart Service
echo "Restarting PM2 process..."
pm2 restart client-portal

echo "=== Update Complete! ==="
