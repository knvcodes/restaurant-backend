# Docker Commands Reference

## Containers

| Command | Description |
|---------|-------------|
| `docker ps` | List **running** containers |
| `docker ps -a` | List **all** containers (running + stopped) |
| `docker ps -q` | List only container IDs (running) |
| `docker ps -aq` | List only container IDs (all) |
| `docker ps -s` | Show container size |
| `docker inspect <container>` | Detailed info about a container |
| `docker logs <container>` | View container logs |
| `docker stats` | Live CPU/memory usage of running containers |

---

## Images

| Command | Description |
|---------|-------------|
| `docker images` | List all images |
| `docker images -q` | List only image IDs |
| `docker images -a` | List all images (including intermediates) |
| `docker image ls` | Same as `docker images` |
| `docker image history <image>` | Show image layers |
| `docker inspect <image>` | Detailed info about an image |
| `docker image prune` | Remove dangling (untagged) images |

---

## Build Cache

| Command | Description |
|---------|-------------|
| `docker builder du` | Show build cache disk usage |
| `docker builder prune` | Remove unused build cache |
| `docker builder prune -a` | Remove all build cache |
| `docker system df` | Overall disk usage (images, containers, volumes, cache) |

---

## Volumes

| Command | Description |
|---------|-------------|
| `docker volume ls` | List all volumes |
| `docker volume ls -q` | List only volume names |
| `docker volume inspect <volume>` | Detailed info about a volume |
| `docker volume prune` | Remove unused volumes |
| `docker volume rm <volume>` | Delete a specific volume |

---

## Networks

| Command | Description |
|---------|-------------|
| `docker network ls` | List all networks |
| `docker network inspect <network>` | Detailed info about a network |
| `docker network prune` | Remove unused networks |

---

## System-Wide

| Command | Description |
|---------|-------------|
| `docker system df` | Disk usage summary |
| `docker system df -v` | Verbose disk usage (per item) |
| `docker system info` | Docker system info |
| `docker system events` | Real-time system events |
| `docker system prune` | Remove unused containers, networks, images, cache |
| `docker system prune -a --volumes` | Nuke everything unused |

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

## Your Current Setup

Based on your earlier output, you currently have:
- **1 running container**: `minio` (MinIO)
- **1 running container**: `postgres_db_16` (PostgreSQL)
- **2 images**: `quay.io/minio/minio` and `postgres:16`

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

### Nuclear Option (Clears Everything)
```bash
# Removes everything: containers, images, volumes, networks, build cache
docker system prune -a --volumes -f
```

> **Warning:** This will also delete your PostgreSQL container and all its data volumes.

---

*Generated on 2026-05-04*
