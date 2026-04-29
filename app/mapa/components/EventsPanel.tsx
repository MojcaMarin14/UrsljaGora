"use client";

import { useState, useRef, useEffect } from "react";
import { pois } from "../data/pois";
import { CommunityPhoto, submitPhoto } from "../data/photoStore";
import PhotoGallery from "./PhotoGallery";
import { IconGallery, IconCamera, IconCalendar, IconPin } from "./Icons";

interface EventsPanelProps {
  isAddingPhoto: boolean;
  onToggleAddPhoto: () => void;
  photoMarker: { lat: number; lng: number } | null;
  photos: CommunityPhoto[];
  onPhotosChanged: () => void;
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
  onLocatePhoto,
  onLocateEvent,
  defaultTab,
}: EventsPanelProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [caption, setCaption] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState(0);
  const [activeSection, setActiveSection] = useState<"upload" | "gallery" | "events">(defaultTab ?? "gallery");
  const [uploading, setUploading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const [kraj, setKraj] = useState("");
  const [geocoding, setGeocoding] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const events = pois.filter((p) => p.category === "dogodek");

  useEffect(() => {
    if (defaultTab) setActiveSection(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    if (!photoMarker) return;
    setGeocoding(true);
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${photoMarker.lat}&lon=${photoMarker.lng}&accept-language=sl`,
      { headers: { "User-Agent": "UrsljaGoraApp/1.0" } }
    )
      .then((r) => r.json())
      .then((data) => {
        const a = data.address;
        const name = a?.peak || a?.village || a?.hamlet || a?.suburb || a?.town || a?.city || a?.county || "";
        setKraj(name);
      })
      .catch(() => setKraj(""))
      .finally(() => setGeocoding(false));
  }, [photoMarker]);

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
        canvas.toBlob((blob) => { if (blob) setPhotoBlob(blob); }, "image/jpeg", 0.8);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  async function handlePublish() {
    if (!photoBlob || !photoMarker) return;
    setUploading(true);
    setSubmitError(false);
    try {
      await submitPhoto({
        blob: photoBlob,
        lat: photoMarker.lat,
        lng: photoMarker.lng,
        caption,
        author: authorName || "Anonimno",
        rating: rating > 0 ? rating : undefined,
        kraj: kraj.trim() || undefined,
      });
      setSubmitSuccess(true);
      setPhotoPreview(null);
      setPhotoBlob(null);
      setCaption("");
      setAuthorName("");
      setRating(0);
      if (isAddingPhoto) onToggleAddPhoto();
      onPhotosChanged();
      setTimeout(() => { setSubmitSuccess(false); setActiveSection("gallery"); }, 3000);
    } catch {
      setSubmitError(true);
    } finally {
      setUploading(false);
    }
  }

  function resetUpload() {
    setPhotoPreview(null);
    setPhotoBlob(null);
    setCaption("");
    setRating(0);
    setKraj("");
    setSubmitError(false);
    setGdprAccepted(false);
    if (isAddingPhoto) onToggleAddPhoto();
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
      </div>

      {/* ── Galerija ── */}
      {activeSection === "gallery" && (
        <div className="sidebar-section">
          <h3 className="sidebar-title">
            <span className="sidebar-icon"><IconGallery size={16} /></span>
            Skupna galerija
          </h3>
          <PhotoGallery
            photos={photos}
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

          {submitSuccess && (
            <div className="upload-success">
              ✓ Fotografija je bila poslana! Po pregledu bo vidna v galeriji.
            </div>
          )}

          {!submitSuccess && (
            <>
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
                    <input
                      type="text"
                      className="input"
                      placeholder={geocoding ? "Iščem kraj..." : "Ime kraja (neobvezno)"}
                      value={kraj}
                      onChange={(e) => setKraj(e.target.value)}
                      maxLength={80}
                    />
                  </div>

                  <StarPicker value={rating} onChange={setRating} />

                  <label className="gdpr-checkbox">
                    <input
                      type="checkbox"
                      checked={gdprAccepted}
                      onChange={(e) => setGdprAccepted(e.target.checked)}
                    />
                    <span>
                      Strinjam se, da se moja fotografija in ime javno objavita na tej spletni strani.{" "}
                      <a href="/politikaZasebnosti" target="_blank" rel="noopener noreferrer">
                        Politika zasebnosti
                      </a>
                    </span>
                  </label>

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

                  {submitError && (
                    <p className="upload-error">Napaka pri pošiljanju. Poskusi znova.</p>
                  )}

                  {photoMarker && (
                    <button
                      className="btn btn--success"
                      onClick={handlePublish}
                      disabled={uploading || !gdprAccepted}
                    >
                      {uploading ? "Pošiljam..." : "✓ Objavi fotografijo"}
                    </button>
                  )}
                </>
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
    </div>
  );
}
