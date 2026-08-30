const THEME_KEY = 'km_theme_pref';
const LANG_KEY = 'km_lang_pref';
const RECENT_KEY = 'km_recent_searches';
const FAV_KEY = 'km_favorite_stations';

export function getThemePref() {
  try {
    return localStorage.getItem(THEME_KEY) || 'light';
  } catch (e) {
    return 'light';
  }
}

export function setThemePref(theme) {
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
