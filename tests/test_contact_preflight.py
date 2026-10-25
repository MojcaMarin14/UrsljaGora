"""No network or mail: validate readiness gates and the SMTP login-only protocol."""
import contextlib
import importlib.util
import io
import json
import os
from pathlib import Path
import smtplib
import ssl
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
MODULE = ROOT / 'deploy/scripts/preflight-contact.py'
spec = importlib.util.spec_from_file_location('contact_preflight', MODULE)
preflight = importlib.util.module_from_spec(spec)
spec.loader.exec_module(preflight)


def ready():
    # Synthetic values, used offline only; these are not real provider credentials.
    return dict(CONTACT_LOCAL_TEST='false', NEXT_PUBLIC_SITE_URL='https://urslja-gora.vercel.app', TURNSTILE_EXPECTED_HOSTNAME='urslja-gora.vercel.app', EMAIL_HOST='smtp.urslja-preflight.si', EMAIL_PORT='587', EMAIL_SECURE='false', EMAIL_USER='smtp-account', EMAIL_PASS='qa-F8j3Y6m9r2H7n5W4q8s1', EMAIL_FROM='website@urslja-preflight.si', EMAIL_TO=preflight.EXPECTED_RECIPIENT, TURNSTILE_SITE_KEY='0x4AQA-F8j3Y6m9r2H7n5W4q8', TURNSTILE_SECRET_KEY='0x4BQA-M3w9P1z7H6f2J8k4S5n0')


class ContactPreflightTests(unittest.TestCase):
    def test_valid_configuration_offline(self):
        with patch('socket.socket', side_effect=AssertionError('No network')):
            self.assertEqual(preflight.validate(ready()), [])

    def test_blocks_incomplete_template(self):
        with tempfile.TemporaryDirectory() as temp:
            target = Path(temp) / '.env.contact'
            with contextlib.redirect_stdout(io.StringIO()):
                self.assertEqual(preflight.main(['--init', str(target)]), 0)
            self.assertEqual(target.stat().st_mode & 0o777, 0o600)
            before = target.read_bytes()
            with contextlib.redirect_stdout(io.StringIO()):
                self.assertEqual(preflight.main(['--init', str(target)]), 2)
            self.assertEqual(target.read_bytes(), before)
            self.assertTrue(preflight.validate(preflight.read_env(target)))

    def test_rejects_unsafe_settings(self):
        cases = [('CONTACT_LOCAL_TEST', 'true'), ('NEXT_PUBLIC_SITE_URL', 'http://site.localhost:8443'), ('TURNSTILE_EXPECTED_HOSTNAME', 'wrong.vercel.app'), ('EMAIL_HOST', 'mailpit'), ('EMAIL_HOST', '127.0.0.1'), ('EMAIL_HOST', 'smtp.example.invalid'), ('EMAIL_PORT', '25'), ('EMAIL_SECURE', 'true'), ('EMAIL_USER', ''), ('EMAIL_PASS', ''), ('EMAIL_FROM', 'injected\r\nBcc: a@b.si'), ('EMAIL_TO', 'unexpected@gmail.com'), ('NEXT_PUBLIC_EMAIL_PASS', 'private-value'), ('TURNSTILE_SITE_KEY', '1x00000000000000000000AA'), ('TURNSTILE_SECRET_KEY', '1x0000000000000000000000000000000AA')]
        for key, value in cases:
            with self.subTest(key=key, value='redacted'):
                config = ready()
                config[key] = value
                self.assertTrue(preflight.validate(config))
        config = ready()
        config['NEXT_PUBLIC_TURNSTILE_SITE_KEY'] = 'different-public-key'
        self.assertTrue(preflight.validate(config))

    def test_literal_parser_and_private_permissions(self):
        with tempfile.TemporaryDirectory() as temp:
            target = Path(temp) / '.env.contact'
            literal = 'EMAIL_PASS="literal-$(do-not-run)-`nothing`#value"\n'
            target.write_text(literal)
            target.chmod(0o600)
            self.assertEqual(preflight.read_env(target)['EMAIL_PASS'], 'literal-$(do-not-run)-`nothing`#value')
            target.chmod(0o644)
            with self.assertRaises(preflight.ConfigurationError):
                preflight.read_env(target)
            target.chmod(0o600)
            target.write_text('EMAIL_PASS=private\nEMAIL_PASS=duplicate\n')
            with self.assertRaises(preflight.ConfigurationError):
                preflight.read_env(target)

    def test_cli_offline_and_secret_redaction(self):
        with tempfile.TemporaryDirectory() as temp:
            config = ready()
            target = Path(temp) / '.env.contact'
            target.write_text('\n'.join(k+'='+v for k, v in config.items())+'\n')
            target.chmod(0o600)
            output = io.StringIO()
            with patch('socket.socket', side_effect=AssertionError('No network')), contextlib.redirect_stdout(output):
                self.assertEqual(preflight.main(['--env', str(target), '--json']), 0)
            report = json.loads(output.getvalue())
            self.assertTrue(report['configuration_ready'])
            self.assertFalse(report['smtp_checked'])
            self.assertEqual(report['emails_sent'], 0)
            for key in ['EMAIL_PASS', 'EMAIL_USER', 'TURNSTILE_SECRET_KEY']:
                self.assertNotIn(config[key], output.getvalue())

    def test_smtp_uses_only_tls_auth_and_quit(self):
        for port, secure in [('587', 'false'), ('465', 'true')]:
            calls = []
            class Capture:
                def __init__(self, **kwargs):
                    calls.append('connect')
                    if port == '465':
                        self_context = kwargs['context']
                        assert self_context.check_hostname and self_context.verify_mode == ssl.CERT_REQUIRED
                def __enter__(self): return self
                def __exit__(self, *args): calls.append('quit')
                def ehlo(self): calls.append('ehlo'); return 250, b'OK'
                def starttls(self, *, context):
                    assert context.check_hostname and context.verify_mode == ssl.CERT_REQUIRED
                    calls.append('starttls')
                def login(self, user, password): calls.append('auth'); return 235, b'OK'
                def mail(self, *args): raise AssertionError('MAIL FROM is forbidden')
                def rcpt(self, *args): raise AssertionError('RCPT TO is forbidden')
                def data(self, *args): raise AssertionError('DATA is forbidden')
                def sendmail(self, *args): raise AssertionError('Sending is forbidden')
            config = ready()
            config.update(EMAIL_PORT=port, EMAIL_SECURE=secure)
            with patch.object(preflight.smtplib, 'SMTP', Capture), patch.object(preflight.smtplib, 'SMTP_SSL', Capture):
                self.assertIsNone(preflight.verify_smtp(config))
            expected = ['connect', 'ehlo', 'starttls', 'ehlo', 'auth', 'quit'] if port == '587' else ['connect', 'ehlo', 'auth', 'quit']
            self.assertEqual(calls, expected)

    def test_smtp_failure_redacts_provider_details(self):
        secret = ready()['EMAIL_PASS']
        with patch.object(preflight.smtplib, 'SMTP', side_effect=smtplib.SMTPAuthenticationError(535, secret.encode())):
            error = preflight.verify_smtp(ready())
        self.assertTrue(error)
        self.assertNotIn(secret, error)


if __name__ == '__main__':
    unittest.main()
