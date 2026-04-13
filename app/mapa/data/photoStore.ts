/**
 * Community photo store — persists to localStorage.
 * In production this would be a backend API + database.
 */

export interface PhotoComment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface CommunityPhoto {
  id: string;
  lat: number;
  lng: number;
  imageData: string; // base64 data-url
  caption: string;
  author: string;
  createdAt: string; // ISO string
  rating?: number;   // 1–5 zvezdic
  comments?: PhotoComment[];
}

const STORAGE_KEY = "urslja_community_photos";
const ADMIN_KEY   = "urslja_admin_session";

// ── Photos ──────────────────────────────────────────────────────────────────

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

export function addComment(photoId: string, comment: PhotoComment): void {
  const photos = loadPhotos().map((p) =>
    p.id === photoId
      ? { ...p, comments: [...(p.comments ?? []), comment] }
      : p
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
}

export function generateId(): string {
  return `photo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// ── Admin session ────────────────────────────────────────────────────────────

// Geslo za admina — lastnik ga ve, v produkciji bi bilo to na serverju
const ADMIN_PIN = "urslja2025";

export function checkAdminPin(pin: string): boolean {
  return pin === ADMIN_PIN;
}

export function loadAdminSession(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ADMIN_KEY) === "1";
}

export function saveAdminSession(): void {
  localStorage.setItem(ADMIN_KEY, "1");
}

export function clearAdminSession(): void {
  localStorage.removeItem(ADMIN_KEY);
}
