START
docker compose up --watch

STOP (keep data)
docker compose down

STOP (delete everything)
docker compose down -v

LOGS
docker compose logs -f [service]

SHELL
docker compose exec [service] sh

RESTART ONE SERVICE
docker compose restart [service]

REBUILD AFTER package.json CHANGE
docker compose build [service]
docker compose up [service] --watch
