import { STATIONS } from '../data/stations.js';
import { CONNECTIONS } from '../data/connections.js';
import { INTERCHANGES } from '../data/interchanges.js';
import { INTERCHANGE_PENALTIES } from '../data/travelTimes.js';

export class MetroGraph {
  constructor() {
    this.stationMap = new Map();
    this.nameToStationsMap = new Map();
    this.adjList = new Map();
    this.buildGraph();
  }

  buildGraph() {
    STATIONS.forEach(st => {
      this.stationMap.set(st.id, st);
      const normName = st.name.toLowerCase().replace(/\(.*\)/, '').trim();
      if (!this.nameToStationsMap.has(normName)) {
        this.nameToStationsMap.set(normName, []);
      }
      this.nameToStationsMap.get(normName).push(st);
    });

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

    this.nameToStationsMap.forEach((stationList) => {
      if (stationList.length > 1) {
        for (let i = 0; i < stationList.length; i++) {
          for (let j = 0; j < stationList.length; j++) {
            if (i !== j) {
              const stA = stationList[i];
              const stB = stationList[j];
              const linesA = stA.lines || [stA.line];
              const linesB = stB.lines || [stB.line];

              linesA.forEach(lineA => {
                linesB.forEach(lineB => {
                  const nodeA = `${stA.id}@${lineA}`;
                  const nodeB = `${stB.id}@${lineB}`;

                  if (!this.adjList.has(nodeA)) this.adjList.set(nodeA, []);

                  this.adjList.get(nodeA).push({
                    neighborNode: nodeB,
                    fromStationId: stA.id,
                    toStationId: stB.id,
                    line: lineB,
                    weight: 3.0,
                    distance: 0.1,
                    isTransfer: true,
                    transferType: 'interchange'
                  });
                });
              });
            }
          }
        }
      }
    });
  }

  getStation(stationId) {
    return this.stationMap.get(stationId);
  }
}

export const metroGraph = new MetroGraph();
