#!/usr/bin/env python3
"""Contact configuration checks. Offline by default; --check-smtp NEVER sends mail."""
import argparse
import ipaddress
import json
import os
from pathlib import Path
import re
import smtplib
import ssl
from urllib.parse import urlsplit

EXPECTED_RECIPIENT = 'juvan.nejc2@gmail.com'
TEMPLATE = Path(__file__).resolve().parents[1] / 'contact.env.example'
EMAIL = re.compile(r'^[^\s@<>;,]+@[^\s@<>;,]+\.[^\s@<>;,]+$')
PLACEHOLDER = re.compile(r'CHANGE[_ -]?ME|YOUR[_ -]|REPLACE[_ -]?ME|PLACEHOLDER|MOCK|TEST[_ -]?ONLY|[<>]', re.I)
DUMMY_SITE_KEYS = {'1x00000000000000000000AA', '2x00000000000000000000AB', '1x00000000000000000000BB', '2x00000000000000000000BB', '3x00000000000000000000FF'}
DUMMY_SECRET_KEYS = {n + 'x0000000000000000000000000000000AA' for n in '123'}

class ConfigurationError(Exception):
    pass


def read_env(path):
    """Literal dotenv subset. No shell execution, expansion or credential logging."""
    try:
        if path.stat().st_mode & 0o077:
            raise ConfigurationError('Zasebna datoteka mora imeti dovoljenja 600 ali strožja.')
        if path.stat().st_size > 1024 * 1024:
            raise ConfigurationError('Datoteka nastavitev je prevelika.')
        text = path.read_text(encoding='utf-8')
    except ConfigurationError:
        raise
    except (OSError, UnicodeError):
        raise ConfigurationError('Zasebne datoteke nastavitev ni mogoče prebrati.') from None
    result = {}
    for number, raw in enumerate(text.splitlines(), 1):
        line = raw.strip()
        if not line or line.startswith('#'):
            continue
        if line.startswith('export '):
            line = line[7:]
        if '=' not in line:
            raise ConfigurationError(f'Neveljavna oblika v vrstici {number}; uporabite KEY=value.')
        key, item = line.split('=', 1)
        key, item = key.strip(), item.strip()
        if not re.fullmatch(r'[A-Z_][A-Z_0-9]*', key) or key in result:
            raise ConfigurationError(f'Neveljaven ali podvojen ključ v vrstici {number}.')
        if item.startswith(('"', "'")):
            if len(item) < 2 or item[-1] != item[0]:
                raise ConfigurationError(f'Nezaključen narekovaj v vrstici {number}.')
            item = item[1:-1]
        if '\x00' in item or '\r' in item or '\n' in item:
            raise ConfigurationError(f'Neveljavna vrednost v vrstici {number}.')
        result[key] = item
    return result


def public_hostname(host):
    if not host or host != host.strip() or '/' in host or ':' in host or '*' in host:
        return False
    host = host.lower()
    if host in {'localhost', 'mailpit', 'example.si', 'example.com', 'example.net', 'example.org'} or host.endswith(('.localhost', '.local', '.invalid', '.test', '.example')) or PLACEHOLDER.search(host):
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return bool(re.fullmatch(r'(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}', host))


def validate(values, expected_recipient=EXPECTED_RECIPIENT):
    errors = []
    def check(condition, message):
        if not condition:
            errors.append(message)
    get = lambda key: values.get(key, '').strip()
    check(get('CONTACT_LOCAL_TEST') == 'false', 'CONTACT_LOCAL_TEST mora biti izrecno false za javno namestitev.')
    try:
        url = urlsplit(get('NEXT_PUBLIC_SITE_URL'))
        valid_url = url.scheme == 'https' and public_hostname(url.hostname) and not url.username and not url.password and url.port in (None, 443) and url.path in ('', '/') and not url.query and not url.fragment
    except ValueError:
        url, valid_url = None, False
    check(valid_url, 'NEXT_PUBLIC_SITE_URL mora biti potrjeni javni HTTPS izvor spletne strani, brez poti ali lokalnih vrat.')
    check(bool(url and get('TURNSTILE_EXPECTED_HOSTNAME') == url.hostname), 'TURNSTILE_EXPECTED_HOSTNAME se mora natančno ujemati s hostom spletne strani.')
    check(public_hostname(get('EMAIL_HOST')), 'EMAIL_HOST mora biti dejanski DNS naslov poštnega ponudnika, brez URL-ja ali lokalnega testnega strežnika.')
    port, secure = get('EMAIL_PORT'), get('EMAIL_SECURE')
    check((port, secure) in {('465', 'true'), ('587', 'false')}, 'Za podprto varno SMTP nastavitev uporabite 465/true ali 587/false (obvezni STARTTLS).')
    for key in ('EMAIL_USER', 'EMAIL_PASS'):
        check(bool(get(key)) and not PLACEHOLDER.search(get(key)), f'Dopolnite zasebno nastavitev {key} z veljavno vrednostjo ponudnika.')
    sender = get('EMAIL_FROM') or get('EMAIL_USER')
    check(bool(EMAIL.fullmatch(sender)) and public_hostname(sender.rsplit('@', 1)[-1]), 'EMAIL_FROM oziroma privzeti EMAIL_USER mora biti javni e-poštni naslov dovoljenega pošiljatelja.')
    recipient = get('EMAIL_TO')
    check(bool(EMAIL.fullmatch(recipient)) and public_hostname(recipient.rsplit('@', 1)[-1]), 'EMAIL_TO mora biti en javni e-poštni naslov.')
    check(recipient == expected_recipient, 'EMAIL_TO se ne ujema z izrecno potrjenim prejemnikom; spremembo prej potrdite z lastnikom.')
    sitekey = get('TURNSTILE_SITE_KEY') or get('NEXT_PUBLIC_TURNSTILE_SITE_KEY')
    secret = get('TURNSTILE_SECRET_KEY')
    check(len(sitekey) >= 20 and not PLACEHOLDER.search(sitekey) and sitekey not in DUMMY_SITE_KEYS, 'Dopolnite pravi TURNSTILE_SITE_KEY; testni ključ v produkciji ni dovoljen.')
    check(len(secret) >= 20 and not PLACEHOLDER.search(secret) and secret not in DUMMY_SECRET_KEYS, 'Dopolnite pravi TURNSTILE_SECRET_KEY; testni ključ v produkciji ni dovoljen.')
    check(not sitekey or sitekey != secret, 'Javni in zasebni ključ Turnstile morata biti različna.')
    if get('TURNSTILE_SITE_KEY') and get('NEXT_PUBLIC_TURNSTILE_SITE_KEY'):
        check(get('TURNSTILE_SITE_KEY') == get('NEXT_PUBLIC_TURNSTILE_SITE_KEY'), 'Oba javna ključa Turnstile morata biti enaka, če sta oba nastavljena.')
    check(not any(v and k.startswith('NEXT_PUBLIC_') and re.search(r'SECRET|PASSWORD|PASS$', k) for k, v in values.items()), 'Zasebna gesla in ključi ne smejo biti v NEXT_PUBLIC_* nastavitvah.')
    return errors


