"use client";

import { useState, useEffect, useRef } from "react";
import { fetchAPI, getStrapiMedia } from "../../lib/api";

interface Pohvala {
  id: number;
  ime?: string;
  sporocilo: string;
  ocena?: number;
  createdAt: string;
  slika?: { url: string; alternativeText?: string };
}

async function loadPohvale(): Promise<Pohvala[]> {
  const res = await fetchAPI("pohvalas?filters[odobrena][$eq]=true&sort=createdAt:desc&populate=slika");
  return res.data.map((item: Record<string, unknown>) => ({
    id: item.id as number,
    ime: (item.ime as string) || undefined,
    sporocilo: item.sporocilo as string,
    ocena: (item.ocena as number) || undefined,
    createdAt: item.createdAt as string,
    slika: item.slika as Pohvala["slika"],
  }));
}

async function submitPohvala(data: { ime?: string; sporocilo: string; ocena?: number }, photo: File | null) {
  const payload = { ime: data.ime || null, sporocilo: data.sporocilo, ocena: data.ocena || null };
  if (photo) {
    const form = new FormData();
    form.append("data", JSON.stringify(payload));
    form.append("files", photo);
    await fetchAPI("pohvalas", { method: "POST", body: form, signal: AbortSignal.timeout(30000) });
  } else {
    await fetchAPI("pohvalas", { method: "POST", body: JSON.stringify({ data: payload }) });
  }
}

