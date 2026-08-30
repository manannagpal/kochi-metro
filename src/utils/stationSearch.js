import { STATIONS } from '../data/stations.js';
import { METRO_LINES } from '../data/lines.js';

export function searchStations(query) {
  if (!query || typeof query !== 'string') return [];
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results = [];

  STATIONS.forEach(st => {
    let score = 0;
    let matchedAlias = null;

    const nameLower = st.name.toLowerCase();
    const codeLower = (st.code || '').toLowerCase();

    if (nameLower === q) {
      score = 100;
    } else if (codeLower === q) {
      score = 95;
    } else if (nameLower.startsWith(q)) {
      score = 85;
    } else if (nameLower.includes(q)) {
      score = 70;
    }

    if (st.aliases && Array.isArray(st.aliases)) {
      for (const alias of st.aliases) {
        const aliasLower = alias.toLowerCase();
        if (aliasLower === q && score < 95) {
          score = 95;
          matchedAlias = alias;
        } else if (aliasLower.startsWith(q) && score < 80) {
          score = 80;
          matchedAlias = alias;
        } else if (aliasLower.includes(q) && score < 65) {
          score = 65;
          matchedAlias = alias;
        }
      }
    }

    if (score > 0) {
      const stationLines = (st.lines || [st.line]).map(lineId => METRO_LINES[lineId]).filter(Boolean);
      results.push({
        station: st,
        score,
        matchedAlias,
        lines: stationLines,
        systemName: getMetroSystemName()
      });
    }
  });

  results.sort((a, b) => b.score - a.score || a.station.name.localeCompare(b.station.name));

  return results;
}

export function getStationById(id) {
  return STATIONS.find(s => s.id === id);
}

export function getCleanLineName(lineInput) {
  if (!lineInput) return '';
  if (typeof lineInput === 'string') {
    const lineObj = METRO_LINES[lineInput];
    return lineObj ? lineObj.name : lineInput;
  }
  return lineInput.name || lineInput.id || '';
}

export function getMetroSystemName() {
  return 'Kolkata Metro';
}
