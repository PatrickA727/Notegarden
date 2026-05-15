#!/bin/sh
# Tasks run on a cron schedule inside the `cron` compose service.
# Invoked as: cron-tasks.sh <task-name>
# Postgres connection comes from PG* env vars set on the container.

set -eu

LOG() {
	echo "[$(date -Iseconds)] cron-tasks: $*"
}

case "${1:-}" in
	gc-sync-request)
		LOG "deleting sync_request rows older than 24h"
		psql -v ON_ERROR_STOP=1 -c \
			"DELETE FROM sync_request WHERE processed_at < NOW() - INTERVAL '24 hours';"
		LOG "gc done"
		;;
	backup-db)
		RETENTION="${BACKUP_RETENTION_DAYS:-7}"
		BACKUP_FILE="/backups/db-$(date +%F).sql.gz"
		LOG "dumping to $BACKUP_FILE"
		pg_dump --no-owner --no-privileges | gzip > "$BACKUP_FILE"
		LOG "rotating, keeping last $RETENTION days"
		find /backups -name 'db-*.sql.gz' -type f -mtime "+$RETENTION" -delete
		LOG "backup done"
		;;
	*)
		echo "Usage: $0 {gc-sync-request|backup-db}" >&2
		exit 1
		;;
esac
