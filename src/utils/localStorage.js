const THEME_KEY = 'km_theme_pref';
const LANG_KEY = 'km_lang_pref';
const RECENT_KEY = 'km_recent_searches';
const FAV_KEY = 'km_favorite_stations';

const SHARED_COOKIE_NAME = 'theme_preference';
const SHARED_STORAGE_KEY = 'theme_preference';

function getSharedCookieDomain() {
  if (typeof window === 'undefined') return '';
  const hostname = window.location.hostname.toLowerCase();
  if (hostname.includes('metro.org.in')) {
    return '; domain=.metro.org.in';
  }
  return '';
}

function getThemeFromCookie() {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie.split(';');
  let found = null;
  for (const c of cookies) {
    const trimmed = c.trim();
    if (trimmed.startsWith(SHARED_COOKIE_NAME + '=')) {
      const val = decodeURIComponent(trimmed.substring(SHARED_COOKIE_NAME.length + 1));
      if (val === 'dark' || val === 'light') {
        found = val;
      }
    }
  }
  return found;
}

function setThemeToCookie(theme) {
  if (typeof document === 'undefined') return;
  const isMetroDomain = typeof window !== 'undefined' && window.location.hostname.toLowerCase().includes('metro.org.in');
  
  if (isMetroDomain) {
    // 1. Actively purge any host-only cookie that shadows the shared domain cookie
    document.cookie = `${SHARED_COOKIE_NAME}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    // 2. Set the single authoritative shared cookie on .metro.org.in
    document.cookie = `${SHARED_COOKIE_NAME}=${encodeURIComponent(theme)}; domain=.metro.org.in; path=/; max-age=31536000; SameSite=Lax`;
  } else {
    // Localhost or preview domain
    document.cookie = `${SHARED_COOKIE_NAME}=${encodeURIComponent(theme)}; path=/; max-age=31536000; SameSite=Lax`;
  }
}

export function getThemePref() {
  if (typeof window === 'undefined') return 'light';

  // 1. Check URL query param (e.g., ?theme=dark)
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const urlTheme = urlParams.get('theme');
    if (urlTheme === 'dark' || urlTheme === 'light') {
      setThemePref(urlTheme);
      // Clean query parameter from URL so URL stays clean
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete('theme');
      window.history.replaceState(null, '', cleanUrl.pathname + cleanUrl.search + cleanUrl.hash);
      return urlTheme;
    }
  } catch (e) {}

  // 2. Check shared cookie across *.metro.org.in
  try {
    const cookieTheme = getThemeFromCookie();
    if (cookieTheme === 'dark' || cookieTheme === 'light') {
      // Keep local storage in sync with the shared cookie
      try {
        localStorage.setItem(SHARED_STORAGE_KEY, cookieTheme);
        localStorage.setItem(KEYS.THEME, cookieTheme);
      } catch (e) {}
      return cookieTheme;
    }
  } catch (e) {}

  // 3. Check shared localStorage key
  try {
    const shared = localStorage.getItem(SHARED_STORAGE_KEY);
    if (shared === 'dark' || shared === 'light') {
      return shared;
    }
  } catch (e) {}

  // 4. Check city-specific localStorage key
  try {
    const local = localStorage.getItem(THEME_KEY);
    if (local === 'dark' || local === 'light') {
      return local;
    }
  } catch (e) {}

  // 5. Default based on native app vs web
  const isNative = (
    (typeof window !== 'undefined' && window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) ||
    (typeof window !== 'undefined' && (
      window.location.href.includes('capacitor://') ||
      window.location.protocol === 'capacitor:' ||
      window.location.protocol === 'file:'
    ))
  );
  return isNative ? 'dark' : 'light';
}

export function setThemePref(theme) {
  if (typeof window === 'undefined') return;

  // 1. Sync to shared cookie for *.metro.org.in
  try {
    setThemeToCookie(theme);
  } catch (e) {}

  // 2. Sync to universal localStorage key
  try {
    localStorage.setItem(SHARED_STORAGE_KEY, theme);
  } catch (e) {}

  // 3. Sync to city-specific localStorage key for backward compatibility
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {}
}

export function getLangPref() {
  try {
    return localStorage.getItem(LANG_KEY) || 'en';
  } catch (e) {
    return 'en';
  }
}

export function setLangPref(lang) {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch (e) {}
}

export function getRecentSearches() {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveRecentSearch(fromSt, toSt) {
  if (!fromSt || !toSt) return;
  try {
    const list = getRecentSearches();
    const filtered = list.filter(item => !(item.from.id === fromSt.id && item.to.id === toSt.id));
    filtered.unshift({
      from: { id: fromSt.id, name: fromSt.name },
      to: { id: toSt.id, name: toSt.name },
      timestamp: Date.now()
    });
    localStorage.setItem(RECENT_KEY, JSON.stringify(filtered.slice(0, 5)));
  } catch (e) {}
}
