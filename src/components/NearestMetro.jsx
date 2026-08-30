import React, { useState, useRef, useEffect } from 'react';
import { Navigation, MapPin, Search, Compass, X, ArrowRight } from 'lucide-react';
import { STATIONS } from '../data/stations.js';
import { getStationCoords } from '../data/stationCoordinates.js';
import { getMetroSystemName } from '../utils/stationSearch.js';

export function NearestMetro({ onClose, onSelectStation }) {
  const [loading, setLoading] = useState(false);
  const [userCoords, setUserCoords] = useState(null);
  const [nearbyStations, setNearbyStations] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const alphabeticalStations = [...STATIONS].sort((a, b) => a.name.localeCompare(b.name));

  const displaySearchResults = searchQuery.trim().length > 0
    ? STATIONS.filter(st => st.name.toLowerCase().includes(searchQuery.toLowerCase())).sort((a, b) => a.name.localeCompare(b.name))
    : alphabeticalStations;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const findNearestFromCoords = (lat, lng) => {
    setUserCoords({ lat, lng });
    const results = STATIONS.map(st => {
      const coords = getStationCoords(st);
      const dist = calculateDistanceKm(lat, lng, coords.lat, coords.lng);
      return {
        station: st,
        distanceKm: Math.round(dist * 10) / 10,
        walkTimeMins: Math.round(dist * 15)
      };
    });

    results.sort((a, b) => a.distanceKm - b.distanceKm);
    setNearbyStations(results.slice(0, 10));
    setLoading(false);
  };

  const handleSelectSearchResult = (station) => {
    const coords = getStationCoords(station);
    findNearestFromCoords(coords.lat, coords.lng);
    setSearchQuery(station.name);
    setShowDropdown(false);
  };

  const handleUseGPS = () => {
    setLoading(true);
    setErrorMessage('');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          findNearestFromCoords(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
          setLoading(false);
          setErrorMessage('Could not retrieve GPS location. Showing nearest central Kochi Metro stations.');
          findNearestFromCoords(22.5645, 88.3517); // Default Kolkata Esplanade
        },
        { timeout: 8000 }
      );
    } else {
      setLoading(false);
      setErrorMessage('Geolocation not supported by browser.');
      findNearestFromCoords(22.5645, 88.3517);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 4000, padding: '20px'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%', maxWidth: '640px', maxHeight: '85vh', overflowY: 'auto',
        padding: '24px', position: 'relative', background: 'var(--bg-surface)', borderRadius: '16px'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px', background: 'var(--input-bg)',
          border: '1px solid var(--border-color)', color: 'var(--text-primary)',
          width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 0,
            margin: 0,
            lineHeight: 0,
            boxSizing: 'border-box', cursor: 'pointer'
        }}>
          <X size={18} style={{ display: 'block' }} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '10px', borderRadius: '12px' }}>
            <Navigation size={22} color="#10B981" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Nearest Metro Station Finder
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Locate Kochi Metro stations near you using GPS or station search
            </span>
          </div>
        </div>

        {/* GPS Button */}
        <button
          onClick={handleUseGPS}
          disabled={loading}
          style={{
            width: '100%', padding: '14px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: '#FFFFFF', border: 'none', fontWeight: 700, fontSize: '0.95rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            cursor: 'pointer', marginBottom: '16px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}
        >
          <Compass size={20} />
          <span>{loading ? 'Locating via GPS...' : 'Use Current GPS Location'}</span>
        </button>

        {/* Text Input Box for User Search */}
        <div ref={dropdownRef} style={{ marginBottom: '20px', position: 'relative' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>
            Or Search Station to Find Nearby Options:
          </label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', pointerEvents: 'none' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Select or search station (e.g. Aluva, Edapally, Tripunithura)..."
              style={{
                width: '100%', padding: '12px 14px 12px 42px', borderRadius: '10px',
                border: '1px solid var(--border-color)', background: 'var(--input-bg)',
                color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none'
              }}
            />
          </div>

          {/* Station Selector Dropdown */}
          {showDropdown && displaySearchResults.length > 0 && (
            <div className="glass-panel" style={{
              position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '6px',
              maxHeight: '220px', overflowY: 'auto', borderRadius: '12px', zIndex: 10,
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)', border: '1px solid var(--border-color)',
              background: 'var(--bg-surface)'
            }}>
              {displaySearchResults.map(st => (
                <div
                  key={st.id}
                  onClick={() => handleSelectSearchResult(st)}
                  style={{
                    padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    cursor: 'pointer', borderBottom: '1px solid var(--border-color)', fontSize: '0.88rem'
                  }}
                >
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{st.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--input-bg)', padding: '2px 6px', borderRadius: '4px' }}>
                    {st.line}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {errorMessage && (
          <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', fontSize: '0.82rem', marginBottom: '16px' }}>
            {errorMessage}
          </div>
        )}

        {/* Nearby Results List */}
        {nearbyStations.length > 0 && (
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>
              Closest Kochi Metro Stations:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {nearbyStations.map((item, idx) => (
                <div
                  key={item.station.id}
                  onClick={() => {
                    if (onSelectStation) onSelectStation(item.station);
                    onClose();
                  }}
                  style={{
                    padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-color)',
                    background: 'var(--input-bg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    cursor: 'pointer', transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <MapPin size={18} color="var(--accent-primary)" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                        {item.station.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        ~{item.distanceKm} km away ({item.walkTimeMins} mins walk)
                      </div>
                    </div>
                  </div>

                  <ArrowRight size={16} color="var(--text-muted)" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
