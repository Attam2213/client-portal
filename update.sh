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

# 6. Update Nginx Config (if needed)
echo "Updating Nginx configuration..."
DOMAIN="wexa.su" # Hardcoded for this project update, or extract from env if present
cat > /etc/nginx/sites-available/${DOMAIN} <<EOL
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Forwarded-Host \$host;
        proxy_set_header Origin \$http_origin;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL
sudo nginx -t && sudo systemctl reload nginx

echo "=== Update Complete! ==="
