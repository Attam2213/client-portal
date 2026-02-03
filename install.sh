#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "=== Client Portal Full Installer ==="

# 1. Check for Root
if [ "$EUID" -ne 0 ]; then 
  echo "Please run as root (sudo bash install.sh)"
  exit 1
fi

# 2. Install System Dependencies (Git, Node.js, Nginx, PostgreSQL)
echo "--- 1/6 Installing System Dependencies ---"
apt-get update
apt-get install -y git curl nginx build-essential postgresql postgresql-contrib

# Install Node.js 20 (if not found)
if ! command -v node &> /dev/null; then
    echo "Installing Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
else
    echo "Node.js $(node -v) is already installed."
fi

# Install PM2 (if not found)
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
else
    echo "PM2 is already installed."
fi

# 3. Setup Project Directory
echo "--- 2/6 Setting up Project Directory ---"
TARGET_DIR="/var/www/client-portal"
REPO_URL="https://github.com/Attam2213/client-portal.git"

if [ -d "$TARGET_DIR" ]; then
    echo "Updating existing repository in $TARGET_DIR..."
    cd "$TARGET_DIR"
    git pull
else
    echo "Cloning repository to $TARGET_DIR..."
    git clone "$REPO_URL" "$TARGET_DIR"
    cd "$TARGET_DIR"
fi

# 4. Configuration & Database
echo "--- 3/6 Configuration & Database Setup ---"
if [ -f server/.env ]; then
    echo "Found existing configuration."
    # Try to load variables
    export $(grep -v '^#' server/.env | xargs)
else
    read -p "Enter Domain Name (e.g. wexa.su): " DOMAIN_NAME
    read -p "Enter DB Password (for user 'clientportal'): " DB_PASS
    
    # Create Database User and DB if not exists
    echo "Configuring PostgreSQL..."
    sudo -u postgres psql -c "CREATE USER clientportal WITH PASSWORD '$DB_PASS';" 2>/dev/null || echo "User already exists or failed to create."
    sudo -u postgres psql -c "CREATE DATABASE clientportal OWNER clientportal;" 2>/dev/null || echo "Database already exists or failed to create."
    sudo -u postgres psql -c "ALTER USER clientportal CREATEDB;" 2>/dev/null || true

    # Create server/.env
    echo "Creating server/.env..."
    cat > server/.env <<EOF
PORT=5000
DATABASE_URL="postgresql://clientportal:${DB_PASS}@localhost:5432/clientportal"
JWT_SECRET="$(openssl rand -base64 32)"
EOF
    
    # Export for current session
    export DOMAIN_NAME=$DOMAIN_NAME
fi

# Ensure DOMAIN_NAME is set if we skipped the block above
if [ -z "$DOMAIN_NAME" ]; then
    read -p "Enter Domain Name (e.g. wexa.su) for Nginx config: " DOMAIN_NAME
fi

# 5. Backend Setup
echo "--- 4/6 Setting up Backend ---"
cd server
npm install
echo "Generating Prisma Client..."
npx prisma generate
echo "Pushing Database Schema..."
npx prisma db push
echo "Building Server..."
npm run build
cd ..

# 6. Frontend Setup
echo "--- 5/6 Setting up Frontend ---"
cd client
npm install
echo "Building Frontend..."
npm run build
cd ..

# 7. Nginx & Deployment
echo "--- 6/6 Configuring Nginx & Starting Services ---"

# Nginx Config
cat > /etc/nginx/sites-available/$DOMAIN_NAME <<EOF
server {
    server_name $DOMAIN_NAME;
    root /var/www/client-portal/client/dist;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

ln -sf /etc/nginx/sites-available/$DOMAIN_NAME /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true
nginx -t && systemctl reload nginx

# Start PM2
cd server
pm2 delete client-portal-server 2>/dev/null || true
pm2 start dist/index.js --name client-portal-server
pm2 save

echo "=== Installation Complete! ==="
echo "Your site is live at https://$DOMAIN_NAME"
echo "API is running on port 5000"
