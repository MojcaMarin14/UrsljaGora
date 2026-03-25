export async function fetchAPI(path: string) {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  const res = await fetch(`${base}/api/${path}?populate=*`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    console.error("Strapi API error:", res.status);
    throw new Error("Failed to fetch Strapi API");
  }

  return res.json();
}
