#!/usr/bin/env python3
"""Import a verified Strapi archive only into an empty, stopped CMS database."""
import argparse,hashlib,json,os,subprocess,tarfile,tempfile,shutil
from pathlib import Path
parser=argparse.ArgumentParser()
parser.add_argument('archive',type=Path)
parser.add_argument('--sha256',required=True)
args=parser.parse_args()
archive=args.archive.resolve()
def require(condition, message):
 if not condition: raise SystemExit(message)
require(hashlib.sha256(archive.read_bytes()).hexdigest()==args.sha256, 'Archive hash mismatch')
deploy=Path(__file__).resolve().parents[1]
compose=str(deploy/'scripts/compose.sh')
def run(*argv,**kwargs):
 return subprocess.run([compose,*argv],check=True,**kwargs)
require(not run('ps','--status','running','-q','strapi',capture_output=True,text=True).stdout.strip(), 'Stop Strapi before importing')
# All tables are queried by fixed names; never interpolate user-provided SQL.
sql='SELECT (SELECT count(*) FROM novicas)+(SELECT count(*) FROM dogodkis)+(SELECT count(*) FROM ponudbes)+(SELECT count(*) FROM articles)+(SELECT count(*) FROM pohvalas)+(SELECT count(*) FROM mapa_fotografijas)+(SELECT count(*) FROM tocka_na_mapis)+(SELECT count(*) FROM files)+(SELECT count(*) FROM admin_users);'
count=run('exec','-T','postgres','sh','-c','psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Atc "$1"','sh',sql,capture_output=True,text=True).stdout.strip()
require(count=='0', 'Target has existing content, media or admin users; refusing import')
existing=run('run','-T','--no-deps','--entrypoint','sh','strapi','-c', 'find /app/public/uploads -type f ! -name .gitkeep -print -quit',capture_output=True,text=True).stdout.strip()
require(not existing, 'Target upload volume contains files; refusing import')
backup=deploy/'migration-backups'
backup.mkdir(mode=0o700,exist_ok=True)
folder=Path(tempfile.mkdtemp(prefix='before-import-',dir=backup));folder.chmod(0o700)
saved=folder/archive.name
with saved.open('xb') as out,archive.open('rb') as src:shutil.copyfileobj(src,out)
saved.chmod(0o600)
require(hashlib.sha256(saved.read_bytes()).hexdigest()==args.sha256, 'Backup archive hash mismatch')
with (folder/'empty-target.dump').open('xb') as out:
 run('exec','-T','postgres','sh','-c','pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --format=custom --no-owner',stdout=out)
(folder/'empty-target.dump').chmod(0o600)
dump=(folder/'empty-target.dump').read_bytes()
run('exec','-T','postgres','pg_restore','--list',input=dump,stdout=subprocess.DEVNULL)
(folder/'verification.json').write_text(json.dumps({'source_sha256':args.sha256,'empty_target_sha256':hashlib.sha256(dump).hexdigest(),'empty_content_media_admin_count':0,'dump_verified':True},indent=2)+'\n')
(folder/'verification.json').chmod(0o600)
print('PASS: source archive copy and empty target database dump verified.',flush=True)
# Excluding file binaries avoids renaming the Docker uploads mount. Media DB
# records and relations still import, with original filenames preserved below.
run('run','-T','--no-deps','--user','0','--volume',str(saved)+':/migration.tar.gz:ro','--entrypoint','node','strapi','node_modules/@strapi/strapi/bin/strapi.js','import','--file','/migration.tar.gz','--exclude','files','--force')
with tarfile.open(saved) as tar:
 members=[m for m in tar if m.name.startswith('assets/uploads/') and m.isfile()]
 require(members and all(Path(m.name).parts[:2]==('assets','uploads') and len(Path(m.name).parts)==3 for m in members), 'Invalid media archive paths')
media=folder/'uploads';media.mkdir(mode=0o755)
with tarfile.open(saved) as tar:
 for m in members:
  destination=media/Path(m.name).name
  with destination.open('xb') as out:shutil.copyfileobj(tar.extractfile(m),out)
  destination.chmod(0o644)
run('run','-T','--no-deps','--user','0','--cap-add','CHOWN','--cap-add','DAC_OVERRIDE','--volume',str(media)+':/migration-uploads:ro','--entrypoint','sh','strapi','-c','cp -rn /migration-uploads/. /app/public/uploads/ && chown -R node:node /app/public/uploads')
print('Imported content and preserved',len(members),'media binaries. Pre-import backups:',folder,flush=True)
