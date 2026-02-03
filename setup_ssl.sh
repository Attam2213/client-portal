#!/bin/bash
set -e

DOMAIN="wexa.su"
EMAIL="admin@wexa.su"

echo "=== Fixing Connection & Setting up SSL ==="

# 1. Fix Permissions
echo "Fixing permissions..."
# Ensure Nginx can read the files
chown -R www-data:www-data /var/www/client-portal/client/dist
chmod -R 755 /var/www/client-portal

# 2. Firewall Setup (UFW)
echo "Configuring Firewall..."
# Check if UFW is installed
if command -v ufw > /dev/null; then
    echo "UFW found. Allowing SSH and Nginx..."
    ufw allow OpenSSH
    ufw allow 'Nginx Full'
    # Enable ufw without prompting
    echo "y" | ufw enable
else
    echo "UFW not found, installing..."
    apt-get install -y ufw
    ufw allow OpenSSH
    ufw allow 'Nginx Full'
    echo "y" | ufw enable
fi

# 3. Install Certbot
echo "Installing Certbot..."
apt-get update
apt-get install -y certbot python3-certbot-nginx

# 4. Obtain SSL Certificate
echo "Obtaining SSL Certificate for $DOMAIN..."
# --redirect automatically updates Nginx config to redirect HTTP to HTTPS
certbot --nginx -d $DOMAIN --non-interactive --agree-tos -m $EMAIL --redirect

echo "=== SSL Setup Complete! ==="
echo "Wait 10-20 seconds and try visiting https://$DOMAIN"
