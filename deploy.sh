#!/bin/bash
# Deploy script for DigitalOcean Droplet

set -e  # Exit on any error

echo "🚀 Starting SafeHaven Security deployment..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Install Nginx
echo "📦 Installing Nginx..."
sudo apt install -y nginx

# Clone repository
echo "📥 Cloning repository..."
if [ -d "safehaven-security" ]; then
    echo "Repository exists, pulling latest changes..."
    cd safehaven-security
    git pull origin main
else
    git clone https://github.com/mayoalexander/multi-tenant-regional-landingpage-ui.git safehaven-security
    cd safehaven-security
fi

# Install dependencies and build
echo "📦 Installing dependencies..."
npm install

echo "🔨 Building application..."
npm run build

# Create PM2 ecosystem file
echo "⚙️ Creating PM2 configuration..."
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'safehaven-security',
    script: 'npm',
    args: 'start',
    cwd: '/root/safehaven-security',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# Start application with PM2
echo "🚀 Starting application..."
pm2 delete safehaven-security 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Configure Nginx
echo "🌐 Configuring Nginx..."
sudo tee /etc/nginx/sites-available/safehaven-security << EOF
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable Nginx site
sudo ln -sf /etc/nginx/sites-available/safehaven-security /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

# Setup UFW firewall
echo "🔒 Configuring firewall..."
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

echo "✅ Deployment complete!"
echo "🌐 Your app is now running at: http://$(curl -s ifconfig.me)"
echo "📊 Check app status: pm2 status"
echo "📝 View logs: pm2 logs safehaven-security"