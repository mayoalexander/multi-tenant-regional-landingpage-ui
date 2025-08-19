#!/bin/bash
# Deploy script for DigitalOcean Droplet

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone repository
git clone https://github.com/your-username/safehaven-security.git
cd safehaven-security

# Start application
docker-compose up -d

# Setup reverse proxy (optional)
echo "App running on http://your-droplet-ip:3000"