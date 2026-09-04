// Standard Station-Count Based Transit Fare Calculation Engine

export function calculateFare(stationCount) {
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

export function calculateAquaFare(stationCount) {
  return calculateFare(stationCount);
}
