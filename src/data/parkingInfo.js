export const OFFICIAL_PARKING_RATES = {
  KOCHI: {
    operator: 'Kochi Metro Rail (KMRL)',
    notes: 'Official Kochi Metro Rail (KMRL) designated parking available at terminal & major interchange stations.',
    rates: {
      "fourWheeler": {
            "upTo6h": "₹20",
            "upTo12h": "₹40",
            "fullDay": "₹60",
            "monthly": "₹1200"
      },
      "twoWheeler": {
            "upTo6h": "₹10",
            "upTo12h": "₹20",
            "fullDay": "₹30",
            "monthly": "₹600"
      },
      "cycle": {
            "upTo6h": "₹5",
            "upTo12h": "₹10",
            "fullDay": "₹15",
            "monthly": "₹200"
      }
},
    nightParking: 'Overnight parking permitted at select stations with authorized parking slips.'
  }
};
