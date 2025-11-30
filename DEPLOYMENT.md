# TalhaVerse Production Deployment Guide

Complete guide for deploying TalhaVerse to production.

## Pre-Deployment Checklist

- [ ] All features tested locally
- [ ] Environment variables documented
- [ ] No hardcoded secrets in code
- [ ] Database backup strategy planned
- [ ] Domain name registered
- [ ] SSL certificate ready
- [ ] Monitoring tools selected
- [ ] Error logging configured

---

## Option 1: VPS Deployment (DigitalOcean, Linode, AWS EC2)

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Nginx
sudo apt install -y nginx

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Git
sudo apt install -y git
```

### 2. Clone Repository

```bash
cd /var/www
sudo git clone <your-repo-url> talhaverse
cd talhaverse
sudo chown -R $USER:$USER /var/www/talhaverse
```

### 3. Configure Environment

```bash
# Backend environment
cd /var/www/talhaverse/backend
nano .env
```

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/talhaverse
JWT_SECRET=<generate-strong-secret>
JWT_REFRESH_SECRET=<generate-strong-secret>
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=<strong-password>
NODE_ENV=production
UPLOAD_DIR=uploads
MAX_FILE_SIZE=524288000
FRONTEND_URL=https://yourdomain.com

# Optional: AWS S3
AWS_S3_BUCKET=your-bucket
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1
```

### 4. Install Dependencies & Build

```bash
# Backend
cd /var/www/talhaverse/backend
npm install --production
npm run seed

# Frontend
cd /var/www/talhaverse/frontend
npm install
npm run build
```

### 5. Configure PM2

```bash
cd /var/www/talhaverse/backend

# Start backend with PM2
pm2 start src/server.js --name talhaverse-backend

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the command it outputs
```

### 6. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/talhaverse
```

```nginx
# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # File uploads
    client_max_body_size 500M;
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/talhaverse/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/talhaverse /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 7. Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificates
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Auto-renewal is configured automatically
# Test renewal
sudo certbot renew --dry-run
```

### 8. Configure Firewall

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 9. Setup Monitoring

```bash
# PM2 monitoring
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# View logs
pm2 logs talhaverse-backend

# Monitor processes
pm2 monit
```

---

## Option 2: Vercel (Frontend) + Railway/Render (Backend)

### Frontend on Vercel

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo>
git push -u origin main
```

2. **Deploy to Vercel**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Configure build settings:
     - Framework Preset: Vite
     - Root Directory: `frontend`
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Add environment variable:
     - `VITE_API_URL`: Your backend API URL

3. **Configure Domain**
   - Add custom domain in Vercel dashboard
   - Update DNS records as instructed

### Backend on Railway

1. **Create Railway Account**
   - Go to https://railway.app
   - Connect GitHub account

2. **Deploy Backend**
   - New Project → Deploy from GitHub
   - Select your repository
   - Configure:
     - Root Directory: `backend`
     - Start Command: `npm start`

3. **Add Environment Variables**
   - Add all variables from `.env`
   - Railway provides MongoDB addon or use MongoDB Atlas

4. **Get Public URL**
   - Railway generates a public URL
   - Update frontend `VITE_API_URL` with this URL

### Backend on Render

1. **Create Render Account**
   - Go to https://render.com
   - Connect GitHub

2. **Create Web Service**
   - New → Web Service
   - Connect repository
   - Configure:
     - Name: talhaverse-backend
     - Environment: Node
     - Build Command: `cd backend && npm install`
     - Start Command: `cd backend && npm start`

3. **Add Environment Variables**
   - Add all from `.env`
   - Use MongoDB Atlas for database

4. **Deploy**
   - Render auto-deploys on push

---

## Option 3: Docker Deployment

### 1. Build Images

```bash
# Build backend
cd backend
docker build -t talhaverse-backend .

# Build frontend
cd ../frontend
docker build -t talhaverse-frontend .
```

### 2. Docker Compose Production

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7
    restart: always
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
    networks:
      - talhaverse-network

  backend:
    image: talhaverse-backend
    restart: always
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    env_file:
      - ./backend/.env
    volumes:
      - ./backend/uploads:/app/uploads
    networks:
      - talhaverse-network

  frontend:
    image: talhaverse-frontend
    restart: always
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - talhaverse-network

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    networks:
      - talhaverse-network

volumes:
  mongodb_data:

networks:
  talhaverse-network:
    driver: bridge
```

### 3. Deploy

```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## Database Setup

### MongoDB Atlas (Recommended for Production)

1. **Create Cluster**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create free cluster
   - Choose region closest to your users

2. **Configure Access**
   - Database Access → Add user
   - Network Access → Add IP (0.0.0.0/0 for all, or specific IPs)

3. **Get Connection String**
   - Connect → Connect your application
   - Copy connection string
   - Replace `<password>` with your password
   - Update `MONGO_URI` in backend `.env`

4. **Backup Strategy**
   - Atlas provides automatic backups
   - Configure backup schedule in Atlas dashboard

---

## File Storage

### AWS S3 Setup

1. **Create S3 Bucket**
```bash
aws s3 mb s3://talhaverse-uploads --region us-east-1
```

2. **Configure CORS**
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://yourdomain.com"],
    "ExposeHeaders": []
  }
]
```

3. **Create IAM User**
   - Create user with S3 access
   - Get Access Key ID and Secret
   - Add to backend `.env`

4. **Update Backend Code**
   - Modify `upload.middleware.js` to use S3
   - Use `aws-sdk` or `@aws-sdk/client-s3`

---

## Security Hardening

### 1. Environment Variables

Never commit `.env` files. Use:
- Railway/Render: Built-in environment variables
- VPS: System environment variables or `.env` files with restricted permissions

```bash
chmod 600 /var/www/talhaverse/backend/.env
```

### 2. MongoDB Security

```bash
# Enable authentication
sudo nano /etc/mongod.conf
```

```yaml
security:
  authorization: enabled
