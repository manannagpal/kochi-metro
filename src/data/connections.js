import { STATIONS } from './stations.js';
import { METRO_LINES } from './lines.js';

export const LINE_SEQUENCES = {};

// Dynamically populate ordered station sequences per line
Object.keys(METRO_LINES).forEach(lineId => {
  LINE_SEQUENCES[lineId] = STATIONS
    .filter(st => st.line === lineId || (st.lines && st.lines.includes(lineId)))
    .map(st => st.id);
});

export const CONNECTIONS = [];

Object.entries(LINE_SEQUENCES).forEach(([lineKey, stationIds]) => {
  for (let i = 0; i < stationIds.length - 1; i++) {
    const from = stationIds[i];
    const to = stationIds[i + 1];
    const travelTime = 2.0; // 2 minutes average stop-to-stop
    const distance = 1.2; // 1.2 km average

    CONNECTIONS.push({ from, to, line: lineKey, travelTime, distance });
    CONNECTIONS.push({ from: to, to: from, line: lineKey, travelTime, distance });
  }
});
