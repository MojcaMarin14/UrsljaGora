export async function fetchAPI(path: string) {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
  const url = new URL(`/api/${path}`, base);

  if (!url.searchParams.has("populate")) {
    url.searchParams.set("populate", "*");
  }

  const res = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    console.error("Strapi API error:", res.status, url.toString());
    throw new Error("Failed to fetch Strapi API");
  }

  return res.json();
};