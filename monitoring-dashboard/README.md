# Cost Green Monitoring Dashboard

React dashboard for the internal Fastify monitoring APIs.

This README covers:
- local run
- production build
- Nginx static hosting
- Namecheap DNS
- optional subdomain setup

## Local Development

Install dependencies:

```bash
cd /Users/jervi/Desktop/cost-green/monitoring-dashboard
npm install
```

Run locally against the backend:

```bash
VITE_MONITORING_API_URL=http://192.168.1.109:4000 npm run dev
```

Default Vite URL:

```text
http://localhost:5174
```

## Production Build

Build the static files:

```bash
cd /var/www/cost-green/app/monitoring-dashboard
npm install
VITE_MONITORING_API_URL=https://api.yourdomain.com npm run build
```

This creates:

```text
monitoring-dashboard/dist
```

## Namecheap DNS

Create an `A` record in Namecheap:

- Host: `monitoring`
- Value: your VPS public IP

Example dashboard domain:

```text
monitoring.yourdomain.com
```

## Nginx Static Hosting

Create Nginx config:

```bash
sudo nano /etc/nginx/sites-available/cost-green-monitoring
```

Example:

```nginx
server {
    listen 80;
    server_name monitoring.yourdomain.com;

    root /var/www/cost-green/app/monitoring-dashboard/dist;
    index index.html;

    location / {
        try_files $uri /index.html;
    }
}
```

Enable it:

```bash
sudo ln -s /etc/nginx/sites-available/cost-green-monitoring /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## SSL

Issue certificate with Certbot:

```bash
sudo certbot --nginx -d monitoring.yourdomain.com
```

## Deploy Update Flow

When the dashboard changes:

```bash
cd /var/www/cost-green/app
git pull
cd monitoring-dashboard
npm install
VITE_MONITORING_API_URL=https://api.yourdomain.com npm run build
sudo systemctl reload nginx
```

## API Dependency

This frontend depends on the backend monitoring endpoints:

```text
GET  /internal/monitoring/requests
GET  /internal/monitoring/requests/:id
POST /internal/monitoring/requests/:id/retry
GET  /internal/monitoring/stats
```

If the dashboard loads but no data appears:

- verify `VITE_MONITORING_API_URL`
- verify backend CORS config
- verify backend monitoring plugin is enabled
- verify monitoring routes are accessible from the browser

## Recommended Protection

Because this dashboard exposes internal request data, do not leave it publicly open without protection.

Recommended options:

- Nginx basic auth
- VPN-only access
- backend admin auth on `/internal/monitoring/*`
- IP allowlist

Example basic auth:

```bash
sudo apt install apache2-utils -y
sudo htpasswd -c /etc/nginx/.htpasswd admin
```

Then inside the Nginx server block:

```nginx
auth_basic "Restricted";
auth_basic_user_file /etc/nginx/.htpasswd;
```

## Quick Checklist

- DNS points to VPS
- backend API is already live
- dashboard built with correct `VITE_MONITORING_API_URL`
- Nginx serves `dist/`
- SSL enabled
- access is protected
