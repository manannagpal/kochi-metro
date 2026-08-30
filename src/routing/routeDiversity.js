/**
 * Path Deduplication, Diversity Filter, and Tag Ranking for Delhi Metro Route Finder
 */

/**
 * Checks if two routes are too similar to be listed as separate options.
 */
function areRoutesDuplicateOrTooSimilar(r1, r2) {
  const linesMatch = r1.linesUsed.join(',') === r2.linesUsed.join(',');

  const int1 = r1.interchangeStations.map(i => i.stationId).join(',');
  const int2 = r2.interchangeStations.map(i => i.stationId).join(',');
  const interchangesMatch = int1 === int2;

  if (linesMatch && interchangesMatch) return true;

  if (Math.abs(r1.totalTimeMins - r2.totalTimeMins) <= 2 &&
      r1.switches === r2.switches &&
      int1 === int2) {
    return true;
  }

  return false;
}

export function rankAndFilterRoutes(routes) {
  if (!routes || routes.length === 0) return [];

  // 1. Primary Sort: Fewest Changes (switches) first, then fewer stops, then journey time
  routes.sort((a, b) => {
    if (a.switches !== b.switches) return a.switches - b.switches;
    if (a.totalStops !== b.totalStops) return a.totalStops - b.totalStops;
    return a.totalTimeMins - b.totalTimeMins;
  });

  const minSwitches = routes[0].switches;
  const minTime = Math.min(...routes.map(r => r.totalTimeMins));

  // 2. Filter out duplicates, near-duplicates, and irrational detour routes
  const diverseRoutes = [];
  for (const route of routes) {
    // Prune irrational routes with excessive switches over minSwitches
    if (route.switches > minSwitches + 1) continue;

    // Prune irrational routes taking > 35% extra journey time with extra switches
    if (route.switches > minSwitches && route.totalTimeMins > minTime * 1.35) continue;

    // Prune any route taking > 50% extra time over fastest option
    if (route.totalTimeMins > minTime * 1.50) continue;

    const isDuplicate = diverseRoutes.some(existing => areRoutesDuplicateOrTooSimilar(existing, route));
    if (!isDuplicate) {
      diverseRoutes.push(route);
    }
    if (diverseRoutes.length >= 4) break;
  }

  if (diverseRoutes.length === 0) return routes.slice(0, 3);

  // 3. Identify metric leaders
  let minTimeLeader = Infinity;
  let minStopsLeader = Infinity;
  let minSwitchesLeader = Infinity;

  diverseRoutes.forEach(r => {
    if (r.totalTimeMins < minTimeLeader) minTimeLeader = r.totalTimeMins;
    if (r.totalStops < minStopsLeader) minStopsLeader = r.totalStops;
    if (r.switches < minSwitchesLeader) minSwitchesLeader = r.switches;
  });

  // Assign badges
  diverseRoutes.forEach((route, index) => {
    const badges = [];

    if (route.switches === 0) {
      badges.push({ id: 'direct', label: 'Direct Line', type: 'success' });
    }

    if (index === 0) {
      badges.push({ id: 'fewest_switches', label: 'Fewest Changes', type: 'info' });
    } else if (route.switches === minSwitchesLeader) {
      badges.push({ id: 'fewest_switches', label: 'Fewest Changes', type: 'info' });
    }

    if (route.totalTimeMins === minTimeLeader) {
      badges.push({ id: 'fastest', label: 'Fastest', type: 'warning' });
    }

    if (route.totalStops === minStopsLeader) {
      badges.push({ id: 'fewest_stops', label: 'Fewest Stops', type: 'secondary' });
    }

    // Deduplicate badges
    const badgeMap = new Map();
    badges.forEach(b => badgeMap.set(b.id, b));
    route.badges = Array.from(badgeMap.values());
  });

  return diverseRoutes;
}
