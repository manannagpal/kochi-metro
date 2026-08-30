// Official Kochi Metro Network Data (Metro Railway Kolkata)
export const lines = {
  line1: {
    id: 'line1',
    name: 'Line 1 (Blue Line)',
    color: '#005DAA',
    textColor: '#ffffff',
    icon: '🔵',
    terminals: ['Dakshineswar', 'Kavi Subhash']
  },
  line2: {
    id: 'line2',
    name: 'Line 2 (Green Line)',
    color: '#00A859',
    textColor: '#ffffff',
    icon: '🟢',
    terminals: ['Howrah Maidan', 'Salt Lake Sector V']
  },
  line3: {
    id: 'line3',
    name: 'Line 3 (Purple Line)',
    color: '#800080',
    textColor: '#ffffff',
    icon: '🟣',
    terminals: ['Joka', 'Khidirpur']
  },
  line4: {
    id: 'line4',
    name: 'Line 4 (Yellow Line)',
    color: '#FFD100',
    textColor: '#000000',
    icon: '🟡',
    terminals: ['Noapara', 'Jai Hind (Biman Bandar)']
  },
  line6: {
    id: 'line6',
    name: 'Line 6 (Orange Line)',
    color: '#FF6600',
    textColor: '#ffffff',
    icon: '🟠',
    terminals: ['Kavi Subhash', 'Beleghata']
  }
};

