#!/bin/bash

# Exit on error
set -e

DOMAIN="wexa.su"
SSL_PATH="/etc/letsencrypt/live/$DOMAIN"

echo "=== Fixing Nginx SSL & Proxy Configuration ==="

# Check if SSL certs exist
if [ ! -d "$SSL_PATH" ]; then
  echo "Error: SSL certificates not found at $SSL_PATH."
  echo "Please run: sudo certbot --nginx -d $DOMAIN"
  exit 1
fi

echo "Detected SSL certificates at $SSL_PATH"
echo "Overwriting Nginx config with correct Proxy Headers..."

# Create new Nginx config
cat > /etc/nginx/sites-available/$DOMAIN <<EOL
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    server_name $DOMAIN www.$DOMAIN;

    ssl_certificate $SSL_PATH/fullchain.pem;
    ssl_certificate_key $SSL_PATH/privkey.pem;
    
    # Standard Certbot SSL options (adjust paths if necessary, but these are defaults on Ubuntu)
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

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

# Enable site and restart Nginx
sudo ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/

echo "Testing Nginx configuration..."
sudo nginx -t

echo "Restarting Nginx..."
sudo systemctl restart nginx

echo "=== Fix Complete! ==="
echo "Try logging in again now."
