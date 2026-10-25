#!/bin/sh
# Primary handover: keep Vercel, operate only the CMS/database/proxy/backup services.
set -eu
script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
export UG_STACK=backend
export UG_ENV_FILE=${UG_ENV_FILE:-"$script_dir/../.env.backend"}
case "${1:-}" in
  init-backup) shift; exec "$script_dir/compose.sh" run -T --no-deps --entrypoint restic backup init "$@" ;;
  check-backup) shift; exec "$script_dir/compose.sh" run -T --no-deps --entrypoint restic backup check --read-data "$@" ;;
  backup) shift; exec "$script_dir/backup.sh" "$@" ;;
  restore-to-new-db) shift; exec "$script_dir/restore-to-new-db.sh" "$@" ;;
  import) shift; exec python3 "$script_dir/import-into-empty-db.py" "$@" ;;
  *) exec "$script_dir/compose.sh" "$@" ;;
esac
