| Command                  | What it does                       |
| ------------------------ | ---------------------------------- |
| `npm run docker:dev`     | Start all services with hot reload |
| `npm run db:sync:docker` | Run database migrations            |
| `npm run seed:docker`    | Seed restaurants data              |
| `npm run docker:logs`    | View backend logs                  |
| `npm run docker:clean`   | Rebuild backend image              |
| `npm run docker:npm:i`   | Install packages inside container  |

### troubleshooting

| Error               | Fix                                                   |
| ------------------- | ----------------------------------------------------- |
| `Port 27017 in use` | `sudo systemctl stop mongod`                          |
| `tsx: not found`    | `docker compose exec backend npm install -D tsx`      |
| `mongo: ENOTFOUND`  | Wait for `docker compose ps` to show mongo as healthy |

### seeding issue

run npm run docker:clean then retry

# .env changed

npm run docker:restart

### Running locally no docker

- change env
- start mongo service if not
- start minio service
- docker compose down
- npm run dev

### mongo service

- sudo systemctl start mongod
- sudo systemctl stop mongod

### minio service

docker run -p 9000:9000 -p 9001:9001 \
 --name minio \
 -v ~/minio-data:/data \
 -e "MINIO_ROOT_USER=admin" \
 -e "MINIO_ROOT_PASSWORD=password123" \
 quay.io/minio/minio server /data --console-address ":9001"

### mailpit service

docker run -d \
 --name=mailpit \
 --restart unless-stopped \
 -p 8025:8025 \
 -p 1025:1025 \
 axllent/mailpit

Default endpoints:

- Web UI: http://localhost:8025
- SMTP: localhost:1025

### redis docker service

- docker run -d --name redis -p 6379:6379 redis:latest
- docker run -p 5540:5540 redis/redisinsight:latest
- Then access at http://localhost:5540.

### clear all collections

- npm run cleardb

## Test Credentials

### Admin

| Field    | Value                  |
| -------- | ---------------------- |
| Email    | `admin@restaurant.com` |
| Password | `Admin@123`            |

### Owners

| #   | Name          | Email                          | Password    |
| --- | ------------- | ------------------------------ | ----------- |
| 1   | John Smith    | `john.smith@restaurant.com`    | `Owner@123` |
| 2   | Sarah Johnson | `sarah.johnson@restaurant.com` | `Owner@123` |

### Customers

| #   | Name         | Email             | Password       |
| --- | ------------ | ----------------- | -------------- |
| 1   | Alice Cooper | `alice@email.com` | `Customer@123` |
| 2   | Bob Martin   | `bob@email.com`   | `Customer@123` |

---

## Checking logs and reading

- Install jq if in linux
- Run this from logs directory: cat error.log | jq '.'
