# GET — Production Deployment Guide

This guide covers deploying the GET application to production using Docker Compose (single-server) or Kubernetes (multi-node).

---

## 1. Prerequisites

### Server Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 2 vCPU | 4 vCPU |
| RAM | 4 GB | 8 GB |
| Disk | 40 GB SSD | 100 GB SSD |

```bash
# Ubuntu quick-start
sudo apt-get update
sudo apt-get install -y docker.io docker-compose-plugin git openssl
sudo systemctl enable --now docker
```

---

## 2. Docker Production Setup

```bash
git clone https://github.com/yourorg/get-app.git /opt/get
cd /opt/get
./scripts/build-images.sh
docker compose -f docker-compose.prod.yml up -d
```

---

## 3. Environment Variables

```dotenv
POSTGRES_USER=get_prod
POSTGRES_PASSWORD=<strong-random-password>
POSTGRES_DB=get_production
SECRET_KEY=<64-char-random-string>
REDIS_PASSWORD=<strong-random-password>
```

Generate secrets: `openssl rand -hex 32`

---

## 4. Database Migrations

```bash
# Run migrations
docker compose -f docker-compose.prod.yml run --rm backend alembic upgrade head

# Rollback
docker compose -f docker-compose.prod.yml run --rm backend alembic downgrade -1
```

---

## 5. Kubernetes Deployment

```bash
kubectl create namespace get-production
kubectl create secret generic get-env --namespace=get-production --from-env-file=.env
kubectl apply -f k8s/
kubectl rollout status deployment/get-backend -n get-production
```

---

## 6. SSL/TLS with nginx

```bash
sudo certbot certonly --standalone -d api.getapp.example.com
```

---

## 7. Monitoring

Prometheus scrapes `/metrics` every 15s. Key Grafana dashboards: Application Overview, Database Health, Inventory Metrics.

---

## 8. PostgreSQL Backup

```bash
# Daily backup script (cron at 02:00)
docker compose exec -T db pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" \
  | gzip > backups/get_db_$(date +%Y-%m-%d).sql.gz
aws s3 cp backups/*.sql.gz s3://get-production-backups/postgres/
```

---

## 9. Scaling

```bash
# Docker Compose
docker compose -f docker-compose.prod.yml up -d --scale backend=4

# Kubernetes
kubectl scale deployment get-backend -n get-production --replicas=6
```

For HPA:
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: get-backend-hpa
  namespace: get-production
spec:
  minReplicas: 2
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 60
```