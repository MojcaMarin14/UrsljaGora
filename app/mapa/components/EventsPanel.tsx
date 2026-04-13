"use client";

import { useState, useRef, useEffect } from "react";
import { pois } from "../data/pois";
import {
  CommunityPhoto,
  savePhoto,
  generateId,
  checkAdminPin,
  saveAdminSession,
  clearAdminSession,
} from "../data/photoStore";
import PhotoGallery from "./PhotoGallery";
import { IconGallery, IconCamera, IconCalendar, IconPin } from "./Icons";

interface EventsPanelProps {
  isAddingPhoto: boolean;
  onToggleAddPhoto: () => void;
  photoMarker: { lat: number; lng: number } | null;
  photos: CommunityPhoto[];
  onPhotosChanged: () => void;
  isAdmin: boolean;
  onAdminChange: (v: boolean) => void;
  onLocatePhoto: (lat: number, lng: number) => void;
  onLocateEvent: (lat: number, lng: number) => void;
  defaultTab?: "upload" | "gallery" | "events";
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="star-picker">
      <span className="star-picker__label">Ocena (neobvezno):</span>
      <div className="star-picker__stars">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={`star-picker__star ${(hovered || value) >= n ? "star-picker__star--active" : ""}`}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(value === n ? 0 : n)}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}

