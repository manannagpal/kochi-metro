import React from 'react';
import { Bookmark, X, Star, Trash2, ArrowRight, Clock, MapPin } from 'lucide-react';
import { STATIONS } from '../data/stations.js';

export function SavedRoutesModal({ onClose, favorites, recentSearches, onSelectRoute, onSelectStation }) {
  // Convert favorite station IDs to station objects
  const favoriteStations = favorites
    .map(id => STATIONS.find(s => s.id === id))
    .filter(Boolean);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000, padding: '20px'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%', maxWidth: '640px', maxHeight: '85vh', overflowY: 'auto',
        padding: '24px', position: 'relative', background: 'var(--bg-surface)', borderRadius: '16px'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px', background: 'var(--input-bg)',
          border: '1px solid var(--border-color)', color: 'var(--text-primary)',
          width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
        }}>
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '10px', borderRadius: '12px' }}>
            <Bookmark size={24} color="#F59E0B" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Saved Routes & Bookmarks
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Quick access to your saved favorite stations & recent journey searches
            </span>
          </div>
        </div>

        {/* Section 1: Recent Searches */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={16} />
            <span>Recent Journey Searches</span>
          </h4>

          {recentSearches.length === 0 ? (
            <div style={{ padding: '16px', borderRadius: '10px', background: 'var(--input-bg)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No recent route searches saved yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {recentSearches.map((item, idx) => {
                const fromSt = STATIONS.find(s => s.id === item.fromId);
                const toSt = STATIONS.find(s => s.id === item.toId);
                if (!fromSt || !toSt) return null;

                return (
                  <div
                    key={idx}
                    className="glass-panel"
                    onClick={() => {
                      onSelectRoute(fromSt, toSt);
                      onClose();
                    }}
                    style={{
                      padding: '12px 16px', borderRadius: '10px', background: 'var(--input-bg)',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      cursor: 'pointer', border: '1px solid var(--border-color)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      <span>{fromSt.name}</span>
                      <ArrowRight size={14} color="var(--accent-primary)" />
                      <span>{toSt.name}</span>
                    </div>

                    <button style={{
                      background: 'var(--bg-surface)', border: '1px solid var(--border-color)',
                      color: 'var(--accent-primary)', padding: '4px 10px', borderRadius: '6px',
                      fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer'
                    }}>
                      Load Route
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 2: Favorite Stations */}
        <div>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Star size={16} color="#F59E0B" />
            <span>Favorite Stations ({favoriteStations.length})</span>
          </h4>

          {favoriteStations.length === 0 ? (
            <div style={{ padding: '16px', borderRadius: '10px', background: 'var(--input-bg)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No favorite stations bookmarked. Click the star ⭐ icon on any station card to save it.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
              {favoriteStations.map(st => (
                <div
                  key={st.id}
                  className="glass-panel"
                  onClick={() => {
                    onSelectStation(st);
                    onClose();
                  }}
                  style={{
                    padding: '12px', borderRadius: '10px', background: 'var(--input-bg)',
                    border: '1px solid var(--border-color)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={16} color="var(--accent-primary)" />
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      {st.name}
                    </span>
                  </div>
                  <Star size={14} color="#F59E0B" fill="#F59E0B" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
