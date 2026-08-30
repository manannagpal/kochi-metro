// Official Kochi Metro Network Data (KMRL - Kochi Metro Rail Limited)
export const lines = {
  line1: {
    id: 'line1',
    name: 'Line 1 (Blue Line)',
    color: '#00A859',
    textColor: '#ffffff',
    icon: '🟢',
    terminals: ['Aluva', 'Tripunithura']
  }
};

const rawStations = [
  // --- LINE 1 (BLUE LINE: Aluva to Tripunithura - 25 Stations) ---
  { id: 'aluva', name: 'Aluva', line: 'line1', code: 'ALVA' },
  { id: 'pulinchodu', name: 'Pulinchodu', line: 'line1', code: 'PLCD' },
  { id: 'companypady', name: 'Companypady', line: 'line1', code: 'CMPD' },
  { id: 'ambattukavu', name: 'Ambattukavu', line: 'line1', code: 'AMKV' },
  { id: 'muttom', name: 'Muttom', line: 'line1', code: 'MTTM' },
  { id: 'kalamassery', name: 'Kalamassery', line: 'line1', code: 'KLMS' },
  { id: 'cusat', name: 'Cochin University (CUSAT)', line: 'line1', code: 'CUST' },
  { id: 'pathadipalam', name: 'Pathadipalam', line: 'line1', code: 'PTDP' },
  { id: 'edapally', name: 'Edapally', line: 'line1', code: 'EDPL' },
  { id: 'changampuzha-park', name: 'Changampuzha Park', line: 'line1', code: 'CMPK' },
  { id: 'palarivattom', name: 'Palarivattom', line: 'line1', code: 'PLVT' },
  { id: 'jln-stadium', name: 'JLN Stadium (Jawaharlal Nehru Stadium)', line: 'line1', code: 'JLNS' },
  { id: 'kaloor', name: 'Kaloor', line: 'line1', code: 'KLR' },
  { id: 'lissie', name: 'Lissie', line: 'line1', code: 'LSSI' },
  { id: 'mg-road-kochi', name: 'M.G. Road', line: 'line1', code: 'MGRD' },
  { id: 'maharajas-college', name: 'Maharaja\'s College', line: 'line1', code: 'MHCL' },
  { id: 'ernakulam-south', name: 'Ernakulam South', line: 'line1', code: 'ERS' },
  { id: 'kadavanthra', name: 'Kadavanthra', line: 'line1', code: 'KDVT' },
  { id: 'elamkulam', name: 'Elamkulam', line: 'line1', code: 'ELMK' },
  { id: 'vyttila', name: 'Vyttila', line: 'line1', code: 'VTL' },
  { id: 'thaikoodam', name: 'Thaikoodam', line: 'line1', code: 'TKDM' },
  { id: 'petta', name: 'Petta', line: 'line1', code: 'PTTA' },
  { id: 'vadakkekotta', name: 'Vadakkekotta', line: 'line1', code: 'VDKK' },
  { id: 'sn-junction', name: 'SN Junction', line: 'line1', code: 'SNJN' },
  { id: 'tripunithura', name: 'Tripunithura', line: 'line1', code: 'TRPT' }
];

export const stations = rawStations.map(st => ({
  ...st,
  lines: st.interchangeLines || [st.line]
}));

// Calculate KMRL Kochi Metro Fare based on distance slabs
export function calculateKochiFare(stationCount) {
  let fare = 60;
  if (stationCount <= 2) fare = 10;
  else if (stationCount <= 4) fare = 20;
  else if (stationCount <= 7) fare = 30;
  else if (stationCount <= 10) fare = 40;
  else if (stationCount <= 14) fare = 50;

  const smartCardFare = Math.round(fare * 0.8); // 20% discount on Kochi1 Card

  return {
    standardFare: fare,
    smartCardFare,
    tokenFare: fare,
    cardFare: smartCardFare
  };
}
