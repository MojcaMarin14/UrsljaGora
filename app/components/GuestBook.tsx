"use client";

import { useState, useEffect, useRef } from "react";
import { fetchAPI } from "../../lib/api";

interface Pohvala {
  id: number;
  ime?: string;
  sporocilo: string;
  ocena?: number;
  createdAt: string;
}

async function loadPohvale(): Promise<Pohvala[]> {
  try {
    const res = await fetchAPI("pohvalas?filters[odobrena][$eq]=true&sort=createdAt:desc");
    return res.data.map((item: Record<string, unknown>) => ({
      id: item.id as number,
      ime: (item.ime as string) || undefined,
      sporocilo: item.sporocilo as string,
      ocena: (item.ocena as number) || undefined,
      createdAt: item.createdAt as string,
    }));
  } catch {
    return [];
  }
}

async function submitPohvala(data: { ime?: string; sporocilo: string; ocena?: number }) {
  await fetchAPI("pohvalas", {
    method: "POST",
    body: JSON.stringify({
      data: {
        ime: data.ime || null,
        sporocilo: data.sporocilo,
        ocena: data.ocena || null,
        odobrena: false,
      },
    }),
  });
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
  const [view, setView] = useState<"list" | "form">("list");
  const [ime, setIme] = useState("");
  const [sporocilo, setSporocilo] = useState("");
  const [ocena, setOcena] = useState(0);
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

  function handleOpen() {
    setOpen(true);
    setShowBubble(false);
    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    loadPohvale().then(setPohvale);
  }

  async function handleSubmit() {
    if (!sporocilo.trim()) return;
    setSubmitting(true);
    setError(false);
    try {
      await submitPohvala({ ime: ime.trim() || undefined, sporocilo: sporocilo.trim(), ocena: ocena > 0 ? ocena : undefined });
      setSuccess(true);
      setIme(""); setSporocilo(""); setOcena(0); setGdpr(false);
      setTimeout(() => { setSuccess(false); setView("list"); }, 3000);
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
          <div className="gb-bubble" onClick={handleOpen}>
            Dodaj pohvalo
          </div>
        )}
        <button className="gb-fab" onClick={handleOpen} aria-label="Knjiga pripomb in pohval">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
            <line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/>
          </svg>
        </button>
      </div>

      {open && (
        <div className="gb-overlay" onClick={() => setOpen(false)}>
          <div className="gb-modal" onClick={(e) => e.stopPropagation()}>
            <button className="gb-close" onClick={() => setOpen(false)}>✕</button>

            <div className="gb-header">
              <span className="gb-header__icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                  <line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/>
                </svg>
              </span>
              <div>
                <h3 className="gb-header__title">Knjiga pripomb in pohval</h3>
                <p className="gb-header__sub">Dom na Uršlji gori</p>
              </div>
            </div>

            <div className="gb-tabs">
              <button className={`gb-tab ${view === "list" ? "gb-tab--active" : ""}`} onClick={() => setView("list")}>
                Pohvale {pohvale.length > 0 && <span className="gb-tab__count">{pohvale.length}</span>}
              </button>
              <button className={`gb-tab ${view === "form" ? "gb-tab--active" : ""}`} onClick={() => setView("form")}>
                + Napiši
              </button>
            </div>

            {view === "list" && (
              <div className="gb-list">
                {pohvale.length === 0 ? (
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
                    </div>
                  ))
                )}
              </div>
            )}

            {view === "form" && (
              <div className="gb-form">
                {success ? (
                  <div className="gb-success">✓ Hvala! Vaš zapis bo po pregledu objavljen.</div>
                ) : (
                  <>
                    <input
                      className="gb-input"
                      type="text"
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
                    <label className="gb-gdpr">
                      <input type="checkbox" checked={gdpr} onChange={(e) => setGdpr(e.target.checked)} />
                      <span>Strinjam se z javno objavo sporočila.{" "}
                        <a href="/politikaZasebnosti" target="_blank" rel="noopener noreferrer">Politika zasebnosti</a>
                      </span>
                    </label>
                    {error && <p className="gb-error">Napaka pri pošiljanju. Poskusi znova.</p>}
                    <button
                      className="gb-submit"
                      onClick={handleSubmit}
                      disabled={submitting || !sporocilo.trim() || !gdpr}
                    >
                      {submitting ? "Pošiljam..." : "✓ Pošlji"}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
