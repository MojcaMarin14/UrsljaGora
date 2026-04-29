import { fetchAPI, uploadFileToStrapi, getStrapiMedia } from "../../../lib/api";

export interface CommunityPhoto {
  id: number;
  lat: number;
  lng: number;
  imageUrl: string;
  caption: string;
  author: string;
  createdAt: string;
  rating?: number;
  kraj?: string;
}

export async function loadPhotos(): Promise<CommunityPhoto[]> {
  try {
    const res = await fetchAPI(
      "mapa-fotografijas?filters[odobrena][$eq]=true&populate=slika&sort=createdAt:desc"
    );
    return res.data.map((item: Record<string, unknown> & { slika?: { url?: string } }) => ({
      id: item.id,
      lat: item.lat,
      lng: item.lng,
      imageUrl: getStrapiMedia(item.slika?.url),
      caption: (item.opis as string) ?? "",
      author: (item.avtor as string) ?? "Anonimno",
      createdAt: item.createdAt,
      rating: (item.ocena as number) ?? undefined,
      kraj: (item.kraj as string) ?? undefined,
    }));
  } catch {
    return [];
  }
}

export async function submitPhoto(data: {
  blob: Blob;
  lat: number;
  lng: number;
  caption: string;
  author: string;
  rating?: number;
  kraj?: string;
}): Promise<void> {
  const fileId = await uploadFileToStrapi(data.blob, "foto.jpg");
  await fetchAPI("mapa-fotografijas", {
    method: "POST",
    body: JSON.stringify({
      data: {
        slika: fileId,
        opis: data.caption,
        avtor: data.author,
        lat: data.lat,
        lng: data.lng,
        ocena: data.rating ?? null,
        odobrena: false,
        kraj: data.kraj ?? null,
      },
    }),
  });
}
