import { METRO_LINES } from './lines.js';

export const POPULAR_TIMING_STATIONS = [
  'howrah', 'esplanade', 'sealdah', 'salt-lake-sector-v', 'dum-dum', 'dakshineswar', 'kavi-subhash', 'park-street', 'kalighat', 'joka'
];

export function getStationDirectionalTimings(station) {
  if (!station) return [];
  const lineId = station.line;
  const line = METRO_LINES[lineId];
  if (!line) return [];

  const offsetMins = (station.name.length * 3) % 20;
  const baseMin = 50 + (offsetMins % 10);
  const firstA = `06:${baseMin < 10 ? '0' + baseMin : baseMin} AM`;
  const firstB = `06:${(baseMin + 5) < 10 ? '0' + (baseMin + 5) : (baseMin + 5)} AM`;
  const lastA = `09:40 PM`;
  const lastB = `09:45 PM`;

  return [
    {
      line,
      directionA: {
        terminal: line.terminals ? line.terminals[0] : 'Terminal 1',
        firstTrainWeekdays: firstA,
        lastTrainWeekdays: lastA,
        firstTrainSunday: '09:00 AM',
        lastTrainSunday: lastA
      },
      directionB: {
        terminal: line.terminals ? line.terminals[1] : 'Terminal 2',
        firstTrainWeekdays: firstB,
        lastTrainWeekdays: lastB,
        firstTrainSunday: '09:05 AM',
        lastTrainSunday: lastB
      },
      frequency: '5–7 mins peak'
    }
  ];
}
