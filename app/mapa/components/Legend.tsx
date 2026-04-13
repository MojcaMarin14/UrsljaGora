"use client";

import { categoryConfig, POICategory } from "../data/pois";

const legendItems: POICategory[] = [
  "koca",
  "cerkev",
  "gostilna",
  "dogodek",
  "fotografija",
];

const trailLegend = [
  { label: "Lahka pot", color: "#457b9d" },
  { label: "Srednja pot", color: "#2d6a4f" },
  { label: "Zahtevna pot", color: "#c1121f" },
];

export default function Legend() {
  return (
    <div className="legend">
      <h4 className="legend__title">LEGENDA</h4>

      <div className="legend__group">
        <span className="legend__group-label">Poti</span>
        {trailLegend.map((item) => (
          <div key={item.label} className="legend__item">
            <span
              className="legend__line"
              style={{ background: item.color }}
            />
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <div className="legend__group">
        <span className="legend__group-label">Točke</span>
        {legendItems.map((cat) => {
          const config = categoryConfig[cat];
          return (
            <div key={cat} className="legend__item">
              <span
                className="legend__dot"
                style={{ background: config.color }}
              />
              <span>{config.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
