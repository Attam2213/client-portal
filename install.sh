#!/bin/bash

# Exit on error
set -e

# Ensure we are in the script's directory
cd "$(dirname "$0")"

echo "=== Client Portal Installation Script ==="

# 1. Ask for inputs
read -p "Enter Domain Name (e.g., example.com): " DOMAIN
while [[ -z "$DB_PASS" ]]; do
    read -s -p "Enter New Database Password for 'clientportal' user (cannot be empty): " DB_PASS
    echo ""
done

# 2. System Updates & Dependencies
echo "Updating system packages..."
sudo apt-get update
sudo apt-get install -y curl git nginx postgresql postgresql-contrib certbot python3-certbot-nginx

# Install Node.js 20.x
if ! command -v node &> /dev/null; then
    echo "Installing Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install PM2
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    sudo npm install -g pm2
fi

# 3. Database Setup
echo "Configuring PostgreSQL..."
# Switch to /tmp to avoid "could not change directory to /root" permission errors
cd /tmp

# Create user and db if not exists
sudo -u postgres psql -tc "SELECT 1 FROM pg_user WHERE usename = 'clientportal'" | grep -q 1 || sudo -u postgres psql -c "CREATE USER clientportal WITH PASSWORD '$DB_PASS';"
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = 'clientportal'" | grep -q 1 || sudo -u postgres psql -c "CREATE DATABASE clientportal OWNER clientportal;"
sudo -u postgres psql -c "ALTER USER clientportal CREATEDB;"

# Return to project directory
cd - > /dev/null

# 4. App Configuration
echo "Configuring Application..."
# Create .env file
cat > .env <<EOL
DATABASE_URL="postgresql://clientportal:${DB_PASS}@localhost:5432/clientportal"
NEXTAUTH_URL="https://${DOMAIN}"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
EOL

# Install dependencies and build
echo "Installing project dependencies..."
npm install

echo "Generating Prisma Client..."
npx prisma generate

echo "Running Database Migrations..."
npx prisma migrate deploy

echo "Building Next.js application..."
npm run build

# 5. PM2 Setup
echo "Starting application with PM2..."
pm2 delete client-portal 2>/dev/null || true
pm2 start npm --name "client-portal" -- start
pm2 save
pm2 startup | tail -n 1 | bash || true

# 6. Nginx Setup
echo "Configuring Nginx..."
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
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL

sudo ln -sf /etc/nginx/sites-available/${DOMAIN} /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 7. SSL Setup (Interactive or Automatic)
echo "Setting up SSL with Certbot..."
sudo certbot --nginx -d ${DOMAIN} --non-interactive --agree-tos -m admin@${DOMAIN} --redirect

echo "=== Installation Complete! ==="
echo "Your site should be live at https://${DOMAIN}"
