#!/bin/sh
# Briefly stops CMS writes so database and uploaded files form a consistent pair.
set -eu
script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
compose="$script_dir/compose.sh"
running=$($compose ps --status running -q strapi)
restart_cms() {
  if [ -n "$running" ]; then "$compose" start strapi; fi
}
trap restart_cms EXIT HUP INT TERM
if [ -n "$running" ]; then "$compose" stop strapi; fi
"$compose" run -T --no-deps backup
# Backup snapshots are retained. Pruning is a separate, explicitly invoked operation.
