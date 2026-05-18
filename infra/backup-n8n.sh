#!/usr/bin/env bash
# n8n_data 볼륨 백업/복원. GSM SV USER 티어 30일 사이클에 대비.
#
# 사용법:
#   ./backup-n8n.sh dump   # 현재 시각 기준 tarball 생성
#   ./backup-n8n.sh restore <tarball>   # 새 VM에서 복원

set -euo pipefail

COMPOSE_PROJECT="$(basename "$(pwd)")"
VOLUME="${COMPOSE_PROJECT}_n8n_data"
ACTION="${1:-}"

case "$ACTION" in
  dump)
    OUT="n8n-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
    docker run --rm \
      -v "${VOLUME}:/data:ro" \
      -v "$(pwd):/backup" \
      alpine tar -czf "/backup/${OUT}" -C /data .
    echo "→ ${OUT}"
    ;;
  restore)
    TARBALL="${2:-}"
    [[ -z "$TARBALL" ]] && { echo "usage: $0 restore <tarball>"; exit 1; }
    [[ ! -f "$TARBALL" ]] && { echo "not found: $TARBALL"; exit 1; }
    docker compose down n8n 2>/dev/null || true
    docker volume create "${VOLUME}" >/dev/null
    docker run --rm \
      -v "${VOLUME}:/data" \
      -v "$(pwd):/backup" \
      alpine sh -c "cd /data && tar -xzf /backup/$(basename "$TARBALL")"
    docker compose up -d n8n
    echo "→ restored from ${TARBALL}. workflow publish 상태는 그대로 살아남."
    ;;
  *)
    echo "usage: $0 {dump|restore <tarball>}"
    exit 1
    ;;
esac
