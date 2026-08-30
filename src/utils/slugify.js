import { STATIONS } from "../data/stations.js";

// Map slug to station object
export function getStationBySlug(slug) {
  if (!slug) return null;
  const clean = slug.toLowerCase().trim();
  return STATIONS.find(s => s.id === clean || s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") === clean) || null;
}

// Convert station object to clean URL slug
export function getStationSlug(station) {
  if (!station) return "";
  return station.id || station.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

