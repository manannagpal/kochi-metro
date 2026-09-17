// Official Kochi Metro Rail Limited (KMRL) Distance Slabs
export const KOCHI_FARE_SLABS = [
  { maxDistanceKm: 2, fare: 10 },
  { maxDistanceKm: 5, fare: 20 },
  { maxDistanceKm: 10, fare: 30 },
  { maxDistanceKm: 15, fare: 40 },
  { maxDistanceKm: 20, fare: 50 },
  { maxDistanceKm: Infinity, fare: 60 }
];

export function calculateFare(distanceKm) {
  let tokenFare = 60;
  for (const slab of KOCHI_FARE_SLABS) {
    if (distanceKm <= slab.maxDistanceKm) {
      tokenFare = slab.fare;
      break;
    }
  }

  const cardFare = Math.round(tokenFare * 0.8); // 20% Kochi1 Card discount

  return {
    standardFare: tokenFare,
    smartCardFare: cardFare,
    tokenFare,
    cardFare,
    displayFare: tokenFare,
    currency: '₹'
  };
}

export function calculateAquaFare(stopsOrDistance) {
  return calculateFare(stopsOrDistance);
}

