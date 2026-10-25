#!/bin/sh
# Restores ONLY to a new database, and preserves uploads in a separate recovery folder.
set -eu
umask 077
snapshot=${1:?Supply the snapshot ID or latest}
new_database=${2:?Supply a NEW database name}
case "$new_database" in
  ''|*[!a-z0-9_]*) printf '%s\n' 'Use a lowercase database name containing only letters, digits and underscores.' >&2; exit 1 ;;
esac
if [ ${#new_database} -gt 63 ]; then
  printf '%s\n' 'Database name must be no longer than 63 characters.' >&2
  exit 1
fi
if [ "$new_database" = "$PGDATABASE" ]; then
  printf '%s\n' 'Refusing to restore over the running website database.' >&2
  exit 1
fi
exists=$(psql -d postgres -Atc "SELECT 1 FROM pg_database WHERE datname = '$new_database'")
if [ -n "$exists" ]; then
  printf '%s\n' 'Target database already exists; refusing to overwrite anything.' >&2
  exit 1
fi
stamp=$(date -u +%Y%m%dT%H%M%SZ)
target="/restore/$stamp"
mkdir -p "$target"
restic check
restic restore "$snapshot" --target "$target" --verify
dump=$(find "$target/stage" -name database.dump -type f)
count=$(printf '%s\n' "$dump" | wc -l | tr -d ' ')
if [ "$count" != 1 ] || [ ! -f "$dump" ]; then
  printf '%s\n' 'Expected exactly one database dump in the snapshot.' >&2
  exit 1
fi
expected=$(cut -d ' ' -f 1 "$dump.sha256")
actual=$(sha256sum "$dump" | cut -d ' ' -f 1)
if [ "$expected" != "$actual" ]; then
  printf '%s\n' 'Database dump hash verification failed.' >&2
  exit 1
fi
createdb --owner="${APP_DATABASE_USER:-$PGUSER}" "$new_database"
pg_restore --exit-on-error --no-owner --role="${APP_DATABASE_USER:-$PGUSER}" --dbname="$new_database" "$dump"
printf 'Verified recovery database: %s\nRecovered files: %s\n' "$new_database" "$target"
