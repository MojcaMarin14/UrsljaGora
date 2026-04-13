"use client";

import { useState } from "react";
import { CommunityPhoto, deletePhoto } from "../data/photoStore";
import { IconCamera, IconPin, IconTrash, IconCalendar } from "./Icons";

interface PhotoGalleryProps {
  photos: CommunityPhoto[];
  isAdmin: boolean;
  onPhotoDeleted: () => void;
  onLocatePhoto: (lat: number, lng: number) => void;
}

export default function PhotoGallery({
  photos,
  isAdmin,
  onPhotoDeleted,
  onLocatePhoto,
}: PhotoGalleryProps) {
  const [lightbox, setLightbox] = useState<CommunityPhoto | null>(null);

  function handleDelete(id: string) {
    if (!confirm("Ali res želiš izbrisati to fotografijo?")) return;
    deletePhoto(id);
    onPhotoDeleted();
    if (lightbox?.id === id) setLightbox(null);
  }

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
              src={photo.imageData}
              alt={photo.caption || "Fotografija"}
              className="gallery-item__img"
              onClick={() => setLightbox(photo)}
            />
            <div className="gallery-item__overlay">
              <button
                className="gallery-item__locate"
                title="Pokaži na mapi"
                onClick={() => onLocatePhoto(photo.lat, photo.lng)}
              >
                <IconPin size={14} />
              </button>
              {isAdmin && (
                <button
                  className="gallery-item__delete"
                  title="Izbriši"
                  onClick={() => handleDelete(photo.id)}
                >
                  <IconTrash size={14} />
                </button>
              )}
            </div>
            {photo.caption && (
              <span className="gallery-item__caption">{photo.caption}</span>
            )}
          </div>
        ))}
      </div>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <div
            className="lightbox__content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="lightbox__close"
              onClick={() => setLightbox(null)}
            >
              ✕
            </button>
            <img
              src={lightbox.imageData}
              alt={lightbox.caption || "Fotografija"}
              className="lightbox__img"
            />
            <div className="lightbox__info">
              {lightbox.caption && (
                <p className="lightbox__caption">{lightbox.caption}</p>
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
                  onClick={() => {
                    onLocatePhoto(lightbox.lat, lightbox.lng);
                    setLightbox(null);
                  }}
                >
                  <IconPin size={14} /> Pokaži na mapi
                </button>
                {isAdmin && (
                  <button
                    className="btn btn--danger btn--sm"
                    onClick={() => handleDelete(lightbox.id)}
                  >
                    <IconTrash size={14} /> Izbriši
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
