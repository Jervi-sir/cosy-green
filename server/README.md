# Cost Green Server

Fastify backend for the Cost Green app.

This README focuses on:
- local run
- production deployment with PM2
- Nginx reverse proxy
- Namecheap DNS
- SSL with Let's Encrypt

## Requirements

- Node.js 20+
- PostgreSQL
- Nginx
- PM2
- a Linux VPS (Ubuntu recommended)

## Local Development

1. Install dependencies:

```bash
cd /Users/jervi/Desktop/cost-green/server
npm install
```

2. Create `.env` inside `server/` or make sure the process can read the root `.env` values:

```env
PORT=4000
HOST=0.0.0.0
DATABASE_URL=postgres://postgres:postgres@localhost:5432/cost_green
JWT_SECRET=change-me-in-production
ACCESS_TOKEN_TTL=1h
REFRESH_TOKEN_DAYS=30
```

3. Run migrations:

```bash
npm run db:migrate
```

4. Start dev server:

```bash
npm run dev
```

## Production Folder Example

Recommended layout on the server:

```bash
/var/www/cost-green/
  app/                  # React Native repo clone
  server/.env           # backend env
```

Example clone:

```bash
sudo mkdir -p /var/www/cost-green
sudo chown -R $USER:$USER /var/www/cost-green
cd /var/www/cost-green
git clone <your-repo-url> app
cd app/server
npm install
```

## PM2 Deployment

Install PM2 globally:

```bash
sudo npm install -g pm2
```

Create `server/ecosystem.config.cjs`:

```js
module.exports = {
  apps: [
    {
      name: "cost-green-server",
      cwd: "/var/www/cost-green/app/server",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
        PORT: 4000,
        HOST: "127.0.0.1"
      }
    }
  ]
}
```

Start with PM2:

```bash
cd /var/www/cost-green/app/server
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

Useful PM2 commands:

```bash
pm2 status
pm2 logs cost-green-server
pm2 restart cost-green-server
pm2 stop cost-green-server
```

## Namecheap DNS

In Namecheap Advanced DNS:

- `A` record
  - Host: `api`
  - Value: your VPS public IP
- optional `A` record
  - Host: `monitoring-api`
  - Value: same VPS IP

Example backend domain:

```text
api.yourdomain.com
```

Wait for DNS propagation.

## Nginx Reverse Proxy

Install Nginx:

```bash
sudo apt update
sudo apt install nginx -y
```

Create site config:

```bash
sudo nano /etc/nginx/sites-available/cost-green-server
```

Example config:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    client_max_body_size 20M;

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable it:

```bash
sudo ln -s /etc/nginx/sites-available/cost-green-server /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## SSL With Let's Encrypt

Install Certbot:

```bash
sudo apt install certbot python3-certbot-nginx -y
```

Issue certificate:

```bash
sudo certbot --nginx -d api.yourdomain.com
```

Test renewal:

```bash
sudo certbot renew --dry-run
```

## Deploy Update Flow

When you push backend changes:

```bash
cd /var/www/cost-green/app
git pull
cd server
npm install
npm run db:migrate
pm2 restart cost-green-server
```

## Monitoring Module Endpoints

Once deployed, internal monitoring routes are available through the same backend host:

```text
GET  /internal/monitoring/requests
GET  /internal/monitoring/requests/:id
POST /internal/monitoring/requests/:id/retry
GET  /internal/monitoring/stats
```

These should usually be protected before public exposure.

## Recommended Hardening

- restrict `/internal/monitoring/*` to admin auth or IP allowlist
- use a strong `JWT_SECRET`
- use a managed PostgreSQL backup strategy
- keep `HOST=127.0.0.1` behind Nginx in production
- add firewall rules for ports `80`, `443`, and SSH only

## Quick Production Checklist

- DNS points to VPS
- `.env` exists on server
- PostgreSQL reachable
- `npm run db:migrate` completed
- PM2 process running
- Nginx proxy enabled
- SSL issued
- health check works:

```bash
curl https://api.yourdomain.com/health
```
