"use client";

import { useState, useRef } from "react";
import { pois } from "../data/pois";
import {
  CommunityPhoto,
  savePhoto,
  generateId,
} from "../data/photoStore";
import PhotoGallery from "./PhotoGallery";
import { IconGallery, IconCamera, IconCalendar, IconPin, IconPlus, IconMap } from "./Icons";

interface EventsPanelProps {
  isAddingPhoto: boolean;
  onToggleAddPhoto: () => void;
  photoMarker: { lat: number; lng: number } | null;
  photos: CommunityPhoto[];
  onPhotosChanged: () => void;
  isAdmin: boolean;
  onLocatePhoto: (lat: number, lng: number) => void;
  onLocateEvent: (lat: number, lng: number) => void;
}

export default function EventsPanel({
  isAddingPhoto,
  onToggleAddPhoto,
  photoMarker,
  photos,
  onPhotosChanged,
  isAdmin,
  onLocatePhoto,
  onLocateEvent,
}: EventsPanelProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [activeSection, setActiveSection] = useState<"upload" | "gallery" | "events">("gallery");
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const events = pois.filter((p) => p.category === "dogodek");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX = 1200;
        let w = img.width;
        let h = img.height;
        if (w > MAX || h > MAX) {
          if (w > h) { h = (h * MAX) / w; w = MAX; }
          else { w = (w * MAX) / h; h = MAX; }
        }
        canvas.width = w;
        canvas.height = h;
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
    };
    savePhoto(photo);
    onPhotosChanged();
    setPhotoPreview(null);
    setCaption("");
    if (isAddingPhoto) onToggleAddPhoto();
    setActiveSection("gallery");
  }

  function resetUpload() {
    setPhotoPreview(null);
    setCaption("");
    if (isAddingPhoto) onToggleAddPhoto();
  }

  return (
    <div className="events-panel">
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
      </div>

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
          )}

          {photoPreview && (
            <>
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
    </div>
  );
}
