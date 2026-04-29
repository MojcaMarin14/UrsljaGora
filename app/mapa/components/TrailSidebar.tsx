"use client";

import { trails, Trail } from "../data/trails";
import { IconTrails, IconRuler, IconClock, IconMountain, IconInfo } from "./Icons";

const difficultyBadge = {
  lahka: { bg: "#d8f3dc", text: "#1b4332", label: "Lahka" },
  srednja: { bg: "#fefae0", text: "#606c38", label: "Srednja" },
  zahtevna: { bg: "#ffe0e0", text: "#9d0208", label: "Zahtevna" },
};

interface TrailSidebarProps {
  activeTrail: Trail | null;
  onSelectTrail: (trail: Trail | null) => void;
}

export default function TrailSidebar({
  activeTrail,
  onSelectTrail,
}: TrailSidebarProps) {
  return (
    <div className="trail-sidebar">
      <div className="sidebar-section">
        <h3 className="sidebar-title">
          <span className="sidebar-icon"><IconTrails size={16} /></span>
          Pohodniške poti
        </h3>

        <div className="trail-list">
          {trails.map((trail) => {
            const badge = difficultyBadge[trail.difficulty];
            const isActive = activeTrail?.id === trail.id;

            return (
              <button
                key={trail.id}
                className={`trail-card ${isActive ? "trail-card--active" : ""}`}
                onClick={() => onSelectTrail(isActive ? null : trail)}
              >
                <div
                  className="trail-card__color"
                  style={{ background: trail.color }}
                />
                <div className="trail-card__content">
                  <div className="trail-card__header">
                    <span className="trail-card__name">{trail.name}</span>
                    <span
                      className="trail-card__badge"
                      style={{ background: badge.bg, color: badge.text }}
                    >
                      {badge.label}
                    </span>
                  </div>
                  <div className="trail-card__stats">
                    <span><IconRuler size={13} /> {trail.distance}</span>
                    <span><IconClock size={13} /> {trail.duration}</span>
                    <span><IconMountain size={13} /> {trail.elevation}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {activeTrail && (
        <div className="sidebar-section trail-detail">
          <h3 className="sidebar-title">
            <span className="sidebar-icon"><IconInfo size={16} /></span>
            Podrobnosti poti
          </h3>
          <h4 className="trail-detail__name">{activeTrail.name}</h4>
          <p className="trail-detail__desc">{activeTrail.description}</p>
          <div className="trail-detail__route">
            <span className="trail-detail__route-from">🚶 {activeTrail.startPoint}</span>
            <span className="trail-detail__route-arrow">↓</span>
            <span className="trail-detail__route-to">🏔️ {activeTrail.endPoint}</span>
          </div>
          <div className="trail-detail__grid">
            <div className="trail-detail__stat">
              <span className="trail-detail__stat-label">Razdalja</span>
              <span className="trail-detail__stat-value">{activeTrail.distance}</span>
            </div>
            <div className="trail-detail__stat">
              <span className="trail-detail__stat-label">Čas hoje</span>
              <span className="trail-detail__stat-value">{activeTrail.duration}</span>
            </div>
            <div className="trail-detail__stat">
              <span className="trail-detail__stat-label">Višinska razlika</span>
              <span className="trail-detail__stat-value">{activeTrail.elevation}</span>
            </div>
            <div className="trail-detail__stat">
              <span className="trail-detail__stat-label">Težavnost</span>
              <span className="trail-detail__stat-value">
                {difficultyBadge[activeTrail.difficulty].label}
              </span>
            </div>
            {activeTrail.descent && (
              <div className="trail-detail__stat">
                <span className="trail-detail__stat-label">Spust</span>
                <span className="trail-detail__stat-value">{activeTrail.descent}</span>
              </div>
            )}
          </div>
          {activeTrail.gpxFile && (
            <a
              href={activeTrail.gpxFile}
              download
              className="trail-detail__gpx-btn"
            >
              ⬇ Prenesi GPX
            </a>
          )}
          {activeTrail.source && (
            <p className="trail-detail__source">Vir: {activeTrail.source}</p>
          )}
        </div>
      )}
    </div>
  );
}
