#!/bin/sh
set -eu
deploy_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
stack=${UG_STACK:-full}
case "$stack" in
  backend) base=compose.backend.yaml; local=compose.backend.local.yaml; default_env=.env.backend ;;
  full) base=compose.yaml; local=compose.local.yaml; default_env=.env ;;
  *) printf '%s\n' 'UG_STACK must be backend or full.' >&2; exit 1 ;;
esac
env_file=${UG_ENV_FILE:-"$deploy_dir/$default_env"}
if [ ! -f "$env_file" ]; then
  printf '%s\n' 'Missing private environment file. Run scripts/init-env.py first.' >&2
  exit 1
fi
if [ "${UG_LOCAL_TEST:-0}" = 1 ]; then
  exec docker compose --env-file "$env_file" -f "$deploy_dir/$base" -f "$deploy_dir/$local" -f "$deploy_dir/compose.ops.yaml" "$@"
fi
exec docker compose --env-file "$env_file" -f "$deploy_dir/$base" -f "$deploy_dir/compose.ops.yaml" "$@"
