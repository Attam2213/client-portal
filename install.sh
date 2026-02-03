#!/bin/bash

echo "=== Client Portal V2 Installer ==="

# 1. Credentials Setup
if [ -f server/.env ]; then
  echo "Found existing .env in server/"
else
  echo "Setting up configuration..."
  read -p "Enter Domain Name (e.g. wexa.su): " DOMAIN_NAME
  read -p "Enter DB Password: " DB_PASS
  
  # Create server/.env
  cat > server/.env <<EOF
PORT=5000
DATABASE_URL="postgresql://clientportal:${DB_PASS}@localhost:5432/clientportal"
JWT_SECRET="$(openssl rand -base64 32)"
EOF
fi

# 2. Server Setup
echo "=== Setting up Backend Server ==="
cd server
npm install
echo "Generating Prisma Client..."
npx prisma generate
echo "Pushing Database Schema..."
npx prisma db push
echo "Building Server..."
npm run build
cd ..

# 3. Client Setup
echo "=== Setting up Frontend Client ==="
cd client
npm install
echo "Building Frontend..."
npm run build
cd ..

# 4. Nginx Configuration
echo "=== Configuring Nginx ==="
# We serve static files from client/dist and proxy /api to localhost:5000
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
nginx -t && systemctl reload nginx

# 5. PM2 Setup
echo "=== Starting Server with PM2 ==="
cd server
pm2 delete client-portal-server 2>/dev/null || true
pm2 start dist/index.js --name client-portal-server
pm2 save
cd ..

echo "=== Installation Complete! ==="
echo "Your site should be live at https://$DOMAIN_NAME"
