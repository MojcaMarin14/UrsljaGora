#!/bin/sh
set -eu
script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
snapshot=${1:?Supply the snapshot ID or latest}
new_database=${2:?Supply a NEW database name}
# Always create and verify a fresh backup before a recovery drill.
"$script_dir/backup.sh"
"$script_dir/compose.sh" run -T --no-deps --entrypoint /usr/local/bin/restore-job.sh backup "$snapshot" "$new_database"
