import { fetchAPI } from "@/lib/api";

export type PanoramaItem = {
  slug: string;
  title: string;
  imageUrl: string;
  description: string;
};

type StrapiPanorama = {
  slug: string;
  title: string;
  description?: string;
  image?: {
    url?: string;
  };
};

type StrapiResponse = {
  data?: StrapiPanorama[];
};

const BASE_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

function makeFullUrl(url?: string) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${BASE_URL}${url}`;
}

export async function getPanoramas(): Promise<PanoramaItem[]> {
  const response = (await fetchAPI("panoramas")) as StrapiResponse;

  return (response.data || []).map((item) => ({
    slug: item.slug,
    title: item.title,
    description: item.description || "",
    imageUrl: makeFullUrl(item.image?.url),
  }));
}

export async function getPanoramaBySlug(slug: string): Promise<PanoramaItem | undefined> {
  const panoramas = await getPanoramas();
  return panoramas.find((panorama) => panorama.slug === slug);
};