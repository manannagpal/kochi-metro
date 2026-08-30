import { findRawCandidateRoutes, buildRouteDetail } from '../src/routing/routeEngine.js';
import { getStationById } from '../src/data/stations.js';

const candidates = findRawCandidateRoutes('line1', 'line1');
console.log("Raw Candidates count:", candidates.length);

candidates.forEach((cand, i) => {
  console.log(`Candidate ${i}:`, cand);
  try {
    const detail = buildRouteDetail(cand, 'line1', 'line1');
    console.log(`Detail ${i}:`, detail);
  } catch (err) {
    console.error(`Error in buildRouteDetail ${i}:`, err);
  }
});
