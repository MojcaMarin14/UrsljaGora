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
    imageUrl: "/panoramas/bryan-goff-IuyhXAia8EA-unsplash.jpg",
    description: "Panorama of Bryan Goff.",
  },
  {
    slug: "jessica-anderson",
    title: "Jessica Anderson Panorama",
    imageUrl: "/panoramas/jessica-anderson-yFPJdy_R8LA-unsplash.jpg",
    description: "Panorama of Jessica Anderson.",
  },
  {
    slug: "one-zen",
    title: "One Zen Panorama",
    imageUrl: "/panoramas/one-zen-48kE4A9dMKc-unsplash.jpg",
    description: "Panorama of One Zen.",
  },
  {
    slug: "tomas-cocacola",
    title: "Tomas Cocacola Panorama",
    imageUrl: "/panoramas/tomas-cocacola-1MCdcbJxViE-unsplash.jpg",
    description: "Panorama of Tomas Cocacola.",
  },
];

export function getPanoramaBySlug(slug: string) {
  return panoramas.find((panorama) => panorama.slug === slug);
}
