import { stations } from './kochiMetroData.js';

export const STATIONS = stations;

export function getStationById(id) {
  return STATIONS.find(st => st.id === id);
}

export function searchStations(query) {
  if (!query) return [];
  const q = query.toLowerCase().trim();
  return STATIONS.filter(st => 
    st.name.toLowerCase().includes(q) || 
    (st.code && st.code.toLowerCase().includes(q))
  );
}
