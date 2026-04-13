/**
 * Community photo store — persists to localStorage.
 * In production this would be a backend API + database.
 */

export interface CommunityPhoto {
  id: string;
  lat: number;
  lng: number;
  imageData: string; // base64 data-url
  caption: string;
  author: string;
  createdAt: string; // ISO string
}

const STORAGE_KEY = "urslja_community_photos";

export function loadPhotos(): CommunityPhoto[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePhoto(photo: CommunityPhoto): void {
  const photos = loadPhotos();
  photos.unshift(photo);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
}

export function deletePhoto(id: string): void {
  const photos = loadPhotos().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
}

export function generateId(): string {
  return `photo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
