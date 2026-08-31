import React, { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Navbar } from './components/Navbar.jsx';
import { Footer } from './components/Footer.jsx';
import { StationInput } from './components/StationInput.jsx';
import { RecentSearches } from './components/RecentSearches.jsx';
import { PopularRoutes, PRESET_ROUTES } from './components/PopularRoutes.jsx';
import { QuickActions } from './components/QuickActions.jsx';
import { NearestMetro } from './components/NearestMetro.jsx';
import { StationsDirectory } from './components/StationsDirectory.jsx';
import { LinesDirectory } from './components/LinesDirectory.jsx';
import { StationGates } from './components/StationGates.jsx';
import { RouteFaqs } from './components/RouteFaqs.jsx';
import { StationTimingsModal } from './components/StationTimingsModal.jsx';
import { ParkingRatesModal } from './components/ParkingRatesModal.jsx';
import { RouteResultCard } from './components/RouteResultCard.jsx';
import { RouteFilters } from './components/RouteFilters.jsx';
import { StationDetailModal } from './components/StationDetailModal.jsx';
import { MetroMapViewer } from './components/MetroMapViewer.jsx';
import { HowItWorks } from './components/HowItWorks.jsx';
import { AboutModal } from './components/AboutModal.jsx';
import { ContactModal } from './components/ContactModal.jsx';
import { PrivacyModal } from './components/PrivacyModal.jsx';
import { TermsModal } from './components/TermsModal.jsx';
import { DisclaimerModal } from './components/DisclaimerModal.jsx';
import { AdSenseUnit } from './components/AdSenseUnit.jsx';

import { AboutPage } from './pages/AboutPage.jsx';
import { ContactPage } from './pages/ContactPage.jsx';
import { PrivacyPage } from './pages/PrivacyPage.jsx';
import { TermsPage } from './pages/TermsPage.jsx';
import { DisclaimerPage } from './pages/DisclaimerPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';
import { StationSeoPage } from './pages/StationSeoPage.jsx';
import { RouteSeoPage } from './pages/RouteSeoPage.jsx';
import { StationsDirectoryPage } from './pages/StationsDirectoryPage.jsx';
import { SitemapPage } from './pages/SitemapPage.jsx';

import { calculateRoutes } from './routing/routeEngine.js';
import { getStationById } from './utils/stationSearch.js';
import { STATIONS } from './data/stations.js';
import { getStationSlug, getStationBySlug } from './utils/slugify.js';
import { logRouteSearch } from './utils/analytics.js';
import { updatePageSeo } from './utils/seo.js';
import {
  getRecentSearches,
  saveRecentSearch,
  getThemePref,
  setThemePref,
  getLangPref,
  setLangPref
} from './utils/localStorage.js';
import { TRANSLATIONS } from './utils/i18n.js';
import { ArrowLeft, Check, AlertCircle, RotateCcw } from 'lucide-react';

