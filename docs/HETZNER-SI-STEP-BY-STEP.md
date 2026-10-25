# Hetzner + .si: exact future setup steps

Prepared 15 October 2026. **These are instructions, not actions already performed.** Read PRODUCTION-READINESS-CHECKLIST.md first. Keep the existing frontend on Vercel. Public exposure, production imports, DNS and Vercel changes still need approval. No accounts or resources were purchased by this preparation.

## 1. Choose who owns the accounts

Prefer the eventual private owner's own Hetzner, domain-registrar and backup-storage accounts, with their billing details and recovery email. Enable two-factor authentication and let the maintainer use a named account/project membership; do not share the owner's main password. If transferring later, use the provider's resource-transfer procedure and move the domain registrant through its registrar. A .si registrant transfer requires confirmation from both parties. [Hetzner transfers](https://docs.hetzner.com/general/billing-and-account-management/product-migration/), [Register.si transfers](https://www.register.si/en/).

Decide the actual domain before building the production admin panel. `YOUR-DOMAIN.si`, `SERVER_IPV4` and `YOUR_PUBLIC_IP` below are placeholders to replace. Domain availability is not checked or reserved.

## 2. Buy the .si domain, retaining Vercel

Choose a registrar from the [official .si registrar list](https://www.register.si/en/registrars/). Check registration **and renewal** price, DNS management and two-factor authentication. Register in the intended owner's name and enable renewal reminders. Use its existing DNS service; no separate paid DNS product is necessary.

For the backend you only need `cms.YOUR-DOMAIN.si`. Leave existing website/apex/www and email DNS records unchanged. The current `urslja-gora.vercel.app` address continues to work. Adding the new .si apex/www to Vercel is optional and is a separate approved change: add it in the Vercel project first and copy the exact DNS values Vercel supplies; do not guess a Vercel IP address or point the website apex at Hetzner.

## 3. Buy one Cloud VPS with an SSH-only firewall

In [Hetzner Console](https://console.hetzner.com/), create a dedicated project, then **Servers → Add server**. Select an EU location, **Ubuntu 24.04 LTS**, a shared-vCPU plan with **4 vCPU, 8 GB RAM and at least 80 GB disk**, and public IPv4. ARM64 is directly tested locally; x86_64 needs a native rebuild and smoke test. Choose the lowest-priced currently available plan meeting those resources; verify its checkout total including VAT, IPv4 and optional provider backups. Current prices/availability are not guaranteed by this document. No additional block volume, load balancer or managed database is needed. [Official server creation](https://docs.hetzner.com/cloud/servers/getting-started/creating-a-server/).

Create a **new named SSH key** on your Mac if you do not already have a suitable one:

```sh
ssh-keygen -t ed25519 -f ~/.ssh/urslja_gora_hetzner -C urslja-gora-maintainer
```

Choose a passphrase. Do not overwrite an existing key. Upload **only** `~/.ssh/urslja_gora_hetzner.pub` in the server wizard. Keep the private key on your Mac.

Attach a Hetzner Cloud firewall with inbound **TCP 22 from YOUR_PUBLIC_IP/32 only**, and your trusted IPv6 /128 if used. Initially allow **no 80/443/1337/5432/2375/2376** inbound. Outbound can remain default allowed. Apply it to the new server. Keep public ports closed during private setup. [Firewall creation](https://docs.hetzner.com/cloud/firewalls/getting-started/creating-a-firewall/).

After reviewing the price, the owner can click the purchase button. Record the IPv4 address and provider-console recovery access.

## 4. Initialize the server privately

Connect from the Mac:

```sh
ssh -i ~/.ssh/urslja_gora_hetzner root@SERVER_IPV4
```

Verify the server fingerprint against the provider console before accepting it. Update the new server:

```sh
apt-get update
apt-get upgrade
apt-get install -y ca-certificates curl python3 unattended-upgrades
```

Reboot if the system requests it, then reconnect. Install Docker from the official apt repository:

```sh
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
cat > /etc/apt/sources.list.d/docker.sources <<EOF_DOCKER
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: noble
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF_DOCKER
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
systemctl enable --now docker
docker compose version
```

Use Compose >=2.24.4. This sequence is for the specifically selected Ubuntu 24.04. For a different OS, use [Docker's current instructions](https://docs.docker.com/engine/install/ubuntu/). Docker-published ports can bypass UFW; the Hetzner firewall and Compose private ports are the relevant boundary. Restrict SSH to keys after verifying a second login works and keeping console recovery available. Do not expose the Docker socket/API.

## 5. Copy a clean release; generate new secrets

On the new server:

```sh
install -d -m 700 /opt/urslja-gora /opt/urslja-gora-migration
```

From the Mac, copy the **prepared** source, never the iCloud original. Keep a private release directory and exclude local credentials/test state:

```sh
rsync -av -e 'ssh -i ~/.ssh/urslja_gora_hetzner' \
  --exclude='node_modules/' --exclude='.next/' --exclude='.git/' \
  --exclude='.local-test/' --include='.env.backend.example' \
  --exclude='.env' --exclude='.env.*' \
  --exclude='.tmp/' --exclude='dist/' --exclude='build/' --exclude='.strapi/' \
  --exclude='migration-backups/' --exclude='public/uploads/' \
  /Users/mojcamarin/Developer/urslja-gora-selfhost-20261011/project/ \
  root@SERVER_IPV4:/opt/urslja-gora/
```

The backend Dockerfile excludes local databases, environment files and media; the guarded importer restores original uploads into their persistent volume later. Frontend public assets remain in the private source/backup mount. Inspect the copy privately and verify source hashes before proceeding; do not use `--delete`.

On the server:

```sh
cd /opt/urslja-gora
python3 deploy/scripts/init-env.py --backend \
  --cms-domain cms.YOUR-DOMAIN.si \
  --frontend-url https://urslja-gora.vercel.app
```

The real hostname must be lowercase. This creates `deploy/.env.backend` exclusively with mode 600 and separate app/database-administration secrets. Use a private editor to set `ACME_EMAIL` and the real off-server repository details from step 6. Do not print this file, paste it into chat, commit it, copy old test secrets or run Compose `config` without `--quiet` in shared logs. Keep the generated secrets and recovery password in the owner's password manager. Strapi never receives the database-administration password.

## 6. Configure off-server encrypted backups

Create a **private Hetzner Object Storage bucket** in a different location from the VPS, e.g. Helsinki for a German VPS. Choose a dedicated backup project/credentials where practical. Do not enable public bucket access or a lifecycle rule that deletes active restic objects. Enable bucket versioning using the provider's supported S3 tooling if desired; test retention/versioning behaviour before relying on it. Provider server snapshots are supplementary and do not replace this application-consistent backup.

Privately set these entries in `deploy/.env.backend`:

```dotenv
RESTIC_REPOSITORY=s3:https://hel1.your-objectstorage.com/YOUR-PRIVATE-BUCKET/urslja-gora
AWS_DEFAULT_REGION=hel1
AWS_ACCESS_KEY_ID=YOUR-PRIVATE-ACCESS-KEY
AWS_SECRET_ACCESS_KEY=YOUR-PRIVATE-SECRET-KEY
```

Keep the already generated `RESTIC_PASSWORD`; store an independent copy **outside this VPS and outside the bucket**. Without it, encrypted backups cannot be recovered. The scripts do not automatically initialize or prune repositories. [Hetzner restic setup](https://docs.hetzner.com/storage/object-storage/howto-backups/restic/), [bucket creation](https://docs.hetzner.com/storage/object-storage/getting-started/creating-a-bucket/).

Check and build while the Cloud firewall remains SSH-only:

```sh
python3 deploy/scripts/preflight-backend.py
deploy/scripts/backend.sh config --quiet
deploy/scripts/backend.sh build strapi backup
deploy/scripts/backend.sh up -d --wait postgres
deploy/scripts/backend.sh run -T --no-deps --entrypoint node strapi -e "require('@strapi/strapi').createStrapi({distDir:'/app/dist'}).load().then(app=>app.destroy()).catch(()=>{process.exitCode=1})"
deploy/scripts/backend.sh init-backup
```

`load()` creates the schema in this **new empty** database and exits; it does not expose the web server. Record the exact release image IDs, scan them (OS and npm dependencies), and resolve or formally accept the remaining issues listed in SECURITY-DEPENDENCY-REVIEW.md. Do not open public ports until the checklist gates are satisfied.

## 7. Import preserved content only after approval

Copy the clean baseline archive separately from Mac backups:

```sh
scp -i ~/.ssh/urslja_gora_hetzner \
  /Users/mojcamarin/Developer/urslja-gora-selfhost-20261011/backups/strapi-5.57-content-baseline.tar.gz \
  root@SERVER_IPV4:/opt/urslja-gora-migration/
```

On the server, with Strapi stopped:

```sh
chmod 600 /opt/urslja-gora-migration/strapi-5.57-content-baseline.tar.gz
cd /opt/urslja-gora
deploy/scripts/backend.sh import /opt/urslja-gora-migration/strapi-5.57-content-baseline.tar.gz \
  --sha256 79c6642bd1d941c57c99747f53aa23f7f014a41d87b09952e2f1595585cf47fe
deploy/scripts/backend.sh backup
deploy/scripts/backend.sh check-backup
deploy/scripts/backend.sh restore-to-new-db latest strapi_recovery_acceptance_20261015
```

Use a **new unique** recovery database name for each drill. The importer verifies source and empty-target backups before import, rejects populated targets, and copies files without replacement. If it fails midway, stop and inspect privately; do not bypass the empty-target guard or delete volumes to retry. Keep original local archives unchanged.

The baseline is verified local content, not a confirmed Cloud clone. Resolve the Cloud content decision in CLOUD-CONTENT-GAP.md first. Do not deploy any `*_test` database or export made from the security test; those contain fixtures. Inspect the recovery database and separate restored uploads before proceeding. Full recovery/promotion instructions: OFFSERVER-BACKUP-RESTORE.md.

## 8. Approved public backend exposure and first administrator

Only after checklist sign-off: create DNS **A `cms` → SERVER_IPV4**, TTL 300 during the transition. Add AAAA only if IPv6 routing and firewall are verified. Keep all other website/email records. Verify `dig +short cms.YOUR-DOMAIN.si A` and AAAA from outside the server.

Avoid a publicly claimable first-admin window: create the first owner account while the Cloud firewall remains SSH-only and the normal CMS is stopped. Run this over your SSH session from the project directory:

```sh
cd /opt/urslja-gora
python3 deploy/scripts/admin-credentials.py | \
  deploy/scripts/backend.sh run -T --no-deps --entrypoint node strapi \
  scripts/create-first-admin.cjs
```

Enter the owner's email, name and a unique password (16+ characters) at the private prompts. The password is hidden, passed over stdin, and never placed in command-line arguments or a temporary credentials file. The helper refuses any database that already has an administrator. Do not reset an existing account by bypassing this guard. Record the new login privately in the owner's password manager. Back up again after this step so administrator access is included in PostgreSQL recovery; the clean content export itself contains no administrators.

Finally allow inbound TCP **80 and 443 from all**, and optional UDP 443 for HTTP/3. Keep 22 restricted and all other ports closed. Start the normal stack:

```sh
deploy/scripts/backend.sh up -d --wait strapi caddy
deploy/scripts/backend.sh ps
curl --fail https://cms.YOUR-DOMAIN.si/api/novicas
```

Caddy obtains/renews the CMS certificate and redirects HTTP to HTTPS when DNS, ports and persistent `/data` are correct. [HTTPS requirements](https://caddyserver.com/docs/automatic-https). Verify the real certificate, original images, registration rejection, moderation and CORS. Public certificate issuance and this first-admin procedure are future server acceptance steps; no public exposure was performed locally.

## 9. Connect the same Vercel project after separate approval

Inspect its actual deployed Git branch/commit first. Set `NEXT_PUBLIC_STRAPI_URL=https://cms.YOUR-DOMAIN.si` in that project's production environment and append that exact HTTPS hostname and `/uploads/**` to its existing Next `images.remotePatterns`. Leave `STRAPI_INTERNAL_URL` unset on Vercel. Keep the existing website URL, SMTP, Turnstile and analytics settings. Rebuild/redeploy that same project only when approved. Do not replace it with the optional standalone Hetzner frontend. See VERCEL-STRAPI-CONNECTION.md and VERCEL-CONTENT-CHECKLIST.md for exact settings and all-content verification.

## 10. Enable maintenance and hand over

After the real off-server restore passes:

```sh
install -m 644 deploy/systemd/urslja-gora-backend-backup.service /etc/systemd/system/
install -m 644 deploy/systemd/urslja-gora-backend-backup.timer /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now urslja-gora-backend-backup.timer
systemctl start urslja-gora-backend-backup.service
systemctl status urslja-gora-backend-backup.timer
journalctl -u urslja-gora-backend-backup.service --since today
```

Name a maintainer to check every failed/missing backup, disk space, updates and uptime. Configure their monitoring/alert destination before launch; no message or alert integration has been installed by this preparation. Run a complete read check monthly and a new-database restore at least quarterly and before major upgrades. No automatic pruning is configured; review storage growth and agree retention before any deletion command.

Give the owner the account inventory, renewal dates, private secret vault/recovery password, clean source/lockfiles, verified backup locations, CMS address, named editor account and NAVODILA-LASTNIK.md. Confirm the owner can sign in, edit a draft and approve a test submission. Keep technical maintenance separate from everyday editing. A later move of Next.js to Hetzner needs its own plan; keep the same backend volumes and do not launch a competing full stack with a fresh database.