export default function EventsPanel({
  isAddingPhoto,
  onToggleAddPhoto,
  photoMarker,
  photos,
  onPhotosChanged,
  isAdmin,
  onAdminChange,
  onLocatePhoto,
  onLocateEvent,
  defaultTab,
}: EventsPanelProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState(0);
  const [activeSection, setActiveSection] = useState<"upload" | "gallery" | "events">(defaultTab ?? "gallery");

  const [showAdminModal, setShowAdminModal] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const events = pois.filter((p) => p.category === "dogodek");

  useEffect(() => {
    if (defaultTab) setActiveSection(defaultTab);
  }, [defaultTab]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX = 1200;
        let w = img.width, h = img.height;
        if (w > MAX || h > MAX) {
          if (w > h) { h = (h * MAX) / w; w = MAX; }
          else { w = (w * MAX) / h; h = MAX; }
        }
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
        setPhotoPreview(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  function handlePublish() {
    if (!photoPreview || !photoMarker) return;
    const photo: CommunityPhoto = {
      id: generateId(),
      lat: photoMarker.lat,
      lng: photoMarker.lng,
      imageData: photoPreview,
      caption,
      author: authorName || "Anonimno",
      createdAt: new Date().toISOString(),
      rating: rating > 0 ? rating : undefined,
      comments: [],
    };
    savePhoto(photo);
    onPhotosChanged();
    setPhotoPreview(null);
    setCaption("");
    setRating(0);
    if (isAddingPhoto) onToggleAddPhoto();
    setActiveSection("gallery");
  }

  function resetUpload() {
    setPhotoPreview(null);
    setCaption("");
    setRating(0);
    if (isAddingPhoto) onToggleAddPhoto();
  }

  function handleAdminLogin() {
    if (checkAdminPin(pinInput)) {
      saveAdminSession();
      onAdminChange(true);
      setShowAdminModal(false);
      setPinInput("");
      setPinError(false);
    } else {
      setPinError(true);
    }
  }

  function handleAdminLogout() {
    clearAdminSession();
    onAdminChange(false);
  }

  return (
    <div className="events-panel">
      {/* ── Tabs ── */}
      <div className="section-tabs">
        <button
          className={`section-tab ${activeSection === "gallery" ? "section-tab--active" : ""}`}
          onClick={() => setActiveSection("gallery")}
        >
          <IconGallery size={15} /> Galerija <span className="section-tab__count">{photos.length}</span>
        </button>
        <button
          className={`section-tab ${activeSection === "upload" ? "section-tab--active" : ""}`}
          onClick={() => setActiveSection("upload")}
        >
          <IconCamera size={15} /> Dodaj
        </button>
        <button
          className={`section-tab ${activeSection === "events" ? "section-tab--active" : ""}`}
          onClick={() => setActiveSection("events")}
        >
          <IconCalendar size={15} /> Dogodki
        </button>
        {isAdmin ? (
          <button className="section-tab admin-tab admin-tab--active" onClick={handleAdminLogout} title="Odjava iz admin načina">
            🔓
          </button>
        ) : (
          <button className="section-tab admin-tab" onClick={() => setShowAdminModal(true)} title="Admin prijava">
            🔒
          </button>
        )}
      </div>

      {isAdmin && (
        <div className="admin-bar">
          <div className="admin-bar__active">
            <span>🔓 Admin način — lahko brišeš fotografije</span>
            <button className="admin-bar__logout" onClick={handleAdminLogout}>Odjava</button>
          </div>
        </div>
      )}

      {/* ── Galerija ── */}
      {activeSection === "gallery" && (
        <div className="sidebar-section">
          <h3 className="sidebar-title">
            <span className="sidebar-icon"><IconGallery size={16} /></span>
            Skupna galerija
          </h3>
          <PhotoGallery
            photos={photos}
            isAdmin={isAdmin}
            onPhotoDeleted={onPhotosChanged}
            onLocatePhoto={onLocatePhoto}
          />
        </div>
      )}

      {/* ── Upload ── */}
      {activeSection === "upload" && (
        <div className="sidebar-section">
          <h3 className="sidebar-title">
            <span className="sidebar-icon"><IconCamera size={16} /></span>
            Dodaj fotografijo
          </h3>
          <p className="events-panel__hint">
            Izberi sliko iz galerije ali pa slikaj s kamero. Nato izberi lokacijo na mapi.
          </p>

          <div className="upload-sources">
            <button className="upload-source-btn" onClick={() => fileRef.current?.click()}>
              <span className="upload-source-btn__icon"><IconGallery size={24} /></span>
              <span>Iz galerije</span>
            </button>
            <button className="upload-source-btn" onClick={() => cameraRef.current?.click()}>
              <span className="upload-source-btn__icon"><IconCamera size={24} /></span>
              <span>Slikaj</span>
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="photo-upload__input" />
            <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="photo-upload__input" />
          </div>

          {photoPreview && (
            <div className="upload-preview">
              <img src={photoPreview} alt="Predogled" className="upload-preview__img" />
              <button className="upload-preview__remove" onClick={resetUpload}>✕</button>
            </div>
          )}

          {photoPreview && (
            <>
              <div className="upload-fields">
                <input
                  type="text"
                  className="input"
                  placeholder="Opis fotografije (neobvezno)"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  maxLength={120}
                />
                <input
                  type="text"
                  className="input"
                  placeholder="Tvoje ime (neobvezno)"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  maxLength={40}
                />
              </div>

              <StarPicker value={rating} onChange={setRating} />

              <button
                className={`btn btn--primary ${isAddingPhoto ? "btn--active" : ""}`}
                onClick={onToggleAddPhoto}
              >
                <IconPin size={16} /> {isAddingPhoto ? "Prekliči izbiro" : "Izberi lokacijo na mapi"}
              </button>

              {photoMarker && (
                <div className="upload-location-tag">
                  <IconPin size={14} /> {photoMarker.lat.toFixed(4)}, {photoMarker.lng.toFixed(4)}
                </div>
              )}

              {photoMarker && (
                <button className="btn btn--success" onClick={handlePublish}>
                  ✓ Objavi fotografijo
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* ── Dogodki ── */}
      {activeSection === "events" && (
        <div className="sidebar-section">
          <h3 className="sidebar-title">
            <span className="sidebar-icon"><IconCalendar size={16} /></span>
            Bližnji dogodki
          </h3>
          <div className="events-list">
            {events.map((event) => (
              <div key={event.id} className="event-card">
                <span className="event-card__date">{event.date}</span>
                <h4 className="event-card__name">{event.name}</h4>
                <p className="event-card__desc">{event.description}</p>
                <button
                  className="btn btn--small btn--outline"
                  onClick={() => onLocateEvent(event.lat, event.lng)}
                >
                  <IconPin size={14} /> Prikaži lokacijo
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Admin modal ── */}
      {showAdminModal && (
        <div className="admin-modal-overlay" onClick={() => setShowAdminModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-modal__title">🔒 Admin prijava</h3>
            <p className="admin-modal__desc">Vnesi geslo za upravljanje galerije.</p>
            <input
              type="password"
              className={`input ${pinError ? "input--error" : ""}`}
              placeholder="Geslo"
              value={pinInput}
              onChange={(e) => { setPinInput(e.target.value); setPinError(false); }}
              onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
              autoFocus
            />
            {pinError && <p className="admin-modal__error">Napačno geslo. Poskusi znova.</p>}
            <div className="admin-modal__actions">
              <button className="btn btn--outline btn--sm" onClick={() => setShowAdminModal(false)}>
                Prekliči
              </button>
              <button className="btn btn--primary btn--sm" onClick={handleAdminLogin}>
                Prijava
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
