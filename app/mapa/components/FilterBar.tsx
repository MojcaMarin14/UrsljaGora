"use client";

import { categoryConfig, POICategory } from "../data/pois";

interface FilterBarProps {
  activeFilters: POICategory[];
  onToggleFilter: (cat: POICategory) => void;
}

const filterOrder: POICategory[] = [
  "koca",
  "cerkev",
  "oddajnik",
  "gostilna",
  "fotografija",
];

export default function FilterBar({
  activeFilters,
  onToggleFilter,
}: FilterBarProps) {
  return (
    <div className="filter-bar">
      {filterOrder.map((cat) => {
        const config = categoryConfig[cat];
        const isActive = activeFilters.includes(cat);

        return (
          <button
            key={cat}
            className={`filter-btn ${isActive ? "filter-btn--active" : ""}`}
            style={
              isActive
                ? { background: config.color, borderColor: config.color }
                : {}
            }
            onClick={() => onToggleFilter(cat)}
          >
            <span
              className="filter-btn__dot"
              style={{ background: isActive ? "#fff" : config.color }}
            />
            <span className="filter-btn__label">{config.label}</span>
          </button>
        );
      })}
    </div>
  );
}
