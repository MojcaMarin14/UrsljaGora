"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Trail } from "./data/trails";
import { POICategory } from "./data/pois";
import { CommunityPhoto, loadPhotos } from "./data/photoStore";
import TrailSidebar from "./components/TrailSidebar";
import FilterBar from "./components/FilterBar";
import EventsPanel from "./components/EventsPanel";
import Legend from "./components/Legend";
import "./mapa.css";

const MapView = dynamic(() => import("./components/MapView"), { ssr: false });

export default function MapPage() {
  const [activeTrail, setActiveTrail] = useState<Trail | null>(null);
  const [activeFilters, setActiveFilters] = useState<POICategory[]>([
    "koca", "cerkev", "oddajnik", "fotografija",
  ]);
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [photoMarker, setPhotoMarker] = useState<{ lat: number; lng: number } | null>(null);
  const [photos, setPhotos] = useState<CommunityPhoto[]>(() => loadPhotos());
  const [flyTo, setFlyTo] = useState<{ lat: number; lng: number } | null>(null);
  const isAdmin = false;

  function handleToggleFilter(cat: POICategory) {
    setActiveFilters((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  function handleMapClick(lat: number, lng: number) {
    if (isAddingPhoto) setPhotoMarker({ lat, lng });
  }

  function handlePhotosChanged() {
    setPhotos(loadPhotos());
  }

  return (
    <div className="map-page">
      {/* Leva stranska vrstica — poti */}
      <aside className="map-page__left">
        <TrailSidebar activeTrail={activeTrail} onSelectTrail={setActiveTrail} />
      </aside>

      {/* Mapa */}
      <div className="map-page__main">
        <FilterBar activeFilters={activeFilters} onToggleFilter={handleToggleFilter} />
        <Legend />
        <MapView
          activeTrail={activeTrail}
          activeFilters={activeFilters}
          onSelectTrail={setActiveTrail}
          onMapClick={handleMapClick}
          photoMarker={photoMarker}
          communityPhotos={photos}
          flyTo={flyTo}
          onFlyToDone={() => setFlyTo(null)}
        />
      </div>

      {/* Desna stranska vrstica — galerija & dogodki */}
      <aside className="map-page__right">
        <EventsPanel
          isAddingPhoto={isAddingPhoto}
          onToggleAddPhoto={() => setIsAddingPhoto((v) => !v)}
          photoMarker={photoMarker}
          photos={photos}
          onPhotosChanged={handlePhotosChanged}
          isAdmin={isAdmin}
          onLocatePhoto={(lat, lng) => setFlyTo({ lat, lng })}
          onLocateEvent={(lat, lng) => setFlyTo({ lat, lng })}
        />
      </aside>
    </div>
  );
}
