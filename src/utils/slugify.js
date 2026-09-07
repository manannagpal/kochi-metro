import { STATIONS } from "../data/stations.js";

function stripInitials(str) {
  return (str || "").replace(/(?<=\b[a-z])-(?=[a-z]\b)/g, "");
}

// Map slug to station object
export function getStationBySlug(slug) {
  if (!slug) return null;
  const clean = slug.toLowerCase().trim();
  const cleanStripped = stripInitials(clean);

  return STATIONS.find(s => {
    const sId = (s.id || "").toLowerCase();
    const sName = (s.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (sId === clean || sName === clean) return true;
    if (stripInitials(sName) === cleanStripped) return true;
    if (sId.replace(/-(kochi|delhi|mumbai|chennai|bengaluru|pune|kolkata|hyderabad|ahmedabad|jaipur|lucknow|kanpur|agra|indore|patna)$/, "") === clean) {
      return true;
    }
    return false;
  }) || null;
}

// Convert station object to clean URL slug
export function getStationSlug(station) {
  if (!station) return "";
  return station.id || station.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

