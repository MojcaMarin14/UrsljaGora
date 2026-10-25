export type PanoramaItem = {
  slug: string;
  title: string;
  imageUrl: string;
  description: string;
};

export const panoramas: PanoramaItem[] = [
  {
    slug: "bryan-goff",
    title: "Bryan Goff Panorama",
    imageUrl: "/panoramas/PHOTO_0037.jpg",
    description: "Panorama of Bryan Goff.",
  },
  {
    slug: "jessica-anderson",
    title: "Jessica Anderson Panorama",
    imageUrl: "/panoramas/PHOTO_0004.jpg",
    description: "Panorama of Jessica Anderson.",
  },
  {
    slug: "one-zen",
    title: "One Zen Panorama",
    imageUrl: "/panoramas/PHOTO_0030.jpg",
    description: "Panorama of One Zen.",
  },
  {
    slug: "tomas-cocacola",
    title: "Tomas Cocacola Panorama",
    imageUrl: "/panoramas/Hodnik_Low.jpg",
    description: "Panorama of Tomas Cocacola.",
  },
];

export function getPanoramaBySlug(slug: string) {
  return panoramas.find((panorama) => panorama.slug === slug);
}
