"use client";

import { useState } from "react";
import { CommunityPhoto } from "../data/photoStore";
import { IconCamera, IconPin, IconCalendar } from "./Icons";

interface PhotoGalleryProps {
  photos: CommunityPhoto[];
  onLocatePhoto: (lat: number, lng: number) => void;
}

function Stars({ value }: { value?: number }) {
  if (!value) return null;
  return (
    <span className="stars-display">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= value ? "star--filled" : "star--empty"}>★</span>
      ))}
    </span>
  );
}

export default function PhotoGallery({ photos, onLocatePhoto }: PhotoGalleryProps) {
  const [lightbox, setLightbox] = useState<CommunityPhoto | null>(null);

  if (photos.length === 0) {
    return (
      <div className="gallery-empty">
        <span className="gallery-empty__icon"><IconCamera size={36} /></span>
        <p>Še ni objavljenih fotografij.</p>
        <p className="gallery-empty__sub">Bodi prvi/-a ki deli svojo izkušnjo!</p>
      </div>
    );
  }

  return (
    <>
      <div className="gallery-grid">
        {photos.map((photo) => (
          <div key={photo.id} className="gallery-item">
            <img
              src={photo.imageUrl}
              alt={photo.caption || "Fotografija"}
              className="gallery-item__img"
              onClick={() => setLightbox(photo)}
            />
            {photo.rating && (
              <span className="gallery-item__rating">
                {"★".repeat(photo.rating)}
              </span>
            )}
            <div className="gallery-item__overlay">
              <button
                className="gallery-item__locate"
                title="Pokaži na mapi"
                onClick={() => onLocatePhoto(photo.lat, photo.lng)}
              >
                <IconPin size={14} />
              </button>
            </div>
            {photo.caption && (
              <span className="gallery-item__caption">{photo.caption}</span>
            )}
          </div>
        ))}
      </div>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <div className="lightbox__content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox__close" onClick={() => setLightbox(null)}>✕</button>
            <img
              src={lightbox.imageUrl}
              alt={lightbox.caption || "Fotografija"}
              className="lightbox__img"
            />
            <div className="lightbox__info">
              {lightbox.caption && <p className="lightbox__caption">{lightbox.caption}</p>}

              {lightbox.rating && (
                <div className="lightbox__rating">
                  <Stars value={lightbox.rating} />
                  <span className="lightbox__rating-text">{lightbox.rating}/5</span>
                </div>
              )}

              <div className="lightbox__meta">
                <span><IconCamera size={14} /> {lightbox.author || "Anonimno"}</span>
                <span>
                  <IconCalendar size={14} />{" "}
                  {new Date(lightbox.createdAt).toLocaleDateString("sl-SI")}
                </span>
              </div>

              <div className="lightbox__actions">
                <button
                  className="btn btn--outline btn--sm"
                  onClick={() => { onLocatePhoto(lightbox.lat, lightbox.lng); setLightbox(null); }}
                >
                  <IconPin size={14} /> Pokaži na mapi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
