#!/bin/bash

# Exit on error
set -e

# Ensure we are in the script's directory
cd "$(dirname "$0")"

echo "=== Make Admin Script ==="

read -p "Enter Email of user to make admin: " EMAIL

if [[ -z "$EMAIL" ]]; then
    echo "Error: Email cannot be empty."
    exit 1
fi

echo "Updating user role to 'admin'..."

# Execute SQL command inside the container or directly via psql
# Assuming we can connect via DATABASE_URL or local socket
# We'll use the .env file to get connection details if possible, or default to local peer auth

# Try to source .env
if [ -f .env ]; then
    export $(cat .env | xargs)
fi

# Run update command
# Using docker exec if running in container, or direct psql
if command -v psql &> /dev/null; then
    sudo -u postgres psql -d clientportal -c "UPDATE \"User\" SET role = 'admin' WHERE email = '$EMAIL';"
    echo "User $EMAIL is now an admin."
else
    echo "Error: psql command not found. Please run this on the server where PostgreSQL is installed."
fi