def verify_smtp(values):
    """Only EHLO, TLS, AUTH and QUIT. No MAIL FROM, RCPT TO or DATA methods."""
    context = ssl.create_default_context()
    host, port = values['EMAIL_HOST'].strip(), int(values['EMAIL_PORT'])
    factory = smtplib.SMTP_SSL if port == 465 else smtplib.SMTP
    options = {'host': host, 'port': port, 'timeout': 10}
    if port == 465:
        options['context'] = context
    try:
        with factory(**options) as client:
            code, _ = client.ehlo()
            if code != 250:
                raise smtplib.SMTPException()
            if port == 587:
                client.starttls(context=context)
                code, _ = client.ehlo()
                if code != 250:
                    raise smtplib.SMTPException()
            # Match the application's current trimming of environment values.
            client.login(values['EMAIL_USER'].strip(), values['EMAIL_PASS'].strip())
        return None
    except smtplib.SMTPAuthenticationError:
        return 'SMTP prijava ni uspela; preverite zasebne prijavne podatke ponudnika.'
    except ssl.SSLError:
        return 'SMTP TLS preverjanje ni uspelo; certifikata ne izključujte.'
    except (OSError, smtplib.SMTPException):
        return 'Povezava SMTP ni uspela; zasebno preverite host, vrata, TLS in dostop ponudnika.'


def main(argv=None):
    parser = argparse.ArgumentParser(description='Priprava kontaktnega obrazca. Privzeto samo lokalno preverjanje nastavitev, brez omrežja in brez pošiljanja pošte.')
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument('--env', type=Path, help='Zasebna datoteka za preverjanje.')
    mode.add_argument('--init', type=Path, help='Ustvari novo zasebno predlogo (600); nikoli ne prepiše obstoječe datoteke.')
    parser.add_argument('--check-smtp', action='store_true', help='Po uspešnem preverjanju opravite TLS/prijavo SMTP; nobeno sporočilo se ne pošlje.')
    parser.add_argument('--expected-recipient', default=EXPECTED_RECIPIENT, help='Lastnik mora spremembo pričakovanega prejemnika predhodno potrditi.')
    parser.add_argument('--json', action='store_true', help='Strojno berljiv izpis brez skrivnosti.')
    args = parser.parse_args(argv)
    if args.init:
        if args.check_smtp:
            parser.error('--check-smtp je na voljo samo skupaj z --env.')
        try:
            content = TEMPLATE.read_bytes()
            fd = os.open(args.init, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
            with os.fdopen(fd, 'wb') as stream:
                stream.write(content)
        except (OSError, UnicodeError):
            print('FAIL: Predloge ni mogoče ustvariti; obstoječe datoteke niso prepisane.')
            return 2
        print('Ustvarjena zasebna predloga. Dopolnite prazna polja; ni omrežnih povezav ali pošiljanja pošte.')
        return 0
    try:
        values = read_env(args.env)
        errors = validate(values, args.expected_recipient)
    except ConfigurationError as exc:
        values, errors = {}, [str(exc)]
    report = {'configuration_ready': not errors, 'errors': errors, 'smtp_checked': False, 'emails_sent': 0, 'deployment_performed': False}
    if not errors and args.check_smtp:
        smtp_error = verify_smtp(values)
        report['smtp_checked'] = True
        report['smtp_login_ready'] = smtp_error is None
        if smtp_error:
            errors.append(smtp_error)
    if args.json:
        print(json.dumps(report, ensure_ascii=False, indent=2))
    elif errors:
        print('NI PRIPRAVLJENO:')
        for error in errors:
            print('- ' + error)
        print('Nobena pošta ni bila poslana; nobena namestitev ni bila izvedena.')
    else:
        print('PASS: Nastavitve so strukturno pripravljene. ' + ('TLS in prijava SMTP sta preverjena. ' if args.check_smtp else 'Omrežje in prijava SMTP nista preverjena. ') + 'Nič ni poslano; domena, dovoljenje pošiljatelja, CAPTCHA in dejanski prejem še zahtevajo preverjanje ob vklopu.')
    return 2 if errors else 0

if __name__ == '__main__':
    raise SystemExit(main())
