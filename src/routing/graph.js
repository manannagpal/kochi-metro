import { STATIONS } from '../data/stations.js';
import { CONNECTIONS } from '../data/connections.js';
import { INTERCHANGES } from '../data/interchanges.js';
import { INTERCHANGE_PENALTIES } from '../data/travelTimes.js';

export class MetroGraph {
  constructor() {
    this.stationMap = new Map();
    this.adjList = new Map();
    this.buildGraph();
  }

  buildGraph() {
    STATIONS.forEach(st => this.stationMap.set(st.id, st));

    CONNECTIONS.forEach(conn => {
      const fromNode = `${conn.from}@${conn.line}`;
      const toNode = `${conn.to}@${conn.line}`;

      if (!this.adjList.has(fromNode)) this.adjList.set(fromNode, []);
      if (!this.adjList.has(toNode)) this.adjList.set(toNode, []);

      this.adjList.get(fromNode).push({
        neighborNode: toNode,
        fromStationId: conn.from,
        toStationId: conn.to,
        line: conn.line,
        weight: conn.travelTime,
        distance: conn.distance,
        isTransfer: false
      });
    });

    STATIONS.forEach(st => {
      if (st.lines && st.lines.length > 1) {
        const interchangeInfo = INTERCHANGES[st.id];
        const transferType = interchangeInfo ? interchangeInfo.type : 'default';
        const transferPenalty = interchangeInfo
          ? interchangeInfo.transferTime
          : ((INTERCHANGE_PENALTIES && INTERCHANGE_PENALTIES[transferType]) || 3.0);

        for (let i = 0; i < st.lines.length; i++) {
          for (let j = 0; j < st.lines.length; j++) {
            if (i !== j) {
              const lineA = st.lines[i];
              const lineB = st.lines[j];
              const nodeA = `${st.id}@${lineA}`;
              const nodeB = `${st.id}@${lineB}`;

              if (!this.adjList.has(nodeA)) this.adjList.set(nodeA, []);

              this.adjList.get(nodeA).push({
                neighborNode: nodeB,
                fromStationId: st.id,
                toStationId: st.id,
                line: lineB,
                weight: transferPenalty,
                distance: 0,
                isTransfer: true,
                transferType: transferType
              });
            }
          }
        }
      }
    });

    const specialTransfers = [
      { fromNode: 'esplanade@line1', toNode: 'esplanade-line2@line2', fromId: 'esplanade', toId: 'esplanade-line2', line: 'line2', time: 3, dist: 0.1 },
      { fromNode: 'kavi-subhash@line1', toNode: 'kavi-subhash-line6@line6', fromId: 'kavi-subhash', toId: 'kavi-subhash-line6', line: 'line6', time: 3, dist: 0.1 }
    ];

    specialTransfers.forEach(st => {
      if (!this.adjList.has(st.fromNode)) this.adjList.set(st.fromNode, []);
      if (!this.adjList.has(st.toNode)) this.adjList.set(st.toNode, []);

      this.adjList.get(st.fromNode).push({
        neighborNode: st.toNode,
        fromStationId: st.fromId,
        toStationId: st.toId,
        line: st.line,
        weight: st.time,
        distance: st.dist,
        isTransfer: true,
        transferType: 'nearby_station_transfer'
      });

      this.adjList.get(st.toNode).push({
        neighborNode: st.fromNode,
        fromStationId: st.toId,
        toStationId: st.fromId,
        line: st.fromNode.split('@')[1],
        weight: st.time,
        distance: st.dist,
        isTransfer: true,
        transferType: 'nearby_station_transfer'
      });
    });
  }

  getStation(stationId) {
    return this.stationMap.get(stationId);
  }
}

export const metroGraph = new MetroGraph();
