export const STATION_COORDINATES = {
  // Line 1 Blue Line
  'dakshineswar': { lat: 22.6558, lng: 88.3582 },
  'baranagar': { lat: 22.6465, lng: 88.3700 },
  'noapara': { lat: 22.6375, lng: 88.3840 },
  'dum-dum': { lat: 22.6221, lng: 88.3783 },
  'belgachia': { lat: 22.6045, lng: 88.3780 },
  'shyambazar': { lat: 22.6000, lng: 88.3700 },
  'shovabazar-sutanuti': { lat: 22.5950, lng: 88.3630 },
  'girish-park': { lat: 22.5850, lng: 88.3600 },
  'mahatma-gandhi-road': { lat: 22.5800, lng: 88.3580 },
  'central': { lat: 22.5710, lng: 88.3550 },
  'chandni-chowk-kolkata': { lat: 22.5680, lng: 88.3540 },
  'esplanade': { lat: 22.5645, lng: 88.3517 },
  'park-street': { lat: 22.5535, lng: 88.3510 },
  'maidan': { lat: 22.5470, lng: 88.3500 },
  'rabindra-sadan': { lat: 22.5395, lng: 88.3490 },
  'netaji-bhavan': { lat: 22.5330, lng: 88.3475 },
  'jatin-das-park': { lat: 22.5260, lng: 88.3465 },
  'kalighat': { lat: 22.5185, lng: 88.3455 },
  'rabindra-sarobar': { lat: 22.5115, lng: 88.3460 },
  'mahanayak-uttam-kumar': { lat: 22.4965, lng: 88.3475 },
  'netaji': { lat: 22.4850, lng: 88.3510 },
  'masterda-surya-sen': { lat: 22.4760, lng: 88.3550 },
  'gitanjali': { lat: 22.4680, lng: 88.3610 },
  'kavi-nazrul': { lat: 22.4600, lng: 88.3690 },
  'shahid-khudiram': { lat: 22.4500, lng: 88.3800 },
  'kavi-subhash': { lat: 22.4410, lng: 88.3970 },

  // Line 2 Green Line
  'howrah-maidan': { lat: 22.5830, lng: 88.3260 },
  'howrah': { lat: 22.5845, lng: 88.3425 },
  'mahakaran': { lat: 22.5705, lng: 88.3470 },
  'esplanade-line2': { lat: 22.5645, lng: 88.3517 },
  'sealdah': { lat: 22.5670, lng: 88.3715 },
  'phoolbagan': { lat: 22.5720, lng: 88.3920 },
  'salt-lake-stadium': { lat: 22.5735, lng: 88.4020 },
  'bengal-chemical': { lat: 22.5740, lng: 88.4110 },
  'city-centre': { lat: 22.5800, lng: 88.4100 },
  'central-park': { lat: 22.5850, lng: 88.4150 },
  'karunamoyee': { lat: 22.5855, lng: 88.4200 },
  'salt-lake-sector-v': { lat: 22.5820, lng: 88.4340 },

  // Line 3 Purple Line
  'joka': { lat: 22.4460, lng: 88.3070 },
  'thakurpukur': { lat: 22.4600, lng: 88.3110 },
  'sakherbazar': { lat: 22.4740, lng: 88.3150 },
  'behala-chowrasta': { lat: 22.4850, lng: 88.3180 },
  'behala-bazar': { lat: 22.4970, lng: 88.3210 },
  'taratala': { lat: 22.5110, lng: 88.3240 },
  'majerhat': { lat: 22.5250, lng: 88.3270 },

  // Line 6 Orange Line
  'kavi-subhash-line6': { lat: 22.4410, lng: 88.3970 },
  'satyajit-ray': { lat: 22.4550, lng: 88.3980 },
  'jyotirindra-nandy': { lat: 22.4700, lng: 88.3990 },
  'kavi-sukanta': { lat: 22.4850, lng: 88.4000 },
  'hemanta-mukhopadhyay': { lat: 22.5110, lng: 88.4020 }
};

export function getStationCoords(station) {
  if (!station) return { lat: 22.5645, lng: 88.3517 };
  const stId = typeof station === 'string' ? station : station.id;
  return STATION_COORDINATES[stId] || { lat: 22.5645, lng: 88.3517 };
}
