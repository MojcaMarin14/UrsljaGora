#!/usr/bin/env python3
"""Generate private configuration without overwriting an existing file."""
import argparse,os,re,secrets
from pathlib import Path
from urllib.parse import urlsplit
parser=argparse.ArgumentParser()
parser.add_argument('--local',action='store_true')
parser.add_argument('--backend',action='store_true',help='Keep the frontend on Vercel')
parser.add_argument('--domain',help='Website .si domain for the later full stack')
parser.add_argument('--cms-domain',help='CMS .si hostname for backend-only hosting')
parser.add_argument('--frontend-url',help='Existing public Vercel/custom frontend origin')
parser.add_argument('--output')
args=parser.parse_args()
def valid_si(value):
 return bool(value and value.endswith('.si') and all(re.fullmatch(r'[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?',label) for label in value.split('.')))
def origin(value):
 try:
  parsed=urlsplit(value)
  valid=(parsed.scheme=='https' and parsed.hostname and not parsed.username and not parsed.password and parsed.path in ('','/') and not parsed.query and not parsed.fragment)
  if not valid:raise ValueError()
  port=parsed.port
 except (ValueError,TypeError):parser.error('--frontend-url must be an HTTPS origin without credentials, path, query or fragment')
 if not args.local and (parsed.hostname=='localhost' or parsed.hostname.endswith(('.localhost','.invalid'))):parser.error('Supply the confirmed public frontend origin for production')
 return 'https://'+parsed.netloc.lower()
if args.backend:
 if not args.local and (not valid_si(args.cms_domain) or not args.frontend_url):parser.error('Backend mode requires --cms-domain cms.YOUR-DOMAIN.si and --frontend-url https://YOUR-EXISTING-FRONTEND')
 cms='cms.localhost' if args.local else args.cms_domain
 frontend=origin(args.frontend_url or 'https://vercel-frontend.example.invalid')
 domain=urlsplit(frontend).hostname
else:
 if args.cms_domain or args.frontend_url:parser.error('Use --backend with --cms-domain or --frontend-url')
 if not args.local and not valid_si(args.domain):parser.error('Use --local or supply the confirmed .si domain with --domain')
 domain='site.localhost' if args.local else args.domain
 cms='cms.localhost' if args.local else 'cms.'+domain
 frontend='https://'+domain+(':8443' if args.local else '')
values={
 'COMPOSE_PROJECT_NAME':('urslja-gora-backend-test' if args.local else 'urslja-gora-backend') if args.backend else ('urslja-gora-test' if args.local else 'urslja-gora'),
 'RELEASE_TAG':'local' if args.local else 'first',
 'SITE_DOMAIN':domain,'CMS_DOMAIN':cms,
 'NEXT_PUBLIC_SITE_URL':frontend,'NEXT_PUBLIC_STRAPI_URL':'https://'+cms+(':8443' if args.local else ''),
 'CORS_ORIGINS':frontend+(',http://127.0.0.1:3000' if args.backend and args.local else ''),
 'ACME_EMAIL':'' if args.local else 'CHANGE_BEFORE_DEPLOYMENT',
 'DATABASE_NAME':('strapi_backend_test' if args.backend else 'strapi_test') if args.local else 'strapi',
 'DATABASE_USERNAME':'strapi','DATABASE_PASSWORD':secrets.token_hex(32),
 'APP_KEYS':','.join(secrets.token_hex(32) for _ in range(4)),
 **{name:secrets.token_hex(32) for name in ['ADMIN_JWT_SECRET','API_TOKEN_SALT','TRANSFER_TOKEN_SALT','JWT_SECRET','ENCRYPTION_KEY']},
 'RESTIC_REPOSITORY':'/repository' if args.local else 's3:https://CHANGE_ME/urslja-gora-backups',
 'RESTIC_PASSWORD':secrets.token_hex(32),'AWS_DEFAULT_REGION':'us-east-1','AWS_ACCESS_KEY_ID':'','AWS_SECRET_ACCESS_KEY':''}
if args.backend:
 values.update({'DATABASE_ADMIN_USERNAME':'urslja_admin','DATABASE_ADMIN_PASSWORD':secrets.token_hex(32)})
if not args.backend:
 values.update({'NEXT_PUBLIC_TURNSTILE_SITE_KEY':'','TURNSTILE_SECRET_KEY':'','EMAIL_HOST':'','EMAIL_PORT':'465','EMAIL_SECURE':'true','EMAIL_USER':'','EMAIL_PASS':'','EMAIL_TO':'','ALLOW_PRIVATE_CMS_IMAGES':'true' if args.local else 'false'})
output=Path(args.output) if args.output else Path(__file__).resolve().parents[1]/('.env.backend' if args.backend else '.env')
fd=os.open(output,os.O_WRONLY|os.O_CREAT|os.O_EXCL,0o600)
with os.fdopen(fd,'w') as stream:stream.write('\n'.join(k+'='+v for k,v in values.items())+'\n')
print('Private '+('backend-only' if args.backend else 'full-stack')+' configuration created:',output)