const rawStations = [
  // --- LINE 1 (BLUE LINE: Dakshineswar to Kavi Subhash) ---
  { id: 'dakshineswar', name: 'Dakshineswar', line: 'line1', code: 'DAKS' },
  { id: 'baranagar', name: 'Baranagar', line: 'line1', code: 'BARA' },
  { id: 'noapara', name: 'Noapara', line: 'line1', isInterchange: true, interchangeLines: ['line1', 'line4'], code: 'NOAP' },
  { id: 'dum-dum', name: 'Dum Dum', line: 'line1', code: 'DUMD' },
  { id: 'belgachia', name: 'Belgachia', line: 'line1', code: 'BELG' },
  { id: 'shyambazar', name: 'Shyambazar', line: 'line1', code: 'SHYB' },
  { id: 'shovabazar-sutanuti', name: 'Shovabazar Sutanuti', line: 'line1', code: 'SHOV' },
  { id: 'girish-park', name: 'Girish Park', line: 'line1', code: 'GIRP' },
  { id: 'mahatma-gandhi-road', name: 'Mahatma Gandhi Road', line: 'line1', code: 'MGRD' },
  { id: 'central', name: 'Central', line: 'line1', code: 'CENT' },
  { id: 'chandni-chowk-kolkata', name: 'Chandni Chowk', line: 'line1', code: 'CCHK' },
  { id: 'esplanade', name: 'Esplanade', line: 'line1', isInterchange: true, interchangeLines: ['line1', 'line2'], code: 'ESPL' },
  { id: 'park-street', name: 'Park Street', line: 'line1', code: 'PARK' },
  { id: 'maidan', name: 'Maidan', line: 'line1', code: 'MAID' },
  { id: 'rabindra-sadan', name: 'Rabindra Sadan', line: 'line1', code: 'RABS' },
  { id: 'netaji-bhavan', name: 'Netaji Bhavan', line: 'line1', code: 'NETB' },
  { id: 'jatin-das-park', name: 'Jatin Das Park', line: 'line1', code: 'JDPK' },
  { id: 'kalighat', name: 'Kalighat', line: 'line1', code: 'KALI' },
  { id: 'rabindra-sarobar', name: 'Rabindra Sarobar', line: 'line1', code: 'RABR' },
  { id: 'mahanayak-uttam-kumar', name: 'Mahanayak Uttam Kumar (Tollygunge)', line: 'line1', code: 'UTTM' },
  { id: 'netaji', name: 'Netaji (Kudghat)', line: 'line1', code: 'NETJ' },
  { id: 'masterda-surya-sen', name: 'Masterda Surya Sen (Bansdroni)', line: 'line1', code: 'SURY' },
  { id: 'gitanjali', name: 'Gitanjali (Naktala)', line: 'line1', code: 'GITN' },
  { id: 'kavi-nazrul', name: 'Kavi Nazrul (Garia)', line: 'line1', code: 'NAZR' },
  { id: 'shahid-khudiram', name: 'Shahid Khudiram (Briji)', line: 'line1', code: 'KHUD' },
  { id: 'kavi-subhash', name: 'Kavi Subhash (New Garia)', line: 'line1', isInterchange: true, interchangeLines: ['line1', 'line6'], code: 'SUBH' },

  // --- LINE 2 (GREEN LINE: Howrah Maidan to Salt Lake Sector V) ---
  { id: 'line1', name: 'Howrah Maidan', line: 'line2', code: 'HMDN' },
  { id: 'howrah', name: 'Howrah', line: 'line2', code: 'HWRH' },
  { id: 'mahakaran', name: 'Mahakaran', line: 'line2', code: 'MHKR' },
  { id: 'esplanade-line2', name: 'Esplanade', line: 'line2', isInterchange: true, interchangeLines: ['line2', 'line1'], code: 'ESPL2' },
  { id: 'sealdah', name: 'Sealdah', line: 'line2', code: 'SLDH' },
  { id: 'phoolbagan', name: 'Phoolbagan', line: 'line2', code: 'PHLB' },
  { id: 'salt-lake-stadium', name: 'Salt Lake Stadium', line: 'line2', code: 'SLST' },
  { id: 'bengal-chemical', name: 'Bengal Chemical', line: 'line2', code: 'BGCH' },
  { id: 'city-centre', name: 'City Centre', line: 'line2', code: 'CTCN' },
  { id: 'central-park', name: 'Central Park', line: 'line2', code: 'CNPK' },
  { id: 'karunamoyee', name: 'Karunamoyee', line: 'line2', code: 'KRNM' },
  { id: 'line1', name: 'Salt Lake Sector V', line: 'line2', code: 'SLSV' },

  // --- LINE 3 (PURPLE LINE: Joka to Khidirpur) ---
  { id: 'joka', name: 'Joka', line: 'line3', code: 'JOKA' },
  { id: 'thakurpukur', name: 'Thakurpukur', line: 'line3', code: 'THKP' },
  { id: 'sakherbazar', name: 'Sakherbazar', line: 'line3', code: 'SKBZ' },
  { id: 'behala-chowrasta', name: 'Behala Chowrasta', line: 'line3', code: 'BHCR' },
  { id: 'behala-bazar', name: 'Behala Bazar', line: 'line3', code: 'BHBZ' },
  { id: 'taratala', name: 'Taratala', line: 'line3', code: 'TRTL' },
  { id: 'majerhat', name: 'Majerhat', line: 'line3', code: 'MJRH' },
  { id: 'mominpur', name: 'Mominpur', line: 'line3', code: 'MMPR' },
  { id: 'khidirpur', name: 'Khidirpur', line: 'line3', code: 'KDPR' },

  // --- LINE 4 (YELLOW LINE: Noapara to Jai Hind Biman Bandar Airport) ---
  { id: 'dum-dum-cantonment', name: 'Dum Dum Cantonment', line: 'line4', code: 'DDCT' },
  { id: 'jessore-road', name: 'Jessore Road', line: 'line4', code: 'JSRD' },
  { id: 'jai-hind-biman-bandar', name: 'Jai Hind (Biman Bandar / Airport)', line: 'line4', code: 'JHAP' },

  // --- LINE 6 (ORANGE LINE: Kavi Subhash to Beleghata) ---
  { id: 'kavi-subhash-line6', name: 'Kavi Subhash', line: 'line6', isInterchange: true, interchangeLines: ['line6', 'line1'], code: 'SUBH6' },
  { id: 'satyajit-ray', name: 'Satyajit Ray', line: 'line6', code: 'SRAY' },
  { id: 'jyotirindra-nandy', name: 'Jyotirindra Nandy', line: 'line6', code: 'JNND' },
  { id: 'kavi-sukanta', name: 'Kavi Sukanta', line: 'line6', code: 'SKNT' },
  { id: 'hemanta-mukhopadhyay', name: 'Hemanta Mukhopadhyay (Ruby)', line: 'line6', code: 'HMKP' },
  { id: 'vip-bazar', name: 'VIP Bazar (Gurudas Bandyopadhyay)', line: 'line6', code: 'VIPB' },
  { id: 'ritwik-ghatak', name: 'Ritwik Ghatak', line: 'line6', code: 'RTGK' },
  { id: 'barun-sengupta', name: 'Barun Sengupta', line: 'line6', code: 'BNSG' },
  { id: 'beleghata', name: 'Beleghata', line: 'line6', code: 'BLGT' }
];

export const stations = rawStations.map(st => ({
  ...st,
  lines: st.interchangeLines || [st.line]
}));

// Calculate Kochi Metro Fare based on distance/station count slabs
export function calculateKolkataFare(stationCount) {
  let tokenFare = 30;
  if (stationCount <= 2) tokenFare = 5;
  else if (stationCount <= 5) tokenFare = 10;
  else if (stationCount <= 15) tokenFare = 15;
  else if (stationCount <= 20) tokenFare = 20;
  else if (stationCount <= 25) tokenFare = 25;

  const cardFare = Math.round(tokenFare * 0.9);

  return {
    standardFare: tokenFare,
    smartCardFare: cardFare,
    tokenFare,
    cardFare
  };
}
