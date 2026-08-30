// Explicit Line Sequences & Edge Connections for Kochi Metro
export const LINE_SEQUENCES = {
  "line1": [
    "aluva",
    "pulinchodu",
    "companypady",
    "ambattukavu",
    "muttom",
    "kalamassery",
    "cusat",
    "pathadipalam",
    "edapally",
    "changampuzha-park",
    "palarivattom",
    "jln-stadium",
    "kaloor",
    "lissie",
    "mg-road-kochi",
    "maharajas-college",
    "ernakulam-south",
    "kadavanthra",
    "elamkulam",
    "vyttila",
    "thaikoodam",
    "petta",
    "vadakkekotta",
    "sn-junction",
    "tripunithura"
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
