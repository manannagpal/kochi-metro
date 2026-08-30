// Official Chennai Metro Network Data (CMRL - Chennai Metro Rail Limited)
export const lines = {
  line1: {
    id: 'line1',
    name: 'Line 1 (Blue Line)',
    color: '#005DAA',
    textColor: '#ffffff',
    icon: '🔵',
    terminals: ['Wimco Nagar Depot', 'Chennai Airport']
  },
  line2: {
    id: 'line2',
    name: 'Line 2 (Green Line)',
    color: '#00A859',
    textColor: '#ffffff',
    icon: '🟢',
    terminals: ['Chennai Central', 'St. Thomas Mount']
  }
};

const rawStations = [
  // --- LINE 1 (BLUE LINE: Wimco Nagar Depot to Chennai Airport) ---
  { id: 'wimco-nagar-depot', name: 'Wimco Nagar Depot', line: 'line1', code: 'WMND' },
  { id: 'wimco-nagar', name: 'Wimco Nagar', line: 'line1', code: 'WMNG' },
  { id: 'tiruvottiyur', name: 'Tiruvottiyur', line: 'line1', code: 'TVTR' },
  { id: 'tiruvottiyur-theradi', name: 'Tiruvottiyur Theradi', line: 'line1', code: 'TVTD' },
  { id: 'kaladipet', name: 'Kaladipet', line: 'line1', code: 'KLDP' },
  { id: 'tollgate', name: 'Tollgate', line: 'line1', code: 'TLGT' },
  { id: 'tondiarpet', name: 'Tondiarpet', line: 'line1', code: 'TNDP' },
  { id: 'sir-theagaraya-college', name: 'Sir Theagaraya College', line: 'line1', code: 'STGC' },
  { id: 'washermanpet', name: 'Washermanpet', line: 'line1', code: 'WSHP' },
  { id: 'mannadi', name: 'Mannadi', line: 'line1', code: 'MNDI' },
  { id: 'high-court', name: 'High Court', line: 'line1', code: 'HGCT' },
  { id: 'chennai-central', name: 'Puratchi Thalaivar Dr. M.G. Ramachandran Central', line: 'line1', isInterchange: true, interchangeLines: ['line1', 'line2'], code: 'MAGC' },
  { id: 'government-estate', name: 'Government Estate', line: 'line1', code: 'GVES' },
  { id: 'lic', name: 'LIC', line: 'line1', code: 'LICS' },
  { id: 'thousand-lights', name: 'Thousand Lights', line: 'line1', code: 'THLT' },
  { id: 'ag-dms', name: 'AG-DMS', line: 'line1', code: 'AGDMS' },
  { id: 'teynampet', name: 'Teynampet', line: 'line1', code: 'TYNP' },
  { id: 'nandanam', name: 'Nandanam', line: 'line1', code: 'NDNM' },
  { id: 'saidapet', name: 'Saidapet', line: 'line1', code: 'SDPT' },
  { id: 'little-mount', name: 'Little Mount', line: 'line1', code: 'LTMN' },
  { id: 'guindy', name: 'Guindy', line: 'line1', code: 'GNDY' },
  { id: 'alandur', name: 'Arignar Anna Alandur', line: 'line1', isInterchange: true, interchangeLines: ['line1', 'line2'], code: 'ALND' },
  { id: 'meenambakkam', name: 'Meenambakkam', line: 'line1', code: 'MNBK' },
  { id: 'chennai-airport', name: 'Chennai International Airport', line: 'line1', code: 'APRT' },

  // --- LINE 2 (GREEN LINE: Chennai Central to St. Thomas Mount) ---
  { id: 'chennai-central-line2', name: 'Puratchi Thalaivar Dr. M.G. Ramachandran Central', line: 'line2', isInterchange: true, interchangeLines: ['line2', 'line1'], code: 'MAGC2' },
  { id: 'egmore', name: 'Egmore', line: 'line2', code: 'EGMR' },
  { id: 'nehru-park', name: 'Nehru Park', line: 'line2', code: 'NHPK' },
  { id: 'kilpauk-medical-college', name: 'Kilpauk Medical College', line: 'line2', code: 'KPMC' },
  { id: 'pachaiyappas-college', name: 'Pachaiyappa\'s College', line: 'line2', code: 'PYPC' },
  { id: 'shenoy-nagar', name: 'Shenoy Nagar', line: 'line2', code: 'SHNG' },
  { id: 'anna-nagar-east', name: 'Anna Nagar East', line: 'line2', code: 'ANNE' },
  { id: 'anna-nagar-tower', name: 'Anna Nagar Tower', line: 'line2', code: 'ANNT' },
  { id: 'thirumangalam', name: 'Thirumangalam', line: 'line2', code: 'TMGL' },
  { id: 'koyambedu', name: 'Koyambedu', line: 'line2', code: 'KYMD' },
  { id: 'cmbt', name: 'CMBT (Puratchi Thalaivar Dr. MGR Bus Terminus)', line: 'line2', code: 'CMBT' },
  { id: 'arumbakkam', name: 'Arumbakkam', line: 'line2', code: 'ARMB' },
  { id: 'vadapalani', name: 'Vadapalani', line: 'line2', code: 'VDPL' },
  { id: 'ashok-nagar', name: 'Ashok Nagar', line: 'line2', code: 'ASKN' },
  { id: 'ekkattuthangal', name: 'Ekkattuthangal', line: 'line2', code: 'EKTL' },
  { id: 'alandur-line2', name: 'Arignar Anna Alandur', line: 'line2', isInterchange: true, interchangeLines: ['line2', 'line1'], code: 'ALND2' },
  { id: 'st-thomas-mount', name: 'St. Thomas Mount', line: 'line2', code: 'STTM' }
];

export const stations = rawStations.map(st => ({
  ...st,
  lines: st.interchangeLines || [st.line]
}));

// Calculate CMRL Chennai Metro Fare based on distance slabs
export function calculateChennaiFare(stationCount) {
  let fare = 50;
  if (stationCount <= 2) fare = 10;
  else if (stationCount <= 5) fare = 20;
  else if (stationCount <= 9) fare = 30;
  else if (stationCount <= 14) fare = 40;

  const smartCardFare = Math.round(fare * 0.8); // 20% discount on CMRL Store Value Cards / QR

  return {
    standardFare: fare,
    smartCardFare,
    tokenFare: fare,
    cardFare: smartCardFare
  };
}
