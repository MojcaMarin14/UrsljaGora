"use client";

import { useState } from "react";
import { CommunityPhoto, deletePhoto, addComment, generateId } from "../data/photoStore";
import { IconCamera, IconPin, IconTrash, IconCalendar } from "./Icons";

interface PhotoGalleryProps {
  photos: CommunityPhoto[];
  isAdmin: boolean;
  onPhotoDeleted: () => void;
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

export default function PhotoGallery({ photos, isAdmin, onPhotoDeleted, onLocatePhoto }: PhotoGalleryProps) {
  const [lightbox, setLightbox] = useState<CommunityPhoto | null>(null);
  const [commentText, setCommentText] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");
  const [localPhotos, setLocalPhotos] = useState<CommunityPhoto[]>(photos);

  // Sync when parent reloads
  if (localPhotos !== photos) setLocalPhotos(photos);

  function handleDelete(id: string) {
    if (!confirm("Ali res želiš izbrisati to fotografijo?")) return;
    deletePhoto(id);
    onPhotoDeleted();
    if (lightbox?.id === id) setLightbox(null);
  }

  function handleAddComment() {
    if (!lightbox || !commentText.trim()) return;
    const comment = {
      id: generateId(),
      text: commentText.trim(),
      author: commentAuthor.trim() || "Anonimno",
      createdAt: new Date().toISOString(),
    };
    addComment(lightbox.id, comment);
    // Update local state immediately
    const updated = localPhotos.map((p) =>
      p.id === lightbox.id
        ? { ...p, comments: [...(p.comments ?? []), comment] }
        : p
    );
    setLocalPhotos(updated);
    setLightbox(updated.find((p) => p.id === lightbox.id) ?? null);
    setCommentText("");
    setCommentAuthor("");
  }

  if (localPhotos.length === 0) {
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
        {localPhotos.map((photo) => (
          <div key={photo.id} className="gallery-item">
            <img
              src={photo.imageData}
              alt={photo.caption || "Fotografija"}
              className="gallery-item__img"
              onClick={() => { setLightbox(photo); setCommentText(""); setCommentAuthor(""); }}
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
          <div className="lightbox__content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox__close" onClick={() => setLightbox(null)}>✕</button>
            <img
              src={lightbox.imageData}
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

              {/* Komentarji */}
              <div className="lightbox__comments">
                <h4 className="lightbox__comments-title">
                  Komentarji {lightbox.comments?.length ? `(${lightbox.comments.length})` : ""}
                </h4>

                {(lightbox.comments ?? []).length === 0 && (
                  <p className="lightbox__comments-empty">Še ni komentarjev. Bodi prvi!</p>
                )}

                {(lightbox.comments ?? []).map((c) => (
                  <div key={c.id} className="lightbox__comment">
                    <span className="lightbox__comment-author">{c.author}</span>
                    <span className="lightbox__comment-text">{c.text}</span>
                    <span className="lightbox__comment-date">
                      {new Date(c.createdAt).toLocaleDateString("sl-SI")}
                    </span>
                  </div>
                ))}

                <div className="lightbox__comment-form">
                  <input
                    type="text"
                    className="input"
                    placeholder="Tvoje ime (neobvezno)"
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    maxLength={40}
                  />
                  <textarea
                    className="input lightbox__comment-textarea"
                    placeholder="Napiši komentar..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    maxLength={300}
                    rows={2}
                  />
                  <button
                    className="btn btn--primary btn--sm"
                    onClick={handleAddComment}
                    disabled={!commentText.trim()}
                  >
                    Objavi komentar
                  </button>
                </div>
              </div>

              <div className="lightbox__actions">
                <button
                  className="btn btn--outline btn--sm"
                  onClick={() => { onLocatePhoto(lightbox.lat, lightbox.lng); setLightbox(null); }}
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
