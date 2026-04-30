const DEV_STRAPI_FALLBACK = "http://localhost:1337";

function getStrapiBaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_STRAPI_URL?.trim().replace(/\/+$/, "");
  if (envUrl) return envUrl;

  const isServer = typeof window === "undefined";
  const isDev = process.env.NODE_ENV !== "production";

  if (isServer && isDev) {
    return DEV_STRAPI_FALLBACK;
  }

  throw new Error("Missing NEXT_PUBLIC_STRAPI_URL");
}

export async function fetchAPI(path: string, init?: RequestInit) {
  const base = getStrapiBaseUrl();
  const normalizedPath = path.replace(/^\/+/, "");

  const res = await fetch(`${base}/api/${normalizedPath}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    console.error("Strapi API error:", res.status);
    throw new Error(`Failed to fetch Strapi API: ${res.status}`);
  }

  return res.json();
}

export async function uploadFileToStrapi(blob: Blob, filename: string): Promise<number> {
  const base = getStrapiBaseUrl();
  const form = new FormData();
  form.append("files", blob, filename);
  const res = await fetch(`${base}/api/upload`, { method: "POST", body: form });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  const data = await res.json();
  return data[0].id;
}

export function getStrapiMedia(url?: string | null) {
  if (!url) {
    return "/fallback.jpg";
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  const base = getStrapiBaseUrl();
  return `${base}${url.startsWith("/") ? url : `/${url}`}`;
}