function Stars({ value }: { value?: number }) {
  if (!value) return null;
  return (
    <span className="gb-stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} style={{ color: n <= value ? "#c9a96e" : "#ddd" }}>★</span>
      ))}
    </span>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="gb-star-picker">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`Ocena ${n} od 5`}
          aria-pressed={value === n}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(value === n ? 0 : n)}
          style={{ color: (hovered || value) >= n ? "#c9a96e" : "#ddd", fontSize: "1.4rem", background: "none", border: "none", cursor: "pointer", padding: "0 2px" }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function GuestBook() {
  const [showBubble, setShowBubble] = useState(false);
  const [open, setOpen] = useState(false);
  const [pohvale, setPohvale] = useState<Pohvala[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [view, setView] = useState<"list" | "form">("list");
  const [ime, setIme] = useState("");
  const [sporocilo, setSporocilo] = useState("");
  const [ocena, setOcena] = useState(0);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoError, setPhotoError] = useState("");
  const photoInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!photo) { setPhotoPreview(""); return; }
    const url = URL.createObjectURL(photo);
    setPhotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);
  const [gdpr, setGdpr] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const bubbleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const show = setTimeout(() => setShowBubble(true), 1500);
    const hide = setTimeout(() => setShowBubble(false), 5500);
    bubbleTimerRef.current = hide;
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, []);

  function refreshPohvale() {
    setLoading(true);
    setLoadError(false);
    loadPohvale()
      .then(setPohvale)
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }

  function handleOpen() {
    setOpen(true);
    setView("form");
    setSuccess(false);
    setError(false);
    setShowBubble(false);
    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    refreshPohvale();
  }

  async function handleSubmit() {
    if (submitting || !gdpr || !sporocilo.trim() || photoError) return;
    setSubmitting(true);
    setError(false);
    try {
      await submitPohvala({ ime: ime.trim() || undefined, sporocilo: sporocilo.trim(), ocena: ocena > 0 ? ocena : undefined }, photo);
      setSuccess(true);
      setIme(""); setSporocilo(""); setOcena(0); setGdpr(false); setPhoto(null); setPhotoError("");
      // Keep the moderation confirmation visible until the visitor changes tabs or closes it.
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="gb-fab-wrap">
        {showBubble && (
          <button type="button" className="gb-bubble" style={{ border: 0 }} onClick={handleOpen}>
            Dodaj pohvalo
          </button>
        )}
        <button type="button" className="gb-fab" onClick={handleOpen} aria-label="Dodaj pohvalo">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
            <line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/>
          </svg>
        </button>
      </div>

      {open && (
        <div className="gb-overlay" onClick={() => setOpen(false)}>
          <div className="gb-modal" role="dialog" aria-modal="true" aria-labelledby="guestbook-title" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="gb-close" aria-label="Zapri knjigo pripomb in pohval" onClick={() => setOpen(false)}>✕</button>

            <div className="gb-header">
              <span className="gb-header__icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                  <line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/>
                </svg>
              </span>
              <div>
                <h3 id="guestbook-title" className="gb-header__title">Knjiga pripomb in pohval</h3>
                <p className="gb-header__sub">Dom na Uršlji gori</p>
              </div>
            </div>

            <div className="gb-tabs">
              <button className={`gb-tab ${view === "list" ? "gb-tab--active" : ""}`} onClick={() => { setView("list"); refreshPohvale(); }}>
                Pohvale {pohvale.length > 0 && <span className="gb-tab__count">{pohvale.length}</span>}
              </button>
              <button className={`gb-tab ${view === "form" ? "gb-tab--active" : ""}`} onClick={() => { setView("form"); setSuccess(false); setError(false); }}>
                + Napiši
              </button>
            </div>

            {view === "list" && (
              <div className="gb-list">
                {loading ? (
                  <p role="status">Nalaganje pohval…</p>
                ) : loadError ? (
                  <p className="gb-error" role="alert">Pohval trenutno ni mogoče naložiti. Poskusi znova pozneje.</p>
                ) : pohvale.length === 0 ? (
                  <div className="gb-empty">
                    <p>Še ni nobene pohvale.</p>
                    <p className="gb-empty__sub">Bodi prvi/-a!</p>
                  </div>
                ) : (
                  pohvale.map((p) => (
                    <div key={p.id} className="gb-entry">
                      <div className="gb-entry__top">
                        <span className="gb-entry__name">{p.ime || "Anonimno"}</span>
                        <Stars value={p.ocena} />
                        <span className="gb-entry__date">{new Date(p.createdAt).toLocaleDateString("sl-SI")}</span>
                      </div>
                      <p className="gb-entry__text">{p.sporocilo}</p>
                      {p.slika?.url && <img className="gb-entry__photo" src={getStrapiMedia(p.slika.url)} alt={p.slika.alternativeText || "Fotografija ob pohvali"} loading="lazy" />}
                    </div>
                  ))
                )}
              </div>
            )}

            {view === "form" && (
              <form className="gb-form" onSubmit={(event) => { event.preventDefault(); void handleSubmit(); }}>
                {success ? (
                  <div className="gb-success" role="status">✓ Hvala! Vaš zapis bo po pregledu objavljen.</div>
                ) : (
                  <>
                    <input
                      className="gb-input"
                      type="text"
                      autoFocus
                      placeholder="Vaše ime (neobvezno)"
                      value={ime}
                      onChange={(e) => setIme(e.target.value)}
                      maxLength={60}
                    />
                    <textarea
                      className="gb-textarea"
                      placeholder="Vaše sporočilo, izkušnja ali pohvala..."
                      value={sporocilo}
                      onChange={(e) => setSporocilo(e.target.value)}
                      maxLength={500}
                      rows={4}
                    />
                    <div className="gb-rating-row">
                      <span className="gb-rating-label">Ocena:</span>
                      <StarPicker value={ocena} onChange={setOcena} />
                    </div>
                    <div className="gb-photo">
                      <button
                        type="button" className="gb-photo__add" disabled={submitting}
                        aria-controls="guestbook-photo" aria-describedby="guestbook-photo-help"
                        onClick={() => photoInputRef.current?.click()}
                      >
                        <span className="gb-photo__add-icon" aria-hidden="true">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </span>
                        <span>{photo ? "Zamenjaj fotografijo" : "Dodaj fotografijo"}<small>Neobvezno</small></span>
                      </button>
                      <input
                        ref={photoInputRef} id="guestbook-photo" type="file" hidden aria-label="Izberi fotografijo"
                        accept="image/jpeg,image/png,image/webp,image/avif" disabled={submitting}
                        aria-describedby="guestbook-photo-help"
                        onChange={(event) => {
                          const file = event.target.files?.[0] || null;
                          setPhotoError(""); setPhoto(null);
                          if (file && (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type) || file.size > 5 * 1024 * 1024)) {
                            setPhotoError("Izberi JPG, PNG, WebP ali AVIF fotografijo do 5 MB.");
                            event.target.value = "";
                            return;
                          }
                          setPhoto(file);
                        }}
                      />
                      <small id="guestbook-photo-help">Ena fotografija do 5 MB (JPG, PNG, WebP ali AVIF). Javna bo šele po odobritvi skrbnika.</small>
                      {photoPreview && <div className="gb-photo__preview">
                        <img src={photoPreview} alt="Predogled priložene fotografije" />
                        <button type="button" disabled={submitting} onClick={() => { setPhoto(null); setPhotoError(""); if (photoInputRef.current) photoInputRef.current.value = ""; }}>Odstrani fotografijo</button>
                      </div>}
                      {photoError && <p className="gb-error" role="alert">{photoError}</p>}
                    </div>
                    <label className="gb-gdpr">
                      <input type="checkbox" checked={gdpr} onChange={(e) => setGdpr(e.target.checked)} />
                      <span>Strinjam se z javno objavo sporočila{photo ? " in priložene fotografije" : ""}.{" "}
                        <a href="/politikaZasebnosti" target="_blank" rel="noopener noreferrer">Politika zasebnosti</a>
                      </span>
                    </label>
                    {error && <p className="gb-error" role="alert">Napaka pri pošiljanju. Poskusi znova.</p>}
                    <button
                      className="gb-submit"
                      type="submit"
                      disabled={submitting || !sporocilo.trim() || !gdpr || !!photoError}
                    >
                      {submitting ? "Pošiljam..." : "✓ Pošlji"}
                    </button>
                  </>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
