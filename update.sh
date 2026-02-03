#!/bin/bash
set -e

echo "=== Client Portal Update Script ==="

# Check for root
if [ "$EUID" -ne 0 ]; then 
  echo "Please run as root (sudo bash update.sh)"
  exit 1
fi

TARGET_DIR="/var/www/client-portal"

# Go to directory if we are not already there
if [ -d "$TARGET_DIR" ]; then
    cd "$TARGET_DIR"
    echo "Working in $TARGET_DIR"
else
    # If we are running this script from the current directory and it happens to be the project dir
    if [ -f "package.json" ] && [ -d "server" ] && [ -d "client" ]; then
        echo "Working in current directory"
    else
        echo "Directory $TARGET_DIR not found and current directory doesn't look like the project. Please run install.sh first."
        exit 1
    fi
fi

# 1. Update Code
echo "--- 1/4 Pulling latest changes ---"
git fetch --all
git checkout master
git reset --hard origin/master

# 2. Update Server
echo "--- 2/4 Updating Server ---"
cd server
if [ ! -f .env ]; then
    echo "Warning: server/.env not found! Please check configuration."
fi
npm install
echo "Generating Prisma Client..."
npx prisma generate
echo "Pushing Database Schema..."
npx prisma db push
echo "Building Server..."
npm run build
cd ..

# 3. Update Client
echo "--- 3/4 Updating Client ---"
cd client
npm install
echo "Building Client..."
# We assume .env.production was created by install.sh. 
# If missing, the build might default to localhost or fail depending on code.
if [ ! -f .env.production ]; then
    echo "Warning: client/.env.production not found. API calls might fail if not configured."
fi
npm run build
cd ..

# 4. Restart Services
echo "--- 4/4 Restarting Services ---"
pm2 restart client-portal-server 2>/dev/null || pm2 start server/dist/index.js --name client-portal-server --cwd ./server

echo "=== Update Complete! ==="
