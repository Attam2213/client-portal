#!/bin/bash

echo "=== Client Portal Update Script ==="

# 1. Update Code
echo "Pulling latest changes..."
git pull

# 2. Update Server
echo "=== Updating Server ==="
cd server
npm install
echo "Updating Database Schema..."
npx prisma generate
npx prisma db push
echo "Building Server..."
npm run build
cd ..

# 3. Update Client
echo "=== Updating Client ==="
cd client
npm install
echo "Building Client..."
npm run build
cd ..

# 4. Restart Services
echo "=== Restarting Services ==="
cd server
pm2 restart client-portal-server
cd ..

echo "Update Complete!"
