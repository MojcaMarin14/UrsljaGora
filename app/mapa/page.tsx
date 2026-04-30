"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { Trail } from "./data/trails";
import { POICategory } from "./data/pois";
import { CommunityPhoto, AdminPoi, loadPhotos, loadAdminPois } from "./data/photoStore";
import TrailSidebar from "./components/TrailSidebar";
import FilterBar from "./components/FilterBar";
import EventsPanel from "./components/EventsPanel";
import Legend from "./components/Legend";
import MobileNav, { MobilePanel } from "./components/MobileNav";
import PhotoUploadModal from "./components/PhotoUploadModal";
import "./mapa.css";

const MapView = dynamic(() => import("./components/MapView"), { ssr: false });

export default function MapPage() {
  const [activeTrail, setActiveTrail] = useState<Trail | null>(null);
  const [activeFilters, setActiveFilters] = useState<POICategory[]>([
    "koca", "cerkev", "oddajnik", "fotografija",
  ]);
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [photoMarker, setPhotoMarker] = useState<{ lat: number; lng: number } | null>(null);
  const [photos, setPhotos] = useState<CommunityPhoto[]>([]);
  const [adminPois, setAdminPois] = useState<AdminPoi[]>([]);
  const [flyTo, setFlyTo] = useState<{ lat: number; lng: number } | null>(null);
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>(null);
  const [mobileUploadTab, setMobileUploadTab] = useState(false);
  const [poiUploadTarget, setPoiUploadTarget] = useState<{ lat: number; lng: number; name: string } | null>(null);

  useEffect(() => {
    loadPhotos().then(setPhotos);
    loadAdminPois().then(setAdminPois);
  }, []);

  function handleToggleFilter(cat: POICategory) {
    setActiveFilters((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  function handleMapClick(lat: number, lng: number) {
    if (isAddingPhoto) setPhotoMarker({ lat, lng });
  }

  async function handlePhotosChanged() {
    setPhotos(await loadPhotos());
  }

  function handlePoiAddPhoto(lat: number, lng: number, name: string) {
    setPoiUploadTarget({ lat, lng, name });
  }

  function handleMobileNav(panel: MobilePanel) {
    setMobilePanel(panel);
    setMobileUploadTab(false);
  }

  function handleMobileAddClick() {
    setMobilePanel("gallery");
    setMobileUploadTab(true);
  }

  return (
    <div className="map-page">
      <h1 className="sr-only">Pohodniška mapa – Uršlja gora</h1>

      <aside className="map-page__left">
        <TrailSidebar activeTrail={activeTrail} onSelectTrail={setActiveTrail} />
      </aside>

      <div className="map-page__main">
        <FilterBar activeFilters={activeFilters} onToggleFilter={handleToggleFilter} />
        <Legend />
        <MapView
          activeTrail={activeTrail}
          activeFilters={activeFilters}
          onSelectTrail={(trail) => {
            setActiveTrail(trail);
            setMobilePanel("trails");
          }}
          onMapClick={handleMapClick}
          photoMarker={photoMarker}
          communityPhotos={photos}
          adminPois={adminPois}
          flyTo={flyTo}
          onFlyToDone={() => setFlyTo(null)}
          onPoiAddPhoto={handlePoiAddPhoto}
        />
      </div>

      <aside className="map-page__right">
        <EventsPanel
          isAddingPhoto={isAddingPhoto}
          onToggleAddPhoto={() => setIsAddingPhoto((v) => !v)}
          photoMarker={photoMarker}
          photos={photos}
          onPhotosChanged={handlePhotosChanged}
          onLocatePhoto={(lat, lng) => setFlyTo({ lat, lng })}
          onLocateEvent={(lat, lng) => setFlyTo({ lat, lng })}
        />
      </aside>

      <div
        className={`mobile-sheet ${mobilePanel === "trails" ? "mobile-sheet--open" : ""}`}
        aria-hidden={mobilePanel !== "trails"}
      >
        <div className="mobile-sheet__handle" onClick={() => setMobilePanel(null)} />
        <TrailSidebar activeTrail={activeTrail} onSelectTrail={setActiveTrail} />
      </div>

      <div
        className={`mobile-sheet ${mobilePanel === "gallery" ? "mobile-sheet--open" : ""}`}
        aria-hidden={mobilePanel !== "gallery"}
      >
        <div className="mobile-sheet__handle" onClick={() => setMobilePanel(null)} />
        <EventsPanel
          isAddingPhoto={isAddingPhoto}
          onToggleAddPhoto={() => setIsAddingPhoto((v) => !v)}
          photoMarker={photoMarker}
          photos={photos}
          onPhotosChanged={handlePhotosChanged}
          onLocatePhoto={(lat, lng) => { setFlyTo({ lat, lng }); setMobilePanel(null); }}
          onLocateEvent={(lat, lng) => { setFlyTo({ lat, lng }); setMobilePanel(null); }}
          defaultTab={mobileUploadTab ? "upload" : "gallery"}
        />
      </div>

      {mobilePanel && (
        <div className="mobile-sheet-overlay" onClick={() => setMobilePanel(null)} />
      )}

      <MobileNav
        activePanel={mobilePanel}
        onSelect={handleMobileNav}
        onAddClick={handleMobileAddClick}
        photoCount={photos.length}
      />

      {poiUploadTarget && (
        <PhotoUploadModal
          lat={poiUploadTarget.lat}
          lng={poiUploadTarget.lng}
          poiName={poiUploadTarget.name}
          onClose={() => setPoiUploadTarget(null)}
          onSuccess={handlePhotosChanged}
        />
      )}
    </div>
  );
}
