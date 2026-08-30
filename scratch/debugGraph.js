import { findRawCandidateRoutes, buildRouteDetail } from '../src/routing/routeEngine.js';
import { getStationById } from '../src/data/stations.js';

const candidates = findRawCandidateRoutes('howrah-maidan', 'salt-lake-sector-v');
console.log("Raw Candidates count:", candidates.length);

candidates.forEach((cand, i) => {
  console.log(`Candidate ${i}:`, cand);
  try {
    const detail = buildRouteDetail(cand, 'howrah-maidan', 'salt-lake-sector-v');
    console.log(`Detail ${i}:`, detail);
  } catch (err) {
    console.error(`Error in buildRouteDetail ${i}:`, err);
  }
});
