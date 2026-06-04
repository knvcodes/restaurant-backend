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
