"use client";

import { IconTrails, IconGallery, IconCamera } from "./Icons";

export type MobilePanel = "trails" | "gallery" | null;

interface MobileNavProps {
  activePanel: MobilePanel;
  onSelect: (panel: MobilePanel) => void;
  onAddClick: () => void;
  photoCount: number;
}

export default function MobileNav({ activePanel, onSelect, onAddClick, photoCount }: MobileNavProps) {
  function toggle(panel: MobilePanel) {
    onSelect(activePanel === panel ? null : panel);
  }

  return (
    <nav className="mobile-bottom-nav">
      <button
        className={`mobile-bottom-nav__btn ${activePanel === "trails" ? "mobile-bottom-nav__btn--active" : ""}`}
        onClick={() => toggle("trails")}
      >
        <IconTrails size={22} />
        <span>Poti</span>
      </button>

      <button
        className="mobile-bottom-nav__add"
        onClick={onAddClick}
        title="Dodaj fotografijo"
      >
        <IconCamera size={22} />
      </button>

      <button
        className={`mobile-bottom-nav__btn ${activePanel === "gallery" ? "mobile-bottom-nav__btn--active" : ""}`}
        onClick={() => toggle("gallery")}
      >
        <IconGallery size={22} />
        <span>
          Galerija
          {photoCount > 0 && <span className="mobile-bottom-nav__badge">{photoCount}</span>}
        </span>
      </button>
    </nav>
  );
}
