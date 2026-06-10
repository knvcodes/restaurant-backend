# Docker Commands Reference

## Containers

| Command                      | Description                                 |
| ---------------------------- | ------------------------------------------- |
| `docker ps`                  | List **running** containers                 |
| `docker ps -a`               | List **all** containers (running + stopped) |
| `docker inspect <container>` | Detailed info about a container             |
| `docker logs <container>`    | View container logs                         |

---

## Images

| Command                  | Description                               |
| ------------------------ | ----------------------------------------- |
| `docker images`          | List all images                           |
| `docker images -a`       | List all images (including intermediates) |
| `docker inspect <image>` | Detailed info about an image              |
| `docker image prune`     | Remove dangling (untagged) images         |

---

## Build Cache

| Command                   | Description               |
| ------------------------- | ------------------------- |
| `docker builder prune`    | Remove unused build cache |
| `docker builder prune -a` | Remove all build cache    |

---

## Volumes

| Command                     | Description              |
| --------------------------- | ------------------------ |
| `docker volume ls`          | List all volumes         |
| `docker volume prune`       | Remove unused volumes    |
| `docker volume rm <volume>` | Delete a specific volume |

---

## System-Wide

| Command                            | Description                                       |
| ---------------------------------- | ------------------------------------------------- |
| `docker system prune`              | Remove unused containers, networks, images, cache |
| `docker system prune -a --volumes` | Nuke everything unused                            |

---

## Quick Reference Cheat Sheet

```bash
# Check everything at a glance
docker ps -a          # containers
docker images -a      # images
docker volume ls      # volumes
docker network ls     # networks
docker builder du     # build cache
docker system df      # total disk usage
```

---

## MinIO Cleanup Commands

### Stop & Remove MinIO Only

```bash
# Stop and remove the MinIO container
docker rm -f minio

# Remove the MinIO image
docker rmi quay.io/minio/minio

# Remove dangling images, unused volumes, and build cache
docker image prune -f
docker volume prune -f
docker builder prune -f
```

### One-Liner (MinIO Only)

```bash
docker rm -f minio && docker rmi quay.io/minio/minio && docker image prune -f && docker volume prune -f && docker builder prune -f
```
