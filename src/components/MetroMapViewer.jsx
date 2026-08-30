import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { X, Search, Layers } from 'lucide-react';
import { STATIONS } from '../data/stations.js';
import { METRO_LINES } from '../data/lines.js';
import { LINE_SEQUENCES } from '../data/connections.js';
import { getCleanLineName } from '../utils/stationSearch.js';
import { getStationCoords } from '../data/stationCoordinates.js';

const createCustomIcon = (color = '#005DAA') => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div style="
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background-color: ${color};
      border: 2.5px solid #FFFFFF;
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
};

function FlyToStation({ coords }) {
  const map = useMap();
  if (coords) {
    map.flyTo(coords, 14, { duration: 1.2 });
  }
  return null;
}

const MAIN_LINE_FILTERS = Object.values(METRO_LINES).map(l => ({ id: l.id, name: l.name }));

export function MetroMapViewer({ onClose, activeRoute }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState(null);
  const [flyCoords, setFlyCoords] = useState(null);
  const [selectedLineFilter, setSelectedLineFilter] = useState('all');

  const routePositions = activeRoute
    ? activeRoute.legs.flatMap(leg => (leg.stations || []).map(st => {
        const coords = getStationCoords(st);
        return coords ? [coords.lat, coords.lng] : null;
      })).filter(Boolean)
    : [];

  const getStationCoordinates = (st) => {
    const coords = getStationCoords(st);
    return coords ? [coords.lat, coords.lng] : [9.9312,76.2673];
  };

  const filteredStations = STATIONS.filter(st => {
    const matchesSearch = st.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLine = selectedLineFilter === 'all' || (st.lines && st.lines.includes(selectedLineFilter)) || st.line === selectedLineFilter;
    return matchesSearch && matchesLine;
  });

  const getLinePolyline = (lineId) => {
    const stationIds = LINE_SEQUENCES[lineId] || [];
    return stationIds
      .map(id => STATIONS.find(s => s.id === id))
      .filter(Boolean)
      .map(st => {
        const coords = getStationCoords(st);
        return coords ? [coords.lat, coords.lng] : null;
      })
      .filter(Boolean);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 4000, padding: '16px'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%', maxWidth: '1000px', height: '88vh',
        display: 'flex', flexDirection: 'column', position: 'relative',
        background: 'var(--bg-surface)', borderRadius: '16px', overflow: 'hidden'
      }}>
        {/* Top Navigation Bar */}
        <div style={{
          padding: '14px 20px', borderBottom: '1px solid var(--border-color)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--bg-surface)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'var(--accent-primary)', padding: '8px', borderRadius: '10px', color: '#FFF' }}>
              <Layers size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Kochi Metro
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Interactive Route & Station Map
              </span>
            </div>
          </div>

          <button onClick={onClose} style={{
            background: 'var(--input-bg)', border: '1px solid var(--border-color)',
            color: 'var(--text-primary)', width: '34px', height: '34px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
          }}>
            <X size={18} />
          </button>
        </div>

        {/* Search & Filter Control Ribbon */}
        <div style={{
          padding: '10px 16px', background: 'var(--input-bg)', borderBottom: '1px solid var(--border-color)',
          display: 'flex', gap: '10px', overflowX: 'auto', alignItems: 'center'
        }}>
          <div style={{ position: 'relative', minWidth: '220px', flex: 1 }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search station on real map..."
              style={{
                width: '100%', padding: '7px 10px 7px 32px', borderRadius: '8px',
                border: '1px solid var(--border-color)', background: 'var(--bg-surface)',
                color: 'var(--text-primary)', fontSize: '0.82rem', outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
            <button
              onClick={() => setSelectedLineFilter('all')}
              style={{
                padding: '6px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700,
                border: '1px solid', borderColor: selectedLineFilter === 'all' ? 'var(--accent-primary)' : 'var(--border-color)',
                background: selectedLineFilter === 'all' ? 'var(--accent-primary)' : 'var(--bg-surface)',
                color: selectedLineFilter === 'all' ? '#FFF' : 'var(--text-primary)', cursor: 'pointer', whiteSpace: 'nowrap'
              }}
            >
              All Lines
            </button>
            {MAIN_LINE_FILTERS.map(line => (
              <button
                key={line.id}
                onClick={() => setSelectedLineFilter(line.id)}
                style={{
                  padding: '6px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700,
                  border: '1px solid', borderColor: selectedLineFilter === line.id ? 'var(--accent-primary)' : 'var(--border-color)',
                  background: selectedLineFilter === line.id ? 'var(--accent-primary)' : 'var(--bg-surface)',
                  color: selectedLineFilter === line.id ? '#FFF' : 'var(--text-primary)', cursor: 'pointer', whiteSpace: 'nowrap'
                }}
              >
                {line.name}
              </button>
            ))}
          </div>
        </div>

        {/* Leaflet Map Viewer */}
        <div style={{ flex: 1, position: 'relative' }}>
          <MapContainer
            center={[10.02,76.32]}
            zoom={12}
            style={{ width: '100%', height: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <FlyToStation coords={flyCoords} />

            {/* Network Polyline Routes */}
            {Object.keys(LINE_SEQUENCES).map(lineId => {
              if (selectedLineFilter !== 'all' && selectedLineFilter !== lineId) return null;
              const positions = getLinePolyline(lineId);
              const color = METRO_LINES[lineId]?.color || '#005DAA';
              return (
                <Polyline
                  key={lineId}
                  positions={positions}
                  pathOptions={{ color: color, weight: 5, opacity: 0.8 }}
                />
              );
            })}

            {/* Active Route Highlight Polyline */}
            {routePositions.length > 0 && (
              <Polyline
                positions={routePositions}
                pathOptions={{ color: '#10B981', weight: 8, opacity: 0.95, dashArray: '10, 10' }}
              />
            )}

            {/* Station Map Markers */}
            {filteredStations.map(st => {
              const pos = getStationCoordinates(st);
              const lineDef = METRO_LINES[st.line];
              const markerColor = lineDef ? lineDef.color : '#005DAA';

              return (
                <Marker
                  key={st.id}
                  position={pos}
                  icon={createCustomIcon(markerColor)}
                  eventHandlers={{
                    click: () => {
                      setSelectedStation(st);
                      setFlyCoords(pos);
                    }
                  }}
                >
                  <Popup>
                    <div style={{ padding: '4px', textAlign: 'center' }}>
                      <strong style={{ fontSize: '0.95rem', display: 'block', marginBottom: '4px' }}>
                        {st.name}
                      </strong>
                      <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'block', marginBottom: '8px' }}>
                        {st.line}
                      </span>
                      {st.isInterchange && (
                        <span style={{ fontSize: '0.72rem', background: '#FEF3C7', color: '#D97706', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                          Interchange Station
                        </span>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
