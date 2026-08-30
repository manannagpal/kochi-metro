import { metroGraph } from './graph.js';
import { LINE_SEQUENCES } from '../data/connections.js';
import { METRO_LINES } from '../data/lines.js';
import { calculateFare, calculateAquaFare } from '../data/fareConfig.js';
import { CONSTANTS } from '../data/travelTimes.js';
import { rankAndFilterRoutes } from './routeDiversity.js';

export function getTrainDirection(lineId, fromStationId, toStationId) {
  const sequence = LINE_SEQUENCES[lineId];
  if (!sequence) {
    const lineDef = METRO_LINES[lineId];
    return lineDef ? lineDef.terminals[1] : 'Destination';
  }

  const idxFrom = sequence.indexOf(fromStationId);
  const idxTo = sequence.indexOf(toStationId);

  if (idxFrom !== -1 && idxTo !== -1) {
    const terminalId = idxFrom < idxTo ? sequence[sequence.length - 1] : sequence[0];
    const stationObj = metroGraph.getStation(terminalId);
    return stationObj ? stationObj.name : terminalId;
  }

  const lineDef = METRO_LINES[lineId];
  return lineDef ? lineDef.terminals[1] : 'Destination';
}

export function findRawCandidateRoutes(fromStationId, toStationId, maxTargetRoutes = 12) {
  if (fromStationId === toStationId) return [];

  const fromStation = metroGraph.getStation(fromStationId);
  const toStation = metroGraph.getStation(toStationId);
  if (!fromStation || !toStation) return [];

  const candidatePaths = [];
  const minVisitedCost = new Map();

  const queue = [];

  fromStation.lines.forEach(line => {
    const startNode = `${fromStationId}@${line}`;
    queue.push({
      path: [startNode],
      visitedStations: new Set([fromStationId]),
      cost: 0,
      switches: 0,
      stops: 0,
      distance: 0
    });
    minVisitedCost.set(startNode, 0);
  });

  let iterations = 0;
  const maxIterations = 20000;

  while (queue.length > 0 && candidatePaths.length < maxTargetRoutes && iterations < maxIterations) {
    iterations++;

    queue.sort((a, b) => (a.cost + a.switches * 7) - (b.cost + b.switches * 7));
    const current = queue.shift();

    const lastNode = current.path[current.path.length - 1];
    const [currStationId] = lastNode.split('@');

    if (currStationId === toStationId) {
      candidatePaths.push(current);
      continue;
    }

    const neighbors = metroGraph.adjList.get(lastNode) || [];
    for (const edge of neighbors) {
      const [nextStationId, nextLine] = edge.neighborNode.split('@');
      const newCost = current.cost + edge.weight;
      const prevMin = minVisitedCost.get(edge.neighborNode);

      if (prevMin !== undefined && newCost >= prevMin + 15) {
        continue;
      }

      if (edge.isTransfer) {
        const pathLength = current.path.length;
        if (pathLength >= 2) {
          const prevNode = current.path[pathLength - 2];
          const [, prevLine] = prevNode.split('@');
          if (prevLine === nextLine) continue;
        }

        minVisitedCost.set(edge.neighborNode, Math.min(prevMin ?? Infinity, newCost));
        queue.push({
          path: [...current.path, edge.neighborNode],
          visitedStations: new Set(current.visitedStations),
          cost: newCost,
          switches: current.switches + 1,
          stops: current.stops,
          distance: current.distance
        });
      } else {
        if (!current.visitedStations.has(nextStationId)) {
          minVisitedCost.set(edge.neighborNode, Math.min(prevMin ?? Infinity, newCost));
          const newVisited = new Set(current.visitedStations);
          newVisited.add(nextStationId);

          queue.push({
            path: [...current.path, edge.neighborNode],
            visitedStations: newVisited,
            cost: newCost,
            switches: current.switches,
            stops: current.stops + 1,
            distance: current.distance + edge.distance
          });
        }
      }
    }
  }

  return candidatePaths;
}

