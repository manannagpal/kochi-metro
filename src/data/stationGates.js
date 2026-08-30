export const STATION_GATES = {
  'esplanade': [
    { gateNo: 'Gate No. 1', landmark: 'Dorothy Road / Metropolitan Building', divyangFriendly: true },
    { gateNo: 'Gate No. 2', landmark: 'Curzon Park / Bus Stand Entrance', divyangFriendly: true },
    { gateNo: 'Gate No. 3', landmark: 'Line 2 Green Line Underground Transfer Tunnel', divyangFriendly: true },
    { gateNo: 'Gate No. 4', landmark: 'Chowringhee Road / Grand Hotel', divyangFriendly: true }
  ],
  'howrah': [
    { gateNo: 'Gate No. 1', landmark: 'Howrah Railway Station Old Complex Concourse', divyangFriendly: true },
    { gateNo: 'Gate No. 2', landmark: 'Howrah Railway Station New Complex / River Ghat Ferry', divyangFriendly: true },
    { gateNo: 'Gate No. 3', landmark: 'Subway to Howrah Bus Terminus', divyangFriendly: true }
  ],
  'sealdah': [
    { gateNo: 'Gate No. 1', landmark: 'Sealdah Railway Station Main Platform Hall', divyangFriendly: true },
    { gateNo: 'Gate No. 2', landmark: 'Kaiser Street / APC Roy Road Entrance', divyangFriendly: true }
  ],
  'salt-lake-sector-v': [
    { gateNo: 'Gate No. 1', landmark: 'College More / Ring Road Junction', divyangFriendly: true },
    { gateNo: 'Gate No. 2', landmark: 'Nabadiganta IT Park / Wipro More', divyangFriendly: true }
  ],
  'dakshineswar': [
    { gateNo: 'Gate No. 1', landmark: 'Dakshineswar Temple Pathway & Skywalk Connection', divyangFriendly: true },
    { gateNo: 'Gate No. 2', landmark: 'Dakshineswar Eastern Railway Station Link', divyangFriendly: true }
  ],
  'kavi-subhash': [
    { gateNo: 'Gate No. 1', landmark: 'New Garia Eastern Railway Station Exchange', divyangFriendly: true },
    { gateNo: 'Gate No. 2', landmark: 'Line 6 Orange Line Station Exchange', divyangFriendly: true }
  ]
};

export function getStationGates(stationId, stationName) {
  if (STATION_GATES[stationId]) {
    return STATION_GATES[stationId];
  }
  return [
    { gateNo: 'Gate No. 1', landmark: `${stationName || 'Station'} Main Entrance / Entry Pier A`, divyangFriendly: true },
    { gateNo: 'Gate No. 2', landmark: `${stationName || 'Station'} Bus Stand / Service Road Exit Pier B`, divyangFriendly: true }
  ];
}
