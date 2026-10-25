#!/bin/sh
set -eu
umask 077
: "${RESTIC_REPOSITORY:?}"
: "${RESTIC_PASSWORD:?}"
stamp=$(date -u +%Y%m%dT%H%M%SZ)
mkdir -p "/stage/$stamp"
pg_dump --format=custom --no-owner --file="/stage/$stamp/database.dump"
pg_restore --list "/stage/$stamp/database.dump" > "/stage/$stamp/database-contents.txt"
sha256sum "/stage/$stamp/database.dump" > "/stage/$stamp/database.dump.sha256"
# Repository creation is a separate explicit operation. Authentication or network
# errors must fail the job, never silently initialize an unintended repository.
restic snapshots > /dev/null
restic backup "/stage/$stamp" /uploads /public-assets /configuration /project-source \
  --host "${RESTIC_HOST:-urslja-gora}" --tag urslja-gora \
  --exclude '/configuration/*.log' --exclude '/configuration/.local-admin.json' \
  --exclude '/configuration/migration-backups' --exclude '**/node_modules' \
  --exclude '**/.next' --exclude '**/.git' --exclude '/project-source/.local-test' \
  --exclude '/project-source/deploy' --exclude '/project-source/public' \
  --exclude '/project-source/cms/*/dist' --exclude '/project-source/cms/*/build' \
  --exclude '/project-source/cms/*/.tmp' --exclude '/project-source/cms/*/.strapi'
restic check --read-data-subset=5%
printf '%s\n' 'Encrypted database, uploads, public assets, application source and deployment configuration backup verified.'
