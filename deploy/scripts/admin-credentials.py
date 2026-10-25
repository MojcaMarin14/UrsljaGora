#!/usr/bin/env python3
"""Privately prompt; emit JSON only to the pipe feeding create-first-admin.cjs."""
import getpass,json,sys
if sys.stdout.isatty():raise SystemExit('Pipe this command directly into the first-administrator helper; do not display credentials.')
def prompt(label):
 print(label,end='',file=sys.stderr,flush=True)
 return sys.stdin.readline().strip()
email=prompt('Owner email: ');first=prompt('First name: ');last=prompt('Last name: ')
pw=getpass.getpass('New CMS password (16+ characters): ')
confirm=getpass.getpass('Repeat password: ')
if pw!=confirm or len(pw)<16:raise SystemExit('Passwords must match and contain at least 16 characters.')
print(json.dumps({'email':email,'firstname':first,'lastname':last,'password':pw}))
