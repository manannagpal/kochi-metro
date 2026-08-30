import React, { useState, useEffect } from 'react';
import { Search, Train, ArrowLeft } from 'lucide-react';
import { STATIONS } from '../data/stations.js';
import { METRO_LINES } from '../data/lines.js';
import { getCleanLineName } from '../utils/stationSearch.js';
import { getStationSlug } from '../utils/slugify.js';

export function StationsDirectoryPage({ onSelectStation, onBackToHome }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLineFilter, setSelectedLineFilter] = useState('all');

  useEffect(() => {
    document.title = `Kochi Metro Stations Directory (${STATIONS.length} Stations) | Kochi Metro`;
    window.scrollTo(0, 0);
  }, []);

  const filteredStations = STATIONS.filter(st => {
    const matchesSearch = st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (st.aliases && st.aliases.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesLine = selectedLineFilter === 'all' || st.line === selectedLineFilter;
    return matchesSearch && matchesLine;
  });

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button
          onClick={onBackToHome}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </button>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          All {STATIONS.length} Metro Stations
        </span>
      </div>

      <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <div style={{ background: 'var(--accent-primary)', padding: '12px', borderRadius: '14px', color: '#FFF' }}>
            <Train size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Kochi Metro Stations Directory ({STATIONS.length} Stations)
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              Explore connected lines, first/last train timetables, and interchange details for every station.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '20px' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search station by name (e.g. Aluva, Edapally, Tripunithura)..."
              style={{
                width: '100%', padding: '12px 14px 12px 40px', borderRadius: '12px',
                border: '1px solid var(--border-color)', background: 'var(--input-bg)',
                color: 'var(--text-primary)', fontSize: '0.95rem'
              }}
            />
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          <select
            value={selectedLineFilter}
            onChange={(e) => setSelectedLineFilter(e.target.value)}
            style={{
              padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)',
              background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '0.92rem', fontWeight: 600
            }}
          >
            <option value="all">All Lines ({STATIONS.length})</option>
            {Object.values(METRO_LINES).map(line => (
              <option key={line.id} value={line.id}>{getCleanLineName(line)}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
        {filteredStations.map(st => {
          const stationLine = METRO_LINES[st.line];
          const slug = getStationSlug(st);
          return (
            <a
              key={st.id}
              href={`/station/${slug}/`}
              onClick={(e) => {
                e.preventDefault();
                onSelectStation(st);
              }}
              className="glass-panel"
              style={{
                padding: '18px', borderRadius: '16px', textDecoration: 'none',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                transition: 'transform 0.2s ease, border-color 0.2s ease', cursor: 'pointer'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                    {st.name}
                  </h3>
                  {st.isInterchange && (
                    <span style={{ fontSize: '0.72rem', background: '#EF444420', color: '#EF4444', border: '1px solid #EF4444', padding: '2px 6px', borderRadius: '6px', fontWeight: 700 }}>
                      Interchange
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                {stationLine && (
                  <span
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      padding: '3px 8px', borderRadius: '6px',
                      background: `${stationLine.color}20`, border: `1px solid ${stationLine.color}`,
                      color: 'var(--text-primary)', fontSize: '0.75rem', fontWeight: 700
                    }}
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: stationLine.color }} />
                    {stationLine.name}
                  </span>
                )}
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
