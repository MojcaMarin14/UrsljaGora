#!/bin/sh
# Runs ONLY when PostgreSQL initializes a new, empty data volume.
set -eu
: "${DATABASE_USERNAME:?}" "${DATABASE_PASSWORD:?}"
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" \
  --set=app_user="$DATABASE_USERNAME" --set=app_password="$DATABASE_PASSWORD" --set=app_db="$POSTGRES_DB" <<'SQL'
CREATE ROLE :"app_user" LOGIN PASSWORD :'app_password' NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION;
ALTER DATABASE :"app_db" OWNER TO :"app_user";
GRANT USAGE, CREATE ON SCHEMA public TO :"app_user";
SQL
