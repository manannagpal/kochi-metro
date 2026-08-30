import React, { useState, useRef, useEffect } from 'react';
import { Search, ArrowUpDown, MapPin, Navigation, X } from 'lucide-react';
import { searchStations, getCleanLineName, getMetroSystemName } from '../utils/stationSearch.js';
import { METRO_LINES } from '../data/lines.js';
import { STATIONS } from '../data/stations.js';
import { TRANSLATIONS } from '../utils/i18n.js';
import { MetroOperatorLogo } from './MetroOperatorLogo.jsx';

export function StationInput({
  fromStation,
  setFromStation,
  toStation,
  setToStation,
  onSearch,
  lang = 'en'
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const [fromQuery, setFromQuery] = useState(fromStation ? fromStation.name : '');
  const [toQuery, setToQuery] = useState(toStation ? toStation.name : '');

  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);

  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  const fromRef = useRef(null);
  const toRef = useRef(null);

  // Sync external station changes
  useEffect(() => {
    if (fromStation) setFromQuery(fromStation.name);
  }, [fromStation]);

  useEffect(() => {
    if (toStation) setToQuery(toStation.name);
  }, [toStation]);

  // Helper to generate full alphabetical station suggestions
  const getAlphabeticalStationSuggestions = () => {
    const sorted = [...STATIONS].sort((a, b) => a.name.localeCompare(b.name));
    return sorted.map(st => {
      const stationLines = (st.lines || []).map(lineId => METRO_LINES[lineId]).filter(Boolean);
      return {
        station: st,
        score: 100,
        matchedAlias: null,
        lines: stationLines,
        systemName: getMetroSystemName(stationLines)
      };
    });
  };

  // Click outside listener to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (fromRef.current && !fromRef.current.contains(e.target)) {
        setShowFromDropdown(false);
      }
      if (toRef.current && !toRef.current.contains(e.target)) {
        setShowToDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFromFocus = (e) => {
    if (e && e.target && e.target.select) {
      e.target.select();
    }
    setFromSuggestions(getAlphabeticalStationSuggestions());
    setShowFromDropdown(true);
    setShowToDropdown(false);
  };

  const handleToFocus = (e) => {
    if (e && e.target && e.target.select) {
      e.target.select();
    }
    setToSuggestions(getAlphabeticalStationSuggestions());
    setShowToDropdown(true);
    setShowFromDropdown(false);
  };

  const handleFromInputChange = (e) => {
    const val = e.target.value;
    setFromQuery(val);
    if (val.trim().length > 0) {
      setFromSuggestions(searchStations(val));
      setShowFromDropdown(true);
    } else {
      setFromSuggestions(getAlphabeticalStationSuggestions());
      setShowFromDropdown(true);
    }
  };

  const handleToInputChange = (e) => {
    const val = e.target.value;
    setToQuery(val);
    if (val.trim().length > 0) {
      setToSuggestions(searchStations(val));
      setShowToDropdown(true);
    } else {
      setToSuggestions(getAlphabeticalStationSuggestions());
      setShowToDropdown(true);
    }
  };

  const selectFromStation = (st) => {
    setFromStation(st);
    setFromQuery(st.name);
    setShowFromDropdown(false);
  };

  const selectToStation = (st) => {
    setToStation(st);
    setToQuery(st.name);
    setShowToDropdown(false);
  };

  const handleSwap = () => {
    const tempStation = fromStation;
    const tempQuery = fromQuery;

    setFromStation(toStation);
    setFromQuery(toQuery);

    setToStation(tempStation);
    setToQuery(tempQuery);
  };

  const getUniqueLines = (lines) => {
    const unique = [];
    const seen = new Set();
    (lines || []).forEach(l => {
      const cleanName = getCleanLineName(l);
      if (!seen.has(cleanName)) {
        seen.add(cleanName);
        unique.push({ ...l, cleanName });
      }
    });
    return unique;
  };

  const renderSuggestionItem = (item, selectFn) => {
    const { station, lines, systemName, matchedAlias } = item;
    const uniqueLines = getUniqueLines(lines);

    const stripeStyle = uniqueLines.length === 1
      ? { backgroundColor: uniqueLines[0].color }
      : { background: `linear-gradient(to bottom, ${uniqueLines.map(l => l.color).join(', ')})` };

    return (
      <div
        key={station.id}
        onClick={() => selectFn(station)}
        style={{
          position: 'relative',
          padding: '12px 16px 12px 20px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--bg-surface)',
          transition: 'background 0.15s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-surface)'}
      >
        {/* Left Colored Line Indicator Stripe */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '5px',
          borderRadius: '2px 0 0 2px',
          ...stripeStyle
        }} />

        {/* Operator Logo Icon (Matching Route Results & Timeline) */}
        <MetroOperatorLogo lineDef={lines[0]} size={28} />

        {/* Main Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1 }}>
          {/* Station Name — Metro System */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
            <div>
              <span style={{ fontWeight: 600 }}>{station.name}</span>
              <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}> — {systemName || 'Kochi Metro'}</span>
            </div>
          </div>

          {/* Line Dots and Line Names */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {uniqueLines.map(line => (
              <div key={line.id} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: line.color
                }} />
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {line.cleanName}
                </span>
              </div>
            ))}
          </div>

          {/* Matched Alias if searching by alias */}
          {matchedAlias && (
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              Matched alias: "{matchedAlias}"
            </span>
          )}
        </div>
      </div>
    );
  };

  const renderSelectedStationBadge = (st) => {
    if (!st || !st.lines) return null;
    const lines = st.lines.map(lineId => METRO_LINES[lineId]).filter(Boolean);
    const uniqueLines = getUniqueLines(lines);

    return (
      <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {uniqueLines.map(line => (
            <span key={line.id} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '10px',
              backgroundColor: `${line.color}15`,
              color: 'var(--text-primary)',
              border: `1px solid ${line.color}40`
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: line.color }} />
              {line.cleanName}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className="glass-panel animate-fade-in"
      style={{
        padding: '24px',
        marginBottom: '32px',
        position: 'relative',
        zIndex: (showFromDropdown || showToDropdown) ? 500 : 10
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* FROM STATION INPUT */}
        <div ref={fromRef} style={{ position: 'relative', width: '100%', zIndex: showFromDropdown ? 600 : 2 }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <MapPin size={14} color="#10B981" style={{ display: 'inline', marginRight: '4px' }} />
            {t.fromStation}
          </label>

          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="text"
              name="from-station-search"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              inputMode="search"
              value={fromQuery}
              onChange={handleFromInputChange}
              onFocus={handleFromFocus}
              onClick={handleFromFocus}
              placeholder={t.searchPlaceholder}
              style={{
                width: '100%',
                padding: '14px 16px 14px 42px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                background: 'var(--input-bg)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
            />
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            {fromQuery && (
              <X
                size={16}
                color="var(--text-muted)"
                onClick={() => {
                  setFromQuery('');
                  setFromStation(null);
                  setFromSuggestions(getAlphabeticalStationSuggestions());
                  setShowFromDropdown(true);
                }}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
              />
            )}
          </div>

          {/* From Dropdown */}
          {showFromDropdown && fromSuggestions.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 1000,
              marginTop: '6px',
              background: 'var(--bg-surface)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              boxShadow: '0 14px 36px rgba(0, 0, 0, 0.28)',
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              {fromSuggestions.map(item => renderSuggestionItem(item, selectFromStation))}
            </div>
          )}
        </div>

        {/* SWAP BUTTON */}
        <div style={{ display: 'flex', justifyContent: 'center',
            padding: 0,
            margin: 0,
            lineHeight: 0,
            boxSizing: 'border-box', margin: '-4px 0' }}>
          <button
            onClick={handleSwap}
            title={t.swapStations}
            style={{
              background: 'var(--input-bg)',
              border: '1px solid var(--border-accent)',
              color: 'var(--accent-primary)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            padding: 0,
            margin: 0,
            lineHeight: 0,
            boxSizing: 'border-box',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1) rotate(180deg)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
          >
            <ArrowUpDown size={18} />
          </button>
        </div>

        {/* TO STATION INPUT */}
        <div ref={toRef} style={{ position: 'relative', width: '100%', zIndex: showToDropdown ? 600 : 1 }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <Navigation size={14} color="#EF4444" style={{ display: 'inline', marginRight: '4px' }} />
            {t.toStation}
          </label>

          <div style={{ position: 'relative' }}>
            <input
              type="text"
              name="to-station-search"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              inputMode="search"
              value={toQuery}
              onChange={handleToInputChange}
              onFocus={handleToFocus}
              onClick={handleToFocus}
              placeholder={t.searchPlaceholder}
              style={{
                width: '100%',
                padding: '14px 16px 14px 42px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                background: 'var(--input-bg)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
            />
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            {toQuery && (
              <X
                size={16}
                color="var(--text-muted)"
                onClick={() => {
                  setToQuery('');
                  setToStation(null);
                  setToSuggestions(getAlphabeticalStationSuggestions());
                  setShowToDropdown(true);
                }}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
              />
            )}
          </div>

          {/* To Dropdown */}
          {showToDropdown && toSuggestions.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 1000,
              marginTop: '6px',
              background: 'var(--bg-surface)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              boxShadow: '0 14px 36px rgba(0, 0, 0, 0.28)',
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              {toSuggestions.map(item => renderSuggestionItem(item, selectToStation))}
            </div>
          )}
        </div>
      </div>

      {/* FIND ROUTES SUBMIT BUTTON */}
      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <button
          onClick={onSearch}
          disabled={!fromStation || !toStation}
          style={{
            background: (!fromStation || !toStation)
              ? 'var(--text-muted)'
              : 'linear-gradient(135deg, #E52E2D 0%, #DC2626 50%, #B91C1C 100%)',
            color: '#FFFFFF',
            border: 'none',
            padding: '16px 36px',
            borderRadius: '14px',
            fontSize: '1.05rem',
            fontWeight: 700,
            cursor: (!fromStation || !toStation) ? 'not-allowed' : 'pointer',
            boxShadow: (!fromStation || !toStation) ? 'none' : '0 6px 20px rgba(229, 46, 45, 0.4)',
            transition: 'all 0.25s ease',
            width: '100%',
            maxWidth: '320px'
          }}
          onMouseEnter={(e) => {
            if (fromStation && toStation) e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            if (fromStation && toStation) e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {t.findRoutes}
        </button>
      </div>
    </div>
  );
}