export function App() {
  const [theme, setTheme] = useState(getThemePref());
  const [lang, setLang] = useState(getLangPref());

  const [stationSeoSlug, setStationSeoSlug] = useState(() => {
    const p = window.location.pathname.replace(/\/$/, '');
    if (p.startsWith('/station/')) {
      return p.replace(/^\/station\//, '').split('/')[0];
    }
    if (p.startsWith('/route/')) {
      const parts = p.replace(/^\/route\//, '').split('/').filter(Boolean);
      if (parts.length === 1) {
        return parts[0];
      }
    }
    return null;
  });

  const [activePageView, setActivePageView] = useState(() => {
    const p = window.location.pathname.replace(/\/$/, '');
    if (!p || p === '') return null;
    if (p === '/about') return 'about';
    if (p === '/contact') return 'contact';
    if (p === '/privacy-policy' || p === '/privacy') return 'privacy';
    if (p === '/terms-of-service' || p === '/terms') return 'terms';
    if (p === '/disclaimer') return 'disclaimer';
    if (p === '/stations') return 'stations';
    if (p === '/sitemap') return 'sitemap';
    
    if (p.startsWith('/station/')) {
      const slug = p.replace(/^\/station\//, '').split('/')[0];
      const st = getStationBySlug(slug);
      if (!st) return '404';
      return 'stationSeo';
    }

    if (p.startsWith('/route/')) {
      const parts = p.replace(/^\/route\//, '').split('/').filter(Boolean);
      if (parts.length >= 2) {
        const f = getStationBySlug(parts[0]);
        const tSt = getStationBySlug(parts[1]);
        if (!f || !tSt) return '404';
        return null;
      } else if (parts.length === 1) {
        const st = getStationBySlug(parts[0]);
        if (!st) return '404';
        if (typeof window !== 'undefined') {
          window.history.replaceState(null, '', `/station/${getStationSlug(st)}/`);
        }
        return null;
      }
    }

    return '404';
  });

  // Extract initial route calculation from URL synchronously for instant first-render state
  const initialRouteState = (() => {
    let defaultFrom = STATIONS[0];
    let defaultTo = STATIONS[1] || STATIONS[0];

    if (typeof PRESET_ROUTES !== 'undefined' && PRESET_ROUTES.length > 0) {
      const pFrom = getStationById(PRESET_ROUTES[0].fromId);
      const pTo = getStationById(PRESET_ROUTES[0].toId);
      if (pFrom && pTo) {
        defaultFrom = pFrom;
        defaultTo = pTo;
      }
    }

    const p = window.location.pathname.replace(/\/$/, '');
    if (p.startsWith('/route/')) {
      const parts = p.replace(/^\/route\//, '').split('/').filter(Boolean);
      if (parts.length >= 2) {
        const f = getStationBySlug(parts[0]);
        const tSt = getStationBySlug(parts[1]);
        if (f && tSt) {
          const calculated = calculateRoutes(f.id, tSt.id);
          return {
            from: f,
            to: tSt,
            routes: calculated,
            hasSearched: true,
            openIds: calculated.length > 0 ? new Set([calculated[0].id]) : new Set()
          };
        }
      }
    }

    const defaultCalculated = calculateRoutes(defaultFrom.id, defaultTo.id);
    return {
      from: defaultFrom,
      to: defaultTo,
      routes: defaultCalculated,
      hasSearched: true,
      openIds: defaultCalculated.length > 0 ? new Set([defaultCalculated[0].id]) : new Set()
    };
  })();

  const [fromStation, setFromStation] = useState(initialRouteState.from);
  const [toStation, setToStation] = useState(initialRouteState.to);

  const [routes, setRoutes] = useState(initialRouteState.routes);
  const [openRouteIds, setOpenRouteIds] = useState(initialRouteState.openIds);
  const [hasSearched, setHasSearched] = useState(initialRouteState.hasSearched);

  const [recentSearches, setRecentSearches] = useState(getRecentSearches());

  const [sortBy, setSortBy] = useState('fewestSwitches');
  const [maxSwitchesFilter, setMaxSwitchesFilter] = useState('any');

  const [selectedStationModal, setSelectedStationModal] = useState(() => {
    const p = window.location.pathname.replace(/\/$/, '');
    if (p.startsWith('/station/')) {
      const slug = p.replace(/^\/station\//, '').split('/')[0];
      return getStationBySlug(slug) || null;
    }
    return null;
  });
  const [activeModal, setActiveModal] = useState(null); // 'nearest' | 'stations' | 'lines' | null
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // Sync SEO metadata (title, description, keywords, canonical, JSON-LD) dynamically
  useEffect(() => {
    if (activePageView === 'stationSeo' || selectedStationModal) {
      const slug = stationSeoSlug || (fromStation ? getStationSlug(fromStation) : null);
      const st = (fromStation && getStationSlug(fromStation) === slug) ? fromStation : (slug ? getStationBySlug(slug) : null);
      if (st) {
        updatePageSeo(st, null, null);
        return;
      }
    }

    if (activePageView && ['about', 'contact', 'privacy', 'terms', 'disclaimer', 'stations', 'sitemap'].includes(activePageView)) {
      updatePageSeo(null, null, null, activePageView);
      return;
    }

    if (hasSearched && fromStation && toStation && routes.length > 0) {
      updatePageSeo(fromStation, toStation, routes[0]);
    } else if (!activePageView && !hasSearched) {
      updatePageSeo(null, null, null);
    }
  }, [activePageView, stationSeoSlug, hasSearched, fromStation, toStation, routes]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    setThemePref(theme);
  }, [theme]);

  // Apply language preference
  useEffect(() => {
    setLangPref(lang);
  }, [lang]);

  // Listen for PWA install prompt
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const executeSearch = (fromSt = fromStation, toSt = toStation) => {
    if (!fromSt || !toSt) return;

    if (fromSt.id === toSt.id) {
      setRoutes([]);
      setOpenRouteIds(new Set());
      setHasSearched(true);
      showToast(t.sameDestination);
      return;
    }

    const calculated = calculateRoutes(fromSt.id, toSt.id);
    setRoutes(calculated);
    setHasSearched(true);

    if (calculated.length > 0) {
      setOpenRouteIds(new Set([calculated[0].id]));
    } else {
      setOpenRouteIds(new Set());
    }

    // Save recent search
    saveRecentSearch(fromSt, toSt);
    setRecentSearches(getRecentSearches());
    logRouteSearch(fromSt.name, toSt.name);

    // Update SEO friendly route URL path without page reload
    const fromSlug = getStationSlug(fromSt);
    const toSlug = getStationSlug(toSt);
    if (window.location.pathname !== `/route/${fromSlug}/${toSlug}/`) {
      window.history.pushState({}, '', `/route/${fromSlug}/${toSlug}/`);
    }
  };

  // Helper to sync App state dynamically with browser URL path
  const syncRouteFromPath = (path) => {
    const pTrim = path.replace(/\/$/, '');
    if (!pTrim || pTrim === '') {
      setActivePageView(null);
      setStationSeoSlug(null);
      let defaultFrom = STATIONS[0];
      let defaultTo = STATIONS[1] || STATIONS[0];
      if (typeof PRESET_ROUTES !== 'undefined' && PRESET_ROUTES.length > 0) {
        const pFrom = getStationById(PRESET_ROUTES[0].fromId);
        const pTo = getStationById(PRESET_ROUTES[0].toId);
        if (pFrom && pTo) {
          defaultFrom = pFrom;
          defaultTo = pTo;
        }
      }
      setFromStation(defaultFrom);
      setToStation(defaultTo);
      const calculated = calculateRoutes(defaultFrom.id, defaultTo.id);
      setRoutes(calculated);
      setHasSearched(true);
      if (calculated.length > 0) setOpenRouteIds(new Set([calculated[0].id]));
      return;
    }

    if (pTrim === '/about') { setActivePageView('about'); setStationSeoSlug(null); return; }
    if (pTrim === '/contact') { setActivePageView('contact'); setStationSeoSlug(null); return; }
    if (pTrim === '/privacy-policy' || pTrim === '/privacy') { setActivePageView('privacy'); setStationSeoSlug(null); return; }
    if (pTrim === '/terms-of-service' || pTrim === '/terms') { setActivePageView('terms'); setStationSeoSlug(null); return; }
    if (pTrim === '/disclaimer') { setActivePageView('disclaimer'); setStationSeoSlug(null); return; }
    if (pTrim === '/stations') { setActivePageView('stations'); setStationSeoSlug(null); return; }
    if (pTrim === '/sitemap') { setActivePageView('sitemap'); setStationSeoSlug(null); return; }

    if (path.startsWith('/route/') || path.startsWith('/station/')) {
      const parts = path.replace(/^\/(route|station)\//, '').replace(/\/$/, '').split('/').filter(Boolean);
      if (parts.length >= 2) {
        const f = getStationBySlug(parts[0]);
        const tSt = getStationBySlug(parts[1]);
        if (f && tSt) {
          setFromStation(f);
          setToStation(tSt);
          const calculated = calculateRoutes(f.id, tSt.id);
          setRoutes(calculated);
          setHasSearched(true);
          if (calculated.length > 0) setOpenRouteIds(new Set([calculated[0].id]));
          setActivePageView(null);
          setStationSeoSlug(null);
          return;
        } else {
          setActivePageView('404');
          return;
        }
      } else if (parts.length === 1) {
        const f = getStationBySlug(parts[0]);
        if (f) {
          setStationSeoSlug(parts[0]);
          setActivePageView('stationSeo');
          setSelectedStationModal(null);
          updatePageSeo(f, null, null);
          return;
        } else {
          setActivePageView('404');
          return;
        }
      }
    }

    setActivePageView('404');
  };

  // URL Route / Station Path Sync on mount & on Browser Back/Forward (popstate)
  useEffect(() => {
    syncRouteFromPath(window.location.pathname);

    const handlePopState = () => {
      syncRouteFromPath(window.location.pathname);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Scroll window to top whenever active page view or station SEO slug changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activePageView, stationSeoSlug]);

  const handleNavigate = (path) => {
    window.history.pushState({}, '', path);
    syncRouteFromPath(path);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const handleResetSearch = () => {
    setActivePageView(null);
    setStationSeoSlug(null);
    let defaultFrom = STATIONS[0];
    let defaultTo = STATIONS[1] || STATIONS[0];
    if (typeof PRESET_ROUTES !== 'undefined' && PRESET_ROUTES.length > 0) {
      const pFrom = getStationById(PRESET_ROUTES[0].fromId);
      const pTo = getStationById(PRESET_ROUTES[0].toId);
      if (pFrom && pTo) {
        defaultFrom = pFrom;
        defaultTo = pTo;
      }
    }
    setFromStation(defaultFrom);
    setToStation(defaultTo);
    const calculated = calculateRoutes(defaultFrom.id, defaultTo.id);
    setRoutes(calculated);
    setHasSearched(true);
    if (calculated.length > 0) setOpenRouteIds(new Set([calculated[0].id]));
    else setOpenRouteIds(new Set());
    setMaxSwitchesFilter('any');
    setSortBy('fewestSwitches');
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const handleSelectPresetRoute = (fromSt, toSt) => {
    setFromStation(fromSt);
    setToStation(toSt);
    executeSearch(fromSt, toSt);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const handleSelectRouteFromTable = (routeId) => {
    setOpenRouteIds(prev => new Set([...prev, routeId]));
    setTimeout(() => {
      const el = document.getElementById(`route-card-${routeId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const toggleRouteCardOpen = (routeId) => {
    setOpenRouteIds(prev => {
      const next = new Set(prev);
      if (next.has(routeId)) {
        next.delete(routeId);
      } else {
        next.add(routeId);
      }
      return next;
    });
  };

  const handleShareApp = async () => {
    const currentUrl = window.location.href;
    const shareData = {
      title: document.title || 'Kochi Metro Route Finder',
      text: (fromStation && toStation)
        ? `Check Kochi Metro route from ${fromStation.name} to ${toStation.name}`
        : 'Kochi Metro Route Finder & Station Guide',
      url: currentUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // User cancelled share
      }
    }

    try {
      await navigator.clipboard.writeText(currentUrl);
      showToast(t.linkCopied || 'Route link copied to clipboard!');
    } catch (err) {
      showToast(t.linkCopied || 'Route link copied to clipboard!');
    }
  };

  const handleInstallPWA = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => setDeferredPrompt(null));
    }
  };

  // Filter & Sort routes
  const filteredRoutes = routes.filter(r => {
    if (maxSwitchesFilter === 'any') return true;
    return r.switches <= parseInt(maxSwitchesFilter, 10);
  });

  const sortedRoutes = [...filteredRoutes].sort((a, b) => {
    switch (sortBy) {
      case 'fastest':
        return a.totalTimeMins - b.totalTimeMins;
      case 'fewestStops':
        if (a.totalStops !== b.totalStops) return a.totalStops - b.totalStops;
        return a.switches - b.switches;
      case 'fewestSwitches':
      default:
        if (a.switches !== b.switches) return a.switches - b.switches;
        if (a.totalStops !== b.totalStops) return a.totalStops - b.totalStops;
        return a.totalTimeMins - b.totalTimeMins;
    }
  });

    const handleOpenStationPage = (st) => {
    if (!st) return;
    const slug = getStationSlug(st);
    setStationSeoSlug(slug);
    setSelectedStationModal(st);
    setActiveModal(null);
    if (window.location.pathname !== `/station/${slug}/`) {
      window.history.pushState({}, '', `/station/${slug}/`);
    }
    updatePageSeo(st, null, null);
  };

  const formattedDate = new Date().toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="app-container">
      {/* Toast Banner */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 2000,
          background: 'var(--header-summary-bg)',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid var(--accent-primary)',
          fontSize: '0.9rem',
          fontWeight: 600
        }}>
          <Check size={18} color="#10B981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navbar with Header Ribbon */}
      <Navbar
        theme={theme}
        setTheme={setTheme}
        lang={lang}
        setLang={setLang}
        onShareApp={handleShareApp}
        onResetSearch={handleResetSearch}
        onOpenMap={() => setIsMapOpen(true)}
        onOpenNearest={() => setActiveModal('nearest')}
        onOpenStations={() => setActiveModal('stations')}
        onOpenLines={() => setActiveModal('lines')}
        onOpenTimings={() => setActiveModal('timings')}
        onOpenParking={() => setActiveModal('parking')}
        onOpenSitemap={() => handleNavigate('/sitemap')}
        onOpenAbout={() => setActiveModal('about')}
        onOpenContact={() => handleNavigate('/contact')}
        onOpenPrivacy={() => handleNavigate('/privacy')}
        onOpenTerms={() => handleNavigate('/terms')}
        onOpenDisclaimer={() => setActiveModal('disclaimer')}
        onOpenHowItWorks={() => {
          handleResetSearch();
          setTimeout(() => {
            const el = document.getElementById('how-it-works-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
      />

      {/* STANDALONE PAGE VIEWS OR MAIN SEARCH / HOME VIEW */}
      {activePageView === 'about' ? (
        <AboutPage onBackToHome={handleResetSearch} />
      ) : activePageView === 'contact' ? (
        <ContactPage onBackToHome={handleResetSearch} />
      ) : activePageView === 'privacy' ? (
        <PrivacyPage onBackToHome={handleResetSearch} />
      ) : activePageView === 'terms' ? (
        <TermsPage onBackToHome={handleResetSearch} />
      ) : activePageView === 'disclaimer' ? (
        <DisclaimerPage onBackToHome={handleResetSearch} />
      ) : activePageView === 'stations' ? (
        <StationsDirectoryPage onSelectStation={(st) => handleOpenStationPage(st)} onBackToHome={handleResetSearch} />
      ) : activePageView === 'routeSeo' ? (
        <RouteSeoPage fromSlug={routeSeoFromSlug} toSlug={routeSeoToSlug} onResetSearch={handleResetSearch} lang={lang} />
      ) : activePageView === 'sitemap' ? (
        <SitemapPage onSelectStation={(st) => handleOpenStationPage(st)} onBackToHome={handleResetSearch} />
      ) : activePageView === '404' ? (
        <NotFoundPage lang={lang} onNavigate={handleNavigate} />
      ) : (
        <>
          {/* Main Search Input Card */}
          <StationInput
            fromStation={fromStation}
            setFromStation={setFromStation}
            toStation={toStation}
            setToStation={setToStation}
            onSearch={() => executeSearch()}
            lang={lang}
          />

          {/* SEARCH RESULTS VIEW */}
          {hasSearched ? (
            <div className="animate-fade-in">
              
              {/* Header Banner */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    {fromStation?.name} → {toStation?.name}
                  </h2>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={handleResetSearch}
                    style={{
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-secondary)',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <ArrowLeft size={16} />
                    <span>Reset Search</span>
                  </button>
                </div>
              </div>

              {/* Same Origin and Destination */}
              {fromStation?.id === toStation?.id ? (
                <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', margin: '24px 0' }}>
                  <AlertCircle size={32} color="var(--accent-warning)" style={{ marginBottom: '12px' }} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{t.sameDestination}</h3>
                </div>
              ) : routes.length === 0 ? (
                /* Graph Engine found 0 routes */
                <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', margin: '24px 0' }}>
                  <AlertCircle size={32} color="var(--accent-danger)" style={{ marginBottom: '12px' }} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{t.noRoutesFound}</h3>
                </div>
              ) : (
                <>
                  {/* Route Filters ALWAYS visible when routes exist */}
                  <RouteFilters
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    maxSwitchesFilter={maxSwitchesFilter}
                    setMaxSwitchesFilter={setMaxSwitchesFilter}
                    lang={lang}
                  />

                  {/* No routes match current filter */}
                  {sortedRoutes.length === 0 ? (
                    <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', margin: '24px 0' }}>
                      <AlertCircle size={32} color="var(--accent-warning)" style={{ marginBottom: '12px' }} />
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
                        No routes found with max {maxSwitchesFilter} switch{maxSwitchesFilter === '1' ? '' : 'es'}
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                        This journey requires at least {Math.min(...routes.map(r => r.switches))} line switch(es).
                      </p>
                      <button
                        onClick={() => setMaxSwitchesFilter('any')}
                        style={{
                          background: 'var(--accent-primary)',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <RotateCcw size={16} /> Show All Routes
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Route Result Cards List */}
                      {sortedRoutes.map((route) => (
                        <RouteResultCard
                          key={route.id}
                          route={route}
                          isOpen={openRouteIds.has(route.id)}
                          onToggleOpen={() => toggleRouteCardOpen(route.id)}
                          onStationClick={(stId) => setSelectedStationModal(getStationById(stId))}
                          lang={lang}
                        />
                      ))}

                      {/* Entry / Exit Gates Directory */}
                      <StationGates fromStation={fromStation} toStation={toStation} />

                      {/* Route Summary & Dynamic FAQ Accordions */}
                      <RouteFaqs fromStation={fromStation} toStation={toStation} primaryRoute={sortedRoutes[0]} />

                      {/* Manual AdSense / AdMob Unit below Route Results */}
                      <AdSenseUnit slot="7152802483" />
                    </>
                  )}
                </>
              )}

            </div>
          ) : (
            /* HOME DEFAULT VIEW */
            <div className="animate-fade-in">
              {/* Quick Actions Grid */}
              <QuickActions
                lang={lang}
                onOpenMap={() => setIsMapOpen(true)}
                onOpenNearest={() => setActiveModal('nearest')}
                onOpenStations={() => handleNavigate('/stations')}
                onOpenLines={() => setActiveModal('lines')}
                onOpenParking={() => setActiveModal('parking')}
                onOpenTimings={() => setActiveModal('timings')}
              />

              {/* Recent Searches & Popular Routes (Hidden in APK/AAB) */}
              {!Capacitor.isNativePlatform() && (
                <>
                  <RecentSearches
                    searches={recentSearches}
                    onSelectRoute={handleSelectPresetRoute}
                    lang={lang}
                  />

                  <PopularRoutes
                    onSelectRoute={handleSelectPresetRoute}
                    lang={lang}
                  />
                </>
              )}

              {/* How It Works */}
              <HowItWorks />

              {/* Manual AdSense / AdMob Unit above Footer */}
              <AdSenseUnit slot="7690647086" />
            </div>
          )}
        </>
      )}

      {/* Station Detail Modal */}
      {selectedStationModal && activePageView !== 'stationSeo' && (
        <StationDetailModal
          station={selectedStationModal}
          onClose={() => {
            setSelectedStationModal(null);
            setStationSeoSlug(null);
            if (window.location.pathname.startsWith('/station/')) {
              window.history.pushState({}, '', '/');
            }
          }}
          lang={lang}
        />
      )}

      {/* Nearest Metro GPS Modal */}
      {activeModal === 'nearest' && (
        <NearestMetro
          onClose={() => setActiveModal(null)}
          onSelectStation={(st) => {
            setFromStation(st);
            setActiveModal(null);
          }}
        />
      )}

      {/* Station Details Popup Modal */}
      {selectedStationModal && (
        <StationDetailModal
          station={selectedStationModal}
          onClose={() => {
            setSelectedStationModal(null);
            setStationSeoSlug(null);
            if (window.location.pathname.startsWith('/station/')) {
              window.history.pushState({}, '', '/');
            }
            updatePageSeo(null, null, null);
          }}
          lang={lang}
        />
      )}}

      {/* Stations Directory Modal */}
            {activeModal === 'stations' && (
        <StationsDirectory
          onClose={() => setActiveModal(null)}
          onSelectStation={(st) => {
            handleOpenStationPage(st);
            setActiveModal(null);
          }}
        />
      )}

      {/* Lines Directory Modal */}
      {activeModal === 'lines' && (
        <LinesDirectory
          onClose={() => setActiveModal(null)}
          onSelectStation={(st) => handleOpenStationPage(st)}
        />
      )}

      {/* Station First & Last Train Timetables Modal */}
      {activeModal === 'timings' && (
        <StationTimingsModal
          onClose={() => setActiveModal(null)}
          defaultStation={fromStation || STATIONS.find(s => s.id === 'new-delhi')}
        />
      )}

      {/* Station Parking Rates Modal */}
      {activeModal === 'parking' && (
        <ParkingRatesModal
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* Interactive Metro Network Map Modal */}
      {isMapOpen && (
        <MetroMapViewer
          onClose={() => setIsMapOpen(false)}
          activeRoute={routes.length > 0 ? routes[0] : null}
          lang={lang}
        />
      )}

      {/* AdSense Policy Modals */}
      {activeModal === 'about' && <AboutModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'contact' && <ContactModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'privacy' && <PrivacyModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'terms' && <TermsModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'disclaimer' && <DisclaimerModal onClose={() => setActiveModal(null)} />}

      {/* Footer */}
      <Footer
        onInstallPWA={handleInstallPWA}
        deferredPrompt={deferredPrompt}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
