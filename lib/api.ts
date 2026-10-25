const DEV_STRAPI_FALLBACK = 'http://127.0.0.1:1337';

function getPublicStrapiUrl() {
  const url = process.env.NEXT_PUBLIC_STRAPI_URL?.trim().replace(/\/+$/, '');
  if (url) return url;
  if (process.env.NODE_ENV !== 'production') return DEV_STRAPI_FALLBACK;
  throw new Error('Missing NEXT_PUBLIC_STRAPI_URL');
}

export async function fetchAPI(path: string, init?: RequestInit) {
  const internal = typeof window === 'undefined' ? process.env.STRAPI_INTERNAL_URL?.trim().replace(/\/+$/, '') : undefined;
  const base = internal || getPublicStrapiUrl();
  const normalizedPath = path.replace(/^\/+/, '');
  const res = await fetch(`${base}/api/${normalizedPath}`, {
    cache: "no-store",
    ...init,
    signal: init?.signal ?? AbortSignal.timeout(10000),
    headers: { ...(init?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }), ...init?.headers },
  });
  if (!res.ok) throw new Error(`Strapi API returned ${res.status}`);
  return res.json();
}

export async function uploadFileToStrapi(blob: Blob, filename: string): Promise<number> {
  const form = new FormData();
  form.append('files', blob, filename);
  const res = await fetch(`${getPublicStrapiUrl()}/api/upload`, {
    method: 'POST', body: form, signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  const files = await res.json();
  if (!Number.isInteger(files[0]?.id)) throw new Error('Upload returned no file ID');
  return files[0].id;
}

export function getStrapiMedia(url?: string | null) {
  if (!url) return '/pol2.jpg';
  if (/^https?:\/\//i.test(url)) return url;
  return `${getPublicStrapiUrl()}${url.startsWith('/') ? url : `/${url}`}`;
}
