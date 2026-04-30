"use client";

import { useState, useRef, useEffect } from "react";
import { submitPhoto } from "../data/photoStore";
import { IconCamera, IconGallery } from "./Icons";

interface Props {
  lat: number;
  lng: number;
  poiName: string;
  onClose: () => void;
  onSuccess: () => void;
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

export default function PhotoUploadModal({ lat, lng, poiName, onClose, onSuccess }: Props) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [caption, setCaption] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState(0);
  const [kraj, setKraj] = useState("");
  const [geocoding, setGeocoding] = useState(true);
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setGeocoding(true);
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=sl`,
      { headers: { "User-Agent": "UrsljaGoraApp/1.0" } }
    )
      .then((r) => r.json())
      .then((data) => {
        const a = data.address;
        setKraj(a?.peak || a?.village || a?.hamlet || a?.suburb || a?.town || a?.city || a?.county || "");
      })
      .catch(() => setKraj(""))
      .finally(() => setGeocoding(false));
  }, [lat, lng]);

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
    if (!photoBlob) return;
    setUploading(true);
    setSubmitError(false);
    try {
      await submitPhoto({
        blob: photoBlob,
        lat,
        lng,
        caption,
        author: authorName || "Anonimno",
        rating: rating > 0 ? rating : undefined,
        kraj: kraj.trim() || undefined,
      });
      setSubmitSuccess(true);
      setTimeout(() => { onSuccess(); onClose(); }, 2500);
    } catch {
      setSubmitError(true);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="photo-modal-overlay" onClick={onClose}>
      <div className="photo-modal" onClick={(e) => e.stopPropagation()}>
        <button className="photo-modal__close" onClick={onClose}>✕</button>

        <div className="photo-modal__header">
          <span className="photo-modal__icon">📷</span>
          <div>
            <h3 className="photo-modal__title">Dodaj fotografijo</h3>
            <p className="photo-modal__poi">{poiName}</p>
          </div>
        </div>

        {submitSuccess ? (
          <div className="upload-success">✓ Fotografija je bila poslana! Po pregledu bo vidna v galeriji.</div>
        ) : (
          <>
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
              <>
                <div className="upload-preview">
                  <img src={photoPreview} alt="Predogled" className="upload-preview__img" />
                  <button className="upload-preview__remove" onClick={() => { setPhotoPreview(null); setPhotoBlob(null); }}>✕</button>
                </div>

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

                {submitError && <p className="upload-error">Napaka pri pošiljanju. Poskusi znova.</p>}

                <button
                  className="btn btn--success"
                  onClick={handlePublish}
                  disabled={uploading || !gdprAccepted}
                >
                  {uploading ? "Pošiljam..." : "✓ Objavi fotografijo"}
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
