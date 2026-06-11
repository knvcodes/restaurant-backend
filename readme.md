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

### clear all collections

- npm run cleardb
