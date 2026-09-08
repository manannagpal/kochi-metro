const CITY_ALIASES = {
  "cusat": "cochin-university-cusat",
  "elamakkara": "elamkulam",
  "mg-road": "maharajas-college"
};

function stripInitials(str) {
  return (str || "").replace(/(?<=\b[a-z])-(?=[a-z]\b)/g, "");
}

// Map slug to station object
export function getStationBySlug(slug) {
  if (!slug) return null;
  const clean = slug.toLowerCase().trim().replace(/^\/+|\/+$/g, "");
  if (!clean) return null;

  // 1. Direct match on ID, name slug, or station code
  const directMatch = STATIONS.find(s => {
    const sId = (s.id || "").toLowerCase();
    const sName = (s.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const sCode = (s.code || "").toLowerCase();
    return sId === clean || sName === clean || sCode === clean;
  });
  if (directMatch) return directMatch;

  // 2. City-specific alias lookup
  if (CITY_ALIASES[clean]) {
    const targetId = CITY_ALIASES[clean];
    const aliasMatch = STATIONS.find(s => (s.id || "").toLowerCase() === targetId);
    if (aliasMatch) return aliasMatch;
  }

  // 3. Station internal aliases array
  const internalAlias = STATIONS.find(s => {
    if (!s.aliases || !Array.isArray(s.aliases)) return false;
    const cleanSpaced = clean.replace(/-/g, " ");
    return s.aliases.some(a => {
      const aLower = (a || "").toLowerCase().trim();
      if (aLower === cleanSpaced) return true;
      const aSlug = aLower.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      return aSlug === clean;
    });
  });
  if (internalAlias) return internalAlias;

  // 4. Strip initials match
  const cleanStripped = stripInitials(clean);
  const strippedMatch = STATIONS.find(s => {
    const sName = (s.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return stripInitials(sName) === cleanStripped;
  });
  if (strippedMatch) return strippedMatch;

  // 5. City suffix stripping
  const citySuffixMatch = STATIONS.find(s => {
    const sId = (s.id || "").toLowerCase();
    return sId.replace(/-(kochi|delhi|mumbai|chennai|bengaluru|pune|kolkata|hyderabad|ahmedabad|jaipur|lucknow|kanpur|agra|indore|patna)$/, "") === clean;
  });
  if (citySuffixMatch) return citySuffixMatch;

  // 6. Unambiguous prefix matching (min 4 chars)
  if (clean.length >= 4 && !clean.includes("-")) {
    const prefixMatches = STATIONS.filter(s => {
      const sId = (s.id || "").toLowerCase();
      const sName = (s.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return sId.startsWith(clean + "-") || sName.startsWith(clean + "-");
    });
    if (prefixMatches.length === 1) return prefixMatches[0];
  }

  return null;
}

import { STATIONS } from "../data/stations.js";



// Map slug to station object


// Convert station object to clean URL slug
export function getStationSlug(station) {
  if (!station) return "";
  return station.id || station.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}