# Encrypted off-server backup and recovery

15 October 2026. The S3 path has been integration-tested locally against a Docker-private Moto emulator. **No real off-server account or network delivery has been tested.** A real private bucket, credentials, HTTPS and an independent password copy remain launch prerequisites. Local encrypted repositories and the original archives remain preserved separately.

## What is saved

`backend.sh backup` pauses only the CMS, takes a PostgreSQL custom dump, validates its restore catalog and SHA256, and encrypts it with uploads, source, frontend public assets and deployment configuration using restic. It then checks repository structure and reads a 5% sample of data packs. A trap restarts the previously running CMS on success or failure. All generated dependencies/build caches, `.local-test`, Git checkout caches and migration staging folders are excluded from ongoing restic snapshots; the **original verified project archive already preserves Git history**. Keep that original archive in an independent encrypted/offline owner-controlled archive as well; it is not automatically uploaded by the ongoing source-only snapshots. If archiving it to S3 once, use a separate restic repository prefix so the application restore helper cannot confuse a source-only archival snapshot with its database snapshots. Private environment configuration is intentionally included only inside the encrypted snapshot.

PostgreSQL admin credentials are confined to the database/ops container, while Strapi uses a separate database-owner account without superuser, role-creation or database-creation privileges. The admin role permits new-database recovery. Restore creates objects as the application role. No production DB or uploads are overwritten by the restore helper.

## Initial production setup

Follow HETZNER-SI-STEP-BY-STEP.md for the bucket and private `deploy/.env.backend` settings. Use S3 over HTTPS in a different location, a private bucket, owner-controlled access and a unique restic password kept outside the VPS. Keep the bucket credentials and password in an independent password-manager recovery kit. Repository encryption does not prevent deletion by someone who steals write/delete credentials; agree bucket versioning and an occasional independently held encrypted copy. Do not add automatic object-expiry rules to a live restic repository.

Initialize explicitly once; an authentication/network error must fail backup rather than initialize a different repository:

```sh
cd /opt/urslja-gora
python3 deploy/scripts/preflight-backend.py
deploy/scripts/backend.sh init-backup
deploy/scripts/backend.sh backup
deploy/scripts/backend.sh check-backup
```

`check-backup` reads **all** encrypted data packs. Run it monthly and after storage changes. Normal nightly backups read a 5% sample. No repository pruning or snapshot deletion is scheduled; agree retention with the owner before any later deletion operation. Monitor repository growth, server disk space and the 256 MB dump staging limit; increase the tmpfs limit deliberately if the database grows beyond it.

The supplied systemd timer runs at 02:30 Europe/Ljubljana. Install it only after a successful real off-server restore test, and configure the maintainer's failure/missed-run alerts. No external notification has been sent or configured locally. Provider disk snapshots are supplemental and can be crash-consistent; they do not replace this paired database/media backup.

## Non-destructive restore drill

Always use a **new, unique lowercase** recovery database name and a specific snapshot ID where practical:

```sh
deploy/scripts/backend.sh restore-to-new-db latest strapi_recovery_20261015_a
```

The wrapper first creates/verifies a fresh backup. The job refuses the live database, any existing destination and unsafe names, verifies the encrypted repository, restores files to a separate timestamped `/restore/...` directory with restic's `--verify`, checks the dump SHA256, then creates a new PostgreSQL database owned by the application role. It does not change `DATABASE_NAME`, switch the site or replace the uploads volume.

List snapshots or inspect recovered files without displaying environment secrets:

```sh
deploy/scripts/backend.sh run -T --no-deps --entrypoint restic backup snapshots
deploy/scripts/backend.sh run -T --no-deps --entrypoint sh backup \
  -c 'find /restore -maxdepth 3 -type d'
```

Compare every table/row and every media SHA256 against the chosen snapshot's source, not merely record counts. Check that restored source/configuration exists and keep its private environment file out of shared logs. Run a recovery CMS against the **new database and a separate uploads volume**, using an internal-only service or loopback SSH tunnel; never attach recovered pending uploads to the live service automatically. Confirm API reads, administrator login and moderation before declaring recovery valid.

## Recovering on a replacement VPS

1. Provision a new SSH-only VPS and install Docker/Compose. Keep the old VPS/database/volumes unchanged.
2. Recover the restic password and S3 credentials from the owner's independent vault. Obtain the trusted prepared source or a separately held source archive; reconstruct the same Strapi version/schema before loading recovered content.
3. Generate a **new** private backend environment and admin database password; retain its current production database/app settings until the restore is inspected. Set the existing off-server repository/password but **do not initialize a new repository**.
4. Build the ops image and start only the new PostgreSQL service. Use `backend.sh run -T --no-deps --entrypoint /usr/local/bin/restore-job.sh backup SNAPSHOT_ID NEW_RECOVERY_DB` on this empty replacement host. This directly uses the guarded restore job; the normal wrapper's mandatory pre-restore backup cannot represent the unavailable old host and must not be mistaken for it.
5. Preserve the verified restored `/project-source`, `/public-assets`, `/configuration`, `/uploads` and `/stage/.../database.dump` separately. The old Strapi application keys/JWT/encryption secrets in encrypted configuration may be needed to read encrypted settings. Restore them privately after review; keep the replacement's new PostgreSQL admin credentials separate. Do not reuse old Docker test settings.
6. Create a **new empty uploads volume**, copy the recovered files into it without replacement, and compare all hashes. Use a private Compose override for the recovery database and this new volume; validate the actual mounts and app-role privileges. These promotion steps are deliberately manual and require approval: the supplied restore job never points the live service at recovered data.
7. Test administrator login, every content type, images, registration rejection and moderation privately. Take a fresh verified backup of this replacement recovery state, record a rollback plan, then obtain approval for DNS/public cutover. Change no Vercel settings if the public CMS hostname remains the same.

The first-owner helper is only for **empty administrator tables**. PostgreSQL recovery already restores administrators; never overwrite them or create a new unprotected first-account window. Keep existing password-manager credentials. Configure CMS SMTP separately if the owner needs email password resets; the Vercel contact-form mail settings are not automatically a CMS email provider.

## Local evidence and limitations

- Encrypted S3 initialization, snapshot creation, 100% data-pack read check and verified file restore passed.
- A separate recovery database matched every row in all **62 tables**, and **25 media binaries** matched (23 originals plus two local security-fixture variants).
- Wrong password cannot read the repository. Live/existing/invalid restore destinations are refused.
- The corrected importer independently passed on another new empty database, verified its before-import archive/dump, matched all 23 original media hashes and refused re-import over existing data.
- The owner-first-admin helper accepts credentials only through stdin and refuses an already populated administrator table.
- S3 emulator tests validate the integration, not Hetzner credentials, regional availability, network/TLS, bucket policy/versioning or disaster independence. The real off-server acceptance drill remains blocking.

Evidence is kept privately in `.local-test/security-review-20261015`. The local emulator is a test dependency only and must never be included in the production Compose stack.