```

```bash
# Create admin user
mongosh
use admin
db.createUser({
  user: "admin",
  pwd: "strong-password",
  roles: ["root"]
})
```

### 3. Rate Limiting

Already configured in backend. Adjust limits in `rateLimiter.middleware.js` for production.

### 4. HTTPS Only

Force HTTPS in Nginx:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

### 5. Security Headers

Already configured via Helmet.js. Additional Nginx headers:

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
```

---

## Monitoring & Logging

### 1. PM2 Monitoring

```bash
# View logs
pm2 logs

# Monitor CPU/Memory
pm2 monit

# Web dashboard
pm2 plus
```

### 2. Error Tracking

Integrate Sentry:

```bash
npm install @sentry/node
```

```javascript
// backend/src/server.js
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});
```

### 3. Uptime Monitoring

Use services like:
- UptimeRobot (free)
- Pingdom
- StatusCake

### 4. Analytics

Add Google Analytics or Plausible to frontend.

---

## Backup Strategy

### 1. Database Backups

```bash
# Automated daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="mongodb://localhost:27017/talhaverse" --out="/backups/mongo_$DATE"
find /backups -type d -mtime +7 -exec rm -rf {} +
```

```bash
# Add to crontab
crontab -e
0 2 * * * /path/to/backup-script.sh
```

### 2. File Backups

```bash
# Backup uploads directory
rsync -avz /var/www/talhaverse/backend/uploads/ /backups/uploads/
```

### 3. Code Backups

Use Git tags for releases:

```bash
git tag -a v1.0.0 -m "Production release v1.0.0"
git push origin v1.0.0
```

---

## Performance Optimization

### 1. Enable Gzip

Already configured in Nginx example above.

### 2. CDN Setup

Use Cloudflare:
- Add domain to Cloudflare
- Update nameservers
- Enable caching and optimization
- Configure SSL

### 3. Database Indexing

Already configured in models. Monitor slow queries:

```javascript
mongoose.set('debug', true); // Development only
```

### 4. Image Optimization

Use image CDN like Cloudinary or ImageKit for thumbnails.

---

## Scaling

### Horizontal Scaling

1. **Load Balancer**
   - Use Nginx or cloud load balancer
   - Multiple backend instances

2. **Database Replication**
   - MongoDB replica sets
   - Read replicas for scaling reads

3. **Caching**
   - Redis for session storage
   - Cache frequently accessed data

### Vertical Scaling

- Upgrade server resources (CPU, RAM)
- Optimize database queries
- Use connection pooling

---

## Rollback Strategy

### Quick Rollback

```bash
# PM2 rollback
pm2 reload talhaverse-backend

# Git rollback
cd /var/www/talhaverse
git checkout <previous-commit>
cd backend && npm install
pm2 restart talhaverse-backend
```

### Database Rollback

```bash
# Restore from backup
mongorestore --uri="mongodb://localhost:27017/talhaverse" /backups/mongo_YYYYMMDD/
```

---

## Maintenance Mode

Create maintenance page:

```nginx
# Nginx maintenance mode
if (-f /var/www/maintenance.html) {
    return 503;
}

error_page 503 @maintenance;
location @maintenance {
    root /var/www;
    rewrite ^(.*)$ /maintenance.html break;
}
```

---

## Post-Deployment Checklist

- [ ] SSL certificate installed and working
- [ ] All environment variables set correctly
- [ ] Database connected and seeded
- [ ] File uploads working
- [ ] Downloads working and counting
- [ ] Admin panel accessible
- [ ] Email notifications working (if configured)
- [ ] Monitoring tools active
- [ ] Backups configured and tested
- [ ] Error logging working
- [ ] Performance acceptable (< 2s page load)
- [ ] Mobile responsive
- [ ] SEO meta tags present
- [ ] Analytics tracking
- [ ] Security headers configured
- [ ] Rate limiting active
- [ ] CORS configured correctly

---

## Troubleshooting

### Backend won't start
```bash
pm2 logs talhaverse-backend
# Check for environment variable issues
# Verify MongoDB connection
```

### 502 Bad Gateway
```bash
# Check if backend is running
pm2 status
# Check Nginx configuration
sudo nginx -t
# Check backend logs
pm2 logs
```

### File uploads failing
```bash
# Check permissions
ls -la /var/www/talhaverse/backend/uploads
# Should be writable by Node process user
```

### High memory usage
```bash
# Monitor with PM2
pm2 monit
# Restart if needed
pm2 restart talhaverse-backend
```

---

## Support & Resources

- [Node.js Production Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [MongoDB Production Notes](https://docs.mongodb.com/manual/administration/production-notes/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Let's Encrypt](https://letsencrypt.org/)

---

## Estimated Costs

### Budget Hosting (~$15-30/month)
- VPS: DigitalOcean Droplet ($12/month)
- Domain: Namecheap ($10/year)
- MongoDB Atlas: Free tier
- SSL: Free (Let's Encrypt)

### Mid-Tier (~$50-100/month)
- VPS: Larger droplet ($24/month)
- MongoDB Atlas: Shared cluster ($9/month)
- AWS S3: ~$5/month
- Cloudflare Pro: $20/month
- Monitoring: Free tier

### Enterprise (Custom)
- Dedicated servers
- MongoDB Atlas dedicated cluster
- CDN
- Premium support
- Advanced monitoring

---

Good luck with your deployment! 🚀
