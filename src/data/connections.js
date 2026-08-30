export const LINE_SEQUENCES = {
  line1: [
    'dakshineswar', 'baranagar', 'noapara', 'dum-dum', 'belgachia',
    'shyambazar', 'shovabazar-sutanuti', 'girish-park', 'mahatma-gandhi-road',
    'central', 'chandni-chowk-kolkata', 'esplanade', 'park-street', 'maidan',
    'rabindra-sadan', 'netaji-bhavan', 'jatin-das-park', 'kalighat',
    'rabindra-sarobar', 'mahanayak-uttam-kumar', 'netaji', 'masterda-surya-sen',
    'gitanjali', 'kavi-nazrul', 'shahid-khudiram', 'kavi-subhash'
  ],
  line2: [
    'howrah-maidan', 'howrah', 'mahakaran', 'esplanade-line2', 'sealdah',
    'phoolbagan', 'salt-lake-stadium', 'bengal-chemical', 'city-centre',
    'central-park', 'karunamoyee', 'salt-lake-sector-v'
  ],
  line3: [
    'joka', 'thakurpukur', 'sakherbazar', 'behala-chowrasta', 'behala-bazar',
    'taratala', 'majerhat'
  ],
  line6: [
    'kavi-subhash-line6', 'satyajit-ray', 'jyotirindra-nandy', 'kavi-sukanta',
    'hemanta-mukhopadhyay'
  ]
};

export const CONNECTIONS = [];

Object.entries(LINE_SEQUENCES).forEach(([lineKey, stationIds]) => {
  for (let i = 0; i < stationIds.length - 1; i++) {
    const from = stationIds[i];
    const to = stationIds[i + 1];
    const travelTime = 2.0; // 2 minutes average stop-to-stop
    const distance = 1.2; // 1.2 km average

    CONNECTIONS.push({ from, to, line: lineKey, travelTime, distance });
    CONNECTIONS.push({ from: to, to: from, line: lineKey, travelTime, distance });
  }
});
