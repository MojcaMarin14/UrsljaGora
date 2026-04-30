"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { trails, Trail } from "../data/trails";
import { pois, categoryConfig, POICategory, POI } from "../data/pois";
import { CommunityPhoto, AdminPoi } from "../data/photoStore";

interface TileLayerConfig {
  id: string;
  name: string;
  url: string;
  attribution: string;
  maxZoom: number;
}

const tileLayers: TileLayerConfig[] = [
  {
    id: "topo",
    name: "Topografska",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
    maxZoom: 17,
  },
  {
    id: "osm",
    name: "OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  },
  {
    id: "satellite",
    name: "Satelitska",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "&copy; Esri, Maxar, Earthstar Geographics",
    maxZoom: 19,
  },
];

function createCategoryIcon(category: POICategory) {
  const config = categoryConfig[category];
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width: 32px; height: 32px;
      background: ${config.color};
      border: 2px solid #fff;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 1px 6px rgba(0,0,0,0.25);
    ">${config.svgIcon}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
}

function PoiMarkers({
  filteredPois,
  onPoiAddPhoto,
}: {
  filteredPois: POI[];
  onPoiAddPhoto?: (lat: number, lng: number, name: string) => void;
}) {
  const map = useMap();
  return (
    <>
      {filteredPois.map((poi) => (
        <Marker key={poi.id} position={[poi.lat, poi.lng]} icon={createCategoryIcon(poi.category)}>
          <Popup>
            <div className="poi-popup">
              <strong>{poi.name}</strong>
              {poi.date && <span className="poi-date">{poi.date}</span>}
              <p>{poi.description}</p>
              {onPoiAddPhoto && (
                <button
                  className="poi-popup__add-photo-btn"
                  onClick={() => {
                    map.closePopup();
                    onPoiAddPhoto(poi.lat, poi.lng, poi.name);
                  }}
                >
                  📷 Dodaj sliko tukaj
                </button>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

function FitBounds({ activeTrail }: { activeTrail: Trail | null }) {
  const map = useMap();
  useEffect(() => {
    if (activeTrail) {
      const bounds = L.latLngBounds(activeTrail.path.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [60, 60] });
    }
  }, [activeTrail, map]);
  return null;
}

function LayerSwitcher({
  activeLayer,
  onChangeLayer,
}: {
  activeLayer: string;
  onChangeLayer: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="layer-switcher">
      <button
        className="layer-switcher__toggle"
        onClick={() => setOpen((v) => !v)}
        title="Zamenjaj zemljevid"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      </button>
      {open && (
        <div className="layer-switcher__menu">
          {tileLayers.map((layer) => (
            <button
              key={layer.id}
              className={`layer-switcher__option ${activeLayer === layer.id ? "layer-switcher__option--active" : ""}`}
              onClick={() => { onChangeLayer(layer.id); setOpen(false); }}
            >
              {layer.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface MapViewProps {
  activeTrail: Trail | null;
  activeFilters: POICategory[];
  onSelectTrail: (trail: Trail) => void;
  onMapClick?: (lat: number, lng: number) => void;
  photoMarker?: { lat: number; lng: number } | null;
  communityPhotos?: CommunityPhoto[];
  adminPois?: AdminPoi[];
  flyTo?: { lat: number; lng: number } | null;
  onFlyToDone?: () => void;
  onPoiAddPhoto?: (lat: number, lng: number, name: string) => void;
}

export default function MapView({
  activeTrail,
  activeFilters,
  onSelectTrail,
  onMapClick,
  photoMarker,
  communityPhotos = [],
  adminPois = [],
  flyTo,
  onFlyToDone,
  onPoiAddPhoto,
}: MapViewProps) {
  const center: [number, number] = [46.48555, 14.96149];
  const [activeLayerId, setActiveLayerId] = useState("satellite");
  const activeLayerConfig = tileLayers.find((l) => l.id === activeLayerId) ?? tileLayers[0];
  const filteredPois = pois.filter((poi) => activeFilters.includes(poi.category));

  return (
    <>
      <LayerSwitcher activeLayer={activeLayerId} onChangeLayer={setActiveLayerId} />
      <MapContainer center={center} zoom={13} className="map-container" zoomControl={false}>
        <TileLayer
          key={activeLayerConfig.id}
          attribution={activeLayerConfig.attribution}
          url={activeLayerConfig.url}
          maxZoom={activeLayerConfig.maxZoom}
        />

        {/* Summit marker */}
        <Marker
          position={[46.48555, 14.96149]}
          icon={L.divIcon({
            className: "custom-marker",
            html: `<div class="summit-marker">
              <div class="summit-marker__pin"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21l4-11 4 11"/><path d="M2 21l6-15 3 7"/><path d="M16 21l6-15-5 7"/></svg></div>
              <div class="summit-marker__label">Uršlja Gora<br/><span>1699 m</span></div>
            </div>`,
            iconSize: [0, 0],
            iconAnchor: [0, 44],
            popupAnchor: [0, -50],
          })}
          zIndexOffset={1000}
        >
          <Popup>
            <div className="poi-popup">
              <strong>Uršlja Gora — Plešivec</strong>
              <p>Najvzhodnejši vrh Karavank (1699 m). Izhodiščna točka vseh pohodniških poti.</p>
            </div>
          </Popup>
        </Marker>

        {/* Trail polylines */}
        {trails.map((trail) => (
          <Polyline
            key={trail.id}
            positions={trail.path.map((p) => [p.lat, p.lng])}
            pathOptions={{
              color: trail.color,
              weight: activeTrail?.id === trail.id ? 6 : 4,
              opacity: activeTrail && activeTrail.id !== trail.id ? 0.35 : 0.9,
            }}
            eventHandlers={{ click: () => onSelectTrail(trail) }}
          />
        ))}

        {/* POI markers */}
        <PoiMarkers filteredPois={filteredPois} onPoiAddPhoto={onPoiAddPhoto} />

        {/* Photo placement marker */}
        {photoMarker && (
          <Marker
            position={[photoMarker.lat, photoMarker.lng]}
            icon={L.divIcon({
              className: "custom-marker",
              html: `<div style="
                width: 36px; height: 36px;
                background: #c1121f;
                border: 2px solid #fff;
                border-radius: 50%;
                display: flex; align-items: center; justify-content: center;
                box-shadow: 0 2px 10px rgba(193,18,31,0.4);
              "><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
              iconSize: [36, 36],
              iconAnchor: [18, 18],
            })}
          >
            <Popup>Izbrana lokacija za fotografijo</Popup>
          </Marker>
        )}

        {/* Community photo markers */}
        {communityPhotos.map((photo) => (
          <Marker
            key={photo.id}
            position={[photo.lat, photo.lng]}
            icon={L.divIcon({
              className: "custom-marker",
              html: `<div style="
                width: 36px; height: 36px;
                border-radius: 50%;
                border: 3px solid #fff;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                overflow: hidden;
                background: #e07a5f;
              "><img src="${photo.imageUrl}" style="width:100%;height:100%;object-fit:cover;" alt="" /></div>`,
              iconSize: [36, 36],
              iconAnchor: [18, 18],
            })}
          >
            <Popup>
              <div className="poi-popup">
                <img src={photo.imageUrl} alt={photo.caption} style={{ width: "100%", borderRadius: 6, marginBottom: 6 }} />
                {photo.caption && <strong>{photo.caption}</strong>}
                <p style={{ fontSize: "0.75rem", color: "#6b6b6b" }}>
                  {photo.author}{photo.kraj ? ` · ${photo.kraj}` : ""} · {new Date(photo.createdAt).toLocaleDateString("sl-SI")}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Admin POI markers (tocka-na-mapi) */}
        {adminPois.map((poi) => (
          <Marker
            key={`admin-${poi.id}`}
            position={[poi.lat, poi.lng]}
            icon={L.divIcon({
              className: "custom-marker",
              html: `<div style="
                width: 36px; height: 36px;
                border-radius: 8px;
                border: 3px solid #fff;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                overflow: hidden;
                background: #c9a96e;
                display: flex; align-items: center; justify-content: center;
              ">${poi.imageUrl
                ? `<img src="${poi.imageUrl}" style="width:100%;height:100%;object-fit:cover;" alt="" />`
                : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`
              }</div>`,
              iconSize: [36, 36],
              iconAnchor: [18, 18],
              popupAnchor: [0, -20],
            })}
          >
            <Popup>
              <div className="poi-popup">
                {poi.imageUrl && (
                  <img src={poi.imageUrl} alt={poi.ime} style={{ width: "100%", borderRadius: 6, marginBottom: 6 }} />
                )}
                <strong>{poi.ime}</strong>
                {poi.opis && <p>{poi.opis}</p>}
              </div>
            </Popup>
          </Marker>
        ))}

        <FitBounds activeTrail={activeTrail} />
        <MapClickHandler onMapClick={onMapClick} />
        <FlyToHandler flyTo={flyTo} onDone={onFlyToDone} />
      </MapContainer>
    </>
  );
}

function MapClickHandler({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  const map = useMap();
  useEffect(() => {
    if (!onMapClick) return;
    const handler = (e: L.LeafletMouseEvent) => onMapClick(e.latlng.lat, e.latlng.lng);
    map.on("click", handler);
    return () => { map.off("click", handler); };
  }, [map, onMapClick]);
  return null;
}

function FlyToHandler({ flyTo, onDone }: { flyTo?: { lat: number; lng: number } | null; onDone?: () => void }) {
  const map = useMap();
  useEffect(() => {
    if (flyTo) {
      map.flyTo([flyTo.lat, flyTo.lng], 16, { duration: 1 });
      onDone?.();
    }
  }, [flyTo, map, onDone]);
  return null;
}
