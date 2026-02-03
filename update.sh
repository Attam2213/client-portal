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

# 6. Check for Nginx headers update (idempotent check)
# We only update if X-Forwarded-Proto is missing to avoid overwriting SSL config
if ! grep -q "X-Forwarded-Proto" /etc/nginx/sites-available/wexa.su; then
    echo "Updating Nginx configuration for headers..."
    # Note: This will overwrite SSL config if run. User must re-run certbot if this triggers.
    # To be safe, we will just warn or append. 
    # For now, let's assume the user has run the fix manually as instructed.
    echo "Skipping automated Nginx overwrite to preserve SSL. If you have issues, run install.sh again or fix nginx config manually."
fi

echo "=== Update Complete! ==="