export function buildRouteDetail(rawPath, fromStationId, toStationId, overrideDmrcDistance = null) {
  const nodes = rawPath.path;
  const legs = [];
  let currentLeg = null;
  let totalDistance = 0;
  let totalTime = 0;
  let totalStops = 0;
  let switches = 0;

  for (let i = 0; i < nodes.length - 1; i++) {
    const currNode = nodes[i];
    const nextNode = nodes[i + 1];

    const [currStationId, currLine] = currNode.split('@');
    const [nextStationId, nextLine] = nextNode.split('@');

    const edge = (metroGraph.adjList.get(currNode) || []).find(e => e.neighborNode === nextNode);

    if (edge && edge.isTransfer) {
      switches++;
      totalTime += edge.weight;
      if (currentLeg) {
        currentLeg.toStationId = currStationId;
        currentLeg.toStationName = metroGraph.getStation(currStationId).name;
        currentLeg.stopsCount = currentLeg.stations.length - 1;
        currentLeg.direction = getTrainDirection(currentLeg.lineId, currentLeg.fromStationId, currentLeg.toStationId);
        legs.push(currentLeg);
        currentLeg = null;
      }
    } else if (edge) {
      if (!currentLeg) {
        currentLeg = {
          lineId: currLine,
          lineDef: METRO_LINES[currLine],
          fromStationId: currStationId,
          fromStationName: metroGraph.getStation(currStationId).name,
          toStationId: null,
          toStationName: null,
          stations: [metroGraph.getStation(currStationId)],
          distance: 0,
          stopsCount: 0,
          direction: ''
        };
      }
      currentLeg.stations.push(metroGraph.getStation(nextStationId));
      currentLeg.distance += edge.distance;
      totalDistance += edge.distance;
      totalTime += edge.weight + CONSTANTS.STATION_STOP_BUFFER_MINS;
      totalStops++;
    }
  }

  if (currentLeg) {
    const lastNode = nodes[nodes.length - 1];
    const [lastStationId] = lastNode.split('@');
    currentLeg.toStationId = lastStationId;
    currentLeg.toStationName = metroGraph.getStation(lastStationId).name;
    currentLeg.stopsCount = currentLeg.stations.length - 1;
    currentLeg.direction = getTrainDirection(currentLeg.lineId, currentLeg.fromStationId, currentLeg.toStationId);
    legs.push(currentLeg);
  }

  const fareResult = calculateFare(totalStops);
  const finalStandardFare = fareResult.standardFare || fareResult.tokenFare || fareResult;
  const finalSmartCardFare = fareResult.smartCardFare || fareResult.cardFare || fareResult;

  const linesUsed = legs.map(l => l.lineId);

  const interchangeStations = [];
  for (let i = 0; i < legs.length - 1; i++) {
    interchangeStations.push({
      stationId: legs[i].toStationId,
      stationName: legs[i].toStationName,
      fromLine: legs[i].lineId,
      toLine: legs[i + 1].lineId
    });
  }

  return {
    id: `route_${Math.random().toString(36).substring(2, 9)}`,
    fromStationId,
    fromStationName: metroGraph.getStation(fromStationId).name,
    toStationId,
    toStationName: metroGraph.getStation(toStationId).name,
    totalTimeMins: Math.ceil(totalTime + CONSTANTS.AVERAGE_TRAIN_WAIT_MINS),
    totalDistanceKm: Math.round(totalDistance * 10) / 10,
    fare: finalStandardFare,
    smartCardFare: finalSmartCardFare,
    totalStops,
    stops: totalStops,
    switches,
    legs,
    linesUsed,
    interchangeStations,
    badges: []
  };
}

export function calculateRoutes(fromStationIdInput, toStationIdInput) {
  const fromStationId = typeof fromStationIdInput === 'object' ? fromStationIdInput.id : fromStationIdInput;
  const toStationId = typeof toStationIdInput === 'object' ? toStationIdInput.id : toStationIdInput;

  if (!fromStationId || !toStationId || fromStationId === toStationId) {
    return [];
  }

  const rawCandidates = findRawCandidateRoutes(fromStationId, toStationId, 15);
  const detailedRoutes = rawCandidates.map(c => buildRouteDetail(c, fromStationId, toStationId));

  return rankAndFilterRoutes(detailedRoutes);
}
