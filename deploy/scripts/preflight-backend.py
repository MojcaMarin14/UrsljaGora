#!/usr/bin/env python3
"""Validate private production settings without printing values or deploying."""
import argparse,json,os,re,subprocess,sys
from pathlib import Path
from urllib.parse import urlsplit
p=argparse.ArgumentParser();p.add_argument('--env',type=Path);a=p.parse_args()
deploy=Path(__file__).resolve().parents[1];envfile=(a.env or deploy/'.env.backend').resolve()
def require(ok,message):
 if not ok:raise SystemExit('FAIL: '+message)
require(envfile.is_file(),'Private backend environment file is missing.')
require(envfile.stat().st_mode & 0o077 == 0,'Private environment file must have mode 600 or stricter.')
values=dict(line.split('=',1) for line in envfile.read_text().splitlines() if line and not line.startswith('#') and '=' in line)
get=lambda key:values.get(key,'')
require(get('COMPOSE_PROJECT_NAME')=='urslja-gora-backend','Use the stable production project name to retain volume identity.')
require(get('CMS_DOMAIN').endswith('.si') and not any(x in get('CMS_DOMAIN') for x in ['CHANGE','example','localhost']),'Set the real CMS .si hostname.')
require(get('NEXT_PUBLIC_STRAPI_URL')=='https://'+get('CMS_DOMAIN'),'CMS URL must be the exact HTTPS hostname, without /api.')
for value in get('CORS_ORIGINS').split(','):
 u=urlsplit(value);require(u.scheme=='https' and u.netloc and not u.username and not u.password and not u.path and not u.query and not u.fragment,'CORS requires explicit HTTPS origins only.')
require(get('CORS_ORIGINS'),'CORS origins are required.')
require('@' in get('ACME_EMAIL') and 'CHANGE' not in get('ACME_EMAIL'),'Set the certificate contact email.')
keys=['DATABASE_PASSWORD','DATABASE_ADMIN_PASSWORD','ADMIN_JWT_SECRET','API_TOKEN_SALT','TRANSFER_TOKEN_SALT','JWT_SECRET','ENCRYPTION_KEY','RESTIC_PASSWORD']
secrets=[get(k) for k in keys]+get('APP_KEYS').split(',')
require(len(get('APP_KEYS').split(','))>=4 and all(len(x)>=32 and not re.search('CHANGE|EXAMPLE|placeholder',x,re.I) for x in secrets),'Generate long, non-placeholder secrets and four app keys.')
require(len(secrets)==len(set(secrets)),'Each secret must be distinct.')
require(get('DATABASE_USERNAME')!=get('DATABASE_ADMIN_USERNAME') and get('DATABASE_ADMIN_USERNAME'),'App and administration database users must differ.')
require(get('RESTIC_REPOSITORY').startswith('s3:https://') and 'CHANGE' not in get('RESTIC_REPOSITORY'),'Configure an off-server S3 repository over HTTPS.')
require(len(get('AWS_ACCESS_KEY_ID'))>=16 and len(get('AWS_SECRET_ACCESS_KEY'))>=32 and not re.search('YOUR|CHANGE|EXAMPLE|placeholder',get('AWS_ACCESS_KEY_ID')+' '+get('AWS_SECRET_ACCESS_KEY'),re.I),'Configure real private S3 credentials, without placeholders.')
env=os.environ.copy();env.update(UG_STACK='backend',UG_ENV_FILE=str(envfile));env.pop('UG_LOCAL_TEST',None)
result=subprocess.run([str(deploy/'scripts/compose.sh'),'config','--format','json'],env=env,capture_output=True,text=True)
require(result.returncode==0,'Compose validation failed; inspect it privately, as config output contains secrets.')
config=json.loads(result.stdout);services=config['services']
require('frontend' not in services,'The production backend stack must preserve Vercel.')
for name in ['postgres','strapi']:require(not services[name].get('ports'),'Database and CMS ports must remain private.')
require(set(str(v['published']) for v in services['caddy']['ports'])=={'80','443'},'Only HTTPS proxy ports may be published.')
require(config['networks']['database'].get('internal') is True,'Database network must be internal.')
for service,target in [('postgres','/var/lib/postgresql/data'),('strapi','/app/public/uploads'),('caddy','/data')]:
 require(any(v.get('type')=='volume' and v.get('target')==target for v in services[service]['volumes']),'Required persistent volume missing: '+service)
require('DATABASE_ADMIN_PASSWORD' not in services['strapi']['environment'],'Database administration credentials must not reach Strapi.')
print('PASS: production settings, distinct private secrets, backend-only routing, private ports and persistent volumes. DNS, remote backup access, image scan and public certificates still need server-side verification.')
