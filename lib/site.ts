export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://urslja-gora.vercel.app').replace(/\/+$/, '');
}
