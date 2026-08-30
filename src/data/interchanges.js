export const INTERCHANGES = {
  'esplanade': {
    stationId: 'esplanade',
    name: 'Esplanade',
    connects: ['line1', 'line2'],
    description: 'Major Central Kolkata interchange connecting Line 1 (North-South Blue Line) and Line 2 (East-West Green Line).'
  },
  'esplanade-line2': {
    stationId: 'esplanade-line2',
    name: 'Esplanade',
    connects: ['line2', 'line1'],
    description: 'Major Central Kolkata interchange connecting Line 2 (East-West Green Line) and Line 1 (North-South Blue Line).'
  },
  'kavi-subhash': {
    stationId: 'kavi-subhash',
    name: 'Kavi Subhash (New Garia)',
    connects: ['line1', 'line6'],
    description: 'Southern terminal interchange connecting Line 1 (Blue Line) and Line 6 (Orange Line / EM Bypass).'
  },
  'kavi-subhash-line6': {
    stationId: 'kavi-subhash-line6',
    name: 'Kavi Subhash',
    connects: ['line6', 'line1'],
    description: 'Southern terminal interchange connecting Line 6 (Orange Line) and Line 1 (Blue Line).'
  }
};
