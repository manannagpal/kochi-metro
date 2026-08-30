import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Train, Share2, Map, Clock, Car, Navigation, Layers, Menu, ArrowLeft, MoreVertical, ChevronRight, Search, Info, Phone, ShieldCheck, FileText, AlertCircle, HelpCircle, Compass } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { TRANSLATIONS } from '../utils/i18n.js';

export function Navbar({
  theme,
  setTheme,
  lang,
  setLang,
  onShareApp,
  onResetSearch,
  onOpenMap,
  onOpenNearest,
  onOpenStations,
  onOpenLines,
  onOpenTimings,
  onOpenParking,
  onOpenSitemap,
  onOpenAbout,
  onOpenContact,
  onOpenPrivacy,
  onOpenTerms,
  onOpenDisclaimer,
  onOpenHowItWorks
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOverflowMenu, setShowOverflowMenu] = useState(false);
  const overflowRef = useRef(null);
  const isNativeApp = Capacitor.isNativePlatform();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (overflowRef.current && !overflowRef.current.contains(e.target)) {
        setShowOverflowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const overflowItems = [
    { label: 'Share App', icon: <Share2 size={16} color="var(--accent-primary)" />, onClick: onShareApp },
    { label: theme === 'dark' ? 'Light Mode' : 'Dark Mode', icon: theme === 'dark' ? <Sun size={16} color="#FBBF24" /> : <Moon size={16} color="#60A5FA" />, onClick: toggleTheme },
    { label: 'About Us', icon: <Info size={16} color="#3B82F6" />, onClick: onOpenAbout },
    { label: 'Contact Us', icon: <Phone size={16} color="#10B981" />, onClick: onOpenContact },
    { label: 'Privacy Policy', icon: <ShieldCheck size={16} color="#8B5CF6" />, onClick: onOpenPrivacy },
    { label: 'Terms of Service', icon: <FileText size={16} color="#F59E0B" />, onClick: onOpenTerms },
    { label: 'Disclaimer', icon: <AlertCircle size={16} color="#EF4444" />, onClick: onOpenDisclaimer },
    { label: 'How It Works', icon: <HelpCircle size={16} color="#06B6D4" />, onClick: onOpenHowItWorks }
  ];

  {/* CLASSIC WEB NAVBAR */}
  if (!isNativeApp) {
    return (
      <header className="glass-panel" style={{ margin: '0 0 24px 0', borderRadius: '16px', overflow: 'hidden', background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
        {/* Top Bar: Logo & Actions */}
        <div className="navbar-top">
          {/* Logo & Title */}
          <div className="navbar-logo" onClick={() => window.location.href = '/'}>
            <img
              src="/favicon.svg"
              alt="Kolkata Metro Logo"
              className="navbar-logo-img"
            />
            <div>
              <h1 className="navbar-title">
                Kolkata Metro Route Finder
              </h1>
              <p className="navbar-subtitle">
                Official Route & Station Guide
              </p>
            </div>
          </div>

          {/* Controls (Share, Theme) */}
          <div className="navbar-controls">
            <button
              onClick={onShareApp}
              title={t.shareRoute}
              className="btn-header-action"
            >
              <Share2 size={15} />
              <span>{t.shareRoute || 'Share'}</span>
            </button>

            <button
              onClick={toggleTheme}
              title="Toggle Light / Dark Mode"
              className="btn-header-action"
            >
              {theme === 'dark' ? (
                <>
                  <Sun size={15} color="#FBBF24" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon size={15} color="#60A5FA" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* HEADER NAVIGATION RIBBON */}
        <div className="nav-ribbon">
          <button
            onClick={onOpenTimings}
            style={{
              padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-color)',
              background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '0.82rem',
              fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            <Clock size={14} color="#10B981" />
            <span>First / Last Train</span>
          </button>

          <button
            onClick={onOpenNearest}
            style={{
              padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-color)',
              background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '0.82rem',
              fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            <Navigation size={14} color="#00C0F3" />
            <span>Nearest Metro</span>
          </button>

          <button
            onClick={onOpenMap}
            style={{
              padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-color)',
              background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '0.82rem',
              fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            <Map size={14} color="#E52E2D" />
            <span>Metro Map</span>
          </button>

          <button
            onClick={onOpenParking}
            style={{
              padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-color)',
              background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '0.82rem',
              fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            <Car size={14} color="#3B82F6" />
            <span>Parking Rates</span>
          </button>

          <button
            onClick={onOpenStations}
            style={{
              padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-color)',
              background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '0.82rem',
              fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            <Train size={14} color="#990066" />
            <span>Stations Directory</span>
          </button>

          <button
            onClick={onOpenLines}
            style={{
              padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-color)',
              background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '0.82rem',
              fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            <Layers size={14} color="#FF6600" />
            <span>Lines Directory</span>
          </button>
        </div>
      </header>
    );
  }

  {/* NATIVE MOBILE ACTION BAR HEADER */}
  return (
    <>
      <header className="glass-panel" style={{
        margin: '0 0 20px 0',
        borderRadius: '16px',
        overflow: 'visible',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        color: 'var(--text-primary)',
        boxShadow: 'var(--shadow-sm)',
        position: 'relative',
        zIndex: 1000
      }}>
        <div style={{
          height: '60px',
          padding: '0 14px',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          position: 'relative'
        }}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            title="Toggle Menu"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              padding: '6px',
              zIndex: 10
            }}
          >
            {isMenuOpen ? <ArrowLeft size={24} color="var(--text-primary)" /> : <Menu size={24} color="var(--text-primary)" />}
          </button>

          <div
            onClick={() => { if (typeof onResetSearch === 'function') onResetSearch(); }}
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              cursor: 'pointer',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justify: 'center',
              lineHeight: 1.15,
              zIndex: 5
            }}
          >
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
              Kolkata Metro
            </span>
            <span style={{ fontSize: '1.0rem', fontWeight: 700, color: 'var(--accent-primary)', letterSpacing: '0.03em', whiteSpace: 'nowrap' }}>
              Route Finder
            </span>
          </div>

          <div ref={overflowRef} style={{ position: 'absolute', right: '14px', zIndex: 10 }}>
            <button
              onClick={() => setShowOverflowMenu(!showOverflowMenu)}
              title="More options"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                padding: '6px'
              }}
            >
              <MoreVertical size={24} color="var(--text-primary)" />
            </button>

            {showOverflowMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                boxShadow: '0 10px 28px rgba(0, 0, 0, 0.35)',
                minWidth: '190px',
                zIndex: 3000,
                overflow: 'hidden'
              }}>
                {overflowItems.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      if (typeof item.onClick === 'function') item.onClick();
                      setShowOverflowMenu(false);
                    }}
                    style={{
                      padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px',
                      fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer',
                      borderTop: idx > 0 ? '1px solid var(--border-color)' : 'none'
                    }}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(4px)',
          zIndex: 2500, display: 'flex', flexDirection: 'column'
        }}>
          <div style={{ height: '60px', width: '100%' }} />

          <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
            <div className="animate-fade-in" style={{
              width: '78%', maxWidth: '300px', height: '100%',
              background: '#0B0F17', color: '#FFFFFF', display: 'flex', flexDirection: 'column',
              boxShadow: '6px 0 28px rgba(0, 0, 0, 0.5)', overflowY: 'auto', borderRight: '1px solid #1E293B'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {[
                  { label: 'Search Route', icon: <Search size={20} color="#10B981" />, onClick: () => { if (typeof onResetSearch === 'function') onResetSearch(); } },
                  { label: 'Interactive Map', icon: <Map size={20} color="#E52E2D" />, onClick: onOpenMap },
                  { label: 'Nearest Stations', icon: <Navigation size={20} color="#00C0F3" />, onClick: onOpenNearest },
                  { label: 'First / Last Train', icon: <Clock size={20} color="#FBBF24" />, onClick: onOpenTimings },
                  { label: 'Parking Rates', icon: <Car size={20} color="#3B82F6" />, onClick: onOpenParking },
                  { label: 'Stations Directory', icon: <Train size={20} color="#990066" />, onClick: onOpenStations },
                  { label: 'Lines Directory', icon: <Layers size={20} color="#FF6600" />, onClick: onOpenLines },
                  { label: 'Sitemap', icon: <Compass size={20} color="#06B6D4" />, onClick: onOpenSitemap },
                  { label: 'About', icon: <Info size={20} color="#94A3B8" />, onClick: onOpenAbout }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      if (typeof item.onClick === 'function') item.onClick();
                      setIsMenuOpen(false);
                    }}
                    style={{
                      padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)', cursor: 'pointer',
                      fontSize: '0.95rem', fontWeight: 600, color: '#F8FAFC', transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight size={16} color="rgba(255, 255, 255, 0.3)" />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ flex: 1 }} onClick={() => setIsMenuOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
