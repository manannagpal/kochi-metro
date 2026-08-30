// Official Station GPS Coordinates for Kochi Metro
export const STATION_COORDINATES = {
  "line1": {
    "lat": 10.109,
    "lng": 76.351
  },
  "aluva": {
    "lat": 10.1046,
    "lng": 76.3492
  },
  "pulinchodu": {
    "lat": 10.0966,
    "lng": 76.3471
  },
  "companypady": {
    "lat": 10.088,
    "lng": 76.3487
  },
  "ambattukavu": {
    "lat": 10.083,
    "lng": 76.3511
  },
  "muttom": {
    "lat": 10.0791,
    "lng": 76.3499
  },
  "kalamassery": {
    "lat": 10.0717,
    "lng": 76.3474
  },
  "cusat": {
    "lat": 10.0627,
    "lng": 76.3483
  },
  "pathadipalam": {
    "lat": 10.057,
    "lng": 76.351
  },
  "edapally": {
    "lat": 10.0534,
    "lng": 76.3505
  },
  "changampuzha-park": {
    "lat": 10.0467,
    "lng": 76.3479
  },
  "palarivattom": {
    "lat": 10.0376,
    "lng": 76.348
  },
  "jln-stadium": {
    "lat": 10.0312,
    "lng": 76.3508
  },
  "kaloor": {
    "lat": 10.0275,
    "lng": 76.3511
  },
  "lissie": {
    "lat": 10.0216,
    "lng": 76.3485
  },
  "mg-road-kochi": {
    "lat": 10.0126,
    "lng": 76.3479
  },
  "maharajas-college": {
    "lat": 10.0054,
    "lng": 76.3505
  },
  "ernakulam-south": {
    "lat": 10.0016,
    "lng": 76.3515
  },
  "kadavanthra": {
    "lat": 9.9964,
    "lng": 76.3491
  },
  "elamkulam": {
    "lat": 9.9877,
    "lng": 76.3478
  },
  "vyttila": {
    "lat": 9.9798,
    "lng": 76.3501
  },
  "thaikoodam": {
    "lat": 9.9756,
    "lng": 76.3518
  },
  "petta": {
    "lat": 9.9711,
    "lng": 76.3499
  },
  "vadakkekotta": {
    "lat": 9.9628,
    "lng": 76.3479
  },
  "sn-junction": {
    "lat": 9.9544,
    "lng": 76.3497
  },
  "tripunithura": {
    "lat": 9.9496,
    "lng": 76.352
  }
};

export function getStationCoords(station) {
  if (!station) return {"lat":10.109,"lng":76.351};
  const stId = typeof station === 'string' ? station : station.id;
  return STATION_COORDINATES[stId] || {"lat":10.109,"lng":76.351};
}
